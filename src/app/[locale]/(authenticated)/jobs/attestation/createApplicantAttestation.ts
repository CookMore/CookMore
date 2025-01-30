// createApplicantAttestation.ts
import { EAS, SchemaEncoder, NO_EXPIRATION } from '@ethereum-attestation-service/eas-sdk'
import { ethers } from 'ethers'
import 'dotenv/config'

/**
 * Creates an "Applicant" attestation after verifying the user off-chain.
 * Usage: npx ts-node createApplicantAttestation.ts <applicantWallet> <applicantName> <resumeCid?>
 */

const EAS_CONTRACT = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e' // e.g. Sepolia
const APPLICANT_SCHEMA_UID = process.env.APPLICANT_SCHEMA_UID || ''
const RPC_URL = process.env.RPC_URL || ''
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''

async function main() {
  if (!APPLICANT_SCHEMA_UID) {
    throw new Error('Missing APPLICANT_SCHEMA_UID in .env')
  }
  if (!RPC_URL || !PRIVATE_KEY) {
    throw new Error('Missing RPC_URL or PRIVATE_KEY')
  }

  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.log(
      'Usage: npx ts-node createApplicantAttestation.ts <applicantWallet> <applicantName> [resumeCid]'
    )
    process.exit(1)
  }
  const [applicantWallet, applicantName, resumeCidArg] = args
  const resumeCid = resumeCidArg || ''

  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const signer = new ethers.Wallet(PRIVATE_KEY, provider)

  const eas = new EAS(EAS_CONTRACT)
  eas.connect(signer)

  const schemaEncoder = new SchemaEncoder(`
    bool isVerified,
    uint64 verificationDate,
    string applicantName,
    string resumeCid
  `)

  const now = Math.floor(Date.now() / 1000)
  const encodedData = schemaEncoder.encodeData([
    { name: 'isVerified', value: true, type: 'bool' },
    { name: 'verificationDate', value: now, type: 'uint64' },
    { name: 'applicantName', value: applicantName, type: 'string' },
    { name: 'resumeCid', value: resumeCid, type: 'string' },
  ])

  const tx = await eas.attest({
    schema: APPLICANT_SCHEMA_UID,
    data: {
      recipient: applicantWallet,
      expirationTime: NO_EXPIRATION,
      revocable: true,
      data: encodedData,
    },
  })

  const uid = await tx.wait()
  console.log('New Applicant Attestation UID:', uid)
  console.log(`Attested that ${applicantWallet} is verified applicant: ${applicantName}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
