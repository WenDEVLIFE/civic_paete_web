"use client";

import React, { useState } from "react";
import { X, Send, MapPin, AlertCircle, Check } from "lucide-react";
import { CommunityReport } from "./ReportCard";

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
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSubmit({
      title: title.trim(),
      description: `${description.trim()} (Lokasyon: ${locationDetail || "Hindi tinukoy"})`,
      category,
      barangay,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setTitle("");
      setDescription("");
      setLocationDetail("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0A1931] p-6 shadow-2xl text-white">
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
              Ang iyong ulat ay naitala na para sa beripikasyon ng mga opisyal ng Paete.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Mamamayan ng Paete</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight font-heading">
                Magsumite ng Community Concern
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Iulat ang mga suliranin sa inyong komunidad para sa mabilisang aksyon.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Barangay Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Barangay sa Paete *
                </label>
                <select
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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
                  Kategorya ng Concern *
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as CommunityReport["category"])
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value} className="bg-[#0A1931]">
                      {cat.label}
                    </option>
                  ))}
                </select>
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-slate-500 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  required
                />
              </div>

              {/* Verified Identity Note */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Kapag na-integrate ang Google Login, awtomatikong maiuugnay ang iyong beripikadong email sa ulat na ito para sa transparency at seguridad.
                </span>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-white/15 text-slate-300 hover:text-white hover:bg-white/10 text-sm font-medium transition-all"
                >
                  Kanselahin
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm font-semibold shadow-md shadow-blue-600/30 transition-all"
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
