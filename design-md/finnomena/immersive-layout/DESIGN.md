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
multi-assets:
  cryptocurrency: "#8f0606"
  crowdfunding: "#d60808"
  p2p-lending: "#ba4a0a"
  thai-equity: "#1211ad"
  equity: "#aa46c3"
  mutual-fund: "#01172b"
  gold: "#f1f92d"
  tax-saving: "#50cfff"
  esavings: "#40ed90"
  cash: "#007435"
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

### Approved hero compositions

Choose one composition; do not default to a centered headline above a generic image.

- **Offset split:** Left-aligned copy with a right-side product or editorial visual in a 3:2 or 2:1 grid.
- **Tier field:** A full-bleed tier colorway with copy anchored to one edge and a product visual contained in its own visual zone.
- **Asymmetric whitespace:** A large clear text field balanced by one cropped editorial image or illustration at the opposite edge.

Hero copy, CTA, and essential product detail must occupy their own readable zone. Visual layers may overlap inside the dedicated visual zone only; they must never obscure text, controls, focus rings, or one another's essential content.

## Brand & Style

Make complex financial information feel legible, actionable, and forward-looking. Lead with one clear message, concise supporting copy, and one dominant CTA. Do not copy internal brand-narrative wording into public pages unless that wording is supplied in the page brief.

Compose with intentional asymmetry: large editorial typography, broad color fields, a short highlighted phrase, and cropped product or editorial visuals that clarify the offer. Yellow is a strong highlight, not a default for every element. Avoid generic card grids, decorative charts, invented performance claims, testimonials, or fake product data.

### Creative direction

Use editorial variance **7/10**, airy density **3/10**, and motion intent **2/10**. This means confident scale contrast, composed empty space, and varied visual rhythm—not extra colors, dense interface chrome, or theatrical effects. Between adjacent sections, vary at least two of alignment, field color, visual crop, or column proportion. Use 2:1, 3:2, or offset compositions; never use an equal three-card feature row.

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

### Multi-asset colors

Use `multi-assets` only for the named investment category in a labeled allocation, comparison, or educational visual. Pair each color with its category name and value; color must never be the only identifier. Use dark labels beside Gold and E-savings. Do not use multi-asset colors as decorative page fields, CTAs, or tier colorways.

## Typography

Use IBM Plex Sans Thai for Thai and Latin content, with `sans-serif` as the loading fallback. Use `display2` for desktop headlines and `largeTitle` below 500px. Keep display headlines concise enough to read in two or three lines; create hierarchy through line breaks, weight, and color rather than extra words. Keep body copy left-aligned, concrete, and within a readable measure of about 65 characters. Use `headline` for CTA text and `footnote` only for supporting information.

## Spacing, Shapes & Depth

Use the 8px spacing unit: `sm` (16px) between related elements, `md` (24px) around local content groups, and `3xl` (64px) between landing-page sections. At mobile widths, retain 16px inline margins and let every section stack vertically. Use the `sm` 8px radius for controls. Create separation with white, light grey, and 1px subtle borders; do not add shadows.

## Components

Use only the components below. Forms, filters, tabs, tables, dashboard panels, equal card grids, and persistent navigation are out of scope.

### Logo header

Use the approved full Finnomena wordmark, never recreated text. Keep it in the logo-only header with a white `background-primary` surface and `border-subtle` bottom rule. The wordmark is 136 × 32px, has `alt="Finnomena"`, and remains visible at every width. Do not add sidebar, icon-rail, or persistent navigation behavior.

| Header surface | Full wordmark |
| --- | --- |
| Light | `https://raw.githubusercontent.com/pawisssh/neon/main/starters/vitejs-cds/src/assets/logo/logo-finnomena-text-light.svg` |
| Dark tier field | `https://raw.githubusercontent.com/pawisssh/neon/main/starters/vitejs-cds/src/assets/logo/logo-finnomena-text-dark.svg` |

### Primary and highlight CTA

Use one dominant CTA per task region. Primary CTAs use `button-primary` with `text-on-color`; highlight CTAs use `button-highlight` with `text-on-brand`. Both use `body` typography, `rounded.sm`, 48px minimum height, 12px × 16px padding, and a visible `focus` outline. Use their documented hover and active colors; retain clear disabled labels when unavailable. CTA labels describe the outcome, such as “Open an account,” rather than using generic wording.

### Tier label

Use a compact text label such as “FinnoExclusive” above the hero or proof content when the page is tier-specific. Pair it with the tier name in text and the required tier colorway; never communicate tier identity by color alone. Keep it secondary to the page headline and do not turn it into a navigation control.

### Proof block

Use one to three source-supported facts, benefits, or process steps directly below a relevant message. Separate entries with whitespace or `border-subtle` dividers rather than card containers. Each item has a concise label and supporting detail; identify examples clearly and do not invent testimonials, financial results, or customer claims.

### Media frame

Use a bounded visual zone for approved product screens, editorial imagery, or illustrations. Preserve an intentional crop, provide meaningful alt text, and keep the visual separate from copy and controls. The frame may use the selected tier field or palette levels behind the asset, but must not use multi-asset colors unless the image is a labeled category visual.

### Compact footer

Use an optional white footer with a `border-subtle` top rule for supplied legal, support, or secondary information. Keep links descriptive, keyboard-operable, and visually secondary. Do not repeat primary navigation, add a second dominant CTA, or invent legal links.

## Visuals and Responsive Behavior

Use approved brand assets, authentic product imagery, or clearly labeled illustrative examples only when they explain the offer. Keep visuals subordinate to readable copy and avoid presenting an invented screen as an existing product. On wide screens, visuals may occupy an offset portion of a full-bleed section; on narrow screens, stack copy, CTA, and visual in reading order.

Keep text and controls within the viewport at every width. At 375px and above, every asymmetric composition becomes a strict single column with 16px inline margins and no horizontal overflow. Do not clip Thai marks, shrink essential text to force a composition, or rely on color alone to communicate meaning. Maintain logical reading and keyboard-focus order.

## Motion & Interaction

Default to still content. When motion clarifies a state change or maintains orientation, use a short opacity or transform transition only. Respect reduced-motion preferences. Do not use perpetual loops, scroll hijacking, parallax, gradient animation, glows, decorative effects, or animation that delays reading or operating the page.

## Anti-Patterns

- No centered, generic hero; no equal three-card feature row; no dashboard-style panels.
- No gradients, outer glows, shadows, or unlisted colors.
- No text, CTAs, or focus states obscured by imagery or visual layers.
- No filler scroll instructions, fake metrics, unsupported performance claims, invented testimonials, or generic campaign clichés.
- No automatic animation, horizontal mobile overflow, clipped Thai text, or reduced-motion violations.

## Review Checklist

- The page uses `ImmersiveLayout` only and has a real logo-only header.
- Every section serves the message, evidence, or primary action; there are no workspace controls or decorative data displays.
- Tier-specific pages use their required colorway; general pages use the restrained core palette.
- Multi-asset visuals use only their named category colors, visible labels, and values.
- Hero, CTA, and imagery remain clear at desktop and mobile widths with 16px mobile inline margins.
- Text contrast, focus visibility, touch targets, keyboard order, and reduced-motion behavior are usable.
- Every used component follows its component rule; proof content is supplied, supported, or clearly illustrative.
- The page follows one approved hero composition, varied section rhythm, and the anti-pattern rules.
