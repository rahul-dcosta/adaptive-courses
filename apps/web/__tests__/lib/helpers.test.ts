import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatDate,
  formatDateTime,
  timeAgo,
  truncate,
  slugify,
  capitalize,
  formatCurrency,
  generateId,
  debounce,
  throttle,
  classNames,
  groupBy,
  unique,
  shuffle,
  sleep,
  retry,
} from '@/lib/helpers'

describe('Helper Utilities', () => {
  describe('formatDate', () => {
    it('should format Date object correctly', () => {
      const date = new Date('2024-03-15T10:30:00Z')
      const result = formatDate(date)

      expect(result).toContain('March')
      expect(result).toContain('15')
      expect(result).toContain('2024')
    })

    it('should format date string correctly', () => {
      const dateString = '2024-12-25T00:00:00Z'
      const result = formatDate(dateString)

      expect(result).toContain('December')
      expect(result).toContain('2024')
    })

    it('should handle different date formats', () => {
      // Use a full ISO date string to avoid timezone issues
      const result = formatDate('2024-01-15T12:00:00Z')

      expect(result).toContain('2024')
      expect(result).toContain('January')
    })
  })

  describe('formatDateTime', () => {
    it('should include both date and time', () => {
      const date = new Date('2024-03-15T14:30:00Z')
      const result = formatDateTime(date)

      expect(result).toContain('March')
      expect(result).toContain('15')
      expect(result).toContain('2024')
      // Time format may vary by locale, just check it's longer than date only
      expect(result.length).toBeGreaterThan(formatDate(date).length)
    })

    it('should format string dates correctly', () => {
      const result = formatDateTime('2024-06-15T09:00:00Z')

      expect(result).toContain('June')
      expect(result).toContain('2024')
    })
  })

  describe('timeAgo', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return "just now" for recent times', () => {
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const date = new Date('2024-03-15T09:59:30Z') // 30 seconds ago

      expect(timeAgo(date)).toBe('just now')
    })

    it('should return minutes ago', () => {
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const date = new Date('2024-03-15T09:55:00Z') // 5 minutes ago

      expect(timeAgo(date)).toBe('5 minutes ago')
    })

    it('should return singular form for 1 unit', () => {
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const date = new Date('2024-03-15T09:59:00Z') // 1 minute ago

      expect(timeAgo(date)).toBe('1 minute ago')
    })

    it('should return hours ago', () => {
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const date = new Date('2024-03-15T07:00:00Z') // 3 hours ago

      expect(timeAgo(date)).toBe('3 hours ago')
    })

    it('should return days ago', () => {
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const date = new Date('2024-03-13T10:00:00Z') // 2 days ago

      expect(timeAgo(date)).toBe('2 days ago')
    })

    it('should return weeks ago', () => {
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const date = new Date('2024-03-01T10:00:00Z') // 2 weeks ago

      expect(timeAgo(date)).toBe('2 weeks ago')
    })

    it('should return months ago', () => {
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const date = new Date('2024-01-01T10:00:00Z') // ~2.5 months ago

      expect(timeAgo(date)).toBe('2 months ago')
    })

    it('should return years ago', () => {
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const date = new Date('2022-03-15T10:00:00Z') // 2 years ago

      expect(timeAgo(date)).toBe('2 years ago')
    })

    it('should handle string dates', () => {
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))

      expect(timeAgo('2024-03-15T09:00:00Z')).toBe('1 hour ago')
    })
  })

  describe('truncate', () => {
    it('should not truncate strings shorter than maxLength', () => {
      expect(truncate('Hello', 10)).toBe('Hello')
    })

    it('should not truncate strings equal to maxLength', () => {
      expect(truncate('Hello', 5)).toBe('Hello')
    })

    it('should truncate strings longer than maxLength and add ellipsis', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...')
    })

    it('should handle empty strings', () => {
      expect(truncate('', 10)).toBe('')
    })

    it('should handle very short maxLength', () => {
      expect(truncate('Hello', 4)).toBe('H...')
    })
  })

  describe('slugify', () => {
    it('should convert spaces to hyphens', () => {
      expect(slugify('Hello World')).toBe('hello-world')
    })

    it('should convert to lowercase', () => {
      expect(slugify('HELLO WORLD')).toBe('hello-world')
    })

    it('should remove special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world')
    })

    it('should handle multiple spaces and hyphens', () => {
      expect(slugify('Hello   World---Test')).toBe('hello-world-test')
    })

    it('should remove leading and trailing hyphens', () => {
      expect(slugify('--Hello World--')).toBe('hello-world')
    })

    it('should handle underscores', () => {
      expect(slugify('hello_world_test')).toBe('hello-world-test')
    })
  })

  describe('capitalize', () => {
    it('should capitalize the first letter', () => {
      expect(capitalize('hello')).toBe('Hello')
    })

    it('should keep the rest of the string as is', () => {
      expect(capitalize('hELLO')).toBe('HELLO')
    })

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('')
    })

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A')
    })

    it('should handle already capitalized strings', () => {
      expect(capitalize('Hello')).toBe('Hello')
    })
  })

  describe('formatCurrency', () => {
    it('should format USD by default', () => {
      const result = formatCurrency(99.99)

      expect(result).toContain('99.99')
      expect(result).toMatch(/[$]/)
    })

    it('should format different currencies', () => {
      const eurResult = formatCurrency(50, 'EUR')
      const gbpResult = formatCurrency(75, 'GBP')

      expect(eurResult).toContain('50')
      expect(gbpResult).toContain('75')
    })

    it('should handle zero', () => {
      const result = formatCurrency(0)

      expect(result).toContain('0')
    })

    it('should handle large numbers', () => {
      const result = formatCurrency(1234567.89)

      expect(result).toContain('1,234,567.89')
    })
  })

  describe('generateId', () => {
    it('should generate an 8-character ID by default', () => {
      const id = generateId()

      expect(id.length).toBe(8)
    })

    it('should generate ID with specified length', () => {
      expect(generateId(5).length).toBe(5)
      expect(generateId(12).length).toBe(12)
      expect(generateId(20).length).toBe(20)
    })

    it('should only contain lowercase letters and numbers', () => {
      const id = generateId(100)

      expect(id).toMatch(/^[a-z0-9]+$/)
    })

    it('should generate unique IDs', () => {
      const ids = new Set()
      for (let i = 0; i < 100; i++) {
        ids.add(generateId(16))
      }

      expect(ids.size).toBe(100)
    })
  })

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should delay function execution', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      expect(mockFn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should only execute once for rapid calls', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      vi.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should pass arguments to the debounced function', () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('arg1', 'arg2')
      vi.advanceTimersByTime(100)

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('throttle', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should execute immediately on first call', () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should not execute during throttle period', () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should allow execution after throttle period', () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      vi.advanceTimersByTime(100)
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    it('should pass arguments to the throttled function', () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn('test', 123)

      expect(mockFn).toHaveBeenCalledWith('test', 123)
    })
  })

  describe('classNames', () => {
    it('should join class names', () => {
      expect(classNames('class1', 'class2')).toBe('class1 class2')
    })

    it('should filter out falsy values', () => {
      expect(classNames('class1', false, 'class2', undefined)).toBe('class1 class2')
    })

    it('should handle conditional classes', () => {
      const isActive = true
      const isDisabled = false

      expect(classNames('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')).toBe('btn btn-active')
    })

    it('should handle empty input', () => {
      expect(classNames()).toBe('')
    })

    it('should handle all falsy values', () => {
      expect(classNames(false, undefined, '')).toBe('')
    })
  })

  describe('groupBy', () => {
    it('should group array by key', () => {
      const items = [
        { category: 'fruit', name: 'apple' },
        { category: 'fruit', name: 'banana' },
        { category: 'vegetable', name: 'carrot' },
      ]

      const result = groupBy(items, 'category')

      expect(result.fruit).toHaveLength(2)
      expect(result.vegetable).toHaveLength(1)
    })

    it('should handle empty array', () => {
      const result = groupBy([], 'key')

      expect(result).toEqual({})
    })

    it('should handle numeric keys', () => {
      const items = [
        { score: 100, name: 'Alice' },
        { score: 100, name: 'Bob' },
        { score: 90, name: 'Charlie' },
      ]

      const result = groupBy(items, 'score')

      expect(result['100']).toHaveLength(2)
      expect(result['90']).toHaveLength(1)
    })
  })

  describe('unique', () => {
    it('should remove duplicate values', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
    })

    it('should work with strings', () => {
      expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
    })

    it('should handle empty array', () => {
      expect(unique([])).toEqual([])
    })

    it('should handle array with no duplicates', () => {
      expect(unique([1, 2, 3])).toEqual([1, 2, 3])
    })
  })

  describe('shuffle', () => {
    it('should return an array of the same length', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = shuffle(arr)

      expect(result.length).toBe(arr.length)
    })

    it('should contain all original elements', () => {
      const arr = [1, 2, 3, 4, 5]
      const result = shuffle(arr)

      expect(result.sort()).toEqual(arr.sort())
    })

    it('should not modify the original array', () => {
      const arr = [1, 2, 3, 4, 5]
      const original = [...arr]
      shuffle(arr)

      expect(arr).toEqual(original)
    })

    it('should handle empty array', () => {
      expect(shuffle([])).toEqual([])
    })

    it('should handle single element array', () => {
      expect(shuffle([1])).toEqual([1])
    })
  })

  describe('sleep', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should resolve after specified time', async () => {
      const promise = sleep(1000)
      let resolved = false

      promise.then(() => {
        resolved = true
      })

      expect(resolved).toBe(false)

      vi.advanceTimersByTime(1000)
      await Promise.resolve()

      expect(resolved).toBe(true)
    })
  })

  describe('retry', () => {
    it('should return result on first successful attempt', async () => {
      const mockFn = vi.fn().mockResolvedValue('success')

      const result = await retry(mockFn, 3, 0)

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should retry on failure and eventually succeed', async () => {
      const mockFn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Fail 1'))
        .mockRejectedValueOnce(new Error('Fail 2'))
        .mockResolvedValue('success')

      const result = await retry(mockFn, 3, 0)

      expect(result).toBe('success')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('should throw after max attempts', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Always fails'))

      await expect(retry(mockFn, 3, 0)).rejects.toThrow('Always fails')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })

    it('should use exponential backoff', async () => {
      vi.useFakeTimers()
      const mockFn = vi
        .fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValue('success')

      const retryPromise = retry(mockFn, 3, 100)

      // First attempt immediate
      await vi.advanceTimersByTimeAsync(0)
      expect(mockFn).toHaveBeenCalledTimes(1)

      // Wait for first delay (100ms * 1)
      await vi.advanceTimersByTimeAsync(100)
      expect(mockFn).toHaveBeenCalledTimes(2)

      await retryPromise
      vi.useRealTimers()
    })
  })
})
