import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, TrendingUp, Activity, Droplet, BarChart3, Clock, Users, RefreshCw } from 'lucide-react';
import { getSBCFullData, formatVolume, formatLiquidity, formatMarketCap, formatDate } from '../services/api';
import type { TokenInfo } from '../types';

const TokenPriceCard: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const fetchTokenInfo = async (isInitialLoad = false) => {
      try {
        if (isInitialLoad) {
          setLoading(true);
        } else {
          setIsRefreshing(true);
        }
        
        const info = await getSBCFullData();
        setTokenInfo(info);
        setError(null);
      } catch (err) {
        setError('Failed to fetch token information');
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
    fetchTokenInfo(true);
    
    // Background refresh every 45 seconds (less frequent to be less noticeable)
    const interval = setInterval(() => fetchTokenInfo(false), 45000);
    
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
        <div className="flex items-center space-x-2">
          <button
            onClick={openTonScan}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title="View on TonScan"
          >
            <ExternalLink className="w-5 h-5 text-muted-foreground" />
          </button>
          
          {/* Subtle refresh indicator */}
          {isRefreshing && (
            <div className="p-2">
              <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Price - without 24h change */}
      <div className="mb-6">
        <div className="text-3xl font-bold text-card-foreground mb-1">
          ${tokenInfo.price_usd.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 6 
          })}
        </div>
        <div className="text-muted-foreground text-sm">
          Current Price USD
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Market Cap</div>
          </div>
          <div className="text-lg font-semibold text-card-foreground">
            {formatMarketCap(tokenInfo.market_cap_usd)}
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Holders</div>
          </div>
          <div className="text-lg font-semibold text-card-foreground">
            {tokenInfo.holders.toLocaleString()}
          </div>
        </div>

        {tokenInfo.fdv && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">FDV</div>
            </div>
            <div className="text-lg font-semibold text-card-foreground">
              {formatMarketCap(tokenInfo.fdv)}
            </div>
          </div>
        )}

        {tokenInfo.liquidity_usd && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Droplet className="w-4 h-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Liquidity</div>
            </div>
            <div className="text-lg font-semibold text-card-foreground">
              {formatLiquidity(tokenInfo.liquidity_usd)}
            </div>
          </div>
        )}

        {tokenInfo.volume_24h !== undefined && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Volume 24h</div>
            </div>
            <div className="text-lg font-semibold text-card-foreground">
              {formatVolume(tokenInfo.volume_24h)}
            </div>
          </div>
        )}

        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Supply</div>
          <div className="text-lg font-semibold text-card-foreground">
            {tokenInfo.total_supply}
          </div>
        </div>
      </div>

      {/* Trading Information */}
      {(tokenInfo.transactions_24h || tokenInfo.dex_id) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-3">Trading Info</h3>
          <div className="grid grid-cols-2 gap-4">
            {tokenInfo.dex_id && (
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">DEX</div>
                <div className="text-lg font-semibold text-card-foreground capitalize">
                  {tokenInfo.dex_id}
                </div>
              </div>
            )}

            {tokenInfo.transactions_24h && (
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Transactions 24h</div>
                <div className="text-lg font-semibold text-card-foreground">
                  <span className="text-green-600">{tokenInfo.transactions_24h.buys} buys</span>
                  {' / '}
                  <span className="text-red-600">{tokenInfo.transactions_24h.sells} sells</span>
                </div>
              </div>
            )}

            {tokenInfo.pair_created_at && (
              <div className="bg-muted rounded-lg p-4 col-span-2">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">Pair Created</div>
                </div>
                <div className="text-lg font-semibold text-card-foreground">
                  {formatDate(tokenInfo.pair_created_at)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Token Pair Information */}
      {(tokenInfo.base_token || tokenInfo.quote_token) && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-3">Trading Pair</h3>
          <div className="grid grid-cols-2 gap-4">
            {tokenInfo.base_token && (
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Base Token</div>
                <div className="font-semibold text-card-foreground">
                  {tokenInfo.base_token.symbol}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {tokenInfo.base_token.name}
                </div>
              </div>
            )}

            {tokenInfo.quote_token && (
              <div className="bg-muted rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Quote Token</div>
                <div className="font-semibold text-card-foreground">
                  {tokenInfo.quote_token.symbol}
                </div>
                <div className="text-sm text-muted-foreground truncate">
                  {tokenInfo.quote_token.name}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Contract Address & Links */}
      <div className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground mb-2">Contract Address</div>
        <div className="flex items-center justify-between bg-muted rounded-lg p-3 mb-3">
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

        {/* External Links */}
        <div className="flex space-x-2">
          <button
            onClick={openTonScan}
            className="flex-1 bg-muted hover:bg-muted/80 text-card-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>TonScan</span>
          </button>
          
          {tokenInfo.pair_address && (
            <button
              onClick={() => window.open(`https://dexscreener.com/ton/${tokenInfo.pair_address}`, '_blank')}
              className="flex-1 bg-muted hover:bg-muted/80 text-card-foreground px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>DexScreener</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenPriceCard;
