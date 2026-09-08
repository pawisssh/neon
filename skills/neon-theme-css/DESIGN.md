# Finnomena — Style Reference (CSS Variables)

> Navy Ledger. A monochrome financial system where navy ink stands in for black on every surface — primary buttons, strong borders, headings — broken only by a single yellow signal reserved for the one moment that should stand out.

**Theme:** light + dark (both fully defined) · **Path:** plain CSS custom properties via `theme.css` — no `@coinbase/cds-web`, no React provider, no components.

Finnomena's system is built on restraint — one dominant "ink" color doing almost all the structural work, chromatic color kept rare and rule-bound — using a deep navy (`#01172b`) in place of black. Every neutral step in the interface, from the darkest button to the faintest field wash, is a tint of that same navy hue rather than a separate gray family. Two colors are permitted outside that navy scale, each confined to a single job: a saturated yellow (`#f2f93c`) for the brand-highlight moment, and an indigo (`#1817e7`) for links, focus rings, and the interactive-highlight state.

This document describes the same brand system as `../neon-theme/DESIGN.md`, reframed around the actual `--color-*`/`--space-*`/`--borderRadius-*`/`--fontFamily-*`/`--fontSize-*`/`--fontWeight-*`/`--lineHeight-*` variables `theme.css` ships — not CDS component props. Every value below is copied directly from `theme.css`, which is itself the real, byte-exact output of `@coinbase/cds-web`'s own `createThemeCssVars()` (see `theme.css`'s own header) — nothing here is re-derived or approximated.

## Tokens — Colors

All variables below live in `theme.css`'s `:root` block (light) and its `@media (prefers-color-scheme: dark)` / `:root[data-theme='dark']` blocks (dark). "Source" cites the Finnomena role each one maps to, per `../neon-theme/theme/color-overrides.ts`'s own inline comments — the same human-reviewed mapping this file's values were generated from.

### Foreground
| Variable | Light | Dark | Source |
|---|---|---|---|
| `--color-fg` | `rgba(0,0,0,0.851)` | `rgb(255,255,255)` | Ink on Paper — `Text.text-primary` |
| `--color-fgMuted` | `rgba(0,0,0,0.651)` | `rgba(255,255,255,0.651)` | `Text.text-secondary` |
| `--color-fgInverse` | `rgb(255,255,255)` | `rgba(0,0,0,0.851)` | `Text.text-inverse` |
| `--color-fgPrimary` | `rgb(1,23,43)` | `rgb(65,81,96)` | **Navy Ink** — the system's "black" |
| `--color-fgWarning` | `rgb(242,100,20)` | `rgb(242,100,20)` | `Support.support-warning` |
| `--color-fgPositive` | `rgb(0,150,70)` | `rgb(0,196,91)` | Positive — success text only |
| `--color-fgNegative` | `rgb(214,8,8)` | `rgb(243,9,9)` | Negative — error text only |

