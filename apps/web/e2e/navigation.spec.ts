import { test, expect } from './fixtures'

test.describe('Navigation', () => {
  test('home page loads with main content', async ({ page }) => {
    // Fixture already bypasses access gate and loads the page
    // Check hero section is visible
    await expect(page.getByRole('heading', { name: /Custom Courses/i })).toBeVisible()
    // Check for the "60 Seconds" text in the hero (use first match)
    await expect(page.getByText(/60 Seconds/i).first()).toBeVisible()
    // Check for the description text
    await expect(page.getByText(/Tell us what you need to learn/i)).toBeVisible()
  })

  test('displays "Your first course is free" badge', async ({ page }) => {
    await expect(page.getByText('Your first course is free')).toBeVisible()
  })

  test('displays topic input form', async ({ page }) => {
    // Check for the topic input (use first if multiple exist)
    await expect(page.getByPlaceholder(/game theory|what do you want to learn/i).first()).toBeVisible()
    // Check for the submit button
    await expect(page.getByRole('button', { name: /Create My Course/i }).first()).toBeVisible()
  })

  test('displays trust signals below input', async ({ page }) => {
    await expect(page.getByText(/No credit card/i).first()).toBeVisible()
    await expect(page.getByText(/under a minute|60 seconds/i).first()).toBeVisible()
  })

  test('displays social proof bar', async ({ page }) => {
    await expect(page.getByText(/course topics available/i)).toBeVisible()
    // Use first match for elements that appear multiple times
    await expect(page.getByText(/60 seconds/i).first()).toBeVisible()
    await expect(page.getByText(/Powered by/i).first()).toBeVisible()
    await expect(page.getByText(/Claude/i).first()).toBeVisible()
  })

  test('displays how it works section', async ({ page }) => {
    await expect(page.getByText('How it works')).toBeVisible()
    await expect(page.getByText('Tell us why you\'re learning')).toBeVisible()
    await expect(page.getByText('AI builds your course')).toBeVisible()
    await expect(page.getByText('Start learning immediately')).toBeVisible()
  })

  test('displays testimonials section', async ({ page }) => {
    await expect(page.getByText('What learners say')).toBeVisible()
    // Check for testimonial author (use first match for duplicates)
    await expect(page.getByText('Emily T.').first()).toBeVisible()
    await expect(page.getByText('Marcus R.').first()).toBeVisible()
  })

  test('footer contains navigation links', async ({ page }) => {
    // Scroll to footer area
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    // Check footer links
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Pricing' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'FAQ' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Privacy' })).toBeVisible()
  })

  test('footer link to About page works', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL(/\/about/)
  })

  test('footer link to Pricing page works', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.getByRole('link', { name: 'Pricing' }).click()
    await expect(page).toHaveURL(/\/pricing/)
  })

  test('footer link to FAQ page works', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.getByRole('link', { name: 'FAQ' }).click()
    await expect(page).toHaveURL(/\/faq/)
  })

  test('displays copyright in footer', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const currentYear = new Date().getFullYear()
    await expect(page.getByText(new RegExp(`${currentYear} Adaptive Courses`))).toBeVisible()
  })

  test('CTA button is disabled when topic input is empty', async ({ page }) => {
    const ctaButton = page.getByRole('button', { name: /Create My Course/i }).first()
    await expect(ctaButton).toBeDisabled()
  })

  test('CTA button is enabled when topic input has text', async ({ page }) => {
    const topicInput = page.getByPlaceholder(/game theory for my job interview/i)
    await topicInput.fill('Machine Learning Basics')
    const ctaButton = page.getByRole('button', { name: /Create My Course/i }).first()
    await expect(ctaButton).toBeEnabled()
  })
})
