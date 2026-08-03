import clsx from 'clsx';
import { CircleAlert, CircleCheck, CircleHelp, CirclePause } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
  HISTORY_DAYS,
  averageRatio,
  buildDailyBars,
  fetchMonitors,
  formatRatio,
  groupMonitors,
  isDown,
  overallStatus,
  statusInfo,
  stripGroupPrefix,
  type Monitor,
  type OverallStatus,
  type OverallText,
  type StatusClass,
} from '@/lib/uptimerobot';
import { getEvents, localizeEvent } from '@/lib/events';
import { getLocale } from '@/lib/locale';
import { DATE_LOCALES, getDict, type Dict } from '@/lib/i18n';
import { AutoRefresh } from '@/components/auto-refresh';
import { EventList } from '@/components/event-list';
import { LanguageSwitcher } from '@/components/language-switcher';
import { MonitorList, type MonitorGroupData } from '@/components/monitor-list';
import { UpdatedTime } from '@/components/updated-time';

export const revalidate = 30;

const REFRESH_SECONDS = 60;
const RECENT_WINDOW = 30;

const overallIcons: Record<StatusClass, LucideIcon> = {
  up: CircleCheck,
  down: CircleAlert,
  paused: CirclePause,
  unknown: CircleHelp,
};

const overallIconColors: Record<StatusClass, string> = {
  up: 'text-emerald-400',
  down: 'text-red-400',
  paused: 'text-zinc-400',
  unknown: 'text-amber-400',
};

const OVERALL_KEY: Record<OverallText, keyof Dict['overall']> = {
  'All systems operational': 'up',
  'All monitors paused': 'paused',
  'Major outage': 'down_major',
  'Partial outage': 'down_partial',
};

interface Overall {
  cls: StatusClass;
  text: string;
}

