declare namespace NodeJS {
  interface ProcessEnv {
    DB: D1Database; // Or the specific type for your binding
    TIDB_CLOUD_API_KEY?: string; // TiDB Cloud API key
    TIDB_CLOUD_ENDPOINT?: string; // TiDB Cloud endpoint
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID?: string; // WalletConnect project ID
    NEXT_PUBLIC_APP_VERSION?: string; // App version
  }
}

declare global {
  interface Window {
    ethereum?: any; // 或者更具体的类型
    phantom?: {
      solana?: {
        isConnected: boolean;
        publicKey: {
          toString(): string;
        };
        signAndSendTransaction(transaction: any): Promise<{
          signature: string;
        }>;
        connect(): Promise<void>;
        disconnect(): Promise<void>;
      };
    };
  }
}

declare module "*.md" {
  const content: string
  export default content
}
