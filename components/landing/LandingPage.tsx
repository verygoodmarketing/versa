"use client";

import { useState } from "react";

// ─── Copy constants (easy for CMO/UX to update later) ────────────────────────

const BRAND = {
  name: "Versa",
  tagline: "Websites & marketing for local service businesses",
};

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
];

const FEATURES = [
  {
    id: "website",
    title: "Professional website in under an hour",
    description:
      "Pick from 8+ templates designed for your trade. Add your business name, logo, phone, and hours — and you're live. No code. No designers. No hassle.",
    icon: (
      <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    color: "indigo",
  },
  {
    id: "leads",
    title: "More calls, more leads",
    description:
      "Built-in contact forms and click-to-call buttons turn website visitors into real phone inquiries. Every lead lands in your inbox instantly.",
    icon: (
      <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
      </svg>
    ),
    color: "violet",
  },
  {
    id: "seo",
    title: "Show up on Google",
    description:
      "Versa sites are built for local SEO from day one — with auto-generated meta tags, sitemaps, and Google Business Profile integration so customers find you when they search nearby.",
    icon: (
      <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 0z" />
      </svg>
    ),
    color: "sky",
  },
  {
    id: "email",
    title: "Email marketing made easy",
    description:
      "Capture email addresses from your site and send simple newsletters or promotions to your customers. Seasonal deals, reminders, thank-you notes — done in minutes.",
    icon: (
      <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    color: "amber",
  },
  {
    id: "reviews",
    title: "More 5-star reviews",
    description:
      "After a job, send a quick review request via email. One click from your customer lands them on your Google review page. More reviews = more trust = more business.",
    icon: (
      <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    color: "orange",
  },
  {
    id: "analytics",
    title: "See what's working",
    description:
      "Simple, privacy-first analytics show you how many people visit your site, which pages they look at, and how many contact you — no cookie banners needed.",
    icon: (
      <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    color: "emerald",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick your template",
    description:
      "Choose from templates designed for your business type — plumbing, cleaning, landscaping, photography, and more.",
    visual: (
      <svg aria-hidden="true" className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 01-1.125-1.125v-3.75zM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-8.25zM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 01-1.125-1.125v-2.25z" />
      </svg>
    ),
  },
  {
    step: "02",
    title: "Fill in your details",
    description:
      "Add your business name, phone number, services, photos, and a short description. Takes about 20 minutes.",
    visual: (
      <svg aria-hidden="true" className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
  },
  {
    step: "03",
    title: "Go live with your domain",
    description:
      "We provision a free subdomain instantly, or connect your existing domain. SSL is automatic. You're live.",
    visual: (
      <svg aria-hidden="true" className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    name: "Maria T.",
    initials: "MT",
    business: "Spotless Cleaning Co.",
    businessType: "Cleaning",
    color: "from-violet-500 to-purple-600",
    quote:
      "I had no website for 6 years. I built mine on Versa in 45 minutes and got my first online lead within a week. Game changer.",
  },
  {
    name: "Dave R.",
    initials: "DR",
    business: "Ridge Line Landscaping",
    businessType: "Landscaping",
    color: "from-emerald-500 to-teal-600",
    quote:
      "My old website was from 2015. Versa made it stupid easy to get a new one up that actually looks professional. Customers tell me all the time.",
  },
  {
    name: "Sandra K.",
    initials: "SK",
    business: "K&M Photography",
    businessType: "Photography",
    color: "from-amber-500 to-orange-600",
    quote:
      "The review request tool alone was worth it. I went from 12 Google reviews to 47 in two months just by asking after every session.",
  },
];

const PRICING = [
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
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "For businesses ready to grow faster and keep more customers.",
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

// ─── Feature icon color map ───────────────────────────────────────────────────

const featureColorMap: Record<string, { ring: string; bg: string; icon: string }> = {
  indigo: { ring: "ring-indigo-100", bg: "bg-indigo-50", icon: "text-indigo-600" },
  violet: { ring: "ring-violet-100", bg: "bg-violet-50", icon: "text-violet-600" },
  sky:    { ring: "ring-sky-100",    bg: "bg-sky-50",    icon: "text-sky-600" },
  amber:  { ring: "ring-amber-100",  bg: "bg-amber-50",  icon: "text-amber-600" },
  orange: { ring: "ring-orange-100", bg: "bg-orange-50", icon: "text-orange-600" },
  emerald:{ ring: "ring-emerald-100",bg: "bg-emerald-50",icon: "text-emerald-600" },
};

// ─── SVG Illustrations ────────────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <div className="relative mx-auto max-w-2xl" aria-hidden="true">
      {/* Browser chrome mockup */}
      <div className="rounded-2xl overflow-hidden shadow-2xl shadow-indigo-900/30 ring-1 ring-white/10">
        {/* Browser bar */}
        <div className="bg-[#1e1b4b] px-4 py-3 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <div className="w-3 h-3 rounded-full bg-green-400/70" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white/10 rounded-md px-3 py-1 text-xs text-white/50 font-mono truncate">
              ridgelinelandscaping.versa.site
            </div>
          </div>
        </div>
        {/* Website preview */}
        <div className="bg-white">
          {/* Hero area of mock site */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-8">
            <div className="w-24 h-3 bg-white/30 rounded mb-2" />
            <div className="w-40 h-5 bg-white/80 rounded mb-1" />
            <div className="w-32 h-3 bg-white/40 rounded mb-4" />
            <div className="w-28 h-8 bg-white rounded-lg" />
          </div>
          {/* Services strip */}
          <div className="px-6 py-5 grid grid-cols-3 gap-3">
            {["Lawn Care", "Landscaping", "Snow Removal"].map((s) => (
              <div key={s} className="bg-gray-50 rounded-lg p-3">
                <div className="w-6 h-6 bg-emerald-100 rounded mb-2" />
                <div className="w-full h-2 bg-gray-200 rounded mb-1" />
                <div className="w-3/4 h-2 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
          {/* Contact row */}
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-100 rounded-full" />
              <div className="w-24 h-2 bg-gray-200 rounded" />
            </div>
            <div className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-lg font-medium">Call Now</div>
          </div>
        </div>
      </div>

      {/* Floating badge: leads */}
      <div className="absolute -left-6 bottom-16 bg-white rounded-xl shadow-lg shadow-gray-200/80 px-3 py-2.5 flex items-center gap-2.5 border border-gray-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg aria-hidden="true" className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </div>
        <div>
          <div className="text-xs font-bold text-gray-900">3 new leads</div>
          <div className="text-xs text-gray-400">Last 24 hours</div>
        </div>
      </div>

      {/* Floating badge: review */}
      <div className="absolute -right-4 top-12 bg-white rounded-xl shadow-lg shadow-gray-200/80 px-3 py-2.5 flex items-center gap-2.5 border border-gray-100">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map((i) => (
            <svg key={i} aria-hidden="true" className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <div>
          <div className="text-xs font-bold text-gray-900">New 5-star review!</div>
          <div className="text-xs text-gray-400">Google Business</div>
        </div>
      </div>
    </div>
  );
}

// ─── Components ───────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0f0c29]/95 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg aria-hidden="true" className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              {BRAND.name}
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="#waitlist"
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Sign in
            </a>
            <a
              href="#waitlist"
              className="bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/25"
            >
              Get early access
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-300 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-2 py-2 text-sm font-medium text-gray-300 hover:text-white"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                className="block w-full bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-lg text-center hover:bg-indigo-400 transition-colors"
                onClick={() => {
                  setMenuOpen(false);
                  document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Get early access
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section
      className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-32"
      style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1060 40%, #24243e 100%)",
      }}
    >
      {/* Background grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      {/* Glow blobs */}
      <div aria-hidden="true" className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2" />
      <div aria-hidden="true" className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl translate-y-1/3" />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/15 text-indigo-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 ring-1 ring-indigo-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
              </span>
              Now in early access — join the waitlist
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Your business deserves{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                to be found online.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-lg">
              Versa helps local service businesses — plumbers, cleaners, landscapers, photographers, and more — get a professional website live in under an hour. No tech skills. No agencies. No nonsense.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center gap-2 bg-indigo-500 text-white font-semibold text-lg px-8 py-4 rounded-xl hover:bg-indigo-400 transition-colors shadow-xl shadow-indigo-500/30"
              >
                Get early access — it&apos;s free
                <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold text-lg px-8 py-4 rounded-xl border border-white/10 hover:bg-white/15 transition-colors"
              >
                See how it works
              </a>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
              {[
                "No credit card required",
                "Live in under an hour",
                "Cancel anytime",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <svg aria-hidden="true" className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Right: illustration */}
          <div className="hidden lg:block">
            <HeroIllustration />
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
          {[
            { value: "< 1 hour", label: "Average setup time" },
            { value: "8+", label: "Industry templates" },
            { value: "47%", label: "Avg. review increase" },
            { value: "5 tools", label: "In one platform" },
          ].map((stat) => (
            <div key={stat.label} className="text-center md:text-left">
              <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-28 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Everything you need. Nothing you don&apos;t.
          </h2>
          <p className="text-lg text-gray-500">
            Versa bundles the 5 tools that local businesses actually need into one simple platform — so you can stop paying for 5 different subscriptions and start actually using them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature) => {
            const colors = featureColorMap[feature.color];
            return (
              <div
                key={feature.id}
                className="group relative rounded-2xl p-6 bg-white border border-gray-100 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-200"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.icon} ring-1 ${colors.ring} flex items-center justify-center mb-5`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-28 px-4 sm:px-6 lg:px-8"
      style={{ background: "linear-gradient(160deg, #1e1b4b 0%, #312e81 100%)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">
            How it works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Up and running in 3 steps
          </h2>
          <p className="text-lg text-indigo-200">
            No learning curve. No technical knowledge required.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line (desktop) */}
          <div aria-hidden="true" className="hidden lg:block absolute top-20 left-[calc(16.67%-1px)] right-[calc(16.67%-1px)] h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Mobile connector arrow */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div aria-hidden="true" className="lg:hidden flex justify-center py-3">
                     <svg aria-hidden="true" className="w-5 h-5 text-indigo-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}

                <div className="bg-white/5 rounded-2xl p-8 ring-1 ring-white/10 text-center">
                  <div className="flex flex-col items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 ring-1 ring-indigo-400/30 flex items-center justify-center">
                      {step.visual}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                      Step {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-sm text-indigo-200 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#waitlist"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors shadow-xl"
          >
            Start building your site
            <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="py-28 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">
            Customer stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Local businesses love Versa
          </h2>
          <p className="text-lg text-gray-500">
            Real results from real business owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Large quote mark */}
              <div aria-hidden="true" className="text-6xl font-serif text-indigo-100 leading-none mb-3 select-none">
                &ldquo;
              </div>

              <blockquote className="text-gray-700 leading-relaxed mb-6 flex-1">
                {testimonial.quote}
              </blockquote>

              {/* Stars */}
              <div className="flex gap-1 mb-5" role="img" aria-label="5 out of 5 stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} aria-hidden="true" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                  aria-hidden="true"
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-gray-500 text-xs">{testimonial.business}</p>
                    <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-medium px-1.5 py-0.5 rounded">
                      {testimonial.businessType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  return (
    <section id="pricing" className="py-28 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-gray-500">
            No setup fees. No long-term contracts. Cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {PRICING.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-2xl shadow-indigo-200 ring-2 ring-indigo-500"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-block bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Most popular
                  </span>
                </div>
              )}

              <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-3">
                <span className={`text-5xl font-extrabold tracking-tight ${plan.highlighted ? "text-white" : "text-gray-900"}`}>
                  {plan.price}
                </span>
                <span className={`text-sm font-medium ${plan.highlighted ? "text-indigo-200" : "text-gray-400"}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-sm mb-7 ${plan.highlighted ? "text-indigo-100" : "text-gray-500"}`}>
                {plan.description}
              </p>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <svg
                      aria-hidden="true"
                      className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlighted ? "text-indigo-200" : "text-indigo-500"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className={plan.highlighted ? "text-indigo-100" : "text-gray-600"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#waitlist"
                className={`block w-full text-center font-semibold py-3.5 rounded-xl transition-all ${
                  plan.highlighted
                    ? "bg-white text-indigo-700 hover:bg-indigo-50 shadow-lg"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100"
                }`}
              >
                {plan.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Both plans include a 14-day free trial. No credit card required to start.
        </p>
      </div>
    </section>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Simulate submission — will wire to real API when backend is ready
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section
      id="waitlist"
      className="relative overflow-hidden py-28 px-4 sm:px-6 lg:px-8"
      style={{ background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 60%, #7c3aed 100%)" }}
    >
      {/* Background pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Glow orbs */}
      <div aria-hidden="true" className="absolute top-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-0 right-0 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl" />

      <div className="relative max-w-2xl mx-auto text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight">
          Ready to get more customers?
        </h2>
        <p className="text-lg text-indigo-100 mb-10">
          Join hundreds of local business owners getting early access to Versa. Free to try. No tech skills required.
        </p>

        {submitted ? (
          <div className="bg-white/10 rounded-2xl p-10 ring-1 ring-white/20">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg aria-hidden="true" className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">You&apos;re on the list!</h3>
            <p className="text-indigo-200">
              We&apos;ll be in touch soon with your early access invite. Keep an eye on your inbox.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            noValidate
          >
            <label htmlFor="waitlist-email" className="sr-only">
              Email address
            </label>
            <input
              id="waitlist-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-white text-gray-900 placeholder-gray-400 px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white/60 shadow-lg"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-70 whitespace-nowrap shadow-lg"
            >
              {loading ? "Joining..." : "Get early access"}
            </button>
          </form>
        )}

        <p className="text-xs text-indigo-300/80 mt-5">
          No spam. Unsubscribe anytime. We respect your privacy.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a0818] text-gray-400 py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg aria-hidden="true" className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">{BRAND.name}</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {BRAND.tagline}
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="text-sm font-semibold text-gray-200 mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-200 mb-4">Company</h4>
              <ul className="space-y-2.5 text-sm">
                <li><span className="text-gray-500 cursor-default">About</span></li>
                <li><span className="text-gray-500 cursor-default">Blog</span></li>
                <li><a href="#waitlist" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <div className="flex gap-5">
            <span className="cursor-default">Privacy Policy</span>
            <span className="cursor-default">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <WaitlistSection />
      </main>
      <Footer />
    </div>
  );
}