### Background
| Variable | Light | Dark | Source |
|---|---|---|---|
| `--color-bg` | `rgb(255,255,255)` | `rgb(0,0,0)` | Paper White — page background |
| `--color-bgAlternate` | `rgb(242,242,242)` | `rgb(26,26,26)` | `Background.background-secondary` |
| `--color-bgInverse` | `rgb(0,0,0)` | `rgb(255,255,255)` | `Background.background-inverse` |
| `--color-bgOverlay` | `rgba(0,0,0,0.2)` | `rgba(0,0,0,0.502)` | Modal/overlay scrim |
| `--color-bgElevation1` | `rgb(255,255,255)` | `rgb(26,26,26)` | `Layer.layer-01` |
| `--color-bgElevation2` | `rgb(255,255,255)` | `rgb(51,51,51)` | `Layer.layer-02` |
| `--color-bgPrimary` | `rgb(1,23,43)` | `rgb(65,81,96)` | **Navy Ink** — primary buttons, strong fills |
| `--color-bgPrimaryWash` | `rgb(242,243,244)` | `rgb(242,243,244)` | Navy Fog — mode-independent per Finnomena's export |
| `--color-bgSecondary` | `rgb(242,242,242)` | `rgb(26,26,26)` | `Background.background-secondary` |
| `--color-bgTertiary` | `rgb(255,255,255)` | `rgb(38,38,38)` | `Background.background-tertiary` |
| `--color-bgSecondaryWash` | `rgb(247,248,249)` | `rgb(20,21,25)` | *CDS default — no Finnomena role names this concept* |
| `--color-bgNegative` | `rgb(214,8,8)` | `rgb(243,9,9)` | Negative fill (danger buttons) |
| `--color-bgNegativeWash` | `rgb(255,245,245)` | *CDS default* | `Notifications.notification-error-background` (dark: known Finnomena export gap — see Colors caveat below) |
| `--color-bgPositive` | `rgb(0,173,80)` | `rgb(0,173,80)` | `Support.support-success` |
| `--color-bgPositiveWash` | `rgb(230,253,240)` | *CDS default* | `Notifications.notification-success-background` (same dark-mode gap) |
| `--color-bgWarning` | `rgb(242,100,20)` | `rgb(242,100,20)` | `Support.support-warning` |
| `--color-bgWarningWash` | `rgb(254,247,243)` | *CDS default* | `Notifications.notification-warning-background` (same dark-mode gap) |

### Border / Line
| Variable | Light | Dark | Source |
|---|---|---|---|
| `--color-bgLine` | `rgba(0,0,0,0.051)` | `rgba(255,255,255,0.149)` | `Border.border-subtle` |
| `--color-bgLineHeavy` | `rgba(91,97,110,0.66)` | `rgba(138,145,158,0.66)` | *CDS default — no Finnomena role names this concept* |
| `--color-bgLineInverse` | `rgb(255,255,255)` | `rgb(0,0,0)` | `Border.border-inverse` |
| `--color-bgLinePrimary` | `rgb(105,104,239)` | `rgb(105,104,239)` | **Indigo Interactive** — links, focus rings |
| `--color-bgLinePrimarySubtle` | `rgb(115,162,255)` | `rgb(5,59,177)` | *CDS default — no Finnomena role names this concept* |

### Accent spectrum
`--color-accentSubtle{Red,Green,Blue,Purple,Yellow,Gray}` / `--color-accentBold{Red,Green,Blue,Purple,Yellow,Gray}` — identical light/dark (Finnomena's primitive palette isn't mode-branched). Red/Green/Blue/Purple/Yellow come straight from Finnomena's same-named color families (see `theme.css` for exact values); `accentSubtleGray`/`accentBoldGray` are filled from **Navy Fog**/**Navy Ink** rather than a separate gray family, per this system's "no separate gray family" rule. `accentBoldYellow` (`rgb(242,249,60)`) is **Yellow Signal**, Finnomena's single chromatic exception. CDS's own `gray`/`pink`/`chartreuse` spectrum hues have no Finnomena source and use CDS defaults if referenced.

**Data gap, not a design choice:** dark-mode `bgNegativeWash`/`bgPositiveWash`/`bgWarningWash` fall through to CDS's own default values (rather than the values `theme.css`'s light block uses) because Finnomena's own export resolves all dark-mode Notifications/Status tokens to flat white — an incomplete dark-mode pass upstream, not an intentional look. Confirm with design before shipping dark-mode banners/notifications against these.

