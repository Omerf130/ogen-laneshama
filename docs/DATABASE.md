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

Seed copies approved static content from `src/content/**` into MongoDB. Public pages continue reading static getters only.

```bash
npm run db:seed -- --dry-run
npm run db:seed
npm run db:verify-seed
```

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
