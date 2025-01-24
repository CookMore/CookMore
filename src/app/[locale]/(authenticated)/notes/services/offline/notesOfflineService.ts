// Function to fetch notes from IndexedDB
export const fetchNotesOffline = async () => {
  console.log('Fetching notes from offline storage...')
  const db = await openIndexedDB()
  const transaction = db.transaction('notes', 'readonly')
  const store = transaction.objectStore('notes')
  const notes = await store.getAll()
  return notes
}

// Function to store notes in IndexedDB
export async function storeNotesOffline(notes: any[]) {
  const db = await openIndexedDB()
  const transaction = db.transaction('notes', 'readwrite')
  const store = transaction.objectStore('notes')
  notes.forEach((note) => store.put(note))
  console.log('Notes stored offline:', notes)
}

// Function to sync offline changes
export function syncOfflineChanges() {
  // Implement sync logic here, e.g., using Background Sync API
  console.log('Syncing offline changes')
}

// Function to register service workers
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope)
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error)
      })
  }
}

// Helper function to open IndexedDB
async function openIndexedDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open('notesDB', 1)
    request.onupgradeneeded = (event) => {
      const db = request.result
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'tokenId' })
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}
