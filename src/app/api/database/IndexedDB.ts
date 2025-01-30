// src/app/api/database/IndexedDB.ts

import { openDB } from 'idb'

let dbPromise: Promise<any> // Type annotation is valid in TypeScript

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB('app-db', 1, {
      upgrade(db) {
        db.createObjectStore('jobs', { keyPath: 'id', autoIncrement: true })
        db.createObjectStore('recipes', { keyPath: 'id', autoIncrement: true })
        db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true })
        db.createObjectStore('profiles', { keyPath: 'id', autoIncrement: true })
      },
    })
  }
  return dbPromise
}
