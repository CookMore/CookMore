import { ethers } from 'ethers'
import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk'
import { getDB } from '@/app/api/database/IndexedDB'
import { JOB_TIERS } from '../../constants/tiers.constants'
import { usdcABI } from '@/app/api/blockchain/abis/usdc'
import { useQuery } from '@tanstack/react-query'

// Import custom hooks for signer and provider
import { useSigner } from '@/app/[locale]/(authenticated)/jobs/hooks/useSigner'
import { useProvider } from '@/app/[locale]/(authenticated)/jobs/hooks/useProvider'

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT || ''
const EAS_GRAPHQL = 'https://base-sepolia.easscan.org/graphql'
const EAS_CONTRACT = '0x4200000000000000000000000000000000000021'
const JOB_SCHEMA_UID = process.env.JOB_SCHEMA_UID || ''
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || ''
const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS || ''
const USDC_DECIMALS = 6

// Type for the valid keys of JOB_TIERS
type TierKey = '3-months' | '6-months' | '1-year'

// Define the Job type
export interface Job {
  id: number
  title: string
  description: string
  location: string
  requiredSkills: string
  tierKey: '3-months' | '6-months' | '1-year'
  createdAt: number
  attestationUID?: string
}

/**
 * 🔹 Upload encrypted job data to Pinata (IPFS).
 */
export const uploadToPinata = async (data: any): Promise<string> => {
  console.log('📡 Uploading encrypted data to Pinata...')
  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    if (!result || !result.IpfsHash) throw new Error('Failed to upload to Pinata')
    console.log(`✅ Encrypted data stored on IPFS: ${result.IpfsHash}`)
    return result.IpfsHash
  } catch (err) {
    console.error('❌ IPFS Upload Failed:', err)
    throw err
  }
}

