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
