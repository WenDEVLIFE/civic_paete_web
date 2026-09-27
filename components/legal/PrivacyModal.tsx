"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Shield, X, ExternalLink } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PrivacyModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Called when the user dismisses the modal */
  onClose: () => void;
  /**
   * Optional context label shown in the header.
   * E.g. "Pre-Submission Review" or "Account Verification"
   */
  context?: string;
}

// ─── Summary Content ─────────────────────────────────────────────────────────

const SUMMARY_POINTS = [
  {
    icon: "📋",
    title: "Data Collected",
    body: "Resident name, email (via Google Auth), Paete barangay location, submitted community reports, and technical session logs.",
  },
  {
    icon: "🎯",
    title: "Purpose of Processing",
    body: "Triage and remediation of civic concerns, automated municipal status notifications, and municipal resource planning. Resident data is never sold.",
  },
  {
    icon: "🤝",
    title: "Authorized Access",
    body: "Authorized officials of Paete LGU and Laguna Provincial Government (incident handling only), hosted on secure Firebase & Google Cloud infrastructure.",
  },
  {
    icon: "🛡️",
    title: "Citizen Rights (RA 10173)",
    body: "Full statutory rights to access, rectify, erase, or object under the Philippine Data Privacy Act. Contact dpo@paete.gov.ph for privacy inquiries.",
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function PrivacyModal({
  isOpen,
  onClose,
  context,
}: PrivacyModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Trap focus & close on Escape
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Privacy Policy Summary"
      id="privacy-modal"
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#071126]/80 backdrop-blur-md"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl outline-none overflow-hidden bg-gradient-to-br from-[#0D1F3C] to-[#112347] border border-blue-400/20 shadow-2xl max-h-[92vh] flex flex-col text-white"
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 flex-shrink-0 border-b border-blue-400/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-600/15 border border-blue-500/30 text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-sm font-bold font-heading text-white">
                  Privacy Policy Overview
                </h2>
                {context && (
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                    {context}
                  </span>
                )}
              </div>
              <p className="text-xs mt-0.5 text-slate-400 font-sans">
                Civic Paete • RA 10173 & NPC Compliant
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            id="privacy-modal-close-btn"
            onClick={onClose}
            aria-label="Close"
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 border border-slate-700/50 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Scrollable body ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 font-sans">
          <p className="text-xs leading-relaxed text-slate-300">
            Before proceeding, review how your civic records and identifying data are safeguarded under Philippine statutory standards in Paete, Laguna.
          </p>

          {/* Summary cards */}
          <div className="flex flex-col gap-2">
            {SUMMARY_POINTS.map((point) => (
              <div
                key={point.title}
                className="rounded-xl px-4 py-3 flex items-start gap-3 bg-[#0A1931]/70 border border-blue-400/10"
              >
                <span className="text-base flex-shrink-0 mt-0.5" aria-hidden="true">
                  {point.icon}
                </span>
                <div>
                  <p className="text-xs font-semibold mb-0.5 font-heading text-slate-200">
                    {point.title}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-400">
                    {point.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Read full link */}
          <Link
            href="/legal/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors self-start mt-1"
            onClick={onClose}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Read Complete Statutory Privacy Policy</span>
          </Link>
        </div>

        {/* ── Footer actions ─────────────────────────────────── */}
        <div className="flex-shrink-0 px-5 py-4 flex flex-col sm:flex-row gap-2 border-t border-blue-400/10">
          <button
            type="button"
            id="privacy-modal-dismiss-btn"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white transition-all shadow-md shadow-blue-600/30 cursor-pointer min-h-[44px] flex items-center justify-center font-heading"
          >
            I Understand — Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
