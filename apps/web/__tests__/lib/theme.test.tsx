import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme, themeScript } from '@/lib/theme-context'
import React from 'react'

// Mock localStorage
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
  }
})()

// Mock matchMedia
const createMatchMedia = (matches: boolean) => {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

// Test component that uses the theme context
function TestThemeConsumer() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved-theme">{resolvedTheme}</span>
      <button data-testid="set-light" onClick={() => setTheme('light')}>
        Set Light
      </button>
      <button data-testid="set-dark" onClick={() => setTheme('dark')}>
        Set Dark
      </button>
      <button data-testid="set-system" onClick={() => setTheme('system')}>
        Set System
      </button>
      <button data-testid="toggle" onClick={toggleTheme}>
        Toggle
      </button>
    </div>
  )
}

describe('Theme Context', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.matchMedia = createMatchMedia(false) // Default to light mode system preference
    document.documentElement.classList.remove('dark', 'theme-transitioning')
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Theme Context Initialization', () => {
    it('should initialize with default theme when no localStorage value', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null)

      // Act
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Assert - After mount, theme should be 'system' (the default)
      await waitFor(() => {
        expect(screen.getByTestId('theme').textContent).toBe('system')
      })
    })

    it('should initialize with stored theme from localStorage', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('dark')

      // Act
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('theme').textContent).toBe('dark')
        expect(screen.getByTestId('resolved-theme').textContent).toBe('dark')
      })
    })

    it('should use provided defaultTheme prop', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue(null)

      // Act
      render(
        <ThemeProvider defaultTheme="dark">
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('theme').textContent).toBe('dark')
      })
    })

    it('should prioritize localStorage over defaultTheme', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('light')

      // Act
      render(
        <ThemeProvider defaultTheme="dark">
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('theme').textContent).toBe('light')
      })
    })
  })

  describe('setTheme Function', () => {
    it('should persist light theme to localStorage', async () => {
      // Arrange
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Act
      fireEvent.click(screen.getByTestId('set-light'))

      // Assert
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('adaptive-courses-theme', 'light')
        expect(screen.getByTestId('theme').textContent).toBe('light')
        expect(screen.getByTestId('resolved-theme').textContent).toBe('light')
      })
    })

    it('should persist dark theme to localStorage', async () => {
      // Arrange
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Act
      fireEvent.click(screen.getByTestId('set-dark'))

      // Assert
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('adaptive-courses-theme', 'dark')
        expect(screen.getByTestId('theme').textContent).toBe('dark')
        expect(screen.getByTestId('resolved-theme').textContent).toBe('dark')
      })
    })

    it('should persist system theme to localStorage', async () => {
      // Arrange
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Act
      fireEvent.click(screen.getByTestId('set-system'))

      // Assert
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('adaptive-courses-theme', 'system')
        expect(screen.getByTestId('theme').textContent).toBe('system')
      })
    })

    it('should add dark class to document when setting dark theme', async () => {
      // Arrange
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Act
      fireEvent.click(screen.getByTestId('set-dark'))

      // Assert
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })

    it('should remove dark class from document when setting light theme', async () => {
      // Arrange
      document.documentElement.classList.add('dark')
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Act
      fireEvent.click(screen.getByTestId('set-light'))

      // Assert
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false)
      })
    })
  })

  describe('toggleTheme Function', () => {
    it('should toggle from light to dark', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('light')
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Wait for mount
      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme').textContent).toBe('light')
      })

      // Act
      fireEvent.click(screen.getByTestId('toggle'))

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('theme').textContent).toBe('dark')
        expect(screen.getByTestId('resolved-theme').textContent).toBe('dark')
      })
    })

    it('should toggle from dark to light', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('dark')
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Wait for mount
      await waitFor(() => {
        expect(screen.getByTestId('resolved-theme').textContent).toBe('dark')
      })

      // Act
      fireEvent.click(screen.getByTestId('toggle'))

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('theme').textContent).toBe('light')
        expect(screen.getByTestId('resolved-theme').textContent).toBe('light')
      })
    })

    it('should skip system and toggle between light and dark based on resolved theme', async () => {
      // Arrange - System preference is light (from mock)
      localStorageMock.getItem.mockReturnValue('system')
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Wait for mount
      await waitFor(() => {
        expect(screen.getByTestId('theme').textContent).toBe('system')
        expect(screen.getByTestId('resolved-theme').textContent).toBe('light')
      })

      // Act - Toggle should go to dark (opposite of resolved 'light')
      fireEvent.click(screen.getByTestId('toggle'))

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('theme').textContent).toBe('dark')
      })
    })
  })

  describe('System Preference Detection', () => {
    it('should resolve to dark when system prefers dark', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('system')
      window.matchMedia = createMatchMedia(true) // System prefers dark

      // Act
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('theme').textContent).toBe('system')
        expect(screen.getByTestId('resolved-theme').textContent).toBe('dark')
      })
    })

    it('should resolve to light when system prefers light', async () => {
      // Arrange
      localStorageMock.getItem.mockReturnValue('system')
      window.matchMedia = createMatchMedia(false) // System prefers light

      // Act
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Assert
      await waitFor(() => {
        expect(screen.getByTestId('theme').textContent).toBe('system')
        expect(screen.getByTestId('resolved-theme').textContent).toBe('light')
      })
    })
  })

  describe('SSR Behavior (Mounted State)', () => {
    it('should render children with default values before mounting', () => {
      // The ThemeProvider provides a placeholder context during SSR
      // This tests that the component still renders children
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Component should render (children are visible)
      expect(screen.getByTestId('theme')).toBeInTheDocument()
      expect(screen.getByTestId('resolved-theme')).toBeInTheDocument()
    })

    it('should provide no-op functions before mounting', () => {
      // During SSR, setTheme and toggleTheme should be no-ops
      // This tests that the provider handles unmounted state gracefully
      const { container } = render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Component should be in the DOM
      expect(container).toBeTruthy()
    })
  })

  describe('useTheme Hook', () => {
    it('should throw error when used outside ThemeProvider', () => {
      // Arrange
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

      // Act & Assert
      expect(() => {
        render(<TestThemeConsumer />)
      }).toThrow('useTheme must be used within a ThemeProvider')

      consoleError.mockRestore()
    })
  })

  describe('themeScript', () => {
    it('should contain the storage key', () => {
      // Assert
      expect(themeScript).toContain('adaptive-courses-theme')
    })

    it('should contain logic to check localStorage', () => {
      // Assert
      expect(themeScript).toContain('localStorage.getItem')
    })

    it('should contain logic to check system theme', () => {
      // Assert
      expect(themeScript).toContain('prefers-color-scheme: dark')
    })

    it('should contain logic to add/remove dark class', () => {
      // Assert
      expect(themeScript).toContain("classList.add('dark')")
      expect(themeScript).toContain("classList.remove('dark')")
    })
  })

  describe('localStorage Error Handling', () => {
    it('should handle localStorage.getItem errors gracefully', async () => {
      // Arrange
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      // Act
      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Assert - Should render without crashing, using default
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toBeInTheDocument()
      })

      consoleWarn.mockRestore()
    })

    it('should handle localStorage.setItem errors gracefully', async () => {
      // Arrange
      const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      render(
        <ThemeProvider>
          <TestThemeConsumer />
        </ThemeProvider>
      )

      // Act - Should not throw
      fireEvent.click(screen.getByTestId('set-dark'))

      // Assert - Theme should still update in state
      await waitFor(() => {
        expect(screen.getByTestId('theme').textContent).toBe('dark')
      })

      consoleWarn.mockRestore()
    })
  })
})
