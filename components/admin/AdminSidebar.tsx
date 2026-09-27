"use client";

import React from "react";
import Link from "next/link";
import { CivicPaeteLogo } from "@/components/brand/CivicPaeteLogo";
import {
  Shield,
  FileText,
  Users,
  History,
  BarChart3,
  Landmark,
  LogOut,
  ExternalLink,
  X,
  Sparkles,
  HardHat,
} from "lucide-react";

export type AdminTab = "overview" | "reports" | "users" | "audit" | "provincial";

interface AdminUserSession {
  name: string;
  email: string;
  role: "admin" | "governor";
  office: string;
  barangayOrOffice: string;
}

interface AdminSidebarProps {
  currentUser: AdminUserSession | null;
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  reportsCount: number;
  usersCount: number;
  auditCount: number;
  urgentCount: number;
  onLogout: () => void;
  isLoggingOut: boolean;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function AdminSidebar({
  currentUser,
  activeTab,
  setActiveTab,
  reportsCount,
  usersCount,
  auditCount,
  urgentCount,
  onLogout,
  isLoggingOut,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) {
  const isGovernor = currentUser?.role === "governor";

  const navItems: {
    id: AdminTab;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: "overview",
      label: "Overview & Analytics",
      description: "Executive radar & civic metrics",
      icon: BarChart3,
    },
    {
      id: "reports",
      label: "Community Reports",
      description: "Triage & official dispositions",
      icon: FileText,
      badge: reportsCount,
      badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    {
      id: "users",
      label: "Officials & Directory",
      description: "Staff & verified citizens",
      icon: Users,
      badge: usersCount,
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      id: "audit",
      label: "Audit Trail & Logs",
      description: "Immutable government records",
      icon: History,
      badge: auditCount,
      badgeColor: "bg-slate-500/20 text-slate-300 border-slate-500/30",
    },
  ];

  if (isGovernor) {
    navItems.splice(1, 0, {
      id: "provincial",
      label: "Laguna Provincial Oversight",
      description: "Inter-LGU & emergency alerts",
      icon: Landmark,
      badge: urgentCount,
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    });
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0A1931] border-r border-white/10 text-white select-none">
      {/* Top Header Branding */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          <CivicPaeteLogo size="md" variant="full" theme="dark" />
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              isGovernor
                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                : "bg-blue-500/10 border-blue-500/30 text-blue-300"
            }`}
          >
            {isGovernor ? (
              <>
                <Landmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Provincial Executive Command</span>
              </>
            ) : (
              <>
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Municipal Operations Console</span>
              </>
            )}
          </div>
        </div>

        {/* Close Button on Mobile Drawer */}
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Official Identity Card */}
      <div className="p-4 mx-3 my-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-md font-heading ${
              isGovernor
                ? "bg-amber-600/30 text-amber-300 border border-amber-500/40"
                : "bg-blue-600/30 text-blue-300 border border-blue-500/40"
            }`}
          >
            {isGovernor ? "PG" : "MA"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white truncate font-heading">
                {currentUser?.name || (isGovernor ? "Hon. Provincial Governor" : "Municipal Administrator")}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate font-mono">
              {currentUser?.email || (isGovernor ? "governor@laguna.gov.ph" : "admin@paete.gov.ph")}
            </div>
            <div className="text-[10px] text-slate-500 truncate mt-0.5">
              {currentUser?.office || (isGovernor ? "Office of the Governor - Laguna" : "Office of the Municipal Mayor")}
            </div>
          </div>
        </div>

        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-medium">Auth Session Active</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {isGovernor ? "LAGUNA-HQ" : "PAETE-LGU"}
          </span>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Main Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all group cursor-pointer min-h-[44px] ${
                isActive
                  ? isGovernor
                    ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                    : "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                  : "text-slate-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-1.5 rounded-lg ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-white/5 text-slate-400 group-hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate leading-tight font-heading">
                    {item.label}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? "text-white/80" : "text-slate-400"
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {typeof item.badge === "number" && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isActive
                      ? "bg-white/20 text-white border-white/30"
                      : item.badgeColor || "bg-white/10 text-slate-300 border-white/10"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Governor Directive Alert Hint */}
        {isGovernor && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 font-heading">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Provincial Directives</span>
            </div>
            <p className="text-[10px] text-amber-200/90 leading-snug font-sans">
              Critical hazards and clustered municipal incidents in Paete are elevated for provincial coordination.
            </p>
          </div>
        )}
      </div>

      {/* Transparency & Public Audits */}
      <div className="px-3 py-2 border-t border-white/10 space-y-1">
        <div className="px-3 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center justify-between">
          <span>Transparency & Audits</span>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/10 border border-amber-400/20 text-amber-300 font-mono">
            LIVE HUB
          </span>
        </div>
        <Link
          href="/transparency/projects"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all min-h-[36px]"
        >
          <HardHat className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Public Works & Budget Audit</span>
        </Link>
        <Link
          href="/transparency/officials"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all min-h-[36px]"
        >
          <Landmark className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Officials & Governance Directory</span>
        </Link>
        <Link
          href="/transparency/reports"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-all min-h-[36px]"
        >
          <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Open Data & Civic Metrics</span>
        </Link>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-white/10 space-y-2 bg-[#071126]/60">
        <Link
          href="/"
          className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all min-h-[44px]"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span>Citizen Portal</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Public View</span>
        </Link>

        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 hover:text-red-200 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
        >
          <LogOut className="w-4 h-4 text-red-400" />
          <span>{isLoggingOut ? "Ending Session..." : "Sign Out of Console"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-over Drawer Panel */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
