'use client'

import React from 'react'
import { usePrivy } from '@privy-io/react-auth'
import Link from 'next/link'

export default function LandingPage() {
  const { login } = usePrivy()

  return <div className='container mx-auto px-4'>{/* ... rest of the component */}</div>
}
