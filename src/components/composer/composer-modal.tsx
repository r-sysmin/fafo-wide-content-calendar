import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/base/button";
import { Separator } from "@/components/ui/separator";
import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandTiktok,
  IconBrandFacebook,
  IconUpload,
  IconHeart,
  IconMessageCircle,
  IconShare,
  IconEye,
} from "@tabler/icons-react";
import { useDataProvider } from "@/lib/data-provider";
import type { Card, Post, Metrics } from "@/data/seed";

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: IconBrandInstagram, charLimit: 2200 },
  { id: "linkedin", label: "LinkedIn", icon: IconBrandLinkedin, charLimit: 3000 },
  { id: "x", label: "X", icon: IconBrandX, charLimit: 280 },
  { id: "tiktok", label: "TikTok", icon: IconBrandTiktok, charLimit: 2200 },
  { id: "facebook", label: "Facebook", icon: IconBrandFacebook, charLimit: 63206 },
];

export type ComposerMode = "idea" | "post";

interface ComposerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Existing card being edited (idea on the kanban). */
  card?: Card | null;
  /** Existing post being edited (item on the calendar). */
  post?: Post | null;
  /** Default kanban column id when creating a brand-new idea. */
  defaultColumnId?: string;
  /** Default scheduled time when creating a brand-new post. */
  defaultScheduledAt?: string;
  /** Initial mode for a brand-new entry. Ignored if card/post is provided. */
  defaultMode?: ComposerMode;
  /** Disable all writes (e.g. signed-out preview). */
  readOnly?: boolean;
}

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ComposerModal({
  open,
  onOpenChange,
  card = null,
  post = null,
  defaultColumnId,
  defaultScheduledAt,
  defaultMode = "idea",
  readOnly = false,
}: ComposerModalProps) {
  const provider = useDataProvider();
  const { user } = useAuth();
  const { data: pillars } = provider.useContentPillars();
  const { data: columns } = provider.useColumns();
  const { data: allCards } = provider.useCards({});
  const { mutate: createCard, isPending: creatingCard } = provider.useCreateCard();
  const { mutate: updateCard, isPending: updatingCard } = provider.useUpdateCard();
  const { mutate: createPost, isPending: creatingPost } = provider.useCreatePost();
  const { mutate: updatePost, isPending: updatingPost } = provider.useUpdatePost();
  const { mutate: deletePost } = provider.useDeletePost();

  // Metrics only when viewing a published post.
  const metrics: Metrics | null = post?.status === "published"
    ? provider.useMetrics(post.id).data
    : null;

  // ---- Form state -----------------------------------------------------------
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [pillarId, setPillarId] = useState("");
  const [columnId, setColumnId] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [publishMode, setPublishMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const mediaInputId = "composer-media-upload";

  // Editing an existing post forces publish mode on.
  const lockedPublish = !!post;
  const isPublished = post?.status === "published";
  const editingExisting = !!card || !!post;

  useEffect(() => {
    if (!open) return;
    if (post) {
      setTitle("");
      setCaption(post.caption);
      setSelectedPlatforms([...post.platforms]);
      setPillarId(post.content_pillar_id ?? "");
      setColumnId("");
      setMediaUrl(post.media_url ?? "");
      setScheduledAt(post.scheduled_at ? toDatetimeLocal(post.scheduled_at) : "");
      setPublishMode(true);
    } else if (card) {
      setTitle(card.title);
      setCaption(card.caption);
      setSelectedPlatforms(card.platforms ?? []);
      setPillarId(card.content_pillar_id ?? "");
      setColumnId(card.column_id);
      setMediaUrl(card.media_url ?? "");
      setScheduledAt("");
      setPublishMode(defaultMode === "post");
    } else {
      setTitle("");
      setCaption("");
      setSelectedPlatforms([]);
      setPillarId("");
      setColumnId(defaultColumnId ?? (columns[0]?.id ?? ""));
      setMediaUrl("");
      setScheduledAt(defaultScheduledAt ? toDatetimeLocal(defaultScheduledAt) : "");
      setPublishMode(defaultMode === "post");
    }
    // We intentionally only reset when `open` flips or the target entity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, post?.id, card?.id, defaultColumnId, defaultScheduledAt, defaultMode]);

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const charCounts = useMemo(
    () =>
      selectedPlatforms
        .map((p) => {
          const platform = PLATFORMS.find((pl) => pl.id === p);
          return platform
            ? { label: platform.label, count: caption.length, limit: platform.charLimit }
            : null;
        })
        .filter(Boolean) as { label: string; count: number; limit: number }[],
    [selectedPlatforms, caption]
  );

  // ---- Save -----------------------------------------------------------------
  const close = () => onOpenChange(false);

  const saveIdea = () => {
    if (!title.trim()) {
      toast.error("Give your idea a title.");
      return;
    }
    if (card) {
      updateCard(
        card.id,
        {
          title: title.trim(),
          caption: caption.trim(),
          platforms: selectedPlatforms,
          content_pillar_id: pillarId || null,
          media_url: mediaUrl || null,
          column_id: columnId || card.column_id,
        },
        { onSuccess: close }
      );
    } else {
      const targetCol = columnId || defaultColumnId || (columns[0]?.id ?? "");
      const colCards = allCards.filter((c) => c.column_id === targetCol);
      const maxPos = colCards.length > 0 ? Math.max(...colCards.map((c) => c.position)) : -1;
      createCard(
        {
          column_id: targetCol,
          title: title.trim(),
          caption: caption.trim(),
          platforms: selectedPlatforms,
          content_pillar_id: pillarId || null,
          media_url: mediaUrl || null,
          position: maxPos + 1,
        },
        { onSuccess: close }
      );
    }
  };

  const savePost = () => {
    if (!caption.trim()) {
      toast.error("Write a caption before scheduling.");
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error("Pick at least one platform.");
      return;
    }
    if (!scheduledAt && !isPublished) {
      toast.error("Pick a date and time to schedule this post.");
      return;
    }

    const scheduledIso = scheduledAt ? new Date(scheduledAt).toISOString() : null;

    if (post) {
      // Editing an existing post.
      updatePost(post.id, {
        caption: caption.trim(),
        platforms: selectedPlatforms,
        content_pillar_id: pillarId || null,
        media_url: mediaUrl || null,
        scheduled_at: scheduledIso,
      });
      close();
      return;
    }

    // Creating a new post — optionally promoted from a card.
    createPost(
      {
        card_id: card?.id ?? null,
        caption: caption.trim(),
        platforms: selectedPlatforms,
        content_pillar_id: pillarId || null,
        media_url: mediaUrl || null,
        status: "scheduled",
        scheduled_at: scheduledIso,
        published_at: null,
      },
      {
        onSuccess: () => {
          if (scheduledIso) {
            toast.success(`Post scheduled for ${new Date(scheduledIso).toLocaleString()}`);
          } else {
            toast.success("Post scheduled");
          }
          // Keep the underlying card in sync (caption/pillar may have changed).
          if (card) {
            updateCard(card.id, {
              caption: caption.trim(),
              content_pillar_id: pillarId || null,
              media_url: mediaUrl || null,
            });
          }
          close();
        },
      }
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (readOnly) {
      toast("Sign in to save changes");
      return;
    }
    if (publishMode) savePost();
    else saveIdea();
  };

  const handleDelete = () => {
    if (!post) return;
    deletePost(post.id);
    close();
  };

  const handleMediaChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !user) {
      if (!user) toast.error("Sign in to upload media.");
      return;
    }
    setUploading(true);
    try {
      const refId = post?.id ?? card?.id ?? crypto.randomUUID();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${user.id}/${refId}-${safeName}`;
      const { error: upErr } = await supabase.storage
        .from("post-media")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;
      const { data: signed, error: signErr } = await supabase.storage
        .from("post-media")
        .createSignedUrl(path, 60 * 60 * 24 * 365);
      if (signErr) throw signErr;
      setMediaUrl(signed.signedUrl);
      if (card && !post) updateCard(card.id, { media_url: signed.signedUrl });
      toast.success("Media uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const isVideo = !!mediaUrl && /\.(mp4|webm|mov)(\?|$)/i.test(mediaUrl);

  const dialogTitle = post
    ? isPublished ? "Post" : "Edit post"
    : card
      ? card.title || "Edit idea"
      : publishMode ? "New post" : "New";

  const submitLabel = publishMode
    ? post ? "Save" : card ? "Schedule post" : "Schedule post"
    : card ? "Save" : "Save idea";

  const submitting = creatingCard || updatingCard || creatingPost || updatingPost;
  const disableSubmit = uploading || submitting || readOnly || isPublished;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title — hidden when editing an existing post (posts have no title field). */}
          {!post && (
            <div className="space-y-2">
              <Label htmlFor="composer-title">Title</Label>
              <Input
                id="composer-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus={!editingExisting}
                disabled={isPublished}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="composer-caption">Caption</Label>
            <Textarea
              id="composer-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              className="resize-none"
              disabled={isPublished}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Content pillar</Label>
              <Select value={pillarId} onValueChange={setPillarId} disabled={isPublished}>
                <SelectTrigger aria-label="Content pillar">
                  <SelectValue placeholder="Select a pillar" />
                </SelectTrigger>
                <SelectContent>
                  {pillars.map((pillar) => (
                    <SelectItem key={pillar.id} value={pillar.id}>
                      <span className="flex items-center gap-2">
                        <span
                          className="inline-block size-2.5 rounded-full"
                          style={{ backgroundColor: pillar.color }}
                        />
                        {pillar.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Column only matters for ideas. */}
            {!publishMode && (
              <div className="space-y-2">
                <Label>Column</Label>
                <Select value={columnId} onValueChange={setColumnId} disabled={!columns.length}>
                  <SelectTrigger aria-label="Column">
                    <SelectValue placeholder="Select a column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* ---- Publish toggle ------------------------------------------- */}
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="composer-publish-toggle" className="text-sm">
                Schedule to publish
              </Label>
              <p className="text-xs text-muted-foreground">
                {publishMode
                  ? card
                    ? "This idea will be scheduled as a post."
                    : "Pick platforms and a time."
                  : "Keep this as an idea on the board."}
              </p>
            </div>
            <Switch
              id="composer-publish-toggle"
              checked={publishMode}
              onCheckedChange={(v) => !lockedPublish && setPublishMode(v)}
              disabled={lockedPublish || isPublished}
            />
          </div>

          {publishMode && (
            <>
              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="flex flex-wrap gap-4">
                  {PLATFORMS.map((platform) => (
                    <label
                      key={platform.id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Checkbox
                        aria-label={platform.label}
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => togglePlatform(platform.id)}
                        disabled={isPublished}
                      />
                      <platform.icon className="size-4" />
                      <span className="text-sm">{platform.label}</span>
                    </label>
                  ))}
                </div>
                {charCounts.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {charCounts.map((c) => `${c.label} ${c.count}/${c.limit}`).join(" · ")}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="composer-schedule">When</Label>
                <Input
                  id="composer-schedule"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  disabled={isPublished}
                />
              </div>

              <div className="space-y-2">
                <Label>Media</Label>
                <input
                  id={mediaInputId}
                  type="file"
                  accept="image/*,video/*"
                  className="sr-only"
                  onChange={handleMediaChange}
                />
                {mediaUrl ? (
                  <div className="relative overflow-hidden bg-muted">
                    {isVideo ? (
                      <video src={mediaUrl} className="max-h-48 w-full object-contain" controls />
                    ) : (
                      <img src={mediaUrl} alt="Attached media" className="max-h-48 w-full object-contain" />
                    )}
                    {!isPublished && (
                      <div className="absolute right-2 top-2 flex gap-2">
                        <label
                          htmlFor={mediaInputId}
                          onClick={(e) => uploading && e.preventDefault()}
                          className="inline-flex h-8 cursor-pointer items-center justify-center bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50"
                          aria-disabled={uploading}
                        >
                          {uploading ? "Uploading…" : "Replace"}
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setMediaUrl("")}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  !isPublished && (
                    <label
                      htmlFor={mediaInputId}
                      onClick={(e) => uploading && e.preventDefault()}
                      className="flex w-full cursor-pointer items-center gap-2 bg-muted p-4 text-left text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground aria-disabled:pointer-events-none aria-disabled:opacity-50"
                      aria-disabled={uploading}
                    >
                      <IconUpload className="size-4 text-primary" />
                      <span>{uploading ? "Uploading…" : "Attach image or video"}</span>
                    </label>
                  )
                )}
              </div>

              {isPublished && metrics && (
                <>
                  <Separator />
                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <IconHeart className="size-4" /> {metrics.likes.toLocaleString()} likes
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IconMessageCircle className="size-4" /> {metrics.comments.toLocaleString()} comments
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IconShare className="size-4" /> {metrics.shares.toLocaleString()} shares
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IconEye className="size-4" /> {metrics.reach.toLocaleString()} reach
                    </span>
                  </div>
                </>
              )}
            </>
          )}

          <Separator />

          <DialogFooter className="flex-row justify-between sm:justify-between">
            <div>
              {post && !isPublished && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={close}>
                {isPublished ? "Close" : "Cancel"}
              </Button>
              {!isPublished && (
                <Button type="submit" disabled={disableSubmit}>
                  {submitLabel}
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}