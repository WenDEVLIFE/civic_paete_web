"use client";

import React, { use } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/Navbar";
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
} from "lucide-react";

interface TimelineEvent {
  title: string;
  departmentOrActor: string;
  timestamp: string;
  notes: string;
  status: "completed" | "current" | "upcoming";
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
  timeline: TimelineEvent[];
}

const MOCK_REPORTS_DATABASE: Record<string, DetailedReport> = {
  "rep-1": {
    id: "rep-1",
    title: "Sirang Streetlight sa kahabaan ng Quesada Street",
    description:
      "Madilim na bahagi sa gabi at delikado para sa mga estudyante at mamamayang umuuwi mula sa trabaho. May tatlong poste na hindi umiilaw mula noong nakaraang linggo.",
    category: "lighting",
    barangay: "Bagumbayan",
    locationDetails: "Tapat ng dating barangay hall malapit sa kanto ng Quesada St.",
    submittedBy: "Juan Dela Cruz (Verified Resident)",
    status: "in_progress",
    date: "Setyembre 24, 2026",
    upvotes: 19,
    assignedDepartment: "Municipal Engineering Office",
    timeline: [
      {
        title: "Pormal na Naisumite ng Mamamayan",
        departmentOrActor: "Mamamayan (Google Verified Account)",
        timestamp: "Setyembre 24, 2026 • 08:30 AM",
        notes: "Matagumpay na naitala ang ulat sa digital civic system ng Paete.",
        status: "completed",
      },
      {
        title: "Sinuri at Bineripika ng LGU Admin",
        departmentOrActor: "Municipal Command Center",
        timestamp: "Setyembre 24, 2026 • 11:15 AM",
        notes: "Na-validate ang lokasyon at ini-assign ang priority level.",
        status: "completed",
      },
      {
        title: "Kasalukuyang Inaaksyunan sa Field",
        departmentOrActor: "Municipal Engineering Office",
        timestamp: "Setyembre 25, 2026 • 02:40 PM",
        notes: "Nainspeksyon ng electrical maintenance team; nakatakdang palitan ang 100W LED lamp fixture bukas ng umaga.",
        status: "current",
      },
      {
        title: "Pagkumpleto at Paglalagay ng Patunay",
        departmentOrActor: "Municipal Engineering & LGU Inspector",
        timestamp: "Inaasahang petsa: Setyembre 27, 2026",
        notes: "Mag-a-upload ng patunay ng maayos nang ilaw bago pormal na isara ang ticket.",
        status: "upcoming",
      },
    ],
  },
  "rep-2": {
    id: "rep-2",
    title: "Kanal na barado na nagdudulot ng mabagal na pag-agos",
    description:
      "Kailangang masipsip o linisin bago sumapit ang malalakas na buhos ng ulan upang maiwasan ang pag-apaw sa kabahayan.",
    category: "drainage",
    barangay: "Ibaba del Sur",
    locationDetails: "Likod ng multi-purpose hall, Ibaba del Sur",
    submittedBy: "Maria Santos-Reyes (Verified Resident)",
    status: "pending",
    date: "Setyembre 25, 2026",
    upvotes: 12,
    assignedDepartment: "MENRO / Barangay Maintenance",
    timeline: [
      {
        title: "Pormal na Naisumite ng Mamamayan",
        departmentOrActor: "Mamamayan (Google Verified Account)",
        timestamp: "Setyembre 25, 2026 • 10:15 AM",
        notes: "Naipasa ang ulat kasama ang eksaktong lokasyon sa Paete.",
        status: "completed",
      },
      {
        title: "Nakabinbin sa Pagpapasya ng LGU",
        departmentOrActor: "MENRO / Sanitation Department",
        timestamp: "Setyembre 25, 2026 • 02:00 PM",
        notes: "Nasa waiting queue para sa susunod na drainage declogging schedule.",
        status: "current",
      },
    ],
  },
  "rep-3": {
    id: "rep-3",
    title: "Naayos na Pothole sa Kanto ng Pamilihan",
    description:
      "Malaking butas sa gitna ng daanan na nagdudulot ng panganib sa mga nagmomotor at traysikel.",
    category: "road",
    barangay: "Maytoong",
    locationDetails: "Kanto malapit sa Paete Public Market",
    submittedBy: "Roberto Fadul (Verified Resident)",
    status: "resolved",
    date: "Setyembre 22, 2026",
    upvotes: 34,
    assignedDepartment: "Municipal Engineering Office",
    timeline: [
      {
        title: "Pormal na Naisumite ng Mamamayan",
        departmentOrActor: "Mamamayan (Google Verified Account)",
        timestamp: "Setyembre 22, 2026 • 09:00 AM",
        notes: "Nai-post ang litrato at lokasyon ng sirang daan.",
        status: "completed",
      },
      {
        title: "Bineripika at Ininspeksyon",
        departmentOrActor: "Municipal Engineering Office",
        timestamp: "Setyembre 22, 2026 • 01:30 PM",
        notes: "Sinuri ng municipal road maintenance crew ang lalim ng pothole.",
        status: "completed",
      },
      {
        title: "Aktwal na Pagsasaayos sa Field",
        departmentOrActor: "Road Maintenance Crew",
        timestamp: "Setyembre 23, 2026 • 08:30 AM",
        notes: "Nalapatan ng cold-patch asphalt binder at pinatag ang kalsada.",
        status: "completed",
      },
      {
        title: "Opisyal na Nalutas (Resolved)",
        departmentOrActor: "LGU Admin & Barangay Maytoong",
        timestamp: "Setyembre 23, 2026 • 04:00 PM",
        notes: "Pormal nang nalutas at binigyang clearance para sa kaligtasan ng mga motorista.",
        status: "completed",
      },
    ],
  },
};

