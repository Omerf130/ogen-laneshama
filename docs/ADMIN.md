# Admin — Authentication & CMS

Phase 5 introduced protected `/admin` authentication. Phase 6 adds structured CMS editors for all content domains.

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

Phase 6 CMS mutations use `withAdminAction()`:

1. `requireAdmin()`
2. Zod parse input (domain schemas in `src/lib/validation/admin-cms/`)
3. Whitelisted Mongo `$set` via repository write functions
4. `invalidateContent(...)`
5. Return `{ ok: true } | { ok: false, error: string }` (Hebrew messages)

## CMS Domains (Phase 6)

| Route | Domain | Notes |
|-------|--------|-------|
| `/admin/content/homepage` | Homepage | All sections; FAQ/Testimonials visibility toggles |
| `/admin/content/about` | ContentPage | Slug `about` |
| `/admin/content/pregnancy-motherhood` | ContentPage | Slug `pregnancy-motherhood` |
| `/admin/content/contact` | ContentPage | Form labels only (backend in later phase) |
| `/admin/content/treatments` | ContentPage | Treatments index copy |
| `/admin/treatments` | Treatment | List, reorder, active toggle |
| `/admin/treatments/[slug]` | Treatment | Edit only — 4 fixed slugs |
| `/admin/faq` | FAQ | Full CRUD + publish + reorder |
| `/admin/testimonials` | Testimonials | Full CRUD + publish + reorder |
| `/admin/settings` | SiteSettings | Business/contact/social/footer/SEO — nav read-only |

Admin reads load **directly from MongoDB**. DB failures show `AdminDbErrorState` — no static fallback for editing.

FAQ item `id` is assigned server-side with `crypto.randomUUID()` on create.

Media in CMS editors uses `AdminImageField` with the media library picker (Phase 7).

## Phase 7 — Leads, Media & Homepage Analytics

### Leads

| Route | Purpose |
|-------|---------|
| `/admin/leads` | List with status tabs, search, mobile cards |
| `/admin/leads/[id]` | Detail, status, internal notes, archive |

Public contact form submits via Server Action (`submitContactFormAction`):

- Zod validation, honeypot (`website`), lightweight timing heuristic
- Creates lead with `sourcePage: "/contact"` only — no IP/UA/referrer stored
- Archive via `ARCHIVED` status — no hard delete

### Media Library

| Route | Purpose |
|-------|---------|
| `/admin/media` | Grid, Vercel Blob upload, alt edit, reference-safe delete |

- Provider: `vercel-blob`, path prefix `site-media/`
- Max 8 MB; JPEG, PNG, WebP, AVIF
- Local seeded assets are read-only (no delete)
- CMS editors pick images via `AdminImageField` / `AdminMediaPicker`

### Homepage Analytics

- First-party cookie `ogen_homepage_visitor` (HttpOnly)
- Stored hash: `SHA256(cookieUuid)` — raw UUID never persisted in MongoDB
- Tracker mounted in `JourneyShell` (homepage only)
- Dashboard KPIs: total visitors + last 7 days

**Note:** No cookie banner in Phase 7. Document for production privacy review.

## Verification

```bash
npm run admin:verify-auth
npm run admin:verify-cms
npm run admin:verify-leads
npm run admin:verify-media
npm run analytics:verify
npm run verify:phase-7
npm run verify:phase-4c
```

Full regression (Phase 7 gate):

```bash
npm run lint && npx tsc --noEmit && npm run build
npm run db:check && npm run db:verify-seed && npm run db:verify-parity
npm run db:verify-content-source && npm run db:verify-public-foundation
npm run admin:verify-auth && npm run admin:verify-cms
npm run verify:phase-7
```

### Manual E2E checklist

1. **Contact form** — submit valid lead; honeypot returns silent success; lead appears in `/admin/leads` as NEW
2. **Lead admin** — open detail, change status, add notes, archive
3. **Media upload** — upload image in `/admin/media`; appears in grid
4. **Media delete** — referenced image blocked; local seeded image blocked
5. **CMS image pick** — change homepage/about/pregnancy/treatment image; save; public page reflects change
6. **Analytics** — visit homepage; refresh does not double-count; dashboard visitor KPIs update

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
