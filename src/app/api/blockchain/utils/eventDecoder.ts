import { decodeEventLog, Abi } from 'viem'

// Example function to decode an event
export function decodeProfileEvent(eventLog: { topics: string[]; data: string }, abi: Abi) {
  try {
    // Ensure topics are in the correct format
    const formattedTopics = eventLog.topics.map((topic) => {
      if (!topic.startsWith('0x')) {
        return `0x${topic}`
      }
      return topic
    }) as [`0x${string}`, ...`0x${string}`[]]

    // Ensure data is in the correct format
    const formattedData = eventLog.data.startsWith('0x') ? eventLog.data : `0x${eventLog.data}`

    const decodedEvent = decodeEventLog({
      abi,
      data: formattedData,
      topics: formattedTopics,
    })
    return decodedEvent
  } catch (error) {
    console.error('Error decoding event:', error, {
      topics: eventLog.topics,
      data: eventLog.data,
    })
    return null
  }
}
