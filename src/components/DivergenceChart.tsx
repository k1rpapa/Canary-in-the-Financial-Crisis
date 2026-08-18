import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DivergenceChartProps {
  title: string;
  data: any[];
  line1Key: string;
  line1Name: string;
  line1Color: string;
  line2Key: string;
  line2Name: string;
  line2Color: string;
}

export const DivergenceChart: React.FC<DivergenceChartProps> = ({
  title, data, line1Key, line1Name, line1Color, line2Key, line2Name, line2Color
}) => {
  return (
    <div className="card flex flex-col gap-4">
      <h3 className="heading-md text-secondary">{title}</h3>
      
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke={line1Color} fontSize={12} tickLine={false} axisLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke={line2Color} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderRadius: '8px' }}
              itemStyle={{ fontSize: '14px' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Line yAxisId="left" type="monotone" dataKey={line1Key} name={line1Name} stroke={line1Color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey={line2Key} name={line2Name} stroke={line2Color} strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
