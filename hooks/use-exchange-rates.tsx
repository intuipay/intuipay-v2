import { useState, useEffect, useCallback } from 'react';
import { getCachedCurrencyRates, CurrencyRate, convertToUSD, convertFromUSD } from '@/services/exchange-rate';
import { BLOCKCHAIN_CONFIG } from '@/config/blockchain';

/**
 * 汇率管理 Hook
 * 自动获取和缓存汇率数据，提供货币转换功能
 */
export function useExchangeRates(networkId?: string) {
  const [rates, setRates] = useState<CurrencyRate>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 获取当前网络支持的所有货币ID
  const getSupportedCurrencyIds = useCallback((networkId?: string): string[] => {
    if (!networkId) {
      return Object.keys(BLOCKCHAIN_CONFIG.currencies);
    }
    
    return Object.values(BLOCKCHAIN_CONFIG.currencies)
      .filter(currency => 
        currency.networks.some(network => network.networkId === networkId)
      )
      .map(currency => currency.id);
  }, []);

  // 获取汇率数据
  const fetchRates = useCallback(async (currencyIds?: string[]) => {
    if (!currencyIds || currencyIds.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newRates = await getCachedCurrencyRates(currencyIds);
      setRates(newRates);
      setLastUpdated(new Date());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'fetch rates failed';
      setError(errorMessage);
      console.error('Failed to fetch exchange rates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 当网络改变时，自动获取汇率
  useEffect(() => {
    const currencyIds = getSupportedCurrencyIds(networkId);
    if (currencyIds.length > 0) {
      fetchRates(currencyIds);
    }
  }, [networkId, getSupportedCurrencyIds, fetchRates]);

  // 手动刷新汇率
  const refreshRates = useCallback(() => {
    const currencyIds = getSupportedCurrencyIds(networkId);
    fetchRates(currencyIds);
  }, [networkId, getSupportedCurrencyIds, fetchRates]);

  // 将加密货币金额转换为美元
  const toUSD = useCallback((amount: number, currencyId: string): number => {
    if (!amount || amount === 0) return 0;
    return convertToUSD(amount, currencyId, rates);
  }, [rates]);

  // 将美元金额转换为加密货币
  const fromUSD = useCallback((usdAmount: number, currencyId: string): number => {
    if (!usdAmount || usdAmount === 0) return 0;
    return convertFromUSD(usdAmount, currencyId, rates);
  }, [rates]);

  // 获取特定货币的汇率
  const getRate = useCallback((currencyId: string): number | null => {
    return rates[currencyId] || null;
  }, [rates]);

  // 检查汇率数据是否可用
  const hasRates = useCallback((currencyId?: string): boolean => {
    if (currencyId) {
      return currencyId in rates;
    }
    return Object.keys(rates).length > 0;
  }, [rates]);

  return {
    rates,
    loading,
    error,
    lastUpdated,
    refreshRates,
    toUSD,
    fromUSD,
    getRate,
    hasRates,
  };
}
