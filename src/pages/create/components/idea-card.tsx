import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/base/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { IconDotsVertical, IconTrash } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Card as CardType, ContentPillar } from "@/data/seed";

const PILLAR_COLOR_MAP: Record<string, "purple" | "blue" | "green" | "orange"> = {
  "#7C3AED": "purple",
  "#2563EB": "blue",
  "#059669": "green",
  "#D97706": "orange",
};

interface IdeaCardProps {
  card: CardType;
  pillar: ContentPillar | undefined;
  onClick: () => void;
  onDelete: () => void;
}

export function IdeaCard({ card, pillar, onClick, onDelete }: IdeaCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group/card cursor-grab active:cursor-grabbing hover:bg-muted/60 transition-colors"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("[data-no-card-click]")) return;
        onClick();
      }}
    >
      <CardContent className="p-3 space-y-2">
        {card.media_url && (
          <AspectRatio ratio={16 / 9} className="overflow-hidden">
            <img
              src={card.media_url}
              alt=""
              className="h-full w-full object-cover"
            />
          </AspectRatio>
        )}
        <div className="flex items-start justify-between gap-1">
          <h4 className="text-sm font-semibold text-foreground leading-tight">
            {card.title}
          </h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                data-no-card-click
                className="shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity p-0.5 hover:bg-accent text-primary"
                onClick={(e) => e.stopPropagation()}
              >
                <IconDotsVertical className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" data-no-card-click>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              >
                Edit
              </DropdownMenuItem>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {card.caption}
        </p>
        {pillar && (
          <Badge
            color={PILLAR_COLOR_MAP[pillar.color] ?? "gray"}
            className="text-xs"
          >
            {pillar.name}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
