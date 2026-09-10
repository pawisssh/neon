---
name: Finnomena Neon — Immersive Landing Pages
colors:
  white: "#ffffff"
  navy-100: "#01172b"
  yellow-100: "#f2f93c"
  light-grey-100: "#a6bfcc"
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
tiers:
  finno-club: "{colors.white}"
  finno-exclusive: "{colors.yellow-100}"
  finno-private: "{colors.light-grey-100}"
  finno-ultra: "{colors.navy-100}"
typography:
  hero:
    fontFamily: IBM Plex Sans Thai
    fontSize: 60px
    fontWeight: 400
    lineHeight: 70px
    letterSpacing: -0.64px
  mobile-hero:
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
  label:
    fontFamily: IBM Plex Sans Thai
    fontSize: 17px
    fontWeight: 500
    lineHeight: 22px
    letterSpacing: -0.43px
  metadata:
    fontFamily: IBM Plex Sans Thai
    fontSize: 13px
    fontWeight: 400
    lineHeight: 18px
    letterSpacing: -0.08px
spacing:
  unit: 8px
  related: 16px
  content: 24px
  section: 64px
  mobile-inline: 16px
components:
  button-primary:
    backgroundColor: "{colors.button-primary}"
    textColor: "{colors.text-on-color}"
    minHeight: 48px
    padding: 12px 16px
  button-highlight:
    backgroundColor: "{colors.button-highlight}"
    textColor: "{colors.text-on-brand}"
    minHeight: 48px
    padding: 12px 16px
---

# Finnomena Neon — Immersive Landing-Page Guide

Use this guide for `ImmersiveLayout` only: campaign landing pages, tier pages, and focused acquisition flows. It is intentionally minimal. Use the general Finnomena guide for product workspaces, forms, tables, data-heavy views, or persistent navigation.

## Layout and Header

An immersive page is full-bleed, scrollable content with no Sidebar, Inspector, BottomNav, or persistent utility navigation. Use a white page header with a `border-subtle` bottom rule and the approved full Finnomena wordmark. Keep the wordmark visible at every width; preserve its intrinsic 136 × 32px dimensions and do not redraw or recolor it.

Use the logo-only header. Put the page's primary action in the hero or its relevant section rather than adding header navigation. The header may remain in normal document flow or become sticky only when that preserves orientation without obscuring content.

## Editorial Direction

Make complex financial information feel legible, actionable, and forward-looking. Lead with one clear message, concise supporting copy, and one dominant CTA. Do not copy internal brand-narrative wording into public pages unless that wording is supplied in the page brief.

Compose with intentional asymmetry: large editorial typography, broad color fields, a short highlighted phrase, and cropped product or editorial visuals that clarify the offer. Yellow is a strong highlight, not a default for every element. Avoid generic card grids, decorative charts, invented performance claims, testimonials, or fake product data.

## Color and Tier Colorways

Use only the frontmatter colors. Their primitive values come from `theme/tokens/colors.json`; the tier names correspond to the color aliases exported by `theme/tokens/theme.json`.

For a page dedicated to a service tier, select its required dominant colorway:

| Tier | Dominant colorway | Use |
| --- | --- | --- |
| FinnoClub | White | Open, introductory pages with navy type and controls |
| FinnoExclusive | Yellow 100 | High-energy tier pages with navy text |
| FinnoPrivate | Light Grey 100 | Calm, considered tier pages with navy text |
| FinnoUltra | Navy 100 | Premium tier pages with white text and yellow highlights |

The reference color proportions are illustrative, not fixed layout ratios. On general landing pages, use white as the main canvas; use navy, yellow, and light grey only to establish hierarchy, support illustration blocks, or separate sections. Preserve contrast: navy text on white, yellow, and light grey; white text on navy. Use `focus` only for keyboard focus indicators.

## Type, Spacing, and CTA

Use IBM Plex Sans Thai for Thai and Latin content, with `sans-serif` as the loading fallback. Use `hero` for desktop headlines and `mobile-hero` below 500px. Keep body copy short, left-aligned, and readable; use `label` for CTA text and `metadata` only for supporting information.

Use the 8px spacing unit, 16px between related elements, 24px around local content groups, and 64px between landing-page sections. At mobile widths, retain 16px inline margins and let every section stack vertically.

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
