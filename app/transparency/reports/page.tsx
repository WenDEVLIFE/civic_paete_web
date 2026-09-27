"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  FileCode2,
  CheckCircle2,
  Clock,
  ThumbsUp,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Building2,
  Filter,
} from "lucide-react";

// ─── Mock Data & Datasets ───────────────────────────────────────────────────

interface MonthlyData {
  month: string;
  shortMonth: string;
  filed: number;
  resolved: number;
}

const MONTHLY_TRENDS_2026: MonthlyData[] = [
  { month: "Enero", shortMonth: "Ene", filed: 42, resolved: 39 },
  { month: "Pebrero", shortMonth: "Peb", filed: 56, resolved: 51 },
  { month: "Marso", shortMonth: "Mar", filed: 64, resolved: 58 },
  { month: "Abril", shortMonth: "Abr", filed: 48, resolved: 46 },
  { month: "Mayo", shortMonth: "May", filed: 72, resolved: 65 },
  { month: "Hunyo", shortMonth: "Hun", filed: 85, resolved: 74 },
  { month: "Hulyo", shortMonth: "Hul", filed: 104, resolved: 91 },
  { month: "Agosto", shortMonth: "Ago", filed: 92, resolved: 83 },
  { month: "Setyembre", shortMonth: "Set", filed: 78, resolved: 70 },
];

interface CategorySummary {
  id: string;
  name: string;
  icon: string;
  count: number;
  resolvedCount: number;
  percentage: number;
  color: string;
}

const CATEGORY_DATA: CategorySummary[] = [
  {
    id: "infra",
    name: "Kalsada at Imprastraktura",
    icon: "🚧",
    count: 215,
    resolvedCount: 191,
    percentage: 33.5,
    color: "#F59E0B",
  },
  {
    id: "drainage",
    name: "Kanal, Baha at Drainage",
    icon: "🌊",
    count: 148,
    resolvedCount: 132,
    percentage: 23.1,
    color: "#06B6D4",
  },
  {
    id: "waste",
    name: "Basura at Kalinisan",
    icon: "🗑️",
    count: 112,
    resolvedCount: 104,
    percentage: 17.5,
    color: "#10B981",
  },
  {
    id: "lighting",
    name: "Streetlights at Kuryente",
    icon: "💡",
    count: 86,
    resolvedCount: 80,
    percentage: 13.4,
    color: "#EAB308",
  },
  {
    id: "safety",
    name: "Kapayapaan at Kaayusan",
    icon: "🛡️",
    count: 47,
    resolvedCount: 41,
    percentage: 7.3,
    color: "#8B5CF6",
  },
  {
    id: "others",
    name: "Iba pang Serbisyong Publiko",
    icon: "🏛️",
    count: 33,
    resolvedCount: 29,
    percentage: 5.2,
    color: "#64748B",
  },
];

interface BarangayPerformance {
  barangay: string;
  totalFiled: number;
  resolved: number;
  inProgress: number;
  avgHours: number;
}

const BARANGAY_PERFORMANCE: BarangayPerformance[] = [
  { barangay: "Bagumbayan", totalFiled: 98, resolved: 89, inProgress: 9, avgHours: 32 },
  { barangay: "Bangkusay", totalFiled: 74, resolved: 68, inProgress: 6, avgHours: 36 },
  { barangay: "Ermita", totalFiled: 62, resolved: 57, inProgress: 5, avgHours: 40 },
  { barangay: "Ibaba del Norte", totalFiled: 81, resolved: 73, inProgress: 8, avgHours: 34 },
  { barangay: "Ibaba del Sur", totalFiled: 90, resolved: 82, inProgress: 8, avgHours: 30 },
  { barangay: "Ilaya del Norte", totalFiled: 77, resolved: 69, inProgress: 8, avgHours: 38 },
  { barangay: "Ilaya del Sur", totalFiled: 85, resolved: 76, inProgress: 9, avgHours: 35 },
  { barangay: "Maytoong", totalFiled: 42, resolved: 38, inProgress: 4, avgHours: 42 },
  { barangay: "Quinale", totalFiled: 32, resolved: 29, inProgress: 3, avgHours: 45 },
];

interface DatasetItem {
  id: string;
  title: string;
  description: string;
  filename: string;
  recordsCount: number;
  format: "CSV" | "JSON" | "BOTH";
  lastUpdated: string;
  csvData: string;
  jsonData: object;
}

