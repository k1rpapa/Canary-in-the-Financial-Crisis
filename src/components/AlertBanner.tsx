import React from 'react';
import { AlertOctagon } from 'lucide-react';

interface AlertBannerProps {
  alerts: string[];
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2" style={{ marginBottom: '2rem' }}>
      {alerts.map((alert, index) => (
        <div key={index} className="card glow-red flex items-center gap-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '1rem' }}>
          <AlertOctagon className="text-red" size={24} />
          <span className="text-primary font-medium">{alert}</span>
        </div>
      ))}
    </div>
  );
};
