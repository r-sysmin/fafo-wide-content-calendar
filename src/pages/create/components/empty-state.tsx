import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/base/button";
import { IconPencil } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";

interface EmptyStateProps {
  onNewIdea: () => void;
}

export function EmptyState({ onNewIdea }: EmptyStateProps) {
  return (
    <div className="relative flex-1 flex items-center justify-center p-6">
      <div className="absolute inset-0 flex gap-4 p-6 opacity-40 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-[272px] shrink-0 space-y-3 pt-8">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ))}
      </div>

      <Card className="relative z-10 shadow-lg max-w-sm w-full">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <IconPencil className="size-8 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold">Add your first idea</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Capture content ideas before they disappear.
            </p>
          </div>
          <Button onClick={onNewIdea}>+ New Idea</Button>
        </CardContent>
      </Card>
    </div>
  );
}
