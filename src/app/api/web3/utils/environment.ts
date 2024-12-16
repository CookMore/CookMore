interface Environment {
  rpcUrl: string
  chainId: string
  network: string
}

export function getEnvironment(): Environment {
  return {
    rpcUrl: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || '',
    chainId: process.env.NEXT_PUBLIC_CHAIN_ID || '84532',
    network: process.env.NEXT_PUBLIC_NETWORK || 'testnet',
  }
}
