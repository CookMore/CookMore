export const validateNote = (note: string): boolean => {
  const maxLength = 500 // Define a maximum length for notes
  if (note.trim().length === 0) {
    console.log('Validation failed: Note is empty')
    return false
  }
  if (note.length > maxLength) {
    console.log(`Validation failed: Note exceeds maximum length of ${maxLength}`)
    return false
  }
  return true
}
