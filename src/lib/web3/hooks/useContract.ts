import { useEffect, useState } from 'react'
import { Contract, BrowserProvider } from 'ethers'
import { usePublicClient, useWalletClient } from 'wagmi'

export function useContract(address: string, abi: any) {
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const [contract, setContract] = useState<Contract | null>(null)

  useEffect(() => {
    if (!walletClient || !address || !abi || !publicClient) return

    const provider = new BrowserProvider(walletClient.transport)
    const newContract = new Contract(address, abi, provider)
    setContract(newContract)

    return () => {
      setContract(null)
    }
  }, [walletClient, address, abi, publicClient])

  return contract
}

export type ContractHook = ReturnType<typeof useContract>
