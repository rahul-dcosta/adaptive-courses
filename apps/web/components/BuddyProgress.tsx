'use client';

interface BuddyData {
  id: string;
  name: string;
  currentStreak: number;
  lessonsCompleted: number;
  lastActive: string;
}

interface BuddyProgressProps {
  buddies: BuddyData[];
  className?: string;
}

export function BuddyProgress({ buddies, className = '' }: BuddyProgressProps) {
  if (buddies.length === 0) return null;

  return (
    <div
      className={`rounded-xl p-5 ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-secondary)',
      }}
    >
      <h3 className="font-semibold text-[var(--text-primary)] mb-4">Your Buddies</h3>
      <div className="space-y-3">
        {buddies.map((buddy) => (
          <div key={buddy.id} className="flex items-center gap-3">
            {/* Avatar placeholder */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ backgroundColor: 'var(--royal-blue)' }}
            >
              {buddy.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                {buddy.name}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {buddy.currentStreak > 0 && (
                  <span className="mr-2">🔥 {buddy.currentStreak} day streak</span>
                )}
                {buddy.lessonsCompleted} lessons
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuddyProgress;
