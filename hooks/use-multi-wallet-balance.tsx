'use client'

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';

// USDC contract address on Ethereum sepolia testnet  
const USDC_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_USDC_CONTRACT_ADDRESS || '';

interface TokenBalance {
  balance: string | null;
  isLoading: boolean;
  error: string | null;
}

interface MultiWalletBalanceResult {
  balances: { [key: string]: TokenBalance };
  refreshBalances: () => void;
}

export function useMultiWalletBalance(network: string): MultiWalletBalanceResult {
  const { address, isConnected } = useAccount();
  const [phantomBalance, setPhantomBalance] = useState<string | null>(null);
  const [phantomLoading, setPhantomLoading] = useState(false);
  const [phantomError, setPhantomError] = useState<string | null>(null);
  const [isPhantomConnected, setIsPhantomConnected] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Manual refresh function
  const refreshBalances = () => {
    console.log('Manually refreshing balances');
    setRefreshTrigger(prev => prev + 1);
  };

  // Check Phantom connection status
  useEffect(() => {
    const checkPhantomConnection = () => {
      if (typeof window !== 'undefined' && (window as any)?.phantom?.solana) {
        const isConnected = (window as any).phantom.solana.isConnected;
        console.log('Phantom connection status:', isConnected);
        setIsPhantomConnected(isConnected);
        
        // Listen for connection events
        (window as any).phantom.solana.on('connect', () => {
          console.log('Phantom wallet connected event');
          setIsPhantomConnected(true);
        });

        (window as any).phantom.solana.on('disconnect', () => {
          console.log('Phantom wallet disconnected event');
          setIsPhantomConnected(false);
        });
      }
    };

    checkPhantomConnection();
    
    // Also check periodically in case the connection state changes
    const interval = setInterval(checkPhantomConnection, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Wagmi balance hook for Ethereum (USDC)
  const {
    data: ethereumBalance,
    isLoading: ethereumLoading,
    error: ethereumError,
  } = useBalance({
    address: address,
    token: network === 'ethereum' ? USDC_CONTRACT_ADDRESS : undefined,
    query: {
      enabled: isConnected && network === 'ethereum',
      refetchInterval: 10000, // Refetch every 10 seconds
    },
  });

  // Fetch Solana balance
  useEffect(() => {
    async function fetchSolanaBalance() {
      console.log('fetchSolanaBalance called with:', { network, isPhantomConnected });
      
      if (network !== 'solana') {
        console.log('Network is not solana, skipping');
        setPhantomBalance(null);
        setPhantomLoading(false);
        setPhantomError(null);
        return;
      }

      // Check if Phantom is available and connected
      const phantom = (window as any)?.phantom?.solana;
      if (!phantom) {
        console.log('Phantom wallet not available');
        setPhantomBalance(null);
        setPhantomLoading(false);
        setPhantomError('Phantom wallet not available');
        return;
      }

      const actuallyConnected = phantom.isConnected;
      console.log('Phantom actual connection status:', actuallyConnected);
      
      if (!actuallyConnected) {
        console.log('Phantom wallet not connected, skipping balance fetch');
        setPhantomBalance(null);
        setPhantomLoading(false);
        setPhantomError(null);
        return;
      }

      try {
        setPhantomLoading(true);
        setPhantomError(null);

        const publicKey = phantom.publicKey;
        if (!publicKey) {
          throw new Error('No public key found');
        }

        console.log('Fetching Solana balance for public key:', publicKey.toString());

        // Use a public Solana RPC endpoint
        const response = await fetch('https://api.devnet.solana.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'getBalance',
            params: [publicKey.toString()],
          }),
        });

        const data = await response.json();
        console.log('Solana RPC response:', data);
        
        if (data.error) {
          throw new Error(data.error.message);
        }

        // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
        const lamports = data.result.value;
        const solBalance = (lamports / 1_000_000_000).toFixed(6);
        console.log('SOL balance:', solBalance);
        setPhantomBalance(solBalance);
      } catch (error: any) {
        console.error('Error fetching Solana balance:', error);
        setPhantomError(error.message || 'Failed to fetch balance');
        setPhantomBalance(null);
      } finally {
        setPhantomLoading(false);
      }
    }

    fetchSolanaBalance();
  }, [network, isPhantomConnected, refreshTrigger]);

  // Return balances for different tokens
  const balances: { [key: string]: TokenBalance } = {};

  if (network === 'ethereum') {
    balances.usdc = {
      balance: ethereumBalance ? formatUnits(ethereumBalance.value, ethereumBalance.decimals) : null,
      isLoading: ethereumLoading,
      error: ethereumError?.message || null,
    };
  }

  if (network === 'solana') {
    balances.sol = {
      balance: phantomBalance,
      isLoading: phantomLoading,
      error: phantomError,
    };
  }

  return { balances, refreshBalances };
}
