# CLAUDE.md

Guidance for coding agents working in this repository. Read `~/de-projects/CLAUDE.md` too; this file wins where they differ.

## What this is

humancodereader.com (HCR) is a Darkly Energized LLC product: a deliberately humorous "AI writes code. We review it." site. It sells nothing itself. Every call to action ends at Darkly Energized's "Start a project" page, which is the system of record for leads.

## Commands

```bash
npm run dev        # dev server with HMR (set PORT in .env if 3333 is taken)
npm run build      # production build into build/
npm test           # Japa tests
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run preview    # Playwright, headed: opens each page in a window for a visual check
npm run test:e2e   # Playwright, headless
```

Both Playwright commands fail on any console error and check that no cookies are set.

## Stack

AdonisJS 6 + Inertia + React. No database, no sessions, no email, no forms.

## Rules

- **HCR collects nothing.** Don't add forms, cookies, analytics, a database or mail. Anything that needs a lead goes to Darkly Energized.
- **Links to DE are built in `inertia/lib/de_links.ts`** with UTM tags. Only the pricing page links out to DE; the rest of the site links to `/pricing`. `/terminal` permanently redirects to DE.
- **Prices don't appear on HCR.** Tiers describe the work; scoping and pricing happen on DE.
- **The humor is intentional** (for example `Vibe_Verification_Status: APPROVED`). Keep it, but keep claims honest.
- **Attribution:** the footer says "A Darkly Energized LLC product" and links to DE's Terms, Privacy and Disclaimer.
- **Tests document themselves.** Don't add separate handoff docs.
- **Playwright is a local tool,** not CI. Don't wire it into a workflow.

## Git and deploy

- Public repo: never commit secrets, server addresses, email addresses or `.env` values, in code, docs or PR text. Scan the diff before pushing.
- Never push to `main`. Branch, push, open a PR; Kain merges.
- There is no CI yet. Run `lint`, `typecheck` and the tests locally before opening a PR, and show UI changes with `npm run preview` or screenshots.
- Merging does not deploy. Kain deploys by hand on the server.
