'use client';

import { useState, useEffect } from 'react';

interface StickyBottomCTAProps {
  onCTAClick?: () => void;
  threshold?: number; // Scroll percentage to trigger (0-100)
}

export default function StickyBottomCTA({ onCTAClick, threshold = 50 }: StickyBottomCTAProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const percentage = (scrolled / total) * 100;

      if (percentage > threshold && !show) {
        setShow(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [show, threshold]);

  if (!show) return null;

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-40
      bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
      shadow-2xl border-t-4 border-white/20
      transform transition-all duration-500
      ${show ? 'translate-y-0' : 'translate-y-full'}
    `}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-left">
            <p className="font-bold text-lg mb-1">
              Ready to learn something new?
            </p>
            <p className="text-sm text-indigo-100">
              🎁 First course FREE • No credit card required
            </p>
          </div>
          
          <button
            onClick={onCTAClick}
            className="bg-white text-indigo-600 font-bold px-8 py-3 rounded-xl hover:scale-105 transition-transform shadow-xl whitespace-nowrap"
          >
            Generate Your Course →
          </button>
        </div>
      </div>
    </div>
  );
}
