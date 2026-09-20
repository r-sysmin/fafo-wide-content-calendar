import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { useAuth } from "@/lib/auth/auth-provider";
import { DEFAULT_AUTHED_ROUTE } from "@/lib/auth/constants";
import { Toaster } from "@/components/ui/sonner";
import { SeedDataProvider, SupabaseDataProvider } from "@/lib/data-provider";
import { FilterProvider } from "@/lib/filter-context";
import ApplicationLayout from "./layouts/application-layout";
import WorkspaceLayout01 from "./layouts/workspace-layout-01";
import Landing from "./pages/landing";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import AuthCallback from "./pages/auth/callback";
import CreatePage from "./pages/create";
import CalendarPage from "./pages/publish";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 30_000,
    },
    mutations: {
      retry: false,
    },
  },
});

const WorkspaceProviders = ({ children }: { children: ReactNode }) => {
  return (
    <SupabaseDataProvider>
      <FilterProvider>{children}</FilterProvider>
    </SupabaseDataProvider>
  );
};

const AuthAwareWorkspace = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  }

  return (
    <WorkspaceProviders>
      <WorkspaceLayout01 />
    </WorkspaceProviders>
  );
};

/**
 * /sign-in and /sign-up are for signed-OUT visitors only. Once a session exists
 * (including one established by the OAuth popup) these routes send the user into
 * the app instead of re-rendering the form. See the route table in
 * docs/design/auth.md.
 */
const RedirectIfAuthed = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={DEFAULT_AUTHED_ROUTE} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route element={<ApplicationLayout />}>
            <Route path="/" element={<Landing />} />
            <Route
              path="/sign-in"
              element={
                <RedirectIfAuthed>
                  <SignIn />
                </RedirectIfAuthed>
              }
            />
            <Route
              path="/sign-up"
              element={
                <RedirectIfAuthed>
                  <SignUp />
                </RedirectIfAuthed>
              }
            />
            {/* Managed OAuth + email-confirmation return. SocialAuthButtons and
                signUp's emailRedirectTo always point here, so this route must exist
                or SSO / email confirmation dead-ends on a 404. */}
            <Route path="/auth/callback" element={<AuthCallback />} />
          </Route>

          {/* Demo routes — seed data, no auth */}
          <Route
            element={
              <SeedDataProvider>
                <FilterProvider>
                  <WorkspaceLayout01 />
                </FilterProvider>
              </SeedDataProvider>
            }
          >
            <Route path="/demo/create" element={<CreatePage />} />
            <Route path="/demo/calendar" element={<CalendarPage />} />
            <Route path="/demo/publish" element={<CalendarPage />} />
          </Route>

          {/* App routes — Supabase data when signed in, seed data otherwise */}
          <Route element={<AuthAwareWorkspace />}>
            <Route path="/create" element={<CreatePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/publish" element={<CalendarPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
