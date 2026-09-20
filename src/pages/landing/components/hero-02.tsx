import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/base/button";

interface Hero02Props {
  heading: string;
  subheading: string;
  primaryCta: { label: string; to: string };
  secondaryCta: { label: string; to: string };
  mockup: ReactNode;
}

export function Hero02({
  heading,
  subheading,
  primaryCta,
  secondaryCta,
  mockup,
}: Hero02Props) {
  const [headingLead, headingRest] = heading.split(" — ");

  return (
    <section className="landing py-16 lg:py-24">
      <div className="mx-auto max-w-page px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <h1 className="text-balance">
              {headingRest ? (
                <>
                  <span>{headingLead}</span> —<br className="hidden lg:inline" />{" "}
                  {headingRest}
                </>
              ) : (
                heading
              )}
            </h1>
            <p className="mt-6 text-pretty text-lg text-muted-foreground">
              {subheading}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild>
                <Link to={primaryCta.to}>{primaryCta.label}</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to={secondaryCta.to}>{secondaryCta.label}</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <figure className="relative overflow-hidden rounded-xl ring-1 ring-border shadow-2xl">
              <img
                src="/browser-chrome.svg"
                alt=""
                className="relative z-[1] w-full pointer-events-none"
              />
              <div
                className="absolute z-[2] w-full overflow-hidden bg-card [&>*]:h-full"
                style={{ top: "4.75%", height: "95.25%" }}
              >
                {mockup}
              </div>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
