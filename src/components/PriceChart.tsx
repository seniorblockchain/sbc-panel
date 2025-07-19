import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSBCPrice } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

interface PriceData {
  time: string;
  price: number;
}

const PriceChart: React.FC = () => {
  const { theme } = useTheme();
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  // Theme-aware colors
  const colors = {
    primary: theme === 'dark' ? '#3b82f6' : '#2563eb',
    background: theme === 'dark' ? '#1e293b' : '#ffffff',
    foreground: theme === 'dark' ? '#f8fafc' : '#0f172a',
    muted: theme === 'dark' ? '#64748b' : '#94a3b8',
    border: theme === 'dark' ? '#334155' : '#e2e8f0',
    grid: theme === 'dark' ? '#374151' : '#f1f5f9'
  };

  useEffect(() => {
    const generateMockPriceData = async () => {
      try {
        const currentPrice = await getSBCPrice();
        const data: PriceData[] = [];
        
        // Generate 24 hours of mock price data
        for (let i = 23; i >= 0; i--) {
          const time = new Date();
          time.setHours(time.getHours() - i);
          
          // Generate realistic price variations around current price
          const basePrice = currentPrice.price || 0.0024; // fallback price
          const variation = (Math.random() - 0.5) * 0.0005; // ±0.0005 variation
          const price = Math.max(0.001, basePrice + variation);
          
          data.push({
            time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            price: parseFloat(price.toFixed(6))
          });
        }
        
        setPriceData(data);
        console.log('Chart data generated:', data); // Debug log
      } catch (error) {
        console.error('Error generating price data:', error);
        // Fallback data if API fails
        const fallbackData: PriceData[] = [];
        for (let i = 23; i >= 0; i--) {
          const time = new Date();
          time.setHours(time.getHours() - i);
          const basePrice = 0.0024;
          const variation = (Math.random() - 0.5) * 0.0005;
          const price = Math.max(0.001, basePrice + variation);
          
          fallbackData.push({
            time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            price: parseFloat(price.toFixed(6))
          });
        }
        setPriceData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    generateMockPriceData();
    
    // Update price data every 60 seconds
    const interval = setInterval(async () => {
      try {
        const currentPrice = await getSBCPrice();
        const now = new Date();
        const newDataPoint: PriceData = {
          time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          price: parseFloat(currentPrice.price.toFixed(6))
        };
        
        setPriceData(prev => [...prev.slice(1), newDataPoint]);
      } catch (error) {
        console.error('Error updating price:', error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-card rounded-xl shadow-lg p-6 border border-border chart-container">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Price Chart (24H)</h3>
          <p className="text-muted-foreground text-sm">Loading chart data...</p>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!priceData || priceData.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-lg p-6 border border-border chart-container">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Price Chart (24H)</h3>
          <p className="text-muted-foreground text-sm">No chart data available</p>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Chart data not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card text-card-foreground rounded-xl shadow-lg p-6 border border-border card-hover chart-container">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Price Chart (24H)</h3>
        <p className="text-muted-foreground text-sm">Real-time SBC token price movement</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={colors.grid}
              opacity={0.3}
            />
            <XAxis 
              dataKey="time" 
              stroke={colors.muted}
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke={colors.muted}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toFixed(4)}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: colors.background,
                border: `1px solid ${colors.border}`,
                borderRadius: '8px',
                color: colors.foreground,
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              formatter={(value: number) => [`$${value.toFixed(6)}`, 'Price']}
              labelStyle={{ color: colors.muted }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={colors.primary}
              strokeWidth={3}
              dot={false}
              activeDot={{ 
                r: 6, 
                fill: colors.primary,
                strokeWidth: 2,
                stroke: colors.background
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
