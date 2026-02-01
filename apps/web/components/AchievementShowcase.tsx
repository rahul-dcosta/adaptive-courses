'use client';

import AchievementBadge from './AchievementBadge';

const ACHIEVEMENTS = [
  {
    id: 'first_course',
    name: 'First Course',
    description: 'Complete your first course',
    icon: '🎓',
    rarity: 'common' as const,
    unlocked: true,
    unlockedAt: new Date('2026-01-31')
  },
  {
    id: 'early_adopter',
    name: 'Early Adopter',
    description: 'Joined before 100 users',
    icon: '🚀',
    rarity: 'legendary' as const,
    unlocked: true,
    unlockedAt: new Date('2026-01-31')
  },
  {
    id: 'speed_learner',
    name: 'Speed Learner',
    description: 'Complete a course in under 20 minutes',
    icon: '⚡',
    rarity: 'rare' as const,
    unlocked: false
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on all quizzes in a course',
    icon: '💯',
    rarity: 'rare' as const,
    unlocked: false
  },
  {
    id: 'streak_7',
    name: '7 Day Streak',
    description: 'Learn something new 7 days in a row',
    icon: '🔥',
    rarity: 'rare' as const,
    unlocked: false
  },
  {
    id: 'referral_master',
    name: 'Referral Master',
    description: 'Refer 3 friends who complete a course',
    icon: '💰',
    rarity: 'legendary' as const,
    unlocked: false
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Finish 10 courses',
    icon: '🏆',
    rarity: 'legendary' as const,
    unlocked: false
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a course after midnight',
    icon: '🦉',
    rarity: 'common' as const,
    unlocked: false
  }
];

export default function AchievementShowcase() {
  const unlockedCount = ACHIEVEMENTS.filter(b => b.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Achievements</h2>
          <p className="text-gray-600">
            {unlockedCount}/{totalCount} unlocked
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black text-indigo-600">{Math.round((unlockedCount / totalCount) * 100)}%</div>
          <p className="text-xs text-gray-500">Complete</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Badges grid */}
      <div className="grid grid-cols-4 gap-6">
        {ACHIEVEMENTS.map((badge) => (
          <AchievementBadge key={badge.id} badge={badge} />
        ))}
      </div>

      {/* Next achievement hint */}
      <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
        <p className="text-sm text-gray-700">
          <strong>Next milestone:</strong> Complete a course in under 20 minutes to unlock{' '}
          <span className="font-semibold text-indigo-600">⚡ Speed Learner</span>
        </p>
      </div>
    </div>
  );
}
