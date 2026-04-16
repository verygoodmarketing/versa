import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/client";

/**
 * POST /api/waitlist
 *
 * Accepts waitlist email signups for the pre-launch landing page.
 * Stores emails in the `waitlist_signups` table (WaitlistSignup model).
 * Duplicate emails are silently ignored (returns 200 instead of error).
 */
export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { email } = body as Record<string, unknown>;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 422 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    await prisma.waitlistSignup.upsert({
      where: { email: normalizedEmail },
      create: { email: normalizedEmail },
      update: {},
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[api/waitlist] Failed to insert waitlist signup:", err);
    return NextResponse.json(
      { error: "Failed to save your email. Please try again." },
      { status: 500 }
    );
  }
}
