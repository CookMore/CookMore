import React, { useState, useEffect, useCallback, Suspense } from 'react'
import toast from 'react-hot-toast'
import { useNotes } from './context/NotesContext'
import NoteBuilder from './components/NoteBuilder'
import NoteDisplay from './components/NoteDisplay'
import { useBatch } from './context/BatchContext'
import { useNotesContract } from './hooks/useNotesContract'

interface StickyNote {
  tokenId: number
  name: string
  description: string
  text: string
  color: string
  fontSize: number
  metadataURI: string
}

interface NoteBuilderProps {
  onAddNote: (content: string, color: string, font: string) => void
  className?: string
}

interface BatchMintNotesFormProps {
  className?: string
}

interface BatchMintButtonProps {
  className?: string
}

interface MintTokenButtonProps {
  className?: string
}

interface BurnTokenButtonProps {
  className?: string
}

interface Note {
  tokenId: number
  uri: string
  color: string
  font: string
}

const NotesClient: React.FC = React.memo(() => {
  const { notes, addNote, removeNote, modifyNote } = useNotes()!
  const { batchMint, batchBurn } = useBatch()
  const { mintNote, burnNote, updateMetadata, getNft } = useNotesContract()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    console.log('NotesClient mounting...')
    setMounted(true)
    console.log('NotesClient mounted')
    return () => {
      console.log('NotesClient unmounting')
    }
  }, [])

  const handleAddNote = async (noteData: Omit<Note, 'tokenId'>) => {
    try {
      await addNote(noteData)
      toast.success('Note added successfully!')
    } catch (error) {
      toast.error('Failed to add note.')
      console.error('Error adding note:', error)
    }
  }

  const handleRemoveNote = async (tokenId: number) => {
    try {
      await removeNote(tokenId)
      toast.success('Note removed successfully!')
    } catch (error) {
      toast.error('Failed to remove note.')
      console.error('Error removing note:', error)
    }
  }

  const handleModifyNote = async (metadata: Note) => {
    try {
      await modifyNote(metadata)
      toast.success('Note modified successfully!')
    } catch (error) {
      toast.error('Failed to modify note.')
      console.error('Error modifying note:', error)
    }
  }

  if (!mounted) {
    return (
      <div className='min-h-screen bg-github-canvas-default'>
        <div className='animate-pulse p-8 relative z-30'>
          <div className='h-8 bg-github-canvas-subtle rounded w-1/4 mb-6'></div>
          <div className='space-y-4'>
            <div className='h-32 bg-github-canvas-subtle rounded'></div>
            <div className='h-32 bg-github-canvas-subtle rounded'></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex h-full relative' style={{ zIndex: 10 }}>
      <div
        className='w-2/3 min-w-[300px] p-4 overflow-y-auto hover:border-blue-500'
        style={{ zIndex: 10 }}
      >
        <NoteBuilder onAddNote={handleAddNote} />
        <NoteDisplay
          notes={notes}
          onRemoveNote={handleRemoveNote}
          onModifyNote={handleModifyNote}
        />
      </div>
    </div>
  )
})

export default function NotesClientWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotesClient />
    </Suspense>
  )
}
