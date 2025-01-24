import { ethers } from 'ethers'
import { stickyABI } from '@/app/api/blockchain/abis'
import { TESTNET_ADDRESSES } from '@/app/api/blockchain/utils/addresses'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

// Initialize the providers with your specific RPC URLs
const mainnetProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_BASE_MAINNET_RPC_URL
)
const testnetProvider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL
)

const providers = {
  mainnet: mainnetProvider,
  testnet: testnetProvider,
}

// Function to select the appropriate provider
function getProvider(network: 'mainnet' | 'testnet'): ethers.providers.JsonRpcProvider {
  return providers[network]
}

// Function to get the notes contract
async function getNotesContract(network: 'mainnet' | 'testnet'): Promise<ethers.Contract> {
  const provider = getProvider(network)
  const contractAddress = TESTNET_ADDRESSES.STICKY_NOTE
  return new ethers.Contract(contractAddress, stickyABI, provider)
}

// Function to get minted token IDs using events
async function getMintedTokenIds(contract: ethers.Contract): Promise<number[]> {
  if (!contract) {
    console.error('Contract is null or undefined')
    return []
  }

  try {
    const filter = contract.filters.StickyNoteMinted()
    console.log('Filter created:', filter)
    const events = await contract.queryFilter(filter)
    if (!events) {
      console.error('No events found')
      return []
    }
    console.log('Events fetched:', events)
    return events
      .map((event) => {
        if (!event.args) {
          console.error('Event args are null:', event)
          return null
        }
        return event.args.tokenId.toNumber()
      })
      .filter((id) => id !== null)
  } catch (error) {
    console.error('Error querying filter:', error)
    return []
  }
}

