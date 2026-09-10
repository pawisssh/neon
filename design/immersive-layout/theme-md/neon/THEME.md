---
name: Finnomena — Brand Theme Overlay
version: 1.1.0
purpose: Brand overlay for an accompanying DESIGN.md
document_language: en
content_language: follow the brief; default th
---

# Finnomena — Brand Theme Overlay

Use this file together with a DESIGN.md and the user's page brief. Read both files before implementation.

**DESIGN.md controls the experience. THEME.md controls brand styling.** Preserve the reference's composition, layout intent, section rhythm, and specified motion while replacing its brand colors, fonts, and themed component styling with Finnomena's.

## 1. Purpose and usage

Attach this file and the selected DESIGN.md, then provide the page brief in your message. Read the ownership contract before applying any source styling.

### Example invocation

“Use the attached DESIGN.md for composition, layout, imagery direction, and specified animation. Apply THEME.md for Finnomena brand styling. Replace all source-brand UI and decorative colors, including gradient and interaction states. Make Finnomena colors visibly present in the opening without requiring every brand color. Preserve the reference's visual hierarchy and page rhythm, adapting typography and controls for Thai. Use the supplied product content and assets; report any missing inputs or unverified behavior.”

## 2. Ownership and precedence

Resolve conflicts by property, not by file order, document length, or how forcefully a source instruction is phrased.

| Property | Owner | Application |
| --- | --- | --- |
| Product facts, audience, language, real assets, action destination | User brief | Do not inherit the reference company's content |
| Exact authored colors, semantic roles, logo treatment | THEME.md | Replace source-brand styling in every context |
| Font family, body/UI role sizes, Thai metrics | THEME.md | Apply the foundation and font policy below |
| Display size, relative hierarchy, emphasis weight | DESIGN.md within theme constraints | Preserve scale and emphasis; adapt for font support, Thai, and reflow |
| Button/input styling, minimum dimensions, internal padding | THEME.md | Use supplied component definitions and explicit extensions |
| Editorial card geometry, image masks, device silhouette | DESIGN.md | Preserve unless the element is a named theme component |
| Component spacing | THEME.md | Use supplied component values or the local spacing rules |
| Container width, columns, section gaps, visual placement | DESIGN.md | Preserve macro layout and density intent |
| Responsive structure and reading sequence | DESIGN.md | Allow fit corrections for themed text and controls |
| Animation timing, choreography, pinning, transitions | DESIGN.md | Preserve specified behavior; replace animated colors and maintain reduced motion |
| Gradient shape, blur, shadow geometry | DESIGN.md | Preserve effect structure; use only permitted theme colors and opacity |
| Image subject and framing | Brief + DESIGN.md | Replace reference-company assets with relevant supplied material |

Usability and truthful content remain required. If a theme token is unsuitable on a surface, choose a compatible theme role or surface; do not silently change its foundation value or restore a source-brand color. Fit corrections may change text wrapping, element height, and a breakpoint when necessary. Preserve the layout's intent rather than forcing its original pixel coordinates.

Do not import previous Finnomena hero recipes, stepped landscapes, section sequences, breakpoint systems, mandatory left alignment, or motion presets into this overlay. This file does not require a particular composition, framework, animation library, or font-loading service.

## 3. Brand color requirements

The final page must meet both conditions:

1. No source-brand palette remains in authored UI, decorative artwork, or animation states. Replace source colors everywhere they appear, including prose examples, code snippets, SVGs, gradients, pseudo-elements, inline styles, charts, and library defaults.
2. Finnomena's brand colors are visibly present in the rendered page. A white page with black text and a small replacement logo is insufficient. Not every brand color needs to appear.

The unmistakable signature colors are Yellow `#F2F93C`, Navy `#01172B`, and Blue-grey `#A6BFCC`, supported by White `#FFFFFF`. As a default, use at least one substantial yellow or blue-grey element in the opening composition, with navy or white providing the matching contrast. A primary CTA, headline marker, existing graphic plane, or section field can supply this presence. A tiny icon, hidden token, footer-only accent, or hover-only color does not satisfy the requirement.

For a navy-led opening, a visible yellow primary action is the default brand anchor. For yellow-led openings, use navy actions. Do not add a new section merely to introduce a color: apply it to an existing element in DESIGN.md. Preserve supplied approved logo colors.

The user's explicit instructions can change the theme. A source DESIGN.md statement such as “only use blue,” “never introduce color,” or “all buttons must be pills” cannot override this theme's assigned properties.

