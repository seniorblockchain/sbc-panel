import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, TrendingUp, Wallet, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, current: true },
  { name: 'Investments', href: '/investments', icon: TrendingUp, current: false },
  { name: 'Portfolio', href: '/portfolio', icon: Wallet, current: false },
  { name: 'Settings', href: '/settings', icon: Settings, current: false },
  { name: 'Help', href: '/help', icon: HelpCircle, current: false },
];

interface NavigationProps {
  className?: string;
}

export function Navigation({ className }: NavigationProps) {
  return (
    <nav className={cn("space-y-2", className)}>
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.name}
            href={item.href}
            className={cn(
              'group flex items-center rounded-xl px-4 py-3 text-sm font-medium transition-all hover-lift',
              item.current
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-gray-300 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon
              className={cn(
                'mr-3 h-5 w-5 flex-shrink-0',
                item.current ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'
              )}
            />
            {item.name}
          </a>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
        <div className="flex flex-shrink-0 items-center px-6 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">SBC</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">SBC Panel</span>
              <div className="text-xs text-blue-400 font-medium">Senior Blockchain</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 space-y-2 px-4">
          <Navigation />
        </nav>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700/50">
          <div className="text-xs text-gray-500">
            <div>Version 1.0.0</div>
            <div className="mt-1">© 2025 Senior Blockchain</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden text-white hover:bg-white/10">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-gray-900 border-gray-700">
        <div className="flex items-center space-x-3 px-4 py-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">SBC</span>
          </div>
          <div>
            <span className="text-xl font-bold text-white">SBC Panel</span>
            <div className="text-xs text-blue-400 font-medium">Senior Blockchain</div>
          </div>
        </div>
        <Navigation className="px-4" />
      </SheetContent>
    </Sheet>
  );
}
