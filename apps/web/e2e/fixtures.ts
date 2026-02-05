import { test as base } from '@playwright/test'

/**
 * Custom test fixture that bypasses the access gate by setting localStorage
 * before each test. Use this for tests that don't need to test the access gate itself.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    // Navigate to the page first to establish the origin
    await page.goto('/')
    // Set localStorage to bypass the access gate
    await page.evaluate(() => {
      localStorage.setItem('ac_access_granted', 'true')
    })
    // Reload to apply the localStorage change
    await page.reload()
    await use(page)
  },
})

export { expect } from '@playwright/test'
