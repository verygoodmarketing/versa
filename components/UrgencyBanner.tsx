"use client";
import { useState, useEffect } from "react";

export function UrgencyBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem("urgency-banner-dismissed") === "true") {
      setDismissed(true);
    }
  }, []);

  // Avoid hydration mismatch by not rendering until mounted
  if (!mounted || dismissed) return null;

  return (
    <div className="bg-amber-600 text-white text-sm py-2 px-4 flex items-center justify-between w-full">
      <span className="mx-auto font-medium text-center">
        Founding member pricing — $49/mo locked in forever. Spots limited.
      </span>
      <button
        type="button"
        onClick={() => {
          localStorage.setItem("urgency-banner-dismissed", "true");
          setDismissed(true);
        }}
        aria-label="Dismiss banner"
        className="ml-4 flex-shrink-0 text-white/80 hover:text-white transition-colors text-lg leading-none"
      >
        &times;
      </button>
    </div>
  );
}
