import { JsonRpcProvider, BrowserProvider, Contract, type Log, type EventLog } from 'ethers'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { stickyABI } from '@/app/api/blockchain/abis/sticky'
import { TESTNET_ADDRESSES } from '@/app/api/blockchain/utils/addresses'

// -------------------
// PROVIDERS
// -------------------
const mainnetProvider = new JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL)
const testnetProvider = new JsonRpcProvider(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL)

const providers = {
  mainnet: mainnetProvider,
  testnet: testnetProvider,
}

/**
 * For read-only calls using a JsonRpcProvider
 */
function getProvider(network: 'mainnet' | 'testnet'): JsonRpcProvider {
  return providers[network]
}

/**
 * For read-only contract (no signer)
 */
async function getNotesContractReadOnly(network: 'mainnet' | 'testnet'): Promise<Contract> {
  const provider = getProvider(network)
  const contractAddress = TESTNET_ADDRESSES.STICKY_NOTE
  return new Contract(contractAddress, stickyABI, provider)
}

/**
 * For write calls: we use BrowserProvider to get a user signer from the wallet.
 * Example: for testnet usage.
 */
async function getNotesContractWithSigner(): Promise<Contract> {
  const contractAddress = TESTNET_ADDRESSES.STICKY_NOTE
  const browserProvider = new BrowserProvider(window.ethereum as any)
  const signer = await browserProvider.getSigner()
  return new Contract(contractAddress, stickyABI, signer)
}

/**
 * Type guard for Ethers v6 logs that ensures we have an EventLog with `args`.
 */
function isEventLog(log: Log | EventLog): log is EventLog {
  return 'args' in log
}

/**
 *  Helper function to get minted token IDs from the "StickyNoteMinted" event
 */
async function getMintedTokenIds(contract: Contract): Promise<number[]> {
  if (!contract) {
    console.error('Contract is null or undefined')
    return []
  }
  try {
    const filter = contract.filters.StickyNoteMinted()
    const events = await contract.queryFilter(filter)
    if (!events) {
      console.error('No events found')
      return []
    }
    return events
      .map((rawLog) => {
        if (!isEventLog(rawLog) || !rawLog.args) {
          console.error('Event log not typed properly:', rawLog)
          return null
        }
        // Ethers v6 => bigints, so use Number(...)
        return Number(rawLog.args.tokenId)
      })
      .filter((id) => id !== null) as number[]
  } catch (error) {
    console.error('Error querying filter:', error)
    return []
  }
}

/**
 *  React Query: read-only fetch notes
 */
