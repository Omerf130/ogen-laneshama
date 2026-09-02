# Admin Authentication & Foundation

Phase 5 introduces a protected `/admin` area with first-party session authentication. CMS CRUD arrives in Phase 6.

## Architecture

- **AdminUser** — credentials stored in MongoDB (`passwordHash` is `select: false`)
- **AdminSession** — opaque session tokens hashed with SHA-256 before persistence
- **HttpOnly cookie** — raw token in `ogen_admin_session`, scoped to `/admin`
- **Protection** — `requireAdmin()` in `src/app/admin/(shell)/layout.tsx` (no middleware)

MongoDB failures fail closed. There is no `CONTENT_SOURCE` fallback for auth.

## Session & Cookie

| Setting | Value |
|---------|-------|
| Cookie name | `ogen_admin_session` |
| Path | `/admin` |
| HttpOnly | `true` |
| SameSite | `lax` |
| Secure | `true` in production |
| Max-Age | 7 days (aligned with DB `expiresAt`) |

Expired sessions are rejected on read. MongoDB TTL on `AdminSession.expiresAt` removes stale rows automatically.

## Password Policy

- Minimum **12 characters**
- Hashed with **bcryptjs** (cost factor 12)
- No symbol/complexity rules beyond length

## Bootstrap First Admin

Interactive (recommended):

```bash
npm run admin:create
```

Non-interactive (CI/automation only — never commit values):

```bash
ADMIN_CREATE_EMAIL=admin@example.com \
ADMIN_CREATE_PASSWORD='your-secure-password' \
ADMIN_CREATE_NAME='Admin Name' \
npm run admin:create
```

The script refuses to overwrite an existing admin email.

## Login Rate Limiting

- **5 attempts** per **15-minute** window per normalized email (SHA-256 key)
- Stored in `AdminLoginRateLimit` with TTL auto-expiry
- Generic failure message for wrong credentials, inactive users, and rate limits: **"פרטי ההתחברות אינם נכונים"**

**Production note:** Per-email limiting works on a shared MongoDB. Distributed IP-based limiting at the edge (Cloudflare/Vercel Firewall) is recommended hardening, not a Phase 5 requirement.

## CSRF & Mutations

- Login/logout use Next.js Server Actions (origin check)
- Session cookie is HttpOnly + SameSite=Lax
- No public GET logout route

Phase 6 CMS mutations should use `withAdminAction()`:

1. `requireAdmin()`
2. Zod parse input
3. Perform mutation
4. `invalidateContent(...)`
5. Return `{ ok: true } | { ok: false, error: string }`

## Verification

```bash
npm run admin:verify-auth
npm run verify:phase-4c
```

Full regression (Phase 5 gate):

```bash
npm run lint && npx tsc --noEmit && npm run build
npm run db:check && npm run db:verify-seed && npm run db:verify-parity
npm run db:verify-content-source && npm run db:verify-public-foundation
npm run admin:verify-auth
```

## Production Checklist

- HTTPS enabled (`Secure` cookies)
- `MONGODB_URI` set in deployment environment
- TTL indexes present on `AdminSession` and `AdminLoginRateLimit`
- Admin routes excluded from indexing (layout metadata + not in sitemap)
- First admin created via `npm run admin:create` (not seed)

## Environment Variables

No new required secrets for sessions.

Optional bootstrap only:

- `ADMIN_CREATE_EMAIL`
- `ADMIN_CREATE_PASSWORD`
- `ADMIN_CREATE_NAME`

See `.env.example` for commented placeholders.