### Permitted authored colors

Authored colors must be one of:

- A supplied foundation color used for its documented role.
- A contextual alias to a supplied color.
- An opacity treatment or gradient built only from allowed colors for that role.
- An accessibility system color in forced-colors mode.

Do not sample colors from the source-brand screenshots, preserve their gradient endpoints, or introduce arbitrary near-black, grey, blue, purple, or accent shades. Identical hex values shared by both systems are permitted when selected for a valid Finnomena role. Compliance is semantic mapping, not a blanket ban on any hex found in the reference.

Eight-digit hex values are RRGGBBAA. Preserve their alpha channel. For fading graphics, interpolate toward the same hue at zero alpha rather than an unrelated transparent color stop. Gradients and opacity blends naturally create intermediate rendered colors; this is allowed when every input is permitted and the effect follows DESIGN.md.

### Color families have distinct jobs

| Family | Allowed use |
| --- | --- |
| Yellow, navy, blue-grey, white and their supplied ramps | Brand surfaces, decorative artwork, headings, appropriate actions |
| Supplied black-alpha and neutral UI colors | Light-surface text, fields, overlays, borders, layers |
| `interactive`, `link-primary` | Functional interactions and links on compatible surfaces; not decorative blue branding |
| Positive, negative, support and notification tokens | Their named status meanings, not general campaign decoration |
| `multi-asset-*` | The matching named investment category, with visible labels |

Do not use `interactive` to retain Revolut's blue promo gradient, or `multi-asset-equity` to retain an unrelated purple atmosphere. A palette value existing in the foundation does not authorize using it in every role.

Multi-asset colors do not substitute for the required core brand presence. Keep `multi-asset-gold: #F1F92D` distinct from Yellow `#F2F93C`. Category colors may dominate a relevant educational visual, but the surrounding page still needs a core Finnomena brand anchor.

## 4. Foundation tokens

The YAML block in this section is the authoritative supplied foundation. Metadata in the frontmatter is not a token catalog. Its colors, type sizes, radii, spacing, and components retain their original values. Tier references resolve within the `colors` namespace. Reference notation such as `{colors.button-primary}` must be resolved before generating CSS; it is not native CSS syntax.

The tables below are explicit theme application extensions, not claims that additional official tokens were supplied. Keep extensions separate from foundation definitions in implementation.

Token hierarchy: **foundation value → contextual role → component**. Keep the supplied schema unchanged; namespaced contextual roles adapt it to section surfaces without rewriting the foundation. The example CSS in section 9 is derived from this block and the contextual extensions, not an alternative authority.

For automated extraction, parse this section's fenced YAML block. The frontmatter contains metadata only. This location replaces the token-in-frontmatter format used in version 1.0.

