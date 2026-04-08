"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { trpc } from "@/lib/trpc/client";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

const SERVICE_CATEGORIES = [
  "Cleaning",
  "Electrical",
  "Landscaping / Lawn Care",
  "HVAC",
  "Painting",
  "Photography",
  "Plumbing",
  "Roofing",
  "Tree Service",
  "Other",
];

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 63);
}

export default function Step2Page() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    email: "",
    phone: "",
    category: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    serviceAreaRadius: "",
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slugToCheck, setSlugToCheck] = useState("");
  const slugDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: slugCheck, isFetching: slugChecking } = trpc.business.checkSlug.useQuery(
    { slug: slugToCheck },
    { enabled: slugToCheck.length >= 2, staleTime: 5000 }
  );

  const updateOnboardingStep = trpc.business.updateOnboardingStep.useMutation({
    onSuccess: () => router.push("/onboarding/step-3"),
  });

  // Create business (first time through step 2 — user may have no business yet)
  const createBusiness = trpc.business.create.useMutation({
    onSuccess: () => router.push("/onboarding/step-3"),
  });

  const { data: currentBusiness } = trpc.business.getCurrent.useQuery(undefined, {
    retry: false,
  });

  // Pre-fill from existing business if resuming
  useEffect(() => {
    if (currentBusiness) {
      setForm({
        name: currentBusiness.name ?? "",
        slug: currentBusiness.slug ?? "",
        email: currentBusiness.email ?? "",
        phone: currentBusiness.phone ?? "",
        category: currentBusiness.category ?? "",
        address: currentBusiness.address ?? "",
        city: currentBusiness.city ?? "",
        state: currentBusiness.state ?? "",
        zip: currentBusiness.zip ?? "",
        serviceAreaRadius: currentBusiness.serviceAreaRadius?.toString() ?? "",
      });
      setSlugManuallyEdited(true); // don't auto-generate if existing
    }
  }, [currentBusiness]);

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: slugManuallyEdited ? f.slug : toSlug(name),
    }));
    if (!slugManuallyEdited) {
      debouncedSlugCheck(toSlug(name));
    }
  }

  function handleSlugChange(slug: string) {
    const cleaned = toSlug(slug);
    setForm((f) => ({ ...f, slug: cleaned }));
    setSlugManuallyEdited(true);
    debouncedSlugCheck(cleaned);
  }

  function debouncedSlugCheck(slug: string) {
    if (slugDebounceRef.current) clearTimeout(slugDebounceRef.current);
    slugDebounceRef.current = setTimeout(() => {
      if (slug.length >= 2) setSlugToCheck(slug);
    }, 400);
  }

  const isSlugAvailable =
    slugToCheck === form.slug && slugCheck?.available === true;
  const isSlugTaken =
    slugToCheck === form.slug && slugCheck?.available === false;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const radius = form.serviceAreaRadius ? parseInt(form.serviceAreaRadius) : undefined;

    if (currentBusiness) {
      // Update existing business
      await updateOnboardingStep.mutateAsync({
        step: 2,
        name: form.name,
        slug: form.slug,
        email: form.email,
        phone: form.phone || undefined,
        category: form.category || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        zip: form.zip || undefined,
        serviceAreaRadius: radius,
      });
    } else {
      // Create new business
      await createBusiness.mutateAsync({
        name: form.name,
        slug: form.slug,
        email: form.email,
        phone: form.phone || undefined,
        category: form.category || undefined,
      });
    }
  }

  const isSubmitting = updateOnboardingStep.isPending || createBusiness.isPending;
  const submitError = updateOnboardingStep.error?.message ?? createBusiness.error?.message;

  return (
    <OnboardingLayout currentStep={2}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
            Tell us about your business
          </h1>
          <p className="font-body text-surface-400 mt-1">
            This information will appear on your website.
          </p>
        </div>

        {submitError && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/20 p-4 text-sm text-red-400 font-body">
            {submitError}
          </div>
        )}

        <div className="space-y-4">
          {/* Business name */}
          <div className="space-y-1">
            <label htmlFor="biz-name" className="block text-sm font-medium text-[var(--foreground)] font-body">
              Business name <span className="text-red-400">*</span>
            </label>
            <input
              id="biz-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Sparkle Cleaning Co."
              className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors font-body"
            />
          </div>

          {/* Slug with live availability */}
          <div className="space-y-1">
            <label htmlFor="biz-slug" className="block text-sm font-medium text-[var(--foreground)] font-body">
              Your website address <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-0 rounded-lg border border-surface-700 bg-surface-900 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-colors overflow-hidden">
              <span className="px-3 py-3 text-sm text-surface-400 font-body border-r border-surface-700 bg-surface-900/50 whitespace-nowrap">
                versa.app/
              </span>
              <input
                id="biz-slug"
                type="text"
                required
                value={form.slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="sparkle-cleaning"
                className="flex-1 px-3 py-3 text-sm text-[var(--foreground)] bg-transparent placeholder:text-surface-400 focus:outline-none font-body"
              />
              <div className="pr-3">
                {slugChecking && <Loader2 className="w-4 h-4 animate-spin text-surface-400" />}
                {!slugChecking && isSlugAvailable && (
                  <CheckCircle className="w-4 h-4 text-brand-500" />
                )}
                {!slugChecking && isSlugTaken && (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </div>
            </div>
            {isSlugTaken && (
              <p className="text-xs text-red-400 font-body">That URL is already taken.</p>
            )}
            {isSlugAvailable && (
              <p className="text-xs text-brand-400 font-body">This URL is available.</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="biz-email" className="block text-sm font-medium text-[var(--foreground)] font-body">
              Business email <span className="text-red-400">*</span>
            </label>
            <input
              id="biz-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="hello@yourbusiness.com"
              className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors font-body"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label htmlFor="biz-phone" className="block text-sm font-medium text-[var(--foreground)] font-body">
              Phone number
            </label>
            <input
              id="biz-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="(555) 123-4567"
              className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors font-body"
            />
          </div>

          {/* Category */}
          <div className="space-y-1">
            <label htmlFor="biz-category" className="block text-sm font-medium text-[var(--foreground)] font-body">
              Service category
            </label>
            <select
              id="biz-category"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-sm text-[var(--foreground)] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors font-body"
            >
              <option value="">Select a category</option>
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label htmlFor="biz-address" className="block text-sm font-medium text-[var(--foreground)] font-body">
              Street address
            </label>
            <input
              id="biz-address"
              type="text"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              placeholder="123 Main St"
              className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors font-body"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="biz-city" className="block text-sm font-medium text-[var(--foreground)] font-body">City</label>
              <input
                id="biz-city"
                type="text"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="Portland"
                className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors font-body"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="biz-state" className="block text-sm font-medium text-[var(--foreground)] font-body">State</label>
              <input
                id="biz-state"
                type="text"
                value={form.state}
                onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                placeholder="OR"
                maxLength={2}
                className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors font-body"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="biz-zip" className="block text-sm font-medium text-[var(--foreground)] font-body">ZIP code</label>
              <input
                id="biz-zip"
                type="text"
                value={form.zip}
                onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                placeholder="97201"
                className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors font-body"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="biz-radius" className="block text-sm font-medium text-[var(--foreground)] font-body">Service radius (miles)</label>
              <input
                id="biz-radius"
                type="number"
                value={form.serviceAreaRadius}
                onChange={(e) => setForm((f) => ({ ...f, serviceAreaRadius: e.target.value }))}
                placeholder="25"
                min={1}
                max={500}
                className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors font-body"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/onboarding/step-1")}
            className="flex-1 rounded-lg border border-surface-700 px-4 py-3 text-sm font-medium text-surface-400 hover:text-[var(--foreground)] hover:border-surface-600 transition-colors font-body"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isSlugTaken || !form.name || !form.slug || !form.email}
            className="flex-[2] rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-body"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Continue
          </button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
