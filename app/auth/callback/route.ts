import { createServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Supabase Auth callback — handles OAuth redirects (e.g. Google).
 * Exchanges the one-time code for a session, then redirects.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding/step-2";

  if (code) {
    const supabase = await createServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — redirect to step 1 with an error hint
  return NextResponse.redirect(`${origin}/onboarding/step-1?error=auth_callback_failed`);
}
