import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 bg-white">
      <div className="text-center max-w-md">
        <p className="text-brand-600 font-semibold text-sm uppercase tracking-widest mb-3">
          404
        </p>
        <h1 className="text-4xl font-bold text-surface-950 mb-4">
          Page not found
        </h1>
        <p className="text-surface-400 text-lg mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
