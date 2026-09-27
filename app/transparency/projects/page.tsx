import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Transparency sa mga Proyekto | Civic Paete",
  description:
    "Kumpletong talaan ng mga pampublikong imprastraktura at proyekto ng Munisipalidad ng Paete, Laguna — kasama ang badyet, kontraktor, at katayuan ng bawat gawa.",
};

// ─── Types ────────────────────────────────────────────────────────────────────

type ProjectStatus = "completed" | "ongoing" | "bidding" | "planned";
type ProjectCategory =
  | "road"
  | "drainage"
  | "lighting"
  | "flood"
  | "facility"
  | "environment";

interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  barangay: string;
  budget: number;
  contractor: string;
  startDate: string;
  endDate: string;
  completionPct: number;
  fundSource: string;
  milestones: { label: string; done: boolean; date: string }[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  {
    id: "proj-1",
    title: "Pagpapalawak ng Drainage System — Quesada Street",
    description:
      "Pagtatayo ng bagong catch basin at reinforced concrete pipe (RCP) culvert sa kahabaan ng Quesada Street upang mapigilan ang pag-apaw ng tubig sa panahon ng ulan.",
    category: "drainage",
    status: "completed",
    barangay: "Bagumbayan",
    budget: 2_850_000,
    contractor: "Reyes Construction & Supply",
    startDate: "Marso 2026",
    endDate: "Agosto 2026",
    completionPct: 100,
    fundSource: "20% Development Fund (2026)",
    milestones: [
      { label: "Site clearing at excavation", done: true, date: "Marso 15" },
      { label: "RCP installation (Phase 1)", done: true, date: "Abril 20" },
      { label: "Catch basin construction", done: true, date: "Hunyo 5" },
      { label: "Road restoration at backfilling", done: true, date: "Agosto 10" },
    ],
  },
  {
    id: "proj-2",
    title: "LED Streetlight Installation — Barangay Ilaya del Norte",
    description:
      "Palitan ang 48 piraso ng lumang sodium vapor streetlights ng energy-efficient 100W LED fixtures kasama ang new wiring at poles sa mga pangunahing kalye ng barangay.",
    category: "lighting",
    status: "ongoing",
    barangay: "Ilaya del Norte",
    budget: 1_920_000,
    contractor: "LightPower Solutions Inc.",
    startDate: "Setyembre 2026",
    endDate: "Nobyembre 2026",
    completionPct: 35,
    fundSource: "DILG Assistance to Municipalities (2026)",
    milestones: [
      { label: "Procurement at delivery ng LED units", done: true, date: "Set. 10" },
      { label: "Pole installation (24 units)", done: true, date: "Set. 25" },
      { label: "Wiring at electrical connection", done: false, date: "Okt. 15" },
      { label: "Testing at commissioning", done: false, date: "Nov. 5" },
    ],
  },
  {
    id: "proj-3",
    title: "Flood Control Structure — Bangkusay Creek Retaining Wall",
    description:
      "Pagtatayo ng 120-linear meter reinforced concrete retaining wall sa magkabilang gilid ng Bangkusay Creek bilang proteksyon sa mga residente at lupa laban sa erosion at pagbabaha.",
    category: "flood",
    status: "ongoing",
    barangay: "Bangkusay",
    budget: 6_400_000,
    contractor: "Dela Cruz Heavy Construction Corp.",
    startDate: "Hulyo 2026",
    endDate: "Disyembre 2026",
    completionPct: 55,
    fundSource: "DPWH Local Infrastructure Fund",
    milestones: [
      { label: "Foundation excavation (East bank)", done: true, date: "Hulyo 20" },
      { label: "Footing at reinforcement (East bank)", done: true, date: "Agosto 15" },
      { label: "Wall construction East side (60m)", done: true, date: "Set. 18" },
      { label: "Foundation at footing (West bank)", done: false, date: "Okt. 30" },
      { label: "Wall construction West side (60m)", done: false, date: "Dis. 10" },
    ],
  },
  {
    id: "proj-4",
    title: "Rehabilitation ng Barangay Road — Maytoong",
    description:
      "Pag-aayos at pag-aspalto ng 850-linear meter na barangay road kasama ang proper drainage inlets, road markings, at sidewalk rehabilitation.",
    category: "road",
    status: "bidding",
    barangay: "Maytoong",
    budget: 4_200_000,
    contractor: "TBD (Open Bidding)",
    startDate: "Nobyembre 2026",
    endDate: "Pebrero 2027",
    completionPct: 0,
    fundSource: "Barangay Development Fund + Congressional Allocation",
    milestones: [
      { label: "BAC bidding at awarding", done: false, date: "Okt. 30" },
      { label: "Site preparation at mobilization", done: false, date: "Nov. 15" },
      { label: "Sub-base at base course", done: false, date: "Dis. 5" },
      { label: "Asphalt overlay at markings", done: false, date: "Peb. 2027" },
    ],
  },
  {
    id: "proj-5",
    title: "Paete Lakeside Eco-Park Development",
    description:
      "Pagtatayo ng pampublikong parke sa tabing-lawa ng Laguna de Bay: landscaping, native tree planting, mga bangko at pavilion, at scenic walkway para sa mga residente at turista.",
    category: "environment",
    status: "planned",
    barangay: "Ermita",
    budget: 3_750_000,
    contractor: "TBD (Design Stage)",
    startDate: "Enero 2027",
    endDate: "Hunyo 2027",
    completionPct: 0,
    fundSource: "Tourism Infrastructure Fund (DOT-TIEZA)",
    milestones: [
      { label: "Environmental compliance clearance", done: false, date: "Dis. 2026" },
      { label: "Design at technical specs finalization", done: false, date: "Dis. 2026" },
      { label: "Bidding at procurement", done: false, date: "Enero 2027" },
      { label: "Construction at landscaping", done: false, date: "Hunyo 2027" },
    ],
  },
  {
    id: "proj-6",
    title: "Paete Municipal Hall Renovation — Function Hall Wing",
    description:
      "Renovation ng function hall wing ng Municipal Hall: bagong ceiling, airconditioning, electrical rewiring, at accessibility ramp para sa mga PWD.",
    category: "facility",
    status: "completed",
    barangay: "Ibaba del Norte",
    budget: 1_650_000,
    contractor: "Santillan Builders & Interiors",
    startDate: "Enero 2026",
    endDate: "Abril 2026",
    completionPct: 100,
    fundSource: "General Fund Supplemental Budget",
    milestones: [
      { label: "Interior demolition at site prep", done: true, date: "Enero 10" },
      { label: "Electrical rewiring at new panel", done: true, date: "Peb. 8" },
      { label: "Ceiling, flooring, at painting", done: true, date: "Mar. 20" },
      { label: "AC installation at final punch-out", done: true, date: "Abril 5" },
    ],
  },
];

