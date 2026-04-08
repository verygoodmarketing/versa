import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js middleware — handles:
 * 1. Supabase session refresh (keeps auth tokens fresh)
 * 2. Auth gating: /onboarding/step-2 through step-5 and /dashboard require a session
 * 3. Onboarding completion check: if onboardingComplete, redirect /onboarding/* → /dashboard
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          supabaseResponse = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // Refresh session (important: do not add logic between createServerClient and getUser)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Protected routes: /onboarding/step-2 through step-5, /dashboard
  const isProtectedOnboarding = /^\/onboarding\/step-[2-5]/.test(pathname);
  const isDashboard = pathname.startsWith("/dashboard");

  if ((isProtectedOnboarding || isDashboard) && !user) {
    // Not authenticated → redirect to step 1
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding/step-1";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and Next.js internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
