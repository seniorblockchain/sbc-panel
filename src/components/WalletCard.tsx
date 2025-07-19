import React, { useState, useEffect } from 'react';
import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react';
import { Wallet, RefreshCw } from 'lucide-react';
import { getTONBalance, getSBCBalance } from '../services/api';

const WalletCard: React.FC = () => {
  const userFriendlyAddress = useTonAddress();
  const [balances, setBalances] = useState({
    ton: 0,
    sbc: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchBalances = async () => {
    if (!userFriendlyAddress) return;
    
    setLoading(true);
    try {
      const [tonBalance, sbcBalance] = await Promise.all([
        getTONBalance(userFriendlyAddress),
        getSBCBalance(userFriendlyAddress)
      ]);
      
      setBalances({
        ton: tonBalance,
        sbc: sbcBalance
      });
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userFriendlyAddress) {
      fetchBalances();
    }
  }, [userFriendlyAddress]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 border border-border card-hover">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wallet className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Wallet</h3>
        </div>
        {userFriendlyAddress && (
          <button
            onClick={fetchBalances}
            disabled={loading}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
            title="Refresh balances"
          >
            <RefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Connection Status */}
      {!userFriendlyAddress ? (
        <div className="text-center py-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-8 h-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium text-card-foreground mb-2">Connect Your Wallet</h4>
            <p className="text-muted-foreground text-sm mb-6">
              Connect your TON wallet to view your SBC token balance and access all features
            </p>
          </div>
          <div className="flex justify-center">
            <TonConnectButton />
          </div>
        </div>
      ) : (
        <div>
          {/* Connected Wallet Info */}
          <div className="bg-accent border border-border rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-primary font-medium">Connected</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {formatAddress(userFriendlyAddress)}
                </div>
              </div>
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>
          </div>

          {/* Balances */}
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">TON Balance</div>
                  <div className="text-xl font-semibold text-card-foreground">
                    {loading ? (
                      <div className="w-20 h-6 bg-muted rounded animate-pulse"></div>
                    ) : (
                      `${balances.ton.toFixed(4)} TON`
                    )}
                  </div>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">T</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-primary font-medium">SBC Balance</div>
                  <div className="text-xl font-semibold text-card-foreground">
                    {loading ? (
                      <div className="w-24 h-6 bg-muted rounded animate-pulse"></div>
                    ) : (
                      `${balances.sbc.toLocaleString()} SBC`
                    )}
                  </div>
                </div>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">S</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disconnect Button */}
          <div className="mt-6 pt-4 border-t border-border flex justify-center">
            <TonConnectButton />
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletCard;
