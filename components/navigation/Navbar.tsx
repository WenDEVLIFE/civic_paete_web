"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CivicPaeteLogo } from "../brand/CivicPaeteLogo";
import {
  Shield,
  PlusCircle,
  FileText,
  Menu,
  X,
  LogIn,
  LogOut,
  UserCheck,
  HardHat,
  Landmark,
  BarChart3,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { UserProfileModal } from "@/components/profile/UserProfileModal";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [adminSession, setAdminSession] = useState<{
    role?: string;
    email?: string;
    name?: string;
  } | null>(null);

  useEffect(() => {
    const checkAdminSession = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("civic_paete_admin_session");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.role === "admin" || parsed.role === "governor" || parsed.email)) {
              setAdminSession(parsed);
              return;
            }
          } catch {
            // ignore
          }
        }
        setAdminSession(null);
      }
    };

    checkAdminSession();
    window.addEventListener("storage", checkAdminSession);
    return () => window.removeEventListener("storage", checkAdminSession);
  }, []);

  const isOfficialOrAdmin = Boolean(
    adminSession ||
      (user?.email &&
        (user.email.endsWith("@paete.gov.ph") ||
          user.email.endsWith("@laguna.gov.ph") ||
          user.email.includes("admin") ||
          user.email.includes("governor"))) ||
      (user?.displayName &&
        (user.displayName.toLowerCase().includes("administrator") ||
          user.displayName.toLowerCase().includes("governor")))
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;

      // Sync resident profile to Firestore 'users' collection
      try {
        await setDoc(
          doc(db, "users", loggedUser.uid),
          {
            uid: loggedUser.uid,
            name: loggedUser.displayName || "Paete Resident",
            email: loggedUser.email || "",
            photoURL: loggedUser.photoURL || "",
            role: "resident",
            authProvider: "google",
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (fsErr) {
        console.warn("Notice: Firestore sync for Google resident:", fsErr);
      }
    } catch (err: unknown) {
      console.error("Google sign in notice:", err);
      const authError = err as { code?: string; message?: string };
      if (typeof window !== "undefined") {
        if (authError?.code === "auth/unauthorized-domain") {
          alert(
            `Domain not authorized in Firebase! Please add "${window.location.hostname}" to Firebase Console -> Authentication -> Settings -> Authorized domains.`
          );
        } else if (authError?.code !== "auth/popup-closed-by-user") {
          alert(`Google Sign-In error: ${authError?.message || "Authentication failed."}`);
        }
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      if (typeof window !== "undefined") {
        localStorage.removeItem("civic_paete_admin_session");
        document.cookie = "civic_paete_role=; path=/; max-age=0";
      }
      setAdminSession(null);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A1931]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center group">
            <CivicPaeteLogo size="md" variant="full" theme="dark" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-200">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#community-reports"
              className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              Community Reports
            </Link>
            <Link
              href="/"
              className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-blue-400" />
              Submit Report
            </Link>
            <Link
              href="/#insights"
              className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Civic Insights
            </Link>
            <div className="relative group">
              <Link
                href="/transparency/projects"
                className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
              >
                <span>Transparency</span>
                <span className="text-[10px] text-amber-400 font-semibold px-1.5 py-0.2 rounded bg-amber-400/10 border border-amber-400/20 font-heading">
                  Hub
                </span>
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute left-0 top-full pt-1 hidden group-hover:block w-56 z-50">
                <div className="rounded-xl bg-[#0A1931] border border-white/15 p-2 shadow-2xl backdrop-blur-xl space-y-1">
                  <Link
                    href="/transparency/projects"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <HardHat className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Public Works & Projects</span>
                  </Link>
                  <Link
                    href="/transparency/officials"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Landmark className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Officials Directory</span>
                  </Link>
                  <Link
                    href="/transparency/reports"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Open Data & Reports</span>
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/legal/safety"
              className="px-3.5 py-2 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors text-xs font-semibold flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              Protection Hub
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Municipal Staff Portal Link or Dashboard */}
            {isOfficialOrAdmin ? (
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-white px-3 py-2 rounded-lg border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all min-h-[40px]"
                title="Go to Operations & Oversight Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Admin Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-white/10 hover:border-blue-400/40 hover:bg-blue-950/40 transition-all min-h-[40px]"
              >
                <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Officials Portal</span>
              </Link>
            )}

            {/* Google Resident Auth State */}
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2 pl-2 border-l border-white/15">
                    <button
                      type="button"
                      onClick={() => setIsProfileModalOpen(true)}
                      className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/5 transition-all text-left cursor-pointer min-h-[44px]"
                      title="Open Profile & Privacy Dashboard"
                    >
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt={user.displayName || "User"}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full border border-blue-400/40 object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 font-bold text-xs flex items-center justify-center">
                          {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : "PR"}
                        </div>
                      )}

                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-white max-w-[120px] truncate">
                          {user.displayName || "Paete Resident"}
                        </span>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-heading">
                          <UserCheck className="w-2.5 h-2.5" />
                          <span>Profile & Rights</span>
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Sign out of account"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 min-h-[40px]"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V13.8h6.887C18.2 16.14 16.08 18 12.24 18c-3.32 0-6-2.69-6-6s2.68-6 6-6c1.49 0 2.85.54 3.9 1.44l2.6-2.6C17.18 3.32 14.88 2.5 12.24 2.5 7.02 2.5 2.78 6.75 2.78 12s4.24 9.5 9.46 9.5c5.46 0 9.1-3.84 9.1-9.26 0-.62-.06-1.22-.17-1.74h-8.93z" />
                    </svg>
                    <span>{isSigningIn ? "Connecting..." : "Sign in with Google"}</span>
                  </button>
                )}
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#071126]/95 px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-white/10"
          >
            Home
          </Link>
          <Link
            href="/#community-reports"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10"
          >
            Community Reports
          </Link>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10"
          >
            Submit Report
          </Link>
          <Link
            href="/#insights"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10"
          >
            Civic Insights
          </Link>

          <div className="pt-2 pb-1 border-t border-white/10">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-amber-400 font-heading">
              Transparency Hub
            </span>
            <Link
              href="/transparency/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              <HardHat className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Public Works & Projects</span>
            </Link>
            <Link
              href="/transparency/officials"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Landmark className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Officials Directory</span>
            </Link>
            <Link
              href="/transparency/reports"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Open Data & Reports</span>
            </Link>
          </div>

          <div className="pt-2 pb-1 border-t border-white/10">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-heading">
              Legal & Protection
            </span>
            <Link
              href="/legal/safety"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Whistleblower & Legal Protection</span>
            </Link>
            <Link
              href="/legal/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              <FileText className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Privacy Policy (RA 10173)</span>
            </Link>
            <Link
              href="/legal/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Scale className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Terms of Service</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2.5">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/10">
                  {user.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full border border-blue-400/40 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 font-bold text-xs flex items-center justify-center">
                      {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : "CP"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-xs font-bold text-white truncate">{user.displayName || "Resident"}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer min-h-[44px]"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl text-sm transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSigningIn ? "Connecting..." : "Sign in with Google"}</span>
              </button>
            )}

            {isOfficialOrAdmin ? (
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 font-medium py-2.5 rounded-xl text-sm transition-all min-h-[44px]"
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Municipal Operations Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 border border-white/15 text-slate-200 hover:bg-white/10 font-medium py-2.5 rounded-xl text-sm transition-all min-h-[44px]"
              >
                <Shield className="w-4 h-4 text-blue-400" />
                <span>Municipal Officials Portal</span>
              </Link>
            )}
          </div>
        </div>
      )}
      </header>

      {/* User Profile & Privacy Dashboard Modal */}
      {user && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={user}
        />
      )}
    </>
  );
}
