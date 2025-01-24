import React, { createContext, useContext, useState, ReactNode } from 'react'
import { useBatchMintNotes, useBatchBurnNotes } from '../services/server/notes.service'

interface BatchContextType {
  batchMint: (batchData: {
    recipients: string[]
    names: string[]
    descriptions: string[]
    texts: string[]
    colors: string[]
    fontSizes: number[]
    metadataURIs: string[]
  }) => Promise<void>
  batchBurn: (tokenIds: number[]) => Promise<void>
}

const BatchContext = createContext<BatchContextType | null>(null)

export const BatchProvider = ({ children }: { children: ReactNode }) => {
  const batchMintNotes = useBatchMintNotes()
  const batchBurnNotes = useBatchBurnNotes()

  const batchMint = async (batchData: {
    recipients: string[]
    names: string[]
    descriptions: string[]
    texts: string[]
    colors: string[]
    fontSizes: number[]
    metadataURIs: string[]
  }) => {
    await batchMintNotes.mutateAsync(batchData)
  }

  const batchBurn = async (tokenIds: number[]) => {
    await batchBurnNotes.mutateAsync(tokenIds)
  }

  return <BatchContext.Provider value={{ batchMint, batchBurn }}>{children}</BatchContext.Provider>
}

export const useBatch = () => useContext(BatchContext)
