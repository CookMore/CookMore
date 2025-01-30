// src/app/[locale]/(authenticated)/jobs/services/server/payForJob.ts

import { ethers } from 'ethers'
import { usdcABI } from '@/app/api/blockchain/abis/usdc'

// Import parseUnits from ethers.utils
const { parseUnits } = ethers.utils

const USDC_DECIMALS = 6
const USDC_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || ''
const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS || ''

export async function payForJob(signer: ethers.Signer, priceUSD: number) {
  const usdcContract = new ethers.Contract(USDC_ADDRESS, usdcABI, signer)
  const amountInTokens = parseUnits(priceUSD.toString(), USDC_DECIMALS)

  const tx = await usdcContract.transfer(ADMIN_ADDRESS, amountInTokens)
  return await tx.wait()
}
