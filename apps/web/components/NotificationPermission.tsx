'use client';

import { useState, useEffect } from 'react';

export default function NotificationPermission() {
  const [show, setShow] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if notifications are supported
    if (!('Notification' in window)) return;

    setPermission(Notification.permission);

    // Show prompt after 30 seconds if not already granted/denied
    if (Notification.permission === 'default') {
      const timer = setTimeout(() => {
        setShow(true);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleRequest = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    setShow(false);

    if (result === 'granted') {
      // Show success notification
      new Notification('🎉 Notifications Enabled!', {
        body: 'We\'ll remind you when your next course is ready.',
        icon: '/icon-192.png'
      });

      // Track in analytics
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'notification_permission_granted',
          properties: { timestamp: new Date().toISOString() }
        })
      }).catch(() => {});
    }
  };

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem('notificationPromptDismissed', 'true');
  };

  if (!show || permission !== 'default') return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:w-96 z-40 animate-slide-up">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🔔</div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1">
              Stay on track with reminders
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Get notified when your next course is ready or when you haven't practiced in a while.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleRequest}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all text-sm"
              >
                Enable Notifications
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition text-sm font-medium"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
