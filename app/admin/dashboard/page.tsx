"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CivicPaeteLogo } from "@/components/brand/CivicPaeteLogo";
import { CommunityReport, ReportStatus } from "@/components/reports/ReportCard";
import {
  Shield,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  BarChart3,
  LogOut,
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Users,
  History,
  Building2,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

interface AdminReport extends CommunityReport {
  officialNotes?: string;
  assignedOffice?: string;
}

interface CivicUser {
  id: string;
  name: string;
  email: string;
  role: "resident" | "official";
  barangayOrOffice: string;
  reportsCount: number;
  registeredDate: string;
  authProvider: "google" | "municipal_credentials";
}

interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  reportId: string;
  barangay: string;
  details: string;
}

const INITIAL_ADMIN_REPORTS: AdminReport[] = [
  {
    id: "rep-1",
    title: "Sirang Streetlight sa kahabaan ng Quesada Street",
    description: "Madilim na bahagi sa gabi at delikado para sa mga estudyante at mamamayang umuuwi mula sa trabaho.",
    category: "lighting",
    barangay: "Bagumbayan",
    status: "in_progress",
    date: "Setyembre 24, 2026",
    upvotes: 18,
    assignedOffice: "Municipal Engineering Office",
    officialNotes: "Ininspeksyon ng maintenance team; kailangan ng bagong LED bulb fixture.",
  },
  {
    id: "rep-2",
    title: "Kanal na barado na nagdudulot ng mabagal na pag-agos",
    description: "Kailangang masipsip o linisin bago sumapit ang malalakas na buhos ng ulan upang maiwasan ang pag-apaw.",
    category: "drainage",
    barangay: "Ibaba del Sur",
    status: "pending",
    date: "Setyembre 25, 2026",
    upvotes: 12,
    assignedOffice: "MENRO / Barangay Maintenance",
  },
  {
    id: "rep-3",
    title: "Naayos na Pothole sa Kanto ng Pamilihan",
    description: "Nalapatan na ng aspalto ng engineering office matapos i-ulat noong nakaraang linggo.",
    category: "road",
    barangay: "Maytoong",
    status: "resolved",
    date: "Setyembre 22, 2026",
    upvotes: 34,
    assignedOffice: "Municipal Engineering Office",
    officialNotes: "Nalapatan ng cold-patch asphalt noong Sept 23, 2026.",
  },
  {
    id: "rep-4",
    title: "Tambak ng mga sanga at dahon sa gilid ng kalsada",
    description: "Mula sa pinutol na punong kahoy, kailangan ng truck para mahakot nang maayos.",
    category: "waste",
    barangay: "Quinale",
    status: "pending",
    date: "Setyembre 26, 2026",
    upvotes: 7,
    assignedOffice: "MENRO (Sanitation)",
  },
  {
    id: "rep-5",
    title: "Nakatagilid na poste ng kuryente malapit sa ilog",
    description: "Nangangailangan ng agarang inspeksyon mula sa mga kinauukulan para sa kaligtasan ng mga kalapit na kabahayan.",
    category: "safety",
    barangay: "Bangkusay",
    status: "urgent",
    date: "Setyembre 26, 2026",
    upvotes: 41,
    assignedOffice: "MDRRMO / Meralco Liaison",
    officialNotes: "Nai-forward na sa emergency coordination team para sa agarang safety cordon.",
  },
  {
    id: "rep-6",
    title: "Nalinis na drainage canal sa may Simbahan",
    description: "Natanggal na ang mga plastic na nakabara sa daluyan ng tubig.",
    category: "drainage",
    barangay: "Ilaya del Norte",
    status: "resolved",
    date: "Setyembre 21, 2026",
    upvotes: 29,
    assignedOffice: "Barangay Cleanup Team",
    officialNotes: "Natapos ang cleanup drive noong Linggo ng umaga.",
  },
];