export const useFetchNotes = (account: string, network: 'mainnet' | 'testnet') => {
  return useQuery({
    queryKey: ['notes', account, network],
    queryFn: async () => {
      console.log(`Fetching notes for account: ${account} on ${network}`)
      try {
        const contract = await getNotesContractReadOnly(network)
        console.log('Read-only contract:', contract.address)

        const tokenIds = await getMintedTokenIds(contract)
        console.log('Minted token IDs:', tokenIds)

        const notes: any[] = []
        for (const id of tokenIds) {
          try {
            const ownerOfId = await contract.ownerOf(id)
            if (ownerOfId.toLowerCase() === account.toLowerCase()) {
              const uri = await contract.tokenURI(id)
              const metadata = await fetchMetadata(id, network)
              notes.push({ tokenId: id, uri, ...metadata })
            }
          } catch (err) {
            console.error('Error fetching note with ID:', id, err)
          }
        }
        return notes
      } catch (error) {
        console.error('Error fetching notes:', error)
        return []
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 *  fetchMetadata: read-only helper
 */
export async function fetchMetadata(tokenId: number, network: 'mainnet' | 'testnet') {
  try {
    const contract = await getNotesContractReadOnly(network)
    const metadata = await contract.getMetadata(tokenId)
    return metadata
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return null
  }
}

/**
 *  fetchNfts: read-only to fetch NFTs for an owner
 */
export async function fetchNfts(owner: string, network: 'mainnet' | 'testnet') {
  try {
    const contract = await getNotesContractReadOnly(network)
    const nfts = await contract.getNft(owner)

    if (!nfts || !nfts.ids || !nfts.names) {
      console.error('NFTs data is incomplete or undefined')
      return []
    }

    // Ethers v6 => numeric array items are bigints => convert to string or number
    return nfts.ids.map((id: bigint, index: number) => ({
      tokenId: id?.toString(),
      name: nfts.names[index],
      description: nfts.descriptions[index],
      text: nfts.texts[index],
      color: nfts.colors[index],
      fontSize: nfts.fontSizes[index] ? Number(nfts.fontSizes[index]) : 0,
      metadataURI: nfts.metadataURIs[index],
    }))
  } catch (error: any) {
    if (error?.reason === 'Owner has no NFTs') {
      console.warn('Owner has no NFTs:', owner)
      return []
    }
    console.error('Error fetching NFTs:', error)
    return null
  }
}

/** Additional read-only helpers if needed:
 * fetchOwnerOf(tokenId, network)
 * fetchTokenURI(tokenId, network)
 * fetchApprovedAddress(tokenId, network)
 * fetchIsApprovedForAll(owner, operator, network)
 */

// ---------------------
// REACT QUERY MUTATIONS
// (Write calls that need a signer-based contract)
// ---------------------

/** Single note mint */
export const useMintNote = () => {
  const queryClient = useQueryClient()
  return useMutation<
    {
      name: string
      description: string
      text: string
      color: string
      fontSize: number
      metadataURI: string
    },
    Error,
    {
      name: string
      description: string
      text: string
      color: string
      fontSize: number
      metadataURI: string
    }
  >({
    mutationFn: async (noteMetadata) => {
      const contract = await getNotesContractWithSigner()
      const tx = await contract.mint(
        noteMetadata.name,
        noteMetadata.description,
        noteMetadata.text,
        noteMetadata.color,
        noteMetadata.fontSize,
        noteMetadata.metadataURI
      )
      console.log('Mint TX hash:', tx.hash)
      const receipt = await tx.wait()
      console.log('Mint TX confirmed:', receipt)
      return noteMetadata
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

/** Single note burn */
export const useBurnNote = () => {
  const queryClient = useQueryClient()
  return useMutation<number, Error, number>({
    mutationFn: async (tokenId) => {
      const contract = await getNotesContractWithSigner()
      const tx = await contract.burn(tokenId)
      console.log('Burn TX hash:', tx.hash)
      const receipt = await tx.wait()
      console.log('Burn TX confirmed:', receipt)
      return tokenId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

/** Update metadata of a single note */
export const useUpdateMetadata = () => {
  const queryClient = useQueryClient()
  return useMutation<
    {
      tokenId: number
      name: string
      description: string
      text: string
      color: string
      fontSize: number
      metadataURI: string
    },
    Error,
    {
      tokenId: number
      name: string
      description: string
      text: string
      color: string
      fontSize: number
      metadataURI: string
    }
  >({
    mutationFn: async (metadata) => {
      const contract = await getNotesContractWithSigner()
      const tx = await contract.updateMetadata(
        metadata.tokenId,
        metadata.name,
        metadata.description,
        metadata.text,
        metadata.color,
        metadata.fontSize,
        metadata.metadataURI
      )
      console.log('Update metadata TX hash:', tx.hash)
      const receipt = await tx.wait()
      console.log('Metadata updated successfully:', receipt)
      return metadata
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

/** Batch mint notes */
export const useBatchMintNotes = () => {
  const queryClient = useQueryClient()
  return useMutation<
    {
      recipients: string[]
      names: string[]
      descriptions: string[]
      texts: string[]
      colors: string[]
      fontSizes: number[]
      metadataURIs: string[]
    },
    Error,
    {
      recipients: string[]
      names: string[]
      descriptions: string[]
      texts: string[]
      colors: string[]
      fontSizes: number[]
      metadataURIs: string[]
    }
  >({
    mutationFn: async (batchData) => {
      const contract = await getNotesContractWithSigner()
      console.log('Batch minting notes:', batchData)
      const tx = await contract.batchMint(
        batchData.recipients,
        batchData.names,
        batchData.descriptions,
        batchData.texts,
        batchData.colors,
        batchData.fontSizes,
        batchData.metadataURIs
      )
      console.log('Batch mint TX:', tx.hash)
      const receipt = await tx.wait()
      console.log('Batch mint confirmed:', receipt)
      return batchData
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

/** Batch burn notes */
export const useBatchBurnNotes = () => {
  const queryClient = useQueryClient()
  return useMutation<number[], Error, number[]>({
    mutationFn: async (tokenIds) => {
      const contract = await getNotesContractWithSigner()
      console.log('Batch burning notes:', tokenIds)
      const tx = await contract.batchBurn(tokenIds)
      console.log('Batch burn TX:', tx.hash)
      const receipt = await tx.wait()
      console.log('Batch burn confirmed:', receipt)
      return tokenIds
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

/**
 * Additional actions:
 *  - adminBurn
 *  - batchTransfer
 *  - etc.
 *
 * Following the same pattern:
 * 1) get a signer-based contract
 * 2) call contract method
 * 3) wait for receipt
 * 4) invalidate 'notes'
 */
