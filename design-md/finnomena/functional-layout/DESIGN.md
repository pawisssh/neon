---
name: Finnomena Neon - Functional layout
colors:
  text-primary: "#000000d9"
  text-secondary: "#000000a6"
  text-placeholder: "#000000a6"
  text-on-color: "#ffffff"
  text-on-color-disabled: "#ffffff73"
  text-on-brand: "#000000d9"
  text-helper: "#000000a6"
  text-positive: "#009646"
  text-negative: "#d60808"
  text-inverse: "#ffffff"
  text-disabled: "#00000073"
  field: "#01172b08"
  field-hover: "#01172b0d"
  border-subtle: "#0000000d"
  border-on-color: "#0000000d"
  border-strong: "#01172b"
  support-success: "#00ad50"
  support-warning: "#f26414"
  support-error: "#f73232"
  support-info: "#01172b"
  support-caution-major: "#01172b"
  support-caution-minor: "#01172b"
  support-undefined: "#01172b"
  interactive: "#5251ed"
  overlay: "#00000033"
  notification-success-background: "#e6fdf0"
  notification-warning-background: "#fef7f3"
  notification-error-background: "#fff5f5"
  notification-info-background: "#f2f3f4"
  notification-caution-major-background: "#ebecee"
  notification-caution-minor-background: "#f7f8f9"
  link-primary: "#1817e7"
  button-primary: "#01172b"
  button-primary-hover: "#1a2e40"
  button-primary-active: "#344555"
  button-secondary: "#01172b0d"
  button-secondary-hover: "#01172b14"
  button-secondary-active: "#01172b1a"
  button-tertiary: "#01172b00"
  button-tertiary-hover: "#01172b14"
  button-tertiary-active: "#01172b1a"
  button-highlight: "#f2f93c"
  button-highlight-hover: "#f4fa59"
  button-highlight-active: "#f5fb6d"
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
  background-inverse: "#000000"
  background-brand: "#f2f93c"
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
typography:
  largeTitle:
    fontFamily: IBM Plex Sans Thai
    fontSize: 34px
    fontWeight: 400
    lineHeight: 41px
    letterSpacing: 0.4px
  title1:
    fontFamily: IBM Plex Sans Thai
    fontSize: 28px
    fontWeight: 400
    lineHeight: 34px
    letterSpacing: 0.38px
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
    rounded: "{rounded.md}"
  input-field:
    backgroundColor: "{colors.background-primary}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 16px
  suggestion-card:
    backgroundColor: "{colors.background-secondary}"
    rounded: "{rounded.md}"
---

# Finnomena Neon — Design Guide

Start here: identify the task → choose a layout → apply typography and spacing → build interactions and states → review at narrow and wide widths.

## Brand & Style

Finnomena Neon is a black-on-white system: white surfaces, hairline boundaries, dark controls, and color reserved for semantic states, charts, links, and illustrations. Start with the audience, their task, and the information needed to act. Choose the appropriate Neon layout and give the primary task clear visual priority. Create character through typography, proportion, spacing, and useful content. Keep familiar interactions predictable. Every panel, label, image, and animation should help understanding or action.

## Colors

| Role | Tokens | Use |
| --- | --- | --- |
| Canvas and surfaces | `background-primary`, `background-secondary` | White page, header, footer; light gray grouped content |
| Text | `text-primary`, `text-secondary`, `text-disabled` | Main content, supporting copy, unavailable controls |
| Boundaries | `border-subtle`, `border-interactive`, `border-strong` | Separators, control edges, selected or emphasized edges |
| Actions | `button-primary`, `button-secondary`, `button-tertiary` | Main, supporting, and quiet actions; use their hover/active variants |
| Links and focus | `link-primary`, `link-primary-hover`, `focus` | Indigo links and visible keyboard focus |
| Feedback | `support-success`, `support-warning`, `support-error` | State icons and matching notification backgrounds; pair with text |
| Financial change | `text-positive`, `text-negative` | Gains and losses, with signs or labels |

Keep structural surfaces white; reserve navy for controls and emphasis. Yellow `background-brand` / `button-highlight` is an exceptional brand highlight, not the default CTA. Use the `support-*` family for feedback: legacy `status-*` names in the token inventory do not reliably match their semantic colors.

### Data Visualization Colors (Multi-asset)

Use the `multi-asset-*` tokens only for their named asset categories. Keep category colors consistent across charts; add labels, values, and legends so color is never the sole identifier. Use dark labels beside light yellow/green marks. Label units, periods, and unavailable data; never imply that missing values are zero.

