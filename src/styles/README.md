# Design System — Phase 1 Prep

This folder holds the centralized design system for **עוגן לנשמה**.

## Structure

```
styles/
├── tokens/          # SCSS variables (colors, spacing, typography, breakpoints)
├── mixins/          # Reusable SCSS mixins (focus, responsive)
└── README.md
```

## Phase 1 tasks

1. Define final brand color tokens in `_colors.scss` (sky blue, sage green, white, gold accent)
2. Select and load a Hebrew-friendly font
3. Apply tokens across all components
4. Replace neutral placeholder styles in UI components

## Usage in SCSS Modules

```scss
@use "styles/tokens" as *;
@use "styles/mixins/media" as *;
@use "styles/mixins/focus" as *;
```

The `includePaths` in `next.config.ts` allows importing from `src/` without relative paths.
