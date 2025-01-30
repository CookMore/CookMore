'use client'

import { useState, useEffect, Suspense } from 'react'
import { useProfile } from '@/app/[locale]/(authenticated)/profile/components/hooks/core/useProfile'
import { ROLES } from '@/app/[locale]/(authenticated)/profile/constants/roles'
import { hasRequiredRole } from '@/app/[locale]/(authenticated)/profile/utils/role-utils'
import { getContracts } from '@/app/api/blockchain/server/getContracts'
import { createPublicClient, http } from 'viem'
import { baseSepolia, base } from 'viem/chains'
import { cn } from '@/app/api/utils/utils'
import { useTheme } from '@/app/api/providers/core/ThemeProvider'

interface ContractStatus {
  name: string
  address: string
  status: 'active' | 'paused' | 'unknown'
}

function SystemStatusSkeleton() {
  return (
    <div className='space-y-4'>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className='flex justify-between items-center p-3 bg-github-canvas-subtle rounded-md animate-pulse'
        >
          <div className='space-y-2'>
            <div className='h-5 w-32 bg-github-fg-muted/20 rounded' />
            <div className='h-4 w-64 bg-github-fg-muted/20 rounded' />
          </div>
          <div className='h-6 w-16 bg-github-fg-muted/20 rounded-full' />
        </div>
      ))}
    </div>
  )
}

export default function SystemStatus() {
  const { profile } = useProfile()
  const [contracts, setContracts] = useState<ContractStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [hasAccess, setHasAccess] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    if (profile?.owner) {
      hasRequiredRole(profile.owner, ROLES.ADMIN).then(setHasAccess)
    }
  }, [profile?.owner])

  useEffect(() => {
    const checkContracts = async () => {
      try {
        const { profileContract, tierContract, accessControlContract } = await getContracts()
        const chain = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? base : baseSepolia
        const publicClient = createPublicClient({
          chain,
          transport: http(),
        })

        const contractList = [
          {
            name: 'Profile Registry',
            contract: profileContract,
            hasPause: true,
          },
          {
            name: 'Tier NFT',
            contract: tierContract,
            hasPause: true,
          },
          {
            name: 'Access Control',
            contract: accessControlContract,
            hasPause: false,
          },
        ]

        const statuses = await Promise.all(
          contractList.map(async ({ name, contract, hasPause }) => {
            try {
              let status: ContractStatus['status'] = 'active'

              if (hasPause) {
                const isPaused = await publicClient.readContract({
                  address: contract.address,
                  abi: contract.abi,
                  functionName: 'paused',
                })
                status = isPaused ? 'paused' : 'active'
              }

              return {
                name,
                address: contract.address,
                status: status as 'active' | 'paused' | 'unknown',
              }
            } catch (error) {
              console.error(`Error checking ${name} status:`, error)
              return {
                name,
                address: contract.address,
                status: 'unknown' as const,
              }
            }
          })
        )

        setContracts(statuses)
      } catch (error) {
        console.error('Error checking contract statuses:', error)
      } finally {
        setLoading(false)
      }
    }

    if (hasAccess) {
      checkContracts()
    }
  }, [hasAccess])

  // Role check
  if (!hasAccess) {
    return null
  }

  return (
    <Suspense fallback={<SystemStatusSkeleton />}>
      <div
        className={cn(
          'p-4 rounded-lg',
          'bg-github-canvas-default',
          'border border-github-border-default',
          theme === 'neo' && 'neo-border neo-shadow'
        )}
      >
        <h2
          className={cn(
            'text-xl font-semibold mb-4',
            'text-github-fg-default',
            theme === 'neo' && 'font-mono tracking-tight'
          )}
        >
          System Status
        </h2>
        <div className='space-y-4'>
          <div className='grid gap-3'>
            {contracts.map((contract) => (
              <div
                key={`${contract.name}-${contract.address}`}
                className={cn(
                  'flex justify-between items-center p-3 rounded-md',
                  'bg-github-canvas-subtle',
                  theme === 'neo' && 'neo-border'
                )}
              >
                <div>
                  <div
                    className={cn(
                      'font-medium',
                      'text-github-fg-default',
                      theme === 'neo' && 'font-mono'
                    )}
                  >
                    {contract.name}
                  </div>
                  <div
                    className={cn('text-xs text-github-fg-muted', theme === 'neo' && 'font-mono')}
                  >
                    {contract.address}
                  </div>
                </div>
                <div
                  className={cn(
                    'px-2 py-1 rounded-full text-xs',
                    contract.status === 'active' &&
                      'bg-github-success-emphasis/10 text-github-success-fg',
                    contract.status === 'paused' &&
                      'bg-github-warning-emphasis/10 text-github-warning-fg',
                    contract.status === 'unknown' &&
                      'bg-github-danger-emphasis/10 text-github-danger-fg',
                    theme === 'neo' && 'font-mono'
                  )}
                >
                  {contract.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  )
}