/**
 * 🔹 Fetch jobs from EAS GraphQL API and sync them to IndexedDB.
 */
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    console.log('📡 Fetching jobs from EAS...')
    const response = await fetch(EAS_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query {
            attestations(
              where: { schemaId: "${JOB_SCHEMA_UID}" }
              orderBy: { time: desc }
            ) {
              id
              attester
              recipient
              time
              data
            }
          }
        `,
      }),
    })

    const result = await response.json()
    console.log('🔍 Full API Response:', result) // Log the full response

    if (!result.data) {
      console.warn('⚠️ No data found in API response')
      return [] // Return an empty array if no data is found
    }

    if (!result.data.attestations) {
      console.warn('⚠️ No attestations found in API response')
      return [] // Return an empty array if no attestations are found
    }

    const jobs = result.data.attestations.map((attestation: any) => ({
      id: attestation.id,
      employer: attestation.attester,
      createdAt: attestation.time,
      encryptedCid: attestation.data.encryptedPrivateFieldsCid,
    }))

    console.log(`✅ Synced ${jobs.length} jobs from EAS`)

    // Store in IndexedDB
    const db = await getDB()
    const tx = db.transaction('jobs', 'readwrite')
    const store = tx.objectStore('jobs')
    for (const job of jobs) {
      await store.put(job)
    }

    return jobs
  } catch (err) {
    console.error('❌ Failed to fetch jobs:', err)
    throw err
  }
}

/**
 * 🔹 Creates a job listing (Handles USDC Payment → Encrypts Data → Attests on EAS).
 */
export const createJob = async (jobData: any) => {
  const { signer } = useSigner() // Get signer from custom hook
  const provider = useProvider() // Get provider from custom hook

  if (!signer || !provider) {
    throw new Error('Signer or provider is missing')
  }

  if (!JOB_SCHEMA_UID) throw new Error('Missing JOB_SCHEMA_UID in .env')

  const { title, description, location, requiredSkills, tierKey } = jobData

  // Type assertion to ensure tierKey is a valid TierKey
  const tier = JOB_TIERS[tierKey as TierKey]

  if (!tier) throw new Error(`Invalid tier "${tierKey}". Must be 3-months, 6-months, or 1-year`)

  console.log(`🚀 Creating job: ${title} (${tierKey} - $${tier.priceUSD})`)

  // 1) Charge USDC
  const usdcContract = new ethers.Contract(USDC_ADDRESS, usdcABI, signer)
  const amountInTokens = ethers.parseUnits(tier.priceUSD.toString(), USDC_DECIMALS)

  console.log(`💰 Charging ${tier.priceUSD} USDC from employer...`)
  const paymentTx = await usdcContract.transfer(ADMIN_ADDRESS, amountInTokens)
  await paymentTx.wait()
  console.log(`✅ Payment confirmed.`)

  // 2) Encrypt private job data (Replace this with actual encryption logic)
  const privateData = {
    employerName: 'Confidential Employer',
    compensation: 'Negotiable',
    contactInfo: 'contact@example.com',
  }
  const encryptedCid = await uploadToPinata(privateData)

  // 3) Create EAS attestation
  const eas = new EAS(EAS_CONTRACT)
  eas.connect(provider) // Use the provider here

  const nowSeconds = Math.floor(Date.now() / 1000)
  const expirationTime = BigInt(nowSeconds + tier.durationDays * 24 * 60 * 60)

  const schemaEncoder = new SchemaEncoder(`
    string jobName,
    string jobTitle,
    uint64 startDate,
    bool referencesCheckRequired,
    bool isPartTime,
    bool isOneTime,
    string jobDuration,
    string location,
    string requiredSkills,
    string requiredExperience,
    string credentials,
    string encryptedPrivateFieldsCid
  `)

  const encodedData = schemaEncoder.encodeData([
    { name: 'jobName', value: title, type: 'string' },
    { name: 'jobTitle', value: title, type: 'string' },
    { name: 'startDate', value: nowSeconds, type: 'uint64' },
    { name: 'referencesCheckRequired', value: true, type: 'bool' },
    { name: 'isPartTime', value: false, type: 'bool' },
    { name: 'isOneTime', value: false, type: 'bool' },
    { name: 'jobDuration', value: 'Full-time, indefinite', type: 'string' },
    { name: 'location', value: location, type: 'string' },
    { name: 'requiredSkills', value: requiredSkills, type: 'string' },
    { name: 'requiredExperience', value: '2+ years in a commercial kitchen', type: 'string' },
    { name: 'credentials', value: 'ServSafe Certified', type: 'string' },
    { name: 'encryptedPrivateFieldsCid', value: encryptedCid, type: 'string' },
  ])

  console.log(`📜 Creating EAS attestation for job posting...`)
  const employerAddress = await signer.getAddress() // Get the address of the employer

  const tx = await eas.attest({
    schema: JOB_SCHEMA_UID,
    data: {
      recipient: employerAddress,
      expirationTime: expirationTime,
      revocable: true,
      data: encodedData,
    },
  })

  // Wait for the transaction to be mined (this will return a TransactionReceipt object)
  const txHash = await tx.wait(1)

  // Step 1: Get the transaction hash using tx.wait(1)
  if (typeof txHash === 'string') {
    // Step 2: Manually fetch the transaction receipt using the transaction hash
    const receipt = await provider.getTransactionReceipt(txHash)

    // Step 3: Ensure the receipt has the block number
    if (!receipt || !receipt.blockNumber) {
      throw new Error('Transaction receipt is missing blockNumber')
    }

    console.log('✅ Transaction Receipt:', receipt)

    // Step 4: Fetch logs using the block number from the receipt
    const logs = await provider.getLogs({
      fromBlock: receipt.blockNumber,
      toBlock: receipt.blockNumber,
    })

    // Step 5: Process the logs
    const jobUID = logs && logs[0] ? logs[0].data : 'No logs found'
    console.log(`✅ Job Attestation Created! UID:`, jobUID)

    // Step 6: Store in IndexedDB
    const db = await getDB()
    const txDB = db.transaction('jobs', 'readwrite')
    const store = txDB.objectStore('jobs')
    await store.put({ id: jobUID, title, description, encryptedCid })

    return { id: jobUID, title, description, encryptedCid }
  }
}

/**
 * 🔹 React query hook to fetch jobs.
 */
export const useJobsQuery = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  })
}
