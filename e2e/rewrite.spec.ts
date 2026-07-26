import { expect, test } from '@playwright/test'

test('follows the system theme and persists a manual choice', async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.route('**/api/rewrite-count', async (route) => {
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
  const rewrittenText =
    'Clear, confident writing makes your message easier to understand.\n\nKeep the original structure.'
  let rewriteRequestCount = 0
  let rewriteRequest: Record<string, unknown> | undefined
  const countRequestMethods: string[] = []

  await context.grantPermissions(['clipboard-read', 'clipboard-write'])

  await page.route('**/api/rewrite-count', async (route) => {
    countRequestMethods.push(route.request().method())
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
        body: rewrittenText,
        contentType: 'text/plain',
      })
      return
    }

    await route.fulfill({ status: 500 })
  })

  await page.goto('/')

  const textInput = page.locator('#text-input')
  await expect(textInput).toHaveAttribute('maxlength', '10000')
  await page.getByRole('button', { name: 'Rewrite →' }).click()
  await expect(textInput).toBeFocused()
  await expect(page.getByText('Enter some text to rewrite.')).toBeVisible()
  expect(rewriteRequestCount).toBe(0)

  await page.locator('#text-input').fill('Make this sentence more confident.')
  await page.getByRole('button', { name: 'Professional' }).click()
  await page.locator('#role').click()
  await page.getByRole('option', { name: 'Custom' }).click()
  await page.getByLabel('Custom role').fill('Editor')
  await page.locator('#language').click()
  await page.getByRole('option', { name: /Portuguese/ }).click()
  await page.locator('#text-input').press('Control+Enter')

  const output = page.getByTestId('rewrite-output')
  await expect(output).toHaveText(rewrittenText)
  await expect(output).toHaveCSS('white-space', 'pre-wrap')
  await expect(page.locator('form [role="status"]')).toHaveText(
    'Rewrite complete.',
  )
  await expect(page.locator('#rewritten-text-heading')).toBeFocused()
  await expect(page.getByText('43 phrases improved so far')).toBeVisible()
  await expect(page.getByRole('button', { name: rewrittenText })).toHaveCount(0)
  expect(rewriteRequest).toMatchObject({
    customRole: 'Editor',
    language: 'Portuguese',
    prompt: 'Make this sentence more confident.',
    role: 'Custom',
    tones: ['Professional'],
  })

  await page.getByRole('button', { name: 'Copy rewritten text' }).click()
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(rewrittenText)
  await expect(page.getByText('Copied to clipboard.')).toBeVisible()

  await page.locator('#text-input').fill('Trigger an error.')
  await page.getByRole('button', { name: 'Rewrite →' }).click()
  await expect(
    page.getByText('Unable to rewrite your text. Please try again.'),
  ).toBeVisible()
  expect(rewriteRequestCount).toBe(2)
  expect(countRequestMethods).toEqual(['GET'])
})

test('allows an in-progress rewrite to be stopped without an error', async ({
  page,
}) => {
  let releaseRewrite: (() => void) | undefined

  await page.route('**/api/rewrite-count', async (route) => {
    await route.fulfill({
      body: JSON.stringify(42),
      contentType: 'application/json',
    })
  })
  await page.route('**/api/rewriter', async (route) => {
    await new Promise<void>((resolve) => {
      releaseRewrite = resolve
    })

    try {
      await route.fulfill({
        body: 'A rewrite that arrived too late.',
        contentType: 'text/plain',
      })
    } catch {
      // The browser correctly canceled the intercepted request.
    }
  })

  await page.goto('/')
  await page.locator('#text-input').fill('Rewrite this slowly.')
  await page.getByRole('button', { name: 'Rewrite →' }).click()

  await expect(page.getByRole('button', { name: 'Rewriting…' })).toBeDisabled()
  await page.getByRole('button', { name: 'Stop rewriting' }).click()

  await expect(page.locator('form [role="status"]')).toHaveText(
    'Rewrite stopped.',
  )
  await expect(page.getByRole('button', { name: 'Rewrite →' })).toBeEnabled()
  await expect(
    page.getByText('Unable to rewrite your text. Please try again.'),
  ).toHaveCount(0)

  releaseRewrite?.()
})
