'use client'

import { useCallback, useMemo } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { type Address, getContract, type Abi, type GetContractReturnType } from 'viem'
import { getContractAddresses } from '@/app/api/blockchain/utils/addresses'
import { toast } from 'sonner'

export interface ContractHookResult<TAbi extends Abi> {
  contract: GetContractReturnType<TAbi>
  write: (
    functionName: string,
    args: unknown[],
    options?: { value?: bigint }
  ) => Promise<`0x${string}`>
  read: (functionName: string, args: unknown[]) => Promise<unknown>
  address: Address
  isLoading?: boolean
  error?: Error
}

export function useContract<
  T extends keyof ReturnType<typeof getContractAddresses>,
  TAbi extends Abi,
>(contractName: T, abi: TAbi): ContractHookResult<TAbi> {
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const addresses = getContractAddresses()

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
      args: unknown[],
      options?: { value?: bigint }
    ): Promise<`0x${string}`> => {
      try {
        if (!walletClient) throw new Error('Wallet not connected')

        const { request } = await publicClient.simulateContract({
          address,
          abi,
          functionName,
          args,
          value: options?.value,
          account: walletClient.account,
        })

        return await walletClient.writeContract(request)
      } catch (error) {
        console.error('Contract write error:', error)
        throw error
      }
    },
    [address, abi, publicClient, walletClient]
  )

  const read = useCallback(
    async (functionName: string, args: unknown[]): Promise<unknown> => {
      try {
        return await publicClient.readContract({
          address,
          abi,
          functionName,
          args,
        })
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
