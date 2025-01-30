import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk'
import { ethers } from 'ethers'
import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { usdcABI } from '@/app/api/blockchain/abis/usdc'

/**
 * Issues a "Job" attestation after taking a USDC payment from the employer.
 *
 * Usage:
 *   yarn hardhat run src/app/[locale]/(authenticated)/jobs/attestation/createJobAttestation.ts --network baseSepolia --tier 3-months --cid QmEncryptedCid
 */

// Base Sepolia EAS / Schema config
const EAS_CONTRACT = '0x4200000000000000000000000000000000000021' // Base Sepolia EAS
const JOB_SCHEMA_UID = process.env.JOB_SCHEMA_UID || ''

// USDC Payment config
const USDC_ADDRESS =
  process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || '0x6Ac3aB54Dc5019A2e57eCcb214337FF5bbD52897'
const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS || '0x1920F5b512634DE346100b025382c04eEA8Bbc67'
const USDC_DECIMALS = 6 // USDC decimals

// Job Tier Pricing
const TIERS = {
  '3-months': { priceUSD: 10, durationDays: 90 },
  '6-months': { priceUSD: 20, durationDays: 180 },
  '1-year': { priceUSD: 30, durationDays: 365 },
} as const

export async function createJobAttestation(
  hre: HardhatRuntimeEnvironment, // Pass Hardhat environment
  jobData: {
    title: string
    description: string
    location: string
    requiredSkills: string
    tierKey: keyof typeof TIERS
  },
  encryptedCid: string
) {
  if (!JOB_SCHEMA_UID) throw new Error('Missing JOB_SCHEMA_UID in .env')

  const { tierKey } = jobData
  const tier = TIERS[tierKey]
  if (!tier)
    throw new Error(`Invalid tier "${tierKey}". Must be one of: 3-months, 6-months, 1-year`)

  // Get Hardhat signers (deployer)
  const [deployer] = await hre.ethers.getSigners()

  // Connect to EAS
  const eas = new EAS(EAS_CONTRACT)
  eas.connect(deployer.provider) // Ensure deployer is connected to a provider

  // Define expiration based on the tier
  const nowSeconds = Math.floor(Date.now() / 1000)
  const expirationTime = BigInt(nowSeconds + tier.durationDays * 24 * 60 * 60)

  // Payment: Charge employer in USDC
  const usdcContract = new ethers.Contract(USDC_ADDRESS, usdcABI, deployer)
  const amountInTokens = ethers.utils.parseUnits(tier.priceUSD.toString(), USDC_DECIMALS)

  console.log(`Charging $${tier.priceUSD} USDC from employer for the ${tierKey} job listing...`)
  const paymentTx = await usdcContract.transfer(ADMIN_ADDRESS, amountInTokens)
  const paymentReceipt = await paymentTx.wait()
  console.log('✅ Payment confirmed. Tx hash:', paymentReceipt.transactionHash)

  // Encode job data
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
    { name: 'jobName', value: jobData.title, type: 'string' },
    { name: 'jobTitle', value: jobData.title, type: 'string' },
    { name: 'startDate', value: nowSeconds, type: 'uint64' },
    { name: 'referencesCheckRequired', value: true, type: 'bool' },
    { name: 'isPartTime', value: false, type: 'bool' },
    { name: 'isOneTime', value: false, type: 'bool' },
    { name: 'jobDuration', value: 'Full-time, indefinite', type: 'string' },
    { name: 'location', value: jobData.location, type: 'string' },
    { name: 'requiredSkills', value: jobData.requiredSkills, type: 'string' },
    { name: 'requiredExperience', value: '2+ years in a commercial kitchen', type: 'string' },
    { name: 'credentials', value: 'ServSafe Certified', type: 'string' },
    { name: 'encryptedPrivateFieldsCid', value: encryptedCid, type: 'string' },
  ])

  // Attest
  console.log(`📜 Creating EAS attestation for job posting...`)
  const employerAddress = await deployer.getAddress()

  const tx = await eas.attest({
    schema: JOB_SCHEMA_UID,
    data: {
      recipient: employerAddress,
      expirationTime: expirationTime,
      revocable: true,
      data: encodedData,
    },
  })

  const receipt = await tx.wait()
  console.log('✅ Job Attestation Created! UID:', receipt.logs[0].data)
  return receipt.logs[0].data
}

async function main(hre: HardhatRuntimeEnvironment) {
  // Parse CLI args
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.log(
      'Usage: yarn hardhat run createJobAttestation.ts --network baseSepolia --tier 3-months --cid QmEncryptedCid'
    )
    process.exit(1)
  }
  const [tierKey, encryptedCid] = args

  // Mock job data (Replace with actual user inputs)
  const jobData = {
    title: 'Sous Chef',
    description: 'Assist head chef in daily operations.',
    location: '123 Culinary Ln, New York, NY',
    requiredSkills: 'Knife skills, pastry knowledge',
    tierKey: tierKey as keyof typeof TIERS,
  }

  // Call function
  const attestationUID = await createJobAttestation(hre, jobData, encryptedCid)
  console.log(`📌 Job Attestation UID: ${attestationUID}`)
}

export default main
