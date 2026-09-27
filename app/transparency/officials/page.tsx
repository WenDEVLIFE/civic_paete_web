import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mga Opisyal at Accountability Directory | Civic Paete",
  description:
    "Kumpletong listahan ng mga pinuno ng Munisipalidad ng Paete, Laguna — kasama ang mga Sangguniang Bayan, Barangay Captains, at civic accountability metrics ng bawat opisyal.",
};

// ─── Types ─────────────────────────────────────────────────────────────────

type OfficialRole =
  | "mayor"
  | "vice_mayor"
  | "councilor"
  | "barangay_captain"
  | "department_head"
  | "provincial";

interface CivicMetrics {
  resolutionRate: number; // percentage 0-100
  avgResponseHours: number;
  activeReports: number;
  resolvedReports: number;
}

interface Official {
  id: string;
  name: string;
  title: string;
  role: OfficialRole;
  department?: string;
  barangay?: string;
  term: string;
  email?: string;
  officeHours?: string;
  metrics?: CivicMetrics;
  committee?: string; // for councilors
}

// ─── Data ───────────────────────────────────────────────────────────────────

const MUNICIPAL_EXECUTIVES: Official[] = [
  {
    id: "off-1",
    name: "Hon. Rosario A. Fadul",
    title: "Punong Bayan (Mayor)",
    role: "mayor",
    department: "Office of the Mayor",
    term: "2022 – 2025",
    email: "mayor@paete.gov.ph",
    officeHours: "Lunes – Biyernes, 8:00 AM – 5:00 PM",
    metrics: {
      resolutionRate: 87,
      avgResponseHours: 36,
      activeReports: 12,
      resolvedReports: 94,
    },
  },
  {
    id: "off-2",
    name: "Hon. Eduardo M. Resurreccion",
    title: "Bise-Punong Bayan (Vice Mayor)",
    role: "vice_mayor",
    department: "Office of the Vice Mayor / Sangguniang Bayan",
    term: "2022 – 2025",
    email: "vicemayor@paete.gov.ph",
    officeHours: "Lunes – Biyernes, 8:00 AM – 5:00 PM",
    metrics: {
      resolutionRate: 82,
      avgResponseHours: 44,
      activeReports: 8,
      resolvedReports: 61,
    },
  },
];

const COUNCILORS: Official[] = [
  {
    id: "off-3",
    name: "Hon. Teresita B. Saguibo",
    title: "Kagawad",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Appropriations, Finance & Ways and Means",
    metrics: { resolutionRate: 78, avgResponseHours: 52, activeReports: 5, resolvedReports: 38 },
  },
  {
    id: "off-4",
    name: "Hon. Danilo P. Alcantara",
    title: "Kagawad",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Public Works, Infrastructure & Engineering",
    metrics: { resolutionRate: 91, avgResponseHours: 28, activeReports: 9, resolvedReports: 72 },
  },
  {
    id: "off-5",
    name: "Hon. Marilou C. Enriquez",
    title: "Kagawad",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Health, Sanitation & Environment",
    metrics: { resolutionRate: 84, avgResponseHours: 40, activeReports: 7, resolvedReports: 55 },
  },
  {
    id: "off-6",
    name: "Hon. Rodelio A. Adea",
    title: "Kagawad",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Peace, Order, Safety & Disaster Risk Reduction",
    metrics: { resolutionRate: 95, avgResponseHours: 18, activeReports: 14, resolvedReports: 118 },
  },
  {
    id: "off-7",
    name: "Hon. Cecilia F. Ramos",
    title: "Kagawad",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Education, Culture, Arts & Heritage",
    metrics: { resolutionRate: 70, avgResponseHours: 60, activeReports: 3, resolvedReports: 28 },
  },
  {
    id: "off-8",
    name: "Hon. Roberto D. Tolentino",
    title: "Kagawad",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Tourism, Economic Enterprise & Livelihood",
    metrics: { resolutionRate: 75, avgResponseHours: 48, activeReports: 4, resolvedReports: 32 },
  },
  {
    id: "off-9",
    name: "Hon. Lanie G. Dela Cruz",
    title: "Kagawad (SK Federation President)",
    role: "councilor",
    term: "2023 – 2025",
    committee: "Youth Welfare, Sports & Gender Development",
    metrics: { resolutionRate: 68, avgResponseHours: 72, activeReports: 2, resolvedReports: 15 },
  },
];

