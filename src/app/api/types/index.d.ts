/// <reference types="react" />
/// <reference types="react-dom" />

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module '@privy-io/react-auth' {
  export interface PrivyClientConfig {
    loginMethods: string[];
    appearance: {
      theme: string;
      accentColor: string;
    };
  }

  export interface User {
    email?: string;
    // Add other user properties as needed
  }

  export interface PrivyInterface {
    login: () => Promise<void>;
    logout: () => Promise<void>;
    authenticated: boolean;
    user: User | null;
  }

  export function usePrivy(): PrivyInterface;
  
  export function PrivyProvider(props: {
    appId: string;
    config: PrivyClientConfig;
    children: React.ReactNode;
  }): JSX.Element;
} 