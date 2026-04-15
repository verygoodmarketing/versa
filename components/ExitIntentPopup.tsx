"use client";

import { useEffect, useState, useCallback } from "react";
import { track } from "@vercel/analytics";

const STORAGE_KEY = "gw_exit_intent_seen";

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const show = useCallback(() => {
    if (dismissed) return;
    // Only show once per session
    if (typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY)) {
      return;
    }
    setVisible(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
    track("exitIntentShown");
  }, [dismissed]);

  useEffect(() => {
    // Hide on touch/mobile devices — exit intent doesn't work reliably on touch
    if (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) {
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // clientY <= 0 means cursor left through the top (toward browser chrome)
      if (e.clientY <= 0) {
        show();
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [show]);

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
  };

  const handleCTAClick = () => {
    track("exitIntentConverted");
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay / backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="exit-intent-heading"
        className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      >
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-fade-up in-view">
          {/* Dismiss button */}
          <button
            type="button"
            aria-label="Close"
            onClick={handleDismiss}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-5 ring-1 ring-amber-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </span>
            14-day free trial
          </div>

          <h2
            id="exit-intent-heading"
            className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Wait — try Groundwork free for 14 days
          </h2>
          <p className="text-gray-500 text-sm mb-7">
            No credit card required. Cancel anytime.
          </p>

          <a
            href="/onboarding/step-1"
            onClick={handleCTAClick}
            className="block w-full text-center bg-brand-600 text-white font-semibold text-base px-6 py-3.5 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-600/25 active:scale-95"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Start free trial
          </a>

          <button
            type="button"
            onClick={handleDismiss}
            className="block w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 transition-colors"
          >
            No thanks
          </button>
        </div>
      </div>
    </>
  );
}
