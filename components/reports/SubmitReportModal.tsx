"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
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
  User,
} from "lucide-react";
import { CommunityReport } from "./ReportCard";
import IdentityShieldBadge from "@/components/legal/IdentityShieldBadge";

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
  onSubmit: (report: Omit<CommunityReport, "id" | "date" | "upvotes" | "status">) => void;
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
}: SubmitReportModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CommunityReport["category"]>("lighting");
  const [barangay, setBarangay] = useState(PAETE_BARANGAYS[0]);
  const [locationDetail, setLocationDetail] = useState("");
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
    setPreviewUrl(null);
    setFileName(null);
    setFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      title: title.trim(),
      description: `${description.trim()} (Location: ${locationDetail || "Unspecified"})`,
      category,
      barangay,
      imageUrl: previewUrl || undefined,
      isAnonymous,
      anonymousAlias: isAnonymous ? anonymousAlias : undefined,
      authorName: isAnonymous ? undefined : undefined,
      authorAvatar: isAnonymous ? undefined : undefined,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle("");
      setDescription("");
      setLocationDetail("");
      handleRemoveImage();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
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

        {submitted ? (
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
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Directly report infrastructure hazards, public sanitation, or community issues with photo evidence.
              </p>
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

              {/* PHOTO EVIDENCE CONTAINER & PREVIEW */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Photo Evidence (Recommended)
                </label>

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
                        Ready to Attach
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
                        ? "border-blue-400 bg-blue-950/40"
                        : "border-white/15 bg-white/[0.02] hover:border-blue-400/50 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                        <Camera className="w-5 h-5" />
                      </div>
                      <div className="text-xs sm:text-sm font-semibold text-slate-200">
                        Click to attach photo evidence or drag and drop
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Supports JPEG, PNG, WEBP (up to 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Anonymous Toggle ─────────────────────────────── */}
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
                      {isAnonymous ? "Report Anonymously (Identity Shield)" : "Report with Verified Resident Profile"}
                    </p>
                    <p className="text-[11px] mt-0.5 text-slate-400">
                      {isAnonymous
                        ? `Public Feed Alias: ${anonymousAlias}`
                        : "Displays your verified citizen name on the public feed"}
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
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-all min-h-[44px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition-all min-h-[44px] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Community Report</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
