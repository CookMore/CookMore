// utils.ts
import { ethers } from 'ethers'

// Convert wallet client to signer using the connected wallet address
export const walletClientToSigner = (walletClient: any) => {
  // Access the signer from the walletClient (assuming walletClient has a method getSigner)
  return walletClient.getSigner()
}

// Convert public client to provider
export const publicClientToProvider = (publicClient: any) => {
  // Assuming publicClient is a viem Client, create the provider for ethers.js
  return new ethers.JsonRpcProvider(publicClient.transport.url)
}
