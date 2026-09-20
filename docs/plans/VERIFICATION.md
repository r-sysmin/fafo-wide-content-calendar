# Verification — Content Calendar

## Summary

All 5 screens from the Screen List are implemented: Landing Page, Sign In, Sign Up, Create (Idea Board), and Publish (Calendar). Infrastructure modules (seed data, data provider, auth provider, protected routes, filter context, routing) are in place. The build passes cleanly (`npm run build` succeeds with no errors). No SPEC-GAP comments exist in the codebase.

**What was intentionally not changed:**
- `components/ui/` — sacred, untouched
- `components/ai-elements/` — sacred, untouched
- `layouts/application-layout.tsx` — used as-is for auth screens
- `layouts/workspace-layout-01.tsx` — used as-is for Create and Publish

---

## Files changed

| File | Reason | Change summary |
|---|---|---|
| `src/App.tsx` | Routing | Added all routes: public (landing, sign-in, sign-up), demo (`/demo/create`, `/demo/publish` with SeedDataProvider), protected (`/create`, `/publish` with SupabaseDataProvider + ProtectedRoute) |
| `src/data/seed.ts` | Seed data | Typed fixtures for 7 entities: ContentPillar (4), Column (5), Card (15), Channel (4), Post (13), Metrics (3), PostWithMetrics (13) |
| `src/data/landing.ts` | Landing content | Feature tabs (4), testimonials (4), footer link groups |
| `src/lib/data-provider.tsx` | Data layer | ContentCalendarDataProvider interface + SeedDataProvider (in-memory with filtering) + SupabaseDataProvider (real queries with React Query) |
| `src/lib/auth/auth-provider.tsx` | Auth | AuthProvider context with onAuthStateChange, getSession, signOut (clears React Query cache) |
| `src/lib/filter-context.tsx` | Filters | Shared filter state (platform, contentPillarId, status) for Publish screen |
| `src/components/protected-route.tsx` | Route guard | Redirects unauthenticated users to `/sign-in` with `from` state |
| `src/components/base/badge.tsx` | UI wrapper | Color-variant badge wrapping `ui/badge` |
| `src/integrations/lovable/index.ts` | OAuth | Lovable OAuth client shim for `signInWithOAuth` |
| `src/integrations/supabase/client.ts` | Supabase | Supabase client with env vars |
| `src/style-pack.css` | Theme | Updated primary color to coral per spec |
| `src/pages/landing/index.tsx` | Landing page | Composed all sections with Content Calendar copy |
| `src/pages/landing/components/header.tsx` | Header | "Content Calendar" wordmark, "Try demo" + "Sign in" CTAs |
| `src/pages/landing/components/hero-02.tsx` | Hero | Heading, subheading, dual CTAs, product mockup |
| `src/pages/landing/components/mockups.tsx` | Mockups | Static product mockups: Kanban, Schedule, Compose, Track |
| `src/pages/landing/components/feature-showcase-01.tsx` | Feature showcase | 4-tab autoplay: Idea Board, Schedule, Compose, Track |
| `src/pages/landing/components/features-03.tsx` | Features grid | 4-cell bento: PenLine, CalendarDays, BarChart2, Globe |
| `src/pages/landing/components/testimonial-card.tsx` | Testimonial | Quote card with name, role, company |
| `src/pages/landing/components/cta-01.tsx` | CTA | "Stop juggling tools. Start shipping content." |
| `src/pages/landing/components/footer.tsx` | Footer | 4-column footer with Content Calendar branding |
| `src/pages/sign-in/index.tsx` | Sign In page | Auth redirect check, renders SignInCard |
| `src/pages/sign-in/components/sign-in-card.tsx` | Sign In card | Google/Apple OAuth, email/password, forgot link, sign-up link, demo link |
| `src/pages/sign-in/components/forgot-password-card.tsx` | Forgot password | Email input, "Check your email" confirmation, resend |
| `src/pages/sign-up/index.tsx` | Sign Up page | Auth redirect check, renders SignUpCard |
| `src/pages/sign-up/components/sign-up-card.tsx` | Sign Up card | Google/Apple OAuth, full name + email + password, "Check your email" success |
| `src/pages/create/index.tsx` | Create page | Board/Gallery toggle, empty state, composer modal orchestration |
| `src/pages/create/components/kanban-board.tsx` | Kanban board | 5-column DnD board with @dnd-kit, column CRUD, card reorder |
| `src/pages/create/components/kanban-column.tsx` | Kanban column | Column header (rename), card list, add card, delete confirm dialog |
| `src/pages/create/components/idea-card.tsx` | Idea card | Draggable card with media, title, caption, pillar badge, edit/delete menu |
| `src/pages/create/components/gallery-view.tsx` | Gallery view | 3-column grid of idea cards |
| `src/pages/create/components/composer-modal.tsx` | Composer modal | Title, caption, platforms, pillar, schedule, media, char count, save/schedule/publish |
| `src/pages/create/components/empty-state.tsx` | Empty state | "Add your first idea" with skeleton columns |
| `src/pages/publish/index.tsx` | Publish page | View switcher (week/month/list), filter orchestration, DnD reschedule |
| `src/pages/publish/components/week-calendar.tsx` | Week calendar | 7-col × 12-hour DnD grid with @dnd-kit |
| `src/pages/publish/components/month-calendar.tsx` | Month calendar | 7×6 date grid with post chips, overflow popover, DnD |
| `src/pages/publish/components/post-list-view.tsx` | List view | Sortable table with platform dots, metrics, status badges |
| `src/pages/publish/components/post-card.tsx` | Post card | Compact card with platform dots, status indicator, caption, pillar badge |
| `src/pages/publish/components/calendar-toolbar.tsx` | Toolbar | Week nav, view toggle, platform filter, tag filter, timezone select, "+ New Post" |
| `src/pages/publish/components/publish-composer-modal.tsx` | Publish composer | Caption, platforms, pillar, schedule, media, metrics display, save/schedule/publish/delete |
| `src/pages/publish/components/empty-state.tsx` | Empty state | "Nothing scheduled yet" with skeleton grid |
| `src/pages/publish/components/platform-dots.tsx` | Platform dots | Colored dot indicators per platform |
| `src/pages/publish/components/use-calendar-state.ts` | Calendar state | Date range calculation, view switching, week/month navigation |
| `src/pages/workspace/components/app-sidebar.tsx` | Sidebar | Create/Publish nav, channels list, platform filter, settings, sign-out |

