import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, TrendingUp, Activity, Droplet, BarChart3, Clock, RefreshCw } from 'lucide-react';
import { getSBCExchangeData } from '../services/api';

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

const ExchangeDataCard: React.FC = () => {
  const [exchangeData, setExchangeData] = useState<GeckoPoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchExchangeData = async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        } else {
          setIsRefreshing(true);
        }
        
        const data = await getSBCExchangeData();
        setExchangeData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch exchange data');
        console.error(err);
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        } else {
          setIsRefreshing(false);
        }
      }
    };

    // Initial load
    fetchExchangeData(true);
    
    // Background refresh every 30 seconds for more frequent price updates
    const interval = setInterval(() => fetchExchangeData(false), 30000);
    
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatVolume = (volume: string): string => {
    const num = parseFloat(volume);
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatMarketCap = (marketCap: string): string => {
    const num = parseFloat(marketCap);
    if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPercentage = (value: string): string => {
    const num = parseFloat(value);
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="bg-card rounded-xl shadow-lg p-6 animate-pulse border border-border">
        <div className="h-6 bg-muted rounded mb-4"></div>
        <div className="h-8 bg-muted rounded mb-2"></div>
        <div className="h-4 bg-muted rounded mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-16 bg-muted rounded"></div>
          <div className="h-16 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !exchangeData) {
    return (
      <div className="bg-card rounded-xl shadow-lg p-6 border-l-4 border-destructive border border-border">
        <div className="text-destructive font-medium">Error Loading Exchange Data</div>
        <div className="text-muted-foreground text-sm mt-1">{error}</div>
      </div>
    );
  }

  const poolAttrs = exchangeData.data.attributes;

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 border border-border card-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-card-foreground">Exchange Data</h2>
          <p className="text-muted-foreground">{poolAttrs.pool_name}</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* Refresh indicator */}
          {isRefreshing && (
            <div className="p-2">
              <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Current Price */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-card-foreground mb-1">
          ${parseFloat(poolAttrs.base_token_price_usd).toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 8 
          })}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-muted-foreground text-sm">Current Price USD</span>
          {parseFloat(poolAttrs.price_change_percentage.h24) !== 0 && (
            <span className={`text-sm font-medium ${parseFloat(poolAttrs.price_change_percentage.h24) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(poolAttrs.price_change_percentage.h24)} (24h)
            </span>
          )}
        </div>
      </div>

      {/* Price Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">FDV</div>
          </div>
          <div className="text-lg font-semibold text-card-foreground">
            {formatMarketCap(poolAttrs.fdv_usd)}
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Droplet className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Liquidity</div>
          </div>
          <div className="text-lg font-semibold text-card-foreground">
            {formatVolume(poolAttrs.reserve_in_usd)}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Quote Token Price</div>
          <div className="text-lg font-semibold text-card-foreground">
            ${parseFloat(poolAttrs.quote_token_price_usd).toFixed(6)}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Price Ratio</div>
          <div className="text-lg font-semibold text-card-foreground">
            1 SBC = {parseFloat(poolAttrs.base_token_price_quote_token).toFixed(6)} USDT
          </div>
        </div>
      </div>

      {/* Volume Stats */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-3">Volume Statistics</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">24h</div>
            </div>
            <div className="text-lg font-semibold text-card-foreground">
              {formatVolume(poolAttrs.volume_usd.h24)}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">6h</div>
            <div className="text-lg font-semibold text-card-foreground">
              {formatVolume(poolAttrs.volume_usd.h6)}
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">1h</div>
            <div className="text-lg font-semibold text-card-foreground">
              {formatVolume(poolAttrs.volume_usd.h1)}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-3">Transaction Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">24h Transactions</div>
            <div className="text-lg font-semibold text-card-foreground">
              <span className="text-green-600">{poolAttrs.transactions.h24.buys} buys</span>
              {' / '}
              <span className="text-red-600">{poolAttrs.transactions.h24.sells} sells</span>
            </div>
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">24h Traders</div>
            <div className="text-lg font-semibold text-card-foreground">
              <span className="text-green-600">{poolAttrs.transactions.h24.buyers} buyers</span>
              {' / '}
              <span className="text-red-600">{poolAttrs.transactions.h24.sellers} sellers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pool Creation */}
      <div className="mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Pool Created</div>
          </div>
          <div className="text-lg font-semibold text-card-foreground">
            {formatDate(poolAttrs.pool_created_at)}
          </div>
        </div>
      </div>

      {/* Pool Address */}
      <div className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground mb-2">Pool Address</div>
        <div className="flex items-center justify-between bg-muted rounded-lg p-3 mb-3">
          <code className="text-sm font-mono text-card-foreground truncate flex-1 mr-2">
            {poolAttrs.address}
          </code>
          <button
            onClick={() => copyToClipboard(poolAttrs.address)}
            className="p-1 hover:bg-card rounded transition-colors flex-shrink-0"
            title="Copy address"
          >
            <Copy className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* External Links */}
        <div className="flex space-x-2">
          <button
            onClick={() => window.open(`https://www.geckoterminal.com/ton/pools/${poolAttrs.address}`, '_blank')}
            className="flex-1 bg-muted hover:bg-muted/80 text-card-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>GeckoTerminal</span>
          </button>
          
          <button
            onClick={() => window.open(`https://tonscan.org/address/${poolAttrs.address}`, '_blank')}
            className="flex-1 bg-muted hover:bg-muted/80 text-card-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>TonScan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExchangeDataCard;
