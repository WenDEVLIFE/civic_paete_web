"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CivicPaeteLogo } from "@/components/brand/CivicPaeteLogo";
import { Shield, Lock, Mail, ArrowLeft, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate municipal staff credential check
    setTimeout(() => {
      setIsLoading(false);
      // Allows demo access with any municipal address or standard credentials
      if (email.trim() && password.trim()) {
        router.push("/admin/dashboard");
      } else {
        setError("Mangyaring ilagay ang iyong Opisyal na Email at Password.");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#071126] px-4 py-12 relative overflow-hidden text-white">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Back to Resident Portal Link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Bumalik sa Portal ng Mamamayan</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <CivicPaeteLogo size="lg" variant="full" theme="dark" className="justify-center mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Portal ng mga Opisyal ng Bayan</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Municipal Administration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Eksklusibo para sa awtorisadong kawani ng Pamahalaang Bayan ng Paete.
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 rounded-2xl border border-white/15 bg-[#0A1931]/90 shadow-2xl backdrop-blur-md">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Opisyal na Municipal Email o Staff ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="halimbawa: admin@paete.gov.ph"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              <span>{isLoading ? "Bini-beripika..." : "Mag-login bilang Opisyal"}</span>
            </button>
          </form>

          {/* Audit Notice */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center text-[11px] text-slate-500 leading-relaxed">
            Ang lahat ng aktibidad at pagbabago ng report status sa portal na ito ay itinatala sa opisyal na audit log ng Pamahalaang Bayan ng Paete.
          </div>
        </div>
      </div>
    </div>
  );
}
