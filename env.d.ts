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
