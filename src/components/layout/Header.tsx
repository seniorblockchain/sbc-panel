import { useTonAddress } from '@tonconnect/ui-react';
import { Button } from '@/components/ui/button';
import { MobileNavigation } from './Navigation';
import { Bell, Search } from 'lucide-react';

export function Header() {
  const address = useTonAddress();

  return (
    <div className="flex h-16 items-center justify-between px-4 lg:px-6">
      <div className="flex items-center space-x-4">
        <MobileNavigation />
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-white">SBC Dashboard</h1>
          <p className="text-sm text-blue-400">Senior Blockchain Company</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10">
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10 relative">
          <Bell className="h-5 w-5" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </Button>

        {/* Wallet Status */}
        {address && (
          <div className="hidden sm:flex items-center space-x-2 bg-green-500/20 px-3 py-2 rounded-full border border-green-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400 font-medium">Wallet Connected</span>
          </div>
        )}
      </div>
    </div>
  );
}
