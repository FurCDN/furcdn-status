import { Analytics } from '@vercel/analytics/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Noto_Sans_TC } from 'next/font/google';
import './globals.css';

const notoSansTC = Noto_Sans_TC({
  weight: ['400', '500', '700'],
  preload: false,
  display: 'swap',
  variable: '--font-noto-sans-tc',
});

export const metadata = {
  title: 'FurCDN Status',
  description: 'FurCDN service status — real-time monitoring',
  robots: { index: false, follow: false },
  icons: {
    icon: 'https://oss.furcdn.us/furcdn_favicon.svg',
    shortcut: 'https://oss.furcdn.us/furcdn_favicon.svg',
    apple: 'https://oss.furcdn.us/furcdn_favicon.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#09090b',
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="zh-Hant"
      className={`${GeistSans.variable} ${GeistMono.variable} ${notoSansTC.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
