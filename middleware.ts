import { NextRequest, NextResponse } from "next/server";

/**
 * Pre-launch gate middleware.
 *
 * When PRE_LAUNCH_MODE=true, all routes except the root path and the
 * /api/waitlist endpoint are redirected back to / so visitors only see
 * the coming-soon / email-capture page.
 *
 * Passthrough paths (always allowed):
 *   /                     — the pre-launch landing page itself
 *   /api/waitlist         — email capture form submission
 *   /_next/*              — Next.js static assets and HMR
 *   /favicon.ico          — browser favicon request
 *   /opengraph-image*     — OG image generation
 *   /robots.txt           — crawler metadata
 *   /sitemap.xml          — crawler metadata
 *
 * To disable the gate: set PRE_LAUNCH_MODE to any value other than "true"
 * (or remove the env var entirely) and redeploy.
 */

const PRE_LAUNCH_MODE = process.env.PRE_LAUNCH_MODE === "true";

// Paths that are allowed through regardless of pre-launch state
const ALLOWED_PREFIXES = [
  "/_next/",
  "/api/waitlist",
  "/favicon.ico",
  "/opengraph-image",
  "/robots.txt",
  "/sitemap.xml",
];

export function middleware(request: NextRequest) {
  if (!PRE_LAUNCH_MODE) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  // Root is always allowed — it renders the PreLaunchPage
  if (pathname === "/") {
    return NextResponse.next();
  }

  // Allow essential system / API paths
  if (ALLOWED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Redirect everything else to the pre-launch page
  const url = request.nextUrl.clone();
  url.pathname = "/";
  return NextResponse.redirect(url, { status: 302 });
}

export const config = {
  // Run on all routes except pure static files already served by Next.js
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
