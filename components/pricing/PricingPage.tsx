import Link from "next/link";
import Image from "next/image";
import { FileX, RefreshCcw, Clock } from "lucide-react";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { PlanCTAButton } from "@/components/pricing/PlanCTAButton";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";

type Plan = {
  key: "STARTER" | "PRO" | "BUSINESS";
  name: string;
  price: string;
  priceMonthly: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  paymentLink: string | null;
  highlighted: boolean;
};

type Props = {
  plans: Plan[];
};

function CheckIcon({ highlighted }: { highlighted: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlighted ? "text-brand-400" : "text-brand-600"}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`relative rounded-2xl p-8 flex flex-col ${
        plan.highlighted
          ? "border-t-4 border-brand-500 shadow-2xl ring-1 ring-white/10"
          : "bg-white border border-gray-200 shadow-sm hover:border-brand-200 hover:shadow-md transition-all duration-200"
      }`}
      style={
        plan.highlighted
          ? { background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)" }
          : undefined
      }
    >
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-extrabold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg ring-2 ring-white/20">
            <svg aria-hidden="true" className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Most Popular
          </span>
        </div>
      )}

      <div className="flex-1">
        <h2
          className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-gray-900"}`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {plan.name}
        </h2>
        <div className="flex items-baseline gap-1 mb-3">
          <span
            className={`text-5xl font-extrabold tracking-tight ${plan.highlighted ? "text-white" : "text-gray-900"}`}
            style={{ fontFamily: "var(--font-display)" }}
          >
            {plan.price}
          </span>
          <span
            className={`text-sm font-medium ${plan.highlighted ? "text-gray-400" : "text-gray-400"}`}
          >
            {plan.period}
          </span>
        </div>
        <p
          className={`text-sm mb-7 ${plan.highlighted ? "text-gray-300" : "text-gray-500"}`}
        >
          {plan.description}
        </p>

        <ul className="space-y-3 mb-8">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <CheckIcon highlighted={plan.highlighted} />
              <span
                className={plan.highlighted ? "text-gray-100" : "text-gray-600"}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <PlanCTAButton
        planKey={plan.key}
        cta={plan.cta}
        highlighted={plan.highlighted}
      />
    </div>
  );
}

const TESTIMONIALS = [
  {
    name: "Marcus T.",
    city: "Columbus, OH",
    trade: "Licensed Plumber",
    quote: "I went from zero online presence to getting 3–4 calls a week from Google. GroundWork paid for itself in the first month.",
    initials: "MT",
  },
  {
    name: "Lisa R.",
    city: "Phoenix, AZ",
    trade: "HVAC Technician",
    quote: "Setting up my site took less than an hour. My customers now find me on Google before they even call a competitor.",
    initials: "LR",
  },
  {
    name: "Diana M.",
    city: "Atlanta, GA",
    trade: "House Cleaning Service",
    quote: "I'm not tech-savvy at all, but GroundWork made it dead simple. I got my first online booking within a week.",
    initials: "DM",
  },
];

const FAQ = [
  {
    q: "Do I need technical skills?",
    a: "No technical skills required. GroundWork walks you through every step with a simple setup wizard — most business owners are live in under an hour.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There are no long-term contracts. You can cancel your subscription at any time from your billing portal — no fees, no hassle.",
  },
  {
    q: "What happens after my trial?",
    a: "After your 14-day free trial, you'll be billed monthly. You won't be charged without warning — we'll email you before your trial ends.",
  },
  {
    q: "Will my website show up on Google?",
    a: "Yes. Every GroundWork site is built with local SEO from day one — we generate your sitemap, optimize your pages for search, and help you connect to Google Business Profile in one click.",
  },
  {
    q: "Can I use my own domain?",
    a: "Absolutely. Every plan includes a free subdomain (yourbiz.groundworklocal.com). On Pro and Business plans you can connect your own custom domain (e.g. myjohnsonplumbing.com).",
  },
  {
    q: "What if I already have a website?",
    a: "GroundWork can replace your existing site or run alongside it. Many customers migrate from slow, outdated sites and see immediate improvements in load speed and lead volume.",
  },
  {
    q: "Do I need a credit card to start the trial?",
    a: "No. You can start building your site and try all features without entering a credit card.",
  },
  {
    q: "Is GroundWork built for businesses like mine?",
    a: "Yes. GroundWork is designed specifically for local service businesses — plumbers, electricians, HVAC techs, landscapers, cleaners, and contractors. Every feature is built around winning local jobs.",
  },
];

