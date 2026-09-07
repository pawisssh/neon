# Finnomena — Style Reference

> Navy Ledger. A monochrome financial system where navy ink stands in for black on every surface — primary buttons, strong borders, headings — broken only by a single yellow signal reserved for the one moment that should stand out.

**Theme:** light + dark (both fully defined)

Finnomena's system is built on restraint — one dominant "ink" color doing almost all the structural work, chromatic color kept rare and rule-bound — using a deep navy (`#01172b`) in place of black. Every neutral step in the interface, from the darkest button to the faintest field wash, is a tint of that same navy hue rather than a separate gray family, giving the system a tonal, financial-ledger consistency instead of true black-and-white starkness. Two colors are permitted outside that navy scale, each confined to a single job: a saturated yellow (`#f2f93c`) for the brand-highlight moment, and an indigo (`#1817e7`) for links, focus rings, and the interactive-highlight state. Neither is a general-purpose accent — using either outside its one role breaks the discipline the whole system depends on.

## Tokens — Colors

| Name | Light | Dark | Token | Role |
|------|-------|------|-------|------|
| Navy Ink | `#01172b` | `#415160` | `Button.button-primary` | Primary buttons, strong borders — the anchor color that plays black's role in this system |
| Navy Ink Hover | `#1a2e40` | `#5a6875` | `Button.button-primary-hover` | Primary button hover |
| Navy Ink Active | `#344555` | `#808b95` | `Button.button-primary-active` | Primary button pressed |
| Navy Pale | `#d9dcdf` | `#404040`* | `Navy.15` | Subtle borders, secondary tag backgrounds, skeleton elements |
| Navy Fog | `#f2f3f4` | `#1a1a1a`* | `Navy.5` / `Layer.layer-01` | Field fill, subtle section wash, surface level 1 |
| Paper White | `#ffffff` | `#000000` | `Background.background-primary` | Page background (light) / primary surface (dark) |
| Ink on Paper | `#000000d9` (85% black) | `#ffffff` | `Text.text-primary` | Primary text — note this is 85%-opacity black over white, not the navy itself, and not pure black |
| Yellow Signal | `#f2f93c` | `#f2f93c` | `Background.background-brand`, `Button.button-highlight` | The one chromatic accent — brand mark, highlight button/tag. Single-purpose, never a general UI color |
| Indigo Interactive | `#1817e7` | `#1817e7` | `Link.link-primary`, `Focus.focus` | Links, focus rings, interactive-highlight — the only other non-navy color permitted in UI |
| Positive | `#009646` | `#00c45b` | `Text.text-positive` | Success states only |
| Negative | `#d60808` | `#f30909` | `Text.text-negative` | Error states only |

\* Dark-mode `Navy Pale`/`Navy Fog` roles above are drawn from `Layer`'s dark values, which step through solid grays rather than navy tints (see Elevation) — the raw `Navy` family itself doesn't branch for dark mode in the current export.

**Data gap, not a design choice:** dark-mode `Status.*` and `Notifications.*` all resolve to flat white in the current export — likely an incomplete dark-mode pass for those two groups, not an intentional look. Confirm with design before shipping dark-mode status/notification UI.

## Tokens — Typography

