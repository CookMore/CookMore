import React, { useState, useContext } from 'react'
import {
  FaFont,
  FaPlus,
  FaEdit,
  FaTrash,
  FaFire,
  FaArrowRight,
  FaEraser,
  FaTh,
} from 'react-icons/fa'
import { useNotesContract } from '../hooks/useNotesContract'
import { NotesContext } from '../context/NotesContext'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'

interface Note {
  tokenId?: number
  name: string
  description: string
  text: string
  color: string
  fontSize: number
  metadataURI: string
  isDraft?: boolean
}

const defaultNote: Note = {
  name: '',
  description: '',
  text: '',
  color: '#FFFF88',
  fontSize: 18,
  metadataURI: '',
  isDraft: true,
}

const NoteBuilder: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([defaultNote])
  const [font, setFont] = useState('Inter')
  const [showControls, setShowControls] = useState(false)
  const [isBatch, setIsBatch] = useState(false)
  const [popoverMessage, setPopoverMessage] = useState<string | null>(null)
  const showAdvancedControls = false
  const { mintNote, batchMintNotes, updateMetadata } = useNotesContract()
  const notesContext = useContext(NotesContext)
  const { theme } = useTheme()

  if (!notesContext) {
    throw new Error('NoteBuilder must be used within a NotesProvider')
  }

  const { refetchNotes, markAsDraft } = notesContext

  const handleAddOrUpdateNote = async (index: number) => {
    const note = notes[index]
    if (note.text.trim() && note.text.length <= 200) {
      setPopoverMessage(note.tokenId ? 'Updating note...' : 'Minting note...')
      try {
        if (note.tokenId) {
          await updateMetadata(
            note.tokenId,
            note.name,
            note.description,
            note.text,
            note.color,
            note.fontSize,
            note.metadataURI
          )
          setPopoverMessage('Note updated successfully!')
        } else {
          await mintNote(note.name, note.description, note.text, note.color, note.fontSize, '')
          setPopoverMessage('Note minted successfully!')
          setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index))
          await refetchNotes()
          setNotes([defaultNote])
        }
      } catch (error) {
        console.error('Error:', error)
        setPopoverMessage('Failed to process note')
      } finally {
        setTimeout(() => setPopoverMessage(null), 3000)
      }
    } else {
      alert('Note must be between 1 and 200 characters.')
    }
  }

  const handleBatchMint = async () => {
    setPopoverMessage('Batch minting notes...')
    try {
      await batchMintNotes(
        [],
        ['Note'],
        ['Description'],
        notes.map((note) => note.text),
        notes.map((note) => note.color),
        notes.map((note) => note.fontSize),
        notes.map((note) => note.metadataURI)
      )
      setPopoverMessage('Batch minting successful!')
    } catch (error) {
      console.error('Batch mint error:', error)
      setPopoverMessage('Failed to batch mint notes')
    } finally {
      setTimeout(() => setPopoverMessage(null), 3000)
    }
  }

  const handleNewNote = () => {
    const newNote = { ...defaultNote }
    setNotes([...notes, newNote])
    if (markAsDraft) {
      markAsDraft(newNote)
    }
  }

  const handleClear = (index: number) => {
    const updatedNotes = [...notes]
    updatedNotes[index].text = ''
    setNotes(updatedNotes)
  }

  const handleDelete = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index)
    setNotes(updatedNotes)
  }

  const handleBurn = () => {
    // Implement burn functionality
    alert('Burn functionality not implemented yet')
  }

  const handleBatchToggle = () => {
    setIsBatch(!isBatch)
  }

  const handleTransfer = () => {
    // Implement transfer functionality
    alert('Transfer functionality not implemented yet')
  }

  return (
    <div className={`p-6 mb-4 border border-gray-100 rounded-lg shadow-2xl bg-${theme}`}>
      <h2
        className={`text-3xl font-bold mb-2 text-center ${theme === 'light' ? 'text-black' : 'text-white'}`}
      >
        Note Builder
      </h2>
      <div className='max-w-5xl mx-auto'>
        <p className='text-gray-400 text-center mb-4'>
          Welcome to the NFT Sticky Note Builder! This innovative tool allows you to craft
          personalized sticky notes with a modern twist. Choose from a variety of colors, fonts, and
          sizes to create notes that reflect your unique style. Once your masterpiece is complete,
          mint it as an NFT to secure it on the blockchain, ensuring it lasts forever. Whether
          you're using these notes for personal reminders or sharing them with friends, they offer a
          creative and lasting way to express yourself.
        </p>
      </div>

      {popoverMessage && <div className='popover'>{popoverMessage}</div>}
      <div className='flex justify-center mb-2'>
        <button
          onClick={handleNewNote}
          className='bg-yellow-500 text-white font-bold hover:bg-yellow-600 py-1 px-3 mx-4 rounded shadow-lg transition-transform duration-200 hover:scale-105'
        >
          New +
        </button>
        <button
          onClick={handleBatchToggle}
          className={`bg-yellow-500 text-white font-bold hover:bg-yellow-600 py-1 px-3 mx-4 rounded shadow-lg transition-transform duration-200 hover:scale-105 ${isBatch ? 'bg-purple-700' : ''}`}
        >
          <FaTh className='inline-block mr-1' /> Batch Mint
        </button>
      </div>
      <div className={`flex flex-wrap ${notes.length === 1 ? 'justify-center' : ''}`}>
        {notes.map((note, index) => (
          <div
            key={index}
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
                onChange={(e) => {
                  const updatedNotes = [...notes]
                  updatedNotes[index].name = e.target.value
                  setNotes(updatedNotes)
                }}
                placeholder='Name'
                className='bg-gray-100 text-gray-700 rounded font-sans p-1 text-sm w-1/2 text-center border border-gray-300 hover:border-gray-500 shadow-inner'
                style={{
                  margin: '4px',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                  maxWidth: '180px',
                }}
              />
              <input
                type='text'
                value={note.description}
                onChange={(e) => {
                  const updatedNotes = [...notes]
                  updatedNotes[index].description = e.target.value
                  setNotes(updatedNotes)
                }}
                placeholder='Description'
                className='bg-gray-100 text-gray-700 rounded font-sans p-1 text-sm w-1/2 text-center border border-gray-300 hover:border-gray-500 shadow-inner'
                style={{
                  margin: '4px',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
                  maxWidth: '180px',
                }}
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
                onChange={(e) => {
                  const updatedNotes = [...notes]
                  updatedNotes[index].text = e.target.value
                  setNotes(updatedNotes)
                }}
                placeholder='Write your note here...'
                className='w-full p-2 mb-2 border-none bg-transparent outline-none flex-grow font-sans'
                style={{ fontSize: note.fontSize + 'px', fontFamily: font, maxWidth: '280px' }}
              />
              <div
                className='absolute top-10 right-0 flex flex-col space-y-1 ml-1'
                style={{ right: '-25px' }}
              >
                <button
                  onClick={() => handleAddOrUpdateNote(index)}
                  className='bg-green-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105'
                >
                  {note.tokenId ? <FaEdit /> : <FaPlus />}
                </button>
                <button
                  onClick={() => setShowControls(!showControls)}
                  className='bg-blue-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105'
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleClear(index)}
                  className='bg-yellow-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105'
                >
                  <FaEraser />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className='bg-red-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105'
                >
                  <FaTrash />
                </button>
                {showAdvancedControls && (
                  <>
                    <button
                      onClick={handleBurn}
                      className='bg-red-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105'
                    >
                      <FaFire />
                    </button>
                    <button
                      onClick={handleTransfer}
                      className='bg-teal-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105'
                    >
                      <FaArrowRight />
                    </button>
                  </>
                )}
                <button
                  onClick={handleBatchToggle}
                  className={`bg-gray-500 text-white py-1 px-3 rounded-r shadow-lg transition-transform duration-200 hover:scale-105 ${isBatch ? 'bg-purple-700' : ''}`}
                >
                  <FaTh />
                </button>
              </div>
              {showControls && (
                <div className='mt-2 p-2 bg-white rounded shadow-lg flex justify-center items-center space-x-2'>
                  <input
                    type='color'
                    value={note.color}
                    onChange={(e) => {
                      const updatedNotes = [...notes]
                      updatedNotes[index].color = e.target.value
                      setNotes(updatedNotes)
                    }}
                    className='w-8 h-8 cursor-pointer'
                  />
                  <FaFont className='text-gray-700' />
                  <select
                    value={font}
                    onChange={(e) => setFont(e.target.value)}
                    className='bg-gray-100 text-gray-700 rounded font-sans'
                    style={{ fontFamily: font }}
                  >
                    {[
                      'Inter',
                      'Arial',
                      'Courier New',
                      'Times New Roman',
                      'Georgia',
                      'Verdana',
                      'Comic Sans MS',
                      'Pacifico',
                    ].map((f) => (
                      <option key={f} value={f} style={{ fontFamily: f }}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <select
                    value={note.fontSize.toString()}
                    onChange={(e) => {
                      const updatedNotes = [...notes]
                      updatedNotes[index].fontSize = parseInt(e.target.value)
                      setNotes(updatedNotes)
                    }}
                    className='bg-gray-100 text-gray-700 rounded font-sans'
                  >
                    {['14', '16', '18', '20', '22'].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NoteBuilder
