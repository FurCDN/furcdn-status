import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/events';

export const revalidate = 30;

export function GET() {
  return NextResponse.json({ events: getEvents() });
}
