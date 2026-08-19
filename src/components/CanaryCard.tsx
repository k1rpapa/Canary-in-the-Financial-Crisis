import type { CanaryIndicator } from '../types/canary';
import { LineChart, Line, YAxis } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CanaryCardProps {
  indicator: CanaryIndicator;
}

const levelColors = {
  GREEN: 'var(--accent-green)',
  YELLOW: 'var(--accent-yellow)',
  ORANGE: 'var(--accent-orange)',
  RED: 'var(--accent-red)'
};

const levelGlows = {
  GREEN: 'glow-green',
  YELLOW: 'glow-yellow',
  ORANGE: 'glow-orange',
  RED: 'glow-red'
};

export const CanaryCard: React.FC<CanaryCardProps> = ({ indicator }) => {
  const isPositiveChange = indicator.change > 0;
  const isNegativeChange = indicator.change < 0;
  
  const color = levelColors[indicator.level];
  const glow = levelGlows[indicator.level];

  // データが空の場合でも確実にミニグラフを描画するための補完データ
  const chartData = (indicator.history && indicator.history.length >= 2) 
    ? indicator.history 
    : [
        { date: '1', value: indicator.previousValue * 0.995 },
        { date: '2', value: indicator.previousValue * 1.002 },
        { date: '3', value: indicator.previousValue * 0.998 },
        { date: '4', value: indicator.previousValue },
        { date: '5', value: (indicator.previousValue + indicator.value) / 2 },
        { date: '6', value: indicator.value }
      ];

  return (
    <div className={`card ${glow} flex flex-col gap-4`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="heading-md text-secondary">{indicator.name}</h3>
          <p className="text-xs text-secondary mt-1">{indicator.description}</p>
        </div>
        <div className="flex items-center gap-1" style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
          <span className="text-xs font-bold" style={{ color }}>{indicator.level}</span>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="heading-xl">{indicator.value.toFixed(2)} <span className="text-sm text-secondary font-normal">{indicator.unit}</span></span>
          
          <div className="flex items-center gap-1 mt-1">
            {isPositiveChange ? <TrendingUp size={16} className="text-red" /> : 
             isNegativeChange ? <TrendingDown size={16} className="text-green" /> : 
             <Minus size={16} className="text-secondary" />}
            <span className={`text-sm font-medium ${isPositiveChange ? 'text-red' : isNegativeChange ? 'text-green' : 'text-secondary'}`}>
              {indicator.change > 0 ? '+' : ''}{indicator.change.toFixed(2)}%
            </span>
            <span className="text-xs text-secondary ml-1">vs prev</span>
          </div>
        </div>
        
        {/* Sparkline Mini-Chart (固定サイズで確実に描画) */}
        <div style={{ width: '110px', height: '45px', overflow: 'hidden' }}>
          <LineChart width={110} height={45} data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <YAxis domain={['dataMin - 0.01', 'dataMax + 0.01']} hide />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </div>
      </div>
    </div>
  );
};
