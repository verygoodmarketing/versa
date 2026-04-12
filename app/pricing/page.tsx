import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — Simple, transparent plans",
  description:
    "Versa offers simple, transparent pricing for local service businesses. Start free, no credit card required. Upgrade as you grow.",
  openGraph: {
    title: "Versa Pricing — Simple, Transparent Plans",
    description:
      "No setup fees. No long-term contracts. Cancel anytime. Start free for 14 days.",
    type: "website",
  },
};

const PLANS = [
  {
    name: "Starter",
    price: "$39",
    period: "/month",
    description: "Everything you need to get online and start getting leads.",
    features: [
      "Professional website with 1 custom domain",
      "Contact forms + lead inbox",
      "Click-to-call + mobile-optimized",
      "Basic SEO + sitemap",
      "Up to 200 contacts for email",
      "Google Business Profile integration",
      "Basic analytics",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description:
      "For businesses ready to grow faster and keep more customers.",
    features: [
      "Everything in Starter",
      "Up to 500 email contacts",
      "Email broadcast + newsletter",
      "Review request campaigns",
      "Priority email support",
      "Advanced analytics",
      "Early access to new features",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-gray-900"
          >
            <div className="w-8 h-8 bg-brand-50 rounded-lg flex items-center justify-center">
              <span className="text-brand-700 text-sm font-bold">V</span>
            </div>
            <span>Versa</span>
          </Link>
          <Link
            href="/onboarding/step-1"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700"
          >
            Get started free →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-brand-600 mb-3">
          Pricing
        </span>
        <h1
          className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          No setup fees. No long-term contracts. Cancel anytime.
        </p>
      </section>

      {/* Plans */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "border-t-4 border-brand-500 shadow-2xl ring-1 ring-white/10"
                  : "bg-white border border-gray-200 shadow-sm hover:border-brand-200 hover:shadow-md transition-all duration-200"
              }`}
              style={
                plan.highlighted
                  ? {
                      background:
                        "linear-gradient(135deg, #0d1117 0%, #161b22 100%)",
                    }
                  : undefined
              }
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-block bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Most popular
                  </span>
                </div>
              )}

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
                  className={`text-sm font-medium ${plan.highlighted ? "text-surface-400" : "text-gray-400"}`}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className={`text-sm mb-7 ${plan.highlighted ? "text-surface-200" : "text-gray-500"}`}
              >
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <svg
                      aria-hidden="true"
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlighted ? "text-brand-400" : "text-brand-600"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span
                      className={
                        plan.highlighted ? "text-surface-100" : "text-gray-600"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/onboarding/step-1"
                className={`block w-full text-center font-semibold py-3.5 rounded-xl transition-all active:scale-95 ${
                  plan.highlighted
                    ? "bg-brand-600 text-white hover:bg-brand-500 shadow-lg"
                    : "bg-brand-600 text-white hover:bg-brand-700 shadow-md shadow-brand-600/25"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Both plans include a 14-day free trial. No credit card required to
          start.
        </p>
      </section>

      {/* FAQ section */}
      <section className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-2xl font-bold text-gray-900 mb-10 text-center"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Frequently asked questions
          </h2>
          <dl className="space-y-6">
            {[
              {
                q: "Do I need a credit card to start?",
                a: "No. You can sign up and use Versa free for 14 days without entering any payment details.",
              },
              {
                q: "Can I cancel at any time?",
                a: "Yes. There are no long-term contracts. Cancel any time from your account settings.",
              },
              {
                q: "What happens after the trial?",
                a: "After your 14-day trial, you can choose a plan that fits your business. If you don't upgrade, your account will be paused.",
              },
              {
                q: "Can I switch plans later?",
                a: "Absolutely. You can upgrade or downgrade your plan at any time from your dashboard.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-gray-200 pb-6">
                <dt className="font-semibold text-gray-900 mb-2">{q}</dt>
                <dd className="text-gray-500 text-sm">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-2xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ready to get started?
        </h2>
        <p className="text-gray-500 mb-8">
          Join hundreds of local service businesses growing with Versa.
        </p>
        <Link
          href="/onboarding/step-1"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-brand-600/25"
        >
          Start your free trial
        </Link>
      </section>
    </main>
  );
}
