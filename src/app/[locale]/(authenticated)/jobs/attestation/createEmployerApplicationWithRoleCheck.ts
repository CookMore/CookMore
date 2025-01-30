// createEmployerApplicationWithRoleCheck.ts
import { EAS, SchemaEncoder, NO_EXPIRATION } from '@ethereum-attestation-service/eas-sdk'
import { keccak256, AbiCoder } from 'ethers'
import 'dotenv/config'
import { hasCookMoreRole } from './checkCookMoreRole'
import { accessABI } from '@/app/api/blockchain/abis'

/**
 * Admin/Moderator script to create an Employer attestation.
 *
 * Usage:
 *  npx ts-node createEmployerApplicationWithRoleCheck.ts <employerWallet> <companyName> [docsCid]
 */

// Example roles: hashed from "ADMIN_ROLE" or "CONTENT_MODERATOR_ROLE"
const abiCoder = new AbiCoder()
const ADMIN_ROLE = keccak256(abiCoder.encode(['string'], ['ADMIN_ROLE']))
const CONTENT_MODERATOR_ROLE = keccak256(abiCoder.encode(['string'], ['CONTENT_MODERATOR_ROLE']))

const EAS_CONTRACT = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'
const EMPLOYER_SCHEMA_UID = process.env.EMPLOYER_SCHEMA_UID || ''
const RPC_URL = process.env.RPC_URL || ''
const COOKMORE_ACCESSCONTROL_ADDRESS = '0x771ea79cA72E32E693E38A91091fECD42ef351B8' // your deployed contract
const COOKMORE_ACL_ABI = accessABI

async function main() {
  if (!EMPLOYER_SCHEMA_UID) {
    throw new Error('Missing EMPLOYER_SCHEMA_UID in .env')
  }
  if (!RPC_URL) {
    throw new Error('Missing RPC_URL in .env')
  }

  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.log(
      'Usage: npx ts-node createEmployerApplicationWithRoleCheck.ts <employerWallet> <companyName> [docsCid]'
    )
    process.exit(1)
  }
  const [employerWallet, companyName, docsCidArg] = args
  const docsCid = docsCidArg || ''

  // Connect
  const provider = new ethers.JsonRpcProvider(RPC_URL)
  // Assuming you have a different way to get the signer, e.g., from a connected wallet
  const signer = provider.getSigner()

  // Check role
  const signerAddress = await signer.getAddress()
  const isAdmin = await hasCookMoreRole(
    COOKMORE_ACCESSCONTROL_ADDRESS,
    COOKMORE_ACL_ABI,
    ADMIN_ROLE,
    signerAddress,
    provider
  )
  const isModerator = await hasCookMoreRole(
    COOKMORE_ACCESSCONTROL_ADDRESS,
    COOKMORE_ACL_ABI,
    CONTENT_MODERATOR_ROLE,
    signerAddress,
    provider
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

  // Attest
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
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
