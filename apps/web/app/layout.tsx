import type { Metadata, Viewport } from 'next';
import './globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Adaptive Courses" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Adaptive Courses" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
