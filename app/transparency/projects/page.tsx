import type { Metadata } from "next";
import Link from "next/link";
import {
  HardHat,
  CheckCircle2,
  Clock,
  Layers,
  TrendingUp,
  Droplets,
  Zap,
  CloudRain,
  Landmark,
  Trees,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Public Works Transparency | Civic Paete",
  description:
    "Official registry of public infrastructure, capital outlays, contractors, and budget allocations for the Municipality of Paete, Laguna.",
};

export const revalidate = 3600;

// ─── Service & Types ──────────────────────────────────────────────────────────

import {
  getTransparencyProjects,
  type ProjectStatus,
  type ProjectCategory,
  type TransparencyProject,
} from "@/lib/services/projectService";

// ─── Status & Category Configuration ──────────────────────────────────────────

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; badge: string; color: string; bg: string; border: string }
> = {
  completed: {
    label: "Completed",
    badge: "✓ Turnover Completed",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
  },
  ongoing: {
    label: "In Progress",
    badge: "● Active Works",
    color: "#38BDF8",
    bg: "rgba(56,189,248,0.1)",
    border: "rgba(56,189,248,0.25)",
  },
  bidding: {
    label: "Under Bidding",
    badge: "○ BAC Procurement",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  planned: {
    label: "Planned",
    badge: "◇ Engineering Design",
    color: "#94A3B8",
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.2)",
  },
};

const CATEGORY_CONFIG: Record<
  ProjectCategory,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  road: { label: "Road Works", icon: HardHat },
  drainage: { label: "Storm Drainage", icon: Droplets },
  lighting: { label: "LED Lighting", icon: Zap },
  flood: { label: "Flood Defense", icon: CloudRain },
  facility: { label: "Civic Facilities", icon: Landmark },
  environment: { label: "Eco-Park & DENR", icon: Trees },
};

function formatBudget(amount: number): string {
  return `₱${(amount / 1_000_000).toFixed(2)}M`;
}

export default async function TransparencyProjectsPage() {
  const projects = await getTransparencyProjects();
  const completed = projects.filter((p) => p.status === "completed").length;
  const ongoing = projects.filter((p) => p.status === "ongoing").length;
  const totalBudgetAmt = projects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="min-h-screen bg-[#071126] text-[#F1F5F9] font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Paete Woodcarving Motif Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-[#2563EB] to-amber-500" />

      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#0A1931]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-amber-400 font-semibold font-heading">Public Works Transparency</span>
          </nav>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/transparency/officials"
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-medium transition-all min-h-[44px] flex items-center gap-1.5"
            >
              <Landmark className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Officials Directory</span>
            </Link>
            <Link
              href="/transparency/reports"
              className="px-3 py-2 rounded-xl bg-[#2563EB]/15 hover:bg-[#2563EB]/25 text-[#93C5FD] border border-[#2563EB]/30 font-semibold transition-all min-h-[44px] flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              Open Data & Reports
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b border-white/10 bg-gradient-to-b from-[#0A1931] via-[#071126] to-[#071126] pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300 mb-6">
              <HardHat className="w-4 h-4 text-amber-400" />
              <span>Full Disclosure &bull; Commission on Audit (COA) Standards</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Public Works & Projects
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-8">
              Official municipal infrastructure ledger of Paete, Laguna. Audit budget allocations, contractor bids,
              physical completion milestones, and funding sources in real time.
            </p>

            {/* 4 Summary Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-heading">
                  Total Tracked
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 block">
                  {projects.length}
                </span>
                <span className="text-[11px] text-slate-500">Major infrastructure</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block font-heading">
                  Completed
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading mt-1 block">
                  {completed}
                </span>
                <span className="text-[11px] text-slate-500">Turned over to LGU</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8] block font-heading">
                  Active Works
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#38BDF8] font-heading mt-1 block">
                  {ongoing}
                </span>
                <span className="text-[11px] text-slate-500">On-site construction</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block font-heading">
                  Total Budget
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-heading mt-1 block">
                  {formatBudget(totalBudgetAmt)}
                </span>
                <span className="text-[11px] text-slate-500">FY 2026 Appropriations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white font-heading flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <span>Active Infrastructure Ledger</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">Updated as of September 2026</span>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => {
            const statusMeta = STATUS_CONFIG[proj.status];
            const catMeta = CATEGORY_CONFIG[proj.category];

            return (
              <div
                key={proj.id}
                className="p-6 sm:p-7 rounded-2xl bg-[#112347]/50 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between shadow-xl"
              >
                <div>
                  {/* Category & Status Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-300">
                      <catMeta.icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{catMeta.label}</span>
                    </span>

                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold font-mono"
                      style={{
                        color: statusMeta.color,
                        background: statusMeta.bg,
                        border: `1px solid ${statusMeta.border}`,
                      }}
                    >
                      {statusMeta.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-heading leading-snug">{proj.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-6">{proj.description}</p>

                  {/* Progress Bar */}
                  <div className="mb-6 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-400">Physical Completion Progress</span>
                      <span className="font-mono text-white">{proj.completionPct}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${proj.completionPct}%`,
                          backgroundColor: statusMeta.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Metadata Matrix */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 rounded-xl bg-[#0A1931]/80 border border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-heading">
                        Allocated Budget
                      </span>
                      <span className="text-sm font-mono font-bold text-amber-300 mt-0.5 block">
                        {formatBudget(proj.budget)}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0A1931]/80 border border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-heading">
                        Target Location
                      </span>
                      <span className="text-sm font-medium text-white mt-0.5 block truncate">
                        Brgy. {proj.barangay}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0A1931]/80 border border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-heading">
                        Contractor
                      </span>
                      <span className="text-xs font-medium text-slate-200 mt-0.5 block truncate" title={proj.contractor}>
                        {proj.contractor}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-[#0A1931]/80 border border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-heading">
                        Funding Source
                      </span>
                      <span className="text-xs font-medium text-slate-200 mt-0.5 block truncate" title={proj.fundSource}>
                        {proj.fundSource}
                      </span>
                    </div>
                  </div>

                  {/* Milestone Timeline */}
                  <div className="space-y-2 pt-4 border-t border-white/10">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-heading">
                      Implementation Milestones
                    </span>
                    <div className="space-y-2">
                      {proj.milestones.map((m, mIdx) => (
                        <div key={mIdx} className="flex items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            {m.done ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            )}
                            <span className={`truncate ${m.done ? "text-slate-200" : "text-slate-400"}`}>
                              {m.label}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 shrink-0">{m.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Project ID: {proj.id.toUpperCase()}</span>
                  <span>Timeline: {proj.startDate} – {proj.endDate}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statutory Citation Footer */}
        <div className="p-6 rounded-2xl bg-[#0A1931]/60 border border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Data officially verified by the Municipal Engineering Office and the Bids and Awards Committee (BAC) of
            Paete, Laguna.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/transparency/officials" className="text-[#60A5FA] hover:underline">
              Officials Directory
            </Link>
            <span>&bull;</span>
            <Link href="/transparency/reports" className="text-[#60A5FA] hover:underline">
              Download Open Data
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
