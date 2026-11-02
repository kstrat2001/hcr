import { readFileSync } from 'node:fs'
import { test } from '@japa/runner'

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

test.group('Production deploy files', () => {
  test('the deploy workflow is manual workflow_dispatch only', ({ assert }) => {
    const yaml = read('../../.github/workflows/deploy.yml')
    const header = yaml.split(/^jobs:/m)[0]

    assert.match(header, /^on:\n {2}workflow_dispatch:/m)
    assert.notMatch(header, /^\s{2}(push|pull_request|schedule|workflow_call|workflow_run):/m)
    assert.include(header, 'Actions → Deploy → Run workflow')
  })

  test('compose publishes the app port on loopback only', ({ assert }) => {
    const compose = read('../../docker-compose.yml')

    assert.include(compose, 'image: ghcr.io/kstrat2001/hcr:latest')
    assert.include(compose, '127.0.0.1:${PORT:-3773}:${PORT:-3773}')
    assert.notMatch(compose, /^\s*-\s*["']?\d+:\d+["']?\s*$/m)
  })

  test('the image pins a Node 24 patch and starts the built server', ({ assert }) => {
    const dockerfile = read('../../Dockerfile')
    const fromLines = dockerfile.split('\n').filter((line) => line.startsWith('FROM '))

    assert.deepEqual(fromLines, [
      'FROM node:24.22.2-slim AS deps',
      'FROM node:24.22.2-slim AS build',
      'FROM node:24.22.2-slim AS runtime',
    ])
    assert.include(dockerfile, 'HOST=0.0.0.0')
    assert.include(dockerfile, 'CMD ["node", "bin/server.js"]')
  })
})