**Color is provisional** — every value above traces to a real Finnomena token, but which Finnomena role fills which CDS-shaped slug was a human judgment call (see `../neon-theme/theme/color-overrides.ts`'s header for the full reasoning). Treat as first-pass, not final design sign-off.

## Tokens — Typography

Single family for every role: **`--fontFamily-*: 'IBM Plex Sans Thai', sans-serif`** (the confirmed web typeface — the Figma export's own token name, "Finnomena Trek," is the brand-asset name in design files, not the intended web font).

Of the 13 roles `theme.css` emits, only **8 have a confirmed Finnomena source** — `display1`, `display2`, `display3`, `title1`, `title2`, `title3`, `headline`, `body`. The other 5 (`title4`, `label1`, `label2`, `caption`, `legal`) have no Finnomena data and fall through to CDS's own default values (shown below for completeness, since `theme.css` includes them, but they are **not** Finnomena brand data).

| Role | `--fontSize-*` | `--fontWeight-*` | `--lineHeight-*` | Source |
|---|---|---|---|---|
| display1 | 92px | 400 | 102px | Finnomena "Display 1" |
| display2 | 60px | 400 | 70px | Finnomena "Display 2" |
| display3 | 54px | 700 | 64px | Finnomena "Display 3" |
| title1 | 28px | 400 | 34px | Finnomena "Title 1" |
| title2 | 22px | 400 | 28px | Finnomena "Title 2" |
| title3 | 20px | 400 | 25px | Finnomena "Title 3" |
| headline | 17px | 500 | 22px | Finnomena "Headline" |
| body | 17px | 400 | 22px | Finnomena "Body" |
| title4 | 1.25rem | 400 | 1.75rem | *CDS default (no Finnomena source)* |
| label1 | 0.875rem | 600 | 1.25rem | *CDS default* |
| label2 | 0.875rem | 400 | 1.25rem | *CDS default* |
| caption | 0.8125rem | 600 | 1rem | *CDS default* |
| legal | 0.8125rem | 400 | 1rem | *CDS default* |

Note the unit split: the 8 Finnomena-sourced roles use exact pixel values (Finnomena's real resolved sizes); the 5 CDS-default roles use `rem` (CDS's own convention) — this is deliberate, not an inconsistency to "fix." `fontWeight` values are the standard CSS numeric-weight convention (Regular=400, Medium=500, Bold=700), not Finnomena-specific data.

## Tokens — Spacing & Shapes

### Spacing
**All 15 of CDS's required space steps are Finnomena-sourced** (from `tokens/size.json`, confirmed in `theme.config.ts`'s generation log) — this is a full match, not a subset:

| Variable | Value | | Variable | Value |
|---|---|---|---|---|
| `--space-0` | 0px | | `--space-2` | 16px |
| `--space-0_25` | 2px | | `--space-3` | 24px |
| `--space-0_5` | 4px | | `--space-4` | 32px |
| `--space-0_75` | 6px | | `--space-5` | 40px |
| `--space-1` | 8px | | `--space-6` | 48px |
| `--space-1_5` | 12px | | `--space-7` | 56px |
| | | | `--space-8` | 64px |
| | | | `--space-9` | 72px |
| | | | `--space-10` | 80px |

Finnomena's raw export defines a larger 0–288px scale (see `../neon-theme/DESIGN.md`'s Spacing Scale) — `theme.css` only needs and emits the 15 steps CDS's `space` system actually uses, all real Finnomena values, just a bounded subset of the full export.

### Border Radius
9 of 11 CDS radius steps are populated by value from Finnomena's `tokens/radius.json`; `--borderRadius-1000` is mapped by **intent** (Finnomena's "round"/full-pill role), not by literal number — Finnomena's export uses `200` for this concept, CDS's convention is a much larger number to guarantee a full pill at any height. `--borderRadius-900` (56px) has no Finnomena equivalent and is CDS's own default value.

| Variable | Value | Source |
|---|---|---|
| `--borderRadius-0` | 0px | Finnomena |
| `--borderRadius-100` | 4px | Finnomena |
| `--borderRadius-200` | 8px | Finnomena |
| `--borderRadius-300` | 12px | Finnomena |
| `--borderRadius-400` | 16px | Finnomena |
| `--borderRadius-500` | 24px | Finnomena |
| `--borderRadius-600` | 32px | Finnomena |
| `--borderRadius-700` | 40px | Finnomena |
| `--borderRadius-800` | 48px | Finnomena |
| `--borderRadius-900` | 56px | *CDS default* |
| `--borderRadius-1000` | 100000px | Finnomena's "round" (mapped by intent, not by number) |

