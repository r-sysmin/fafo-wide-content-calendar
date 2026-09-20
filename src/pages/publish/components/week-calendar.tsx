import { useMemo, useCallback, useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostCard } from "./post-card";
import { cn } from "@/lib/utils";
import type { Post, ContentPillar } from "@/data/seed";

interface WeekCalendarProps {
  posts: Post[];
  pillars: ContentPillar[];
  weekDays: Date[];
  onPostClick: (post: Post) => void;
  onCellClick: (date: Date, hour: number) => void;
  onReschedule?: (postId: string, scheduledAt: string) => void;
  onDeletePost?: (postId: string) => void;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 7);

function formatHour(hour: number): string {
  if (hour === 0) return "12am";
  if (hour < 12) return `${hour}am`;
  if (hour === 12) return "12pm";
  return `${hour - 12}pm`;
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

function DroppableCell({
  id,
  children,
  className,
  onClick,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={cn(className, isOver && "bg-accent/60")}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

function DraggableCard({
  post,
  pillar,
  onClick,
  onDelete,
}: {
  post: Post;
  pillar: ContentPillar | undefined;
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
      className={cn("cursor-grab active:cursor-grabbing", isDragging && "opacity-50")}
    >
      <PostCard
        post={post}
        pillar={pillar}
        onClick={onClick}
        onDelete={onDelete}
        isDragging={isDragging}
      />
    </div>
  );
}

export function WeekCalendar({
  posts,
  pillars,
  weekDays,
  onPostClick,
  onCellClick,
  onReschedule,
  onDeletePost,
}: WeekCalendarProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const postsByDayHour = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const post of posts) {
      const at = new Date(post.scheduled_at ?? post.created_at);
      const dayIdx = weekDays.findIndex((d) => isSameDay(d, at));
      if (dayIdx === -1) continue;
      const hour = at.getUTCHours();
      const key = `${dayIdx}-${hour}`;
      const list = map.get(key) ?? [];
      list.push(post);
      map.set(key, list);
    }
    return map;
  }, [posts, weekDays]);

  const pillarMap = useMemo(
    () => new Map(pillars.map((p) => [p.id, p])),
    [pillars]
  );

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
      const match = cellId.match(/^cell-(\d+)-(\d+)$/);
      if (!match) return;

      const dayIdx = parseInt(match[1], 10);
      const hour = parseInt(match[2], 10);
      const day = weekDays[dayIdx];
      if (!day) return;

      const newDate = new Date(day);
      newDate.setHours(hour, 0, 0, 0);
      onReschedule(postId, newDate.toISOString());
    },
    [onReschedule, weekDays]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="flex-1">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border sticky top-0 bg-background z-10">
            <div />
            {weekDays.map((day, i) => {
              const dayName = day.toLocaleDateString("en-US", { weekday: "short" });
              const dayNum = day.getDate();
              const today = isToday(day);
              return (
                <div
                  key={i}
                  className="flex flex-col items-center py-2 text-xs text-muted-foreground"
                >
                  <span>{dayName}</span>
                  <span
                    className={cn(
                      "mt-0.5 flex size-6 items-center justify-center rounded-full text-sm font-medium",
                      today && "bg-primary text-primary-foreground"
                    )}
                  >
                    {dayNum}
                  </span>
                </div>
              );
            })}
          </div>

          {HOURS.map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border/50"
            >
              <div className="py-2 pr-2 text-right text-xs text-muted-foreground tabular-nums">
                {formatHour(hour)}
              </div>
              {weekDays.map((day, dayIdx) => {
                const key = `${dayIdx}-${hour}`;
                const cellPosts = postsByDayHour.get(key) ?? [];

                return (
                  <DroppableCell
                    key={dayIdx}
                    id={`cell-${dayIdx}-${hour}`}
                    className="min-h-[60px] min-w-0 overflow-hidden border-l border-border/50 p-1 cursor-pointer hover:bg-accent/40 transition-colors"
                    onClick={() => onCellClick(day, hour)}
                  >
                    <div className="min-w-0 space-y-1">
                      {cellPosts.map((post) => (
                        <DraggableCard
                          key={post.id}
                          post={post}
                          pillar={pillarMap.get(post.content_pillar_id ?? "")}
                          onClick={() => onPostClick(post)}
                          onDelete={onDeletePost ? () => onDeletePost(post.id) : undefined}
                        />
                      ))}
                    </div>
                  </DroppableCell>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

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
