import { expect, test } from '@playwright/test'

test('follows the system theme and persists a manual choice', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.route('**/api/views', async (route) => {
    await route.fulfill({
      body: JSON.stringify(42),
      contentType: 'application/json',
    })
  })

  await page.goto('/')

  const root = page.locator('html')
  const themeToggle = page.getByRole('button', { name: 'Dark mode' })

  await expect(root).toHaveClass(/dark/)
  await expect(themeToggle).toBeEnabled()
  await expect(themeToggle).toHaveAttribute('aria-pressed', 'true')

  await themeToggle.press('Space')
  await expect(root).not.toHaveClass(/dark/)
  await expect(themeToggle).toHaveAttribute('aria-pressed', 'false')
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('theme')))
    .toBe('light')

  await page.reload()
  await expect(root).not.toHaveClass(/dark/)
  await expect(themeToggle).toHaveAttribute('aria-pressed', 'false')

  await themeToggle.press('Enter')
  await expect(root).toHaveClass(/dark/)
  await expect(themeToggle).toHaveAttribute('aria-pressed', 'true')
})

test('rewrites text with selected preferences, supports copy, and handles errors', async ({
  context,
  page,
}) => {
  let rewriteRequestCount = 0
  let rewriteRequest: Record<string, unknown> | undefined
  const viewRequestMethods: string[] = []

  await context.grantPermissions(['clipboard-read', 'clipboard-write'])

  await page.route('**/api/views', async (route) => {
    viewRequestMethods.push(route.request().method())
    await route.fulfill({
      body: JSON.stringify(42),
      contentType: 'application/json',
    })
  })

  await page.route('**/api/rewriter', async (route) => {
    rewriteRequestCount += 1
    rewriteRequest = route.request().postDataJSON() as Record<string, unknown>

    if (rewriteRequestCount === 1) {
      await route.fulfill({
        body: 'Clear, confident writing makes your message easier to understand.',
        contentType: 'text/plain',
      })
      return
    }

    await route.fulfill({ status: 500 })
  })

  await page.goto('/')

  await page.locator('#text-input').fill('Make this sentence more confident.')
  await page.getByRole('button', { name: 'Professional' }).click()
  await page.locator('#role').click()
  await page.getByRole('option', { name: 'Custom' }).click()
  await page.getByLabel('Custom role').fill('Editor')
  await page.locator('#language').click()
  await page.getByRole('option', { name: /Portuguese/ }).click()
  await page.locator('#text-input').press('Control+Enter')

  await expect(
    page.getByText(
      'Clear, confident writing makes your message easier to understand.',
    ),
  ).toBeVisible()
  expect(rewriteRequest).toMatchObject({
    customRole: 'Editor',
    language: 'Portuguese',
    prompt: 'Make this sentence more confident.',
    role: 'Custom',
    tones: ['Professional'],
  })

  await page
    .getByRole('button', {
      name: 'Clear, confident writing makes your message easier to understand.',
    })
    .click()
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('Clear, confident writing makes your message easier to understand.')
  await expect(page.getByText('Copied to clipboard.')).toBeVisible()

  await page.locator('#text-input').fill('Trigger an error.')
  await page.getByRole('button', { name: 'Rewrite →' }).click()
  await expect(
    page.getByText('Unable to rewrite your text. Please try again.'),
  ).toBeVisible()
  expect(rewriteRequestCount).toBe(2)
  expect(viewRequestMethods).not.toContain('POST')
})
