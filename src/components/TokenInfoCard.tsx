import React, { useState, useEffect } from 'react';
import { Copy, ExternalLink, Users, RefreshCw } from 'lucide-react';
import { getSBCTokenInfo } from '../services/api';

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

const TokenInfoCard: React.FC = () => {
  const [tokenData, setTokenData] = useState<TonTokenData | null>(null);
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
        
        const info = await getSBCTokenInfo();
        setTokenData(info);
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
    
    // Background refresh every 60 seconds
    const interval = setInterval(() => fetchTokenInfo(false), 60000);
    
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openTonScan = () => {
    window.open(`https://tonscan.org/jetton/${tokenData?.metadata.address}`, '_blank');
  };

  const formatTotalSupply = (supply: string, decimals: string): string => {
    const num = BigInt(supply);
    const divisor = BigInt(10 ** parseInt(decimals));
    const result = Number(num / divisor);
    return new Intl.NumberFormat('en-US').format(result);
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

  if (error || !tokenData) {
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
            src={tokenData.metadata.image} 
            alt={tokenData.metadata.name} 
            className="w-12 h-12 rounded-full"
          />
          <div>
            <h2 className="text-xl font-bold text-card-foreground">Token Information</h2>
            <p className="text-muted-foreground">{tokenData.metadata.symbol}</p>
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
          
          {/* Refresh indicator */}
          {isRefreshing && (
            <div className="p-2">
              <RefreshCw className="w-4 h-4 text-muted-foreground animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Token Details */}
      <div className="space-y-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">{tokenData.metadata.name}</h3>
          <p className="text-muted-foreground text-sm">{tokenData.metadata.description}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">Holders</div>
          </div>
          <div className="text-lg font-semibold text-card-foreground">
            {tokenData.holders_count.toLocaleString()}
          </div>
        </div>
        
        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Total Supply</div>
          <div className="text-lg font-semibold text-card-foreground">
            {formatTotalSupply(tokenData.total_supply, tokenData.metadata.decimals)} {tokenData.metadata.symbol}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-1">Decimals</div>
          <div className="text-lg font-semibold text-card-foreground">
            {tokenData.metadata.decimals}
          </div>
        </div>
 </div>
       

      {/* Admin Address */}
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-2">Admin Address</div>
        <div className="flex items-center justify-between bg-muted rounded-lg p-3">
          <code className="text-sm font-mono text-card-foreground truncate flex-1 mr-2">
            {tokenData.admin.address}
          </code>
          <button
            onClick={() => copyToClipboard(tokenData.admin.address)}
            className="p-1 hover:bg-card rounded transition-colors flex-shrink-0"
            title="Copy address"
          >
            <Copy className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Contract Address */}
      <div className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground mb-2">Contract Address</div>
        <div className="flex items-center justify-between bg-muted rounded-lg p-3 mb-3">
          <code className="text-sm font-mono text-card-foreground truncate flex-1 mr-2">
            {tokenData.metadata.address}
          </code>
          <button
            onClick={() => copyToClipboard(tokenData.metadata.address)}
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
            <span>View on TonScan</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenInfoCard;
