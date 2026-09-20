import { Header } from "./components/header";
import { Hero02 } from "./components/hero-02";
import { FeatureShowcase, type Feature } from "./components/feature-showcase-01";
import { TestimonialSlider } from "./components/testimonial-slider";
import { TestimonialCard } from "./components/testimonial-card";
import { Cta01 } from "./components/cta-01";
import { Footer } from "./components/footer";
import {
  HeroKanbanMockup,
  IdeaBoardMockup,
  ScheduleMockup,
  ComposeMockup,
  TrackMockup,
} from "./components/mockups";
import { featureTabs, landingTestimonials } from "@/data/landing";

const showcaseFeatures: Feature[] = featureTabs.map((tab) => {
  const mockups: Record<string, React.ReactNode> = {
    "idea-board": <IdeaBoardMockup />,
    schedule: <ScheduleMockup />,
    compose: <ComposeMockup />,
    track: <TrackMockup />,
  };
  return {
    key: tab.key,
    label: tab.label,
    heading: tab.description,
    mockup: mockups[tab.key],
  };
});

export default function Landing() {
  return (
    <>
      <Header />

      <Hero02
        heading="From idea to published — your whole content workflow in one place."
        subheading="Plan, schedule, and track posts across every platform. No more sticky notes, no more spreadsheets."
        primaryCta={{ label: "Try demo →", to: "/demo/create" }}
        secondaryCta={{ label: "Sign in", to: "/sign-in" }}
        mockup={<HeroKanbanMockup />}
      />

      <section id="features">
        <FeatureShowcase features={showcaseFeatures} />
      </section>

      <div id="testimonials" className="landing">
        <div className="mx-auto max-w-page px-6 lg:px-8 pt-24">
          <h2 className="text-center text-balance">What marketing teams say</h2>
        </div>
        <TestimonialSlider
          items={landingTestimonials}
          renderCard={(t) => <TestimonialCard testimonial={t} />}
          keyExtractor={(t) => t.name}
        />
      </div>

      <Cta01
        heading="Stop juggling tools. Start shipping content."
        primaryCta={{ label: "Try demo →", href: "/demo/create" }}
      />

      <Footer />
    </>
  );
}
