"use client";

import React, { useState } from "react";
import { Navbar } from "../components/navigation/Navbar";
import { HeroSection } from "../components/home/HeroSection";
import { ReportCard, CommunityReport } from "../components/reports/ReportCard";
import { SubmitReportModal } from "../components/reports/SubmitReportModal";
import { InsightsSection } from "../components/insights/InsightsSection";
import { Search, PlusCircle } from "lucide-react";

const INITIAL_REPORTS: CommunityReport[] = [
  {
    id: "rep-1",
    title: "Sirang Streetlight sa kahabaan ng Quesada Street",
    description: "Madilim na bahagi sa gabi at delikado para sa mga estudyante at mamamayang umuuwi mula sa trabaho.",
    category: "lighting",
    barangay: "Bagumbayan",
    status: "in_progress",
    date: "Setyembre 24, 2026",
    upvotes: 18,
  },
  {
    id: "rep-2",
    title: "Kanal na barado na nagdudulot ng mabagal na pag-agos",
    description: "Kailangang masipsip o linisin bago sumapit ang malalakas na buhos ng ulan upang maiwasan ang pag-apaw.",
    category: "drainage",
    barangay: "Ibaba del Sur",
    status: "pending",
    date: "Setyembre 25, 2026",
    upvotes: 12,
  },
  {
    id: "rep-3",
    title: "Naayos na Pothole sa Kanto ng Pamilihan",
    description: "Nalapatan na ng aspalto ng engineering office matapos i-ulat noong nakaraang linggo.",
    category: "road",
    barangay: "Maytoong",
    status: "resolved",
    date: "Setyembre 22, 2026",
    upvotes: 34,
  },
  {
    id: "rep-4",
    title: "Tambak ng mga sanga at dahon sa gilid ng kalsada",
    description: "Mula sa pinutol na punong kahoy, kailangan ng truck para mahakot nang maayos.",
    category: "waste",
    barangay: "Quinale",
    status: "pending",
    date: "Setyembre 26, 2026",
    upvotes: 7,
  },
  {
    id: "rep-5",
    title: "Nakatagilid na poste ng kuryente malapit sa ilog",
    description: "Nangangailangan ng agarang inspeksyon mula sa mga kinauukulan para sa kaligtasan ng mga kalapit na kabahayan.",
    category: "safety",
    barangay: "Bangkusay",
    status: "urgent",
    date: "Setyembre 26, 2026",
    upvotes: 41,
  },
  {
    id: "rep-6",
    title: "Nalinis na drainage canal sa may Simbahan",
    description: "Natanggal na ang mga plastic na nakabara sa daluyan ng tubig.",
    category: "drainage",
    barangay: "Ilaya del Norte",
    status: "resolved",
    date: "Setyembre 21, 2026",
    upvotes: 29,
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

  const handleAddReport = (
    newReportData: Omit<CommunityReport, "id" | "date" | "upvotes" | "status">
  ) => {
    const newReport: CommunityReport = {
      ...newReportData,
      id: `rep-${Date.now()}`,
      status: "pending",
      date: "Ngayon lang",
      upvotes: 1,
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

        {/* Live Community Reports Feed */}
        <section id="mga-ulat" className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>Live Feed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading">
                Mga Ulat ng Komunidad sa Paete
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Subaybayan ang mga aktibong ulat mula sa 9 na barangay ng ating bayan.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-600/30 transition-all self-start md:self-auto"
            >
              <PlusCircle className="w-4 h-4 text-sky-200" />
              <span>Magsumite ng Bagong Ulat</span>
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="p-4 rounded-2xl bg-[#0A1931]/90 border border-white/10 mb-8 space-y-3.5 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Maghanap ng ulat, kalye, o problema..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Barangay Filter */}
              <div className="sm:w-60">
                <select
                  value={selectedBarangay}
                  onChange={(e) => setSelectedBarangay(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs sm:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="all" className="bg-[#0A1931]">
                    Lahat ng Barangay (9)
                  </option>
                  <option value="Bagumbayan" className="bg-[#0A1931]">Brgy. Bagumbayan</option>
                  <option value="Bangkusay" className="bg-[#0A1931]">Brgy. Bangkusay</option>
                  <option value="Ermita" className="bg-[#0A1931]">Brgy. Ermita</option>
                  <option value="Ibaba del Norte" className="bg-[#0A1931]">Brgy. Ibaba del Norte</option>
                  <option value="Ibaba del Sur" className="bg-[#0A1931]">Brgy. Ibaba del Sur</option>
                  <option value="Ilaya del Norte" className="bg-[#0A1931]">Brgy. Ilaya del Norte</option>
                  <option value="Ilaya del Sur" className="bg-[#0A1931]">Brgy. Ilaya del Sur</option>
                  <option value="Maytoong" className="bg-[#0A1931]">Brgy. Maytoong</option>
                  <option value="Quinale" className="bg-[#0A1931]">Brgy. Quinale</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: "Lahat ng Kategorya" },
                { id: "lighting", label: "Ilaw sa Kalsada" },
                { id: "road", label: "Kalsada at Pothole" },
                { id: "drainage", label: "Kanal at Baha" },
                { id: "waste", label: "Kalinisan at Basura" },
                { id: "safety", label: "Kaligtasan" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reports Grid */}
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onUpvote={handleUpvote}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl border border-white/10 bg-white/[0.02]">
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
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-heading">CIVIC PAETE</span>
            <span>—</span>
            <span>Pamahalaang Bayan ng Paete, Laguna</span>
          </div>
          <p>© 2026 Civic Paete Research & Development. Lahat ng karapatan ay nakalaan.</p>
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
