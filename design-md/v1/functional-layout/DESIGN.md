---
name: Finnomena Neon - Functional layout
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
    fontSize: 34px
  title1:
    fontSize: 28px
  title2:
    fontSize: 22px
  title3:
    fontSize: 20px
  headline:
    fontSize: 17px
  body:
    fontSize: 17px
  subheadline:
    fontSize: 15px
  footnote:
    fontSize: 13px
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
| Boundaries | `border-subtle`, `border-strong` | Separators and emphasized edges; control edges use the Black 10A hairline step (see Extended Palette) |
| Actions | `button-primary`, `button-secondary`, `button-tertiary` | Main, supporting, and quiet actions; use their hover/active variants |
| Links and focus | `link-primary`, `interactive` | Indigo links and interactive emphasis; link hover is Indigo 115 and the focus ring Indigo 65 (see Extended Palette) |
| Feedback | `support-success`, `support-warning`, `support-error` | State icons and matching notification backgrounds; pair with text |
| Financial change | `text-positive`, `text-negative` | Gains and losses, with signs or labels |

Keep structural surfaces white; reserve navy for controls and emphasis. Yellow `background-brand` / `button-highlight` is an exceptional brand highlight, not the default CTA. Use the `support-*` family for feedback: legacy `status-*` names in the token inventory do not reliably match their semantic colors.

### Data Visualization Colors (Multi-asset)

Use the `multi-asset-*` tokens only for their named asset categories. Keep category colors consistent across charts; add labels, values, and legends so color is never the sole identifier. Use dark labels beside light yellow/green marks. Label units, periods, and unavailable data; never imply that missing values are zero.

### Extended Palette: Tint, Shade & Opacity

Beyond the semantic roles above, each core brand hue — Yellow, Navy, Grey, Green, Blue, Purple, Red, Orange, Indigo — extends into a tint/shade/opacity scale for charts, decorative accents, and illustration fields the semantic tokens don't cover. `100` is a hue's pure/base tone (several semantic tokens already sit at this step, e.g. Navy 100 backs `button-primary`, Yellow 100 backs `background-brand`). Steps below 100 — 75, 50, 25, 0 — tint the hue toward white; steps above — 125, 150, 175 — shade it toward black. Grey has no shade tier past 100, since 100 is already pure black; shade neutrals with Navy instead. Each hue (other than Grey) also carries opacity variants at 25/50/75% of its 100 tone, for overlays, scrims, and fades — never as a substitute for a solid tint/shade fill.

The steps named above are the representative ones; the underlying scale is finer, running in 5-unit increments from 0 to 200, with matching opacity variants at the same increments (`10A` is the 100 tone at 10% alpha). Reach for an in-between step only when a named one genuinely doesn't fit.

This is a naming and usage pattern, not a literal value table: pull exact hex for a given hue/step from the design system's color foundations when implementing, rather than approximating. Keep one hue and one step consistent within a single chart series, illustration, or accent block. Multi-asset categories keep their dedicated `multi-asset-*` tokens rather than an ad hoc palette pick.

A few recurring roles are expressed as a palette step instead of carrying their own token, since each is derivable from a hue already in the semantic set:

| Role | Step | Anchored to |
| --- | --- | --- |
| Keyboard focus ring | Indigo 65 | One step lighter than `interactive` (Indigo 75) |
| Link hover | Indigo 115 | One shade step past `link-primary` (Indigo 100) |
| Selected-row wash | Indigo 10A | `link-primary`'s hue at 10% alpha |
| Control and field hairline | Black 10A | One step stronger than `border-subtle` (Black 5A) |

## Typography

Use **IBM Plex Sans Thai** for Thai and Latin text, with `sans-serif` as the loading fallback. Load weights 400, 500, and 700 when available; preserve Thai marks and wrapping without clipping.

| Role | Token | Size | Use for |
| --- | --- | --- | --- |
| Hero / major page title | `largeTitle` | 34px | The single largest text on a screen — a hero number (see Visual Hierarchy), or a page title in a spacious, low-density layout. At most one per screen. |
| Page title | `title1` | 28px | The standard page title — e.g. "Orders", "Portfolio" — in a normal-density workspace screen. |
| Section title | `title2` | 22px | A named section within a page — a report section, a grouped list heading, a panel header. |
| Subsection or card title | `title3` | 20px | A heading one level below a section title — a card header, a table group label, a modal/sheet title. Use when `title2` would compete with the page's own section titles. |
| Emphasized label | `headline` | 17px | Text that needs more visual weight than body copy without becoming a heading — a selected-row name, a key metric's label, a button's text. |
| Body and controls | `body` | 17px | Default reading text, form field values, table cell content — the working size for most UI. |
| Secondary copy | `subheadline` | 15px | Supporting text beside or below primary content — a description line, a helper caption that isn't metadata. |
| Metadata | `footnote` | 13px | Timestamps, reference numbers, fine print, and other low-priority detail. |