### Finnomena Trek — the brand's single named font across the entire type scale; Finnomena doesn't split display/body/text families the way some brands do · `--font-finnomena-trek`
- **Substitute:** `'IBM Plex Sans Thai', sans-serif` (Finnomena Trek isn't packaged as a web font in this repo)
- **Weights:** Regular, Medium, Bold (export variant names, not verified against either font's real weight set)
- **Role:** every role in the type scale below, from caption to display

### Type Scale
Source: `theme/tokens/type_primitives.json`, "Large (Default)" web size class.

| Role | Size | Line Height | Letter Spacing | Weight |
|------|------|-------------|-----------------|--------|
| display1 | 92px | 102px | -0.64 | Regular |
| display2 | 60px | 70px | -0.64 | Regular |
| display3 | 54px | 64px | 0 | Bold |
| largeTitle | 34px | 41px | 0.4 | Regular |
| quotation1 | 42px | 50px | 0 | Regular |
| title1 / paragraph | 28px | 34px / 36px | 0.38 / 0 | Regular |
| quotation2 | 24px | 30px | 0 | Regular |
| title2 | 22px | 28px | -0.26 | Regular |
| title3 | 20px | 25px | -0.45 | Regular |
| headline | 17px | 22px | -0.43 | Medium |
| body | 17px | 22px | -0.43 | Regular |
| callout | 16px | 21px | -0.31 | Regular |
| subheadline | 15px | 20px | -0.23 | Regular |
| footnote | 13px | 18px | -0.08 | Regular |
| caption1 | 12px | 16px | 0 | Regular |
| caption2 | 11px | 13px | 0.06 | Regular |

## Tokens — Spacing & Shapes

**Base unit:** 8px
**Density:** comfortable

### Spacing Scale
| Name | Value | Token |
|------|-------|-------|
| 8 | 8px | `--spacing-8` |
| 16 | 16px | `--spacing-16` |
| 24 | 24px | `--spacing-24` |
| 32 | 32px | `--spacing-32` |
| 40 | 40px | `--spacing-40` |
| 48 | 48px | `--spacing-48` |
| 64 | 64px | `--spacing-64` |
| 96 | 96px | `--spacing-96` |
| 128 | 128px | `--spacing-128` |

(Full scale runs 0–288px in fixed 8px-aligned steps — see `theme/tokens/size.json`. A handful of raw export values — 1, 2, 4, 6, 12, 28, 36px — aren't multiples of 8 and are excluded; treat a design that seems to need one as a signal to confirm with design, not round it.)

### Border Radius
| Name | Value |
|------|-------|
| none | 0 |
| xs | 4px |
| sm | 8px |
| md | 12px |
| lg | 16px |
| xl | 24px |
| 2xl | 32px |
| 3xl | 40px |
| 4xl | 48px |
| round | 200px (a full pill at any realistic component height) |

Per-component radius (which CDS component uses which named step) comes from CDS's own component defaults unless explicitly overridden — that mapping isn't part of this token export, so don't invent one.

### Layout
- **Page max-width / grid / breakpoints:** not yet exported — `theme/tokens.report.json`'s `missingRootCollections` lists these as still missing. Use CDS's own default responsive layout system until Finnomena-specific grid tokens land; don't invent a max-width or grid rhythm here.

## Components

Real `@coinbase/cds-web` components, themed with the values above. Exact prop names aren't verified in this repo (`@coinbase/cds-web` isn't installed here) — confirm via this project's `cds-code`/`cds-docs` skills before writing component code.

### Primary Button
**Role:** the default call-to-action across the product.

Background `Navy Ink` (`#01172b` / `#415160` dark), text `Ink on Paper` inverted (white on the dark fill). Hover steps to `Navy Ink Hover`, active to `Navy Ink Active`. Radius and padding come from CDS's own Button defaults.

### Highlight Button / Tag
**Role:** the one place `Yellow Signal` is allowed — reserve it for a single emphasized action or label per screen, never repeated across a page.

Background `#f2f93c`, text `#2b2d01` (a dark ink for contrast against the bright fill, not `Navy Ink` itself).

### Danger Button
**Role:** destructive actions.

Background `#d60808` in both themes, hover `#ba0707`, active `#9d0606`.

### Tag (neutral)
**Role:** default categorical label when a tag doesn't need the highlight treatment.

Background `Navy Fog` (`#f2f3f4`), border `Navy Pale` (`#d9dcdf`), text `Navy Ink`.

### Link
**Role:** the only place `Indigo Interactive` appears as solid text color.

Text `#1817e7`, hover `#1414c4` — identical in light and dark mode.

### TextInput / Field
**Role:** form field surfaces.

Fill is a near-invisible navy/white wash (`#01172b08` light / `#ffffff08` dark), not a solid background — hover deepens slightly (`#01172b0d` / `#ffffff0d`).

### Banner / Notification
**Role:** inline success/warning/error/info messaging.

Light mode has distinct pastel backgrounds per type (success `#e6fdf0`, warning `#fef7f3`, error `#fff5f5`). Dark mode currently resolves all of these to flat white — see the Colors section data gap above; don't ship dark-mode banners against this data without confirming with design.

### Card / Layer surfaces
**Role:** container elevation, via flat surface steps rather than shadows — see Elevation below.

## Do's and Don'ts

### Do
- Use `Navy Ink` (`#01172b` light / `#415160` dark) everywhere black would appear in a typical monochrome system — primary buttons, strong borders, the dark end of every surface.
- Build every neutral step from Navy's own tonal ramp rather than mixing in a separate true-gray family.
- Reserve `Yellow Signal` for the brand-highlight button/tag and `background-brand` only — one per screen, not a general accent.
- Reserve `Indigo Interactive` for links, focus rings, and the interactive-highlight state only.
- Route every color, space, and radius value through CDS's semantic style props (`color="textPrimary"`, `padding="medium"`) — never a raw hex or pixel value in JSX/CSS-in-JS.
- Keep provider order exactly `MediaQueryProvider → ThemeProvider → PortalProvider`.
- Route custom, non-`ThemeVars` tokens through `ThemeVarsExtended` rather than bolting extra keys onto the theme object.

### Don't
- Don't use pure black (`#000000`) anywhere `Navy Ink` should be used instead — navy is this system's "black."
- Don't use `Yellow Signal` as a general UI color (nav highlights, arbitrary buttons, backgrounds) — it's a single-purpose signal.
- Don't use `Indigo Interactive` outside link/focus/interactive-highlight roles.
- Don't invent a second gray family — reuse Navy's own tints for every neutral step.
- Don't invent spacing values outside the defined 8px-aligned scale; flag a design that needs 1/2/4/6/12/28/36px instead of rounding it.
- Don't ship dark-mode Status/Notifications UI on the current token values without confirming with design first (real data gap, not intentional).
- Don't repurpose a color/spacing token to hack a component-specific look — use `ComponentConfigProvider` for component-level default overrides instead.

## Elevation

No shadows — depth comes entirely from flat color-and-opacity steps, the same principle Coinbase uses. In light mode, surfaces step from `Paper White` through increasingly visible navy washes (`layer01`/`layer02` at white, `layer03` at `#01172b0d`). In dark mode the steps go through solid grays instead of navy tints (`#1a1a1a` → `#333333` → `#404040`) — a genuine asymmetry in the export, not a simplification made here.

## Imagery

Not defined by the current token export — the Figma file supplies design tokens only, not illustration or photography direction. Don't invent an imagery style; confirm with design before adding illustrations or photography to Finnomena UI.

## Agent Prompt Guide

Build UI through CDS components and semantic style props — the hex values below are for reference, not for hardcoding.

### Quick Color Reference
- **Text:** `textPrimary` (→ `#000000d9` light / `#ffffff` dark)
- **Background:** `backgroundPrimary` (→ `#ffffff` light / `#000000` dark)
- **Primary button:** `buttonPrimary` (→ `#01172b` light / `#415160` dark)
- **Brand accent:** `backgroundBrand` (→ `#f2f93c`, single-purpose)
- **Link:** `linkPrimary` (→ `#1817e7`)

### Example Component Prompts
1. **Primary CTA:** "Render a CDS `Button` with the primary variant and label 'Get started.' Use the theme's default `buttonPrimary` background and `textOnColor` text — this should render as navy, not black, without any hardcoded hex."
2. **Brand highlight moment:** "This screen has exactly one action that should carry brand emphasis — render that single `Button` with the highlight variant. Every other button on the screen stays primary/secondary navy; don't repeat the highlight variant elsewhere on the page."
3. **Neutral tag list:** "Render a row of CDS `Tag` components using the default neutral variant (navy-on-fog) for category labels — reserve the highlight/yellow tag variant for the one tag that should stand out, if any."

## Similar Brands

A stylistic comparison, not a claim about Finnomena's actual relationships or sourcing:

- **American Express** — the closest direct parallel: a deep navy field paired with a single warm gold/yellow accent, in the same financial-services register.
- **Wise** — a mostly neutral palette with one saturated accent color reserved for brand moments rather than spread across every interactive element.
- **Linear** — a dark, near-monochrome neutral doing most of the interface work, with a single accent used sparingly.

## Quick Start

This is a CDS-themed app, not a raw-CSS site — there's no CSS custom properties or Tailwind config to copy. Wire the theme through CDS's provider stack:

```tsx
import { MediaQueryProvider } from '@coinbase/cds-web/system';
import { ThemeProvider } from '@coinbase/cds-web/system';
import { PortalProvider } from '@coinbase/cds-web/portal';
import { companyTheme } from './theme/theme.config';

export function AppRoot({ children }: { children: React.ReactNode }) {
  return (
    <MediaQueryProvider>
      <ThemeProvider theme={companyTheme}>
        <PortalProvider>{children}</PortalProvider>
      </ThemeProvider>
    </MediaQueryProvider>
  );
}
```

See `examples/app-entry.tsx` for the full working pattern, including font loading. `companyTheme` in `theme/theme.config.ts` resolves every raw token in this document into CDS's `ThemeVars` shape — regenerate it with `node scripts/sync-tokens.mjs && node scripts/generate-theme-config.mjs` after changing anything in `theme/tokens/`.
