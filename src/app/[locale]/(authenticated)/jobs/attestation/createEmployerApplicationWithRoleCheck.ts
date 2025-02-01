import { EAS, SchemaEncoder, NO_EXPIRATION } from '@ethereum-attestation-service/eas-sdk'
import { ethers, keccak256, AbiCoder } from 'ethers'
import { hasCookMoreRole } from './checkCookMoreRole'
import { accessABI } from '@/app/api/blockchain/abis'

const abiCoder = new AbiCoder()
const ADMIN_ROLE = keccak256(abiCoder.encode(['string'], ['ADMIN_ROLE']))
const CONTENT_MODERATOR_ROLE = keccak256(abiCoder.encode(['string'], ['CONTENT_MODERATOR_ROLE']))

const EAS_CONTRACT = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'
const EMPLOYER_SCHEMA_UID = process.env.NEXT_PUBLIC_EMPLOYER_SCHEMA_UID || ''
const RPC_URL =
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL || ''
const COOKMORE_ACCESSCONTROL_ADDRESS = '0x771ea79cA72E32E693E38A91091fECD42ef351B8'
const COOKMORE_ACL_ABI = accessABI

export async function createEmployerApplicationWithRoleCheck(
  employerWallet: string,
  companyName: string,
  docsCid: string,
  signer: ethers.Signer
) {
  if (!EMPLOYER_SCHEMA_UID) {
    throw new Error('Missing EMPLOYER_SCHEMA_UID in .env')
  }
  if (!RPC_URL) {
    throw new Error('Missing RPC_URL in .env')
  }

  const signerAddress = await signer.getAddress()
  const isAdmin = await hasCookMoreRole(
    COOKMORE_ACCESSCONTROL_ADDRESS,
    COOKMORE_ACL_ABI,
    ADMIN_ROLE,
    signerAddress,
    signer
  )
  const isModerator = await hasCookMoreRole(
    COOKMORE_ACCESSCONTROL_ADDRESS,
    COOKMORE_ACL_ABI,
    CONTENT_MODERATOR_ROLE,
    signerAddress,
    signer
  )

  if (!isAdmin && !isModerator) {
    throw new Error('Signer does NOT have ADMIN_ROLE or CONTENT_MODERATOR_ROLE. Aborting...')
  }

  console.log('Role check passed. Creating Employer attestation...')

  const eas = new EAS(EAS_CONTRACT)
  eas.connect(signer)

  const schemaEncoder = new SchemaEncoder(`
    bool isVerified,
    uint64 verificationDate,
    string companyName,
    string docsCid
  `)

  const now = Math.floor(Date.now() / 1000)
  const encodedData = schemaEncoder.encodeData([
    { name: 'isVerified', value: true, type: 'bool' },
    { name: 'verificationDate', value: now, type: 'uint64' },
    { name: 'companyName', value: companyName, type: 'string' },
    { name: 'docsCid', value: docsCid, type: 'string' },
  ])

  const tx = await eas.attest({
    schema: EMPLOYER_SCHEMA_UID,
    data: {
      recipient: employerWallet,
      expirationTime: NO_EXPIRATION,
      revocable: true,
      data: encodedData,
    },
  })

  const uid = await tx.wait()
  console.log('New Employer Attestation UID:', uid)
  return uid
}

// Ensure the function is properly exported for import in other files
export default createEmployerApplicationWithRoleCheck
