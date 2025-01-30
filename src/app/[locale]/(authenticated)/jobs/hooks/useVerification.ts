import { useState, useEffect } from 'react'

const EAS_INDEXER_URL = 'https://base-sepolia.easscan.org/graphql' // Base Sepolia GraphQL API

interface VerificationResult {
  isVerified: boolean
  isLoading: boolean
  error: string | null
}

/**
 * Hook to check if a user has a valid attestation on Base Sepolia.
 *
 * @param {string} address - User's wallet address
 * @param {string} schemaUID - Schema UID to check against
 * @returns {VerificationResult} Verification state (isVerified, isLoading, error)
 */
export function useVerification(address: string, schemaUID: string): VerificationResult {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!address || !schemaUID) {
      setIsLoading(false)
      setError('Invalid address or schema UID')
      return
    }

    const checkAttestation = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // GraphQL query to find attestations for this user
        const response = await fetch(EAS_INDEXER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: `
              query {
                attestations(where: { recipient: "${address}", schemaId: "${schemaUID}" }) {
                  id
                }
              }
            `,
          }),
        })

        const data = await response.json()

        if (data.errors) {
          throw new Error('Failed to fetch attestations')
        }

        // If attestations exist, user is verified
        setIsVerified(data.data.attestations.length > 0)
      } catch (err: any) {
        console.error('Error fetching attestation:', err)
        setError(err.message || 'Failed to verify attestation.')
      } finally {
        setIsLoading(false)
      }
    }

    checkAttestation()
  }, [address, schemaUID])

  return { isVerified, isLoading, error }
}
