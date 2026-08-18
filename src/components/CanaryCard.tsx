import React from 'react';
import type { CanaryIndicator } from '../types/canary';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
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
        
        {/* Sparkline Chart */}
        <div style={{ width: '100px', height: '50px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={indicator.history}>
              <YAxis domain={['dataMin', 'dataMax']} hide />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={color} 
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