```yaml
colors:
  text-primary: "#000000d9"
  text-secondary: "#000000a6"
  text-on-color: "#ffffff"
  text-positive: "#009646"
  text-negative: "#d60808"
  text-disabled: "#00000073"
  field: "#01172b08"
  field-hover: "#01172b0d"
  border-subtle: "#0000000d"
  border-strong: "#01172b"
  support-success: "#00ad50"
  support-warning: "#f26414"
  support-error: "#f73232"
  support-info: "#01172b"
  interactive: "#5251ed"
  overlay: "#00000033"
  notification-success-background: "#e6fdf0"
  notification-warning-background: "#fef7f3"
  notification-error-background: "#fff5f5"
  notification-info-background: "#f2f3f4"
  link-primary: "#1817e7"
  button-primary: "#01172b"
  button-primary-hover: "#1a2e40"
  button-secondary: "#01172b0d"
  button-secondary-hover: "#01172b14"
  button-tertiary: "#01172b00"
  button-tertiary-hover: "#01172b14"
  button-highlight: "#f2f93c"
  button-highlight-hover: "#f4fa59"
  button-danger: "#d60808"
  button-danger-hover: "#ba0707"
  button-danger-active: "#9d0606"
  button-disabled: "#01172b1a"
  layer-01: "#ffffff"
  layer-02: "#ffffff"
  layer-03: "#01172b0d"
  layer-hover-01: "#01172b14"
  layer-hover-02: "#01172b14"
  layer-hover-03: "#01172b14"
  layer-active-01: "#01172b1f"
  layer-active-02: "#01172b1f"
  layer-active-03: "#01172b1f"
  background-primary: "#ffffff"
  background-secondary: "#f2f2f2"
  background-tertiary: "#ffffff"
  background-brand: "#f2f93c"
  white: "#ffffff"
  multi-asset-cryptocurrency: "#8f0606"
  multi-asset-crowdfunding: "#d60808"
  multi-asset-p2p-lending: "#ba4a0a"
  multi-asset-thai-equity: "#1211ad"
  multi-asset-equity: "#aa46c3"
  multi-asset-mutual-fund: "#01172b"
  multi-asset-gold: "#f1f92d"
  multi-asset-tax-saving: "#50cfff"
  multi-asset-esavings: "#40ed90"
  multi-asset-cash: "#007435"
  accent-yellow:
    "25": "#fcfece"
    "50": "#f9fc9e"
    "75": "#f5fb6d"
    "100": "#f2f93c"
  accent-navy:
    "25": "#c0c5ca"
    "50": "#808b95"
    "75": "#415160"
    "100": "#01172b"
  accent-grey:
    "25": "#e9eff2"
    "50": "#d3dfe6"
    "75": "#bccfd9"
    "100": "#a6bfcc"
tiers:
  finnomena-club: "{colors.white}"
  finnomena-exclusive: "{colors.accent-yellow.100}"
  finnomena-private: "{colors.accent-grey.100}"
  finnomena-ultra: "{colors.accent-navy.100}"
typography:
  largeTitle: {fontSize: 34px}
  title1: {fontSize: 28px}
  title2: {fontSize: 22px}
  title3: {fontSize: 20px}
  headline: {fontSize: 17px}
  body: {fontSize: 17px}
  subheadline: {fontSize: 15px}
  footnote: {fontSize: 13px}
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
components:
  button-primary:
    backgroundColor: "{colors.button-primary}"
    textColor: "{colors.text-on-color}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    minHeight: 48px
    padding: 12px 16px
  button-secondary:
    backgroundColor: "{colors.button-secondary}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    minHeight: 48px
    rounded: "{rounded.md}"
  input-field:
    backgroundColor: "{colors.background-primary}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    minHeight: 56px
    padding: 16px
  suggestion-card:
    backgroundColor: "{colors.background-secondary}"
    rounded: "{rounded.md}"
```

## 5. Semantic mapping

Preserve DESIGN.md's light/dark sequence. A dark source page does not become white simply because `background-primary` is white. Source light/dark structure is a composition decision; the actual colors are theme decisions.

| Semantic role | Light context | Dark context, proposed extension |
| --- | --- | --- |
| Canvas | background-primary | accent-navy.100 |
| Quiet grouped surface | background-secondary or accent-grey.25 | white at 4% alpha over the navy canvas |
| Raised panel | layer-01 | white at 8% alpha over the navy canvas |
| Display heading | accent-navy.100 | white |
| Body text | text-primary | white |
| Secondary text | text-secondary | white at 75% alpha, verify on actual panel |
| Decorative divider | border-subtle | white at 16% alpha |
| Necessary control boundary | border-strong | white at 60% alpha, verify context |
| Primary conversion action | Foundation primary; highlight when the composition calls for an accent | Proposed highlight button |
| Secondary action | Foundation secondary or tertiary | Underlined white link, or white text with white outline |
| Text link | link-primary, underlined | White, underlined |
| Focus | Two-color white/navy treatment | Same treatment, verified locally |
| Form and notification content | Foundation light-surface roles | Light-contained region with locally reset text, links, and field roles |

Dark alpha surfaces composite over the section canvas; do not nest them repeatedly and unintentionally increase brightness. These are deterministic theme extensions, not source dark-grey tokens. If separate levels are unnecessary, use fewer levels while preserving any meaningful grouping.

Use the same light-context roles on yellow or blue-grey only after verifying contrast. Bright yellow buttons require navy text. White buttons or white copy must not disappear into light backgrounds.

For photographic overlays, preserve framing and text placement when legible. Use white/navy copy and a theme-derived scrim where required. Do not assume a fixed overlay opacity guarantees contrast across all image crops. Move the crop or strengthen the local scrim before changing composition substantially.

### Tier selection

Only apply a service tier when the brief names it. Otherwise use Core styling while preserving DESIGN.md's light/dark structure.

- Club: white-led treatment with a visible blue-grey or yellow brand anchor.
- Exclusive: yellow as the identity field; navy actions and readable light/dark companions.
- Private: blue-grey as the identity field, navy type on light sections, selective yellow emphasis.
- Ultra: navy-led treatment with white text and visible yellow emphasis or action.

