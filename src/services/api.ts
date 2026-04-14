const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export interface Repo {
  id: number;
  name: string;
  fullName: string;
  owner: string;
  private: boolean;
  defaultBranch: string;
  updatedAt: string;
  htmlUrl: string;
  workflowCount: number;
}

export interface Workflow {
  id: number;
  name: string;
  state: string;
  path: string;
  htmlUrl: string;
}

export interface WorkflowRun {
  id: number;
  name: string;
  workflowId: number;
  status: string;
  conclusion: string | null;
  branch: string;
  commit: string;
  commitMessage: string;
  actor: string;
  event: string;
  createdAt: string;
  updatedAt: string;
  durationMs: number | null;
  htmlUrl: string;
  runNumber: number;
}

export interface DailyTrend {
  date: string;
  success: number;
  failure: number;
  total: number;
}

export interface PipelineStats {
  totalRuns: number;
  passRate: number | null;
  avgDurationMs: number | null;
  successCount: number;
  failureCount: number;
  cancelledCount: number;
  trend: DailyTrend[];
}

export interface Job {
  id: number;
  name: string;
  status: string;
  conclusion: string | null;
  startedAt: string;
  completedAt: string;
  durationMs: number | null;
  steps: { name: string; status: string; conclusion: string | null; number: number }[];
  htmlUrl: string;
}

export const api = {
  getRepos: () => request<{ repos: Repo[] }>('/repos'),

  getWorkflows: (owner: string, repo: string) =>
    request<{ workflows: Workflow[] }>(`/pipeline/${owner}/${repo}/workflows`),

  getRuns: (owner: string, repo: string, params?: { workflow_id?: number; per_page?: number; page?: number; branch?: string }) => {
    const qs = new URLSearchParams();
    if (params?.workflow_id) qs.set('workflow_id', String(params.workflow_id));
    if (params?.per_page) qs.set('per_page', String(params.per_page));
    if (params?.page) qs.set('page', String(params.page));
    if (params?.branch) qs.set('branch', params.branch);
    return request<{ runs: WorkflowRun[]; totalCount: number; page: number; perPage: number }>(
      `/pipeline/${owner}/${repo}/runs${qs.toString() ? '?' + qs : ''}`
    );
  },

  getStats: (owner: string, repo: string, workflowId?: number, days = 30) => {
    const qs = new URLSearchParams({ days: String(days) });
    if (workflowId) qs.set('workflow_id', String(workflowId));
    return request<PipelineStats>(`/pipeline/${owner}/${repo}/stats?${qs}`);
  },

  getJobs: (owner: string, repo: string, runId: number) =>
    request<{ jobs: Job[] }>(`/pipeline/${owner}/${repo}/runs/${runId}/jobs`),
};
