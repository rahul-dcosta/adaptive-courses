'use client';

import { useState } from 'react';

type CourseStatus = 'complete' | 'generating' | 'error';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  createdAt: string;
  status: CourseStatus;
  modules: number;
  progress: number;
}

// Mock data - will be replaced with real data from Supabase
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Supply Chain Fundamentals',
    subtitle: 'Understanding logistics and inventory management',
    createdAt: '2026-01-28T10:00:00Z',
    status: 'complete' as CourseStatus,
    modules: 5,
    progress: 60,
  },
  {
    id: '2',
    title: 'Introduction to Game Theory',
    subtitle: 'Strategic decision-making basics',
    createdAt: '2026-01-25T14:30:00Z',
    status: 'complete' as CourseStatus,
    modules: 4,
    progress: 100,
  },
  {
    id: '3',
    title: 'Nuclear Energy Basics',
    subtitle: 'How nuclear power plants work',
    createdAt: '2026-01-30T09:15:00Z',
    status: 'generating' as CourseStatus,
    modules: 0,
    progress: 0,
  },
];

function CourseCard({ course }: { course: Course }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
          <p className="text-sm text-gray-500">{course.subtitle}</p>
        </div>
        {course.status === 'generating' ? (
          <span className="flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating
          </span>
        ) : course.progress === 100 ? (
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
            Completed
          </span>
        ) : (
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
            In Progress
          </span>
        )}
      </div>

      {course.status === 'complete' && (
        <>
          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{course.modules} modules</span>
              <span>{course.progress}% complete</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${course.progress}%`,
                  background: 'var(--royal-blue)',
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <a
              href={`/course/${course.id}`}
              className="flex-1 py-2 px-4 text-center text-sm font-medium text-white rounded-lg transition-all"
              style={{ background: 'var(--royal-blue)' }}
            >
              {course.progress === 100 ? 'Review' : 'Continue'}
            </a>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="Download PDF">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </>
      )}

      {course.status === 'generating' && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Your course is being generated...</p>
          <p className="text-xs text-gray-400 mt-1">This usually takes 30-60 seconds</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">Created {formatDate(course.createdAt)}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [courses] = useState<Course[]>(mockCourses);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  const filteredCourses = courses.filter((course) => {
    if (filter === 'all') return true;
    if (filter === 'in-progress') return course.progress < 100 && course.status === 'complete';
    if (filter === 'completed') return course.progress === 100;
    return true;
  });

  const completedCount = courses.filter((c) => c.progress === 100).length;
  const inProgressCount = courses.filter((c) => c.progress < 100 && c.status === 'complete').length;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--royal-blue)' }}>
              My Courses
            </h1>
            <p className="text-gray-600 mt-1">
              {courses.length} course{courses.length !== 1 ? 's' : ''} in your library
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
            style={{ background: 'var(--royal-blue)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Course
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Courses</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--royal-blue)' }}>
              {courses.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">{completedCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'All' },
            { key: 'in-progress', label: 'In Progress' },
            { key: 'completed', label: 'Completed' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                filter === f.key
                  ? 'text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
              style={filter === f.key ? { background: 'var(--royal-blue)' } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background: 'rgba(0, 63, 135, 0.1)' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: 'var(--royal-blue)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500 mb-6">Create your first course to get started</p>
            <a
              href="/"
              className="inline-block px-6 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ background: 'var(--royal-blue)' }}
            >
              Create Your First Course
            </a>
          </div>
        )}

        {/* Upgrade prompt for free users */}
        {courses.length === 1 && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Ready for more?
            </h3>
            <p className="text-gray-600 mb-6">
              You've used your free course. Unlock unlimited learning for just $9.99/month.
            </p>
            <a
              href="/pricing"
              className="inline-block px-8 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ background: 'var(--royal-blue)' }}
            >
              View Pricing
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
