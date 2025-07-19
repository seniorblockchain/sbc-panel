import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import DashboardLayout from './components/layout/DashboardLayout';
import TokenPriceCard from './components/TokenPriceCard';
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <TokenPriceCard />
              </div>
              <div>
                <WalletCard />
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
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
            <p className="text-gray-600">Settings panel coming soon...</p>
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
