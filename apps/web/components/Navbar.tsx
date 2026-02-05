'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import AuthModal from './AuthModal';
import ThemeToggle from './ThemeToggle';

// Marketing pages where navbar should appear
const MARKETING_PAGES = ['/', '/pricing', '/about', '/faq', '/terms', '/privacy', '/library'];

// Helper to check for auth cookie
function getAuthCookie(): boolean {
  if (typeof document === 'undefined') return false;
  return document.cookie.split(';').some((c) => c.trim().startsWith('auth_token='));
}

export default function Navbar() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    setIsLoggedIn(getAuthCookie());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    if (showUserMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showUserMenu]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setShowUserMenu(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const isInBuilderMode = searchParams.get('mode') === 'build';
  const isMarketingPage = MARKETING_PAGES.includes(pathname) && !isInBuilderMode;

  if (!isMounted || !isMarketingPage) {
    return null;
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'h-14 bg-[var(--bg-card)]/70 backdrop-blur-xl border-b border-[var(--border-secondary)] shadow-sm'
            : 'h-16 bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
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
              <span className="font-bold text-[var(--text-primary)] text-lg">Adaptive</span>
              <span className="font-medium text-[var(--text-muted)] text-lg ml-1">Courses</span>
            </div>
          </a>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {isLoggedIn ? (
              <>
                <a
                  href="/library"
                  className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-3 py-2"
                >
                  Library
                </a>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowUserMenu(!showUserMenu);
                    }}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:ring-2 hover:ring-[var(--border-primary)]"
                    style={{ background: 'var(--bg-glass-dark)' }}
                  >
                    <svg
                      className="w-5 h-5"
                      style={{ color: 'var(--royal-blue)' }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </button>
                  {showUserMenu && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--border-secondary)] py-2 z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <a
                        href="/library"
                        className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-glass-dark)]"
                      >
                        My Library
                      </a>
                      <a
                        href="/account"
                        className="block px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-glass-dark)]"
                      >
                        Account Settings
                      </a>
                      <hr className="my-2 border-[var(--border-secondary)]" />
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="w-full text-left px-4 py-2 text-sm text-[var(--error-text)] hover:bg-[var(--error-bg)] disabled:opacity-50"
                      >
                        {isLoggingOut ? 'Signing out...' : 'Sign out'}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors px-3 py-2"
                >
                  Sign in
                </button>
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="text-sm font-medium text-[var(--text-inverted)] px-4 py-2 rounded-lg transition-all hover:shadow-lg"
                  style={{ background: 'var(--royal-blue)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--royal-blue-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--royal-blue)')}
                >
                  Get started
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
