import { useState } from 'react'
import { ethers } from 'ethers'
import { toast } from 'sonner'
import { recipeABI } from '@/app/api/blockchain/abis/recipe' // Corrected import path

export function useRecipeContract(contractAddress: string) {
  const [isWriting, setIsWriting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const write = async (methodName: string, ...args: any[]) => {
    setIsWriting(true)
    setError(null)

    try {
      if (!window.ethereum) {
        throw new Error('Ethereum provider not found')
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, recipeABI, signer)

      const tx = await contract[methodName](...args)
      await tx.wait()

      toast.success('Transaction successful')
    } catch (err: any) {
      // Explicitly typing err as any
      console.error('Error writing to contract:', err)
      setError(err.message)
      toast.error('Transaction failed')
    } finally {
      setIsWriting(false)
    }
  }

  return { write, isWriting, error }
}
