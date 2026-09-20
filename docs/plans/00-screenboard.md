# Screens — Content Calendar

One entry per screen from the plan's Screen List. Read [00-breadboard.md](00-breadboard.md) for product scope and component choices.

* * *

## Landing Page (`/`)

Marketing page targeting marketing teams. Visitors see what the product does and click "Try demo" to land directly in the kanban board.

**Wireframe**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Content Calendar                        [Try demo]  [Sign in]          │
│  ────────────────────────────────────────────────────────────────────── │
│                                                                          │
│   From idea to published —                                               │
│   your whole content workflow in one place.                              │
│                                                                          │
│   Plan, schedule, and track posts across every platform.                │
│   No more sticky notes, no more spreadsheets.                           │
│                                                                          │
│   [Try demo →]                    [Sign in]                             │
│                                                                          │
│   ┌───────────────────────────────────────────────────────────────┐     │
│   │ ● ● ●  contentcalendar.app/create                            │     │
│   │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │     │
│   │  │Inspiration│ │  To-do  │ │In Progress│ │Repurpose │        │     │
│   │  │          │ │         │ │          │ │          │        │     │
│   │  │ [card]   │ │ [card]  │ │ [card]   │ │ [card]   │        │     │
│   │  │ [card]   │ │ [card]  │ │          │ │          │        │     │
│   │  └──────────┘ └─────────┘ └──────────┘ └──────────┘        │     │
│   └───────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  ── Features ──────────────────────────────────────────────────────── │
│  [ Idea Board ]  [ Schedule ]  [ Compose ]  [ Track ]                  │
│   ┌───────────────────────────────────────────────────────────────┐    │
│   │ ● ● ●  (feature mockup for active tab)                        │    │
│   └───────────────────────────────────────────────────────────────┘    │
│                                                                          │
│  ── Why teams love it ──────────────────────────────────────────────── │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ [PenLine]    │  │[CalendarDays]│  │  [BarChart2] │  │  [Globe]  │  │
│  │ Capture ideas│  │ Visual sched.│  │ Track results│  │ 4 platform│  │
│  │ before they  │  │ at a glance  │  │ without      │  │ in one    │  │
│  │ disappear    │  │              │  │ switching    │  │ workspace │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘  │
│                                                                          │
│  ── What marketing teams say ──────────────────────────────────────── │
│  ◀  "We cut our content planning time in half. The kanban board        │
│      is exactly how our team thinks about ideas."                       │
│      — Priya Nair, Head of Content, Stackform                          │
│                                                          ●  ○  ○  ○  ▶ │
│                                                                          │
│  ── Your content pipeline starts here ─────────────────────────────── │
│          Stop juggling tools. Start shipping content.                  │
│          [Try demo →]                                                   │
│                                                                          │
│  ── Footer ────────────────────────────────────────────────────────── │
│  Content Calendar    Product    Connect    Legal                        │
└──────────────────────────────────────────────────────────────────────────┘
```

### Header

- `header` component. Sticky nav. Wordmark left. Two CTAs right: "Try demo" (`button`, primary) and "Sign in" (`button`, ghost).
- Two CTAs because the audience splits between first-time visitors who want to try immediately and returning users who want to sign in. Both intents live in the header.
- No nav links — the page has one job: get visitors into the demo. A nav menu would scatter attention.

### Hero

- `hero-02` with product mockup on the right and headline + CTAs on the left.
- Headline: "From idea to published — your whole content workflow in one place." Subheading: "Plan, schedule, and track posts across every platform. No more sticky notes, no more spreadsheets."
- Two buttons: "Try demo →" (primary, `button`) and "Sign in" (ghost, `button`). Same destinations as the header — consistent throughout the fold.
- Product mockup shows the kanban board (`browser-window`) with column headers and two-three idea cards per column. Marketing teams are visual — showing the UI in the hero answers "what does this look like?" before any copy can.
- No animated mockup in the hero — a static screenshot is faster and less distracting. Animation lives in the feature showcase below.

### Feature showcase

- `feature-showcase-01` with `autoplay-nav`. Four tabs auto-cycle: "Idea Board", "Schedule", "Compose", "Track". Each tab shows a product mockup in `browser-window`.
  - Idea Board → kanban view with color-coded content pillar badges
  - Schedule → week calendar view with platform icon dots on post cards
  - Compose → post composer modal with caption field and platform checkboxes
  - Track → published posts with engagement metric chips (likes, comments, reach)
- Auto-cycling gives visitors the full product tour without requiring scroll or click. Stops on hover so curious visitors can linger.
- No video embed — the static mockups are faster to load and don't require sound controls.

### Supporting features grid

- `features-03` bento grid. Four cells, each with a Lucide icon, a label, and one-line description:
  - [PenLine] "Capture ideas before they disappear" — kanban drag-and-drop
  - [CalendarDays] "Visual scheduling at a glance" — week + month calendar
  - [BarChart2] "Track results without switching" — engagement metrics inline
  - [Globe] "4 platforms in one workspace" — Instagram, LinkedIn, X, TikTok
- These are bullet-point features, not full UI surfaces. `features-03` handles them cleanly without needing screenshots.
- No pricing comparison table — this is a demo-first template. Pricing belongs on a separate marketing site.

### Testimonials

- `testimonial-slider` with `autoplay-nav`. Horizontal carousel — 4 quotes from marketing practitioners. Each card shows quote, name, role, and company.
- Slider maximizes quote density without vertical stacking. Marketing audiences are familiar with carousels.
- No star ratings — B2B tools don't need five-star cosmetics. Named quotes with real roles are more credible.

### CTA banner

- `cta-01`. Centered headline: "Stop juggling tools. Start shipping content." Single primary button "Try demo →".
- Repeated CTA for visitors who scrolled past the hero. Same destination only — no secondary action.

### Footer

- `footer-01`. Four columns: wordmark + tagline, Product (Features, Demo, Sign in), Connect (Twitter, LinkedIn), Legal (Privacy, Terms).
- No newsletter signup — the conversion goal is the demo, not email capture.

* * *

**Mock data** (`src/data/seed.ts`):

- Feature tabs: 4 entries — Idea Board ("Drag ideas from inspiration to ready-to-post"), Schedule ("See your whole week — posts, platforms, and gaps at a glance"), Compose ("Write captions, attach media, and schedule — all in one modal"), Track ("Likes, comments, shares, and reach right on the calendar")
- Testimonials: 4 entries — Priya Nair (Head of Content, Stackform), Marcus Webb (Social Media Manager, Loopcast), Sana Kowalski (VP Marketing, Meridian), David Chen (Content Lead, Catalyze)
- Footer links: Product (Features, Demo, Sign in), Connect (Twitter, LinkedIn), Legal (Privacy, Terms)

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | none |
| **Read** | feature tabs, testimonials, footer links (static marketing content) |
| **Update** | none |
| **Delete** | none |
| **Filter** | none |
| **Sort** | none |
| **Search** | none |
| **Paginate** | none |
| **Aggregate** | none |
| **Drill down** | none |
| **Auth** | public |

**Empty state**: n/a — landing page has no data state.

**States**: populated only (landing has no loading or empty state)

* * *

## Sign In (`/sign-in`)

Auth screen with social OAuth and email/password form. Signing in goes to `/create`.

**Wireframe**:

```
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
│                    │  [                           ]  │                  │
│                    │                                 │                  │
│                    │  Password              Forgot?  │                  │
│                    │  [                           ]  │                  │
│                    │                                 │                  │
│                    │  [      Sign in               ] │                  │
│                    │                                 │                  │
│                    │  No account? Sign up            │                  │
│                    │  or  Try demo →                 │                  │
│                    └─────────────────────────────────┘                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Back navigation

