# Auth

> **⚠️ Three rules that are shipped code, not suggestions:**
> - **SSO buttons:** render `<SocialAuthButtons>` from
>   `@/components/base/social-auth-buttons` (brand-compliant Google + Apple) on every
>   auth surface — `/sign-in` and `/sign-up`. Never hand-roll "Continue with
>   Google/Apple" and never restyle it with the theme color. OAuth goes through the
>   Lovable broker inside that component.
> - **Redirect:** always `${window.location.origin}/auth/callback` — for OAuth
>   `redirect_uri` AND for sign-up's `emailRedirectTo`. Never a bare origin (strands the
>   user on the marketing landing) and never a protected route like `/create` (races the
>   auth guard, so the user is bounced to `/sign-in` still signed out).
> - **Leave affordance:** the sidebar footer shows "Log out" when authenticated and
>   "Exit demo" on `/demo/*`, decided by `useIsDemo()` (`src/lib/demo.ts`) and nothing
>   else.

Every template ships with real Supabase auth — Google, Apple, and email.
Auth is not simulated, not deferred, not a SPEC-GAP.

---

## AuthProvider

Wraps the entire app. Exposes `{ user, session, loading, signOut }`.

```typescript
// src/lib/auth/auth-provider.tsx
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Register listener FIRST (before getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // 2. Then hydrate initial state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear(); // wipe React Query cache
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
```

**Why listener before getSession**: If the user arrives via an OAuth callback,
`onAuthStateChange` fires a `SIGNED_IN` event immediately. If `getSession`
runs first and `onAuthStateChange` is registered after, the event is missed
and the user appears unauthenticated.

---

## ProtectedRoute

Redirects unauthenticated users to `/sign-in`. Preserves the `from` location
so they return after signing in.

```typescript
// src/components/protected-route.tsx
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSkeleton />;
  if (!user) return <Navigate to="/sign-in" state={{ from: location }} replace />;
  return <>{children}</>;
}
```

**In App.tsx**:
```typescript
<Route element={<ProtectedRoute><SupabaseDataProvider><WorkspaceLayout /></SupabaseDataProvider></ProtectedRoute>}>
  <Route path="/goals" element={<GoalsPage />} />
  <Route path="/feed" element={<FeedPage />} />
</Route>
```

---

## Sign In page (`/sign-in`)

```
┌──────────────────────────────────────────┐
│  [Logo] App Name                         │
│  Sign in                                 │
│  Welcome back to your workspace          │
│                                          │
│  [Google icon] Continue with Google      │  ← full width, primary
│  [Apple icon]  Continue with Apple       │  ← full width, outline
│                                          │
│  ────────── or continue with email ───── │
│                                          │
│  Email                                   │
│  [you@company.com…                    ]  │
│                                          │
│  Password                [Forgot?]       │
│  [Password…                           ]  │
│                                          │
│  [Sign in]                               │  ← full width, primary
│                                          │
│  Create account  ·  View demo            │
└──────────────────────────────────────────┘
```

**OAuth buttons** — render the shared component. Do not write a `handleOAuth` of your
own; the broker call, the branding, and the redirect all live inside it:

```tsx
import { SocialAuthButtons } from "@/components/base/social-auth-buttons";

<SocialAuthButtons mode="signin" />   // "Sign up with …" on /sign-up: mode="signup"
```

Inside, it calls the Lovable managed client (never `supabase.auth.signInWithOAuth`,
which fails with "missing OAuth secret") and always sends the browser to
`${window.location.origin}/auth/callback`.

**`/auth/callback`** (`src/pages/auth/callback.tsx`) is where every OAuth return and
every email-confirmation link lands. It accepts both shapes the broker can return —
fragment tokens (`#access_token=…`) and a PKCE `?code=…` — establishes the session, and
then navigates to `DEFAULT_AUTHED_ROUTE` (`src/lib/auth/constants.ts`). The route must
stay registered in `App.tsx`, or SSO 404s.

**Email sign-in**:
```typescript
const handleEmailSignIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    if (error.message.includes('Email not confirmed')) {
      setError('Please confirm your email before signing in');
    } else {
      setError('Invalid email or password');
    }
  } else {
    const from = location.state?.from?.pathname || '/goals';
    navigate(from, { replace: true });
  }
};
```

**Forgot password**:
```typescript
await supabase.auth.resetPasswordForEmail(email);
toast('Check your email for a reset link');
```

