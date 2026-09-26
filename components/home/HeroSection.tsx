import React from "react";
import { PlusCircle, Search, MapPin, CheckCircle2, AlertCircle, BarChart3 } from "lucide-react";

interface HeroSectionProps {
  onOpenReportModal: () => void;
  onFilterCategory?: (category: string) => void;
}

export function HeroSection({ onOpenReportModal }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-white/10 bg-gradient-to-b from-[#0A1931] via-[#08152B] to-[#071126]">
      {/* Paete Motif Background Glow & Radial Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-24 right-10 w-72 h-72 bg-sky-500/10 blur-[90px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Civic Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-400/30 bg-blue-950/60 text-blue-300 text-xs sm:text-sm font-semibold mb-6 shadow-inner backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>Bayan ng Paete, Laguna — Opisyal na Plataporma</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-heading leading-tight sm:leading-none mb-6">
            Boses ng Mamamayan,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-blue-200">
              Aksyon ng Bayan
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8 font-sans">
            Mabilis, maayos, at transparent na pag-uulat ng mga suliranin sa
            bawat barangay ng Paete. Mula sa kalsada, basura, hanggang sa ilaw,
            magkatuwang nating paunlarin ang ating komunidad.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
            <button
              type="button"
              onClick={onOpenReportModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/30 transition-all text-sm sm:text-base"
            >
              <PlusCircle className="w-5 h-5 text-sky-200" />
              <span>Mag-ulat ng Concern</span>
            </button>

            <a
              href="#mga-ulat"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/15 hover:border-blue-400/40 transition-all text-sm sm:text-base backdrop-blur-sm"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <span>Tingnan ang mga Ulat</span>
            </a>
          </div>

          {/* Civic Impact Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-6 border-t border-white/10">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-center text-blue-400 mb-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-xl sm:text-2xl font-bold font-heading text-white">9</span>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Barangay ng Paete</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-center text-emerald-400 mb-1">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                <span className="text-xl sm:text-2xl font-bold font-heading text-white">84%</span>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Naaksyunan</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-center text-amber-400 mb-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span className="text-xl sm:text-2xl font-bold font-heading text-white">24h</span>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Target Response</p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
              <div className="flex items-center justify-center text-sky-400 mb-1">
                <BarChart3 className="w-4 h-4 mr-1" />
                <span className="text-xl sm:text-2xl font-bold font-heading text-white">100%</span>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Transparent Data</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
