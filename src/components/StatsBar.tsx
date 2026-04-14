import React from 'react';
import { PipelineStats } from '../services/api';
import { formatDuration } from '../utils/format';

interface Props {
  stats: PipelineStats;
}

export const StatsBar: React.FC<Props> = ({ stats }) => {
  const tiles = [
    {
      label: 'Pass Rate',
      value: stats.passRate !== null ? `${stats.passRate}%` : '—',
      color: stats.passRate !== null
        ? stats.passRate >= 80 ? '#22c55e' : stats.passRate >= 60 ? '#f59e0b' : '#ef4444'
        : '#6b7280',
    },
    { label: 'Avg Duration', value: formatDuration(stats.avgDurationMs), color: '#60a5fa' },
    { label: 'Total Runs', value: String(stats.totalRuns), color: '#e2e8f0' },
    { label: 'Passed', value: String(stats.successCount), color: '#22c55e' },
    { label: 'Failed', value: String(stats.failureCount), color: '#ef4444' },
    { label: 'Cancelled', value: String(stats.cancelledCount), color: '#6b7280' },
  ];

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
      {tiles.map((tile) => (
        <div
          key={tile.label}
          style={{
            background: '#1e293b',
            borderRadius: '8px',
            padding: '16px 20px',
            minWidth: '110px',
            flex: '1',
          }}
        >
          <div style={{ fontSize: '22px', fontWeight: 700, color: tile.color }}>
            {tile.value}
          </div>
          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {tile.label}
          </div>
        </div>
      ))}
    </div>
  );
};
