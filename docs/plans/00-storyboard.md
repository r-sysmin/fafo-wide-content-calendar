# Storyboard — Content Calendar

One frame per breadboard arrow. Read [00-breadboard.md](00-breadboard.md) for the breadboard and [00-screenboard.md](00-screenboard.md) for screen wireframes and design systems.

* * *

## Frames

### Frame 1: Try demo → Create (/demo/create)

- **Trigger**: Click `[Try demo]` or `[Try demo →]` on Landing hero / header / CTA banner
- **From**: Landing page (`/`), populated
- **To**: Create (`/demo/create`), populated (seed data)
- **Behavior**: Navigates directly to the demo kanban board without auth. The board loads immediately with the `SeedDataProvider` supplying the 15 seed cards across 5 columns. No loading skeleton — seed data is synchronous.See Create (Idea Board) screen.
- **Copy in this frame**:
  - `"Try demo →"` (hero CTA — action-first, §3)
  - `"Try demo"` (header CTA — action-first, §3)

* * *

### Frame 2: Sign in → Sign In (/sign-in)

- **Trigger**: Click `[Sign in]` in the header or hero
- **From**: Landing page (`/`), populated
- **To**: Sign In (`/sign-in`), idle
- **Behavior**: Navigates to the fullscreen auth card. No sidebar, no app shell — `application-layout`. The card shows email/password form with Google and Apple OAuth buttons above the fold.See Sign In screen.
- **Copy in this frame**:
  - `"Sign in"` (header/hero link — action-first, §3)

* * *

### Frame 3: Features → #features

- **Trigger**: Click `[Features]` footer link
- **From**: Landing page (`/`), populated
- **To**: Landing page (`/`), scrolled to feature showcase section (`#features`)
- **Behavior**: Page scrolls in-place to the `feature-showcase-01` section. No navigation, no state change. The active tab in the feature showcase is "Idea Board" (first tab, default).See Landing Page screen.
- **Copy in this frame**:
  - `"Features"` (footer link — noun label, §3)

* * *

### Frame 4: See how it works → #demo

- **Trigger**: Click `[See how it works]` (if present as an anchor link in the hero)
- **From**: Landing page (`/`), populated
- **To**: Landing page (`/`), scrolled to feature showcase section (`#demo`)
- **Behavior**: Page scrolls in-place to the `feature-showcase-01` demo block. Same destination as Frame 3 — the feature showcase is the demo anchor.See Landing Page screen.
- **Copy in this frame**:
  - `"See how it works"` (secondary hero link — action-first, §3)

* * *

### Frame 5: Create → + New Idea → Composer (modal — new draft)

- **Trigger**: Click `[+ New Idea]` button in the Create board top bar
- **From**: Create (`/create` or `/demo/create`), populated
- **To**: Create (`/create` or `/demo/create`), composer modal open (new draft)
- **Behavior**: The kanban board dims slightly behind a `dialog` overlay. The Composer modal opens with a blank form — no pre-filled title, no caption, no platforms checked, no content pillar selected. Focus moves to the Title input.**Wireframe** (the To state — Composer modal, new draft):```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (dimmed behind overlay)  │  KANBAN BOARD (dimmed behind overlay)        │
│                                  │                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐     │
│  │  New Idea                                                        [X]  │     │
│  │  ──────────────────────────────────────────────────────────────────── │     │
│  │                                                                        │     │
│  │  Title                                                                 │     │
│  │  [                                                                  ]  │     │
│  │                                                                        │     │
│  │  Caption                                                               │     │
│  │  [                                                                  ]  │     │
│  │  [                                                                  ]  │     │
│  │  [                                                                  ]  │     │
│  │                                                                        │     │
│  │  Platform(s)                                                           │     │
│  │  [ ] Instagram  [ ] LinkedIn  [ ] X  [ ] TikTok  [ ] Facebook         │     │
│  │                                                                        │     │
│  │  Content Pillar                    Schedule                            │     │
│  │  [Select a pillar             ▾]   [Pick date & time              ]   │     │
│  │                                    [Add to Queue                  ]   │     │
│  │                                                                        │     │
│  │  Media                                                                 │     │
│  │  [Attach image or video                                    [+]     ]  │     │
│  │                                                                        │     │
│  │  Character count: —                                                    │     │
│  │                                                                        │     │
│  │  ────────────────────────────────────────────────────────────────────  │     │
│  │  [Save draft]                          [Schedule]  [Publish now]      │     │
│  └────────────────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"New Idea"` (modal heading — noun label)
  - `"+ New Idea"` (board CTA — action-first, §3)
  - `"Save draft"` (ghost action — action-first, §3)
  - `"Schedule"` (outline action — action-first, §3)
  - `"Publish now"` (primary action — action-first, §3)
  - `"Add to Queue"` (auto-schedule affordance — action-first, §3)
  - `"Attach image or video"` (media zone label — action-first, §3)

* * *

### Frame 6: Create → Drag card → (in-place — column updates)

