'use client';

import { formatDistanceToNowStrict } from 'date-fns';
import { useEffect, useState } from 'react';
import { DATE_FNS_LOCALES } from '@/lib/date-locales';
import type { Locale } from '@/lib/i18n';

interface UpdatedTimeProps {
  iso: string;
  locale: Locale;
  label: string;
}

export function UpdatedTime({ iso, locale, label }: UpdatedTimeProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    const dateLocale = DATE_FNS_LOCALES[locale] ?? DATE_FNS_LOCALES.en;
    const fmt = () =>
      formatDistanceToNowStrict(new Date(iso), { addSuffix: true, locale: dateLocale });
    setText(fmt());
    const id = setInterval(() => setText(fmt()), 5000);
    return () => clearInterval(id);
  }, [iso, locale]);

  return (
    <time
      className="shrink-0 text-[11px] text-zinc-500"
      dateTime={iso}
      title={label}
      suppressHydrationWarning
    >
      {text || ' '}
    </time>
  );
}