## Dark Mode

`theme.css` applies dark values automatically via `prefers-color-scheme: dark`, with a `[data-theme]` attribute as a manual override:

```html
<html data-theme="dark">   <!-- force dark regardless of OS setting -->
<html data-theme="light">  <!-- force light regardless of OS setting -->
```

This is a default assumption, not verified against any specific target project — if a project already has its own dark-mode convention (a `.dark` class, a different data attribute), adapt the selectors in the copied `theme.css` to match rather than introducing a second, conflicting mechanism.

## What's Not Included

`theme.css` deliberately omits fields Finnomena has no brand data for at all: raw spectrum primitives beyond the accent scale (e.g. individual `--blue60`-style steps), illustration colors, `iconSize`, `avatarSize`, `controlSize`, a general `borderWidth` scale, `textTransform`, `shadow`, and `fontFamilyMono`. There are also, by definition, no components in this skill — no Button/Tag/Link/Field styling notes, since those only exist once real CDS components are adopted. If a project needs any of the above, or real themed components, see `../neon-theme` (installs `@coinbase/cds-web`, wires `ThemeProvider`, uses real CDS components against the same brand values documented here).

## Do's and Don'ts

### Do
- Reference `var(--color-fg)`, `var(--space-2)`, `var(--borderRadius-200)`, etc. for every color, spacing, and radius value — real variables from `theme.css`, never invented names.
- Use `--color-fgPrimary`/`--color-bgPrimary` (Navy Ink) everywhere black would appear in a typical monochrome system — primary buttons, strong borders, the dark end of every surface.
- Reserve `--color-accentBoldYellow` (Yellow Signal) for a single brand-highlight moment per screen — never a general accent.
- Reserve `--color-bgLinePrimary` (Indigo Interactive) for links, focus rings, and the interactive-highlight state only.
- Keep the single `import "./theme/theme.css";` at your project's entry point — don't re-import per-component.

### Don't
- Don't write a raw hex color, raw pixel padding/margin, or raw border-radius number anywhere `theme.css` already defines a variable for it.
- Don't use pure black (`#000000`) where `--color-fgPrimary`/`--color-bgPrimary` (Navy Ink) should be used instead.
- Don't use `--color-accentBoldYellow` as a general UI color (nav highlights, arbitrary buttons/backgrounds).
- Don't invent a variable name that isn't actually in `theme.css` — check the file before referencing one.
- Don't ship dark-mode banners/notifications relying on `bgNegativeWash`/`bgPositiveWash`/`bgWarningWash` without confirming with design first (real data gap, not intentional — see Colors above).

## Similar Brands

A stylistic comparison, not a claim about Finnomena's actual relationships or sourcing:

- **American Express** — the closest direct parallel: a deep navy field paired with a single warm gold/yellow accent, in the same financial-services register.
- **Wise** — a mostly neutral palette with one saturated accent color reserved for brand moments rather than spread across every interactive element.
- **Linear** — a dark, near-monochrome neutral doing most of the interface work, with a single accent used sparingly.

## Quick Start

```html
<!-- e.g. in your root HTML, or as a top-level import in your entry file -->
<script type="module">
  import "./theme/theme.css";
</script>
```

```css
.button-primary {
  background: var(--color-bgPrimary);
  color: var(--color-fgInverse);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--borderRadius-200);
  font-family: var(--fontFamily-body);
}
```

**Colors only:** reference only `--color-*` variables. **Colors + typography:** also use `--fontFamily-*`, `--fontSize-*`, `--fontWeight-*`, `--lineHeight-*`, `--space-*`, `--borderRadius-*`. See `../neon-theme-css/SKILL.md` for the full setup steps, and `../neon-theme` if the project later adopts real CDS components — the same variable names keep working unchanged (see `theme.css`'s header for why).
