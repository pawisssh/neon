---
version: alpha
name: Finnomena
description: Navy Ledger — a monochrome financial system where navy ink stands in for black on every surface, broken only by a single yellow signal reserved for the one moment that should stand out.
colors:
  primary: "#01172b"
  primary-hover: "#1a2e40"
  primary-active: "#344555"
  on-primary: "#ffffff"
  secondary: "#1817e7"
  secondary-hover: "#1414c4"
  tertiary: "#f2f93c"
  on-tertiary: "#2b2d01"
  neutral: "#f2f3f4"
  outline: "#d9dcdf"
  background: "#ffffff"
  on-background: "#000000d9"
  on-background-variant: "rgba(0, 0, 0, 0.651)"
  surface: "#ffffff"
  on-surface: "#000000d9"
  surface-variant: "#f2f3f4"
  error: "#d60808"
  on-error: "#ffffff"
  error-hover: "#ba0707"
  error-active: "#9d0606"
  error-container: "#fff5f5"
  on-error-container: "#d60808"
  positive: "#009646"
  positive-container: "#e6fdf0"
  on-positive-container: "#009646"
  warning: "#f26414"
  warning-container: "#fef7f3"
  on-warning-container: "#f26414"
typography:
  display1:
    fontFamily: IBM Plex Sans Thai
    fontSize: 92px
    fontWeight: 400
    lineHeight: 102px
    letterSpacing: -0.64px
  display2:
    fontFamily: IBM Plex Sans Thai
    fontSize: 60px
    fontWeight: 400
    lineHeight: 70px
    letterSpacing: -0.64px
  display3:
    fontFamily: IBM Plex Sans Thai
    fontSize: 54px
    fontWeight: 700
    lineHeight: 64px
    letterSpacing: 0px
  largeTitle:
    fontFamily: IBM Plex Sans Thai
    fontSize: 34px
    fontWeight: 400
    lineHeight: 41px
    letterSpacing: 0.4px
  quotation1:
    fontFamily: IBM Plex Sans Thai
    fontSize: 42px
    fontWeight: 400
    lineHeight: 50px
    letterSpacing: 0px
  title1:
    fontFamily: IBM Plex Sans Thai
    fontSize: 28px
    fontWeight: 400
    lineHeight: 34px
    letterSpacing: 0.38px
  paragraph:
    fontFamily: IBM Plex Sans Thai
    fontSize: 28px
    fontWeight: 400
    lineHeight: 36px
    letterSpacing: 0px
  quotation2:
    fontFamily: IBM Plex Sans Thai
    fontSize: 24px
    fontWeight: 400
    lineHeight: 30px
    letterSpacing: 0px
  title2:
    fontFamily: IBM Plex Sans Thai
    fontSize: 22px
    fontWeight: 400
    lineHeight: 28px
    letterSpacing: -0.26px
  title3:
    fontFamily: IBM Plex Sans Thai
    fontSize: 20px
    fontWeight: 400
    lineHeight: 25px
    letterSpacing: -0.45px
  headline:
    fontFamily: IBM Plex Sans Thai
    fontSize: 17px
    fontWeight: 500
    lineHeight: 22px
    letterSpacing: -0.43px
  body:
    fontFamily: IBM Plex Sans Thai
    fontSize: 17px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: -0.43px
  callout:
    fontFamily: IBM Plex Sans Thai
    fontSize: 16px
    fontWeight: 400
    lineHeight: 21px
    letterSpacing: -0.31px
  subheadline:
    fontFamily: IBM Plex Sans Thai
    fontSize: 15px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: -0.23px
  footnote:
    fontFamily: IBM Plex Sans Thai
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: -0.08px
  caption1:
    fontFamily: IBM Plex Sans Thai
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0px
  caption2:
    fontFamily: IBM Plex Sans Thai
    fontSize: 11px
    fontWeight: 400
    lineHeight: 13px
    letterSpacing: 0.06px
rounded:
  none: 0px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 40px
  4xl: 48px
  full: 9999px
spacing:
  unit: 8px
  none: 0px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 40px
  2xl: 48px
  3xl: 64px
  4xl: 96px
  5xl: 128px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  button-primary-active:
    backgroundColor: "{colors.primary-active}"
  button-highlight:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
  button-danger:
    backgroundColor: "{colors.error}"
    textColor: "{colors.on-error}"
  button-danger-hover:
    backgroundColor: "{colors.error-hover}"
  button-danger-active:
    backgroundColor: "{colors.error-active}"
  tag-neutral:
    backgroundColor: "{colors.neutral}"
    textColor: "{colors.primary}"
    borderColor: "{colors.outline}"
  link-primary:
    textColor: "{colors.secondary}"
  link-primary-hover:
    textColor: "{colors.secondary-hover}"
  input-field:
    backgroundColor: "rgba(1, 23, 43, 0.031)"
    textColor: "{colors.on-background}"
    typography: "{typography.body}"
  input-field-hover:
    backgroundColor: "rgba(1, 23, 43, 0.051)"
  banner-success:
    backgroundColor: "{colors.positive-container}"
    textColor: "{colors.on-positive-container}"
  banner-warning:
    backgroundColor: "{colors.warning-container}"
    textColor: "{colors.on-warning-container}"
  banner-error:
    backgroundColor: "{colors.error-container}"
    textColor: "{colors.on-error-container}"
