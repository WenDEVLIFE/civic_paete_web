"use client";

import { useEffect, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ConsentChoice = "accepted" | "essential" | "declined" | null;

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
}

const STORAGE_KEY = "civic_cookie_consent_v1";

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true, // Always required — cannot be disabled
  analytics: false,
  functional: false,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function loadStoredConsent(): ConsentChoice {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { choice: ConsentChoice };
    return parsed.choice ?? null;
  } catch {
    return null;
  }
}

function persistConsent(choice: ConsentChoice, prefs: CookiePreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ choice, preferences: prefs, timestamp: Date.now() })
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = loadStoredConsent();
    if (!stored) {
      // Small delay so the page finishes painting first
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted || !visible) return null;

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleAcceptAll() {
    const fullPrefs: CookiePreferences = {
      essential: true,
      analytics: true,
      functional: true,
    };
    persistConsent("accepted", fullPrefs);
    setVisible(false);
  }

  function handleEssentialOnly() {
    persistConsent("essential", DEFAULT_PREFERENCES);
    setVisible(false);
  }

  function handleSaveCustom() {
    persistConsent("accepted", prefs);
    setVisible(false);
  }

  function togglePref(key: keyof Omit<CookiePreferences, "essential">) {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Backdrop (subtle) */}
      <div
        className="fixed inset-0 z-[998] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(7,17,38,0.6) 0%, transparent 40%)",
        }}
        aria-hidden="true"
      />

      {/* Banner */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Pahintulot sa Cookies"
        id="cookie-consent-banner"
        className="fixed bottom-0 left-0 right-0 z-[999] animate-in slide-in-from-bottom-4 duration-500"
      >
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(11,24,49,0.97) 0%, rgba(17,35,71,0.97) 100%)",
            borderTop: "1px solid rgba(96,165,250,0.18)",
            boxShadow:
              "0 -8px 40px rgba(7,17,38,0.7), 0 -1px 0 rgba(96,165,250,0.1)",
            backdropFilter: "blur(16px)",
          }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Main Banner Row */}
          {!showCustomize && (
            <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Icon + Text */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Shield Icon */}
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mt-0.5"
                  style={{
                    background: "rgba(37,99,235,0.15)",
                    border: "1px solid rgba(37,99,235,0.3)",
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

                {/* Text */}
                <div className="min-w-0">
                  <p
                    className="text-sm font-semibold mb-0.5"
                    style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
                  >
                    Protektado ang Iyong Datos — RA 10173
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#94A3B8" }}
                  >
                    Gumagamit ang Civic Paete ng cookies upang mapabuti ang
                    inyong karanasan at matiyak ang seguridad ng plataporma.
                    Ayon sa{" "}
                    <span style={{ color: "#60A5FA" }}>
                      Data Privacy Act ng Pilipinas (RA 10173)
                    </span>
                    , kailangan namin ang inyong pahintulot.{" "}
                    <a
                      href="/legal/privacy"
                      className="underline underline-offset-2 hover:opacity-80 transition-opacity"
                      style={{ color: "#60A5FA" }}
                    >
                      Basahin ang Patakaran sa Privacy
                    </a>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:flex-shrink-0">
                <button
                  id="cookie-customize-btn"
                  type="button"
                  onClick={() => setShowCustomize(true)}
                  className="text-xs font-medium px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer min-h-[40px]"
                  style={{
                    color: "#94A3B8",
                    border: "1px solid rgba(148,163,184,0.2)",
                    background: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#F8FAFC";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(148,163,184,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
                    (e.currentTarget as HTMLButtonElement).style.borderColor =
                      "rgba(148,163,184,0.2)";
                  }}
                >
                  I-customize
                </button>

                <button
                  id="cookie-essential-btn"
                  type="button"
                  onClick={handleEssentialOnly}
                  className="text-xs font-medium px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer min-h-[40px]"
                  style={{
                    color: "#60A5FA",
                    border: "1px solid rgba(96,165,250,0.25)",
                    background: "rgba(96,165,250,0.08)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(96,165,250,0.14)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "rgba(96,165,250,0.08)";
                  }}
                >
                  Tanggapin Lamang ang Kailangan
                </button>

                <button
                  id="cookie-accept-all-btn"
                  type="button"
                  onClick={handleAcceptAll}
                  className="text-xs font-semibold px-4 py-2 rounded-lg transition-all duration-150 active:scale-[0.97] cursor-pointer min-h-[40px]"
                  style={{
                    background:
                      "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                    color: "#FFFFFF",
                    boxShadow: "0 2px 12px rgba(37,99,235,0.4)",
                    border: "none",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 4px 20px rgba(37,99,235,0.55)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.boxShadow =
                      "0 2px 12px rgba(37,99,235,0.4)";
                  }}
                >
                  Tanggapin Lahat
                </button>
              </div>
            </div>
          )}

          {/* Customize Panel */}
          {showCustomize && (
            <div className="py-5">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCustomize(false)}
                    className="p-1.5 rounded-md transition-colors cursor-pointer"
                    style={{ color: "#94A3B8" }}
                    aria-label="Bumalik"
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
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <h2
                    className="text-sm font-bold tracking-wide uppercase"
                    style={{
                      color: "#F8FAFC",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    Mga Kagustuhan sa Cookies
                  </h2>
                </div>
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: "rgba(37,99,235,0.15)",
                    color: "#60A5FA",
                    border: "1px solid rgba(37,99,235,0.25)",
                  }}
                >
                  RA 10173
                </span>
              </div>

              {/* Cookie Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {/* Essential - Always On */}
                <CookieCategoryCard
                  icon="🔒"
                  title="Mahahalagang Cookies"
                  description="Kinakailangan para sa seguridad at pangunahing gawain ng plataporma. Hindi maaaring i-disable."
                  enabled={true}
                  locked={true}
                  onToggle={() => {}}
                  toggleId="cookie-essential-toggle"
                />

                {/* Functional */}
                <CookieCategoryCard
                  icon="⚙️"
                  title="Functional na Cookies"
                  description="Nagse-save ng inyong mga kagustuhan tulad ng wika at uri ng mapa para sa mas maginhawang paggamit."
                  enabled={prefs.functional}
                  locked={false}
                  onToggle={() => togglePref("functional")}
                  toggleId="cookie-functional-toggle"
                />

                {/* Analytics */}
                <CookieCategoryCard
                  icon="📊"
                  title="Analytics na Cookies"
                  description="Tumutulong sa amin na maunawaan kung paano ginagamit ang plataporma para mapabuti ang serbisyo sa komunidad."
                  enabled={prefs.analytics}
                  locked={false}
                  onToggle={() => togglePref("analytics")}
                  toggleId="cookie-analytics-toggle"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 justify-end">
                <button
                  id="cookie-save-custom-btn"
                  type="button"
                  onClick={handleSaveCustom}
                  className="text-xs font-semibold px-5 py-2.5 rounded-lg transition-all duration-150 active:scale-[0.97] cursor-pointer min-h-[40px]"
                  style={{
                    background:
                      "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                    color: "#FFFFFF",
                    boxShadow: "0 2px 12px rgba(37,99,235,0.4)",
                    border: "none",
                  }}
                >
                  I-save ang mga Kagustuhan
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Sub-component: Cookie Category Card ─────────────────────────────────────

interface CookieCategoryCardProps {
  icon: string;
  title: string;
  description: string;
  enabled: boolean;
  locked: boolean;
  onToggle: () => void;
  toggleId: string;
}

function CookieCategoryCard({
  icon,
  title,
  description,
  enabled,
  locked,
  onToggle,
  toggleId,
}: CookieCategoryCardProps) {
  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2 transition-all duration-200"
      style={{
        background: enabled
          ? "rgba(37,99,235,0.08)"
          : "rgba(17,35,71,0.6)",
        border: enabled
          ? "1px solid rgba(37,99,235,0.25)"
          : "1px solid rgba(96,165,250,0.1)",
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none" aria-hidden="true">
            {icon}
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
          >
            {title}
          </span>
        </div>

        {/* Toggle */}
        {locked ? (
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: "rgba(16,185,129,0.12)",
              color: "#10B981",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            Palaging On
          </span>
        ) : (
          <button
            id={toggleId}
            type="button"
            role="switch"
            aria-checked={enabled}
            onClick={onToggle}
            className="relative flex-shrink-0 w-9 h-5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 cursor-pointer"
            style={{
              background: enabled ? "#2563EB" : "rgba(148,163,184,0.2)",
              boxShadow: enabled ? "0 0 8px rgba(37,99,235,0.4)" : "none",
            }}
          >
            <span
              className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
              style={{
                transform: enabled ? "translateX(16px)" : "translateX(0)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              }}
            />
          </button>
        )}
      </div>

      <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
        {description}
      </p>
    </div>
  );
}
