export interface FeatureTab {
  key: string;
  label: string;
  description: string;
}

export const featureTabs: FeatureTab[] = [
  { key: "idea-board", label: "Idea Board", description: "Drag ideas from inspiration to ready-to-post" },
  { key: "schedule", label: "Schedule", description: "See your whole week — posts, platforms, and gaps at a glance" },
  { key: "compose", label: "Compose", description: "Write captions, attach media, and schedule — all in one modal" },
  { key: "track", label: "Track", description: "Likes, comments, shares, and reach right on the calendar" },
];

export interface LandingTestimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
}

export const landingTestimonials: LandingTestimonial[] = [
  {
    name: "Priya Nair",
    role: "Head of Content",
    company: "Stackform",
    quote: "We cut our content planning time in half. The kanban board is exactly how our team thinks about ideas.",
  },
  {
    name: "Marcus Webb",
    role: "Social Media Manager",
    company: "Loopcast",
    quote: "I used to juggle 4 tabs and a spreadsheet just to schedule a week of posts. Now I drag and drop in one place.",
  },
  {
    name: "Sana Kowalski",
    role: "VP Marketing",
    company: "Meridian",
    quote: "The calendar view changed how we plan campaigns. We finally see the full picture before anything goes live.",
  },
  {
    name: "David Chen",
    role: "Content Lead",
    company: "Catalyze",
    quote: "Content pillars keep our messaging consistent across every platform. This tool made that effortless.",
  },
];

