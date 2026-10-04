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
| `npm test` | Test suite |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run format` | Prettier |

## Deploying

Build with `npm run build`, put a production `.env` in `build/`, install production dependencies there, and run `node bin/server.js` behind a reverse proxy that handles HTTPS.

## License

[MIT](LICENSE) © 2026 Kain Osterholt. Human Code Reader is a Darkly Energized LLC product.
