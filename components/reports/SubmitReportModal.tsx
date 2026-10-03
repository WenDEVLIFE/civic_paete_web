"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Send,
  MapPin,
  Check,
  Camera,
  Trash2,
  FileCheck,
  Tag,
  Shield,
  ShieldAlert,
  User,
  Loader2,
  BadgeCheck,
  UserCheck,
} from "lucide-react";
import { CommunityReport } from "./ReportCard";
import IdentityShieldBadge from "@/components/legal/IdentityShieldBadge";
import { isUserAdminOrGovernor } from "@/lib/roleHelper";
import { auth, db, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, User as FirebaseUser } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import {
  subscribeToUserVerification,
  VerificationStatus,
} from "@/lib/services/verificationService";
import { BarangayVerificationModal } from "@/components/profile/BarangayVerificationModal";

export interface SubmitReportData extends Omit<CommunityReport, "id" | "date" | "upvotes" | "status"> {
  imageFile?: File | null;
  locationDetail?: string;
  authorRealName?: string;
  authorEmail?: string;
  authorVerificationStatus?: string;
}

// ─── Alias Generator ─────────────────────────────────────────────────────────

/**
 * Generates a stable public-facing alias for anonymous reports.
 * The number is derived from random seed so it feels unique
 * per submission session while never exposing the resident's true UID.
 */
function generateAnonymousAlias(): string {
  const seed = Math.floor(Math.random() * 9000) + 100;
  return `Protected Citizen #${seed}`;
}

interface SubmitReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (report: SubmitReportData) => Promise<void> | void;
  isAdminOrGovernor?: boolean;
  currentUser?: FirebaseUser | null;
}

const PAETE_BARANGAYS = [
  "Bagumbayan",
  "Bangkusay",
  "Ermita",
  "Ibaba del Norte",
  "Ibaba del Sur",
  "Ilaya del Norte",
  "Ilaya del Sur",
  "Maytoong",
  "Quinale",
];

const CATEGORIES = [
  { value: "waste", label: "Solid Waste & Sanitation" },
  { value: "lighting", label: "Streetlights & Electrical Grid" },
  { value: "road", label: "Road Maintenance & Potholes" },
  { value: "drainage", label: "Drainage & Flood Channels" },
  { value: "safety", label: "Public Safety & Physical Hazards" },
] as const;

// ─── Paete Landmark Quick-Tags ────────────────────────────────────────────────

const PAETE_LANDMARKS = [
  "Paete Parish Church (St. James)",
  "Paete Municipal Hall",
  "Paete Public Market",
  "Paete Central School",
  "Paete National High School",
  "Laguna de Bay Shoreline",
  "Poblacion Rotunda",
  "Quesada Street",
  "F. Sario Street",
  "Doña Paz Monument",
  "Paete Health Center",
  "San Juan River Bridge",
];

