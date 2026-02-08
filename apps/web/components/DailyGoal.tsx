'use client';

import { useState, useEffect } from 'react';
import {
  getDailyGoalData,
  getGoalProgress,
  getDaysGoalMetThisWeek,
  updateGoalConfig,
  GOAL_PRESETS,
  type DailyGoalData,
  type DailyGoalConfig,
} from '@/lib/daily-goals';

// =============================================================================
// Compact Daily Goal Card (for CourseViewer header)
// =============================================================================

interface CompactDailyGoalProps {
  goalData: DailyGoalData;
  className?: string;
}

export function CompactDailyGoal({ goalData, className = '' }: CompactDailyGoalProps) {
  const progress = getGoalProgress(goalData);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Circular progress */}
      <div className="relative w-8 h-8 flex-shrink-0">
        <svg className="w-8 h-8 transform -rotate-90">
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke="rgba(0, 63, 135, 0.1)"
            strokeWidth="3"
          />
          <circle
            cx="16"
            cy="16"
            r="12"
            fill="none"
            stroke={goalData.today.goalMet ? 'rgb(34, 197, 94)' : 'var(--royal-blue)'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 12}`}
            strokeDashoffset={`${2 * Math.PI * 12 * (1 - progress.percent / 100)}`}
            className="transition-all duration-500"
          />
        </svg>
        {goalData.today.goalMet && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      <span className="text-xs text-[var(--text-muted)]">{progress.label}</span>
    </div>
  );
}

// =============================================================================
// Full Daily Goal Card (for Dashboard)
// =============================================================================

interface DailyGoalCardProps {
  className?: string;
}

export function DailyGoalCard({ className = '' }: DailyGoalCardProps) {
  const [goalData, setGoalData] = useState<DailyGoalData | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    setGoalData(getDailyGoalData());
  }, []);

  if (!goalData) return null;

  const progress = getGoalProgress(goalData);
  const daysThisWeek = getDaysGoalMetThisWeek(goalData);

  const handleConfigChange = (config: DailyGoalConfig) => {
    const updated = updateGoalConfig(config);
    setGoalData(updated);
    setShowSettings(false);
  };

  return (
    <div
      className={`rounded-xl p-5 ${className}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-secondary)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-[var(--text-primary)]">Daily Goal</h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
        >
          {showSettings ? 'Close' : 'Edit'}
        </button>
      </div>

      {showSettings ? (
        <div className="space-y-2">
          {GOAL_PRESETS.map((preset) => (
            <button
              key={`${preset.config.type}-${preset.config.target}`}
              onClick={() => handleConfigChange(preset.config)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                goalData.config.type === preset.config.type &&
                goalData.config.target === preset.config.target
                  ? 'text-white font-medium'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-glass-dark)]'
              }`}
              style={
                goalData.config.type === preset.config.type &&
                goalData.config.target === preset.config.target
                  ? { backgroundColor: 'var(--royal-blue)' }
                  : undefined
              }
            >
              {preset.label}
            </button>
          ))}
        </div>
      ) : (
        <>
          {/* Progress ring */}
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke="rgba(0, 63, 135, 0.1)"
                  strokeWidth="5"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  fill="none"
                  stroke={goalData.today.goalMet ? 'rgb(34, 197, 94)' : 'var(--royal-blue)'}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 26}`}
                  strokeDashoffset={`${2 * Math.PI * 26 * (1 - progress.percent / 100)}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {goalData.today.goalMet ? (
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-sm font-bold" style={{ color: 'var(--royal-blue)' }}>
                    {progress.percent}%
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="font-semibold text-[var(--text-primary)]">
                {goalData.today.goalMet ? 'Goal met!' : progress.label}
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                {daysThisWeek}/7 days this week
              </p>
            </div>
          </div>

          {/* Week dots */}
          <div className="flex gap-1.5">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const dateStr = date.toISOString().split('T')[0];
              const dayProgress = goalData.history.find((h) => h.date === dateStr);
              const isToday = dateStr === new Date().toISOString().split('T')[0];
              const met = isToday ? goalData.today.goalMet : dayProgress?.goalMet;

              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-5 h-5 rounded-full ${isToday ? 'ring-2 ring-[var(--royal-blue)]' : ''}`}
                    style={{
                      backgroundColor: met
                        ? 'rgb(34, 197, 94)'
                        : 'rgba(0, 63, 135, 0.08)',
                    }}
                  />
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {date.toLocaleDateString('en-US', { weekday: 'narrow' })}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default DailyGoalCard;
