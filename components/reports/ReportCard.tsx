"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ThumbsUp,
  MessageSquare,
  Share2,
  Shield,
  ShieldCheck,
  Send,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Landmark,
  Check,
  UserCheck,
  Award,
} from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export type ReportStatus = "urgent" | "pending" | "in_progress" | "resolved";

export interface ReportComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorRole: "resident" | "official" | "governor";
  timestamp: string;
  content: string;
  isOfficial?: boolean;
}

export interface CommunityReport {
  id: string;
  title: string;
  description: string;
  category: "waste" | "lighting" | "road" | "drainage" | "safety";
  barangay: string;
  status: ReportStatus;
  date: string;
  upvotes: number;
  imageUrl?: string;
  authorName?: string;
  authorAvatar?: string;
  authorRole?: "resident" | "official" | "governor";
  officialNotes?: string;
  officialActorName?: string;
  officialActorRole?: string;
  comments?: ReportComment[];
  /** True when the submitter chose to post anonymously */
  isAnonymous?: boolean;
  /** Public-facing alias shown instead of the real name (e.g. "Protektadong Mamamayan #104") */
  anonymousAlias?: string;
}

interface ReportCardProps {
  report: CommunityReport;
  onUpvote?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: ReportStatus, note?: string) => void;
  onAddComment?: (reportId: string, comment: ReportComment) => void;
}

