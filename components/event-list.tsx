'use client';

import { ChevronDown } from 'lucide-react';
import { Collapsible } from 'radix-ui';
import { useState } from 'react';

export interface EventItem {
  date: string;
  dateLabel: string;
  title: string;
  description: string;
}

export interface EventListLabels {
  title: string;
  showAll: string;
  showLess: string;
}

const INITIAL_COUNT = 4;

interface EventListProps {
  events: EventItem[];
  labels: EventListLabels;
}

export function EventList({ events, labels }: EventListProps) {
  const [open, setOpen] = useState(false);
  const visible = events.slice(0, INITIAL_COUNT);
  const rest = events.slice(INITIAL_COUNT);

  return (
    <section className="rounded-xl border border-zinc-800/70 bg-zinc-900/20 p-4">
      <h2 className="mb-3 text-xs font-medium text-zinc-300">{labels.title}</h2>

      <ol>
        {visible.map((event) => (
          <EventRow key={event.date + event.title} event={event} last={!rest.length} />
        ))}
      </ol>

      {rest.length > 0 && (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
          <Collapsible.Content className="collapse-anim overflow-hidden">
            <ol>
              {rest.map((event, i) => (
                <EventRow
                  key={event.date + event.title}
                  event={event}
                  last={i === rest.length - 1}
                />
              ))}
            </ol>
          </Collapsible.Content>
          <Collapsible.Trigger className="group mt-1 flex items-center gap-1 text-[11px] text-zinc-500 transition-colors duration-150 hover:text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-600">
            {open ? labels.showLess : labels.showAll}
            <ChevronDown className="size-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </Collapsible.Trigger>
        </Collapsible.Root>
      )}
    </section>
  );
}

interface EventRowProps {
  event: EventItem;
  last: boolean;
}

function EventRow({ event, last }: EventRowProps) {
  return (
    <li
      className={
        last
          ? 'relative border-l border-transparent pl-4'
          : 'relative border-l border-zinc-800/80 pb-4 pl-4'
      }
    >
      <span className="absolute -left-[3px] top-[7px] size-1.5 rounded-full bg-zinc-600" />
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
        <span className="text-[13px] font-medium text-zinc-100">{event.title}</span>
        <time
          dateTime={event.date}
          className="shrink-0 font-mono text-[10px] text-zinc-500"
        >
          {event.dateLabel}
        </time>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-zinc-400">{event.description}</p>
    </li>
  );
}
