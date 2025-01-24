import React, { useState } from 'react'
import { FaFont, FaPlus, FaEdit, FaTrash, FaFire, FaArrowRight } from 'react-icons/fa'
import { useNotesContract } from '../hooks/useNotesContract'

const NoteBuilder: React.FC = () => {
  const [content, setContent] = useState('')
  const [color, setColor] = useState('#FFFF88') // Default sticky note yellow
  const [font, setFont] = useState('Inter') // Default site font
  const [fontSize, setFontSize] = useState('18px')
  const [showControls, setShowControls] = useState(false)
  const [isBatch, setIsBatch] = useState(false) // Default to unchecked

  const { mintNote, batchMintNotes } = useNotesContract()

  const fonts = [
    'Inter',
    'Arial',
    'Courier New',
    'Times New Roman',
    'Georgia',
    'Verdana',
    'Comic Sans MS',
    'Pacifico',
  ]
  const fontSizes = ['14', '16', '18', '20', '22']
  const maxCharacters = 200

  const handleAddNote = async () => {
    if (content.trim() && content.length <= maxCharacters) {
      try {
        await mintNote('Note', 'Description', content, color, parseInt(fontSize), '')
        setContent('')
        alert('Note added successfully!')
      } catch (error) {
        console.error('Add note error:', error)
        alert('Failed to add note')
      }
    } else {
      alert(`Note must be between 1 and ${maxCharacters} characters.`)
    }
  }

  const handleBatchMint = async () => {
    try {
      await batchMintNotes(
        [],
        ['Note'],
        ['Description'],
        [content],
        [color],
        [parseInt(fontSize)],
        ['']
      )
      alert('Batch minting successful!')
    } catch (error) {
      console.error('Batch mint error:', error)
      alert('Failed to batch mint notes')
    }
  }

  const handleNewNote = () => {
    setContent('')
    setColor('#FFFF88')
    setFont('Inter')
    setFontSize('18px')
    setIsBatch(false)
  }

  const handleClear = () => {
    setContent('')
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
    <div className='p-6 mb-4 relative bg-github-canvas-default rounded-lg shadow-lg'>
      <div className='flex justify-between mb-4'>
        <button
          onClick={handleNewNote}
          className='bg-yellow-500 text-white font-bold hover:bg-yellow-600 py-1 px-2 rounded'
        >
          New +
        </button>
        <button
          onClick={handleBatchMint}
          className='bg-yellow-500 text-white font-bold hover:bg-yellow-600 py-1 px-2 rounded'
        >
          Batch Mint
        </button>
      </div>
      <div
        className='p-4 flex flex-col justify-between items-center bg-white rounded-md shadow-md relative'
        style={{
          backgroundColor: color,
          fontFamily: 'Inter', // Ensure controls use Inter
          width: '400px',
          height: '400px',
          color: '#333',
          textAlign: 'center',
          minWidth: '300px',
          minHeight: '300px',
        }}
      >
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Write your note here...'
          className='w-full p-2 mb-2 border-none bg-transparent outline-none flex-grow font-sans'
          style={{ fontSize: fontSize + 'px', fontFamily: font }}
        />
        <div className='absolute top-10 right-0 flex flex-col space-y-1 ml-2'>
          <button onClick={handleAddNote} className='bg-green-500 text-white py-1 px-2 rounded-r'>
            <FaPlus />
          </button>
          <button
            onClick={() => setShowControls(!showControls)}
            className='bg-blue-500 text-white py-1 px-2 rounded-r'
          >
            <FaEdit />
          </button>
          <button onClick={handleClear} className='bg-yellow-500 text-white py-1 px-2 rounded-r'>
            <FaTrash />
          </button>
          <button onClick={handleBurn} className='bg-red-500 text-white py-1 px-2 rounded-r'>
            <FaFire />
          </button>
          <button onClick={handleTransfer} className='bg-teal-500 text-white py-1 px-2 rounded-r'>
            <FaArrowRight />
          </button>
        </div>
        {showControls && (
          <div className='mt-2 p-2 bg-white rounded shadow-md flex justify-center items-center space-x-2'>
            <input
              type='color'
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className='w-8 h-8 cursor-pointer'
            />
            <FaFont className='text-gray-700' />
            <select
              value={font}
              onChange={(e) => setFont(e.target.value)}
              className='bg-gray-100 text-gray-700 rounded font-sans'
              style={{ fontFamily: font }} // Preview font style
            >
              {fonts.map((f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>
                  {f}
                </option>
              ))}
            </select>
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className='bg-gray-100 text-gray-700 rounded font-sans'
            >
              {fontSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
        <label className='absolute bottom-2 right-2 flex items-center'>
          <input type='checkbox' checked={isBatch} onChange={handleBatchToggle} className='mr-2' />
          Batch
        </label>
      </div>
    </div>
  )
}

export default NoteBuilder
