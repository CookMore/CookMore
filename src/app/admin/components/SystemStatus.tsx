'use client'

import { useEffect, useState } from 'react'
import { CONTRACT_ADDRESSES } from '@/lib/web3/addresses'

interface ContractStatus {
  name: string
  address: string
  status: 'active' | 'inactive' | 'unknown'
}

export function SystemStatus() {
  const [contracts, setContracts] = useState<ContractStatus[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkContracts = async () => {
      const contractList = Object.entries(CONTRACT_ADDRESSES).map(([name, address]) => ({
        name,
        address,
        status: 'active' as const, // For now, assume all contracts are active
      }))
      setContracts(contractList)
      setLoading(false)
    }

    checkContracts()
  }, [])

  if (loading) {
    return (
      <div className='text-center py-4'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-github-accent-emphasis mx-auto'></div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <div className='grid gap-3'>
        {contracts.map((contract) => (
          <div
            key={contract.address}
            className='flex justify-between items-center p-3 bg-github-canvas-subtle rounded-md'
          >
            <div>
              <div className='font-medium'>{contract.name}</div>
              <div className='text-xs text-github-fg-muted'>{contract.address}</div>
            </div>
            <div
              className={`px-2 py-1 rounded-full text-xs ${
                contract.status === 'active'
                  ? 'bg-github-success-emphasis/10 text-github-success-fg'
                  : 'bg-github-danger-emphasis/10 text-github-danger-fg'
              }`}
            >
              {contract.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
