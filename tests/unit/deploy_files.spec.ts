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

  test('the VPS deploy pulls the container and docs describe Docker restart', ({ assert }) => {
    const script = read('../../scripts/vps-cutover.sh')
    const readme = read('../../README.md')
    const claude = read('../../CLAUDE.md')
    const workflow = read('../../.github/workflows/deploy.yml')

    assert.include(script, 'docker compose pull')
    assert.include(script, 'docker compose up -d')
    assert.include(script, 'http://127.0.0.1:3773/')
    assert.include(script, 'image: ghcr.io/kstrat2001/hcr:latest')
    assert.include(script, 'read_env HOST')
    assert.include(script, 'read_env PORT')
    assert.include(script, 'read_env NODE_ENV')
    assert.include(script, 'read_env APP_KEY')
    assert.include(script, 'PM2 is not required')
    assert.match(script, /if command -v pm2/)
    assert.notInclude(script, '/root/hcr')
    assert.notInclude(script, 'PM2 was not touched')

    assert.notInclude(readme, '/root/hcr')
    assert.notMatch(readme, /PM2|pm2/)
    assert.include(readme, 'restart: unless-stopped')
    assert.include(readme, '`docker` and `caddy` systemd units are enabled')
    assert.include(readme, 'SSH user that can run Docker')

    assert.notInclude(claude, '/root/hcr')
    assert.notMatch(claude, /PM2|pm2/)
    assert.include(claude, 'restart: unless-stopped')
    assert.include(claude, '`docker` and `caddy` systemd units are enabled')

    assert.include(workflow, 'bash /opt/hcr/scripts/vps-cutover.sh')
    assert.include(workflow, '127.0.0.1:3773:3773')
    assert.notMatch(workflow, /PM2|pm2/)
  })
})
