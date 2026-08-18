import React from 'react';
import { ShieldAlert, ShieldCheck, Shield, AlertTriangle } from 'lucide-react';
import type { CanaryLevel } from '../types/canary';

interface HeaderProps {
  overallLevel: CanaryLevel;
  lastUpdated: string;
}

const levelConfig = {
  GREEN: { icon: ShieldCheck, colorClass: 'text-green', glowClass: 'glow-green', text: 'SYSTEM NORMAL' },
  YELLOW: { icon: Shield, colorClass: 'text-yellow', glowClass: 'glow-yellow', text: 'ELEVATED RISK' },
  ORANGE: { icon: AlertTriangle, colorClass: 'text-orange', glowClass: 'glow-orange', text: 'HIGH ALERT' },
  RED: { icon: ShieldAlert, colorClass: 'text-red', glowClass: 'glow-red', text: 'SYSTEMIC RISK DETECTED' }
};

export const Header: React.FC<HeaderProps> = ({ overallLevel, lastUpdated }) => {
  const config = levelConfig[overallLevel] || levelConfig.GREEN;
  const Icon = config.icon;

  return (
    <header className="flex items-center justify-between" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--card-border)' }}>
      <div>
        <h1 className="heading-xl flex items-center gap-3">
          Canary Dashboard
        </h1>
        <p className="text-secondary mt-1">Financial Crisis Early Warning System</p>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className={`card ${config.glowClass} flex items-center gap-2`} style={{ padding: '0.5rem 1rem', borderRadius: '9999px' }}>
          <Icon className={config.colorClass} size={24} />
          <span className={`heading-md ${config.colorClass}`}>{config.text}</span>
        </div>
        <span className="text-xs text-secondary">Last Updated: {lastUpdated}</span>
      </div>
    </header>
  );
};
