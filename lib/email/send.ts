/**
 * Shared email sending utility.
 *
 * Feature-flagged by RESEND_ENABLED env var:
 *   - false (default): logs intent, does NOT send. Safe to deploy.
 *   - true: sends via Resend using RESEND_API_KEY.
 *
 * Usage:
 *   await sendEmail("user@example.com", "onboarding_nudge_24h", { firstName: "Jane" });
 */
import { Resend } from "resend";
import { buildEmailContent, type EmailTemplate, type TemplateData } from "./templates";

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "noreply@verygoodmarketing.com";

let _resend: Resend | null = null;

function getResendClient(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}

export async function sendEmail(
  to: string,
  template: EmailTemplate,
  data: TemplateData
): Promise<void> {
  const enabled = process.env.RESEND_ENABLED === "true";
  const content = buildEmailContent(template, data);

  if (!enabled) {
    console.log(
      `[sendEmail] RESEND_ENABLED=false — skipping send. Would have sent:`,
      {
        to,
        template,
        subject: content.subject,
        firstName: data.firstName,
      }
    );
    return;
  }

  try {
    const resend = getResendClient();
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });

    if (error) {
      console.error(`[sendEmail] Resend error for template "${template}" to ${to}:`, error);
      throw new Error(`Resend send failed: ${error.message}`);
    }

    console.log(`[sendEmail] Sent "${template}" to ${to}`);
  } catch (err) {
    console.error(`[sendEmail] Failed to send template "${template}" to ${to}:`, err);
    throw err;
  }
}
