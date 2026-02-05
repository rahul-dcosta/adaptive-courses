import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  // Types
  type LessonProgress,
  type CourseProgressData,
  type StreakData,
  // Constants
  PROGRESS_STORAGE_PREFIX,
  STREAK_STORAGE_KEY,
  // Local Storage Helpers
  getProgressFromStorage,
  saveProgressToStorage,
  removeProgressFromStorage,
  getAllProgressFromStorage,
  // Streak Helpers
  getStreakFromStorage,
  saveStreakToStorage,
  createDefaultStreak,
  updateStreak,
  isStreakActive,
  // Progress Calculation Helpers
  createInitialProgress,
  calculateCompletionPercent,
  calculateModuleProgress,
  getLessonProgress,
  updateLessonProgress,
  updateCurrentPosition,
  addTimeSpent,
  // Time Formatting Helpers
  formatTimeSpent,
  getRelativeTime,
  getWeeklyActivity,
} from '@/lib/progress'

// =============================================================================
// Mock localStorage
// =============================================================================

const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length
    },
  }
})()

// =============================================================================
// Progress Calculation Tests
// =============================================================================

describe('Progress Calculation Utilities', () => {
  describe('calculateCompletionPercent', () => {
    it('should return 0 when no lessons are completed', () => {
      // Arrange
      const lessonProgress: Record<string, LessonProgress> = {}
      const totalLessons = 10

      // Act
      const result = calculateCompletionPercent(lessonProgress, totalLessons)

      // Assert
      expect(result).toBe(0)
    })

    it('should return 0 when total lessons is 0', () => {
      // Arrange
      const lessonProgress: Record<string, LessonProgress> = {}
      const totalLessons = 0

      // Act
      const result = calculateCompletionPercent(lessonProgress, totalLessons)

      // Assert
      expect(result).toBe(0)
    })

    it('should calculate correct percentage for partial completion', () => {
      // Arrange
      const lessonProgress: Record<string, LessonProgress> = {
        '0-0': { completed: true, completedAt: '2024-01-01', timeSpent: 100, quizScore: null, quizPassed: null },
        '0-1': { completed: true, completedAt: '2024-01-02', timeSpent: 150, quizScore: null, quizPassed: null },
        '0-2': { completed: false, completedAt: null, timeSpent: 50, quizScore: null, quizPassed: null },
      }
      const totalLessons = 10

      // Act
      const result = calculateCompletionPercent(lessonProgress, totalLessons)

      // Assert
      expect(result).toBe(20) // 2/10 = 20%
    })

    it('should return 100 when all lessons are completed', () => {
      // Arrange
      const lessonProgress: Record<string, LessonProgress> = {
        '0-0': { completed: true, completedAt: '2024-01-01', timeSpent: 100, quizScore: null, quizPassed: null },
        '0-1': { completed: true, completedAt: '2024-01-02', timeSpent: 150, quizScore: null, quizPassed: null },
      }
      const totalLessons = 2

      // Act
      const result = calculateCompletionPercent(lessonProgress, totalLessons)

      // Assert
      expect(result).toBe(100)
    })

    it('should round to nearest integer', () => {
      // Arrange
      const lessonProgress: Record<string, LessonProgress> = {
        '0-0': { completed: true, completedAt: '2024-01-01', timeSpent: 100, quizScore: null, quizPassed: null },
      }
      const totalLessons = 3 // 33.33%

      // Act
      const result = calculateCompletionPercent(lessonProgress, totalLessons)

      // Assert
      expect(result).toBe(33)
    })
  })

  describe('calculateModuleProgress', () => {
    it('should calculate correct module progress with no completed lessons', () => {
      // Arrange
      const lessonProgress: Record<string, LessonProgress> = {}
      const moduleIndex = 0
      const totalLessonsInModule = 5

      // Act
      const result = calculateModuleProgress(lessonProgress, moduleIndex, totalLessonsInModule)

      // Assert
      expect(result.lessonsCompleted).toBe(0)
      expect(result.totalLessons).toBe(5)
      expect(result.completionPercent).toBe(0)
      expect(result.timeSpent).toBe(0)
      expect(result.quizScores).toEqual([])
      expect(result.averageQuizScore).toBeNull()
    })

    it('should calculate correct module progress with partial completion', () => {
      // Arrange
      const lessonProgress: Record<string, LessonProgress> = {
        '0-0': { completed: true, completedAt: '2024-01-01', timeSpent: 120, quizScore: 85, quizPassed: true },
        '0-1': { completed: true, completedAt: '2024-01-02', timeSpent: 90, quizScore: 75, quizPassed: true },
        '0-2': { completed: false, completedAt: null, timeSpent: 30, quizScore: null, quizPassed: null },
      }
      const moduleIndex = 0
      const totalLessonsInModule = 5

      // Act
      const result = calculateModuleProgress(lessonProgress, moduleIndex, totalLessonsInModule)

      // Assert
      expect(result.lessonsCompleted).toBe(2)
      expect(result.totalLessons).toBe(5)
      expect(result.completionPercent).toBe(40) // 2/5 = 40%
      expect(result.timeSpent).toBe(240) // 120 + 90 + 30
      expect(result.quizScores).toEqual([85, 75])
      expect(result.averageQuizScore).toBe(80) // (85 + 75) / 2
    })

    it('should only include lessons from the specified module', () => {
      // Arrange
      const lessonProgress: Record<string, LessonProgress> = {
        '0-0': { completed: true, completedAt: '2024-01-01', timeSpent: 100, quizScore: null, quizPassed: null },
        '1-0': { completed: true, completedAt: '2024-01-02', timeSpent: 150, quizScore: null, quizPassed: null }, // Different module
        '0-1': { completed: false, completedAt: null, timeSpent: 50, quizScore: null, quizPassed: null },
      }
      const moduleIndex = 0
      const totalLessonsInModule = 3

      // Act
      const result = calculateModuleProgress(lessonProgress, moduleIndex, totalLessonsInModule)

      // Assert
      expect(result.lessonsCompleted).toBe(1)
      expect(result.timeSpent).toBe(150) // Only module 0 lessons
    })

    it('should handle module with all lessons completed', () => {
      // Arrange
      const lessonProgress: Record<string, LessonProgress> = {
        '2-0': { completed: true, completedAt: '2024-01-01', timeSpent: 100, quizScore: 90, quizPassed: true },
        '2-1': { completed: true, completedAt: '2024-01-02', timeSpent: 100, quizScore: 100, quizPassed: true },
      }
      const moduleIndex = 2
      const totalLessonsInModule = 2

      // Act
      const result = calculateModuleProgress(lessonProgress, moduleIndex, totalLessonsInModule)

      // Assert
      expect(result.lessonsCompleted).toBe(2)
      expect(result.completionPercent).toBe(100)
      expect(result.averageQuizScore).toBe(95)
    })
  })

  describe('createInitialProgress', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should create initial progress with correct default values', () => {
      // Arrange
      const courseId = 'course-123'
      const totalLessons = 15

      // Act
      const result = createInitialProgress(courseId, totalLessons)

      // Assert
      expect(result.courseId).toBe('course-123')
      expect(result.totalLessons).toBe(15)
      expect(result.lessonProgress).toEqual({})
      expect(result.currentModuleIndex).toBe(0)
      expect(result.currentLessonIndex).toBe(0)
      expect(result.overallCompletionPercent).toBe(0)
      expect(result.totalTimeSpent).toBe(0)
      expect(result.lessonsCompleted).toBe(0)
      expect(result.completedAt).toBeNull()
      expect(result.syncedAt).toBeNull()
      expect(result.pendingSync).toBe(false)
    })

    it('should include userId when provided', () => {
      // Arrange
      const courseId = 'course-123'
      const totalLessons = 10
      const userId = 'user-456'

      // Act
      const result = createInitialProgress(courseId, totalLessons, userId)

      // Assert
      expect(result.userId).toBe('user-456')
    })

    it('should set startedAt and lastActivityAt to current time', () => {
      // Arrange
      const courseId = 'course-123'
      const totalLessons = 10

      // Act
      const result = createInitialProgress(courseId, totalLessons)

      // Assert
      expect(result.startedAt).toBe('2024-03-15T10:00:00.000Z')
      expect(result.lastActivityAt).toBe('2024-03-15T10:00:00.000Z')
    })

    it('should initialize with default streak data', () => {
      // Arrange
      const courseId = 'course-123'
      const totalLessons = 10

      // Act
      const result = createInitialProgress(courseId, totalLessons)

      // Assert
      expect(result.streak.currentStreak).toBe(0)
      expect(result.streak.longestStreak).toBe(0)
      expect(result.streak.lastActivityDate).toBeNull()
      expect(result.streak.streakHistory).toEqual([])
    })
  })

  describe('getLessonProgress', () => {
    it('should return existing lesson progress', () => {
      // Arrange
      const progress: CourseProgressData = createInitialProgress('course-123', 10)
      progress.lessonProgress = {
        '0-0': { completed: true, completedAt: '2024-01-01', timeSpent: 120, quizScore: 85, quizPassed: true },
      }

      // Act
      const result = getLessonProgress(progress, '0-0')

      // Assert
      expect(result.completed).toBe(true)
      expect(result.timeSpent).toBe(120)
      expect(result.quizScore).toBe(85)
    })

    it('should return default lesson progress for non-existent lesson', () => {
      // Arrange
      const progress: CourseProgressData = createInitialProgress('course-123', 10)

      // Act
      const result = getLessonProgress(progress, '99-99')

      // Assert
      expect(result.completed).toBe(false)
      expect(result.completedAt).toBeNull()
      expect(result.timeSpent).toBe(0)
      expect(result.quizScore).toBeNull()
      expect(result.quizPassed).toBeNull()
    })
  })

  describe('updateLessonProgress', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should update lesson progress and recalculate stats', () => {
      // Arrange
      const progress = createInitialProgress('course-123', 10)

      // Act
      const result = updateLessonProgress(progress, '0-0', { completed: true, timeSpent: 120 })

      // Assert
      expect(result.lessonProgress['0-0'].completed).toBe(true)
      expect(result.lessonProgress['0-0'].timeSpent).toBe(120)
      expect(result.lessonsCompleted).toBe(1)
      expect(result.overallCompletionPercent).toBe(10) // 1/10
      expect(result.totalTimeSpent).toBe(120)
      expect(result.pendingSync).toBe(true)
    })

    it('should set completedAt when marking lesson as complete', () => {
      // Arrange
      const progress = createInitialProgress('course-123', 10)

      // Act
      const result = updateLessonProgress(progress, '0-0', { completed: true })

      // Assert
      expect(result.lessonProgress['0-0'].completedAt).toBe('2024-03-15T10:00:00.000Z')
    })

    it('should not overwrite completedAt if already completed', () => {
      // Arrange
      let progress = createInitialProgress('course-123', 10)
      progress = updateLessonProgress(progress, '0-0', { completed: true })
      const originalCompletedAt = progress.lessonProgress['0-0'].completedAt

      vi.setSystemTime(new Date('2024-03-16T10:00:00Z'))

      // Act
      const result = updateLessonProgress(progress, '0-0', { timeSpent: 200 })

      // Assert
      expect(result.lessonProgress['0-0'].completedAt).toBe(originalCompletedAt)
    })

    it('should mark course as completed when all lessons are done', () => {
      // Arrange
      let progress = createInitialProgress('course-123', 2)
      progress = updateLessonProgress(progress, '0-0', { completed: true })

      // Act
      const result = updateLessonProgress(progress, '0-1', { completed: true })

      // Assert
      expect(result.completedAt).toBe('2024-03-15T10:00:00.000Z')
      expect(result.overallCompletionPercent).toBe(100)
    })

    it('should update streak when lesson progress is updated', () => {
      // Arrange
      const progress = createInitialProgress('course-123', 10)

      // Act
      const result = updateLessonProgress(progress, '0-0', { completed: true })

      // Assert
      expect(result.streak.currentStreak).toBe(1)
      expect(result.streak.lastActivityDate).toBe('2024-03-15')
    })
  })

  describe('updateCurrentPosition', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should update current module and lesson indices', () => {
      // Arrange
      const progress = createInitialProgress('course-123', 10)

      // Act
      const result = updateCurrentPosition(progress, 2, 3)

      // Assert
      expect(result.currentModuleIndex).toBe(2)
      expect(result.currentLessonIndex).toBe(3)
      expect(result.pendingSync).toBe(true)
    })

    it('should update lastActivityAt', () => {
      // Arrange
      const progress = createInitialProgress('course-123', 10)
      vi.setSystemTime(new Date('2024-03-16T10:00:00Z'))

      // Act
      const result = updateCurrentPosition(progress, 1, 0)

      // Assert
      expect(result.lastActivityAt).toBe('2024-03-16T10:00:00.000Z')
    })
  })

  describe('addTimeSpent', () => {
    it('should add time to specific lesson', () => {
      // Arrange
      const progress = createInitialProgress('course-123', 10)

      // Act
      const result = addTimeSpent(progress, '0-0', 60)

      // Assert
      expect(result.lessonProgress['0-0'].timeSpent).toBe(60)
      expect(result.totalTimeSpent).toBe(60)
    })

    it('should accumulate time for multiple additions', () => {
      // Arrange
      let progress = createInitialProgress('course-123', 10)
      progress = addTimeSpent(progress, '0-0', 60)

      // Act
      const result = addTimeSpent(progress, '0-0', 30)

      // Assert
      expect(result.lessonProgress['0-0'].timeSpent).toBe(90)
      expect(result.totalTimeSpent).toBe(90)
    })

    it('should mark progress as pending sync', () => {
      // Arrange
      const progress = createInitialProgress('course-123', 10)

      // Act
      const result = addTimeSpent(progress, '0-0', 60)

      // Assert
      expect(result.pendingSync).toBe(true)
    })
  })
})

