import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useMintNote, useBurnNote, useUpdateMetadata } from '../services/server/notes.service'
import { usePrivy } from '@privy-io/react-auth'
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

interface NotesContextType {
  notes: Note[]
  addNote: (noteData: Omit<Note, 'tokenId'>) => Promise<void>
  removeNote: (tokenId: number) => Promise<void>
  modifyNote: (metadata: Note) => Promise<void>
}

const NotesContext = createContext<NotesContextType | null>(null)

export const NotesProvider = ({ children }: { children: ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([])
  const { user } = usePrivy()
  const account = user?.wallet?.address || ''
  const { getNft } = useNotesContract()

  useEffect(() => {
    const fetchNotes = async () => {
      if (account) {
        try {
          const nfts = await getNft(account)
          setNotes(nfts)
        } catch (error) {
          console.error('Error fetching NFTs:', error)
        }
      }
    }

    fetchNotes()
  }, [account, getNft])

  const mintNote = useMintNote()
  const burnNote = useBurnNote()
  const updateMetadata = useUpdateMetadata()

  const addNote = async (noteData: Omit<Note, 'tokenId'>) => {
    await mintNote.mutateAsync(noteData)
    const nfts = await getNft(account)
    setNotes(nfts)
  }

  const removeNote = async (tokenId: number) => {
    await burnNote.mutateAsync(tokenId)
    const nfts = await getNft(account)
    setNotes(nfts)
  }

  const modifyNote = async (metadata: Note) => {
    await updateMetadata.mutateAsync(metadata)
    const nfts = await getNft(account)
    setNotes(nfts)
  }

  return (
    <NotesContext.Provider value={{ notes, addNote, removeNote, modifyNote }}>
      {children}
    </NotesContext.Provider>
  )
}

export const useNotes = () => useContext(NotesContext)
