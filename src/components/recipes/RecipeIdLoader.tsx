import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'

const contractABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'parentId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'childId',
        type: 'uint256',
      },
    ],
    name: 'addFork',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'recipeId',
        type: 'uint256',
      },
    ],
    name: 'getChildren',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'recipeId',
        type: 'uint256',
      },
    ],
    name: 'getParent',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'versions',
    outputs: [
      {
        internalType: 'uint256',
        name: 'parentId',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]
const contractAddress = '0xEC9C419756d07775a8e14A5871550fF8b87A7570' // VersionControl contract address

export default function RecipeIdLoader() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchRecipeId = async () => {
      try {
        const provider = new ethers.providers.InfuraProvider(
          'baseTestnet',
          'YOUR_INFURA_PROJECT_ID'
        )
        const contract = new ethers.Contract(contractAddress, contractABI, provider)

        // Assuming the contract has a function to get the current highest recipe ID
        const currentHighestId = await contract.getCurrentHighestRecipeId()
        const nextRecipeId = currentHighestId + 1

        // Navigate to the recipe creation page with the new recipeId
        router.push(`/kitchen/new?recipeId=${nextRecipeId}`)
      } catch (error) {
        console.error('Error fetching recipe ID:', error)
        setLoading(false)
      }
    }

    fetchRecipeId()
  }, [router])

  return (
    <div className='flex items-center justify-center h-screen'>
      {loading ? <p>Loading Recipe ID...</p> : <p>Error loading Recipe ID</p>}
    </div>
  )
}