- **Trigger**: User picks up an idea card and drops it onto a different column
- **From**: Create (`/create` or `/demo/create`), populated
- **To**: Create (`/create` or `/demo/create`), drag-complete (column updated in-place)
- **Behavior**: The card lifts with a drag ghost. The target column highlights with `bg-accent/60`. On drop, the card appears in the new column at the dropped position. `useReorderCards()` / `useUpdateCard()` fires optimistically — the board updates without a loading state.**Wireframe** (the To state — card mid-drag):```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR             │  MAIN CONTENT                                             │
│                     │                                                           │
│  [Grid] Create      │  Idea Board          [Board] [Gallery]  [+ New Idea]     │
│  [Cal]  Publish     │  ─────────────────────────────────────────────────────   │
│                     │                                                           │
│                     │  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐   │
│                     │  │Inspiration│  │  To-do   │  │    In Progress  ↓↑  │   │
│                     │  │  3 cards  │  │  3 cards │  │  4 cards  [bg-accent]│   │
│                     │  │          │  │          │  │ ╔══════════════════╗  │   │
│                     │  │ [card]   │  │ [card]  │  │ ║ 5 Ways to Stay   ║  │   │
│                     │  │ [card]   │  │ [card]  │  │ ║ Focused…         ║  │   │
│                     │  │ [card]   │  │ [card]  │  │ ║ [Content & Mktg] ║  │   │
│                     │  │          │  │          │  │ ╚══════════════════╝  │   │
│                     │  │          │  │          │  │ [card]               │   │
│                     │  │          │  │          │  │ [card]               │   │
│                     │  │          │  │          │  │ [card]               │   │
│                     │  └──────────┘  └──────────┘  └──────────────────────┘   │
│                     │                                                           │
│                     │   ░░░░░░░░░░░░░░░░░░░ (drag ghost floating)             │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**: (no new strings)

* * *

### Frame 7: Create → Click card → Composer (modal — edit card)

- **Trigger**: Click an idea card (not dragging)
- **From**: Create (`/create` or `/demo/create`), populated
- **To**: Create (`/create` or `/demo/create`), composer modal open (edit card)
- **Behavior**: The Composer modal opens pre-populated with the card's existing title, caption, content pillar, and media. Platforms may be unchecked if the card is still in ideation. The modal heading changes to the card title.**Wireframe** (the To state — Composer modal, edit card "5 Ways to Stay Focused When Working from Home"):```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (dimmed)  │  KANBAN BOARD (dimmed)                                      │
│                   │                                                             │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │  5 Ways to Stay Focused When Working from Home                    [X]   │   │
│  │  ────────────────────────────────────────────────────────────────────── │   │
│  │                                                                          │   │
│  │  Title                                                                   │   │
│  │  [5 Ways to Stay Focused When Working from Home                      ]  │   │
│  │                                                                          │   │
│  │  Caption                                                                 │   │
│  │  [Spoiler: it's not about the standing desk. It's about the systems  ]  │   │
│  │  [you build around your calendar and your energy.                    ]  │   │
│  │  [                                                                   ]  │   │
│  │                                                                          │   │
│  │  Platform(s)                                                             │   │
│  │  [ ] Instagram  [ ] LinkedIn  [ ] X  [ ] TikTok  [ ] Facebook           │   │
│  │                                                                          │   │
│  │  Content Pillar                    Schedule                              │   │
│  │  [● Content & Marketing       ▾]   [Pick date & time              ]     │   │
│  │                                    [Add to Queue                  ]     │   │
│  │                                                                          │   │
│  │  Media                                                                   │   │
│  │  [Attach image or video                                    [+]      ]   │   │
│  │                                                                          │   │
│  │  Character count: —                                                      │   │
│  │                                                                          │   │
│  │  ──────────────────────────────────────────────────────────────────────  │   │
│  │  [Save draft]                            [Schedule]  [Publish now]      │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"Spoiler: it's not about the standing desk. It's about the systems you build around your calendar and your energy."` (seed caption — verbatim from fixture)

* * *

### Frame 8: Create → Board/Gallery toggle → (in-place — view switches)

- **Trigger**: Click `[Gallery]` in the Board/Gallery `toggle-group`
- **From**: Create (`/create` or `/demo/create`), board view
- **To**: Create (`/create` or `/demo/create`), gallery view
- **Behavior**: The kanban column layout is replaced by a 3-column masonry/grid of larger cards with media thumbnails prominent. Same 15 cards, different layout. Toggle state is stored in local React state — no network request.**Wireframe** (the To state — gallery view):```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR             │  MAIN CONTENT                                             │
│                     │                                                           │
│  [Grid] Create      │  Idea Board          [Board] [●Gallery]  [+ New Idea]   │
│  [Cal]  Publish     │  ─────────────────────────────────────────────────────   │
│                     │                                                           │
│                     │  ┌─────────────────┐ ┌─────────────────┐ ┌────────────┐ │
│                     │  │ ┌─────────────┐ │ │ ┌─────────────┐ │ │┌──────────┐│ │
│                     │  │ │  [Unsplash  │ │ │ │  [Unsplash  │ │ ││[Unsplash ││ │
│                     │  │ │   image]    │ │ │ │   image]    │ │ ││  image]  ││ │
│                     │  │ └─────────────┘ │ │ └─────────────┘ │ │└──────────┘│ │
│                     │  │ Community       │ │ Behind the      │ │Product     │ │
│                     │  │ Spotlight: March│ │ Scenes: Team    │ │Update:     │ │
│                     │  │                 │ │ Offsite Recap   │ │Spring      │ │
│                     │  │ [Community]     │ │ [Behind Scenes] │ │Launch      │ │
│                     │  └─────────────────┘ └─────────────────┘ │[Prod Upd.] │ │
│                     │                                           └────────────┘ │
│                     │  ┌─────────────────┐ ┌─────────────────┐ ┌────────────┐ │
│                     │  │ Remote Work Tips│ │ 5 Ways to Stay  │ │Content     │ │
│                     │  │ for Distributed │ │ Focused When    │ │Pillars 101 │ │
│                     │  │ Teams           │ │ Working from    │ │            │ │
│                     │  │                 │ │ Home            │ │[Cont.&Mktg]│ │
│                     │  │ [Community]     │ │ [Cont. & Mktg]  │ └────────────┘ │
│                     │  └─────────────────┘ └─────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**: (no new strings)