// ─── Config Maps ──────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ProjectStatus,
  { label: string; color: string; bg: string; border: string; dot: string }
> = {
  completed: {
    label: "Tapos Na",
    color: "#10B981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.25)",
    dot: "#10B981",
  },
  ongoing: {
    label: "Isinasagawa",
    color: "#3B82F6",
    bg: "rgba(59,130,246,0.1)",
    border: "rgba(59,130,246,0.25)",
    dot: "#3B82F6",
  },
  bidding: {
    label: "Bidding Stage",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
    dot: "#F59E0B",
  },
  planned: {
    label: "Nakaplanong Proyekto",
    color: "#94A3B8",
    bg: "rgba(148,163,184,0.1)",
    border: "rgba(148,163,184,0.2)",
    dot: "#94A3B8",
  },
};

const CATEGORY_CONFIG: Record<
  ProjectCategory,
  { icon: string; label: string; color: string; bg: string }
> = {
  road: { icon: "🚧", label: "Kalsada", color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  drainage: { icon: "🌊", label: "Drainage", color: "#60A5FA", bg: "rgba(96,165,250,0.1)" },
  lighting: { icon: "⚡", label: "Ilaw", color: "#FCD34D", bg: "rgba(252,211,77,0.1)" },
  flood: { icon: "🌧️", label: "Flood Control", color: "#818CF8", bg: "rgba(129,140,248,0.1)" },
  facility: { icon: "🏛️", label: "Pasilidad", color: "#34D399", bg: "rgba(52,211,153,0.1)" },
  environment: { icon: "🌿", label: "Kalikasan", color: "#6EE7B7", bg: "rgba(110,231,183,0.1)" },
};

const CATEGORIES: { value: ProjectCategory | "all"; label: string }[] = [
  { value: "all", label: "Lahat" },
  { value: "road", label: "🚧 Kalsada" },
  { value: "drainage", label: "🌊 Drainage" },
  { value: "lighting", label: "⚡ Ilaw" },
  { value: "flood", label: "🌧️ Flood Control" },
  { value: "facility", label: "🏛️ Pasilidad" },
  { value: "environment", label: "🌿 Kalikasan" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBudget(amount: number): string {
  return `₱${(amount / 1_000_000).toFixed(2)}M`;
}

function totalBudget(projects: Project[]): number {
  return projects.reduce((sum, p) => sum + p.budget, 0);
}

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default function TransparencyProjectsPage() {
  // Summary stats
  const completed = PROJECTS.filter((p) => p.status === "completed").length;
  const ongoing = PROJECTS.filter((p) => p.status === "ongoing").length;
  const totalBudgetAmt = totalBudget(PROJECTS);

  return (
    <div className="min-h-screen" style={{ background: "var(--civic-navy-dark)" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header
        style={{
          background: "linear-gradient(180deg, #0A1931 0%, rgba(10,25,49,0.95) 100%)",
          borderBottom: "1px solid rgba(245,158,11,0.12)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-xs" aria-label="Breadcrumb">
            <Link href="/" className="transition-opacity hover:opacity-80" style={{ color: "#60A5FA" }}>
              Civic Paete
            </Link>
            <span style={{ color: "#475569" }}>/</span>
            <span style={{ color: "#94A3B8" }}>Transparency sa mga Proyekto</span>
          </nav>

          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.3)",
              }}
            >
              <svg
                className="w-7 h-7"
                style={{ color: "#F59E0B" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.016h-.008v-.016zm0 3h.008v.016h-.008v-.016zm0 3h.008v.016h-.008v-.016z"
                />
              </svg>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(245,158,11,0.12)",
                    color: "#F59E0B",
                    border: "1px solid rgba(245,158,11,0.25)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Feature 8
                </span>
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    color: "#10B981",
                    border: "1px solid rgba(16,185,129,0.2)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Open Data
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
              >
                Transparency sa mga Proyekto ng LGU
              </h1>
              <p className="text-sm mt-1" style={{ color: "#64748B" }}>
                Munisipalidad ng Paete, Laguna — Talaan ng Pampublikong Imprastraktura at Paggastos
              </p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Kabuuang Proyekto", value: String(PROJECTS.length), icon: "📋", color: "#60A5FA" },
              { label: "Natapos", value: String(completed), icon: "✅", color: "#10B981" },
              { label: "Isinasagawa", value: String(ongoing), icon: "🔵", color: "#3B82F6" },
              { label: "Kabuuang Badyet", value: formatBudget(totalBudgetAmt), icon: "💰", color: "#F59E0B" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl px-4 py-3"
                style={{
                  background: "rgba(17,35,71,0.6)",
                  border: "1px solid rgba(96,165,250,0.1)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm" aria-hidden="true">{stat.icon}</span>
                  <span className="text-xs" style={{ color: "#64748B" }}>{stat.label}</span>
                </div>
                <p
                  className="text-xl font-bold"
                  style={{ color: stat.color, fontFamily: "var(--font-heading)" }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter note — client-side filtering note for SSR page */}
        <div
          className="rounded-xl px-4 py-3 mb-6 flex flex-col sm:flex-row sm:items-center gap-3"
          style={{
            background: "rgba(17,35,71,0.5)",
            border: "1px solid rgba(96,165,250,0.1)",
          }}
        >
          <div className="flex flex-wrap gap-2">
            <span
              className="text-xs font-semibold tracking-wider uppercase"
              style={{ color: "#475569", fontFamily: "var(--font-heading)" }}
            >
              Kategorya:
            </span>
            {CATEGORIES.map((c) => (
              <span
                key={c.value}
                className="text-xs px-2.5 py-1 rounded-lg font-medium"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  color: "#94A3B8",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {c.label}
              </span>
            ))}
          </div>
        </div>

        {/* Projects list */}
        <div className="flex flex-col gap-5">
          {PROJECTS.map((project) => {
            const statusCfg = STATUS_CONFIG[project.status];
            const catCfg = CATEGORY_CONFIG[project.category];

            return (
              <article
                key={project.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(17,35,71,0.4)",
                  border: "1px solid rgba(96,165,250,0.08)",
                }}
              >
                {/* Card header */}
                <div
                  className="px-5 py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                  style={{
                    background: "rgba(10,25,49,0.5)",
                    borderBottom: "1px solid rgba(96,165,250,0.08)",
                  }}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Category icon */}
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg mt-0.5"
                      style={{ background: catCfg.bg, border: `1px solid ${catCfg.color}30` }}
                      aria-hidden="true"
                    >
                      {catCfg.icon}
                    </div>
                    <div className="min-w-0">
                      <h2
                        className="text-sm font-bold leading-snug"
                        style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
                      >
                        {project.title}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ background: catCfg.bg, color: catCfg.color, border: `1px solid ${catCfg.color}30` }}
                        >
                          {catCfg.label}
                        </span>
                        <span className="text-xs" style={{ color: "#64748B" }}>
                          📍 Brgy. {project.barangay}
                        </span>
                        <span className="text-xs" style={{ color: "#475569" }}>
                          {project.startDate} – {project.endDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 self-start"
                    style={{
                      background: statusCfg.bg,
                      color: statusCfg.color,
                      border: `1px solid ${statusCfg.border}`,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: statusCfg.dot }}
                      aria-hidden="true"
                    />
                    {statusCfg.label}
                  </span>
                </div>

                {/* Card body */}
                <div className="px-5 py-4 flex flex-col gap-4">
                  {/* Description */}
                  <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
                    {project.description}
                  </p>

                  {/* Budget + Contractor + Fund source grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <MetaBlock label="Badyet" value={formatBudget(project.budget)} icon="💰" accent="#F59E0B" />
                    <MetaBlock label="Kontraktor" value={project.contractor} icon="🏗️" accent="#60A5FA" />
                    <MetaBlock label="Pinagkukunan ng Pondo" value={project.fundSource} icon="📄" accent="#94A3B8" />
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#475569", fontFamily: "var(--font-heading)" }}
                      >
                        Progreso ng Konstruksyon
                      </span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: statusCfg.color, fontFamily: "var(--font-heading)" }}
                      >
                        {project.completionPct}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "rgba(255,255,255,0.06)" }}
                      role="progressbar"
                      aria-valuenow={project.completionPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${project.completionPct}% kumpleto`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${project.completionPct}%`,
                          background: `linear-gradient(90deg, ${statusCfg.color}80 0%, ${statusCfg.color} 100%)`,
                          boxShadow: project.completionPct > 0
                            ? `0 0 8px ${statusCfg.color}60`
                            : "none",
                        }}
                      />
                    </div>
                  </div>

                  {/* Milestones timeline */}
                  <div>
                    <p
                      className="text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ color: "#475569", fontFamily: "var(--font-heading)" }}
                    >
                      Mga Milestone
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {project.milestones.map((ms, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          {/* Step indicator */}
                          <div className="flex-shrink-0 flex flex-col items-center">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                              style={{
                                background: ms.done
                                  ? "rgba(16,185,129,0.2)"
                                  : "rgba(255,255,255,0.05)",
                                border: ms.done
                                  ? "1px solid rgba(16,185,129,0.4)"
                                  : "1px solid rgba(255,255,255,0.1)",
                              }}
                              aria-hidden="true"
                            >
                              {ms.done ? (
                                <svg className="w-3 h-3" style={{ color: "#10B981" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: "rgba(148,163,184,0.4)" }} />
                              )}
                            </div>
                            {idx < project.milestones.length - 1 && (
                              <div
                                className="w-px flex-1 mt-0.5"
                                style={{
                                  height: "14px",
                                  background: ms.done
                                    ? "rgba(16,185,129,0.25)"
                                    : "rgba(255,255,255,0.07)",
                                }}
                                aria-hidden="true"
                              />
                            )}
                          </div>
                          {/* Label */}
                          <div className="flex items-center justify-between flex-1 min-w-0 pb-1">
                            <span
                              className="text-xs"
                              style={{ color: ms.done ? "#CBD5E1" : "#64748B" }}
                            >
                              {ms.label}
                            </span>
                            <span
                              className="text-[11px] ml-2 flex-shrink-0"
                              style={{ color: "#475569" }}
                            >
                              {ms.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer links */}
        <div
          className="rounded-xl p-4 mt-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
          style={{
            background: "rgba(17,35,71,0.4)",
            border: "1px solid rgba(96,165,250,0.08)",
          }}
        >
          <p
            className="text-xs font-semibold tracking-wider uppercase flex-shrink-0"
            style={{ color: "#475569", fontFamily: "var(--font-heading)" }}
          >
            Transparency Hub
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/transparency/officials", label: "👤 Mga Opisyal", color: "#60A5FA" },
              { href: "/transparency/reports", label: "📊 Open Data", color: "#10B981" },
              { href: "/", label: "← Bumalik sa Feed", color: "#64748B" },
            ].map(({ href, label, color }) => (
              <Link
                key={href}
                href={href}
                className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                style={{
                  color,
                  background: `${color}14`,
                  border: `1px solid ${color}25`,
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-xs text-center py-4 mt-2" style={{ color: "#334155" }}>
          Datos mula sa Opisina ng Municipal Engineer at BAC ng Paete, Laguna.
          Huling na-update: Setyembre 27, 2026.
        </p>
      </main>
    </div>
  );
}

// ─── Sub-component ────────────────────────────────────────────────────────────

function MetaBlock({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: string;
  icon: string;
  accent: string;
}) {
  return (
    <div
      className="rounded-xl px-3 py-2.5"
      style={{
        background: "rgba(10,25,49,0.5)",
        border: "1px solid rgba(96,165,250,0.07)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-xs" aria-hidden="true">{icon}</span>
        <span
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color: "#475569", fontFamily: "var(--font-heading)" }}
        >
          {label}
        </span>
      </div>
      <p className="text-xs font-semibold leading-snug" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
