import { useState, useMemo, useCallback, useRef } from "react";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { IconPlus } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { KanbanColumn } from "./kanban-column";
import { useDataProvider } from "@/lib/data-provider";
import type { Card } from "@/data/seed";

interface KanbanBoardProps {
  onCardClick: (card: Card) => void;
  onNewCard: (columnId: string) => void;
}

export function KanbanBoard({ onCardClick, onNewCard }: KanbanBoardProps) {
  const provider = useDataProvider();
  const { data: columns } = provider.useColumns();
  const { data: cards } = provider.useCards({});
  const { data: pillars } = provider.useContentPillars();
  const { mutate: deleteCard } = provider.useDeleteCard();
  const { mutate: reorderCards } = provider.useReorderCards();
  const { mutate: updateColumn } = provider.useUpdateColumn();
  const { mutate: deleteColumn } = provider.useDeleteColumn();
  const { mutate: createColumn } = provider.useCreateColumn();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [localCards, setLocalCards] = useState<Card[] | null>(null);
  const [isAddingColumn, setIsAddingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const addColumnRef = useRef<HTMLInputElement>(null);

  const displayCards = localCards ?? cards;

  const cardsByColumn = useMemo(() => {
    const map = new Map<string, Card[]>();
    columns.forEach((col) => map.set(col.id, []));
    displayCards.forEach((card) => {
      const list = map.get(card.column_id);
      if (list) list.push(card);
    });
    map.forEach((list) => list.sort((a, b) => a.position - b.position));
    return map;
  }, [columns, displayCards]);

  const activeCard = useMemo(
    () => (activeId ? displayCards.find((c) => c.id === activeId) : undefined),
    [activeId, displayCards]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    setLocalCards([...cards]);
  }, [cards]);

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over || !localCards) return;

      const activeCardId = String(active.id);
      const overId = String(over.id);

      const activeCard = localCards.find((c) => c.id === activeCardId);
      if (!activeCard) return;

      const overCard = localCards.find((c) => c.id === overId);
      const overColumn = columns.find((c) => c.id === overId);

      const targetColumnId = overCard
        ? overCard.column_id
        : overColumn
          ? overColumn.id
          : null;

      if (!targetColumnId) return;
      if (activeCard.column_id === targetColumnId && !overCard) return;

      setLocalCards((prev) => {
        if (!prev) return prev;
        const updated = prev.map((c) =>
          c.id === activeCardId ? { ...c, column_id: targetColumnId } : c
        );

        const columnCards = updated
          .filter((c) => c.column_id === targetColumnId)
          .sort((a, b) => a.position - b.position);

        if (overCard && overCard.column_id === targetColumnId) {
          const oldIndex = columnCards.findIndex((c) => c.id === activeCardId);
          const newIndex = columnCards.findIndex((c) => c.id === overId);
          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            const reordered = arrayMove(columnCards, oldIndex, newIndex);
            reordered.forEach((c, i) => (c.position = i));
            const otherCards = updated.filter(
              (c) => c.column_id !== targetColumnId
            );
            return [...otherCards, ...reordered];
          }
        }

        const inCol = columnCards.filter((c) => c.id !== activeCardId);
        const movedCard = columnCards.find((c) => c.id === activeCardId);
        if (movedCard) {
          inCol.push(movedCard);
          inCol.forEach((c, i) => (c.position = i));
          const otherCards = updated.filter(
            (c) => c.column_id !== targetColumnId
          );
          return [...otherCards, ...inCol];
        }

        return updated;
      });
    },
    [localCards, columns]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!localCards || !over) {
        setLocalCards(null);
        return;
      }

      const activeCardId = String(active.id);
      const overId = String(over.id);
      const activeCard = localCards.find((c) => c.id === activeCardId);
      if (!activeCard) {
        setLocalCards(null);
        return;
      }

      const overCard = localCards.find((c) => c.id === overId);
      const overColumn = columns.find((c) => c.id === overId);
      const targetColumnId = overCard
        ? overCard.column_id
        : overColumn
          ? overColumn.id
          : activeCard.column_id;

      let finalCards = localCards.map((c) =>
        c.id === activeCardId ? { ...c, column_id: targetColumnId } : c
      );

      const columnCards = finalCards
        .filter((c) => c.column_id === targetColumnId)
        .sort((a, b) => a.position - b.position);

      if (overCard) {
        const oldIndex = columnCards.findIndex((c) => c.id === activeCardId);
        const newIndex = columnCards.findIndex((c) => c.id === overId);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          const reordered = arrayMove(columnCards, oldIndex, newIndex);
          reordered.forEach((c, i) => (c.position = i));
        } else {
          columnCards.forEach((c, i) => (c.position = i));
        }
      } else {
        columnCards.forEach((c, i) => (c.position = i));
      }

      const updates = columnCards.map((c) => ({
        id: c.id,
        column_id: c.column_id,
        position: c.position,
      }));

      const originalCard = cards.find((c) => c.id === activeCardId);
      if (originalCard) {
        const origCol = cards
          .filter(
            (c) =>
              c.column_id === originalCard.column_id &&
              c.id !== activeCardId
          )
          .sort((a, b) => a.position - b.position);
        origCol.forEach((c, i) => {
          if (c.position !== i) {
            updates.push({ id: c.id, column_id: c.column_id, position: i });
          }
        });
      }

      if (updates.length > 0) {
        reorderCards(updates);
      }

      setLocalCards(null);
    },
    [localCards, columns, cards, reorderCards]
  );

  const handleAddColumn = () => {
    setIsAddingColumn(true);
    setTimeout(() => addColumnRef.current?.focus(), 0);
  };

  const commitAddColumn = () => {
    const trimmed = newColumnName.trim();
    if (trimmed) {
      createColumn({ title: trimmed, position: columns.length });
    }
    setNewColumnName("");
    setIsAddingColumn(false);
  };

  const activePillar = activeCard?.content_pillar_id
    ? pillars.find((p) => p.id === activeCard.content_pillar_id)
    : undefined;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 min-w-0 overflow-x-auto">
        <div className="flex w-max gap-4 p-6 min-h-[calc(100svh-48px)]">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={cardsByColumn.get(column.id) ?? []}
              pillars={pillars}
              onCardClick={onCardClick}
              onDeleteCard={deleteCard}
              onRenameColumn={(id, title) => updateColumn(id, { title })}
              onDeleteColumn={deleteColumn}
              onAddCard={onNewCard}
            />
          ))}

          <div className="w-[272px] shrink-0">
            {isAddingColumn ? (
              <Input
                ref={addColumnRef}
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                onBlur={commitAddColumn}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitAddColumn();
                  if (e.key === "Escape") {
                    setNewColumnName("");
                    setIsAddingColumn(false);
                  }
                }}
                placeholder="Column name"
                className="h-7 text-sm font-semibold"
              />
            ) : (
              <button
                className="flex items-center gap-1 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={handleAddColumn}
              >
                <IconPlus className="size-4" />
                Add column
              </button>
            )}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="w-[256px] rotate-2 opacity-90">
            <div className="rounded-lg border bg-card p-3 shadow-lg space-y-2">
              {activeCard.media_url && (
                <div className="aspect-video overflow-hidden rounded-sm">
                  <img
                    src={activeCard.media_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <h4 className="text-sm font-semibold">{activeCard.title}</h4>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {activeCard.caption}
              </p>
              {activePillar && (
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-muted">
                  {activePillar.name}
                </span>
              )}
            </div>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
