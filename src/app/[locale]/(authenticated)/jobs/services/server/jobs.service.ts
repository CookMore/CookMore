import { ethers } from 'ethers'
import { getDB } from '@/app/api/database/IndexedDB'
import { JOB_TIERS } from '../../constants/tiers.constants'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

const EAS_GRAPHQL = 'https://base-sepolia.easscan.org/graphql'
const JOB_SCHEMA_UID = process.env.NEXT_PUBLIC_JOB_SCHEMA_UID || ''

export interface Job {
  id: number
  jobName: string
  jobTitle: string
  startDate: number
  referencesCheckRequired: boolean
  isPartTime: boolean
  isOneTime: boolean
  jobDuration: string
  location: string
  requiredSkills: string[]
  requiredExperience: string[]
  credentials: string[]
  encryptedPrivateFieldsCID: string
  attestationUID?: string
}

/**
 * 🔹 Fetch jobs from EAS GraphQL API and sync them to IndexedDB.
 */
export const fetchJobs = async (): Promise<Job[]> => {
  try {
    console.log('📡 Fetching jobs from:', EAS_GRAPHQL)

    const query = `
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
    `

    console.log('📡 GraphQL Query:', query)

    const response = await fetch(EAS_GRAPHQL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })

    console.log('📡 Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Error response:', errorText)
      throw new Error(`Failed to fetch jobs: ${response.statusText}`)
    }

    const result = await response.json()
    console.log('🔍 Jobs response:', JSON.stringify(result, null, 2))

    if (!result.data || !result.data.attestations) {
      console.warn('⚠️ No attestations found')
      return []
    }

    return result.data.attestations.map((attestation: any) => ({
      id: attestation.id,
      employer: attestation.attester,
      createdAt: attestation.time,
      encryptedCid: attestation.data?.encryptedPrivateFieldsCid || '',
    }))
  } catch (err: any) {
    console.error('❌ Failed to fetch jobs:', err)
    return []
  }
}

/**
 * 🔹 React Query Hook to fetch jobs.
 */
export const useJobsQuery = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  })
}