Do not impose page-wide color percentages. When a tier field is light but DESIGN.md has an essential dark hero, keep the dark stage and express the tier on an existing prominent panel, label treatment, or following light section. Report a material compromise if the brief requires a dominant tier color incompatible with the selected design.

## 6. Typography adaptation

The supplied foundation does not name a font family. Use the approved Finnomena font supplied by the brief or existing project. Until one is available, use Noto Sans Thai for Thai and Latin with `system-ui, sans-serif` as fallback. This is a proposed fallback, not a claim about Finnomena's official font. Use available licensed font files; do not invent a proprietary font URL.

Replace source-specific families such as Aeonik, SF Pro, and Inter Variable with the selected theme family. Remove source-font-specific OpenType alternates unless the selected font explicitly supports the intended behavior. For numerical alignment, use `font-variant-numeric: tabular-nums`; do not copy unrelated font-feature settings merely because the reference uses them.

| Role | Theme application |
| --- | --- |
| Body and button text | 17px foundation body role; readable line height |
| Supporting text | 15px subheadline |
| Secondary footnote | 13px footnote; never shrink essential copy to fit |
| Local headings | 20/22/28/34px title roles as appropriate |
| Hero and editorial display | Preserve DESIGN.md's display scale and relative hierarchy; not capped at 34px |
| Latin-only codes/metadata | Retain a monospace role when it carries real meaning; use supplied mono or `ui-monospace, monospace` |

Map weight to a supported weight with the same emphasis intent. A calm medium-weight Revolut-style headline need not become bold simply because the page is themed. Do not imitate missing variable weights with unsupported values that unpredictably change the result.

Thai defaults: neutral tracking; display line height around 1.25–1.35; body around 1.6–1.75; controls around 1.4–1.5. These are proposed starting values. Test the actual font and copy, permit growth, and never clip tone marks. Thai text must not inherit source `line-height: 1`, aggressive negative tracking, forced uppercase styling, or character-by-character animation. Preserve the intended animation sequence using whole phrases or text blocks instead.

Keep headline scale, alignment, and emphasis from DESIGN.md while allowing different line breaks. Use relative/fluid sizing where appropriate and verify zoom. English text can retain tighter display metrics when the chosen font renders them clearly.

## 7. Components and local spacing

Keep DESIGN.md's page width, grid, section gaps, editorial whitespace, and visual density. A 120px cinematic section gap should not collapse to 48px because the foundation spacing list ends there.

Apply the foundation's 8px spacing unit to ordinary local content groups when no more specific component rule exists. Do not mechanically round every measurement to 8px: supplied 12px button padding, 4px radii, border widths, optical adjustments, and icon strokes remain valid. Preserve macro spacing even when its values differ from the theme's local spacing scale.

- Primary button: supplied navy fill, white text, 17px body type, 12px radius, 48px minimum height, 12px 16px padding; supplied hover fill.
- Secondary button: supplied fill/text, 17px body, 12px radius, 48px minimum height; proposed 12px 16px padding and supplied hover fill.
- Highlight button, proposed extension: supplied yellow fill and hover, navy text, otherwise primary button dimensions.
- Input: supplied white fill, primary text, 17px body, 12px radius, 56px minimum height, 16px padding. Allow greater height for typography and borders.
- Suggestion card: supplied secondary background and 12px radius.
- Source editorial/photo cards: retain source radius and crop unless implementing the named suggestion-card component. Do not treat all cards as suggestion cards.
- Functional circles such as icon buttons, avatars, device silhouettes, and circular diagrams keep their meaningful geometry. A circular icon-only control is not a pill text CTA.

All authored source text CTA pills become the themed text-button geometry. Preserve their location, action, and visual emphasis. Do not force a 12px radius onto every graphic or image simply because the button radius is 12px.

Map default, hover, active, focus, disabled, loading, error, and success states. Where an active token exists, use it. Otherwise retain the theme fill and provide a subtle inset cue rather than introducing a new brand color. Announce operation results truthfully and do not simulate successful submission.

Proposed focus treatment: 2px white inner ring and 2px navy outer outline, offset 2px. Verify it on the actual element and surface without clipping; in forced-colors mode use a visible system-color outline. Preserve semantic disabled state, accessible labels, and a usable hit area.

## 8. Effects and asset treatment

