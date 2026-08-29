# Design System — Phase 1

Centralized design system for **עוגן לנשמה**.

## Structure

```
styles/
├── tokens/          # SCSS variables
├── mixins/          # focus, media, typography, motion
└── README.md
```

## Brand palette

| Token | Value | Use |
|-------|-------|-----|
| `$color-bg` | `#FCFAF6` | Warm ivory background |
| `$color-surface` | `#FFFFFF` | Cards, panels |
| `$color-primary` | `#DDEFF2` | Light sky blue |
| `$color-secondary` | `#DCE7D6` | Sage / pistachio |
| `$color-accent` | `#C9AD80` | Soft champagne gold |
| `$color-text` | `#2D3436` | Charcoal text |
| `$color-text-muted` | `#68706B` | Muted gray-green |
| `$color-accent-dark` | `#BFA67A` | Accent hover / active |

## Typography

Font: **Assistant** (Hebrew + Latin) via `next/font/google`.

Scale: display, h1, h2, h3, body-lg, body, small — see `_typography.scss`.

## Usage in SCSS Modules

```scss
@use "../../../styles/tokens" as *;
@use "../../../styles/mixins/media" as *;
@use "../../../styles/mixins/focus" as *;
```

Adjust relative path depth based on file location.
