# Content Calendar

## Product Overview

**Content Calendar** is an AI-powered social media planning workspace for marketing teams. It brings idea capture, scheduling, and performance tracking into one tool — from brainstorm to published post, without switching between a notes app, a spreadsheet, and a scheduling tool.

**Core actions:**

- **Brainstorm and organize** — capture post ideas on a kanban board, drag cards between stages (Inspiration → To-do → In Progress), and never lose a content idea again
- **Schedule across platforms** — drop posts onto a week or month calendar, assign to Instagram/LinkedIn/X/TikTok, and see the whole content mix at a glance
- **Compose and publish** — write captions with per-platform character counts, attach media, pick a date or queue for auto-scheduling, and send directly from the workspace
- **Track performance** — see likes, comments, shares, and reach on published posts without leaving the calendar

**Category**: `ai-chatbot`**Tech stack**: Vite, React, TypeScript, Tailwind CSS, shadcn/ui **Pages**: `/` (landing — "Try demo" + "Sign in"), `/demo/create` + `/create` (idea board — kanban), `/demo/publish` + `/publish` (scheduling calendar), `/sign-in` (auth), `/sign-up` (auth)

* * *

## Breadboard

Places, affordances, and connections. Play through the use case — does the flow work?

```
Landing Page (/)                  Create (/create)                                    Publish (/publish)
────────────────                  ────────────────                                    ──────────────────
  Try demo ──→ Create (/demo/create)   + New Idea ──→ Composer (modal — new draft)        + New Post ──→ Composer (modal — new post)
  Sign in ──→ Sign In (/sign-in)       Drag card ──→ (in-place — column updates)          Drag post to slot ──→ (in-place — time/date updates)
  Features ──→ #features               Click card ──→ Composer (modal — edit card)        Click post card ──→ Composer (modal — edit post)
  See how it works ──→ #demo           Board/Gallery toggle ──→ (in-place — view switches) Week/Month/List toggle ──→ (in-place — view switches)
                                       Add column ──→ (in-place — new column appended)     Filter by channel ──→ (in-place — posts filter)
                                       Rename column ──→ (in-place — inline edit)          Filter by tag ──→ (in-place — posts filter)
                                       Navigate to Publish ──→ Publish (/publish)          Change timezone ──→ (in-place — times update)
                                       Settings ──→ Preferences (panel — account, theme)   Navigate to Create ──→ Create (/create)
                                       Logout ──→ Sign out (clears session, returns to /)  Settings ──→ Preferences (panel — account, theme)
                                                                                           Logout ──→ Sign out (clears session, returns to /)

Sign In (/sign-in)                Sign Up (/sign-up)
──────────────────                ──────────────────
  Google OAuth ──→ Create (/create, auto)        Google OAuth ──→ Create (/create, auto)
  Apple OAuth ──→ Create (/create, auto)         Apple OAuth ──→ Create (/create, auto)
  Email/password ──→ Create (/create, on success) Email/password ──→ Sign In (/sign-in, on success)
  Forgot password ──→ (in-place — reset email sent) Already have account ──→ Sign In (/sign-in)
  Sign up link ──→ Sign Up (/sign-up)            Back to home ──→ Landing (/)
  Try demo ──→ Create (/demo/create)
  Back to home ──→ Landing (/)
```

* * *

## Screen List

| # | Route | Screen | Description |
| --- | --- | --- | --- |
| 1 | `/` | Landing page | Marketing page — hero, feature showcase, testimonials, footer |
| 2 | `/sign-in` | Sign in | Google + Apple OAuth buttons, email/password form, "Forgot password?", links to sign-up and demo, "Back to home" returning to `/` |
| 3 | `/sign-up` | Sign up | Google + Apple OAuth buttons, email/password form, "Check your email" on success, "Back to home" returning to `/` |
| 4 | `/create` | Create (Idea Board) | Kanban board with 5 columns — cards are draggable, show caption preview + content pillar tags + optional thumbnail. Board/Gallery view toggle. "+ New Idea" opens composer modal |
| 5 | `/publish` | Publish (Calendar) | Week/month/list views of scheduled posts. Sidebar lists connected channels. Drag-and-drop rescheduling. Filter by channel/tag. "+ New Post" opens composer modal |

* * *

## Key Decisions

| # | Decision | Rationale |
| --- | --- | --- |
| D1 | Seed data — 5 kanban columns (Unassigned, Inspiration, To-do, In Progress, Repurpose), 15 idea cards with realistic captions and color-coded content pillar tags; 10 scheduled posts across current week (Instagram, LinkedIn, X, TikTok); 3 published posts with engagement metrics (likes, comments, shares, reach) | Demo must feel like a real team's workspace at a glance. Seeded in `src/data/seed.ts` as typed fixtures mirroring the Supabase schema |
| D2 | Dual routing — `/demo/*` (seed data, no auth) and `/*` (Supabase-backed, auth required). Landing "Try demo" goes to `/demo/create`; "Sign in" goes to `/sign-in` | Same components consume data from either a `SeedDataProvider` or `SupabaseDataProvider` — swapping the provider is the only change needed |
| D3 | Post composer is a modal (`dialog`), not a separate route | Users compose while staying oriented in the calendar or board context — the calendar is visible behind the overlay. Modal closes back to the screen that triggered it |
| D4 | Supabase tables: `posts` (id, user_id, caption, platform[], status, scheduled_at, published_at, content_pillar_id, media_url), `columns` (id, user_id, title, position), `cards` (id, user_id, column_id, title, caption, content_pillar_id, media_url, position), `content_pillars` (id, user_id, name, color), `channels` (id, user_id, platform, handle, connected_at), `metrics` (post_id, likes, comments, shares, reach, recorded_at). RLS on all tables. Seeded on signup via `handle_new_user()` trigger for empty-state onboarding prompts only — not demo data | Clear entity separation means the kanban `cards` table and the publishable `posts` table are distinct; a card promoted to a post creates a row in `posts` referencing the original card |
| D5 | Drag-and-drop via `@dnd-kit/core` + `@dnd-kit/sortable` | shadcn has no drag primitive. `@dnd-kit` is the lightest correct choice for both the kanban board (cross-column dragging) and the calendar (slot-to-slot rescheduling). Install explicitly in build step |
| D6 | First-run empty state — real user lands on `/create` with zero cards; empty state shows centered prompt "Add your first idea" with `+ New Idea` CTA. `/publish` shows "No posts scheduled — create an idea or compose a new post." No auto-seeded demo data in real accounts | Seed data is `/demo/*` only. Real accounts start empty. `handle_new_user()` creates default content pillars (Content & Marketing, Product Updates, Behind the Scenes, Community) and one default channel placeholder prompting "Connect your first channel" |

