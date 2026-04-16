"use client";

import { useState } from "react";
import { GroundworkLogoFullLight } from "@/components/brand/GroundworkLogo";
import { Loader2, CheckCircle2, ArrowRight } from "lucide-react";

export function PreLaunchPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Nav */}
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <GroundworkLogoFullLight width={160} height={42} />
        <span className="text-xs font-semibold tracking-widest uppercase text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
          Coming Soon
        </span>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-sm text-emerald-400 font-medium bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            We&rsquo;re launching soon
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Websites &amp; marketing for{" "}
            <span className="text-emerald-400">local businesses</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-xl mx-auto">
            GroundWork helps plumbers, electricians, cleaners, and contractors
            get found online and win more customers — without the complexity.
          </p>

          {/* Signup form */}
          {status === "success" ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="text-emerald-400 w-12 h-12" />
              <p className="text-xl font-semibold">You&rsquo;re on the list!</p>
              <p className="text-gray-400">
                We&rsquo;ll let you know the moment we launch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  disabled={status === "loading"}
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg transition-colors disabled:opacity-60 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Get early access
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              {status === "error" && (
                <p className="mt-2 text-sm text-red-400">{errorMsg}</p>
              )}
              <p className="mt-3 text-xs text-gray-500">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>

        {/* Feature highlights */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl w-full">
          {[
            {
              icon: "🌐",
              title: "Professional Website",
              desc: "Live in under an hour. No design skills needed.",
            },
            {
              icon: "📍",
              title: "Local SEO",
              desc: "Show up first when customers search near you.",
            },
            {
              icon: "📬",
              title: "Lead Capture",
              desc: "Turn visitors into calls, quotes, and bookings.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-left"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-xs text-gray-600">
        &copy; {new Date().getFullYear()} GroundWork. All rights reserved.
      </footer>
    </div>
  );
}