* * *

### Frame 9: Create → Add column → (in-place — new column appended)

- **Trigger**: Click `[+ Add column]` ghost button after the last column
- **From**: Create (`/create` or `/demo/create`), populated
- **To**: Create (`/create` or `/demo/create`), new column inline edit active
- **Behavior**: A new empty column is appended at the right edge of the board. The column header immediately shows an inline `input` field with a placeholder "Column name" in focus. The column has 0 cards and no overflow menu yet.**Wireframe** (the To state — new column inline edit):```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR             │  MAIN CONTENT (horizontal scroll)                         │
│                     │                                                           │
│  [Grid] Create      │  … [Repurpose 3] →  ┌────────────────────┐              │
│  [Cal]  Publish     │                      │ [Column name     ] │              │
│                     │                      │  0 cards           │              │
│                     │                      │  ─────────────── │              │
│                     │                      │                    │              │
│                     │                      │                    │              │
│                     │                      │                    │              │
│                     │                      │  [+ Add card]      │              │
│                     │                      └────────────────────┘              │
│                     │                                                           │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"Column name"` (input placeholder — describes the action, §5)

* * *

### Frame 10: Create → Rename column → (in-place — inline edit)

- **Trigger**: Click a column's title text or select "Rename" from the column overflow menu (`···`)
- **From**: Create (`/create` or `/demo/create`), populated
- **To**: Create (`/create` or `/demo/create`), column rename inline edit active
- **Behavior**: The column title text is replaced by an `input` field pre-filled with the current column name (e.g. "Inspiration"), selected so the user can type immediately. Enter or blur commits. Escape cancels and restores the original title.**Wireframe** (the To state — column rename inline edit on "Inspiration"):```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR             │  MAIN CONTENT                                             │
│                     │                                                           │
│                     │  ┌──────────┐  ┌─────────────────┐  ┌──────────┐        │
│                     │  │Unassigned│  │ [Inspiration   ]│  │  To-do   │        │
│                     │  │  3 cards │  │ ← inline input  │  │  3 cards │        │
│                     │  │          │  │  4 cards        │  │          │        │
│                     │  │ [cards…] │  │  ─────────────  │  │ [cards…] │        │
│                     │  └──────────┘  │  [cards…]       │  └──────────┘        │
│                     │                └─────────────────┘                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**: (no new strings — input pre-filled with existing column title)

* * *

### Frame 11: Create → Navigate to Publish → Publish (/publish)

- **Trigger**: Click `[Publish]` nav item in the sidebar
- **From**: Create (`/create` or `/demo/create`), any state
- **To**: Publish (`/publish` or `/demo/publish`), populated
- **Behavior**: Full navigation to the Publish calendar screen. The sidebar nav item "Publish" becomes active. The week calendar loads showing the current week (Apr 7–13, 2025 in demo). For the authenticated route, `usePosts` fires; for demo, `SeedDataProvider` is synchronous.See Publish (Calendar) screen.
- **Copy in this frame**: (no new strings)

* * *

### Frame 12: Create → Settings → Preferences (panel — account, theme)

- **Trigger**: Click `[Settings]` in the sidebar footer
- **From**: Create (`/create` or `/demo/create`), populated
- **To**: Create (`/create` or `/demo/create`), Preferences sheet open
- **Behavior**: A `sheet` slides in from the right over the board. The board remains visible and navigable behind it. The sheet shows account settings (profile name, email) and a theme/timezone preference.**Wireframe** (the To state — Preferences sheet):```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR             │  KANBAN BOARD (visible, inert)  │ ┌─────────────────────┐ │
│                     │                                 │ │  Preferences   [X]  │ │
│  [Grid] Create      │  Idea Board  [Board][Gallery]   │ │  ──────────────────  │ │
│  [Cal]  Publish     │                                 │ │                      │ │
│                     │  [columns and cards visible     │ │  Account             │ │
│                     │   but non-interactive]          │ │  Full name           │ │
│                     │                                 │ │  [Priya Nair      ]  │ │
│                     │                                 │ │                      │ │
│  [●Settings]        │                                 │ │  Email               │ │
│  [LogOut]           │                                 │ │  [priya@stackform ]  │ │
│                     │                                 │ │                      │ │
│                     │                                 │ │  ──────────────────  │ │
│                     │                                 │ │                      │ │
│                     │                                 │ │  Timezone            │ │
│                     │                                 │ │  [UTC-5 (EST)    ▾]  │ │
│                     │                                 │ │                      │ │
│                     │                                 │ │  [Save changes    ]  │ │
│                     │                                 │ └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"Preferences"` (sheet heading — noun label)
  - `"Account"` (section label — noun, §3)
  - `"Save changes"` (CTA — action-first, §3)

* * *

### Frame 13: Create → Logout → Sign out (clears session, returns to /)

- **Trigger**: Click `[LogOut]` in the sidebar footer
- **From**: Create (`/create`), authenticated
- **To**: Landing page (`/`), populated
- **Behavior**: `supabase.auth.signOut()` fires, React Query cache is cleared, and the user is redirected to `/`. The landing page renders immediately. In demo mode (`/demo/create`), this affordance is not shown.See Landing Page screen.
- **Copy in this frame**: (no new strings)

* * *

### Frame 14: Publish → + New Post → Composer (modal — new post)

- **Trigger**: Click `[+ New Post]` button in the Publish top bar
- **From**: Publish (`/publish` or `/demo/publish`), populated
- **To**: Publish (`/publish` or `/demo/publish`), composer modal open (new post)
- **Behavior**: The calendar dims behind a `dialog` overlay. The Composer modal opens blank with `status: scheduled` intent — the Schedule date/time field is prominent. No platforms pre-checked.**Wireframe** (the To state — Composer modal, new post):```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (dimmed)  │  CALENDAR GRID (dimmed)                                        │
│                   │                                                                │
│  ┌────────────────────────────────────────────────────────────────────────────┐    │
│  │  New Post                                                            [X]  │    │
│  │  ────────────────────────────────────────────────────────────────────────  │    │
│  │                                                                            │    │
│  │  Caption                                                                   │    │
│  │  [                                                                      ]  │    │
│  │  [                                                                      ]  │    │
│  │  [                                                                      ]  │    │
│  │                                                                            │    │
│  │  Platform(s)                                                               │    │
│  │  [ ] Instagram  [ ] LinkedIn  [ ] X  [ ] TikTok  [ ] Facebook             │    │
│  │                                                                            │    │
│  │  Character count: —                                                        │    │
│  │                                                                            │    │
│  │  Content Pillar                    Schedule                                │    │
│  │  [Select a pillar             ▾]   [Pick date & time                  ]   │    │
│  │                                    [Add to Queue                      ]   │    │
│  │                                                                            │    │
│  │  Media                                                                     │    │
│  │  [Attach image or video                                      [+]      ]   │    │
│  │                                                                            │    │
│  │  ──────────────────────────────────────────────────────────────────────    │    │
│  │  [Save draft]                              [Schedule]  [Publish now]      │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"New Post"` (modal heading — noun label)
  - `"+ New Post"` (calendar CTA — action-first, §3)

* * *

### Frame 15: Publish → Drag post to slot → (in-place — time/date updates)

- **Trigger**: User picks up a post card and drops it onto a different time slot or day cell
- **From**: Publish (`/publish` or `/demo/publish`), populated
- **To**: Publish (`/publish` or `/demo/publish`), drag-complete (scheduled_at updated)
- **Behavior**: The card lifts into a drag ghost. The target cell highlights with `bg-accent/60`. On drop, the card snaps to the nearest hour in the new cell. `useUpdatePost()` fires optimistically — the card moves without a loading state. If the write fails, the card snaps back with a toast "Failed to reschedule post."**Wireframe** (the To state — post mid-drag in week view):```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR             │  MAIN CONTENT                                                │
│                     │                                                              │
│  [Grid] Create      │  ← Apr 7–13, 2025 →   [●Week] [Month] [List]               │
│  [Cal] ●Publish     │  ─────────────────────────────────────────────────────────  │
│                     │         Mon    Tue    Wed    Thu    Fri    Sat   Sun         │
│  Channels           │         Apr7   Apr8   Apr9   Apr10  Apr11  Apr12 Apr13       │
│  ● [Ig] @stackform  │  9am  │       │       │[card]│       │      │     │         │
│  ● [Li] @Stackform  │ 10am  │[card] │       │      │[card] │      │     │         │
│  ● [X]  @stackform  │ 11am  │       │[card] │      │       │[card]│     │         │
│  ● [Tk] @stackform  │ 12pm  │       │       │      │       │      │     │         │
│                     │  1pm  │       │       │[card]│       │      │     │         │
│  [+Connect channel] │  2pm  │       │       │      │[████] │      │     │         │
│                     │       │       │       │      │[drop  │      │     │         │
│                     │       │       │       │      │ zone] │      │     │         │
│                     │                                                              │
│  [Settings]         │   ░░░░░░░░░░░░░░░ (drag ghost: "Behind the scenes…" [X])   │
│  [LogOut]           │                                                              │
└────────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**: (no new strings)

