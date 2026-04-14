import React, { useEffect, useState } from 'react';
import { api, Job, WorkflowRun } from '../services/api';
import { formatDuration, conclusionColor, conclusionLabel } from '../utils/format';

interface Props {
  run: WorkflowRun | null;
  owner: string;
  repo: string;
  onClose: () => void;
}

export const JobDrawer: React.FC<Props> = ({ run, owner, repo, onClose }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);

  useEffect(() => {
    if (!run) return;
    setLoading(true);
    setJobs([]);
    setExpandedJob(null);
    api.getJobs(owner, repo, run.id)
      .then((data) => setJobs(data.jobs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [run, owner, repo]);

  if (!run) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40,
        }}
      />
      {/* Drawer */}
      <div
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0, width: '420px',
          background: '#0f172a', borderLeft: '1px solid #1e293b',
          zIndex: 50, overflowY: 'auto', padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#e2e8f0' }}>
              {run.name} #{run.runNumber}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              {run.branch} · {run.commit}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {loading && <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>Loading jobs…</div>}

        {!loading && jobs.map((job) => {
          const color = conclusionColor(job.conclusion, job.status);
          const isExpanded = expandedJob === job.id;

          return (
            <div
              key={job.id}
              style={{ background: '#1e293b', borderRadius: '8px', marginBottom: '10px', overflow: 'hidden' }}
            >
              <div
                onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                style={{
                  padding: '12px 16px', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 500 }}>{job.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{formatDuration(job.durationMs)}</span>
                  <span style={{ color: '#64748b', fontSize: '12px' }}>{isExpanded ? '▲' : '▼'}</span>
                </div>
              </div>

              {isExpanded && job.steps && (
                <div style={{ borderTop: '1px solid #334155' }}>
                  {job.steps.map((step) => {
                    const stepColor = conclusionColor(step.conclusion, step.status);
                    return (
                      <div
                        key={step.number}
                        style={{
                          padding: '8px 16px 8px 36px', display: 'flex',
                          alignItems: 'center', gap: '10px',
                          borderBottom: '1px solid #1a2744',
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stepColor, flexShrink: 0 }} />
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{step.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {!loading && jobs.length === 0 && (
          <div style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No jobs found for this run.</div>
        )}

        <a
          href={run.htmlUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'block', marginTop: '20px', textAlign: 'center', padding: '10px',
            background: '#1e293b', borderRadius: '8px', color: '#60a5fa',
            textDecoration: 'none', fontSize: '13px',
          }}
        >
          View on GitHub ↗
        </a>
      </div>
    </>
  );
};
