import { useMemo, useState, useCallback } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import { PlatformDots } from "./platform-dots";
import { PostCard } from "./post-card";
import { cn } from "@/lib/utils";
import type { Post, ContentPillar } from "@/data/seed";

interface MonthCalendarProps {
  posts: Post[];
  pillars: ContentPillar[];
  monthDays: Date[];
  anchorDate: Date;
  onPostClick: (post: Post) => void;
  onReschedule?: (postId: string, scheduledAt: string) => void;
  onDeletePost?: (postId: string) => void;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function DroppableDayCell({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={cn(className, isOver && "bg-accent/60")}>
      {children}
    </div>
  );
}

function DraggableMonthItem({
  post,
  onClick,
  onDelete,
}: {
  post: Post;
  onClick: () => void;
  onDelete?: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: post.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "group/mitem flex w-full items-center gap-1 rounded px-1 py-0.5 text-left hover:bg-accent transition-colors cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-no-card-click]")) return;
        onClick();
      }}
    >
      <PlatformDots platforms={post.platforms} />
      <span className="text-[10px] text-foreground truncate flex-1">
        {post.caption}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            data-no-card-click
            type="button"
            className="shrink-0 opacity-0 group-hover/mitem:opacity-100 transition-opacity rounded-sm p-0.5 hover:bg-accent"
            onClick={(e) => e.stopPropagation()}
          >
            <IconDots className="size-3 text-muted-foreground" />
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
  );
}

export function MonthCalendar({
  posts,
  pillars,
  monthDays,
  anchorDate,
  onPostClick,
  onReschedule,
  onDeletePost,
}: MonthCalendarProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const pillarMap = useMemo(
    () => new Map(pillars.map((p) => [p.id, p])),
    [pillars]
  );

  const postsByDay = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const post of posts) {
      const at = new Date(post.scheduled_at ?? post.created_at);
      const key = `${at.getFullYear()}-${at.getMonth()}-${at.getDate()}`;
      const list = map.get(key) ?? [];
      list.push(post);
      map.set(key, list);
    }
    return map;
  }, [posts]);

  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      result.push(monthDays.slice(i, i + 7));
    }
    return result;
  }, [monthDays]);

  const activePost = useMemo(
    () => (activeId ? posts.find((p) => p.id === activeId) : undefined),
    [activeId, posts]
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || !onReschedule) return;

      const postId = String(active.id);
      const cellId = String(over.id);
      const match = cellId.match(/^day-(\d+)-(\d+)-(\d+)$/);
      if (!match) return;

      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const date = parseInt(match[3], 10);

      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      const oldDate = new Date(post.scheduled_at ?? post.created_at);
      const newDate = new Date(year, month, date, oldDate.getHours(), oldDate.getMinutes(), 0, 0);
      onReschedule(postId, newDate.toISOString());
    },
    [onReschedule, posts]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-7 border-l border-t border-border/60">
          {DAY_NAMES.map((name) => (
            <div
              key={name}
              className="border-r border-b border-border/60 py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {name}
            </div>
          ))}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              const isCurrentMonth = day.getMonth() === anchorDate.getMonth();
              const today = isToday(day);
              const key = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
              const dayPosts = postsByDay.get(key) ?? [];
              const visible = dayPosts.slice(0, 3);
              const overflow = dayPosts.length - 3;

              return (
                <DroppableDayCell
                  key={`${wi}-${di}`}
                  id={`day-${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                  className={cn(
                    "min-h-[90px] border-r border-b border-border/60 p-1.5 transition-colors",
                    !isCurrentMonth && "opacity-40"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full text-xs",
                      today
                        ? "bg-primary text-primary-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {day.getDate()}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {visible.map((post) => (
                      <DraggableMonthItem
                        key={post.id}
                        post={post}
                        onClick={() => onPostClick(post)}
                        onDelete={onDeletePost ? () => onDeletePost(post.id) : undefined}
                      />
                    ))}
                    {overflow > 0 && (
                      <OverflowPopover
                        posts={dayPosts}
                        pillarMap={pillarMap}
                        overflow={overflow}
                        onPostClick={onPostClick}
                      />
                    )}
                  </div>
                </DroppableDayCell>
              );
            })
          )}
        </div>
      </div>

      <DragOverlay>
        {activePost && (
          <div className="w-[160px] rotate-2 opacity-90">
            <PostCard
              post={activePost}
              pillar={pillarMap.get(activePost.content_pillar_id ?? "")}
              onClick={() => {}}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function OverflowPopover({
  posts,
  pillarMap: _pillarMap,
  overflow,
  onPostClick,
}: {
  posts: Post[];
  pillarMap: Map<string, ContentPillar>;
  overflow: number;
  onPostClick: (post: Post) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="text-[10px] text-muted-foreground hover:text-foreground px-1"
        >
          +{overflow} more
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <div className="space-y-1">
          {posts.map((post) => (
            <button
              key={post.id}
              type="button"
              onClick={() => {
                onPostClick(post);
                setOpen(false);
              }}
              className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left hover:bg-accent transition-colors"
            >
              <PlatformDots platforms={post.platforms} />
              <span className="text-xs text-foreground truncate">
                {post.caption}
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
