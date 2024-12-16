/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  interface Window {
    ethereum?: any // Ethereum provider
    workbox?: any // Workbox for service workers
  }

  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PRIVY_APP_ID: string
      NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: string
      // Add other env variables here
    }
  }

  interface SVGElement extends Element {
    classList: DOMTokenList
  }
}

// Allow importing JSON files
declare module '*.json' {
  const value: any
  export default value
}

export {}
