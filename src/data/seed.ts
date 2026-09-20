export interface ContentPillar {
  id: string;
  user_id: string;
  name: string;
  color: string;
  position: number;
  created_at: string;
}

export interface Column {
  id: string;
  user_id: string;
  title: string;
  position: number;
  created_at: string;
}

export interface Card {
  id: string;
  user_id: string;
  column_id: string;
  content_pillar_id: string | null;
  title: string;
  caption: string;
  platforms?: string[];
  media_url: string | null;
  position: number;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  card_id: string | null;
  content_pillar_id: string | null;
  caption: string;
  platforms: string[];
  status: string;
  scheduled_at: string | null;
  published_at: string | null;
  media_url: string | null;
  created_at: string;
}

export interface Metrics {
  id: string;
  post_id: string;
  user_id: string;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  recorded_at: string;
}

export interface PostWithMetrics extends Post {
  metrics: Metrics | null;
}

export const seedContentPillars: ContentPillar[] = [
  { id: 'pillar-1', user_id: 'demo', name: 'Content & Marketing', color: '#7C3AED', position: 0, created_at: '2025-01-15T00:00:00Z' },
  { id: 'pillar-2', user_id: 'demo', name: 'Product Updates',     color: '#2563EB', position: 1, created_at: '2025-01-15T00:00:00Z' },
  { id: 'pillar-3', user_id: 'demo', name: 'Behind the Scenes',   color: '#059669', position: 2, created_at: '2025-01-15T00:00:00Z' },
  { id: 'pillar-4', user_id: 'demo', name: 'Community',           color: '#D97706', position: 3, created_at: '2025-01-15T00:00:00Z' },
];

