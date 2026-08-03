import type { BarClass, StatusClass } from './uptimerobot';

export const dotColors: Record<StatusClass, string> = {
  up: 'bg-emerald-500',
  down: 'bg-red-500',
  paused: 'bg-zinc-500',
  unknown: 'bg-amber-500',
};

export const statusTextColors: Record<StatusClass, string> = {
  up: 'text-emerald-400',
  down: 'text-red-400',
  paused: 'text-zinc-500',
  unknown: 'text-amber-400',
};

export const barColors: Record<BarClass, string> = {
  up: 'bg-emerald-500',
  down: 'bg-red-500',
  partial: 'bg-amber-500',
  na: 'bg-zinc-800',
};
