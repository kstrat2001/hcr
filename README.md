# Human Code Reader

**Helping vibe coders deploy to prod safely, and scale with confidence.**

Human Code Reader (HCR) is the marketing site for senior human code reviews of AI-assisted ("vibe coded") projects. It is a [Darkly Energized LLC](https://darklyenergized.com) product.

HCR doesn't collect any visitor data. Every call to action sends visitors to Darkly Energized to sign up and start a project, which is where scoping, NDAs, contracts and billing happen.

- Live site: [humancodereader.com](https://humancodereader.com)
- Start a project: [darklyenergized.com/projects/new](https://darklyenergized.com/projects/new?utm_source=hcr&utm_medium=referral&utm_campaign=readme)
- Legal: [Terms](https://darklyenergized.com/terms), [Privacy Policy](https://darklyenergized.com/privacy), [Disclaimer](https://darklyenergized.com/disclaimer)

## Stack

- [AdonisJS 6](https://adonisjs.com) (Node.js, TypeScript)
- [Inertia.js](https://inertiajs.com) with React 19, built with Vite

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home page |
| `/pricing` | Review tiers, each linking to Darkly Energized |
| `/terminal` | Legacy link, permanently redirects to Darkly Energized |

All outbound Darkly Energized links are built in `inertia/lib/de_links.ts`, which adds `utm_*` tags so referrals from HCR can be attributed.

## Local development

Requirements: Node.js 24+. No database is needed.

```bash
npm ci
cp .env.example .env
node ace generate:key      # writes APP_KEY into .env
npm run dev                # http://localhost:3333 by default
```

### Environment variables

Set these in `.env` (see `.env.example`). Never commit `.env` or real credentials. These are the only variables the app reads; HCR has no database, mail, sessions or auth.

| Variable | Purpose |
| --- | --- |
| `TZ`, `PORT`, `HOST`, `LOG_LEVEL`, `NODE_ENV` | Server basics |
| `APP_KEY` | App secret, generate with `node ace generate:key` |

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `build/` |
| `npm start` | Run the built server (`node bin/server.js`) |
| `npm test` | Test suite (Japa: `tests/unit`, `tests/functional`) |
| `npm run preview` | Local preview: opens each page in its own browser window (see below) |
| `npm run test:e2e` | The same page checks, headless |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run format` | Prettier |

## Local preview

`npm run preview` is a local preview tool. It uses Playwright (`playwright.config.ts`, `tests/e2e/preview.spec.ts`) to open `/`, `/pricing` and `/terminal` in separate headed Chromium windows. Each window stays open until you close it; the run ends when the last one is closed.

On every page it checks:

- the page loads with the expected heading
- the footer credits Darkly Energized LLC and links to its Terms, Privacy Policy and Disclaimer
- the calls to action link to Darkly Energized with `utm_*` tags
- `/terminal` answers with a 301 to `darklyenergized.com/projects/new`
- the browser console shows no errors and the page throws no uncaught exceptions

If any check fails, the run fails.

`npm run test:e2e` runs the same checks headless and exits. It stubs every request that isn't to localhost, so it works offline and doesn't depend on darklyenergized.com being up. It's a local check only; there's no CI job for it.

Both commands start the dev server on the `PORT` in `.env` (3333 by default), or reuse a server that's already listening on that port. Reuse only checks that something answers there, so make sure that's HCR. You need a `.env` (see Local development). The first time, install the browser with `npx playwright install chromium`.

## Deploying

Production is a container, not a git checkout. Merging does not deploy. There is no deploy on push or pull request.

Operators deploy by hand: **Actions → Deploy → Run workflow**. The workflow builds `ghcr.io/kstrat2001/hcr`, checks the image serves `/` with status 200, then SSHs to the VPS and runs `docker compose pull` / `up`. The optional `ref` input defaults to `main`.

The image is `node:24.22.2-slim` (Node 24 LTS, patch pinned on 2026-11-02). It is not the floating `node:24-slim` tag, and it is not darklyenergized's `node:24.19-slim` pin. Inside the container the process listens on `HOST=0.0.0.0`. Compose publishes that port on the VPS loopback only (`127.0.0.1:3773`), which is what Caddy already proxies. Caddy is not changed by a deploy.

Container `hcr` uses `restart: unless-stopped`. The `docker` and `caddy` systemd units are enabled, so a reboot starts Docker and Caddy and the container comes back on `127.0.0.1:3773`.

### GitHub secrets

Set these on the hcr repo (the same names darklyenergized uses). The workflow has no default values for them.

| Secret | What it is |
| --- | --- |
| `VPS_HOST` | SSH host of the production VPS |
| `VPS_USER` | SSH user that can run Docker |
| `VPS_SSH_KEY` | Private key for that user |

GHCR login uses the workflow's `GITHUB_TOKEN`. Do not put tokens, hostnames, or `.env` values in the repo.

### VPS layout

| Path | What it is |
| --- | --- |
| `/opt/hcr/docker-compose.yml` | Copied from this repo on each deploy |
| `/opt/hcr/.env` | Production env. Not in git. The container reads it. |
| `/opt/hcr/ENV.txt` | A reminder of this layout, written by the deploy script |
| `/opt/hcr/scripts/vps-cutover.sh` | Pull, up, and health check. Copied on each deploy. |

`.env` is `TZ`, `PORT`, `HOST`, `LOG_LEVEL`, `APP_KEY`, `NODE_ENV`. `SESSION_DRIVER` is ignored if it is still there; this app has no database, redis, or sessions.

`HOST` and `PORT` in that file are for the process **inside** the container. The host bind is compose's job. Use `HOST=0.0.0.0` and `PORT=3773`. `NODE_ENV=production`.

## License

[MIT](LICENSE) © 2026 Kain Osterholt. Human Code Reader is a Darkly Energized LLC product.
