'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import AuthModal from './AuthModal';

// Marketing pages where navbar should appear
const MARKETING_PAGES = ['/', '/pricing', '/about', '/faq', '/terms', '/privacy'];

export default function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Wait for client-side mount to avoid hydration issues with useSearchParams
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if we're in builder mode (even on homepage)
  const isInBuilderMode = searchParams.get('mode') === 'build';

  // Only show navbar on marketing pages, not in-app (course builder, viewer, etc)
  const isMarketingPage = MARKETING_PAGES.includes(pathname) && !isInBuilderMode;
  const isHomepage = pathname === '/' && !isInBuilderMode;

  // Don't render navbar during SSR or on in-app pages or builder mode
  if (!isMounted || !isMarketingPage) {
    return null;
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'h-14 bg-white/70 backdrop-blur-xl border-b border-[rgba(0,63,135,0.1)] shadow-sm'
            : 'h-16 bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-full relative">
          {/* Flex container for logo and auth - they sit at the edges */}
          <div className="h-full flex items-center justify-between">
            {/* Logo - Left */}
            <a href="/" className="flex items-center gap-3 group">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, var(--royal-blue) 0%, var(--royal-blue-light) 100%)',
                  boxShadow: '0 4px 12px rgba(0, 63, 135, 0.25)',
                }}
              >
                <span className="text-white font-bold text-lg font-serif">A</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-gray-900 text-lg">Adaptive</span>
                <span className="font-medium text-gray-500 text-lg ml-1">Courses</span>
              </div>
            </a>

            {/* Auth Buttons - Right */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
              >
                Sign in
              </button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm font-medium text-white px-4 py-2 rounded-lg transition-all hover:shadow-lg"
                style={{
                  background: 'var(--royal-blue)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--royal-blue-light)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--royal-blue)')}
              >
                Get started
              </button>
            </div>
          </div>

          {/* Nav Links - Absolutely centered (only on homepage) */}
          {isHomepage && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-8">
              <a
                href="#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                How it works
              </a>
              <a
                href="#examples"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Examples
              </a>
              <a
                href="/pricing"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
