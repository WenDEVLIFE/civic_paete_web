"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CivicPaeteLogo } from "../brand/CivicPaeteLogo";
import { Shield, PlusCircle, FileText, Menu, X, LogIn } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A1931]/85 backdrop-blur-md transition-all">
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
              href="#insights"
              className="px-3.5 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              Rekomendasyon
            </Link>
          </nav>

          {/* Right Action: Resident Google Sign In & Official Portal */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Municipal Staff Link */}
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-white/10 hover:border-blue-400/40 hover:bg-blue-950/40 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              Opisyal ng Bayan
            </Link>

            {/* Resident Google Login CTA */}
            <button
              type="button"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm shadow-blue-500/20 transition-all"
            >
              {/* Google G icon */}
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.8h6.887C18.2 16.14 16.08 18 12.24 18c-3.32 0-6-2.69-6-6s2.68-6 6-6c1.49 0 2.85.54 3.9 1.44l2.6-2.6C17.18 3.32 14.88 2.5 12.24 2.5 7.02 2.5 2.78 6.75 2.78 12s4.24 9.5 9.46 9.5c5.46 0 9.1-3.84 9.1-9.26 0-.62-.06-1.22-.17-1.74h-8.93z" />
              </svg>
              <span>Mag-login sa Google</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Buksan ang menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
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
            href="#insights"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/10"
          >
            Rekomendasyon ng Sistema
          </Link>

          <div className="pt-4 border-t border-white/10 space-y-2.5">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-all"
            >
              <LogIn className="w-4 h-4" />
              Mag-sign in gamit ang Google (Mamamayan)
            </button>

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
