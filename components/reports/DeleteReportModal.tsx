"use client";

import React, { useState, useEffect } from "react";
import {
  Trash2,
  AlertTriangle,
  X,
  MapPin,
  Calendar,
  User,
  ShieldAlert,
  Loader2,
} from "lucide-react";

interface DeleteReportTarget {
  id: string;
  title: string;
  barangay?: string;
  authorName?: string;
  date?: string;
  status?: string;
}

interface DeleteReportModalProps {
  isOpen: boolean;
  report: DeleteReportTarget | null;
  onClose: () => void;
  onConfirmDelete: (reportId: string, reason: string) => Promise<void>;
  currentOfficer?: {
    name?: string;
    role?: string;
    office?: string;
  } | null;
}

const PRESET_REASONS = [
  "Spam or irrelevant submission",
  "Duplicate community report",
  "Inappropriate or abusive content",
  "Resolved or handled offline",
  "Sensitive personal / privacy leak",
  "False or unverified emergency report",
];

export function DeleteReportModal({
  isOpen,
  report,
  onClose,
  onConfirmDelete,
  currentOfficer,
}: DeleteReportModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Reset modal state whenever report changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedPreset("");
      setCustomReason("");
      setIsDeleting(false);
    }
  }, [isOpen, report?.id]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !report) return null;

  const finalReason = customReason.trim() || selectedPreset || "Administrative post moderation";

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onConfirmDelete(report.id, finalReason);
      onClose();
    } catch (err) {
      console.error("Deletion failed:", err);
      setIsDeleting(false);
    }
  };

  const handlePresetClick = (preset: string) => {
    if (selectedPreset === preset) {
      setSelectedPreset("");
    } else {
      setSelectedPreset(preset);
      if (!customReason) {
        setCustomReason(preset);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-report-modal-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-red-500/30 bg-[#0A1931] shadow-2xl text-white overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Badge & Close */}
        <div className="p-5 sm:p-6 pb-4 border-b border-white/10 bg-gradient-to-b from-red-950/40 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 shadow-lg shadow-red-950/40">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/15 text-red-300 border border-red-500/30 mb-1">
                  <ShieldAlert className="w-3 h-3 text-red-400" />
                  <span>Administrative Action</span>
                </div>
                <h3
                  id="delete-report-modal-title"
                  className="text-lg sm:text-xl font-black font-heading text-white tracking-tight"
                >
                  Delete Community Report
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              aria-label="Close modal"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-2.5 font-sans leading-relaxed">
            This action will permanently delete the post and its discussion from the public citizen portal. This cannot be undone.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto">
          {/* Target Report Snapshot Card */}
          <div className="p-4 rounded-xl bg-[#071126] border border-white/10 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Target Report Summary
            </div>
            <div className="text-sm font-bold text-white font-heading leading-snug">
              {report.title}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
              {report.barangay && (
                <span className="inline-flex items-center gap-1 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Brgy. {report.barangay}</span>
                </span>
              )}
              {report.authorName && (
                <span className="inline-flex items-center gap-1 text-slate-300">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{report.authorName}</span>
                </span>
              )}
              {report.date && (
                <span className="inline-flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{report.date}</span>
                </span>
              )}
            </div>
          </div>

          {/* Quick Select Presets for Justification */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 font-sans">
              Select Reason for Removal (Audit Log)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_REASONS.map((reason) => {
                const isSelected = selectedPreset === reason;
                return (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => handlePresetClick(reason)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all text-left cursor-pointer min-h-[32px] ${
                      isSelected
                        ? "bg-red-500/20 text-red-200 border-red-500/50 shadow-sm"
                        : "bg-white/5 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {reason}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Reason / Details Field */}
          <div>
            <label
              htmlFor="deletion-custom-reason"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans"
            >
              Administrative Justification Notes
            </label>
            <textarea
              id="deletion-custom-reason"
              rows={3}
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="Provide context or explanation for records and compliance..."
              className="w-full p-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-red-500 focus:outline-none font-sans transition-all"
            />
          </div>

          {/* Government Accountability Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed font-sans flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-300 font-heading">
                Permanent Civic Audit Trail:
              </span>{" "}
              This deletion will be logged under{" "}
              <strong className="text-white">
                {currentOfficer?.name || "Municipal Administrator"}
              </strong>{" "}
              ({currentOfficer?.role === "governor" ? "Provincial Governor" : "Municipal Officer"}) in the immutable municipal audit register.
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 pt-3 border-t border-white/10 bg-[#071126]/90 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer min-h-[44px]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 active:scale-[0.98] disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-950/50 flex items-center justify-center gap-2 font-heading transition-all cursor-pointer min-h-[44px]"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting Record...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Confirm Permanent Deletion</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
