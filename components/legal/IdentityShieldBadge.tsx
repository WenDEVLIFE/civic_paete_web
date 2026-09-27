import Link from "next/link";
import { ShieldCheck } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type BadgeVariant = "compact" | "banner";

interface IdentityShieldBadgeProps {
  /** "compact" = single-line chip for inline use; "banner" = full panel for forms */
  variant?: BadgeVariant;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Reusable "Your Identity is Protected" civic security badge.
 * Embed in any form or modal where citizen identity is at stake (report submission,
 * account registration, whistleblower reporting, etc.).
 */
export default function IdentityShieldBadge({
  variant = "banner",
  className = "",
}: IdentityShieldBadgeProps) {
  if (variant === "compact") {
    return (
      <Link
        href="/legal/safety"
        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full transition-opacity hover:opacity-80 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-heading min-h-[36px] ${className}`}
        aria-label="Your identity is protected — View safety details"
      >
        <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
        <span>Identity Shield Active</span>
      </Link>
    );
  }

  // ── Banner variant ─────────────────────────────────────────────────────────
  return (
    <div
      className={`rounded-xl px-4 py-3 flex items-start gap-3 bg-gradient-to-r from-emerald-500/10 via-[#0A1931] to-emerald-500/5 border border-emerald-500/25 ${className}`}
      role="note"
      aria-label="Identity protection information"
    >
      {/* Shield icon */}
      <div
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
        aria-hidden="true"
      >
        <ShieldCheck className="w-4 h-4" />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold mb-0.5 text-emerald-400 font-heading">
          🛡️ Your Identity is Legally Protected
        </p>
        <p className="text-xs leading-relaxed text-slate-300 font-sans">
          Your personal identity is strictly shielded on public feeds. You are safeguarded under{" "}
          <span className="text-emerald-400 font-medium">RA 10173</span> and the{" "}
          <span className="text-emerald-400 font-medium">Paete Whistleblower Protection Protocol</span>.{" "}
          <Link
            href="/legal/safety"
            className="underline underline-offset-2 text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            Learn about citizen legal protections
          </Link>
        </p>
      </div>
    </div>
  );
}
