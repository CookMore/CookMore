import {
  createPublicClient,
  createWalletClient,
  custom,
  getContract,
  type PublicClient,
  type WalletClient,
  type Hash,
  type GetContractReturnType,
} from 'viem'
import { base, baseSepolia } from 'viem/chains'
import { toast } from 'sonner'
import { profileABI } from '@/app/api/blockchain/abis/profile'
import type { AbiEvent } from 'abitype'
import { profileCacheService } from '@/app/[locale]/(authenticated)/profile/services/offline/profile-cache.service'
import type { Profile as AppProfile } from '../../profile'

// Get chain based on environment
const chain = process.env.NEXT_PUBLIC_NETWORK === 'production' ? base : baseSepolia

export type MintStatus = {
  status: 'preparing' | 'minting' | 'confirming' | 'complete' | 'error'
  message: string
  txHash?: Hash
  tokenId?: string
}

export type ContractProfile = {
  profileId: bigint
  wallet: string
  metadataURI: string
  tier: number
  exists: boolean
}

export class ContractService {
  private publicClient: PublicClient
  private walletClient: WalletClient | null = null
  private statusCallback?: (status: MintStatus) => void
  private contract: GetContractReturnType<typeof profileABI> | null = null

  constructor() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Web3 provider not found')
    }

    this.publicClient = createPublicClient({
      chain,
      transport: custom(window.ethereum),
    })
  }

  setStatusCallback(callback: (status: MintStatus) => void) {
    this.statusCallback = callback
  }

  private updateStatus(
    status: MintStatus['status'],
    message: string,
    txHash?: Hash,
    tokenId?: string
  ) {
    if (this.statusCallback) {
      this.statusCallback({ status, message, txHash, tokenId })
    }
    console.log(`Mint Status - ${status}:`, { message, txHash, tokenId })
  }

  private async getWalletClient() {
    if (!this.walletClient) {
      this.walletClient = createWalletClient({
        chain,
        transport: custom(window.ethereum),
      })
    }
    return this.walletClient
  }

  private async getContract() {
    if (this.contract) return this.contract

    const contractAddress = process.env.NEXT_PUBLIC_TESTNET_PROFILE_REGISTRY
    if (!contractAddress) {
      throw new Error('Profile Registry contract address not configured')
    }

    this.contract = getContract({
      address: contractAddress as `0x${string}`,
      abi: profileABI,
    })

    return this.contract
  }

  async mintProfile(metadataCID: string): Promise<{ success: boolean; tokenId?: string }> {
    try {
      console.log('Starting profile creation:', { metadataCID })
      this.updateStatus('preparing', 'Requesting wallet connection...')

      const contractAddress = process.env.NEXT_PUBLIC_TESTNET_PROFILE_REGISTRY
      if (!contractAddress) {
        console.error('Profile Registry contract address not configured')
        throw new Error('Profile Registry contract address not configured')
      }

      console.log('Getting wallet client...')
      const walletClient = await this.getWalletClient()
      const [account] = await walletClient.getAddresses()
      console.log('Wallet connected:', { account })

      if (!account) {
        throw new Error('No account found. Please connect your wallet.')
      }

      console.log('Getting contract instance...')
      const contract = await this.getContract()
      console.log('Contract instance ready:', { contractAddress })

      this.updateStatus('minting', 'Preparing transaction...')

      // Fix double ipfs:// prefix
      const metadataURI = metadataCID.startsWith('ipfs://') ? metadataCID : `ipfs://${metadataCID}`

      console.log('Simulating contract call:', { metadataURI, account })

      const { request } = await this.publicClient.simulateContract({
        address: contractAddress as `0x${string}`,
        abi: profileABI,
        functionName: 'createProfile',
        args: [metadataURI],
        account,
      })

      const hash = await walletClient.writeContract(request)

      this.updateStatus('minting', 'Transaction submitted, waiting for confirmation...', hash)

      const receipt = await this.publicClient.waitForTransactionReceipt({ hash })
      console.log('Transaction confirmed:', receipt)

      // Look for ProfileCreated event
      const profileCreatedEvent = profileABI.find(
        (x): x is AbiEvent => x.type === 'event' && x.name === 'ProfileCreated'
      )

      if (!profileCreatedEvent) {
        throw new Error('ProfileCreated event not found in ABI')
      }

      const logs = receipt.logs.filter((log) => {
        try {
          return log.topics[0] === profileCreatedEvent.id
        } catch (err) {
          console.error('Error filtering logs:', err)
          return false
        }
      })

      if (logs.length === 0) {
        throw new Error('ProfileCreated event not found in transaction receipt')
      }

      // Get profileId from the event
      const profileId = logs[0].topics[1] // First indexed parameter after event signature
      if (!profileId) {
        throw new Error('Profile ID not found in event')
      }

      this.updateStatus('complete', 'Profile created successfully!', hash, profileId)
      return { success: true, tokenId: profileId }
    } catch (error) {
      console.error('Error creating profile:', error)
      this.updateStatus('error', error instanceof Error ? error.message : 'Unknown error occurred')
      return { success: false }
    }
  }

  async checkProfileExists(address: string): Promise<boolean> {
    try {
      const contract = await this.getContract()
      const result = (await this.publicClient.readContract({
        address: contract.address,
        abi: profileABI,
        functionName: 'getProfile',
        args: [address],
      })) as ContractProfile

      // Set up event watching for this address
      this.watchProfileEvents(address, (exists) => {
        // Update cache and cookies when events occur
        if (exists) {
          this.getProfile(address).then((profile) => {
            if (profile) {
              profileCacheService.cacheProfile(address, profile)
            }
          })
        } else {
          profileCacheService.clearCache()
        }
      })

      return result?.exists || false
    } catch (error) {
      console.error('Error checking profile existence:', error)
      return false
    }
  }

  async getProfile(address: string): Promise<ContractProfile | null> {
    try {
      const contract = await this.getContract()
      const result = (await this.publicClient.readContract({
        address: contract.address,
        abi: profileABI,
        functionName: 'getProfile',
        args: [address],
      })) as ContractProfile

      return result
    } catch (error) {
      console.error('Error getting profile:', error)
      return null
    }
  }

  async watchProfileEvents(address: string, callback: (exists: boolean) => void) {
    try {
      const contract = await this.getContract()
      const unwatch = this.publicClient.watchContractEvent({
        address: contract.address,
        abi: profileABI,
        eventName: 'ProfileCreated',
        args: {
          wallet: address,
        } as any,
        onLogs: (logs) => {
          if (logs.length > 0) {
            callback(true)
          }
        },
      })

      // Also watch for deletion events
      const unwatchDelete = this.publicClient.watchContractEvent({
        address: contract.address,
        abi: profileABI,
        eventName: 'ProfileDeleted',
        args: {
          wallet: address,
        } as any,
        onLogs: (logs) => {
          if (logs.length > 0) {
            callback(false)
          }
        },
      })

      return () => {
        unwatch()
        unwatchDelete()
      }
    } catch (error) {
      console.error('Error watching profile events:', error)
      return () => {}
    }
  }

  async getProfileEvents(address: string): Promise<any[]> {
    try {
      const contract = await this.getContract()
      const logs = await this.publicClient.getLogs({
        address: contract.address,
        event: {
          type: 'event',
          name: 'ProfileCreated',
          inputs: [
            { indexed: true, name: 'wallet', type: 'address' },
            { indexed: false, name: 'profileId', type: 'uint256' },
            { indexed: false, name: 'metadataURI', type: 'string' },
          ],
        },
        args: {
          wallet: address,
        } as any,
        fromBlock: 0n,
        toBlock: 'latest',
      })

      return logs
    } catch (error) {
      console.error('Error getting profile events:', error)
      return []
    }
  }

  async updateProfile(metadataURI: string): Promise<boolean> {
    try {
      const contract = await this.getContract()
      const walletClient = await this.getWalletClient()
      const [account] = await walletClient.getAddresses()

      if (!account) {
        throw new Error('No account found. Please connect your wallet.')
      }

      const { request } = await this.publicClient.simulateContract({
        address: contract.address,
        abi: profileABI,
        functionName: 'updateProfile',
        args: [metadataURI],
        account,
      })

      const hash = await walletClient.writeContract(request)
      await this.publicClient.waitForTransactionReceipt({ hash })

      return true
    } catch (error) {
      console.error('Error updating profile:', error)
      return false
    }
  }

  async upgradeTier(): Promise<boolean> {
    try {
      const contract = await this.getContract()
      const walletClient = await this.getWalletClient()
      const [account] = await walletClient.getAddresses()

      if (!account) {
        throw new Error('No account found. Please connect your wallet.')
      }

      const { request } = await this.publicClient.simulateContract({
        address: contract.address,
        abi: profileABI,
        functionName: 'upgradeTier',
        args: [],
        account,
      })

      const hash = await walletClient.writeContract(request)
      await this.publicClient.waitForTransactionReceipt({ hash })

      return true
    } catch (error) {
      console.error('Error upgrading tier:', error)
      return false
    }
  }
}

export const contractService = new ContractService()
