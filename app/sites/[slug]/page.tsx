import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db/client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Business {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  description: string | null;
  category: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  site: {
    templateId: string;
    config: unknown;
    blocks: unknown;
    isPublished: boolean;
    metaTitle: string | null;
    metaDescription: string | null;
  } | null;
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function getBusinessBySlug(slug: string): Promise<Business | null> {
  try {
    return await prisma.business.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true,
        name: true,
        slug: true,
        phone: true,
        description: true,
        category: true,
        address: true,
        city: true,
        state: true,
        site: {
          select: {
            templateId: true,
            config: true,
            blocks: true,
            isPublished: true,
            metaTitle: true,
            metaDescription: true,
          },
        },
      },
    });
  } catch {
    return null;
  }
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    return { title: "Site not found" };
  }

  const title = business.site?.metaTitle ?? business.name;
  const description =
    business.site?.metaDescription ??
    business.description ??
    `${business.name} — serving ${business.city ?? "your area"}`;

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
  };
}

// ─── Site not published notice ────────────────────────────────────────────────

function SiteUnpublishedPage({ business }: { business: Business }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-gray-200 flex items-center justify-center mx-auto mb-4">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{business.name}</h1>
        <p className="text-gray-500 text-sm">
          This site is coming soon. Check back later!
        </p>
      </div>
    </div>
  );
}

// ─── Public site renderer ─────────────────────────────────────────────────────

function PublicSitePage({ business }: { business: Business }) {
  const config = (
    typeof business.site?.config === "object" && business.site.config !== null
      ? business.site.config
      : {}
  ) as Record<string, string>;

  const primaryColor = config.primaryColor ?? "#1e3a5f";
  const accentColor = config.accentColor ?? "#3b82f6";
  const gradient = `linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%)`;
  const locationStr = [business.city, business.state].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <span className="font-bold text-gray-900 text-lg">{business.name}</span>
            {business.category && (
              <span className="ml-2 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                {business.category}
              </span>
            )}
          </div>
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="text-sm font-semibold text-white px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
              style={{ background: primaryColor }}
            >
              {business.phone}
            </a>
          )}
        </div>
      </header>

      {/* Hero */}
      <section
        className="text-white py-16 px-4 text-center"
        style={{ background: gradient }}
      >
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 leading-tight">
            {business.name}
          </h1>
          {business.description && (
            <p className="text-lg opacity-90 mb-2">{business.description}</p>
          )}
          {locationStr && (
            <p className="text-sm opacity-75 mb-8">Serving {locationStr}</p>
          )}
          {business.phone && (
            <a
              href={`tel:${business.phone}`}
              className="inline-flex items-center gap-2 bg-white font-bold px-6 py-3 rounded-xl text-base hover:opacity-95 transition-opacity shadow-lg"
              style={{ color: primaryColor }}
            >
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
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Call Now — Free Quote
            </a>
          )}
        </div>
      </section>

      {/* About & Contact */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* About */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">About Us</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {business.description ??
                `${business.name} provides professional ${business.category ?? "services"} in the ${locationStr || "local"} area. Contact us today for a free quote.`}
            </p>
            {locationStr && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Serving {locationStr}
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Contact Us</h2>
            <div className="space-y-3">
              {business.phone && (
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${primaryColor}15` }}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <a
                      href={`tel:${business.phone}`}
                      className="text-sm font-semibold text-gray-900 hover:underline"
                    >
                      {business.phone}
                    </a>
                  </div>
                </div>
              )}
              {business.address && (
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${primaryColor}15` }}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-4 h-4"
                      style={{ color: primaryColor }}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Address</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {business.address}
                      {locationStr ? `, ${locationStr}` : ""}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="mt-5 w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl text-sm transition-opacity hover:opacity-90"
                style={{ background: primaryColor }}
              >
                Get a Free Quote
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 text-center bg-white mt-8">
        <p className="font-bold text-gray-800 text-sm mb-1">{business.name}</p>
        {locationStr && (
          <p className="text-gray-400 text-xs">{locationStr}</p>
        )}
        {business.phone && (
          <p className="text-gray-400 text-xs mt-0.5">{business.phone}</p>
        )}
        <p className="text-gray-300 text-xs mt-3">
          &copy; {new Date().getFullYear()} {business.name}. All rights reserved.
        </p>
        <p className="text-gray-300 text-xs mt-2">
          Powered by{" "}
          <a
            href="https://groundworklocal.com"
            className="hover:text-gray-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            GroundWork
          </a>
        </p>
      </footer>
    </div>
  );
}

// ─── Page component ───────────────────────────────────────────────────────────

export default async function SitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  // If site exists but is not published, show a coming-soon page
  if (!business.site?.isPublished) {
    return <SiteUnpublishedPage business={business} />;
  }

  return <PublicSitePage business={business} />;
}
