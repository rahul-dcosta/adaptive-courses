import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Adaptive Courses - Learn Anything in 30 Minutes | AI-Powered Learning',
  description: 'AI-powered courses that understand your situation, not just your skill level. Perfect for factory tours, job interviews, career switches. Generate custom courses in 30 seconds.',
  keywords: 'AI learning, personalized courses, fast learning, adaptive learning, custom courses, Claude AI, 30 minute courses',
  authors: [{ name: 'Adaptive Courses' }],
  creator: 'Adaptive Courses',
  publisher: 'Adaptive Courses',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://adaptive-courses.vercel.app',
    siteName: 'Adaptive Courses',
    title: 'Adaptive Courses - Learn Anything in 30 Minutes',
    description: 'AI-powered courses tailored to YOUR situation. Factory visit tomorrow? Job interview next week? We teach exactly what you need.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Adaptive Courses - AI-Powered Learning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adaptive Courses - Learn Anything in 30 Minutes',
    description: 'AI-powered courses tailored to YOUR situation. First course FREE!',
    images: ['/og-image.png'],
    creator: '@AdaptiveCourses',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#4F46E5',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
};

import MobileOptimized from '@/components/MobileOptimized';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO tags */}
        <meta name="application-name" content="Adaptive Courses" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Adaptive Courses" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'Adaptive Courses',
              description: 'AI-powered learning platform that creates custom 30-minute courses tailored to your situation',
              url: 'https://adaptive-courses.vercel.app',
              logo: 'https://adaptive-courses.vercel.app/icon.svg',
              sameAs: [
                'https://twitter.com/AdaptiveCourses',
                'https://linkedin.com/company/adaptive-courses',
              ],
              offers: {
                '@type': 'Offer',
                price: '5.00',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                description: 'Custom AI-generated course',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <MobileOptimized>
          {children}
        </MobileOptimized>
      </body>
    </html>
  );
}