* * *

### Frame 16: Publish → Click post card → Composer (modal — edit post)

- **Trigger**: Click a post card in the week or month calendar grid
- **From**: Publish (`/publish` or `/demo/publish`), populated
- **To**: Publish (`/publish` or `/demo/publish`), composer modal open (edit post)
- **Behavior**: The Composer modal opens pre-populated with the post's caption, platforms, content pillar, scheduled date/time, and media. For published posts, engagement metrics appear at the bottom read-only.**Wireframe** (the To state — Composer modal, editing published post "Here's how we 3x'd our LinkedIn engagement"):```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR (dimmed)  │  CALENDAR GRID (dimmed)                                        │
│                   │                                                                │
│  ┌────────────────────────────────────────────────────────────────────────────┐    │
│  │  Edit Post                                                           [X]  │    │
│  │  ────────────────────────────────────────────────────────────────────────  │    │
│  │                                                                            │    │
│  │  Caption                                                                   │    │
│  │  [Here's how we 3x'd our LinkedIn engagement in 60 days — no paid     ]   │    │
│  │  [promotion, no viral gimmicks. Just a consistent content pillar      ]   │    │
│  │  [strategy and a willingness to share what we actually know.          ]   │    │
│  │                                                                            │    │
│  │  Platform(s)                                                               │    │
│  │  [ ] Instagram  [✓] LinkedIn  [ ] X  [ ] TikTok  [ ] Facebook            │    │
│  │                                                                            │    │
│  │  Character count: LinkedIn 248/3000                                        │    │
│  │                                                                            │    │
│  │  Content Pillar                    Published                               │    │
│  │  [● Content & Marketing       ▾]   Mar 31, 2025 at 9:00 AM               │    │
│  │                                                                            │    │
│  │  Media                                                                     │    │
│  │  [No media attached                                          [+]      ]   │    │
│  │                                                                            │    │
│  │  ── Engagement ──────────────────────────────────────────────────────────  │    │
│  │  [Heart] 248 likes  [Chat] 31 comments  [Share] 14 shares  [Eye] 4,200    │    │
│  │                                                                            │    │
│  │  ──────────────────────────────────────────────────────────────────────    │    │
│  │  [Close]                                                                   │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"Edit Post"` (modal heading — noun label)
  - `"Engagement"` (metrics section label — noun)
  - `"248 likes"`, `"31 comments"`, `"14 shares"`, `"4,200 reach"` (seed metrics — verbatim from fixture)
  - `"Close"` (published post — no edit actions, §3)

* * *

### Frame 17: Publish → Week/Month/List toggle → (in-place — view switches)

- **Trigger**: Click `[Month]` or `[List]` in the view `toggle-group`
- **From**: Publish (`/publish` or `/demo/publish`), week view
- **To**: Publish (`/publish` or `/demo/publish`), list view
- **Behavior**: The week calendar grid is replaced by the flat chronological list view. Same posts, different layout. `usePosts` / `usePostsWithMetrics` re-queries for the same range but now includes metrics for the list rows. View preference is stored in local state.**Wireframe** (the To state — list view):```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR             │  MAIN CONTENT                                                │
│                     │                                                              │
│  [Grid] Create      │  ← Apr 7–13, 2025 →   [Week] [Month] [●List]               │
│  [Cal] ●Publish     │  [All Posts ▾]  [Tags ▾]  [UTC-5 ▾]  [+ New Post]         │
│                     │  ──────────────────────────────────────────────────────────  │
│  Channels           │  Platform  Date/Time          Caption                 Status │
│  ● [Ig]             │  ─────────────────────────────────────────────────────────── │
│  ● [Li]             │  [Li]  Mon Apr 7, 10:00 AM  We just opened 5 new engi… [Sch]│
│  ● [X]              │  [Ig][Li] Mon Apr 7, 1:00 PM  Remote work tip #14: async… [Sch]│
│  ● [Tk]             │  [Tk]  Tue Apr 8, 11:00 AM  Day in the life: our design … [Sch]│
│                     │  [Ig]  Wed Apr 9, 9:00 AM   Q1 product highlights — here… [Sch]│
│  [+Connect channel] │  [Tk]  Wed Apr 9, 1:00 PM   Our community hit 10,000 mem… [Sch]│
│                     │  [X]   Thu Apr 10, 10:00 AM The content calendar framewor… [Sch]│
│                     │  ─────────────────────────────────────────────────────────── │
│                     │  [Li]  Mar 31, 9:00 AM  Here's how we 3x'd our LinkedIn… [Pub]│
│                     │       [Heart] 248  [Chat] 31  [Share] 14  [Eye] 4,200        │
│  [Settings]         │  [Ig]  Apr 1, 11:00 AM  Meet the team: our new Head of… [Pub] │
│  [LogOut]           │       [Heart] 412  [Chat] 57  [Share] 8   [Eye] 6,100        │
└────────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"Sch"` (status badge — "Scheduled", amber)
  - `"Pub"` (status badge — "Published", green)

* * *

### Frame 18: Publish → Filter by channel → (in-place — posts filter)

- **Trigger**: Click a channel row (e.g. `[Ig] @stackform_ig`) in the Publish sidebar
- **From**: Publish (`/publish` or `/demo/publish`), all posts visible
- **To**: Publish (`/publish` or `/demo/publish`), filtered to Instagram posts only
- **Behavior**: The sidebar channel row gets `bg-accent` highlight and an active dot. The calendar grid updates in-place to show only posts where `platforms` contains `instagram`. Non-matching post cards are hidden. The top-bar "All Posts" dropdown also reflects the active filter. Clicking the same channel again deselects and restores all posts.**Wireframe** (the To state — filtered to Instagram):```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR             │  MAIN CONTENT (Instagram posts only)                         │
│                     │                                                              │
│  [Grid] Create      │  ← Apr 7–13, 2025 →   [●Week] [Month] [List]               │
│  [Cal] ●Publish     │  [Instagram ▾]  [Tags ▾]  [UTC-5 ▾]  [+ New Post]          │
│                     │  ──────────────────────────────────────────────────────────  │
│  Channels           │         Mon    Tue    Wed    Thu    Fri    Sat   Sun         │
│  ──────────────     │         Apr7   Apr8   Apr9   Apr10  Apr11  Apr12 Apr13       │
│ ●[bg-accent]        │  9am  │       │       │[card]│       │      │     │         │
│  [Ig] @stackform_ig │       │  IG   │       │ IG   │       │      │     │         │
│  ○ [Li] @Stackform  │ 10am  │       │       │      │       │      │     │         │
│  ○ [X]  @stackform  │ 11am  │       │       │      │       │      │     │         │
│  ○ [Tk] @stackform  │  1pm  │[card] │       │      │       │      │     │         │
│                     │       │IG+LI→ │       │      │       │      │     │         │
│  [+Connect channel] │       │IG only│       │      │       │      │     │         │
└────────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"Instagram"` (active filter label in top-bar dropdown — noun, §3)

* * *

### Frame 19: Publish → Filter by tag → (in-place — posts filter)

- **Trigger**: Click the `[Tags ▾]` dropdown and select a content pillar (e.g. "Product Updates")
- **From**: Publish (`/publish` or `/demo/publish`), all posts visible
- **To**: Publish (`/publish` or `/demo/publish`), filtered to Product Updates tag
- **Behavior**: The calendar grid updates to show only posts where `content_pillar_id` matches the selected pillar. Post cards not matching the tag are hidden. The Tags dropdown label changes to "Product Updates" with the blue dot. Selecting "All Tags" restores the full view.**Wireframe** (the To state — Tags dropdown open):```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR             │  MAIN CONTENT                                                │
│                     │                                                              │
│                     │  ← Apr 7–13, 2025 →   [●Week] [Month] [List]               │
│                     │  [All Posts ▾]  [Tags ▾] ← open  [UTC-5 ▾]  [+ New Post]  │
│                     │                 ┌────────────────────────┐                  │
│                     │                 │ ● All Tags             │                  │
│                     │                 │ ○ ● Content & Marketing│                  │
│                     │                 │ ○ ● Product Updates    │  ← hover         │
│                     │                 │ ○ ● Behind the Scenes  │                  │
│                     │                 │ ○ ● Community          │                  │
│                     │                 └────────────────────────┘                  │
└────────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"All Tags"` (default filter label — noun, §3)
  - `"Content & Marketing"` (pillar name — verbatim from seed)
  - `"Product Updates"` (pillar name — verbatim from seed)
  - `"Behind the Scenes"` (pillar name — verbatim from seed)
  - `"Community"` (pillar name — verbatim from seed)

* * *

### Frame 20: Publish → Change timezone → (in-place — times update)

- **Trigger**: Click the `[UTC-5 ▾]` timezone `select` and choose a different timezone
- **From**: Publish (`/publish` or `/demo/publish`), UTC-5 display
- **To**: Publish (`/publish` or `/demo/publish`), UTC+1 (CET) display
- **Behavior**: All `scheduled_at` times on post cards re-render in the new timezone. No database write — this is a cosmetic display-only operation. The selector label updates to the new timezone. A Mon Apr 7 10:00 AM post (UTC-5) now shows as 4:00 PM (UTC+1).**Wireframe** (the To state — timezone select open):```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR             │  MAIN CONTENT                                                │
│                     │                                                              │
│                     │  ← Apr 7–13, 2025 →   [●Week] [Month] [List]               │
│                     │  [All Posts ▾]  [Tags ▾]  [UTC-5 ▾] ← open  [+ New Post]  │
│                     │                            ┌──────────────────────┐         │
│                     │                            │ ● UTC-5 (EST)        │         │
│                     │                            │ ○ UTC+0 (GMT)        │         │
│                     │                            │ ○ UTC+1 (CET)        │         │
│                     │                            │ ○ UTC+5:30 (IST)     │         │
│                     │                            │ ○ UTC+8 (SGT)        │         │
│                     │                            │ ○ UTC-8 (PST)        │         │
│                     │                            └──────────────────────┘         │
└────────────────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"UTC-5 (EST)"`, `"UTC+0 (GMT)"`, `"UTC+1 (CET)"`, `"UTC+5:30 (IST)"`, `"UTC+8 (SGT)"`, `"UTC-8 (PST)"` (timezone labels — standard abbreviations)

* * *

### Frame 21: Publish → Navigate to Create → Create (/create)

- **Trigger**: Click `[Create]` nav item in the Publish sidebar
- **From**: Publish (`/publish` or `/demo/publish`), any state
- **To**: Create (`/create` or `/demo/create`), populated
- **Behavior**: Full navigation to the Create kanban board. The sidebar nav item "Create" becomes active. The kanban board renders with columns and cards from `useCards`. For demo, `SeedDataProvider` is synchronous.See Create (Idea Board) screen.
- **Copy in this frame**: (no new strings)

* * *

### Frame 22: Publish → Settings → Preferences (panel — account, theme)

- **Trigger**: Click `[Settings]` in the Publish sidebar footer
- **From**: Publish (`/publish` or `/demo/publish`), populated
- **To**: Publish (`/publish` or `/demo/publish`), Preferences sheet open
- **Behavior**: Same Preferences sheet as Frame 12. Slides in from the right over the calendar. The calendar grid is visible but inert behind the sheet.See Frame 12.
- **Copy in this frame**: (no new strings — identical sheet to Frame 12)

* * *

### Frame 23: Publish → Logout → Sign out (clears session, returns to /)

- **Trigger**: Click `[LogOut]` in the Publish sidebar footer
- **From**: Publish (`/publish`), authenticated
- **To**: Landing page (`/`), populated
- **Behavior**: Identical sign-out flow to Frame 13. `supabase.auth.signOut()` clears the session, React Query cache is cleared, and the user navigates to `/`.See Landing Page screen.
- **Copy in this frame**: (no new strings)

* * *

### Frame 24: Sign In → Google OAuth → Create (/create, auto)

- **Trigger**: Click `[G] Continue with Google`
- **From**: Sign In (`/sign-in`), idle
- **To**: Create (`/create`), populated (auto — OAuth redirect completes)
- **Behavior**: `lovable.auth.signInWithOAuth('google')` fires, browser redirects to Google, then back to the app. `AuthProvider` catches the `SIGNED_IN` event and navigates to `/create`. The Create board loads with the user's data (empty for new users — shows empty state; populated for returning users).See Create (Idea Board) screen.
- **Copy in this frame**:
  - `"Continue with Google"` (OAuth button — action-first, §3)

* * *

### Frame 25: Sign In → Apple OAuth → Create (/create, auto)

- **Trigger**: Click `[A] Continue with Apple`
- **From**: Sign In (`/sign-in`), idle
- **To**: Create (`/create`), populated (auto — OAuth redirect completes)
- **Behavior**: Same as Frame 24 but with `lovable.auth.signInWithOAuth('apple')`. `AuthProvider` navigates to `/create` on `SIGNED_IN`.See Create (Idea Board) screen.
- **Copy in this frame**:
  - `"Continue with Apple"` (OAuth button — action-first, §3)

* * *

### Frame 26: Sign In → Email/password → Create (/create, on success)

- **Trigger**: Fill email + password, click `[Sign in]`
- **From**: Sign In (`/sign-in`), idle
- **To**: Sign In (`/sign-in`), submitting → Create (`/create`), populated
- **Behavior**: Button becomes disabled and shows "Signing in…". On `supabase.auth.signInWithPassword` success, `AuthProvider` navigates to `/create`. On error, an inline error message appears under the Password field.**Wireframe** (the To state — submitting):```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Back to home                                                          │
│                                                                          │
│                    ┌─────────────────────────────────┐                  │
│                    │  Content Calendar               │                  │
│                    │                                 │                  │
│                    │  Welcome back                   │                  │
│                    │  Sign in to your workspace      │                  │
│                    │                                 │                  │
│                    │  [G]  Continue with Google      │                  │
│                    │  [A]  Continue with Apple       │                  │
│                    │                                 │                  │
│                    │  ─────────── or ───────────     │                  │
│                    │                                 │                  │
│                    │  Email                          │                  │
│                    │  [priya@stackform.io          ] │                  │
│                    │                                 │                  │
│                    │  Password              Forgot?  │                  │
│                    │  [••••••••••••••••••••••••••• ] │                  │
│                    │                                 │                  │
│                    │  [◐  Signing in…             ] │                  │
│                    │   ↑ disabled, primary button    │                  │
│                    │                                 │                  │
│                    │  No account? Sign up            │                  │
│                    │  or  Try demo →                 │                  │
│                    └─────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"Signing in…"` (loading state — ellipsis U+2026, §7)

* * *

### Frame 27: Sign In → Forgot password → (in-place — reset email sent)

- **Trigger**: Click `[Forgot?]` inline link on the Password field
- **From**: Sign In (`/sign-in`), idle
- **To**: Sign In (`/sign-in`), forgot password confirmation (in-place)
- **Behavior**: The email/password form is replaced in-place with a single email input and a "Send reset link" button. On submit, `supabase.auth.resetPasswordForEmail` fires and the form is replaced with a confirmation message. No navigation.**Wireframe** (the To state — reset email sent confirmation):```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Back to home                                                          │
│                                                                          │
│                    ┌─────────────────────────────────┐                  │
│                    │  Content Calendar               │                  │
│                    │                                 │                  │
│                    │  Check your email               │                  │
│                    │                                 │                  │
│                    │  We sent a password reset link  │                  │
│                    │  to priya@stackform.io          │                  │
│                    │                                 │                  │
│                    │  Click the link in your email   │                  │
│                    │  to set a new password.         │                  │
│                    │                                 │                  │
│                    │  ─────────────────────────────  │                  │
│                    │                                 │                  │
│                    │  Didn't get it? Check spam or   │                  │
│                    │  [Resend email]                 │                  │
│                    │                                 │                  │
│                    │  ← Back to sign in              │                  │
│                    └─────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"Check your email"` (heading — direct, §1)
  - `"We sent a password reset link to priya@stackform.io"` (confirmation body — direct, §1)
  - `"Click the link in your email to set a new password."` (instruction — direct, §1)
  - `"Didn't get it? Check spam or"` (helper text — direct, §1)
  - `"Resend email"` (link CTA — action-first, §3)
  - `"← Back to sign in"` (back link — action-first, §3)

* * *

### Frame 28: Sign In → Sign up link → Sign Up (/sign-up)

- **Trigger**: Click `[Sign up]` footer link in the Sign In card
- **From**: Sign In (`/sign-in`), idle
- **To**: Sign Up (`/sign-up`), idle
- **Behavior**: Navigates to the Sign Up screen. No data is carried over.See Sign Up screen.
- **Copy in this frame**:
  - `"No account? Sign up"` (footer link — direct, §1)

* * *

### Frame 29: Sign In → Try demo → Create (/demo/create)

- **Trigger**: Click `[Try demo →]` footer link in the Sign In card
- **From**: Sign In (`/sign-in`), idle
- **To**: Create (`/demo/create`), populated (seed data)
- **Behavior**: Navigates to the demo kanban board without auth. Identical destination to Frame 1.See Create (Idea Board) screen.
- **Copy in this frame**:
  - `"Try demo →"` (sign-in card footer link — action-first, §3)

* * *

### Frame 30: Sign In → Back to home → Landing (/)

- **Trigger**: Click `[← Back to home]` top-left link on the Sign In screen
- **From**: Sign In (`/sign-in`), any state
- **To**: Landing page (`/`), populated
- **Behavior**: Navigates back to the landing page. No auth change, no data change.See Landing Page screen.
- **Copy in this frame**:
  - `"← Back to home"` (back navigation — action-first, §3)

* * *

### Frame 31: Sign Up → Google OAuth → Create (/create, auto)

- **Trigger**: Click `[G] Continue with Google` on the Sign Up screen
- **From**: Sign Up (`/sign-up`), idle
- **To**: Create (`/create`), populated (auto — OAuth redirect completes, new user empty state)
- **Behavior**: `lovable.auth.signInWithOAuth('google')` fires. On `SIGNED_IN`, `handle_new_user()` trigger creates the user's profile and seeds default content pillars + columns. `AuthProvider` navigates to `/create`. New user lands on the Create board empty state.See Create (Idea Board) screen.
- **Copy in this frame**:
  - `"Continue with Google"` (OAuth button — action-first, §3)

* * *

### Frame 32: Sign Up → Apple OAuth → Create (/create, auto)

- **Trigger**: Click `[A] Continue with Apple` on the Sign Up screen
- **From**: Sign Up (`/sign-up`), idle
- **To**: Create (`/create`), populated (auto — OAuth redirect, new user empty state)
- **Behavior**: Same as Frame 31 but with Apple OAuth.See Frame 31.
- **Copy in this frame**:
  - `"Continue with Apple"` (OAuth button — action-first, §3)

* * *

### Frame 33: Sign Up → Email/password → Sign In (/sign-in, on success)

- **Trigger**: Fill full name, email, password; click `[Create account]`
- **From**: Sign Up (`/sign-up`), idle
- **To**: Sign Up (`/sign-up`), submitting → Sign Up (`/sign-up`), success state (in-place — "Check your email")
- **Behavior**: Button becomes disabled and shows "Creating account…". On `supabase.auth.signUp` success, the form is replaced in-place with a "Check your email" confirmation message. User stays on `/sign-up` — no navigation until they click the email link, which will complete auth and redirect to `/create`.**Wireframe** (the To state — success confirmation):```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Back to home                                                          │
│                                                                          │
│                    ┌─────────────────────────────────┐                  │
│                    │  Content Calendar               │                  │
│                    │                                 │                  │
│                    │  Check your email               │                  │
│                    │                                 │                  │
│                    │  We sent a confirmation link to │                  │
│                    │  priya@stackform.io             │                  │
│                    │                                 │                  │
│                    │  Click the link to activate     │                  │
│                    │  your account and start         │                  │
│                    │  planning content.              │                  │
│                    │                                 │                  │
│                    └─────────────────────────────────┘                  │
└──────────────────────────────────────────────────────────────────────────┘
```
- **Copy in this frame**:
  - `"Creating account…"` (loading state — ellipsis U+2026, §7)
  - `"Check your email"` (heading — direct, §1)
  - `"We sent a confirmation link to priya@stackform.io"` (confirmation body — direct, §1)
  - `"Click the link to activate your account and start planning content."` (instruction — direct, §1)

* * *

### Frame 34: Sign Up → Already have account → Sign In (/sign-in)

- **Trigger**: Click `[Sign in →]` footer link on the Sign Up screen
- **From**: Sign Up (`/sign-up`), idle
- **To**: Sign In (`/sign-in`), idle
- **Behavior**: Navigates to the Sign In screen. No data carried over.See Sign In screen.
- **Copy in this frame**:
  - `"Already have an account? Sign in →"` (footer link — direct, §1)

* * *

### Frame 35: Sign Up → Back to home → Landing (/)

- **Trigger**: Click `[← Back to home]` top-left link on the Sign Up screen
- **From**: Sign Up (`/sign-up`), any state
- **To**: Landing page (`/`), populated
- **Behavior**: Navigates back to the landing page.See Landing Page screen.
- **Copy in this frame**:
  - `"← Back to home"` (back navigation — action-first, §3)

* * *

## Copy Decisions

| Location | Copy | Rule applied |
| --- | --- | --- |
| Header / hero CTA (primary) | `"Try demo →"` | Action-first, §3 |
| Header CTA (secondary) | `"Sign in"` | Action-first, §3 |
| Hero subheading | `"Plan, schedule, and track posts across every platform. No more sticky notes, no more spreadsheets."` | Direct, confident, §1 |
| Footer → Features link | `"Features"` | Noun label, §3 |
| Hero secondary anchor | `"See how it works"` | Action-first, §3 |
| Create board top bar | `"+ New Idea"` | Action-first, §3 |
| Composer modal heading (new) | `"New Idea"` | Noun label |
| Composer modal heading (edit) | `"5 Ways to Stay Focused When Working from Home"` | Verbatim card title from fixture |
| Composer — ghost action | `"Save draft"` | Action-first, §3 |
| Composer — outline action | `"Schedule"` | Action-first, §3 |
| Composer — primary action | `"Publish now"` | Action-first, §3 |
| Composer — auto-schedule | `"Add to Queue"` | Action-first, §3 |
| Composer — media zone | `"Attach image or video"` | Action-first, §3 |
| New column input placeholder | `"Column name"` | Describes the action, §5 |
| Preferences sheet heading | `"Preferences"` | Noun label |
| Preferences sheet section | `"Account"` | Noun label, §3 |
| Preferences sheet CTA | `"Save changes"` | Action-first, §3 |
| Publish top bar CTA | `"+ New Post"` | Action-first, §3 |
| Composer modal heading (publish) | `"New Post"` | Noun label |
| Composer modal heading (edit) | `"Edit Post"` | Noun label |
| Composer — engagement section | `"Engagement"` | Noun label |
| Published post metrics | `"248 likes"`, `"31 comments"`, `"14 shares"`, `"4,200 reach"` | Verbatim from seed fixture |
| Published post — close action | `"Close"` | Action-first, §3 |
| List view status badge | `"Sch"` / `"Scheduled"` | Status label — amber |
| List view status badge | `"Pub"` / `"Published"` | Status label — green |
| Channel filter — active label | `"Instagram"` | Noun, §3 |
| Tags dropdown — default | `"All Tags"` | Noun, §3 |
| Tags dropdown — pillar names | `"Content & Marketing"`, `"Product Updates"`, `"Behind the Scenes"`, `"Community"` | Verbatim from seed fixture |
| Timezone selector options | `"UTC-5 (EST)"`, `"UTC+0 (GMT)"`, `"UTC+1 (CET)"`, `"UTC+5:30 (IST)"`, `"UTC+8 (SGT)"`, `"UTC-8 (PST)"` | Standard timezone abbreviations |
| Sign In — OAuth button | `"Continue with Google"` | Action-first, |