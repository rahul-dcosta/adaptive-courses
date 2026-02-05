'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import CourseCard, { CourseData, CourseStatus } from '@/components/CourseCard';
import DangerousDeleteModal from '@/components/DangerousDeleteModal';

// View modes
type ViewMode = 'board' | 'list';

// Filter and sort options
type StatusFilter = 'all' | 'in_progress' | 'completed' | 'archived';
type SortOption = 'newest' | 'oldest' | 'alphabetical' | 'progress';

// Column configuration for board view
const BOARD_COLUMNS: { id: CourseStatus; title: string; emptyMessage: string }[] = [
  { id: 'in_progress', title: 'In Progress', emptyMessage: 'No courses in progress' },
  { id: 'completed', title: 'Completed', emptyMessage: 'No completed courses yet' },
  { id: 'archived', title: 'Archived', emptyMessage: 'No archived courses' },
];

// Mock data matching the database schema
const MOCK_COURSES: CourseData[] = [
  {
    id: '1',
    title: 'Supply Chain Fundamentals',
    subtitle: 'Understanding logistics and inventory management',
    createdAt: '2026-01-28T10:00:00Z',
    status: 'in_progress',
    moduleCount: 5,
    progress: 60,
  },
  {
    id: '2',
    title: 'Introduction to Game Theory',
    subtitle: 'Strategic decision-making basics',
    createdAt: '2026-01-25T14:30:00Z',
    status: 'completed',
    moduleCount: 4,
    progress: 100,
  },
  {
    id: '3',
    title: 'Nuclear Energy Basics',
    subtitle: 'How nuclear power plants work',
    createdAt: '2026-01-30T09:15:00Z',
    status: 'in_progress',
    moduleCount: 6,
    progress: 25,
  },
  {
    id: '4',
    title: 'Machine Learning Fundamentals',
    subtitle: 'Core concepts of ML and AI',
    createdAt: '2026-01-20T11:00:00Z',
    status: 'completed',
    moduleCount: 8,
    progress: 100,
  },
  {
    id: '5',
    title: 'Financial Markets Overview',
    subtitle: 'Understanding stocks, bonds, and derivatives',
    createdAt: '2026-01-15T08:30:00Z',
    status: 'archived',
    moduleCount: 5,
    progress: 40,
  },
];

// LocalStorage keys
const VIEW_MODE_KEY = 'library-view-mode';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item) as T);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
  }, [key]);

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
}

