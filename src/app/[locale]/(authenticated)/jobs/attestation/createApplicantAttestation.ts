'use client'

import { EAS, SchemaEncoder, NO_EXPIRATION } from '@ethereum-attestation-service/eas-sdk'
import { ethers } from 'ethers'

const EAS_CONTRACT = '0xC2679fBD37d54388Ce493F1DB75320D236e1815e'
const APPLICANT_SCHEMA_UID = process.env.NEXT_PUBLIC_APPLICANT_SCHEMA_UID || ''
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || ''

if (!APPLICANT_SCHEMA_UID) {
  console.error('❌ Missing APPLICANT_SCHEMA_UID in environment variables')
}
if (!RPC_URL) {
  console.error('❌ Missing RPC_URL in environment variables')
}

/**
 * Creates an "Applicant" attestation after verifying the user off-chain.
 * @param {string} applicantWallet - Wallet address of the applicant.
 * @param {string} applicantName - Name of the applicant.
 * @param {string} resumeCid - Resume CID (optional).
 * @param {ethers.Signer} signer - Ethereum signer.
 * @returns {Promise<string>} - The attestation UID.
 */
export async function createApplicantAttestation(
  applicantWallet: string,
  applicantName: string,
  resumeCid: string = '',
  signer: ethers.Signer
): Promise<string> {
  if (!APPLICANT_SCHEMA_UID) {
    throw new Error('❌ Missing APPLICANT_SCHEMA_UID in .env')
  }

  console.log(`🚀 Creating applicant attestation for ${applicantWallet}...`)

  try {
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
    console.log(`✅ New Applicant Attestation UID: ${uid}`)
    return uid
  } catch (error) {
    console.error('❌ Error creating attestation:', error)
    throw new Error(`Failed to create attestation: ${error.message}`)
  }
}