export function SubmitReportModal({
  isOpen,
  onClose,
  onSubmit,
  isAdminOrGovernor: initialIsAdminOrGov,
  currentUser: initialCurrentUser,
}: SubmitReportModalProps) {
  const [isAdminOrGov, setIsAdminOrGov] = useState<boolean>(Boolean(initialIsAdminOrGov));
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(initialCurrentUser || null);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("unverified");
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (initialIsAdminOrGov !== undefined) {
      setIsAdminOrGov(initialIsAdminOrGov);
    } else {
      setIsAdminOrGov(isUserAdminOrGovernor());
    }
  }, [initialIsAdminOrGov, isOpen]);

  useEffect(() => {
    if (initialCurrentUser !== undefined) {
      setCurrentUser(initialCurrentUser);
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setCurrentUser(u);
    });
    return () => unsub();
  }, [initialCurrentUser]);

  useEffect(() => {
    if (!currentUser?.uid) {
      setVerificationStatus("unverified");
      return;
    }
    const unsub = subscribeToUserVerification(currentUser.uid, (status) => {
      setVerificationStatus(status);
    });
    return () => unsub();
  }, [currentUser?.uid]);

  const isVerifiedResident =
    verificationStatus === "barangay_verified" ||
    verificationStatus === "community_leader" ||
    verificationStatus === "municipal_officer";

  const handleModalGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedUser = result.user;
      setCurrentUser(loggedUser);

      // Sync resident profile to Firestore
      try {
        const userRef = doc(db, "users", loggedUser.uid);
        const userSnap = await getDoc(userRef);
        const existingData = userSnap.data();

        await setDoc(
          userRef,
          {
            uid: loggedUser.uid,
            name: loggedUser.displayName || "Paete Resident",
            email: loggedUser.email || "",
            photoURL: loggedUser.photoURL || "",
            role: existingData?.role || "resident",
            authProvider: "google",
            verificationStatus: existingData?.verificationStatus || "unverified",
            lastLogin: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (fsErr) {
        console.warn("Notice: Firestore sync for Google resident:", fsErr);
      }
    } catch (err: unknown) {
      console.error("Google sign in error in modal:", err);
      const authErr = err as { code?: string; message?: string };
      if (typeof window !== "undefined") {
        if (authErr?.code === "auth/unauthorized-domain") {
          setAuthError(
            `Domain not authorized in Firebase! Please add "${window.location.hostname}" to Firebase Console -> Authentication -> Settings -> Authorized domains.`
          );
        } else if (authErr?.code !== "auth/popup-closed-by-user") {
          setAuthError(authErr?.message || "Google Sign-In failed. Please try again.");
        }
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CommunityReport["category"]>("lighting");
  const [barangay, setBarangay] = useState(PAETE_BARANGAYS[0]);
  const [locationDetail, setLocationDetail] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonymousAlias] = useState<string>(generateAnonymousAlias);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image format (JPEG, PNG, or WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image file size must not exceed 5MB.");
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setFileSize((file.size / 1024).toFixed(1) + " KB");

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName(null);
    setFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAdminOrGov) {
      alert("Municipal Administrators and Provincial Governors are restricted from submitting community reports. Only residents may file reports.");
      return;
    }
    if (!currentUser) {
      alert("Citizen sign-in is required to submit a community report.");
      return;
    }
    if (!isVerifiedResident) {
      alert("Kailangan po muna ng Barangay Verification bago makapag-post ng community concern.");
      return;
    }
    if (!selectedFile && !previewUrl) {
      alert("Required po ang photo evidence sa pag-post ng community concern. Mangyaring mag-attach ng larawan ng problema.");
      return;
    }
    if (!title.trim() || !description.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        locationDetail: locationDetail.trim(),
        category,
        barangay,
        imageFile: selectedFile,
        imageUrl: previewUrl || undefined,
        isAnonymous,
        anonymousAlias: isAnonymous ? anonymousAlias : undefined,
        authorName: isAnonymous ? undefined : (currentUser.displayName || currentUser.email?.split("@")[0] || "Paete Resident"),
        authorRealName: currentUser.displayName || currentUser.email?.split("@")[0] || "Paete Resident",
        authorEmail: currentUser.email || undefined,
        authorVerificationStatus: verificationStatus,
        authorAvatar: isAnonymous ? undefined : (currentUser.photoURL || undefined),
      });

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsSubmitting(false);
        setTitle("");
        setDescription("");
        setLocationDetail("");
        handleRemoveImage();
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to submit report:", err);
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-[#0A1931] p-6 sm:p-7 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isAdminOrGov ? (
          <div className="py-8 px-2 text-center space-y-5">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                Official Leadership Notice
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Filing Restricted for Admin & Governor
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-sans">
                You are currently signed in with an administrative authority role (Municipal Administrator / Provincial Governor). Community reports must be submitted directly by residents of Paete to maintain impartial civic oversight.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 text-left space-y-2.5 max-w-md mx-auto">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4" />
                <span>Executive & Administrative Privileges:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li>Triage incoming community reports and dispatch department crews</li>
                <li>Issue official status notes, directives, and resolutions</li>
                <li>Verify resident identity and manage barangay verification queues</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/admin/dashboard"
                onClick={onClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-amber-600/30 transition-all min-h-[44px]"
              >
                <span>Go to Admin Dashboard</span>
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-all min-h-[44px] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : !currentUser ? (
          <div className="py-8 px-2 text-center space-y-5 animate-in fade-in duration-150">
            <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider font-heading">
                Resident Sign-In Required
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Sign In to File a Community Report
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-sans">
                To prevent automated spam and ensure municipal action on legitimate citizen concerns, community report submissions require an authenticated resident account.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 text-left space-y-2.5 max-w-md mx-auto">
              <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Citizen Protection & Privacy Guarantees:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li>
                  <strong className="text-white">Identity Shield Available:</strong> You can still file anonymously. Your real name and photo will not be publicly displayed.
                </li>
                <li>
                  <strong className="text-white">Direct Issue Tracking:</strong> Track official dispatch, field crew inspections, and resolution photos.
                </li>
              </ul>
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs text-left max-w-md mx-auto">
                {authError}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-all min-h-[44px] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleModalGoogleSignIn}
                disabled={isSigningIn}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-100 active:scale-[0.98] text-slate-900 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg transition-all min-h-[44px] cursor-pointer"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Sign In with Google to Continue</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : !isVerifiedResident ? (
          <div className="py-8 px-2 text-center space-y-5 animate-in fade-in duration-150">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/20 shadow-inner">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider font-heading">
                {verificationStatus === "pending" ? "Verification In Progress" : "Barangay Verification Required"}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading text-white">
                {verificationStatus === "pending"
                  ? "Residency Verification Under Review"
                  : "Verified Resident Account Required"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-sans">
                {verificationStatus === "pending"
                  ? "Kasalukuyang sinusuri ng Paete Municipal Hall ang inyong isinumiteng dokumento. Aabisuhan kayo kapag na-approve na ang inyong Barangay Residency upang makapag-post ng mga ulat."
                  : "Upang mapanatili ang integridad ng mga ulat at maiwasan ang maling impormasyon o spam, ang mga verified na residente lamang ng Paete ang maaaring mag-post ng community concerns."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 text-left space-y-2.5 max-w-md mx-auto">
              <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                <span>Bakit kailangan ang Barangay Verification bago mag-post?</span>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
                <li>Opisyal na ini-endorso sa tamang Barangay Kapitan at Municipal Engineering Office ang mga ulat ng verified accounts.</li>
                <li>Maiiwasan ang mga pekeng ulat o automated bots sa sistema ng bayan.</li>
                <li>Maaari pa ring gamitin ang <strong>Anonymous Mode (parang sa FB)</strong> kapag nag-post—itatago ang iyong pangalan sa publiko habang kilala ka ng Admin.</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-all min-h-[44px] cursor-pointer"
              >
                Close
              </button>
              {verificationStatus === "unverified" && (
                <button
                  type="button"
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all min-h-[44px] cursor-pointer"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>Request Barangay Verification</span>
                </button>
              )}
            </div>
          </div>
        ) : submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading">
              Report Submitted Successfully
            </h3>
            <p className="text-sm text-slate-300 max-w-xs mx-auto">
              Your community concern and photo evidence have been logged for official verification by Paete municipal authorities.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 pr-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Municipality of Paete, Laguna</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-heading">
                Submit Community Concern
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-300">
                <span>Filing report as:</span>
                <strong className="text-white">{currentUser.displayName || currentUser.email?.split("@")[0] || "Paete Resident"}</strong>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-heading">
                  <UserCheck className="w-3 h-3" />
                  <span>Barangay Verified</span>
                </span>
                <span className="text-slate-500 font-mono">({currentUser.email})</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Barangay & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Barangay Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Paete Barangay *
                  </label>
                  <select
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                    required
                  >
                    {PAETE_BARANGAYS.map((brgy) => (
                      <option key={brgy} value={brgy} className="bg-[#0A1931]">
                        Brgy. {brgy}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Concern Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as CommunityReport["category"])
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value} className="bg-[#0A1931]">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Concern Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Non-functional streetlights along F. Sario Street"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                  required
                />
              </div>

              {/* Location Detail with Landmark Quick-Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-400" aria-hidden="true" />
                    Specific Location or Landmark
                  </span>
                </label>

                {/* Quick-tag landmark chips */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {PAETE_LANDMARKS.map((lm) => {
                    const isTagged = locationDetail.includes(lm);
                    return (
                      <button
                        key={lm}
                        type="button"
                        onClick={() =>
                          setLocationDetail((prev) =>
                            isTagged
                              ? prev.replace(lm, "").replace(/,\s*,/g, ",").replace(/^,\s*|,\s*$/g, "").trim()
                              : prev ? `${prev}, ${lm}` : lm
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150 cursor-pointer min-h-[36px]"
                        style={{
                          background: isTagged ? "rgba(37,99,235,0.25)" : "rgba(255,255,255,0.05)",
                          border: isTagged ? "1px solid rgba(37,99,235,0.5)" : "1px solid rgba(255,255,255,0.1)",
                          color: isTagged ? "#60A5FA" : "#94A3B8",
                        }}
                        aria-pressed={isTagged}
                        aria-label={`${isTagged ? "Remove" : "Add"} landmark tag: ${lm}`}
                      >
                        <Tag className="w-2.5 h-2.5 flex-shrink-0" aria-hidden="true" />
                        {lm}
                      </button>
                    );
                  })}
                </div>

                {/* Free-text location input */}
                <input
                  type="text"
                  id="location-detail-input"
                  placeholder="Or enter specific street corner / house number..."
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide comprehensive details about the issue to assist municipal engineers and field workers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none resize-none"
                  required
                />
              </div>

              {/* PHOTO EVIDENCE CONTAINER & PREVIEW (REQUIRED) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Photo Evidence * (Required)
                  </label>
                  <span className="text-[11px] text-amber-400 font-medium">
                    Kailangan mag-upload ng larawan
                  </span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                />

                {previewUrl ? (
                  /* Image Preview Box */
                  <div className="relative rounded-xl border border-blue-500/40 bg-blue-950/20 p-3 overflow-hidden">
                    <div className="relative w-full h-44 sm:h-52 rounded-lg overflow-hidden bg-black/40 border border-white/10">
                      <Image
                        src={previewUrl}
                        alt="Photo Evidence Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 p-2 rounded-lg bg-red-600/90 hover:bg-red-700 text-white shadow-lg backdrop-blur-sm transition-all min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between text-xs text-slate-300">
                      <div className="flex items-center gap-1.5 truncate max-w-[260px]">
                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate font-medium">{fileName}</span>
                        <span className="text-slate-500">({fileSize})</span>
                      </div>
                      <span className="text-emerald-400 text-[11px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Photo Attached
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Upload Dropzone */
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition-all ${
                      isDragging
                        ? "border-amber-400 bg-amber-950/20"
                        : "border-amber-500/30 bg-amber-500/[0.03] hover:border-amber-400/60 hover:bg-amber-500/[0.06]"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-200">
                        Mag-attach ng Photo Evidence (Obligado)
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Click para pumili o i-drag and drop ang larawan (JPEG, PNG, WEBP hanggang 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Anonymous Toggle (Facebook-style) ─────────────────────────────── */}
              <div
                className="rounded-xl p-3 flex items-center justify-between gap-3"
                style={{
                  background: isAnonymous
                    ? "rgba(148,163,184,0.08)"
                    : "rgba(37,99,235,0.06)",
                  border: isAnonymous
                    ? "1px solid rgba(148,163,184,0.2)"
                    : "1px solid rgba(37,99,235,0.15)",
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mt-0.5"
                    style={{
                      background: isAnonymous
                        ? "rgba(148,163,184,0.12)"
                        : "rgba(37,99,235,0.12)",
                      border: isAnonymous
                        ? "1px solid rgba(148,163,184,0.2)"
                        : "1px solid rgba(37,99,235,0.25)",
                    }}
                  >
                    {isAnonymous ? (
                      <Shield className="w-4 h-4 text-slate-400" />
                    ) : (
                      <User className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold leading-tight font-heading text-white">
                      {isAnonymous ? "Post as Anonymous (Parang sa FB — Identity Shield)" : "Post gamit ang Verified Resident Profile"}
                    </p>
                    <p className="text-[11px] mt-0.5 text-slate-400">
                      {isAnonymous
                        ? `Public Feed: Naka-hide ang iyong pangalan sa ibang residente (ipapakita bilang ${anonymousAlias}) • Admin Panel: Kita ng Municipal Admin ang iyong tunay na pangalan para sa opisyal na aksyon`
                        : "Lalabas ang iyong buong pangalan at verified profile sa public feed"}
                    </p>
                  </div>
                </div>

                {/* Toggle switch */}
                <button
                  id="anonymous-toggle-btn"
                  type="button"
                  role="switch"
                  aria-checked={isAnonymous}
                  onClick={() => setIsAnonymous((prev) => !prev)}
                  className="relative flex-shrink-0 w-12 h-6 rounded-full transition-all duration-200 cursor-pointer focus:outline-none min-h-[44px] flex items-center"
                  style={{
                    background: isAnonymous ? "#475569" : "#2563EB",
                    boxShadow: isAnonymous
                      ? "none"
                      : "0 0 8px rgba(37,99,235,0.4)",
                  }}
                  aria-label={isAnonymous ? "Disable anonymous mode" : "Enable anonymous mode"}
                >
                  <span
                    className="block w-4 h-4 rounded-full bg-white transition-transform duration-200 ml-1"
                    style={{
                      transform: isAnonymous ? "translateX(22px)" : "translateX(0)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                    }}
                  />
                </button>
              </div>

              <IdentityShieldBadge variant="banner" />

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-all min-h-[44px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (!selectedFile && !previewUrl)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition-all min-h-[44px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Submitting to Civic Cloud...</span>
                    </>
                  ) : !selectedFile && !previewUrl ? (
                    <>
                      <Camera className="w-4 h-4 text-amber-300" />
                      <span>Attach Photo to Submit</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Community Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Barangay Verification Modal Trigger */}
        {currentUser && (
          <BarangayVerificationModal
            isOpen={isVerificationModalOpen}
            onClose={() => setIsVerificationModalOpen(false)}
            userId={currentUser.uid}
            userEmail={currentUser.email || undefined}
            userName={currentUser.displayName || undefined}
          />
        )}
      </div>
    </div>
  );
}
