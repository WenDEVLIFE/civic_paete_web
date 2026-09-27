"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, ChevronLeft, Lock, Settings2, BarChart2 } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type ConsentChoice = "accepted" | "essential" | "declined" | null;

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  functional: boolean;
}

const STORAGE_KEY = "civic_cookie_consent_v1";

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true, // Strictly necessary for authentication and CSRF defense
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
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted || !visible) return null;

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

  return (
    <>
      {/* Subtle bottom gradient backdrop */}
      <div
        className="fixed inset-0 z-[998] pointer-events-none bg-gradient-to-t from-[#071126]/80 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Floating Accessible Consent Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Data Privacy and Cookie Preferences"
        id="cookie-consent-banner"
        className="fixed bottom-0 left-0 right-0 z-[999] animate-in slide-in-from-bottom-4 duration-500"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-[#0A1931]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-xl p-5 sm:p-6 text-white">
            {/* Main Banner Row */}
            {!showCustomize && (
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Icon + Explanatory Text */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#60A5FA]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-white uppercase font-heading tracking-wide">
                        Citizen Data Protection &bull; RA 10173
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                        NPC COMPLIANT
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      Civic Paete utilizes essential telemetry and secure session cookies to verify resident identity,
                      prevent fraudulent hazard claims, and analyze municipal response SLAs under the{" "}
                      <strong className="text-white font-medium">Philippine Data Privacy Act of 2012</strong>.{" "}
                      <Link href="/legal/privacy" className="text-[#60A5FA] underline hover:text-[#93C5FD]">
                        Read our Privacy Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>

                {/* Tactile Action Buttons (touch target >= 44px) */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                  <button
                    id="cookie-customize-btn"
                    type="button"
                    onClick={() => setShowCustomize(true)}
                    className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Customize Preferences
                  </button>

                  <button
                    id="cookie-essential-btn"
                    type="button"
                    onClick={handleEssentialOnly}
                    className="flex-1 sm:flex-initial min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold text-[#60A5FA] hover:text-white bg-[#2563EB]/10 hover:bg-[#2563EB]/20 border border-[#2563EB]/30 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Strictly Necessary Only
                  </button>

                  <button
                    id="cookie-accept-all-btn"
                    type="button"
                    onClick={handleAcceptAll}
                    className="w-full sm:w-auto min-h-[44px] px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-lg shadow-[#2563EB]/30 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Accept All Cookies
                  </button>
                </div>
              </div>
            )}

            {/* Customization Drawer */}
            {showCustomize && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowCustomize(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      aria-label="Back to summary"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                      Granular Privacy & Cookie Preferences
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">DPA 2012 Standard</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Category 1: Strictly Necessary */}
                  <div className="p-4 rounded-xl bg-[#112347]/60 border border-white/10 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-white font-bold text-xs font-heading">
                          <Lock className="w-4 h-4 text-emerald-400" />
                          <span>Strictly Necessary</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                          ALWAYS ON
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Mandatory for Firebase Authentication sessions, security anti-CSRF tokens, and rate-limiting.
                        Cannot be disabled.
                      </p>
                    </div>
                  </div>

                  {/* Category 2: Functional */}
                  <div className="p-4 rounded-xl bg-[#112347]/60 border border-white/10 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-white font-bold text-xs font-heading">
                          <Settings2 className="w-4 h-4 text-[#60A5FA]" />
                          <span>Functional & Local Cache</span>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={prefs.functional}
                          onClick={() => togglePref("functional")}
                          className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                            prefs.functional ? "bg-[#2563EB]" : "bg-slate-700"
                          }`}
                        >
                          <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform mt-1 ml-1 ${
                              prefs.functional ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Remembers your selected Barangay filter, map style preferences, and draft report state between
                        visits.
                      </p>
                    </div>
                  </div>

                  {/* Category 3: Civic Analytics */}
                  <div className="p-4 rounded-xl bg-[#112347]/60 border border-white/10 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 text-white font-bold text-xs font-heading">
                          <BarChart2 className="w-4 h-4 text-amber-400" />
                          <span>Civic Service Analytics</span>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={prefs.analytics}
                          onClick={() => togglePref("analytics")}
                          className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${
                            prefs.analytics ? "bg-[#2563EB]" : "bg-slate-700"
                          }`}
                        >
                          <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform mt-1 ml-1 ${
                              prefs.analytics ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Collects de-identified performance metrics to evaluate municipal response times and infrastructure
                        resolution rates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10">
                  <p className="text-xs text-slate-400">
                    Preferences are stored locally on your device for 365 days.
                  </p>
                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className="min-h-[44px] px-6 py-2 rounded-xl text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] transition-all active:scale-[0.98] cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
