'use client';

import clsx from 'clsx';
import { format, formatDuration, intervalToDuration } from 'date-fns';
import { Tooltip } from 'radix-ui';
import { DATE_FNS_LOCALES } from '@/lib/date-locales';
import type { Locale } from '@/lib/i18n';
import { barColors } from '@/lib/status-styles';
import type { BarClass, DailyBar } from '@/lib/uptimerobot';

export interface BarLabels {
  noIncidents: string;
  brief: string;
  outage: string;
  noData: string;
  downtime: string;
}

const verdictColors: Record<BarClass, string> = {
  up: 'text-emerald-400',
  partial: 'text-amber-400',
  down: 'text-red-400',
  na: 'text-zinc-500',
};

export function verdictText(cls: BarClass, labels: BarLabels): string {
  switch (cls) {
    case 'up':
      return labels.noIncidents;
    case 'partial':
      return labels.brief;
    case 'down':
      return labels.outage;
    default:
      return labels.noData;
  }
}

/** Newest 30 days always show, 60 from sm (large phone), all 90 from md (tablet up). */
function visibilityClass(index: number, total: number): string {
  const fromEnd = total - index;
  if (fromEnd > 60) return 'hidden md:block';
  if (fromEnd > 30) return 'hidden sm:block';
  return '';
}

interface UptimeBarsProps {
  bars: DailyBar[];
  labels: BarLabels;
  locale: Locale;
}

export function UptimeBars({ bars, labels, locale }: UptimeBarsProps) {
  const dateLocale = DATE_FNS_LOCALES[locale] ?? DATE_FNS_LOCALES.en;
  const total = bars.length;

  return (
    <div
      className="flex h-7 items-stretch gap-[2px] sm:h-6 sm:gap-[1.5px] md:gap-px"
      aria-hidden
    >
      {bars.map((bar, i) => {
        const downtime =
          bar.downSec > 0
            ? formatDuration(
                intervalToDuration({ start: 0, end: Math.round(bar.downSec) * 1000 }),
                { format: ['hours', 'minutes', 'seconds'], locale: dateLocale },
              )
            : '';

        return (
          <Tooltip.Root key={bar.timestamp}>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                tabIndex={-1}
                className={clsx(
                  'min-w-0 flex-1 rounded-[1.5px] transition-[filter,opacity] duration-150',
                  'hover:brightness-150 focus-visible:outline-none',
                  barColors[bar.cls],
                  visibilityClass(i, total),
                )}
              />
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                sideOffset={6}
                collisionPadding={12}
                className="z-30 rounded-md border border-zinc-700/80 bg-zinc-950/95 px-3 py-2 text-xs shadow-lg shadow-black/40 backdrop-blur select-none data-[state=delayed-open]:animate-[fade-in_140ms_ease-out]"
              >
                <div className="font-medium text-zinc-100">
                  {format(new Date(bar.timestamp), 'PP', { locale: dateLocale })}
                </div>
                <div className={clsx('mt-0.5', verdictColors[bar.cls])}>
                  {verdictText(bar.cls, labels)}
                </div>
                {downtime && (
                  <div className="mt-0.5 text-zinc-400">
                    {labels.downtime} · {downtime}
                  </div>
                )}
                <Tooltip.Arrow className="fill-zinc-700/80" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        );
      })}
    </div>
  );
}
