'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const FLAG_BASE =
  'https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@gh-pages/flags';

const OPTIONS = [
  { code: 'zh-Hant', label: '繁體中文', flag: 'tw' },
  { code: 'en', label: 'English', flag: 'gb' },
  { code: 'ja', label: '日本語', flag: 'jp' },
];

const COOKIE_NAME = 'furcdn_locale';
const ONE_YEAR = 60 * 60 * 24 * 365;

export function LanguageSwitcher({ current, label }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const setLocale = (code) => {
    if (code === current) return;
    document.cookie = `${COOKIE_NAME}=${code}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
    startTransition(() => router.refresh());
  };

  return (
    <div
      role="group"
      aria-label={label}
      className="flex items-center gap-2.5"
    >
      {OPTIONS.map(({ code, label: name, flag }) => {
        const active = code === current;
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
              active
                ? 'opacity-100 shadow-[0_0_0_1px_rgba(228,228,231,0.55)]'
                : 'opacity-40 hover:scale-[1.08] hover:opacity-90',
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${FLAG_BASE}/${flag}.svg`}
              alt=""
              width={20}
              height={20}
              className="block h-full w-full rounded-full"
              draggable={false}
            />
          </button>
        );
      })}
    </div>
  );
}
