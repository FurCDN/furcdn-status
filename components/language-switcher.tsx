'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import type { Locale } from '@/lib/i18n';
import { Loader } from './loader';

const FLAG_BASE =
  'https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@gh-pages/flags';

interface Option {
  code: Locale;
  label: string;
  flag: string;
}

const OPTIONS: Option[] = [
  { code: 'zh-Hant', label: '繁體中文', flag: 'tw' },
  { code: 'yue', label: '粵語', flag: 'hk' },
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'ja', label: '日本語', flag: 'jp' },
];

interface LanguageSwitcherProps {
  current: Locale;
  label: string;
  loadingLabel: string;
}

const COOKIE_NAME = 'furcdn_locale';
const ONE_YEAR = 60 * 60 * 24 * 365;
const ACTIVE_RING = 'shadow-[0_0_0_1px_rgba(228,228,231,0.55)]';

export function LanguageSwitcher({
  current,
  label,
  loadingLabel,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pending, setPending] = useState<Locale | null>(null);

  useEffect(() => {
    if (!isPending) setPending(null);
  }, [isPending]);

  const setLocale = (code: Locale) => {
    if (code === current || isPending) return;
    document.cookie = `${COOKIE_NAME}=${code}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
    setPending(code);
    startTransition(() => router.refresh());
  };

  return (
    <div
      role="group"
      aria-label={label}
      aria-busy={isPending}
      className="flex items-center gap-2.5"
    >
      {OPTIONS.map(({ code, label: name, flag }) => {
        // The clicked flag becomes active immediately so the click feels answered.
        const active = pending ? pending === code : code === current;
        const loading = isPending && pending === code;

        let state: string;
        if (loading || (!isPending && active)) {
          state = `opacity-100 ${ACTIVE_RING}`;
        } else if (isPending) {
          state = 'cursor-not-allowed opacity-25';
        } else {
          state = 'opacity-40 hover:scale-[1.08] hover:opacity-90';
        }

        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-label={name}
            aria-pressed={active}
            disabled={isPending}
            title={name}
            className={clsx(
              'relative h-5 w-5 rounded-full',
              'transition-[opacity,transform,box-shadow] duration-200 ease-out',
              'focus:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400',
              state,
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${FLAG_BASE}/${flag}.svg`}
              alt=""
              width={20}
              height={20}
              className={clsx(
                'block h-full w-full rounded-full transition-opacity duration-150',
                loading && 'opacity-25',
              )}
              draggable={false}
            />
            {loading && (
              <span className="absolute inset-0 grid animate-[fade-in_120ms_ease-out_120ms_both] place-items-center text-zinc-100">
                <Loader size={14} label={loadingLabel} />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
