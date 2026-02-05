import { describe, it, expect, beforeEach } from 'vitest'
import {
  validateEmail,
  sanitizeEmail,
  validateCourseInput,
  sanitizeInput,
  validateRating,
  isValidUUID,
  rateLimiter,
} from '@/lib/validation'

describe('Validation Utilities', () => {
  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.org',
        'user+tag@example.co.uk',
        'firstname.lastname@company.com',
        'email@subdomain.domain.com',
        'user123@test.io',
      ]

      validEmails.forEach((email) => {
        expect(validateEmail(email)).toBe(true)
      })
    })

    it('should return false for invalid email addresses', () => {
      const invalidEmails = [
        'plainaddress',
        '@missingusername.com',
        'username@.com',
        'username@domain',
        'user@domain.',
        'user name@domain.com',
        'user@dom ain.com',
        '',
        'user@',
        '@domain.com',
      ]

      invalidEmails.forEach((email) => {
        expect(validateEmail(email)).toBe(false)
      })
    })

    it('should be case insensitive', () => {
      expect(validateEmail('USER@EXAMPLE.COM')).toBe(true)
      expect(validateEmail('User@Example.Com')).toBe(true)
    })
  })

  describe('sanitizeEmail', () => {
    it('should convert email to lowercase', () => {
      expect(sanitizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com')
      expect(sanitizeEmail('Test@Domain.Org')).toBe('test@domain.org')
    })

    it('should trim whitespace', () => {
      expect(sanitizeEmail('  test@example.com  ')).toBe('test@example.com')
      expect(sanitizeEmail('\tuser@domain.com\n')).toBe('user@domain.com')
    })

    it('should handle already lowercase and trimmed emails', () => {
      expect(sanitizeEmail('test@example.com')).toBe('test@example.com')
    })
  })

  describe('validateCourseInput', () => {
    it('should return valid for complete valid input', () => {
      const input = {
        topic: 'Machine Learning Basics',
        skillLevel: 'beginner',
        goal: 'Learn for career advancement',
        timeAvailable: '2 hours',
      }

      const result = validateCourseInput(input)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should return error when topic is missing', () => {
      const input = {
        skillLevel: 'beginner',
        goal: 'Learn something new',
        timeAvailable: '1 hour',
      }

      const result = validateCourseInput(input)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Topic is required')
    })

    it('should return error when topic is empty string', () => {
      const input = {
        topic: '',
        skillLevel: 'beginner',
      }

      const result = validateCourseInput(input)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Topic is required')
    })

    it('should return error when topic is only whitespace', () => {
      const input = {
        topic: '   ',
        skillLevel: 'beginner',
      }

      const result = validateCourseInput(input)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Topic is required')
    })

    it('should return error when topic exceeds 200 characters', () => {
      const input = {
        topic: 'A'.repeat(201),
        skillLevel: 'beginner',
      }

      const result = validateCourseInput(input)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Topic must be less than 200 characters')
    })

    it('should accept topic with exactly 200 characters', () => {
      const input = {
        topic: 'A'.repeat(200),
        skillLevel: 'beginner',
      }

      const result = validateCourseInput(input)

      expect(result.valid).toBe(true)
    })

    it('should return error for invalid skill level', () => {
      const input = {
        topic: 'Machine Learning',
        skillLevel: 'expert', // Invalid
      }

      const result = validateCourseInput(input)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Invalid skill level')
    })

    it('should accept valid skill levels', () => {
      const validSkillLevels = ['beginner', 'intermediate', 'advanced']

      validSkillLevels.forEach((skillLevel) => {
        const input = {
          topic: 'Test Topic',
          skillLevel,
        }

        const result = validateCourseInput(input)

        expect(result.valid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    it('should return error when goal exceeds 500 characters', () => {
      const input = {
        topic: 'Machine Learning',
        goal: 'A'.repeat(501),
      }

      const result = validateCourseInput(input)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Goal must be less than 500 characters')
    })

    it('should return error when timeAvailable exceeds 100 characters', () => {
      const input = {
        topic: 'Machine Learning',
        timeAvailable: 'A'.repeat(101),
      }

      const result = validateCourseInput(input)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Time available must be less than 100 characters')
    })

    it('should return multiple errors when multiple validations fail', () => {
      const input = {
        topic: '',
        skillLevel: 'master',
        goal: 'A'.repeat(600),
      }

      const result = validateCourseInput(input)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThanOrEqual(2)
    })

    it('should allow optional fields to be undefined', () => {
      const input = {
        topic: 'Valid Topic',
      }

      const result = validateCourseInput(input)

      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('sanitizeInput', () => {
    it('should trim whitespace', () => {
      expect(sanitizeInput('  hello world  ')).toBe('hello world')
    })

    it('should remove HTML angle brackets', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script')
      expect(sanitizeInput('Hello <b>World</b>')).toBe('Hello bWorld/b')
    })

    it('should truncate input to 1000 characters', () => {
      const longInput = 'A'.repeat(1500)
      const result = sanitizeInput(longInput)

      expect(result.length).toBe(1000)
    })

    it('should handle empty string', () => {
      expect(sanitizeInput('')).toBe('')
    })

    it('should handle normal input without modifications', () => {
      expect(sanitizeInput('Normal text input')).toBe('Normal text input')
    })
  })

  describe('validateRating', () => {
    it('should return true for valid ratings 1-5', () => {
      [1, 2, 3, 4, 5].forEach((rating) => {
        expect(validateRating(rating)).toBe(true)
      })
    })

    it('should return false for ratings below 1', () => {
      expect(validateRating(0)).toBe(false)
      expect(validateRating(-1)).toBe(false)
    })

    it('should return false for ratings above 5', () => {
      expect(validateRating(6)).toBe(false)
      expect(validateRating(100)).toBe(false)
    })

    it('should return false for non-integer ratings', () => {
      expect(validateRating(3.5)).toBe(false)
      expect(validateRating(4.1)).toBe(false)
    })

    it('should return false for NaN', () => {
      expect(validateRating(NaN)).toBe(false)
    })
  })

  describe('isValidUUID', () => {
    it('should return true for valid UUIDs', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        'AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE', // Uppercase
        '00000000-0000-0000-0000-000000000000',
      ]

      validUUIDs.forEach((uuid) => {
        expect(isValidUUID(uuid)).toBe(true)
      })
    })

    it('should return false for invalid UUIDs', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123e4567-e89b-12d3-a456', // Too short
        '123e4567-e89b-12d3-a456-426614174000-extra', // Too long
        '123e4567e89b12d3a456426614174000', // Missing dashes
        'gggggggg-gggg-gggg-gggg-gggggggggggg', // Invalid hex characters
        '',
        '123e4567-e89b-12d3-a456-42661417400', // One character short
      ]

      invalidUUIDs.forEach((uuid) => {
        expect(isValidUUID(uuid)).toBe(false)
      })
    })
  })

  describe('RateLimiter', () => {
    beforeEach(() => {
      // Clear rate limiter state before each test
      rateLimiter.clear('test-key')
    })

    it('should allow requests within the limit', () => {
      const key = 'test-key'
      const maxRequests = 3
      const windowMs = 1000

      // First 3 requests should be allowed
      expect(rateLimiter.isAllowed(key, maxRequests, windowMs)).toBe(true)
      expect(rateLimiter.isAllowed(key, maxRequests, windowMs)).toBe(true)
      expect(rateLimiter.isAllowed(key, maxRequests, windowMs)).toBe(true)
    })

    it('should block requests exceeding the limit', () => {
      const key = 'test-key'
      const maxRequests = 2
      const windowMs = 10000

      // First 2 requests allowed
      expect(rateLimiter.isAllowed(key, maxRequests, windowMs)).toBe(true)
      expect(rateLimiter.isAllowed(key, maxRequests, windowMs)).toBe(true)

      // Third request should be blocked
      expect(rateLimiter.isAllowed(key, maxRequests, windowMs)).toBe(false)
    })

    it('should track different keys separately', () => {
      const maxRequests = 1
      const windowMs = 10000

      expect(rateLimiter.isAllowed('key1', maxRequests, windowMs)).toBe(true)
      expect(rateLimiter.isAllowed('key2', maxRequests, windowMs)).toBe(true)
      expect(rateLimiter.isAllowed('key1', maxRequests, windowMs)).toBe(false)
      expect(rateLimiter.isAllowed('key2', maxRequests, windowMs)).toBe(false)
    })

    it('should clear rate limit for a specific key', () => {
      const key = 'test-key'
      const maxRequests = 1
      const windowMs = 10000

      // Use up the limit
      expect(rateLimiter.isAllowed(key, maxRequests, windowMs)).toBe(true)
      expect(rateLimiter.isAllowed(key, maxRequests, windowMs)).toBe(false)

      // Clear and try again
      rateLimiter.clear(key)
      expect(rateLimiter.isAllowed(key, maxRequests, windowMs)).toBe(true)
    })
  })
})
