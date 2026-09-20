# Implementation Map — Content Calendar

Maps each screen to existing components, reuse opportunities, and new work.

---

## Screen 1: Landing Page (`/`)

| Component | Strategy | Notes |
|-----------|----------|-------|
| Header | **Reuse + swap content** | `pages/landing/components/header.tsx` — update CTAs to "Try demo" (primary) and "Sign in" (ghost), remove nav links |
| Hero | **Reuse + swap content** | Swap to `hero-02` pattern — headline, subheading, two CTAs, product mockup right. Existing `hero-01.tsx` replaced |
| Feature showcase | **Reuse + swap content** | `pages/landing/components/feature-showcase-01.tsx` — swap tab labels to "Idea Board", "Schedule", "Compose", "Track" with product mockups |
| Supporting features | **New component** | `pages/landing/components/features-grid.tsx` — bento grid with 4 feature cells (PenLine, CalendarDays, BarChart2, Globe). No existing bento grid exists |
| Testimonials | **Reuse + swap content** | Existing testimonial slider components — swap data to Content Calendar testimonials |
| CTA banner | **Reuse + swap content** | `pages/landing/components/cta-02.tsx` — update copy to "Stop juggling tools. Start shipping content." |
| Footer | **Reuse + swap content** | Update links per screenboard spec |

---

## Screen 2: Sign In (`/sign-in`)

| Component | Strategy | Notes |
|-----------|----------|-------|
| Layout | **Reuse as-is** | `application-layout.tsx` — fullscreen, no chrome |
| Auth card | **New component** | `pages/sign-in/index.tsx` — card with OAuth buttons, email/password form, links. Uses `card`, `input`, `button`, `separator` from shadcn |
| OAuth flow | **New component** | Uses `lovable.auth.signInWithOAuth()` from `@/integrations/lovable/index` |
| Email flow | **New component** | Uses `supabase.auth.signInWithPassword()` |

---

## Screen 3: Sign Up (`/sign-up`)

| Component | Strategy | Notes |
|-----------|----------|-------|
| Layout | **Reuse as-is** | `application-layout.tsx` |
| Auth card | **New component** | `pages/sign-up/index.tsx` — same OAuth + full name/email/password form. Uses `supabase.auth.signUp()` |

---

## Screen 4: Create / Idea Board (`/create`, `/demo/create`)

| Component | Strategy | Notes |
|-----------|----------|-------|
| Layout | **Reuse as-is** | `workspace-layout-01.tsx` — peekable sidebar |
| Sidebar nav | **Adapt pattern** | `pages/create/components/app-sidebar.tsx` — adapt existing `workspace/components/app-sidebar.tsx` with Create + Publish nav items |
| Top bar | **New component** | `pages/create/components/create-top-bar.tsx` — title, Board/Gallery toggle, "+ New Idea" button |
| Kanban board | **New component** | `pages/create/components/kanban-board.tsx` — 5-column DnD grid. No existing kanban component. Uses `@dnd-kit/sortable`, `card`, `scroll-area`, `badge` |
| Kanban column | **New component** | `pages/create/components/kanban-column.tsx` — single column with header, card list, "+ Add" footer |
| Idea card | **New component** | `pages/create/components/idea-card.tsx` — draggable card with thumbnail, caption preview, pillar badge |
| Gallery view | **New component** | `pages/create/components/gallery-view.tsx` — 3-column grid alternative to board view |
| Composer modal | **New component** | `pages/create/components/composer-modal.tsx` — `dialog` with caption, platforms, pillar, schedule, media. Shared between Create and Publish |

---

## Screen 5: Publish / Calendar (`/publish`, `/demo/publish`)

| Component | Strategy | Notes |
|-----------|----------|-------|
| Layout | **Reuse as-is** | `workspace-layout-01.tsx` |
| Sidebar | **Adapt pattern** | Same sidebar as Create + channels section in sidebar body |
| Top bar | **New component** | `pages/publish/components/publish-top-bar.tsx` — week navigation, view toggle (Week/Month/List), filter dropdowns, "+ New Post" |
| Week calendar | **New component** | `pages/publish/components/week-calendar.tsx` — 7-col x hourly-row DnD grid. Uses `@dnd-kit/core`, `card`, `scroll-area` |
| Month calendar | **New component** | `pages/publish/components/month-calendar.tsx` — 7x5 date grid with post chips |
| Post list view | **New component** | `pages/publish/components/post-list-view.tsx` — flat chronological `table` with metrics |
| Post card | **New component** | `pages/publish/components/post-card.tsx` — compact card for calendar cells |
| Channel sidebar | **New component** | `pages/publish/components/channel-sidebar.tsx` — channel filter list in sidebar body |

---

## Infrastructure (pre-screen)

| Component | File | Strategy |
|-----------|------|----------|
| Seed data | `src/data/seed.ts` | **New** — typed fixtures for all 7 tables per cloudboard |
| Data provider | `src/lib/data-provider.tsx` | **New** — interface + SeedDataProvider + SupabaseDataProvider |
| Auth provider | `src/lib/auth/auth-provider.tsx` | **New** — real Supabase auth with onAuthStateChange → getSession |
| Protected route | `src/components/protected-route.tsx` | **New** — redirect to /sign-in when !user && !loading |
| Filter context | `src/lib/filter-context.tsx` | **New** — shared date range + platform + pillar + status filters |
| Badge (base) | `src/components/base/badge.tsx` | **New** — color variant wrapper around `ui/badge` |
| Lovable client | `src/integrations/lovable/index.ts` | **New** — shim for `lovable.auth.signInWithOAuth()` |
| Supabase client | `src/integrations/supabase/client.ts` | **New** — `createClient` with env vars |
| Routes | `src/App.tsx` | **Adapt** — add all routes, wrap demo/protected paths in providers |
| Theme tint | `src/style-pack.css` | **Adapt** — change primary from red to coral |

---

## Reuse summary

- **Reuse as-is**: 2 layouts (application-layout, workspace-layout-01)
- **Reuse + swap content**: 5 landing components (header, hero, feature-showcase, testimonials, CTA)
- **Adapt pattern**: 2 components (sidebar nav, route tree)
- **New components**: 15+ page-scoped components across 5 screens + 6 infrastructure modules
