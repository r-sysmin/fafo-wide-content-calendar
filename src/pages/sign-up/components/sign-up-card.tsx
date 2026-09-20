import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { DEFAULT_AUTHED_ROUTE } from "@/lib/auth/constants";

type ViewState = "form" | "success";

export default function SignUpCard() {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [view, setView] = useState<ViewState>("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // The confirmation link must land on /auth/callback — that is the only
          // route that exchanges the code for a session. Pointing it at a protected
          // route (it used to say /create) races the auth guard, so the visitor is
          // bounced to /sign-in still signed out. See docs/design/auth.md.
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: fullName,
          },
        },
      });

      setSubmitting(false);

      if (error) {
        setError(error.message || "Sign up failed. Please try again.");
        return;
      }

      if (data.session) {
        await refreshSession();
        navigate(DEFAULT_AUTHED_ROUTE);
        return;
      }

      setView("success");
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    }
  };

  if (view === "success") {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <p className="text-sm font-semibold tracking-wide">Content Calendar</p>
          <h1 className="text-2xl font-semibold">Check your email</h1>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            We sent a confirmation link to{" "}
            <span className="text-foreground font-medium">{email}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Click the link to activate your account and start planning content.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <p className="text-sm font-semibold tracking-wide">Content Calendar</p>
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Start planning content today
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* The ONE brand-compliant SSO button set. Do not restyle or rebuild it
            inline — see docs/design/auth.md. It always sends OAuth to
            ${origin}/auth/callback. */}
        <SocialAuthButtons mode="signup" />

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or
          </span>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input
              id="full-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
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
            {submitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex-col space-y-2 text-center text-sm">
        <p className="text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="text-foreground font-medium hover:underline"
          >
            Sign in &rarr;
          </Link>
        </p>
        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground hover:underline"
        >
          Back to home
        </Link>
      </CardFooter>
    </Card>
  );
}
