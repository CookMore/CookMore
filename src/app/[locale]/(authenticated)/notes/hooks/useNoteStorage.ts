import { useState, useEffect } from 'react'

const useNoteStorage = () => {
  const [notes, setNotes] = useState<string[]>(() => {
    const savedNotes = localStorage.getItem('notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
    console.log('Current notes:', notes)
  }, [notes])

  const addNote = (note: string) => {
    setNotes((prevNotes) => [...prevNotes, note])
  }

  return { notes, addNote }
}

export default useNoteStorage
