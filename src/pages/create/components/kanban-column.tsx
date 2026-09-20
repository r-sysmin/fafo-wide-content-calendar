import { useState, useRef, useEffect, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconDotsVertical, IconPlus, IconTrash, IconPencil } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { IdeaCard } from "./idea-card";
import type { Card, Column, ContentPillar } from "@/data/seed";

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  pillars: ContentPillar[];
  onCardClick: (card: Card) => void;
  onDeleteCard: (id: string) => void;
  onRenameColumn: (id: string, title: string) => void;
  onDeleteColumn: (id: string) => void;
  onAddCard: (columnId: string) => void;
}

export function KanbanColumn({
  column,
  cards,
  pillars,
  onCardClick,
  onDeleteCard,
  onRenameColumn,
  onDeleteColumn,
  onAddCard,
}: KanbanColumnProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(column.title);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const cardIds = useMemo(() => cards.map((c) => c.id), [cards]);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  const commitRename = () => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== column.title) {
      onRenameColumn(column.id, trimmed);
    } else {
      setRenameValue(column.title);
    }
    setIsRenaming(false);
  };

  const pillarMap = useMemo(() => {
    const map = new Map<string, ContentPillar>();
    pillars.forEach((p) => map.set(p.id, p));
    return map;
  }, [pillars]);

  return (
    <div className="flex w-[272px] shrink-0 flex-col">
      <div className="flex items-center gap-2 px-2 pb-2">
        {isRenaming ? (
          <Input
            ref={inputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={commitRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitRename();
              if (e.key === "Escape") {
                setRenameValue(column.title);
                setIsRenaming(false);
              }
            }}
            className="h-7 text-sm font-semibold"
          />
        ) : (
          <button
            className="text-sm font-semibold text-foreground hover:text-primary transition-colors text-left"
            onClick={() => setIsRenaming(true)}
          >
            {column.title}
          </button>
        )}
        <span className="text-xs text-muted-foreground tabular-nums">
          {cards.length}
        </span>
        <div className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-0.5 hover:bg-accent text-primary">
              <IconDotsVertical className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsRenaming(true)}>
              <IconPencil className="size-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setShowDeleteDialog(true)}
            >
              <IconTrash className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div
          ref={setNodeRef}
          className={`flex flex-col gap-2 px-1 pb-2 min-h-[60px] transition-colors ${isOver ? "bg-accent/60" : ""}`}
        >
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <IdeaCard
                key={card.id}
                card={card}
                pillar={card.content_pillar_id ? pillarMap.get(card.content_pillar_id) : undefined}
                onClick={() => onCardClick(card)}
                onDelete={() => onDeleteCard(card.id)}
              />
            ))}
          </SortableContext>
        </div>
      </ScrollArea>

      <button
        className="flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => onAddCard(column.id)}
      >
        <IconPlus className="size-3.5" />
        Add
      </button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete column</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete &ldquo;{column.title}&rdquo; and all {cards.length} cards in it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDeleteColumn(column.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
