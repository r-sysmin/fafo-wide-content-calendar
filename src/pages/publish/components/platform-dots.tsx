import {
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandTiktok,
} from "@tabler/icons-react";

const PLATFORM_CONFIG: Record<string, { icon: typeof IconBrandInstagram; color: string; label: string }> = {
  instagram: { icon: IconBrandInstagram, color: "#E1306C", label: "Instagram" },
  linkedin: { icon: IconBrandLinkedin, color: "#0A66C2", label: "LinkedIn" },
  x: { icon: IconBrandX, color: "#000000", label: "X" },
  tiktok: { icon: IconBrandTiktok, color: "#00B4D8", label: "TikTok" },
};

interface PlatformDotsProps {
  platforms: string[];
  showLabel?: boolean;
}

export function PlatformDots({ platforms, showLabel }: PlatformDotsProps) {
  return (
    <span className="inline-flex items-center gap-1">
      {platforms.map((p) => {
        const config = PLATFORM_CONFIG[p];
        if (!config) return null;
        return (
          <span
            key={p}
            className="inline-block size-2 rounded-full"
            style={{ backgroundColor: config.color }}
            title={config.label}
          />
        );
      })}
      {showLabel && platforms.length === 1 && PLATFORM_CONFIG[platforms[0]] && (
        <span className="text-xs text-muted-foreground ml-0.5">
          {PLATFORM_CONFIG[platforms[0]].label}
        </span>
      )}
    </span>
  );
}

export { PLATFORM_CONFIG };
