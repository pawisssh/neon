# Generate a Finnomena functional workspace showcase

Build a runnable Vite React application in `.local/evals/design-md/generated/test-project-[MODEL_NAME]-functional-attempt-01` (relative to the repository root). Use React Router, `lucide-react` for monochrome icons, React, and vanilla CSS only—do not use a UI library. The only design input is:

- `design-md/finnomena/functional-layout/DESIGN.md`

Do not read evaluator fixtures, test files, or reports. Keep sample financial data clearly labeled as illustrative and do not make unsupported financial claims.

## Routes

Implement direct-loadable routes `/`, `/detailed`, `/content`, and `/simple`. The index page links to all three showcase routes. Product screens share the functional layout chrome.

## Functional screens

- `/detailed`: a selectable order list and selected order details. Show at least three orders with fund, status, amount, date, and reference.
- `/content`: portfolio reporting, including allocation, selectable holdings, and selected holding details. Show at least three holdings.
- `/simple`: saved funds with a usable search and at least three funds. Do not add an inspector.

Follow the functional guide's semantic tokens, responsive breakpoints, pane sizing, logos, typography, and accessibility rules. For `detailed` and `content`, a narrow-screen detail view includes Back and preserves the selection. Do not add a multi-column screen.

## Automation contract

Use these hooks on the visible, real elements. They are identifiers only; the functional guide decides visual styling.

### Shared structure

- Every route has one `data-testid="screen"` root, with `data-layout` equal to its route slug and `data-state` set to `populated`, `loading`, `empty`, or `error`.
- Each screen has a visible real `<img data-testid="brand-logo">` with descriptive alt text.
- Outer panes use `data-testid="sidebar"`, `content-pane`, and `inspector` where present. Narrow-phone navigation uses `bottom-nav` where the guide requires it.

### Functional interactions

- `order-item` and `holding-item` are native buttons with unique stable `data-id`, visible matching `data-name`, and `aria-pressed`. The selected `inspector` has `data-selected-id` and names the selected item.
- The narrow details view uses `detail-back`.
- The saved-funds input is a labeled editable `watchlist-search`; each `watchlist-item` has a `data-name` matching its visible fund. Searching the full name leaves only that item; clearing restores all items.

### State previews

Routes support `?state=populated|loading|empty|error`; no query means `populated`. The populated records sit in `data-region`. A non-populated state replaces those records with one visible `state-loading`, `state-empty`, or `state-error` element and a `state-reset` button restoring populated content. Chrome remains appropriate to the selected layout.

## CSS tokens and responsive behavior

Define CSS custom properties from the supplied guide exactly: the functional semantic tokens and breakpoints. Respect the guide's responsive breakpoints and avoid horizontal page overflow at narrow and wide viewports.

## Delivery

Provide launch instructions and the three showcase URLs. Report checks actually performed. Do not claim browser testing if it was unavailable.
