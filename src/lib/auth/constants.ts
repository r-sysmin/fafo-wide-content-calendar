/**
 * The single source of truth for post-auth navigation.
 *
 * After sign-in, sign-up confirmation, or an OAuth callback the user lands HERE — the
 * app's first authenticated screen — never `/` (the marketing landing) and never a
 * route the auth guard is still deciding about.
 * See docs/design/auth.md.
 */
export const DEFAULT_AUTHED_ROUTE = "/create";

/** Where the user lands after signing OUT — the marketing landing. */
export const SIGNED_OUT_ROUTE = "/";
