import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  header: ReactNode;
  className?: string;
}

export function DashboardLayout({ children, sidebar, header, className }: DashboardLayoutProps) {
  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900", className)}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-700/50 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/80">
        {header}
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r border-gray-700/50 bg-gray-900/90 backdrop-blur overflow-y-auto hidden lg:block">
          {sidebar}
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
