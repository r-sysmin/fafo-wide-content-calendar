interface ScreenshotMockupProps {
  src: string;
  alt: string;
  objectPosition?: string;
}

function ScreenshotMockup({
  src,
  alt,
  objectPosition = "left top",
}: ScreenshotMockupProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
      style={{ objectPosition }}
    />
  );
}

export function HeroKanbanMockup() {
  return (
    <ScreenshotMockup
      src="/landing-previews/idea-board.png"
      alt="Content Calendar idea board with columns for unassigned, inspiration, to-do, and in-progress ideas."
      objectPosition="left top"
    />
  );
}

export function IdeaBoardMockup() {
  return (
    <ScreenshotMockup
      src="/landing-previews/idea-board.png"
      alt="Real Content Calendar idea board showing draggable content cards and content pillar tags."
      objectPosition="left top"
    />
  );
}

export function ScheduleMockup() {
  return (
    <ScreenshotMockup
      src="/landing-previews/schedule-week.png"
      alt="Real Content Calendar weekly schedule showing posts placed across a calendar grid."
      objectPosition="left top"
    />
  );
}

export function ComposeMockup() {
  return (
    <ScreenshotMockup
      src="/landing-previews/compose.png"
      alt="Real Content Calendar new post composer modal over the weekly schedule."
      objectPosition="center top"
    />
  );
}

export function TrackMockup() {
  return (
    <ScreenshotMockup
      src="/landing-previews/track-list.png"
      alt="Real Content Calendar list view showing scheduled posts, content pillars, and statuses."
      objectPosition="left top"
    />
  );
}