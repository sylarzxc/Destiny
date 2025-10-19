// =============================================================
// Crypto Prices Service - CoinGecko API Integration
// =============================================================

import { useState, useEffect, useCallback } from 'react';

export interface CryptoPrices {
  ethereum: { usd: number; usd_24h_change: number };
  bitcoin: { usd: number; usd_24h_change: number };
  tether: { usd: number; usd_24h_change: number };
  binancecoin: { usd: number; usd_24h_change: number };
  'matic-network': { usd: number; usd_24h_change: number };
}

export interface CryptoPriceMap {
  ETH: number;
  BTC: number;
  USDT: number;
  BNB: number;
  MATIC: number;
}

export interface CryptoChangeMap {
  ETH: number;
  BTC: number;
  USDT: number;
  BNB: number;
  MATIC: number;
}

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const CACHE_KEY = 'crypto_prices_cache';
const CACHE_DURATION = 180000; // 3 minutes in milliseconds

// CoinGecko IDs mapping
const COIN_IDS = {
  ETH: 'ethereum',
  BTC: 'bitcoin', 
  USDT: 'tether',
  BNB: 'binancecoin',
  MATIC: 'matic-network'
} as const;

// Convert CoinGecko response to our format
function convertPricesToMap(prices: CryptoPrices): CryptoPriceMap {
  return {
    ETH: prices.ethereum?.usd || 0,
    BTC: prices.bitcoin?.usd || 0,
    USDT: prices.tether?.usd || 0,
    BNB: prices.binancecoin?.usd || 0,
    MATIC: prices['matic-network']?.usd || 0,
  };
}

// Convert CoinGecko response to changes format
function convertChangesToMap(prices: CryptoPrices): CryptoChangeMap {
  return {
    ETH: prices.ethereum?.usd_24h_change || 0,
    BTC: prices.bitcoin?.usd_24h_change || 0,
    USDT: prices.tether?.usd_24h_change || 0,
    BNB: prices.binancecoin?.usd_24h_change || 0,
    MATIC: prices['matic-network']?.usd_24h_change || 0,
  };
}

// Check if cached data is still valid
function isCacheValid(cachedData: any): boolean {
  if (!cachedData || !cachedData.timestamp) return false;
  return Date.now() - cachedData.timestamp < CACHE_DURATION;
}

// Get cached prices from localStorage
function getCachedPrices(): CryptoPriceMap | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    
    const parsed = JSON.parse(cached);
    if (isCacheValid(parsed)) {
      return parsed.prices;
    }
    
    return null;
  } catch (error) {
    console.error('Error reading cached prices:', error);
    return null;
  }
}

// Save prices to localStorage cache
function savePricesToCache(prices: CryptoPriceMap): void {
  try {
    const cacheData = {
      prices,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving prices to cache:', error);
  }
}

// Fetch fresh prices from CoinGecko API
async function fetchCryptoPrices(): Promise<{ prices: CryptoPriceMap; changes: CryptoChangeMap }> {
  const coinIds = Object.values(COIN_IDS).join(',');
  const url = `${COINGECKO_API_URL}?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data: CryptoPrices = await response.json();
  return {
    prices: convertPricesToMap(data),
    changes: convertChangesToMap(data)
  };
}

// Main hook for using crypto prices
export function useCryptoPrices() {
  const [prices, setPrices] = useState<CryptoPriceMap>({
    ETH: 0,
    BTC: 0,
    USDT: 0,
    BNB: 0,
    MATIC: 0,
  });
  const [changes, setChanges] = useState<CryptoChangeMap>({
    ETH: 0,
    BTC: 0,
    USDT: 0,
    BNB: 0,
    MATIC: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPrices = useCallback(async () => {
    try {
      setError(null);
      
      // Try to get cached prices first
      const cachedPrices = getCachedPrices();
      if (cachedPrices) {
        setPrices(cachedPrices);
        setLoading(false);
        return;
      }
      
      // Fetch fresh prices from API
      const { prices: freshPrices, changes: freshChanges } = await fetchCryptoPrices();
      setPrices(freshPrices);
      setChanges(freshChanges);
      setLastUpdated(new Date());
      
      // Save to cache
      savePricesToCache(freshPrices);
      
    } catch (err) {
      console.error('Error in fetchPrices:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch prices');
      
      // Try to use cached prices even if expired as fallback
      const cachedPrices = getCachedPrices();
      if (cachedPrices) {
        setPrices(cachedPrices);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshPrices = useCallback(async () => {
    setLoading(true);
    await fetchPrices();
  }, [fetchPrices]);

  useEffect(() => {
    fetchPrices();
    
    // Set up interval for automatic refresh every 3 minutes
    const interval = setInterval(fetchPrices, CACHE_DURATION);
    
    return () => clearInterval(interval);
  }, [fetchPrices]);

  return {
    prices,
    changes,
    loading,
    error,
    lastUpdated,
    refreshPrices,
  };
}

// Utility function to get price for specific currency
export function getCryptoPrice(prices: CryptoPriceMap, currency: string): number {
  const upperCurrency = currency.toUpperCase() as keyof CryptoPriceMap;
  return prices[upperCurrency] || 0;
}

// Utility function to get price change for specific currency
export function getCryptoChange(changes: CryptoChangeMap, currency: string): number {
  const upperCurrency = currency.toUpperCase() as keyof CryptoChangeMap;
  return changes[upperCurrency] || 0;
}

// Utility function to format crypto price
export function formatCryptoPrice(price: number): string {
  return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

