'use client';

import { useState, useEffect } from 'react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
}

interface AchievementBadgeProps {
  badge: Badge;
  showUnlockAnimation?: boolean;
}

export default function AchievementBadge({ badge, showUnlockAnimation = false }: AchievementBadgeProps) {
  const [showAnimation, setShowAnimation] = useState(showUnlockAnimation);

  useEffect(() => {
    if (showUnlockAnimation) {
      const timer = setTimeout(() => setShowAnimation(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showUnlockAnimation]);

  const rarityColors = {
    common: 'from-gray-400 to-gray-600',
    rare: 'from-blue-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-600'
  };

  const rarityGlow = {
    common: 'shadow-gray-300',
    rare: 'shadow-purple-400',
    legendary: 'shadow-yellow-400'
  };

  return (
    <div className={`
      relative group transition-all duration-300
      ${badge.unlocked ? 'opacity-100' : 'opacity-40 grayscale'}
    `}>
      {/* Badge */}
      <div className={`
        relative w-24 h-24 rounded-2xl bg-gradient-to-br ${rarityColors[badge.rarity]}
        flex items-center justify-center
        transition-all duration-300 transform
        ${badge.unlocked 
          ? `shadow-lg ${rarityGlow[badge.rarity]} group-hover:scale-110 group-hover:shadow-xl` 
          : 'shadow-md group-hover:scale-105'
        }
        ${showAnimation ? 'animate-unlock-bounce' : ''}
      `}>
        <span className="text-4xl">{badge.icon}</span>
        
        {/* Locked overlay */}
        {!badge.unlocked && (
          <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center backdrop-blur-[2px]">
            <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        )}

        {/* Unlock animation */}
        {showAnimation && (
          <>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-400/50 to-orange-500/50 animate-ping" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-white font-bold text-sm whitespace-nowrap animate-float-up">
              Unlocked! 🎉
            </div>
          </>
        )}
      </div>

      {/* Rarity indicator */}
      {badge.unlocked && (
        <div className={`
          absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold text-white
          bg-gradient-to-r ${rarityColors[badge.rarity]} shadow-md
        `}>
          {badge.rarity === 'legendary' ? '⭐' : badge.rarity === 'rare' ? '💎' : '✓'}
        </div>
      )}

      {/* Badge info tooltip */}
      <div className={`
        absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48
        bg-gray-900 text-white text-sm rounded-xl p-3 shadow-xl
        opacity-0 group-hover:opacity-100 pointer-events-none
        transition-all duration-200 transform group-hover:-translate-y-1
        z-10
      `}>
        <p className="font-bold mb-1">{badge.name}</p>
        <p className="text-xs text-gray-300">{badge.description}</p>
        {badge.unlocked && badge.unlockedAt && (
          <p className="text-xs text-gray-400 mt-2">
            Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
          </p>
        )}
        {!badge.unlocked && (
          <p className="text-xs text-yellow-400 mt-2">
            Keep learning to unlock!
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes unlock-bounce {
          0%, 100% { transform: scale(1); }
          10% { transform: scale(1.2); }
          20% { transform: scale(0.9); }
          30% { transform: scale(1.15); }
          40% { transform: scale(0.95); }
          50% { transform: scale(1.05); }
          60% { transform: scale(1); }
        }
        @keyframes float-up {
          from {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
        }
        .animate-unlock-bounce {
          animation: unlock-bounce 1s ease-out;
        }
        .animate-float-up {
          animation: float-up 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
