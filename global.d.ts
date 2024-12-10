/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare global {
  interface Window {
    ethereum?: any;
    workbox?: any;
  }

  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_PRIVY_APP_ID: string;
      NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID: string;
      // Add other env variables here
    }
  }

  interface SVGElement extends Element {
    classList: DOMTokenList;
  }
}

export {};
