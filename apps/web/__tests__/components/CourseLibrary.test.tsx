import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CourseCard, type CourseData, type CourseStatus } from '@/components/CourseCard'
import { DangerousDeleteModal } from '@/components/DangerousDeleteModal'

// =============================================================================
// CourseCard Tests
// =============================================================================

describe('CourseCard Component', () => {
  const mockOnView = vi.fn()
  const mockOnDownload = vi.fn()
  const mockOnDelete = vi.fn()

  const mockCourse: CourseData = {
    id: 'course-123',
    title: 'Introduction to Machine Learning',
    subtitle: 'A comprehensive guide to ML basics',
    createdAt: '2024-03-15T10:30:00Z',
    status: 'in_progress' as CourseStatus,
    moduleCount: 8,
    progress: 45,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Board View Mode', () => {
    it('should render course title in board view', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('Introduction to Machine Learning')).toBeInTheDocument()
    })

    it('should render course subtitle in board view', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('A comprehensive guide to ML basics')).toBeInTheDocument()
    })

    it('should render module count in board view', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('8 modules')).toBeInTheDocument()
    })

    it('should render progress percentage in board view', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('45%')).toBeInTheDocument()
    })

    it('should render formatted creation date in board view', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText(/Created Mar 15, 2024/)).toBeInTheDocument()
    })

    it('should render status badge in board view', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('In Progress')).toBeInTheDocument()
    })

    it('should show "Continue" button when progress is not 100%', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText(/Continue/)).toBeInTheDocument()
    })

    it('should show "Review" button when progress is 100%', () => {
      // Arrange
      const completedCourse = { ...mockCourse, progress: 100, status: 'completed' as CourseStatus }

      // Act
      render(
        <CourseCard
          course={completedCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText(/Review/)).toBeInTheDocument()
    })

    it('should call onView when card is clicked in board view', () => {
      // Arrange
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Act - Click on the card
      const card = screen.getByText('Introduction to Machine Learning').closest('div')?.parentElement?.parentElement
      if (card) {
        fireEvent.click(card)
      }

      // Assert
      expect(mockOnView).toHaveBeenCalledWith('course-123')
    })

    it('should show generating state in board view', () => {
      // Arrange
      const generatingCourse = { ...mockCourse, status: 'generating' as CourseStatus }

      // Act
      render(
        <CourseCard
          course={generatingCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('Generating your course...')).toBeInTheDocument()
      expect(screen.getByText('This usually takes 30-60 seconds')).toBeInTheDocument()
    })
  })

  describe('List View Mode', () => {
    it('should render course title in list view', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="list"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('Introduction to Machine Learning')).toBeInTheDocument()
    })

    it('should render course subtitle in list view', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="list"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('A comprehensive guide to ML basics')).toBeInTheDocument()
    })

    it('should render module count in list view', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="list"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('8 modules')).toBeInTheDocument()
    })

    it('should render progress percentage in list view', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="list"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('45%')).toBeInTheDocument()
    })

    it('should render formatted creation date in list view', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={mockCourse}
          viewMode="list"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('Mar 15, 2024')).toBeInTheDocument()
    })

    it('should show generating state in list view', () => {
      // Arrange
      const generatingCourse = { ...mockCourse, status: 'generating' as CourseStatus }

      // Act
      render(
        <CourseCard
          course={generatingCourse}
          viewMode="list"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('...')).toBeInTheDocument()
      expect(screen.getByText('-')).toBeInTheDocument() // Module count shows '-'
    })

    it('should not call onView when clicking generating course in list view', () => {
      // Arrange
      const generatingCourse = { ...mockCourse, status: 'generating' as CourseStatus }
      render(
        <CourseCard
          course={generatingCourse}
          viewMode="list"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Act
      const row = screen.getByText('Introduction to Machine Learning').closest('div')?.parentElement
      if (row) {
        fireEvent.click(row)
      }

      // Assert
      expect(mockOnView).not.toHaveBeenCalled()
    })
  })

  describe('Status Badge Rendering', () => {
    it('should render "In Progress" badge for in_progress status', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={{ ...mockCourse, status: 'in_progress' }}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('In Progress')).toBeInTheDocument()
    })

    it('should render "Completed" badge for completed status', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={{ ...mockCourse, status: 'completed', progress: 100 }}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('Completed')).toBeInTheDocument()
    })

    it('should render "Completed" badge when progress is 100% regardless of status', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={{ ...mockCourse, status: 'in_progress', progress: 100 }}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('Completed')).toBeInTheDocument()
    })

    it('should render "Archived" badge for archived status', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={{ ...mockCourse, status: 'archived' }}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('Archived')).toBeInTheDocument()
    })

    it('should render "Generating" badge with spinner for generating status', () => {
      // Arrange & Act
      render(
        <CourseCard
          course={{ ...mockCourse, status: 'generating' }}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('Generating your course...')).toBeInTheDocument()
    })
  })

  describe('Actions Dropdown', () => {
    it('should open dropdown when actions button is clicked', () => {
      // Arrange
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Act
      const actionsButton = screen.getByRole('button', { name: /more actions/i })
      fireEvent.click(actionsButton)

      // Assert
      expect(screen.getByText('View Course')).toBeInTheDocument()
      expect(screen.getByText('Download PDF')).toBeInTheDocument()
      expect(screen.getByText('Delete Course')).toBeInTheDocument()
    })

    it('should call onView when "View Course" is clicked', () => {
      // Arrange
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Act
      const actionsButton = screen.getByRole('button', { name: /more actions/i })
      fireEvent.click(actionsButton)
      fireEvent.click(screen.getByText('View Course'))

      // Assert
      expect(mockOnView).toHaveBeenCalledWith('course-123')
    })

    it('should call onDownload when "Download PDF" is clicked', () => {
      // Arrange
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Act
      const actionsButton = screen.getByRole('button', { name: /more actions/i })
      fireEvent.click(actionsButton)
      fireEvent.click(screen.getByText('Download PDF'))

      // Assert
      expect(mockOnDownload).toHaveBeenCalledWith('course-123')
    })

    it('should call onDelete with id and title when "Delete Course" is clicked', () => {
      // Arrange
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Act
      const actionsButton = screen.getByRole('button', { name: /more actions/i })
      fireEvent.click(actionsButton)
      fireEvent.click(screen.getByText('Delete Course'))

      // Assert
      expect(mockOnDelete).toHaveBeenCalledWith('course-123', 'Introduction to Machine Learning')
    })

    it('should close dropdown after action is selected', () => {
      // Arrange
      render(
        <CourseCard
          course={mockCourse}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Act
      const actionsButton = screen.getByRole('button', { name: /more actions/i })
      fireEvent.click(actionsButton)
      fireEvent.click(screen.getByText('View Course'))

      // Assert
      expect(screen.queryByText('Download PDF')).not.toBeInTheDocument()
    })
  })

  describe('Course Without Subtitle', () => {
    it('should render correctly without subtitle in board view', () => {
      // Arrange
      const courseWithoutSubtitle = { ...mockCourse, subtitle: undefined }

      // Act
      render(
        <CourseCard
          course={courseWithoutSubtitle}
          viewMode="board"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('Introduction to Machine Learning')).toBeInTheDocument()
      expect(screen.queryByText('A comprehensive guide to ML basics')).not.toBeInTheDocument()
    })

    it('should render correctly without subtitle in list view', () => {
      // Arrange
      const courseWithoutSubtitle = { ...mockCourse, subtitle: undefined }

      // Act
      render(
        <CourseCard
          course={courseWithoutSubtitle}
          viewMode="list"
          onView={mockOnView}
          onDownload={mockOnDownload}
          onDelete={mockOnDelete}
        />
      )

      // Assert
      expect(screen.getByText('Introduction to Machine Learning')).toBeInTheDocument()
      expect(screen.queryByText('A comprehensive guide to ML basics')).not.toBeInTheDocument()
    })
  })
})

