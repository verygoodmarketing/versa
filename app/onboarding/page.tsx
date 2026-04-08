import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/client";

/**
 * /onboarding — smart redirect:
 * - No session → step 1
 * - Session + onboardingComplete → dashboard
 * - Session + partial onboarding → resume at saved step
 */
export default async function OnboardingIndexPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/onboarding/step-1");
  }

  // Look up the user's business to resume where they left off
  const owner = await prisma.businessOwner.findUnique({
    where: { userId: user.id },
    include: { business: true },
  });

  if (!owner) {
    // New user — start from step 2 (account created in step 1)
    redirect("/onboarding/step-2");
  }

  if (owner.business.onboardingComplete) {
    redirect("/dashboard");
  }

  const step = owner.business.onboardingStep ?? 1;
  redirect(`/onboarding/step-${step}`);
}
