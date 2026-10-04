import { readFileSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright here is a local preview tool first, a check second.
 *
 *   npm run preview    opens every page in its own headed browser window and
 *                      leaves the windows open until you close them.
 *   npm run test:e2e   the same checks, headless, then exits.
 *
 * Both fail on a console error or an uncaught exception on any HCR page.
 * The dev server is started for you (or reused if one is already running)
 * on the PORT in .env, 3333 by default. Reuse only checks that something
 * answers on that port, so make sure it is HCR.
 */

function portFromDotEnv(): string {
  try {
    const line = readFileSync(new URL('./.env', import.meta.url), 'utf8')
      .split('\n')
      .find((l) => l.startsWith('PORT='))
    const value = line?.slice('PORT='.length).trim()
    return value || '3333'
  } catch {
    return '3333'
  }
}

const preview = !!process.env.PREVIEW
const port = process.env.PORT || portFromDotEnv()
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  // Preview opens every page at once, one window each.
  workers: preview ? 10 : undefined,
  retries: 0,
  reporter: 'list',
  // A preview window stays open until you close it, however long that is.
  timeout: preview ? 0 : 30_000,
  use: {
    ...devices['Desktop Chrome'],
    baseURL,
    headless: !preview,
    viewport: { width: 1280, height: 860 },
    trace: preview ? 'off' : 'retain-on-failure',
  },
  projects: [{ name: 'chromium' }],
  webServer: {
    command: 'node ace serve',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
