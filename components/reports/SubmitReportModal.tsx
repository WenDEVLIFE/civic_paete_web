"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  Send,
  MapPin,
  AlertCircle,
  Check,
  Camera,
  Trash2,
  FileCheck,
} from "lucide-react";
import { CommunityReport } from "./ReportCard";
import IdentityShieldBadge from "@/components/legal/IdentityShieldBadge";

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
  { value: "waste", label: "Kalinisan at Basura (Waste Management)" },
  { value: "lighting", label: "Ilaw sa Kalsada (Streetlight Issues)" },
  { value: "road", label: "Kalsada at Potholes (Road Maintenance)" },
  { value: "drainage", label: "Kanal at Tubig-Baha (Drainage)" },
  { value: "safety", label: "Kaligtasan ng Publiko (Public Safety)" },
] as const;

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Mangyaring pumili ng wastong format ng larawan (JPEG, PNG, o WEBP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ang sukat ng larawan ay hindi dapat lumagpas sa 5MB.");
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
      description: `${description.trim()} (Lokasyon: ${locationDetail || "Hindi tinukoy"})`,
      category,
      barangay,
      imageUrl: previewUrl || undefined,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl border border-white/15 bg-[#0A1931] p-6 sm:p-7 shadow-2xl text-white my-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading">
              Matagumpay na Naisumite!
            </h3>
            <p className="text-sm text-slate-300 max-w-xs mx-auto">
              Ang iyong ulat at patunay na larawan ay naitala na para sa beripikasyon ng mga opisyal ng Paete.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Mamamayan ng Paete</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight font-heading">
                Magsumite ng Community Concern
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Iulat ang mga suliranin sa inyong komunidad kalakip ang patunay na larawan.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Barangay & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Barangay Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Barangay sa Paete *
                  </label>
                  <select
                    value={barangay}
                    onChange={(e) => setBarangay(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
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
                    Kategorya *
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as CommunityReport["category"])
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
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
                  Pamagat ng Concern *
                </label>
                <input
                  type="text"
                  placeholder="Halimbawa: Pundidong ilaw sa may kanto ng F. Sario St."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Location Detail */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Eksaktong Lokasyon o Landmark
                </label>
                <input
                  type="text"
                  placeholder="Halimbawa: Tapat ng Paete Central School / Malapit sa tindahan"
                  value={locationDetail}
                  onChange={(e) => setLocationDetail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detalyadong Paliwanag *
                </label>
                <textarea
                  rows={3}
                  placeholder="Ilarawan ang problema upang mas madaling masuri ng lokal na pamahalaan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-xs sm:text-sm focus:border-blue-500 focus:outline-none resize-none"
                  required
                />
              </div>

              {/* PHOTO EVIDENCE CONTAINER & PREVIEW */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Patunay na Larawan (Photo Evidence)
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
                        className="absolute top-2 right-2 p-2 rounded-lg bg-red-600/90 hover:bg-red-700 text-white shadow-lg backdrop-blur-sm transition-all"
                        title="Tanggalin ang larawan"
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
                        Nakahandang I-attach
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
                        Pindutin para mag-attach ng litrato o i-drag dito
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Sinusuportahan ang JPEG, PNG, WEBP (Hanggang 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <IdentityShieldBadge variant="banner" />

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-xs sm:text-sm font-medium transition-all"
                >
                  Kanselahin
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Isumite ang Ulat</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
