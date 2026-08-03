import 'server-only';

const API_URL = 'https://api.uptimerobot.com/v2/getMonitors';

export const HISTORY_DAYS = 90;
const DAY_MS = 86_400_000;

export type StatusClass = 'up' | 'down' | 'paused' | 'unknown';
export type BarClass = 'up' | 'down' | 'partial' | 'na';
export type MonitorStatusText =
  | 'Operational'
  | 'Degraded'
  | 'Down'
  | 'Paused'
  | 'Pending'
  | 'Unknown';

export interface MonitorLog {
  type: number;
  datetime: number;
  duration?: number;
}

export interface Monitor {
  id: number;
  friendly_name?: string;
  url?: string;
  status: number;
  create_datetime?: number;
  custom_uptime_ratio?: string;
  logs?: MonitorLog[];
}

export interface DailyBar {
  cls: BarClass;
  timestamp: number;
  downSec: number;
}

export interface StatusInfo {
  cls: StatusClass;
  text: MonitorStatusText;
}

export type OverallText =
  | 'All systems operational'
  | 'All monitors paused'
  | 'Major outage'
  | 'Partial outage';

export interface OverallStatus {
  cls: StatusClass;
  text: OverallText;
}

interface UptimeRobotResponse {
  stat: string;
  error?: { message?: string; type?: string };
  monitors?: Monitor[];
}

export async function fetchMonitors({
  revalidate = 30,
}: { revalidate?: number } = {}): Promise<Monitor[]> {
  const apiKey = process.env.UPTIMEROBOT_API_KEY;
  if (!apiKey) {
    throw new Error('UPTIMEROBOT_API_KEY is not set');
  }

  const body = new URLSearchParams({
    api_key: apiKey,
    format: 'json',
    logs: '1',
    logs_limit: '50',
    log_types: '1-2',
    custom_uptime_ratios: '1-7-30-90',
    all_time_uptime_ratio: '1',
    response_times: '0',
  });

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache',
    },
    body: body.toString(),
    next: { revalidate },
  });

  if (!res.ok) throw new Error(`UptimeRobot HTTP ${res.status}`);
  const data = (await res.json()) as UptimeRobotResponse;
  if (data.stat !== 'ok') {
    throw new Error(data.error?.message || data.error?.type || 'UptimeRobot API error');
  }
  return data.monitors || [];
}

export function statusInfo(status: number): StatusInfo {
  switch (status) {
    case 0: return { cls: 'paused', text: 'Paused' };
    case 1: return { cls: 'unknown', text: 'Pending' };
    case 2: return { cls: 'up', text: 'Operational' };
    case 8: return { cls: 'down', text: 'Degraded' };
    case 9: return { cls: 'down', text: 'Down' };
    default: return { cls: 'unknown', text: 'Unknown' };
  }
}

export function overallStatus(monitors: Monitor[]): OverallStatus {
  const active = monitors.filter((m) => m.status !== 0);
  if (active.length === 0) return { cls: 'paused', text: 'All monitors paused' };
  const down = active.filter((m) => m.status === 8 || m.status === 9);
  if (down.length === 0) return { cls: 'up', text: 'All systems operational' };
  if (down.length === active.length) return { cls: 'down', text: 'Major outage' };
  return { cls: 'down', text: 'Partial outage' };
}

const GROUP_SEPARATORS = [' — ', ' – ', ' - ', ' | ', ' / ', ' :: ', '：', ': '];
const MAX_PREFIX_LENGTH = 24;
const MIN_GROUPED_SHARE = 0.6;

export interface MonitorGroup {
  key: string;
  /** null renders as the localized "Other" heading, or as no heading at all when it is the only group. */
  name: string | null;
  monitors: Monitor[];
}

/** Longest common naming convention wins: "Edge - Tokyo" and "Edge | HK" both group under "Edge". */
function groupPrefix(name: string): string | null {
  let best: string | null = null;
  let bestIndex = Infinity;

  for (const sep of GROUP_SEPARATORS) {
    const index = name.indexOf(sep);
    if (index <= 0 || index >= bestIndex) continue;
    const prefix = name.slice(0, index).trim();
    const rest = name.slice(index + sep.length).trim();
    if (!prefix || !rest || prefix.length > MAX_PREFIX_LENGTH) continue;
    best = prefix;
    bestIndex = index;
  }
  return best;
}

