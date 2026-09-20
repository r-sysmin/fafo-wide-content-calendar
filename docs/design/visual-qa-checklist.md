# Visual QA Checklist

Quick pass to verify the design rules (color = action, minimal lines, no shadows, square shape, content over decoration) hold across the key surfaces.

Run after any UI change. Each item is a yes/no — if "no", fix before shipping.

## Global

- [ ] No hardcoded color classes (`text-white`, `bg-black`, `bg-[#...]`) — only semantic tokens
- [ ] No `rounded-*` utilities anywhere — `--radius: 0px` means everything is square (exception: functional circles like color swatches via `rounded-full`)
- [ ] No `shadow-*` utilities (exception: sidebar)
- [ ] No `border` used purely for separation — space or `bg-muted`/`bg-card` first
- [ ] No `transition-shadow` / `transition-colors` decoration on hover
- [ ] No color used to draw attention — size, weight, position do that job
- [ ] No animation unless it clarifies a state change

## Sidebar (`app-sidebar.tsx`)

- [ ] Active nav item: icon **and** label in `text-primary`
- [ ] Inactive nav item: icon and label in `text-foreground` / `text-muted-foreground`
- [ ] Icon-only buttons (settings, logout): icon in `text-primary`
- [ ] Pillar color swatch is `rounded-full`, no `border`
- [ ] Popover trigger and color chips: no `border`
- [ ] Sidebar shadow is the **only** allowed shadow

## Post Card (`post-card.tsx`)

- [ ] Card itself: no `rounded-*`, no `border`, no `shadow-*`
- [ ] Hover state: `bg-muted/60` (not shadow)
- [ ] Drag state: `bg-muted` (not `shadow-lg`)
- [ ] Status shown as text label (`Draft` / `Scheduled` / `Published`) in `text-xs text-muted-foreground` — never as a colored dot
- [ ] Media wrapper: `bg-muted`, no `border`, no `rounded-*`
- [ ] Pillar badge: no `borderColor` style override
- [ ] Dropdown trigger button: icon-only → `text-primary`

## Idea Card (`idea-card.tsx`)

- [ ] Same status-label rule as Post Card
- [ ] Media wrapper: no `rounded-*`, no `border`, no `transition-colors`
- [ ] Icons inside card: inherit color, not forced `text-muted-foreground`

## Composers (`publish-composer-modal.tsx`, `create/composer-modal.tsx`)

- [ ] Media preview: no `rounded-*`, no `border-border`
- [ ] "Replace" label: no `border-input`
- [ ] "Attach" label: no `border-dashed border-border`
- [ ] Upload icon (`IconUpload`): `text-primary` (it's the clickable affordance)
- [ ] Primary CTA ("Add to Queue" / "Schedule"): one per modal, uses `Button` primary variant
- [ ] Secondary actions: `text-muted-foreground hover:text-foreground`, no outline button
- [ ] Spacing between sections via `space-y-*` or `gap-*`, not separator lines

## Color usage rule (quick reference)

| Element                                  | Color                                              |
| ---------------------------------------- | -------------------------------------------------- |
| Icon-only clickable button               | `text-primary`                                     |
| Icon + text clickable (inactive)         | icon `text-primary`, text `text-foreground`        |
| Icon + text clickable (selected/active)  | both `text-primary`                                |
| Status / metadata (information, not action) | `text-muted-foreground`, no color                |
| Decorative element                       | no color — remove it instead                       |

## How to run the pass

1. Open each surface in the preview at 1280px and at mobile width
2. Walk the checklist top-to-bottom for that surface
3. For any "no": fix in the component file, re-check, then move on
4. Final scan: `rg "rounded-(sm|md|lg|xl)|shadow-(sm|md|lg|xl)|border-border" src/pages src/components/base` — should return nothing outside the sidebar