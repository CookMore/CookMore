import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePrivy } from '@privy-io/react-auth'
import { fetchNfts } from '../services/server/notes.service'
import { FaEdit, FaFire, FaArrowRight, FaEraser, FaTh } from 'react-icons/fa'
import { useNotesContract } from '../hooks/useNotesContract'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'

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
  const { theme } = useTheme()

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
    alert('Clear functionality not implemented yet')
  }

  const handleBurn = async (tokenId: number) => {
    setPopoverMessage('Burning note...')
    try {
      await burnNote(tokenId)
      setPopoverMessage('Note burned successfully!')
      refetch()
    } catch (error) {
      console.error('Error burning note:', error)
      setPopoverMessage('Failed to burn note')
    } finally {
      setTimeout(() => setPopoverMessage(null), 3000)
    }
  }

  const handleTransfer = (tokenId: number) => {
    alert('Transfer functionality not implemented yet')
  }

  const handleUpdateMetadata = (tokenId: number) => {
    alert('Update metadata functionality not implemented yet')
  }

  const handleBatchToggle = () => {
    setIsBatch(!isBatch)
  }

  return (
    <div
      className={`note-display p-6 mb-4 border border-gray-100 rounded-lg shadow-2xl bg-${theme}`}
    >
      <h2
        className={`text-3xl font-bold mb-2 text-center ${theme === 'light' ? 'text-black' : 'text-white'}`}
      >
        Your Notes
      </h2>
      <p className='text-gray-400 text-center mb-4'>View and manage your existing notes.</p>
      <div className='flex justify-center mb-4'>
        <button
          onClick={() => alert('Batch Mint functionality not implemented yet')}
          className='bg-yellow-500 text-white font-bold hover:bg-yellow-600 py-1 px-6 mx-4 rounded shadow-lg transition-transform duration-200 hover:scale-105'
        >
          <FaTh className='inline-block mr-1' /> Batch Mint
        </button>
        <button
          onClick={() => alert('Batch Burn functionality not implemented yet')}
          className='bg-red-500 text-white font-bold hover:bg-red-600 py-1 px-6 mx-4 rounded shadow-lg transition-transform duration-200 hover:scale-105'
        >
          <FaFire className='inline-block mr-1' /> Batch Burn
        </button>
      </div>
      {popoverMessage && <div className='popover'>{popoverMessage}</div>}
      {isLoading ? (
        <p>Loading notes...</p>
      ) : error ? (
        <p>Error loading notes: {error.message}</p>
      ) : notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul className='flex flex-wrap justify-center'>
          {notes.map((note: Note) => (
            <li
              key={note.tokenId}
              className={`py-2 px-5 mb-6 flex-col flex justify-center items-center rounded-lg shadow-xl bg-${theme}`}
              style={{
                width: '400px',
                height: '400px',
                margin: '10px',
                padding: '20px',
                border: '0.5px solid rgba(128, 128, 128, 0.5)',
                transition: 'border-color 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'blue')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(128, 128, 128, 0.5)')}
            >
              <div className='flex justify-center items-center mb-4' style={{ width: '100%' }}>
                <input
                  type='text'
                  value={note.name}
                  readOnly
                  placeholder='Name'
                  className='bg-gray-100 text-gray-700 rounded font-sans p-1 text-sm w-1/2 text-center border border-gray-300 hover:border-gray-500 shadow-inner'
                  style={{ margin: '4px', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }}
                />
                <input
                  type='text'
                  value={note.description}
                  readOnly
                  placeholder='Description'
                  className='bg-gray-100 text-gray-700 rounded font-sans p-1 text-sm w-1/2 text-center border border-gray-300 hover:border-gray-500 shadow-inner'
                  style={{ margin: '4px', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)' }}
                />
              </div>
              <div
                className='p-6 flex flex-col justify-center items-center rounded-md shadow-lg relative'
                style={{
                  backgroundColor: note.color,
                  fontFamily: 'Inter',
                  width: '300px',
                  height: '300px',
                  color: '#333',
                  textAlign: 'center',
                  paddingTop: '15px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                }}
              >
                <textarea
                  value={note.text}
                  readOnly
                  className='w-full p-2 mb-2 border-none bg-transparent outline-none flex-grow font-sans'
                  style={{ fontSize: note.fontSize + 'px', fontFamily: 'Inter' }}
                />
                <div
                  className='absolute top-10 right-0 flex flex-col space-y-1 ml-1'
                  style={{ right: '-25px' }}
                >
                  <button
                    onClick={() => handleUpdateMetadata(note.tokenId)}
                    className='bg-blue-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105'
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleClear(note.tokenId)}
                    className='bg-yellow-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105'
                  >
                    <FaEraser />
                  </button>
                  <button
                    onClick={() => handleBurn(note.tokenId)}
                    className='bg-red-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105'
                  >
                    <FaFire />
                  </button>
                  <button
                    onClick={() => handleTransfer(note.tokenId)}
                    className='bg-teal-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105'
                  >
                    <FaArrowRight />
                  </button>
                  <button
                    onClick={handleBatchToggle}
                    className={`bg-gray-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105 ${isBatch ? 'bg-purple-700' : ''}`}
                  >
                    <FaTh />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NoteDisplay
