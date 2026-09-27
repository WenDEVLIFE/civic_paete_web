import React from "react";
import { Shield, UserCheck, Award, Landmark } from "lucide-react";

export type VerificationStatus =
  | "unverified"
  | "barangay_verified"
  | "community_leader"
  | "municipal_officer";

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export const VERIFICATION_CONFIG: Record<
  VerificationStatus,
  {
    label: string;
    description: string;
    bg: string;
    text: string;
    border: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  unverified: {
    label: "Unverified Resident",
    description: "Basic registered account awaiting local barangay verification.",
    bg: "bg-slate-500/10",
    text: "text-slate-300",
    border: "border-slate-500/25",
    icon: Shield,
  },
  barangay_verified: {
    label: "Barangay Verified",
    description: "Identity and residency verified with Paete Barangay records.",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: UserCheck,
  },
  community_leader: {
    label: "Community Leader",
    description: "Designated community organizer, HOA officer, or sector leader.",
    bg: "bg-purple-500/10",
    text: "text-purple-300",
    border: "border-purple-500/30",
    icon: Award,
  },
  municipal_officer: {
    label: "Municipal Officer",
    description: "Authenticated staff or executive official of the Paete Local Government.",
    bg: "bg-blue-500/15",
    text: "text-blue-300",
    border: "border-blue-500/30",
    icon: Landmark,
  },
};

export function VerificationBadge({
  status,
  size = "md",
  showIcon = true,
  className = "",
}: VerificationBadgeProps) {
  const config = VERIFICATION_CONFIG[status] || VERIFICATION_CONFIG.unverified;
  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3.5 py-1.5 text-sm gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border font-heading transition-all ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
      title={config.description}
      aria-label={config.label}
    >
      {showIcon && <Icon className={`${iconSizes[size]} shrink-0`} />}
      <span>{config.label}</span>
      {status === "barangay_verified" && size !== "sm" && (
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse ml-0.5" />
      )}
    </span>
  );
}
