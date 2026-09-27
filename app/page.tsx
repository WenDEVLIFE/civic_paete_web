"use client";

import React, { useState } from "react";
import { Navbar } from "../components/navigation/Navbar";
import { HeroSection } from "../components/home/HeroSection";
import {
  ReportCard,
  CommunityReport,
  ReportStatus,
  ReportComment,
} from "../components/reports/ReportCard";
import { SubmitReportModal } from "../components/reports/SubmitReportModal";
import { InsightsSection } from "../components/insights/InsightsSection";
import { Search, PlusCircle, Sparkles, MessageSquare } from "lucide-react";

const INITIAL_REPORTS: CommunityReport[] = [
  {
    id: "rep-1",
    title: "Sirang Streetlight sa kahabaan ng Quesada Street",
    description:
      "Madilim na bahagi sa gabi at delikado para sa mga estudyante at mamamayang umuuwi mula sa trabaho. May tatlong poste na hindi umiilaw.",
    category: "lighting",
    barangay: "Bagumbayan",
    status: "in_progress",
    date: "Setyembre 24, 2026",
    upvotes: 18,
    authorName: "Juan Dela Cruz",
    authorRole: "resident",
    officialNotes: "Nainspeksyon na ng maintenance crew. Nakatakdang palitan ang 100W LED lamp fixture bukas ng umaga.",
    officialActorName: "Engr. Marco Adea",
    officialActorRole: "Municipal Engineering Office",
    comments: [
      {
        id: "c-1",
        authorName: "Maria Santos",
        authorRole: "resident",
        timestamp: "2 araw ang nakalipas",
        content: "Totoo ito, napakadilim diyan lalo na bandang 8 PM paglabas ng mga nagtatrabaho.",
      },
      {
        id: "c-2",
        authorName: "Engr. Marco Adea",
        authorRole: "official",
        timestamp: "Kahapon",
        content: "Noted po. Naka-schedule na ang bucket truck ng bayan para sa maintenance.",
        isOfficial: true,
      },
    ],
  },
  {
    id: "rep-2",
    title: "Kanal na barado na nagdudulot ng mabagal na pag-agos",
    description:
      "Kailangang masipsip o linisin bago sumapit ang malalakas na buhos ng ulan upang maiwasan ang pag-apaw sa mga kalapit na bahay.",
    category: "drainage",
    barangay: "Ibaba del Sur",
    status: "pending",
    date: "Setyembre 25, 2026",
    upvotes: 14,
    authorName: "Aling Corazon Reyes",
    authorRole: "resident",
    comments: [
      {
        id: "c-3",
        authorName: "Roberto Fadul",
        authorRole: "resident",
        timestamp: "1 araw ang nakalipas",
        content: "Dumadaan ako diyan araw-araw, may mga plastic cup na nakabara sa bukana ng culvert.",
      },
    ],
  },
  {
    id: "rep-3",
    title: "Naayos na Pothole sa Kanto ng Pamilihan",
    description:
      "Nalapatan na ng aspalto ng engineering office matapos i-ulat noong nakaraang linggo. Mas ligtas na para sa mga traysikel.",
    category: "road",
    barangay: "Maytoong",
    status: "resolved",
    date: "Setyembre 22, 2026",
    upvotes: 34,
    authorName: "Tricycle Driver Association (TODA Paete)",
    authorRole: "resident",
    officialNotes: "Nalapatan ng cold-patch asphalt noong Sept 23, 2026. Ligtas na at tapos na ang clearing.",
    officialActorName: "Municipal Engineering",
    officialActorRole: "Road Maintenance Division",
    comments: [
      {
        id: "c-4",
        authorName: "Danilo Ramos",
        authorRole: "resident",
        timestamp: "3 araw ang nakalipas",
        content: "Salamat sa mabilis na pag-aksyon ng munisipyo! Hindi na sumasabit ang mga gulong.",
      },
    ],
  },
  {
    id: "rep-4",
    title: "Tambak ng mga sanga at dahon sa gilid ng kalsada",
    description:
      "Mula sa pinutol na punong kahoy, kailangan ng truck para mahakot nang maayos bago makaharang sa paradahan.",
    category: "waste",
    barangay: "Quinale",
    status: "pending",
    date: "Setyembre 26, 2026",
    upvotes: 9,
    authorName: "Elena Cadawas",
    authorRole: "resident",
    comments: [],
  },
  {
    id: "rep-5",
    title: "Nakatagilid na poste ng kuryente malapit sa ilog",
    description:
      "Nangangailangan ng agarang inspeksyon mula sa mga kinauukulan para sa kaligtasan ng mga kalapit na kabahayan dahil sa lumambot na lupa.",
    category: "safety",
    barangay: "Bangkusay",
    status: "urgent",
    date: "Setyembre 26, 2026",
    upvotes: 43,
    authorName: "Kapitan Noel Bernardo",
    authorRole: "resident",
    officialNotes: "Nai-coordinate na sa Meralco Liaison at Provincial Disaster Risk Reduction Team para sa safety cordon.",
    officialActorName: "MDRRMO Paete",
    officialActorRole: "Emergency Response",
    comments: [
      {
        id: "c-5",
        authorName: "Barangay Tanod Team",
        authorRole: "resident",
        timestamp: "Kahapon",
        content: "Naglagay na po kami ng temporary caution tape habang hinihintay ang heavy crew.",
      },
    ],
  },
  {
    id: "rep-6",
    title: "Nalinis na drainage canal sa may Simbahan",
    description:
      "Natanggal na ang mga plastic na nakabara sa daluyan ng tubig matapos ang isinagawang community cleanup drive.",
    category: "drainage",
    barangay: "Ilaya del Norte",
    status: "resolved",
    date: "Setyembre 21, 2026",
    upvotes: 29,
    authorName: "Parish Youth Volunteer",
    authorRole: "resident",
    officialNotes: "Matagumpay na natapos ang joint cleanup drive ng MENRO at volunteers.",
    officialActorName: "Arlene Cadawas",
    officialActorRole: "MENRO Paete",
    comments: [],
  },
];

