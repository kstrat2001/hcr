import { test } from '@japa/runner'
import env from '#start/env'

const base = () => `http://${env.get('HOST')}:${env.get('PORT')}`
const get = (path: string, init: RequestInit = {}) =>
  fetch(`${base()}${path}`, { redirect: 'manual', ...init })

test.group('Funnel to Darkly Energized', () => {
  for (const path of ['/', '/pricing']) {
    test(`${path} renders`, async ({ assert }) => {
      const res = await get(path)
      assert.equal(res.status, 200)
    })
  }

  test('/terminal is a permanent redirect to DE "Start a project"', async ({ assert }) => {
    const res = await get('/terminal')
    assert.equal(res.status, 301)
    assert.equal(
      res.headers.get('location'),
      'https://darklyenergized.com/projects/new?utm_source=hcr&utm_medium=referral&utm_campaign=pricing'
    )
  })

  test('/terminal keeps the old ?plan= as utm_content', async ({ assert }) => {
    const res = await get('/terminal?plan=DEEP_AUDIT&color=%2300ff41')
    assert.equal(res.status, 301)
    assert.equal(
      res.headers.get('location'),
      'https://darklyenergized.com/projects/new?utm_source=hcr&utm_medium=referral&utm_campaign=pricing&utm_content=deep_audit'
    )
  })

  test('/terminal drops a plan that is not a model name', async ({ assert }) => {
    const res = await get('/terminal?plan=%3Cscript%3E')
    assert.notInclude(res.headers.get('location') ?? '', 'utm_content')
  })

  test('nothing accepts lead data any more', async ({ assert }) => {
    const res = await get('/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'someone@example.com', repoUrl: 'https://example.com' }),
    })
    assert.notEqual(res.status, 200)
    assert.notInclude(await res.text(), 'Data received')
  })

  test('the page says whose product it is', async ({ assert }) => {
    const res = await get('/')
    const html = await res.text()
    assert.include(html, '<meta name="author" content="Darkly Energized LLC" />')
    assert.include(
      html,
      '<meta property="og:site_name" content="Human Code Reader by Darkly Energized" />'
    )
  })
})
