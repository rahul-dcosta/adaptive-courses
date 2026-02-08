'use client';

import { useState, useEffect } from 'react';
import {
  getNotificationPrefs,
  setNotificationPrefs,
  subscribeToPush,
  type NotificationPrefs,
  type NotificationType,
} from '@/lib/notification-scheduler';

const NOTIFICATION_LABELS: Record<NotificationType, { label: string; description: string }> = {
  streak_reminder: { label: 'Streak Reminders', description: "Don't break your streak!" },
  review_due: { label: 'Review Due', description: 'Spaced repetition cards are ready' },
  daily_goal: { label: 'Daily Goal', description: 'Reminder to hit your daily goal' },
  course_continue: { label: 'Continue Course', description: 'Pick up where you left off' },
  weekly_recap: { label: 'Weekly Recap', description: 'Your learning summary' },
};

interface NotificationSettingsProps {
  className?: string;
}

export function NotificationSettings({ className = '' }: NotificationSettingsProps) {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    setPrefs(getNotificationPrefs());
    if ('Notification' in window) {
      setPermissionState(Notification.permission);
    }
  }, []);

  if (!prefs) return null;

  const handleToggleAll = async () => {
    if (!prefs.enabled) {
      // Enable: request permission first
      if (permissionState === 'default') {
        const perm = await Notification.requestPermission();
        setPermissionState(perm);
        if (perm !== 'granted') return;
      } else if (permissionState === 'denied') {
        return; // Can't override browser denial
      }

      setSubscribing(true);
      await subscribeToPush();
      setSubscribing(false);
    }

    const updated = setNotificationPrefs({ enabled: !prefs.enabled });
    setPrefs(updated);
  };

  const handleToggleType = (type: NotificationType) => {
    const newTypes = { ...prefs.types, [type]: !prefs.types[type] };
    const updated = setNotificationPrefs({ types: newTypes });
    setPrefs(updated);
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
        <h3 className="font-semibold text-[var(--text-primary)]">Notifications</h3>
        <button
          onClick={handleToggleAll}
          disabled={subscribing || permissionState === 'denied'}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            prefs.enabled ? '' : ''
          } ${permissionState === 'denied' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          style={{
            backgroundColor: prefs.enabled ? 'var(--royal-blue)' : 'rgba(0, 63, 135, 0.15)',
          }}
        >
          <div
            className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
              prefs.enabled ? 'translate-x-5.5 left-0.5' : 'translate-x-0 left-0.5'
            }`}
            style={{
              transform: prefs.enabled ? 'translateX(22px)' : 'translateX(0)',
            }}
          />
        </button>
      </div>

      {permissionState === 'denied' && (
        <p className="text-xs text-red-500 mb-3">
          Notifications blocked. Enable them in your browser settings.
        </p>
      )}

      {prefs.enabled && (
        <div className="space-y-3 mt-4 pt-4" style={{ borderTop: '1px solid var(--border-secondary)' }}>
          {(Object.entries(NOTIFICATION_LABELS) as [NotificationType, { label: string; description: string }][]).map(
            ([type, { label, description }]) => (
              <div key={type} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-primary)]">{label}</p>
                  <p className="text-xs text-[var(--text-muted)]">{description}</p>
                </div>
                <button
                  onClick={() => handleToggleType(type)}
                  className="relative w-9 h-5 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: prefs.types[type]
                      ? 'var(--royal-blue)'
                      : 'rgba(0, 63, 135, 0.15)',
                  }}
                >
                  <div
                    className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                    style={{
                      transform: prefs.types[type] ? 'translateX(16px)' : 'translateX(0)',
                    }}
                  />
                </button>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationSettings;
