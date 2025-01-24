import { ethers } from 'ethers'
import { stickyABI } from '@/app/api/blockchain/abis'
import { TESTNET_ADDRESSES } from '@/app/api/blockchain/utils/addresses'

// Simple in-memory cache with expiry
const cache = new Map<string, { data: any; expiry: number }>()

// Function to cache notes with expiry
export async function cacheNotes(notes: any[], ttl: number = 60000) {
  // ttl in milliseconds
  const expiry = Date.now() + ttl
  notes.forEach((note) => {
    cache.set(note.tokenId, { data: note, expiry })
  })
  console.log('Notes cached:', notes)
}

// Function to handle real-time updates using WebSockets
export function setupRealTimeUpdates() {
  const ws = new WebSocket('wss://your-websocket-url')
  ws.onmessage = (event) => {
    const updatedNote = JSON.parse(event.data)
    cache.set(updatedNote.tokenId, { data: updatedNote, expiry: Date.now() + 60000 })
    console.log('Real-time update received:', updatedNote)
  }
  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
  ws.onclose = () => {
    console.log('WebSocket closed, attempting to reconnect...')
    setTimeout(setupRealTimeUpdates, 5000) // Reconnect after 5 seconds
  }
  console.log('Real-time updates setup complete')
}

// Function to act as an API gateway
export async function handleRequest(request: Request) {
  const url = new URL(request.url)
  const method = request.method

  if (method === 'GET' && url.pathname === '/notes') {
    const notes = Array.from(cache.values())
      .filter((entry) => entry.expiry > Date.now())
      .map((entry) => entry.data)
    console.log('Handling request, returning cached notes:', notes)
    return notes
  }

  // Add more request handling logic as needed
  console.error('Unhandled request:', request)
  return []
}

export const fetchNotesFromEdge = () => {
  console.log('Fetching notes from edge...')
  return Array.from(cache.values())
    .filter((entry) => entry.expiry > Date.now())
    .map((entry) => entry.data)
}
