# QA Testing Guide — BurpeePacer

This document explains how to set up your machine, run tests locally against the Firebase emulator, and run read-only smoke tests against the live production site.

---

## Prerequisites

- Node.js 18+ and npm
- Git
- [Firebase CLI](https://firebase.google.com/docs/cli) (`npm install -g firebase-tools`)
- Java (required by the Firebase emulator)

---

## QA Onboarding Steps (one-time)

### 1. Pull the latest code

```bash
git pull origin main
```

### 2. Install Java (required by the Firebase emulator — skip if already installed)

```bash
brew install --cask temurin
```

> Verify it worked: `java -version` should print a version number.

### 3. Create your local environment file from the committed template

```bash
cd web
cp .env.test.local.example .env.test.local
```

The defaults in the template work as-is. **No values need to be changed** for emulator tests — the test accounts (`qa-user@test.com` and `qa-admin@test.com`) are created automatically in the emulator before each test run.

> `.env.test.local` is gitignored. It lives only on your machine and is never committed.

### 4. Install dependencies and Playwright browsers

```bash
cd web
npm install
npx playwright install chromium
```

---

## Running Tests

### Emulator tests — isolated, safe, no production data touched

This is the standard QA mode. Playwright automatically starts the Next.js dev server and the Firebase emulator before the tests run. Test accounts are seeded automatically.

```bash
cd web && npm test
```

What happens behind the scenes:
- Firebase Auth and Firestore emulators start on `localhost:9099` and `localhost:8080`
- A `qa-user@test.com` and `qa-admin@test.com` account are created in the emulator
- The Next.js dev server starts on `localhost:3000` pointed at the emulator (not production)
- All tests run in Chromium
- An HTML report is generated at `web/playwright-report/index.html`

To view the report after a run:

```bash
npx playwright show-report
```

### Live production smoke tests — read-only, no login, no data written

Runs a small set of checks directly against `https://www.burpeepacers.com`. These tests only assert that pages load and key UI elements are visible. They never log in and never write any data.

```bash
cd web && npx playwright test --project=smoke
```

---

## Running Specific Scenarios

Run a single spec file:

```bash
npx playwright test tests/auth.spec.ts
npx playwright test tests/dashboard.spec.ts
npx playwright test tests/pricing.spec.ts
npx playwright test tests/admin.spec.ts
```

Run a single test by name:

```bash
npx playwright test -g "timer start button"
npx playwright test -g "non-admin is redirected"
```

Run with a visible browser (useful for debugging):

```bash
npx playwright test --headed
```

Step through a test interactively:

```bash
npx playwright test tests/auth.spec.ts --debug
```

Open the interactive Playwright UI (best for exploring and filtering tests):

```bash
npx playwright test --ui
```

---

## Test Coverage at a Glance

| Spec file | Pages / flows covered | Needs login? |
|---|---|---|
| `auth.spec.ts` | `/login`, sign-up form toggle, wrong-credential error | No |
| `landing.spec.ts` | `/` (unauthenticated), CTA and nav links | No |
| `pricing.spec.ts` | `/pricing`, plan cards, trust badges | No |
| `dashboard.spec.ts` | `/` (logged in), timer, calendar, workout checkbox, logout | Yes — `qa-user@test.com` |
| `admin.spec.ts` | `/admin` access control (non-admin redirect + admin full access) | Yes — both accounts |
| `smoke.spec.ts` | Landing, login, pricing on live site | No |

---

## Troubleshooting

**Emulator fails to start**
- Confirm Java is installed: `java -version`
- Confirm Firebase CLI is installed: `firebase --version`
- Make sure ports 9099 and 8080 are not already in use

**Tests fail with "Firebase not configured" error**
- Check that `web/.env.test.local` exists and contains `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`
- Re-run `cp .env.test.local.example .env.test.local` if the file is missing

**Dashboard or admin tests fail immediately**
- The emulator is ephemeral — data resets each time the emulator restarts. The `global-setup.ts` script re-creates the test accounts on every run, so this should be automatic. If you see auth errors, stop everything and re-run `npm test` from scratch.

**Smoke tests fail**
- Check your internet connection
- The production site may be temporarily down — verify manually at `https://www.burpeepacers.com`
