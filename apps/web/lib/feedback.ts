/**
 * Haptic + Audio Feedback
 *
 * Provides subtle tactile and audio feedback for key interactions.
 * Uses Navigator.vibrate() for haptics and Web Audio API for tones.
 * No external sound files needed — all generated programmatically.
 */

// =============================================================================
// Preference Storage
// =============================================================================

const FEEDBACK_PREFS_KEY = 'ac_feedback_prefs';

interface FeedbackPrefs {
  hapticEnabled: boolean;
  soundEnabled: boolean;
}

const DEFAULT_PREFS: FeedbackPrefs = {
  hapticEnabled: true,
  soundEnabled: false, // off by default — user opts in
};

export function getFeedbackPrefs(): FeedbackPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(FEEDBACK_PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function setFeedbackPrefs(prefs: Partial<FeedbackPrefs>): FeedbackPrefs {
  const current = getFeedbackPrefs();
  const updated = { ...current, ...prefs };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(FEEDBACK_PREFS_KEY, JSON.stringify(updated));
    } catch {
      // silently fail
    }
  }
  return updated;
}

// =============================================================================
// Haptic Feedback
// =============================================================================

export function triggerHaptic(pattern: 'light' | 'medium' | 'success' | 'error' = 'light'): void {
  const prefs = getFeedbackPrefs();
  if (!prefs.hapticEnabled) return;
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;

  const patterns: Record<string, number | number[]> = {
    light: 10,
    medium: 25,
    success: [15, 50, 15],
    error: [30, 30, 30],
  };

  try {
    navigator.vibrate(patterns[pattern]);
  } catch {
    // Not all browsers support vibrate
  }
}

// =============================================================================
// Audio Feedback (Web Audio API)
// =============================================================================

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext)();
    } catch {
      return null;
    }
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.15): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const prefs = getFeedbackPrefs();
  if (!prefs.soundEnabled) return;

  try {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Audio playback failed
  }
}

// =============================================================================
// High-Level Feedback Functions
// =============================================================================

/** Lesson completed successfully */
export function feedbackLessonComplete(): void {
  triggerHaptic('success');
  playTone(523.25, 0.15); // C5
  setTimeout(() => playTone(659.25, 0.15), 100); // E5
  setTimeout(() => playTone(783.99, 0.2), 200); // G5
}

/** Quiz answered correctly */
export function feedbackQuizCorrect(): void {
  triggerHaptic('light');
  playTone(600, 0.12, 'sine', 0.1);
}

/** Quiz answered incorrectly */
export function feedbackQuizIncorrect(): void {
  triggerHaptic('error');
  playTone(200, 0.2, 'triangle', 0.08);
}

/** Milestone reached */
export function feedbackMilestone(): void {
  triggerHaptic('success');
  playTone(523.25, 0.12);
  setTimeout(() => playTone(659.25, 0.12), 100);
  setTimeout(() => playTone(783.99, 0.12), 200);
  setTimeout(() => playTone(1046.5, 0.25), 300); // C6
}

/** Button press / generic tap */
export function feedbackTap(): void {
  triggerHaptic('light');
}