// =============================================================================
// Streak Calculation Tests
// =============================================================================

describe('Streak Calculation Utilities', () => {
  describe('createDefaultStreak', () => {
    it('should create streak with all default values', () => {
      // Act
      const result = createDefaultStreak()

      // Assert
      expect(result.currentStreak).toBe(0)
      expect(result.longestStreak).toBe(0)
      expect(result.lastActivityDate).toBeNull()
      expect(result.streakHistory).toEqual([])
    })
  })

  describe('updateStreak', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should start a new streak when no previous activity', () => {
      // Arrange
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const streak = createDefaultStreak()

      // Act
      const result = updateStreak(streak)

      // Assert
      expect(result.currentStreak).toBe(1)
      expect(result.longestStreak).toBe(1)
      expect(result.lastActivityDate).toBe('2024-03-15')
      expect(result.streakHistory).toContain('2024-03-15')
    })

    it('should continue streak when activity was yesterday', () => {
      // Arrange
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const streak: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: '2024-03-14', // Yesterday
        streakHistory: ['2024-03-14'],
      }

      // Act
      const result = updateStreak(streak)

      // Assert
      expect(result.currentStreak).toBe(6)
      expect(result.longestStreak).toBe(10)
      expect(result.lastActivityDate).toBe('2024-03-15')
    })

    it('should update longest streak when current exceeds it', () => {
      // Arrange
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const streak: StreakData = {
        currentStreak: 10,
        longestStreak: 10,
        lastActivityDate: '2024-03-14',
        streakHistory: ['2024-03-14'],
      }

      // Act
      const result = updateStreak(streak)

      // Assert
      expect(result.currentStreak).toBe(11)
      expect(result.longestStreak).toBe(11)
    })

    it('should reset streak when activity was more than one day ago', () => {
      // Arrange
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const streak: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: '2024-03-12', // 3 days ago
        streakHistory: ['2024-03-12'],
      }

      // Act
      const result = updateStreak(streak)

      // Assert
      expect(result.currentStreak).toBe(1)
      expect(result.longestStreak).toBe(10) // Preserved
      expect(result.lastActivityDate).toBe('2024-03-15')
    })

    it('should not update if activity already recorded today', () => {
      // Arrange
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const streak: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: '2024-03-15', // Today
        streakHistory: ['2024-03-15'],
      }

      // Act
      const result = updateStreak(streak)

      // Assert
      expect(result.currentStreak).toBe(5) // Unchanged
      expect(result.longestStreak).toBe(10)
    })

    it('should limit streak history to last 30 days', () => {
      // Arrange
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const history = Array.from({ length: 30 }, (_, i) => `2024-02-${String(i + 1).padStart(2, '0')}`)
      const streak: StreakData = {
        currentStreak: 1,
        longestStreak: 30,
        lastActivityDate: '2024-03-14',
        streakHistory: history,
      }

      // Act
      const result = updateStreak(streak)

      // Assert
      expect(result.streakHistory.length).toBe(30)
      expect(result.streakHistory).toContain('2024-03-15')
    })
  })

  describe('isStreakActive', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return true if last activity was today', () => {
      // Arrange
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const streak: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: '2024-03-15',
        streakHistory: [],
      }

      // Act & Assert
      expect(isStreakActive(streak)).toBe(true)
    })

    it('should return true if last activity was yesterday', () => {
      // Arrange
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const streak: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: '2024-03-14',
        streakHistory: [],
      }

      // Act & Assert
      expect(isStreakActive(streak)).toBe(true)
    })

    it('should return false if last activity was more than one day ago', () => {
      // Arrange
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
      const streak: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: '2024-03-13', // 2 days ago
        streakHistory: [],
      }

      // Act & Assert
      expect(isStreakActive(streak)).toBe(false)
    })

    it('should return false if no last activity date', () => {
      // Arrange
      const streak: StreakData = {
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: null,
        streakHistory: [],
      }

      // Act & Assert
      expect(isStreakActive(streak)).toBe(false)
    })
  })
})

