// 全局类型扩展
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isConnected: boolean;
        publicKey: any;
        connect: () => Promise<void>;
        disconnect: () => Promise<void>;
        signAndSendTransaction: (transaction: any) => Promise<{ signature: string }>;
        on: (event: string, callback: () => void) => void;
        off: (event: string, callback: () => void) => void;
      };
    };
  }
}

export {};
