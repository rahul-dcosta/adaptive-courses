/**
 * Client-side notification scheduling and preferences
 *
 * Handles quiet hours, notification types, and local scheduling.
 * Actual push sending happens server-side via web-push.
 */

// =============================================================================
// Types
// =============================================================================

export type NotificationType =
  | 'streak_reminder'
  | 'review_due'
  | 'daily_goal'
  | 'course_continue'
  | 'weekly_recap';

export interface NotificationPrefs {
  enabled: boolean;
  types: Record<NotificationType, boolean>;
  quietHoursStart: number; // 0-23
  quietHoursEnd: number; // 0-23
}

// =============================================================================
// Constants
// =============================================================================

const NOTIFICATION_PREFS_KEY = 'ac_notification_prefs';

const DEFAULT_PREFS: NotificationPrefs = {
  enabled: false,
  types: {
    streak_reminder: true,
    review_due: true,
    daily_goal: true,
    course_continue: true,
    weekly_recap: true,
  },
  quietHoursStart: 22,
  quietHoursEnd: 8,
};

// =============================================================================
// Storage
// =============================================================================

export function getNotificationPrefs(): NotificationPrefs {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFS;
  }
}

export function setNotificationPrefs(prefs: Partial<NotificationPrefs>): NotificationPrefs {
  const current = getNotificationPrefs();
  const updated = { ...current, ...prefs };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(updated));
    } catch {
      // silently fail
    }
  }
  return updated;
}

// =============================================================================
// Helpers
// =============================================================================

export function isInQuietHours(prefs: NotificationPrefs): boolean {
  const hour = new Date().getHours();
  if (prefs.quietHoursStart < prefs.quietHoursEnd) {
    // Simple range: e.g., 22-8 wraps midnight
    return hour >= prefs.quietHoursStart || hour < prefs.quietHoursEnd;
  }
  // Non-wrapping range
  return hour >= prefs.quietHoursStart && hour < prefs.quietHoursEnd;
}

export function isNotificationTypeEnabled(type: NotificationType): boolean {
  const prefs = getNotificationPrefs();
  return prefs.enabled && prefs.types[type] !== false;
}

// =============================================================================
// Push Subscription
// =============================================================================

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;

  try {
    const registration = await navigator.serviceWorker.ready;

    // Check for existing subscription
    const existing = await registration.pushManager.getSubscription();
    if (existing) return existing;

    // Subscribe (requires VAPID public key from env)
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return null;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
    });

    // Send subscription to server
    await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription.toJSON()),
    });

    return subscription;
  } catch {
    return null;
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
