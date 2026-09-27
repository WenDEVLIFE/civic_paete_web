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
  MapPin,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Users,
  Building2,
  Mail,
  ShieldCheck,
  UserCheck,
  Menu,
  Landmark,
  BadgeCheck,
  Award,
  XCircle,
  Check,
  HardHat,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { VerificationBadge, VerificationStatus } from "@/components/profile/VerificationBadge";

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
  verificationStatus: VerificationStatus;
}

interface VerificationRequest {
  id: string;
  userId: string;
  applicantName: string;
  email: string;
  barangay: string;
  address: string;
  method: "certificate" | "gov_id";
  documentType: string;
  documentNumber: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
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
    title: "Non-functional Streetlights along Quesada Street",
    description: "A dark stretch of road at night creating hazardous transit conditions for students and commuters returning home.",
    category: "lighting",
    barangay: "Bagumbayan",
    status: "in_progress",
    date: "September 24, 2026",
    upvotes: 18,
    assignedOffice: "Municipal Engineering Office",
    officialNotes: "Inspected by electrical maintenance team; replacement LED bulb fixture ordered.",
  },
  {
    id: "rep-2",
    title: "Obstructed Drainage Canal Causing Stormwater Overflow",
    description: "Culvert requires immediate clearing before seasonal monsoon downpours to prevent backflow and flash flooding.",
    category: "drainage",
    barangay: "Ibaba del Sur",
    status: "pending",
    date: "September 25, 2026",
    upvotes: 12,
    assignedOffice: "MENRO / Barangay Maintenance",
  },
  {
    id: "rep-3",
    title: "Remediated Road Pothole near Public Market Junction",
    description: "Asphalt cold-patch applied by municipal engineering following resident reporting last week.",
    category: "road",
    barangay: "Maytoong",
    status: "resolved",
    date: "September 22, 2026",
    upvotes: 34,
    assignedOffice: "Municipal Engineering Office",
    officialNotes: "Completed cold-patch asphalt remediation on Sept 23, 2026.",
  },
  {
    id: "rep-4",
    title: "Solid Waste & Tree Branch Debris along Road Shoulder",
    description: "Discarded timber cuttings and uncollected roadside yard debris require heavy collection truck.",
    category: "waste",
    barangay: "Quinale",
    status: "pending",
    date: "September 26, 2026",
    upvotes: 7,
    assignedOffice: "MENRO (Sanitation)",
  },
  {
    id: "rep-5",
    title: "Tilted Wooden Utility Pole Adjacent to Riverbank",
    description: "Requires urgent structural inspection by utility line teams due to severe soil softening following recent riverbank swelling.",
    category: "safety",
    barangay: "Bangkusay",
    status: "urgent",
    date: "September 26, 2026",
    upvotes: 41,
    assignedOffice: "MDRRMO / Meralco Liaison",
    officialNotes: "Forwarded to emergency coordination team for safety perimeter cordon.",
  },
  {
    id: "rep-6",
    title: "Cleaned Drainage Canal near Parish Church Grounds",
    description: "Plastic waste and accumulated silt fully extracted from the drainage canal.",
    category: "drainage",
    barangay: "Ilaya del Norte",
    status: "resolved",
    date: "September 21, 2026",
    upvotes: 29,
    assignedOffice: "Barangay Cleanup Team",
    officialNotes: "Completed cleanup drive on Sunday morning.",
  },
];

const INITIAL_USERS: CivicUser[] = [
  {
    id: "usr-admin",
    name: "Municipal Administrator",
    email: "admin@paete.gov.ph",
    role: "official",
    barangayOrOffice: "Office of the Municipal Mayor",
    reportsCount: 0,
    registeredDate: "Sept 27, 2026",
    authProvider: "municipal_credentials",
    verificationStatus: "municipal_officer",
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
    verificationStatus: "municipal_officer",
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
    verificationStatus: "unverified",
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
    verificationStatus: "unverified",
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
    verificationStatus: "municipal_officer",
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
    verificationStatus: "municipal_officer",
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
    verificationStatus: "unverified",
  },
];

