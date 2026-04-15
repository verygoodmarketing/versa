import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js proxy (edge middleware) — handles two concerns:
 *
 * 1. Subdomain routing: requests to {slug}.groundworklocal.com are rewritten
 *    to /sites/{slug} so the public site-rendering route can serve the business
 *    site without redirecting the user away from their custom subdomain.
 *
 * 2. Supabase auth proxy: refreshes sessions and protects dashboard/onboarding
 *    routes for requests to the main app domain.
 *
 * When Supabase env vars are not configured (e.g. during initial deployment
 * before credentials are set), the proxy passes through without auth checks.
 */
export async function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  // ── Subdomain routing ──────────────────────────────────────────────────────
  // Matches {slug}.groundworklocal.com but NOT www.groundworklocal.com
  const subdomainMatch = host.match(
    /^(?!www\.)([a-z0-9-]+)\.groundworklocal\.com(?::\d+)?$/i
  );

  if (subdomainMatch) {
    const slug = subdomainMatch[1];
    const url = request.nextUrl.clone();
    // Preserve any path after the root (e.g. for future multi-page sites)
    url.pathname = `/sites/${slug}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── Supabase auth proxy ────────────────────────────────────────────────────
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Pass through if Supabase is not configured yet
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session — important: do not add logic between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protect /onboarding/step-2 through step-5 and /dashboard
  const isProtectedOnboarding = /^\/onboarding\/step-[2-5]/.test(pathname);
  const isDashboard =
    pathname.startsWith("/dashboard") &&
    !pathname.startsWith("/dashboard/auth");

  if ((isProtectedOnboarding || isDashboard) && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding/step-1";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - /api/trpc (tRPC API — handles its own auth)
     * - public files (images, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
