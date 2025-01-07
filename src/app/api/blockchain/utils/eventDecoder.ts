import { decodeEventLog, Abi } from 'viem'
import type { ProfileMetadata, ProfileTier } from '@/app/[locale]/(authenticated)/profile/profile'

// Example function to decode an event
export const PROFILE_CREATED_SIGNATURE =
  '0x02ed4ee0412e67bbc9ed1687f3ad6bb7134d359d45994f3bf5302e91d81cf61f' as const

export function decodeProfileEvent(eventLog: { topics: string[]; data: string }, abi: Abi) {
  try {
    // Ensure topics are in the correct format
    const formattedTopics = [
      PROFILE_CREATED_SIGNATURE, // Hardcoded event signature
      ...eventLog.topics.slice(1).map((topic) => {
        return topic.startsWith('0x') ? topic : `0x${topic}`
      }),
    ] as [`0x${string}`, ...`0x${string}`[]]

    // Ensure data is in the correct format
    const formattedData = eventLog.data.startsWith('0x') ? eventLog.data : `0x${eventLog.data}`

    console.log('Formatted Topics:', formattedTopics)
    console.log('Formatted Data:', formattedData)

    const decodedEvent = decodeEventLog({
      abi,
      data: formattedData as `0x${string}`,
      topics: formattedTopics,
    })

    console.log('Decoded Event:', decodedEvent)
    return decodedEvent
  } catch (error) {
    console.error('Error decoding event:', error, {
      topics: eventLog.topics,
      data: eventLog.data,
    })
    return null
  }
}

export function handleCreateProfileEvent(eventLog: { topics: string[]; data: string }, abi: Abi) {
  try {
    // Ensure topics are in the correct format
    const formattedTopics = [
      PROFILE_CREATED_SIGNATURE, // Use the createProfile event signature
      ...eventLog.topics.slice(1).map((topic) => {
        return topic.startsWith('0x') ? topic : `0x${topic}`
      }),
    ] as [`0x${string}`, ...`0x${string}`[]]

    // Ensure data is in the correct format
    const formattedData = eventLog.data.startsWith('0x') ? eventLog.data : `0x${eventLog.data}`

    console.log('Formatted Topics for CreateProfile:', formattedTopics)
    console.log('Formatted Data for CreateProfile:', formattedData)

    const decodedEvent = decodeEventLog({
      abi,
      data: formattedData as `0x${string}`,
      topics: formattedTopics,
    })

    console.log('Decoded CreateProfile Event:', decodedEvent)
    return decodedEvent
  } catch (error) {
    console.error('Error decoding CreateProfile event:', error, {
      topics: eventLog.topics,
      data: eventLog.data,
    })
    return null
  }
}

// Correct event signature for createProfile
export const CREATE_PROFILE_SIGNATURE =
  '0x02ed4ee0412e67bbc9ed1687f3ad6bb7134d359d45994f3bf5302e91d81cf61f' as const

interface OnChainMetadata {
  [x: string]: any
  name: string
  bio: string
  avatar: string // IPFS hash
  ipfsNotesCID: string // IPFS hash for extended data
}

export function decodeCreateProfileEvent(
  eventLog: { topics: string[]; data: string },
  abi: Abi
): ProfileMetadata | null {
  try {
    // Ensure topics are in the correct format
    const formattedTopics = [
      PROFILE_CREATED_SIGNATURE, // Use the correct event signature
      ...eventLog.topics.slice(1).map((topic) => {
        return topic.startsWith('0x') ? topic : `0x${topic}`
      }),
    ] as [`0x${string}`, ...`0x${string}`[]]

    // Ensure data is in the correct format
    const formattedData = eventLog.data.startsWith('0x') ? eventLog.data : `0x${eventLog.data}`

    const decodedEvent = decodeEventLog({
      abi,
      data: formattedData as `0x${string}`,
      topics: formattedTopics,
    })

    if (decodedEvent && decodedEvent.args) {
      const [wallet, profileId, metadataURI] = decodedEvent.args as [string, string, string]
      console.log('Wallet:', wallet)
      console.log('Profile ID:', profileId)
      console.log('Metadata URI:', metadataURI)

      // Use the parseMetadataURI function
      const metadata = parseMetadataURI(metadataURI) || {}
      console.log('Decoded OnChainMetadata:', metadata)

      // Ensure all required properties are present
      return {
        profileId: profileId,
        version: '1.0', // Default version
        tier: ProfileTier.FREE, // Default tier
        name: metadata.name || 'Unknown',
        bio: metadata.bio || '',
        description: 'User profile',
        avatar: metadata.avatar || '',
        image: '',
        banner: '',
        location: '',
        social: {
          urls: [],
          labels: [],
        },
        preferences: {
          theme: 'light',
          notifications: true,
          displayEmail: true,
          displayLocation: true,
        },
        attributes: {
          version: '1.0',
          tier: ProfileTier.FREE,
          timestamp: Date.now(),
          ipfsNotesCID: metadata.ipfsNotesCID || '',
        },
        baseName: 'Default Base Name',
        organizationInfo: {
          type: 'other',
          establishedYear: '2023',
          size: 'small',
          team: [],
        },
        compliance: {
          certifications: [],
          licenses: [],
        },
        businessOperations: {
          operatingHours: [],
          serviceTypes: [],
          capacity: {},
          specializations: [],
        },
        experience: {
          current: {
            title: '',
            company: '',
            startDate: '',
          },
          history: [],
        },
        culinaryInfo: {
          expertise: 'beginner',
          specialties: [],
          dietaryPreferences: [],
          cuisineTypes: [],
          techniques: [],
          equipment: [],
        },
        achievements: {
          recipesCreated: 0,
          recipesForked: 0,
          totalLikes: 0,
          badges: [],
        },
      } as ProfileMetadata
    } else {
      console.warn('Failed to decode event:', eventLog)
      return null
    }
  } catch (error) {
    console.error('Error decoding createProfile event:', error, {
      topics: eventLog.topics,
      data: eventLog.data,
    })
    return null
  }
}

// Function to parse metadataURI
function parseMetadataURI(metadataURI: string): OnChainMetadata | null {
  try {
    // Example parsing logic, assuming metadataURI is a JSON string stored on IPFS
    const metadata = JSON.parse(atob(metadataURI.split('ipfs://')[1]))
    console.log('Parsed Metadata:', metadata)
    return {
      name: metadata.name,
      bio: metadata.bio,
      avatar: metadata.avatar,
      ipfsNotesCID: metadata.ipfsNotesCID,
    }
  } catch (error) {
    console.error('Error parsing metadataURI:', error)
    return null
  }
}
