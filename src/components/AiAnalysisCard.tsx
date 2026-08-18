import React from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';
import type { CanaryStatus } from '../types/canary';

interface AiAnalysisCardProps {
  analysis?: CanaryStatus['aiAnalysis'];
}

export const AiAnalysisCard: React.FC<AiAnalysisCardProps> = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="card flex items-center justify-center p-6" style={{ minHeight: '200px' }}>
        <p className="text-secondary flex items-center gap-2">
          <Sparkles size={18} /> AI Analysis Data not available
        </p>
      </div>
    );
  }

  // Determine glow color based on text keyword for dramatic effect
  const riskText = analysis.riskLevel.toUpperCase();
  const glowClass = riskText.includes('HIGH') || riskText.includes('CRITICAL') ? 'glow-red' :
                    riskText.includes('ELEVATED') || riskText.includes('WARNING') ? 'glow-orange' :
                    'glow-green';
  const textColor = riskText.includes('HIGH') || riskText.includes('CRITICAL') ? 'text-red' :
                    riskText.includes('ELEVATED') || riskText.includes('WARNING') ? 'text-orange' :
                    'text-green';

  return (
    <div className={`card ${glowClass} flex flex-col gap-4 relative`} style={{ borderStyle: 'dashed' }}>
      <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold" style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>
        <Sparkles size={14} className="text-blue-400" /> GEMINI AI
      </div>
      
      <div>
        <h3 className="heading-md text-secondary">AI Market Assessment</h3>
        <p className={`heading-lg mt-1 font-bold ${textColor}`}>Risk Level: {analysis.riskLevel}</p>
      </div>
      
      <div style={{ backgroundColor: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{analysis.summary}</p>
      </div>

      <div>
        <h4 className="text-xs text-secondary font-bold mb-2 uppercase tracking-wider">Key Factors</h4>
        <ul className="text-sm flex flex-col gap-2">
          {analysis.keyFactors.map((factor, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-secondary mt-1 flex-shrink-0" />
              <span style={{ color: 'var(--text-primary)' }}>{factor}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="text-xs text-secondary text-right mt-2">
        Analyzed at: {analysis.timestamp}
      </div>
    </div>
  );
};
