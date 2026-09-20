import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/base/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useDataProvider } from "@/lib/data-provider";
import type { Card as CardType, ContentPillar } from "@/data/seed";

const PILLAR_COLOR_MAP: Record<string, "purple" | "blue" | "green" | "orange"> = {
  "#7C3AED": "purple",
  "#2563EB": "blue",
  "#059669": "green",
  "#D97706": "orange",
};

interface GalleryViewProps {
  onCardClick: (card: CardType) => void;
}

export function GalleryView({ onCardClick }: GalleryViewProps) {
  const provider = useDataProvider();
  const { data: cards } = provider.useCards({});
  const { data: pillars } = provider.useContentPillars();

  const pillarMap = useMemo(() => {
    const map = new Map<string, ContentPillar>();
    pillars.forEach((p) => map.set(p.id, p));
    return map;
  }, [pillars]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {cards.map((card) => {
        const pillar = card.content_pillar_id
          ? pillarMap.get(card.content_pillar_id)
          : undefined;
        return (
          <Card
            key={card.id}
            className="cursor-pointer hover:bg-muted/60 transition-colors"
            onClick={() => onCardClick(card)}
          >
            <CardContent className="p-4 space-y-3">
              {card.media_url && (
                <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-sm">
                  <img
                    src={card.media_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </AspectRatio>
              )}
              <h4 className="text-sm font-semibold text-foreground">
                {card.title}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-3">
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
      })}
    </div>
  );
}