export function ReportCard({
  report,
  onUpvote,
  onStatusChange,
  onAddComment,
}: ReportCardProps) {
  // Current logged in Firebase resident user
  const [residentUser, setResidentUser] = useState<User | null>(null);

  // Current logged in Admin or Governor session from localStorage
  const [officerSession, setOfficerSession] = useState<{
    name: string;
    email: string;
    role: "admin" | "governor";
    office: string;
  } | null>(null);

  // Local card state
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(report.upvotes);
  const [currentStatus, setCurrentStatus] = useState<ReportStatus>(report.status);
  const [officialNote, setOfficialNote] = useState(report.officialNotes || "");
  const [officialActor, setOfficialActor] = useState(report.officialActorName || "");
  const [officialRoleTitle, setOfficialRoleTitle] = useState(report.officialActorRole || "");

  // Comments state
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<ReportComment[]>(report.comments || []);
  const [newCommentText, setNewCommentText] = useState("");

  // Officer Controls Panel toggle
  const [showOfficerPanel, setShowOfficerPanel] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    // Check Resident user
    const unsub = onAuthStateChanged(auth, (u) => {
      setResidentUser(u);
    });

    // Check Official user
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

  const handleUpvoteClick = () => {
    if (!isUpvoted) {
      setUpvotes((prev) => prev + 1);
      setIsUpvoted(true);
      onUpvote?.(report.id);
    } else {
      setUpvotes((prev) => Math.max(0, prev - 1));
      setIsUpvoted(false);
    }
  };

  const handleShareClick = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/reports/${report.id}`;
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    let authorName = "Mamamayan ng Paete";
    let authorRole: "resident" | "official" | "governor" = "resident";
    let isOfficial = false;

    if (officerSession) {
      authorName = officerSession.name;
      authorRole = officerSession.role === "governor" ? "governor" : "official";
      isOfficial = true;
    } else if (residentUser) {
      authorName = residentUser.displayName || residentUser.email?.split("@")[0] || "Mamamayan";
    }

    const commentObj: ReportComment = {
      id: `comm-${Date.now()}`,
      authorName,
      authorAvatar: residentUser?.photoURL || undefined,
      authorRole,
      timestamp: "Ngayon lang",
      content: newCommentText.trim(),
      isOfficial,
    };

    setComments((prev) => [...prev, commentObj]);
    setNewCommentText("");
    onAddComment?.(report.id, commentObj);
  };

  const handleOfficerStatusUpdate = (statusTarget: ReportStatus) => {
    setIsSavingStatus(true);
    setCurrentStatus(statusTarget);

    const actor = officerSession?.name || "Opisyal ng Bayan";
    const roleTitle =
      officerSession?.role === "governor"
        ? "Tanggapan ng Gobernador - Laguna"
        : officerSession?.office || "Pamahalaang Bayan ng Paete";

    setOfficialActor(actor);
    setOfficialRoleTitle(roleTitle);

    if (noteDraft.trim()) {
      setOfficialNote(noteDraft.trim());
    }

    onStatusChange?.(report.id, statusTarget, noteDraft.trim() || undefined);

    setTimeout(() => {
      setIsSavingStatus(false);
      setShowOfficerPanel(false);
    }, 400);
  };

  // Status visual mapping
  const statusConfig: Record<
    ReportStatus,
    { label: string; bg: string; text: string; border: string; step: number; icon: React.ReactNode }
  > = {
    pending: {
      label: "Binasang Ulat (Pending)",
      bg: "bg-amber-500/15",
      text: "text-amber-300",
      border: "border-amber-500/30",
      step: 1,
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    urgent: {
      label: "Kritikal / Hazard",
      bg: "bg-red-500/15",
      text: "text-red-300",
      border: "border-red-500/30",
      step: 1,
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
    in_progress: {
      label: "Kasalukuyang Inaaksyunan",
      bg: "bg-blue-500/15",
      text: "text-blue-300",
      border: "border-blue-500/30",
      step: 2,
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    resolved: {
      label: "Naaksyunan Na (Resolved)",
      bg: "bg-emerald-500/15",
      text: "text-emerald-300",
      border: "border-emerald-500/30",
      step: 3,
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
    },
  };

  const categoryLabels: Record<CommunityReport["category"], string> = {
    waste: "Kalinisan at Basura",
    lighting: "Ilaw sa Kalsada",
    road: "Kalsada at Pothole",
    drainage: "Kanal at Tubig-Baha",
    safety: "Kaligtasan ng Publiko",
  };

  const currentCfg = statusConfig[currentStatus];
  const isOfficerLoggedIn = Boolean(officerSession);

  return (
    <article className="group flex flex-col rounded-2xl border border-white/10 bg-[#0A1931]/90 hover:border-blue-500/30 transition-all duration-200 shadow-xl backdrop-blur-md overflow-hidden">
      {/* 1. SOCIAL MEDIA POST HEADER */}
      <div className="p-4 sm:p-5 border-b border-white/5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Author Avatar */}
          <div className="relative">
            {report.isAnonymous ? (
              /* Anonymous masked avatar */
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-600/40"
                style={{ background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" }}
              >
                <Shield className="w-5 h-5 text-slate-400" aria-hidden="true" />
              </div>
            ) : report.authorAvatar ? (
              <Image
                src={report.authorAvatar}
                alt={report.authorName || "Resident"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border border-blue-400/30 object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 border border-white/20 text-white font-bold text-xs flex items-center justify-center shadow-inner">
                {report.authorName ? report.authorName.slice(0, 2).toUpperCase() : "MP"}
              </div>
            )}
            {/* Verified dot — hidden for anonymous */}
            {!report.isAnonymous && (
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-[#0A1931] flex items-center justify-center text-[9px] text-white">
                ✓
              </span>
            )}
          </div>

          {/* Author Name, Barangay, & Time */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white hover:text-blue-300 transition-colors">
                {report.isAnonymous
                  ? (report.anonymousAlias || "Protektadong Mamamayan")
                  : (report.authorName || "Mamamayan ng Paete")}
              </span>
              {report.isAnonymous ? (
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    background: "rgba(148,163,184,0.1)",
                    color: "#94A3B8",
                    border: "1px solid rgba(148,163,184,0.2)",
                  }}
                >
                  <Shield className="w-3 h-3" aria-hidden="true" />
                  <span>Nakaprotektang Ulat</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <UserCheck className="w-3 h-3" aria-hidden="true" />
                  <span>Verified Resident</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-slate-300">
                <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                <span>Brgy. {report.barangay}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                <span>{report.date}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Category & Status Pill */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${currentCfg.bg} ${currentCfg.text} ${currentCfg.border}`}
          >
            {currentCfg.icon}
            <span>{currentCfg.label}</span>
          </span>

          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 px-2 py-0.5 rounded bg-white/5 border border-white/5">
            {categoryLabels[report.category]}
          </span>
        </div>
      </div>

      {/* 2. POST BODY CONTENT */}
      <div className="p-4 sm:p-5 space-y-3">
        <Link href={`/reports/${report.id}`} className="block group/title">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover/title:text-blue-300 transition-colors leading-snug font-heading">
            {report.title}
          </h3>
        </Link>

        <p className="text-sm text-slate-300 leading-relaxed">{report.description}</p>

        {/* Optional Media Preview */}
        {report.imageUrl && (
          <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden border border-white/10 mt-3 group/img bg-black/40">
            <Image
              src={report.imageUrl}
              alt={report.title}
              fill
              className="object-cover group-hover/img:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* 3. CIVIC LIFECYCLE PROGRESS PIPELINE (CIVICPLUS STYLE) */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 mt-3">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Civic Action Pipeline</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">ID: {report.id}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <div
              className={`p-2 rounded-lg text-center border transition-all ${
                currentCfg.step >= 1
                  ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                  : "bg-white/5 border-white/5 text-slate-500"
              }`}
            >
              <div className="text-[10px] font-bold">1. Naisumite</div>
              <div className="text-[9px] text-slate-400">Community Verified</div>
            </div>

            <div
              className={`p-2 rounded-lg text-center border transition-all ${
                currentCfg.step >= 2
                  ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                  : "bg-white/5 border-white/5 text-slate-500"
              }`}
            >
              <div className="text-[10px] font-bold">2. Dispatched</div>
              <div className="text-[9px] text-slate-400">Inaaksyunan sa Field</div>
            </div>

            <div
              className={`p-2 rounded-lg text-center border transition-all ${
                currentCfg.step >= 3
                  ? "bg-emerald-600/20 border-emerald-500/40 text-emerald-300 font-bold"
                  : "bg-white/5 border-white/5 text-slate-500"
              }`}
            >
              <div className="text-[10px] font-bold">3. Nalutas</div>
              <div className="text-[9px] text-slate-400">May Patunay</div>
            </div>
          </div>
        </div>

        {/* 4. OFFICIAL GOVERNMENT DISPOSITION (IF NOTES PRESENT) */}
        {officialNote && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/30 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-blue-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Opisyal na Tugon ng Pamahalaan</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {officialActor ? `${officialActor} (${officialRoleTitle})` : "LGU Paete Official"}
              </span>
            </div>
            <p className="text-slate-200 text-xs italic leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
              &ldquo;{officialNote}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* 5. OFFICER QUICK-ACTION UPDATE DRAWER (ADMIN & GOVERNOR) */}
      {isOfficerLoggedIn && (
        <div className="px-4 py-2.5 bg-blue-950/30 border-t border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                officerSession?.role === "governor"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              }`}
            >
              {officerSession?.role === "governor" ? "Provincial Governor" : "Municipal Admin"}
            </span>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              Maaari mong baguhin ang status ng ulat na ito
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowOfficerPanel(!showOfficerPanel)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            <span>{showOfficerPanel ? "Isara ang Controls" : "I-update ang Status"}</span>
            {showOfficerPanel ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* Expanded Officer Action Toolbar */}
      {isOfficerLoggedIn && showOfficerPanel && (
        <div className="p-4 bg-[#071126]/95 border-b border-white/10 space-y-3 animate-in fade-in duration-150">
          <div className="text-xs font-semibold text-slate-300">
            Pumili ng bagong status para sa ulat:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => handleOfficerStatusUpdate("pending")}
              className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                currentStatus === "pending"
                  ? "bg-amber-500/30 text-amber-300 border-amber-500"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              ⏳ Pending
            </button>

            <button
              type="button"
              onClick={() => handleOfficerStatusUpdate("in_progress")}
              className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                currentStatus === "in_progress"
                  ? "bg-blue-500/30 text-blue-300 border-blue-500"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              ⚙️ In Progress
            </button>

            <button
              type="button"
              onClick={() => handleOfficerStatusUpdate("resolved")}
              className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                currentStatus === "resolved"
                  ? "bg-emerald-500/30 text-emerald-300 border-emerald-500"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              ✅ Resolved
            </button>

            <button
              type="button"
              onClick={() => handleOfficerStatusUpdate("urgent")}
              className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                currentStatus === "urgent"
                  ? "bg-red-500/30 text-red-300 border-red-500"
                  : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10"
              }`}
            >
              🚨 Urgent / Hazard
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold text-slate-400 uppercase">
              Maglakip ng Opisyal na Note / Disposisyon:
            </label>
            <input
              type="text"
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
              placeholder="Halimbawa: Naipadala na sa Engineering team; target matapos bukas."
              className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:border-blue-500 focus:outline-none"
            />
          </div>

          {isSavingStatus && (
            <div className="text-xs text-blue-400 animate-pulse font-medium">
              Ina-update ang status sa pamahalaan...
            </div>
          )}
        </div>
      )}

      {/* 6. SOCIAL ACTION BAR (UPVOTE, COMMENT, SHARE) */}
      <div className="px-4 sm:px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 bg-white/[0.02]">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Upvote / Community Support Button */}
          <button
            type="button"
            onClick={handleUpvoteClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold text-xs transition-all active:scale-95 cursor-pointer ${
              isUpvoted
                ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30"
                : "bg-white/5 text-slate-300 hover:bg-blue-600/20 hover:text-blue-300 border-white/10 hover:border-blue-500/30"
            }`}
            title="I-verify at suportahan ang concern na ito"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Suportahan</span>
            <span className="font-bold ml-0.5">({upvotes})</span>
          </button>

          {/* Comment Thread Toggle Button */}
          <button
            type="button"
            onClick={() => setCommentsOpen(!commentsOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              commentsOpen
                ? "bg-white/15 text-white border-white/20"
                : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border-white/10"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
            <span>Mga Komento</span>
            <span className="font-bold ml-0.5">({comments.length})</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShareClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
          title="Kopyahin ang link ng ulat"
        >
          {shareCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Na-kopya!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">I-bahagi</span>
            </>
          )}
        </button>
      </div>

      {/* 7. EXPANDABLE SOCIAL COMMENT SECTION */}
      {commentsOpen && (
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#071126]/60 space-y-4 animate-in fade-in duration-200">
          <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Usapan ng Komunidad at Tanggapan</span>
            <span className="text-[10px] text-slate-500 font-normal">
              {comments.length} mensahe
            </span>
          </div>

          {/* Existing Comments List */}
          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {comments.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-500 italic">
                Wala pang komento. Maging una sa pagpapatunay o pag-iwan ng tugon!
              </div>
            ) : (
              comments.map((comm) => (
                <div
                  key={comm.id}
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    comm.isOfficial
                      ? "bg-blue-950/40 border-blue-500/30 text-slate-200"
                      : "bg-white/5 border-white/10 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">
                        {comm.authorName}
                      </span>
                      {comm.isOfficial && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>Opisyal</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500">{comm.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-xs">{comm.content}</p>
                </div>
              ))
            )}
          </div>

          {/* Add New Comment Box */}
          <form onSubmit={handleAddCommentSubmit} className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder={
                officerSession
                  ? `Mag-iwan ng tugon bilang ${officerSession.name}...`
                  : residentUser
                  ? `Magkomento bilang ${residentUser.displayName || "Resident"}...`
                  : "Magkomento o mag-iwan ng patunay..."
              }
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs focus:border-blue-500 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ipadala</span>
            </button>
          </form>
        </div>
      )}
    </article>
  );
}
