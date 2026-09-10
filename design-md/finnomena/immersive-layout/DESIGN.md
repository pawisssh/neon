---
name: Finnomena Neon — Immersive Landing Pages
colors:
  white: "#ffffff"
  text-primary: "#000000d9"
  text-secondary: "#000000a6"
  text-on-color: "#ffffff"
  text-on-brand: "#000000d9"
  border-subtle: "#0000000d"
  border-strong: "#01172b"
  focus: "#6968ef"
  background-primary: "#ffffff"
  background-secondary: "#f2f2f2"
  button-primary: "#01172b"
  button-primary-hover: "#1a2e40"
  button-primary-active: "#344555"
  button-highlight: "#f2f93c"
  button-highlight-hover: "#f4fa59"
  button-highlight-active: "#f5fb6d"
palette:
  yellow:
    "25": "#fcfece"
    "50": "#f9fc9e"
    "75": "#f5fb6d"
    "100": "#f2f93c"
  navy:
    "25": "#c0c5ca"
    "50": "#808b95"
    "75": "#415160"
    "100": "#01172b"
  light-grey:
    "25": "#e9eff2"
    "50": "#d3dfe6"
    "75": "#bccfd9"
    "100": "#a6bfcc"
tiers:
  finno-club: "{colors.white}"
  finno-exclusive: "{palette.yellow.100}"
  finno-private: "{palette.light-grey.100}"
  finno-ultra: "{palette.navy.100}"
typography:
  display2:
    fontFamily: IBM Plex Sans Thai
    fontSize: 60px
    fontWeight: 400
    lineHeight: 70px
    letterSpacing: -0.64px
  largeTitle:
    fontFamily: IBM Plex Sans Thai
    fontSize: 34px
    fontWeight: 400
    lineHeight: 41px
    letterSpacing: 0.4px
  body:
    fontFamily: IBM Plex Sans Thai
    fontSize: 17px
    fontWeight: 400
    lineHeight: 22px
    letterSpacing: -0.43px
  headline:
    fontFamily: IBM Plex Sans Thai
    fontSize: 17px
    fontWeight: 500
    lineHeight: 22px
    letterSpacing: -0.43px
  footnote:
    fontFamily: IBM Plex Sans Thai
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: -0.08px
spacing:
  unit: 8px
  xs: 8px
  sm: 16px
  md: 24px
  3xl: 64px
rounded:
  sm: 8px
components:
  button-primary:
    backgroundColor: "{colors.button-primary}"
    textColor: "{colors.text-on-color}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    minHeight: 48px
    padding: 12px 16px
  button-highlight:
    backgroundColor: "{colors.button-highlight}"
    textColor: "{colors.text-on-brand}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    minHeight: 48px
    padding: 12px 16px
---

# Finnomena Neon — Immersive Landing-Page Guide

Light theme. Use this file alone to design an immersive landing page: the frontmatter defines every available token, and its token references resolve within this file. It is for `ImmersiveLayout` only—campaign landing pages, tier pages, and focused acquisition flows. Product workspaces, forms, tables, data-heavy views, and persistent navigation are out of scope.

## Layout and Header

An immersive page is full-bleed, scrollable content with no Sidebar, Inspector, BottomNav, or persistent utility navigation. Use a white page header with a `border-subtle` bottom rule and the approved full Finnomena wordmark. Keep the wordmark visible at every width; preserve its intrinsic 136 × 32px dimensions and do not redraw or recolor it.

Use the logo-only header. Put the page's primary action in the hero or its relevant section rather than adding header navigation. The header may remain in normal document flow or become sticky only when that preserves orientation without obscuring content.

## Brand & Style

Make complex financial information feel legible, actionable, and forward-looking. Lead with one clear message, concise supporting copy, and one dominant CTA. Do not copy internal brand-narrative wording into public pages unless that wording is supplied in the page brief.

Compose with intentional asymmetry: large editorial typography, broad color fields, a short highlighted phrase, and cropped product or editorial visuals that clarify the offer. Yellow is a strong highlight, not a default for every element. Avoid generic card grids, decorative charts, invented performance claims, testimonials, or fake product data.

## Colors

Use only the colors defined in this file. Do not add another hue family or load a separate token file.

### Core palette

| Color | Hex | Landing-page role |
| --- | --- | --- |
| White | `#FFFFFF` | Main canvas, FinnoClub colorway, and text on navy |
| Navy 100 | `#01172B` | Primary text and CTA fill; FinnoUltra colorway |
| Yellow 100 | `#F2F93C` | Short emphasis, highlight CTA, and FinnoExclusive colorway |
| Light Grey 100 | `#A6BFCC` | Calm full-bleed field and FinnoPrivate colorway |

