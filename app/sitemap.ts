import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://status.furcdn.us',
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
  ];
}
