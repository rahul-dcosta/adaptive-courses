import { test, expect } from './fixtures'

test.describe('Onboarding Flow', () => {
  test.describe('Topic Entry', () => {
    test('can enter a topic and start course creation', async ({ page }) => {
      // Enter a topic in the landing page input
      const topicInput = page.getByPlaceholder(/game theory for my job interview/i)
      await topicInput.fill('Introduction to Machine Learning')

      // Click create course button
      await page.getByRole('button', { name: /Create My Course/i }).first().click()

      // Should navigate to builder mode (URL changes to include mode=build)
      await expect(page).toHaveURL(/mode=build/)
      await expect(page).toHaveURL(/topic=/)
    })
  })

  test.describe('Onboarding Questions', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the builder by entering a topic
      const topicInput = page.getByPlaceholder(/game theory for my job interview/i)
      await topicInput.fill('Machine Learning Basics')
      await page.getByRole('button', { name: /Create My Course/i }).first().click()
      // Wait for the builder to load
      await page.waitForURL(/mode=build/)
    })

    test('displays learning style question', async ({ page }) => {
      // The onboarding should show the learning style question
      await expect(page.getByText(/How do you learn best/i)).toBeVisible({ timeout: 10000 })
    })

    test('shows all learning style options', async ({ page }) => {
      await expect(page.getByText(/How do you learn best/i)).toBeVisible({ timeout: 10000 })
      // Check for learning style options
      await expect(page.getByText('Visual Learner')).toBeVisible()
      await expect(page.getByText('Reading/Writing')).toBeVisible()
      await expect(page.getByText('Listening')).toBeVisible()
      await expect(page.getByText('Hands-on')).toBeVisible()
      await expect(page.getByText('Mix of Everything')).toBeVisible()
    })

    test('can select a learning style and progress to next question', async ({ page }) => {
      await expect(page.getByText(/How do you learn best/i)).toBeVisible({ timeout: 10000 })

      // Click on "Visual Learner" option
      await page.getByText('Visual Learner').click()

      // Should advance to the next question (prior knowledge)
      await expect(page.getByText(/What's your current level/i)).toBeVisible({ timeout: 5000 })
    })

    test('shows prior knowledge question with all options', async ({ page }) => {
      // Progress through learning style
      await expect(page.getByText(/How do you learn best/i)).toBeVisible({ timeout: 10000 })
      await page.getByText('Visual Learner').click()

      // Check prior knowledge question
      await expect(page.getByText(/What's your current level/i)).toBeVisible({ timeout: 5000 })
      await expect(page.getByText('Complete Beginner')).toBeVisible()
      // Use exact match to avoid matching "Complete Beginner"
      await expect(page.getByText('Beginner', { exact: true }).first()).toBeVisible()
      await expect(page.getByText('Some Exposure')).toBeVisible()
      await expect(page.getByText('Intermediate')).toBeVisible()
      await expect(page.getByText('Advanced')).toBeVisible()
    })

    test('shows learning goal question', async ({ page }) => {
      // Progress through first two questions
      await expect(page.getByText(/How do you learn best/i)).toBeVisible({ timeout: 10000 })
      await page.getByText('Visual Learner').click()

      await expect(page.getByText(/What's your current level/i)).toBeVisible({ timeout: 5000 })
      await page.getByText('Complete Beginner').click()

      // Check learning goal question
      await expect(page.getByText(/Why are you learning this/i)).toBeVisible({ timeout: 5000 })
      await expect(page.getByText('Job Interview')).toBeVisible()
      await expect(page.getByText('Career Growth')).toBeVisible()
      await expect(page.getByText('Personal Interest')).toBeVisible()
    })

    test('shows time commitment question', async ({ page }) => {
      // Progress through first three questions
      await expect(page.getByText(/How do you learn best/i)).toBeVisible({ timeout: 10000 })
      await page.getByText('Visual Learner').click()

      await expect(page.getByText(/What's your current level/i)).toBeVisible({ timeout: 5000 })
      await page.getByText('Complete Beginner').click()

      await expect(page.getByText(/Why are you learning this/i)).toBeVisible({ timeout: 5000 })
      await page.getByText('Personal Interest').click()

      // Check time commitment question
      await expect(page.getByText(/How much time do you have/i)).toBeVisible({ timeout: 5000 })
      await expect(page.getByText('30 Minutes')).toBeVisible()
      await expect(page.getByText('1 Hour')).toBeVisible()
      await expect(page.getByText('No Rush')).toBeVisible()
    })

    test('displays progress indicator', async ({ page }) => {
      await expect(page.getByText(/How do you learn best/i)).toBeVisible({ timeout: 10000 })
      // Check for progress indicator text (Step X of Y)
      await expect(page.getByText(/Step \d+ of \d+/)).toBeVisible()
      // Check for percentage complete
      await expect(page.getByText(/\d+% Complete/)).toBeVisible()
    })

    test('progress increases as user answers questions', async ({ page }) => {
      await expect(page.getByText(/How do you learn best/i)).toBeVisible({ timeout: 10000 })

      // Get initial progress
      const initialProgress = await page.getByText(/\d+% Complete/).textContent()

      // Answer first question
      await page.getByText('Visual Learner').click()
      await expect(page.getByText(/What's your current level/i)).toBeVisible({ timeout: 5000 })

      // Get new progress
      const newProgress = await page.getByText(/\d+% Complete/).textContent()

      // Progress should have increased
      const initialPercent = parseInt(initialProgress?.match(/(\d+)/)?.[1] || '0')
      const newPercent = parseInt(newProgress?.match(/(\d+)/)?.[1] || '0')
      expect(newPercent).toBeGreaterThan(initialPercent)
    })

    test('displays topic context in the header', async ({ page }) => {
      await expect(page.getByText(/How do you learn best/i)).toBeVisible({ timeout: 10000 })
      // Should show the topic being built
      await expect(page.getByText(/Building your course on/i)).toBeVisible()
      await expect(page.getByText(/Machine Learning Basics/i)).toBeVisible()
    })
  })

  test.describe('Example Courses', () => {
    test('displays example course suggestions', async ({ page }) => {
      // Look for the example courses section on the landing page
      // The ExampleCourses component should show suggested topics
      await expect(page.getByText(/Example|Popular|Try/i)).toBeVisible({ timeout: 5000 })
    })
  })
})
