'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

const barColors = {
  up: 'bg-emerald-500',
  down: 'bg-red-500',
  partial: 'bg-amber-500',
  na: 'bg-zinc-800',
};

const verdicts = {
  up: { text: 'No incidents reported', color: 'text-emerald-400' },
  partial: { text: 'Brief incident', color: 'text-amber-400' },
  down: { text: 'Outage detected', color: 'text-red-400' },
  na: { text: 'No monitoring data', color: 'text-zinc-500' },
};

const dateFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

function formatDuration(sec) {
  if (sec < 60) return `${Math.round(sec)}s`;
  if (sec < 3600) {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec - m * 60);
    return s ? `${m}m ${s}s` : `${m}m`;
  }
  if (sec < 86400) {
    const h = Math.floor(sec / 3600);
    const m = Math.round((sec - h * 3600) / 60);
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  return `${(sec / 86400).toFixed(1)}d`;
}

export function UptimeBars({ bars }) {
  const [active, setActive] = useState(null);
  const lastActiveRef = useRef(null);
  const [snapshot, setSnapshot] = useState({ idx: null, leftPct: 0, txPct: -50 });

  const total = bars.length;

  useEffect(() => {
    if (active !== null) {
      lastActiveRef.current = active;
      const leftPct = ((active + 0.5) / total) * 100;
      const txPct = total > 1 ? -(active / (total - 1)) * 100 : -50;
      setSnapshot({ idx: active, leftPct, txPct });
    }
  }, [active, total]);

  const visible = active !== null;
  const bar = snapshot.idx !== null ? bars[snapshot.idx] : null;
  const v = bar ? verdicts[bar.cls] : null;

  return (
    <div className="relative">
      <div
        className="flex h-7 gap-[2px]"
        onMouseLeave={() => setActive(null)}
      >
        {bars.map((b, i) => (
          <div
            key={i}
            onMouseEnter={() => setActive(i)}
            className={clsx(
              'min-w-0 flex-1 rounded-[1.5px] transition-opacity duration-200',
              barColors[b.cls],
              active !== null && active !== i && 'opacity-35',
            )}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute bottom-full z-20 mb-2"
        style={{
          left: `${snapshot.leftPct}%`,
          transform: `translateX(${snapshot.txPct}%)`,
        }}
        aria-hidden={!visible}
      >
        <div
          className="whitespace-nowrap rounded-md border border-zinc-700/80 bg-zinc-950/95 px-3 py-2 text-xs shadow-lg shadow-black/40 backdrop-blur"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(4px)',
            transition:
              'opacity 160ms ease-out, transform 160ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {bar && v ? (
            <>
              <div className="font-medium text-zinc-100">
                {dateFmt.format(new Date(bar.timestamp))}
              </div>
              <div className={clsx('mt-0.5', v.color)}>{v.text}</div>
              {bar.downSec > 0 && (
                <div className="mt-0.5 text-zinc-400">
                  Downtime · {formatDuration(bar.downSec)}
                </div>
              )}
            </>
          ) : (
            <div className="text-zinc-500">&nbsp;</div>
          )}
        </div>
      </div>
    </div>
  );
}
