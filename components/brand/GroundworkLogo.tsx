/**
 * GroundWork Brand Logo Components
 *
 * Using final PNG assets from /public/brand/
 * Assets delivered: VER-163 (replaces SVG-based approach from VER-122/VER-123)
 *
 * Naming convention:
 *   *-light.png  = dark text/marks → use on LIGHT backgrounds
 *   *-dark.png   = light/white text/marks → use on DARK backgrounds
 */

import Image from "next/image";

// ─── Full Lockup — for DARK backgrounds (white text) ─────────────────────────

export function GroundworkLogoFullLight({
  width = 220,
  height = 57,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src="/brand/logo-horizontal-dark.png"
      alt="GroundWork"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}

// ─── Full Lockup — for LIGHT backgrounds (dark text) ─────────────────────────

export function GroundworkLogoFull({
  width = 220,
  height = 57,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src="/brand/logo-horizontal-light.png"
      alt="GroundWork"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}

// ─── Icon Mark ────────────────────────────────────────────────────────────────

export function GroundworkIcon({
  width = 40,
  height = 40,
  className = "",
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <Image
      src="/brand/logo-icon-only.png"
      alt="GroundWork"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}

// ─── Wordmark Only ────────────────────────────────────────────────────────────

export function GroundworkWordmark({
  width = 200,
  height = 52,
  className = "",
  color = "dark",
}: {
  width?: number;
  height?: number;
  className?: string;
  /** "dark" = white wordmark for dark backgrounds, "light" = dark wordmark for light backgrounds */
  color?: string;
}) {
  // logo-wordmark-tagline-dark.png = light/white text → for dark backgrounds
  const src = "/brand/logo-wordmark-tagline-dark.png";
  return (
    <Image
      src={src}
      alt="GroundWork"
      width={width}
      height={height}
      className={className}
    />
  );
}