## Typography

Use **IBM Plex Sans Thai** for Thai and Latin text, with `sans-serif` as the loading fallback. Load weights 400, 500, and 700 when available; preserve Thai marks and wrapping without clipping.

| Role | Token | Size / line height |
| --- | --- | --- |
| Page title | `largeTitle` or `title1` | 34 / 41px or 28 / 34px |
| Section title | `title2` | 22 / 28px |
| Emphasized label | `headline` | 17 / 22px, weight 500 |
| Body and controls | `body` | 17 / 22px |
| Secondary copy | `subheadline` | 15 / 20px |
| Metadata | `footnote` | 13 / 18px |

Use the frontmatter weights and tracking; larger display tokens are optional for spacious heroes. Keep body copy left-aligned, allow longer reading text more line height, and right-align comparable numeric values with consistent precision and units.

## Spacing, Shapes & Depth

Use the 8px spacing unit: 8px within small groups, 16px between related elements, 24px card/pane padding, 32px between workspace sections, and 64px between landing-page sections. Reduce outer padding to 16px on phones; workspace layout grids use 16px end margins/gutters below 1440px and 24px from 1440px up (see Responsive behavior). These are defaults; let content determine height.

Use 8px radii for controls and cards; reserve full pills for tags, toggles, and occasional navigation CTAs. Create depth with white/secondary surfaces and 1px subtle separators, without shadows. Keep reading columns around 60–75 characters; wide workspaces may fill the viewport.

## Design Decisions

- Infer the screen type, audience, primary action, and content needs from the brief. Briefly state the chosen direction; ask only when ambiguity would materially change the result.
- In workspaces, prioritize scanning, comparison, and stable alignment. Adjust spacing before reducing text size; retain useful tables and repeated rows.
- On landing pages, organize a clear message, supporting evidence, and a prominent next action. Vary composition when the content warrants it.
- Group with whitespace and separators. Use cards when content represents a distinct object or interaction.
- When redesigning, preserve meaningful content, navigation, and familiar workflows unless their change is requested.

## Visual Hierarchy: Hero & Primary Action

Every page and self-contained component commits to one focal point and no more than one dominant action; nothing else competes with them.

**Hero object.** Lead with a single focal element sized to be the first thing the eye lands on: the page's core number, chart, or subject, rendered at the largest type or visual scale in view (`display1`–`largeTitle` for numerals, a full-width chart, or a dominant illustration). Place it near the top of the content area, isolated from supporting detail by whitespace, with context (date, status, ticker, account) set in `footnote`/`caption1` immediately below or beside it — never at competing size. A buy amount, a net-worth figure, an order total: one number or image per view is the anchor; everything else is supporting detail rendered smaller and quieter.

**One primary button.** Give each page — and each self-contained component within it (a card, sheet, or modal with its own task) — no more than one `button-primary`. Every other action on that surface drops to `button-secondary`, `button-tertiary`, or a plain `link-primary`, even when it is common or frequently used (quick-amount chips, icon-only utilities, "View all" rows). When a page has a persistent primary action (a sticky footer button, a hero CTA), inline or nested components must not introduce a second filled-navy button in the same view — demote their action to secondary/tertiary or a link so the page-level primary stays the one dominant control. Purely informational or status screens may carry no primary button at all. Reserve `button-highlight` (yellow) for the rare moment that should out-rank even the primary, never as a routine CTA color.

**Applying it:** Identify the hero — the number, chart, or message the task is actually about — before laying out anything else, and size/position it to read before any label, tag, or metadata. Then identify the one action (if any) that completes the task and render it as the sole primary, with every other affordance a tier below. This applies inside any Layout Pattern — Detailed's Inspector, Content's report pane, an Immersive hero section — each still resolves to one hero and at most one primary per view.

## Layout Patterns

Choose the layout from the screen’s task without asking the user to select a component. These names describe visual patterns, not required imports.

| Pattern | Panes | Use for |
| --- | --- | --- |
| `DetailedLayout` | Sidebar + Content + Inspector; inspector-weighted | List-and-detail workspaces, inboxes, orders, holdings |
| `ContentLayout` | Sidebar + Content + Inspector; content-weighted | Content-led reports, dashboards, articles, editors |
| `SimpleLayout` | Sidebar + Content | Single-pane utilities |

