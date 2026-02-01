import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/debug', '/stats'],
    },
    sitemap: 'https://adaptivecourses.ai/sitemap.xml',
  };
}
