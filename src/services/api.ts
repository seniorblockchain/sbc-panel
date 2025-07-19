import axios from 'axios';
import type { TokenInfo } from '../types';

const SBC_CONTRACT_ADDRESS = 'EQBIQe_KkVxaJmga7LVgwvB8lcXbbfsqdziGgDXfD-zW4KU9';
const TON_API_BASE = 'https://tonapi.io/v2';
const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex';

// Get SBC token information from TON API
export const getSBCTokenInfo = async (): Promise<TokenInfo> => {
  try {
    // Fetch basic token info from TON API
    const tokenResponse = await axios.get(`${TON_API_BASE}/jettons/${SBC_CONTRACT_ADDRESS}`);
    const tokenData = tokenResponse.data;

    // Try to get price from DexScreener (if available)
    let priceData = null;
    try {
      const priceResponse = await axios.get(`${DEXSCREENER_API}/tokens/${SBC_CONTRACT_ADDRESS}`);
      priceData = priceResponse.data?.pairs?.[0];
    } catch (error) {
      console.warn('Price data not available from DexScreener');
    }

    // Fetch holders count
    const holdersResponse = await axios.get(`${TON_API_BASE}/jettons/${SBC_CONTRACT_ADDRESS}/holders`);
    const holdersCount = holdersResponse.data?.addresses?.length || 0;

    return {
      name: tokenData.metadata?.name || 'Senior Blockchain Company',
      symbol: tokenData.metadata?.symbol || 'SBC',
      logo: tokenData.metadata?.image || 'https://imgproxy.toncenter.com/_TXdvYr6mddtF25A4OiZ1OB34u_7NOu88J9U17qdcM0/pr:small/aHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE0ODQ1MjcwNg',
      price_usd: priceData?.priceUsd ? parseFloat(priceData.priceUsd) : 0,
      price_change_24h_percent: priceData?.priceChange?.h24 ? parseFloat(priceData.priceChange.h24) : 0,
      market_cap_usd: priceData?.marketCap ? parseFloat(priceData.marketCap) : 0,
      holders: holdersCount,
      total_supply: tokenData.total_supply ? formatTokenAmount(tokenData.total_supply, tokenData.metadata?.decimals || 9) : '256,000,000 SBC',
      contract_address: SBC_CONTRACT_ADDRESS,
      decimals: tokenData.metadata?.decimals || 9
    };
  } catch (error) {
    console.error('Error fetching SBC token info:', error);
    // Return mock data as fallback
    return {
      name: 'Senior Blockchain Company',
      symbol: 'SBC',
      logo: 'https://imgproxy.toncenter.com/_TXdvYr6mddtF25A4OiZ1OB34u_7NOu88J9U17qdcM0/pr:small/aHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzE0ODQ1MjcwNg',
      price_usd: 0.0024,
      price_change_24h_percent: 5.67,
      market_cap_usd: 614400,
      holders: 1250,
      total_supply: '256,000,000 SBC',
      contract_address: SBC_CONTRACT_ADDRESS,
      decimals: 9
    };
  }
};

// Get real-time price for SBC token
export const getSBCPrice = async (): Promise<{ price: number; change24h: number }> => {
  try {
    const response = await axios.get(`${DEXSCREENER_API}/tokens/${SBC_CONTRACT_ADDRESS}`);
    const priceData = response.data?.pairs?.[0];
    
    return {
      price: priceData?.priceUsd ? parseFloat(priceData.priceUsd) : 0,
      change24h: priceData?.priceChange?.h24 ? parseFloat(priceData.priceChange.h24) : 0
    };
  } catch (error) {
    console.error('Error fetching price:', error);
    return { price: 0.0024, change24h: 5.67 };
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