Use the simplest pattern that supports the task. Do not add an inspector without detail content. An immersive landing page may contain several sections; “immersive” means no persistent sidebar.

### Pane sizing

At a 1440px viewport, use the dimensions below. Fixed panes retain their tier width; flexible panes fill the remaining space.

| Layout | Sidebar | Content | Inspector |
| --- | --- | --- | --- |
| Detailed | 360px | Fixed 400px | Flexible 680px |
| Simple | 360px | Flexible 1080px | Hidden |
| Content | 320px | Flexible 720px | Fixed 400px |

These figures match the reference frames; Simple's 360px sidebar follows Figma over the token export's 320px value at this tier. Keep workspace panes full-height, with 64px toolbars and independently scrolling content areas; sidebar header/footer slots are 64px when present. Apply padding inside panes. Immersive keeps a real-logo header and may scroll as a normal page for landing content. Diagram colors indicate structure only; use Neon's white surface tokens in the UI.

### Shared pane primitives

- **`Sidebar`:** Desktop logo, navigation, and optional app content; hidden → icon rail → full sidebar. Absent in Immersive.
- **Content:** Main list or working area with an optional toolbar. Fixed-width in Detailed (the list column); flexible and dominant in Simple and Content layout.
- **Inspector:** Selected-item details or supporting context. Flexible and dominant in Detailed; fixed-width in Content layout. Absent in Simple.
- **`BottomNav`:** Phone replacement for Sidebar; omit when navigation is empty.

### Navigation

Use the same destinations and selected state in Sidebar and BottomNav. Include only navigation relevant to the requested screen; omit it when empty. Extra sidebar content sits below navigation. Do not invent ecosystem links or destinations.

### Responsive behavior

Use the viewport tiers below unless the user explicitly requests different project breakpoints. Apply the pane-fit rules when content cannot fit. Immersive hides its sidebar at every width. Optional token files do not override the dimensions and exceptions documented here.

| Tier | Viewport | Sidebar |
| --- | --- | --- |
| SM | Below 500px | Hidden |
| MD | 500–987px | 64px icon rail |
| LG | 988–1079px | 64px icon rail |
| XL | 1080–1271px | 240px |
| XXL | 1272–1439px | 320px |
| XXXL | 1440–1919px | 360px (Detailed, Simple); 320px (Content) |
| Max | 1920px and above | 360px (Detailed); 320px (other sidebar layouts) |

Detailed's fixed content column and Content's fixed inspector column use 320px at SM/MD, 360px at LG–XXL, 400px at XXXL, and 560px at Max, when shown alongside another pane. End margins and pane gutters are 16px through XXL and 24px from XXXL up. A sole working pane fills the available width.

Adapt panes to fit:

- Reserve at least 320px for the flexible working pane before showing a fixed companion; otherwise fall back to a separate view or sheet. Detailed keeps list-and-detail access; Content keeps the main content visible and opens the inspector on demand. Preserve selection, filters, scroll position, and a Back/Close action.
- Simple keeps a single content pane at every width. Immersive hides sidebar, inspector, and BottomNav at every width, and stacks landing-page sections on narrow screens.
- Below 500px, show BottomNav only when navigation exists; keep the real logo visible and reserve space for fixed navigation, keyboard focus, and device safe areas.

## Components

### Logo requirement

Every screen uses an approved Finnomena SVG, never recreated text. Render the matching raw GitHub URL below directly. Use the full wordmark in a header or full sidebar and the compact mark in an icon rail.

| Surface | Full wordmark | Compact mark |
| --- | --- | --- |
| Light surface | `https://raw.githubusercontent.com/pawisssh/neon/main/starters/vitejs-cds/src/assets/logo/logo-finnomena-text-light.svg` | `https://raw.githubusercontent.com/pawisssh/neon/main/starters/vitejs-cds/src/assets/logo/logo-finnomena-icon-light.svg` |
| Dark surface | `https://raw.githubusercontent.com/pawisssh/neon/main/starters/vitejs-cds/src/assets/logo/logo-finnomena-text-dark.svg` | `https://raw.githubusercontent.com/pawisssh/neon/main/starters/vitejs-cds/src/assets/logo/logo-finnomena-icon-dark.svg` |

Example: `<img src="https://raw.githubusercontent.com/pawisssh/neon/main/starters/vitejs-cds/src/assets/logo/logo-finnomena-text-light.svg" alt="Finnomena" width="136" height="32">`. Preserve its intrinsic 136×32 or 32×32 dimensions; do not recolor or redraw the mark.

