'use client';

import { useState, useEffect } from 'react';

interface Activity {
  id: number;
  text: string;
  timestamp: string;
}

const SAMPLE_ACTIVITIES = [
  { city: 'Austin', topic: 'Factory Automation', time: '2 min' },
  { city: 'San Francisco', topic: 'Machine Learning', time: '5 min' },
  { city: 'New York', topic: 'Supply Chain Management', time: '8 min' },
  { city: 'Seattle', topic: 'Product Design', time: '12 min' },
  { city: 'Boston', topic: 'Data Science', time: '15 min' },
  { city: 'Chicago', topic: 'UX Research', time: '18 min' },
  { city: 'Denver', topic: 'Quantum Computing', time: '22 min' },
  { city: 'Miami', topic: 'Blockchain', time: '25 min' }
];

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Add a new activity every 15-20 seconds
    const interval = setInterval(() => {
      const sample = SAMPLE_ACTIVITIES[currentIndex % SAMPLE_ACTIVITIES.length];
      const newActivity: Activity = {
        id: Date.now(),
        text: `Someone in ${sample.city} just learned ${sample.topic}`,
        timestamp: sample.time + ' ago'
      };
      
      setActivities(prev => [newActivity, ...prev].slice(0, 1)); // Only keep latest
      setCurrentIndex(prev => prev + 1);
    }, 15000 + Math.random() * 5000); // 15-20 seconds

    // Show first activity immediately
    const sample = SAMPLE_ACTIVITIES[0];
    setActivities([{
      id: Date.now(),
      text: `Someone in ${sample.city} just learned ${sample.topic}`,
      timestamp: sample.time + ' ago'
    }]);

    return () => clearInterval(interval);
  }, [currentIndex]);

  if (activities.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm hidden md:block">
      {activities.map(activity => (
        <div
          key={activity.id}
          className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 mb-2 animate-slide-up"
        >
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm text-gray-900 font-medium">
                🔥 {activity.text}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
