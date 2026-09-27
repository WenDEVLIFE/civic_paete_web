import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  FileText,
  Lock,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  ExternalLink,
  ArrowLeft,
  Scale,
  Clock,
  Eye,
  Trash2,
  RotateCcw,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Civic Paete",
  description:
    "Official Data Privacy Policy of the Municipality of Paete, Laguna — in compliance with Republic Act No. 10173 (Data Privacy Act of 2012).",
};

// ─── Section Data ─────────────────────────────────────────────────────────────

interface PrivacySection {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  badge?: string;
  content?: string[];
  subsections?: { label: string; items: string[] }[];
  list?: string[];
  rights?: { name: string; desc: string; icon: React.ComponentType<{ className?: string }> }[];
}

const SECTIONS: PrivacySection[] = [
  {
    id: "scope",
    icon: Building2,
    title: "1. Scope & Administrative Jurisdiction",
    badge: "LGU Mandate",
    content: [
      "This Privacy Policy applies to all personal information, sensitive personal data, and civic communications processed through the Civic Paete digital platform, administered by the Municipal Government of Paete, Province of Laguna.",
      "This platform serves as the municipal portal for public concern reporting, civic accountability, and infrastructure transparency. All processing activities adhere strictly to Republic Act No. 10173, otherwise known as the Data Privacy Act of 2012 (DPA), its Implementing Rules and Regulations (IRR), and issuances by the National Privacy Commission (NPC).",
    ],
  },
  {
    id: "data-collected",
    icon: FileText,
    title: "2. Categories of Information Collected",
    badge: "Transparency",
    content: [
      "Civic Paete collects data only to the extent necessary to verify community concerns, route issues to municipal departments, and maintain public accountability.",
    ],
    subsections: [
      {
        label: "A. Resident Account Information",
        items: [
          "Full legal name and verified email address (via Google OAuth 2.0)",
          "Profile photograph (as authorized through federated login)",
          "Declared Barangay of residence within Paete (e.g., Bagumbayan, Bangkusay, Ibaba del Sur, etc.)",
          "Account verification status and session timestamps",
        ],
      },
      {
        label: "B. Civic Report & Evidence Data",
        items: [
          "Report title, description, category, and municipal urgency level",
          "Geographic tags, landmark identifiers, and street-level location markers",
          "Media attachments, including photographic evidence and condition documentation",
          "Public community comments, endorsements (upvotes), and verification confirmations",
        ],
      },
      {
        label: "C. Technical & Security Telemetry",
        items: [
          "Internet Protocol (IP) address and device user-agent string (retained strictly for rate-limiting and anti-abuse defense)",
          "Authentication tokens managed through Google Firebase secure session storage",
          "Consent preferences and cookie consent status logs",
        ],
      },
    ],
  },
  {
    id: "legal-basis",
    icon: Scale,
    title: "3. Lawful Basis for Processing (RA 10173)",
    badge: "Statutory Grounds",
    content: [
      "Under Sections 12 and 13 of Republic Act No. 10173, the processing of personal data on Civic Paete is conducted pursuant to the following lawful criteria:",
    ],
    list: [
      "Explicit Consent (Section 12.a): Freely given, specific, and informed consent granted by the resident upon registration and submission of civic reports.",
      "Fulfillment of Municipal Mandate (Section 12.e): Processing necessary for the performance of public functions and delivery of basic civic services under Republic Act No. 7160 (Local Government Code of 1991).",
      "Protection of Vital Interests (Section 12.d): Processing emergency hazard reports involving imminent public safety, electrical fire hazards, and flood disasters.",
      "Legitimate Municipal Interests (Section 12.f): Prevention of fraudulent reports, spam mitigation, and infrastructure audit maintenance.",
    ],
  },
  {
    id: "data-use",
    icon: ShieldCheck,
    title: "4. Purpose Specification & Data Utilization",
    badge: "Zero Commercial Use",
    content: [
      "Personal data collected by the Municipal Government of Paete is used exclusively for public governance purposes. It is never monetized, rented, or sold.",
    ],
    list: [
      "Dispatching and routing community reports to the Municipal Engineer, MENRO, MDRRMO, or respective Sangguniang Barangay.",
      "Transmitting real-time SMS or email progress updates regarding the resolution status of submitted tickets.",
      "Aggregating anonymized datasets for infrastructure planning and the Paete Open Data Initiative.",
      "Enforcing municipal accountability Service Level Agreements (SLAs) across local government departments.",
      "Validating authenticated resident identities to protect against malicious disinformation campaigns.",
    ],
  },
  {
    id: "sharing",
    icon: Lock,
    title: "5. Information Sharing & Third-Party Processors",
    badge: "Restricted Access",
    content: [
      "Access to identifiable data is restricted strictly to authorized municipal personnel operating under statutory confidentiality obligations:",
    ],
    list: [
      "Municipal Officers & Department Heads: Designated administrators within Paete LGU receive report details strictly on a need-to-know basis.",
      "Provincial Oversight: The Office of the Provincial Governor of Laguna receives aggregated escalations for inter-LGU disaster management.",
      "Cloud Infrastructure Provider: Google Cloud Platform / Firebase operates as our certified data processor under ISO/IEC 27001, SOC 2, and HIPAA compliance frameworks.",
      "Law Enforcement & Courts: Data is disclosed only upon presentation of a valid judicial subpoena, court order, or formal emergency warrant.",
    ],
  },
  {
    id: "rights",
    icon: Eye,
    title: "6. Citizen Rights as Data Subjects",
    badge: "Resident Rights",
    content: [
      "As a registered resident or user of Civic Paete, you retain full rights as a Data Subject under Section 16 of the Data Privacy Act of 2012:",
    ],
    rights: [
      {
        name: "Right to Be Informed",
        desc: "You have the right to know whether personal data pertaining to you is being or will be processed.",
        icon: Eye,
      },
      {
        name: "Right of Access",
        desc: "You may request reasonable access to your personal data held by the municipal database.",
        icon: FileText,
      },
      {
        name: "Right to Rectification",
        desc: "You can dispute inaccuracies in your profile or submitted reports and have them promptly corrected.",
        icon: RotateCcw,
      },
      {
        name: "Right to Erasure (Blocking)",
        desc: "You may request deletion of personal information, subject to public works retention obligations.",
        icon: Trash2,
      },
      {
        name: "Right to Damages",
        desc: "You may seek indemnification for damages sustained due to unlawful or fraudulent data processing.",
        icon: Scale,
      },
      {
        name: "Right to Data Portability",
        desc: "You can request an electronic copy of your civic submission history in structured JSON or CSV format.",
        icon: CheckCircle2,
      },
    ],
  },
  {
    id: "retention",
    icon: Clock,
    title: "7. Data Retention & Archival Schedules",
    badge: "Archival Rules",
    list: [
      "Resident Account Profiles: Retained throughout the duration of active residency. Deletion takes effect within 30 days upon formal resident account closure request.",
      "Civic Infrastructure & Maintenance Reports: Retained for a mandatory period of five (5) years in compliance with Commission on Audit (COA) public works review mandates.",
      "Security & Telemetry Audit Logs: System access logs and security traces are purged automatically on a rolling 90-day retention schedule.",
      "Anonymized Open Datasets: De-identified statistical metrics are retained indefinitely for municipal demographic and civic planning archives.",
    ],
  },
  {
    id: "security",
    icon: Lock,
    title: "8. Technical & Organizational Security Measures",
    badge: "Defense in Depth",
    content: [
      "Civic Paete implements state-of-the-art security safeguards to prevent accidental or unlawful destruction, alteration, or disclosure:",
    ],
    list: [
      "Cryptographic Protection: High-grade TLS 1.3 encryption for data in transit; AES-256 bit encryption for data at rest.",
      "Role-Based Access Control (RBAC): Strict credentialed partition between Municipal Administrator, Department Heads, and Barangay Officers.",
      "Identity Shield Pseudonymity: Citizen identities on public report feeds are masked by default (e.g., 'Protected Citizen #104').",
      "Continuous Vulnerability Auditing: Automated dependency scanning and secure session expiration management.",
    ],
  },
  {
    id: "youth-eligibility",
    icon: ShieldCheck,
    title: "9. Youth Civic Participation & Minor Privacy (15+ Age Policy)",
    badge: "RA 10742 & RA 10173",
    content: [
      "Pursuant to the Sangguniang Kabataan Reform Act (Republic Act No. 10742), youth aged fifteen (15) to thirty (30) possess statutory Katipunan ng Kabataan civic representation rights in their respective barangays. Civic Paete extends digital reporting and civic assembly participation to youth residents aged 15 and above:",
    ],
    list: [
      "Minimum Age Eligibility: Individuals who are at least 15 years old may independently register, verify residency, submit community reports, and participate in civic feed discussions.",
      "Minors Below 15: Children younger than 15 years old may not register independently and must act under the direct authorization and supervision of a parent or court-appointed legal guardian.",
      "Default Protective Shield: Youth and student residents may toggle Identity Shield to publish reports under pseudonymous aliases ('Protected Citizen #NNN') to safeguard student safety.",
      "Parental Rights: Parents or guardians of minors may exercise statutory Data Subject rights (access, correction, erasure) on behalf of their children by contacting dpo@paete.gov.ph.",
    ],
  },
  {
    id: "contact",
    icon: Mail,
    title: "10. Data Protection Officer (DPO) Contact",
    badge: "NPC Compliance",
    content: [
      "For inquiries, clarification, or to exercise your statutory rights as a Data Subject, please contact the designated Data Protection Officer of the Municipal Government of Paete:",
    ],
  },
];

