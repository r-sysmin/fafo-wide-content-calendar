# Fix "Sign up with Google does nothing"

## What's actually happening

The console output you pasted is all Lovable editor noise — ad-blocker `ERR_BLOCKED_BY_CONTENT_BLOCKER` entries for analytics pixels, plus devtools port warnings. None of it comes from the app.

The real issue is in the app code, confirmed by reading it:

1. `src/components/base/social-auth-buttons.tsx` handles two of the three OAuth outcomes. On a full-page redirect it returns early; on error it shows a message. But when the Lovable broker completes in a **popup** (which is what happens inside the editor preview), it returns tokens, the session is set — and the component does nothing. No navigation, so you sit on the sign-up page looking at an unchanged screen. The network log backs this up: `/auth/v1/user` returns 200 with a valid Google-authenticated user while the page stays put.

2. `/sign-in` and `/sign-up` are registered in `src/App.tsx` with no already-authenticated guard, so even once the session exists, those routes keep showing the form.

## The fix

**1. Navigate after popup success** — when the broker returns tokens (not a redirect, no error), refresh the auth context via `refreshSession()` and navigate to `DEFAULT_AUTHED_ROUTE`. The redirect and error branches stay exactly as they are.

**2. Guard the auth pages** — in `src/App.tsx`, send an authenticated visitor on `/sign-in` or `/sign-up` to `DEFAULT_AUTHED_ROUTE` instead of rendering the form. This is already the documented behaviour in the route table in `docs/design/auth.md`; it just was never implemented.

Nothing changes in the branding, the button markup, or the `${origin}/auth/callback` redirect rule.

## Verification

Drive the app with Playwright using the injected session to confirm an authenticated visitor hitting `/sign-in` lands on `/create`, and that the social buttons still render identically on both auth pages.