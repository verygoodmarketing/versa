"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

/**
 * Sticky footer CTA banner for blog posts and SEO landing pages.
 *
 * Displays:
 *   - Headline: "Get your free website in 5 minutes"
 *   - Sub-text: "No credit card required. Cancel anytime."
 *   - Button: "Start free trial" → /onboarding/step-1
 *
 * Dismissible (stored in sessionStorage so it re-appears on next visit).
 * Avoids hydration mismatch by only rendering after mount.
 */
export function FreeTrialCTABanner() {
  // null = not yet mounted (SSR / hydration guard), true = visible, false = dismissed
  const [visible, setVisible] = useState<boolean | null>(null);

  useEffect(() => {
    const dismissed =
      sessionStorage.getItem("free-trial-banner-dismissed") === "true";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(!dismissed);
  }, []);

  if (!visible) return null;

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.10)]"
      aria-label="Free trial offer"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Copy */}
          <div className="text-center sm:text-left flex-1 min-w-0">
            <p className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
              Get your free website in 5 minutes
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              No credit card required. Cancel anytime.
            </p>
          </div>

          {/* CTA + dismiss */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              href="/onboarding/step-1"
              className="inline-flex items-center justify-center gap-1.5 bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25 active:scale-95 whitespace-nowrap"
            >
              Start free trial
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem("free-trial-banner-dismissed", "true");
                setVisible(false);
              }}
              aria-label="Dismiss free trial banner"
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-lg leading-none"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
