"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@/components/onboarding/OnboardingLayout";
import { trpc } from "@/lib/trpc/client";
import { Loader2, MessageSquare, Phone, Mail, User, AlignLeft } from "lucide-react";

const FIELD_OPTIONS = [
  { id: "name", label: "Name", icon: User, required: true },
  { id: "email", label: "Email", icon: Mail, required: true },
  { id: "phone", label: "Phone", icon: Phone, required: false },
  { id: "message", label: "Message", icon: AlignLeft, required: false },
];

export default function Step4Page() {
  const router = useRouter();
  const { data: business } = trpc.business.getCurrent.useQuery(undefined, { retry: false });

  const [enabledFields, setEnabledFields] = useState<string[]>(["name", "email", "phone", "message"]);
  const [notifyEmail, setNotifyEmail] = useState("");

  const updateStep = trpc.business.updateOnboardingStep.useMutation({
    onSuccess: () => router.push("/onboarding/step-5"),
  });

  // Pre-fill from existing business
  useEffect(() => {
    if (business) {
      setNotifyEmail(business.email ?? "");
    }
  }, [business]);

  function toggleField(fieldId: string) {
    const field = FIELD_OPTIONS.find((f) => f.id === fieldId);
    if (field?.required) return; // can't disable required fields
    setEnabledFields((prev) =>
      prev.includes(fieldId) ? prev.filter((f) => f !== fieldId) : [...prev, fieldId]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await updateStep.mutateAsync({
      step: 4,
      contactFormFields: enabledFields,
      contactFormNotifyEmail: notifyEmail || undefined,
    });
  }

  return (
    <OnboardingLayout currentStep={4}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-[var(--foreground)]">
            Configure your contact form
          </h1>
          <p className="font-body text-surface-400 mt-1">
            Choose what information visitors send you when they reach out.
          </p>
        </div>

        {updateStep.error && (
          <div className="rounded-lg border border-red-500/40 bg-red-950/20 p-4 text-sm text-red-400 font-body">
            {updateStep.error.message}
          </div>
        )}

        {/* Field toggles */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--foreground)] font-body">Form fields</p>
          <div className="space-y-2">
            {FIELD_OPTIONS.map((field) => {
              const Icon = field.icon;
              const isEnabled = enabledFields.includes(field.id);
              return (
                <button
                  key={field.id}
                  type="button"
                  onClick={() => toggleField(field.id)}
                  disabled={field.required}
                  className={[
                    "w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-sm text-left transition-colors",
                    isEnabled
                      ? "border-brand-500/50 bg-brand-950/20"
                      : "border-surface-700 bg-surface-900",
                    field.required ? "opacity-70 cursor-default" : "cursor-pointer hover:border-surface-600",
                  ].join(" ")}
                >
                  <Icon className={`w-4 h-4 ${isEnabled ? "text-brand-400" : "text-surface-400"}`} />
                  <span className={`flex-1 font-body ${isEnabled ? "text-[var(--foreground)]" : "text-surface-400"}`}>
                    {field.label}
                    {field.required && (
                      <span className="ml-2 text-xs text-surface-400">(required)</span>
                    )}
                  </span>
                  <div
                    className={[
                      "w-10 h-6 rounded-full transition-colors relative flex-shrink-0",
                      isEnabled ? "bg-brand-500" : "bg-surface-700",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform",
                        isEnabled ? "translate-x-5" : "translate-x-1",
                      ].join(" ")}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live preview */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--foreground)] font-body">Preview</p>
          <div className="rounded-xl border border-surface-700 bg-surface-900/50 p-5 space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-brand-400" />
              <p className="text-sm font-semibold text-[var(--foreground)] font-body">Contact Us</p>
            </div>
            {FIELD_OPTIONS.filter((f) => enabledFields.includes(f.id)).map((field) => (
              <div key={field.id} className="space-y-1">
                <p className="block text-xs text-surface-400 font-body capitalize">{field.label}</p>
                {field.id === "message" ? (
                  <div className="w-full rounded border border-surface-700 bg-surface-800 h-16 px-3 py-2 text-xs text-surface-600 font-body">
                    Your message...
                  </div>
                ) : (
                  <div className="w-full rounded border border-surface-700 bg-surface-800 h-8 px-3 text-xs flex items-center text-surface-600 font-body">
                    {field.id === "email" ? "you@email.com" : field.id === "phone" ? "(555) 000-0000" : "Your name"}
                  </div>
                )}
              </div>
            ))}
            <button
              type="button"
              className="w-full rounded bg-brand-600 py-2 text-xs font-semibold text-white font-body"
              tabIndex={-1}
            >
              Send Message
            </button>
          </div>
        </div>

        {/* Notification email */}
        <div className="space-y-1">
          <label htmlFor="notify-email" className="block text-sm font-medium text-[var(--foreground)] font-body">
            Send leads to
          </label>
          <input
            id="notify-email"
            type="email"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
            placeholder="you@yourbusiness.com"
            className="w-full rounded-lg border border-surface-700 bg-surface-900 px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-colors font-body"
          />
          <p className="text-xs text-surface-400 font-body">We'll send you an email each time someone fills out this form.</p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push("/onboarding/step-3")}
            className="flex-1 rounded-lg border border-surface-700 px-4 py-3 text-sm font-medium text-surface-400 hover:text-[var(--foreground)] hover:border-surface-600 transition-colors font-body"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={updateStep.isPending}
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
