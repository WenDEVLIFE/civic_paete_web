"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  ShieldCheck,
  Upload,
  FileCheck,
  CheckCircle2,
  Trash2,
  AlertCircle,
  FileText,
  BadgeCheck,
} from "lucide-react";

interface BarangayVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
  onVerificationSubmitted?: (data: {
    barangay: string;
    method: "certificate" | "gov_id";
    documentNumber: string;
    address: string;
  }) => void;
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

const VALID_ID_TYPES = [
  "PhilSys National ID",
  "COMELEC Voter's ID / Certification",
  "Driver's License (LTO)",
  "Postal ID (Digital)",
  "UMID Card",
  "Barangay Resident ID Card",
];

export function BarangayVerificationModal({
  isOpen,
  onClose,
  userName,
  onVerificationSubmitted,
}: BarangayVerificationModalProps) {
  const [fullName, setFullName] = useState(userName || "");
  const [birthDate, setBirthDate] = useState("");
  const [barangay, setBarangay] = useState(PAETE_BARANGAYS[0]);
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState<"certificate" | "gov_id">("certificate");
  const [documentNumber, setDocumentNumber] = useState("");
  const [idType, setIdType] = useState(VALID_ID_TYPES[0]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const maxEligibleDate = new Date(
    new Date().setFullYear(new Date().getFullYear() - 15)
  )
    .toISOString()
    .split("T")[0];

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      setErrorMessage("Please select a valid image (JPEG, PNG, WEBP) or PDF document.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("Document file size must not exceed 5MB.");
      return;
    }

    setErrorMessage("");
    setFileName(file.name);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl("/pdf-placeholder");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileProcess(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !address.trim() || !documentNumber.trim() || !birthDate) {
      setErrorMessage("Please fill out all required fields including your date of birth.");
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    if (age < 15) {
      setErrorMessage(
        "Applicants must be at least 15 years of age to register for civic verification (Katipunan ng Kabataan eligibility under RA 10742)."
      );
      return;
    }

    if (!consentChecked) {
      setErrorMessage("You must accept the Data Privacy and Age 15+ statutory declaration.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      onVerificationSubmitted?.({
        barangay,
        method,
        documentNumber,
        address,
      });

      // Also persist to localStorage for active session preview
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "civic_paete_verification_pending",
          JSON.stringify({
            barangay,
            method,
            documentNumber,
            address,
            birthDate,
            submittedAt: new Date().toISOString(),
          })
        );
      }

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
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

        {isSuccess ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-bold font-heading text-white">
              Application Submitted for Verification
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto font-sans leading-relaxed">
              Your proof of residency has been securely queued for review by the Barangay Hall and Municipal Administrator. Verification typically completes within 24 to 48 hours.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6 pr-8">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1 font-heading">
                <BadgeCheck className="w-4 h-4" />
                <span>Feature 5 — Citizen Identity Verification</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-heading text-white">
                Barangay Residency Verification
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
                Verify your local residence in Paete to earn the official{" "}
                <span className="text-emerald-400 font-semibold">Barangay Verified</span> badge and unlock priority municipal escalation.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-300 flex items-center gap-2 font-sans">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Full Legal Name & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g., Juan Santos Dela Cruz"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider font-sans">
                      Date of Birth *
                    </label>
                    <span className="text-[10px] text-blue-400 font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 font-mono">
                      15+ Years Old
                    </span>
                  </div>
                  <input
                    type="date"
                    value={birthDate}
                    max={maxEligibleDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                    required
                  />
                </div>
              </div>

              {/* Barangay & Street Address Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                    Paete Barangay of Residence *
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

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                    House No., Street or Purok *
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g., 142 Quesada St., Purok 3"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                    required
                  />
                </div>
              </div>

              {/* Verification Method Switcher */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-sans">
                  Verification Proof Method *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMethod("certificate")}
                    className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer min-h-[44px] flex items-center gap-2 ${
                      method === "certificate"
                        ? "bg-blue-600/20 text-blue-300 border-blue-500"
                        : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Barangay Certificate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("gov_id")}
                    className={`p-3 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer min-h-[44px] flex items-center gap-2 ${
                      method === "gov_id"
                        ? "bg-blue-600/20 text-blue-300 border-blue-500"
                        : "bg-white/5 text-slate-400 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Government / Voter ID</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Document Reference Number */}
              {method === "certificate" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                    Barangay Clearance / Residency Certificate No. *
                  </label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    placeholder="e.g., BC-2026-0891"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                    required
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                      Government ID Type *
                    </label>
                    <select
                      value={idType}
                      onChange={(e) => setIdType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                    >
                      {VALID_ID_TYPES.map((id) => (
                        <option key={id} value={id} className="bg-[#0A1931]">
                          {id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                      ID / Serial Number *
                    </label>
                    <input
                      type="text"
                      value={documentNumber}
                      onChange={(e) => setDocumentNumber(e.target.value)}
                      placeholder="e.g., 1234-5678-9012-3456"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none min-h-[44px]"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Document Photo Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
                  Attach Photo of Certificate or ID *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/webp, application/pdf"
                  className="hidden"
                />

                {previewUrl ? (
                  <div className="relative rounded-xl border border-blue-500/40 bg-blue-950/20 p-3 overflow-hidden">
                    <div className="relative w-full h-36 rounded-lg overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                      {previewUrl === "/pdf-placeholder" ? (
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <FileText className="w-8 h-8 text-blue-400" />
                          <span className="text-xs">PDF Document Attached</span>
                        </div>
                      ) : (
                        <Image
                          src={previewUrl}
                          alt="Document Preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setFileName(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        className="absolute top-2 right-2 p-2 rounded-lg bg-red-600/90 hover:bg-red-700 text-white shadow-lg transition-all min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                        title="Remove attached document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-slate-300 font-sans">
                      <div className="flex items-center gap-1.5 truncate max-w-[280px]">
                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="truncate font-medium">{fileName}</span>
                      </div>
                      <span className="text-emerald-400 text-[11px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        Document Ready
                      </span>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer rounded-xl border-2 border-dashed border-white/15 bg-white/[0.02] hover:border-blue-400/50 hover:bg-white/[0.04] p-4 text-center transition-all min-h-[80px] flex items-center justify-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 shrink-0">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-semibold text-slate-200">
                          Click to upload document photo or scan
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Supports JPEG, PNG, WEBP, or PDF (Up to 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Data Privacy & 15+ Age Consent Declaration */}
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/20 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-blue-600 bg-white/5 border-white/20 focus:ring-blue-500 shrink-0 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-300 leading-relaxed font-sans">
                    I affirm that I am a resident of Paete, Laguna aged 15 or older (Katipunan ng Kabataan / SK civic eligibility under RA 10742). I declare under penalty of perjury that the information and documents submitted are true and correct, and authorize the Paete Municipal Government to verify this credential solely for residency verification pursuant to Republic Act No. 10173.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-all min-h-[44px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition-all min-h-[44px] cursor-pointer disabled:opacity-50 font-heading"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? "Submitting Application..." : "Submit for Verification"}</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