---

## Overview

Navy Ledger. A monochrome financial system where navy ink stands in for black on every surface — primary buttons, strong borders, headings — broken only by a single yellow signal reserved for the one moment that should stand out.

Finnomena's system is built on restraint — one dominant "ink" color doing almost all the structural work, chromatic color kept rare and rule-bound — using a deep navy (`#01172b`) in place of black. Every neutral step in the interface, from the darkest button to the faintest field wash, is a tint of that same navy hue rather than a separate gray family, giving the system a tonal, financial-ledger consistency instead of true black-and-white starkness. Two colors are permitted outside that navy scale, each confined to a single job: a saturated yellow (`#f2f93c`) for the brand-highlight moment, and an indigo (`#1817e7`) for links, focus rings, and the interactive-highlight state. Neither is a general-purpose accent — using either outside its one role breaks the discipline the whole system depends on.

The brand reads as calm, trustworthy, and precise — closer to a ledger or a bank statement than a consumer fintech app. Density is comfortable, not dense: an 8px spacing rhythm and generous navy-tinted washes keep the interface legible without feeling sparse. Depth comes from flat color and opacity steps, never shadows.

Key characteristics:
- One "ink" color (Navy Ink, `#01172b`) plays the role black plays in most systems — buttons, borders, strong text.
- Every neutral in the UI is a tint of that same navy, not a separate gray family.
- Exactly two colors escape the navy scale, each locked to one job: Yellow Signal (brand highlight) and Indigo Interactive (links/focus).
- No drop shadows anywhere — elevation is flat color-and-opacity layering.
- A single type family (IBM Plex Sans Thai) covers the entire 17-role scale, from `caption2` to `display1`.
- An 8px-aligned spacing scale throughout, no off-grid values.
- Full light and dark themes, both human-verified (not auto-inverted).
- Radius scales from sharp (`4px`) to fully rounded pills, used deliberately per component role rather than uniformly.

## Colors

The palette is rooted in a single dominant "ink" and two single-purpose exceptions — there is no secondary brand color competing for attention.

- **Primary (`#01172b`, "Navy Ink"):** The system's stand-in for black. Used for primary buttons, strong borders, and the dark end of every surface. Hover steps to `#1a2e40`, active to `#344555`.
- **Secondary (`#1817e7`, "Indigo Interactive"):** The only other non-navy color permitted in UI. Reserved exclusively for links, focus rings, and the interactive-highlight state — never a fill, never a general accent.
- **Tertiary (`#f2f93c`, "Yellow Signal"):** The one chromatic accent — brand mark, the highlight button or tag. Single-purpose: one emphasized element per screen, never repeated across a page. Text against it uses a dark ink (`#2b2d01`), not Navy Ink itself, for contrast.
- **Neutral (`#f2f3f4`, "Navy Fog"):** Field fills, subtle section washes, neutral tag backgrounds — the lightest tint of the navy ramp.
- **Background (`#ffffff`, "Paper White"):** Page background. Text over it ("Ink on Paper") is 85%-opacity black (`#000000d9`), not pure black and not Navy Ink itself.
- **Positive (`#009646`) / Warning (`#f26414`) / Error (`#d60808`):** Status colors, each with a pastel container wash (`#e6fdf0` / `#fef7f3` / `#fff5f5`) for banners and notifications. Reserved for success/warning/error states only.

**Dark mode** is fully defined and human-verified, not auto-inverted — the navy ramp itself doesn't re-tint for dark mode, but its role holders do:

| Role | Light | Dark |
|---|---|---|
| Navy Ink (primary) | `#01172b` | `#415160` |
| Navy Ink Hover | `#1a2e40` | `#5a6875` |
| Navy Ink Active | `#344555` | `#808b95` |
| Navy Pale (outline) | `#d9dcdf` | `#404040` |
| Navy Fog (neutral) | `#f2f3f4` | `#1a1a1a` |
| Paper White (background) | `#ffffff` | `#000000` |
| Ink on Paper (on-background) | `#000000d9` | `#ffffff` |
| Positive text | `#009646` | `#00c45b` |
| Negative | `#d60808` | `#f30909` |

Yellow Signal (`#f2f93c`) and Indigo Interactive (`#1817e7`) are identical in both modes. Dark-mode `Navy Pale`/`Navy Fog` step through solid grays rather than navy tints — a genuine asymmetry in Finnomena's own token export, not a simplification made here.

## Typography

The typography strategy uses a single family, **IBM Plex Sans Thai**, across the entire scale — Finnomena doesn't split display/body/label families the way some brands do. The fallback stack is `'IBM Plex Sans Thai', sans-serif`.

