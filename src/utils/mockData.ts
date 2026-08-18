import type { CanaryStatus } from '../types/canary';

const generateHistory = (base: number, trend: 'up' | 'down', volatility: number) => {
  let current = base;
  return Array.from({ length: 30 }).map((_, i) => {
    const change = (Math.random() - (trend === 'up' ? 0.3 : 0.7)) * volatility;
    current += change;
    return {
      date: `2026-08-${(i + 1).toString().padStart(2, '0')}`,
      value: current
    };
  });
};

export const mockCanaryStatus: CanaryStatus = {
  overallLevel: 'ORANGE',
  overallScore: 82,
  lastUpdated: '2026-08-18 13:15:00 JST',
  activeAlerts: [
    '🚨 米30年金利5.2%突破',
    '🚨 HYG Put/Call Ratio 急増',
    '🚨 新築住宅価格 YoY 二桁マイナス転落'
  ],
  indicators: {
    realtime: {
      credit: [
        {
          id: 'hyg-lqd',
          name: 'HYG / LQD Ratio',
          description: 'Junk Bond to Investment Grade',
          value: 0.71,
          previousValue: 0.73,
          change: -2.74,
          unit: 'x',
          level: 'ORANGE',
          frequency: 'REALTIME',
          history: generateHistory(0.75, 'down', 0.02)
        },
        {
          id: 'hyg-tlt',
          name: 'HYG / TLT Ratio',
          description: 'Junk Bond vs Long-Term Treasury',
          value: 0.82,
          previousValue: 0.84,
          change: -2.38,
          unit: 'x',
          level: 'YELLOW',
          frequency: 'REALTIME',
          history: generateHistory(0.85, 'down', 0.015)
        },
        {
          id: 'hyg-put-call',
          name: 'HYG Put/Call Ratio',
          description: 'Options market hedging demand',
          value: 3.03,
          previousValue: 2.85,
          change: 6.32,
          unit: 'x',
          level: 'RED',
          frequency: 'REALTIME',
          history: generateHistory(2.1, 'up', 0.1)
        }
      ],
      macro: [
        {
          id: 'copper-gold',
          name: 'Copper / Gold Ratio',
          description: 'Real economy vs Safe haven',
          value: 0.18,
          previousValue: 0.19,
          change: -5.26,
          unit: 'x',
          level: 'YELLOW',
          frequency: 'REALTIME',
          history: generateHistory(0.22, 'down', 0.01)
        },
        {
          id: 'gold-sp500',
          name: 'Gold / S&P500 Ratio',
          description: 'Capital flight to physical asset',
          value: 0.45,
          previousValue: 0.42,
          change: 7.14,
          unit: 'x',
          level: 'ORANGE',
          frequency: 'REALTIME',
          history: generateHistory(0.38, 'up', 0.01)
        },
        {
          id: 'diesel-crack',
          name: 'Diesel Crack Spread',
          description: 'Industrial fuel demand',
          value: 24.50,
          previousValue: 27.20,
          change: -9.93,
          unit: 'USD/bbl',
          level: 'ORANGE',
          frequency: 'REALTIME',
          history: generateHistory(30.0, 'down', 0.8)
        },
        {
          id: 'us30y',
          name: 'US 30Y Treasury Yield',
          description: 'Long-term borrowing cost',
          value: 5.21,
          previousValue: 5.16,
          change: 0.97,
          unit: '%',
          level: 'RED',
          frequency: 'REALTIME',
          history: generateHistory(4.8, 'up', 0.05)
        },
        {
          id: 'curve-30y10y',
          name: '30Y - 10Y Spread',
          description: 'Yield curve steepness (Term premium)',
          value: 59.0,
          previousValue: 54.0,
          change: 5.0,
          unit: 'bps',
          level: 'YELLOW',
          frequency: 'REALTIME',
          history: generateHistory(40, 'up', 2)
        }
      ],
      banking: [
        {
          id: 'kre',
          name: 'KRE Regional Bank ETF',
          description: 'Banking sector health',
          value: 41.25,
          previousValue: 43.10,
          change: -4.29,
          unit: 'USD',
          level: 'ORANGE',
          frequency: 'REALTIME',
          history: generateHistory(45.0, 'down', 0.5)
        }
      ]
    },
    fundamentals: [
      {
        id: 'new-home-price',
        name: 'New Home Median Price',
        description: 'YoY Growth Rate (Demand exhaustion)',
        value: -11.4,
        previousValue: -8.2,
        change: -3.2,
        unit: '% YoY',
        level: 'RED',
        frequency: 'MONTHLY',
        history: generateHistory(-2.0, 'down', 1.5)
      },
      {
        id: 'housing-starts',
        name: 'Housing Starts',
        description: 'New residential construction projects',
        value: 1395,
        previousValue: 1420,
        change: -1.76,
        unit: 'k units',
        level: 'ORANGE',
        frequency: 'MONTHLY',
        history: generateHistory(1550, 'down', 20)
      }
    ]
  },
  aiAnalysis: {
    summary: 'The dashboard indicates a significant convergence of risk factors. The HYG Put/Call ratio has surged beyond the critical threshold of 3.0, suggesting massive institutional hedging against a credit event. Concurrently, US 30Y Treasury yields remain elevated above 5.2%, creating a crowding-out effect. The double-digit decline in new home prices confirms the real economy is buckling under this rate environment.',
    riskLevel: 'HIGH ALERT / SYSTEMIC RISK',
    keyFactors: [
      'HYG Put/Call ratio at 3.03 indicates unprecedented downside protection demand in junk bonds.',
      'US 30Y Yield at 5.21% continues to squeeze real estate and corporate refinancing.',
      'New Home Median Price dropping 11.4% YoY signals a demand collapse in housing.'
    ],
    timestamp: '2026-08-18 13:15:00 JST'
  }
};

export const mockDivergenceData = Array.from({ length: 60 }).map((_, i) => {
  return {
    date: `Day ${i + 1}`,
    sp500: 5400 + (Math.random() * 200 - 50) + (i * 2), // Trending up slightly
    hygLqd: 0.8 - (i * 0.002) + (Math.random() * 0.02 - 0.01) // Trending down
  };
});