const OPEN_DATASETS: DatasetItem[] = [
  {
    id: "reports-2026",
    title: "Mga Reklamo at Kahilingang Sibil 2026 (De-identified)",
    description:
      "Talaan ng lahat ng ulat mula Enero hanggang Setyembre 2026 na may tinanggal na sensitibong personal na impormasyon alinsunod sa Data Privacy Act of 2012.",
    filename: "civic_paete_reports_2026",
    recordsCount: 641,
    format: "BOTH",
    lastUpdated: "Setyembre 27, 2026",
    csvData: `report_id,barangay,category,status,urgency,filed_date,resolved_date,turnaround_hours
RPT-2026-001,Bagumbayan,Drainage,Resolved,Mataas,2026-01-04,2026-01-05,24
RPT-2026-002,Ilaya del Sur,Streetlight,Resolved,Katamtaman,2026-01-06,2026-01-08,48
RPT-2026-003,Ibaba del Norte,Basura,Resolved,Mababa,2026-01-09,2026-01-10,22
RPT-2026-004,Bangkusay,Kalsada,Resolved,Kritikal,2026-01-12,2026-01-14,38
RPT-2026-005,Ermita,Drainage,Resolved,Mataas,2026-01-15,2026-01-16,28
RPT-2026-006,Maytoong,Kalsada,Resolved,Katamtaman,2026-01-18,2026-01-20,44
RPT-2026-007,Quinale,Streetlight,Resolved,Mababa,2026-01-21,2026-01-23,46
RPT-2026-008,Ibaba del Sur,Basura,Resolved,Mataas,2026-01-24,2026-01-25,18
RPT-2026-009,Bagumbayan,Kalsada,Resolved,Katamtaman,2026-01-27,2026-01-29,36
RPT-2026-010,Ilaya del Norte,Kapayapaan,Resolved,Mataas,2026-01-30,2026-02-01,32`,
    jsonData: {
      metadata: {
        municipality: "Paete, Laguna",
        coverage: "2026-01-01 to 2026-09-27",
        license: "Open Data Commons PDDL",
        total_records: 641,
      },
      reports_sample: [
        { id: "RPT-2026-001", barangay: "Bagumbayan", category: "Drainage", status: "Resolved", turnaround_hours: 24 },
        { id: "RPT-2026-002", barangay: "Ilaya del Sur", category: "Streetlight", status: "Resolved", turnaround_hours: 48 },
        { id: "RPT-2026-003", barangay: "Ibaba del Norte", category: "Basura", status: "Resolved", turnaround_hours: 22 },
        { id: "RPT-2026-004", barangay: "Bangkusay", category: "Kalsada", status: "Resolved", turnaround_hours: 38 },
        { id: "RPT-2026-005", barangay: "Ermita", category: "Drainage", status: "Resolved", turnaround_hours: 28 },
      ],
    },
  },
  {
    id: "projects-audit-2026",
    title: "Pampublikong Proyekto at Badyet Audit 2026",
    description:
      "Tala ng mga proyektong pang-imprastraktura, halaga ng badyet, pinagkunan ng pondo, at nakatalagang kontraktor sa Paete.",
    filename: "paete_public_works_audits_2026",
    recordsCount: 14,
    format: "BOTH",
    lastUpdated: "Setyembre 25, 2026",
    csvData: `project_code,project_title,barangay,allocated_budget_php,contractor,completion_pct,status,fund_source
PRJ-2026-01,Pagpapalawak ng Drainage Quesada St,Bagumbayan,2850000,Reyes Construction,100,Tapos Na,20% Development Fund
PRJ-2026-02,LED Solar Streetlights Phase 3,Munisipalidad,1450000,SunPower Laguna,85,Isinasagawa,LGU Calamity & Safety Fund
PRJ-2026-03,Flood Retaining Wall San Vicente,Ilaya del Sur,4200000,Laguna GeoBuilders,65,Isinasagawa,Provincial Assistance Fund
PRJ-2026-04,Rehabilitasyon ng F Sario St,Ibaba del Sur,1800000,Bangkusay Asphalt Works,100,Tapos Na,Municipal General Fund
PRJ-2026-05,Paete Eco-Park & Waste Sorting Center,Maytoong,3100000,GreenLaguna Initiatives,30,Isinasagawa,DENR Ecological Solid Waste Grant
PRJ-2026-06,Renovasyon ng Municipal Hall Roof,Poblacion,950000,Woodcraft & Civil Works,0,Bidding,Municipal Capital Outlay`,
    jsonData: {
      municipality: "Paete, Laguna",
      fiscal_year: 2026,
      total_appropriation_php: 14350000,
      projects: [
        { code: "PRJ-2026-01", title: "Drainage Quesada St", budget: 2850000, status: "Completed" },
        { code: "PRJ-2026-02", title: "LED Solar Streetlights", budget: 1450000, status: "Ongoing" },
        { code: "PRJ-2026-03", title: "Flood Retaining Wall", budget: 4200000, status: "Ongoing" },
      ],
    },
  },
  {
    id: "barangay-metrics-2026",
    title: "Barangay Service Resolution Benchmarks 2026",
    description:
      "Statistika ng kahusayan sa pagtugon ng 9 na barangay sa Paete kaugnay ng mga naihaing hinaing at aksyon ng komunidad.",
    filename: "paete_barangay_benchmarks_2026",
    recordsCount: 9,
    format: "BOTH",
    lastUpdated: "Setyembre 20, 2026",
    csvData: `barangay,total_reports,resolved_reports,resolution_rate_pct,avg_response_hours,in_progress_count
Bagumbayan,98,89,90.8,32,9
Ibaba del Sur,90,82,91.1,30,8
Ilaya del Sur,85,76,89.4,35,9
Ibaba del Norte,81,73,90.1,34,8
Ilaya del Norte,77,69,89.6,38,8
Bangkusay,74,68,91.9,36,6
Ermita,62,57,91.9,40,5
Maytoong,42,38,90.5,42,4
Quinale,32,29,90.6,45,3`,
    jsonData: {
      coverage: "9 Barangays of Paete",
      average_resolution_rate: "90.8%",
      benchmarks: [
        { barangay: "Bagumbayan", rate: 90.8, avg_hours: 32 },
        { barangay: "Ibaba del Sur", rate: 91.1, avg_hours: 30 },
        { barangay: "Bangkusay", rate: 91.9, avg_hours: 36 },
      ],
    },
  },
];

