import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  Building2,
  Clock,
  Mail,
  TrendingUp,
  MapPin,
  Calendar,
  Layers,
  Award,
  HardHat,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Officials & Accountability Directory | Civic Paete",
  description:
    "Official directory and civic response accountability metrics of municipal and provincial leaders serving the Municipality of Paete, Laguna.",
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
  committee?: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────

const MUNICIPAL_EXECUTIVES: Official[] = [
  {
    id: "off-1",
    name: "Hon. Rosario A. Fadul",
    title: "Municipal Mayor",
    role: "mayor",
    department: "Office of the Municipal Mayor",
    term: "2022 – 2025",
    email: "mayor@paete.gov.ph",
    officeHours: "Monday – Friday, 8:00 AM – 5:00 PM",
    metrics: {
      resolutionRate: 88,
      avgResponseHours: 36,
      activeReports: 12,
      resolvedReports: 94,
    },
  },
  {
    id: "off-2",
    name: "Hon. Eduardo M. Resurreccion",
    title: "Municipal Vice Mayor",
    role: "vice_mayor",
    department: "Office of the Vice Mayor / Sangguniang Bayan",
    term: "2022 – 2025",
    email: "vicemayor@paete.gov.ph",
    officeHours: "Monday – Friday, 8:00 AM – 5:00 PM",
    metrics: {
      resolutionRate: 83,
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
    title: "Municipal Councilor",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Appropriations, Finance & Ways and Means",
    metrics: { resolutionRate: 79, avgResponseHours: 52, activeReports: 5, resolvedReports: 38 },
  },
  {
    id: "off-4",
    name: "Hon. Danilo P. Alcantara",
    title: "Municipal Councilor",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Public Works, Infrastructure & Engineering",
    metrics: { resolutionRate: 92, avgResponseHours: 28, activeReports: 9, resolvedReports: 72 },
  },
  {
    id: "off-5",
    name: "Hon. Marilou C. Enriquez",
    title: "Municipal Councilor",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Health, Sanitation & Social Welfare",
    metrics: { resolutionRate: 86, avgResponseHours: 34, activeReports: 6, resolvedReports: 49 },
  },
  {
    id: "off-6",
    name: "Hon. Roberto S. Cads",
    title: "Municipal Councilor",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Peace and Order, Public Safety & Traffic",
    metrics: { resolutionRate: 89, avgResponseHours: 24, activeReports: 7, resolvedReports: 65 },
  },
  {
    id: "off-7",
    name: "Hon. Arnel V. Madriñan",
    title: "Municipal Councilor",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Environmental Protection & Natural Resources",
    metrics: { resolutionRate: 84, avgResponseHours: 40, activeReports: 4, resolvedReports: 43 },
  },
  {
    id: "off-8",
    name: "Hon. Jocelyn G. Balandra",
    title: "Municipal Councilor",
    role: "councilor",
    term: "2022 – 2025",
    committee: "Tourism, Culture & Arts (Woodcarving & Ukit)",
    metrics: { resolutionRate: 91, avgResponseHours: 32, activeReports: 3, resolvedReports: 52 },
  },
];

const BARANGAY_CAPTAINS: Official[] = [
  {
    id: "off-bc1",
    name: "Hon. Francisco M. Dela Rosa",
    title: "Barangay Chairperson",
    role: "barangay_captain",
    barangay: "Bagumbayan",
    term: "2023 – 2026",
    email: "brgy.bagumbayan@paete.gov.ph",
    metrics: { resolutionRate: 91, avgResponseHours: 32, activeReports: 9, resolvedReports: 89 },
  },
  {
    id: "off-bc2",
    name: "Hon. Rodrigo L. Ac-ac",
    title: "Barangay Chairperson",
    role: "barangay_captain",
    barangay: "Bangkusay",
    term: "2023 – 2026",
    email: "brgy.bangkusay@paete.gov.ph",
    metrics: { resolutionRate: 92, avgResponseHours: 36, activeReports: 6, resolvedReports: 68 },
  },
  {
    id: "off-bc3",
    name: "Hon. Maria Elena S. Cagayat",
    title: "Barangay Chairperson",
    role: "barangay_captain",
    barangay: "Ermita",
    term: "2023 – 2026",
    email: "brgy.ermita@paete.gov.ph",
    metrics: { resolutionRate: 92, avgResponseHours: 40, activeReports: 5, resolvedReports: 57 },
  },
  {
    id: "off-bc4",
    name: "Hon. Victorio B. Quesada",
    title: "Barangay Chairperson",
    role: "barangay_captain",
    barangay: "Ibaba del Norte",
    term: "2023 – 2026",
    email: "brgy.ibabanorte@paete.gov.ph",
    metrics: { resolutionRate: 90, avgResponseHours: 34, activeReports: 8, resolvedReports: 73 },
  },
  {
    id: "off-bc5",
    name: "Hon. Antonio P. Baet",
    title: "Barangay Chairperson",
    role: "barangay_captain",
    barangay: "Ibaba del Sur",
    term: "2023 – 2026",
    email: "brgy.ibabasur@paete.gov.ph",
    metrics: { resolutionRate: 91, avgResponseHours: 30, activeReports: 8, resolvedReports: 82 },
  },
  {
    id: "off-bc6",
    name: "Hon. Manuel C. Baldemor",
    title: "Barangay Chairperson",
    role: "barangay_captain",
    barangay: "Ilaya del Norte",
    term: "2023 – 2026",
    email: "brgy.ilayanorte@paete.gov.ph",
    metrics: { resolutionRate: 90, avgResponseHours: 38, activeReports: 8, resolvedReports: 69 },
  },
  {
    id: "off-bc7",
    name: "Hon. Salvador F. Afurong",
    title: "Barangay Chairperson",
    role: "barangay_captain",
    barangay: "Ilaya del Sur",
    term: "2023 – 2026",
    email: "brgy.ilayasur@paete.gov.ph",
    metrics: { resolutionRate: 89, avgResponseHours: 35, activeReports: 9, resolvedReports: 76 },
  },
  {
    id: "off-bc8",
    name: "Hon. Juanita D. Fadul",
    title: "Barangay Chairperson",
    role: "barangay_captain",
    barangay: "Maytoong",
    term: "2023 – 2026",
    email: "brgy.maytoong@paete.gov.ph",
    metrics: { resolutionRate: 90, avgResponseHours: 42, activeReports: 4, resolvedReports: 38 },
  },
  {
    id: "off-bc9",
    name: "Hon. Gabriel R. Valdellon",
    title: "Barangay Chairperson",
    role: "barangay_captain",
    barangay: "Quinale",
    term: "2023 – 2026",
    email: "brgy.quinale@paete.gov.ph",
    metrics: { resolutionRate: 91, avgResponseHours: 45, activeReports: 3, resolvedReports: 29 },
  },
];

const DEPARTMENT_HEADS: Official[] = [
  {
    id: "off-dh1",
    name: "Engr. Rogelio M. Tandang",
    title: "Municipal Engineer",
    role: "department_head",
    department: "Municipal Engineering Office",
    term: "Permanent Career Executive",
    email: "engineering@paete.gov.ph",
    metrics: { resolutionRate: 89, avgResponseHours: 32, activeReports: 14, resolvedReports: 112 },
  },
  {
    id: "off-dh2",
    name: "Dr. Carmela L. Cosico, MD",
    title: "Municipal Health Officer",
    role: "department_head",
    department: "Rural Health Unit (RHU)",
    term: "Permanent Career Executive",
    email: "health@paete.gov.ph",
    metrics: { resolutionRate: 95, avgResponseHours: 18, activeReports: 4, resolvedReports: 88 },
  },
  {
    id: "off-dh3",
    name: "EnP. Maricel F. Dalena",
    title: "Municipal Planning & Dev. Coordinator (MPDC)",
    role: "department_head",
    department: "Office of the MPDC",
    term: "Permanent Career Executive",
    email: "mpdc@paete.gov.ph",
    metrics: { resolutionRate: 88, avgResponseHours: 42, activeReports: 5, resolvedReports: 45 },
  },
  {
    id: "off-dh4",
    name: "Mr. Rolando B. Cadawas",
    title: "Municipal Disaster Risk Officer (MDRRMO)",
    role: "department_head",
    department: "MDRRM Operations Center",
    term: "Permanent Career Executive",
    email: "mdrrmo@paete.gov.ph",
    metrics: { resolutionRate: 96, avgResponseHours: 12, activeReports: 7, resolvedReports: 142 },
  },
];

const PROVINCIAL_EXECUTIVE: Official = {
  id: "off-gov",
  name: "Hon. Ramil L. Hernandez",
  title: "Provincial Governor of Laguna",
  role: "provincial",
  department: "Provincial Capitol of Laguna, Santa Cruz",
  term: "2022 – 2025",
  email: "governor@laguna.gov.ph",
  officeHours: "Monday – Friday, 8:00 AM – 5:00 PM",
  metrics: {
    resolutionRate: 85,
    avgResponseHours: 48,
    activeReports: 28,
    resolvedReports: 186,
  },
};

export default function OfficialsDirectoryPage() {
  const allOfficials = [
    ...MUNICIPAL_EXECUTIVES,
    ...COUNCILORS,
    ...BARANGAY_CAPTAINS,
    ...DEPARTMENT_HEADS,
    PROVINCIAL_EXECUTIVE,
  ];

  const totalHandled = allOfficials.reduce(
    (acc, cur) => acc + (cur.metrics ? cur.metrics.resolvedReports + cur.metrics.activeReports : 0),
    0
  );
  const totalResolved = allOfficials.reduce(
    (acc, cur) => acc + (cur.metrics ? cur.metrics.resolvedReports : 0),
    0
  );
  const avgSystemHours = Math.round(
    allOfficials.reduce((acc, cur) => acc + (cur.metrics ? cur.metrics.avgResponseHours : 0), 0) /
      allOfficials.length
  );

  return (
    <div className="min-h-screen bg-[#071126] text-[#F1F5F9] font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Paete Woodcarving Motif Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-amber-500 to-blue-500" />

      {/* Top Header */}
      <header className="border-b border-white/10 bg-[#0A1931]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#60A5FA] font-semibold font-heading">Officials & Accountability</span>
          </nav>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/transparency/projects"
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-medium transition-all min-h-[44px] flex items-center gap-1.5"
            >
              <HardHat className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Public Works</span>
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
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#93C5FD] mb-6">
              <Users className="w-4 h-4 text-[#60A5FA]" />
              <span>Public Service Accountability Charter &bull; RA 6713</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Officials Directory
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-8">
              Comprehensive directory of municipal, legislative, barangay, and provincial leadership serving the
              Municipality of Paete, Laguna. Audit live response rates, average turnaround times, and verified action
              records.
            </p>

            {/* Key KPI Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-heading">
                  Tracked Leaders
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-heading mt-1 block">
                  {allOfficials.length}
                </span>
                <span className="text-[11px] text-slate-500">Executive & Barangay</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block font-heading">
                  Resolution Rate
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading mt-1 block">
                  {Math.round((totalResolved / totalHandled) * 100)}%
                </span>
                <span className="text-[11px] text-slate-500">
                  {totalResolved} of {totalHandled} solved
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block font-heading">
                  Avg Turnaround
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-heading mt-1 block">
                  {avgSystemHours}h
                </span>
                <span className="text-[11px] text-slate-500">Beats 48h statutory SLA</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 shadow-lg">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8] block font-heading">
                  Paete Coverage
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#38BDF8] font-heading mt-1 block">
                  9 / 9
                </span>
                <span className="text-[11px] text-slate-500">Barangays connected</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Section 1: Municipal Executive Leadership */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>Municipal Executive Leadership</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Executive leadership directing municipal operations and legislative assemblies in Paete, Laguna.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MUNICIPAL_EXECUTIVES.map((official) => (
              <OfficialCard key={official.id} official={official} accent="#F59E0B" />
            ))}
          </div>
        </section>

        {/* Section 2: Municipal Councilors (Sangguniang Bayan) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#60A5FA]" />
                <span>Municipal Councilors &bull; Sangguniang Bayan</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Legislative sponsors heading specialized committees on public works, health, peace, and environment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COUNCILORS.map((official) => (
              <OfficialCard key={official.id} official={official} accent="#60A5FA" />
            ))}
          </div>
        </section>

        {/* Section 3: Barangay Chairpersons */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>Barangay Chairpersons &bull; All 9 Barangays</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Grassroots leaders directly addressing neighborhood triage and barangay-level infrastructure reports.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BARANGAY_CAPTAINS.map((official) => (
              <OfficialCard key={official.id} official={official} accent="#10B981" />
            ))}
          </div>
        </section>

        {/* Section 4: LGU Department Heads & Provincial Governor */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span>Technical Department Heads & Provincial Oversight</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Career executive officers overseeing engineering, health, disaster response, and provincial coordination.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEPARTMENT_HEADS.map((official) => (
              <OfficialCard key={official.id} official={official} accent="#A855F7" />
            ))}
            <OfficialCard official={PROVINCIAL_EXECUTIVE} accent="#EAB308" />
          </div>
        </section>

        {/* Statutory Citation Footer */}
        <div className="p-6 rounded-2xl bg-[#0A1931]/60 border border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Performance metrics audited under the Philippine Local Government Code of 1991 (RA 7160) and the Ease of
            Doing Business Act (RA 11032).
          </p>
          <div className="flex items-center gap-3">
            <Link href="/transparency/projects" className="text-[#60A5FA] hover:underline">
              Public Works Registry
            </Link>
            <span>&bull;</span>
            <Link href="/transparency/reports" className="text-[#60A5FA] hover:underline">
              Download Open Datasets
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-component: Official Card ─────────────────────────────────────────────

function OfficialCard({ official, accent }: { official: Official; accent: string }) {
  const m = official.metrics;
  const initials = official.name
    .replace("Hon. ", "")
    .replace("Engr. ", "")
    .replace("Dr. ", "")
    .replace("EnP. ", "")
    .replace("Mr. ", "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

  return (
    <div className="p-6 rounded-2xl bg-[#112347]/50 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl">
      <div>
        {/* Top Info */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm font-heading shrink-0"
            style={{
              background: `${accent}15`,
              color: accent,
              border: `1px solid ${accent}30`,
            }}
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white font-heading leading-tight truncate">
              {official.name}
            </h3>
            <p className="text-xs font-semibold mt-0.5" style={{ color: accent }}>
              {official.title}
              {official.barangay && ` • Brgy. ${official.barangay}`}
            </p>
            {official.department && (
              <p className="text-[11px] text-slate-400 truncate mt-0.5">{official.department}</p>
            )}
            {official.committee && (
              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                Committee: {official.committee}
              </p>
            )}
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="space-y-1.5 text-xs text-slate-300 py-3 border-t border-b border-white/5 my-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-[11px] text-slate-400">Term: {official.term}</span>
          </div>
          {official.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
              <a href={`mailto:${official.email}`} className="text-[11px] text-[#60A5FA] hover:underline truncate">
                {official.email}
              </a>
            </div>
          )}
          {official.officeHours && (
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-[11px] text-slate-400">{official.officeHours}</span>
            </div>
          )}
        </div>
      </div>

      {/* Accountability Metrics Matrix */}
      {m && (
        <div className="grid grid-cols-3 gap-2.5 pt-2">
          <div className="p-2.5 rounded-xl bg-[#0A1931]/80 border border-white/5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-heading">
              Resolution
            </span>
            <span className="text-base font-black text-emerald-400 font-heading mt-0.5 block">
              {m.resolutionRate}%
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0A1931]/80 border border-white/5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-heading">
              Avg Time
            </span>
            <span className="text-base font-black text-amber-300 font-heading mt-0.5 block">
              {m.avgResponseHours}h
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0A1931]/80 border border-white/5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block font-heading">
              Resolved
            </span>
            <span className="text-base font-black text-white font-heading mt-0.5 block">
              {m.resolvedReports}
              <span className="text-[10px] text-slate-500 font-normal">/{m.resolvedReports + m.activeReports}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
