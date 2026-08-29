# Architecture — עוגן לנשמה

Phase 0 foundation document for the **עוגן לנשמה** website (רחלי נגרין).

---

## 1. Folder structure

```
src/
├── app/                 # Next.js App Router — routes, layouts, SEO files
├── components/
│   ├── ui/              # Reusable presentational components
│   ├── layout/          # Page-level layout wrappers
│   └── features/        # Feature-specific composed components
├── content/             # Static content data (Phase 0–N: migrates to MongoDB)
├── features/            # Domain logic (forms, leads — future phases)
├── lib/
│   ├── content/         # Content accessors — migration seam to database
│   └── seo/             # Metadata helpers and constants
├── styles/
│   ├── tokens/          # Design tokens (Phase 1)
│   └── mixins/          # SCSS mixins
└── types/               # Shared TypeScript types
docs/
public/                  # Static assets (logo, images — added later)
```

### Rationale

| Folder | Purpose |
|--------|---------|
| `content/` | Hebrew business copy and configuration — never inside UI components |
| `lib/content/` | Async getters that pages call; swap static → MongoDB without UI changes |
| `components/ui/` | Generic, data-driven, reusable |
| `components/features/` | Composed components tied to a domain concept (e.g. treatment detail) |
| `features/` | Server actions, API logic, validation (future) |
| `types/` | Shared interfaces matching future Mongoose schemas |

---

## 2. Route structure

### Public routes (Phase 0)

| Path | Description |
|------|-------------|
| `/` | Homepage skeleton |
| `/about` | About Racheli |
| `/treatments` | Treatments overview |
| `/treatments/psychotherapy` | Psychotherapy & emotional guidance |
| `/treatments/aroma-touch` | Aroma Touch |
| `/treatments/reiki` | Reiki |
| `/treatments/guidance` | Communication / spiritual guidance |
| `/pregnancy-motherhood` | Emotional/spiritual support for pregnancy journey |
| `/contact` | Contact page |

### Homepage sections (not separate routes)

FAQ and testimonials will be **sections on the homepage** with navbar hash links:

- `#faq`
- `#testimonials`

### Future admin routes (not implemented in Phase 0)

```
src/app/(admin)/
├── login/page.tsx       → /admin/login
└── page.tsx             → /admin
```

Protected by `middleware.ts` + session check in a later phase.

Admin will manage: content, treatments, FAQ, testimonials, homepage sections, contact info, WhatsApp, social links, images, logo, leads, internal analytics.

---

## 3. Content architecture

### Data flow

```
content/*.data.ts  →  lib/content/get-*.ts  →  app/**/page.tsx  →  components/ui/*
```

### Key files

- `content/site.config.ts` — business name, therapist, contact, WhatsApp, social links, site URL
- `content/treatments/treatments.data.ts` — typed treatment records
- `content/pages/*.data.ts` — page-specific content
- `content/pages/page-metadata.ts` — SEO titles and descriptions per route
- `content/content-guidelines.ts` — medical/content restriction rules

### Migration to MongoDB

1. Create Mongoose schemas matching types in `src/types/content.ts`
2. Replace the body of each `get*()` function in `lib/content/` with database queries
3. Keep the same return types — **no UI component changes required**
4. Admin panel writes to the same collections

Example:

```typescript
// Phase 0
export async function getTreatments(): Promise<Treatment[]> {
  return treatments;
}

// Future
export async function getTreatments(): Promise<Treatment[]> {
  await connectDB();
  return TreatmentModel.find({ published: true }).lean();
}
```

---

## 4. Component conventions

- **UI components** receive typed props; they never contain hardcoded Hebrew business copy
- **Pages** are async Server Components that fetch data via content accessors
- **SCSS Modules** co-located with each component
- Import design tokens via `@use "styles/tokens" as *`

### Phase 0 components

| Component | Location |
|-----------|----------|
| Container | `components/ui/Container` |
| Section | `components/ui/Section` |
| SectionHeading | `components/ui/SectionHeading` |
| Button | `components/ui/Button` |
| TreatmentCard | `components/ui/TreatmentCard` |
| MediaPlaceholder | `components/ui/MediaPlaceholder` |
| PageShell | `components/layout/PageShell` |
| TreatmentDetail | `components/features/treatments/TreatmentDetail` |

---

## 5. Design system approach (Phase 1)

Tokens live in `src/styles/tokens/`:

- `_colors.scss` — brand palette (placeholder comments in Phase 0)
- `_spacing.scss` — spacing scale and container width
- `_typography.scss` — font sizes, weights, line heights
- `_breakpoints.scss` — mobile-first breakpoints

Mixins in `src/styles/mixins/`:

- `_focus.scss` — accessible `:focus-visible` styles
- `_media.scss` — `@mixin respond-to($breakpoint)`

Phase 1 will define final colors (sky blue, sage green, white, gold accent) and Hebrew typography.

---

## 6. SEO approach

| Mechanism | Location |
|-----------|----------|
| Per-page metadata | `export const metadata` in each `page.tsx` via `buildPageMetadata()` |
| Root metadata | `src/app/layout.tsx` via `buildRootMetadata()` |
| Sitemap | `src/app/sitemap.ts` |
| Robots | `src/app/robots.ts` (disallows `/admin`) |
| Canonical URLs | Set in `buildPageMetadata()` alternates |
| Open Graph | locale `he_IL`, per-page title/description |
| JSON-LD structured data | Planned for Phase 2 |

Site URL: `NEXT_PUBLIC_SITE_URL` env var, fallback to `site.config.ts`.

---

## 7. RTL and accessibility

- Root layout: `<html lang="he" dir="rtl">`
- Semantic HTML: `<main>`, `<section>`, proper heading hierarchy via `SectionHeading`
- Keyboard: focus-visible mixin on interactive elements
- Reduced motion: global rule in `globals.scss`
- Forms: accessible labels and error states (Phase 1+ contact form)
- Images: alt text required; `MediaPlaceholder` uses `role="img"` and `aria-label`
- No accessibility overlay widget — built-in accessible code only

---

## 8. Content and medical restrictions

All content — static, CMS, and admin — must follow these rules:

1. **Never promise medical or psychological outcomes**
2. **Reiki, spiritual guidance, Aroma Touch** are complementary services — not substitutes for medical or psychological treatment
3. **Pregnancy/motherhood support** is emotional and spiritual only — not fertility treatment and not a promise of pregnancy

Enforced in `content/content-guidelines.ts` and documented on relevant content records via `contentNote` fields.

---

## 9. Future integration hooks

| Feature | Phase 0 preparation |
|---------|---------------------|
| MongoDB/Mongoose | Content accessors + typed interfaces; `lib/db/` to be added |
| Admin CMS | Reserved `(admin)` route group; types match future schemas |
| Authentication | `middleware.ts` at `/admin/*` — not created yet |
| Leads | `features/leads/` + API route pattern |
| Analytics | Comment placeholder in root layout |
| Media | `public/` folder + `MediaPlaceholder` → CMS image URL on content types |
| Email | Contact form feature module (future) |

---

## 10. Phase roadmap

- [x] **Phase 0** — Architecture, routing skeleton, content layer, design tokens placeholder
- [ ] **Phase 1** — Design system, navbar, footer, homepage sections, full page layouts
- [ ] **Phase 2** — SEO content finalization, JSON-LD, performance optimization
- [ ] **Phase 3** — MongoDB, admin panel, authentication
- [ ] **Phase 4** — Contact form, leads, analytics
