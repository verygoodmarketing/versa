"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service in the future
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-white">
          <div className="text-center max-w-md">
            <p className="text-red-600 font-semibold text-sm uppercase tracking-widest mb-3">
              500
            </p>
            <h1 className="text-4xl font-bold text-surface-950 mb-4">
              Something went wrong
            </h1>
            <p className="text-surface-400 text-lg mb-8">
              We ran into an unexpected error. Please try again or contact
              support if the issue persists.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Try again
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-surface-200 hover:bg-surface-50 text-surface-900 font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