- Ghost link "← Back to home" top-left routes to `/`. No header — the auth screen is fullscreen (`application-layout`), not wrapped in the app shell.
- No wordmark in a sticky header — the card carries the brand. A header would add visual weight on a screen that should feel calm and focused.

### Auth card

- Centered `card` with `p-6` padding. `card-header` with wordmark, heading "Welcome back", and subheading "Sign in to your workspace."
- Two OAuth buttons stacked: [G] "Continue with Google" and [A] "Continue with Apple". Both are full-width `button` (outline variant) with platform icon left-aligned.
- "or" `separator` between OAuth and email form.
- Email `input` + Password `input` with inline "Forgot?" link (routes to reset flow in-place — confirmation message replaces the form).
- Primary "Sign in" `button` full-width.
- Footer links: "No account? Sign up" → `/sign-up` and "Try demo →" → `/demo/create`.
- No remember-me checkbox — sessions persist by default. No "keep me signed in" toggle adds friction without real value at this product stage.

* * *

**Mock data** (`src/data/seed.ts`): none — auth form has no seed data.

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | none |
| **Read** | none |
| **Update** | none |
| **Delete** | none |
| **Filter** | none |
| **Sort** | none |
| **Search** | none |
| **Paginate** | none |
| **Aggregate** | none |
| **Drill down** | none |
| **Auth** | public |

**Empty state**: n/a — form is always shown.

**States**: idle, submitting (button disabled + "Signing in…"), error (inline error under field), forgot password (form replaced by "Check your email" confirmation)

* * *

## Sign Up (`/sign-up`)

New account creation. Google + Apple OAuth or email/password. Success redirects to `/create`.

