import type { BannerState } from "@/components/dashboard/TrialNudgeBanner";

const TRIAL_WARNING_DAY = 7;
const TRIAL_URGENCY_DAY = 12;
const TRIAL_LENGTH_DAYS = 14;

/**
 * Compute which trial nudge banner state to show.
 *
 * Priority order (highest wins):
 *   1. trial_urgency  (day 12+, i.e. <=2 days left)
 *   2. trial_warning  (day 7+)
 *   3. incomplete_onboarding
 *   4. none
 *
 * @param opts.onboardingComplete  Whether the user finished all onboarding steps
 * @param opts.onboardingStep      The last step the user reached (used to link them back)
 * @param opts.subscriptionStatus  e.g. "TRIAL", "ACTIVE", "CANCELLED", …
 * @param opts.businessCreatedAt   When the business record was created (trial start proxy)
 */
export function computeBannerState(opts: {
  onboardingComplete: boolean;
  onboardingStep: number;
  subscriptionStatus: string | null | undefined;
  businessCreatedAt: Date;
}): BannerState {
  const { onboardingComplete, onboardingStep, subscriptionStatus, businessCreatedAt } = opts;

  // Treat null/undefined status OR explicit TRIAL as on-trial.
  // New users are created with no subscriptionStatus (null) — they are implicitly on trial
  // until they subscribe, cancel, or go past-due.
  const isOnTrial =
    subscriptionStatus === "TRIAL" ||
    subscriptionStatus === null ||
    subscriptionStatus === undefined;

  if (isOnTrial) {
    const now = new Date();
    const msElapsed = now.getTime() - businessCreatedAt.getTime();
    const daysElapsed = Math.floor(msElapsed / (1000 * 60 * 60 * 24));
    const daysLeft = TRIAL_LENGTH_DAYS - daysElapsed;

    if (daysElapsed >= TRIAL_URGENCY_DAY) {
      return { kind: "trial_urgency", daysLeft: Math.max(0, daysLeft) };
    }

    if (daysElapsed >= TRIAL_WARNING_DAY) {
      return { kind: "trial_warning", daysLeft: Math.max(0, daysLeft) };
    }
  }

  if (!onboardingComplete) {
    // lastIncompleteStep: the step they need to resume (clamped to 2-5 range)
    const lastIncompleteStep = Math.min(Math.max(onboardingStep, 2), 5);
    return { kind: "incomplete_onboarding", lastIncompleteStep };
  }

  return { kind: "none" };
}
