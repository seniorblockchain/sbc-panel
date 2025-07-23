import axios from 'axios';
import type { TokenInfo } from '../types';

const SBC_CONTRACT_ADDRESS = 'EQBIQe_KkVxaJmga7LVgwvB8lcXbbfsqdziGgDXfD-zW4KU9';
const SBC_POOL_ADDRESS = 'EQB8b_5Mk0ztdQ1adF1lKCoyM1maNyFiuW9u07r0QvKgq2ir';
const TON_API_BASE = 'https://tonapi.io/v2';
const GECKO_TERMINAL_API = 'https://api.geckoterminal.com/api/v2';

// Types for new API responses
interface GeckoPoolData {
  data: {
    id: string;
    type: string;
    attributes: {
      base_token_price_usd: string;
      base_token_price_native_currency: string;
      quote_token_price_usd: string;
      quote_token_price_native_currency: string;
      base_token_price_quote_token: string;
      quote_token_price_base_token: string;
      address: string;
      name: string;
      pool_name: string;
      pool_fee_percentage: number | null;
      pool_created_at: string;
      fdv_usd: string;
      market_cap_usd: string | null;
      price_change_percentage: {
        m5: string;
        m15: string;
        m30: string;
        h1: string;
        h6: string;
        h24: string;
      };
      transactions: {
        [key: string]: {
          buys: number;
          sells: number;
          buyers: number;
          sellers: number;
        };
      };
      volume_usd: {
        [key: string]: string;
      };
      reserve_in_usd: string;
      locked_liquidity_percentage: number | null;
    };
  };
}

interface TonTokenData {
  mintable: boolean;
  total_supply: string;
  admin: {
    address: string;
    is_scam: boolean;
    is_wallet: boolean;
  };
  metadata: {
    address: string;
    name: string;
    symbol: string;
    decimals: string;
    image: string;
    description: string;
  };
  preview: string;
  verification: string;
  holders_count: number;
}