export default function OpenDataReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"2026-ALL" | "2026-Q3" | "2026-Q2" | "2026-Q1">("2026-ALL");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Trigger real file download in-browser
  const handleDownload = (item: DatasetItem, format: "csv" | "json") => {
    let content = "";
    let mimeType = "";
    let extension = "";

    if (format === "csv") {
      content = item.csvData;
      mimeType = "text/csv;charset=utf-8;";
      extension = "csv";
    } else {
      content = JSON.stringify(item.jsonData, null, 2);
      mimeType = "application/json;charset=utf-8;";
      extension = "json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${item.filename}.${extension}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`${item.filename}.${extension}`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 4000);
  };

  const maxFiledValue = Math.max(...MONTHLY_TRENDS_2026.map((m) => m.filed));

  return (
    <div className="min-h-screen bg-[#070D18] text-[#F1F5F9] pb-24">
      {/* Top Breadcrumb & Notification */}
      <header className="border-b border-white/10 bg-[#0A1931]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <Link href="/" className="hover:text-white transition-colors">
              Tahanan
            </Link>
            <span>/</span>
            <Link href="/transparency/projects" className="hover:text-white transition-colors">
              Transparency Hub
            </Link>
            <span>/</span>
            <span className="text-[#38BDF8] font-medium">Mga Ulat at Open Data</span>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/transparency/projects"
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
            >
              🚧 Mga Proyekto
            </Link>
            <Link
              href="/transparency/officials"
              className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors"
            >
              🏛️ Mga Opisyal
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 pt-10">
        {/* Banner Announcement */}
        {downloadSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Matagumpay na na-download ang file: <strong className="text-white">{downloadSuccess}</strong>
              </span>
            </div>
            <button
              onClick={() => setDownloadSuccess(null)}
              className="text-xs text-emerald-400 hover:text-white underline"
            >
              Isara
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Open Data Initiative &bull; LGU Paete</span>
          </div>
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Mga Ulat at Open Data ng Bayan
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-3xl leading-relaxed">
            I-access, suriin, at i-download ang mga pampublikong estadistika ng Munisipalidad ng Paete. Kasama ang
            buwanang tala ng mga naaksyunang ulat sibil, metriko ng mga barangay, at bukas na datos para sa pananaliksik
            at pananagutan.
          </p>

          {/* Timeframe Filter Bar */}
          <div className="mt-6 flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
            <span className="text-xs text-[#64748B] flex items-center gap-1.5 mr-2 font-medium">
              <Filter className="w-3.5 h-3.5" /> Panahon ng Datos:
            </span>
            {[
              { id: "2026-ALL" as const, label: "2026 Buong Taon (YTD)" },
              { id: "2026-Q3" as const, label: "Q3 (Hulyo – Setyembre)" },
              { id: "2026-Q2" as const, label: "Q2 (Abril – Hunyo)" },
              { id: "2026-Q1" as const, label: "Q1 (Enero – Marso)" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPeriod(p.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedPeriod === p.id
                    ? "bg-[#38BDF8] text-[#070D18] font-bold shadow-md shadow-[#38BDF8]/20"
                    : "bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="p-5 rounded-2xl bg-[#0D1F38]/80 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#94A3B8] mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Naihaing Ulat</span>
              <Layers className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="text-3xl font-extrabold text-white">641</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <span>+18.4%</span> kumpara noong 2025
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1F38]/80 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#94A3B8] mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Nalutas na Kasalukuyan</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-400">90.8%</div>
            <div className="text-xs text-[#94A3B8] mt-1">577 sa 641 ang nalutas</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1F38]/80 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#94A3B8] mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Oras ng Aksyon</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-300">35.8 hrs</div>
            <div className="text-xs text-emerald-400 mt-1">Mas mabilis kaysa 48hr SLA</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0D1F38]/80 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center justify-between text-[#94A3B8] mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold">Kasiyahan ng Mamamayan</span>
              <ThumbsUp className="w-4 h-4 text-[#38BDF8]" />
            </div>
            <div className="text-3xl font-extrabold text-white">4.8 / 5.0</div>
            <div className="text-xs text-[#94A3B8] mt-1">Batay sa 412 na review</div>
          </div>
        </section>

        {/* Section 1: Monthly Resolution Trends (Visual CSS Bar Graph) */}
        <section className="mb-12 p-6 sm:p-8 rounded-2xl bg-[#0D1F38]/70 border border-white/10 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#38BDF8]" /> Buwanang Dami ng Ulat at Paglutas (2026)
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                Paghahambing ng kabuuang bilang ng ulat na natanggap laban sa mga matagumpay na naaksyunan
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-[#38BDF8]/40 border border-[#38BDF8]" />
                <span className="text-[#94A3B8]">Natanggap</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
                <span className="text-[#94A3B8]">Nalutas</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-6 pt-6 border-b border-white/10">
            {MONTHLY_TRENDS_2026.map((item) => {
              const filedHeight = Math.round((item.filed / maxFiledValue) * 100);
              const resolvedHeight = Math.round((item.resolved / maxFiledValue) * 100);

              return (
                <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white bg-[#070D18] px-2 py-1 rounded border border-white/20 mb-2 pointer-events-none text-center whitespace-nowrap shadow-xl">
                    <p className="font-semibold text-[#38BDF8]">{item.month}</p>
                    <p>{item.resolved} / {item.filed} nalutas</p>
                  </div>

                  {/* Bars */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                    {/* Filed bar */}
                    <div
                      className="w-full max-w-[18px] bg-[#38BDF8]/40 border border-[#38BDF8]/70 rounded-t-sm transition-all duration-500 group-hover:bg-[#38BDF8]/60"
                      style={{ height: `${filedHeight}%` }}
                      title={`Natanggap: ${item.filed}`}
                    />
                    {/* Resolved bar */}
                    <div
                      className="w-full max-w-[18px] bg-emerald-500 rounded-t-sm transition-all duration-500 group-hover:bg-emerald-400"
                      style={{ height: `${resolvedHeight}%` }}
                      title={`Nalutas: ${item.resolved}`}
                    />
                  </div>

                  {/* Month Label */}
                  <span className="text-[11px] font-medium text-[#94A3B8] mt-3">{item.shortMonth}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-[#64748B]">
            <span>* Nagtatala ng pinakamataas na dami ng ulat tuwing tag-ulan (Hulyo - Agosto) sanhi ng mga baha at sirang kanal.</span>
            <span>Pinagkunan: Paete Municipal Incident Command System (MICS)</span>
          </div>
        </section>

        {/* Section 2: Category Breakdown */}
        <section className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" /> Paghahati Ayon sa Kategorya
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Distribusyon ng 641 na naihaing usapin sa bawat sektor ng serbisyo publiko
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORY_DATA.map((cat) => (
              <div
                key={cat.id}
                className="p-5 rounded-2xl bg-[#0D1F38]/60 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${cat.color}20`,
                      color: cat.color,
                      border: `1px solid ${cat.color}40`,
                    }}
                  >
                    {cat.percentage}%
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm mb-1">{cat.name}</h3>
                <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-3">
                  <span>Kabuuang Ulat: <strong className="text-white">{cat.count}</strong></span>
                  <span>Nalutas: <strong className="text-emerald-400">{cat.resolvedCount}</strong></span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(cat.resolvedCount / cat.count) * 100}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
                <div className="mt-2 text-[10px] text-right text-[#64748B]">
                  {Math.round((cat.resolvedCount / cat.count) * 100)}% resolution rate
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Barangay Performance Benchmark Table */}
        <section className="mb-12 p-6 sm:p-8 rounded-2xl bg-[#0D1F38]/70 border border-white/10 backdrop-blur-md">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-400" /> Kahusayan ng Bawat Barangay
              </h2>
              <p className="text-xs text-[#94A3B8] mt-1">
                Talaan ng pagtugon ng 9 na barangay sa Paete mula Enero hanggang Setyembre 2026
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Lahat ay higit sa 89% Resolution Target
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-[#64748B] uppercase font-semibold">
                  <th className="pb-3 pl-2">Barangay</th>
                  <th className="pb-3 text-right">Kabuuang Ulat</th>
                  <th className="pb-3 text-right">Nalutas</th>
                  <th className="pb-3 text-right">Isinasagawa</th>
                  <th className="pb-3 text-right">Karaniwang Oras</th>
                  <th className="pb-3 text-right pr-2">Rating ng Lunas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {BARANGAY_PERFORMANCE.map((b) => {
                  const rate = Math.round((b.resolved / b.totalFiled) * 100);
                  return (
                    <tr key={b.barangay} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pl-2 font-medium text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {b.barangay}
                      </td>
                      <td className="py-3.5 text-right text-[#94A3B8]">{b.totalFiled}</td>
                      <td className="py-3.5 text-right font-semibold text-emerald-400">{b.resolved}</td>
                      <td className="py-3.5 text-right text-amber-300">{b.inProgress}</td>
                      <td className="py-3.5 text-right text-[#94A3B8]">{b.avgHours} oras</td>
                      <td className="py-3.5 text-right pr-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Open Datasets Download Center */}
        <section className="mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#38BDF8]/10 border border-[#38BDF8]/20 text-[#38BDF8] mb-2">
              <Download className="w-3.5 h-3.5" />
              <span>Bukas na Datos (Open Data Hub)</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Mag-download ng Datos (CSV / JSON)</h2>
            <p className="text-xs text-[#94A3B8] mt-1 max-w-2xl">
              Malugod naming ibinabahagi ang mga dataset ng pamahalaan para sa mga mamamahayag, mag-aaral, mananaliksik,
              at mamamayan. Libreng magagamit sa ilalim ng Open Data Commons Public Domain Dedication (PDDL).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {OPEN_DATASETS.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-[#0D1F38]/80 border border-white/10 flex flex-col justify-between hover:border-[#38BDF8]/40 transition-all shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-[#64748B] mb-3">
                    <span className="px-2 py-0.5 rounded bg-white/5 font-mono text-[10px] text-[#38BDF8]">
                      {item.recordsCount} Tala / Rows
                    </span>
                    <span>Huli: {item.lastUpdated}</span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 leading-snug">{item.title}</h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-6">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <button
                    onClick={() => handleDownload(item, "csv")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                  </button>
                  <button
                    onClick={() => handleDownload(item, "json")}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#38BDF8]/15 hover:bg-[#38BDF8]/25 border border-[#38BDF8]/30 text-[#38BDF8] text-xs font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <FileCode2 className="w-3.5 h-3.5" /> JSON
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Data Governance & Privacy Guarantee */}
        <section className="p-6 rounded-2xl bg-[#0A1931]/60 border border-white/10 text-xs text-[#94A3B8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Proteksyon sa Pagkakakilanlan at Open Data Policy</h4>
              <p className="leading-relaxed">
                Ang lahat ng ulat at datos na nailalathala rito ay dumaan sa proseso ng de-identification upang
                maprotektahan ang pagkakakilanlan ng bawat nag-ulat alinsunod sa Batas Republika Blg. 10173 (Data
                Privacy Act of 2012).
              </p>
            </div>
          </div>
          <Link
            href="/legal/privacy"
            className="shrink-0 inline-flex items-center gap-1 text-xs text-[#38BDF8] hover:underline font-medium"
          >
            Basahin ang Patakaran sa Privacy <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </section>

        <footer className="mt-12 text-center text-xs text-[#64748B]">
          Munisipalidad ng Paete, Laguna &bull; Tanggapan ng Punong Bayan at Municipal Planning and Development
          Coordinator (MPDC)
        </footer>
      </main>
    </div>
  );
}