**Wireframe**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│  ← Back to home                                                          │
│                                                                          │
│                    ┌─────────────────────────────────┐                  │
│                    │  Content Calendar               │                  │
│                    │                                 │                  │
│                    │  Create your account            │                  │
│                    │  Start planning content today   │                  │
│                    │                                 │                  │
│                    │  [G]  Continue with Google      │                  │
│                    │  [A]  Continue with Apple       │                  │
│                    │                                 │                  │
│                    │  ─────────── or ───────────     │                  │
│                    │                                 │                  │
│                    │  Full name                      │                  │
│                    │  [                           ]  │                  │
│                    │                                 │                  │
│                    │  Email                          │                  │
│                    │  [                           ]  │                  │
│                    │                                 │                  │
│                    │  Password                       │                  │
│                    │  [                           ]  │                  │
│                    │                                 │                  │
│                    │  [      Create account        ] │                  │
│                    │                                 │                  │
│                    │  Already have an account?       │                  │
│                    │  Sign in →                      │                  │
│                    └─────────────────────────────────┘                  │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### Back navigation

- Same ghost "← Back to home" link as sign-in. `application-layout` — no sidebar, no header.

### Auth card

- Centered `card`. Heading "Create your account", subheading "Start planning content today."
- Two OAuth buttons: "Continue with Google", "Continue with Apple" — full-width, outline variant.
- "or" `separator`.
- Three `input` fields: Full name, Email, Password.
- Primary "Create account" `button` full-width.
- Footer: "Already have an account? Sign in →" → `/sign-in`.
- On successful email submission: form is replaced in-place with a "Check your email" confirmation message. No redirect until the user clicks the email link.
- No terms-of-service checkbox at this stage — keep the path to the product as frictionless as possible.
- No password confirmation field — modern password managers handle this. A second field adds friction with no meaningful security benefit at the sign-up stage.

* * *

**Mock data** (`src/data/seed.ts`): none.

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | new user account |
| **Read** | none |
| **Update** | none |
| **Delete** | none |
| **Filter** | none |
| **Sort** | none |
| **Search** | none |
| **Paginate** | none |
| **Aggregate** | none |
| **Drill down** | none |
| **Auth** | public |

**Empty state**: n/a — form is always shown.

**States**: idle, submitting (button disabled + "Creating account…"), error (inline field errors), success (form replaced with "Check your email — we sent a confirmation link to [you@example.com](mailto:you@example.com)")

* * *

## Create (Idea Board) (`/create` and `/demo/create`)

Kanban workspace where marketing teams capture and organize post ideas across five columns. Cards are draggable. A toggle switches between board and gallery view.

**Wireframe**:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR                  │  MAIN CONTENT                                        │
│                          │                                                      │
│  [GridIcon] Create       │  Idea Board          [Board] [Gallery]  [+ New Idea]│
│  [Calendar] Publish      │  ──────────────────────────────────────────────────  │
│                          │                                                      │
│  ─────────────────────   │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌──────┐│
│                          │  │Unassigned │ │Inspiration│ │  To-do   │ │ In  ││
│                          │  │  2 cards  │ │  4 cards  │ │  3 cards │ │Prog.││
│                          │  │ ─────── │ │ ─────── │ │ ─────── │ │  3  ││
│                          │  │ ┌───────┐ │ │ ┌───────┐ │ │ ┌───────┐ │ │cards││
│                          │  │ │[Img]  │ │ │ │       │ │ │ │[Img]  │ │ └─────┘│
│                          │  │ │Remote │ │ │ │5 Ways │ │ │ │Behind │ │        │
│                          │  │ │Work   │ │ │ │to Stay│ │ │ │the    │ │┌──────┐│
│                          │  │ │Tips   │ │ │ │Focused│ │ │ │Scenes:│ ││Repurp││
│                          │  │ │       │ │ │ │       │ │ │ │Team   │ ││ 3    ││
│                          │  │ │[tag]  │ │ │ │[tag]  │ │ │ │Offsite│ ││cards ││
│                          │  │ └───────┘ │ │ └───────┘ │ │ └───────┘ │ └──────┘│
│                          │  │           │ │           │ │           │         │
│                          │  │ ┌───────┐ │ │ ┌───────┐ │ │ ┌───────┐ │         │
│                          │  │ │Q1     │ │ │ │Why    │ │ │ │Product│ │         │
│                          │  │ │Hiring │ │ │ │we     │ │ │ │Update:│ │         │
│                          │  │ │Update │ │ │ │hired  │ │ │ │Spring │ │         │
│                          │  │ │       │ │ │ │remote │ │ │ │Launch │ │         │
│                          │  │ │[tag]  │ │ │ │[tag]  │ │ │ │[tag]  │ │         │
│                          │  │ └───────┘ │ │ └───────┘ │ │ └───────┘ │         │
│                          │  │           │ │           │ │           │         │
│                          │  │ [+ Add]   │ │ [+ Add]   │ │ [+ Add]   │         │
│                          │  └───────────┘ └───────────┘ └───────────┘         │
│  ─────────────────────   │                                                      │
│  [Settings]              │                                                      │
│  [LogOut]                │                                                      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Sidebar