export default function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const reportId = unwrappedParams.id;

  // Fallback to rep-1 if ID is not in mock DB
  const report = MOCK_REPORTS_DATABASE[reportId] || {
    ...MOCK_REPORTS_DATABASE["rep-1"],
    id: reportId,
    title: `Ulat #${reportId} sa Bayan ng Paete`,
  };

  const [upvotes, setUpvotes] = React.useState(report.upvotes);
  const [hasUpvoted, setHasUpvoted] = React.useState(false);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setUpvotes((prev) => prev + 1);
      setHasUpvoted(true);
    } else {
      setUpvotes((prev) => prev - 1);
      setHasUpvoted(false);
    }
  };

  const statusDisplay: Record<
    DetailedReport["status"],
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    pending: {
      label: "Pending Review",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
      icon: <Clock className="w-4 h-4" />,
    },
    in_progress: {
      label: "Kasalukuyang Inaaksyunan",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/30",
      icon: <Clock className="w-4 h-4" />,
    },
    resolved: {
      label: "Opisyal na Naaksyunan",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    urgent: {
      label: "Kritikal / Public Hazard",
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/30",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
  };

  const status = statusDisplay[report.status];

  return (
    <div className="min-h-screen flex flex-col bg-[#071126] text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/#mga-ulat"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-2 rounded-xl border border-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Bumalik sa Lahat ng mga Ulat</span>
          </Link>
        </div>

        {/* Report Header Card */}
        <section className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#0A1931]/95 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                #{report.id}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${status.bg} ${status.text} ${status.border}`}
              >
                {status.icon}
                <span>{status.label}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleUpvote}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  hasUpvoted
                    ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border-white/10"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{upvotes} Suporta ng Mamamayan</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Kopyado na ang link ng ulat!");
                  }
                }}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors"
                title="I-share ang link ng ulat"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h1 className="text-xl sm:text-3xl font-extrabold font-heading text-white tracking-tight mb-3">
            {report.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
            {report.description}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-5 border-t border-white/10 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 block mb-1">Lokasyon sa Paete</span>
              <div className="flex items-center gap-1.5 font-semibold text-white">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Brgy. {report.barangay}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block line-clamp-1">
                {report.locationDetails}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 block mb-1">Nakatokang Opisina ng LGU</span>
              <div className="flex items-center gap-1.5 font-semibold text-sky-300">
                <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{report.assignedDepartment}</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">
                Pamahalaang Bayan ng Paete
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <span className="text-slate-400 block mb-1">Nag-ulat & Petsa</span>
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
                  {/* Step bullet indicator */}
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

                  {/* Step Content Card */}
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

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {step.notes}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