export const seedColumns: Column[] = [
  { id: 'col-1', user_id: 'demo', title: 'Unassigned',   position: 0, created_at: '2025-01-15T00:00:00Z' },
  { id: 'col-2', user_id: 'demo', title: 'Inspiration',  position: 1, created_at: '2025-01-15T00:00:00Z' },
  { id: 'col-3', user_id: 'demo', title: 'To-do',        position: 2, created_at: '2025-01-15T00:00:00Z' },
  { id: 'col-4', user_id: 'demo', title: 'In Progress',  position: 3, created_at: '2025-01-15T00:00:00Z' },
  { id: 'col-5', user_id: 'demo', title: 'Repurpose',    position: 4, created_at: '2025-01-15T00:00:00Z' },
];

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
  { id: 'card-8',  column_id: 'col-3', content_pillar_id: 'pillar-2', title: 'Product Update: Spring Launch Preview',            caption: "Here's a sneak peek at what's shipping in April — including the feature our beta users have been asking for since day one.", media_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', position: 1, user_id: 'demo', created_at: '2025-03-19T10:00:00Z' },
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

export const seedPosts: Post[] = [
  // Published — prior week (Jun 29 – Jul 3, 2026)
  { id: 'post-1',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-1', caption: "Weekly tips thread: five ways we cut our content production time in half — without dropping quality or hiring more people.",                                                                  platforms: ['x'],                     status: 'published', scheduled_at: '2026-06-29T10:00:00Z', published_at: '2026-06-29T10:00:00Z', media_url: null,                                                                     created_at: '2026-06-26T09:00:00Z' },
  { id: 'post-2',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-3', caption: "Behind the scenes at our Wednesday content review — how we critique every draft before it ships, and why nothing goes out without three sets of eyes on it.",                                platforms: ['instagram'],             status: 'published', scheduled_at: '2026-07-04T11:00:00Z', published_at: '2026-07-04T11:00:00Z', media_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', created_at: '2026-06-27T10:00:00Z' },
  { id: 'post-3',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-4', caption: "Customer spotlight: how Meridian Studio grew their newsletter from 400 to 12,000 subscribers in eight months using a single content pillar strategy.",                                     platforms: ['linkedin'],              status: 'published', scheduled_at: '2026-07-05T14:00:00Z', published_at: '2026-07-05T14:00:00Z', media_url: null,                                                                     created_at: '2026-06-28T11:00:00Z' },

  // Draft — current week
  { id: 'post-4',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-1', caption: "Content pillars 101 — the four-bucket framework we use to plan an entire quarter of posts in a single afternoon.",                                                                          platforms: ['linkedin'],              status: 'draft',     scheduled_at: null,                    published_at: null,                    media_url: null,                                                                     created_at: '2026-07-02T09:00:00Z' },
  { id: 'post-5',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-3', caption: "Day in the life of a solo content creator — the tools, the routines, and the one habit that changed everything about how we ship.",                                                        platforms: ['tiktok'],                status: 'draft',     scheduled_at: null,                    published_at: null,                    media_url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400', created_at: '2026-07-03T10:00:00Z' },

  // Scheduled — current week (Jul 6–12, 2026)
  { id: 'post-6',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-2', caption: "Product launch announcement — after six months of building, our new analytics dashboard is live. Track every post, every platform, every metric in one place.",                             platforms: ['linkedin', 'x'],         status: 'scheduled', scheduled_at: '2026-07-06T10:00:00Z', published_at: null,                    media_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', created_at: '2026-07-02T09:30:00Z' },
  { id: 'post-7',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-1', caption: "Weekly tips thread: three underrated LinkedIn formats that consistently outperform everything else — and how to know which one fits your audience.",                                        platforms: ['linkedin'],              status: 'scheduled', scheduled_at: '2026-07-07T13:00:00Z', published_at: null,                    media_url: null,                                                                     created_at: '2026-07-02T10:00:00Z' },
  { id: 'post-8',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-3', caption: "Behind the scenes of our team offsite in Porto — rooftop dinners, whiteboard sessions, and the one decision that will shape the rest of our year.",                                       platforms: ['instagram', 'tiktok'],   status: 'scheduled', scheduled_at: '2026-07-08T11:00:00Z', published_at: null,                    media_url: 'https://images.unsplash.com/photo-1513530534585-c7b1394c6d51?w=400', created_at: '2026-07-03T09:00:00Z' },
  { id: 'post-9',  user_id: 'demo', card_id: null, content_pillar_id: 'pillar-4', caption: "Customer spotlight: how Northwind Coffee turned a Tuesday-only promotion into their highest-traffic day of the week using scheduled Instagram Stories.",                                  platforms: ['instagram'],             status: 'scheduled', scheduled_at: '2026-07-10T09:00:00Z', published_at: null,                    media_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400', created_at: '2026-07-03T10:30:00Z' },

  // Scheduled — next week (Jul 13–19, 2026)
  { id: 'post-10', user_id: 'demo', card_id: null, content_pillar_id: 'pillar-2', caption: "Product launch announcement, part two: automations. Set a rule once, let it run forever. Our most-requested feature is finally here.",                                                       platforms: ['x'],                     status: 'scheduled', scheduled_at: '2026-07-13T10:00:00Z', published_at: null,                    media_url: null,                                                                     created_at: '2026-07-04T09:00:00Z' },
  { id: 'post-11', user_id: 'demo', card_id: null, content_pillar_id: 'pillar-1', caption: "Weekly tips thread: how to turn one long-form blog post into a full week of social content — with a repeatable checklist you can steal.",                                                    platforms: ['linkedin', 'x'],         status: 'scheduled', scheduled_at: '2026-07-14T14:00:00Z', published_at: null,                    media_url: null,                                                                     created_at: '2026-07-04T09:30:00Z' },
  { id: 'post-12', user_id: 'demo', card_id: null, content_pillar_id: 'pillar-4', caption: "Customer spotlight: three teams sharing the exact posting cadence that unlocked steady growth — and the numbers behind each of their strategies.",                                          platforms: ['linkedin'],              status: 'scheduled', scheduled_at: '2026-07-16T10:00:00Z', published_at: null,                    media_url: null,                                                                     created_at: '2026-07-04T10:00:00Z' },
  { id: 'post-13', user_id: 'demo', card_id: null, content_pillar_id: 'pillar-3', caption: "Day in the life: our editor's Friday routine — how she plans, batches, and hands off next week's content in under three hours.",                                                            platforms: ['tiktok'],                status: 'scheduled', scheduled_at: '2026-07-17T13:00:00Z', published_at: null,                    media_url: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400', created_at: '2026-07-04T10:30:00Z' },
];

export const seedMetrics: Metrics[] = [
  { id: 'metric-1', post_id: 'post-11', user_id: 'demo', likes: 248, comments: 31, shares: 14, reach: 4200,  recorded_at: '2025-04-01T12:00:00Z' },
  { id: 'metric-2', post_id: 'post-12', user_id: 'demo', likes: 412, comments: 57, shares: 8,  reach: 6100,  recorded_at: '2025-04-02T12:00:00Z' },
  { id: 'metric-3', post_id: 'post-13', user_id: 'demo', likes: 89,  comments: 12, shares: 33, reach: 2800,  recorded_at: '2025-04-04T12:00:00Z' },
];

export const seedPostsWithMetrics: PostWithMetrics[] = seedPosts.map(p => ({
  ...p,
  metrics: seedMetrics.find(m => m.post_id === p.id) ?? null,
}));
