'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AutoRefreshProps {
  seconds?: number;
}

export function AutoRefresh({ seconds = 60 }: AutoRefreshProps) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), seconds * 1000);
    return () => clearInterval(id);
  }, [seconds, router]);
  return null;
}
