export function formatDuration(ms: number | null): string {
  if (ms === null) return '—';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export type Conclusion = 'success' | 'failure' | 'cancelled' | 'skipped' | 'in_progress' | 'queued' | null;

export function conclusionColor(conclusion: string | null, status: string): string {
  if (status === 'in_progress') return '#f59e0b';
  if (status === 'queued') return '#6b7280';
  switch (conclusion) {
    case 'success': return '#22c55e';
    case 'failure': return '#ef4444';
    case 'cancelled': return '#6b7280';
    case 'skipped': return '#94a3b8';
    default: return '#6b7280';
  }
}

export function conclusionLabel(conclusion: string | null, status: string): string {
  if (status === 'in_progress') return 'Running';
  if (status === 'queued') return 'Queued';
  if (!conclusion) return 'Unknown';
  return conclusion.charAt(0).toUpperCase() + conclusion.slice(1);
}