Every role above resolves to the frontmatter's `typography.<role>.fontSize` — there is no separate line-height or weight token; give each block a comfortable line-height (roughly 1.2–1.3× its size) and default to regular weight, reserving medium/bold for `headline` and other roles marked "Emphasized." Keep body copy left-aligned, allow longer reading text more line height, and right-align comparable numeric values with consistent precision and units.

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

**Hero object.** Lead with a single focal element sized to be the first thing the eye lands on: the page's core number, chart, or subject, rendered at the largest type or visual scale in view (`largeTitle` for numerals, a full-width chart, or a dominant illustration). Place it near the top of the content area, isolated from supporting detail by whitespace, with context (date, status, ticker, account) set in `footnote` immediately below or beside it — never at competing size. A buy amount, a net-worth figure, an order total: one number or image per view is the anchor; everything else is supporting detail rendered smaller and quieter.

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

Detailed's fixed content column and Content's fixed inspector column use 320px at SM/MD, 360px at LG–XXL, 400px at XXXL, and 560px at Max, when shown alongside another pane. End margins and pane gutters are 16px through XXL and 24px from XXXL up. A sole working pane fills the available width. No screen scrolls horizontally at page level at any tier — a wide table or board scrolls inside its own labeled region instead. Use `min-height: 100dvh` for full-height shells, never `100vh`.

Adapt panes to fit:

- Reserve at least 320px for the flexible working pane before showing a fixed companion; otherwise fall back to a separate view or sheet. Detailed keeps list-and-detail access; Content keeps the main content visible and opens the inspector on demand. Preserve selection, filters, scroll position, and a Back/Close action.
- Simple keeps a single content pane at every width. Immersive hides sidebar, inspector, and BottomNav at every width, and stacks landing-page sections on narrow screens.
- Below 500px, show BottomNav only when navigation exists; keep the real logo visible and reserve space for fixed navigation, keyboard focus, and device safe areas.

## Components

### Logo requirement

Every screen uses an approved Finnomena SVG, never recreated text. Render the matching raw GitHub URL below directly. Use the full wordmark in a header or full sidebar and the compact mark in an icon rail.

| Surface | Full wordmark | Compact mark |
| --- | --- | --- |
| Light surface | `https://raw.githubusercontent.com/pawisssh/neon/main/templates/vitejs-cds/src/assets/logo/logo-finnomena-text-light.svg` | `https://raw.githubusercontent.com/pawisssh/neon/main/templates/vitejs-cds/src/assets/logo/logo-finnomena-icon-light.svg` |
| Dark surface | `https://raw.githubusercontent.com/pawisssh/neon/main/templates/vitejs-cds/src/assets/logo/logo-finnomena-text-dark.svg` | `https://raw.githubusercontent.com/pawisssh/neon/main/templates/vitejs-cds/src/assets/logo/logo-finnomena-icon-dark.svg` |

Example: `<img src="https://raw.githubusercontent.com/pawisssh/neon/main/templates/vitejs-cds/src/assets/logo/logo-finnomena-text-light.svg" alt="Finnomena" width="136" height="32">`. Preserve its intrinsic 136×32 or 32×32 dimensions; do not recolor or redraw the mark.

### Header

White `background-primary` with a bottom `border-subtle` hairline. Place the real logo in the full sidebar or page header; keep it visible when the sidebar disappears. Use the logo-only header for Immersive. Separate any primary action from the header surface.

### Sidebar and Bottom Navigation

White surfaces with subtle separators. Use consistent monochrome icons from one icon set, with matching size and stroke weight. Show the active destination with a quiet fill plus label/icon emphasis; provide accessible names and tooltips in icon rails. Keep phone destinations labeled. BottomNav is navigation, not a page footer.

### Footer

White `background-primary` with a top `border-subtle` hairline, secondary text, and standard link tokens. Include supporting information only when useful; a page footer is optional.

### Buttons

Primary: `button-primary` fill, `text-on-color`, `body` typography, 8px radius, minimum 48px height, and 12px × 16px padding. Let height grow for wrapping labels. Secondary and tertiary actions use their corresponding token families. Use hover/active variants, `button-disabled` for unavailable actions, and `button-danger` for destructive actions. See Visual Hierarchy for the one-primary-per-page/component rule.

### Form Fields

Use a visible label, white fill, a Black 10A hairline edge, 8px radius, and 16px padding. Strengthen the border with `border-strong` when needed for visibility. Placeholders supplement labels. Keep helper/error text adjacent, identify errors in words, and retain entered values after validation.

### Cards, Lists & Tables

Use white or `background-secondary` surfaces, 8px radii where bounded, 24px padding, and subtle row separators. Keep primary identifiers left-aligned and comparable amounts right-aligned. Make selection visible with an Indigo 10A wash plus an additional edge or indicator. On small screens retain essential fields and expose secondary details on selection; wide tables may scroll in a labeled region. Avoid automatic three-card sections, redundant labels, empty panels, and decorative status indicators. Equal grids and repeated patterns are appropriate when they help compare information.

### Tabs & Filters