const INITIAL_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: "vreq-101",
    userId: "usr-1",
    applicantName: "Juan Dela Cruz",
    email: "juan.delacruz@gmail.com",
    barangay: "Bagumbayan",
    address: "142 Quesada St., Purok 2",
    method: "certificate",
    documentType: "Barangay Clearance Certificate",
    documentNumber: "BC-2026-0891",
    submittedAt: "Sept 26, 2026 • 11:20 AM",
    status: "pending",
  },
  {
    id: "vreq-102",
    userId: "usr-2",
    applicantName: "Maria Santos-Reyes",
    email: "maria.reyes@gmail.com",
    barangay: "Maytoong",
    address: "88 J. Rizal St., Maytoong",
    method: "gov_id",
    documentType: "PhilSys National ID",
    documentNumber: "9182-3847-1920-4821",
    submittedAt: "Sept 25, 2026 • 02:15 PM",
    status: "pending",
  },
  {
    id: "vreq-103",
    userId: "usr-5",
    applicantName: "Roberto Fadul",
    email: "roberto.fadul@gmail.com",
    barangay: "Bangkusay",
    address: "Kanto ng Ilaya, Bangkusay",
    method: "gov_id",
    documentType: "COMELEC Voter's ID",
    documentNumber: "VOT-4016-PAETE-02",
    submittedAt: "Sept 24, 2026 • 04:40 PM",
    status: "pending",
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
    details: "Changed status: 'Pending' → 'In Progress'. Added official inspection note.",
  },
  {
    id: "aud-102",
    timestamp: "Sept 26, 2026 • 09:30 AM",
    actorName: "System Rule Engine",
    actorRole: "Automated Recommendation",
    action: "RULE_FLAGGED",
    reportId: "rep-1",
    barangay: "Bagumbayan",
    details: "Flagged as recurring streetlight cluster concern (3 reports within 7 days).",
  },
  {
    id: "aud-103",
    timestamp: "Sept 25, 2026 • 03:45 PM",
    actorName: "Arlene Cadawas",
    actorRole: "MENRO Paete",
    action: "OFFICE_DISPATCH",
    reportId: "rep-2",
    barangay: "Ibaba del Sur",
    details: "Dispatched to Barangay Drainage Maintenance crew for clearing operation.",
  },
  {
    id: "aud-104",
    timestamp: "Sept 23, 2026 • 04:10 PM",
    actorName: "Engr. Marco Adea",
    actorRole: "Municipal Engineering",
    action: "STATUS_RESOLVED",
    reportId: "rep-3",
    barangay: "Maytoong",
    details: "Changed status to 'Resolved'. Completed cold-patch remediation with clearance record.",
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
  const [users, setUsers] = useState<CivicUser[]>(INITIAL_USERS);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(
    INITIAL_VERIFICATION_REQUESTS
  );
  const [userSubTab, setUserSubTab] = useState<"directory" | "verification_queue">("directory");
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
  const pendingVerificationsCount = verificationRequests.filter((v) => v.status === "pending").length;

  const handleApproveVerification = (
    req: VerificationRequest,
    targetLevel: "barangay_verified" | "community_leader" = "barangay_verified"
  ) => {
    // 1. Update verification requests state
    setVerificationRequests((prev) =>
      prev.map((item) => (item.id === req.id ? { ...item, status: "approved" } : item))
    );

    // 2. Promote the user's verificationStatus in the users state
    setUsers((prev) =>
      prev.map((u) =>
        u.id === req.userId || u.email === req.email
          ? { ...u, verificationStatus: targetLevel }
          : u
      )
    );

    // 3. Log to Immutable Audit Trail
    const newLog: AuditLog = {
      id: generateLogId(),
      timestamp: "Just now",
      actorName: currentUser?.name || "Municipal Administrator",
      actorRole: currentUser?.office || "Municipal Official",
      action: "VERIFICATION_APPROVED",
      reportId: req.id,
      barangay: req.barangay,
      details: `Approved ${targetLevel === "barangay_verified" ? "Barangay Verified" : "Community Leader"} status for resident ${req.applicantName} (${req.barangay}). Verified document: ${req.documentType} #${req.documentNumber}.`,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleRejectVerification = (req: VerificationRequest) => {
    setVerificationRequests((prev) =>
      prev.map((item) => (item.id === req.id ? { ...item, status: "rejected" } : item))
    );

    const newLog: AuditLog = {
      id: generateLogId(),
      timestamp: "Just now",
      actorName: currentUser?.name || "Municipal Administrator",
      actorRole: currentUser?.office || "Municipal Official",
      action: "VERIFICATION_REJECTED",
      reportId: req.id,
      barangay: req.barangay,
      details: `Rejected residency verification request for ${req.applicantName} in Brgy. ${req.barangay}. Requirement document discrepancy noted.`,
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  const handleStatusChange = (id: string, newStatus: ReportStatus) => {
    const target = reports.find((r) => r.id === id);
    if (!target) return;

    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );

    const newLog: AuditLog = {
      id: generateLogId(),
      timestamp: "Just now",
      actorName: currentUser?.name || "LGU Administrator",
      actorRole: currentUser?.office || "Municipal Official",
      action: "STATUS_UPDATE",
      reportId: target.id,
      barangay: target.barangay,
      details: `Updated status from '${target.status}' to '${newStatus}'.`,
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

    const newLog: AuditLog = {
      id: generateLogId(),
      timestamp: "Just now",
      actorName: currentUser?.name || "LGU Administrator",
      actorRole: currentUser?.office || "Municipal Official",
      action: "NOTE_ATTACHED",
      reportId: selectedReport.id,
      barangay: selectedReport.barangay,
      details: `Attached official disposition: "${noteInput}"`,
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
          <span>Verifying official authorization session...</span>
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
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:inline">
                {currentUser?.role === "governor" ? "Provincial Command" : "Municipal Operations"}
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <h2 className="text-sm sm:text-base font-bold text-white capitalize font-heading">
                {activeTab === "overview" && "Overview & Executive Analytics"}
                {activeTab === "provincial" && "Laguna Provincial Oversight"}
                {activeTab === "reports" && "Community Reports Management"}
                {activeTab === "users" && "Officials & Citizen Directory"}
                {activeTab === "audit" && "Audit Trail & Municipal Logs"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Chip */}
            <div
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border font-heading ${
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
              <span className="hidden md:inline text-slate-300">Session Secure</span>
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
                        : "Municipal Operations Command"}
                    </span>
                  </div>
                  <h1 className="text-2xl font-black font-heading text-white">
                    {currentUser?.role === "governor"
                      ? "Laguna Provincial Capitol Oversight"
                      : "Municipality of Paete, Laguna"}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 font-sans">
                    Centralized municipal operations console for infrastructure triage, public safety monitoring, and civic service accountability.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("reports")}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer min-h-[44px]"
                  >
                    View All Reports ({reports.length})
                  </button>
                </div>
              </div>

              {/* Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Reports</span>
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-white">{totalReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">All logged submissions</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pending Review</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-amber-400">{pendingReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Awaiting verification</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
                    <AlertTriangle className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-sky-400">{inProgressReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Field team active</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-emerald-400">{resolvedReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Certified remediated</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Critical / Hazard</span>
                    <Shield className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-red-400">{urgentReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Urgent response needed</p>
                </div>
              </div>

              {/* Quick Urgent Concerns & Rule Engine Alert */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl bg-[#0A1931] border border-red-500/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm font-heading">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Urgent Community Hazards ({urgentReports})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStatusFilter("urgent");
                        setActiveTab("reports");
                      }}
                      className="text-xs text-red-400 hover:text-red-300 font-semibold underline cursor-pointer"
                    >
                      View All
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
                            <h4 className="text-xs font-bold text-white truncate font-heading">{item.title}</h4>
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
                            className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 text-xs font-medium shrink-0 cursor-pointer min-h-[36px]"
                          >
                            Disposition
                          </button>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Rule Engine & Municipal Health Panel */}
                <div className="p-5 rounded-2xl bg-[#0A1931] border border-blue-500/20 space-y-4">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-sm font-heading">
                    <Sparkles className="w-4 h-4" />
                    <span>Civic Analytical Engine & Cluster Insights</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="font-semibold text-white block mb-1 font-heading">
                      Streetlight Infrastructure Alert:
                    </span>
                    3 correlated electrical concerns detected along the Quesada Street corridor within 7 days. Immediate dispatch of Municipal Engineering electrical bucket truck recommended.
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-300 leading-relaxed font-sans">
                    <span className="font-semibold text-white block mb-1 font-heading">
                      Flood Mitigation & Drainage Clearance:
                    </span>
                    Stormwater clearing operation in Ilaya del Norte concluded successfully. Continuous monthly desilting recommended prior to forecasted monsoon swells.
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
                      <h3 className="text-sm font-bold text-white font-heading">Public Transparency & Audit Synchronization</h3>
                      <p className="text-xs text-slate-400 font-sans">
                        Live monitoring of municipal public works, governance directory, and open civic datasets
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
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all group min-h-[44px]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <HardHat className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-xs font-bold text-amber-400 font-heading">Public Works & Budget</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">Infrastructure Project History</p>
                    <p className="text-[11px] text-slate-400 mt-1">Audit of 6 municipal projects, contractors, and fund allocations.</p>
                  </Link>

                  <Link
                    href="/transparency/officials"
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/40 transition-all group min-h-[44px]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <Landmark className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-xs font-bold text-blue-400 font-heading">Municipal & Provincial Leaders</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">Accountability Directory</p>
                    <p className="text-[11px] text-slate-400 mt-1">Civic response metrics for Mayor, Councilors, Captains, and Governor.</p>
                  </Link>

                  <Link
                    href="/transparency/reports"
                    className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/40 transition-all group min-h-[44px]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-xs font-bold text-emerald-400 font-heading">Open Data Hub</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-xs text-slate-300 font-medium">Open Datasets & CSV/JSON Export</p>
                    <p className="text-[11px] text-slate-400 mt-1">Downloadable civic datasets and monthly resolution trends.</p>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROVINCIAL OVERSIGHT */}
          {activeTab === "provincial" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-[#0A1931] to-amber-950/30 border border-amber-500/30 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 font-heading">
                  <Landmark className="w-3.5 h-3.5" />
                  <span>Office of the Provincial Governor — Province of Laguna</span>
                </div>
                <h1 className="text-2xl font-black font-heading text-white">
                  Provincial Oversight & Inter-LGU Coordination Console
                </h1>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed font-sans">
                  Exclusive oversight console for the Office of the Provincial Governor to monitor critical civic concerns in Paete, dispatch provincial resources, and coordinate with PDRRMO and the Provincial Engineering Office.
                </p>
              </div>

              {/* Provincial Metric Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#0A1931] border border-amber-500/20">
                  <div className="text-xs font-semibold text-amber-400 uppercase">Critical in Paete</div>
                  <div className="text-3xl font-black text-white mt-1 font-heading">{urgentReports}</div>
                  <p className="text-[11px] text-slate-400 mt-1">Requiring provincial coordination</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="text-xs font-semibold text-slate-400 uppercase">Total Paete Reports</div>
                  <div className="text-3xl font-black text-white mt-1 font-heading">{totalReports}</div>
                  <p className="text-[11px] text-slate-400 mt-1">Logged across 9 Paete barangays</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-emerald-500/20">
                  <div className="text-xs font-semibold text-emerald-400 uppercase">LGU Resolution Rate</div>
                  <div className="text-3xl font-black text-emerald-400 mt-1 font-heading">
                    {totalReports > 0 ? Math.round((resolvedReports / totalReports) * 100) : 0}%
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{resolvedReports} resolved concerns</p>
                </div>
              </div>

              {/* Urgent Reports table for Provincial Intervention */}
              <div className="p-5 rounded-2xl bg-[#0A1931] border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Reports Requiring Provincial Dispatch or Escalation</span>
                  </h3>
                  <span className="text-xs text-slate-400">
                    {reports.filter((r) => r.status === "urgent" || r.status === "pending").length} active
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
                          <h4 className="text-sm font-semibold text-white font-heading">{rep.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5 font-sans">{rep.description}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReport(rep);
                              setNoteInput(
                                rep.officialNotes ||
                                  "Office of the Provincial Governor: Prioritize remediation and notify Provincial Engineering."
                              );
                            }}
                            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer min-h-[44px]"
                          >
                            Attach Provincial Directive
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: REPORTS MANAGEMENT */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Reports</span>
                    <FileText className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-white">{totalReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">All logged submissions</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pending Review</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-amber-400">{pendingReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Awaiting verification</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-blue-400">{inProgressReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Field team active</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black font-heading text-emerald-400">{resolvedReports}</div>
                  <p className="text-[11px] text-slate-500 mt-1">Remediated with evidence</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider">Critical / Hazard</span>
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
                    placeholder="Search by title, barangay, or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    <option value="all" className="bg-[#0A1931]">All Statuses</option>
                    <option value="pending" className="bg-[#0A1931]">Pending Review</option>
                    <option value="in_progress" className="bg-[#0A1931]">In Progress</option>
                    <option value="resolved" className="bg-[#0A1931]">Resolved</option>
                    <option value="urgent" className="bg-[#0A1931]">Critical Hazard</option>
                  </select>

                  <select
                    value={barangayFilter}
                    onChange={(e) => setBarangayFilter(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none min-h-[44px]"
                  >
                    <option value="all" className="bg-[#0A1931]">All Barangays (9)</option>
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
                        <th className="px-5 py-3.5">Concern / Title</th>
                        <th className="px-5 py-3.5">Barangay</th>
                        <th className="px-5 py-3.5">Date Logged</th>
                        <th className="px-5 py-3.5">Current Status</th>
                        <th className="px-5 py-3.5">Official Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-bold text-white text-sm font-heading">
                              {report.title}
                            </div>
                            <div className="text-slate-400 text-xs line-clamp-1 mt-0.5 font-sans">
                              {report.description}
                            </div>
                            {report.officialNotes && (
                              <div className="mt-1 text-[11px] text-blue-300 flex items-center gap-1 font-sans">
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

                          <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-xs font-mono">
                            {report.date}
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <select
                              value={report.status}
                              onChange={(e) =>
                                handleStatusChange(report.id, e.target.value as ReportStatus)
                              }
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold focus:outline-none transition-all min-h-[36px] ${
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
                                Critical Hazard
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
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-blue-600/20 hover:text-blue-300 border border-white/10 hover:border-blue-500/30 text-xs font-medium text-slate-200 transition-all min-h-[36px] cursor-pointer"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>{report.officialNotes ? "Edit Disposition" : "Add Disposition"}</span>
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

          {/* TAB: USERS MANAGEMENT & VERIFICATION QUEUE */}
          {activeTab === "users" && (
            <div className="space-y-6">
              {/* User Overview KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Registered</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold font-heading text-white">{users.length}</div>
                  <p className="text-[11px] text-slate-500 mt-1 font-sans">Citizens & staff</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider">Pending Verification</span>
                    <BadgeCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold font-heading text-amber-400">{pendingVerificationsCount}</div>
                  <p className="text-[11px] text-slate-500 mt-1 font-sans">Awaiting review</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider">Barangay Verified</span>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold font-heading text-emerald-400">
                    {users.filter((u) => u.verificationStatus === "barangay_verified" || u.verificationStatus === "community_leader").length}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-sans">Authenticated residents</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider">Authorized Officials</span>
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold font-heading text-blue-400">
                    {users.filter((u) => u.role === "official").length}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-sans">Administrative console access</p>
                </div>
              </div>

              {/* Sub-Tabs Switcher */}
              <div className="flex border-b border-white/10 bg-[#0A1931]/60 px-4 rounded-2xl border border-white/10 gap-3 text-xs font-semibold overflow-x-auto font-heading">
                <button
                  type="button"
                  onClick={() => setUserSubTab("directory")}
                  className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-2 ${
                    userSubTab === "directory"
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Account Directory ({users.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserSubTab("verification_queue")}
                  className={`py-3.5 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-2 ${
                    userSubTab === "verification_queue"
                      ? "border-amber-500 text-amber-400"
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>Barangay Verification Queue</span>
                  {pendingVerificationsCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {pendingVerificationsCount}
                    </span>
                  )}
                </button>
              </div>

              {/* SUB-VIEW 1: DIRECTORY */}
              {userSubTab === "directory" && (
                <div className="space-y-4">
                  {/* Filter Bar */}
                  <div className="p-4 rounded-2xl bg-[#0A1931] border border-white/10 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search accounts by name, email, or department..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                      />
                    </div>

                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white focus:border-blue-500 focus:outline-none min-h-[44px]"
                    >
                      <option value="all" className="bg-[#0A1931]">All Account Roles</option>
                      <option value="resident" className="bg-[#0A1931]">Verified Resident</option>
                      <option value="official" className="bg-[#0A1931]">Government Official</option>
                    </select>
                  </div>

                  {/* Users Table */}
                  <div className="rounded-2xl border border-white/10 bg-[#0A1931] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                          <tr>
                            <th className="px-5 py-3.5">Name / Account</th>
                            <th className="px-5 py-3.5">Verification Badge</th>
                            <th className="px-5 py-3.5">Barangay / Department</th>
                            <th className="px-5 py-3.5">Auth Provider</th>
                            <th className="px-5 py-3.5">Reports Logged</th>
                            <th className="px-5 py-3.5">Registered Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-5 py-3.5">
                                <div className="font-bold text-white font-heading">{user.name}</div>
                                <div className="text-slate-400 text-xs flex items-center gap-1 font-mono">
                                  <Mail className="w-3 h-3 text-slate-500" />
                                  <span>{user.email}</span>
                                </div>
                              </td>

                              <td className="px-5 py-3.5 whitespace-nowrap">
                                <VerificationBadge status={user.verificationStatus} size="sm" />
                              </td>

                              <td className="px-5 py-3.5 whitespace-nowrap">
                                <div className="flex items-center gap-1 text-slate-300 font-sans">
                                  {user.role === "official" ? (
                                    <Building2 className="w-3.5 h-3.5 text-blue-400" />
                                  ) : (
                                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                                  )}
                                  <span>{user.barangayOrOffice}</span>
                                </div>
                              </td>

                              <td className="px-5 py-3.5 whitespace-nowrap text-slate-300 text-xs font-sans">
                                {user.authProvider === "google" ? (
                                  <span className="text-sky-300 font-medium">Google Auth</span>
                                ) : (
                                  <span className="text-amber-300 font-medium">Municipal ID</span>
                                )}
                              </td>

                              <td className="px-5 py-3.5 whitespace-nowrap font-semibold text-white font-mono">
                                {user.role === "resident" ? user.reportsCount : "N/A"}
                              </td>

                              <td className="px-5 py-3.5 whitespace-nowrap text-slate-400 text-xs font-mono">
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

              {/* SUB-VIEW 2: VERIFICATION APPROVAL REVIEW QUEUE */}
              {userSubTab === "verification_queue" && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
                    <div className="flex items-center gap-2 text-amber-200">
                      <BadgeCheck className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        <strong>Barangay Verification Review Queue:</strong> Inspect submitted Barangay Clearances and Valid IDs to authenticate residents of Paete. Approved accounts gain official trust badges and priority report triage.
                      </span>
                    </div>
                    <span className="font-mono text-amber-300 font-bold shrink-0">
                      {pendingVerificationsCount} Pending Application{pendingVerificationsCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0A1931] overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                          <tr>
                            <th className="px-5 py-3.5">Applicant / Email</th>
                            <th className="px-5 py-3.5">Paete Residence</th>
                            <th className="px-5 py-3.5">Document Proof</th>
                            <th className="px-5 py-3.5">Submitted At</th>
                            <th className="px-5 py-3.5">Status</th>
                            <th className="px-5 py-3.5">Verification Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {verificationRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-5 py-4">
                                <div className="font-bold text-white font-heading">{req.applicantName}</div>
                                <div className="text-slate-400 text-xs font-mono">{req.email}</div>
                              </td>

                              <td className="px-5 py-4">
                                <div className="flex items-center gap-1.5 font-semibold text-white">
                                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                  <span>Brgy. {req.barangay}</span>
                                </div>
                                <span className="text-[11px] text-slate-400 block truncate max-w-[200px]">
                                  {req.address}
                                </span>
                              </td>

                              <td className="px-5 py-4">
                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-200">
                                  {req.documentType}
                                </span>
                                <span className="text-[11px] font-mono text-blue-300 block mt-1">
                                  #{req.documentNumber}
                                </span>
                              </td>

                              <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-xs font-mono">
                                {req.submittedAt}
                              </td>

                              <td className="px-5 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                    req.status === "approved"
                                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
                                      : req.status === "rejected"
                                      ? "bg-red-500/15 text-red-400 border-red-500/25"
                                      : "bg-amber-500/15 text-amber-300 border-amber-500/25"
                                  }`}
                                >
                                  {req.status}
                                </span>
                              </td>

                              <td className="px-5 py-4 whitespace-nowrap">
                                {req.status === "pending" ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => handleApproveVerification(req, "barangay_verified")}
                                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all cursor-pointer min-h-[36px]"
                                      title="Approve as Barangay Verified"
                                    >
                                      <Check className="w-3.5 h-3.5" />
                                      <span>Verify Resident</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleApproveVerification(req, "community_leader")}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-semibold transition-all cursor-pointer min-h-[36px]"
                                      title="Designate as Community Leader"
                                    >
                                      <Award className="w-3.5 h-3.5" />
                                      <span>Make Leader</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleRejectVerification(req)}
                                      className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                                      title="Reject / Discrepancy"
                                    >
                                      <XCircle className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-500 italic">
                                    Action completed & logged
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: AUDIT TRAIL & LOGS */}
          {activeTab === "audit" && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans">
                <div className="flex items-center gap-2 text-blue-200">
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>
                    <strong>Immutable Civic Audit Trail:</strong> Every status update, official note, and administrative action is logged to guarantee municipal accountability and transparency.
                  </span>
                </div>
                <span className="text-slate-400 font-mono">Total Recorded Actions: {auditLogs.length}</span>
              </div>

              {/* Audit Logs Table */}
              <div className="rounded-2xl border border-white/10 bg-[#0A1931] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="border-b border-white/10 bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                      <tr>
                        <th className="px-5 py-3.5">Timestamp</th>
                        <th className="px-5 py-3.5">Actor / Official</th>
                        <th className="px-5 py-3.5">Action</th>
                        <th className="px-5 py-3.5">Report / Barangay</th>
                        <th className="px-5 py-3.5">Action Details</th>
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
                            <span className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-white/5 text-slate-200 border border-white/10 font-mono">
                              {log.action}
                            </span>
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="font-bold text-white font-mono">{log.reportId}</span>
                            <span className="text-slate-400 text-xs block font-sans">Brgy. {log.barangay}</span>
                          </td>

                          <td className="px-5 py-4 text-slate-300 text-xs leading-relaxed font-sans">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0A1931] p-6 shadow-2xl text-white">
              <h3 className="text-lg font-bold font-heading mb-1">
                Official LGU Disposition & Action Note
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-sans">
                Report #{selectedReport.id} — {selectedReport.title}
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                    Resolution / Disposition Note
                  </label>
                  <textarea
                    rows={4}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="e.g., Dispatched municipal engineering repair crew; completion expected by Friday..."
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none font-sans"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedReport(null)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-slate-300 hover:bg-white/10 cursor-pointer min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm cursor-pointer min-h-[44px] font-heading"
                  >
                    Save Official Note
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
