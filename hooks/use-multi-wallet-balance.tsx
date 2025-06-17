'use client'

import { useState, useEffect } from 'react';
import { useAccount, useBalance } from 'wagmi';
import { formatUnits } from 'viem';
import { BLOCKCHAIN_CONFIG } from '@/config/blockchain';

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
  const [solanaBalances, setSolanaBalances] = useState<{ [key: string]: TokenBalance }>({});
  const [isPhantomConnected, setIsPhantomConnected] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  console.log('useMultiWalletBalance called with:', { network, address, isConnected });

  // Manual refresh function
  const refreshBalances = () => {
    console.log('Manually refreshing balances');
    setRefreshTrigger(prev => prev + 1);
  };

  // Check Phantom connection status
  useEffect(() => {
    const handleConnect = () => {
      console.log('Phantom wallet connected event');
      setIsPhantomConnected(true);
    };

    const handleDisconnect = () => {
      console.log('Phantom wallet disconnected event');
      setIsPhantomConnected(false);
    };

    const checkPhantomConnection = () => {
      if (typeof window !== 'undefined' && window?.phantom?.solana) {
        const phantom = window.phantom.solana;
        const isConnected = phantom.isConnected;
        console.log('Phantom connection status:', isConnected);
        setIsPhantomConnected(isConnected);

        // Listen for connection events
        phantom.on('connect', handleConnect);
        phantom.on('disconnect', handleDisconnect);
      }
    };

    checkPhantomConnection();

    // Cleanup event listeners on unmount
    return () => {
      if (typeof window !== 'undefined' && window?.phantom?.solana) {
        const phantom = window.phantom.solana;
        phantom.off('connect', handleConnect);
        phantom.off('disconnect', handleDisconnect);
      }
    };
  }, []);

  // 获取当前网络配置
  const currentNetwork = BLOCKCHAIN_CONFIG.networks[network as keyof typeof BLOCKCHAIN_CONFIG.networks];
  const isEVMNetwork = currentNetwork?.type === 'ethereum';
  const isSolanaNetwork = currentNetwork?.type === 'solana';

  console.log('Network analysis:', { 
    network, 
    currentNetwork: currentNetwork?.name, 
    isEVMNetwork, 
    isSolanaNetwork 
  });
  // 获取当前网络支持的所有代币
  const supportedCurrencies = Object.values(BLOCKCHAIN_CONFIG.currencies).filter(currency =>
    currency.networks.some(n => n.networkId === network)
  );

  console.log('Supported currencies for network:', { network, supportedCurrencies: supportedCurrencies.map(c => c.id) });

  // 动态创建余额查询 hooks
  const balanceQueries = supportedCurrencies.map(currency => {
    const networkConfig = currency.networks.find(n => n.networkId === network);
    const isNative = networkConfig?.isNative;
    const contractAddress = networkConfig?.contractAddress;

    // 对于 EVM 网络的原生代币，使用无 token 参数的 useBalance
    // 对于 ERC20 代币，使用带 token 参数的 useBalance
    const balanceHook = useBalance({
      address: address,
      token: isNative ? undefined : (contractAddress as `0x${string}` | undefined),
      query: {
        enabled: isConnected && isEVMNetwork && (isNative || !!contractAddress),
        refetchInterval: 10000,
      },
    });

    return {
      currencyId: currency.id,
      isNative,
      contractAddress,
      ...balanceHook,
    };
  });

  // Fetch Solana balances (both SOL and SPL tokens like USDC)
  useEffect(() => {
    async function fetchSolanaBalances() {
      console.log('fetchSolanaBalances called with:', { network, isPhantomConnected, isSolanaNetwork });

      if (!isSolanaNetwork) {
        console.log('Network is not solana type, skipping');
        setSolanaBalances({});
        return;
      }

      // 在 useEffect 内部重新计算 supportedCurrencies，避免依赖数组问题
      const supportedCurrenciesForSolana = Object.values(BLOCKCHAIN_CONFIG.currencies).filter(currency =>
        currency.networks.some(n => n.networkId === network)
      );

      // Check if Phantom is available and connected
      const phantom = window?.phantom?.solana;
      if (!phantom) {
        console.log('Phantom wallet not available');
        const errorBalances: { [key: string]: TokenBalance } = {};
        supportedCurrenciesForSolana.forEach(currency => {
          if (currency.networks.some(n => n.networkId === network)) {
            errorBalances[currency.id] = {
              balance: null,
              isLoading: false,
              error: 'Phantom wallet not available',
            };
          }
        });
        setSolanaBalances(errorBalances);
        return;
      }

      const actuallyConnected = phantom.isConnected;
      console.log('Phantom actual connection status:', actuallyConnected);

      if (!actuallyConnected) {
        console.log('Phantom wallet not connected, skipping balance fetch');
        const emptyBalances: { [key: string]: TokenBalance } = {};
        supportedCurrenciesForSolana.forEach(currency => {
          if (currency.networks.some(n => n.networkId === network)) {
            emptyBalances[currency.id] = {
              balance: null,
              isLoading: false,
              error: null,
            };
          }
        });
        setSolanaBalances(emptyBalances);
        return;
      }

      try {
        // Set loading state for all supported currencies
        const loadingBalances: { [key: string]: TokenBalance } = {};
        supportedCurrenciesForSolana.forEach(currency => {
          if (currency.networks.some(n => n.networkId === network)) {
            loadingBalances[currency.id] = {
              balance: null,
              isLoading: true,
              error: null,
            };
          }
        });
        setSolanaBalances(loadingBalances);

        const publicKey = phantom.publicKey;
        if (!publicKey) {
          throw new Error('No public key found');
        }

        console.log('Fetching Solana balances for public key:', publicKey.toString());

        const rpcUrl = currentNetwork?.rpcUrl || 'https://api.devnet.solana.com';
        const newBalances: { [key: string]: TokenBalance } = {};

        // Fetch balances for each supported currency on this network
        for (const currency of supportedCurrenciesForSolana) {
          const networkConfig = currency.networks.find(n => n.networkId === network);
          if (!networkConfig) continue;

          try {
            if (networkConfig.isNative) {
              // Fetch SOL balance
              const response = await fetch(rpcUrl, {
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
              console.log('SOL balance RPC response:', data);

              if (data.error) {
                throw new Error(data.error.message);
              }

              // Convert lamports to SOL (1 SOL = 1,000,000,000 lamports)
              const lamports = data.result.value;
              const solBalance = (lamports / Math.pow(10, currency.decimals)).toFixed(6);
              console.log('SOL balance:', solBalance);

              newBalances[currency.id] = {
                balance: solBalance,
                isLoading: false,
                error: null,
              };
            } else if (networkConfig.contractAddress) {
              // Fetch SPL Token balance (like USDC)
              const response = await fetch(rpcUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  jsonrpc: '2.0',
                  id: 1,
                  method: 'getTokenAccountsByOwner',
                  params: [
                    publicKey.toString(),
                    {
                      mint: networkConfig.contractAddress,
                    },
                    {
                      encoding: 'jsonParsed',
                    },
                  ],
                }),
              });

              const data = await response.json();
              console.log(`${currency.symbol} balance RPC response:`, data);

              if (data.error) {
                throw new Error(data.error.message);
              }

              let tokenBalance = '0';
              if (data.result && data.result.value && data.result.value.length > 0) {
                // Get the balance from the first token account
                const tokenAccount = data.result.value[0];
                const balance = tokenAccount.account.data.parsed.info.tokenAmount.uiAmount;
                tokenBalance = balance ? balance.toString() : '0';
              }

              console.log(`${currency.symbol} balance:`, tokenBalance);

              newBalances[currency.id] = {
                balance: tokenBalance,
                isLoading: false,
                error: null,
              };
            }
          } catch (error: any) {
            console.error(`Error fetching ${currency.symbol} balance:`, error);
            newBalances[currency.id] = {
              balance: null,
              isLoading: false,
              error: error.message || `Failed to fetch ${currency.symbol} balance`,
            };
          }
        }

        setSolanaBalances(newBalances);      
      } catch (error: any) {
        console.error('Error fetching Solana balances:', error);
        const errorBalances: { [key: string]: TokenBalance } = {};
        supportedCurrenciesForSolana.forEach(currency => {
          if (currency.networks.some(n => n.networkId === network)) {
            errorBalances[currency.id] = {
              balance: null,
              isLoading: false,
              error: error.message || 'Failed to fetch balance',
            };
          }
        });
        setSolanaBalances(errorBalances);
      }
    }

    fetchSolanaBalances();
  }, [network, isPhantomConnected, refreshTrigger, isSolanaNetwork, currentNetwork?.rpcUrl]);

  // 构建最终的余额对象
  const balances: { [key: string]: TokenBalance } = {};

  console.log('Balance queries result:', balanceQueries.map(q => ({
    currencyId: q.currencyId,
    isNative: q.isNative,
    contractAddress: q.contractAddress,
    data: q.data ? formatUnits(q.data.value, q.data.decimals) : null,
    isLoading: q.isLoading,
    error: q.error?.message
  })));

  // 添加 EVM 网络的代币余额（原生币和 ERC20）
  if (isEVMNetwork) {
    balanceQueries.forEach(query => {
      if (query.data) {
        balances[query.currencyId] = {
          balance: formatUnits(query.data.value, query.data.decimals),
          isLoading: query.isLoading,
          error: query.error?.message || null,
        };
      } else {
        // 即使没有余额数据，也要记录 loading 和 error 状态
        balances[query.currencyId] = {
          balance: null,
          isLoading: query.isLoading,
          error: query.error?.message || null,
        };
      }
    });
  }
  // 添加 Solana 余额
  if (isSolanaNetwork) {
    // 直接使用 solanaBalances 中的所有余额
    Object.assign(balances, solanaBalances);
  }

  console.log('Final balances:', balances);

  return { balances, refreshBalances };
}