Use quiet neutral surfaces, clear selected labels, and an underline or border indicator. Separate view-switching tabs from filtering controls. Expose active filters and a reset action when applicable.

### Illustration Panel

Use real brand assets and relevant flat illustrations or product visuals when they aid understanding. Keep them contained and clear of text; color may appear alongside semantic UI and charts. Dense task screens need no decorative image. Do not present an invented preview as an existing product; identify illustrative mockups as examples.

## Interaction & Accessibility

- Support default, hover, pressed, focus, selected, disabled, and loading states where relevant. Use a visible 2px Indigo 65 focus outline with offset; never rely on hover alone.
- Keep controls keyboard-operable, icon buttons named, form labels associated, and reading/focus order logical. Use approximately 44px minimum touch targets.
- Default to still content with clear interaction feedback; use motion only to explain a state change or preserve orientation. See Motion below for durations and limits.
- Check text and essential control contrast on the rendered surface; subtle separators are not sufficient as the only control boundary. Pair status colors with words or symbols.
- Loading: preserve layout with skeletons or a labeled progress indicator. Empty: explain the absence and offer a relevant next action. Error: state what failed and offer recovery. Success: confirm the result without disrupting the task.

### Motion

Motion in a workspace explains change; it never decorates. Keep it short enough that it cannot delay a task.

- Animate `transform` and `opacity` only — never `width`, `height`, `top`, or `left`. Composited properties keep interaction responsive under dense tables and charts.
- State changes (hover, press, selection, expand/collapse) run 120–200ms on an ease-out curve. Entrances and pane transitions cap at 250ms.
- Nothing on a workspace screen loops perpetually: no pulsing dots, drifting icons, or shimmer outside a genuine loading state.
- Stagger a list or grid only when arrival order carries meaning — 30–50ms per item, roughly eight items maximum; beyond that, render at once.
- Under `prefers-reduced-motion`, drop to an instant state change: keep the outcome, remove the transition. Never gate information behind an animation.

## Content & Sample Data

Sample content is where a generated screen most often stops looking like a real product. Write it as though pulled from production, then label it as illustrative.

- **Numbers read as measured, not authored.** Use organic values at realistic precision — `47,283.19 ฿`, `+3.42%`, NAV `12.6598` — never round placeholders like `100,000.00`, `50%`, or `99.99%`. Vary magnitudes between rows; real portfolios are not evenly spaced. Keep currency, units, and decimal places consistent down a column.
- **Names are plausible and local.** Use realistic Thai or English names and real-format fund, order, and account identifiers (`ASP-DIGIBLOC`, `KKP ***2416`, `TH-2569-0041`), with dates in the screen's locale. Never `John Doe`, `Sarah Chan`, `Acme`, `Fund A`, `Lorem ipsum`, or `Example Co.`
- **Copy names the thing.** No marketing filler — `Elevate`, `Seamless`, `Unleash`, `Next-Gen`, `Revolutionize` — and no instructional chrome such as "Scroll to explore" or "Click here". A label says what the control does; empty and error text says what happened and what to do next.
- **Claims stay unfabricated.** Never invent testimonials, endorsements, returns, performance figures, ratings, or regulatory statements. Mark illustrative data plainly once per surface (`ข้อมูลตัวอย่าง` / "Sample data"), not on every row.
- **Imagery resolves.** Brand marks use the approved logo URLs above. For any other placeholder image use a deterministic source such as `https://picsum.photos/seed/<stable-seed>/800/600`; never paste an Unsplash page link, hotlink a CDN URL, or invent a local file path. Use initials or a generated SVG avatar for people. Never present a placeholder as a real product screenshot.

## Anti-Patterns

Treat each of these as a defect to fix before delivery, not a matter of taste.

- **Surface:** shadows or outer glows for depth — depth comes from white/secondary surfaces and hairlines; gradient text; neon or purple "AI" gradients; custom cursors; decorative status dots that encode nothing.
- **Color:** yellow `button-highlight` as a routine CTA; `multi-asset-*` colors used decoratively; color as the only carrier of meaning; legacy `status-*` tokens for new semantic feedback.
- **Hierarchy:** more than one `button-primary` per page or self-contained component; two elements competing to be the focal point; a heading set larger than the screen's hero; a three-card row added to fill space rather than to compare.
- **Layout:** `height: 100vh`; horizontal page overflow at any tier; text overlapping imagery; `z-index` beyond the header, overlay, and modal layers; an inspector with no detail content.
- **Interaction:** hover-only affordances; a circular spinner where a layout-preserving skeleton fits; motion that delays reading; a disabled control with no explanation of what would enable it.
- **Content:** emoji in UI text; round placeholder numbers; generic names; AI marketing clichés; invented claims; broken or hotlinked image URLs.

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
- Checked at 375px, 768px, 1024px, 1440px, and 1920px: sidebar behavior matches its tier, no page-level horizontal scroll, and no clipped or overlapping content at any of them.
- Sample data, names, numbers, and imagery pass Content & Sample Data; nothing in Anti-Patterns survives.
