"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Menu,
  Landmark,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";

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
  const router = useRouter();
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
      if (!stored) {
        // Redirect to login if no active session
        router.replace("/admin/login");
        return;
      }
      try {
        const parsed = JSON.parse(stored);
        if (!parsed || !parsed.email) {
          router.replace("/admin/login");
          return;
        }
        setCurrentUser(parsed);
        setIsAuthChecking(false);
      } catch {
        router.replace("/admin/login");
      }
    }
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("civic_paete_admin_session");
      document.cookie = "civic_paete_role=; path=/; max-age=0";
    }
    router.replace("/admin/login");
  };
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
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

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#071126] text-white">
        <CivicPaeteLogo size="lg" variant="full" theme="dark" className="mb-4" />
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Shield className="w-4 h-4 text-blue-400 animate-pulse" />
          <span>Bini-beripika ang awtorisasyon ng opisyal...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071126] text-white">
      {/* Dynamic Governor / Admin Sidebar */}
      <AdminSidebar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        reportsCount={reports.length}
        usersCount={users.length}
        auditCount={auditLogs.length}
        urgentCount={urgentReports}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Content Area Offset for Sidebar */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Header Bar for Desktop & Mobile */}
        <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-[#0A1931]/95 backdrop-blur-md px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Buksan ang menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
                {currentUser?.role === "governor" ? "Provincial Command" : "Municipal Console"}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <h2 className="text-sm sm:text-base font-bold text-white capitalize">
                {activeTab === "overview" && "Buod at Estadistika"}
                {activeTab === "provincial" && "Panlalawigang Pagmamasid (Laguna)"}
                {activeTab === "reports" && "Pamamahala ng mga Ulat"}
                {activeTab === "users" && "Direktoryo ng Opisyal at Mamamayan"}
                {activeTab === "audit" && "Audit Trail & Talaan ng Pamahalaan"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Chip */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                currentUser?.role === "governor"
                  ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                  : "bg-blue-500/15 text-blue-300 border-blue-500/30"
              }`}
            >
              {currentUser?.role === "governor" ? (
                <>
                  <Landmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hon. Provincial Governor</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-blue-400" />
                  <span>Municipal Administrator</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden md:inline text-slate-300">Firebase Active</span>
            </div>
          </div>
        </header>

        {/* Main Console Content */}
        <main className="flex-1 max-w-7xl px-4 sm:px-6 lg:px-8 py-6 w-full space-y-7">
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Overview Title Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0A1931] via-[#112347] to-[#0A1931] border border-white/10 shadow-lg">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {currentUser?.role === "governor"
                        ? "Provincial High Command Overview"
                        : "Municipal Operations Overview"}
                    </span>
                  </div>
                  <h1 className="text-2xl font-black font-heading text-white">
                    {currentUser?.role === "governor"
                      ? "Laguna Provincial Capitol Oversight"
                      : "Pamahalaang Bayan ng Paete, Laguna"}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Centralized command console para sa pagsubaybay ng imprastraktura, kaligtasan, at serbisyo publiko.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("reports")}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                  >
                    Tingnan ang Lahat ng Ulat ({reports.length})
                  </button>
                </div>
              </div>

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
                    <span className="text-xs font-semibold uppercase tracking-wider">Nangangailangan</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-amber-400">{pendingReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Bago at for review</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Isinasagawa</span>
                    <AlertTriangle className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-sky-400">{inProgressReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">May nakatalagang opisina</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Nalutas Na</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-emerald-400">{resolvedReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Matagumpay na natapos</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Kritikal / Hazard</span>
                    <Shield className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-red-400">{urgentReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Nangangailangan ng agarang pansin</p>
                </div>
              </div>

              {/* Quick Urgent Concerns & Rule Engine Alert */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-[#0A1931] border border-red-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Mga Urgent Concerns ({urgentReports})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStatusFilter("urgent");
                        setActiveTab("reports");
                      }}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
                    >
                      Tingnan Lahat
                    </button>
                  </div>

                  <div className="space-y-2">
                    {reports
                      .filter((r) => r.status === "urgent")
                      .map((item) => (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                        >
                          <div className="min-w-0 pr-3">
                            <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                              <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                              <span>Brgy. {item.barangay}</span>
                              <span>•</span>
                              <span>{item.date}</span>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReport(item);
                              setNoteInput(item.officialNotes || "");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-medium shrink-0 cursor-pointer"
                          >
                            Disposisyon
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Rule Engine & Municipal Health Panel */}
                <div className="p-5 rounded-2xl bg-[#0A1931] border border-blue-500/20 space-y-4">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                    <Sparkles className="w-4 h-4" />
                    <span>Civic AI Rule Engine & Cluster Insights</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-white block mb-1">
                      Streetlight Infrastructure Alert:
                    </span>
                    May na-detect na 3 magkakaugnay na concern sa kahabaan ng Quesada Street sa loob ng 7 araw. Inirerekomenda ang pag-dispatch ng Municipal Engineering electrical bucket truck.
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed">
                    <span className="font-semibold text-white block mb-1">
                      Flood Mitigation & Drainage:
                    </span>
                    Matagumpay na natapos ang clearing operation sa Ilaya del Norte. Inirerekomenda ang regular na monthly desilting schedule bago ang tag-ulan.
                  </div>
                </div>
              </div>

              {/* Transparency & Audit Sync Banner */}
              <div className="p-6 rounded-2xl bg-[#0A1931] border border-white/10 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/25">
                      <BarChart3 className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-white">Public Transparency & Audit Synchronization</h3>
                      <p className="text-xs text-slate-400">
                        Live monitoring ng mga proyektong pang-bayan, direktoryo ng opisyal, at open datasets
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    PUBLIC TRANSPARENCY SYNC ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link
                    href="/transparency/projects"
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-amber-400">🚧 Proyekto at Badyet</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">Public Works History</p>
                    <p className="text-[11px] text-slate-400 mt-1">Audit ng 6 na imprastraktura, pondo, at kontraktor.</p>
                  </Link>

                  <Link
                    href="/transparency/officials"
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-blue-400">🏛️ Mga Opisyal ng Bayan</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">Accountability Directory</p>
                    <p className="text-[11px] text-slate-400 mt-1">Metriko ng Mayor, SB, Kapitan, at Gobernador.</p>
                  </Link>

                  <Link
                    href="/transparency/reports"
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/40 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-400">📊 Open Data Hub</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">Bukas na Datos & CSV/JSON</p>
                    <p className="text-[11px] text-slate-400 mt-1">Downloadable open datasets at buwanang trends.</p>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROVINCIAL OVERSIGHT (GOVERNOR ONLY) */}
          {activeTab === "provincial" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0A1931] to-amber-950/30 border border-amber-500/30 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Panlalawigang Tanggapan ng Gobernador — Lalawigan ng Laguna</span>
                </div>
                <h1 className="text-2xl font-black font-heading text-white">
                  Provincial Oversight & Inter-LGU Coordination Console
                </h1>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Eksklusibong panel para sa Tanggapan ng Gobernador upang mabilis na ma-monitor ang mga kritikal na ulat sa Bayan ng Paete, mag-dispatch ng suportang panlalawigan, at makipag-ugnayan sa PDRRMO at Provincial Engineering Office.
                </p>
              </div>

              {/* Provincial Metric Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#0A1931] border border-amber-500/20">
                  <div className="text-xs font-semibold text-amber-400 uppercase">Kritikal sa Paete</div>
                  <div className="text-3xl font-black text-white mt-1">{urgentReports}</div>
                  <p className="text-[11px] text-slate-400 mt-1">Nangangailangan ng suportang panlalawigan</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Kabuuang Ulat ng Bayan</div>
                  <div className="text-3xl font-black text-white mt-1">{totalReports}</div>
                  <p className="text-[11px] text-slate-400 mt-1">Mula sa 9 na barangay ng Paete</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-emerald-500/20">
                  <div className="text-xs font-semibold text-emerald-400 uppercase">LGU Resolution Rate</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1">
                    {totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0}%
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{resolvedReports} na resolbang concern</p>
                </div>
              </div>

              {/* Urgent Reports table for Provincial Intervention */}
              <div className="p-5 rounded-2xl bg-[#0A1931] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Mga Ulat na Nangangailangan ng Provincial Dispatch o Escalation</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {reports.filter((r) => r.status === "urgent" || r.status === "pending").length} aktibo
                  </span>
                </div>

                <div className="divide-y divide-white/10">
                  {reports
                    .filter((r) => r.status === "urgent" || r.status === "pending")
                    .map((rep) => (
                      <div key={rep.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                rep.status === "urgent"
                                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              }`}
                            >
                              {rep.status}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">Brgy. {rep.barangay}</span>
                          </div>
                          <h4 className="text-sm font-semibold text-white">{rep.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{rep.description}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReport(rep);
                              setNoteInput(
                                rep.officialNotes ||
                                  "Mula sa Tanggapan ng Gobernador: I-prioritize ang aksyon at ipagbigay-alam sa Provincial Engineering."
                              );
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer"
                          >
                            Maglagay ng Provincial Directive
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

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
    </div>
  );
}
