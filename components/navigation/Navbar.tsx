"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { CivicPaeteLogo } from "../brand/CivicPaeteLogo";
import { Shield, PlusCircle, FileText, Menu, X, LogIn, LogOut, UserCheck } from "lucide-react";
import { auth, db, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

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
            name: loggedUser.displayName || "Mamamayan ng Paete",
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
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
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
              Tahanan
            </Link>
            <Link
              href="#mga-ulat"
              className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              Mga Ulat
            </Link>
            <Link
              href="#mag-ulat"
              className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4 text-blue-400" />
              Magsumite ng Ulat
            </Link>
            <Link
              href="/#insights"
              className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Rekomendasyon
            </Link>
            <div className="relative group">
              <Link
                href="/transparency/projects"
                className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1"
              >
                <span>Transparency</span>
                <span className="text-[10px] text-amber-400 font-semibold px-1.5 py-0.2 rounded bg-amber-400/10 border border-amber-400/20">
                  Hub
                </span>
              </Link>
              {/* Dropdown Menu */}
              <div className="absolute left-0 top-full pt-1 hidden group-hover:block w-56 z-50">
                <div className="rounded-xl bg-[#0A1931] border border-white/15 p-2 shadow-2xl backdrop-blur-xl space-y-1">
                  <Link
                    href="/transparency/projects"
                    className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    🚧 Mga Proyekto ng Bayan
                  </Link>
                  <Link
                    href="/transparency/officials"
                    className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    🏛️ Direktoryo ng mga Opisyal
                  </Link>
                  <Link
                    href="/transparency/reports"
                    className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    📊 Mga Ulat at Open Data
                  </Link>
                </div>
              </div>
            </div>
            <Link
              href="/legal/safety"
              className="px-3.5 py-2 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors text-xs font-semibold flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              Proteksyon
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Municipal Staff Portal Link */}
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-white/10 hover:border-blue-400/40 hover:bg-blue-950/40 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              Opisyal ng Bayan
            </Link>

            {/* Google Resident Auth State */}
            {!isLoading && (
              <>
                {user ? (
                  <div className="flex items-center gap-2.5 pl-2 border-l border-white/15">
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
                        {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : "RM"}
                      </div>
                    )}

                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold text-white max-w-[130px] truncate">
                        {user.displayName || "Mamamayan"}
                      </span>
                      <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <UserCheck className="w-2.5 h-2.5" />
                        <span>Rehistrado</span>
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Mag-sign out sa Google"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSigningIn}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V13.8h6.887C18.2 16.14 16.08 18 12.24 18c-3.32 0-6-2.69-6-6s2.68-6 6-6c1.49 0 2.85.54 3.9 1.44l2.6-2.6C17.18 3.32 14.88 2.5 12.24 2.5 7.02 2.5 2.78 6.75 2.78 12s4.24 9.5 9.46 9.5c5.46 0 9.1-3.84 9.1-9.26 0-.62-.06-1.22-.17-1.74h-8.93z" />
                    </svg>
                    <span>{isSigningIn ? "Kumukonekta..." : "Mag-login sa Google"}</span>
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
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Buksan ang menu"
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
            Tahanan
          </Link>
          <Link
            href="#mga-ulat"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10"
          >
            Mga Ulat ng Komunidad
          </Link>
          <Link
            href="#mag-ulat"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10"
          >
            Magsumite ng Ulat
          </Link>
          <Link
            href="/#insights"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10"
          >
            Rekomendasyon ng Sistema
          </Link>

          <div className="pt-2 pb-1 border-t border-white/10">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-amber-400">
              Transparency Hub
            </span>
            <Link
              href="/transparency/projects"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              🚧 Mga Proyekto ng Bayan
            </Link>
            <Link
              href="/transparency/officials"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              🏛️ Direktoryo ng mga Opisyal
            </Link>
            <Link
              href="/transparency/reports"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              📊 Mga Ulat at Open Data
            </Link>
          </div>

          <div className="pt-2 pb-1 border-t border-white/10">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Batas at Proteksyon
            </span>
            <Link
              href="/legal/safety"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              🛡️ Whistleblower & Legal Protection
            </Link>
            <Link
              href="/legal/privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              📜 Patakaran sa Privacy (RA 10173)
            </Link>
            <Link
              href="/legal/terms"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-1.5 rounded-md text-sm text-slate-300 hover:text-white hover:bg-white/10"
            >
              ⚖️ Mga Tuntunin at Kundisyon
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
                      {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : "RM"}
                    </div>
                  )}
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-xs font-bold text-white truncate">{user.displayName || "Mamamayan"}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user.email}</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 font-semibold py-2 rounded-lg text-xs transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Mag-sign out sa Google</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-all cursor-pointer disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>{isSigningIn ? "Kumukonekta..." : "Mag-sign in gamit ang Google"}</span>
              </button>
            )}

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 border border-white/15 text-slate-200 hover:bg-white/10 font-medium py-2.5 rounded-lg text-sm transition-all"
            >
              <Shield className="w-4 h-4 text-blue-400" />
              Portal ng mga Opisyal ng Bayan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
