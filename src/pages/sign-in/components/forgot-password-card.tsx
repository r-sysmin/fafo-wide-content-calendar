import { useState } from "react";
import { IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface ForgotPasswordCardProps {
  initialEmail: string;
  onBack: () => void;
}

export default function ForgotPasswordCard({
  initialEmail,
  onBack,
}: ForgotPasswordCardProps) {
  const [email, setEmail] = useState(initialEmail);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  };

  const handleResend = async () => {
    setSubmitting(true);
    await supabase.auth.resetPasswordForEmail(email);
    setSubmitting(false);
  };

  if (sent) {
    return (
      <Card className="w-full max-w-sm">
        <CardHeader className="space-y-1 text-center">
          <p className="text-sm font-semibold tracking-wide">Content Calendar</p>
          <h1 className="text-2xl font-semibold">Check your email</h1>
        </CardHeader>

        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-foreground">
            We sent a password reset link to{" "}
            <span className="font-medium">{email}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Click the link in your email to set a new password.
          </p>

          <Separator />

          <p className="text-sm text-muted-foreground">
            Didn&apos;t get it? Check spam or{" "}
            <button
              type="button"
              className="text-foreground font-medium hover:underline"
              onClick={handleResend}
              disabled={submitting}
            >
              Resend email
            </button>
          </p>

          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            onClick={onBack}
          >
            &larr; Back to sign in
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <p className="text-sm font-semibold tracking-wide">Content Calendar</p>
        <h1 className="text-2xl font-semibold">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send a reset link
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <form onSubmit={handleReset} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <Input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
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
            {submitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>

        <button
          type="button"
          className="w-full text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={onBack}
        >
          &larr; Back to sign in
        </button>
      </CardContent>
    </Card>
  );
}
