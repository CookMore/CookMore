'use client'

import { useCallback, useMemo } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { type Address, getContract } from 'viem'
import { getAddresses } from '../../utils/addresses'
import { toast } from 'sonner'

export interface ContractHookResult {
  contract: ReturnType<typeof getContract>
  write: (functionName: string, args: any[], options?: { value?: bigint }) => Promise<`0x${string}`>
  read: (functionName: string, args: any[]) => Promise<any>
  address: Address
  isLoading?: boolean
  error?: Error
}

export function useContract<T extends keyof ReturnType<typeof getAddresses>>(
  contractName: T,
  abi: any[] // TODO: Add proper ABI type
): ContractHookResult {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const addresses = getAddresses()

  const address = addresses[contractName] as Address

  const contract = useMemo(
    () =>
      getContract({
        address,
        abi,
        publicClient,
        walletClient: walletClient ?? undefined,
      }),
    [address, abi, publicClient, walletClient]
  )

  const write = useCallback(
    async (
      functionName: string,
      args: any[],
      options?: { value?: bigint }
    ) => {
      try {
        if (!walletClient) throw new Error('Wallet not connected')
        
        const { request } = await publicClient.simulateContract({
          address,
          abi,
          functionName,
          args,
          value: options?.value,
        })

        const hash = await walletClient.writeContract(request)
        await publicClient.waitForTransactionReceipt({ hash })

        toast.success('Transaction successful')
        return hash
      } catch (error) {
        console.error('Contract write error:', error)
        toast.error('Transaction failed')
        throw error
      }
    },
    [address, abi, publicClient, walletClient]
  )

  const read = useCallback(
    async (functionName: string, args: any[]) => {
      try {
        const data = await publicClient.readContract({
          address,
          abi,
          functionName,
          args,
        })
        return data
      } catch (error) {
        console.error('Contract read error:', error)
        throw error
      }
    },
    [address, abi, publicClient]
  )

  return {
    contract,
    write,
    read,
    address,
  }
}

// Export types
export type { ContractHookResult }
