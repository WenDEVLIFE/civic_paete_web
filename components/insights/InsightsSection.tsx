import { BarChart3, TrendingUp, Lightbulb, ShieldAlert } from "lucide-react";

export function InsightsSection() {
  const recommendations = [
    {
      id: "rec-1",
      trigger: "5 recurring streetlight failure reports within 7 days",
      location: "Brgy. Bagumbayan (J. Rizal St. Corridor)",
      action: "Recommended: Conduct comprehensive electrical circuit diagnosis and replace aged overhead wiring along the street sector.",
      priority: "High Priority",
      category: "Streetlights & Power",
    },
    {
      id: "rec-2",
      trigger: "Recurring solid waste accumulation every Friday afternoon",
      location: "Brgy. Maytoong (Public Market Perimeter)",
      action: "Recommended: Deploy dedicated auxiliary collection vehicle on Friday afternoons and station barangay environmental marshals.",
      priority: "Moderate Priority",
      category: "Solid Waste & Sanitation",
    },
  ];

  return (
    <section id="insights" className="py-16 lg:py-24 border-t border-white/10 bg-[#071126]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Data-Driven Decision Support</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-heading">
              Automated Civic Recommendations
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl font-sans">
              Generated from incident clustering across Paete barangays to assist municipal departments in resource allocation and preemptive maintenance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Rule-Based Analytical Engine</span>
          </div>
        </div>

        {/* Recommendations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-6 rounded-2xl border border-white/10 bg-[#0A1931]/80 hover:border-blue-400/40 transition-all duration-200 relative overflow-hidden"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 text-blue-300 border border-white/10">
                  {rec.category}
                </span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1 font-heading">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  {rec.priority}
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-heading mb-1">
                {rec.location}
              </h3>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 my-3 text-xs text-slate-300 font-sans">
                <span className="font-semibold text-slate-400 block mb-0.5">Detected Pattern:</span>
                {rec.trigger}
              </div>

              <div className="flex items-start gap-2.5 text-sm text-slate-200 font-sans">
                <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{rec.action}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
