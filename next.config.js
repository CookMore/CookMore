/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
})

const withNextIntl = require('next-intl/plugin')()

const nextConfig = {
  env: {
    // Existing env vars
    NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
    NEXT_PUBLIC_INFURA_API_KEY: process.env.NEXT_PUBLIC_INFURA_API_KEY,
    NEXT_PUBLIC_PINATA_API_KEY: process.env.NEXT_PUBLIC_PINATA_API_KEY,
    NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,

    // New Coinbase Wallet vars
    NEXT_PUBLIC_COINBASE_APP_NAME: process.env.NEXT_PUBLIC_COINBASE_APP_NAME,
    NEXT_PUBLIC_COINBASE_APP_LOGO_URL: process.env.NEXT_PUBLIC_COINBASE_APP_LOGO_URL,

    // Chain configuration
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_NETWORK: process.env.NEXT_PUBLIC_NETWORK,
    NEXT_PUBLIC_BASE_RPC_URL: process.env.NEXT_PUBLIC_BASE_RPC_URL,
    NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL: process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL,
  },
  images: {
    domains: [
      'ipfs.io',
      'gateway.pinata.cloud',
      'explorer-api.walletconnect.com',
      'dynamic-assets.coinbase.com',
      'www.coinbase.com',
    ],
    unoptimized: true,
  },
  async headers() {
    // Different CSP for development and production
    const isDev = process.env.NODE_ENV === 'development'

    const CSP = isDev
      ? // Development CSP - more permissive
        `
          default-src 'self' 'unsafe-eval' 'unsafe-inline';
          script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.privy.io https://*.coinbase.com https://*.walletconnect.com;
          style-src 'self' 'unsafe-inline';
          img-src 'self' blob: data: https: http:;
          font-src 'self' data:;
          connect-src 'self' https: wss: http: ws:;
          frame-src 'self' https://*.privy.io https://*.coinbase.com;
          frame-ancestors 'none';
          form-action 'self';
        `
      : // Production CSP - more restrictive
        `
          default-src 'self';
          script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.privy.io https://*.coinbase.com https://*.walletconnect.com;
          style-src 'self' 'unsafe-inline';
          img-src 'self' blob: data: 
            https://*.privy.io 
            https://ipfs.io 
            https://gateway.pinata.cloud
            https://*.walletconnect.com
            https://explorer-api.walletconnect.com
            https://dynamic-assets.coinbase.com
            https://*.coinbase.com;
          font-src 'self';
          connect-src 'self' 
            ${process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL || ''} 
            https://*.privy.io 
            https://ipfs.infura.io 
            wss://*.walletconnect.com 
            https://*.walletconnect.com
            https://pulse.walletconnect.org
            https://explorer-api.walletconnect.com
            https://*.coinbase.com
            wss://*.coinbase.com;
          frame-src 'self' https://*.privy.io https://*.coinbase.com;
          frame-ancestors 'none';
          form-action 'self';
        `

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: CSP.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'Set-Cookie',
            value: isDev ? 'SameSite=Lax' : 'SameSite=None; Secure',
          },
        ],
      },
    ]
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    config.module.rules.push({
      test: /\.(mp3|aac|wav)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static/sounds/',
          publicPath: '/_next/static/sounds/',
        },
      },
    })
    return config
  },
  // Next.js 15 specific options
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'cookmore.xyz'],
    },
  },
  // External packages configuration
  serverExternalPackages: ['ethers'],
  // Hybrid rendering settings
  output: 'standalone',
  poweredByHeader: false,
}

module.exports = withNextIntl(withPWA(nextConfig))
