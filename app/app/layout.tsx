import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adaptive Courses - Learn Anything in 30 Minutes",
  description: "AI-powered courses that understand your situation, not just your skill level. Perfect for factory tours, job interviews, and learning emergencies. $5 per course.",
  keywords: [
    "AI learning",
    "custom courses",
    "personalized education",
    "Claude AI",
    "learn fast",
    "job interview prep",
    "factory tour preparation",
    "adaptive learning"
  ],
  authors: [{ name: "Rahul D'Costa" }],
  creator: "Rahul D'Costa",
  publisher: "Adaptive Courses",
  metadataBase: new URL('https://adaptive-courses.vercel.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://adaptive-courses.vercel.app',
    title: 'Adaptive Courses - Learn Anything in 30 Minutes',
    description: 'AI-powered courses that understand your situation. Factory tours, job interviews, career switches. $5 per course.',
    siteName: 'Adaptive Courses',
    images: [
      {
        url: '/og-image.png', // TODO: Create this image
        width: 1200,
        height: 630,
        alt: 'Adaptive Courses - AI-powered personalized learning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adaptive Courses - Learn Anything in 30 Minutes',
    description: 'AI-powered courses that understand your situation. $5 per course.',
    creator: '@rahuldcosta', // TODO: Update with actual Twitter handle
    images: ['/og-image.png'], // TODO: Create this image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
