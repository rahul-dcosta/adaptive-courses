import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { DELETE, GET } from '@/app/api/courses/[id]/route'

// Mock the dependencies
vi.mock('@/lib/supabase', () => ({
  supabaseAdmin: {
    from: vi.fn(),
  },
}))

vi.mock('@/lib/services/auth', () => ({
  validateAuthSession: vi.fn(),
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
import { validateAuthSession } from '@/lib/services/auth'

describe('Courses API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  // =============================================================================
  // DELETE /api/courses/[id] Tests
  // =============================================================================

  describe('DELETE /api/courses/[id]', () => {
    const createDeleteRequest = (cookies: Record<string, string> = {}) => {
      const request = new NextRequest('http://localhost:3000/api/courses/course-123', {
        method: 'DELETE',
      })

      Object.entries(cookies).forEach(([key, value]) => {
        request.cookies.set(key, value)
      })

      return request
    }

    const createParams = (id: string) => Promise.resolve({ id })

    it('should return 400 when course ID is missing', async () => {
      // Arrange
      const request = createDeleteRequest({ auth_token: 'valid-token' })

      // Act
      const response = await DELETE(request, { params: Promise.resolve({ id: '' }) })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(body.error).toBe('Course ID is required')
    })

    it('should return 401 when auth token is missing', async () => {
      // Arrange
      const request = createDeleteRequest({})

      // Act
      const response = await DELETE(request, { params: createParams('course-123') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(body.error).toBe('Authentication required')
    })

    it('should return 401 when session is invalid', async () => {
      // Arrange
      const request = createDeleteRequest({ auth_token: 'invalid-token' })
      vi.mocked(validateAuthSession).mockResolvedValue(null)

      // Act
      const response = await DELETE(request, { params: createParams('course-123') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(body.error).toBe('Invalid or expired session')
      expect(validateAuthSession).toHaveBeenCalledWith('invalid-token')
    })

    it('should return 404 when course is not found', async () => {
      // Arrange
      const request = createDeleteRequest({ auth_token: 'valid-token' })
      vi.mocked(validateAuthSession).mockResolvedValue({ id: 'user-123', email: 'test@example.com' })

      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(supabaseAdmin.from).mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      const response = await DELETE(request, { params: createParams('non-existent-course') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(body.error).toBe('Course not found')
    })

    it('should return 403 when user does not own the course', async () => {
      // Arrange
      const request = createDeleteRequest({ auth_token: 'valid-token' })
      vi.mocked(validateAuthSession).mockResolvedValue({ id: 'user-123', email: 'test@example.com' })

      const courseData = { id: 'course-123', user_id: 'different-user-456', topic: 'Test Course' }
      const mockSingle = vi.fn().mockResolvedValue({ data: courseData, error: null })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(supabaseAdmin.from).mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      const response = await DELETE(request, { params: createParams('course-123') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(403)
      expect(body.error).toBe('You do not have permission to delete this course')
    })

    it('should successfully delete course when user is the owner', async () => {
      // Arrange
      const request = createDeleteRequest({ auth_token: 'valid-token' })
      vi.mocked(validateAuthSession).mockResolvedValue({ id: 'user-123', email: 'test@example.com' })

      const courseData = { id: 'course-123', user_id: 'user-123', topic: 'Test Course' }

      // First call: select course
      const mockSelectSingle = vi.fn().mockResolvedValue({ data: courseData, error: null })
      const mockSelectEq = vi.fn().mockReturnValue({ single: mockSelectSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockSelectEq })

      // Second call: delete course
      const mockDeleteEq = vi.fn().mockResolvedValue({ error: null })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq })

      // Third call: delete owned_courses
      const mockOwnedDeleteEq = vi.fn().mockResolvedValue({ error: null })
      const mockOwnedDelete = vi.fn().mockReturnValue({ eq: mockOwnedDeleteEq })

      let callCount = 0
      vi.mocked(supabaseAdmin.from).mockImplementation((table: string) => {
        callCount++
        if (callCount === 1) {
          return { select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else if (callCount === 2) {
          return { delete: mockDelete } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else {
          return { delete: mockOwnedDelete } as unknown as ReturnType<typeof supabaseAdmin.from>
        }
      })

      // Act
      const response = await DELETE(request, { params: createParams('course-123') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.message).toBe('Course deleted successfully')
    })

    it('should return 500 when delete operation fails', async () => {
      // Arrange
      const request = createDeleteRequest({ auth_token: 'valid-token' })
      vi.mocked(validateAuthSession).mockResolvedValue({ id: 'user-123', email: 'test@example.com' })

      const courseData = { id: 'course-123', user_id: 'user-123', topic: 'Test Course' }

      // First call: select course
      const mockSelectSingle = vi.fn().mockResolvedValue({ data: courseData, error: null })
      const mockSelectEq = vi.fn().mockReturnValue({ single: mockSelectSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockSelectEq })

      // Second call: delete course fails
      const mockDeleteEq = vi.fn().mockResolvedValue({ error: { message: 'Database error' } })
      const mockDelete = vi.fn().mockReturnValue({ eq: mockDeleteEq })

      let callCount = 0
      vi.mocked(supabaseAdmin.from).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          return { select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>
        } else {
          return { delete: mockDelete } as unknown as ReturnType<typeof supabaseAdmin.from>
        }
      })

      // Act
      const response = await DELETE(request, { params: createParams('course-123') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(body.error).toBe('Failed to delete course')
    })

    it('should return 500 when an unexpected error occurs', async () => {
      // Arrange
      const request = createDeleteRequest({ auth_token: 'valid-token' })
      vi.mocked(validateAuthSession).mockRejectedValue(new Error('Unexpected error'))

      // Act
      const response = await DELETE(request, { params: createParams('course-123') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(body.error).toContain('Unexpected error')
    })
  })

  // =============================================================================
  // GET /api/courses/[id] Tests
  // =============================================================================

  describe('GET /api/courses/[id]', () => {
    const createGetRequest = (cookies: Record<string, string> = {}) => {
      const request = new NextRequest('http://localhost:3000/api/courses/course-123', {
        method: 'GET',
      })

      Object.entries(cookies).forEach(([key, value]) => {
        request.cookies.set(key, value)
      })

      return request
    }

    const createParams = (id: string) => Promise.resolve({ id })

    it('should return 400 when course ID is missing', async () => {
      // Arrange
      const request = createGetRequest({ auth_token: 'valid-token' })

      // Act
      const response = await GET(request, { params: Promise.resolve({ id: '' }) })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(body.error).toBe('Course ID is required')
    })

    it('should return 401 when auth token is missing', async () => {
      // Arrange
      const request = createGetRequest({})

      // Act
      const response = await GET(request, { params: createParams('course-123') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(body.error).toBe('Authentication required')
    })

    it('should return 401 when session is invalid', async () => {
      // Arrange
      const request = createGetRequest({ auth_token: 'invalid-token' })
      vi.mocked(validateAuthSession).mockResolvedValue(null)

      // Act
      const response = await GET(request, { params: createParams('course-123') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(401)
      expect(body.error).toBe('Invalid or expired session')
    })

    it('should return 404 when course is not found', async () => {
      // Arrange
      const request = createGetRequest({ auth_token: 'valid-token' })
      vi.mocked(validateAuthSession).mockResolvedValue({ id: 'user-123', email: 'test@example.com' })

      const mockSingle = vi.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(supabaseAdmin.from).mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      const response = await GET(request, { params: createParams('non-existent-course') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(404)
      expect(body.error).toBe('Course not found')
    })

    it('should return 403 when user does not own the course', async () => {
      // Arrange
      const request = createGetRequest({ auth_token: 'valid-token' })
      vi.mocked(validateAuthSession).mockResolvedValue({ id: 'user-123', email: 'test@example.com' })

      const courseData = {
        id: 'course-123',
        user_id: 'different-user-456',
        topic: 'Test Course',
        content: { modules: [] },
      }
      const mockSingle = vi.fn().mockResolvedValue({ data: courseData, error: null })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(supabaseAdmin.from).mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      const response = await GET(request, { params: createParams('course-123') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(403)
      expect(body.error).toBe('You do not have permission to view this course')
    })

    it('should return course data when user is the owner', async () => {
      // Arrange
      const request = createGetRequest({ auth_token: 'valid-token' })
      vi.mocked(validateAuthSession).mockResolvedValue({ id: 'user-123', email: 'test@example.com' })

      const courseData = {
        id: 'course-123',
        user_id: 'user-123',
        topic: 'Machine Learning Basics',
        content: {
          title: 'Machine Learning Basics',
          modules: [
            { title: 'Introduction', lessons: [] },
            { title: 'Supervised Learning', lessons: [] },
          ],
        },
        created_at: '2024-03-15T10:00:00Z',
      }
      const mockSingle = vi.fn().mockResolvedValue({ data: courseData, error: null })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(supabaseAdmin.from).mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      const response = await GET(request, { params: createParams('course-123') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.course).toBeDefined()
      expect(body.course.id).toBe('course-123')
      expect(body.course.topic).toBe('Machine Learning Basics')
    })

    it('should return 500 when an unexpected error occurs', async () => {
      // Arrange
      const request = createGetRequest({ auth_token: 'valid-token' })
      vi.mocked(validateAuthSession).mockRejectedValue(new Error('Database connection failed'))

      // Act
      const response = await GET(request, { params: createParams('course-123') })
      const body = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(body.error).toContain('Database connection failed')
    })

    it('should call supabase with correct query', async () => {
      // Arrange
      const request = createGetRequest({ auth_token: 'valid-token' })
      vi.mocked(validateAuthSession).mockResolvedValue({ id: 'user-123', email: 'test@example.com' })

      const courseData = {
        id: 'course-123',
        user_id: 'user-123',
        topic: 'Test Course',
        content: {},
      }
      const mockSingle = vi.fn().mockResolvedValue({ data: courseData, error: null })
      const mockEq = vi.fn().mockReturnValue({ single: mockSingle })
      const mockSelect = vi.fn().mockReturnValue({ eq: mockEq })
      vi.mocked(supabaseAdmin.from).mockReturnValue({ select: mockSelect } as unknown as ReturnType<typeof supabaseAdmin.from>)

      // Act
      await GET(request, { params: createParams('course-123') })

      // Assert
      expect(supabaseAdmin.from).toHaveBeenCalledWith('courses')
      expect(mockSelect).toHaveBeenCalledWith('*')
      expect(mockEq).toHaveBeenCalledWith('id', 'course-123')
    })
  })
})
