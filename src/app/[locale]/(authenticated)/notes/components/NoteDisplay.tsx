// NoteDisplay.tsx
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { fetchNfts } from '../services/server/notes.service'
import { FaEdit, FaFire, FaArrowRight, FaEraser } from 'react-icons/fa'
import { useNotesContract } from '../hooks/useNotesContract'

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
  const { updateMetadata, burnNote } = useNotesContract()
  const [isBatch, setIsBatch] = useState(false)
  const [popoverMessage, setPopoverMessage] = useState<string | null>(null)

  const {
    data: notes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notes', account],
    queryFn: () => fetchNfts(account, 'testnet'),
    enabled: !!account,
  })

  const handleClear = (tokenId: number) => {
    // Implement clear functionality
    alert('Clear functionality not implemented yet')
  }

  const handleBurn = async (tokenId: number) => {
    setPopoverMessage('Burning note...')
    try {
      await burnNote(tokenId)
      setPopoverMessage('Note burned successfully!')
      refetch() // Refresh the data
    } catch (error) {
      console.error('Error burning note:', error)
      setPopoverMessage('Failed to burn note')
    } finally {
      setTimeout(() => setPopoverMessage(null), 3000) // Hide popover after 3 seconds
    }
  }

  const handleTransfer = (tokenId: number) => {
    // Implement transfer functionality
    alert('Transfer functionality not implemented yet')
  }

  const handleUpdateMetadata = (tokenId: number) => {
    // Implement update metadata functionality
    alert('Update metadata functionality not implemented yet')
  }

  const handleBatchToggle = () => {
    setIsBatch(!isBatch)
  }

  return (
    <div className='note-display'>
      <h2>Your Notes</h2>
      {popoverMessage && <div className='popover'>{popoverMessage}</div>}
      {isLoading ? (
        <p>Loading notes...</p>
      ) : error ? (
        <p>Error loading notes: {error.message}</p>
      ) : notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul className='flex flex-wrap'>
          {notes.map((note: Note) => (
            <li
              key={note.tokenId}
              className='p-2 mb-4 relative bg-github-canvas-inset rounded-lg shadow-lg border border-gray-300'
              style={{
                width: 'calc(33.33% - 16px)',
                margin: '8px',
                fontFamily: 'Inter',
                color: '#333',
                textAlign: 'center',
              }}
            >
              <div
                className='p-4 flex flex-col justify-between items-center bg-white rounded-md shadow-xl relative'
                style={{
                  backgroundColor: note.color,
                  fontFamily: 'Inter',
                  width: '300px',
                  height: '300px',
                  color: '#333',
                  textAlign: 'center',
                  paddingTop: '40px',
                }}
              >
                <h3 className='text-lg font-bold'>{note.name}</h3>
                <p className='text-sm italic'>{note.description}</p>
                <textarea
                  value={note.text}
                  readOnly
                  className='w-full p-2 mb-2 border-none bg-transparent outline-none flex-grow font-sans'
                  style={{ fontSize: note.fontSize + 'px', fontFamily: 'Inter' }}
                />
                <div className='absolute top-10 right-0 flex flex-col space-y-1 ml-2'>
                  <button
                    onClick={() => handleUpdateMetadata(note.tokenId)}
                    className='bg-blue-500 text-white py-1 px-2 rounded-r'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleClear(note.tokenId)}
                    className='bg-yellow-500 text-white py-1 px-2 rounded-r'
                  >
                    <FaEraser />
                  </button>
                  <button
                    onClick={() => handleBurn(note.tokenId)}
                    className='bg-red-500 text-white py-1 px-2 rounded-r'
                  >
                    <FaFire />
                  </button>
                  <button
                    onClick={() => handleTransfer(note.tokenId)}
                    className='bg-teal-500 text-white py-1 px-2 rounded-r'
                  >
                    <FaArrowRight />
                  </button>
                </div>
                <label className='absolute bottom-2 right-2 flex items-center'>
                  <input
                    type='checkbox'
                    checked={isBatch}
                    onChange={handleBatchToggle}
                    className='mr-2'
                  />
                  Batch
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NoteDisplay
