/**
 * Daily Goals System
 *
 * Tracks daily learning goals (lessons completed or time spent).
 * Goals reset at midnight local time.
 */

// =============================================================================
// Types
// =============================================================================

export type GoalType = 'lessons' | 'time';

export interface DailyGoalConfig {
  type: GoalType;
  target: number; // lessons count or minutes
}

export interface DailyGoalProgress {
  date: string; // YYYY-MM-DD
  lessonsCompleted: number;
  minutesSpent: number;
  goalMet: boolean;
}

export interface DailyGoalData {
  config: DailyGoalConfig;
  today: DailyGoalProgress;
  history: DailyGoalProgress[]; // last 30 days
}

// =============================================================================
// Constants
// =============================================================================

const DAILY_GOAL_KEY = 'ac_daily_goal';

const DEFAULT_CONFIG: DailyGoalConfig = {
  type: 'lessons',
  target: 2,
};

// =============================================================================
// Presets
// =============================================================================

export const GOAL_PRESETS: Array<{ label: string; config: DailyGoalConfig }> = [
  { label: '1 lesson/day', config: { type: 'lessons', target: 1 } },
  { label: '2 lessons/day', config: { type: 'lessons', target: 2 } },
  { label: '3 lessons/day', config: { type: 'lessons', target: 3 } },
  { label: '15 min/day', config: { type: 'time', target: 15 } },
  { label: '30 min/day', config: { type: 'time', target: 30 } },
];

// =============================================================================
// Storage
// =============================================================================

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function getDailyGoalData(): DailyGoalData {
  if (typeof window === 'undefined') {
    return { config: DEFAULT_CONFIG, today: createTodayProgress(), history: [] };
  }

  try {
    const raw = localStorage.getItem(DAILY_GOAL_KEY);
    if (!raw) {
      return { config: DEFAULT_CONFIG, today: createTodayProgress(), history: [] };
    }

    const data = JSON.parse(raw) as DailyGoalData;
    const today = getToday();

    // Reset if day has changed
    if (data.today.date !== today) {
      // Archive yesterday's progress
      if (data.today.date) {
        data.history = [...data.history, data.today].slice(-30);
      }
      data.today = createTodayProgress();
    }

    return data;
  } catch {
    return { config: DEFAULT_CONFIG, today: createTodayProgress(), history: [] };
  }
}

export function saveDailyGoalData(data: DailyGoalData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

export function updateGoalConfig(config: DailyGoalConfig): DailyGoalData {
  const data = getDailyGoalData();
  data.config = config;
  // Re-evaluate if goal is met with new config
  data.today.goalMet = isGoalMet(data.today, config);
  saveDailyGoalData(data);
  return data;
}

// =============================================================================
// Progress Recording
// =============================================================================

export function recordLessonComplete(): DailyGoalData {
  const data = getDailyGoalData();
  data.today.lessonsCompleted += 1;
  data.today.goalMet = isGoalMet(data.today, data.config);
  saveDailyGoalData(data);
  return data;
}

export function recordTimeSpent(minutes: number): DailyGoalData {
  const data = getDailyGoalData();
  data.today.minutesSpent += minutes;
  data.today.goalMet = isGoalMet(data.today, data.config);
  saveDailyGoalData(data);
  return data;
}

// =============================================================================
// Helpers
// =============================================================================

function createTodayProgress(): DailyGoalProgress {
  return {
    date: getToday(),
    lessonsCompleted: 0,
    minutesSpent: 0,
    goalMet: false,
  };
}

function isGoalMet(progress: DailyGoalProgress, config: DailyGoalConfig): boolean {
  if (config.type === 'lessons') {
    return progress.lessonsCompleted >= config.target;
  }
  return progress.minutesSpent >= config.target;
}

export function getGoalProgress(data: DailyGoalData): {
  current: number;
  target: number;
  percent: number;
  label: string;
} {
  const { config, today } = data;
  const current = config.type === 'lessons' ? today.lessonsCompleted : today.minutesSpent;
  const percent = Math.min(100, Math.round((current / config.target) * 100));
  const label = config.type === 'lessons'
    ? `${current}/${config.target} lessons`
    : `${current}/${config.target} min`;
  return { current, target: config.target, percent, label };
}

export function getDaysGoalMetThisWeek(data: DailyGoalData): number {
  const today = getToday();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];

  let count = data.today.goalMet ? 1 : 0;
  for (const day of data.history) {
    if (day.date >= weekAgoStr && day.date < today && day.goalMet) {
      count++;
    }
  }
  return count;
}
