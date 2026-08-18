export type CanaryLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
export type UpdateFrequency = 'REALTIME' | 'DAILY' | 'MONTHLY';

export interface CanaryIndicator {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number; // percentage or bps change
  unit: string;
  level: CanaryLevel;
  frequency: UpdateFrequency;
  history: { date: string; value: number }[];
  description: string;
}

export interface CanaryStatus {
  overallLevel: CanaryLevel;
  overallScore: number; // 0-100
  lastUpdated: string;
  indicators: {
    realtime: {
      credit: CanaryIndicator[];
      macro: CanaryIndicator[];
      banking: CanaryIndicator[];
    };
    fundamentals: CanaryIndicator[]; // Monthly/Delayed data
  };
  activeAlerts: string[];
  aiAnalysis?: {
    summary: string;
    riskLevel: string;
    keyFactors: string[];
    timestamp: string;
  };
}
