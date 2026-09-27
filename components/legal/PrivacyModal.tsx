"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PrivacyModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Called when the user dismisses the modal */
  onClose: () => void;
  /**
   * Optional context label shown in the header.
   * E.g. "Bago Mag-ulat" or "Pagpapatunay ng Account"
   */
  context?: string;
}

// ─── Summary Content ─────────────────────────────────────────────────────────

const SUMMARY_POINTS = [
  {
    icon: "📋",
    title: "Ano ang Kinokolekta Namin",
    body: "Pangalan, e-mail (mula sa Google), barangay, mga ulat na isinumite, at teknikal na datos ng session.",
  },
  {
    icon: "🎯",
    title: "Para Saan ang Datos",
    body: "Pagpoproseso ng inyong mga ulat, pagpapadala ng mga abiso, at pagpapabuti ng serbisyo ng LGU. Hindi namin ibinibenta ang inyong datos.",
  },
  {
    icon: "🤝",
    title: "Sino ang May Access",
    body: "Mga opisyal ng Paete at Laguna LGU (para sa inyong mga ulat lamang) at Firebase/Google Cloud bilang aming imprastruktura.",
  },
  {
    icon: "🛡️",
    title: "Inyong mga Karapatan (RA 10173)",
    body: "Karapatang mag-access, itama, burahin, at ilipat ang inyong datos. Makipag-ugnayan sa dpo@paete.gov.ph.",
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

    // Focus the panel for screen-reader entry
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Click-outside to close
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
      aria-label="Patakaran sa Privacy — Buod"
      id="privacy-modal"
      className="fixed inset-0 z-[1000] flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: "rgba(7,17,38,0.8)", backdropFilter: "blur(6px)" }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl outline-none overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0D1F3C 0%, #112347 100%)",
          border: "1px solid rgba(96,165,250,0.15)",
          boxShadow:
            "0 -8px 60px rgba(7,17,38,0.8), 0 0 0 1px rgba(96,165,250,0.08)",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div
          className="flex items-start justify-between px-5 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(96,165,250,0.1)" }}
        >
          <div className="flex items-center gap-3">
            {/* Shield icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(37,99,235,0.15)",
                border: "1px solid rgba(37,99,235,0.25)",
              }}
            >
              <svg
                className="w-5 h-5"
                style={{ color: "#60A5FA" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2
                  className="text-sm font-bold"
                  style={{
                    color: "#F8FAFC",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Patakaran sa Privacy
                </h2>
                {context && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{
                      background: "rgba(245,158,11,0.12)",
                      color: "#F59E0B",
                      border: "1px solid rgba(245,158,11,0.2)",
                    }}
                  >
                    {context}
                  </span>
                )}
              </div>
              <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
                Civic Paete • RA 10173 Compliant
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            id="privacy-modal-close-btn"
            onClick={onClose}
            aria-label="Isara"
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            style={{
              color: "#64748B",
              border: "1px solid rgba(100,116,139,0.2)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#F8FAFC";
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(248,250,252,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "#64748B";
              (e.currentTarget as HTMLButtonElement).style.background =
                "transparent";
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* ── Scrollable body ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {/* Intro */}
          <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
            Bago kayo magpatuloy, nais naming ipaalam kung paano namin
            pinoprotektahan ang inyong personal na impormasyon bilang mamamayan
            ng Paete, Laguna.
          </p>

          {/* Summary cards */}
          <div className="flex flex-col gap-2">
            {SUMMARY_POINTS.map((point) => (
              <div
                key={point.title}
                className="rounded-xl px-4 py-3 flex items-start gap-3"
                style={{
                  background: "rgba(10,25,49,0.6)",
                  border: "1px solid rgba(96,165,250,0.08)",
                }}
              >
                <span
                  className="text-base flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  {point.icon}
                </span>
                <div>
                  <p
                    className="text-xs font-semibold mb-0.5"
                    style={{
                      color: "#E2E8F0",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {point.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
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
            className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80 self-start"
            style={{ color: "#60A5FA" }}
            onClick={onClose}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
              />
            </svg>
            Basahin ang buong Patakaran sa Privacy
          </Link>
        </div>

        {/* ── Footer actions ─────────────────────────────────── */}
        <div
          className="flex-shrink-0 px-5 py-4 flex flex-col sm:flex-row gap-2"
          style={{ borderTop: "1px solid rgba(96,165,250,0.1)" }}
        >
          <button
            type="button"
            id="privacy-modal-dismiss-btn"
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] cursor-pointer min-h-[44px]"
            style={{
              background:
                "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
              color: "#FFFFFF",
              border: "none",
              boxShadow: "0 2px 12px rgba(37,99,235,0.35)",
              fontFamily: "var(--font-heading)",
            }}
          >
            Naiintindihan Ko — Magpatuloy
          </button>
        </div>
      </div>
    </div>
  );
}
