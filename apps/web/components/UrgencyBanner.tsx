'use client';

import { useState, useEffect } from 'react';

interface UrgencyBannerProps {
  type?: 'early-pricing' | 'limited-slots' | 'launch-week';
}

export default function UrgencyBanner({ type = 'early-pricing' }: UrgencyBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 32,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
        }
        if (minutes < 0) {
          minutes = 59;
          hours--;
        }
        if (hours < 0) {
          hours = 23;
          days--;
        }
        if (days < 0) {
          days = 0;
          hours = 0;
          minutes = 0;
          seconds = 0;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (type === 'early-pricing') {
    return (
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-2 sm:py-3 px-3 sm:px-4 text-center shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-xs sm:text-base">
          <span className="flex items-center gap-1 sm:gap-2">
            🔥 <strong>Early Price:</strong> $5 
            <span className="hidden sm:inline text-white/80 line-through ml-1">$15</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1 sm:gap-2 font-mono font-bold text-xs sm:text-base">
            {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
          </span>
        </div>
      </div>
    );
  }

  if (type === 'limited-slots') {
    return (
      <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🚀</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-indigo-900">
              <strong className="text-lg">Early Access Pricing</strong>
            </p>
            <p className="text-xs text-indigo-700 mt-1">
              First course FREE • Future courses $2 each (no subscription)
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