export default function LibraryPage() {
  const router = useRouter();

  // State
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(VIEW_MODE_KEY, 'board');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    courseId: string;
    courseTitle: string;
  }>({ isOpen: false, courseId: '', courseTitle: '' });

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/courses');
        // if (!response.ok) throw new Error('Failed to fetch courses');
        // const data = await response.json();
        // setCourses(data.courses);

        // Using mock data for now
        await new Promise((resolve) => setTimeout(resolve, 500));
        setCourses(MOCK_COURSES);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.subtitle?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((course) => {
        if (statusFilter === 'in_progress') {
          return course.status === 'in_progress' || (course.status !== 'archived' && course.progress < 100);
        }
        if (statusFilter === 'completed') {
          return course.status === 'completed' || course.progress === 100;
        }
        return course.status === statusFilter;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'progress':
          return b.progress - a.progress;
        default:
          return 0;
      }
    });

    return result;
  }, [courses, searchQuery, statusFilter, sortOption]);

  // Group courses by status for board view
  const coursesByColumn = useMemo(() => {
    const grouped: Record<CourseStatus, CourseData[]> = {
      in_progress: [],
      completed: [],
      archived: [],
      generating: [],
    };

    filteredCourses.forEach((course) => {
      // Normalize status based on progress
      let status = course.status;
      if (status !== 'archived' && status !== 'generating') {
        status = course.progress === 100 ? 'completed' : 'in_progress';
      }
      grouped[status].push(course);
    });

    return grouped;
  }, [filteredCourses]);

  // Stats
  const stats = useMemo(() => {
    const total = courses.length;
    const completed = courses.filter((c) => c.progress === 100 || c.status === 'completed').length;
    const inProgress = courses.filter(
      (c) => c.progress < 100 && c.status !== 'archived' && c.status !== 'generating'
    ).length;
    return { total, completed, inProgress };
  }, [courses]);

  // Handlers
  const handleView = useCallback((id: string) => {
    router.push(`/course/${id}`);
  }, [router]);

  const handleDownload = useCallback((id: string) => {
    // TODO: Implement PDF download
    console.log('Download PDF for course:', id);
    alert('PDF download coming soon!');
  }, []);

  const handleDeleteRequest = useCallback((id: string, title: string) => {
    setDeleteModal({ isOpen: true, courseId: id, courseTitle: title });
  }, []);

  const handleDeleteConfirm = useCallback(async (courseId: string) => {
    const response = await fetch(`/api/courses/${courseId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete course');
    }

    // Remove course from local state
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setDeleteModal({ isOpen: false, courseId: '', courseTitle: '' });
  }, []);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({ isOpen: false, courseId: '', courseTitle: '' });
  }, []);

  // Empty state conditions
  const hasNoCourses = courses.length === 0 && !isLoading;
  const hasNoFilteredResults = filteredCourses.length === 0 && courses.length > 0 && !isLoading;

  return (
    <div className="min-h-screen bg-gray-50/50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold font-serif" style={{ color: '#003F87' }}>
              Course Library
            </h1>
            <p className="text-gray-600 mt-1">
              {stats.total} course{stats.total !== 1 ? 's' : ''} in your library
            </p>
          </div>

          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all self-start"
            style={{ backgroundColor: '#003F87' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056B3')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#003F87')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Course
          </a>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[rgba(0,63,135,0.08)]">
            <p className="text-sm text-gray-500 mb-1">Total Courses</p>
            <p className="text-2xl font-bold" style={{ color: '#003F87' }}>
              {stats.total}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[rgba(0,63,135,0.08)]">
            <p className="text-sm text-gray-500 mb-1">Completed</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.completed}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-[rgba(0,63,135,0.08)]">
            <p className="text-sm text-gray-500 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-[rgba(0,63,135,0.08)] p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#003F87]/20 focus:border-[#003F87] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-gray-50 rounded-lg p-1">
                {(['all', 'in_progress', 'completed'] as StatusFilter[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                      statusFilter === status
                        ? 'bg-white text-[#003F87] shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {status === 'all' ? 'All' : status === 'in_progress' ? 'In Progress' : 'Completed'}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#003F87]/20 focus:border-[#003F87] cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
                <option value="progress">By Progress</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('board')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'board' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
                  }`}
                  aria-label="Board view"
                  title="Board view"
                >
                  <svg
                    className={`w-5 h-5 ${viewMode === 'board' ? 'text-[#003F87]' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-100'
                  }`}
                  aria-label="List view"
                  title="List view"
                >
                  <svg
                    className={`w-5 h-5 ${viewMode === 'list' ? 'text-[#003F87]' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 mb-4">
              <svg className="w-full h-full animate-spin text-[#003F87]" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
            <p className="text-gray-600">Loading your courses...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
            >
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: '#003F87' }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State - No Courses */}
        {hasNoCourses && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(0, 63, 135, 0.06)' }}
            >
              <svg
                className="w-10 h-10"
                style={{ color: '#003F87' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-serif">No courses yet</h3>
            <p className="text-gray-600 mb-6 text-center max-w-sm">
              Create your first personalized course to get started on your learning journey.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all"
              style={{ backgroundColor: '#003F87' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Course
            </a>
          </div>
        )}

        {/* Empty State - No Filtered Results */}
        {hasNoFilteredResults && (
          <div className="flex flex-col items-center justify-center py-20">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: 'rgba(0, 63, 135, 0.06)' }}
            >
              <svg
                className="w-8 h-8"
                style={{ color: '#003F87' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No matching courses</h3>
            <p className="text-gray-600 mb-4 text-center">
              {searchQuery
                ? `No courses found for "${searchQuery}"`
                : 'No courses match the selected filters'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Board View */}
        {!isLoading && !error && !hasNoCourses && !hasNoFilteredResults && viewMode === 'board' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {BOARD_COLUMNS.filter((col) => col.id !== 'generating').map((column) => (
              <div key={column.id} className="min-h-[400px]">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-900">{column.title}</h2>
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {coursesByColumn[column.id].length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="space-y-3">
                  {coursesByColumn[column.id].length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      <svg
                        className="w-8 h-8 text-gray-300 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      <p className="text-sm text-gray-400 text-center">{column.emptyMessage}</p>
                    </div>
                  ) : (
                    coursesByColumn[column.id].map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        viewMode="board"
                        onView={handleView}
                        onDownload={handleDownload}
                        onDelete={handleDeleteRequest}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!isLoading && !error && !hasNoCourses && !hasNoFilteredResults && viewMode === 'list' && (
          <div className="bg-white rounded-xl shadow-sm border border-[rgba(0,63,135,0.08)] overflow-hidden">
            {/* List Header */}
            <div className="flex items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-600">
              <div className="flex-1">Course</div>
              <div className="w-24 text-center">Progress</div>
              <div className="w-20 text-center">Modules</div>
              <div className="w-28 text-center">Created</div>
              <div className="w-28">Status</div>
              <div className="w-10"></div>
            </div>

            {/* List Content */}
            <div>
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  viewMode="list"
                  onView={handleView}
                  onDownload={handleDownload}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <DangerousDeleteModal
        isOpen={deleteModal.isOpen}
        courseId={deleteModal.courseId}
        courseTitle={deleteModal.courseTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
