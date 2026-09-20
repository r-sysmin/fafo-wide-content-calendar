# Cloudboard — Content Calendar

Data layer blueprint. Read [00-breadboard.md](00-breadboard.md) for scope and [00-screenboard.md](00-screenboard.md) for screen wireframes and data contracts.

* * *

## Schema

Tables ordered by dependency: referenced tables before referencing tables.

### `profiles`

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  initials text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

create index profiles_id_idx on public.profiles(id);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;
create policy "profiles select own" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "profiles insert own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "profiles update own" on public.profiles
  for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);
```

**Purpose**: Stores display name and avatar for authenticated users. Created by `handle_new_user()` trigger on signup. **Consumed by**: sidebar user display, settings sheet

* * *

### `content_pillars`

```sql
create table public.content_pillars (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  color text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index content_pillars_user_position_idx on public.content_pillars(user_id, position asc);

grant select, insert, update, delete on public.content_pillars to authenticated;
grant all on public.content_pillars to service_role;

alter table public.content_pillars enable row level security;
create policy "content_pillars select own" on public.content_pillars
  for select to authenticated using (auth.uid() = user_id);
create policy "content_pillars insert own" on public.content_pillars
  for insert to authenticated with check (auth.uid() = user_id);
create policy "content_pillars update own" on public.content_pillars
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "content_pillars delete own" on public.content_pillars
  for delete to authenticated using (auth.uid() = user_id);
```

**Purpose**: Color-coded content pillar tags (e.g. "Content & Marketing" purple, "Product Updates" blue). Referenced by both `cards` and `posts`. Seeded with 4 defaults for every new user. **Consumed by**: `useContentPillars`, `useCards`, `usePosts`

* * *

### `channels`

```sql
create table public.channels (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  platform text not null check (platform in ('instagram','linkedin','x','tiktok','facebook')),
  handle text not null,
  connected_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index channels_user_platform_idx on public.channels(user_id, platform);

grant select, insert, update, delete on public.channels to authenticated;
grant all on public.channels to service_role;

alter table public.channels enable row level security;
create policy "channels select own" on public.channels
  for select to authenticated using (auth.uid() = user_id);
create policy "channels insert own" on public.channels
  for insert to authenticated with check (auth.uid() = user_id);
create policy "channels update own" on public.channels
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "channels delete own" on public.channels
  for delete to authenticated using (auth.uid() = user_id);
```

**Purpose**: Connected social accounts listed in the Publish sidebar. Used to filter calendar posts by platform. **Consumed by**: `useChannels`

* * *

### `columns`

```sql
create table public.columns (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index columns_user_position_idx on public.columns(user_id, position asc);

grant select, insert, update, delete on public.columns to authenticated;
grant all on public.columns to service_role;

alter table public.columns enable row level security;
create policy "columns select own" on public.columns
  for select to authenticated using (auth.uid() = user_id);
create policy "columns insert own" on public.columns
  for insert to authenticated with check (auth.uid() = user_id);
create policy "columns update own" on public.columns
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "columns delete own" on public.columns
  for delete to authenticated using (auth.uid() = user_id);
```

**Purpose**: Kanban columns on the Create screen (Unassigned, Inspiration, To-do, In Progress, Repurpose). User can add, rename, and reorder columns. `position` drives display order. **Consumed by**: `useColumns`, `useCreateColumn`, `useUpdateColumn`, `useDeleteColumn`, `useReorderColumns`

* * *

### `cards`

```sql
create table public.cards (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  column_id text not null references public.columns(id) on delete cascade,
  content_pillar_id text references public.content_pillars(id) on delete set null,
  title text not null default '',
  caption text not null default '',
  media_url text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

create index cards_user_column_position_idx on public.cards(user_id, column_id, position asc);
create index cards_user_pillar_idx on public.cards(user_id, content_pillar_id);
create index cards_column_idx on public.cards(column_id);

grant select, insert, update, delete on public.cards to authenticated;
grant all on public.cards to service_role;

alter table public.cards enable row level security;
create policy "cards select own" on public.cards
  for select to authenticated using (auth.uid() = user_id);
create policy "cards insert own" on public.cards
  for insert to authenticated with check (auth.uid() = user_id);
create policy "cards update own" on public.cards
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cards delete own" on public.cards
  for delete to authenticated using (auth.uid() = user_id);
```

**Purpose**: Idea cards on the Create kanban board. Each card belongs to one column. Dragging between columns updates `column_id`; dragging within a column updates `position`. Separate from `posts` — a card becomes a post when the user schedules it via the Composer modal. **Consumed by**: `useCards`, `useCreateCard`, `useUpdateCard`, `useDeleteCard`, `useReorderCards`

* * *

### `posts`

```sql
create table public.posts (
  id text primary key default gen_random_uuid()::text,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  card_id text references public.cards(id) on delete set null,
  content_pillar_id text references public.content_pillars(id) on delete set null,
  caption text not null default '',
  platforms text[] not null default '{}',
  status text not null default 'draft' check (status in ('idea','draft','scheduled','published')),
  scheduled_at timestamptz,
  published_at timestamptz,
  media_url text,
  created_at timestamptz not null default now()
);

create index posts_user_scheduled_idx on public.posts(user_id, scheduled_at asc);
create index posts_user_status_idx on public.posts(user_id, status);
create index posts_user_pillar_idx on public.posts(user_id, content_pillar_id);
create index posts_user_platforms_idx on public.posts using gin(platforms) where user_id is not null;

grant select, insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;

alter table public.posts enable row level security;
create policy "posts select own" on public.posts
  for select to authenticated using (auth.uid() = user_id);
create policy "posts insert own" on public.posts
  for insert to authenticated with check (auth.uid() = user_id);
create policy "posts update own" on public.posts
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "posts delete own" on public.posts
  for delete to authenticated using (auth.uid() = user_id);
```

**Purpose**: Scheduled and published posts displayed on the Publish calendar. `platforms` is a text array (e.g. `['instagram','linkedin']`). `card_id` links back to the originating idea card when applicable. `scheduled_at` drives calendar placement; drag-to-reschedule updates this field. **Consumed by**: `usePosts`, `useCreatePost`, `useUpdatePost`, `useDeletePost`

* * *

### `metrics`

```sql
create table public.metrics (
  id text primary key default gen_random_uuid()::text,
  post_id text not null references public.posts(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  likes int not null default 0,
  comments int not null default 0,
  shares int not null default 0,
  reach int not null default 0,
  recorded_at timestamptz not null default now()
);

create index metrics_post_idx on public.metrics(post_id);
create index metrics_user_recorded_idx on public.metrics(user_id, recorded_at desc);

grant select, insert, update, delete on public.metrics to authenticated;
grant all on public.metrics to service_role;

alter table public.metrics enable row level security;
create policy "metrics select own" on public.metrics
  for select to authenticated using (auth.uid() = user_id);
create policy "metrics insert own" on public.metrics
  for insert to authenticated with check (auth.uid() = user_id);
create policy "metrics update own" on public.metrics
  for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "metrics delete own" on public.metrics
  for delete to authenticated using (auth.uid() = user_id);
```

**Purpose**: Engagement metrics for published posts (likes, comments, shares, reach). Joined with `posts` in the list view and the Composer modal for published posts. In v1 metrics are manually seeded; a future integration would sync them from platform APIs. **Consumed by**: `usePostsWithMetrics`, `useMetrics`

* * *

## Queries

### `useContentPillars()`

**Screen**: Create (Idea Board) → card badge colors; Publish (Calendar) → tag filter dropdown; Composer modal → pillar selector **Type**: `read`**Returns**: `{ data: ContentPillar[], isLoading, error }`

```typescript
const { data } = await supabase
  .from('content_pillars')
  .select('id, name, color, position')
  .eq('user_id', user.id)
  .order('position', { ascending: true });
```

**Filter params**: none — full list always loaded **Demo source**: `seedContentPillars` from `src/data/seed.ts`

* * *

### `useColumns()`

**Screen**: Create (Idea Board) → kanban column headers **Type**: `read`**Returns**: `{ data: Column[], isLoading, error }`

```typescript
const { data } = await supabase
  .from('columns')
  .select('id, title, position')
  .eq('user_id', user.id)
  .order('position', { ascending: true });
```

**Filter params**: none **Demo source**: `seedColumns` from `src/data/seed.ts`

* * *

### `useCards(filters)`

**Screen**: Create (Idea Board) → all cards grouped by column **Type**: `read`**Returns**: `{ data: Card[], isLoading, error }`

```typescript
const { data } = await supabase
  .from('cards')
  .select('id, column_id, content_pillar_id, title, caption, media_url, position, created_at')
  .eq('user_id', user.id)
  .order('position', { ascending: true });
```

**Filter params**: `{ columnId?: string }` — when provided, scopes to a single column (used by card count aggregate per column); when absent, returns all cards for client-side grouping by `column_id`**Aggregation**: Client-side group by `column_id` to compute card count badge per column header **Demo source**: `seedCards` from `src/data/seed.ts`

* * *

### `useCreateCard()`

**Screen**: Create (Idea Board) → "+ New Idea" / Composer modal save **Type**: `optimistic-mutation`

```typescript
const { data } = await supabase
  .from('cards')
  .insert({
    user_id: user.id,
    column_id: fields.column_id,
    content_pillar_id: fields.content_pillar_id ?? null,
    title: fields.title,
    caption: fields.caption,
    media_url: fields.media_url ?? null,
    position: fields.position,
  })
  .select()
  .single();
```

**Optimistic**: Append new card to the target column in the React Query cache immediately; roll back on error with a toast "Failed to create card." **Invalidates**: `['cards', user.id]`

* * *

### `useUpdateCard()`

**Screen**: Create (Idea Board) → Composer modal edit; drag card to new column (updates `column_id`); drag card within column (updates `position`); inline column rename is handled by `useUpdateColumn`**Type**: `optimistic-mutation`

```typescript
const { data } = await supabase
  .from('cards')
  .update({
    column_id: fields.column_id,
    content_pillar_id: fields.content_pillar_id,
    title: fields.title,
    caption: fields.caption,
    media_url: fields.media_url,
    position: fields.position,
  })
  .eq('id', cardId)
  .eq('user_id', user.id)
  .select()
  .single();
```

**Optimistic**: Update card in the React Query cache immediately; roll back on error. **Invalidates**: `['cards', user.id]`

* * *

### `useDeleteCard()`

**Screen**: Create (Idea Board) → card overflow menu "Delete" **Type**: `optimistic-mutation`

```typescript
await supabase
  .from('cards')
  .delete()
  .eq('id', cardId)
  .eq('user_id', user.id);
```

**Optimistic**: Remove card from cache immediately; roll back on error with toast "Failed to delete card." **Invalidates**: `['cards', user.id]`

* * *

### `useReorderCards()`

**Screen**: Create (Idea Board) → drag card within a column (reorder), drag card between columns (cross-column move) **Type**: `optimistic-mutation`

```typescript
// Called with array of { id, column_id, position } for all affected cards after a drop
const updates = reorderedCards.map(c =>
  supabase
    .from('cards')
    .update({ column_id: c.column_id, position: c.position })
    .eq('id', c.id)
    .eq('user_id', user.id)
);
await Promise.all(updates);
```

**Optimistic**: Apply new positions to the local cache immediately; roll back the full batch on any error. **Invalidates**: `['cards', user.id]`

* * *

### `useCreateColumn()`

**Screen**: Create (Idea Board) → "+ Add column" ghost button **Type**: `optimistic-mutation`

```typescript
const { data } = await supabase
  .from('columns')
  .insert({
    user_id: user.id,
    title: fields.title,
    position: fields.position,
  })
  .select()
  .single();
```

**Optimistic**: Append new column to cache immediately; roll back on error. **Invalidates**: `['columns', user.id]`

* * *

### `useUpdateColumn()`

**Screen**: Create (Idea Board) → inline column rename (clicking column title → input → commit on Enter/blur) **Type**: `optimistic-mutation`

```typescript
await supabase
  .from('columns')
  .update({ title: fields.title })
  .eq('id', columnId)
  .eq('user_id', user.id);
```

**Optimistic**: Update column title in cache immediately; roll back on error. **Invalidates**: `['columns', user.id]`

* * *

### `useDeleteColumn()`

**Screen**: Create (Idea Board) → column overflow menu "Delete" (confirmed via `alert-dialog`) **Type**: `optimistic-mutation`

```typescript
// Cards cascade-delete via FK on delete cascade
await supabase
  .from('columns')
  .delete()
  .eq('id', columnId)
  .eq('user_id', user.id);
```

**Optimistic**: Remove column and all its cards from cache immediately; roll back on error. **Invalidates**: `['columns', user.id]`, `['cards', user.id]`

* * *

### `useReorderColumns()`

**Screen**: Create (Idea Board) → drag column headers to reorder (future; columns are draggable at v1 via the add/append flow) **Type**: `optimistic-mutation`

```typescript
const updates = reorderedColumns.map(c =>
  supabase
    .from('columns')
    .update({ position: c.position })
    .eq('id', c.id)
    .eq('user_id', user.id)
);
await Promise.all(updates);
```

**Optimistic**: Apply reordered positions to cache immediately; roll back batch on error. **Invalidates**: `['columns', user.id]`

* * *

### `useChannels()`

**Screen**: Publish (Calendar) → sidebar channel list; top-bar "All Posts" filter dropdown **Type**: `read`**Returns**: `{ data: Channel[], isLoading, error }`

```typescript
const { data } = await supabase
  .from('channels')
  .select('id, platform, handle, connected_at')
  .eq('user_id', user.id)
  .order('connected_at', { ascending: true });
```

**Filter params**: none — full list always loaded **Demo source**: `seedChannels` from `src/data/seed.ts`

* * *

### `usePosts(filters)`

**Screen**: Publish (Calendar) → week view, month view, list view **Type**: `read`**Returns**: `{ data: Post[], isLoading, error }`

```typescript
let query = supabase
  .from('posts')
  .select('id, card_id, content_pillar_id, caption, platforms, status, scheduled_at, published_at, media_url, created_at')
  .eq('user_id', user.id)
  .gte('scheduled_at', filters.rangeStart)
  .lte('scheduled_at', filters.rangeEnd)
  .order('scheduled_at', { ascending: true });

if (filters.platform) {
  query = query.contains('platforms', [filters.platform]);
}
if (filters.contentPillarId) {
  query = query.eq('content_pillar_id', filters.contentPillarId);
}
if (filters.status) {
  query = query.eq('status', filters.status);
}
```

**Filter params**: `{ rangeStart: string, rangeEnd: string, platform?: string, contentPillarId?: string, status?: string }`

- `rangeStart` / `rangeEnd`: ISO timestamps defining the current week or month window
- `platform`: single platform string — matches against the `platforms` array column using `contains`
- `contentPillarId`: filters by tag
- `status`: filters by post status **Demo source**: `seedPosts` from `src/data/seed.ts`

* * *

### `usePostsWithMetrics(filters)`

**Screen**: Publish (Calendar) → list view (published posts row shows engagement metrics) **Type**: `read`**Returns**: `{ data: PostWithMetrics[], isLoading, error }`

```typescript
const { data } = await supabase
  .from('posts')
  .select(`
    id, card_id, content_pillar_id, caption, platforms, status,
    scheduled_at, published_at, media_url, created_at,
    metrics (likes, comments, shares, reach, recorded_at)
  `)
  .eq('user_id', user.id)
  .gte('scheduled_at', filters.rangeStart)
  .lte('scheduled_at', filters.rangeEnd)
  .order('scheduled_at', { ascending: filters.sortAsc ?? true });

// Client-side: apply platform / pillar / status filters from filter params
```

**Filter params**: `{ rangeStart: string, rangeEnd: string, platform?: string, contentPillarId?: string, status?: string, sortAsc?: boolean }`**Demo source**: `seedPostsWithMetrics` from `src/data/seed.ts`

* * *

### `useCreatePost()`

**Screen**: Publish (Calendar) → Composer modal "Schedule" / "Save draft" / "Publish now"; Create (Idea Board) → Composer modal "Schedule" action **Type**: `optimistic-mutation`

```typescript
const { data } = await supabase
  .from('posts')
  .insert({
    user_id: user.id,
    card_id: fields.card_id ?? null,
    content_pillar_id: fields.content_pillar_id ?? null,
    caption: fields.caption,
    platforms: fields.platforms,
    status: fields.status,
    scheduled_at: fields.scheduled_at ?? null,
    published_at: fields.published_at ?? null,
    media_url: fields.media_url ?? null,
  })
  .select()
  .single();
```

**Optimistic**: Insert new post into cache for the current range; roll back on error with toast "Failed to create post." **Invalidates**: `['posts', user.id]`

* * *

### `useUpdatePost()`

**Screen**: Publish (Calendar) → Composer modal edit; drag card to new time slot / date (updates `scheduled_at`) **Type**: `optimistic-mutation`

```typescript
const { data } = await supabase
  .from('posts')
  .update({
    content_pillar_id: fields.content_pillar_id,
    caption: fields.caption,
    platforms: fields.platforms,
    status: fields.status,
    scheduled_at: fields.scheduled_at,
    published_at: fields.published_at,
    media_url: fields.media_url,
  })
  .eq('id', postId)
  .eq('user_id', user.id)
  .select()
  .single();
```

**Optimistic**: Update post in cache immediately; roll back on error. For drag-to-reschedule, the card snaps back to its original slot on failure. **Invalidates**: `['posts', user.id]`

* * *

### `useDeletePost()`

**Screen**: Publish (Calendar) → post card overflow menu "Delete" (confirmed via `alert-dialog`) **Type**: `optimistic-mutation`

```typescript
await supabase
  .from('posts')
  .delete()
  .eq('id', postId)
  .eq('user_id', user.id);
```

**Optimistic**: Remove post from cache immediately; roll back on error. **Invalidates**: `['posts', user.id]`

* * *

### `useMetrics(postId)`

**Screen**: Publish (Calendar) → Composer modal for published posts (read-only engagement display) **Type**: `read`**Returns**: `{ data: Metrics | null, isLoading, error }`

```typescript
const { data } = await supabase
  .from('metrics')
  .select('likes, comments, shares, reach, recorded_at')
  .eq('post_id', postId)
  .order('recorded_at', { ascending: false })
  .limit(1)
  .maybeSingle();
```

**Filter params**: `{ postId: string }` — single post lookup **Demo source**: `seedMetrics` from `src/data/seed.ts`

* * *

## Data Provider

```
/demo/*  →  SeedDataProvider  (reads from src/data/seed.ts — public demo; writes show "Sign in to save" toast)
/*       →  SupabaseDataProvider  (reads from Supabase via hooks, writes are real mutations)
```

**Switch point**: `App.tsx` route tree — `/demo/*` routes are wrapped in `SeedDataProvider`; all other authenticated routes are wrapped in `SupabaseDataProvider`.

**Provider interface**:

```typescript
interface ContentCalendarDataProvider {
  // Reference / static lists
  useContentPillars(): { data: ContentPillar[]; isLoading: boolean };
  useColumns(): { data: Column[]; isLoading: boolean };
  useChannels(): { data: Channel[]; isLoading: boolean };

  // Cards (Create board)
  useCards(filters: CardFilters): { data: Card[]; isLoading: boolean };
  useCreateCard(): { mutate: (input: CreateCardInput) => void };
  useUpdateCard(): { mutate: (id: string, input: UpdateCardInput) => void };
  useDeleteCard(): { mutate: (id: string) => void };
  useReorderCards(): { mutate: (updates: ReorderCardInput[]) => void };

  // Columns (Create board)
  useCreateColumn(): { mutate: (input: CreateColumnInput) => void };
  useUpdateColumn(): { mutate: (id: string, input: UpdateColumnInput) => void };
  useDeleteColumn(): { mutate: (id: string) => void };
  useReorderColumns(): { mutate: (updates: ReorderColumnInput[]) => void };

  // Posts (Publish calendar)
  usePosts(filters: PostFilters): { data: Post[]; isLoading: boolean };
  usePostsWithMetrics(filters: PostFilters): { data: PostWithMetrics[]; isLoading: boolean };
  useCreatePost(): { mutate: (input: CreatePostInput) => void };
  useUpdatePost(): { mutate: (id: string, input: UpdatePostInput) => void };
  useDeletePost(): { mutate: (id: string) => void };

  // Metrics (Composer modal — published posts)
  useMetrics(postId: string): { data: Metrics | null; isLoading: boolean };
}
```

**Both providers filter identically.** The SeedDataProvider applies every filter in-memory so the demo is a faithful representation of the authenticated product.

```typescript
// ❌ Wrong — ignores filters, calendar never updates
usePosts: (_filters) => ok(seed.seedPosts),

// ✅ Correct — filters seed data by date range, platform, pillar, status
usePosts: (filters) => ok(
  seed.seedPosts.filter(p => {
    const at = new Date(p.scheduled_at ?? p.created_at);
    const inRange = at >= new Date(filters.rangeStart) && at <= new Date(filters.rangeEnd);
    const matchesPlatform = !filters.platform || p.platforms.includes(filters.platform);
    const matchesPillar = !filters.contentPillarId || p.content_pillar_id === filters.contentPillarId;
    const matchesStatus = !filters.status || p.status === filters.status;
    return inRange && matchesPlatform && matchesPillar && matchesStatus;
  }).sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())
),
```

**Seed filter manifest:**

| Hook | Seed array | Filter field | Sort / group |
| --- | --- | --- | --- |
| `useContentPillars` | `seedContentPillars` | none (static reference data) | `position` asc |
| `useColumns` | `seedColumns` | none (static reference data) | `position` asc |
| `useChannels` | `seedChannels` | none (static reference data) | `connected_at` asc |
| `useCards` | `seedCards` | `column_id` = columnId (optional — when absent, return all; group client-side by `column_id`) | `position` asc within each group |
| `usePosts` | `seedPosts` | `scheduled_at` ∈ [rangeStart, rangeEnd], `platforms` contains platform, `content_pillar_id` = contentPillarId, `status` = status | `scheduled_at` asc |
| `usePostsWithMetrics` | `seedPostsWithMetrics` | `scheduled_at` ∈ [rangeStart, rangeEnd], `platforms` contains platform, `content_pillar_id` = contentPillarId, `status` = status | `scheduled_at` asc or desc based on `sortAsc` |
| `useMetrics` | `seedMetrics` | `post_id` = postId (single entity lookup) | n/a |

* * *

## Auth

### Providers

| Provider | Method | Lovable Cloud setup |
| --- | --- | --- |
| Google | `lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin })` | `supabase--configure_social_auth` with `providers: ["google"]` — generates `@lovable.dev/cloud-auth-js` client |
| Apple | `lovable.auth.signInWithOAuth('apple', { redirect_uri: window.location.origin })` | same call with `providers: ["google", "apple"]` |
| Email | `supabase.auth.signUp({ email, password, options: { data: { full_name } } })` / `supabase.auth.signInWithPassword({ email, password })` | email confirmation required (do NOT auto-confirm) |

**Important**: OAuth MUST use `lovable.auth.signInWithOAuth()` from `@/integrations/lovable/index`, NOT `supabase.auth.signInWithOAuth()`. Email/password auth stays on `supabase.auth` directly.

### Screens

#### Sign In (`/sign-in`)

- Google OAuth button (full-width outline) + Apple OAuth button — both call `lovable.auth.signInWithOAuth`
- "or" separator
- Email `input` + Password `input` with inline "Forgot?" link
- "Sign in" primary button → `supabase.auth.signInWithPassword` → on success navigate to `/create`
- Forgot password: `supabase.auth.resetPasswordForEmail(email)` → in-place "Check your email" message replaces form
- "No account? Sign up" → `/sign-up`
- "Try demo →" → `/demo/create`
- "← Back to home" → `/`
- Error states: "Invalid email or password", "Email not confirmed — check your inbox", network error toast

#### Sign Up (`/sign-up`)

- Same OAuth buttons
- Full name `input`, Email `input`, Password `input` (min 8 chars)
- "Create account" primary button → `supabase.auth.signUp` → on success, form replaced in-place with "Check your email — we sent a confirmation link to [email]"
- "Already have an account? Sign in →" → `/sign-in`
- "← Back to home" → `/`
- Error states: "Email already registered", "Password must be at least 8 characters", network error toast

### Route protection

| Route | Access | Notes |
| --- | --- | --- |
| `/` | public | landing page |
| `/sign-in` | public | redirects to `/create` if already authenticated |
| `/sign-up` | public | redirects to `/create` if already authenticated |
| `/demo/create` | public | seed data, no auth required |
| `/demo/publish` | public | seed data, no auth required |
| `/create` | **protected** | redirects to `/sign-in` with `from` state |
| `/publish` | **protected** | redirects to `/sign-in` with `from` state |

### Sign out

- Sidebar footer: "Sign out" → `supabase.auth.signOut()` → clear React Query cache → navigate to `/`

### Auth provider component

```typescript
// AuthProvider wraps the app, exposes { user, session, loading, signOut }
// Registers onAuthStateChange listener BEFORE calling getSession()
// to avoid missing the initial SIGNED_IN event.
// On SIGNED_IN: navigate to `from` state or `/create` (default).
// On SIGNED_OUT: clear React Query cache, navigate to `/`.
```

* * *

## Seed Strategy

### Demo seed data (`src/data/seed.ts`)

Used ONLY on `/demo/*` routes via `SeedDataProvider`. Not seeded into real user accounts.

#### `seedContentPillars`

```typescript
export const seedContentPillars: ContentPillar[] = [
  { id: 'pillar-1', user_id: 'demo', name: 'Content & Marketing', color: '#7C3AED', position: 0, created_at: '2025-01-15T00:00:00Z' },
  { id: 'pillar-2', user_id: 'demo', name: 'Product Updates',     color: '#2563EB', position: 1, created_at: '2025-01-15T00:00:00Z' },
  { id: 'pillar-3', user_id: 'demo', name: 'Behind the Scenes',   color: '#059669', position: 2, created_at: '2025-01-15T00:00:00Z' },
  { id: 'pillar-4', user_id: 'demo', name: 'Community',           color: '#D97706', position: 3, created_at: '2025-01-15T00:00:00Z' },
];
```

#### `seedColumns`

```typescript
export const seedColumns: Column[] = [
  { id: 'col-1', user_id: 'demo', title: 'Unassigned',   position: 0, created_at: '2025-01-15T00:00:00Z' },
  { id: 'col-2', user_id: 'demo', title: 'Inspiration',  position: 1, created_at: '2025-01-15T00:00:00Z' },
  { id: 'col-3', user_id: 'demo', title: 'To-do',        position: 2, created_at: '2025-01-15T00:00:00Z' },
  { id: 'col-4', user_id: 'demo', title: 'In Progress',  position: 3, created_at: '2025-01-15T00:00:00Z' },
  { id: 'col-5', user_id: 'demo', title: 'Repurpose',    position: 4, created_at: '2025-01-15T00:00:00Z' },
];
```

#### `seedCards`

15 cards, 3 per column, ordered by `position`. Each has `id`, `column_id`, `content_pillar_id`, `title`, `caption`, `media_url` (nullable), `position`, `created_at`.

```typescript
export const seedCards: Card[] = [
  // Unassigned (col-1)
  { id: 'card-1',  column_id: 'col-1', content_pillar_id: 'pillar-4', title: 'Remote Work Tips for Distributed Teams',         caption: "Here's what we've learned after 3 years of fully remote — the tools, the rituals, and the mindset shifts that actually work.", media_url: null, position: 0, user_id: 'demo', created_at: '2025-03-10T09:00:00Z' },
  { id: 'card-2',  column_id: 'col-1', content_pillar_id: 'pillar-2', title: 'Q1 Hiring Update — We\'re Growing',              caption: 'We just opened 5 new roles across engineering and marketing. Here\'s what we\'re looking for and why now is the right time.', media_url: null, position: 1, user_id: 'demo', created_at: '2025-03-12T10:00:00Z' },
  { id: 'card-3',  column_id: 'col-1', content_pillar_id: 'pillar-1', title: 'Content Pillars 101: How We Organize Our Ideas',  caption: 'Before we had a content calendar, our posts were random. Here\'s the simple framework that changed everything.', media_url: null, position: 2, user_id: 'demo', created_at: '2025-03-14T11:00:00Z' },
  // Inspiration (col-2)
  { id: 'card-4',  column_id: 'col-2', content_pillar_id: 'pillar-1', title: '5 Ways to Stay Focused When Working from Home',   caption: "Spoiler: it's not about the standing desk. It's about the systems you build around your calendar and your energy.", media_url: null, position: 0, user_id: 'demo', created_at: '2025-03-15T09:00:00Z' },
  { id: 'card-5',  column_id: 'col-2', content_pillar_id: 'pillar-3', title: 'Why We Hired Async-First',                        caption: 'We stopped doing daily standups in 2022. Here\'s what happened to our output, our morale, and our Slack pings.', media_url: null, position: 1, user_id: 'demo', created_at: '2025-03-16T10:00:00Z' },
  { id: 'card-6',  column_id: 'col-2', content_pillar_id: 'pillar-4', title: 'Community Spotlight: March',                      caption: 'This month we\'re highlighting three members who shipped incredible projects using nothing but a laptop and good taste.', media_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', position: 2, user_id: 'demo', created_at: '2025-03-17T11:00:00Z' },
  // To-do (col-3)
  { id: 'card-7',  column_id: 'col-3', content_pillar_id: 'pillar-3', title: 'Behind the Scenes: Team Offsite Recap',            caption: 'We took the whole team to Lisbon for a week. Rooftop dinners, whiteboard sessions, and one very important team decision.', media_url: 'https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?w=400', position: 0, user_id: 'demo', created_at: '2025-03-18T09:00:00Z' },
  { id: 'card-8',  column_id: 'col-3', content_pillar_id: 'pillar-2', title: 'Product Update: Spring Launch Preview',             caption: "Here's a sneak peek at what's shipping in April — including the feature our beta users have been asking for since day one.", media_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', position: 1, user_id: 'demo', created_at: '2025-03-19T10:00:00Z' },
  { id: 'card-9',  column_id: 'col-3', content_pillar_id: 'pillar-1', title: 'The Content Pillars Framework We Use Internally',  caption: 'Four categories, infinite ideas. This is the exact system our content team uses to never run out of things to post.', media_url: null, position: 2, user_id: 'demo', created_at: '2025-03-20T11:00:00Z' },
  // In Progress (col-4)
  { id: 'card-10', column_id: 'col-4', content_pillar_id: 'pillar-1', title: 'How We Built Our Content Calendar (And What We Learned)', caption: 'We tried spreadsheets. We tried Notion. We tried Airtable. Here\'s what finally worked — and what we\'d tell our past selves.', media_url: null, position: 0, user_id: 'demo', created_at: '2025-03-21T09:00:00Z' },
  { id: 'card-11', column_id: 'col-4', content_pillar_id: 'pillar-3', title: 'TikTok Series: Day in the Life',                   caption: 'Episode 4 of our behind-the-scenes series. This week: what a Tuesday looks like for our head of design.', media_url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400', position: 1, user_id: 'demo', created_at: '2025-03-22T10:00:00Z' },
  { id: 'card-12', column_id: 'col-4', content_pillar_id: 'pillar-2', title: 'April Platform Roundup: What Changed This Month',  caption: "Every major social platform made at least one significant change in March. Here's what actually matters for your content strategy.", media_url: null, position: 2, user_id: 'demo', created_at: '2025-03-23T11:00:00Z' },
  // Repurpose (col-5)
  { id: 'card-13', column_id: 'col-5', content_pillar_id: 'pillar-1', title: 'Repurpose: Q4 2023 Blog Post → LinkedIn Carousel', caption: "Our highest-traffic post of last year. Time to turn it into a 10-slide carousel with updated stats and a new hook.", media_url: null, position: 0, user_id: 'demo', created_at: '2025-03-24T09:00:00Z' },
  { id: 'card-14', column_id: 'col-5', content_pillar_id: 'pillar-4', title: 'Repurpose: Podcast Episode 12 → 5 Twitter Threads', caption: "Episode 12 hit 8k listens. The five biggest ideas from that conversation deserve their own moment on X.", media_url: null, position: 1, user_id: 'demo', created_at: '2025-03-25T10:00:00Z' },
  { id: 'card-15', column_id: 'col-5', content_pillar_id: 'pillar-2', title: 'Repurpose: Case Study → Instagram Story Series',   caption: 'Three-part story series based on our Meridian case study. Part 1: the problem. Part 2: the solution. Part 3: the results.', media_url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400', position: 2, user_id: 'demo', created_at: '2025-03-26T11:00:00Z' },
];
```

#### `seedChannels`

```typescript
export const seedChannels: Channel[] = [
  { id: 'ch-1', user_id: 'demo', platform: 'instagram', handle: '@stackform_ig',  connected_at: '2025-01-15T00:00:00Z', created_at: '2025-01-15T00:00:00Z' },
  { id: 'ch-2', user_id: 'demo', platform: 'linkedin',  handle: '@Stackform',     connected_at: '2025-01-15T00:00:00Z', created_at: '2025-01-15T00:00:00Z' },
  { id: 'ch-3', user_id: 'demo', platform: 'x',         handle: '@stackform',     connected_at: '2025-01-15T00:00:00Z', created_at: '2025-01-15T00:00:00Z' },
  { id: 'ch-4', user_id: 'demo', platform: 'tiktok',    handle: '@stackform.tk',  connected_at: '2025-01-15T00:00:00Z', created_at: '2025-01-15T00:00:00Z' },
];
```

#### `seedPosts`

10 scheduled posts across Apr 7–13, 2025 + 3 published posts from prior week.

```typescript
export const seedPosts: Post[] = [
  // Scheduled — current week Apr 7–13 2025
  { id: 'post-1',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-2', caption: "We just opened 5 new engineering roles — and we're looking for people who care as much about craft as output. Here's what we value and how to apply.",                                   platforms: ['linkedin'],             status: 'scheduled', scheduled_at: '2025-04-07T10:00:00Z', published_at: null, media_url: null,                                                                     created_at: '2025-04-01T09:00:00Z' },
  { id: 'post-2',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-1', caption: 'Remote work tip #14: async standups changed everything for us. No more "let me find that in my notes." Just a shared doc, three questions, and 20 minutes saved every morning.',           platforms: ['instagram','linkedin'], status: 'scheduled', scheduled_at: '2025-04-07T13:00:00Z', published_at: null, media_url: null,                                                                     created_at: '2025-04-01T09:30:00Z' },
  { id: 'post-3',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-3', caption: 'Day in the life: our design team\'s Monday morning ritual [TikTok series ep. 3] — sticky notes, Figma, and one very opinionated espresso machine.',                                        platforms: ['tiktok'],              status: 'scheduled', scheduled_at: '2025-04-08T11:00:00Z', published_at: null, media_url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400', created_at: '2025-04-01T10:00:00Z' },
  { id: 'post-4',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-2', caption: 'Q1 product highlights — here\'s everything we shipped in 3 months: drag-and-drop scheduling, content pillar tags, multi-platform composer, and a calendar that actually makes sense.',       platforms: ['instagram'],           status: 'scheduled', scheduled_at: '2025-04-09T09:00:00Z', published_at: null, media_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', created_at: '2025-04-01T10:30:00Z' },
  { id: 'post-5',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-4', caption: 'Our community hit 10,000 members this week. We started this as a small Slack group for early users. Now it\'s a movement. Here\'s a thank you thread 🧵',                                  platforms: ['tiktok'],              status: 'scheduled', scheduled_at: '2025-04-09T13:00:00Z', published_at: null, media_url: null,                                                                     created_at: '2025-04-01T11:00:00Z' },
  { id: 'post-6',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-1', caption: 'The content calendar framework our team uses — now open-sourced. Fork it, adapt it, make it yours. Link in bio.',                                                                          platforms: ['x'],                   status: 'scheduled', scheduled_at: '2025-04-10T10:00:00Z', published_at: null, media_url: null,                                                                     created_at: '2025-04-02T09:00:00Z' },
  { id: 'post-7',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-3', caption: 'Behind the scenes: how we ran our team offsite in Lisbon on a $15k budget — flights, accommodation, workshops, and one unforgettable rooftop dinner included.',                            platforms: ['x'],                   status: 'scheduled', scheduled_at: '2025-04-10T14:00:00Z', published_at: null, media_url: 'https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?w=400', created_at: '2025-04-02T09:30:00Z' },
  { id: 'post-8',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-2', caption: 'Spring launch preview — sneak peek at what\'s shipping in April. We\'ve been building this for 6 months and we can\'t wait to show you. Stay tuned.',                                      platforms: ['linkedin'],            status: 'scheduled', scheduled_at: '2025-04-11T11:00:00Z', published_at: null, media_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', created_at: '2025-04-02T10:00:00Z' },
  { id: 'post-9',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-4', caption: 'Community AMA recap — you asked 47 questions in 60 minutes. Here are the 10 answers that sparked the most conversation.',                                                                   platforms: ['instagram','linkedin'], status: 'scheduled', scheduled_at: '2025-04-12T10:00:00Z', published_at: null, media_url: null,                                                                     created_at: '2025-04-02T10:30:00Z' },
  { id: 'post-10', user_id: 'demo', card_id: null, content_pillar_id: 'pillar-1', caption: 'Five content formats that consistently outperform everything else on LinkedIn — and the one metric that tells you which to use for your audience.',                                          platforms: ['linkedin'],            status: 'scheduled', scheduled_at: '2025-04-13T09:00:00Z', published_at: null, media_url: null,                                                                     created_at: '2025-04-02T11:00:00Z' },
  // Published — prior week (metrics attached separately in seedMetrics)
  { id: 'post-11', user_id: 'demo', card_id: null, content_pillar_id: 'pillar-1', caption: "Here's how we 3x'd our LinkedIn engagement in 60 days — no paid promotion, no viral gimmicks. Just a consistent content pillar strategy and a willingness to share what we actually know.", platforms: ['linkedin'],            status: 'published', scheduled_at: '2025-03-31T09:00:00Z', published_at: '2025-03-31T09:00:00Z', media_url: null,                                                         created_at: '2025-03-28T09:00:00Z' },
  { id: 'post-12', user_id: 'demo', card_id: null, content_pillar_id: 'pillar-3', caption: "Meet the team: our new Head of Growth joins us from Stripe. She's already made three changes to our content strategy and we're here for all of them.",                                      platforms: ['instagram'],           status: 'published', scheduled_at: '2025-04-01T11:00:00Z', published_at: '2025-04-01T11:00:00Z', media_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', created_at: '2025-03-28T10:00:00Z' },
  { id: 'post-13', user_id: 'demo', card_id: null, content_pillar_id: 'pillar-2', caption: 'Product update: drag-and-drop scheduling is live. Drop a post anywhere on the calendar. Reschedule by dragging. No forms, no friction. Available to all users now.',                        platforms: ['x','linkedin'],        status: 'published', scheduled_at: '2025-04-03T14:00:00Z', published_at: '2025-04-03T14:00:00Z', media_url: null,                                                         created_at: '2025-03-28T11:00:00Z' },
];
```

#### `seedMetrics`

```typescript
export const seedMetrics: Metrics[] = [
  { id: 'metric-1', post_id: 'post-11', user_id: 'demo', likes: 248, comments: 31, shares: 14, reach: 4200,  recorded_at: '2025-04-01T12:00:00Z' },
  { id: 'metric-2', post_id: 'post-12', user_id: 'demo', likes: 412, comments: 57, shares: 8,  reach: 6100,  recorded_at: '2025-04-02T12:00:00Z' },
  { id: 'metric-3', post_id: 'post-13', user_id: 'demo', likes: 89,  comments: 12, shares: 33, reach: 2800,  recorded_at: '2025-04-04T12:00:00Z' },
];

// Convenience join used by usePostsWithMetrics in SeedDataProvider
export const seedPostsWithMetrics: PostWithMetrics[] = seedPosts.map(p => ({
  ...p,
  metrics: seedMetrics.find(m => m.post_id === p.id) ?? null,
}));
```

### First-run experience (real users)

Real users start with an **empty workspace** — no seeded data. First-run is **creation-first**: users create ideas and posts manually.

`handle_new_user()` **behavior**:

1. Creates `profiles` row
2. Seeds 4 default `content_pillars` (same names and colors as demo seed — these are reference data, not demo content)
3. Does NOT create any columns, cards, or posts

First-run empty state on `/create`: floating card "Add your first idea" with "+ New Idea" CTA. First-run empty state on `/publish`: floating card "Nothing scheduled yet — create an idea or compose a new post."

### `handle_new_user()` trigger

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $
declare
  v_full_name text;
  v_initials  text;
begin
  v_full_name := coalesce(new.raw_user_meta_data->>'full_name', '');
  v_initials  := upper(left(v_full_name, 1));

  -- Create user profile
  insert into public.profiles (id, full_name, initials)
  values (new.id, v_full_name, v_initials);

  -- Seed default content pillars (reference data — same for every user)
  insert into public.content_pillars (user_id, name, color, position) values
    (new.id, 'Content & Marketing', '#7C3AED', 0),
    (new.id, 'Product Updates',     '#2563EB', 1),
    (new.id, 'Behind the Scenes',   '#059669', 2),
    (new.id, 'Community',           '#D97706', 3);

  -- Seed default kanban columns so the Create board renders immediately
  insert into public.columns (user_id, title, position) values
    (new.id, 'Unassigned',   0),
    (new.id, 'Inspiration',  1),
    (new.id, 'To-do',        2),
    (new.id, 'In Progress',  3),
    (new.id, 'Repurpose',    4);

  return new;
end;
$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

revoke execute on function public.handle_new_user() from public, anon, authenticated;
```

* * *

## Integrations

### Social platform publishing — `self-contained` (v1)

**Required for**: Composer modal "Publish now" action; post status transitions to `published`**Type**: `self-contained` in v1 — no external API keys required. "Publish now" sets `status = 'published'` and `published_at = now()` in the `posts` table. Actual cross-posting to Instagram / LinkedIn / X / TikTok is a future edge function integration. **When connected (future v2)**: Edge Function per platform called on "Publish now" — sends the post via each platform's API, then updates `posts.status` to `published`. **When NOT connected (v1 behavior)**:

- "Publish now" marks the post as published in the database; the post card shows a green "Published" badge
- No external API call is made
- The Composer modal footer shows no warning — this is expected v1 behavior, not an error state
- List view shows engagement metrics as `0` for freshly "published" posts until metrics are manually entered or a future sync runs

### Media uploads — `self-contained` via Supabase Storage

**Required for**: Composer modal media attachment; card thumbnail on Create board **Type**: `self-contained` — Supabase Storage bucket, no external service needed **Storage bucket**: `post-media` (public bucket, authenticated upload, public read)

```sql
-- Run in Supabase dashboard Storage policies
insert into storage.buckets (id, name, public) values ('post-media', 'post-media', true);

create policy "post-media upload own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'post-media' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "post-media select own" on storage.objects
  for select to authenticated
  using (bucket_id = 'post-media' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "post-media public read" on storage.objects
  for select to anon
  using (bucket_id = 'post-media');

create policy "post-media delete own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'post-media' and auth.uid()::text = (storage.foldername(name))[1]);
```

**Upload path**: `{user_id}/{post_id_or_card_id}-{filename}`**When NOT connected**: Storage is always available via Lovable Cloud — no degraded state. Demo mode shows seed `media_url` values pointing to Unsplash images; upload affordance in demo mode shows "Sign in to attach media" toast.

### Channel connections (OAuth to social platforms) — `oauth-connection` (future)

**Required for**: "+ Connect channel" button in Publish sidebar **Type**: `oauth-connection` — not implemented in v1 **When NOT connected (v1)**:

- Sidebar shows the 4 seed channels (or real channels added manually)
- "+ Connect channel" button shows a `sonner` toast: "Channel connections coming soon"
- The calendar fully functions with manually-created posts regardless of channel connection status **OAuth details (v2 spec)**:
- Scopes: platform-specific (Instagram: `instagram_basic`, `pages_manage_posts`; LinkedIn: `w_member_social`; X: `tweet.write`; TikTok: `video.publish`)
- Storage: `channels` table extended with `access_token text`, `refresh_token text`, `expires_at timestamptz`, `scopes text[]`
- Connect UI: "Connect {Platform}" → Supabase Edge Function initiates OAuth → callback stores tokens → channel row updated with tokens → sidebar shows "Connected ✓"
- Token refresh: Edge Function checks `expires_at` before each publish call, refreshes if needed
- Disconnect: nullify token columns in `channels`, optionally revoke via platform API