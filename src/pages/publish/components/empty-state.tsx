import { useLocation, useNavigate } from "react-router-dom";
import { IconCalendarEvent } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  onNewPost: () => void;
}

function isDemo(pathname: string) {
  return pathname.startsWith("/demo");
}

export function EmptyState({ onNewPost: _onNewPost }: EmptyStateProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const demo = isDemo(location.pathname);

  return (
    <div className="flex-1 relative">
      <div className="absolute inset-0 grid grid-cols-7 gap-px p-4 opacity-30">
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="rounded bg-muted h-8" />
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Card className="shadow-lg max-w-sm w-full">
          <CardContent className="flex flex-col items-center text-center p-6 gap-3">
            <IconCalendarEvent className="size-8 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Nothing scheduled yet</h3>
            <p className="text-sm text-muted-foreground">
              Use “New Post” in the toolbar above to compose a post, or head to the Create board.
            </p>
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => navigate(demo ? "/demo/create" : "/create")}
            >
              or go to Create board &rarr;
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