---

## Acceptance criteria

### Screen 1: Landing Page (`/`)

| AC | Screen | Status | Evidence |
|---|---|---|---|
| Header with "Content Calendar" wordmark, "Try demo" + "Sign in" CTAs | Landing | PASS | `pages/landing/components/header.tsx:1-25` — renders wordmark, two CTAs with correct routing |
| Hero-02 with headline, subheading, dual CTAs, product mockup | Landing | PASS | `pages/landing/index.tsx:42-55` — passes spec copy verbatim; `hero-02.tsx:1-58` renders 2-col layout with browser chrome mockup |
| Feature showcase with 4 autoplay tabs: Idea Board, Schedule, Compose, Track | Landing | PASS | `pages/landing/index.tsx:57-78` — maps `featureTabs` to `feature-showcase-01` with mockup components; `data/landing.ts:7-12` has spec-verbatim descriptions |
| Supporting features grid: PenLine, CalendarDays, BarChart2, Globe | Landing | PASS | `pages/landing/index.tsx:18-38` — `supportingFeatures` array with spec-verbatim copy; `features-03.tsx` renders bento grid |
| Testimonial slider with 4 quotes | Landing | PASS | `data/landing.ts:21-46` — 4 testimonials (Priya Nair, Marcus Webb, Sana Kowalski, David Chen) matching spec |
| CTA banner: "Stop juggling tools. Start shipping content." | Landing | PASS | `pages/landing/index.tsx:95` — passes spec copy to `cta-01` |
| Footer with 4 columns | Landing | PASS | `pages/landing/components/footer.tsx:1-63` — wordmark + tagline + link groups from `data/landing.ts` |
| Mockups show kanban, schedule, compose, track | Landing | PASS | `pages/landing/components/mockups.tsx:1-411` — HeroKanbanMockup, IdeaBoardMockup, ScheduleMockup, ComposeMockup, TrackMockup with spec-accurate content |

### Screen 2: Sign In (`/sign-in`)

