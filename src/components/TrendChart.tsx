import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from 'recharts';
import { DailyTrend } from '../services/api';

interface Props {
  trend: DailyTrend[];
}

export const TrendChart: React.FC<Props> = ({ trend }) => {
  if (trend.length === 0) {
    return (
      <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
        No run data available for this period.
      </div>
    );
  }

  const formatted = trend.map((d) => ({
    ...d,
    date: d.date.slice(5), // Show MM-DD only
  }));

  return (
    <div style={{ background: '#1e293b', borderRadius: '8px', padding: '20px', marginBottom: '24px' }}>
      <h3 style={{ margin: '0 0 16px', fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Daily Run Trend
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={formatted} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
          <Tooltip
            contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', fontSize: '12px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
          <Bar dataKey="success" name="Passed" fill="#22c55e" radius={[3, 3, 0, 0]} />
          <Bar dataKey="failure" name="Failed" fill="#ef4444" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
