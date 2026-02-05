import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST as verifyOtpHandler } from '@/app/api/auth/verify-otp/route'
import { POST as logoutHandler } from '@/app/api/auth/logout/route'
import { GET as verifyMagicLinkHandler } from '@/app/api/auth/verify/route'

// Mock the auth service
vi.mock('@/lib/services/auth', () => ({
  verifyOTP: vi.fn(),
  verifyMagicLink: vi.fn(),
  logout: vi.fn(),
}))

// Mock getErrorMessage
vi.mock('@/lib/types', () => ({
  getErrorMessage: (error: unknown) => {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    return 'An unexpected error occurred'
  },
}))

// Import mocked functions for test control
import { verifyOTP, verifyMagicLink, logout } from '@/lib/services/auth'

describe('Auth API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('POST /api/auth/verify-otp', () => {
    const createRequest = (body: Record<string, unknown>) => {
      return new NextRequest('http://localhost:3000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }

    it('should return 400 when sessionId is missing', async () => {
      // Arrange
      const request = createRequest({ code: '123456' })

      // Act
      const response = await verifyOtpHandler(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(body.error).toBe('Session ID and verification code are required')
    })

    it('should return 400 when code is missing', async () => {
      // Arrange
      const request = createRequest({ sessionId: 'test-session-id' })

      // Act
      const response = await verifyOtpHandler(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(body.error).toBe('Session ID and verification code are required')
    })

    it('should return 400 when code is not 6 digits', async () => {
      // Arrange: Code is only 5 digits
      const request = createRequest({ sessionId: 'test-session-id', code: '12345' })

      // Act
      const response = await verifyOtpHandler(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(body.error).toBe('Verification code must be 6 digits')
    })

    it('should return 400 when code contains non-numeric characters', async () => {
      // Arrange: Code contains letters
      const request = createRequest({ sessionId: 'test-session-id', code: 'abc123' })

      // Act
      const response = await verifyOtpHandler(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(body.error).toBe('Verification code must be 6 digits')
    })

    it('should return 400 when OTP verification fails', async () => {
      // Arrange
      vi.mocked(verifyOTP).mockResolvedValue({
        success: false,
        isNewUser: false,
        error: 'Invalid code. 2 attempts remaining.',
      })
      const request = createRequest({ sessionId: 'test-session-id', code: '123456' })

      // Act
      const response = await verifyOtpHandler(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(400)
      expect(body.error).toBe('Invalid code. 2 attempts remaining.')
    })

    it('should return success with auth token cookie on valid OTP', async () => {
      // Arrange
      vi.mocked(verifyOTP).mockResolvedValue({
        success: true,
        userId: 'user-123',
        isNewUser: false,
        authToken: 'test-auth-token',
      })
      const request = createRequest({ sessionId: 'test-session-id', code: '123456' })

      // Act
      const response = await verifyOtpHandler(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.userId).toBe('user-123')
      expect(body.isNewUser).toBe(false)

      // Verify auth token cookie is set
      const cookies = response.cookies.getAll()
      const authCookie = cookies.find((c) => c.name === 'auth_token')
      expect(authCookie).toBeDefined()
      expect(authCookie?.value).toBe('test-auth-token')
    })

    it('should return isNewUser true for first-time users', async () => {
      // Arrange
      vi.mocked(verifyOTP).mockResolvedValue({
        success: true,
        userId: 'new-user-456',
        isNewUser: true,
        authToken: 'new-user-token',
      })
      const request = createRequest({ sessionId: 'test-session-id', code: '654321' })

      // Act
      const response = await verifyOtpHandler(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(body.isNewUser).toBe(true)
    })

    it('should return 500 when an unexpected error occurs', async () => {
      // Arrange
      vi.mocked(verifyOTP).mockRejectedValue(new Error('Database connection failed'))
      const request = createRequest({ sessionId: 'test-session-id', code: '123456' })

      // Act
      const response = await verifyOtpHandler(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(500)
      expect(body.error).toContain('Database connection failed')
    })
  })

  describe('GET /api/auth/verify (Magic Link)', () => {
    const createRequest = (params: Record<string, string>) => {
      const searchParams = new URLSearchParams(params)
      return new NextRequest(`http://localhost:3000/api/auth/verify?${searchParams.toString()}`, {
        method: 'GET',
      })
    }

    it('should redirect to error page when token is missing', async () => {
      // Arrange
      const request = createRequest({ session: 'test-session-id' })

      // Act
      const response = await verifyMagicLinkHandler(request)

      // Assert
      expect(response.status).toBe(307) // Redirect
      const location = response.headers.get('location')
      expect(location).toContain('/auth/error')
      expect(location).toContain('reason=invalid_link')
    })

    it('should redirect to error page when session is missing', async () => {
      // Arrange
      const request = createRequest({ token: 'test-token' })

      // Act
      const response = await verifyMagicLinkHandler(request)

      // Assert
      expect(response.status).toBe(307)
      const location = response.headers.get('location')
      expect(location).toContain('/auth/error')
      expect(location).toContain('reason=invalid_link')
    })

    it('should redirect to error page when verification fails', async () => {
      // Arrange
      vi.mocked(verifyMagicLink).mockResolvedValue({
        success: false,
        isNewUser: false,
        error: 'This link has expired',
      })
      const request = createRequest({ token: 'expired-token', session: 'test-session' })

      // Act
      const response = await verifyMagicLinkHandler(request)

      // Assert
      expect(response.status).toBe(307)
      const location = response.headers.get('location')
      expect(location).toContain('/auth/error')
    })

    it('should redirect to welcome page for new users on successful verification', async () => {
      // Arrange
      vi.mocked(verifyMagicLink).mockResolvedValue({
        success: true,
        userId: 'new-user-789',
        isNewUser: true,
        authToken: 'valid-token',
      })
      const request = createRequest({ token: 'valid-token', session: 'valid-session' })

      // Act
      const response = await verifyMagicLinkHandler(request)

      // Assert
      expect(response.status).toBe(307)
      const location = response.headers.get('location')
      expect(location).toContain('/welcome')
    })

    it('should redirect to home or specified redirect URL for existing users', async () => {
      // Arrange
      vi.mocked(verifyMagicLink).mockResolvedValue({
        success: true,
        userId: 'existing-user',
        isNewUser: false,
        authToken: 'valid-token',
      })
      const request = createRequest({
        token: 'valid-token',
        session: 'valid-session',
        redirect: '/dashboard',
      })

      // Act
      const response = await verifyMagicLinkHandler(request)

      // Assert
      expect(response.status).toBe(307)
      const location = response.headers.get('location')
      expect(location).toContain('/dashboard')
    })

    it('should set auth_token cookie on successful verification', async () => {
      // Arrange
      vi.mocked(verifyMagicLink).mockResolvedValue({
        success: true,
        userId: 'user-123',
        isNewUser: false,
        authToken: 'secure-auth-token',
      })
      const request = createRequest({ token: 'valid-token', session: 'valid-session' })

      // Act
      const response = await verifyMagicLinkHandler(request)

      // Assert
      const cookies = response.cookies.getAll()
      const authCookie = cookies.find((c) => c.name === 'auth_token')
      expect(authCookie).toBeDefined()
      expect(authCookie?.value).toBe('secure-auth-token')
    })
  })

  describe('POST /api/auth/logout', () => {
    const createRequest = (cookies: Record<string, string> = {}) => {
      const cookieHeader = Object.entries(cookies)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')

      return new NextRequest('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: cookieHeader ? { Cookie: cookieHeader } : {},
      })
    }

    it('should return success and clear cookies even without auth token', async () => {
      // Arrange
      const request = createRequest({})

      // Act
      const response = await logoutHandler(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)

      // Verify cookies are cleared (deletion sets empty value or max-age=0)
      const setCookieHeaders = response.headers.getSetCookie()
      expect(setCookieHeaders.length).toBeGreaterThan(0)
    })

    it('should call logout service and clear cookies when auth token exists', async () => {
      // Arrange
      vi.mocked(logout).mockResolvedValue()
      // NextRequest requires cookies in a specific format
      const request = new NextRequest('http://localhost:3000/api/auth/logout', {
        method: 'POST',
      })
      // Set the cookie properly using the cookies API
      request.cookies.set('auth_token', 'valid-session-token')

      // Act
      const response = await logoutHandler(request)
      const body = await response.json()

      // Assert
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
      expect(logout).toHaveBeenCalledWith('valid-session-token')
    })

    it('should still return success when logout service throws an error', async () => {
      // Arrange: Logout service fails but we still want to clear cookies
      vi.mocked(logout).mockRejectedValue(new Error('Database error'))
      const request = createRequest({ auth_token: 'valid-session-token' })

      // Act
      const response = await logoutHandler(request)
      const body = await response.json()

      // Assert: Should still succeed (graceful degradation)
      expect(response.status).toBe(200)
      expect(body.success).toBe(true)
    })
  })
})