- `workspace-layout-01` shell. Peekable sidebar with icon + label nav items.
- Two primary nav items: [LayoutGrid] "Create" (active state, `primary` color indicator) and [CalendarDays] "Publish" → `/publish`.
- Footer: [Settings] → opens Preferences sheet, [LogOut] → clears session and returns to `/`.
- No nested items, no channel list — channel filtering lives on the Publish screen only. The Create board is platform-agnostic; ideas aren't tied to channels yet.

### Top bar

- Page title "Idea Board" left-aligned (heading, `semibold`).
- Right cluster: Board/Gallery view toggle (`toggle-group` with [LayoutGrid] and [Image] icons), then "+ New Idea" `button` (primary).
- No search bar in the top bar — the board has 15 cards across 5 columns, scannable at a glance. Search adds complexity without payoff at this scale. Add later if card count grows beyond 50.

### Kanban board

- Five horizontal columns: Unassigned, Inspiration, To-do, In Progress, Repurpose. Built as a page-scoped component in `pages/create/components/KanbanBoard.tsx`.
- Each column is a `scroll-area` (vertical scroll if cards overflow) with a column header (`card` wrapper, muted background) showing: column name (`semibold`), card count (`muted-foreground`, `text-sm`), overflow `dropdown-menu` (rename, delete column), and "+ Add" ghost link at the bottom.
- Each card is a `card` with:
  - Optional media thumbnail (16:9 aspect ratio, `aspect-ratio` component — shown when `media_url` present)
  - Title (`semibold`, `text-sm`, `foreground`)
  - Caption preview (2 lines max, `text-xs`, `muted-foreground`) — truncated with CSS `line-clamp-2`
  - Content pillar `badge` (color-coded: purple for Content & Marketing, blue for Product Updates, green for Behind the Scenes, orange for Community)
- Drag-and-drop via `@dnd-kit/sortable`. Dragging between columns updates `column_id` in-place. Drag handle is the entire card surface — no explicit handle icon.
- On hover: `bg-muted/60` wash, cursor changes to `grab`.
- Clicking a card (not dragging) opens the Composer modal pre-populated with that card's data.
- "Add column" affordance: a ghost `button` with [Plus] icon after the last column. Clicking appends a new untitled column with an inline `input` for the name.
- No search, no filter on the board — the column structure IS the filter. Searching 15 cards is slower than reading the columns.

### Board / Gallery toggle

- `toggle-group` (two items: [LayoutGrid] Board, [Grid2X2] Gallery).
- Gallery view: `card` grid (3 columns, `gap-4`) showing cards as larger tiles with the media thumbnail prominent. Same data, different density. Board view is default.
- The toggle is in-place — no navigation, no loading state. View preference is stored in local state.

### Column rename and add

- Clicking a column name triggers an inline `input` replace (the label becomes an editable field). Enter or blur commits the rename.
- No bulk operations (select all, move all) at this stage — team boards at this scale are managed card-by-card.

### Composer modal (triggered from "+ New Idea" or card click)

```
┌──────────────────────────────────────────────────────────────┐
│  New Idea                                              [X]   │
│  ──────────────────────────────────────────────────────────  │
│                                                              │
│  Title                                                       │
│  [                                                        ]  │
│                                                              │
│  Caption                                                     │
│  [                                                        ]  │
│  [                                                        ]  │
│  [                                                        ]  │
│                                                              │
│  Platform(s)                                                 │
│  [ ] Instagram  [ ] LinkedIn  [ ] X  [ ] TikTok  [ ] Facebook│
│                                                              │
│  Content Pillar                    Schedule                  │
│  [Content & Marketing         ▾]   [Pick date & time     ]  │
│                                    [or Add to Queue       ]  │
│                                                              │
│  Media                                                       │
│  [Attach image or video                              [+] ]  │
│                                                              │
│  Character count: Instagram 0/2200 · LinkedIn 0/3000        │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│  [Save draft]                 [Schedule]  [Publish now]     │
└──────────────────────────────────────────────────────────────┘
```

- `dialog` component. Opens from "+ New Idea" (blank form) or card click (pre-populated).
- Title `input` (single line). Caption `textarea` (auto-growing, 3 rows min).
- Platform checkboxes: Instagram, LinkedIn, X, TikTok, Facebook — each a `checkbox` with platform icon. At least one required to schedule or publish.
- Content Pillar `select` — four options with color dot indicators (purple/blue/green/orange).
- Schedule: `calendar` popover + time `input`, or "Add to Queue" `button` (ghost) for auto-scheduling.
- Media: drag-drop zone or file `input` for image/video attachment. Shows thumbnail preview on attach.
- Character count bar: live per-platform counts below the caption field. Only shows platforms that are checked.
- Three footer actions: "Save draft" (ghost), "Schedule" (outline, disabled until date+platform selected), "Publish now" (primary).
- Closing via [X] or clicking outside discards unsaved changes (with a `alert-dialog` confirmation if content has been entered).
- No AI writing assistant in the composer at this stage — keep the modal focused on the composition task. Add later as a "Improve with AI" affordance.

