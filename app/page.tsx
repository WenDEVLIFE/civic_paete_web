"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "../components/navigation/Navbar";
import { Footer } from "../components/navigation/Footer";
import { HeroSection } from "../components/home/HeroSection";
import {
  ReportCard,
  CommunityReport,
  ReportStatus,
  ReportComment,
} from "../components/reports/ReportCard";
import {
  SubmitReportModal,
  SubmitReportData,
} from "../components/reports/SubmitReportModal";
import { InsightsSection } from "../components/insights/InsightsSection";
import {
  subscribeToReports,
  createReport,
  updateReportStatus,
  addReportComment,
  upvoteReport,
} from "@/lib/services/reportService";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  Search,
  PlusCircle,
  Sparkles,
  MessageSquare,
  MapPin,
  Building2,
  LayoutGrid,
  Zap,
  Droplets,
  Construction,
  Trash2,
  AlertTriangle,
} from "lucide-react";

const INITIAL_REPORTS: CommunityReport[] = [
  {
    id: "rep-1",
    title: "Non-functional Streetlights along Quesada Street",
    description:
      "A dark stretch of road at night creating hazardous transit conditions for students and commuters returning home. Three adjacent lamp posts have been unlit since last week.",
    category: "lighting",
    barangay: "Bagumbayan",
    status: "in_progress",
    date: "September 24, 2026",
    upvotes: 18,
    authorName: "Juan Dela Cruz",
    authorRole: "resident",
    officialNotes: "Inspected by electrical maintenance crew. Scheduled for 100W LED lamp fixture replacement tomorrow morning.",
    officialActorName: "Engr. Marco Adea",
    officialActorRole: "Municipal Engineering Office",
    comments: [
      {
        id: "c-1",
        authorName: "Maria Santos",
        authorRole: "resident",
        timestamp: "2 days ago",
        content: "Corroborated. This corner is completely dark past 8:00 PM when retail staff and students walk home.",
      },
      {
        id: "c-2",
        authorName: "Engr. Marco Adea",
        authorRole: "official",
        timestamp: "Yesterday",
        content: "Logged and scheduled. The municipal electrical bucket truck is queued for this sector.",
        isOfficial: true,
      },
    ],
  },
  {
    id: "rep-2",
    title: "Obstructed Drainage Canal Causing Stormwater Overflow",
    description:
      "Culvert requires immediate clearing before seasonal monsoon downpours to prevent backflow and flash flooding into adjacent residential properties.",
    category: "drainage",
    barangay: "Ibaba del Sur",
    status: "pending",
    date: "September 25, 2026",
    upvotes: 14,
    authorName: "Corazon Reyes",
    authorRole: "resident",
    comments: [
      {
        id: "c-3",
        authorName: "Roberto Fadul",
        authorRole: "resident",
        timestamp: "1 day ago",
        content: "I pass this canal daily; plastic debris and silt are currently blocking the culvert intake.",
      },
    ],
  },
  {
    id: "rep-3",
    title: "Remediated Road Pothole near Public Market Junction",
    description:
      "Asphalt cold-patch applied by municipal engineering following resident reporting last week. Safely passable for tricycles and utility vehicles.",
    category: "road",
    barangay: "Maytoong",
    status: "resolved",
    date: "September 22, 2026",
    upvotes: 34,
    authorName: "Tricycle Driver Association (TODA Paete)",
    authorRole: "resident",
    officialNotes: "Completed cold-patch asphalt remediation on Sept 23, 2026. Area swept and declared safe.",
    officialActorName: "Municipal Engineering",
    officialActorRole: "Road Maintenance Division",
    comments: [
      {
        id: "c-4",
        authorName: "Danilo Ramos",
        authorRole: "resident",
        timestamp: "3 days ago",
        content: "Sincere appreciation for the swift municipal response! Tricycle wheels no longer get caught.",
      },
    ],
  },
  {
    id: "rep-4",
    title: "Solid Waste & Tree Branch Debris along Road Shoulder",
    description:
      "Discarded timber cuttings and uncollected roadside yard debris require heavy collection truck before obstructing municipal parking.",
    category: "waste",
    barangay: "Quinale",
    status: "pending",
    date: "September 26, 2026",
    upvotes: 9,
    authorName: "Elena Cadawas",
    authorRole: "resident",
    comments: [],
  },
  {
    id: "rep-5",
    title: "Tilted Wooden Utility Pole Adjacent to Riverbank",
    description:
      "Requires urgent structural inspection by utility line teams due to severe soil softening following recent riverbank swelling.",
    category: "safety",
    barangay: "Bangkusay",
    status: "urgent",
    date: "September 26, 2026",
    upvotes: 43,
    authorName: "Noel Bernardo",
    authorRole: "resident",
    officialNotes: "Coordinated with Meralco Liaison and Provincial Disaster Risk Reduction Team for safety perimeter cordon.",
    officialActorName: "MDRRMO Paete",
    officialActorRole: "Emergency Response",
    comments: [
      {
        id: "c-5",
        authorName: "Barangay Tanod Team",
        authorRole: "resident",
        timestamp: "Yesterday",
        content: "Temporary caution tape has been cordoned off around the base while awaiting heavy maintenance crew.",
      },
    ],
  },
  {
    id: "rep-6",
    title: "Cleaned Drainage Canal near Parish Church Grounds",
    description:
      "Plastic waste and accumulated silt fully extracted from the drainage canal following joint community cleanup drive.",
    category: "drainage",
    barangay: "Ilaya del Norte",
    status: "resolved",
    date: "September 21, 2026",
    upvotes: 29,
    authorName: "Parish Youth Volunteer",
    authorRole: "resident",
    officialNotes: "Joint cleanup drive successfully concluded by MENRO and community volunteers.",
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Sync auth state for report attribution
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubAuth();
  }, []);

  // Live Firestore subscription for community reports
  useEffect(() => {
    const unsubscribe = subscribeToReports(
      {
        barangay: selectedBarangay !== "all" ? selectedBarangay : undefined,
        category: activeCategory !== "all" ? activeCategory : undefined,
      },
      (liveReports) => {
        setReports(liveReports);
      }
    );

    return () => unsubscribe();
  }, [selectedBarangay, activeCategory]);

  const handleUpvote = async (id: string) => {
    setReports((prev) =>
      prev.map((rep) =>
        rep.id === id ? { ...rep, upvotes: rep.upvotes + 1 } : rep
      )
    );
    try {
      await upvoteReport(id, 1);
    } catch (err) {
      console.warn("Failed to register upvote in Firestore:", err);
    }
  };

  const handleStatusChange = async (id: string, newStatus: ReportStatus, note?: string) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== id) return rep;
        return {
          ...rep,
          status: newStatus,
          officialNotes: note || rep.officialNotes,
          officialActorName: rep.officialActorName || "Paete LGU Official",
          officialActorRole: rep.officialActorRole || "Municipal Government",
        };
      })
    );
    try {
      await updateReportStatus(id, newStatus, note);
    } catch (err) {
      console.warn("Failed to update status in Firestore:", err);
    }
  };

  const handleAddComment = async (reportId: string, comment: ReportComment) => {
    setReports((prev) =>
      prev.map((rep) => {
        if (rep.id !== reportId) return rep;
        return {
          ...rep,
          comments: [...(rep.comments || []), comment],
        };
      })
    );
    try {
      await addReportComment(reportId, comment);
    } catch (err) {
      console.warn("Failed to save comment to Firestore:", err);
    }
  };

  const handleAddReport = async (newReportData: SubmitReportData) => {
    let authorName: string | undefined = undefined;
    let authorAvatar: string | undefined = undefined;
    let authorRole: "resident" | "official" | "governor" = "resident";

    if (!newReportData.isAnonymous) {
      if (currentUser) {
        authorName = currentUser.displayName || currentUser.email?.split("@")[0] || "Verified Resident";
        authorAvatar = currentUser.photoURL || undefined;
      } else {
        authorName = "Paete Resident";
      }
    }

    try {
      await createReport({
        title: newReportData.title,
        description: newReportData.description,
        category: newReportData.category as any,
        barangay: newReportData.barangay,
        locationDetail: newReportData.locationDetail,
        imageFile: newReportData.imageFile,
        imageUrl: newReportData.imageUrl,
        isAnonymous: newReportData.isAnonymous,
        anonymousAlias: newReportData.anonymousAlias,
        authorUid: currentUser?.uid,
        authorName,
        authorAvatar,
        authorRole,
      });
    } catch (err) {
      console.error("Failed to create community report in Firestore:", err);
      throw err;
    }
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
        <section id="community-reports" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Municipal Civic Feed</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading text-white">
                Community Reports & Civic Action Feed
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl font-sans">
                Every verified issue is tracked through a public lifecycle pipeline with citizen discussions and official dispositions from the Municipality of Paete and Provincial Government of Laguna.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer self-start md:self-auto min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Community Report</span>
            </button>
          </div>

          {/* Search and Barangay Filters */}
          <div className="bg-[#0A1931]/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 mb-8 space-y-4 shadow-xl">
            {/* Search input — full width */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                id="feed-search-input"
                placeholder="Search community reports by title, street, landmark, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-all min-h-[44px]"
              />
            </div>

            {/* Barangay chip-row */}
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block mb-2">
                Paete Barangay:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {[
                  { value: "all", label: "All Barangays" },
                  { value: "Bagumbayan", label: "Bagumbayan" },
                  { value: "Bangkusay", label: "Bangkusay" },
                  { value: "Ermita", label: "Ermita" },
                  { value: "Ibaba del Norte", label: "Ibaba del Norte" },
                  { value: "Ibaba del Sur", label: "Ibaba del Sur" },
                  { value: "Ilaya del Norte", label: "Ilaya del Norte" },
                  { value: "Ilaya del Sur", label: "Ilaya del Sur" },
                  { value: "Maytoong", label: "Maytoong" },
                  { value: "Quinale", label: "Quinale" },
                ].map((brgy) => {
                  const isSelected = selectedBarangay === brgy.value;
                  return (
                    <button
                      key={brgy.value}
                      id={"barangay-filter-" + brgy.value}
                      type="button"
                      onClick={() => setSelectedBarangay(brgy.value)}
                      className={[
                        "px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer text-xs min-h-[40px] flex items-center gap-1.5",
                        isSelected
                          ? "bg-red-500/20 text-red-300 border border-red-500/30 shadow-sm"
                          : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5",
                      ].join(" ")}
                    >
                      {brgy.value === "all" ? (
                        <Building2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
                      ) : (
                        <MapPin className="w-3 h-3 text-red-400/80 shrink-0" />
                      )}
                      <span>{brgy.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category chip-row */}
            <div>
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] block mb-2">
                Category:
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
                {[
                  { id: "all", label: "All Categories", icon: LayoutGrid },
                  { id: "lighting", label: "Streetlights & Power", icon: Zap },
                  { id: "drainage", label: "Drainage & Flooding", icon: Droplets },
                  { id: "road", label: "Roads & Potholes", icon: Construction },
                  { id: "waste", label: "Solid Waste", icon: Trash2 },
                  { id: "safety", label: "Public Safety", icon: AlertTriangle },
                ].map((cat) => {
                  const isSelected = activeCategory === cat.id;
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      id={"category-filter-" + cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id)}
                      className={[
                        "px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer min-h-[40px] flex items-center gap-1.5",
                        isSelected
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5",
                      ].join(" ")}
                    >
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-white" : "text-blue-400"}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active filter summary */}
            {(selectedBarangay !== "all" || activeCategory !== "all" || searchQuery) && (
              <div className="flex items-center gap-2 pt-2 border-t border-white/5 flex-wrap">
                <span className="text-[11px] text-slate-500 shrink-0">Active Filters:</span>
                {selectedBarangay !== "all" && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-red-500/10 text-red-300 border border-red-500/20">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                    <span>{selectedBarangay}</span>
                    <button type="button" onClick={() => setSelectedBarangay("all")} className="ml-1 hover:text-white cursor-pointer" aria-label="Clear barangay filter">×</button>
                  </span>
                )}
                {activeCategory !== "all" && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    <span className="capitalize">{activeCategory}</span>
                    <button type="button" onClick={() => setActiveCategory("all")} className="ml-1 hover:text-white cursor-pointer" aria-label="Clear category filter">×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-slate-300 border border-white/10">
                    &ldquo;{searchQuery}&rdquo;
                    <button type="button" onClick={() => setSearchQuery("")} className="ml-1 hover:text-white cursor-pointer" aria-label="Clear search query">×</button>
                  </span>
                )}
              </div>
            )}
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
                No reports found matching the selected category, barangay, or search query.
              </p>
            </div>
          )}
        </section>

        {/* Insights Section */}
        <InsightsSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Submit Report Modal */}
      <SubmitReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddReport}
      />
    </div>
  );
}