// =============================================================================
// localStorage Helper Tests
// =============================================================================

describe('localStorage Helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getProgressFromStorage', () => {
    it('should return null when no progress exists', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null)

      // Act
      const result = getProgressFromStorage('course-123')

      // Assert
      expect(result).toBeNull()
      expect(localStorageMock.getItem).toHaveBeenCalledWith(`${PROGRESS_STORAGE_PREFIX}course-123`)
    })

    it('should return parsed progress data', () => {
      // Arrange
      const progressData: CourseProgressData = createInitialProgress('course-123', 10)
      localStorageMock.getItem.mockReturnValue(JSON.stringify(progressData))

      // Act
      const result = getProgressFromStorage('course-123')

      // Assert
      expect(result).not.toBeNull()
      expect(result?.courseId).toBe('course-123')
      expect(result?.totalLessons).toBe(10)
    })

    it('should return null and log warning on parse error', () => {
      // Arrange
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      localStorageMock.getItem.mockReturnValue('invalid json')

      // Act
      const result = getProgressFromStorage('course-123')

      // Assert
      expect(result).toBeNull()
      expect(consoleWarn).toHaveBeenCalled()

      consoleWarn.mockRestore()
    })
  })

  describe('saveProgressToStorage', () => {
    it('should save progress data to localStorage', () => {
      // Arrange
      const progress = createInitialProgress('course-123', 10)

      // Act
      const result = saveProgressToStorage(progress)

      // Assert
      expect(result).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        `${PROGRESS_STORAGE_PREFIX}course-123`,
        JSON.stringify(progress)
      )
    })

    it('should return false and log warning on error', () => {
      // Arrange
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage full')
      })
      const progress = createInitialProgress('course-123', 10)

      // Act
      const result = saveProgressToStorage(progress)

      // Assert
      expect(result).toBe(false)
      expect(consoleWarn).toHaveBeenCalled()

      consoleWarn.mockRestore()
    })
  })

  describe('removeProgressFromStorage', () => {
    it('should remove progress data from localStorage', () => {
      // Act
      const result = removeProgressFromStorage('course-123')

      // Assert
      expect(result).toBe(true)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(`${PROGRESS_STORAGE_PREFIX}course-123`)
    })

    it('should return false and log warning on error', () => {
      // Arrange
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Access denied')
      })

      // Act
      const result = removeProgressFromStorage('course-123')

      // Assert
      expect(result).toBe(false)
      expect(consoleWarn).toHaveBeenCalled()

      consoleWarn.mockRestore()
    })
  })

  describe('getAllProgressFromStorage', () => {
    it('should return empty array when no progress exists', () => {
      // Arrange
      Object.defineProperty(localStorageMock, 'length', { value: 0, writable: true })

      // Act
      const result = getAllProgressFromStorage()

      // Assert
      expect(result).toEqual([])
    })

    it('should return all progress data with correct prefix', () => {
      // Arrange
      const progress1 = createInitialProgress('course-1', 10)
      const progress2 = createInitialProgress('course-2', 5)

      // Mock keys that match and don't match prefix
      const keys = [`${PROGRESS_STORAGE_PREFIX}course-1`, `${PROGRESS_STORAGE_PREFIX}course-2`, 'other-key']
      localStorageMock.key.mockImplementation((index: number) => keys[index] || null)
      Object.defineProperty(localStorageMock, 'length', { value: keys.length, writable: true })
      localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === `${PROGRESS_STORAGE_PREFIX}course-1`) return JSON.stringify(progress1)
        if (key === `${PROGRESS_STORAGE_PREFIX}course-2`) return JSON.stringify(progress2)
        return null
      })

      // Act
      const result = getAllProgressFromStorage()

      // Assert
      expect(result.length).toBe(2)
      expect(result.map((p) => p.courseId)).toContain('course-1')
      expect(result.map((p) => p.courseId)).toContain('course-2')
    })
  })

  describe('Streak Storage', () => {
    it('should get streak from storage', () => {
      // Arrange
      const streak: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: '2024-03-15',
        streakHistory: ['2024-03-15'],
      }
      localStorageMock.getItem.mockReturnValue(JSON.stringify(streak))

      // Act
      const result = getStreakFromStorage()

      // Assert
      expect(result.currentStreak).toBe(5)
      expect(localStorageMock.getItem).toHaveBeenCalledWith(STREAK_STORAGE_KEY)
    })

    it('should return default streak when none exists', () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null)

      // Act
      const result = getStreakFromStorage()

      // Assert
      expect(result.currentStreak).toBe(0)
      expect(result.longestStreak).toBe(0)
    })

    it('should save streak to storage', () => {
      // Arrange
      const streak: StreakData = {
        currentStreak: 5,
        longestStreak: 10,
        lastActivityDate: '2024-03-15',
        streakHistory: ['2024-03-15'],
      }

      // Act
      const result = saveStreakToStorage(streak)

      // Assert
      expect(result).toBe(true)
      expect(localStorageMock.setItem).toHaveBeenCalledWith(STREAK_STORAGE_KEY, JSON.stringify(streak))
    })
  })
})

