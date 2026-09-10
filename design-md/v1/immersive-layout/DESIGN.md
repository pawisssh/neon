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
  finnomena-club: "{colors.white}"
  finnomena-exclusive: "{palette.yellow.100}"
  finnomena-private: "{palette.light-grey.100}"
  finnomena-ultra: "{palette.navy.100}"
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
| White | `#FFFFFF` | Main canvas, Finnomena Club colorway, and text on navy |
| Navy 100 | `#01172B` | Primary text and CTA fill; Finnomena Ultra colorway |
| Yellow 100 | `#F2F93C` | Short emphasis, highlight CTA, and Finnomena Exclusive colorway |
| Light Grey 100 | `#A6BFCC` | Calm full-bleed field and Finnomena Private colorway |

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

### Extended palette: tint, shade & opacity

The levels tabled above are steps on a larger scale every brand hue shares. `100` is a hue's pure tone — where the Exclusive, Private, and Ultra colorways sit. Steps below 100 tint it toward white, where `0` is white; Club's White colorway is that `0` end of the same scale. Steps above 100 shade the tone toward black. Each hue also carries opacity variants of its `100` tone, written with an `A` suffix: `10A` is that tone at 10% alpha, for a scrim over a media frame or an overlay wash — never as a substitute for a solid tint or shade.

The 25/50/75/100 levels are the ones permitted for landing-page fields, accents, and illustrations, and the table above is their complete value list. The underlying scale is finer — 5-unit increments from 0 to 200, with alpha variants at matching increments — and the wider brand set (Grey, Green, Blue, Purple, Red, Orange, Indigo) carries the same structure. Reach past the permitted range only for a case this file genuinely doesn't cover, such as a deep shaded illustration backing, and pull the exact hex for that step from the design system's color foundations rather than approximating it. Grey is the one exception to the structure: it stops at `100`, which is already pure black, and carries no alpha variants — shade or fade a neutral with Navy instead.

Keep one hue and one step consistent within a single visual object, illustration, or accent block; stepping between levels to fake a gradient is still a gradient. Tier colorways stay limited to White, Yellow 100, Navy 100, and Light Grey 100 as documented above. The wider hue set and its shade/opacity extensions are for Multi-asset colors visuals only — never page backgrounds, CTAs, or tier fields — and multi-asset categories keep their dedicated `multi-assets` tokens rather than an ad hoc palette pick.

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
| Finnomena Club | White | Open, introductory pages with navy type and controls |
| Finnomena Exclusive | Yellow 100 | High-energy tier pages with navy text |
| Finnomena Private | Light Grey 100 | Calm, considered tier pages with navy text |
| Finnomena Ultra | Navy 100 | Premium tier pages with white text and yellow highlights |

On general landing pages — those not dedicated to a tier — use white as the main canvas; use navy, yellow, and light grey only to establish hierarchy, support illustration blocks, or separate sections. Preserve contrast: navy text on white, yellow, and light grey; white text on navy. Use `focus` only for keyboard focus indicators.

### Tier color proportions

Each tier favours its colorway as a share of the page's visible surface, not merely as a presence somewhere on it. Compose toward the balance below; treat it as a target, not a measured ratio. A tier page whose dominant colour reads as only half its surface has drifted off-tier, and one that uses the colorway as a single band has not adopted it at all.

| Tier | Dominant (~60%) | Supporting | Accent | Ink (~10%) |
| --- | --- | --- | --- | --- |
| Finnomena Club | White | Light Grey 100 (~15%) | Yellow 100 (~15%) | Navy 100 |
| Finnomena Exclusive | Yellow 100 | Light Grey 100 (~30%) | — | Navy 100 |
| Finnomena Private | Light Grey 100 | Yellow 100 (~30%) | — | Navy 100 |
| Finnomena Ultra | Navy 100 | Light Grey 100 (~15%) | Yellow 100 (~15%) | White |

- **Dominant** is the page's field: full-bleed section backgrounds, the hero surface, and any large media mask. It should be the first colour a viewer would name.
- **Supporting** breaks that field into readable sections — a secondary band, a media-frame backing, an illustration plane. Club and Ultra split this share with the accent; Exclusive and Private give the whole share to one hue.
- **Accent** is a short, deliberate highlight: a marked phrase behind the headline, the tier label, or one emphasis rule. Never a whole section.
- **Ink** is type, hairlines, and the wordmark. It stays the smallest share even though it appears on every screen.

Two rules follow from the ratios:

- **The accent inverts when it becomes the field.** Yellow marks the headline on Club, Private, and Ultra. On Exclusive, where Yellow is the dominant field, that mark switches to Light Grey or Navy — never yellow on yellow. This governs fields and headline marks only; a highlight CTA still uses `button-highlight` per its component rule.
- **Ink and field never swap share.** Ultra is Navy-dominant with White ink at the smallest share, and Club is its mirror. Inverting which colour is the field does not license inverting the proportions.

In the reference layouts, photography on every tier is monochrome or tinted toward the tier field rather than full colour, so imagery reinforces the dominant share instead of introducing a fifth hue.

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
| Light | `https://raw.githubusercontent.com/pawisssh/neon/main/templates/vitejs-cds/src/assets/logo/logo-finnomena-text-light.svg` |
| Dark tier field | `https://raw.githubusercontent.com/pawisssh/neon/main/templates/vitejs-cds/src/assets/logo/logo-finnomena-text-dark.svg` |

### Primary and highlight CTA

Use one dominant CTA per task region. Primary CTAs use `button-primary` with `text-on-color`; highlight CTAs use `button-highlight` with `text-on-brand`. Both use `body` typography, `rounded.sm`, 48px minimum height, 12px × 16px padding, and a visible `focus` outline. Use their documented hover and active colors; retain clear disabled labels when unavailable. CTA labels describe the outcome, such as “Open an account,” rather than using generic wording.

### Tier label

Use a compact text label such as “Finnomena Exclusive” above the hero or proof content when the page is tier-specific. Pair it with the tier name in text and the required tier colorway; never communicate tier identity by color alone. Keep it secondary to the page headline and do not turn it into a navigation control.

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
- Tier-specific pages use their required colorway at roughly its documented proportion, with the accent inverted where the tier's own hue is the field; general pages use the restrained core palette.
- Multi-asset visuals use only their named category colors, visible labels, and values.
- Hero, CTA, and imagery remain clear at desktop and mobile widths with 16px mobile inline margins.
- Text contrast, focus visibility, touch targets, keyboard order, and reduced-motion behavior are usable.
- Every used component follows its component rule; proof content is supplied, supported, or clearly illustrative.
- The page follows one approved hero composition, varied section rhythm, and the anti-pattern rules.
