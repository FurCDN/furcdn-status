'use client';

import { useEffect, useState } from 'react';

export function UpdatedTime({ iso }) {
  const [text, setText] = useState('');

  useEffect(() => {
    const fmt = () => {
      const t = new Date(iso).getTime();
      const diff = Math.max(0, Math.floor((Date.now() - t) / 1000));
      if (diff < 60) return `${diff}s ago`;
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      return new Date(iso).toLocaleTimeString('en-GB', { hour12: false });
    };
    setText(fmt());
    const id = setInterval(() => setText(fmt()), 5000);
    return () => clearInterval(id);
  }, [iso]);

  return (
    <time
      className="text-xs text-zinc-500"
      dateTime={iso}
      suppressHydrationWarning
    >
      {text || ' '}
    </time>
  );
}