// =============================================================================
// Time Formatting Tests
// =============================================================================

describe('Time Formatting Utilities', () => {
  describe('formatTimeSpent', () => {
    it('should format seconds as seconds for small values', () => {
      // Assert
      expect(formatTimeSpent(30)).toBe('30s')
      expect(formatTimeSpent(59)).toBe('59s')
    })

    it('should format as minutes for values under an hour', () => {
      // Assert
      expect(formatTimeSpent(60)).toBe('1m')
      expect(formatTimeSpent(90)).toBe('1m 30s')
      expect(formatTimeSpent(300)).toBe('5m')
      expect(formatTimeSpent(3540)).toBe('59m')
    })

    it('should format as hours for large values', () => {
      // Assert
      expect(formatTimeSpent(3600)).toBe('1h')
      expect(formatTimeSpent(3660)).toBe('1h 1m')
      expect(formatTimeSpent(7200)).toBe('2h')
      expect(formatTimeSpent(7320)).toBe('2h 2m')
    })

    it('should handle zero seconds', () => {
      // Assert
      expect(formatTimeSpent(0)).toBe('0s')
    })
  })

  describe('getRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return "just now" for recent times', () => {
      // Assert
      expect(getRelativeTime('2024-03-15T09:59:30Z')).toBe('just now')
    })

    it('should return minutes ago', () => {
      // Assert
      expect(getRelativeTime('2024-03-15T09:55:00Z')).toBe('5 minutes ago')
      expect(getRelativeTime('2024-03-15T09:59:00Z')).toBe('1 minute ago')
    })

    it('should return hours ago', () => {
      // Assert
      expect(getRelativeTime('2024-03-15T07:00:00Z')).toBe('3 hours ago')
      expect(getRelativeTime('2024-03-15T09:00:00Z')).toBe('1 hour ago')
    })

    it('should return days ago', () => {
      // Assert
      expect(getRelativeTime('2024-03-13T10:00:00Z')).toBe('2 days ago')
      expect(getRelativeTime('2024-03-14T10:00:00Z')).toBe('1 day ago')
    })

    it('should return formatted date for old dates', () => {
      // Assert - Same year
      const result = getRelativeTime('2024-02-01T10:00:00Z')
      expect(result).toContain('Feb')
      expect(result).toContain('1')
    })
  })

  describe('getWeeklyActivity', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-03-15T10:00:00Z')) // Friday
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should return 7 days of activity', () => {
      // Act
      const result = getWeeklyActivity([])

      // Assert
      expect(result.length).toBe(7)
    })

    it('should mark days with activity correctly', () => {
      // Arrange
      const history = ['2024-03-15', '2024-03-13']

      // Act
      const result = getWeeklyActivity(history)

      // Assert
      const todayEntry = result.find((d) => d.date === '2024-03-15')
      const activeEntry = result.find((d) => d.date === '2024-03-13')
      const inactiveEntry = result.find((d) => d.date === '2024-03-14')

      expect(todayEntry?.hasActivity).toBe(true)
      expect(activeEntry?.hasActivity).toBe(true)
      expect(inactiveEntry?.hasActivity).toBe(false)
    })

    it('should include day names', () => {
      // Act
      const result = getWeeklyActivity([])

      // Assert
      expect(result.some((d) => d.dayName === 'Sat')).toBe(true)
      expect(result.some((d) => d.dayName === 'Fri')).toBe(true)
    })
  })
})