| AC | Screen | Status | Evidence |
|---|---|---|---|
| Fullscreen layout (application-layout), no sidebar | Sign In | PASS | `App.tsx` — `/sign-in` routes under `ApplicationLayout` |
| "← Back to home" link | Sign In | PASS | `pages/sign-in/index.tsx` renders back link to `/` |
| Auth card with "Welcome back" heading, "Sign in to your workspace" subheading | Sign In | PASS | `sign-in-card.tsx` — card with spec copy |
| Google + Apple OAuth buttons using `lovable.auth.signInWithOAuth` | Sign In | PASS | `sign-in-card.tsx:33` — calls `lovable.auth.signInWithOAuth(provider)` |
| Email + password form with `supabase.auth.signInWithPassword` | Sign In | PASS | `sign-in-card.tsx:46` — calls real `supabase.auth.signInWithPassword` |
| "Forgot?" inline link → password reset flow | Sign In | PASS | `forgot-password-card.tsx:1-142` — email input, `resetPasswordForEmail`, "Check your email" confirmation, resend |
| "No account? Sign up" → `/sign-up` | Sign In | PASS | `sign-in-card.tsx` — footer link to `/sign-up` |
| "Try demo →" → `/demo/create` | Sign In | PASS | `sign-in-card.tsx` — footer link to `/demo/create` |
| Redirect to `/create` if already authenticated | Sign In | PASS | `pages/sign-in/index.tsx` — checks `useAuth()`, navigates if user exists |
| "Signing in…" loading state | Sign In | PASS | `sign-in-card.tsx` — button disabled with loading text during submission |

### Screen 3: Sign Up (`/sign-up`)

| AC | Screen | Status | Evidence |
|---|---|---|---|
| Fullscreen layout, "← Back to home" | Sign Up | PASS | `App.tsx` routes under `ApplicationLayout`; `pages/sign-up/index.tsx` renders back link |
| "Create your account" heading, "Start planning content today" subheading | Sign Up | PASS | `sign-up-card.tsx` — spec copy in card header |
| Google + Apple OAuth using `lovable.auth.signInWithOAuth` | Sign Up | PASS | `sign-up-card.tsx:29` — calls `lovable.auth.signInWithOAuth(provider)` |
| Full name + Email + Password form with `supabase.auth.signUp` | Sign Up | PASS | `sign-up-card.tsx:42` — calls `supabase.auth.signUp` with full_name in metadata |
| "Check your email" success confirmation | Sign Up | PASS | `sign-up-card.tsx` — toggles to success view with confirmation message |
| "Already have an account? Sign in →" → `/sign-in` | Sign Up | PASS | `sign-up-card.tsx` — footer link |
| Redirect to `/create` if already authenticated | Sign Up | PASS | `pages/sign-up/index.tsx` — checks `useAuth()`, navigates if user exists |

### Screen 4: Create / Idea Board (`/create`, `/demo/create`)

| AC | Screen | Status | Evidence |
|---|---|---|---|
| workspace-layout-01 shell with peekable sidebar | Create | PASS | `App.tsx` — Create routes wrap `WorkspaceLayout01`; sidebar in `app-sidebar.tsx` |
| Sidebar with Create (active) + Publish nav items | Create | PASS | `app-sidebar.tsx:1-208` — LayoutGrid "Create" + CalendarDays "Publish" with routing |
| Sidebar footer: Settings + LogOut | Create | PASS | `app-sidebar.tsx` — settings and sign-out buttons in footer |
| Top bar: "Idea Board" title, Board/Gallery toggle, "+ New Idea" | Create | PASS | `pages/create/index.tsx` — h1 "Idea Board", ToggleGroup (LayoutGrid/Grid2X2), button "+ New Idea" |
| 5-column kanban: Unassigned, Inspiration, To-do, In Progress, Repurpose | Create | PASS | `data/seed.ts` — 5 seedColumns; `kanban-board.tsx:314` lines rendering columns from useColumns() |
| Cards with optional media thumbnail, title, caption, pillar badge | Create | PASS | `idea-card.tsx:1-119` — AspectRatio 16:9 media, title, line-clamp-2 caption, colored pillar badge |
| Drag-and-drop via @dnd-kit/sortable | Create | PASS | `kanban-board.tsx` — DndContext, PointerSensor, closestCorners, DragOverlay; `idea-card.tsx` uses useSortable |
| Content pillar badges with spec colors (purple, blue, green, orange) | Create | PASS | `idea-card.tsx` — PILLAR_COLOR_MAP: #7C3AED→purple, #2563EB→blue, #059669→green, #D97706→orange |
| Card count per column header | Create | PASS | `kanban-column.tsx` — displays `cards.length` in muted badge |
| Column rename (inline input) | Create | PASS | `kanban-column.tsx` — isRenaming state toggles input, Enter/blur commits |
| Column delete with alert-dialog confirmation | Create | PASS | `kanban-column.tsx` — AlertDialog with "Delete column" title, cancel/delete buttons |
| "+ Add column" ghost button | Create | PASS | `kanban-board.tsx` — isAddingColumn state, input with "Column name" placeholder |
| Gallery view: 3-column grid | Create | PASS | `gallery-view.tsx:1-72` — grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 |
| Composer modal with title, caption, platforms, pillar, schedule, media, char count | Create | PASS | `composer-modal.tsx:1-254` — all fields present with char limits (IG 2200, LI 3000, X 280, TK 2200, FB 63206) |
| 15 seed cards across 5 columns | Create | PASS | `data/seed.ts` — 15 seedCards entries with spec-verbatim titles and captions |
| Empty state: "Add your first idea" | Create | PASS | `empty-state.tsx:1-37` — IconPencil, heading, description, "+ New Idea" CTA |
| Data via DataProvider hooks, not direct seed.ts imports | Create | PASS | `kanban-board.tsx` calls `useDataProvider().useColumns()`, `useCards()`, etc. |
| Protected on `/create`, public on `/demo/create` | Create | PASS | `App.tsx` — `/create` wrapped in ProtectedRoute, `/demo/create` uses SeedDataProvider |

