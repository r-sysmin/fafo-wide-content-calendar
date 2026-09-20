import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconHeart,
  IconMessageCircle,
  IconShare,
  IconEye,
  IconArrowUp,
  IconArrowDown,
} from "@tabler/icons-react";
import { Badge } from "@/components/base/badge";
import { PlatformDots } from "./platform-dots";
import { cn } from "@/lib/utils";
import type { PostWithMetrics, ContentPillar } from "@/data/seed";

interface PostListViewProps {
  posts: PostWithMetrics[];
  pillars: ContentPillar[];
  onPostClick: (post: PostWithMetrics) => void;
}

type SortField = "date" | "platform" | "status";
type SortDir = "asc" | "desc";

const STATUS_COLOR: Record<string, { color: "amber" | "green" | "gray"; label: string }> = {
  scheduled: { color: "amber", label: "Scheduled" },
  published: { color: "green", label: "Published" },
  draft: { color: "gray", label: "Draft" },
};

export function PostListView({ posts, pillars, onPostClick }: PostListViewProps) {
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const pillarMap = useMemo(
    () => new Map(pillars.map((p) => [p.id, p])),
    [pillars]
  );

  const sorted = useMemo(() => {
    const arr = [...posts];
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "date":
          cmp =
            new Date(a.scheduled_at ?? a.created_at).getTime() -
            new Date(b.scheduled_at ?? b.created_at).getTime();
          break;
        case "platform":
          cmp = (a.platforms[0] ?? "").localeCompare(b.platforms[0] ?? "");
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
    return arr;
  }, [posts, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <IconArrowUp className="size-3 inline ml-0.5" />
    ) : (
      <IconArrowDown className="size-3 inline ml-0.5" />
    );
  };

  return (
    <div className="flex-1 overflow-auto p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">Platform</TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("date")}
            >
              Date & time <SortIcon field="date" />
            </TableHead>
            <TableHead>Caption</TableHead>
            <TableHead>Pillar</TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => handleSort("status")}
            >
              Status <SortIcon field="status" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((post) => {
            const pillar = pillarMap.get(post.content_pillar_id ?? "");
            const status = STATUS_COLOR[post.status] ?? STATUS_COLOR.draft;
            const at = new Date(post.scheduled_at ?? post.created_at);

            return (
              <TableRow
                key={post.id}
                className="cursor-pointer"
                onClick={() => onPostClick(post)}
              >
                <TableCell>
                  <PlatformDots platforms={post.platforms} />
                </TableCell>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap tabular-nums">
                  {at.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  {at.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="max-w-[300px]">
                  <p className="text-sm text-foreground line-clamp-2">
                    {post.caption}
                  </p>
                  {post.status === "published" && post.metrics && (
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-0.5">
                        <IconHeart className="size-3" /> {post.metrics.likes.toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <IconMessageCircle className="size-3" /> {post.metrics.comments.toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <IconShare className="size-3" /> {post.metrics.shares.toLocaleString()}
                      </span>
                      <span className="inline-flex items-center gap-0.5">
                        <IconEye className="size-3" /> {post.metrics.reach.toLocaleString()}
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {pillar && (
                    <Badge
                      className={cn("text-[10px]")}
                      style={{
                        backgroundColor: `${pillar.color}15`,
                        color: pillar.color,
                        borderColor: "transparent",
                      }}
                    >
                      {pillar.name}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge color={status.color}>{status.label}</Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
