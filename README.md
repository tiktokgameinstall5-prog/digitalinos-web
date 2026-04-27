# Digitalinos Web

The SaaS storefront, account system, admin panel, and license server for the
[Digitalinos](https://github.com/munnataiwan123-gif/video-batch-pro) desktop
video processor.

## Stack

- **Next.js 16** (App Router, React Server Components)
- **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, **Framer Motion**
- **Prisma 6** + **PostgreSQL**
- **Auth.js v5** (`next-auth@beta`) — email/password (bcrypt) + Google OAuth
- **JWT (RS256)** for offline-verifiable license tokens

## Features

- Marketing site: landing, pricing, FAQ, terms, privacy
- Auth: signup, login, Google OAuth, password change, account delete
- User dashboard: license status, device management, activate by key
- Admin panel: users (search / promote / delete), licenses (issue / revoke /
  delete), activity logs, overview analytics (RBAC enforced in proxy + API)
- License server API: `verify`, `redeem`, `release`
- Anonymous trial counter API (hardware-fingerprinted)
- Rate limiting on public endpoints, activity logging on admin actions

## Local setup

```bash
# 1. Install deps
npm install

# 2. Env
cp .env.example .env
# fill in DATABASE_URL + AUTH_SECRET (at minimum)
#   AUTH_SECRET:  openssl rand -base64 32

# 3. Generate license signing keypair
npm run keys:generate
# paste LICENSE_PRIVATE_KEY_B64 and LICENSE_PUBLIC_KEY_B64 into .env

# 4. Apply schema + seed
npm run db:push
npm run db:seed
# default admin:  admin@digitalinos.app  /  AdminPass123!
#                 (override with ADMIN_EMAIL + ADMIN_PASSWORD)

# 5. Run
npm run dev
# -> http://localhost:3000
```

## Environment variables

| Var | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✓ | Postgres connection string |
| `AUTH_SECRET` | ✓ | `openssl rand -base64 32` |
| `AUTH_URL` | prod | Full URL of the deployed site |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | optional | Enables Google sign-in |
| `LICENSE_PRIVATE_KEY_B64` / `LICENSE_PUBLIC_KEY_B64` | ✓ (for license API) | RSA-2048 PEM, base64-encoded |
| `ADMIN_EMAIL` | optional | Email that auto-promotes to ADMIN on first signup |
| `FREE_TRIAL_VIDEO_LIMIT` | default 10 | Free trial video cap |
| `OFFLINE_GRACE_DAYS` | default 7 | How long the desktop app may run without re-verifying |
| `NEXT_PUBLIC_DESKTOP_DOWNLOAD_URL` | default: GitHub releases | Download link shown on the dashboard |

## Deploy

### Vercel (recommended)

1. Push this repo to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add all env vars from `.env.example` in Project Settings → Environment.
4. Set the Postgres URL to your Supabase / Neon / Railway connection string.
5. Deploy.

Prisma migrations are not auto-applied. After first deploy, either:

- run `npm run db:push` against the production DB from your laptop, or
- add `prisma migrate deploy` to the Vercel build command.

### Database

Any hosted Postgres works. Recommended: [Supabase](https://supabase.com) (free
tier), [Neon](https://neon.tech), or [Railway](https://railway.app).

## Desktop app integration

The desktop app at
[`munnataiwan123-gif/video-batch-pro`](https://github.com/munnataiwan123-gif/video-batch-pro)
calls two endpoints:

### `POST /api/license/verify`

```jsonc
// Request
{
  "key": "DGIT-XXXX-XXXX-XXXX-XXXX",
  "hardware_id": "sha256-of-CPU-motherboard-MAC",
  "hostname": "DESKTOP-ABC",
  "platform": "Windows-11",
  "app_version": "0.3.0",
  "app_hash": "sha256-of-exe"
}

// Response 200
{
  "ok": true,
  "token": "<RS256 JWT valid 24h>",
  "plan": "PRO",
  "expires_at": 1735689600,
  "ttl_seconds": 86400
}
```

The desktop app embeds the `LICENSE_PUBLIC_KEY` and verifies the JWT offline.
The token's `hw` claim binds it to the current hardware; tampering fails
verification. If the last successful verify was more than `OFFLINE_GRACE_DAYS`
ago, the app must reconnect.

### `POST /api/trial/ping`

```jsonc
// Request
{ "hardware_id": "...", "platform": "Windows-11", "app_version": "0.3.0" }

// Response 200
{ "ok": true, "videos_used": 3, "videos_limit": 10, "exhausted": false }
```

Called once per successfully-processed video while in trial mode. The server
enforces the 10-video cap across reinstalls (keyed on hardware hash).

## Admin

Bootstrap: the first user to sign up with an email matching `ADMIN_EMAIL` is
automatically promoted to `ADMIN`. Admins can then promote others from
`/admin/users`.

## License

Copyright © Digitalinos. All rights reserved.