### Palette intensity

The YAML `palette` provides the permitted 25/50/75/100 levels for landing-page accents, backgrounds, and illustrations. Use the same level consistently within one visual object or section; do not introduce gradients or unlisted colors.

| Level | Use |
| --- | --- |
| 25 | Quiet background tint, recessed illustration area, or low-emphasis decorative layer |
| 50 | Supporting full-bleed background, secondary illustration field, or large visual plane |
| 75 | Secondary accent block, crop mask, or illustration foreground behind readable text |
| 100 | Dominant tier field, high-emphasis illustration block, or the approved primary/highlight control color |

| Hue | 25 | 50 | 75 | 100 |
| --- | --- | --- | --- | --- |
| Yellow | `#FCFECE` | `#F9FC9E` | `#F5FB6D` | `#F2F93C` |
| Navy | `#C0C5CA` | `#808B95` | `#415160` | `#01172B` |
| Light Grey | `#E9EFF2` | `#D3DFE6` | `#BCCFD9` | `#A6BFCC` |

### Essential UI colors

| Token | Hex | Use |
| --- | --- | --- |
| Primary text | `#000000D9` | Main copy on white, yellow, and light grey |
| Secondary text | `#000000A6` | Supporting copy and metadata |
| Subtle border | `#0000000D` | Header and quiet section separators |
| Strong border | `#01172B` | Emphasized boundaries |
| Focus | `#6968EF` | Visible 2px keyboard-focus outline only |
| Secondary background | `#F2F2F2` | Quiet neutral section grouping |
| Primary CTA hover / active | `#1A2E40` / `#344555` | Interactive states for navy buttons |
| Highlight CTA hover / active | `#F4FA59` / `#F5FB6D` | Interactive states for yellow buttons |

For a page dedicated to a service tier, select its required dominant colorway:

| Tier | Dominant colorway | Use |
| --- | --- | --- |
| FinnoClub | White | Open, introductory pages with navy type and controls |
| FinnoExclusive | Yellow 100 | High-energy tier pages with navy text |
| FinnoPrivate | Light Grey 100 | Calm, considered tier pages with navy text |
| FinnoUltra | Navy 100 | Premium tier pages with white text and yellow highlights |

The reference color proportions are illustrative, not fixed layout ratios. On general landing pages, use white as the main canvas; use navy, yellow, and light grey only to establish hierarchy, support illustration blocks, or separate sections. Preserve contrast: navy text on white, yellow, and light grey; white text on navy. Use `focus` only for keyboard focus indicators.

## Typography

Use IBM Plex Sans Thai for Thai and Latin content, with `sans-serif` as the loading fallback. Use `display2` for desktop headlines and `largeTitle` below 500px. Keep body copy short, left-aligned, and readable; use `headline` for CTA text and `footnote` only for supporting information.

## Spacing, Shapes & Depth

Use the 8px spacing unit: `sm` (16px) between related elements, `md` (24px) around local content groups, and `3xl` (64px) between landing-page sections. At mobile widths, retain 16px inline margins and let every section stack vertically. Use the `sm` 8px radius for controls. Create separation with white, light grey, and 1px subtle borders; do not add shadows.

## Components

Use one dominant CTA per task region. Primary CTAs use navy with white text; highlight CTAs use yellow with navy text. Both have a 48px minimum height and retain hover, pressed, disabled, and visible focus states. Do not introduce tertiary action patterns, form fields, filters, tabs, tables, or dashboard controls into this layout.

## Visuals and Responsive Behavior

Use approved brand assets, authentic product imagery, or clearly labeled illustrative examples only when they explain the offer. Keep visuals subordinate to readable copy and avoid presenting an invented screen as an existing product. On wide screens, visuals may overlap or occupy an offset portion of a full-bleed section; on narrow screens, stack copy, CTA, and visual in reading order.

Keep text and controls within the viewport at every width. Do not clip Thai marks, shrink essential text to force a composition, or rely on color alone to communicate meaning. Maintain logical reading and keyboard-focus order. Motion may explain a transition but must not delay reading or operating the page; respect reduced-motion preferences.

## Review Checklist

- The page uses `ImmersiveLayout` only and has a real logo-only header.
- Every section serves the message, evidence, or primary action; there are no workspace controls or decorative data displays.
- Tier-specific pages use their required colorway; general pages use the restrained core palette.
- Hero, CTA, and imagery remain clear at desktop and mobile widths with 16px mobile inline margins.
- Text contrast, focus visibility, touch targets, keyboard order, and reduced-motion behavior are usable.