### Screen 5: Publish / Calendar (`/publish`, `/demo/publish`)

| AC | Screen | Status | Evidence |
|---|---|---|---|
| workspace-layout-01 shell, same sidebar as Create | Publish | PASS | `App.tsx` — same layout; `app-sidebar.tsx` — shared sidebar |
| Sidebar channels section: 4 channels with platform icons/handles | Publish | PASS | `app-sidebar.tsx` — renders channels from `useChannels()` with colored dots and handles |
| Channel click filters calendar | Publish | PASS | `app-sidebar.tsx` — `handleChannelClick` calls `setFilters({ platform })` |
| "+ Connect channel" shows "Coming soon" toast | Publish | NOT PROVEN | `app-sidebar.tsx` renders placeholder but toast behavior not visually verified |
| Week navigation: ← Apr 7–13, 2025 → | Publish | PASS | `calendar-toolbar.tsx` — ChevronLeft/Right buttons; `use-calendar-state.ts` — navigateBack/Forward with formatted label |
| View toggle: Week / Month / List | Publish | PASS | `calendar-toolbar.tsx` — ToggleGroup with Week/Month/List; `use-calendar-state.ts` manages view state |
| "All Posts" platform filter dropdown | Publish | PASS | `calendar-toolbar.tsx` — dropdown with channel list, "All Posts" default |
| "Tags" content pillar multi-select dropdown | Publish | PASS | `calendar-toolbar.tsx` — dropdown with pillar checkboxes |
| Timezone selector | Publish | PASS | `calendar-toolbar.tsx` — 6 preset timezone options (UTC-8, UTC-5, UTC, UTC+1, UTC+5:30, UTC+8) |
| "+ New Post" button | Publish | PASS | `calendar-toolbar.tsx` — primary button with IconPlus |
| Week calendar: 7-col × hourly grid with DnD | Publish | PASS | `week-calendar.tsx:1-257` — 7 days × 12 hours, DndContext, droppable cells, draggable cards, DragOverlay |
| Month calendar: 7×6 grid with post chips, "+N more" overflow | Publish | PASS | `month-calendar.tsx:1-345` — 42-cell grid, 3 visible posts per day, overflow popover |
| List view: table with platform, date, caption, pillar, status, metrics | Publish | PASS | `post-list-view.tsx:1-180` — Table with all columns, sortable headers, engagement metrics for published posts |
| Post card: platform dots, status indicator, caption, pillar badge | Publish | PASS | `post-card.tsx:1-98` — PlatformDots, status dot (amber/green/gray), caption, pillar badge |
| Drag-to-reschedule in week and month views | Publish | PASS | `week-calendar.tsx` + `month-calendar.tsx` — both implement onReschedule via DnD |
| Composer modal with metrics display for published posts | Publish | PASS | `publish-composer-modal.tsx:1-329` — conditional metrics section with likes, comments, shares, reach |
| List view sorting by date, platform, status | Publish | PASS | `post-list-view.tsx` — sortField/sortDir state, clickable column headers with arrow icons |
| 10 scheduled + 3 published posts in seed data | Publish | PASS | `data/seed.ts` — 10 scheduled posts (Apr 7–13), 3 published posts (Mar 31, Apr 1, Apr 3) |
| 3 metrics records in seed data | Publish | PASS | `data/seed.ts` — seedMetrics with 248/31/14/4200, 412/57/8/6100, 89/12/33/2800 |
| Empty state: "Nothing scheduled yet" | Publish | PASS | `publish/empty-state.tsx:1-51` — IconCalendarEvent, heading, description, "+ New Post" CTA, "or go to Create board →" |
| SeedDataProvider filters posts by date range, platform, pillar, status | Publish | PASS | `data-provider.tsx:170-182` — filters use rangeStart/rangeEnd, platform, contentPillarId, status |
| Protected on `/publish`, public on `/demo/publish` | Publish | PASS | `App.tsx` — `/publish` wrapped in ProtectedRoute, `/demo/publish` uses SeedDataProvider |

