"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CivicPaeteLogo } from "@/components/brand/CivicPaeteLogo";
import { Shield, Lock, Mail, ArrowLeft, AlertCircle, KeyRound, Landmark, CheckCircle2 } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      // 1. Authenticate directly via Firebase Auth Client
      const userCredential = await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        cleanPassword
      );

      const firebaseUser = userCredential.user;

      // 2. Fetch role and profile from Firestore
      let role: "admin" | "governor" = cleanEmail.includes("governor") ? "governor" : "admin";
      let name = firebaseUser.displayName || (role === "governor" ? "Hon. Provincial Governor" : "Municipal Administrator");
      let office = role === "governor" ? "Office of the Provincial Governor - Laguna" : "Office of the Municipal Mayor";
      let barangayOrOffice = role === "governor" ? "Provincial Capitol, Laguna" : "Paete Municipal Hall";

      try {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const docData = userSnap.data();
          if (docData.role === "governor" || docData.role === "admin") {
            role = docData.role;
          }
          if (docData.name) name = docData.name;
          if (docData.office) office = docData.office;
          if (docData.barangayOrOffice) barangayOrOffice = docData.barangayOrOffice;
        }
      } catch (fsErr) {
        console.warn("Firestore profile lookup notice:", fsErr);
      }

      // 3. Store active session
      const sessionData = {
        uid: firebaseUser.uid,
        email: cleanEmail,
        name,
        role,
        office,
        barangayOrOffice,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("civic_paete_admin_session", JSON.stringify(sessionData));
        document.cookie = `civic_paete_role=${role}; path=/; max-age=86400`;
      }

      setSuccessMsg(`Welcome, ${name}! Redirecting to command console...`);

      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 500);
    } catch (err: unknown) {
      setIsLoading(false);
      const authErr = err as { code?: string; message?: string };

      if (
        authErr.code === "auth/invalid-credential" ||
        authErr.code === "auth/wrong-password" ||
        authErr.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password. Please verify your official credentials.");
      } else if (authErr.code === "auth/too-many-requests") {
        setError("Too many failed login attempts. Please try again later.");
      } else {
        setError(authErr.message || "An error occurred during authentication.");
      }
    }
  };

  const autofillCredentials = (selectedEmail: string, selectedPass: string) => {
    setEmail(selectedEmail);
    setPassword(selectedPass);
    setError("");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#071126] px-4 py-12 relative overflow-hidden text-white civic-ukit-pattern">
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Back to Resident Portal Link */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-all min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Citizen Portal</span>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <CivicPaeteLogo size="lg" variant="full" theme="dark" className="justify-center mb-4" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Official & Governance Console</span>
          </div>
          <h1 className="text-2xl font-bold font-heading text-white">
            Municipal & Provincial Command
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Restricted access for authorized personnel of the Municipality of Paete and Province of Laguna.
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

          {successMsg && (
            <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                Official Email or Staff ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@paete.gov.ph or governor@laguna.gov.ph"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all min-h-[44px]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all min-h-[44px]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition-all disabled:opacity-50 cursor-pointer min-h-[44px] font-heading"
            >
              <Shield className="w-4 h-4" />
              <span>{isLoading ? "Verifying Credentials..." : "Sign In to Official Console"}</span>
            </button>
          </form>

          {/* Quick Click Credentials for Admin & Governor */}
          <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
            <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-sans">
              Quick Test Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => autofillCredentials("admin@paete.gov.ph", "PaeteAdmin2026!")}
                className="text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-blue-600/20 hover:border-blue-500/40 transition-all group cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-blue-300 font-heading">
                  <KeyRound className="w-3.5 h-3.5 text-blue-400" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate font-mono">admin@paete.gov.ph</div>
              </button>

              <button
                type="button"
                onClick={() => autofillCredentials("governor@laguna.gov.ph", "LagunaGov2026!")}
                className="text-left p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-amber-600/20 hover:border-amber-500/40 transition-all group cursor-pointer min-h-[44px]"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-amber-300 font-heading">
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Governor</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate font-mono">governor@laguna.gov.ph</div>
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 pt-3 border-t border-white/5 text-center text-[10px] text-slate-500 leading-relaxed font-sans">
            Protected by Cloud Firestore Role-Based Access Control & Philippine RA 10173 compliance standards.
          </div>
        </div>
      </div>
    </div>
  );
}
