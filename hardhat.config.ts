import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-ethers' // Ensure this is imported
import 'dotenv/config'

const config: HardhatUserConfig = {
  defaultNetwork: 'baseSepolia',
  networks: {
    baseSepolia: {
      url: process.env.RPC_URL || '',
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  solidity: '0.8.20',
}

export default config
