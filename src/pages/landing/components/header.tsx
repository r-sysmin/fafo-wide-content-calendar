import { Link } from "react-router-dom";
import { Button } from "@/components/base/button";

export function Header() {
  return (
    <header role="banner" className="sticky top-0 z-50 bg-background">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-6 lg:px-8">
        <Link
          to="/"
          className="font-heading text-[21px] font-semibold leading-6 tracking-tight text-foreground"
        >
          Content Calendar
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/demo/create">Try demo</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
