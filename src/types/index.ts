export interface TokenInfo {
  name: string;
  symbol: string;
  logo: string;
  price_usd: number;
  price_change_24h_percent: number;
  market_cap_usd: number;
  holders: number;
  total_supply: string;
  contract_address: string;
  decimals: number;
  fdv?: number; // Fully Diluted Valuation
  liquidity_usd?: number;
  volume_24h?: number;
  volume_h6?: number;
  volume_h1?: number;
  volume_m5?: number;
  transactions_24h?: {
    buys: number;
    sells: number;
  };
  transactions_h6?: {
    buys: number;
    sells: number;
  };
  transactions_h1?: {
    buys: number;
    sells: number;
  };
  transactions_m5?: {
    buys: number;
    sells: number;
  };
  pair_created_at?: number;
  dex_id?: string;
  pair_address?: string;
  base_token?: {
    address: string;
    name: string;
    symbol: string;
  };
  quote_token?: {
    address: string;
    name: string;
    symbol: string;
  };
}

export interface WalletInfo {
  address: string;
  balance_ton: number;
  balance_sbc: number;
  connected: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'upcoming';
  progress: number;
  investment_amount: number;
  expected_return: number;
  start_date: string;
  end_date: string;
}

export interface Investment {
  id: string;
  project_id: string;
  amount: number;
  date: string;
  status: 'pending' | 'confirmed' | 'completed';
  roi: number;
}
