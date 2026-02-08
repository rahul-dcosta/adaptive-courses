import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import { ThemeProvider, themeScript } from '@/lib/theme-context';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#003F87',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://adaptivecourses.ai'),
  title: 'Adaptive Courses - Any Topic. Your Course. | AI-Powered Learning',
  description: 'Any topic. Your course. AI-powered courses that understand your situation, not just your skill level. Generate custom courses in 30 seconds.',
  keywords: 'AI learning, personalized courses, fast learning, adaptive learning, custom courses, Claude AI, any topic your course',
  authors: [{ name: 'Adaptive Courses' }],
  creator: 'Adaptive Courses',
  publisher: 'Adaptive Courses',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://adaptivecourses.ai',
    siteName: 'Adaptive Courses',
    title: 'Adaptive Courses - Any Topic. Your Course.',
    description: 'Any topic. Your course. AI-powered courses tailored to YOUR situation. Generate custom courses in 30 seconds.',
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
    title: 'Adaptive Courses - Any Topic. Your Course.',
    description: 'Any topic. Your course. AI-powered courses tailored to YOUR situation. First course FREE!',
    images: ['/og-image.png'],
    creator: '@AdaptiveCourses',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon.png',
  },
};

import MobileOptimized from '@/components/MobileOptimized';
import AccessGate from '@/components/AccessGate';
import PWAProvider from '@/components/PWAProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Theme initialization script - prevents flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
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
              url: 'https://adaptivecourses.ai',
              logo: 'https://adaptivecourses.ai/icon.svg',
              sameAs: [
                'https://twitter.com/AdaptiveCourses',
                'https://linkedin.com/company/adaptive-courses',
              ],
              offers: {
                '@type': 'Offer',
                price: '3.99',
                priceCurrency: 'USD',
                availability: 'https://schema.org/InStock',
                description: 'Custom AI-generated course (first course free)',
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider defaultTheme="system">
          <PWAProvider>
            <AccessGate>
              <Suspense fallback={null}>
                <Navbar />
              </Suspense>
              <MobileOptimized>
                {children}
              </MobileOptimized>
            </AccessGate>
          </PWAProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