export function PricingPage({ plans }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <ExitIntentPopup />
      <UrgencyBanner />
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-[#161b22]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="flex items-center"
              aria-label="GroundWork home"
            >
              <Image
                src="/brand/logo-horizontal-dark.png"
                alt="GroundWork"
                width={160}
                height={40}
                priority
              />
            </Link>
            <Link
              href="/onboarding/step-1"
              className="bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">
            Pricing
          </span>
          <h1
            className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            More customers. Less hassle. One simple price.
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8">
            Get your business found online, collect leads, and win more jobs —
            starting at $49/month. No setup fees. No contracts. 14-day free
            trial, no credit card required.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            {[
              "14-day free trial",
              "No credit card required",
              "Cancel anytime",
              "Live support",
              "Set up in under an hour",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 text-brand-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </section>

        {/* Plans */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <PlanCard key={plan.key} plan={plan} />
              ))}
            </div>

            {/* Trust reinforcement row */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
              {[
                { Icon: FileX, label: "No contracts", detail: "Month-to-month, always." },
                { Icon: RefreshCcw, label: "Cancel anytime", detail: "No fees, no hassle." },
                { Icon: Clock, label: "Setup in under an hour", detail: "Live faster than you think." },
              ].map(({ Icon, label, detail }) => (
                <div key={label} className="flex items-center gap-3 text-left">
                  <div className="w-10 h-10 bg-brand-50 rounded-xl ring-1 ring-brand-200 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-brand-600" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 30-day money-back guarantee badge */}
            <div className="mt-10 flex justify-center">
              <div className="inline-flex items-center gap-4 bg-green-50 border border-green-200 rounded-2xl px-6 py-4 shadow-sm">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-green-900">30-Day Money-Back Guarantee</p>
                  <p className="text-xs text-green-700 mt-0.5">
                    Not happy? We&apos;ll refund your first month — no questions asked.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social proof — testimonials */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">
              Trusted by local businesses
            </p>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-10 text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Real businesses. Real results.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-1 text-amber-400" role="img" aria-label="5 out of 5 stars">
                    {["s1", "s2", "s3", "s4", "s5"].map((s) => (
                      <svg
                        key={s}
                        aria-hidden="true"
                        className="w-4 h-4 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">{t.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                      <p className="text-xs text-gray-400">
                        {t.trade} &middot; {t.city}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature comparison table */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-10 text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Everything you get — side by side
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 pr-4 font-semibold text-gray-700 w-1/2">
                      Feature
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-700">
                      Starter
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-brand-700 bg-brand-50 rounded-t-lg">
                      Pro
                    </th>
                    <th className="text-center py-3 pl-4 font-semibold text-gray-700">
                      Business
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["Professional website", true, true, true],
                    ["GroundWork subdomain", true, true, true],
                    ["Contact forms + lead inbox", true, true, true],
                    ["Basic SEO + sitemap", true, true, true],
                    ["Email contacts", "200", "500", "Unlimited"],
                    ["Custom domain", false, true, true],
                    ["Email newsletter / broadcasts", false, true, true],
                    ["Review request campaigns", false, true, true],
                    ["Advanced analytics", false, true, true],
                    ["Email marketing automation", false, false, true],
                    ["Multi-location support", false, false, true],
                    ["Dedicated account manager", false, false, true],
                    ["Phone support", false, false, true],
                    ["White-label reports", false, false, true],
                  ].map(([feature, starter, pro, business]) => (
                    <tr key={String(feature)}>
                      <td className="py-3 pr-4 text-gray-700">{feature}</td>
                      <td className="text-center py-3 px-4">
                        <FeatureCell value={starter} />
                      </td>
                      <td className="text-center py-3 px-4 bg-brand-50/50">
                        <FeatureCell value={pro} highlighted />
                      </td>
                      <td className="text-center py-3 pl-4">
                        <FeatureCell value={business} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-10 text-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Got questions? We&apos;ve got answers.
            </h2>
            <div className="space-y-6">
              {FAQ.map(({ q, a }) => (
                <div
                  key={q}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-6"
                >
                  <h3
                    className="font-bold text-gray-900 mb-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {q}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section
          className="py-20 px-4 sm:px-6 lg:px-8 text-center"
          style={{
            background:
              "linear-gradient(135deg, #0d1117 0%, #14532d 55%, #166534 100%)",
          }}
        >
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-white mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to get more customers?
          </h2>
          <p className="text-lg text-brand-100 mb-8 max-w-xl mx-auto">
            Start your 14-day free trial today — no credit card required. Get
            your business online in under an hour.
          </p>
          <Link
            href="/onboarding/step-1"
            className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-brand-700 transition-colors shadow-xl shadow-brand-600/30 active:scale-95"
          >
            Start free trial — no credit card needed
            <svg
              aria-hidden="true"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0d1117] text-gray-400 py-8 px-4 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} GroundWork. All rights reserved.{" "}
          <Link href="/" className="hover:text-brand-400 transition-colors">
            Back to home
          </Link>
        </p>
      </footer>
    </div>
  );
}

function FeatureCell({
  value,
  highlighted,
}: {
  value: boolean | string;
  highlighted?: boolean;
}) {
  if (typeof value === "string") {
    return (
      <span
        className={`font-medium ${highlighted ? "text-brand-700" : "text-gray-700"}`}
      >
        {value}
      </span>
    );
  }
  if (value) {
    return (
      <svg
        aria-label="Included"
        className={`w-5 h-5 mx-auto ${highlighted ? "text-brand-600" : "text-brand-500"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
  return (
    <svg
      aria-label="Not included"
      className="w-5 h-5 mx-auto text-gray-300"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}
