import React from "react";
import Link from "next/link";
import { CivicPaeteLogo } from "../brand/CivicPaeteLogo";
import {
  Phone,
  Shield,
  FileText,
  BarChart2,
  ExternalLink,
  Heart,
  Lock,
  Building,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060D1A] text-[#94A3B8] text-xs">
      {/* Emergency Hotlines Alert Bar */}
      <div className="bg-[#0A1931] border-b border-white/5 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-semibold">
            <Phone className="w-3.5 h-3.5" />
            <span>MGA NUMERONG PANG-EMERHENSYA (24/7 Hotlines):</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px]">
            <div>
              <span className="text-slate-400">MDRRMO / Rescue: </span>
              <a href="tel:0495570112" className="text-white hover:text-amber-300 font-mono font-medium">
                (049) 557-0112
              </a>
            </div>
            <div>
              <span className="text-slate-400">PNP Paete Police: </span>
              <a href="tel:09985985721" className="text-white hover:text-amber-300 font-mono font-medium">
                0998-598-5721
              </a>
            </div>
            <div>
              <span className="text-slate-400">BFP Paete Fire: </span>
              <a href="tel:0495570111" className="text-white hover:text-amber-300 font-mono font-medium">
                (049) 557-0111
              </a>
            </div>
            <div>
              <span className="text-slate-400">RHU Health: </span>
              <a href="tel:0495570113" className="text-white hover:text-amber-300 font-mono font-medium">
                (049) 557-0113
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Branding & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <CivicPaeteLogo size="md" variant="full" theme="dark" />
            </Link>
            <p className="text-xs text-[#94A3B8] leading-relaxed max-w-sm">
              Opisyal na digital platform ng Bayan ng Paete, Laguna para sa pakikilahok ng mamamayan, bukas na
              pamamahala, at maagap na pagtugon sa mga usaping sibil.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-[#64748B]">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> RA 10173 Compliant
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-[#38BDF8]" /> LGU Paete Partner
              </span>
            </div>
          </div>

          {/* Col 3: Transparency Hub */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-amber-400" />
              Transparency
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/transparency/projects"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  Mga Proyekto ng Bayan
                </Link>
              </li>
              <li>
                <Link
                  href="/transparency/officials"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  Direktoryo ng Opisyal
                </Link>
              </li>
              <li>
                <Link
                  href="/transparency/reports"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  Open Data at Ulat
                </Link>
              </li>
              <li>
                <Link
                  href="/#insights"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  AI Civic Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Proteksyon */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Batas at Karapatan
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/legal/privacy" className="hover:text-white transition-colors">
                  Patakaran sa Privacy (RA 10173)
                </Link>
              </li>
              <li>
                <Link href="/legal/terms" className="hover:text-white transition-colors">
                  Mga Tuntunin at Kundisyon
                </Link>
              </li>
              <li>
                <Link href="/legal/safety" className="hover:text-white transition-colors">
                  Proteksyon ng Whistleblower
                </Link>
              </li>
              <li>
                <Link href="/legal/safety#rights" className="hover:text-white transition-colors">
                  Karapatan ng Mamamayan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Pangasiwaan / Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#38BDF8]" />
              Serbisyo at Aksyon
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#mag-ulat" className="hover:text-white transition-colors">
                  Magsumite ng Reklamo
                </Link>
              </li>
              <li>
                <Link href="/#mga-ulat" className="hover:text-white transition-colors">
                  Talaan ng mga Ulat
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/login"
                  className="hover:text-white text-[#38BDF8] transition-colors flex items-center gap-1 font-medium"
                >
                  Portal ng mga Opisyal <ExternalLink className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <p>
            &copy; {new Date().getFullYear()} Civic Paete &bull; Pamahalaang Bayan ng Paete, Laguna. Lahat ng karapatan ay
            nakalaan.
          </p>
          <div className="flex items-center gap-2">
            <span>Inihanda nang may malasakit para sa Paetenyo</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
