import { Suspense } from 'react';
import LandingPagePremium from '@/components/LandingPagePremium';

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LandingPagePremium />
    </Suspense>
  );
}