* * *

## Design Decisions

**Primary color**: `coral`

**Section decisions**:

| Slot | Considered | Chosen | Why this one, not the others |
| --- | --- | --- | --- |
| Header | `header` | `header` | Single available header component — dual CTAs "Try demo" (primary) and "Sign in" (secondary) |
| Hero | `hero-01`, `hero-02`, `hero-03`, `hero` | `hero-02` | Marketing teams are visual thinkers — a hero with a prominent product mockup showing the kanban board immediately answers "what does this look like?" `hero-01` is pure centered text with no visual, too abstract for a tool that sells on its visual workspace. `hero-03` skews toward bold editorial announcements, wrong tone for a productivity SaaS. `hero` (base) lacks the layout structure needed for a side-by-side with the autoplay mockup |
| Feature showcase (primary) | `feature-showcase-01`, `feature-showcase-02`, `feature-showcase`, `features-03` | `feature-showcase-01` | The Create board and Publish calendar are two distinct screens with meaningfully different UI — each deserves a full-width browser-chrome showcase with a short label. `feature-showcase-01` cycles through features with the `autoplay-nav` hook, letting visitors see both the kanban and the calendar without scrolling. `feature-showcase-02` is a static split — fine, but can't show multiple surfaces. `features-03` is a bento grid — good for feature bullets, wrong for showing two complex interactive UIs. `feature-showcase` (base) has no cycling mechanism |
| Feature showcase (supporting) | `feature-showcase-01`, `feature-showcase-02`, `feature-showcase`, `features-03` | `features-03` | After the full-screen demo above the fold, a tight bento grid is the right shape for listing supporting features (content pillar tags, cross-platform character counts, engagement metrics, drag-and-drop). These are bullet-point features, not full UI surfaces — `features-03` handles them without needing screenshots. The autoplay block (`feature-showcase-01`) would be redundant a second time |
| Testimonials | `testimonial-01`, `testimonial-02`, `testimonial-03`, `testimonial-slider` | `testimonial-slider` | Marketing teams are socially savvy — a sliding testimonial carousel feels native to the audience and lets 4–5 quotes rotate without stacking vertically. `testimonial-01` and `testimonial-02` show 2–3 static quotes side-by-side, sparse for a team tool. `testimonial-03` is a single large pull-quote, too thin for social proof. The slider maximizes quote count in the same vertical space |
| Composer modal | `dialog` (shadcn) | `dialog` | Full-featured modal with caption textarea, platform checkboxes, date/time picker, tag selector, media upload, and action buttons (Save draft / Schedule / Publish now). `sheet` would work for a narrow panel but the composer has too many fields for a slide-in. `drawer` is mobile-first — this is a desktop tool |
| Kanban board | `card` + `scroll-area` + `badge` + `separator` (shadcn) + `@dnd-kit/sortable` | `card` + `scroll-area` + `badge` + `@dnd-kit/sortable` | No starter block covers a kanban. Build page-scoped in `pages/create/components/`. Each column is a `scroll-area` with `card` tiles; content pillar tags are `badge` with tinted variants (purple/blue/green/orange). `@dnd-kit/sortable` handles cross-column drag |
| Calendar grid | `card` + `badge` + `tabs` + `scroll-area` (shadcn) + `@dnd-kit/core` | `card` + `badge` + `tabs` + `@dnd-kit/core` | No starter block covers a scheduling calendar. Build page-scoped in `pages/publish/components/`. Week/Month/List are `tabs`. Day cells are `card` wrappers; post chips are `badge`-styled cards with platform icon dots. `@dnd-kit/core` handles slot-to-slot rescheduling |
| Sidebar (app) | `app-sidebar`, `sidebar` (base), `workspace-layout-01` | `workspace-layout-01` | The app has two primary screens (Create, Publish) plus channel filters on Publish — a peekable sidebar with icon + label nav fits the two-screen structure. `workspace-layout-03` adds breadcrumbs and an inset card, unnecessary overhead for a two-route app. `workspace-layout-02` uses pill tabs at the top — wrong for channel list which lives in the sidebar on Publish |

* * *

## Plans

| # | Document | What it covers |
| --- | --- | --- |
| 00 | [00-breadboard.md](00-breadboard.md) | This doc — scope, breadboard, decisions |
| 00 | [00-screenboard.md](00-screenboard.md) | Per-screen wireframes, design system, mock data |
| 00 | [00-storyboard.md](00-storyboard.md) | Transitions between screens, copy decisions |