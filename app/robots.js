export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://status.furcdn.us/sitemap.xml',
    host: 'https://status.furcdn.us',
  };
}