// Function to fetch notes
export const useFetchNotes = (account: string, network: 'mainnet' | 'testnet') => {
  return useQuery({
    queryKey: ['notes', account, network],
    queryFn: async () => {
      console.log(`Fetching notes for account: ${account} on ${network}`)
      try {
        const contract = await getNotesContract(network)
        console.log('Contract initialized:', contract.address)
        const tokenIds = await getMintedTokenIds(contract)
        console.log('Minted token IDs:', tokenIds)
        const notes = []

        for (const id of tokenIds) {
          try {
            const ownerOfId = await contract.ownerOf(id)
            console.log(`Owner of token ${id}:`, ownerOfId)
            if (ownerOfId.toLowerCase() === account.toLowerCase()) {
              const uri = await contract.tokenURI(id)
              console.log(`Token URI for ${id}:`, uri)
              const metadata = await fetchMetadata(id, network)
              notes.push({ tokenId: id, uri, ...metadata })
              console.log('Note fetched:', { tokenId: id, uri, ...metadata })
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

// Function to fetch the owner of a token
async function fetchOwnerOf(
  tokenId: number,
  network: 'mainnet' | 'testnet'
): Promise<string | null> {
  try {
    const contract = await getNotesContract(network)
    const owner = await contract.ownerOf(tokenId)
    return owner
  } catch (error) {
    console.error('Error fetching owner:', error)
    return null
  }
}

// Function to fetch the token URI
async function fetchTokenURI(
  tokenId: number,
  network: 'mainnet' | 'testnet'
): Promise<string | null> {
  try {
    const contract = await getNotesContract(network)
    const uri = await contract.tokenURI(tokenId)
    return uri
  } catch (error) {
    console.error('Error fetching token URI:', error)
    return null
  }
}

// Function to check if an address is approved for a token
async function fetchApprovedAddress(
  tokenId: number,
  network: 'mainnet' | 'testnet'
): Promise<string | null> {
  try {
    const contract = await getNotesContract(network)
    const approvedAddress = await contract.getApproved(tokenId)
    return approvedAddress
  } catch (error) {
    console.error('Error fetching approved address:', error)
    return null
  }
}

// Function to check if an operator is approved for all tokens of an owner
async function fetchIsApprovedForAll(
  owner: string,
  operator: string,
  network: 'mainnet' | 'testnet'
): Promise<boolean> {
  try {
    const contract = await getNotesContract(network)
    const isApproved = await contract.isApprovedForAll(owner, operator)
    return isApproved
  } catch (error) {
    console.error('Error checking approval for all:', error)
    return false
  }
}

// Function to mint a note
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
      const contract = await getNotesContract('testnet') // Assuming testnet for minting
      console.log('Minting note with metadata:', noteMetadata)
      const tx = await contract.mint(
        noteMetadata.name,
        noteMetadata.description,
        noteMetadata.text,
        noteMetadata.color,
        noteMetadata.fontSize,
        noteMetadata.metadataURI
      )
      console.log('Transaction sent:', tx.hash)
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)
      console.log('Note minted successfully')
      return noteMetadata // Return the note metadata
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

// Function to batch mint notes
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
    mutationFn: async (batchMetadata) => {
      const contract = await getNotesContract('testnet') // Assuming testnet for minting
      console.log('Batch minting notes with metadata:', batchMetadata)
      const tx = await contract.batchMint(
        batchMetadata.recipients,
        batchMetadata.names,
        batchMetadata.descriptions,
        batchMetadata.texts,
        batchMetadata.colors,
        batchMetadata.fontSizes,
        batchMetadata.metadataURIs
      )
      console.log('Transaction sent:', tx.hash)
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)
      console.log('Batch minting successful')
      return batchMetadata // Return the batch metadata
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

// Function to burn a note
export const useBurnNote = () => {
  const queryClient = useQueryClient()
  return useMutation<number, Error, number>({
    mutationFn: async (tokenId) => {
      const contract = await getNotesContract('testnet') // Assuming testnet for burning
      console.log('Burning note with tokenId:', tokenId)
      const tx = await contract.burn(tokenId)
      console.log('Transaction sent:', tx.hash)
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)
      console.log('Note burned successfully')
      return tokenId // Return the tokenId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

// Function to batch burn notes
export const useBatchBurnNotes = () => {
  const queryClient = useQueryClient()
  return useMutation<number[], Error, number[]>({
    mutationFn: async (tokenIds) => {
      const contract = await getNotesContract('testnet') // Assuming testnet for burning
      console.log('Batch burning notes with tokenIds:', tokenIds)
      const tx = await contract.batchBurn(tokenIds)
      console.log('Transaction sent:', tx.hash)
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)
      console.log('Batch burn successful')
      return tokenIds // Return the tokenIds
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

// Function to admin burn a note
export const useAdminBurnNote = () => {
  const queryClient = useQueryClient()
  return useMutation<number, Error, number>({
    mutationFn: async (tokenId) => {
      const contract = await getNotesContract('testnet') // Assuming testnet for admin burning
      console.log('Admin burning note with tokenId:', tokenId)
      const tx = await contract.adminBurn(tokenId)
      console.log('Transaction sent:', tx.hash)
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)
      console.log('Admin burn successful')
      return tokenId // Return the tokenId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

// Function to update metadata of a note
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
      const contract = await getNotesContract('testnet') // Assuming testnet for updating metadata
      console.log('Updating metadata for tokenId:', metadata.tokenId)
      const tx = await contract.updateMetadata(
        metadata.tokenId,
        metadata.name,
        metadata.description,
        metadata.text,
        metadata.color,
        metadata.fontSize,
        metadata.metadataURI
      )
      console.log('Transaction sent:', tx.hash)
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)
      console.log('Metadata updated successfully')
      return metadata // Return the metadata
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })
}

// Function to fetch metadata of a note
export async function fetchMetadata(tokenId: number, network: 'mainnet' | 'testnet') {
  try {
    const contract = await getNotesContract(network)
    const metadata = await contract.getMetadata(tokenId)
    return metadata
  } catch (error) {
    console.error('Error fetching metadata:', error)
    return null
  }
}

// Function to fetch all NFTs owned by an address
export async function fetchNfts(owner: string, network: 'mainnet' | 'testnet') {
  try {
    const contract = await getNotesContract(network)
    const nfts = await contract.getNft(owner)

    // Log the structure of nfts to understand its shape
    console.log('NFTs structure:', nfts)

    // Check if nfts and its properties are defined
    if (!nfts || !nfts.ids || !nfts.names) {
      console.error('NFTs data is incomplete or undefined')
      return []
    }

    // Assuming nfts is an object with arrays, transform it into an array of objects
    return nfts.ids.map((id: any, index: number) => ({
      tokenId: id?.toString(), // Convert BigNumber to string
      name: nfts.names[index],
      description: nfts.descriptions[index],
      text: nfts.texts[index],
      color: nfts.colors[index],
      fontSize: nfts.fontSizes[index]?.toNumber(), // Convert BigNumber to number
      metadataURI: nfts.metadataURIs[index],
    }))
  } catch (error) {
    const err = error as { reason?: string }
    if (err.reason === 'Owner has no NFTs') {
      console.warn('Owner has no NFTs:', owner)
      return []
    }
    console.error('Error fetching NFTs:', error)
    return null
  }
}
