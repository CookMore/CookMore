// revokeAttestationWithRoleCheck.ts
import { EAS } from '@ethereum-attestation-service/eas-sdk'
import { ethers } from 'ethers'
import 'dotenv/config'
import { hasCookMoreRole } from './checkCookMoreRole'
import { accessABI } from '@/app/api/blockchain/abis' // store your contract ABI in JSON

/**
 * Revokes any attestation if the signer has the correct role (ADMIN or CONTENT_MODERATOR).
 *
 * Usage: npx ts-node revokeAttestationWithRoleCheck.ts <schemaUID> <attestationUID>
 */

const ADMIN_ROLE = ethers.solidityKeccak256(['string'], ['ADMIN_ROLE'])
const CONTENT_MODERATOR_ROLE = ethers.solidityKeccak256(['string'], ['CONTENT_MODERATOR_ROLE'])

const EAS_CONTRACT = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'
const RPC_URL = process.env.RPC_URL || ''
const PRIVATE_KEY = process.env.PRIVATE_KEY || ''
const COOKMORE_ACCESSCONTROL_ADDRESS = '0x771ea79cA72E32E693E38A91091fECD42ef351B8'
const COOKMORE_ACL_ABI = accessABI

async function main() {
  if (!RPC_URL || !PRIVATE_KEY) {
    throw new Error('Missing RPC_URL or PRIVATE_KEY in .env')
  }

  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.log('Usage: npx ts-node revokeAttestationWithRoleCheck.ts <schemaUID> <attestationUID>')
    process.exit(1)
  }
  const [schemaUID, attUID] = args

  const provider = new ethers.JsonRpcProvider(RPC_URL)
  const signer = new ethers.Wallet(PRIVATE_KEY, provider)

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

  console.log('Role check passed. Revoking attestation:', attUID)

  const eas = new EAS(EAS_CONTRACT)
  eas.connect(signer)

  const tx = await eas.revoke({
    schema: schemaUID,
    data: {
      uid: attUID,
    },
  })

  await tx.wait()
  console.log(`Attestation ${attUID} under schema ${schemaUID} revoked.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
