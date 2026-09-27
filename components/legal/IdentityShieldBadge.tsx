import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

type BadgeVariant = "compact" | "banner";

interface IdentityShieldBadgeProps {
  /** "compact" = single-line chip for inline use; "banner" = full panel for forms */
  variant?: BadgeVariant;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Reusable "Protektado ang Iyong Pagkakakilanlan" security badge.
 * Embed in any form or modal where user identity is at stake (report submission,
 * account registration, anonymous reporting, etc.).
 *
 * @example
 * // Compact chip (navbar, card footer)
 * <IdentityShieldBadge variant="compact" />
 *
 * // Banner panel (report submission form, verification flow)
 * <IdentityShieldBadge variant="banner" />
 */
export default function IdentityShieldBadge({
  variant = "banner",
  className = "",
}: IdentityShieldBadgeProps) {
  if (variant === "compact") {
    return (
      <Link
        href="/legal/safety"
        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full transition-opacity hover:opacity-80 ${className}`}
        style={{
          background: "rgba(16,185,129,0.1)",
          color: "#10B981",
          border: "1px solid rgba(16,185,129,0.2)",
          fontFamily: "var(--font-heading)",
        }}
        aria-label="Protektado ang inyong pagkakakilanlan — Tingnan ang detalye"
      >
        <svg
          className="w-3 h-3 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
        <span>Protektado ang Inyong Pagkakakilanlan</span>
      </Link>
    );
  }

  // ── Banner variant ─────────────────────────────────────────────────────────
  return (
    <div
      className={`rounded-xl px-4 py-3 flex items-start gap-3 ${className}`}
      role="note"
      aria-label="Impormasyon tungkol sa proteksyon ng pagkakakilanlan"
      style={{
        background:
          "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(17,35,71,0.5) 100%)",
        border: "1px solid rgba(16,185,129,0.2)",
      }}
    >
      {/* Shield icon */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
        style={{
          background: "rgba(16,185,129,0.15)",
          border: "1px solid rgba(16,185,129,0.25)",
        }}
        aria-hidden="true"
      >
        <svg
          className="w-4 h-4"
          style={{ color: "#10B981" }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-semibold mb-0.5"
          style={{ color: "#34D399", fontFamily: "var(--font-heading)" }}
        >
          🛡️ Protektado ang Inyong Pagkakakilanlan
        </p>
        <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
          Ang inyong personal na impormasyon ay hindi ipapakita sa publiko.
          Protektado kayo ng{" "}
          <span style={{ color: "#34D399" }}>RA 10173</span> at ng{" "}
          <span style={{ color: "#34D399" }}>Civic Paete Whistleblower Policy</span>.{" "}
          <Link
            href="/legal/safety"
            className="underline underline-offset-2 transition-opacity hover:opacity-80"
            style={{ color: "#10B981" }}
          >
            Alamin ang inyong mga karapatan
          </Link>
        </p>
      </div>
    </div>
  );
}
