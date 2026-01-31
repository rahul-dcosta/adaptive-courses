import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/debug', '/stats'],
    },
    sitemap: 'https://adaptive-courses.vercel.app/sitemap.xml',
  };
}
