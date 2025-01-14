import { decodeEventLog, Abi } from 'viem'

// Define the event signatures for the recipe contract
export const RECIPE_CREATED_SIGNATURE = '0x...' as const // Replace with actual signature
export const RECIPE_UPDATED_SIGNATURE = '0x...' as const // Replace with actual signature

// Function to decode a specific recipe event
export function decodeRecipeEvent(eventLog: { topics: string[]; data: string }, abi: Abi) {
  try {
    const eventSignature = eventLog.topics[0]

    switch (eventSignature) {
      case RECIPE_CREATED_SIGNATURE:
        return decodeRecipeCreatedEvent(eventLog, abi)
      case RECIPE_UPDATED_SIGNATURE:
        return decodeRecipeUpdatedEvent(eventLog, abi)
      default:
        throw new Error('Unknown event signature')
    }
  } catch (error) {
    console.error('Error decoding recipe event:', error)
    return null
  }
}

// Function to decode the RecipeCreated event
function decodeRecipeCreatedEvent(eventLog: { topics: string[]; data: string }, abi: Abi) {
  const decoded = decodeEventLog({ abi, data: eventLog.data, topics: eventLog.topics })
  return {
    creator: decoded.args.creator,
    recipeId: decoded.args.recipeId,
    metadataCID: decoded.args.metadataCID,
  }
}

// Function to decode the RecipeUpdated event
function decodeRecipeUpdatedEvent(eventLog: { topics: string[]; data: string }, abi: Abi) {
  const decoded = decodeEventLog({ abi, data: eventLog.data, topics: eventLog.topics })
  return {
    recipeId: decoded.args.recipeId,
    metadataCID: decoded.args.metadataCID,
  }
}