// Get SBC token basic information from TON API
export const getSBCTokenInfo = async (): Promise<TonTokenData> => {
  try {
    const response = await axios.get(`${TON_API_BASE}/jettons/${SBC_CONTRACT_ADDRESS}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SBC token info:', error);
    // Return fallback data
    return {
      mintable: true,
      total_supply: "25600000000000000",
      admin: {
        address: "0:f21890bd481829bba25bdec478f3135d11aa29f71711407ef24bf29a7f472c9e",
        is_scam: false,
        is_wallet: true
      },
      metadata: {
        address: "0:4841efca915c5a26681aecb560c2f07c95c5db6dfb2a7738868035df0fecd6e0",
        name: "Senior Blockchain Company",
        symbol: "SBC",
        decimals: "8",
        image: "https://avatars.githubusercontent.com/u/148452706",
        description: "Decentralize Everything"
      },
      preview: "https://cache.tonapi.io/imgproxy/wfg5x5kMXVvOXw2xG-BBLt3uunFqIw6aAfx5QeCJ6Uw/rs:fill:200:200:1/g:no/aHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE0ODQ1MjcwNg.webp",
      verification: "none",
      holders_count: 24
    };
  }
};

// Get SBC exchange data from GeckoTerminal
export const getSBCExchangeData = async (): Promise<GeckoPoolData> => {
  try {
    const response = await axios.get(`${GECKO_TERMINAL_API}/networks/ton/pools/${SBC_POOL_ADDRESS}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching SBC exchange data:', error);
    // Return fallback data
    return {
      data: {
        id: "ton_EQB8b_5Mk0ztdQ1adF1lKCoyM1maNyFiuW9u07r0QvKgq2ir",
        type: "pool",
        attributes: {
          base_token_price_usd: "0.006207233257",
          base_token_price_native_currency: "0.00194993696896155495849265248652759801962",
          quote_token_price_usd: "0.998581765980326",
          quote_token_price_native_currency: "0.312056801868852",
          base_token_price_quote_token: "0.006248660363",
          quote_token_price_base_token: "160.0343020498",
          address: "EQB8b_5Mk0ztdQ1adF1lKCoyM1maNyFiuW9u07r0QvKgq2ir",
          name: "SBC / USD₮",
          pool_name: "SBC / USD₮",
          pool_fee_percentage: null,
          pool_created_at: "2024-11-16T15:53:08Z",
          fdv_usd: "1589051.713792",
          market_cap_usd: null,
          price_change_percentage: {
            m5: "0",
            m15: "0",
            m30: "0",
            h1: "0",
            h6: "0",
            h24: "0"
          },
          transactions: {
            m5: { buys: 0, sells: 0, buyers: 0, sellers: 0 },
            m15: { buys: 0, sells: 0, buyers: 0, sellers: 0 },
            m30: { buys: 0, sells: 0, buyers: 0, sellers: 0 },
            h1: { buys: 0, sells: 0, buyers: 0, sellers: 0 },
            h6: { buys: 0, sells: 0, buyers: 0, sellers: 0 },
            h24: { buys: 0, sells: 0, buyers: 0, sellers: 0 }
          },
          volume_usd: {
            m5: "0.0",
            m15: "0.0",
            m30: "0.0",
            h1: "0.0",
            h6: "0.0",
            h24: "0.0"
          },
          reserve_in_usd: "247.3234",
          locked_liquidity_percentage: null
        }
      }
    };
  }
};

// Combined function for backward compatibility
export const getSBCFullData = async (): Promise<TokenInfo> => {
  try {
    const [tokenData, exchangeData] = await Promise.all([
      getSBCTokenInfo(),
      getSBCExchangeData()
    ]);

    const poolAttrs = exchangeData.data.attributes;
    
    return {
      name: tokenData.metadata?.name || 'Senior Blockchain Company',
      symbol: tokenData.metadata?.symbol || 'SBC',
      logo: tokenData.metadata?.image || tokenData.preview,
      price_usd: parseFloat(poolAttrs.base_token_price_usd) || 0,
      price_change_24h_percent: parseFloat(poolAttrs.price_change_percentage.h24) || 0,
      market_cap_usd: poolAttrs.market_cap_usd ? parseFloat(poolAttrs.market_cap_usd) : parseFloat(poolAttrs.fdv_usd) || 0,
      holders: tokenData.holders_count || 0,
      total_supply: tokenData.total_supply ? formatTokenAmount(tokenData.total_supply, parseInt(tokenData.metadata?.decimals || '8')) : '256,000,000 SBC',
      contract_address: SBC_CONTRACT_ADDRESS,
      decimals: parseInt(tokenData.metadata?.decimals || '8'),
      // Enhanced exchange data
      fdv: parseFloat(poolAttrs.fdv_usd) || undefined,
      liquidity_usd: parseFloat(poolAttrs.reserve_in_usd) || undefined,
      volume_24h: parseFloat(poolAttrs.volume_usd.h24) || undefined,
      volume_h6: parseFloat(poolAttrs.volume_usd.h6) || undefined,
      volume_h1: parseFloat(poolAttrs.volume_usd.h1) || undefined,
      volume_m5: parseFloat(poolAttrs.volume_usd.m5) || undefined,
      transactions_24h: poolAttrs.transactions.h24 ? {
        buys: poolAttrs.transactions.h24.buys || 0,
        sells: poolAttrs.transactions.h24.sells || 0
      } : undefined,
      transactions_h6: poolAttrs.transactions.h6 ? {
        buys: poolAttrs.transactions.h6.buys || 0,
        sells: poolAttrs.transactions.h6.sells || 0
      } : undefined,
      transactions_h1: poolAttrs.transactions.h1 ? {
        buys: poolAttrs.transactions.h1.buys || 0,
        sells: poolAttrs.transactions.h1.sells || 0
      } : undefined,
      transactions_m5: poolAttrs.transactions.m5 ? {
        buys: poolAttrs.transactions.m5.buys || 0,
        sells: poolAttrs.transactions.m5.sells || 0
      } : undefined,
      pair_created_at: poolAttrs.pool_created_at ? new Date(poolAttrs.pool_created_at).getTime() : undefined,
      pair_address: poolAttrs.address || undefined
    };
  } catch (error) {
    console.error('Error fetching SBC full data:', error);
    // Return mock data as fallback
    return {
      name: 'Senior Blockchain Company',
      symbol: 'SBC',
      logo: 'https://avatars.githubusercontent.com/u/148452706',
      price_usd: 0.006207,
      price_change_24h_percent: 0,
      market_cap_usd: 1589051,
      holders: 24,
      total_supply: '256,000,000 SBC',
      contract_address: SBC_CONTRACT_ADDRESS,
      decimals: 8
    };
  }
};

// Get real-time price for SBC token
export const getSBCPrice = async (): Promise<{ price: number; change24h: number }> => {
  try {
    const exchangeData = await getSBCExchangeData();
    const poolAttrs = exchangeData.data.attributes;
    
    return {
      price: parseFloat(poolAttrs.base_token_price_usd) || 0,
      change24h: parseFloat(poolAttrs.price_change_percentage.h24) || 0
    };
  } catch (error) {
    console.error('Error fetching price:', error);
    return { price: 0.006207, change24h: 0 };
  }
};

// Get TON balance for wallet
export const getTONBalance = async (address: string): Promise<number> => {
  try {
    const response = await axios.get(`${TON_API_BASE}/accounts/${address}`);
    const balance = response.data?.balance || 0;
    return balance / 1e9; // Convert from nanoTON to TON
  } catch (error) {
    console.error('Error fetching TON balance:', error);
    return 0;
  }
};

// Get SBC balance for wallet
export const getSBCBalance = async (address: string): Promise<number> => {
  try {
    const response = await axios.get(`${TON_API_BASE}/accounts/${address}/jettons/${SBC_CONTRACT_ADDRESS}`);
    const balance = response.data?.balance || 0;
    return balance / 1e9; // Adjust decimals
  } catch (error) {
    console.error('Error fetching SBC balance:', error);
    return 0;
  }
};

// Helper functions
export const formatTokenAmount = (amount: string | number, decimals: number = 9): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  const adjusted = num / Math.pow(10, decimals);
  return new Intl.NumberFormat('en-US').format(adjusted);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatVolume = (volume: number): string => {
  if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(2)}B`;
  } else if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(2)}M`;
  } else if (volume >= 1e3) {
    return `$${(volume / 1e3).toFixed(2)}K`;
  }
  return `$${volume.toFixed(2)}`;
};

export const formatLiquidity = (liquidity: number): string => {
  if (liquidity >= 1e6) {
    return `$${(liquidity / 1e6).toFixed(2)}M`;
  } else if (liquidity >= 1e3) {
    return `$${(liquidity / 1e3).toFixed(2)}K`;
  }
  return `$${liquidity.toFixed(2)}`;
};

export const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else if (marketCap >= 1e3) {
    return `$${(marketCap / 1e3).toFixed(2)}K`;
  }
  return `$${marketCap.toFixed(2)}`;
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
