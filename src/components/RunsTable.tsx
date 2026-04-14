import React, { useState } from 'react';
import { WorkflowRun } from '../services/api';
import { formatDuration, formatRelative, conclusionColor, conclusionLabel } from '../utils/format';

interface Props {
  runs: WorkflowRun[];
  onSelectRun: (run: WorkflowRun) => void;
}

const EVENT_ICONS: Record<string, string> = {
  push: '⬆',
  pull_request: '⤵',
  schedule: '⏰',
  workflow_dispatch: '▶',
};

export const RunsTable: React.FC<Props> = ({ runs, onSelectRun }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (runs.length === 0) {
    return <div style={{ color: '#64748b', padding: '24px 0' }}>No runs found.</div>;
  }

  return (
    <div style={{ background: '#1e293b', borderRadius: '8px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #334155' }}>
            {['Status', 'Run', 'Branch', 'Trigger', 'Duration', 'Started'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '10px 16px',
                  textAlign: 'left',
                  color: '#64748b',
                  fontWeight: 500,
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => {
            const color = conclusionColor(run.conclusion, run.status);
            const label = conclusionLabel(run.conclusion, run.status);
            const isHovered = hoveredId === run.id;

            return (
              <tr
                key={run.id}
                onClick={() => onSelectRun(run)}
                onMouseEnter={() => setHoveredId(run.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  borderBottom: '1px solid #1a2744',
                  cursor: 'pointer',
                  background: isHovered ? '#243451' : 'transparent',
                  transition: 'background 0.1s',
                }}
              >
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color,
                      fontWeight: 600,
                      fontSize: '12px',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: color,
                        flexShrink: 0,
                        animation: run.status === 'in_progress' ? 'pulse 1.5s infinite' : undefined,
                      }}
                    />
                    {label}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: '#e2e8f0', maxWidth: '260px' }}>
                  <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {run.name} #{run.runNumber}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', fontFamily: 'monospace' }}>
                    {run.commit} {run.commitMessage ? `— ${run.commitMessage.slice(0, 50)}` : ''}
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#94a3b8', fontFamily: 'monospace', fontSize: '12px' }}>
                  {run.branch}
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px' }}>
                  {EVENT_ICONS[run.event] || '•'} {run.event}
                </td>
                <td style={{ padding: '12px 16px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                  {formatDuration(run.durationMs)}
                </td>
                <td style={{ padding: '12px 16px', color: '#64748b', whiteSpace: 'nowrap', fontSize: '12px' }}>
                  {formatRelative(run.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