* * *

**Mock data** (`src/data/seed.ts`):

- `columns`: 5 entries — Unassigned (position 0), Inspiration (position 1), To-do (position 2), In Progress (position 3), Repurpose (position 4)
- `content_pillars`: 4 entries — Content & Marketing (`#7C3AED` purple), Product Updates (`#2563EB` blue), Behind the Scenes (`#059669` green), Community (`#D97706` orange)
- `cards`: 15 entries (3 per column), e.g.:
  - Unassigned: "Remote Work Tips for Distributed Teams" (Community, no media, "Here's what we've learned after 3 years of fully remote…"), "Q1 Hiring Update — We're Growing" (Product Updates, no media, "We just opened 5 new roles across engineering and marketing…")
  - Inspiration: "5 Ways to Stay Focused When Working from Home" (Content & Marketing, no media, "Spoiler: it's not about the standing desk…"), "Why We Hired Async-First" (Behind the Scenes, no media, "We stopped doing daily standups in 2022. Here's what happened…"), "Community Spotlight: March" (Community, thumbnail, "This month we're highlighting three members who…"), "Repost: Our most-liked LinkedIn post of Q4" (Content & Marketing, no media)
  - To-do: "Behind the Scenes: Team Offsite Recap" (Behind the Scenes, thumbnail, "We took the whole team to Lisbon for a week…"), "Product Update: Spring Launch Preview" (Product Updates, thumbnail, "Here's a sneak peek at what's shipping in April…"), "The Content Pillars Framework We Use Internally" (Content & Marketing, no media)
  - In Progress: "How We Built Our Content Calendar (And What We Learned)" (Content & Marketing, no media, "We tried spreadsheets. We tried Notion. We tried Airtable…"), "TikTok Series: Day in the Life" (Behind the Scenes, thumbnail), "April Platform Roundup: What Changed This Month" (Product Updates, no media)
  - Repurpose: "Repurpose: Q4 2023 Blog Post → LinkedIn Carousel" (Content & Marketing, no media), "Repurpose: Podcast Episode 12 → 5 Twitter Threads" (Community, no media), "Repurpose: Case Study → Instagram Story Series" (Product Updates, thumbnail)
- Each card has: `id`, `column_id`, `title`, `caption`, `content_pillar_id`, `media_url` (nullable), `position`, `created_at`

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | "+ New Idea" button opens Composer modal → creates `cards` row; "+ Add" at column footer creates new column |
| **Read** | all `cards` grouped by `column_id`, `columns` ordered by `position`, `content_pillars` for badge colors |
| **Update** | drag card between columns (updates `column_id`), drag card within column (updates `position`), click card → Composer modal (edits `title`, `caption`, `content_pillar_id`, `media_url`), inline column rename (updates `columns.title`) |
| **Delete** | card delete via overflow menu on card hover; column delete via column overflow menu (confirms with `alert-dialog`) |
| **Filter** | none — column structure is the filter |
| **Sort** | cards ordered by `position` within each column (drag-to-reorder sets position) |
| **Search** | none |
| **Paginate** | none — `scroll-area` handles overflow within each column |
| **Aggregate** | card count per column header |
| **Drill down** | click card → Composer modal (edit view) |
| **Auth** | protected on `/create`; public on `/demo/create` |

**Empty state**:

```
┌──────────────────────────────────────────────────────────────┐
│ [skeleton column]  [skeleton column]  [skeleton column]      │
│  ░░░░░░░░░░░░░░░   ░░░░░░░░░░░░░░░   ░░░░░░░░░░░░░░░        │
│  ░░░░░░░░░░░░░░░   ░░░░░░░░░░░░░░░   ░░░░░░░░░░░░░░░        │
│                                                              │
│              ┌───────────────────────────┐                   │
│              │  [PenLine]                │                   │
│              │  Add your first idea      │                   │
│              │                           │                   │
│              │  Capture content ideas    │                   │
│              │  before they disappear.   │                   │
│              │                           │                   │
│              │  [+ New Idea            ] │                   │
│              └───────────────────────────┘                   │
└──────────────────────────────────────────────────────────────┘
```

- Skeleton background: three muted column outlines with `skeleton` shimmer bars representing cards.
- Floating `card` with `shadow-lg`, centered. [PenLine] icon, heading "Add your first idea", body "Capture content ideas before they disappear.", primary CTA "+ New Idea" opens Composer modal.
- No secondary option — creation is the only path. Real users don't import kanban cards.

**States**: populated (shown above), gallery view (grid layout), card dragging (drag ghost visible, column highlights drop target), composer open (modal overlay), column rename active (inline input), empty (floating card above skeleton columns), loading (skeleton cards in columns)

* * *

## Publish (Calendar) (`/publish` and `/demo/publish`)

Scheduling calendar showing all planned and published posts across the week. Posts are draggable between time slots. A sidebar filters by connected channel.

