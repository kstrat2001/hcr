import { test as base, expect, type Page } from '@playwright/test'

/**
 * Opens each HCR page in its own browser window (Playwright gives every
 * test a fresh context) and checks what a visitor would see.
 *
 * With PREVIEW set (`npm run preview`) the run is headed and each window
 * stays open until you close it. Without it (`npm run test:e2e`) the run is
 * headless and anything outside localhost is stubbed, so the checks pass
 * offline and never depend on darklyenergized.com being up.
 */
const PREVIEW = !!process.env.PREVIEW

const DE_START =
  'https://darklyenergized.com/projects/new?utm_source=hcr&utm_medium=referral&utm_campaign='

// 1x1 transparent PNG, standing in for remote images when headless.
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
)

const test = base.extend<{ problems: string[] }>({
  problems: async ({ page, baseURL }, use) => {
    const problems: string[] = []
    const onHcr = () => page.url().startsWith(baseURL!)

    if (!PREVIEW) {
      // Offline-safe: answer every non-local request ourselves.
      await page.route(
        (url) => url.hostname !== 'localhost' && url.hostname !== '127.0.0.1',
        (route) => {
          const type = route.request().resourceType()
          if (type === 'image') return route.fulfill({ contentType: 'image/png', body: PIXEL })
          if (type === 'stylesheet') return route.fulfill({ contentType: 'text/css', body: '' })
          if (type === 'font') return route.fulfill({ status: 204, body: '' })
          return route.fulfill({
            contentType: 'text/html',
            body: '<!doctype html><title>Darkly Energized (stub)</title><h1>Darkly Energized</h1>',
          })
        }
      )
    }

    // Only HCR's own pages are held to "no errors"; a redirect target is not ours.
    page.on('console', (msg) => {
      if (msg.type() === 'error' && onHcr()) problems.push(`console: ${msg.text()}`)
    })
    page.on('pageerror', (err) => {
      if (onHcr()) problems.push(`uncaught: ${err.message}`)
    })

    await use(problems)

    expect(problems, 'browser console errors / uncaught page errors').toEqual([])
  },
})

async function holdOpen(page: Page) {
  if (PREVIEW) await page.waitForEvent('close', { timeout: 0 })
}

async function checkFooter(page: Page) {
  const footer = page.locator('footer')
  await expect(footer.getByText('A Darkly Energized LLC product')).toBeVisible()
  await expect(
    footer.getByText(/© \d{4} Darkly Energized LLC\. All rights reserved\./)
  ).toBeVisible()
  await expect(footer.getByRole('img', { name: 'Darkly Energized' })).toBeVisible()
  for (const [name, href] of [
    ['[Terms]', 'https://darklyenergized.com/terms'],
    ['[Privacy]', 'https://darklyenergized.com/privacy'],
    ['[Disclaimer]', 'https://darklyenergized.com/disclaimer'],
  ]) {
    await expect(footer.getByRole('link', { name, exact: true })).toHaveAttribute('href', href)
  }
  await expect(footer.getByRole('link', { name: '[Start_Project]' })).toHaveAttribute(
    'href',
    `${DE_START}footer`
  )
}

test('home', async ({ page, problems }) => {
  const res = await page.goto('/')
  expect(res?.status()).toBe(200)
  await expect(page.getByRole('heading', { name: 'The_AI_Trap' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Ready_to_Launch?' })).toBeVisible()
  await expect(page.getByRole('link', { name: '[Get_Reviewed]' })).toHaveAttribute(
    'href',
    `${DE_START}home_cta&utm_content=hero`
  )
  await expect(page.locator('form, input, textarea')).toHaveCount(0)
  await checkFooter(page)
  expect(problems).toEqual([])
  await holdOpen(page)
})

test('pricing', async ({ page, problems }) => {
  const res = await page.goto('/pricing')
  expect(res?.status()).toBe(200)
  await expect(page.getByRole('heading', { level: 1, name: '> Human_Models' })).toBeVisible()
  await expect(page.getByRole('link', { name: '[Start_a_Project]' })).toHaveAttribute(
    'href',
    `${DE_START}pricing`
  )
  for (const tier of ['vibe_check', 'deep_audit', 'fractional_cto']) {
    await expect(
      page.locator(`a[href="${DE_START}pricing&utm_content=${tier}"]`),
      `tier link ${tier}`
    ).toHaveCount(1)
  }
  await expect(page.getByText(/\$\d/)).toHaveCount(0)
  await checkFooter(page)
  expect(problems).toEqual([])
  await holdOpen(page)
})

test('/terminal redirects to Darkly Energized "Start a project"', async ({ page, problems }) => {
  const res = await page.goto('/terminal?plan=DEEP_AUDIT')
  // Walk back to the first hop: HCR's own answer to /terminal.
  let first = res!.request()
  while (first.redirectedFrom()) first = first.redirectedFrom()!
  const hop = await first.response()
  expect(new URL(first.url()).pathname).toBe('/terminal')
  expect(hop?.status()).toBe(301)
  expect(hop?.headers()['location']).toBe(`${DE_START}pricing&utm_content=deep_audit`)
  expect(new URL(page.url()).hostname).toBe('darklyenergized.com')
  expect(problems).toEqual([])
  await holdOpen(page)
})

test('sets no cookies on any page or the /terminal redirect', async ({
  page,
  context,
  baseURL,
  problems,
}) => {
  const setCookie: string[] = []
  page.on('response', async (res) => {
    if (!res.url().startsWith(baseURL!)) return
    for (const value of await res.headerValues('set-cookie')) {
      setCookie.push(`${new URL(res.url()).pathname}: ${value.split('=')[0]}`)
    }
  })

  for (const path of ['/', '/pricing', '/terminal']) {
    await page.goto(path)
  }

  expect(setCookie, 'Set-Cookie headers from HCR').toEqual([])
  // Scoped to HCR: in preview, darklyenergized.com may set its own.
  expect(await context.cookies(baseURL!)).toEqual([])
  expect(problems).toEqual([])
})