### Header

White `background-primary` with a bottom `border-subtle` hairline. Place the real logo in the full sidebar or page header; keep it visible when the sidebar disappears. Use the logo-only header for Immersive. Separate any primary action from the header surface.

### Sidebar and Bottom Navigation

White surfaces with subtle separators. Use consistent monochrome icons from one icon set, with matching size and stroke weight. Show the active destination with a quiet fill plus label/icon emphasis; provide accessible names and tooltips in icon rails. Keep phone destinations labeled. BottomNav is navigation, not a page footer.

### Footer

White `background-primary` with a top `border-subtle` hairline, secondary text, and standard link tokens. Include supporting information only when useful; a page footer is optional.

### Buttons

Primary: `button-primary` fill, `text-on-color`, `body` typography, 8px radius, minimum 48px height, and 12px × 16px padding. Let height grow for wrapping labels. Secondary and tertiary actions use their corresponding token families. Use hover/active variants, `button-disabled` for unavailable actions, and `button-danger` for destructive actions. See Visual Hierarchy for the one-primary-per-page/component rule.

### Form Fields

Use a visible label, white fill, `border-interactive` edge, 8px radius, and 16px padding. Strengthen the border with `border-strong` when needed for visibility. Placeholders supplement labels. Keep helper/error text adjacent, identify errors in words, and retain entered values after validation.

### Cards, Lists & Tables

Use white or `background-secondary` surfaces, 8px radii where bounded, 24px padding, and subtle row separators. Keep primary identifiers left-aligned and comparable amounts right-aligned. Make selection visible with `highlight` and an additional edge or indicator. On small screens retain essential fields and expose secondary details on selection; wide tables may scroll in a labeled region. Avoid automatic three-card sections, redundant labels, empty panels, and decorative status indicators. Equal grids and repeated patterns are appropriate when they help compare information.

### Tabs & Filters

Use quiet neutral surfaces, clear selected labels, and an underline or border indicator. Separate view-switching tabs from filtering controls. Expose active filters and a reset action when applicable.

### Illustration Panel

Use real brand assets and relevant flat illustrations or product visuals when they aid understanding. Keep them contained and clear of text; color may appear alongside semantic UI and charts. Dense task screens need no decorative image. Do not present an invented preview as an existing product; identify illustrative mockups as examples.

## Interaction & Accessibility

- Support default, hover, pressed, focus, selected, disabled, and loading states where relevant. Use a visible 2px `focus` outline with offset; never rely on hover alone.
- Keep controls keyboard-operable, icon buttons named, form labels associated, and reading/focus order logical. Use approximately 44px minimum touch targets.
- Default to still content with clear interaction feedback. Use motion to explain state changes or preserve orientation; avoid effects that delay reading or operating the screen. Respect reduced-motion preferences.
- Check text and essential control contrast on the rendered surface; subtle separators are not sufficient as the only control boundary. Pair status colors with words or symbols.
- Loading: preserve layout with skeletons or a labeled progress indicator. Empty: explain the absence and offer a relevant next action. Error: state what failed and offer recovery. Success: confirm the result without disrupting the task.
- Use concrete Thai or English matching the request, with consistent currency, dates, units, and precision. Do not invent testimonials, customer endorsements, performance claims, or financial results. Clearly identify sample data.

## Screen Recipe & Review

Choose a layout → place the real logo → apply the tokens → build the primary task → adapt companion panes → verify states and keyboard access.

- **Orders:** Detailed at 1440px: 360px sidebar, 400px selectable order list, and 680px details pane. Use `title1` for the page title, `body` for rows, aligned amounts, and one dominant detail action. On narrow screens, open details with Back navigation and preserve list state.
- **Financial report:** Content at 1440px: 320px sidebar, 720px report, and 400px supporting inspector. Use `title2` section headings, labeled charts/tables, and 24px internal spacing. Keep the report visible when the inspector moves to an on-demand view; identify units, periods, and sample values.

Before delivery, verify:

- The primary task is clear; layout, hierarchy, and density support it.
- The real logo is visible at every width; white chrome, typography, spacing, and semantic colors remain consistent.
- Content and claims are supported or clearly labeled as examples; every visual serves a purpose.
- Motion explains feedback or change, respects reduced motion, and does not obstruct use.
- Navigation, mobile details, keyboard access, and loading/empty/error states are usable; Thai text is not clipped.
