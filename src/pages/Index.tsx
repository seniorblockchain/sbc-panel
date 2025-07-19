import { useSeoMeta } from '@unhead/react';
import SBCDashboard from '../SBCDashboard';

const Index = () => {
  useSeoMeta({
    title: 'SBC Panel - Senior Blockchain Company Token Dashboard',
    description: 'Real-time dashboard for SBC token on TON network. View live price, connect wallet, and manage investments.',
  });

  return <SBCDashboard />;
};

export default Index;
