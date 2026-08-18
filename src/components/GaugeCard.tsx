import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { CanaryLevel } from '../types/canary';

interface GaugeCardProps {
  score: number; // 0 to 100
  level: CanaryLevel;
}

const levelColors = {
  GREEN: '#10b981',
  YELLOW: '#eab308',
  ORANGE: '#f97316',
  RED: '#ef4444'
};

export const GaugeCard: React.FC<GaugeCardProps> = ({ score, level }) => {
  // We use a simple 2-slice pie chart for the gauge
  const data = [
    { name: 'Score', value: score },
    { name: 'Remainder', value: 100 - score }
  ];

  const color = levelColors[level];

  return (
    <div className="card flex flex-col items-center justify-center relative" style={{ minHeight: '200px' }}>
      <h3 className="heading-md text-secondary absolute top-4 left-4">System Health</h3>
      
      <div style={{ width: '100%', height: '160px', marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="80%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              isAnimationActive={false}
            >
              <Cell fill={color} />
              <Cell fill="var(--card-border)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="absolute" style={{ top: '65%', textAlign: 'center' }}>
        <span className="heading-xl">{score}</span>
        <span className="text-sm text-secondary">/100</span>
      </div>
    </div>
  );
};