export default function Home() {
  const [reports, setReports] = useState<CommunityReport[]>(INITIAL_REPORTS);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedBarangay, setSelectedBarangay] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleUpvote = (id: string) => {
    setReports((prev) =>
      prev.map((rep) =>
        rep.id === id ? { ...rep, upvotes: rep.upvotes + 1 } : rep
      )
    );
  };

  const handleStatusChange = (id: string, newStatus: ReportStatus, note?: string) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== id) return rep;
        return {
          ...rep,
          status: newStatus,
          officialNotes: note || rep.officialNotes,
          officialActorName: rep.officialActorName || "LGU Paete Official",
          officialActorRole: rep.officialActorRole || "Pamahalaang Bayan",
        };
      })
    );
  };

  const handleAddComment = (reportId: string, comment: ReportComment) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== reportId) return rep;
        return {
          ...rep,
          comments: [...(rep.comments || []), comment],
        };
      })
    );
  };

  const handleAddReport = (
    newReportData: Omit<CommunityReport, "id" | "date" | "upvotes" | "status">
  ) => {
    const newReport: CommunityReport = {
      ...newReportData,
      id: `rep-${Date.now()}`,
      status: "pending",
      date: "Ngayon lang",
      upvotes: 1,
      authorName: "Mamamayan ng Paete",
      authorRole: "resident",
      comments: [],
    };
    setReports([newReport, ...reports]);
  };

  const filteredReports = reports.filter((rep) => {
    const matchesCategory =
      activeCategory === "all" || rep.category === activeCategory;
    const matchesBarangay =
      selectedBarangay === "all" || rep.barangay === selectedBarangay;
    const matchesSearch =
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.barangay.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesBarangay && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#071126] text-white selection:bg-blue-600 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection onOpenReportModal={() => setIsModalOpen(true)} />

        {/* Community Social Feed Section */}
        <section id="mga-ulat" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Civic Social Feed ng Bayan</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
                Mga Ulat at Talakayan ng Komunidad
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
                Bawat concern ay may verified pipeline, bukas na komento ng mamamayan, at opisyal na disposisyon mula sa Pamahalaang Bayan at Pamunuan ng Laguna.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer self-start md:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Magsumite ng Bagong Ulat</span>
            </button>
          </div>

          {/* Search and Barangay Filters */}
          <div className="bg-[#0A1931]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 mb-8 space-y-4 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              {/* Search input */}
              <div className="md:col-span-8 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Maghanap ng ulat ayon sa pamagat, detalye, o kalye..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Barangay dropdown */}
              <div className="md:col-span-4">
                <select
                  value={selectedBarangay}
                  onChange={(e) => setSelectedBarangay(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A1931] border border-white/10 text-slate-200 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                >
                  <option value="all">Lahat ng Barangay sa Paete</option>
                  <option value="Bagumbayan">Brgy. Bagumbayan</option>
                  <option value="Bangkusay">Brgy. Bangkusay</option>
                  <option value="Ermita">Brgy. Ermita</option>
                  <option value="Ibaba del Norte">Brgy. Ibaba del Norte</option>
                  <option value="Ibaba del Sur">Brgy. Ibaba del Sur</option>
                  <option value="Ilaya del Norte">Brgy. Ilaya del Norte</option>
                  <option value="Ilaya del Sur">Brgy. Ilaya del Sur</option>
                  <option value="Maytoong">Brgy. Maytoong</option>
                  <option value="Quinale">Brgy. Quinale</option>
                </select>
              </div>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-2 shrink-0">
                Kategorya:
              </span>
              {[
                { id: "all", label: "Lahat" },
                { id: "lighting", label: "⚡ Ilaw sa Kalsada" },
                { id: "drainage", label: "🌊 Kanal at Baha" },
                { id: "road", label: "🚧 Kalsada at Pothole" },
                { id: "waste", label: "🗑️ Basura at Kalinisan" },
                { id: "safety", label: "🚨 Kaligtasan ng Publiko" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Social Media Civic Feed Grid */}
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onUpvote={handleUpvote}
                  onStatusChange={handleStatusChange}
                  onAddComment={handleAddComment}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
              <MessageSquare className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
              <p className="text-slate-400 text-sm">
                Walang natagpuang ulat sa kategorya o barangay na ito.
              </p>
            </div>
          )}
        </section>

        {/* Insights Section */}
        <InsightsSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0A1931] py-10 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-semibold text-white">Civic Paete — Bayan ng Paete, Laguna</p>
          <p className="text-[11px] text-slate-500">
            Digital Civic Platform para sa Transparency, Community Verification, at Mabilisang Aksyon ng Pamahalaan.
          </p>
        </div>
      </footer>

      {/* Submit Report Modal */}
      <SubmitReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddReport}
      />
    </div>
  );
}
