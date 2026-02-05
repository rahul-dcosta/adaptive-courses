import { test, expect } from '@playwright/test'

test.describe('Access Gate', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to reset access state
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('shows access gate on first visit', async ({ page }) => {
    await page.goto('/')
    // Check for access code input with placeholder "Access code"
    await expect(page.getByPlaceholder('Access code')).toBeVisible()
    // Check for the "Adaptive Courses" heading
    await expect(page.getByRole('heading', { name: 'Adaptive Courses' })).toBeVisible()
    // Check for "Enter access code to continue" text
    await expect(page.getByText('Enter access code to continue')).toBeVisible()
  })

  test('grants access with correct code', async ({ page }) => {
    await page.goto('/')
    // Fill in the correct access code
    await page.getByPlaceholder('Access code').fill('sixseven')
    // Click the Enter button
    await page.getByRole('button', { name: 'Enter' }).click()
    // Should see main landing page content after correct code
    // Check for hero text "Custom Courses in 60 Seconds"
    await expect(page.getByRole('heading', { name: /Custom Courses/i })).toBeVisible()
    // Check for the topic input placeholder
    await expect(page.getByPlaceholder(/game theory/i)).toBeVisible()
  })

  test('rejects incorrect access code', async ({ page }) => {
    await page.goto('/')
    // Fill in an incorrect access code
    await page.getByPlaceholder('Access code').fill('wrongcode')
    // Click the Enter button
    await page.getByRole('button', { name: 'Enter' }).click()
    // Should show error message
    await expect(page.getByText('Invalid access code')).toBeVisible()
    // Should still see access gate (input should be cleared but visible)
    await expect(page.getByPlaceholder('Access code')).toBeVisible()
  })

  test('access code is case insensitive', async ({ page }) => {
    await page.goto('/')
    // Fill in the access code with different case
    await page.getByPlaceholder('Access code').fill('SIXSEVEN')
    await page.getByRole('button', { name: 'Enter' }).click()
    // Should grant access
    await expect(page.getByRole('heading', { name: /Custom Courses/i })).toBeVisible()
  })

  test('preserves access state on page reload', async ({ page }) => {
    await page.goto('/')
    // Grant access
    await page.getByPlaceholder('Access code').fill('sixseven')
    await page.getByRole('button', { name: 'Enter' }).click()
    // Wait for landing page to load
    await expect(page.getByRole('heading', { name: /Custom Courses/i })).toBeVisible()
    // Reload the page
    await page.reload()
    // Should still have access (not show gate)
    await expect(page.getByRole('heading', { name: /Custom Courses/i })).toBeVisible()
    await expect(page.getByPlaceholder('Access code')).not.toBeVisible()
  })

  test('shows beta access only label', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Beta access only')).toBeVisible()
  })
})