const BARANGAY_CAPTAINS: Official[] = [
  { id: "bc-1", name: "Hon. Arturo B. Cañete", title: "Punong Barangay", role: "barangay_captain", barangay: "Bagumbayan", term: "2023 – 2025", metrics: { resolutionRate: 80, avgResponseHours: 24, activeReports: 6, resolvedReports: 42 } },
  { id: "bc-2", name: "Hon. Norma C. Regalado", title: "Punong Barangay", role: "barangay_captain", barangay: "Bangkusay", term: "2023 – 2025", metrics: { resolutionRate: 88, avgResponseHours: 20, activeReports: 4, resolvedReports: 38 } },
  { id: "bc-3", name: "Hon. Virgilio M. Santos", title: "Punong Barangay", role: "barangay_captain", barangay: "Ermita", term: "2023 – 2025", metrics: { resolutionRate: 73, avgResponseHours: 32, activeReports: 3, resolvedReports: 21 } },
  { id: "bc-4", name: "Hon. Pacita A. Llave", title: "Punong Barangay", role: "barangay_captain", barangay: "Ibaba del Norte", term: "2023 – 2025", metrics: { resolutionRate: 85, avgResponseHours: 22, activeReports: 5, resolvedReports: 47 } },
  { id: "bc-5", name: "Hon. Renato D. Quizon", title: "Punong Barangay", role: "barangay_captain", barangay: "Ibaba del Sur", term: "2023 – 2025", metrics: { resolutionRate: 90, avgResponseHours: 18, activeReports: 7, resolvedReports: 63 } },
  { id: "bc-6", name: "Hon. Emelinda R. Mercado", title: "Punong Barangay", role: "barangay_captain", barangay: "Ilaya del Norte", term: "2023 – 2025", metrics: { resolutionRate: 77, avgResponseHours: 28, activeReports: 5, resolvedReports: 34 } },
  { id: "bc-7", name: "Hon. Freddie P. Castillo", title: "Punong Barangay", role: "barangay_captain", barangay: "Ilaya del Sur", term: "2023 – 2025", metrics: { resolutionRate: 83, avgResponseHours: 24, activeReports: 4, resolvedReports: 39 } },
  { id: "bc-8", name: "Hon. Gloria T. Macaraeg", title: "Punong Barangay", role: "barangay_captain", barangay: "Maytoong", term: "2023 – 2025", metrics: { resolutionRate: 92, avgResponseHours: 16, activeReports: 8, resolvedReports: 71 } },
  { id: "bc-9", name: "Hon. Nestor A. Advincula", title: "Punong Barangay", role: "barangay_captain", barangay: "Quinale", term: "2023 – 2025", metrics: { resolutionRate: 79, avgResponseHours: 30, activeReports: 3, resolvedReports: 28 } },
];