Preserve DESIGN.md's effect geometry and timing, including a permitted gradient, atmospheric floor, blur, or shadow. Replace every color input with a role-appropriate theme color. Do not introduce an effect just because this file permits its colors.

Examples:

- A source blue promotional gradient can become a yellow-to-yellow-tint gradient with navy copy, preserving its strip position and direction.
- A source dark atmospheric floor can use navy and blue-grey inputs, preserving its fade and geometry.
- A source chromatic action becomes yellow or navy according to the contextual action role; source glow colors must not survive around it.

Motion not specified in DESIGN.md defaults to ordinary interaction feedback. Do not infer elaborate scroll animation from a reference brand's name. Reduced motion and a usable final static state remain required.

### Assets are not all theme tokens

Natural photography, accurate product imagery, and approved third-party logos may contain colors outside the UI palette. Do not tint skin, change real product evidence, or recolor third-party marks just to meet a hex allowlist. These factual asset colors are exceptions; source-brand promotional assets are not.

Do not reuse Revolut, Apple, or Linear wordmarks, source-product screenshots, branded devices, customer logo strips, brand-specific slogans, or product claims as Finnomena evidence. Use brief-supplied relevant assets. If absent, omit the unsupported asset or choose a source-compatible abstract illustration using theme colors. Keep the composition's image role where possible without fabricating a real product screen.

Authored SVG and decorative raster artwork must use theme colors. When a source raster contains inseparable foreign-brand color treatment, replace or recreate the artwork rather than leaving it as an exception. Record unavoidable approved asset exceptions in the handoff; do not apply them to decorative source-brand material.

Finnomena stepped motifs and headline markers are optional. Use them only where DESIGN.md already provides a suitable decorative or emphasis role. Do not add a stepped landscape to every hero or replace an entire photographic concept to force a motif.

## 9. Implementation Quick Start

The CSS below is a **derived implementation subset**, not a second token source. Foundation literals come from section 4; dark-context aliases and font/line-height choices come from sections 5–7. If a copied CSS value ever differs, resolve it from those authoritative definitions. Update or generate the implementation from those definitions rather than maintaining an independent palette.

Custom properties only affect components that consume them. Replace reference hard-coded styles, inline values, and library defaults as well; appending this snippet alone does not complete theming.

### CSS Custom Properties

```css
:root {
  /* Foundation subset: resolved from YAML. */
  --fn-yellow: #f2f93c;
  --fn-navy: #01172b;
  --fn-blue-grey: #a6bfcc;
  --fn-white: #ffffff;
  --fn-control-radius: 12px;
  --fn-button-min-height: 48px;
  --fn-button-padding: 12px 16px;
  --fn-body-size: 17px;
  /* Proposed fallback; replace with the approved project font when supplied. */
  --fn-font-sans: "Noto Sans Thai", system-ui, sans-serif;
}

:root,
[data-fn-surface="light"] {
  --fn-surface: var(--fn-white);
  --fn-text: #000000d9;
  --fn-text-secondary: #000000a6;
  --fn-heading: var(--fn-navy);
  --fn-link: #1817e7;
  --fn-action: var(--fn-navy);
  --fn-action-text: var(--fn-white);
  --fn-action-hover: #1a2e40;
}

[data-fn-surface="dark"] {
  --fn-surface: var(--fn-navy);
  --fn-text: var(--fn-white);
  --fn-text-secondary: rgb(255 255 255 / 75%);
  --fn-heading: var(--fn-white);
  --fn-link: var(--fn-white);
  --fn-action: var(--fn-yellow);
  --fn-action-text: var(--fn-navy);
  --fn-action-hover: #f4fa59;
}

/* Apply only to themed containers; preserve DESIGN.md layout and spacing. */
.fn-surface {
  background-color: var(--fn-surface);
  color: var(--fn-text);
  font-family: var(--fn-font-sans);
}

.fn-body {
  font-size: var(--fn-body-size);
  line-height: 1.65;
}
.fn-secondary { color: var(--fn-text-secondary); }
.fn-heading { color: var(--fn-heading); }
.fn-link { color: var(--fn-link); text-decoration: underline; }

/* Conversion role: foundation primary on light, highlight on dark. */
.fn-button-primary {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-inline-size: 100%;
  min-block-size: var(--fn-button-min-height);
  padding: var(--fn-button-padding);
  border: 0;
  border-radius: var(--fn-control-radius);
  background-color: var(--fn-action);
  color: var(--fn-action-text);
  font-family: var(--fn-font-sans);
  font-size: var(--fn-body-size);
  line-height: 1.45;
  text-align: center;
  text-decoration: none;
  white-space: normal;
  overflow-wrap: anywhere;
  cursor: pointer;
}
.fn-button-primary:not(:disabled):not([aria-disabled="true"]):hover {
  background-color: var(--fn-action-hover);
}
.fn-button-primary:focus-visible,
.fn-link:focus-visible {
  box-shadow: 0 0 0 2px var(--fn-white);
  outline: 2px solid var(--fn-navy);
  outline-offset: 2px;
}
@media (forced-colors: active) {
  .fn-button-primary { border: 1px solid ButtonText; }
  .fn-button-primary:focus-visible,
  .fn-link:focus-visible {
    box-shadow: none;
    outline: 2px solid Highlight;
  }
}
```

