"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { trpc } from "@/lib/trpc/client";
import { Loader2, CheckCircle } from "lucide-react";

const TEMPLATES = [
  {
    id: "cleaners-v1",
    name: "Cleaners",
    description: "Fresh, bright layout for cleaning businesses",
    category: "Cleaning",
    accent: "#22c55e",
    preview: "bg-gradient-to-br from-green-100 to-emerald-200",
  },
  {
    id: "plumbers-v1",
    name: "Plumbers & HVAC",
    description: "Bold, trust-focused design for trade services",
    category: "Plumbing",
    accent: "#3b82f6",
    preview: "bg-gradient-to-br from-blue-100 to-sky-200",
  },
  {
    id: "landscapers-v1",
    name: "Landscapers",
    description: "Natural, earthy tones for outdoor services",
    category: "Landscaping / Lawn Care",
    accent: "#84cc16",
    preview: "bg-gradient-to-br from-lime-100 to-green-200",
  },
  {
    id: "photographers-v1",
    name: "Photography",
    description: "Portfolio-first layout for visual creatives",
    category: "Photography",
    accent: "#a855f7",
    preview: "bg-gradient-to-br from-purple-100 to-violet-200",
  },
  {
    id: "painters-v1",
    name: "Painters",
    description: "Colourful, high-contrast for painting services",
    category: "Painting",
    accent: "#f59e0b",
    preview: "bg-gradient-to-br from-amber-100 to-yellow-200",
  },
  {
    id: "general-v1",
    name: "General Service",
    description: "Clean, professional — works for any trade",
    category: "Other",
    accent: "#64748b",
    preview: "bg-gradient-to-br from-slate-100 to-gray-200",
  },
];

const FONT_OPTIONS = [
  { id: "inter", label: "Inter (clean, modern)" },
  { id: "plus-jakarta-sans", label: "Plus Jakarta Sans (friendly)" },
  { id: "lato", label: "Lato (professional)" },
];

const COLOR_OPTIONS = [
  { id: "#22c55e", label: "Brand Green", swatch: "bg-green-500" },
  { id: "#3b82f6", label: "Blue", swatch: "bg-blue-500" },
  { id: "#f59e0b", label: "Amber", swatch: "bg-amber-500" },
  { id: "#a855f7", label: "Purple", swatch: "bg-purple-500" },
  { id: "#ef4444", label: "Red", swatch: "bg-red-500" },
  { id: "#0ea5e9", label: "Sky", swatch: "bg-sky-500" },
];

export default function Step3Page() {
  const router = useRouter();
  const { data: business } = trpc.business.getCurrent.useQuery(undefined, { retry: false });

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("#22c55e");
  const [selectedFont, setSelectedFont] = useState<string>("inter");
  const [filterCategory, setFilterCategory] = useState<string>("");

  const updateStep = trpc.business.updateOnboardingStep.useMutation({
    onSuccess: () => router.push("/onboarding/step-4"),
  });

  const filteredTemplates = filterCategory
    ? TEMPLATES.filter((t) => t.category === filterCategory)
    : TEMPLATES;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedTemplate) return;
    await updateStep.mutateAsync({
      step: 3,
      templateId: selectedTemplate,
      themeColor: selectedColor,
      themeFont: selectedFont,
    });
  }

  // Pre-select based on business category
  const suggestedTemplate = business?.category
    ? TEMPLATES.find((t) => t.category === business.category)?.id
    : undefined;

  return (
    <OnboardingLayout currentStep={3}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
            Choose your template
          </h1>
          <p className="font-body text-surface-400 mt-1">
            Pick a starting point — you can always change it later.
          </p>
        </div>

        {updateStep.error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/20 p-4 text-sm text-red-400 font-body">
            {updateStep.error.message}
          </div>
        )}

        {/* Category filter */}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilterCategory("")}
            className={[
              "rounded-full px-3 py-1 text-xs font-medium font-body transition-colors",
              filterCategory === ""
                ? "bg-brand-600 text-white"
                : "bg-surface-800 text-surface-400 hover:text-[var(--foreground)]",
            ].join(" ")}
          >
            All
          </button>
          {["Cleaning", "Plumbing", "Landscaping / Lawn Care", "Photography", "Painting", "Other"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={[
                "rounded-full px-3 py-1 text-xs font-medium font-body transition-colors",
                filterCategory === cat
                  ? "bg-brand-600 text-white"
                  : "bg-surface-800 text-surface-400 hover:text-[var(--foreground)]",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplate === template.id;
            const isSuggested = suggestedTemplate === template.id && !selectedTemplate;

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template.id)}
                className={[
                  "relative rounded-xl border-2 p-0 text-left transition-all overflow-hidden",
                  isSelected
                    ? "border-brand-500 ring-2 ring-brand-500/20"
                    : "border-surface-700 hover:border-surface-600",
                ].join(" ")}
              >
                {/* Preview box */}
                <div className={`${template.preview} h-20 w-full`} />

                {/* Info */}
                <div className="p-3 bg-surface-900">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-[var(--foreground)] font-body">{template.name}</p>
                      <p className="text-xs text-surface-400 font-body mt-0.5">{template.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                  {isSuggested && (
                    <span className="inline-block mt-1 text-xs bg-brand-600/20 text-brand-400 px-2 py-0.5 rounded-full font-body">
                      Suggested
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Color picker */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--foreground)] font-body">Primary colour</p>
          <div className="flex gap-2 flex-wrap">
            {COLOR_OPTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedColor(c.id)}
                title={c.label}
                className={[
                  `w-8 h-8 rounded-full ${c.swatch} transition-all`,
                  selectedColor === c.id
                    ? "ring-2 ring-offset-2 ring-offset-[var(--background)] ring-white scale-110"
                    : "opacity-70 hover:opacity-100",
                ].join(" ")}
              />
            ))}
          </div>
        </div>

        {/* Font picker */}
        <div className="space-y-2">
          <label htmlFor="font-select" className="block text-sm font-medium text-[var(--foreground)] font-body">
            Font
          </label>
          <select
            id="font-select"
            value={selectedFont}
            onChange={(e) => setSelectedFont(e.target.value)}
            className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-sm text-[var(--foreground)] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors font-body"
          >
            {FONT_OPTIONS.map((f) => (
              <option key={f.id} value={f.id}>{f.label}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/onboarding/step-2")}
            className="flex-1 rounded-lg border border-surface-700 px-4 py-3 text-sm font-medium text-surface-400 hover:text-[var(--foreground)] hover:border-surface-600 transition-colors font-body"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={updateStep.isPending || !selectedTemplate}
            className="flex-[2] rounded-lg bg-brand-600 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-body"
          >
            {updateStep.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Continue
          </button>
        </div>
      </form>
    </OnboardingLayout>
  );
}
