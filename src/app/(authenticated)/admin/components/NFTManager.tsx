'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/ui/form/FormInput'
import { toast } from 'sonner'
import { PRO_NFT_ADDRESS, GROUP_NFT_ADDRESS } from '@/lib/web3/addresses'

export function NFTManager() {
  const [baseURI, setBaseURI] = useState('')
  const [loading, setLoading] = useState(false)

  const handleUpdateBaseURI = async () => {
    try {
      setLoading(true)
      toast.info('NFT base URI update functionality coming soon')
    } catch (error) {
      toast.error('Failed to update base URI')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h4 className='text-sm font-medium'>Contract Addresses</h4>
        <div className='text-xs text-github-fg-muted space-y-1'>
          <p>Pro NFT: {PRO_NFT_ADDRESS}</p>
          <p>Group NFT: {GROUP_NFT_ADDRESS}</p>
        </div>
      </div>

      <FormInput
        name='baseURI'
        label='Base URI'
        value={baseURI}
        onChange={(e) => setBaseURI(e.target.value)}
        placeholder='ipfs://'
      />

      <div className='flex gap-4'>
        <Button onClick={handleUpdateBaseURI} disabled={loading || !baseURI}>
          Update Base URI
        </Button>
      </div>
    </div>
  )
}