### Nested context example

```html
<section class="fn-surface" data-fn-surface="dark">
  <!-- Existing dark composition: themed white text and yellow action. -->
  <div class="fn-surface" data-fn-surface="light">
    <!-- Existing light panel: local text, link, and action roles reset. -->
  </div>
</section>
```

The context attribute sets variables; `.fn-surface` paints a container. Apply them to existing sections or panels rather than introducing wrappers that change layout. For image-led sections, keep DESIGN.md's background image and apply context text roles plus a checked scrim instead of replacing the image with a solid field.

This example intentionally covers only a light/dark surface, text roles, and a conversion button. Complete input, secondary-action, disabled, loading, validation, and other required states from the foundation and component rules before delivery. The source determines display sizes, weights, section dimensions, and animation. Font loading is separate; naming a family does not download it. Use an appropriate text fallback if the font is unavailable.

For yellow or blue-grey fields, use light-context ink roles and explicitly assign the chosen foundation surface. For a highlight action on a light field, use the yellow action/hover and navy action-text roles explicitly, after checking contrast. Do not apply dark context solely to obtain a yellow button, because that also changes text and surface roles.

Use equivalent scoped variables with Tailwind, CSS modules, or the existing styling system. Do not create a second full Tailwind token catalog or global reset in this document. Keep framework integration derived from the same foundation and contextual mappings.

## 10. Validation and handoff

Before coding, write a short interpretation identifying what stays from DESIGN.md, which theme colors provide visible Finnomena identity, and any material fit adjustment. This is a statement of decisions, not an approval gate.

1. Extract source rules into structure, motion, brand styling, and content/asset references.
2. Create a semantic role mapping for all source colors and font roles used by the chosen page. Include colors embedded in examples and state styles.
3. Resolve theme variables and component styles into one implementation source of truth. Do not append a partial CSS override while leaving hard-coded source values active elsewhere.
4. Build the themed static composition, then apply DESIGN.md's specified behavior. Reflow for Thai and themed controls without changing the narrative unnecessarily.
5. Inspect rendered desktop and mobile views, interactive states, reduced motion, and contrast. When no project test widths exist, start at 390px and 1440px, with a 320px overflow check and checks around structural breakpoints.
6. Audit authored colors in styles, components, SVGs, inline attributes, gradients, chart configs, utility classes, and animated states. Search for known source palette literals and resolve each occurrence by semantic role; shared permitted colors are not errors. Audit rendered assets separately.
7. Report actual verification and remaining gaps. Do not claim that reading these files guarantees a visually validated page.

Acceptance criteria:

- [ ] Source-brand colors are absent from authored UI and decorative artwork in every state.
- [ ] Remaining colors belong to their permitted Finnomena roles; no misuse of semantic/category tokens to disguise source-brand accents.
- [ ] At least one substantial yellow or blue-grey element is visible in the opening, or the navy-led opening has a visible yellow action/emphasis.
- [ ] Core brand presence is visible on mobile as well as desktop and does not depend on hover or animation.
- [ ] Source fonts, logos, slogans, and unsupported product evidence have been replaced or omitted.
- [ ] Light/dark sequence, composition, narrative, and specified motion retain DESIGN.md's intent.
- [ ] Body/UI typography, controls, and local spacing follow the theme; display hierarchy and macro spacing remain source-led.
- [ ] Thai text, wrapping, zoom, focus, and control states are usable.
- [ ] Normal text targets 4.5:1 contrast, large text 3:1, and applicable control/focus boundaries 3:1 against their adjacent surfaces; alpha and image contexts were checked.
- [ ] Any real-asset color exceptions are identified; no source-brand decoration is hidden within those exceptions.
