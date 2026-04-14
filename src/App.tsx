import React, { useEffect, useState, useCallback } from 'react';
import { api, Repo, Workflow, WorkflowRun, PipelineStats } from './services/api';
import { StatsBar } from './components/StatsBar';
import { TrendChart } from './components/TrendChart';
import { RunsTable } from './components/RunsTable';
import { JobDrawer } from './components/JobDrawer';

const DAYS_OPTIONS = [7, 14, 30, 90];

export default function App() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repo | null>(null);

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | undefined>();

  const [stats, setStats] = useState<PipelineStats | null>(null);
  const [runs, setRuns] = useState<WorkflowRun[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [days, setDays] = useState(30);

  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);

  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load repos on mount
  useEffect(() => {
    api.getRepos()
      .then((data) => setRepos(data.repos))
      .catch((e) => setError(e.message))
      .finally(() => setLoadingRepos(false));
  }, []);

  // Load workflows when repo changes
  useEffect(() => {
    if (!selectedRepo) return;
    setSelectedWorkflowId(undefined);
    setWorkflows([]);
    api.getWorkflows(selectedRepo.owner, selectedRepo.name)
      .then((data) => setWorkflows(data.workflows))
      .catch(console.error);
  }, [selectedRepo]);

  // Load stats + runs when repo/workflow/days/page changes
  const loadData = useCallback(() => {
    if (!selectedRepo) return;
    setLoadingData(true);
    setError(null);

    Promise.all([
      api.getStats(selectedRepo.owner, selectedRepo.name, selectedWorkflowId, days),
      api.getRuns(selectedRepo.owner, selectedRepo.name, {
        workflow_id: selectedWorkflowId,
        per_page: 20,
        page,
      }),
    ])
      .then(([statsData, runsData]) => {
        setStats(statsData);
        setRuns(runsData.runs);
        setTotalCount(runsData.totalCount);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoadingData(false));
  }, [selectedRepo, selectedWorkflowId, days, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const totalPages = Math.ceil(totalCount / 20);

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '0 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '56px', gap: '16px' }}>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#f1f5f9', letterSpacing: '-0.02em' }}>
            ⬡ Pipeline Visualiser
          </span>
          <span style={{ color: '#334155', fontSize: '18px' }}>|</span>
          <span style={{ fontSize: '12px', color: '#64748b' }}>GitHub Actions Dashboard</span>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
        {/* Controls */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
          {/* Repo selector */}
          <select
            value={selectedRepo?.fullName || ''}
            onChange={(e) => {
              const repo = repos.find((r) => r.fullName === e.target.value) || null;
              setSelectedRepo(repo);
              setPage(1);
            }}
            style={selectStyle}
            disabled={loadingRepos}
          >
            <option value="">{loadingRepos ? 'Loading repos…' : 'Select a repository'}</option>
            {repos.map((r) => (
              <option key={r.id} value={r.fullName}>{r.fullName}</option>
            ))}
          </select>

          {/* Workflow filter */}
          {workflows.length > 1 && (
            <select
              value={selectedWorkflowId || ''}
              onChange={(e) => {
                setSelectedWorkflowId(e.target.value ? Number(e.target.value) : undefined);
                setPage(1);
              }}
              style={selectStyle}
            >
              <option value="">All workflows</option>
              {workflows.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          )}

          {/* Days filter */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {DAYS_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => { setDays(d); setPage(1); }}
                style={{
                  ...btnStyle,
                  background: days === d ? '#3b82f6' : '#1e293b',
                  color: days === d ? '#fff' : '#94a3b8',
                }}
              >
                {d}d
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button onClick={loadData} style={{ ...btnStyle, marginLeft: 'auto' }} disabled={loadingData}>
            {loadingData ? '↻ Loading…' : '↻ Refresh'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: '#450a0a', border: '1px solid #7f1d1d', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', color: '#fca5a5', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!selectedRepo && !loadingRepos && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>⬡</div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#64748b' }}>Select a repository to get started</div>
            <div style={{ fontSize: '13px', marginTop: '8px' }}>Only repos with GitHub Actions workflows are shown</div>
          </div>
        )}

        {/* Stats */}
        {selectedRepo && stats && !loadingData && (
          <>
            <StatsBar stats={stats} />
            <TrendChart trend={stats.trend} />
          </>
        )}

        {/* Runs table */}
        {selectedRepo && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Workflow Runs {totalCount > 0 && <span style={{ color: '#64748b' }}>({totalCount} total)</span>}
              </h2>
            </div>

            {loadingData
              ? <div style={{ color: '#64748b', padding: '40px', textAlign: 'center' }}>Loading…</div>
              : <RunsTable runs={runs} onSelectRun={setSelectedRun} />
            }

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={btnStyle}>← Prev</button>
                <span style={{ color: '#64748b', fontSize: '13px', alignSelf: 'center' }}>Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={btnStyle}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Job detail drawer */}
      {selectedRepo && (
        <JobDrawer
          run={selectedRun}
          owner={selectedRepo.owner}
          repo={selectedRepo.name}
          onClose={() => setSelectedRun(null)}
        />
      )}
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '6px',
  color: '#e2e8f0',
  padding: '8px 12px',
  fontSize: '13px',
  cursor: 'pointer',
  outline: 'none',
  minWidth: '180px',
};

const btnStyle: React.CSSProperties = {
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '6px',
  color: '#94a3b8',
  padding: '8px 14px',
  fontSize: '12px',
  cursor: 'pointer',
  fontWeight: 500,
};
