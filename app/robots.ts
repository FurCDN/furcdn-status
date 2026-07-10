import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://status.furcdn.us/sitemap.xml',
    host: 'https://status.furcdn.us',
  };
}
