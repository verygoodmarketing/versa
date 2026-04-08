"use client";

import { CheckIcon } from "lucide-react";

const STEPS = [
  { number: 1, label: "Account" },
  { number: 2, label: "Business" },
  { number: 3, label: "Template" },
  { number: 4, label: "Contact Form" },
  { number: 5, label: "Go Live" },
];

interface OnboardingLayoutProps {
  currentStep: number;
  children: React.ReactNode;
}

export function OnboardingLayout({ currentStep, children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      {/* Header */}
      <header className="border-b border-surface-800/30 bg-[var(--background)]">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="font-display font-bold text-xl text-[var(--foreground)]">
            Versa
          </span>
          <span className="text-sm text-surface-400 font-body">
            Step {currentStep} of 5
          </span>
        </div>
      </header>

      {/* Progress stepper */}
      <div className="border-b border-surface-800/20 bg-[var(--background)]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-0">
            {STEPS.map((step, idx) => {
              const isCompleted = step.number < currentStep;
              const isCurrent = step.number === currentStep;
              const isUpcoming = step.number > currentStep;

              return (
                <div key={step.number} className="flex items-center flex-1 last:flex-none">
                  {/* Step node */}
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={[
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                        isCompleted
                          ? "bg-brand-600 text-white"
                          : isCurrent
                          ? "bg-brand-500 text-white ring-2 ring-brand-500/30"
                          : "bg-surface-800 text-surface-400",
                      ].join(" ")}
                    >
                      {isCompleted ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={[
                        "text-xs font-body whitespace-nowrap",
                        isCompleted
                          ? "text-brand-500"
                          : isCurrent
                          ? "text-[var(--foreground)] font-medium"
                          : "text-surface-400",
                      ].join(" ")}
                    >
                      {step.label}
                    </span>
                  </div>

                  {/* Connector line */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className={[
                        "flex-1 h-0.5 mx-2 mb-4 transition-colors",
                        isCompleted ? "bg-brand-600" : "bg-surface-800",
                      ].join(" ")}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}
