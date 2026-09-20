import { useState, useMemo, useCallback } from "react";
import { useDataProvider } from "@/lib/data-provider";
import { useFilters } from "@/lib/filter-context";
import { CalendarToolbar } from "./components/calendar-toolbar";
import { WeekCalendar } from "./components/week-calendar";
import { MonthCalendar } from "./components/month-calendar";
import { PostListView } from "./components/post-list-view";
import { ComposerModal } from "@/components/composer/composer-modal";
import { EmptyState } from "./components/empty-state";
import { useCalendarState } from "./components/use-calendar-state";
import type { Post } from "@/data/seed";

export default function PublishPage() {
  const provider = useDataProvider();
  const { mutate: updatePost } = provider.useUpdatePost();
  const { mutate: deletePost } = provider.useDeletePost();
  const { filters, setFilters } = useFilters();
  const {
    view,
    setView,
    anchorDate,
    label,
    range,
    navigateBack,
    navigateForward,
    weekDays,
    monthDays,
  } = useCalendarState();

  const [activeContentPillarIds, setActiveContentPillarIds] = useState<string[]>([]);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [defaultScheduledAt, setDefaultScheduledAt] = useState<string | undefined>();

  const postFilters = useMemo(
    () => ({
      rangeStart: range.rangeStart,
      rangeEnd: range.rangeEnd,
      platform: filters.platform,
      contentPillarId: activeContentPillarIds.length === 1 ? activeContentPillarIds[0] : undefined,
      status: filters.status,
    }),
    [range, filters.platform, activeContentPillarIds, filters.status]
  );

  const { data: posts } = provider.usePosts(postFilters);
  const { data: postsWithMetrics } = provider.usePostsWithMetrics(postFilters);
  const { data: pillars } = provider.useContentPillars();

  const filteredPosts = useMemo(() => {
    if (activeContentPillarIds.length <= 1) return posts;
    return posts.filter(
      (p) => p.content_pillar_id && activeContentPillarIds.includes(p.content_pillar_id)
    );
  }, [posts, activeContentPillarIds]);

  const filteredPostsWithMetrics = useMemo(() => {
    if (activeContentPillarIds.length <= 1) return postsWithMetrics;
    return postsWithMetrics.filter(
      (p) => p.content_pillar_id && activeContentPillarIds.includes(p.content_pillar_id)
    );
  }, [postsWithMetrics, activeContentPillarIds]);

  const isEmpty = filteredPosts.length === 0;

  const handlePlatformChange = useCallback(
    (platform: string | undefined) => {
      setFilters({ platform });
    },
    [setFilters]
  );

  const handleContentPillarToggle = useCallback((pillarId: string) => {
    setActiveContentPillarIds((prev) =>
      prev.includes(pillarId)
        ? prev.filter((id) => id !== pillarId)
        : [...prev, pillarId]
    );
  }, []);

  const handleNewPost = useCallback(() => {
    setEditingPost(null);
    setDefaultScheduledAt(undefined);
    setComposerOpen(true);
  }, []);

  const handlePostClick = useCallback((post: Post) => {
    setEditingPost(post);
    setDefaultScheduledAt(undefined);
    setComposerOpen(true);
  }, []);

  const handleCellClick = useCallback((date: Date, hour: number) => {
    const d = new Date(date);
    d.setHours(hour, 0, 0, 0);
    setEditingPost(null);
    setDefaultScheduledAt(d.toISOString());
    setComposerOpen(true);
  }, []);

  const handleReschedule = useCallback(
    (postId: string, scheduledAt: string) => {
      updatePost(postId, { scheduled_at: scheduledAt });
    },
    [updatePost]
  );

  const handleDeletePost = useCallback(
    (postId: string) => {
      deletePost(postId);
    },
    [deletePost]
  );

  return (
    <div className="flex h-full flex-col">
      <CalendarToolbar
        label={label}
        view={view}
        onViewChange={setView}
        onNavigateBack={navigateBack}
        onNavigateForward={navigateForward}
        activePlatform={filters.platform}
        onPlatformChange={handlePlatformChange}
        activeContentPillarIds={activeContentPillarIds}
        onContentPillarToggle={handleContentPillarToggle}
        onNewPost={handleNewPost}
      />

      {isEmpty ? (
        <EmptyState onNewPost={handleNewPost} />
      ) : view === "week" ? (
        <WeekCalendar
          posts={filteredPosts}
          pillars={pillars}
          weekDays={weekDays}
          onPostClick={handlePostClick}
          onCellClick={handleCellClick}
          onReschedule={handleReschedule}
          onDeletePost={handleDeletePost}
        />
      ) : view === "month" ? (
        <MonthCalendar
          posts={filteredPosts}
          pillars={pillars}
          monthDays={monthDays}
          anchorDate={anchorDate}
          onPostClick={handlePostClick}
          onReschedule={handleReschedule}
          onDeletePost={handleDeletePost}
        />
      ) : (
        <PostListView
          posts={filteredPostsWithMetrics}
          pillars={pillars}
          onPostClick={handlePostClick}
        />
      )}

      <ComposerModal
        open={composerOpen}
        onOpenChange={setComposerOpen}
        post={editingPost}
        defaultScheduledAt={defaultScheduledAt}
        defaultMode="post"
      />
    </div>
  );
}
