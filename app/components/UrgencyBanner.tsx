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
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-3 px-4 text-center shadow-lg">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base">
          <span className="flex items-center gap-2">
            🔥 <strong>Early Adopter Price:</strong> $5 
            <span className="hidden sm:inline text-white/80 line-through">$15</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-2 font-mono font-bold">
            Ends in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
          </span>
        </div>
      </div>
    );
  }

  if (type === 'limited-slots') {
    const spotsLeft = 47;
    const totalSpots = 1000;
    const percentFilled = ((totalSpots - spotsLeft) / totalSpots) * 100;

    return (
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-yellow-900">
              Only <strong className="text-lg">{spotsLeft} spots left</strong> at $5 early pricing
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Price increases to $15 after reaching 1,000 early adopters
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="w-full bg-yellow-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${percentFilled}%` }}
            />
          </div>
          <p className="text-xs text-yellow-700 mt-2 text-right">
            {totalSpots - spotsLeft} of {totalSpots} spots claimed
          </p>
        </div>
      </div>
    );
  }

  return null;
}
