import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import DashboardLayout from './components/layout/DashboardLayout';
import TokenPriceCard from './components/TokenPriceCard';
import TokenInfoCard from './components/TokenInfoCard';
import ExchangeDataCard from './components/ExchangeDataCard';
import WalletCard from './components/WalletCard';
import ProjectsOverview from './components/ProjectsOverview';
import PriceChart from './components/PriceChart';

function SBCDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* New separate token and exchange data cards */}
            <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
              <div>
                <TokenInfoCard />
              </div>
            </div>
            {/* Combined view for comparison */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="xl:col-span-2">
                <ExchangeDataCard />
              </div>
            </div>
            <div>
              <PriceChart />
            </div>
          </div>
        );
      case 'wallet':
        return (
          <div className="max-w-2xl">
            <WalletCard />
          </div>
        );
      case 'projects':
  return <ProjectsOverview />;
      case 'settings':
        return (
          <div className="bg-card rounded-xl shadow-lg p-6 border border-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Settings</h3>
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <TokenPriceCard />
            <WalletCard />
          </div>
        );
    }
  };

  return (
    <ThemeProvider>
      <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </DashboardLayout>
    </ThemeProvider>
  );
}

export default SBCDashboard;
