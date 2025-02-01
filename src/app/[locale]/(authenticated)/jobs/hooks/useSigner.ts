// hooks/useSigner.ts
import { JsonRpcProvider, FallbackProvider } from '@ethersproject/providers'
import { useMemo } from 'react'
import { Client, Transport } from 'viem'
import { useConnectorClient } from 'wagmi'

function clientToProvider(client: Client<Transport>) {
  const { chain, transport } = client
  if (!chain) {
    console.error('Chain is undefined')
    return undefined
  }
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === 'fallback') {
    const providers = (transport.transports as ReturnType<Transport>[]).map(
      ({ value }) => new JsonRpcProvider(value?.url, network)
    )
    if (providers.length === 1) return providers[0]
    return new FallbackProvider(providers)
  }
  return new JsonRpcProvider(transport.url, network)
}

function clientToSigner(client: Client<Transport>) {
  const { account, chain, transport } = client
  if (!chain || !account) {
    console.error('Chain or account is undefined')
    return undefined
  }
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new JsonRpcProvider(transport.url, network)
  const signer = provider.getSigner(account.address)
  return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useSigner({ chainId }: { chainId?: number } = {}) {
  const { data: client } = useConnectorClient({ chainId })
  return useMemo(() => (client ? clientToSigner(client) : undefined), [client])
}
