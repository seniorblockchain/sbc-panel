import { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  height?: number;
}

export function TradingViewChart({ height = 400 }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create a simple mock chart using canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = chartContainerRef.current.clientWidth;
    canvas.height = height;
    canvas.style.width = '100%';
    canvas.style.height = `${height}px`;

    // Clear any existing content
    chartContainerRef.current.innerHTML = '';
    chartContainerRef.current.appendChild(canvas);

    // Draw mock candlestick chart
    const drawChart = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.fillStyle = 'rgba(15, 20, 25, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(116, 191, 240, 0.1)';
      ctx.lineWidth = 1;
      
      // Vertical lines
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      
      // Horizontal lines
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw mock candlesticks
      const candleWidth = 20;
      const candleSpacing = 30;
      const basePrice = canvas.height * 0.7;
      
      for (let i = 0; i < canvas.width / candleSpacing; i++) {
        const x = i * candleSpacing + 40;
        const volatility = Math.random() * 40 - 20;
        const open = basePrice + Math.sin(i * 0.3) * 30;
        const close = open + volatility;
        const high = Math.max(open, close) - Math.random() * 20;
        const low = Math.min(open, close) + Math.random() * 20;
        
        // Draw wick
        ctx.strokeStyle = close > open ? '#4ade80' : '#f87171';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + candleWidth/2, high);
        ctx.lineTo(x + candleWidth/2, low);
        ctx.stroke();
        
        // Draw body
        ctx.fillStyle = close > open ? '#4ade80' : '#f87171';
        const bodyHeight = Math.abs(close - open);
        const bodyTop = Math.min(open, close);
        ctx.fillRect(x, bodyTop, candleWidth, bodyHeight);
      }

      // Draw SBC watermark
      ctx.font = 'bold 48px Inter';
      ctx.fillStyle = 'rgba(36, 129, 204, 0.1)';
      ctx.textAlign = 'center';
      ctx.fillText('SBC', canvas.width / 2, canvas.height / 2);

      // Draw price text
      ctx.font = '14px Inter';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText('$0.0025', 10, 30);
      
      ctx.fillStyle = '#4ade80';
      ctx.fillText('+5.2%', 10, 50);
    };

    drawChart();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        canvas.width = chartContainerRef.current.clientWidth;
        drawChart();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [height]);

  return (
    <div className="chart-container">
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">SBC Price Chart</h3>
            <p className="text-sm text-gray-400">Real-time price movements</p>
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600/30 transition-colors">
              1H
            </button>
            <button className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600/30 transition-colors">
              1D
            </button>
            <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md">
              1W
            </button>
            <button className="px-3 py-1 text-xs bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600/30 transition-colors">
              1M
            </button>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" style={{ height: `${height}px` }} />
    </div>
  );
}