**Wireframe**:

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│ SIDEBAR                   │  MAIN CONTENT                                          │
│                           │                                                        │
│  [GridIcon] Create        │  ← Apr 7–13, 2025 →   [Week] [Month] [List]          │
│  [Calendar] Publish       │  [All Posts ▾]  [Tags ▾]  [UTC-5 ▾]  [+ New Post]   │
│                           │  ─────────────────────────────────────────────────    │
│  Channels                 │         Mon    Tue    Wed    Thu    Fri    Sat   Sun   │
│  ─────────────────────    │         Apr7   Apr8   Apr9   Apr10  Apr11  Apr12 Apr13 │
│  ● [Ig] @stackform_ig     │  9am  │       │       │[card]│       │      │     │   │
│  ● [Li] @Stackform        │      │       │       │IG    │       │      │     │   │
│  ● [X]  @stackform        │ 10am │[card] │       │      │[card] │      │     │   │
│  ● [Tk] @stackform.tk     │      │LI     │       │      │ X     │      │     │   │
│                           │ 11am │       │[card] │      │       │[card]│     │   │
│  [+ Connect channel]      │      │       │TK     │      │       │ LI   │     │   │
│                           │ 12pm │       │       │      │       │      │     │   │
│                           │  1pm │[card] │       │[card]│       │      │     │   │
│                           │      │IG+LI  │       │TK    │       │      │     │   │
│                           │  2pm │       │       │      │[card] │      │     │   │
│                           │      │       │       │      │X      │      │     │   │
│                           │                                                        │
│  ─────────────────────    │                                                        │
│  [Settings]               │                                                        │
│  [LogOut]                 │                                                        │
└────────────────────────────────────────────────────────────────────────────────────┘
```

### Sidebar

- `workspace-layout-01` shell. Same sidebar structure as Create. [LayoutGrid] "Create" → `/create`, [CalendarDays] "Publish" (active).
- "Channels" section below nav: heading "Channels" (`text-xs font-medium uppercase tracking-wider`, `muted-foreground`), then 4 channel rows, each showing: colored platform dot, platform icon, handle. Clicking a row filters the calendar to that channel only (active state: dot turns `primary`, row gets `bg-accent`).
- "+ Connect channel" ghost `button` at the bottom of the channels list — opens a connection flow (out of scope for demo; shows a toast "Coming soon" in demo mode).
- Footer: [Settings], [LogOut] — same as Create.
- No search in the sidebar — 4 channels is scannable without search.

### Top bar and filters

- Week navigation: "← Apr 7–13, 2025 →" with [ChevronLeft] / [ChevronRight] `button` (ghost) either side of the date range. Clicking advances or retreats by one week.
- View toggle: `toggle-group` — [LayoutGrid] Week, [CalendarDays] Month, [List] List. Switching changes the calendar grid in-place.
- Filter row: "All Posts" `dropdown-menu` (filter by channel — mirrors the sidebar), "Tags" `dropdown-menu` (multi-select content pillars), timezone `select` (UTC-5 default). "+ New Post" `button` (primary, right-aligned).
- Channel filter in the top bar duplicates the sidebar filter — either one updates the shared filter state. The sidebar is the primary filter affordance; the top-bar dropdown is a convenience alias for keyboard-first users.
- No text search on the calendar — posts are found by visual scanning or by filtering. A search bar would overlap with the filter controls without adding clarity.

### Calendar grid (week view)

- Built as `pages/publish/components/WeekCalendar.tsx`. 7-column × hourly-row grid (`scroll-area` vertical).
- Day headers: day-of-week abbreviation + date number (`muted-foreground`). Today gets a `primary`-colored indicator on the date number.
- Each cell is a drop target (`@dnd-kit/core`). Hovering a cell during drag highlights it with `bg-accent/60`.
- Post cards inside cells are `card` (compact variant, `p-2`):
  - Left: platform icon dot(s) — colored dots for each platform the post targets (coral for Instagram, blue for LinkedIn, black for X, teal for TikTok). Multiple dots when post targets multiple platforms.
  - Caption preview: 1-line truncated (`text-xs`, `foreground`).
  - Content pillar `badge` (color-coded, `text-xs`).
  - Status indicator: amber dot for scheduled, green dot for published, gray dot for draft.
- Clicking a card opens the Composer modal (edit view).
- Dragging a card to a new cell updates `scheduled_at` in-place. The card snaps to the nearest hour.
- No multi-select drag — posts are rescheduled one at a time. Multi-select adds significant DnD complexity without a clear team need at this stage.

### Month view

- `pages/publish/components/MonthCalendar.tsx`. 7-column × 5-row grid. Each cell is a date.
- Each date cell shows up to 3 post chips (compact: platform dot + 1-line caption). "+ N more" link if a date has more than 3 posts — clicking expands a `popover` listing all posts for that day.
- Same drag-and-drop to reschedule across dates.
- No time granularity in month view — month is for big-picture planning, not precise scheduling. Time is shown in week and list views only.

### List view

- `pages/publish/components/PostListView.tsx`. Flat chronological feed. Each row in a `table`:
  - Platform icon dot(s)
  - Scheduled date + time (`muted-foreground`, `text-sm`)
  - Caption preview (2-line truncate)
  - Content pillar `badge`
  - Status `badge` (amber "Scheduled", green "Published", gray "Draft")
  - Engagement metrics row (published posts only): [Heart] likes · [MessageCircle] comments · [Share2] shares · [Eye] reach — `text-xs`, `muted-foreground`
- Rows are sortable by date (default), platform, or status via column headers.
- Clicking a row opens the Composer modal (edit view).
- No bulk actions (select + delete) at this stage — keep the table clean. Add later when teams need mass rescheduling.

### Composer modal (triggered from "+ New Post" or card/row click)

```
┌──────────────────────────────────────────────────────────────┐
│  New Post                                              [X]   │
│  ──────────────────────────────────────────────────────────  │
│                                                              │
│  Caption                                                     │
│  [                                                        ]  │
│  [                                                        ]  │
│  [                                                        ]  │
│                                                              │
│  Platform(s)                                                 │
│  [ ] Instagram  [ ] LinkedIn  [ ] X  [ ] TikTok  [ ] Facebook│
│                                                              │
│  Character count: Instagram 0/2200 · LinkedIn 0/3000        │
│                                                              │
│  Content Pillar                    Schedule                  │
│  [Content & Marketing         ▾]   [Pick date & time     ]  │
│                                    [Add to Queue          ]  │
│                                                              │
│  Media                                                       │
│  [Attach image or video                              [+] ]  │
│                                                              │
│  ─────────────────────────────────────────────────────────   │
│  [Save draft]                 [Schedule]  [Publish now]     │
└──────────────────────────────────────────────────────────────┘
```

- Same `dialog` as the Create screen's Composer modal. On the Publish screen, "New Post" defaults to `status: scheduled` intent; on Create it defaults to `status: idea/draft`.
- Pre-filled with `scheduled_at` if opened by clicking a calendar cell's empty area (time-slot click creates a new post pre-set to that slot).
- Published posts show engagement metrics at the bottom of the modal (read-only): [Heart] 248 likes · [MessageCircle] 31 comments · [Share2] 14 shares · [Eye] 4,200 reach.
- No "Promote post" or ad integration — out of scope for this template version.

* * *

**Mock data** (`src/data/seed.ts`):

- `channels`: 4 entries — Instagram (@stackform_ig), LinkedIn (@Stackform), X (@stackform), TikTok (@stackform.tk), each with `connected_at: 2025-01-15`
- `posts`: 10 scheduled posts across Apr 7–13, 2025:
  - Mon Apr 7 10:00 — "We just opened 5 new engineering roles…" (LinkedIn, Product Updates, scheduled)
  - Mon Apr 7 13:00 — "Remote work tip #14: async standups changed everything for us…" (Instagram + LinkedIn, Content & Marketing, scheduled)
  - Tue Apr 8 11:00 — "Day in the life: our design team's Monday morning ritual [TikTok series ep. 3]" (TikTok, Behind the Scenes, scheduled)
  - Wed Apr 9 09:00 — "Q1 product highlights — here's everything we shipped in 3 months" (Instagram, Product Updates, scheduled)
  - Wed Apr 9 13:00 — "Our community hit 10,000 members this week. Here's a thank you thread 🧵" (TikTok, Community, scheduled)
  - Thu Apr 10 10:00 — "The content calendar framework our team uses — now open-sourced" (X, Content & Marketing, scheduled)
  - Thu Apr 10 14:00 — "Behind the scenes: how we ran our team offsite in Lisbon on a $15k budget" (X, Behind the Scenes, scheduled)
  - Fri Apr 11 11:00 — "Spring launch preview — sneak peek at what's shipping in April" (LinkedIn, Product Updates, scheduled)
  - Each post: `id`, `user_id`, `caption`, `platform[]`, `status`, `scheduled_at`, `published_at` (null for scheduled), `content_pillar_id`, `media_url` (nullable)
- `posts` (published, with metrics): 3 entries from prior week:
  - Mar 31 — "Here's how we 3x'd our LinkedIn engagement in 60 days" (LinkedIn, Content & Marketing, published Mar 31 09:00) — metrics: 248 likes, 31 comments, 14 shares, 4,200 reach
  - Apr 1 — "Meet the team: our new Head of Growth" (Instagram, Behind the Scenes, published Apr 1 11:00) — metrics: 412 likes, 57 comments, 8 shares, 6,100 reach
  - Apr 3 — "Product update: drag-and-drop scheduling is live" (X + LinkedIn, Product Updates, published Apr 3 14:00) — metrics: 89 likes, 12 comments, 33 shares, 2,800 reach
- `metrics`: 3 entries mirroring the published posts above — `post_id`, `likes`, `comments`, `shares`, `reach`, `recorded_at`

**Data operations**:

| Operation | On this screen |
| --- | --- |
| **Create** | "+ New Post" button opens Composer modal → creates `posts` row; clicking empty calendar cell opens Composer pre-set to that time slot |
| **Read** | `posts` filtered by current week range (`scheduled_at`), `channels` for sidebar list, `metrics` for published post rows in list view |
| **Update** | drag card to new time slot (updates `scheduled_at`); click card → Composer modal (edits caption, platforms, schedule, pillar, media) |
| **Delete** | overflow menu on post card ([MoreHorizontal] → "Delete") with `alert-dialog` confirmation |
| **Filter** | channel sidebar click → filters by `platform[]`; "All Posts" dropdown → same filter; "Tags" dropdown → filters by `content_pillar_id`; timezone selector → updates display times (cosmetic, no DB write) |
| **Sort** | list view: column header click sorts by `scheduled_at` (default asc), platform, or status |
| **Search** | none |
| **Paginate** | week view: prev/next week navigation; month view: prev/next month; list view: all posts in view range, no pagination |
| **Aggregate** | none (counts shown on channel badges in sidebar not implemented at v1) |
| **Drill down** | click post card (week/month) → Composer modal; click row (list view) → Composer modal; published post modal shows engagement metrics |
| **Auth** | protected on `/publish`; public on `/demo/publish` |

**Empty state**:

```
┌──────────────────────────────────────────────────────────────┐
│ [skeleton week grid — 7 columns, muted rows]                 │
│  ░░░ ░░░ ░░░ ░░░ ░░░ ░░░ ░░░                                │
│  ░░░ ░░░ ░░░ ░░░ ░░░ ░░░ ░░░                                │
│                                                              │
│              ┌───────────────────────────────┐               │
│              │  [CalendarDays]               │               │
│              │  Nothing scheduled yet        │               │
│              │                               │               │
│              │  Create an idea on the board  │               │
│              │  or compose a new post.       │               │
│              │                               │               │
│              │  [+ New Post              ]   │               │
│              │  or go to Create board →      │               │
│              └───────────────────────────────┘               │
└──────────────────────────────────────────────────────────────┘
```

- Skeleton background: muted week grid with shimmer bars representing post cards.
- Floating `card` with `shadow-lg`, centered. [CalendarDays] icon, heading "Nothing scheduled yet", body "Create an idea on the board or compose a new post.", primary CTA "+ New Post" (opens Composer modal), secondary ghost link "or go to Create board →" (navigates to `/create`).
- Two CTAs because real users either start from an idea on the board or compose directly to schedule — both paths are valid.

**States**: populated week view (shown above), month view, list view, filtered by channel (subset of posts visible), filtered by tag, post dragging (drag ghost + drop zone highlight), composer open, empty (floating card above skeleton grid), loading (skeleton grid)

* * *

## What's NOT Changing

- `components/ui/` — sacred, no modifications
- `components/ai-elements/` — sacred, no modifications
- `components/base/button.tsx` — inherits theme radius (0px sharp corners)
- `layouts/application-layout.tsx` — used as-is for landing, sign-in, sign-up
- `data/landing.ts` — replaced by seed-driven content in `src/data/seed.ts`

Removed:

- `pages/app/` — replaced by `pages/create/` and `pages/publish/`
- `pages/workspace/` — layout replaced by `workspace-layout-01`

Renames:

- `pages/landing/` → kept as-is, components within updated to Content Calendar copy

New files:

- `src/data/seed.ts` — typed fixtures for columns, cards, content_pillars, channels, posts, metrics
- `pages/create/index.tsx` — Create (Idea Board) route
- `pages/create/components/KanbanBoard.tsx` — five-column DnD kanban built on `@dnd-kit/sortable`
- `pages/create/components/KanbanColumn.tsx` — single column with `scroll-area` + card list
- `pages/create/components/IdeaCard.tsx` — draggable card with thumbnail, caption, pillar badge
- `pages/create/components/GalleryView.tsx` — grid layout alternate view for idea cards
- `pages/create/components/ComposerModal.tsx` — `dialog` with caption, platforms, pillar, schedule, media
- `pages/publish/index.tsx` — Publish (Calendar) route
- `pages/publish/components/WeekCalendar.tsx` — 7-column × hourly-row DnD calendar grid
- `pages/publish/components/MonthCalendar.tsx` — 7×5 date grid with post chips
- `pages/publish/components/PostListView.tsx` — flat chronological `table` with metrics
- `pages/publish/components/PostCard.tsx` — compact card used in week + month calendar cells
- `pages/publish/components/ChannelSidebar.tsx` — channel filter list in sidebar body
- `lib/providers/SeedDataProvider.tsx` — provides seed fixtures to `/demo/*` routes
- `lib/providers/SupabaseDataProvider.tsx` — provides live data to `/*` routes