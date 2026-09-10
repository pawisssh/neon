# Generate a Finnomena immersive landing showcase

Build a runnable Vite React application in `.local/evals/design-md/generated/test-project-[MODEL_NAME]-immersive-attempt-01` (relative to the repository root). Use React Router, `lucide-react` for monochrome icons, React, and vanilla CSS only—do not use a UI library. The only design input is:

- `design-md/finnomena/immersive-layout/DESIGN.md`

Do not read evaluator fixtures, test files, or reports. Keep sample financial data clearly labeled as illustrative and do not make unsupported financial claims.

## Routes

Implement direct-loadable routes `/` and `/immersive`. The index page links to the showcase route. The immersive route is a standalone, full-width landing page.

## Immersive screen

Build `/immersive` as a FinnoExclusive focused landing page using the immersive guide. It has a full wordmark logo header and full-bleed, scrollable content; it has no sidebar, inspector, bottom navigation, persistent product navigation, form, or workspace chrome.

Use a concise editorial hierarchy, a single primary in-page CTA, an accessible proof section, and a purposeful product/editorial visual. The CTA scrolls or focuses the proof block; it does not open a form. Include a labeled, educational multi-asset visual with category names and values. Use the ten multi-asset colors only in that labeled visual, not as decorative page colors.

## Automation contract

Use these hooks on the visible, real elements. They are identifiers only; the immersive guide decides visual styling.

### Shared structure

- Every route has one `data-testid="screen"` root, with `data-layout` equal to its route slug.
- Each screen has a visible real `<img data-testid="brand-logo">` with descriptive alt text.
- The immersive `content-pane` is its full page content region. It must not render `sidebar`, `inspector`, or `bottom-nav`.

### Immersive components

- `logo-header`: the logo-only header.
- `primary-action`: one accessible link or button that targets `#proof-block`.
- `tier-label`: visible `FinnoExclusive` label.
- `proof-block`: an anchored, source-supported proof statement or clearly labeled illustrative example.
- `media-frame`: the meaningful editorial/product image frame with useful alt text.
- `compact-footer`: a compact landing-page footer.
- `multi-asset-visual`: the educational visual. Each color use has a corresponding `data-asset-category` element with a visible category name and value.

## CSS tokens and responsive behavior

Define CSS custom properties from the supplied guide exactly: the immersive core palette, its 25/50/75/100 levels, tier mappings, and all ten multi-asset colors. Do not duplicate a colour's `100` value as a separate palette token. Respect the guide's responsive breakpoints and avoid horizontal page overflow at narrow and wide viewports.

## Delivery

Provide launch instructions and the showcase URL. Report checks actually performed. Do not claim browser testing if it was unavailable.
