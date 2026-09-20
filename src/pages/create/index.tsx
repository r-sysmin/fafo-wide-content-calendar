import { useEffect, useRef, useState } from "react";
import {
  IconMenu2,
  IconLayoutGrid,
  IconPhoto,
  IconPlus,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import {
  SidebarMenuButton,
  SidebarHoverArea,
  usePeekable,
  useShadcnSidebar,
} from "@/components/base/sidebar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/base/button";
import { useDataProvider } from "@/lib/data-provider";
import { KanbanBoard } from "./components/kanban-board";
import { GalleryView } from "./components/gallery-view";
import { ComposerModal } from "@/components/composer/composer-modal";
import { EmptyState } from "./components/empty-state";
import type { Card } from "@/data/seed";
import { useAuth } from "@/lib/auth/auth-provider";

type ViewMode = "board" | "gallery";

export default function CreatePage() {
  const { state, actions } = usePeekable();
  const { setOpenMobile } = useShadcnSidebar();
  const { user } = useAuth();
  const provider = useDataProvider();
  const { data: cards } = provider.useCards({});
  const { mutate: ensureWorkspaceDefaults } = provider.useEnsureWorkspaceDefaults();

  const [view, setView] = useState<ViewMode>("board");
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [newCardColumnId, setNewCardColumnId] = useState<string | undefined>();
  const ensuredWorkspaceUserRef = useRef<string | null>(null);

  const isEmpty = cards.length === 0;

  useEffect(() => {
    if (!user || ensuredWorkspaceUserRef.current === user.id) return;
    ensuredWorkspaceUserRef.current = user.id;
    ensureWorkspaceDefaults();
  }, [ensureWorkspaceDefaults, user]);

  const handleNewIdea = (columnId?: string) => {
    setEditingCard(null);
    setNewCardColumnId(columnId);
    setComposerOpen(true);
  };

  const handleCardClick = (card: Card) => {
    setEditingCard(card);
    setNewCardColumnId(undefined);
    setComposerOpen(true);
  };

  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden">
      <header className="relative z-20 flex shrink-0 flex-wrap items-center gap-2 px-4 py-2 md:h-12 md:flex-nowrap md:py-0">
        {!state.isExpanded && (
          <SidebarHoverArea className="hidden md:block">
            <SidebarMenuButton
              size="sm"
              onClick={() => actions.expand("hamburger")}
            >
              <IconMenu2 />
            </SidebarMenuButton>
          </SidebarHoverArea>
        )}
        <SidebarMenuButton
          size="sm"
          className="w-auto shrink-0 md:hidden"
          onClick={() => setOpenMobile(true)}
        >
          <IconMenu2 />
        </SidebarMenuButton>

        <h1 className="min-w-0 flex-1 truncate whitespace-nowrap text-lg font-semibold md:flex-none">
          Idea Board
        </h1>

        <div className="hidden flex-1 md:block" />

        {!user && (
          <Button variant="ghost" size="sm" asChild className="hidden md:inline-flex">
            <Link to="/sign-in">Sign in</Link>
          </Button>
        )}

        {!isEmpty && (
          <>
            <Button size="sm" onClick={() => handleNewIdea()} className="md:order-last">
              <IconPlus className="size-4" aria-hidden="true" />
              <span className="hidden md:inline">New Idea</span>
            </Button>

            <ToggleGroup
              type="single"
              value={view}
              onValueChange={(v) => {
                if (v) setView(v as ViewMode);
              }}
              size="sm"
              className="order-last ml-auto w-full justify-end md:order-none md:ml-0 md:w-auto"
            >
              <ToggleGroupItem
                value="board"
                aria-label="Board view"
                className={view === "board" ? "text-primary" : "text-muted-foreground"}
              >
                <IconLayoutGrid className="size-4" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="gallery"
                aria-label="Gallery view"
                className={view === "gallery" ? "text-primary" : "text-muted-foreground"}
              >
                <IconPhoto className="size-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </>
        )}
      </header>

      {isEmpty ? (
        <EmptyState onNewIdea={() => handleNewIdea()} />
      ) : view === "board" ? (
        <KanbanBoard
          onCardClick={handleCardClick}
          onNewCard={(columnId) => handleNewIdea(columnId)}
        />
      ) : (
        <GalleryView onCardClick={handleCardClick} />
      )}

      {composerOpen && (
        <ComposerModal
          open={composerOpen}
          onOpenChange={setComposerOpen}
          card={editingCard}
          defaultColumnId={newCardColumnId}
          defaultMode="idea"
        />
      )}
    </div>
  );
}
