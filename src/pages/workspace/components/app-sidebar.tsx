import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  IconChevronsLeft,
  IconLayoutGrid,
  IconCalendar,
  IconSettings,
  IconLogout,
  IconPlus,
  IconTrash,
  IconLogin,
  IconUserPlus,
  IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useShadcnSidebar,
  usePeekable,
} from "@/components/base/sidebar";
import { useAuth } from "@/lib/auth/auth-provider";
import { EXIT_DEMO_ROUTE, useIsDemo } from "@/lib/demo";
import { useDataProvider } from "@/lib/data-provider";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { ContentPillar } from "@/data/seed";

const PILLAR_COLOR_PRESETS = [
  "#7C3AED",
  "#2563EB",
  "#059669",
  "#D97706",
  "#DC2626",
  "#DB2777",
  "#0891B2",
  "#65A30D",
];

export function PeekPaneBody() {
  const { state, actions } = usePeekable();
  const { setOpenMobile } = useShadcnSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  // Demo-ness comes from useIsDemo() and nothing else — never re-derive it from the
  // pathname here. See src/lib/demo.ts.
  const demo = useIsDemo();
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [profile, setProfile] = useState<{ full_name: string | null; avatar_url: string | null; initials: string | null } | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    let cancelled = false;
    supabase
      .from("profiles")
      .select("full_name, avatar_url, initials")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfile(data ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const defaultName =
    profile?.full_name ??
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    "";
  const defaultEmail = user?.email ?? "";
  const avatarUrl =
    profile?.avatar_url ??
    (user?.user_metadata?.avatar_url as string | undefined) ??
    (user?.user_metadata?.picture as string | undefined) ??
    null;
  const initials =
    profile?.initials ??
    (defaultName
      ? defaultName
          .split(" ")
          .map((s) => s[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : defaultEmail.slice(0, 2).toUpperCase());
  const defaultTimezone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC";
  const [fullName, setFullName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [timezone, setTimezone] = useState(defaultTimezone);

  const timezoneOptions = [
    defaultTimezone,
    "UTC",
    "America/Los_Angeles",
    "America/New_York",
    "Europe/London",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Australia/Sydney",
  ].filter((tz, i, arr) => arr.indexOf(tz) === i);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Preferences saved");
    setPrefsOpen(false);
  };

  const navItems = [
    {
      label: "Create",
      icon: IconLayoutGrid,
      path: demo ? "/demo/create" : "/create",
    },
    {
      label: "Calendar",
      icon: IconCalendar,
      path: demo ? "/demo/calendar" : "/calendar",
    },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center">
          <span className="text-sm font-semibold">Content Calendar</span>
          <div className="flex-1" />
          {state.isExpanded && (
            <SidebarMenuButton
              size="sm"
              className="hidden w-fit opacity-0 pointer-events-none group-hover/sidebar-pane:opacity-100 group-hover/sidebar-pane:pointer-events-auto transition-opacity duration-200 md:flex"
              onClick={() => actions.collapse("unpin")}
            >
              <IconChevronsLeft />
            </SidebarMenuButton>
          )}
          <SidebarMenuButton
            size="sm"
            className="w-fit md:hidden"
            onClick={() => setOpenMobile(false)}
          >
            <IconChevronsLeft />
          </SidebarMenuButton>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      isActive={active}
                      onClick={() => navigate(item.path)}
                      className={active ? "text-primary [&>svg]:text-primary" : "[&>svg]:text-primary"}
                    >
                      <item.icon className="size-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer order is fixed: the leave affordance comes first, then Settings, then
          the account row LAST. Which leave affordance shows is decided by useIsDemo()
          alone — "Exit demo" on /demo/* (there is no session to sign out of) and
          "Log out" when authenticated. See docs/design/auth.md. */}
      <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          {demo ? (
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="[&>svg]:text-primary">
                <Link to={EXIT_DEMO_ROUTE}>
                  <IconX className="size-4" />
                  <span>Exit demo</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={handleSignOut} className="[&>svg]:text-primary">
                <IconLogout className="size-4" />
                <span>Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => setPrefsOpen(true)} className="[&>svg]:text-primary">
              <IconSettings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {!user && (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/sign-in")} className="[&>svg]:text-primary">
                  <IconLogin className="size-4" />
                  <span>Sign in</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/sign-up")} className="[&>svg]:text-primary">
                  <IconUserPlus className="size-4" />
                  <span>Create account</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
        {/* Account row — always last. */}
        {!demo && user && (
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar className="size-7">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={defaultName || defaultEmail} />}
              <AvatarFallback className="text-xs">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{defaultName || defaultEmail}</span>
              {defaultName && (
                <span className="truncate text-xs text-muted-foreground">{defaultEmail}</span>
              )}
            </div>
          </div>
        )}
      </SidebarFooter>

      <Sheet open={prefsOpen} onOpenChange={setPrefsOpen}>
        <SheetContent side="right" className="flex flex-col gap-0 sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Preferences</SheetTitle>
            <SheetDescription>
              Manage your account and workspace settings.
            </SheetDescription>
          </SheetHeader>
          <form
            onSubmit={handleSavePreferences}
            className="flex flex-1 flex-col gap-6 overflow-y-auto px-1 py-6"
          >
            <section className="space-y-4">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Account
              </h3>
              <div className="space-y-2">
                <Label htmlFor="prefs-name">Full name</Label>
                <Input
                  id="prefs-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prefs-email">Email</Label>
                <Input
                  id="prefs-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
            </section>
            <section className="space-y-4">
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Workspace
              </h3>
              <div className="space-y-2">
                <Label htmlFor="prefs-timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger id="prefs-timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezoneOptions.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tz}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </section>
            <ContentPillarsSection />
            <SheetFooter className="mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPrefsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <PeekPaneBody />
    </Sidebar>
  );
}

function ContentPillarsSection() {
  const provider = useDataProvider();
  const { data: pillars } = provider.useContentPillars();
  const { mutate: createPillar, isPending: creating } = provider.useCreateContentPillar();

  const handleAdd = () => {
    const nextColor =
      PILLAR_COLOR_PRESETS[pillars.length % PILLAR_COLOR_PRESETS.length];
    createPillar({ name: "New pillar", color: nextColor });
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Content pillars
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          onClick={handleAdd}
          disabled={creating}
        >
          <IconPlus className="size-3.5" />
          Add
        </Button>
      </div>
      {pillars.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          No pillars yet. Add one to start tagging posts.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {pillars.map((pillar) => (
            <PillarRow key={pillar.id} pillar={pillar} />
          ))}
        </ul>
      )}
    </section>
  );
}

function PillarRow({ pillar }: { pillar: ContentPillar }) {
  const provider = useDataProvider();
  const { mutate: updatePillar } = provider.useUpdateContentPillar();
  const { mutate: deletePillar } = provider.useDeleteContentPillar();
  const [name, setName] = useState(pillar.name);

  const commitName = () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === pillar.name) {
      setName(pillar.name);
      return;
    }
    updatePillar(pillar.id, { name: trimmed });
  };

  return (
    <li className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label="Change color"
            className="size-5 shrink-0 rounded-full"
            style={{ backgroundColor: pillar.color }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-4 gap-1.5">
            {PILLAR_COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Set color ${c}`}
                onClick={() => updatePillar(pillar.id, { color: c })}
                className="size-6 rounded-full"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={commitName}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="h-8 flex-1"
      />
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-destructive"
            aria-label="Delete pillar"
          >
            <IconTrash className="size-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{pillar.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Posts and cards tagged with this pillar will keep their content
              but lose the pillar tag. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePillar(pillar.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}
