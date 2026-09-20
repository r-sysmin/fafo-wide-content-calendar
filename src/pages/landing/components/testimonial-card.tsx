import type { LandingTestimonial } from "@/data/landing";

export function TestimonialCard({ testimonial }: { testimonial: LandingTestimonial }) {
  return (
    <article className="flex flex-col justify-between rounded-xl border border-border bg-card p-6 h-full">
      <blockquote className="text-pretty text-base text-foreground">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <footer className="mt-6">
        <p className="text-sm font-semibold text-foreground">
          {testimonial.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {testimonial.role}, {testimonial.company}
        </p>
      </footer>
    </article>
  );
}
