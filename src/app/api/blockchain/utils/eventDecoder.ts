import { decodeEventLog, Abi } from 'viem'
import { ProfileTier, ProfileMetadata } from '@/app/[locale]/(authenticated)/profile/profile'

export const PROFILE_CREATED_SIGNATURE =
  '0x02ed4ee0412e67bbc9ed1687f3ad6bb7134d359d45994f3bf5302e91d81cf61f' as const

export const ANOTHER_EVENT_SIGNATURE =
  '0x236eb7515b00733d8ade7456155d53d63c2fa66bec6437ddff6ab3fc71e1e324' as const

export const PROFILE_DELETED_SIGNATURE = '0x1234567890abcdef...' as const

export function decodeProfileEvent(eventLog: { topics: string[]; data: string }, abi: Abi) {
  try {
    const eventSignature = eventLog.topics[0]

    switch (eventSignature) {
      case PROFILE_CREATED_SIGNATURE:
        return decodeProfileCreatedEvent(eventLog, abi)
      case ANOTHER_EVENT_SIGNATURE:
        return decodeAnotherEvent(eventLog, abi)
      case PROFILE_DELETED_SIGNATURE:
        return decodeProfileDeletedEvent(eventLog, abi)
      default:
        console.warn('Unexpected event signature:', eventSignature)
        return null
    }
  } catch (error) {
    console.error('Error decoding event:', error, {
      topics: eventLog.topics,
      data: eventLog.data,
    })
    return null
  }
}

function decodeProfileCreatedEvent(eventLog: { topics: string[]; data: string }, abi: Abi) {
  try {
    const formattedTopics = [
      PROFILE_CREATED_SIGNATURE,
      ...eventLog.topics.slice(1).map((topic) => (topic.startsWith('0x') ? topic : `0x${topic}`)),
    ] as [`0x${string}`, ...`0x${string}`[]]

    const formattedData = eventLog.data.startsWith('0x') ? eventLog.data : `0x${eventLog.data}`

    if (formattedData.length < 128) {
      console.warn('Data size is too small for non-indexed event parameters:', eventLog)
      return null
    }

    const decodedEvent = decodeEventLog({
      abi,
      data: formattedData as `0x${string}`,
      topics: formattedTopics,
    })

    if (decodedEvent && decodedEvent.args) {
      if (
        typeof decodedEvent.args === 'object' &&
        'wallet' in decodedEvent.args &&
        'profileId' in decodedEvent.args &&
        'metadataURI' in decodedEvent.args
      ) {
        const { wallet, profileId, metadataURI } = decodedEvent.args as {
          wallet: string
          profileId: string
          metadataURI: string
        }

        return {
          wallet: wallet || 'Unknown',
          profileId: profileId || '0',
          metadataURI: metadataURI || '',
        }
      } else {
        console.warn('Decoded event args are missing expected parameters:', decodedEvent.args)
        return null
      }
    } else {
      console.warn('Failed to decode event:', eventLog)
      return null
    }
  } catch (error) {
    console.error('Error decoding event:', error, {
      topics: eventLog.topics,
      data: eventLog.data,
    })
    return null
  }
}

function decodeAnotherEvent(eventLog: { topics: string[]; data: string }, abi: Abi) {
  // Logic for decoding ANOTHER_EVENT_SIGNATURE
}

function decodeProfileDeletedEvent(eventLog: { topics: string[]; data: string }, abi: Abi) {
  try {
    const formattedTopics = [
      PROFILE_DELETED_SIGNATURE,
      ...eventLog.topics.slice(1).map((topic) => (topic.startsWith('0x') ? topic : `0x${topic}`)),
    ] as [`0x${string}`, ...`0x${string}`[]]

    const formattedData = eventLog.data.startsWith('0x') ? eventLog.data : `0x${eventLog.data}`

    if (formattedData.length < 64) {
      console.warn('Data size is too small for non-indexed event parameters:', eventLog)
      return null
    }

    const decodedEvent = decodeEventLog({
      abi,
      data: formattedData as `0x${string}`,
      topics: formattedTopics,
    })

    if (decodedEvent && decodedEvent.args) {
      const [wallet, profileId] = decodedEvent.args as [string, string]

      return {
        wallet: wallet || 'Unknown',
        profileId: profileId || '0',
      }
    } else {
      console.warn('Failed to decode event:', eventLog)
      return null
    }
  } catch (error) {
    console.error('Error decoding event:', error, {
      topics: eventLog.topics,
      data: eventLog.data,
    })
    return null
  }
}