### Infrastructure

| AC | Screen | Status | Evidence |
|---|---|---|---|
| AuthProvider with onAuthStateChange + getSession | Infra | PASS | `lib/auth/auth-provider.tsx:1-56` — subscribes to auth state, calls getSession, exposes user/session/loading/signOut |
| ProtectedRoute redirects to /sign-in with `from` state | Infra | PASS | `components/protected-route.tsx:1-22` — checks useAuth, Navigate to /sign-in with location state |
| SignOut clears React Query cache | Infra | PASS | `lib/auth/auth-provider.tsx` — signOut calls queryClient.clear() |
| Dual provider: SeedDataProvider for /demo/*, SupabaseDataProvider for /* | Infra | PASS | `App.tsx:25-60` — demo routes use SeedDataProvider, protected routes use SupabaseDataProvider |
| SeedDataProvider applies filters, not ignores them | Infra | PASS | `data-provider.tsx:153-199` — useCards filters by columnId, usePosts/usePostsWithMetrics filter by range/platform/pillar/status |
| OAuth uses `lovable.auth.signInWithOAuth`, NOT `supabase.auth` | Infra | PASS | `sign-in-card.tsx:33` + `sign-up-card.tsx:29` — both use `lovable.auth.signInWithOAuth` |
| Email auth uses `supabase.auth.signInWithPassword` / `signUp` | Infra | PASS | `sign-in-card.tsx:46` + `sign-up-card.tsx:42` — real Supabase auth calls |

---

## Build verifications

| Build command | Result |
|---|---|
| `npm run build` | PASS — `✓ built in 4.22s`, 0 errors, 1 warning (CSS ambiguity, non-blocking) |

---

## SPEC-GAPs surfaced

No `// SPEC-GAP:` comments found in the codebase.

---

## Risks / not proven

- **DnD visual behavior**: Drag ghost rendering, column highlight on hover (`bg-accent/60`), and card snap-back on failed reschedule are implemented in code but NOT PROVEN visually — they compile but require browser testing to confirm feel.
- **"+ Connect channel" toast**: The sidebar item exists but the "Coming soon" toast behavior is NOT PROVEN — requires runtime interaction.
- **Preferences sheet (Settings)**: The storyboard (Frames 12, 22) describes a Preferences sheet opened from Settings in the sidebar footer. The sidebar has a Settings item, but a full Preferences sheet component with Account/Timezone/Save changes is NOT PROVEN — the sidebar settings click behavior needs runtime verification.
- **Timezone display effect**: The timezone selector dropdown exists in `calendar-toolbar.tsx` with 6 presets, but whether selecting a timezone actually re-renders post times in the new timezone is NOT PROVEN — requires runtime testing.
- **Alert-dialog on composer close with unsaved changes**: Spec mentions `alert-dialog` confirmation on closing composer with entered content — NOT PROVEN, requires runtime testing.
- **Published post modal "Close" button replacing Save/Schedule/Publish**: The spec says published posts show only "Close" in the footer — the implementation conditionally renders actions based on status, but exact behavior is NOT PROVEN visually.
- **Auto-cycling feature showcase**: The `feature-showcase-01` has autoplay logic via `use-autoplay.ts`, but pause-on-hover and 7s cycle behavior are NOT PROVEN visually.

---

## High-risk files requiring review

| File | Risk | Why it needs review |
|---|---|---|
| `src/lib/data-provider.tsx` | MEDIUM | 684 lines — largest single file; contains both SeedDataProvider and SupabaseDataProvider. All CRUD operations, filter logic, and React Query invalidation live here. A bug in filtering or mutation invalidation would affect the entire data layer. |
| `src/pages/publish/components/month-calendar.tsx` | MEDIUM | 345 lines — complex 6-week grid with DnD, overflow popovers, and date calculations. Date boundary bugs (month edges, daylight saving) could show posts on wrong days. |
| `src/pages/create/components/kanban-board.tsx` | MEDIUM | 314 lines — complex DnD with cross-column dragging, optimistic local state, and column CRUD. Race conditions between drag-end and mutation could cause stale state. |
| `src/pages/publish/components/publish-composer-modal.tsx` | MEDIUM | 329 lines — handles create/edit/delete for posts with conditional rendering based on status (draft/scheduled/published). Metrics display and action button visibility depend on correct status detection. |
| `src/pages/workspace/components/app-sidebar.tsx` | MEDIUM | 208 lines — shared sidebar with platform channel filtering, demo/auth route awareness, and sign-out. Filter state integration with toolbar filter creates two sources of truth that must stay in sync. |
