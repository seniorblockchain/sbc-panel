import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, RefreshCw, ExternalLink, Copy } from 'lucide-react';
import { getSBCPrice, getSBCTokenInfo, formatPrice, formatPercentage, formatNumber } from '@/services/api';
import { toast } from 'sonner';
import type { TokenInfo, TokenPrice } from '@/types';

export function TokenPriceCard() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [priceData, setPriceData] = useState<TokenPrice | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchData = async () => {
    try {
      setLoading(true);
      const [info, price] = await Promise.all([
        getSBCTokenInfo(),
        getSBCPrice()
      ]);
      setTokenInfo(info);
      setPriceData(price);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching token data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Auto refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const copyAddress = () => {
    if (tokenInfo) {
      navigator.clipboard.writeText(tokenInfo.address);
      toast.success('Contract address copied to clipboard');
    }
  };

  if (loading || !tokenInfo || !priceData) {
    return (
      <Card className="telegram-card animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-600/20 rounded w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-gray-600/20 rounded w-24"></div>
            <div className="h-4 bg-gray-600/20 rounded w-16"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isPositive = priceData.change24h >= 0;
  const formatTotalSupply = (supply: string) => {
    const supplyNum = parseFloat(supply) / Math.pow(10, tokenInfo.decimals);
    return formatNumber(supplyNum);
  };

  return (
    <Card className="telegram-card hover-lift">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <img 
                  src={tokenInfo.image} 
                  alt={tokenInfo.symbol}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%232481cc"/><text x="32" y="40" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">${tokenInfo.symbol}</text></svg>`;
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                {tokenInfo.name}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <p className="text-lg text-blue-400 font-semibold">{tokenInfo.symbol}</p>
                <Badge className="bg-blue-600/20 text-blue-400 hover:bg-blue-600/30">
                  TON Network
                </Badge>
              </div>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="p-3 hover:bg-white/10 rounded-xl transition-colors"
            disabled={loading}
          >
            <RefreshCw className={`h-6 w-6 text-blue-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price Section */}
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium">Current Price</p>
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-white">
                  {formatPrice(priceData.price)}
                </span>
                <Badge 
                  className={`flex items-center space-x-2 px-3 py-1 text-sm font-semibold ${
                    isPositive 
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                      : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>{formatPercentage(priceData.change24h)}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="token-stat-card">
            <p className="text-gray-400 text-sm font-medium">Market Cap</p>
            <p className="text-xl font-bold text-white">${formatNumber(priceData.marketCap)}</p>
          </div>
          <div className="token-stat-card">
            <p className="text-gray-400 text-sm font-medium">24h Volume</p>
            <p className="text-xl font-bold text-white">${formatNumber(priceData.volume24h)}</p>
          </div>
          <div className="token-stat-card">
            <p className="text-gray-400 text-sm font-medium">Total Supply</p>
            <p className="text-xl font-bold text-white">{formatTotalSupply(tokenInfo.totalSupply)}</p>
            <p className="text-xs text-gray-500">{tokenInfo.symbol}</p>
          </div>
          <div className="token-stat-card">
            <p className="text-gray-400 text-sm font-medium">Decimals</p>
            <p className="text-xl font-bold text-white">{tokenInfo.decimals}</p>
          </div>
        </div>

        {/* Contract Information */}
        <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium">Contract Address</p>
              <p className="text-white font-mono text-sm">
                {tokenInfo.address.slice(0, 12)}...{tokenInfo.address.slice(-12)}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={copyAddress}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Copy className="h-4 w-4 text-gray-400" />
              </button>
              <button
                onClick={() => window.open(`https://tonscan.org/jetton/${tokenInfo.address}`, '_blank')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Data from TON API & DexScreener</span>
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
