"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  UserCheck,
  ThumbsUp,
  Share2,
  ShieldCheck,
  FileCheck,
  Send,
  MessageSquare,
  Shield,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

interface TimelineEvent {
  title: string;
  departmentOrActor: string;
  timestamp: string;
  notes: string;
  status: "completed" | "current" | "upcoming";
}

interface ReportComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: "resident" | "official" | "governor";
  timestamp: string;
  content: string;
  isOfficial?: boolean;
}

interface DetailedReport {
  id: string;
  title: string;
  description: string;
  category: "lighting" | "drainage" | "road" | "waste" | "safety";
  barangay: string;
  locationDetails: string;
  submittedBy: string;
  status: "pending" | "in_progress" | "resolved" | "urgent";
  date: string;
  upvotes: number;
  assignedDepartment: string;
  imageUrl?: string;
  timeline: TimelineEvent[];
  comments?: ReportComment[];
}

const MOCK_REPORTS_DATABASE: Record<string, DetailedReport> = {
  "rep-1": {
    id: "rep-1",
    title: "Non-functional Streetlights along Quesada Street",
    description:
      "A dark stretch of road at night creating hazardous transit conditions for students and commuters returning home. Three adjacent lamp posts have been unlit since last week.",
    category: "lighting",
    barangay: "Bagumbayan",
    locationDetails: "Fronting old barangay hall near the junction of Quesada St.",
    submittedBy: "Juan Dela Cruz (Verified Resident)",
    status: "in_progress",
    date: "September 24, 2026",
    upvotes: 19,
    assignedDepartment: "Municipal Engineering Office",
    timeline: [
      {
        title: "Officially Submitted by Resident",
        departmentOrActor: "Verified Citizen (Google Auth)",
        timestamp: "September 24, 2026 • 08:30 AM",
        notes: "Report securely logged into the Paete digital civic management system.",
        status: "completed",
      },
      {
        title: "Triage & Validation by Municipal Admin",
        departmentOrActor: "Municipal Command Center",
        timestamp: "September 24, 2026 • 11:15 AM",
        notes: "Location validated, assigned high priority dispatch, and routed to Engineering.",
        status: "completed",
      },
      {
        title: "Active Field Operations & Inspection",
        departmentOrActor: "Municipal Engineering Office",
        timestamp: "September 25, 2026 • 02:40 PM",
        notes: "Inspected by electrical maintenance team; replacement 100W LED lamp fixture scheduled for installation tomorrow morning.",
        status: "current",
      },
      {
        title: "Resolution Clearance & Photographic Audit",
        departmentOrActor: "Municipal Engineering & LGU Inspector",
        timestamp: "Target: September 27, 2026",
        notes: "Clearance photo and verification report will be uploaded before closing the public ticket.",
        status: "upcoming",
      },
    ],
    comments: [
      {
        id: "c-1",
        authorName: "Maria Santos",
        authorRole: "resident",
        timestamp: "2 days ago",
        content: "Corroborated. This corner is completely dark past 8:00 PM when retail staff and students walk home.",
      },
      {
        id: "c-2",
        authorName: "Engr. Marco Adea",
        authorRole: "official",
        timestamp: "Yesterday",
        content: "Logged and scheduled. The municipal electrical bucket truck is queued for this sector.",
        isOfficial: true,
      },
    ],
  },
  "rep-2": {
    id: "rep-2",
    title: "Obstructed Drainage Canal Causing Stormwater Overflow",
    description:
      "Culvert requires immediate clearing before seasonal monsoon downpours to prevent backflow and flash flooding into adjacent residential properties.",
    category: "drainage",
    barangay: "Ibaba del Sur",
    locationDetails: "Behind multi-purpose hall, Ibaba del Sur",
    submittedBy: "Maria Santos-Reyes (Verified Resident)",
    status: "pending",
    date: "September 25, 2026",
    upvotes: 14,
    assignedDepartment: "MENRO / Barangay Maintenance",
    timeline: [
      {
        title: "Logged by Resident",
        departmentOrActor: "Resident Submission",
        timestamp: "September 25, 2026 • 09:10 AM",
        notes: "Queued for ocular inspection by MENRO Paete field team.",
        status: "completed",
      },
    ],
    comments: [],
  },
  "rep-3": {
    id: "rep-3",
    title: "Remediated Road Pothole near Public Market Junction",
    description:
      "Asphalt cold-patch applied by municipal engineering following resident reporting last week.",
    category: "road",
    barangay: "Maytoong",
    locationDetails: "Corner of J. Rizal and Public Market Road",
    submittedBy: "Roberto Fadul (Verified Resident)",
    status: "resolved",
    date: "September 22, 2026",
    upvotes: 35,
    assignedDepartment: "Municipal Engineering Office",
    timeline: [
      {
        title: "Officially Remediated & Resolved",
        departmentOrActor: "LGU Admin & Barangay Maytoong",
        timestamp: "September 23, 2026 • 04:00 PM",
        notes: "Remediation verified and certified safe for local vehicular and pedestrian transit.",
        status: "completed",
      },
    ],
    comments: [],
  },
};

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const reportId = unwrappedParams.id;

  const initialReport = MOCK_REPORTS_DATABASE[reportId] || {
    ...MOCK_REPORTS_DATABASE["rep-1"],
    id: reportId,
    title: `Report #${reportId} in Municipality of Paete`,
  };

  const [report, setReport] = useState<DetailedReport>(initialReport);
  const [upvotes, setUpvotes] = useState(initialReport.upvotes);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Auth & Session
  const [residentUser, setResidentUser] = useState<User | null>(null);
  const [officerSession, setOfficerSession] = useState<{
    name: string;
    email: string;
    role: "admin" | "governor";
    office: string;
  } | null>(null);

  // Comments
  const [comments, setComments] = useState<ReportComment[]>(initialReport.comments || []);
  const [commentInput, setCommentInput] = useState("");

  // Officer Controls
  const [showOfficerControls, setShowOfficerControls] = useState(false);
  const [officerNoteInput, setOfficerNoteInput] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setResidentUser(u));

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("civic_paete_admin_session");
      if (stored) {
        try {
          setOfficerSession(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
    return () => unsub();
  }, []);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    } else {
      setUpvotes((prev) => Math.max(0, prev - 1));
      setHasUpvoted(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    let authorName = "Paete Resident";
    let authorRole: "resident" | "official" | "governor" = "resident";
    let isOfficial = false;

    if (officerSession) {
      authorName = officerSession.name;
      authorRole = officerSession.role === "governor" ? "governor" : "official";
      isOfficial = true;
    } else if (residentUser) {
      authorName = residentUser.displayName || residentUser.email?.split("@")[0] || "Verified Resident";
    }

    const newComm: ReportComment = {
      id: `comm-${Date.now()}`,
      authorName,
      authorAvatar: residentUser?.photoURL || undefined,
      authorRole,
      timestamp: "Just now",
      content: commentInput.trim(),
      isOfficial,
    };

    setComments((prev) => [...prev, newComm]);
    setCommentInput("");
  };

  const handleUpdateStatus = (newStatus: DetailedReport["status"]) => {
    setIsUpdatingStatus(true);

    const actor = officerSession?.name || "Municipal Official";
    const officeName =
      officerSession?.role === "governor"
        ? "Office of the Provincial Governor - Laguna"
        : officerSession?.office || "Municipality of Paete";

    const note = officerNoteInput.trim() || `Status updated to '${newStatus}'.`;

    const newTimelineItem: TimelineEvent = {
      title: `Official Action: ${newStatus.toUpperCase()}`,
      departmentOrActor: `${actor} (${officeName})`,
      timestamp: "Just now",
      notes: note,
      status: "completed",
    };

    setReport((prev) => ({
      ...prev,
      status: newStatus,
      timeline: [newTimelineItem, ...prev.timeline],
    }));

    setTimeout(() => {
      setIsUpdatingStatus(false);
      setShowOfficerControls(false);
    }, 400);
  };

  const statusDisplay: Record<
    DetailedReport["status"],
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    pending: {
      label: "Pending Verification",
      bg: "bg-amber-500/15",
      text: "text-amber-300",
      border: "border-amber-500/30",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    in_progress: {
      label: "In Progress",
      bg: "bg-blue-500/15",
      text: "text-blue-300",
      border: "border-blue-500/30",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    resolved: {
      label: "Resolved",
      bg: "bg-emerald-500/15",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
    urgent: {
      label: "Critical Hazard",
      bg: "bg-red-500/15",
      text: "text-red-300",
      border: "border-red-500/30",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
  };

  const status = statusDisplay[report.status];
  const isOfficer = Boolean(officerSession);

  return (
    <div className="min-h-screen flex flex-col bg-[#071126] text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/#community-reports"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 transition-all cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Community Reports</span>
          </Link>
        </div>

        {/* Report Main Header Card */}
        <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0A1931]/95 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                #{report.id}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${status.bg} ${status.text} ${status.border}`}
              >
                {status.icon}
                <span>{status.label}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUpvote}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer min-h-[44px] ${
                  hasUpvoted
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30"
                    : "bg-white/5 text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 border-white/10"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Upvote ({upvotes})</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all text-xs cursor-pointer min-h-[44px]"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold font-heading text-white mb-3">
            {report.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6 font-sans">
            {report.description}
          </p>

          {/* Quick Meta Data Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs border-t border-white/10 pt-4">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 block mb-1">Paete Location</span>
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span>Brgy. {report.barangay}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block truncate">
                {report.locationDetails}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 block mb-1">Assigned Municipal Office</span>
              <div className="flex items-center gap-1.5 font-semibold text-sky-300">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{report.assignedDepartment}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Municipality of Paete, Laguna
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 block mb-1">Reporter & Date Logged</span>
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{report.submittedBy}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{report.date}</span>
              </div>
            </div>
          </div>
        </section>

        {/* OFFICER ACTION TOOLBAR */}
        {isOfficer && (
          <section className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/50 via-[#0A1931] to-blue-950/30 border border-blue-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white font-heading">
                  Officer Action Console: {officerSession?.name}
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {officerSession?.role}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowOfficerControls(!showOfficerControls)}
                className="inline-flex items-center gap-1 text-xs text-blue-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-all cursor-pointer min-h-[36px]"
              >
                <span>{showOfficerControls ? "Hide Controls" : "Update Report Status"}</span>
                {showOfficerControls ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {showOfficerControls && (
              <div className="pt-3 border-t border-white/10 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("pending")}
                    className="p-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/30 text-amber-300 transition-all cursor-pointer min-h-[44px]"
                  >
                    ⏳ Pending
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("in_progress")}
                    className="p-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/30 text-blue-300 transition-all cursor-pointer min-h-[44px]"
                  >
                    ⚙️ In Progress
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("resolved")}
                    className="p-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/30 text-emerald-300 transition-all cursor-pointer min-h-[44px]"
                  >
                    ✅ Resolved
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUpdateStatus("urgent")}
                    className="p-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 text-red-300 transition-all cursor-pointer min-h-[44px]"
                  >
                    🚨 Critical Hazard
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase">
                    Official Resolution Note / Public Disposition:
                  </label>
                  <input
                    type="text"
                    value={officerNoteInput}
                    onChange={(e) => setOfficerNoteInput(e.target.value)}
                    placeholder="Enter dispatch details, team schedule, or remediation summary..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:border-blue-500 focus:outline-none min-h-[44px]"
                  />
                </div>

                {isUpdatingStatus && (
                  <div className="text-xs text-blue-400 animate-pulse font-medium">
                    Recording official update to government database...
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Civic Resolution Timeline Tracker */}
        <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0A1931]/95 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Section 5.1 — Status Monitoring & Transparency</span>
              </div>
              <h2 className="text-lg sm:text-2xl font-bold font-heading text-white">
                Official Resolution Timeline & Action History
              </h2>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified LGU Record</span>
            </div>
          </div>

          {/* Stepper / Timeline items */}
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
            {report.timeline.map((step, idx) => {
              const isCompleted = step.status === "completed";
              const isCurrent = step.status === "current";

              return (
                <div key={idx} className="relative group">
                  <div
                    className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-sm shadow-emerald-500/20"
                        : isCurrent
                        ? "bg-blue-500/20 border-blue-500 text-blue-400 animate-pulse shadow-md shadow-blue-500/30"
                        : "bg-white/5 border-white/20 text-slate-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>

                  <div
                    className={`p-4 sm:p-5 rounded-xl border transition-all ${
                      isCurrent
                        ? "bg-blue-950/30 border-blue-500/40"
                        : "bg-white/[0.02] border-white/5"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                      <h3 className="text-sm sm:text-base font-bold text-white font-heading">
                        {step.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {step.timestamp}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-blue-300 mb-2 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <span>{step.departmentOrActor}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                      {step.notes}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* COMMUNITY SOCIAL DISCUSSION & COMMENTS SECTION */}
        <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0A1931]/95 shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg sm:text-xl font-bold font-heading text-white">
                Community Discussion & Official Notes ({comments.length})
              </h2>
            </div>
            <span className="text-xs text-slate-400 font-sans">Public Verification Thread</span>
          </div>

          {/* Comments Feed */}
          <div className="space-y-3">
            {comments.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-500 italic bg-white/[0.02] rounded-xl border border-white/5 font-sans">
                No comments logged for this report. Be the first to corroborate!
              </div>
            ) : (
              comments.map((comm) => (
                <div
                  key={comm.id}
                  className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                    comm.isOfficial
                      ? "bg-blue-950/40 border-blue-500/30 text-slate-200"
                      : "bg-white/5 border-white/10 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs sm:text-sm font-heading">
                        {comm.authorName}
                      </span>
                      {comm.isOfficial && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Government Official</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">{comm.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm font-sans">{comm.content}</p>
                </div>
              ))
            )}
          </div>

          {/* New Comment Submission Form */}
          <form onSubmit={handleAddComment} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder={
                officerSession
                  ? `Leave official reply as ${officerSession.name}...`
                  : residentUser
                  ? `Comment as ${residentUser.displayName || "Resident"}...`
                  : "Post public comment or corroborating photographic details..."
              }
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none transition-all min-h-[44px]"
            />
            <button
              type="submit"
              disabled={!commentInput.trim()}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer min-h-[44px]"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Submit</span>
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
