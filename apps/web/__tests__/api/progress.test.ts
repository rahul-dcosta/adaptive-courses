import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST, GET, DELETE } from '@/app/api/progress/route'

// Mock the dependencies
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
}))

vi.mock('@/lib/types', () => ({
  getErrorMessage: (error: unknown) => {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    return 'An unexpected error occurred'
  },
}))

// Import mocked functions for test control
import { supabaseAdmin } from '@/lib/supabase'

describe('Progress API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  // =============================================================================
  // POST /api/progress Tests - Save Progress
  // =============================================================================

  describe('POST /api/progress', () => {
    const createPostRequest = (
      body: Record<string, unknown>,
      cookies: Record<string, string> = {}
    ) => {
      const request = new NextRequest('http://localhost:3000/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      Object.entries(cookies).forEach(([key, value]) => {
        request.cookies.set(key, value)
      })

      return request
    }

    it('should return 400 when courseId is missing', async () => {
      // Arrange
      const request = createPostRequest({
        lessonProgress: {},
        currentModuleIndex: 0,
        currentLessonIndex: 0,
      })

      // Act
      const response = await POST(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(body.success).toBe(false)
      expect(body.error).toBe('Missing courseId')
    })

    it('should save progress for anonymous user (no session cookie)', async () => {
      // Arrange
      const request = createPostRequest({
        courseId: 'course-123',
        lessonProgress: {
          '0-0': { completed: true, completedAt: '2024-03-15', timeSpent: 120, quizScore: null, quizPassed: null },
        },
        currentModuleIndex: 0,
        currentLessonIndex: 1,
        totalTimeSpent: 120,
        lessonsCompleted: 1,
        overallCompletionPercent: 10,
      })

      // Mock: no existing progress - properly chain .eq().eq().maybeSingle()
      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })

      // Mock: insert new progress
      const mockInsert = vi.fn().mockResolvedValue({ error: null })

      let callCount = 0
      vi.mocked(supabaseAdmin.from).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // Check existing progress - query uses .select().eq().eq().maybeSingle()
          return { select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else {
          // Insert new progress
          return { insert: mockInsert } as unknown as ReturnType<typeof supabaseAdmin.from>
        }
      })

      // Act
      const response = await POST(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
    })

    it('should save progress for authenticated user', async () => {
      // Arrange
      const request = createPostRequest(
        {
          courseId: 'course-123',
          lessonProgress: {
            '0-0': { completed: true, completedAt: '2024-03-15', timeSpent: 120, quizScore: 85, quizPassed: true },
          },
          currentModuleIndex: 0,
          currentLessonIndex: 1,
          totalTimeSpent: 120,
          lessonsCompleted: 1,
          overallCompletionPercent: 10,
          streak: { currentStreak: 5, longestStreak: 10, lastActivityDate: '2024-03-15' },
        },
        { auth_session: 'valid-session-token' }
      )

      // Mock: session lookup
      const mockSessionSingle = vi.fn().mockResolvedValue({ data: { user_id: 'user-123' } })
      const mockSessionGt = vi.fn().mockReturnValue({ single: mockSessionSingle })
      const mockSessionEq = vi.fn().mockReturnValue({ gt: mockSessionGt })
      const mockSessionSelect = vi.fn().mockReturnValue({ eq: mockSessionEq })

      // Mock: no existing progress
      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })

      // Mock: insert new progress
      const mockInsert = vi.fn().mockResolvedValue({ error: null })

      let callCount = 0
      vi.mocked(supabaseAdmin.from).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return { select: mockSessionSelect } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else if (callCount === 2) {
          return { select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else {
          return { insert: mockInsert } as unknown as ReturnType<typeof supabaseAdmin.from>
        }
      })

      // Act
      const response = await POST(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.synced).toBe(true)
    })

    it('should update existing progress', async () => {
      // Arrange
      const request = createPostRequest({
        courseId: 'course-123',
        lessonProgress: {
          '0-0': { completed: true, completedAt: '2024-03-15', timeSpent: 120, quizScore: null, quizPassed: null },
          '0-1': { completed: true, completedAt: '2024-03-16', timeSpent: 90, quizScore: null, quizPassed: null },
        },
        currentModuleIndex: 0,
        currentLessonIndex: 2,
        totalTimeSpent: 210,
        lessonsCompleted: 2,
        overallCompletionPercent: 20,
      })

      // Mock: existing progress found
      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: { id: 'progress-456' }, error: null })
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })

      // Mock: update progress
      const mockUpdateEq = vi.fn().mockResolvedValue({ error: null })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq })

      let callCount = 0
      vi.mocked(supabaseAdmin.from).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return { select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else {
          return { update: mockUpdate } as unknown as ReturnType<typeof supabaseAdmin.from>
        }
      })

      // Act
      const response = await POST(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.synced).toBe(true)
    })

    it('should return success with synced false when update fails', async () => {
      // Arrange
      const request = createPostRequest({
        courseId: 'course-123',
        lessonProgress: {},
        currentModuleIndex: 0,
        currentLessonIndex: 0,
        totalTimeSpent: 0,
        lessonsCompleted: 0,
        overallCompletionPercent: 0,
      })

      // Mock: existing progress found
      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: { id: 'progress-456' }, error: null })
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })

      // Mock: update fails
      const mockUpdateEq = vi.fn().mockResolvedValue({ error: { message: 'Database error' } })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockUpdateEq })

      let callCount = 0
      vi.mocked(supabaseAdmin.from).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return { select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else {
          return { update: mockUpdate } as unknown as ReturnType<typeof supabaseAdmin.from>
        }
      })

      // Act
      const response = await POST(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.synced).toBe(false)
      expect(body.message).toContain('locally')
    })

    it('should return 500 when an unexpected error occurs', async () => {
      // Arrange
      const request = createPostRequest({
        courseId: 'course-123',
        lessonProgress: {},
        currentModuleIndex: 0,
        currentLessonIndex: 0,
        totalTimeSpent: 0,
        lessonsCompleted: 0,
        overallCompletionPercent: 0,
      })

      vi.mocked(supabaseAdmin.from).mockImplementation(() => {
        throw new Error('Connection failed')
      })

      // Act
      const response = await POST(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(body.success).toBe(false)
      expect(body.error).toContain('Connection failed')
    })

    it('should handle duplicate key error by retrying update', async () => {
      // Arrange
      const request = createPostRequest({
        courseId: 'course-123',
        lessonProgress: {},
        currentModuleIndex: 0,
        currentLessonIndex: 0,
        totalTimeSpent: 0,
        lessonsCompleted: 0,
        overallCompletionPercent: 0,
      })

      // Mock: no existing progress
      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })

      // Mock: insert fails with duplicate key
      const mockInsert = vi.fn().mockResolvedValue({ error: { code: '23505' } })

      // Mock: retry update succeeds
      const mockRetryEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockRetryEq = vi.fn().mockReturnValue({ eq: mockRetryEq2 })
      const mockUpdate = vi.fn().mockReturnValue({ eq: mockRetryEq })

      let callCount = 0
      vi.mocked(supabaseAdmin.from).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return { select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else if (callCount === 2) {
          return { insert: mockInsert } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else {
          return { update: mockUpdate } as unknown as ReturnType<typeof supabaseAdmin.from>
        }
      })

      // Act
      const response = await POST(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
    })
  })

  // =============================================================================
  // GET /api/progress Tests - Fetch Progress
  // =============================================================================

  describe('GET /api/progress', () => {
    const createGetRequest = (params: Record<string, string>, cookies: Record<string, string> = {}) => {
      const searchParams = new URLSearchParams(params)
      const request = new NextRequest(`http://localhost:3000/api/progress?${searchParams.toString()}`, {
        method: 'GET',
      })

      Object.entries(cookies).forEach(([key, value]) => {
        request.cookies.set(key, value)
      })

      return request
    }

    it('should return 400 when courseId is missing', async () => {
      // Arrange
      const request = createGetRequest({})

      // Act
      const response = await GET(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(body.success).toBe(false)
      expect(body.error).toBe('Missing courseId parameter')
    })

    it('should return null progress when none exists', async () => {
      // Arrange
      const request = createGetRequest({ courseId: 'course-123' })

      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })

      vi.mocked(supabaseAdmin.from).mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      const response = await GET(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.progress).toBeNull()
      expect(body.message).toBe('No progress found')
    })

    it('should return progress data when it exists', async () => {
      // Arrange
      const request = createGetRequest({ courseId: 'course-123' })

      const progressData = {
        course_id: 'course-123',
        user_id: 'user-123',
        lesson_progress: {
          '0-0': { completed: true, completedAt: '2024-03-15', timeSpent: 120, quizScore: 85, quizPassed: true },
        },
        current_lesson_id: '0-1',
        overall_percent: 25,
        total_time_spent: 120,
        lessons_completed: 2,
        streak_days: 5,
        longest_streak: 10,
        last_activity_at: '2024-03-15T10:00:00Z',
        updated_at: '2024-03-15T10:00:00Z',
      }

      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: progressData, error: null })
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })

      vi.mocked(supabaseAdmin.from).mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      const response = await GET(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.progress).toBeDefined()
      expect(body.progress.courseId).toBe('course-123')
      expect(body.progress.overallCompletionPercent).toBe(25)
      expect(body.progress.totalTimeSpent).toBe(120)
      expect(body.progress.currentModuleIndex).toBe(0)
      expect(body.progress.currentLessonIndex).toBe(1)
      expect(body.progress.streak.currentStreak).toBe(5)
      expect(body.progress.streak.longestStreak).toBe(10)
    })

    it('should fetch progress for authenticated user', async () => {
      // Arrange
      const request = createGetRequest({ courseId: 'course-123' }, { auth_session: 'valid-session' })

      // Mock: session lookup
      const mockSessionSingle = vi.fn().mockResolvedValue({ data: { user_id: 'user-123' } })
      const mockSessionGt = vi.fn().mockReturnValue({ single: mockSessionSingle })
      const mockSessionEq = vi.fn().mockReturnValue({ gt: mockSessionGt })
      const mockSessionSelect = vi.fn().mockReturnValue({ eq: mockSessionEq })

      // Mock: progress lookup
      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: null })
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })

      let callCount = 0
      vi.mocked(supabaseAdmin.from).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return { select: mockSessionSelect } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else {
          return { select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>
        }
      })

      // Act
      const response = await GET(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
    })

    it('should return success with null progress when fetch error occurs', async () => {
      // Arrange
      const request = createGetRequest({ courseId: 'course-123' })

      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } })
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })

      vi.mocked(supabaseAdmin.from).mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      const response = await GET(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.progress).toBeNull()
      expect(body.message).toBe('No progress found')
    })

    it('should return 500 when an unexpected error occurs', async () => {
      // Arrange
      const request = createGetRequest({ courseId: 'course-123' })

      vi.mocked(supabaseAdmin.from).mockImplementation(() => {
        throw new Error('Connection failed')
      })

      // Act
      const response = await GET(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(body.success).toBe(false)
      expect(body.error).toContain('Connection failed')
    })

    it('should parse current lesson from current_lesson_id correctly', async () => {
      // Arrange
      const request = createGetRequest({ courseId: 'course-123' })

      const progressData = {
        course_id: 'course-123',
        user_id: null,
        lesson_progress: {},
        current_lesson_id: '2-5', // Module 2, Lesson 5
        overall_percent: 50,
        total_time_spent: 300,
        lessons_completed: 10,
        streak_days: 3,
        longest_streak: 5,
        last_activity_at: '2024-03-15T10:00:00Z',
        updated_at: '2024-03-15T10:00:00Z',
      }

      const mockMaybeSingle = vi.fn().mockResolvedValue({ data: progressData, error: null })
      const mockEq2 = vi.fn().mockReturnValue({ maybeSingle: mockMaybeSingle })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })

      vi.mocked(supabaseAdmin.from).mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      const response = await GET(request)
      const body = await response.json()

      // Assert
      expect(body.progress.currentModuleIndex).toBe(2)
      expect(body.progress.currentLessonIndex).toBe(5)
    })
  })

  // =============================================================================
  // DELETE /api/progress Tests - Reset Progress
  // =============================================================================

  describe('DELETE /api/progress', () => {
    const createDeleteRequest = (params: Record<string, string>, cookies: Record<string, string> = {}) => {
      const searchParams = new URLSearchParams(params)
      const request = new NextRequest(`http://localhost:3000/api/progress?${searchParams.toString()}`, {
        method: 'DELETE',
      })

      Object.entries(cookies).forEach(([key, value]) => {
        request.cookies.set(key, value)
      })

      return request
    }

    it('should return 400 when courseId is missing', async () => {
      // Arrange
      const request = createDeleteRequest({})

      // Act
      const response = await DELETE(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(body.success).toBe(false)
      expect(body.error).toBe('Missing courseId parameter')
    })

    it('should delete progress successfully', async () => {
      // Arrange
      const request = createDeleteRequest({ courseId: 'course-123' })

      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq })

      vi.mocked(supabaseAdmin.from).mockReturnValue({ delete: mockDelete } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      const response = await DELETE(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.deleted).toBe(true)
      expect(body.message).toBe('Progress deleted successfully')
    })

    it('should delete progress for authenticated user', async () => {
      // Arrange
      const request = createDeleteRequest({ courseId: 'course-123' }, { auth_session: 'valid-session' })

      // Mock: session lookup
      const mockSessionSingle = vi.fn().mockResolvedValue({ data: { user_id: 'user-123' } })
      const mockSessionGt = vi.fn().mockReturnValue({ single: mockSessionSingle })
      const mockSessionEq = vi.fn().mockReturnValue({ gt: mockSessionGt })
      const mockSessionSelect = vi.fn().mockReturnValue({ eq: mockSessionEq })

      // Mock: delete progress
      const mockDeleteEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockDeleteEq = vi.fn().mockReturnValue({ eq: mockDeleteEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq })

      let callCount = 0
      vi.mocked(supabaseAdmin.from).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return { select: mockSessionSelect } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else {
          return { delete: mockDelete } as unknown as ReturnType<typeof supabaseAdmin.from>
        }
      })

      // Act
      const response = await DELETE(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.deleted).toBe(true)
    })

    it('should return success with deleted false when delete fails', async () => {
      // Arrange
      const request = createDeleteRequest({ courseId: 'course-123' })

      const mockEq2 = vi.fn().mockResolvedValue({ error: { message: 'Database error' } })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq })

      vi.mocked(supabaseAdmin.from).mockReturnValue({ delete: mockDelete } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      const response = await DELETE(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.deleted).toBe(false)
      expect(body.message).toBe('Failed to delete from database')
    })

    it('should return 500 when an unexpected error occurs', async () => {
      // Arrange
      const request = createDeleteRequest({ courseId: 'course-123' })

      vi.mocked(supabaseAdmin.from).mockImplementation(() => {
        throw new Error('Connection failed')
      })

      // Act
      const response = await DELETE(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(body.success).toBe(false)
      expect(body.error).toContain('Connection failed')
    })

    it('should call supabase with correct query', async () => {
      // Arrange
      const request = createDeleteRequest({ courseId: 'course-123' })

      const mockEq2 = vi.fn().mockResolvedValue({ error: null })
      const mockEq = vi.fn().mockReturnValue({ eq: mockEq2 })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockEq })

      vi.mocked(supabaseAdmin.from).mockReturnValue({ delete: mockDelete } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      await DELETE(request)

      // Assert
      expect(supabaseAdmin.from).toHaveBeenCalledWith('course_progress')
      expect(mockDelete).toHaveBeenCalled()
      expect(mockEq).toHaveBeenCalledWith('course_id', 'course-123')
    })
  })
})