const DEPARTMENT_HEADS: { dept: string; head: string; icon: string; color: string }[] = [
  { dept: "Municipal Engineering Office", head: "Engr. Marco D. Adea", icon: "🏗️", color: "#F59E0B" },
  { dept: "Municipal Health Office", head: "Dr. Corazon P. Villanueva", icon: "🏥", color: "#10B981" },
  { dept: "MPDO (Planning & Dev. Office)", head: "Ma. Fe R. Batungbakal", icon: "📐", color: "#3B82F6" },
  { dept: "MENRO (Environment & Natural Res.)", head: "Engr. Jose L. Quizon", icon: "🌿", color: "#34D399" },
  { dept: "Municipal Assessor's Office", head: "Atty. Lourdes C. Resurreccion", icon: "⚖️", color: "#818CF8" },
  { dept: "MSWD (Social Welfare & Dev.)", head: "Lucita G. Santos", icon: "🤝", color: "#F472B6" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getResolutionColor(rate: number): string {
  if (rate >= 85) return "#10B981";
  if (rate >= 70) return "#3B82F6";
  if (rate >= 50) return "#F59E0B";
  return "#EF4444";
}

function formatResponseTime(hours: number): string {
  if (hours < 24) return `< ${hours}h`;
  const days = Math.round(hours / 24);
  return `~${days} araw`;
}

// ─── Metrics Row ─────────────────────────────────────────────────────────────

function MetricsRow({ m }: { m: CivicMetrics }) {
  const resColor = getResolutionColor(m.resolutionRate);
  return (
    <div className="grid grid-cols-3 gap-2 mt-3">
      {/* Resolution Rate */}
      <div
        className="rounded-xl px-3 py-2"
        style={{ background: "rgba(10,25,49,0.6)", border: "1px solid rgba(96,165,250,0.07)" }}
      >
        <p className="text-[11px] mb-1" style={{ color: "#475569" }}>
          Resolution Rate
        </p>
        <div className="flex items-end gap-1 mb-1">
          <span
            className="text-sm font-bold"
            style={{ color: resColor, fontFamily: "var(--font-heading)" }}
          >
            {m.resolutionRate}%
          </span>
        </div>
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)" }}
          role="progressbar"
          aria-valuenow={m.resolutionRate}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${m.resolutionRate}%`,
              background: `linear-gradient(90deg, ${resColor}60 0%, ${resColor} 100%)`,
            }}
          />
        </div>
      </div>

      {/* Avg Response */}
      <div
        className="rounded-xl px-3 py-2"
        style={{ background: "rgba(10,25,49,0.6)", border: "1px solid rgba(96,165,250,0.07)" }}
      >
        <p className="text-[11px] mb-1.5" style={{ color: "#475569" }}>
          Avg. Response
        </p>
        <span
          className="text-sm font-bold"
          style={{ color: "#60A5FA", fontFamily: "var(--font-heading)" }}
        >
          {formatResponseTime(m.avgResponseHours)}
        </span>
      </div>

      {/* Reports Handled */}
      <div
        className="rounded-xl px-3 py-2"
        style={{ background: "rgba(10,25,49,0.6)", border: "1px solid rgba(96,165,250,0.07)" }}
      >
        <p className="text-[11px] mb-1.5" style={{ color: "#475569" }}>
          Ulat na Naayos
        </p>
        <span
          className="text-sm font-bold"
          style={{ color: "#F59E0B", fontFamily: "var(--font-heading)" }}
        >
          {m.resolvedReports}
          <span className="text-[11px] font-normal ml-0.5" style={{ color: "#64748B" }}>
            / {m.resolvedReports + m.activeReports}
          </span>
        </span>
      </div>
    </div>
  );
}

// ─── Official Card ────────────────────────────────────────────────────────────

function OfficialCard({ official }: { official: Official }) {
  const initials = official.name
    .replace("Hon. ", "")
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  const accentColor =
    official.role === "mayor"
      ? "#F59E0B"
      : official.role === "vice_mayor"
      ? "#60A5FA"
      : official.role === "barangay_captain"
      ? "#10B981"
      : "#818CF8";

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "rgba(17,35,71,0.45)",
        border: `1px solid ${accentColor}18`,
      }}
    >
      {/* Card header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{
          background: "rgba(10,25,49,0.5)",
          borderBottom: `1px solid ${accentColor}14`,
        }}
      >
        {/* Avatar */}
        <div
          className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold"
          style={{
            background: `${accentColor}18`,
            border: `1px solid ${accentColor}35`,
            color: accentColor,
            fontFamily: "var(--font-heading)",
          }}
          aria-hidden="true"
        >
          {initials}
        </div>

        {/* Name + title */}
        <div className="min-w-0 flex-1">
          <p
            className="text-xs font-bold leading-snug"
            style={{ color: "#F1F5F9", fontFamily: "var(--font-heading)" }}
          >
            {official.name}
          </p>
          <p className="text-[11px] mt-0.5" style={{ color: accentColor }}>
            {official.title}
            {official.barangay && (
              <span style={{ color: "#64748B" }}> — Brgy. {official.barangay}</span>
            )}
          </p>
        </div>
      </div>

      {/* Card body */}
      <div className="px-4 py-3 flex flex-col gap-2">
        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <span className="text-[11px]" style={{ color: "#64748B" }}>
            🗓️ {official.term}
          </span>
          {official.committee && (
            <span className="text-[11px]" style={{ color: "#64748B" }}>
              📋 {official.committee}
            </span>
          )}
          {official.email && (
            <a
              href={`mailto:${official.email}`}
              className="text-[11px] transition-opacity hover:opacity-80"
              style={{ color: "#60A5FA" }}
            >
              ✉️ {official.email}
            </a>
          )}
          {official.officeHours && (
            <span className="text-[11px]" style={{ color: "#64748B" }}>
              🕐 {official.officeHours}
            </span>
          )}
        </div>

        {/* Metrics */}
        {official.metrics && <MetricsRow m={official.metrics} />}
      </div>
    </div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  subtitle,
  count,
  color,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  count?: number;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
        style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h2
            className="text-base font-bold"
            style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h2>
          {count !== undefined && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: `${color}12`,
                color,
                border: `1px solid ${color}25`,
                fontFamily: "var(--font-heading)",
              }}
            >
              {count}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OfficialsPage() {
  const allOfficials = [...MUNICIPAL_EXECUTIVES, ...COUNCILORS, ...BARANGAY_CAPTAINS];
  const avgResolution = Math.round(
    allOfficials
      .filter((o) => o.metrics)
      .reduce((sum, o) => sum + (o.metrics?.resolutionRate ?? 0), 0) /
      allOfficials.filter((o) => o.metrics).length
  );
  const totalResolved = allOfficials.reduce(
    (sum, o) => sum + (o.metrics?.resolvedReports ?? 0),
    0
  );
  const avgResponse = Math.round(
    allOfficials
      .filter((o) => o.metrics)
      .reduce((sum, o) => sum + (o.metrics?.avgResponseHours ?? 0), 0) /
      allOfficials.filter((o) => o.metrics).length
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--civic-navy-dark)" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header
        style={{
          background: "linear-gradient(180deg, #0A1931 0%, rgba(10,25,49,0.95) 100%)",
          borderBottom: "1px solid rgba(129,140,248,0.12)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-xs" aria-label="Breadcrumb">
            <Link href="/" style={{ color: "#60A5FA" }} className="hover:opacity-80 transition-opacity">
              Civic Paete
            </Link>
            <span style={{ color: "#475569" }}>/</span>
            <Link href="/transparency/projects" style={{ color: "#60A5FA" }} className="hover:opacity-80 transition-opacity">
              Transparency
            </Link>
            <span style={{ color: "#475569" }}>/</span>
            <span style={{ color: "#94A3B8" }}>Mga Opisyal</span>
          </nav>

          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(129,140,248,0.12)", border: "1px solid rgba(129,140,248,0.3)" }}
            >
              <svg
                className="w-7 h-7"
                style={{ color: "#818CF8" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(129,140,248,0.12)",
                    color: "#818CF8",
                    border: "1px solid rgba(129,140,248,0.25)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Feature 9
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
                  Accountability
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
              >
                Mga Opisyal at Accountability Directory
              </h1>
              <p className="text-sm mt-1" style={{ color: "#64748B" }}>
                Munisipalidad ng Paete, Laguna — Termino 2022–2025
              </p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            {[
              { label: "Kabuuang Opisyal", value: String(allOfficials.length + DEPARTMENT_HEADS.length), icon: "👤", color: "#818CF8" },
              { label: "Avg. Resolution Rate", value: `${avgResolution}%`, icon: "✅", color: "#10B981" },
              { label: "Avg. Response Time", value: formatResponseTime(avgResponse), icon: "⏱️", color: "#60A5FA" },
              { label: "Kabuuang Naayos", value: String(totalResolved), icon: "📋", color: "#F59E0B" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl px-4 py-3"
                style={{ background: "rgba(17,35,71,0.6)", border: "1px solid rgba(96,165,250,0.1)" }}
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">

        {/* ── 1. Municipal Executives ── */}
        <section aria-labelledby="executives-heading">
          <SectionHeader
            icon="🏛️"
            title="Pamunuan ng Munisipalidad"
            subtitle="Mayor at Vice Mayor — Pangunahing responsable sa administrasyon ng buong bayan"
            count={MUNICIPAL_EXECUTIVES.length}
            color="#F59E0B"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MUNICIPAL_EXECUTIVES.map((off) => (
              <OfficialCard key={off.id} official={off} />
            ))}
          </div>
        </section>

        {/* ── 2. Sangguniang Bayan ── */}
        <section aria-labelledby="councilors-heading">
          <SectionHeader
            icon="🗳️"
            title="Sangguniang Bayan"
            subtitle="Mga Kagawad — Gumagawa ng ordinansa at resolusyon para sa kapakanan ng bayan"
            count={COUNCILORS.length}
            color="#818CF8"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {COUNCILORS.map((off) => (
              <OfficialCard key={off.id} official={off} />
            ))}
          </div>
        </section>

        {/* ── 3. Barangay Captains ── */}
        <section aria-labelledby="brgy-captains-heading">
          <SectionHeader
            icon="📍"
            title="Mga Punong Barangay"
            subtitle="9 Barangays ng Paete — Direktang naglilingkod sa bawat komunidad"
            count={BARANGAY_CAPTAINS.length}
            color="#10B981"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {BARANGAY_CAPTAINS.map((off) => (
              <OfficialCard key={off.id} official={off} />
            ))}
          </div>
        </section>

        {/* ── 4. Department Heads ── */}
        <section aria-labelledby="dept-heads-heading">
          <SectionHeader
            icon="🏢"
            title="Mga Pinuno ng Opisina"
            subtitle="Municipal Department Heads — Mga teknikal na opisyal ng LGU"
            count={DEPARTMENT_HEADS.length}
            color="#60A5FA"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DEPARTMENT_HEADS.map((dept) => (
              <div
                key={dept.dept}
                className="rounded-xl px-4 py-3 flex items-start gap-3"
                style={{
                  background: "rgba(17,35,71,0.45)",
                  border: "1px solid rgba(96,165,250,0.07)",
                }}
              >
                <span
                  className="text-xl flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                >
                  {dept.icon}
                </span>
                <div>
                  <p
                    className="text-xs font-bold leading-snug"
                    style={{ color: dept.color, fontFamily: "var(--font-heading)" }}
                  >
                    {dept.dept}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                    {dept.head}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. Accountability Note ── */}
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{
            background: "rgba(129,140,248,0.06)",
            border: "1px solid rgba(129,140,248,0.15)",
          }}
        >
          <span className="text-xl flex-shrink-0" aria-hidden="true">⚖️</span>
          <div>
            <p
              className="text-sm font-bold mb-1"
              style={{ color: "#C7D2FE", fontFamily: "var(--font-heading)" }}
            >
              Tungkol sa Accountability Metrics
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
              Ang mga numero ng resolution rate at response time ay batay sa mga ulat na naisumite sa pamamagitan ng Civic Paete platform.
              Para sa mga reklamo laban sa sinumang opisyal, maaari ninyong direktang mag-file sa{" "}
              <Link href="/legal/safety" className="underline underline-offset-2 hover:opacity-80 transition-opacity" style={{ color: "#818CF8" }}>
                aming escalation directory
              </Link>{" "}
              o sa Civil Service Commission.
            </p>
          </div>
        </div>

        {/* Nav links */}
        <div
          className="rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
          style={{ background: "rgba(17,35,71,0.4)", border: "1px solid rgba(96,165,250,0.08)" }}
        >
          <p
            className="text-xs font-semibold tracking-wider uppercase flex-shrink-0"
            style={{ color: "#475569", fontFamily: "var(--font-heading)" }}
          >
            Transparency Hub
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/transparency/projects", label: "🏗️ Mga Proyekto", color: "#F59E0B" },
              { href: "/transparency/reports", label: "📊 Open Data", color: "#10B981" },
              { href: "/legal/safety", label: "🛡️ Whistleblower", color: "#818CF8" },
              { href: "/", label: "← Feed", color: "#64748B" },
            ].map(({ href, label, color }) => (
              <Link
                key={href}
                href={href}
                className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ color, background: `${color}14`, border: `1px solid ${color}25` }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <p className="text-xs text-center pb-2" style={{ color: "#334155" }}>
          Datos mula sa Sangguniang Bayan at Office of the Mayor ng Paete, Laguna. Huling na-update: Setyembre 27, 2026.
        </p>
      </main>
    </div>
  );
}
