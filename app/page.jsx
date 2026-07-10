import clsx from 'clsx';
import {
  HISTORY_DAYS,
  buildDailyBars,
  fetchMonitors,
  formatRatio,
  overallStatus,
  statusInfo,
} from '@/lib/uptimerobot';
import { getEvents } from '@/lib/events';
import { getLocale } from '@/lib/locale';
import { INTL_LOCALES, getDict } from '@/lib/i18n';
import { AutoRefresh } from '@/components/auto-refresh';
import { UpdatedTime } from '@/components/updated-time';
import { UptimeBars } from '@/components/uptime-bars';
import { LanguageSwitcher } from '@/components/language-switcher';

export const revalidate = 30;

const REFRESH_SECONDS = 60;

const dotColors = {
  up: 'bg-emerald-500',
  down: 'bg-red-500',
  paused: 'bg-zinc-500',
  unknown: 'bg-amber-500',
};

const statusTextColors = {
  up: 'text-emerald-400',
  down: 'text-red-400',
  paused: 'text-zinc-500',
  unknown: 'text-amber-400',
};

const OVERALL_KEY = {
  'All systems operational': 'up',
  'All monitors paused': 'paused',
  'Major outage': 'down_major',
  'Partial outage': 'down_partial',
};

function cleanHost(url) {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
}

export default async function StatusPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const intlLocale = INTL_LOCALES[locale];

  const eventDateFmt = new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  let monitors = [];
  let errorMessage = null;
  try {
    monitors = await fetchMonitors();
  } catch (e) {
    errorMessage = e?.message || 'Unknown error';
  }

  const events = getEvents();

  const overallRaw = errorMessage
    ? { cls: 'down', text: t.overall.unable }
    : overallStatus(monitors);

  const overall = errorMessage
    ? overallRaw
    : {
        cls: overallRaw.cls,
        text: t.overall[OVERALL_KEY[overallRaw.text]] || overallRaw.text,
      };

  const updatedIso = new Date().toISOString();

  return (
    <main className="mx-auto max-w-[640px] px-6 py-14 sm:py-20">
      <AutoRefresh seconds={REFRESH_SECONDS} />

      <header className="mb-12 flex items-baseline justify-between">
        <h1 className="text-sm text-zinc-100">FurCDN Status</h1>
        <UpdatedTime iso={updatedIso} />
      </header>

      <div className="mb-12 flex items-center gap-2.5">
        <span className={clsx('h-2 w-2 rounded-full', dotColors[overall.cls])} />
        <span className="text-[15px] text-zinc-100">{overall.text}</span>
      </div>

      {errorMessage ? (
        <p className="text-sm text-zinc-500">{errorMessage}</p>
      ) : monitors.length === 0 ? (
        <p className="text-sm text-zinc-500">{t.noMonitors}</p>
      ) : (
        <ul className="divide-y divide-zinc-800/70 border-y border-zinc-800/70">
          {monitors.map((m) => (
            <li key={m.id}>
              <MonitorRow monitor={m} t={t} />
            </li>
          ))}
        </ul>
      )}

      {events.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xs text-zinc-500">{t.eventsTitle}</h2>
          <ul className="divide-y divide-zinc-800/70 border-y border-zinc-800/70">
            {events.map((ev, i) => (
              <li key={i} className="py-4">
                <div className="mb-1 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                  <span className="text-sm text-zinc-100">{ev.title}</span>
                  <time
                    dateTime={ev.date}
                    className="shrink-0 font-mono text-[11px] text-zinc-500"
                  >
                    {eventDateFmt.format(new Date(`${ev.date}T00:00:00`))}
                  </time>
                </div>
                <p className="text-xs leading-relaxed text-zinc-400 sm:text-[13px]">
                  {ev.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-16 flex flex-col items-center gap-3 text-center text-xs text-zinc-600">
        <p>
          {t.poweredBy}{' '}
          <a
            href="https://uptimerobot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-200 opacity-60 transition-opacity duration-200 ease-out hover:opacity-100"
          >
            UptimeRobot
          </a>
          {' · '}
          {t.autoRefresh(REFRESH_SECONDS)}
        </p>
        <p>
          © 2023-2026{' '}
          <span className="font-medium text-zinc-300">
            SLOWSPEED NETWORK LLC.
          </span>{' '}
          {t.copyright}
        </p>
        <p>
          {t.drivenBy}{' '}
          <a
            href="https://langya.io"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-medium text-zinc-300"
          >
            langya.io
          </a>
        </p>
        <div className="mt-2">
          <LanguageSwitcher current={locale} label={t.langMenuLabel} />
        </div>
      </footer>
    </main>
  );
}

function MonitorRow({ monitor, t }) {
  const s = statusInfo(monitor.status);
  const bars = buildDailyBars(monitor);
  const ratios = (monitor.custom_uptime_ratio || '').split('-');
  const r30 = formatRatio(ratios[2]);
  const r90 = formatRatio(ratios[3]);
  const host = cleanHost(monitor.url);
  const statusText = t.monitor[s.text] || s.text;

  return (
    <div className="py-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm text-zinc-100">
            {monitor.friendly_name || `Monitor ${monitor.id}`}
          </div>
          {host && (
            <div className="mt-0.5 truncate font-mono text-[11px] text-zinc-500">
              {host}
            </div>
          )}
        </div>
        <span className={clsx('shrink-0 pt-0.5 text-xs', statusTextColors[s.cls])}>
          {statusText}
        </span>
      </div>

      <UptimeBars bars={bars} />

      <div className="mt-2.5 flex items-center justify-between text-xs text-zinc-500">
        <span>{t.daysAgo(HISTORY_DAYS)}</span>
        <span className="text-zinc-400">
          {r30} <span className="text-zinc-600">{t.days(30)}</span>
          <span className="mx-2 text-zinc-700">·</span>
          {r90} <span className="text-zinc-600">{t.days(90)}</span>
        </span>
        <span>{t.today}</span>
      </div>
    </div>
  );
}
