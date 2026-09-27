"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  X,
  User as UserIcon,
  Download,
  Trash2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  BadgeCheck,
  LogOut,
} from "lucide-react";
import { VerificationBadge, VerificationStatus } from "./VerificationBadge";
import { BarangayVerificationModal } from "./BarangayVerificationModal";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
}: UserProfileModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "activity" | "privacy">("profile");
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("unverified");
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [deletionStep, setDeletionStep] = useState<"initial" | "confirm" | "queued">("initial");
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  // Sync verification status from localStorage if pending
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pendingData = localStorage.getItem("civic_paete_verification_pending");
      if (pendingData) {
        try {
          const parsed = JSON.parse(pendingData);
          if (parsed?.status === "approved") {
            setVerificationStatus("barangay_verified");
          }
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  // Mock civic activity records tied to user
  const mockActivity = {
    reportsCount: 3,
    upvotesCount: 14,
    commentsCount: 6,
    submittedReports: [
      {
        id: "rep-1",
        title: "Non-functional Streetlights along Quesada Street",
        date: "September 24, 2026",
        status: "in_progress",
        barangay: "Bagumbayan",
      },
      {
        id: "rep-2",
        title: "Obstructed Drainage Canal Causing Stormwater Overflow",
        date: "September 25, 2026",
        status: "pending",
        barangay: "Ibaba del Sur",
      },
      {
        id: "rep-3",
        title: "Remediated Road Pothole near Public Market Junction",
        date: "September 22, 2026",
        status: "resolved",
        barangay: "Maytoong",
      },
    ],
  };

  // RA 10173 Sec. 18 Data Portability Export
  const handleDownloadCivicData = () => {
    setIsExporting(true);

    const exportPayload = {
      exportMetadata: {
        platform: "Civic Paete — Official Municipal Platform",
        authority: "Municipality of Paete, Laguna",
        statutoryStandard: "Republic Act No. 10173 (Data Privacy Act of 2012) - Section 18",
        generatedAt: new Date().toISOString(),
        residentUid: user.uid,
      },
      profile: {
        fullName: user.displayName || "Paete Resident",
        email: user.email,
        authProvider: user.providerData?.[0]?.providerId || "google.com",
        verificationStatus: verificationStatus,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
      },
      civicActivity: {
        totalReportsSubmitted: mockActivity.reportsCount,
        totalUpvotesGiven: mockActivity.upvotesCount,
        totalCommentsLogged: mockActivity.commentsCount,
        reportsHistory: mockActivity.submittedReports,
      },
      privacyRightsNotice: {
        dpoContact: "dpo@paete.gov.ph",
        retentionPolicy: "3 years post-inactivity unless statutory audit applies",
        nationalPrivacyCommission: "https://privacy.gov.ph",
      },
    };

    const dataBlob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `civic-paete-data-export-${user.uid.slice(0, 8)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 3000);
    }, 800);
  };

  // RA 10173 Sec. 16(e) Right to Erasure / Account Deletion
  const handleConfirmDeletion = () => {
    if (deleteConfirmationText.trim().toLowerCase() !== "delete") return;

    setDeletionStep("queued");

    if (typeof window !== "undefined") {
      localStorage.setItem("civic_paete_account_deletion_queued", new Date().toISOString());
    }

    setTimeout(async () => {
      try {
        await signOut(auth);
      } catch {
        // ignore
      }
      onClose();
      router.push("/");
      router.refresh();
    }, 2500);
  };

  const handleSignOutClick = async () => {
    try {
      await signOut(auth);
      if (typeof window !== "undefined") {
        localStorage.removeItem("civic_paete_admin_session");
        document.cookie = "civic_paete_role=; path=/; max-age=0";
      }
      onClose();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out notice:", err);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
        <div className="relative w-full max-w-2xl rounded-2xl border border-white/15 bg-[#0A1931] shadow-2xl text-white my-8 max-h-[90vh] flex flex-col overflow-hidden">
          {/* Top Bar Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 border border-white/20 flex items-center justify-center font-bold text-white font-heading text-lg shadow-inner">
                {user.displayName ? user.displayName.slice(0, 2).toUpperCase() : "PR"}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold font-heading text-white">
                    {user.displayName || "Paete Resident"}
                  </h2>
                  <VerificationBadge status={verificationStatus} size="sm" />
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{user.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close dialog"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-white/10 bg-[#071126]/60 px-6 gap-2 text-xs font-semibold overflow-x-auto flex-shrink-0 font-heading">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-1.5 ${
                activeTab === "profile"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Identity & Verification</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("activity")}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-1.5 ${
                activeTab === "activity"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Civic Activity ({mockActivity.reportsCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("privacy")}
              className={`py-3 px-3 border-b-2 transition-all cursor-pointer whitespace-nowrap min-h-[44px] flex items-center gap-1.5 ${
                activeTab === "privacy"
                  ? "border-blue-500 text-blue-400"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data Rights (RA 10173)</span>
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: IDENTITY & VERIFICATION */}
            {activeTab === "profile" && (
              <div className="space-y-5">
                {/* Verification Status Card */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                        Current Verification State
                      </span>
                      <div className="flex items-center gap-2">
                        <VerificationBadge status={verificationStatus} size="lg" />
                      </div>
                    </div>

                    {verificationStatus === "unverified" ? (
                      <button
                        type="button"
                        onClick={() => setIsVerificationModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition-all cursor-pointer min-h-[44px] font-heading self-start sm:self-auto"
                      >
                        <BadgeCheck className="w-4 h-4" />
                        <span>Request Barangay Verification</span>
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-heading">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Residency Authenticated</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {verificationStatus === "unverified"
                      ? "Unverified accounts can post and upvote community reports. To unlock priority escalation, official Barangay Captain notifications, and trusted civic badges, complete Barangay Residency verification."
                      : "Your account is authenticated with the Paete LGU Registry. Your submissions carry official verified weight and are prioritized by barangay marshals."}
                  </p>
                </div>

                {/* Account Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-slate-400 block mb-1">Authentication Method</span>
                    <span className="font-semibold text-white">Google OAuth 2.0 (Verified)</span>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">UID: {user.uid.slice(0, 16)}...</p>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-slate-400 block mb-1">Registered Since</span>
                    <span className="font-semibold text-white">
                      {user.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : "Active Resident"}
                    </span>
                    <p className="text-[11px] text-emerald-400 mt-0.5">Session encrypted via TLS 1.3</p>
                  </div>
                </div>

                {/* Sign Out CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSignOutClick}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 hover:text-red-200 text-xs font-semibold transition-all cursor-pointer min-h-[44px]"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out of Account</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CIVIC ACTIVITY */}
            {activeTab === "activity" && (
              <div className="space-y-5">
                {/* Metric Summary */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <div className="text-2xl font-black font-heading text-white">{mockActivity.reportsCount}</div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Reports</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <div className="text-2xl font-black font-heading text-blue-400">{mockActivity.upvotesCount}</div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Upvotes Given</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                    <div className="text-2xl font-black font-heading text-sky-400">{mockActivity.commentsCount}</div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Comments</span>
                  </div>
                </div>

                {/* List of Submitted Reports */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-heading">
                    Submitted Community Concerns
                  </h4>
                  <div className="divide-y divide-white/5 rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
                    {mockActivity.submittedReports.map((item) => (
                      <div key={item.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-white/[0.02]">
                        <div className="min-w-0">
                          <Link
                            href={`/reports/${item.id}`}
                            onClick={onClose}
                            className="text-xs font-bold text-white hover:text-blue-300 transition-colors line-clamp-1 font-heading"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                            <span>Brgy. {item.barangay}</span>
                            <span>•</span>
                            <span>{item.date}</span>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            item.status === "resolved"
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                              : item.status === "in_progress"
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/25"
                              : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                          }`}
                        >
                          {item.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DATA PRIVACY & STATUTORY RIGHTS (RA 10173) */}
            {activeTab === "privacy" && (
              <div className="space-y-5">
                {/* Statutory Overview */}
                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 leading-relaxed font-sans space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-blue-300 font-heading">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span>Republic Act No. 10173 — Data Subject Rights</span>
                  </div>
                  <p>
                    As a verified civic user, you maintain statutory rights to data portability, access, rectification, and erasure under Philippine privacy jurisprudence.
                  </p>
                </div>

                {/* Right 1: Data Portability (Download JSON) */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="text-xs font-bold text-white font-heading">
                      Data Portability Export (RA 10173 Sec. 18)
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-sans">
                      Export your complete profile, submitted incident tickets, upvotes, and public verification logs in machine-readable JSON format.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadCivicData}
                    disabled={isExporting}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all cursor-pointer min-h-[44px] shrink-0 font-heading"
                  >
                    <Download className="w-4 h-4 text-blue-400" />
                    <span>{isExporting ? "Compiling..." : exportComplete ? "Downloaded!" : "Download My Data"}</span>
                  </button>
                </div>

                {/* Right 2: Right to Erasure / Account Deletion */}
                <div className="p-4 rounded-xl border border-red-500/25 bg-red-950/20 space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-red-300 font-heading flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4 text-red-400" />
                      <span>Request Account Deletion & Right to Erasure (RA 10173 Sec. 16)</span>
                    </h5>
                    <p className="text-[11px] text-slate-300 mt-1 font-sans leading-relaxed">
                      Permanently disassociates your Google account from all submitted community concerns. Public safety records remain anonymized in municipal archives for statutory audit compliance.
                    </p>
                  </div>

                  {deletionStep === "initial" && (
                    <button
                      type="button"
                      onClick={() => setDeletionStep("confirm")}
                      className="px-4 py-2 rounded-xl bg-red-600/30 hover:bg-red-600/40 text-red-300 border border-red-500/40 text-xs font-semibold transition-all cursor-pointer min-h-[44px]"
                    >
                      Initiate Account Deletion Flow
                    </button>
                  )}

                  {deletionStep === "confirm" && (
                    <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 space-y-2.5 animate-in fade-in duration-150">
                      <p className="text-xs text-red-200 font-semibold font-sans">
                        Confirm Deletion Request: Type <span className="font-mono text-white bg-red-900/60 px-1 py-0.5 rounded">DELETE</span> below:
                      </p>
                      <input
                        type="text"
                        value={deleteConfirmationText}
                        onChange={(e) => setDeleteConfirmationText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-red-500/40 text-white placeholder-slate-500 text-xs focus:outline-none min-h-[44px]"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setDeletionStep("initial");
                            setDeleteConfirmationText("");
                          }}
                          className="px-3 py-2 rounded-xl border border-white/10 text-xs text-slate-300 hover:bg-white/10 min-h-[40px] cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleConfirmDeletion}
                          disabled={deleteConfirmationText.trim().toLowerCase() !== "delete"}
                          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-xs font-bold transition-all min-h-[40px] cursor-pointer font-heading"
                        >
                          Confirm & Purge My Account
                        </button>
                      </div>
                    </div>
                  )}

                  {deletionStep === "queued" && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Account erasure request logged. Signing out and clearing local credentials...</span>
                    </div>
                  )}
                </div>

                {/* DPO Contact Banner */}
                <div className="p-3 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/5 pt-3">
                  <span>Inquiries: dpo@paete.gov.ph</span>
                  <Link href="/legal/privacy" className="text-blue-400 hover:underline">
                    View Legal Privacy Policy
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Barangay Verification Modal */}
      <BarangayVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        userEmail={user.email || ""}
        userName={user.displayName || ""}
        onVerificationSubmitted={() => {
          setVerificationStatus("barangay_verified");
        }}
      />
    </>
  );
}
