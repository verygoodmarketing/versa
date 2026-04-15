/**
 * Send Touch 1 cold outreach emails to local service business targets.
 *
 * Usage:
 *   RESEND_API_KEY=re_xxx DRY_RUN=true npx tsx scripts/send-cold-touch1.ts
 */

import { Resend } from "resend";

const DRY_RUN = process.env.DRY_RUN === "true";
const FROM_EMAIL =
  process.env.FROM_EMAIL || "Brad at Groundwork <brad@time.verygoodmarketing.com>";
const CALENDAR_LINK = "https://groundworklocal.com";

interface Target {
  firstName: string;
  businessName: string;
  trade: string;
  city: string;
  state: string;
  email: string;
}

const TARGETS: Target[] = [
  {
    firstName: "Brian",
    businessName: "1st Generation Electric",
    trade: "electrician",
    city: "Atlanta",
    state: "GA",
    email: "bfoster@fisrtgenelectric.com",
  },
  {
    firstName: "Owner",
    businessName: "Bay Area Contracting and Construction",
    trade: "contractor",
    city: "Tampa",
    state: "FL",
    email: "tampabayareacc@gmail.com",
  },
  {
    firstName: "Owner",
    businessName: "Mr Wise Electric",
    trade: "electrician",
    city: "Atlanta",
    state: "GA",
    email: "info@mrwiseelectric.com",
  },
  {
    firstName: "Paul",
    businessName: "Confident Electric",
    trade: "electrician",
    city: "Columbus",
    state: "OH",
    email: "confidentelectric@yahoo.com",
  },
  {
    firstName: "Jacob",
    businessName: "J.C. Lawncare",
    trade: "landscaper",
    city: "Denver",
    state: "CO",
    email: "jclawncaredenver@gmail.com",
  },
];

function buildSubject(t: Target): string {
  return `${t.firstName === "Owner" ? "Quick question" : t.firstName}, is ${t.businessName} showing up on Google?`;
}

function buildHtml(t: Target): string {
  const greeting =
    t.firstName === "Owner" ? "Hi there" : `Hi ${t.firstName}`;
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:24px 0;">
    <tr>
      <td align="left" style="max-width:560px;padding:0 24px;">
        <p style="margin:0 0 24px 0;">
          <img src="https://groundworklocal.com/brand/bimi-logo.svg" alt="Groundwork" width="36" height="36" style="display:inline-block;vertical-align:middle;border-radius:7px;" />
        </p>
        <p style="margin:0 0 16px 0;font-size:16px;line-height:26px;color:#333333;">${greeting},</p>

        <p style="margin:0 0 16px 0;font-size:16px;line-height:26px;color:#333333;">
          I was looking for ${t.trade} help in ${t.city} and came across ${t.businessName}.
        </p>

        <p style="margin:0 0 16px 0;font-size:16px;line-height:26px;color:#333333;">
          Quick question: when someone searches Google for a ${t.trade} in ${t.city}, are they finding you?
        </p>

        <p style="margin:0 0 16px 0;font-size:16px;line-height:26px;color:#333333;">
          I ask because most local ${t.trade} businesses I talk to rely on referrals and word-of-mouth — which is great, but it means they're invisible to the 78% of people who search online before they hire anyone.
        </p>

        <p style="margin:0 0 16px 0;font-size:16px;line-height:26px;color:#333333;">
          I built <a href="https://groundworklocal.com" style="color:#1a1a2e;">Groundwork</a> to fix that. It gets local service businesses online fast — professional website, local SEO, and a lead form that actually works — in under an hour, starting at $49/month.
        </p>

        <p style="margin:0 0 16px 0;font-size:16px;line-height:26px;color:#333333;">
          Would a quick 15-minute call make sense? I can show you exactly how it looks for a ${t.trade} business in ${t.city}.
        </p>

        <p style="margin:0 0 16px 0;font-size:16px;line-height:26px;color:#333333;">
          Just reply here or grab a time: <a href="${CALENDAR_LINK}" style="color:#1a1a2e;">${CALENDAR_LINK}</a>
        </p>

        <p style="margin:0 0 4px 0;font-size:16px;line-height:26px;color:#333333;">Brad</p>
        <p style="margin:0 0 24px 0;font-size:14px;line-height:22px;color:#888888;">
          Groundwork<br>
          <a href="https://groundworklocal.com" style="color:#888888;">groundworklocal.com</a>
        </p>

        <p style="margin:0;font-size:13px;line-height:20px;color:#aaaaaa;">
          P.S. 14-day free trial, no credit card required — nothing to lose.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText(t: Target): string {
  const greeting =
    t.firstName === "Owner" ? "Hi there" : `Hi ${t.firstName}`;
  return `${greeting},

I was looking for ${t.trade} help in ${t.city} and came across ${t.businessName}.

Quick question: when someone searches Google for a ${t.trade} in ${t.city}, are they finding you?

I ask because most local ${t.trade} businesses I talk to rely on referrals and word-of-mouth — which is great, but it means they're invisible to the 78% of people who search online before they hire anyone.

I built Groundwork to fix that. It gets local service businesses online fast — professional website, local SEO, and a lead form that actually works — in under an hour, starting at $49/month.

Would a quick 15-minute call make sense? I can show you exactly how it looks for a ${t.trade} business in ${t.city}.

Just reply here or grab a time: ${CALENDAR_LINK}

Brad
Groundwork
https://groundworklocal.com

P.S. 14-day free trial, no credit card required — nothing to lose.
`;
}

async function main() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log(`Touch 1 cold outreach — ${TARGETS.length} targets`);

  if (DRY_RUN) {
    console.log("\nDRY RUN — would send to:");
    for (const t of TARGETS) {
      console.log(`  - ${t.email} (${t.businessName}, ${t.city} ${t.state})`);
    }
    return;
  }

  const results: { email: string; businessName: string; status: string; id?: string }[] = [];

  for (const t of TARGETS) {
    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: t.email,
        subject: buildSubject(t),
        html: buildHtml(t),
        text: buildText(t),
      });

      if (result.error) {
        console.error(`FAILED ${t.email} (${t.businessName}):`, result.error);
        results.push({ email: t.email, businessName: t.businessName, status: "failed" });
      } else {
        console.log(`SENT to ${t.email} (${t.businessName}) — id: ${result.data?.id}`);
        results.push({ email: t.email, businessName: t.businessName, status: "sent", id: result.data?.id });
      }

      // Small delay to avoid rate limits
      await new Promise((r) => setTimeout(r, 300));
    } catch (err) {
      console.error(`ERROR sending to ${t.email}:`, err);
      results.push({ email: t.email, businessName: t.businessName, status: "error" });
    }
  }

  const sent = results.filter((r) => r.status === "sent").length;
  const failed = results.filter((r) => r.status !== "sent").length;
  console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
  console.log("\nResults:", JSON.stringify(results, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
