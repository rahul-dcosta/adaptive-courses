'use client';

import { useOffline } from '@/hooks/useOffline';

export function OfflineBanner() {
  const { isOffline } = useOffline();

  if (!isOffline) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9998] text-center py-2 text-sm font-medium text-white"
      style={{ backgroundColor: 'rgb(234, 88, 12)' }}
    >
      You are offline. Some features may be limited.
    </div>
  );
}

export default OfflineBanner;