const INITIAL_USERS: CivicUser[] = [
  {
    id: "usr-admin",
    name: "Municipal Administrator",
    email: "admin@paete.gov.ph",
    role: "official",
    barangayOrOffice: "Office of the Municipal Mayor / Hall",
    reportsCount: 0,
    registeredDate: "Sept 27, 2026",
    authProvider: "municipal_credentials",
  },
  {
    id: "usr-gov",
    name: "Hon. Provincial Governor",
    email: "governor@laguna.gov.ph",
    role: "official",
    barangayOrOffice: "Office of the Provincial Governor - Laguna",
    reportsCount: 0,
    registeredDate: "Sept 27, 2026",
    authProvider: "municipal_credentials",
  },
  {
    id: "usr-1",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@gmail.com",
    role: "resident",
    barangayOrOffice: "Brgy. Bagumbayan",
    reportsCount: 4,
    registeredDate: "Sept 12, 2026",
    authProvider: "google",
  },
  {
    id: "usr-2",
    name: "Maria Santos-Reyes",
    email: "maria.reyes@gmail.com",
    role: "resident",
    barangayOrOffice: "Brgy. Maytoong",
    reportsCount: 2,
    registeredDate: "Sept 15, 2026",
    authProvider: "google",
  },
  {
    id: "usr-3",
    name: "Engr. Marco Adea",
    email: "marco.adea@paete.gov.ph",
    role: "official",
    barangayOrOffice: "Municipal Engineering Office",
    reportsCount: 0,
    registeredDate: "Aug 01, 2026",
    authProvider: "municipal_credentials",
  },
  {
    id: "usr-4",
    name: "Arlene Cadawas",
    email: "arlene.cadawas@paete.gov.ph",
    role: "official",
    barangayOrOffice: "MENRO Paete",
    reportsCount: 0,
    registeredDate: "Aug 10, 2026",
    authProvider: "municipal_credentials",
  },
  {
    id: "usr-5",
    name: "Roberto Fadul",
    email: "roberto.fadul@gmail.com",
    role: "resident",
    barangayOrOffice: "Brgy. Bangkusay",
    reportsCount: 3,
    registeredDate: "Sept 18, 2026",
    authProvider: "google",
  },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "aud-101",
    timestamp: "Sept 26, 2026 • 10:15 AM",
    actorName: "Engr. Marco Adea",
    actorRole: "Municipal Engineering",
    action: "STATUS_UPDATE",
    reportId: "rep-1",
    barangay: "Bagumbayan",
    details: "Binago ang status: 'Pending' → 'In Progress'. Nagdagdag ng opisyal na inspeksyon note.",
  },
  {
    id: "aud-102",
    timestamp: "Sept 26, 2026 • 09:30 AM",
    actorName: "System Rule Engine",
    actorRole: "Automated Recommendation",
    action: "RULE_FLAGGED",
    reportId: "rep-1",
    barangay: "Bagumbayan",
    details: "Na-flag bilang recurring streetlight cluster concern (3 ulat sa loob ng 7 araw).",
  },
  {
    id: "aud-103",
    timestamp: "Sept 25, 2026 • 03:45 PM",
    actorName: "Arlene Cadawas",
    actorRole: "MENRO Paete",
    action: "OFFICE_DISPATCH",
    reportId: "rep-2",
    barangay: "Ibaba del Sur",
    details: "Itinalaga sa Barangay Drainage Maintenance crew para sa clearing operation.",
  },
  {
    id: "aud-104",
    timestamp: "Sept 23, 2026 • 04:10 PM",
    actorName: "Engr. Marco Adea",
    actorRole: "Municipal Engineering",
    action: "STATUS_RESOLVED",
    reportId: "rep-3",
    barangay: "Maytoong",
    details: "Binago ang status sa 'Resolved'. Nalapatan ng aspalto at may kalakip na patunay.",
  },
];

