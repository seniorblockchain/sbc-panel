import React, { useState } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import Sidebar from './Sidebar';
import Header from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange 
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <div className="min-h-screen bg-background flex">
        <Sidebar 
          activeTab={activeTab}
          onTabChange={onTabChange}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
        
        <div className="flex-1 flex flex-col min-h-screen sidebar-offset">
          <Header onMenuToggle={toggleSidebar} />
          
          <main className="flex-1 p-6 overflow-auto bg-muted/30">
            {children}
          </main>
        </div>
      </div>
    </TonConnectUIProvider>
  );
};

export default DashboardLayout;