- **Display roles** (`display1`–`display3`, `largeTitle`, `quotation1`/`2`): reserved for hero numbers, page titles, and pulled quotes. `display3` is the only bold-weight display role.
- **Title roles** (`title1`–`title3`, `paragraph`): section headings and lead paragraphs.
- **Headline / Body**: `headline` (Medium, 500) and `body` (Regular, 400) share identical size and line-height (17px/22px) — weight alone carries the hierarchy between them.
- **Supporting roles** (`callout`, `subheadline`, `footnote`, `caption1`/`2`): metadata, timestamps, helper text, legal copy — always Regular weight.

Negative letter-spacing dominates the larger sizes (down to `-0.64px` at `display1`/`display2`); the smallest caption roles use slight positive tracking (`caption2` at `0.06px`) for legibility at size.

## Layout

An 8px base grid governs all spacing — every value in the `spacing` scale is a multiple of 8px, with no off-grid exceptions. Related items are grouped with generous internal padding rather than dense stacking; density is comfortable, not compact.

The responsive grid resolves across 7 breakpoint tiers, each with its own sidebar width, gutter, end margins, and column count:

| Tier | Viewport | Sidebar width | Gutter | End margins | Columns |
|---|---|---|---|---|---|
| sm | 320–499 | 0 (hidden) | 16 | 16 | 4 |
| md | 500–987 | 64 (icon-rail) | 16 | 16 | 8 |
| lg | 988–1079 | 64 (icon-rail) | 16 | 16 | 12 |
| xl | 1080–1271 | 240 | 16 | 16 | 12 |
| xxl | 1272–1439 | 320 | 16 | 16 | 12 |
| xxxl | 1440–1919 | 360 | 24 | 24 | 12 |
| max | 1920+ | 360 | 24 | 24 | 12 |

Use the gutter/end-margin/column values above for grid rhythm at each breakpoint rather than inventing a fixed max-width.

## Elevation & Depth

No drop shadows anywhere — depth comes entirely from flat color-and-opacity steps, the same principle Coinbase's own design system uses.

In light mode, surfaces step from Paper White through increasingly visible navy washes: `layer-01`/`layer-02` stay at white, `layer-03` steps to a 5%-opacity navy wash (`#01172b0d`). In dark mode the steps go through solid grays instead of navy tints (`#1a1a1a` → `#333333` → `#404040`) — a genuine asymmetry in Finnomena's export, not a simplification made here. Modal and overlay scrims use `rgba(0,0,0,0.2)` light / `rgba(0,0,0,0.502)` dark.

## Shapes

Radius is used deliberately per component role, not uniformly across the interface — from sharp (`4px`) on small controls up to a fully rounded pill for tags and highlight chips.

| Name | Value |
|---|---|
| none | 0px |
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 40px |
| 4xl | 48px |
| full | 9999px (a full pill at any realistic component height) |

## Components

- **Primary Button** — the default call-to-action across the product. Background Navy Ink (`#01172b` / `#415160` dark), text white. Hover steps to `#1a2e40`, active to `#344555`.
- **Highlight Button / Tag** — the one place Yellow Signal is allowed. Background `#f2f93c`, text `#2b2d01` (dark ink for contrast, not Navy Ink itself). Reserve for a single emphasized action or label per screen, never repeated.
- **Danger Button** — destructive actions. Background `#d60808` in both themes, hover `#ba0707`, active `#9d0606`.
- **Neutral Tag** — the default categorical label when a tag doesn't need highlight treatment. Background Navy Fog (`#f2f3f4`), border Navy Pale (`#d9dcdf`), text Navy Ink.
- **Link** — the only place Indigo Interactive appears as solid text color. Text `#1817e7`, hover `#1414c4` — identical in light and dark mode.
- **Input Field** — form field surfaces. Fill is a near-invisible navy/white wash (`rgba(1,23,43,0.031)` light / equivalent white wash dark), not a solid background; hover deepens slightly to `rgba(1,23,43,0.051)`.
- **Banner / Notification** — inline success/warning/error messaging, using each status color's pastel container wash as background and the solid status color as text.

## Do's and Don'ts

- Do use Navy Ink (`#01172b` light / `#415160` dark) everywhere black would appear in a typical monochrome system — primary buttons, strong borders, the dark end of every surface.
- Do build every neutral step from Navy's own tonal ramp rather than mixing in a separate true-gray family.
- Do reserve Yellow Signal for the brand-highlight button/tag only — one per screen, not a general accent.
- Do reserve Indigo Interactive for links, focus rings, and the interactive-highlight state only.
- Do maintain WCAG AA contrast ratios (4.5:1 for normal text) — text over Yellow Signal must use the dark ink pairing, never Navy Ink or white directly.
- Do keep the 8px-aligned spacing scale — flag a design that seems to need an off-grid value rather than rounding it silently.
- Don't use pure black (`#000000`) anywhere Navy Ink should be used instead — navy is this system's "black."
- Don't use Yellow Signal as a general UI color (nav highlights, arbitrary buttons, backgrounds) — it's a single-purpose signal.
- Don't use Indigo Interactive outside link/focus/interactive-highlight roles.
- Don't invent a second gray family — reuse Navy's own tints for every neutral step.
- Don't add drop shadows to fake depth — elevation is flat color-and-opacity layering only.
- Don't ship dark-mode banners/notifications without confirming container-wash values with design first — Finnomena's own export has historically had gaps in this area.
