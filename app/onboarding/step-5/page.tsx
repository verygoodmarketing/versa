"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { trpc } from "@/lib/trpc/client";
import { Loader2, Globe, ExternalLink, Copy, CheckCircle, PartyPopper } from "lucide-react";

function ConfettiPiece({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="fixed pointer-events-none rounded-sm"
      style={{
        width: 8,
        height: 8,
        ...style,
      }}
    />
  );
}

const CONFETTI_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#a855f7", "#ef4444", "#0ea5e9"];

function useConfetti(active: boolean) {
  const [pieces, setPieces] = useState<(React.CSSProperties & { id: string })[]>([]);

  useEffect(() => {
    if (!active) return;
    const newPieces = Array.from({ length: 60 }, (_, i) => ({
      id: `c-${Date.now()}-${i}`,
      left: `${Math.random() * 100}vw`,
      top: `-${Math.random() * 20}px`,
      backgroundColor: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      animation: `fall ${1.5 + Math.random() * 2}s ease-in forwards`,
      animationDelay: `${Math.random() * 0.5}s`,
      transform: `rotate(${Math.random() * 360}deg)`,
    }));
    setPieces(newPieces);
    const timer = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(timer);
  }, [active]);

  return pieces;
}

export default function Step5Page() {
  const router = useRouter();
  const { data: business } = trpc.business.getCurrent.useQuery(undefined, { retry: false });

  const [customDomain, setCustomDomain] = useState("");
  const [showDnsInstructions, setShowDnsInstructions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [published, setPublished] = useState(false);

  const updateStep = trpc.business.updateOnboardingStep.useMutation({
    onSuccess: () => setPublished(true),
  });

  const confettiPieces = useConfetti(published);

  const siteUrl = business?.slug ? `https://${business.slug}.versa.app` : null;

  const handleCopy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    await updateStep.mutateAsync({
      step: 5,
      customDomain: customDomain || undefined,
      publish: true,
    });
  }

  if (published) {
    return (
      <OnboardingLayout currentStep={5}>
        {/* Confetti overlay */}
        {confettiPieces.map(({ id, ...style }) => (
          <ConfettiPiece key={id} style={style} />
        ))}

        <style>{`
          @keyframes fall {
            from { transform: translateY(0) rotate(0deg); opacity: 1; }
            to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
          }
        `}</style>

        <div className="text-center space-y-6 py-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-brand-600/20 flex items-center justify-center">
              <PartyPopper className="w-8 h-8 text-brand-400" />
            </div>
          </div>

          <div>
            <h1 className="font-display text-3xl font-bold text-[var(--foreground)]">
              You're live!
            </h1>
            <p className="font-body text-surface-400 mt-2">
              Your business website is published and ready for customers.
            </p>
          </div>

          {siteUrl && (
            <div className="rounded-xl border border-brand-500/30 bg-brand-950/20 p-4 space-y-3">
              <p className="text-sm text-surface-400 font-body">Your website is live at</p>
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-brand-400 font-semibold font-body hover:text-brand-300 transition-colors"
              >
                <Globe className="w-4 h-4" />
                {siteUrl.replace("https://", "")}
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() => handleCopy(siteUrl)}
                className="flex items-center gap-1.5 mx-auto text-xs text-surface-400 hover:text-[var(--foreground)] transition-colors font-body"
              >
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-brand-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-full rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-500 transition-colors font-body"
          >
            Go to dashboard
          </button>
        </div>
      </OnboardingLayout>
    );
  }

  return (
    <OnboardingLayout currentStep={5}>
      <form onSubmit={handlePublish} className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
            Go live
          </h1>
          <p className="font-body text-surface-400 mt-1">
            Review your site details and publish when you're ready.
          </p>
        </div>

        {updateStep.error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/20 p-4 text-sm text-red-400 font-body">
            {updateStep.error.message}
          </div>
        )}

        {/* Site URL preview */}
        <div className="rounded-xl border border-surface-700 bg-surface-900/50 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-400" />
            <p className="text-sm font-semibold text-[var(--foreground)] font-body">Your subdomain</p>
          </div>
          {siteUrl ? (
            <div className="flex items-center gap-2 rounded-lg border border-surface-700 bg-surface-800 px-4 py-3">
              <span className="flex-1 text-sm text-brand-400 font-mono">{siteUrl}</span>
              <button
                type="button"
                onClick={() => handleCopy(siteUrl)}
                className="text-surface-400 hover:text-[var(--foreground)] transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-brand-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ) : (
            <div className="rounded-lg border border-surface-700 bg-surface-800 px-4 py-3 text-sm text-surface-400 font-body">
              Loading...
            </div>
          )}
        </div>

        {/* Optional custom domain */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-[var(--foreground)] font-body">Custom domain (optional)</p>
            <button
              type="button"
              onClick={() => setShowDnsInstructions(!showDnsInstructions)}
              className="text-xs text-brand-400 hover:text-brand-300 font-body"
            >
              {showDnsInstructions ? "Hide" : "How does this work?"}
            </button>
          </div>

          <div className="flex items-center rounded-lg border border-surface-700 bg-surface-900 overflow-hidden focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-colors">
            <span className="px-3 py-3 text-sm text-surface-400 font-body border-r border-surface-700 whitespace-nowrap">
              https://
            </span>
            <input
              id="custom-domain"
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="yourdomain.com"
              className="flex-1 px-3 py-3 text-sm text-[var(--foreground)] bg-transparent placeholder:text-surface-400 focus:outline-none font-body"
            />
          </div>

          {showDnsInstructions && customDomain && (
            <div className="rounded-lg border border-surface-700 bg-surface-800/50 p-4 space-y-3 text-sm font-body">
              <p className="font-semibold text-[var(--foreground)]">DNS setup instructions</p>
              <p className="text-surface-400">
                Add this CNAME record in your domain registrar's DNS settings:
              </p>
              <div className="rounded border border-surface-700 bg-surface-900 p-3 font-mono text-xs space-y-1">
                <div className="grid grid-cols-3 gap-2 text-surface-400">
                  <span>Type</span><span>Name</span><span>Value</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[var(--foreground)]">
                  <span>CNAME</span><span>@</span><span>cname.versa.app</span>
                </div>
              </div>
              <p className="text-surface-400 text-xs">DNS changes can take up to 48 hours to propagate.</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/onboarding/step-4")}
            className="flex-1 rounded-lg border border-surface-700 px-4 py-3 text-sm font-medium text-surface-400 hover:text-[var(--foreground)] hover:border-surface-600 transition-colors font-body"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={updateStep.isPending}
            className="flex-[2] rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-body"
          >
            {updateStep.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <PartyPopper className="w-4 h-4" />
            )}
            Publish my site
          </button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