export default async function StatusPage() {
  const locale = await getLocale();
  const t = getDict(locale);
  const eventDateFmt = new Intl.DateTimeFormat(DATE_LOCALES[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  let monitors: Monitor[] = [];
  let errorMessage: string | null = null;
  try {
    monitors = await fetchMonitors();
  } catch (e) {
    errorMessage = (e as Error)?.message || 'Unknown error';
  }

  const events = getEvents().map((raw) => {
    const ev = localizeEvent(raw, locale);
    return { ...ev, dateLabel: eventDateFmt.format(new Date(`${ev.date}T00:00:00`)) };
  });

  const overall: Overall = errorMessage
    ? { cls: 'down', text: t.overall.unable }
    : (() => {
        const raw: OverallStatus = overallStatus(monitors);
        return { cls: raw.cls, text: t.overall[OVERALL_KEY[raw.text]] };
      })();

  const upCount = monitors.filter((m) => m.status === 2).length;
  const affected = monitors.filter(isDown).map((m) => m.friendly_name || `#${m.id}`);

  // Groups holding an incident float to the top; everything else keeps API order.
  const groups: MonitorGroupData[] = groupMonitors(monitors)
    .map((group) => ({
      key: group.key,
      name: group.name,
      hasIssue: group.monitors.some(isDown),
      summary: t.upOfTotal(
        group.monitors.filter((m) => m.status === 2).length,
        group.monitors.length,
      ),
      rows: group.monitors.map((m) => {
        const s = statusInfo(m.status);
        const ratios = (m.custom_uptime_ratio || '').split('-');
        return {
          id: m.id,
          name: stripGroupPrefix(m.friendly_name || `Monitor ${m.id}`, group.name),
          cls: s.cls,
          statusText: t.monitor[s.text] || s.text,
          ratio30: formatRatio(ratios[2]),
          ratio90: formatRatio(ratios[3]),
          bars: buildDailyBars(m),
        };
      }),
    }))
    .sort((a, b) => Number(b.hasIssue) - Number(a.hasIssue));

  const OverallIcon = overallIcons[overall.cls];
  const updatedIso = new Date().toISOString();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-14 sm:px-6 sm:pt-10">
      <AutoRefresh seconds={REFRESH_SECONDS} />

      <header className="mb-5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-2.5">
          <h1 className="truncate text-sm font-medium text-zinc-100">FurCDN Status</h1>
          <UpdatedTime iso={updatedIso} locale={locale} label={t.updatedLabel} />
        </div>
        <LanguageSwitcher current={locale} label={t.langMenuLabel} />
      </header>

      <section
        className={clsx(
          'rounded-xl border p-4 sm:p-5',
          overall.cls === 'down'
            ? 'border-red-900/50 bg-red-950/20'
            : 'border-zinc-800/70 bg-zinc-900/30',
        )}
      >
        <div className="flex items-center gap-3">
          <OverallIcon
            className={clsx('size-5 shrink-0', overallIconColors[overall.cls])}
            strokeWidth={1.75}
          />
          <div className="min-w-0">
            <p className="text-[15px] font-medium text-zinc-100 sm:text-base">
              {overall.text}
            </p>
            {!errorMessage && monitors.length > 0 && (
              <p className="mt-0.5 text-xs text-zinc-500">
                {t.upOfTotal(upCount, monitors.length)}
                {' · '}
                {t.uptimeWindow(HISTORY_DAYS)} {averageRatio(monitors)}
              </p>
            )}
          </div>
        </div>

        {affected.length > 0 && (
          <p className="mt-3 border-t border-red-900/40 pt-3 text-xs text-zinc-300">
            <span className="text-zinc-500">{t.affected} · </span>
            {affected.join(' · ')}
          </p>
        )}
      </section>

      <div
        className={clsx(
          'mt-5 grid items-start gap-5 lg:mt-6 lg:gap-6',
          events.length > 0 && 'lg:grid-cols-[minmax(0,1fr)_20rem]',
        )}
      >
        {errorMessage ? (
          <p className="rounded-xl border border-zinc-800/70 bg-zinc-900/20 px-4 py-6 text-sm text-zinc-500">
            {errorMessage}
          </p>
        ) : monitors.length === 0 ? (
          <p className="rounded-xl border border-zinc-800/70 bg-zinc-900/20 px-4 py-6 text-sm text-zinc-500">
            {t.noMonitors}
          </p>
        ) : (
          <MonitorList
            groups={groups}
            locale={locale}
            labels={{
              title: t.monitorsTitle,
              summary: t.upOfTotal(upCount, monitors.length),
              other: t.otherGroup,
              today: t.today,
              ago30: t.daysAgo(RECENT_WINDOW),
              ago60: t.daysAgo(60),
              ago90: t.daysAgo(HISTORY_DAYS),
              uptime30: t.uptimeWindow(RECENT_WINDOW),
              uptime90: t.uptimeWindow(HISTORY_DAYS),
              bar: t.bar,
            }}
          />
        )}

        {events.length > 0 && (
          <aside className="lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto">
            <EventList
              events={events}
              labels={{
                title: t.eventsTitle,
                showAll: t.showAll(events.length),
                showLess: t.showLess,
              }}
            />
          </aside>
        )}
      </div>

      <footer className="mt-10 flex flex-col items-center gap-1.5 text-center text-[11px] leading-relaxed text-zinc-600 sm:mt-12">
        <p>
          {t.poweredBy}{' '}
          <a
            href="https://uptimerobot.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-300 opacity-70 transition-opacity duration-200 ease-out hover:opacity-100"
          >
            UptimeRobot
          </a>
          {' · '}
          {t.autoRefresh(REFRESH_SECONDS)}
          {' · '}
          <a
            href="https://t.me/FurCDN"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-medium text-zinc-300"
          >
            {t.tgChannel}
          </a>
        </p>
        <p>
          © 2022-2026{' '}
          <a
            href="https://taipei101.llc/"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline font-medium text-zinc-300"
          >
            Taipei101 Network
          </a>{' '}
          {t.copyright}
        </p>
        <p className="text-zinc-700">
          9900 Corporate Campus Dr Ste 3000, Louisville, KY 40223, United States
        </p>
      </footer>
    </main>
  );
}
