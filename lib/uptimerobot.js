import 'server-only';

const API_URL = 'https://api.uptimerobot.com/v2/getMonitors';

export const HISTORY_DAYS = 90;
const DAY_MS = 86_400_000;

export async function fetchMonitors({ revalidate = 30 } = {}) {
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
  const data = await res.json();
  if (data.stat !== 'ok') {
    throw new Error(data.error?.message || data.error?.type || 'UptimeRobot API error');
  }
  return data.monitors || [];
}

export function statusInfo(status) {
  switch (status) {
    case 0: return { cls: 'paused', text: 'Paused' };
    case 1: return { cls: 'unknown', text: 'Pending' };
    case 2: return { cls: 'up', text: 'Operational' };
    case 8: return { cls: 'down', text: 'Degraded' };
    case 9: return { cls: 'down', text: 'Down' };
    default: return { cls: 'unknown', text: 'Unknown' };
  }
}

export function overallStatus(monitors) {
  const active = monitors.filter((m) => m.status !== 0);
  if (active.length === 0) return { cls: 'paused', text: 'All monitors paused' };
  const down = active.filter((m) => m.status === 8 || m.status === 9);
  if (down.length === 0) return { cls: 'up', text: 'All systems operational' };
  if (down.length === active.length) return { cls: 'down', text: 'Major outage' };
  return { cls: 'down', text: 'Partial outage' };
}

export function buildDailyBars(monitor) {
  const todayStart = Math.floor(Date.now() / DAY_MS) * DAY_MS;
  const createdMs = (monitor.create_datetime || 0) * 1000;
  const downLogs = (monitor.logs || []).filter((l) => l.type === 1);
  const bars = [];

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

    let cls;
    if (downSec === 0) cls = 'up';
    else if (downSec < 300) cls = 'partial';
    else cls = 'down';

    bars.push({ cls, timestamp: dayStart, downSec });
  }
  return bars;
}

export function formatRatio(value) {
  const n = parseFloat(value);
  if (!Number.isFinite(n)) return '—';
  if (n >= 99.995) return '100%';
  return `${n.toFixed(2)}%`;
}
