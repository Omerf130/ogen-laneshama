# Database

## Local setup

1. Copy `.env.example` to `.env.local` if needed.
2. Set `MONGODB_URI` in `.env.local` with your MongoDB Atlas connection string.
3. Never commit real credentials. `.env.local` is gitignored.

## Verify connection

```bash
npm run db:check
```

The command loads `.env.local`, calls the shared connection helper in `src/lib/db/mongoose.ts`, pings the database, and exits with code `0` on success.

## Verify models and validation (Phase 4C)

```bash
npm run verify:phase-4c
```

Compiles all Mongoose models, checks index definitions, and runs Zod boundary tests without writing data.

## Server usage

Import from `@/lib/db` in server-only code (Route Handlers, Server Actions, future models). That entry point is guarded by `server-only`. Do not import from client components or public pages in Phase 4B.

Connection logic lives in `src/lib/db/mongoose.ts`; `connect.ts` and `index.ts` re-export it for server-only consumers.

## Seed static content (Phase 4D.1)

Seed copies approved static content from `src/content/**` into MongoDB. Public pages read content through getters in `src/lib/content/get-*.ts`, which support DB-backed reads when `CONTENT_SOURCE` is configured.

```bash
npm run db:seed -- --dry-run
npm run db:seed
npm run db:verify-seed
```

## Public content source (Phase 4D.2C)

Public getters resolve content from static files or MongoDB depending on `CONTENT_SOURCE`:

| Mode | Behavior |
|------|----------|
| `static` (default) | Static files only — build-safe rollback, no MongoDB required at build time |
| `db` | MongoDB only — throws on missing/invalid content or DB failures |
| `db-with-fallback` | MongoDB primary; falls back to static only for infrastructure errors or missing singletons/content pages |

Recommended local development after seed:

```env
CONTENT_SOURCE=db-with-fallback
```

Verify getter behavior across modes:

```bash
npm run db:verify-content-source
```

Treatments, FAQ, and testimonials lists never fall back to static when the DB responds successfully (including empty arrays or missing/inactive treatments).

## Public CMS foundation (Phase 4E)

Public SEO, sitemap, homepage hero/pregnancy images, and on-demand invalidation utilities are DB-aware when `CONTENT_SOURCE` is `db` or `db-with-fallback`.

### SEO

- Route metadata uses async `generateMetadata()` backed by CMS SEO fields with static `page-metadata.ts` fallback.
- Structured data builders receive runtime `SiteConfig` from `getSiteConfig()`.
- Priority: valid DB SEO override → approved static metadata → site defaults (never empty title/description).

Verify:

```bash
npm run db:verify-public-foundation
```

### Sitemap

- Core routes (`/`, `/about`, `/pregnancy-motherhood`, `/contact`, `/treatments`) always included.
- Treatment URLs follow active DB treatments in DB modes; static four-slug set in `static` mode or `db-with-fallback` infrastructure failure.
- Inactive treatments never appear when the DB responds successfully.

### Homepage media

- `HomepageAssets` exposes `hero`, `pregnancySpotlight`, `aboutPortrait`, `botanicalAccent`.
- Resolution: MediaAsset URL → MediaRef.src → component fallback constant.

### Navbar logo

- UI still uses bundled `@/pics/` logo. `SiteSettings.logoMediaId` is reserved for a future Admin media phase.

### Legacy getter

- `getPagesAssets()` remains static with zero consumers — future cleanup candidate.

### On-demand invalidation (Admin-ready)

Server-only [`src/lib/content/invalidate-content.ts`](src/lib/content/invalidate-content.ts):

```typescript
await invalidateContent({ domain: "homepage" });
await invalidateContent({ domain: "treatment", slug: "psychotherapy" });
```

Uses Next.js 16 `unstable_cache` tags + `revalidateTag(tag, "max")` and targeted `revalidatePath`. No-op when `CONTENT_SOURCE=static`. No public revalidation endpoint in this phase.

DB reads in DB modes are wrapped with `unstable_cache` (`revalidate: false`) keyed by existing content domains. The data cache activates only inside the Next.js server runtime (`NEXT_RUNTIME` set); CLI verification scripts bypass it and read MongoDB directly.

### Build-time DB dependency

| `CONTENT_SOURCE` | Build behavior |
|------------------|----------------|
| unset / `static` | No MongoDB required; static prerender |
| `db` | MongoDB required at build if routes prerender CMS data |
| `db-with-fallback` | Build succeeds without MongoDB; falls back to static |

Production recommendation after Admin verification: `CONTENT_SOURCE=db`. Local dev: `CONTENT_SOURCE=db-with-fallback`.

### Static content dependencies

| Category | Modules | Role |
|----------|---------|------|
| Runtime fallback | `src/content/**`, `page-metadata.ts` | Rollback, `static` mode, SEO fallback |
| Seed only | `src/lib/seed/**`, `seoFromMetadataKey` | Populate MongoDB from approved static |
| SEO fallback always | `page-metadata.ts` | Used when DB SEO fields are empty |

Do not delete `src/content/**` until Admin CMS and production `db` mode are fully verified.

### Seed policy

| Mode | Behavior |
|------|----------|
| `--dry-run` | Build and validate all payloads; report intended operations; **zero writes** |
| Default (development) | Upsert all known seed keys from static content inside a single MongoDB transaction |
| `--force` | Required in `NODE_ENV=production` to update existing seed documents (creates still allowed without force) |
| `--ack-production` | Required for any non-dry-run seed when `NODE_ENV=production` |

### Transaction strategy

1. Build all seed payloads from static imports
2. Validate every payload with Phase 4C Zod schemas **before** any write
3. Connect to MongoDB
4. Start a session/transaction
5. Execute all upserts inside the transaction
6. Commit only if the entire seed succeeds
7. On failure: abort, print a sanitized error, exit `1` — **no non-transactional fallback**

The seed never uses `deleteMany`, drops collections, or removes unknown documents.

### Seeded entities

- `SiteSettings` (`_id: "site"`)
- `Homepage` (`_id: "homepage"`)
- `ContentPage` (4 slugs)
- `Treatment` (4 slugs, `isActive: true`)
- `FaqItem` (5 global homepage FAQs)
- `MediaAsset` (2 local public homepage images)
- Testimonials, Leads, AdminUsers: **not seeded** (expect count `0`)
