import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/client";
import Link from "next/link";
import { Globe, Settings, MessageSquare, BarChart3 } from "lucide-react";

/**
 * /dashboard — post-onboarding home page.
 * Requires auth; incomplete onboarding → redirects back to resume step.
 */
export default async function DashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/onboarding/step-1");
  }

  const owner = await prisma.businessOwner.findUnique({
    where: { userId: user.id },
    include: { business: { include: { site: true } } },
  });

  if (!owner) {
    redirect("/onboarding/step-2");
  }

  if (!owner.business.onboardingComplete) {
    const step = owner.business.onboardingStep ?? 1;
    redirect(`/onboarding/step-${step}`);
  }

  const { business } = owner;
  const siteUrl = `https://${business.slug}.versa.app`;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-surface-800/30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-display font-bold text-xl text-[var(--foreground)]">Versa</span>
          <span className="text-sm text-surface-400 font-body">{business.name}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
            Welcome back{business.name ? `, ${business.name}` : ""}
          </h1>
          <p className="text-surface-400 font-body mt-1">
            Your website is live at{" "}
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-400 hover:text-brand-300 transition-colors"
            >
              {siteUrl.replace("https://", "")}
            </a>
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Globe, label: "View site", href: siteUrl, external: true },
            { icon: Settings, label: "Settings", href: "#" },
            { icon: MessageSquare, label: "Contacts", href: "#" },
            { icon: BarChart3, label: "Analytics", href: "#" },
          ].map(({ icon: Icon, label, href, external }) => (
            <Link
              key={label}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="flex flex-col items-center gap-2 rounded-xl border border-surface-700 bg-surface-900 p-5 text-center hover:border-surface-600 transition-colors"
            >
              <Icon className="w-5 h-5 text-brand-400" />
              <span className="text-sm font-medium text-[var(--foreground)] font-body">{label}</span>
            </Link>
          ))}
        </div>

        {/* Site status */}
        <div className="rounded-xl border border-surface-700 bg-surface-900/50 p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-[var(--foreground)]">Site status</h2>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-sm font-body text-[var(--foreground)]">
              {business.site?.isPublished ? "Live" : "Offline"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm font-body">
            <div>
              <p className="text-surface-400">Template</p>
              <p className="text-[var(--foreground)] mt-0.5">{business.site?.templateId ?? "—"}</p>
            </div>
            <div>
              <p className="text-surface-400">Category</p>
              <p className="text-[var(--foreground)] mt-0.5">{business.category ?? "—"}</p>
            </div>
          </div>
        </div>

        {/* Coming soon */}
        <div className="rounded-xl border border-dashed border-surface-700 p-6 text-center">
          <p className="text-surface-400 font-body text-sm">
            More features coming soon — lead management, email marketing, review requests, and more.
          </p>
        </div>
      </main>
    </div>
  );
}
