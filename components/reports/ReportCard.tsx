import React from "react";
import {
  MapPin,
  Calendar,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ThumbsUp,
} from "lucide-react";

export type ReportStatus = "urgent" | "pending" | "in_progress" | "resolved";

export interface CommunityReport {
  id: string;
  title: string;
  description: string;
  category: "waste" | "lighting" | "road" | "drainage" | "safety";
  barangay: string;
  status: ReportStatus;
  date: string;
  upvotes: number;
}

interface ReportCardProps {
  report: CommunityReport;
  onUpvote?: (id: string) => void;
}

export function ReportCard({ report, onUpvote }: ReportCardProps) {
  const statusConfig: Record<
    ReportStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    urgent: {
      label: "Kritikal / Aksyon Agad",
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
    },
    pending: {
      label: "Binasang Ulat",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    in_progress: {
      label: "Kasalukuyang Inaaksyunan",
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      icon: <Clock className="w-3.5 h-3.5" />,
    },
    resolved: {
      label: "Naaksyunan Na",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
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

  const status = statusConfig[report.status];

  return (
    <article className="group relative flex flex-col justify-between p-5 rounded-2xl border border-white/10 bg-[#0A1931]/70 hover:bg-[#0A1931]/95 hover:border-blue-500/40 transition-all duration-200 shadow-sm backdrop-blur-sm">
      <div>
        {/* Header Meta: Category + Status Badge */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
            {categoryLabels[report.category]}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.bg} ${status.text} ${status.border}`}
          >
            {status.icon}
            <span>{status.label}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1 mb-2 font-heading">
          {report.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
          {report.description}
        </p>
      </div>

      {/* Footer Meta: Barangay, Date, and Upvotes */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span>Brgy. {report.barangay}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-slate-400">
            <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
            <span>{report.date}</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onUpvote?.(report.id)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-blue-600/20 hover:text-blue-300 text-slate-300 border border-white/5 hover:border-blue-500/30 transition-all active:scale-95"
          title="Suportahan ang ulat na ito"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span className="font-semibold">{report.upvotes}</span>
        </button>
      </div>
    </article>
  );
}
