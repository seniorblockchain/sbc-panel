import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { getSBCTokenInfo } from '../services/api';
import type { TokenInfo } from '../types';

const TokenPriceCard: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        setLoading(true);
        const info = await getSBCTokenInfo();
        setTokenInfo(info);
        setError(null);
      } catch (err) {
        setError('Failed to fetch token information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenInfo();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchTokenInfo, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openTonScan = () => {
    window.open(`https://tonscan.org/jetton/${tokenInfo?.contract_address}`, '_blank');
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

  if (error || !tokenInfo) {
    return (
      <div className="bg-card rounded-xl shadow-lg p-6 border-l-4 border-destructive border border-border">
        <div className="text-destructive font-medium">Error Loading Token Data</div>
        <div className="text-muted-foreground text-sm mt-1">{error}</div>
      </div>
    );
  }

  const priceChangeColor = tokenInfo.price_change_24h_percent >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const TrendIcon = tokenInfo.price_change_24h_percent >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 border border-border card-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <img 
            src={tokenInfo.logo} 
            alt={tokenInfo.name} 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold text-card-foreground">{tokenInfo.name}</h2>
            <p className="text-muted-foreground">{tokenInfo.symbol}</p>
          </div>
        </div>
        <button
          onClick={openTonScan}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          title="View on TonScan"
        >
          <ExternalLink className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-card-foreground mb-1">
          ${tokenInfo.price_usd.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 6 
          })}
        </div>
        <div className={`flex items-center space-x-1 ${priceChangeColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span className="font-medium">
            {tokenInfo.price_change_24h_percent >= 0 ? '+' : ''}
            {tokenInfo.price_change_24h_percent.toFixed(2)}%
          </span>
          <span className="text-muted-foreground">24h</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Market Cap</div>
          <div className="text-lg font-semibold text-card-foreground">
            ${tokenInfo.market_cap_usd.toLocaleString()}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Holders</div>
          <div className="text-lg font-semibold text-card-foreground">
            {tokenInfo.holders.toLocaleString()}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Supply</div>
          <div className="text-lg font-semibold text-card-foreground">
            {tokenInfo.total_supply}
          </div>
        </div>
        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Decimals</div>
          <div className="text-lg font-semibold text-card-foreground">
            {tokenInfo.decimals}
          </div>
        </div>
      </div>

      {/* Contract Address */}
      <div className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground mb-2">Contract Address</div>
        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
          <code className="text-sm font-mono text-card-foreground truncate flex-1 mr-2">
            {tokenInfo.contract_address}
          </code>
          <button
            onClick={() => copyToClipboard(tokenInfo.contract_address)}
            className="p-1 hover:bg-card rounded transition-colors flex-shrink-0"
            title="Copy address"
          >
            <Copy className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPriceCard;
