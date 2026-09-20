import {
  IconChevronLeft,
  IconChevronRight,
  IconLayoutGrid,
  IconCalendarEvent,
  IconList,
  IconPlus,
} from "@tabler/icons-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/base/button";
import {
  SidebarMenuButton,
  SidebarHoverArea,
  usePeekable,
  useShadcnSidebar,
} from "@/components/base/sidebar";
import { IconMenu2 } from "@tabler/icons-react";
import { useDataProvider } from "@/lib/data-provider";
import { useAuth } from "@/lib/auth/auth-provider";
import { Link } from "react-router-dom";
import type { CalendarView } from "./use-calendar-state";
import { PLATFORM_CONFIG } from "./platform-dots";

const PLATFORM_OPTIONS = ["instagram", "linkedin", "x", "tiktok"] as const;

const TIMEZONES = [
  { value: "-5", label: "UTC-5" },
  { value: "-4", label: "UTC-4" },
  { value: "0", label: "UTC" },
  { value: "1", label: "UTC+1" },
  { value: "5.5", label: "UTC+5:30" },
  { value: "8", label: "UTC+8" },
];

interface CalendarToolbarProps {
  label: string;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onNavigateBack: () => void;
  onNavigateForward: () => void;
  activePlatform: string | undefined;
  onPlatformChange: (platform: string | undefined) => void;
  activeContentPillarIds: string[];
  onContentPillarToggle: (pillarId: string) => void;
  onNewPost: () => void;
}

export function CalendarToolbar({
  label,
  view,
  onViewChange,
  onNavigateBack,
  onNavigateForward,
  activePlatform,
  onPlatformChange,
  activeContentPillarIds,
  onContentPillarToggle,
  onNewPost,
}: CalendarToolbarProps) {
  const { state, actions } = usePeekable();
  const { setOpenMobile } = useShadcnSidebar();
  const provider = useDataProvider();
  const { data: pillars } = provider.useContentPillars();
  const { user } = useAuth();

  const platformLabel = activePlatform
    ? PLATFORM_CONFIG[activePlatform]?.label ?? "Filtered"
    : "All Posts";

  const pillarLabel =
    activeContentPillarIds.length > 0
      ? `${activeContentPillarIds.length} tag${activeContentPillarIds.length > 1 ? "s" : ""}`
      : "Tags";

  return (
    <header className="relative z-20 flex flex-col gap-2 px-4 pb-2">
      <div className="flex h-12 items-center gap-2">
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
          className="md:hidden"
          onClick={() => setOpenMobile(true)}
        >
          <IconMenu2 />
        </SidebarMenuButton>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onNavigateBack}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-semibold min-w-[160px] text-center">
            {label}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            onClick={onNavigateForward}
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>

        <div className="flex-1" />

        {!user && (
          <Button variant="ghost" size="sm" asChild>
            <Link to="/sign-in">Sign in</Link>
          </Button>
        )}

        <ToggleGroup
          type="single"
          value={view}
          onValueChange={(v) => {
            if (v) onViewChange(v as CalendarView);
          }}
          size="sm"
          variant="outline"
        >
          <ToggleGroupItem value="week" aria-label="Week view">
            <IconLayoutGrid className="size-4" />
            <span className="hidden sm:inline ml-1 text-xs">Week</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="month" aria-label="Month view">
            <IconCalendarEvent className="size-4" />
            <span className="hidden sm:inline ml-1 text-xs">Month</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <IconList className="size-4" />
            <span className="hidden sm:inline ml-1 text-xs">List</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              {platformLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuCheckboxItem
              checked={!activePlatform}
              onCheckedChange={() => onPlatformChange(undefined)}
            >
              All Posts
            </DropdownMenuCheckboxItem>
            {PLATFORM_OPTIONS.map((p) => (
              <DropdownMenuCheckboxItem
                key={p}
                checked={activePlatform === p}
                onCheckedChange={() =>
                  onPlatformChange(activePlatform === p ? undefined : p)
                }
              >
                {PLATFORM_CONFIG[p]?.label ?? p}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-xs h-7">
              {pillarLabel}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {pillars.map((pillar) => (
              <DropdownMenuCheckboxItem
                key={pillar.id}
                checked={activeContentPillarIds.includes(pillar.id)}
                onCheckedChange={() => onContentPillarToggle(pillar.id)}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{ backgroundColor: pillar.color }}
                  />
                  {pillar.name}
                </span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Select defaultValue="-5">
          <SelectTrigger className="w-[90px] h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TIMEZONES.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        <Button size="sm" onClick={onNewPost}>
          <IconPlus className="size-4" />
          New Post
        </Button>
      </div>
    </header>
  );
}
