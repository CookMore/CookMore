import { getPublicClient, getWalletClient } from '@wagmi/core'
import { JsonRpcProvider, FallbackProvider } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import { type HttpTransport } from 'viem'
import { useEffect, useState } from 'react'
import type { JsonRpcSigner } from '@ethersproject/providers'
import { usePublicClient, useWalletClient } from 'wagmi'

export function publicClientToProvider(publicClient: ReturnType<typeof getPublicClient>) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback')
    return new FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new JsonRpcProvider(value?.url, network)
      )
    )
  return new JsonRpcProvider(transport.url, network)
}

export function walletClientToSigner(walletClient: ReturnType<typeof getWalletClient>) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new Web3Provider(transport, network)
  const signer = provider.getSigner(account.address)

  return signer
}

export function useSigner() {
  const { data: walletClient } = useWalletClient()

  const [signer, setSigner] = useState<JsonRpcSigner | undefined>(undefined)
  useEffect(() => {
    async function getSigner() {
      if (!walletClient) return

      const tmpSigner = walletClientToSigner(walletClient)

      setSigner(tmpSigner)
    }

    getSigner()
  }, [walletClient])
  return signer
}

export function useProvider() {
  const publicClient = usePublicClient()

  const [provider, setProvider] = useState<JsonRpcProvider | undefined>(undefined)
  useEffect(() => {
    async function getSigner() {
      if (!publicClient) return

      const tmpProvider = publicClientToProvider(publicClient)

      setProvider(tmpProvider as JsonRpcProvider)
    }

    getSigner()
  }, [publicClient])
  return provider
}
