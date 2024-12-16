import { useContract } from './useContract'
import { VERSION_CONTROL_ABI } from '@/lib/web3/abis'
import { VERSION_CONTROL_ADDRESS } from '@/lib/web3/addresses'

export function useVersionControl() {
  const contract = useContract(VERSION_CONTROL_ADDRESS, VERSION_CONTROL_ABI)

  const addFork = async (parentId: number, childId: number) => {
    try {
      const tx = await contract.addFork(parentId, childId)
      await tx.wait()
    } catch (error) {
      console.error('Error adding fork:', error)
    }
  }

  return { addFork }
}