let logCounter = 200;
function generateLogId() {
  logCounter += 1;
  return `aud-${logCounter}`;
}

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: "admin" | "governor";
    office: string;
    barangayOrOffice: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("civic_paete_admin_session");
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch {
          // ignore parsing error
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("civic_paete_admin_session");
    }
  };

  const [activeTab, setActiveTab] = useState<"reports" | "users" | "audit">("reports");
  const [reports, setReports] = useState<AdminReport[]>(INITIAL_ADMIN_REPORTS);
  const [users] = useState<CivicUser[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Reports state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [barangayFilter, setBarangayFilter] = useState<string>("all");
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [noteInput, setNoteInput] = useState("");

  // Users filter state
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [userSearch, setUserSearch] = useState("");

  // Statistics
  const totalReports = reports.length;
  const pendingReports = reports.filter((r) => r.status === "pending").length;
  const inProgressReports = reports.filter((r) => r.status === "in_progress").length;
  const resolvedReports = reports.filter((r) => r.status === "resolved").length;
  const urgentReports = reports.filter((r) => r.status === "urgent").length;

  const handleStatusChange = (id: string, newStatus: ReportStatus) => {
    const target = reports.find((r) => r.id === id);
    if (!target) return;

    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    // Automatically append to Audit Trail
    const newLog: AuditLog = {
      id: generateLogId(),
      timestamp: "Ngayon lang",
      actorName: "LGU Admin Staff",
      actorRole: "Municipal Official",
      action: "STATUS_UPDATE",
      reportId: target.id,
      barangay: target.barangay,
      details: `Binago ang status mula '${target.status}' papuntang '${newStatus}'.`,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleSaveNote = () => {
    if (!selectedReport) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === selectedReport.id ? { ...r, officialNotes: noteInput } : r
      )
    );

    // Append to Audit Trail
    const newLog: AuditLog = {
      id: generateLogId(),
      timestamp: "Ngayon lang",
      actorName: "LGU Admin Staff",
      actorRole: "Municipal Official",
      action: "NOTE_ATTACHED",
      reportId: selectedReport.id,
      barangay: selectedReport.barangay,
      details: `Nag-attach ng opisyal na disposisyon/note: "${noteInput}"`,
    };
    setAuditLogs([newLog, ...auditLogs]);

    setSelectedReport(null);
  };

  const filteredReports = reports.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const matchesBarangay = barangayFilter === "all" || r.barangay === barangayFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.barangay.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesBarangay && matchesSearch;
  });

  const filteredUsers = users.filter((u) => {
    const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.barangayOrOffice.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#071126] text-white">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A1931]/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CivicPaeteLogo size="sm" variant="full" theme="dark" />
            <span className="hidden sm:inline-block h-5 w-[1px] bg-white/20" />
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>Admin & Monitoring Console</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden md:flex flex-col text-right">
              <div className="flex items-center justify-end gap-1.5">
                {currentUser?.role === "governor" && (
                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] uppercase tracking-wider border border-amber-500/30">
                    Provincial Governor
                  </span>
                )}
                {currentUser?.role === "admin" && (
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px] uppercase tracking-wider border border-blue-500/30">
                    Municipal Admin
                  </span>
                )}
                <span className="font-bold text-white">
                  {currentUser?.name || "LGU Paete Official"}
                </span>
              </div>
              <span className="text-slate-400">
                {currentUser?.email || "admin@paete.gov.ph"} • {currentUser?.barangayOrOffice || "Paete Municipal Hall"}
              </span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
            >
              <span>Portal ng Mamamayan</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/admin/login"
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Mag-logout"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Admin Console Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-7">
        {/* Title & Recommendations Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              Municipal Command & Monitoring Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Pamahalaang Bayan ng Paete, Laguna — Opisyal na Portal ng Administrasyon
            </p>
          </div>

          <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200">
            <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Rule Engine:</strong> May 3 recurring streetlight concerns sa Brgy. Bagumbayan na inirerekomenda para sa electrical assessment.
            </span>
          </div>
        </div>

        {/* Navigation Tabs (Reports | User Management | Audit Logs) */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("reports")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "reports"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Pamamahala ng mga Ulat ({reports.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "users"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Management ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("audit")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "audit"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            <History className="w-4 h-4" />
            <span>Audit Trail & Reports ({auditLogs.length})</span>
          </button>
        </div>

        {/* TAB 1: REPORTS MANAGEMENT */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Kabuuang Ulat</span>
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black font-heading text-white">{totalReports}</div>
                <p className="text-[11px] text-slate-500 mt-1">Lahat ng isinumite</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Pending Review</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black font-heading text-amber-400">{pendingReports}</div>
                <p className="text-[11px] text-slate-500 mt-1">Nangangailangan ng aksyon</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Inaaksyunan</span>
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-black font-heading text-blue-400">{inProgressReports}</div>
                <p className="text-[11px] text-slate-500 mt-1">May naka-assign na opisina</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Naaksyunan</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black font-heading text-emerald-400">{resolvedReports}</div>
                <p className="text-[11px] text-slate-500 mt-1">Nalutas nang may patunay</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between text-slate-400 mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider">Kritikal / Urgent</span>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div className="text-2xl font-black font-heading text-red-400">{urgentReports}</div>
                <p className="text-[11px] text-slate-500 mt-1">Public safety hazard</p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Maghanap ayon sa pamagat, barangay, o deskripsyon..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="all" className="bg-[#0A1931]">Lahat ng Status</option>
                  <option value="pending" className="bg-[#0A1931]">Pending Review</option>
                  <option value="in_progress" className="bg-[#0A1931]">In Progress</option>
                  <option value="resolved" className="bg-[#0A1931]">Resolved</option>
                  <option value="urgent" className="bg-[#0A1931]">Urgent</option>
                </select>

                <select
                  value={barangayFilter}
                  onChange={(e) => setBarangayFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="all" className="bg-[#0A1931]">Lahat ng Barangay (9)</option>
                  <option value="Bagumbayan" className="bg-[#0A1931]">Brgy. Bagumbayan</option>
                  <option value="Bangkusay" className="bg-[#0A1931]">Brgy. Bangkusay</option>
                  <option value="Ermita" className="bg-[#0A1931]">Brgy. Ermita</option>
                  <option value="Ibaba del Norte" className="bg-[#0A1931]">Brgy. Ibaba del Norte</option>
                  <option value="Ibaba del Sur" className="bg-[#0A1931]">Brgy. Ibaba del Sur</option>
                  <option value="Ilaya del Norte" className="bg-[#0A1931]">Brgy. Ilaya del Norte</option>
                  <option value="Ilaya del Sur" className="bg-[#0A1931]">Brgy. Ilaya del Sur</option>
                  <option value="Maytoong" className="bg-[#0A1931]">Brgy. Maytoong</option>
                  <option value="Quinale" className="bg-[#0A1931]">Brgy. Quinale</option>
                </select>
              </div>
            </div>

            {/* Reports Table */}
            <div className="rounded-2xl border border-white/10 bg-[#0A1931] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                    <tr>
                      <th className="px-5 py-3.5">Concern / Pamagat</th>
                      <th className="px-5 py-3.5">Barangay</th>
                      <th className="px-5 py-3.5">Petsa</th>
                      <th className="px-5 py-3.5">Kasalukuyang Status</th>
                      <th className="px-5 py-3.5">Opisyal na Aksyon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredReports.map((report) => (
                      <tr key={report.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-white text-sm font-heading">
                            {report.title}
                          </div>
                          <div className="text-slate-400 text-xs line-clamp-1 mt-0.5">
                            {report.description}
                          </div>
                          {report.officialNotes && (
                            <div className="mt-1 text-[11px] text-blue-300 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3 text-blue-400 shrink-0" />
                              <span>Note: {report.officialNotes}</span>
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                            <span>Brgy. {report.barangay}</span>
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-xs">
                          {report.date}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <select
                            value={report.status}
                            onChange={(e) =>
                              handleStatusChange(report.id, e.target.value as ReportStatus)
                            }
                            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none transition-all ${
                              report.status === "resolved"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : report.status === "in_progress"
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                : report.status === "urgent"
                                ? "bg-red-500/10 text-red-400 border-red-500/30"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            }`}
                          >
                            <option value="pending" className="bg-[#0A1931] text-amber-400">
                              Pending Review
                            </option>
                            <option value="in_progress" className="bg-[#0A1931] text-blue-400">
                              In Progress
                            </option>
                            <option value="resolved" className="bg-[#0A1931] text-emerald-400">
                              Resolved
                            </option>
                            <option value="urgent" className="bg-[#0A1931] text-red-400">
                              Urgent / Hazard
                            </option>
                          </select>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReport(report);
                              setNoteInput(report.officialNotes || "");
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-blue-600/20 hover:text-blue-300 border border-white/10 hover:border-blue-500/30 text-xs font-medium text-slate-200 transition-all"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{report.officialNotes ? "I-edit ang Tala" : "Maglagay ng Tala"}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* User Overview KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Kabuuang Rehistradong Gumagamit</span>
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold font-heading text-white">{users.length}</div>
                <p className="text-[11px] text-slate-500 mt-1">Mamamayan at kawani ng pamahalaan</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Mamamayan (Google Verified)</span>
                  <UserCheck className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-2xl font-bold font-heading text-sky-400">
                  {users.filter((u) => u.role === "resident").length}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Mga taga-Paete na nag-uulat</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider">Awtorisadong Opisyal</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-heading text-emerald-400">
                  {users.filter((u) => u.role === "official").length}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">May access sa pagbabago ng status</p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Maghanap ng gumagamit ayon sa pangalan, email, o opisina..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all" className="bg-[#0A1931]">Lahat ng Uri ng User</option>
                <option value="resident" className="bg-[#0A1931]">Mamamayan (Resident)</option>
                <option value="official" className="bg-[#0A1931]">Opisyal ng Bayan (Official)</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="rounded-2xl border border-white/10 bg-[#0A1931] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                    <tr>
                      <th className="px-5 py-3.5">Pangalan / User</th>
                      <th className="px-5 py-3.5">Role</th>
                      <th className="px-5 py-3.5">Barangay / Department</th>
                      <th className="px-5 py-3.5">Auth Method</th>
                      <th className="px-5 py-3.5">Mga Naitalang Ulat</th>
                      <th className="px-5 py-3.5">Petsa Narehistro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-white font-heading">{user.name}</div>
                          <div className="text-slate-400 text-xs flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" />
                            <span>{user.email}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap">
                          {user.role === "official" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              <ShieldCheck className="w-3 h-3" />
                              Opisyal ng Bayan
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <UserCheck className="w-3 h-3" />
                              Mamamayan
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-slate-300">
                            {user.role === "official" ? (
                              <Building2 className="w-3.5 h-3.5 text-blue-400" />
                            ) : (
                              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                            <span>{user.barangayOrOffice}</span>
                          </div>
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-300 text-xs">
                          {user.authProvider === "google" ? (
                            <span className="text-sky-300 font-medium">Google Sign-In</span>
                          ) : (
                            <span className="text-amber-300 font-medium">Municipal ID</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-white">
                          {user.role === "resident" ? user.reportsCount : "N/A"}
                        </td>

                        <td className="px-5 py-3.5 whitespace-nowrap text-slate-400 text-xs">
                          {user.registeredDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT TRAIL & LOGS */}
        {activeTab === "audit" && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-blue-200">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>
                  <strong>Immutable Audit Trail:</strong> Ang bawat disposisyon, pagbabago ng estado, o tala ng opisyal ay may awtomatikong tracking para sa transparency.
                </span>
              </div>
              <span className="text-slate-400">Total Recorded Actions: {auditLogs.length}</span>
            </div>

            {/* Audit Logs Table */}
            <div className="rounded-2xl border border-white/10 bg-[#0A1931] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                    <tr>
                      <th className="px-5 py-3.5">Timestamp</th>
                      <th className="px-5 py-3.5">Opisyal / Actor</th>
                      <th className="px-5 py-3.5">Aksyon</th>
                      <th className="px-5 py-3.5">Ulat / Lokasyon</th>
                      <th className="px-5 py-3.5">Mga Detalye ng Aksyon</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-xs font-mono">
                          {log.timestamp}
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="font-bold text-white font-heading">{log.actorName}</div>
                          <div className="text-[11px] text-blue-400">{log.actorRole}</div>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-white/5 text-slate-200 border border-white/10">
                            {log.action}
                          </span>
                        </td>

                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className="font-bold text-white">{log.reportId}</span>
                          <span className="text-slate-400 text-xs block">Brgy. {log.barangay}</span>
                        </td>

                        <td className="px-5 py-4 text-slate-300 text-xs leading-relaxed">
                          {log.details}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Official Resolution Note Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0A1931] p-6 shadow-2xl text-white">
            <h3 className="text-lg font-bold font-heading mb-1">
              Opisyal na Aksyon at Tala ng LGU
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Ulat #{selectedReport.id} — {selectedReport.title}
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Resolution / Update Note
                </label>
                <textarea
                  rows={4}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Halimbawa: Naipadala na sa Engineering team; target completion sa Biyernes..."
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/10"
                >
                  Kanselahin
                </button>
                <button
                  type="button"
                  onClick={handleSaveNote}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm"
                >
                  I-save ang Opisyal na Tala
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
