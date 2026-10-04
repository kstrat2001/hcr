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
- PostgreSQL

## Pages

| Route | What it is |
| --- | --- |
| `/` | Home page |
| `/pricing` | Review tiers, each linking to Darkly Energized |
| `/terminal` | Legacy link, permanently redirects to Darkly Energized |

All outbound Darkly Energized links are built in `inertia/lib/de_links.ts`, which adds `utm_*` tags so referrals from HCR can be attributed.

## Local development

Requirements: Node.js 24+ and a local PostgreSQL database.

```bash
npm ci
cp .env.example .env
node ace generate:key      # writes APP_KEY into .env
# edit .env with your local database settings
node ace migration:run
npm run dev                # http://localhost:3333 by default
```

### Environment variables

Set these in `.env` (see `.env.example`). Never commit `.env` or real credentials.

| Variable | Purpose |
| --- | --- |
| `TZ`, `PORT`, `HOST`, `LOG_LEVEL`, `NODE_ENV` | Server basics |
| `APP_KEY` | App secret, generate with `node ace generate:key` |
| `SESSION_DRIVER` | `cookie` or `memory` |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_DATABASE` | PostgreSQL connection |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `NOTIFICATION_EMAIL` | Mail settings, still required by config but unused now that HCR sends no email |

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

Build with `npm run build`, put a production `.env` in `build/`, install production dependencies there, and run `node bin/server.js` behind a reverse proxy that handles HTTPS.

## License

[MIT](LICENSE) © 2026 Kain Osterholt. Human Code Reader is a Darkly Energized LLC product.
