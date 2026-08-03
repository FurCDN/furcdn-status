'use client';

import clsx from 'clsx';
import { ChevronRight } from 'lucide-react';
import { Accordion, Tooltip } from 'radix-ui';
import type { Locale } from '@/lib/i18n';
import { barColors, dotColors, statusTextColors } from '@/lib/status-styles';
import type { BarClass, DailyBar, StatusClass } from '@/lib/uptimerobot';
import { UptimeBars, type BarLabels } from './uptime-bars';

export interface MonitorRowData {
  id: number;
  name: string;
  cls: StatusClass;
  statusText: string;
  ratio30: string;
  ratio90: string;
  bars: DailyBar[];
}

export interface MonitorGroupData {
  key: string;
  /** null renders the localized "Other" heading. */
  name: string | null;
  summary: string;
  hasIssue: boolean;
  rows: MonitorRowData[];
}

export interface MonitorListLabels {
  title: string;
  summary: string;
  other: string;
  today: string;
  ago30: string;
  ago60: string;
  ago90: string;
  uptime30: string;
  uptime90: string;
  bar: BarLabels;
}

const LEGEND: BarClass[] = ['up', 'partial', 'down'];

interface MonitorListProps {
  groups: MonitorGroupData[];
  labels: MonitorListLabels;
  locale: Locale;
}

export function MonitorList({ groups, labels, locale }: MonitorListProps) {
  const grouped = groups.length > 1 || Boolean(groups[0]?.name);

  return (
    <Tooltip.Provider delayDuration={80} skipDelayDuration={300} disableHoverableContent>
      <section className="overflow-hidden rounded-xl border border-zinc-800/70 bg-zinc-900/20">
        <header className="flex items-center justify-between gap-3 border-b border-zinc-800/70 px-4 py-2.5">
          <h2 className="text-xs font-medium text-zinc-300">{labels.title}</h2>
          <span className="text-[11px] tabular-nums text-zinc-500">{labels.summary}</span>
        </header>

        {grouped ? (
          <Accordion.Root
            type="multiple"
            defaultValue={groups.map((g) => g.key)}
            className="divide-y divide-zinc-800/70"
          >
            {groups.map((group) => (
              <Accordion.Item key={group.key} value={group.key}>
                <Accordion.Header>
                  <Accordion.Trigger className="group flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors duration-150 hover:bg-zinc-900/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-zinc-600">
                    <ChevronRight className="size-3.5 shrink-0 text-zinc-600 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-zinc-300">
                      {group.name ?? labels.other}
                    </span>
                    {group.hasIssue && (
                      <span className="size-1.5 shrink-0 rounded-full bg-red-500" />
                    )}
                    <span className="shrink-0 text-[11px] tabular-nums text-zinc-500">
                      {group.summary}
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="collapse-anim overflow-hidden">
                  <ul className="divide-y divide-zinc-800/60 border-t border-zinc-800/60">
                    {group.rows.map((row) => (
                      <MonitorRow key={row.id} row={row} labels={labels} locale={locale} />
                    ))}
                  </ul>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        ) : (
          <ul className="divide-y divide-zinc-800/60">
            {groups[0].rows.map((row) => (
              <MonitorRow key={row.id} row={row} labels={labels} locale={locale} />
            ))}
          </ul>
        )}

        <footer className="flex items-center justify-between gap-3 border-t border-zinc-800/70 px-4 py-2 text-[10px] text-zinc-600">
          <span className="tabular-nums">
            <span className="sm:hidden">{labels.ago30}</span>
            <span className="hidden sm:inline md:hidden">{labels.ago60}</span>
            <span className="hidden md:inline">{labels.ago90}</span>
          </span>
          <span className="hidden items-center gap-3 sm:flex">
            {LEGEND.map((cls) => (
              <span key={cls} className="flex items-center gap-1.5">
                <span className={clsx('size-1.5 rounded-[1px]', barColors[cls])} />
                {legendText(cls, labels.bar)}
              </span>
            ))}
          </span>
          <span>{labels.today}</span>
        </footer>
      </section>
    </Tooltip.Provider>
  );
}

function legendText(cls: BarClass, bar: BarLabels): string {
  if (cls === 'up') return bar.noIncidents;
  if (cls === 'partial') return bar.brief;
  return bar.outage;
}

interface MonitorRowProps {
  row: MonitorRowData;
  labels: MonitorListLabels;
  locale: Locale;
}

function MonitorRow({ row, labels, locale }: MonitorRowProps) {
  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2.5">
      <span
        role="img"
        aria-label={row.statusText}
        className={clsx('order-1 size-1.5 shrink-0 rounded-full', dotColors[row.cls])}
      />
      <span className="order-2 min-w-0 flex-1 truncate text-[13px] text-zinc-200 sm:w-36 sm:flex-none md:w-44">
        {row.name}
      </span>
      <div className="order-5 w-full sm:order-3 sm:w-auto sm:min-w-0 sm:flex-1">
        <UptimeBars bars={row.bars} labels={labels.bar} locale={locale} />
      </div>
      <span
        className="order-3 hidden shrink-0 text-xs tabular-nums text-zinc-500 sm:order-4 md:inline"
        title={labels.uptime30}
      >
        {row.ratio30}
      </span>
      <span
        className="order-3 shrink-0 text-xs tabular-nums text-zinc-400 sm:order-4"
        title={labels.uptime90}
      >
        {row.ratio90}
      </span>
      <span
        aria-hidden
        className={clsx(
          'order-4 shrink-0 text-[11px] sm:order-5 sm:inline sm:w-16 sm:text-right',
          statusTextColors[row.cls],
          row.cls === 'up' && 'hidden',
        )}
      >
        {row.statusText}
      </span>
    </li>
  );
}
