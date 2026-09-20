import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { SocialAuthButtons } from "@/components/base/social-auth-buttons";
import { useAuth } from "@/lib/auth/auth-provider";
import ForgotPasswordCard from "./forgot-password-card";

type ViewState = "sign-in" | "forgot-password";

export default function SignInCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshSession } = useAuth();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/create";

  const [view, setView] = useState<ViewState>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setSubmitting(false);
      if (error.message.includes("Email not confirmed")) {
        setError("Email not confirmed — check your inbox");
      } else {
        setError("Invalid email or password");
      }
      return;
    }

    const session = await refreshSession();
    if (!session) {
      setSubmitting(false);
      setError("We couldn't restore your session. Please try again.");
      return;
    }

    navigate(from, { replace: true });
  };

  if (view === "forgot-password") {
    return (
      <ForgotPasswordCard
        initialEmail={email}
        onBack={() => setView("sign-in")}
      />
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <p className="text-sm font-semibold tracking-wide">Content Calendar</p>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your workspace
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* The ONE brand-compliant SSO button set. Do not restyle or rebuild it
            inline — see docs/design/auth.md. It always sends OAuth to
            ${origin}/auth/callback. */}
        <SocialAuthButtons mode="signin" />

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              aria-label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setView("forgot-password")}
              >
                Forgot?
              </button>
            </div>
            <Input
              id="password"
              name="password"
              aria-label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting && <IconLoader2 className="animate-spin" />}
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex-col space-y-2 text-center text-sm">
        <p className="text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/sign-up"
            className="text-foreground font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
        <p className="text-muted-foreground">
          or{" "}
          <Link
            to="/demo/create"
            className="text-foreground font-medium hover:underline"
          >
            Try demo &rarr;
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
