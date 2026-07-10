import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Noto_Sans_JP, Noto_Sans_TC } from 'next/font/google';
import './globals.css';
import type { Locale } from '@/lib/i18n';
import { getLocale } from '@/lib/locale';

const notoSansTC = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  preload: false,
  display: 'swap',
  variable: '--font-noto-sans-tc',
});

const notoSansJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  preload: false,
  display: 'swap',
  variable: '--font-noto-sans-jp',
});

const HTML_LANG: Record<Locale, string> = {
  'zh-Hant': 'zh-Hant',
  yue: 'yue-Hant-HK',
  en: 'en',
  ja: 'ja',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://status.furcdn.us'),
  title: 'FurCDN Status',
  description: 'FurCDN 服務即時狀態 — Real-time service status powered by UptimeRobot.',
  alternates: { canonical: '/' },
  icons: {
    icon: 'https://oss.furcdn.us/furcdn_favicon.svg',
    shortcut: 'https://oss.furcdn.us/furcdn_favicon.svg',
    apple: 'https://oss.furcdn.us/furcdn_favicon.svg',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FurCDN Status',
  alternateName: 'FurCDN 狀態頁',
  url: 'https://status.furcdn.us',
  description: 'FurCDN 服務即時狀態頁 — Real-time service status.',
  inLanguage: 'zh-Hant',
  publisher: {
    '@type': 'Organization',
    name: 'SLOWSPEED NETWORK LLC.',
    url: 'https://www.furcdn.us',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#09090b',
  colorScheme: 'dark',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html
      lang={HTML_LANG[locale] || 'zh-Hant'}
      className={`${GeistSans.variable} ${GeistMono.variable} ${notoSansTC.variable} ${notoSansJP.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
