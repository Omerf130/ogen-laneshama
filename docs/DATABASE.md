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

## Server usage

Import from `@/lib/db` in server-only code (Route Handlers, Server Actions, future models). That entry point is guarded by `server-only`. Do not import from client components or public pages in Phase 4B.

Connection logic lives in `src/lib/db/mongoose.ts`; `connect.ts` and `index.ts` re-export it for server-only consumers.
