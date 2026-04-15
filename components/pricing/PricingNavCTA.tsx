"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

/**
 * Auth-aware nav CTA for the pricing page.
 * - Authenticated users: "Go to dashboard" → /dashboard
 * - Unauthenticated users: "Get started free" → /onboarding/step-1
 */
export function PricingNavCTA() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
    });
  }, []);

  // While loading, render a placeholder so the nav height stays stable
  if (isAuthenticated === null) {
    return (
      <div className="bg-brand-600/30 text-transparent text-sm font-semibold px-4 py-2 rounded-xl select-none">
        Get started free
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <Link
        href="/dashboard"
        className="bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors"
      >
        Go to dashboard
      </Link>
    );
  }

  return (
    <Link
      href="/onboarding/step-1"
      className="bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors"
    >
      Get started free
    </Link>
  );
}