export default function PrivacyPolicyPage() {
  const effectiveDate = "September 27, 2026";
  const dpoEmail = "dpo@paete.gov.ph";

  return (
    <div className="min-h-screen bg-[#071126] text-[#F1F5F9] font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Paete Woodcarving Motif Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-[#2563EB] to-amber-500" />

      {/* Header Bar */}
      <header className="border-b border-white/10 bg-[#0A1931]/95 backdrop-blur-md sticky top-0 z-40 transition-all">
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
              Municipal Compliance Office
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Link
              href="/legal/terms"
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-medium transition-all min-h-[44px] flex items-center"
            >
              Terms of Service
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
        {/* Subtle radial backdrop atmospheric glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            {/* Statutory Compliance Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-[#2563EB]/15 border border-[#2563EB]/30 text-[#93C5FD] mb-6">
              <ShieldCheck className="w-4 h-4 text-[#60A5FA]" />
              <span>Republic Act No. 10173 &bull; Data Privacy Act of 2012</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Privacy Policy
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-6">
              Official data protection charter of the Municipal Government of Paete, Laguna. Learn how your identity,
              civic submissions, and resident credentials are systematically secured under Philippine national law.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-[#60A5FA]" /> Effective Date: {effectiveDate}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> NPC Registration Compliant
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-amber-400" /> Paete LGU Executive Order No. 2026-04
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sticky Table of Contents Sidebar */}
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
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-500 group-hover:bg-[#60A5FA] transition-colors" />
                    <span className="truncate">{sec.title}</span>
                  </a>
                ))}
              </nav>

              {/* DPO Quick Card */}
              <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block font-heading">
                  Data Protection Officer
                </span>
                <p className="text-xs text-slate-300 leading-snug">
                  Office of the Municipal Administrator, Paete Municipal Hall
                </p>
                <a
                  href={`mailto:${dpoEmail}`}
                  className="inline-flex items-center gap-1.5 text-xs text-[#60A5FA] hover:underline font-semibold pt-1 min-h-[36px]"
                >
                  <Mail className="w-3.5 h-3.5" /> {dpoEmail}
                </a>
              </div>
            </div>
          </aside>

          {/* Policy Detail Sections */}
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
                      <div className="p-2.5 rounded-xl bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/30">
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

                  {/* Prose Content */}
                  {sec.content && (
                    <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {sec.content.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  )}

                  {/* Subsections if any */}
                  {sec.subsections && (
                    <div className="space-y-4 my-4">
                      {sec.subsections.map((sub, sIdx) => (
                        <div key={sIdx} className="p-4 rounded-xl bg-[#0A1931]/80 border border-white/5 space-y-2">
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading text-[#93C5FD]">
                            {sub.label}
                          </h4>
                          <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                            {sub.items.map((item, iIdx) => (
                              <li key={iIdx} className="leading-relaxed">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bullet list if any */}
                  {sec.list && (
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-300 list-disc list-inside bg-[#0A1931]/60 p-4 rounded-xl border border-white/5">
                      {sec.list.map((li, lIdx) => (
                        <li key={lIdx} className="leading-relaxed">
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Rights grid if any */}
                  {sec.rights && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
                      {sec.rights.map((r, rIdx) => {
                        const RightIcon = r.icon;
                        return (
                          <div
                            key={rIdx}
                            className="p-4 rounded-xl bg-[#0A1931]/90 border border-white/10 hover:border-[#2563EB]/40 transition-all"
                          >
                            <div className="flex items-center gap-2 mb-2 text-[#60A5FA]">
                              <RightIcon className="w-4 h-4" />
                              <h4 className="text-xs font-bold text-white font-heading">{r.name}</h4>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">{r.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Dedicated DPO Card in section 9 */}
                  {sec.id === "contact" && (
                    <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-[#0A1931] via-[#112347] to-[#0A1931] border border-white/15 shadow-2xl">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3 text-xs">
                          <div className="flex items-center gap-2 text-white font-bold text-sm font-heading">
                            <Building2 className="w-4 h-4 text-[#60A5FA]" />
                            <span>Municipal Government of Paete, Laguna</span>
                          </div>
                          <div className="flex items-start gap-2 text-slate-300">
                            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>Municipal Hall, J.V. Quesada St., Paete, Laguna 4007, Philippines</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-300">
                            <Mail className="w-4 h-4 text-[#60A5FA] shrink-0" />
                            <a href={`mailto:${dpoEmail}`} className="text-[#60A5FA] hover:underline font-mono">
                              {dpoEmail}
                            </a>
                          </div>
                        </div>

                        <div className="space-y-3 text-xs border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6">
                          <div className="flex items-center gap-2 text-white font-bold text-sm font-heading">
                            <Scale className="w-4 h-4 text-emerald-400" />
                            <span>National Privacy Commission (NPC)</span>
                          </div>
                          <p className="text-slate-400 leading-relaxed text-[11px]">
                            If your inquiry or privacy concern is not addressed within fifteen (15) municipal business
                            days, you maintain the statutory right to file a formal complaint with the National Privacy
                            Commission of the Philippines.
                          </p>
                          <a
                            href="https://www.privacy.gov.ph"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                          >
                            <span>NPC Official Portal</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              );
            })}

            {/* Bottom Disclaimer */}
            <div className="p-6 rounded-2xl bg-[#0A1931]/60 border border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>
                Civic Paete &bull; Document Reference: <span className="font-mono text-slate-300">CP-PRIV-2026-V1</span>
              </p>
              <div className="flex items-center gap-3">
                <Link href="/legal/terms" className="text-[#60A5FA] hover:underline">
                  Terms of Service
                </Link>
                <span>&bull;</span>
                <Link href="/legal/safety" className="text-[#60A5FA] hover:underline">
                  Whistleblower Protection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
