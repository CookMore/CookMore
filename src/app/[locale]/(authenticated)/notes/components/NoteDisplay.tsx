// NoteDisplay.tsx
import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { fetchNfts } from '../services/server/notes.service'

interface Note {
  tokenId: number
  name: string
  description: string
  text: string
  color: string
  fontSize: number
  metadataURI: string
}

const NoteDisplay: React.FC = () => {
  const { user } = usePrivy()
  const account = user?.wallet?.address || ''

  const {
    data: notes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notes', account],
    queryFn: () => fetchNfts(account, 'testnet'),
    enabled: !!account,
  })

  if (isLoading) {
    return <p>Loading notes...</p>
  }

  if (error) {
    return <p>Error loading notes: {error.message}</p>
  }

  return (
    <div className='note-display'>
      <h2>Your Notes</h2>
      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul>
          {notes.map((note: Note) => (
            <li key={note.tokenId} style={{ backgroundColor: note.color, fontFamily: 'Inter' }}>
              <p>{note.text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NoteDisplay
