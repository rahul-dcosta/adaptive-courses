'use client';

import { useState, useEffect } from 'react';

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    // Refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Stats</h1>
          <p className="text-gray-600">Real-time metrics for Adaptive Courses</p>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {stats?.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}
          </p>
        </div>

        {stats?.error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6">
            <p className="text-red-800">{stats.error}</p>
            <p className="text-sm text-red-600 mt-1">Tables may not exist yet. Run migrations from docs/MIGRATIONS.md</p>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Courses</h3>
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.totalCourses || 0}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Paid Courses</h3>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.paidCourses || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Conversions</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Revenue</h3>
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">${stats?.revenue || 0}</p>
            <p className="text-sm text-gray-500 mt-1">@$5/course</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Email Signups</h3>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats?.emailSignups || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Leads captured</p>
          </div>
        </div>

        {/* Today's Activity */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Today's Courses</h3>
            <p className="text-2xl font-bold text-gray-900">{stats?.coursesToday || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.totalCourses > 0 
                ? ((stats.paidCourses / stats.totalCourses) * 100).toFixed(1)
                : 0}%
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Email → Paid</h3>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.emailSignups > 0
                ? ((stats.paidCourses / stats.emailSignups) * 100).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>

        {/* Top Topics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Topics (Last 100 Courses)</h3>
          {stats?.topTopics && stats.topTopics.length > 0 ? (
            <div className="space-y-3">
              {stats.topTopics.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-gray-400">#{idx + 1}</span>
                    <span className="font-medium text-gray-900">{item.topic}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${(item.count / stats.topTopics[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No topics yet</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <a
            href="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            ← Back to Home
          </a>
          <button
            onClick={loadStats}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            🔄 Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
