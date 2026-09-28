"use client";

import React, { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Lightbulb, ShieldAlert, Layers } from "lucide-react";
import {
  subscribeToCivicInsights,
  BASELINE_RECOMMENDATIONS,
  type CivicRecommendation,
} from "@/lib/services/insightService";

export function InsightsSection() {
  const [recommendations, setRecommendations] =
    useState<CivicRecommendation[]>(BASELINE_RECOMMENDATIONS);

  useEffect(() => {
    const unsubscribe = subscribeToCivicInsights((recs) => {
      if (recs && recs.length > 0) {
        setRecommendations(recs);
      }
    });

    return () => unsubscribe();
  }, []);

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
              Rule-based heuristic clustering across Paete barangays to assist municipal departments in resource allocation, rapid remediation, and preemptive maintenance.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Traditional Rule Engine (PROJECT.MD Sec. 7)</span>
          </div>
        </div>

        {/* Recommendations Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-6 rounded-2xl border border-white/10 bg-[#0A1931]/80 hover:border-blue-400/40 transition-all duration-200 relative overflow-hidden flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white/5 text-blue-300 border border-white/10">
                    {rec.category}
                  </span>
                  <span
                    className={`text-xs font-bold flex items-center gap-1 font-heading px-2 py-0.5 rounded ${
                      rec.priority === "High Priority"
                        ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                        : "text-blue-300 bg-blue-500/10 border border-blue-500/20"
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    {rec.priority}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white font-heading mb-1">
                  {rec.location}
                </h3>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 my-3 text-xs text-slate-300 font-sans">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-slate-400">Trigger Heuristic:</span>
                    {rec.reportCount && rec.reportCount > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {rec.reportCount} reports
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">{rec.trigger}</p>
                </div>

                <div className="flex items-start gap-2.5 text-sm text-slate-200 font-sans">
                  <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-xs sm:text-sm">{rec.action}</p>
                </div>
              </div>

              {rec.generatedAt && (
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Evaluated: {rec.generatedAt}</span>
                  <span className="text-slate-400">Brgy. {rec.barangay}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
