'use client';

import { useEffect } from 'react';
import { OfflineBanner } from './OfflineBanner';
import { InstallPrompt } from './InstallPrompt';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.warn('SW registration failed:', err);
      });
    }
  }, []);

  return (
    <>
      <OfflineBanner />
      {children}
      <InstallPrompt />
    </>
  );
}

export default PWAProvider;