// =============================================================================
// DangerousDeleteModal Tests
// =============================================================================

describe('DangerousDeleteModal Component', () => {
  const mockOnConfirm = vi.fn()
  const mockOnCancel = vi.fn()

  const defaultProps = {
    isOpen: true,
    courseTitle: 'Introduction to Machine Learning',
    courseId: 'course-123',
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Modal Open/Close Behavior', () => {
    it('should render modal when isOpen is true', () => {
      // Arrange & Act
      render(<DangerousDeleteModal {...defaultProps} />)

      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument()
      expect(screen.getByText('Delete this course?')).toBeInTheDocument()
    })

    it('should not render modal when isOpen is false', () => {
      // Arrange & Act
      render(<DangerousDeleteModal {...defaultProps} isOpen={false} />)

      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should call onCancel when Cancel button is clicked', () => {
      // Arrange
      render(<DangerousDeleteModal {...defaultProps} />)

      // Act
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }))

      // Assert
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })

    it('should call onCancel when clicking outside modal', () => {
      // Arrange
      render(<DangerousDeleteModal {...defaultProps} />)

      // Act - Click on the backdrop (outside the modal)
      const backdrop = screen.getByRole('dialog').parentElement
      if (backdrop) {
        fireEvent.click(backdrop)
      }

      // Assert
      expect(mockOnCancel).toHaveBeenCalled()
    })

    it('should call onCancel when Escape key is pressed', () => {
      // Arrange
      render(<DangerousDeleteModal {...defaultProps} />)

      // Act
      fireEvent.keyDown(document, { key: 'Escape' })

      // Assert
      expect(mockOnCancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('Confirmation Text Validation', () => {
    it('should have delete button disabled initially', () => {
      // Arrange & Act
      render(<DangerousDeleteModal {...defaultProps} />)

      // Assert
      const deleteButton = screen.getByRole('button', { name: /delete course/i })
      expect(deleteButton).toBeDisabled()
    })

    it('should keep delete button disabled with partial match', () => {
      // Arrange
      render(<DangerousDeleteModal {...defaultProps} />)

      // Act
      const input = screen.getByPlaceholderText(/type the course title/i)
      fireEvent.change(input, { target: { value: 'Introduction to' } })

      // Assert
      const deleteButton = screen.getByRole('button', { name: /delete course/i })
      expect(deleteButton).toBeDisabled()
    })

    it('should keep delete button disabled with wrong text', () => {
      // Arrange
      render(<DangerousDeleteModal {...defaultProps} />)

      // Act
      const input = screen.getByPlaceholderText(/type the course title/i)
      fireEvent.change(input, { target: { value: 'Wrong Title' } })

      // Assert
      const deleteButton = screen.getByRole('button', { name: /delete course/i })
      expect(deleteButton).toBeDisabled()
    })

    it('should enable delete button when confirmation text matches exactly', () => {
      // Arrange
      render(<DangerousDeleteModal {...defaultProps} />)

      // Act
      const input = screen.getByPlaceholderText(/type the course title/i)
      fireEvent.change(input, { target: { value: 'Introduction to Machine Learning' } })

      // Assert
      const deleteButton = screen.getByRole('button', { name: /delete course/i })
      expect(deleteButton).not.toBeDisabled()
    })

    it('should display the course title in the confirmation label', () => {
      // Arrange & Act
      render(<DangerousDeleteModal {...defaultProps} />)

      // Assert
      expect(screen.getByText('Introduction to Machine Learning')).toBeInTheDocument()
    })
  })

  describe('Delete Action', () => {
    it('should call onConfirm with courseId when delete is confirmed', async () => {
      // Arrange
      mockOnConfirm.mockResolvedValue(undefined)
      render(<DangerousDeleteModal {...defaultProps} />)

      // Act
      const input = screen.getByPlaceholderText(/type the course title/i)
      fireEvent.change(input, { target: { value: 'Introduction to Machine Learning' } })
      const deleteButton = screen.getByRole('button', { name: /delete course/i })
      fireEvent.click(deleteButton)

      // Assert
      expect(mockOnConfirm).toHaveBeenCalledWith('course-123')
    })

    it('should show loading state while deleting', async () => {
      // Arrange
      let resolveDelete: () => void
      const deletePromise = new Promise<void>((resolve) => {
        resolveDelete = resolve
      })
      mockOnConfirm.mockReturnValue(deletePromise)

      render(<DangerousDeleteModal {...defaultProps} />)

      // Act
      const input = screen.getByPlaceholderText(/type the course title/i)
      fireEvent.change(input, { target: { value: 'Introduction to Machine Learning' } })
      const deleteButton = screen.getByRole('button', { name: /delete course/i })
      fireEvent.click(deleteButton)

      // Assert - Should show "Deleting..." text
      await waitFor(() => {
        expect(screen.getByText('Deleting...')).toBeInTheDocument()
      })

      // Cleanup
      resolveDelete!()
    })

    it('should disable inputs and buttons while deleting', async () => {
      // Arrange
      let resolveDelete: () => void
      const deletePromise = new Promise<void>((resolve) => {
        resolveDelete = resolve
      })
      mockOnConfirm.mockReturnValue(deletePromise)

      render(<DangerousDeleteModal {...defaultProps} />)

      // Act
      const input = screen.getByPlaceholderText(/type the course title/i)
      fireEvent.change(input, { target: { value: 'Introduction to Machine Learning' } })
      const deleteButton = screen.getByRole('button', { name: /delete course/i })
      fireEvent.click(deleteButton)

      // Assert
      await waitFor(() => {
        expect(input).toBeDisabled()
        expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled()
      })

      // Cleanup
      resolveDelete!()
    })

    it('should show error message when delete fails', async () => {
      // Arrange
      mockOnConfirm.mockRejectedValue(new Error('Network error'))
      render(<DangerousDeleteModal {...defaultProps} />)

      // Act
      const input = screen.getByPlaceholderText(/type the course title/i)
      fireEvent.change(input, { target: { value: 'Introduction to Machine Learning' } })
      const deleteButton = screen.getByRole('button', { name: /delete course/i })
      fireEvent.click(deleteButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    it('should show generic error message for non-Error exceptions', async () => {
      // Arrange
      mockOnConfirm.mockRejectedValue('String error')
      render(<DangerousDeleteModal {...defaultProps} />)

      // Act
      const input = screen.getByPlaceholderText(/type the course title/i)
      fireEvent.change(input, { target: { value: 'Introduction to Machine Learning' } })
      const deleteButton = screen.getByRole('button', { name: /delete course/i })
      fireEvent.click(deleteButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('Failed to delete course')).toBeInTheDocument()
      })
    })
  })

  describe('Modal Content', () => {
    it('should display warning text about permanent deletion', () => {
      // Arrange & Act
      render(<DangerousDeleteModal {...defaultProps} />)

      // Assert
      expect(screen.getByText(/cannot be undone/i)).toBeInTheDocument()
    })

    it('should display list of items that will be deleted', () => {
      // Arrange & Act
      render(<DangerousDeleteModal {...defaultProps} />)

      // Assert
      expect(screen.getByText(/All course content and modules/i)).toBeInTheDocument()
      expect(screen.getByText(/Your learning progress/i)).toBeInTheDocument()
      expect(screen.getByText(/Quiz results and achievements/i)).toBeInTheDocument()
    })
  })

  describe('State Reset on Reopen', () => {
    it('should reset confirmation text when modal reopens', () => {
      // Arrange
      const { rerender } = render(<DangerousDeleteModal {...defaultProps} />)

      // Act - Type some text
      const input = screen.getByPlaceholderText(/type the course title/i)
      fireEvent.change(input, { target: { value: 'Some text' } })

      // Close modal
      rerender(<DangerousDeleteModal {...defaultProps} isOpen={false} />)

      // Reopen modal
      rerender(<DangerousDeleteModal {...defaultProps} isOpen={true} />)

      // Assert - Input should be empty
      const newInput = screen.getByPlaceholderText(/type the course title/i)
      expect(newInput).toHaveValue('')
    })
  })
})
