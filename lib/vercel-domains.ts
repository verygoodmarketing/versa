/**
 * Vercel domain provisioning utilities.
 *
 * Used to add/remove per-slug subdomains (e.g. acme.groundworklocal.com) from
 * the Vercel project at business creation time, so the wildcard CNAME
 * (* -> cname.vercel-dns.com) that lives on Cloudflare resolves correctly via
 * Vercel's edge network without needing NS delegation.
 *
 * Required env vars:
 *   VERCEL_TOKEN          — Vercel personal/team access token
 *   VERCEL_PROJECT_ID     — ID of the Vercel project (e.g. prj_xxx)
 *   VERCEL_TEAM_ID        — (optional) Vercel team ID; omit for personal accounts
 */

const BASE_DOMAIN = "groundworklocal.com";
const VERCEL_API = "https://api.vercel.com";

function getHeaders(): HeadersInit {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error("VERCEL_TOKEN env var is not set");
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function buildUrl(path: string): string {
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!projectId) {
    throw new Error("VERCEL_PROJECT_ID env var is not set");
  }
  const teamId = process.env.VERCEL_TEAM_ID;
  const base = `${VERCEL_API}/v10/projects/${projectId}${path}`;
  return teamId ? `${base}?teamId=${teamId}` : base;
}

/**
 * Adds `{slug}.groundworklocal.com` to the Vercel project.
 * Treats "already exists" (409) as a success — idempotent.
 */
export async function addVercelDomain(slug: string): Promise<void> {
  const domain = `${slug}.${BASE_DOMAIN}`;
  const url = buildUrl("/domains");

  const res = await fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name: domain }),
  });

  if (res.status === 409) {
    // Domain already provisioned — nothing to do.
    console.log(`[vercel-domains] ${domain} already exists, skipping.`);
    return;
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `[vercel-domains] Failed to add ${domain}: HTTP ${res.status} — ${body}`
    );
  }

  console.log(`[vercel-domains] Added domain: ${domain}`);
}

/**
 * Removes `{slug}.groundworklocal.com` from the Vercel project.
 * Treats "not found" (404) as a success — idempotent.
 */
export async function removeVercelDomain(slug: string): Promise<void> {
  const domain = `${slug}.${BASE_DOMAIN}`;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!projectId) {
    throw new Error("VERCEL_PROJECT_ID env var is not set");
  }

  const teamId = process.env.VERCEL_TEAM_ID;
  const base = `${VERCEL_API}/v10/projects/${projectId}/domains/${domain}`;
  const url = teamId ? `${base}?teamId=${teamId}` : base;

  const res = await fetch(url, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (res.status === 404) {
    console.log(`[vercel-domains] ${domain} not found, skipping removal.`);
    return;
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `[vercel-domains] Failed to remove ${domain}: HTTP ${res.status} — ${body}`
    );
  }

  console.log(`[vercel-domains] Removed domain: ${domain}`);
}