Note the deliberate absence of a `redirectTo` here. A recovery link must NOT be sent to
`/auth/callback` — that signs the user straight in and gives them no chance to set a new
password. Recovery uses the Supabase project's own reset flow.

---

## Sign Up page (`/sign-up`)

Same layout as sign-in. Same `<SocialAuthButtons mode="signup" />`.

On successful signup: show "Check your email to confirm your account" inline.
Do NOT auto-redirect. Do NOT auto-sign-in. Email confirmation is required.

```typescript
const { error } = await supabase.auth.signUp({
  email,
  password,
  // MUST be /auth/callback. That is the only route that exchanges the confirmation
  // code for a session; a protected route like /create bounces the user to /sign-in
  // still signed out.
  options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
});
if (error) {
  setError(error.message);
} else {
  setShowConfirmation(true); // renders the "check your email" message
}
```

---

## The leave affordance — log out / exit demo

The sidebar footer's leave affordance is route-aware, and `useIsDemo()`
(`src/lib/demo.ts`) is the ONE thing that decides it. Never re-branch on the pathname
yourself.

- **Authenticated `/*`** → "Log out", calls `signOut()` from AuthProvider.
- **Public `/demo/*`** → "Exit demo" with a close icon, a plain navigation to
  `EXIT_DEMO_ROUTE` (`/`). The demo has no session, so signing out would be meaningless.

Layout is fixed: the leave affordance sits ABOVE Settings, and the account row is always
last. The footer is in `src/pages/workspace/components/app-sidebar.tsx` (`PeekPaneBody`)
and wires the shadcn sidebar primitives directly, because it also carries Settings and
the signed-out Sign in / Create account items:

```tsx
const demo = useIsDemo();
...
{demo ? (
  <SidebarMenuButton asChild>
    <Link to={EXIT_DEMO_ROUTE}>
      <IconX className="size-4" />
      <span>Exit demo</span>
    </Link>
  </SidebarMenuButton>
) : (
  <SidebarMenuButton onClick={handleSignOut}>
    <IconLogout className="size-4" />
    <span>Log out</span>
  </SidebarMenuButton>
)}
{/* Settings … then the account row last */}
```

---

## Route table

| Route | Access | Behavior |
|-------|--------|----------|
| `/` | public | Landing page |
| `/sign-in` | public | Redirects to default app route if already authenticated |
| `/sign-up` | public | Redirects to default app route if already authenticated |
| `/auth/callback` | public | OAuth + email-confirmation return; sets the session, then goes to `DEFAULT_AUTHED_ROUTE` |
| `/demo/*` | public | Seed data, SeedDataProvider, no auth |
| `/*` (app routes) | **protected** | ProtectedRoute → redirects to `/sign-in` if not authenticated |

---

## Anti-patterns

```typescript
// ❌ Direct supabase OAuth — "missing OAuth secret" error
supabase.auth.signInWithOAuth({ provider: 'google' }); // bypasses Lovable broker
// ✅ Render the shared component; it calls the Lovable broker for you:
<SocialAuthButtons mode="signin" />

// ❌ Hand-rolled SSO buttons — off-brand, and they drift from the shared redirect rule
<Button variant="outline" onClick={() => handleOAuth('google')}><IconBrandGoogle /> …

// ❌ Redirecting anywhere but /auth/callback
redirect_uri: window.location.origin          // strands the user on the landing page
redirect_uri: `${window.location.origin}/create`  // protected route — races the auth guard
emailRedirectTo: `${window.location.origin}/create` // same; user lands signed OUT
// ✅
redirect_uri: `${window.location.origin}/auth/callback`

// ❌ Re-deriving demo-ness in a component
const isDemo = location.pathname.startsWith('/demo');
// ✅
const demo = useIsDemo(); // src/lib/demo.ts

// ❌ Simulated auth
setTimeout(() => navigate('/goals'), 800); // not real auth

// ❌ OAuth toast instead of real call
toast('Google sign-in not configured'); // the providers ARE configured

// ❌ SPEC-GAP comment instead of implementation
// SPEC-GAP: no Supabase auth; simulate sign-in

// ❌ getSession before onAuthStateChange listener
supabase.auth.getSession(); // if OAuth callback, SIGNED_IN event is missed
supabase.auth.onAuthStateChange(...); // too late

// ❌ No React Query cache clear on sign-out
// User B signs in and sees User A's cached data

// ❌ Auto-confirm email signups
// supabase--configure_auth with autoConfirmEmail: true
// Users should verify their email
```
