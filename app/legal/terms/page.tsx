import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldAlert,
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Scale,
  Building2,
  ArrowLeft,
  Gavel,
  ShieldCheck,
  EyeOff,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms and Conditions | Civic Paete",
  description:
    "Official Terms and Conditions, Community Guidelines, and Municipal Response Service Level Agreements (SLAs) for the Civic Paete platform.",
};

// ─── Section Data ─────────────────────────────────────────────────────────────

interface TermsSection {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge?: string;
  content?: string[];
  list?: string[];
  allowed?: { label: string; items: string[] };
  prohibited?: { label: string; items: string[] };
  slas?: { tier: string; time: string; scope: string; penalty: string }[];
}

const SECTIONS: TermsSection[] = [
  {
    id: "acceptance",
    icon: FileCheck2,
    title: "1. Acceptance of Terms & Civic Charter",
    badge: "Binding Agreement",
    content: [
      "By accessing, registering, or submitting reports through Civic Paete, you agree to be legally bound by these Terms and Conditions and all municipal guidelines incorporated herein.",
      "Civic Paete is the official digital civic engagement and infrastructure monitoring platform of the Municipal Government of Paete, Province of Laguna, created to promote good local governance, public works accountability, and responsive municipal services.",
    ],
  },
  {
    id: "eligibility",
    icon: Building2,
    title: "2. User Eligibility & Representation",
    badge: "Resident & Official",
    list: [
      "Registered residents, property owners, and business operators within the Municipality of Paete, Laguna.",
      "Accredited municipal employees, barangay officials, department heads, and provincial coordinators.",
      "Accredited civic researchers, educational institutions, and public interest journalists.",
      "Users must be at least 18 years of age, or have the express consent and supervision of a parent or legal guardian.",
    ],
  },
  {
    id: "community-guidelines",
    icon: ShieldCheck,
    title: "3. Community Conduct & Guidelines",
    badge: "Public Conduct",
    content: [
      "Civic Paete is dedicated to constructive, evidence-based civic discourse. Users are expected to maintain civil communication and submit verified observations.",
    ],
    allowed: {
      label: "Permitted & Encouraged Activities",
      items: [
        "Filing genuine, fact-based reports regarding roads, drainage, lighting, sanitation, and safety.",
        "Providing high-resolution photographic evidence and accurate street or landmark tags.",
        "Constructively engaging with municipal action logs and endorsing community issues via upvotes.",
        "Activating Identity Shield to preserve personal privacy while reporting sensitive municipal hazards.",
      ],
    },
    prohibited: {
      label: "Strictly Prohibited Violations",
      items: [
        "Submitting falsified, staged, or duplicate claims to harass officials or fellow residents.",
        "Uploading defamatory, obscene, sexually explicit, or hate-speech media attachments.",
        "Attempting to spam, DDoS, or reverse-engineer platform authentication tokens.",
        "Posting commercial advertisements, electioneering propaganda, or unrelated solicitation.",
      ],
    },
  },
  {
    id: "fraud-liability",
    icon: Gavel,
    title: "4. Liability for Malicious & False Reports",
    badge: "Statutory Liability",
    content: [
      "Civic Paete upholds zero tolerance for malicious disinformation. The submission of knowingly false emergencies or fraudulent infrastructure complaints constitutes a serious municipal and criminal offense:",
    ],
    list: [
      "Article 154 of the Revised Penal Code (Unlawful Use of Means of Publication and Unlawful Utterances): Criminal liability applies to anyone knowingly disseminating false news that endangers public order.",
      "Republic Act No. 10175 (Cybercrime Prevention Act of 2012): Computer-related forgery and online fraud penalties apply to deliberately manipulated digital records.",
      "Municipal Sanctions: Permanent suspension of digital reporting privileges and immediate referral to the Paete Municipal Police Station (PNP) and Municipal Legal Office.",
    ],
  },
  {
    id: "response-slas",
    icon: Clock,
    title: "5. Official Municipal Response SLAs",
    badge: "Mandatory Standards",
    content: [
      "Pursuant to Republic Act No. 11032 (Ease of Doing Business and Efficient Government Service Delivery Act of 2018), municipal departments are bound by strict response timeframes:",
    ],
    slas: [
      {
        tier: "Critical / Emergency Hazard",
        time: "< 24 Hours",
        scope: "Downed live electric wires, hazardous bridge structural cracks, chemical spills, burst water mains.",
        penalty: "Immediate MDRRMO alert and direct dispatch notification to Municipal Mayor.",
      },
      {
        tier: "Urgent Public Works",
        time: "< 48 Hours",
        scope: "Obstructed storm canals causing residential flooding, streetlight outages on major thoroughfares.",
        penalty: "Priority routing to Municipal Engineer and Sangguniang Barangay.",
      },
      {
        tier: "Routine Service & Sanitation",
        time: "3 to 5 Business Days",
        scope: "Uncollected roadside foliage, pothole repairs on secondary barangay roads, noise complaints.",
        penalty: "Weekly docket review during Executive Municipal Committee meetings.",
      },
    ],
  },
  {
    id: "whistleblower-shield",
    icon: EyeOff,
    title: "6. Anonymous Reporting & Whistleblower Shield",
    badge: "Feature 6 & 11",
    content: [
      "Residents reporting governance irregularities, procurement anomalies, or high-risk public hazards may enable the 'Identity Shield' option.",
      "When enabled, your public profile displays only an opaque pseudonym (e.g., 'Protected Citizen #104'). Real authenticated user IDs are securely stored in encrypted, air-gapped audit logs accessible only by the Municipal Legal Counsel pursuant to formal court orders.",
    ],
  },
  {
    id: "intellectual-property",
    icon: Scale,
    title: "7. Intellectual Property & Open Data",
    badge: "Open Data Commons",
    list: [
      "Resident Content License: By posting reports, you grant the Municipal Government of Paete a non-exclusive, royalty-free license to use, reproduce, and publish photos and descriptions for public works assessment.",
      "Open Data Commons: De-identified statistical metrics, monthly resolution rates, and project histories are published under the Open Data Commons Public Domain Dedication (PDDL).",
      "Municipal Seal & Trademarks: The official seal and brand assets of the Municipality of Paete remain the exclusive intellectual property of the LGU and cannot be used without prior written authorization.",
    ],
  },
  {
    id: "amendments",
    icon: ShieldAlert,
    title: "8. Amendments & Jurisdictional Venue",
    badge: "Legal Venue",
    content: [
      "The Municipal Government of Paete reserves the right to amend these Terms to reflect legislative changes, executive orders, or system enhancements. Significant updates will be published with thirty (30) days notice.",
      "Any legal disputes arising from the interpretation of these terms shall be submitted exclusively to the competent courts of the Province of Laguna, Region IV-A, Republic of the Philippines.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  const effectiveDate = "September 27, 2026";

  return (
    <div className="min-h-screen bg-[#071126] text-[#F1F5F9] font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Paete Woodcarving Motif Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-[#2563EB] to-amber-500" />

      {/* Header Bar */}
      <header className="border-b border-white/10 bg-[#0A1931]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 transition-all active:scale-[0.98] min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-[#60A5FA]" />
              <span>Back to Civic Portal</span>
            </Link>
            <span className="hidden sm:inline text-xs text-slate-500">|</span>
            <span className="hidden sm:inline text-xs font-semibold text-slate-400 uppercase tracking-wider font-heading">
              Office of the Municipal Legal Counsel
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/legal/privacy"
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-medium transition-all min-h-[44px] flex items-center"
            >
              Privacy Policy
            </Link>
            <Link
              href="/legal/safety"
              className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-semibold transition-all min-h-[44px] flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Whistleblower Protection
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b border-white/10 bg-gradient-to-b from-[#0A1931] via-[#071126] to-[#071126] pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-amber-500/15 border border-amber-500/30 text-amber-300 mb-6">
              <Gavel className="w-4 h-4 text-amber-400" />
              <span>Municipal Ordinance No. 2026-08 &bull; Republic Act No. 11032</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Terms of Service
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-6">
              Official operating charter and community standards of Civic Paete. Understand resident reporting rights,
              anti-defamation rules, municipal response guarantees, and legal liabilities.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-[#60A5FA]" /> Effective Date: {effectiveDate}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-amber-400">
                <AlertTriangle className="w-3.5 h-3.5" /> False Report Penalties Enforced
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> 48-Hour SLA Guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar TOC */}
          <aside className="lg:col-span-1 lg:sticky lg:top-28 space-y-4">
            <div className="p-5 rounded-2xl bg-[#0A1931] border border-white/10 shadow-xl backdrop-blur-md">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 font-heading">
                Document Sections
              </h3>
              <nav className="space-y-1" aria-label="Table of Contents">
                {SECTIONS.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all group min-h-[40px]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-amber-400 transition-colors" />
                    <span className="truncate">{sec.title}</span>
                  </a>
                ))}
              </nav>

              <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block font-heading">
                  Legal Assistance Office
                </span>
                <p className="text-xs text-slate-300 leading-snug">
                  Paete Municipal Hall, 2nd Floor, Room 204
                </p>
                <p className="text-xs text-slate-400 font-mono">legal@paete.gov.ph</p>
              </div>
            </div>
          </aside>

          {/* Section Body */}
          <div className="lg:col-span-3 space-y-8">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <section
                  key={sec.id}
                  id={sec.id}
                  className="p-6 sm:p-8 rounded-2xl bg-[#112347]/50 border border-white/10 hover:border-white/20 transition-all backdrop-blur-sm shadow-xl"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h2
                        className="text-lg sm:text-xl font-bold text-white tracking-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {sec.title}
                      </h2>
                    </div>
                    {sec.badge && (
                      <span className="text-[11px] font-semibold font-mono px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                        {sec.badge}
                      </span>
                    )}
                  </div>

                  {sec.content && (
                    <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {sec.content.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  )}

                  {/* Allowed / Prohibited Split */}
                  {(sec.allowed || sec.prohibited) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                      {sec.allowed && (
                        <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-heading flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            {sec.allowed.label}
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                            {sec.allowed.items.map((item, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sec.prohibited && (
                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
                          <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider font-heading flex items-center gap-1.5">
                            <XCircle className="w-4 h-4" />
                            {sec.prohibited.label}
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                            {sec.prohibited.items.map((item, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bullet lists */}
                  {sec.list && (
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc list-inside bg-[#0A1931]/60 p-4 rounded-xl border border-white/5">
                      {sec.list.map((li, lIdx) => (
                        <li key={lIdx} className="leading-relaxed">
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* SLAs Table */}
                  {sec.slas && (
                    <div className="overflow-x-auto mt-4">
                      <table className="w-full text-left text-xs border border-white/10 rounded-xl overflow-hidden">
                        <thead className="bg-[#0A1931] text-slate-400 uppercase font-heading text-[11px]">
                          <tr>
                            <th className="p-3 border-b border-white/10">Priority Tier</th>
                            <th className="p-3 border-b border-white/10">Mandatory SLA</th>
                            <th className="p-3 border-b border-white/10">Applicable Scope</th>
                            <th className="p-3 border-b border-white/10">Action Mechanism</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-[#071126]/60">
                          {sec.slas.map((s, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.02]">
                              <td className="p-3 font-semibold text-white">{s.tier}</td>
                              <td className="p-3 font-mono font-bold text-amber-300">{s.time}</td>
                              <td className="p-3 text-slate-300">{s.scope}</td>
                              <td className="p-3 text-slate-400 text-[11px]">{s.penalty}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              );
            })}

            {/* Bottom Citation */}
            <div className="p-6 rounded-2xl bg-[#0A1931]/60 border border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>
                Civic Paete &bull; Document Reference: <span className="font-mono text-slate-300">CP-TERMS-2026-V1</span>
              </p>
              <div className="flex items-center gap-3">
                <Link href="/legal/privacy" className="text-[#60A5FA] hover:underline">
                  Privacy Policy
                </Link>
                <span>&bull;</span>
                <Link href="/legal/safety" className="text-[#60A5FA] hover:underline">
                  Safety & Protection Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
