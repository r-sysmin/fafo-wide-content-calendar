import { cn } from "@/lib/utils";
import { Badge } from "@/components/base/badge";
import { PlatformDots } from "./platform-dots";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Post, ContentPillar } from "@/data/seed";

interface PostCardProps {
  post: Post;
  pillar: ContentPillar | undefined;
  onClick: () => void;
  onDelete?: () => void;
  isDragging?: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  scheduled: "Scheduled",
  published: "Published",
  draft: "Draft",
};

export function PostCard({ post, pillar, onClick, onDelete, isDragging }: PostCardProps) {
  const hasMedia = !!post.media_url;
  const isVideo = hasMedia && /\.(mp4|webm|mov)(\?|$)/i.test(post.media_url!);
  return (
    <div
      className={cn(
        "group/post w-full bg-card p-2 text-left transition-colors hover:bg-muted/60",
        isDragging && "opacity-80"
      )}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-no-card-click]")) return;
        onClick();
      }}
    >
      {hasMedia && (
        <div className="mb-1.5 overflow-hidden bg-muted">
          {isVideo ? (
            <video
              src={post.media_url!}
              className="h-16 w-full object-cover"
              muted
              playsInline
            />
          ) : (
            <img
              src={post.media_url!}
              alt=""
              className="h-16 w-full object-cover"
              loading="lazy"
            />
          )}
        </div>
      )}
      <div className="flex items-center gap-1.5 mb-1">
        <PlatformDots platforms={post.platforms} />
        <span className="ml-auto shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
          {STATUS_LABEL[post.status] ?? post.status}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              data-no-card-click
              type="button"
              className="shrink-0 opacity-0 group-hover/post:opacity-100 transition-opacity p-0.5 hover:bg-accent text-primary"
              onClick={(e) => e.stopPropagation()}
            >
              <IconDots className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" data-no-card-click>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <IconPencil className="size-4" />
              Edit…
            </DropdownMenuItem>
            {onDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <IconTrash className="size-4" />
                  Delete
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-xs text-foreground truncate">{post.caption}</p>
      {pillar && (
        <div className="mt-1">
          <Badge
            className="text-[10px] px-1.5 py-0"
            style={{ backgroundColor: `${pillar.color}15`, color: pillar.color, border: "none" }}
          >
            {pillar.name}
          </Badge>
        </div>
      )}
    </div>
  );
}