/**
 * Groups monitors by a shared name prefix, but only when the naming is
 * consistent enough to be useful — otherwise everything stays in one flat list.
 */
export function groupMonitors(monitors: Monitor[]): MonitorGroup[] {
  const flat: MonitorGroup[] = [{ key: 'all', name: null, monitors }];
  if (monitors.length < 4) return flat;

  const prefixes = monitors.map((m) => groupPrefix(m.friendly_name || ''));
  const counts = new Map<string, number>();
  for (const prefix of prefixes) {
    if (prefix) counts.set(prefix, (counts.get(prefix) || 0) + 1);
  }

  const shared = new Set(
    [...counts.entries()].filter(([, n]) => n >= 2).map(([prefix]) => prefix),
  );
  const covered = [...shared].reduce((sum, prefix) => sum + (counts.get(prefix) || 0), 0);
  if (shared.size < 2 || covered < monitors.length * MIN_GROUPED_SHARE) return flat;

  const groups = new Map<string, MonitorGroup>();
  const rest: Monitor[] = [];

  monitors.forEach((monitor, i) => {
    const prefix = prefixes[i];
    if (!prefix || !shared.has(prefix)) {
      rest.push(monitor);
      return;
    }
    let group = groups.get(prefix);
    if (!group) {
      group = { key: prefix, name: prefix, monitors: [] };
      groups.set(prefix, group);
    }
    group.monitors.push(monitor);
  });

  const result = [...groups.values()];
  if (rest.length) result.push({ key: '__other', name: null, monitors: rest });
  return result;
}

export function stripGroupPrefix(name: string, prefix: string | null): string {
  if (!prefix || !name.startsWith(prefix)) return name;
  const rest = name.slice(prefix.length).replace(/^[\s\-–—|/:：]+/, '');
  return rest || name;
}

export function isDown(monitor: Monitor): boolean {
  return monitor.status === 8 || monitor.status === 9;
}

export function buildDailyBars(monitor: Monitor): DailyBar[] {
  const todayStart = Math.floor(Date.now() / DAY_MS) * DAY_MS;
  const createdMs = (monitor.create_datetime || 0) * 1000;
  const downLogs = (monitor.logs || []).filter((l) => l.type === 1);
  const bars: DailyBar[] = [];

  for (let i = HISTORY_DAYS - 1; i >= 0; i--) {
    const dayStart = todayStart - i * DAY_MS;
    const dayEnd = dayStart + DAY_MS;

    if (createdMs > dayEnd) {
      bars.push({ cls: 'na', timestamp: dayStart, downSec: 0 });
      continue;
    }

    let downSec = 0;
    for (const log of downLogs) {
      const ls = log.datetime * 1000;
      const le = ls + (log.duration || 0) * 1000;
      const overlap = Math.max(0, Math.min(dayEnd, le) - Math.max(dayStart, ls));
      downSec += overlap / 1000;
    }

    let cls: BarClass;
    if (downSec === 0) cls = 'up';
    else if (downSec < 300) cls = 'partial';
    else cls = 'down';

    bars.push({ cls, timestamp: dayStart, downSec });
  }
  return bars;
}

/** Mean of the requested custom_uptime_ratio slot across monitors that report one. */
export function averageRatio(monitors: Monitor[], slot = 3): string {
  const values = monitors
    .map((m) => parseFloat((m.custom_uptime_ratio || '').split('-')[slot] ?? ''))
    .filter((n) => Number.isFinite(n));
  if (!values.length) return '—';
  const mean = values.reduce((sum, n) => sum + n, 0) / values.length;
  return formatRatio(String(mean));
}

export function formatRatio(value: string | undefined): string {
  const n = parseFloat(value ?? '');
  if (!Number.isFinite(n)) return '—';
  if (n >= 99.995) return '100%';
  return `${n.toFixed(2)}%`;
}
