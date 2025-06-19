/**
 * 汇率服务
 * 使用 Binance API 获取加密货币的实时汇率
 */

export interface ExchangeRate {
  symbol: string;
  price: string;
}

export interface CurrencyRate {
  [currencyId: string]: number; // 相对于 USDC 的汇率
}

// Binance API 符号映射
const BINANCE_SYMBOLS: Record<string, string> = {
  eth: 'ETHUSDC',
  sol: 'SOLUSDC',
  usdc: 'USDCUSDT', // USDC 相对于 USDT 的汇率，通常接近 1
  phrs: '', // Pharos 可能在 Binance 上没有交易对，需要特殊处理
};

/**
 * 从 Binance API 获取单个交易对的价格
 */
async function fetchBinancePrice(symbol: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch price for ${symbol}:`, response.status);
      return null;
    }

    const data: ExchangeRate = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return null;
  }
}

/**
 * 获取多个货币相对于 USDC 的汇率
 */
export async function fetchCurrencyRates(currencyIds: string[]): Promise<CurrencyRate> {
  const rates: CurrencyRate = {};
  
  // 并行获取所有汇率
  const promises = currencyIds.map(async (currencyId) => {
    const symbol = BINANCE_SYMBOLS[currencyId];
    
    if (!symbol) {
      // 对于没有 Binance 交易对的货币，返回默认值
      if (currencyId === 'phrs') {
        // Pharos 代币，假设汇率为 0.1 USDC（需要根据实际情况调整）
        rates[currencyId] = 0.1;
      }
      return;
    }

    if (currencyId === 'usdc') {
      // USDC 相对于自己的汇率是 1
      rates[currencyId] = 1;
      return;
    }

    const price = await fetchBinancePrice(symbol);
    if (price !== null) {
      rates[currencyId] = price;
    } else {
      // 如果获取失败，使用备用汇率
      const fallbackRates: Record<string, number> = {
        eth: 2000, // ETH 备用价格
        sol: 50,   // SOL 备用价格
        usdc: 1,   // USDC 始终为 1
        phrs: 0.1, // PHRS 备用价格
      };
      rates[currencyId] = fallbackRates[currencyId] || 1;
    }
  });

  await Promise.all(promises);
  return rates;
}

/**
 * 将加密货币金额转换为美元金额
 */
export function convertToUSD(amount: number, currencyId: string, rates: CurrencyRate): number {
  const rate = rates[currencyId];
  if (!rate) {
    console.warn(`No rate found for currency: ${currencyId}`);
    return amount; // 如果没有汇率，返回原始金额
  }
  
  return amount * rate;
}

/**
 * 将美元金额转换为加密货币金额
 */
export function convertFromUSD(usdAmount: number, currencyId: string, rates: CurrencyRate): number {
  const rate = rates[currencyId];
  if (!rate || rate === 0) {
    console.warn(`No rate found for currency: ${currencyId}`);
    return usdAmount; // 如果没有汇率，返回原始金额
  }
  
  return usdAmount / rate;
}

/**
 * 缓存汇率数据
 */
class ExchangeRateCache {
  private cache: Map<string, { rates: CurrencyRate; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60 * 1000; // 1分钟缓存

  async getRates(currencyIds: string[]): Promise<CurrencyRate> {
    const cacheKey =  [...currencyIds].sort().join(',');
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.rates;
    }

    const rates = await fetchCurrencyRates(currencyIds);
    this.cache.set(cacheKey, { rates, timestamp: Date.now() });
    
    return rates;
  }

  clear(): void {
    this.cache.clear();
  }
}

// 导出缓存实例
export const exchangeRateCache = new ExchangeRateCache();

/**
 * 获取缓存的汇率（推荐使用）
 */
export async function getCachedCurrencyRates(currencyIds: string[]): Promise<CurrencyRate> {
  return exchangeRateCache.getRates(currencyIds);
}
