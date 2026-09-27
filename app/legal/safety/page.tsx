import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldAlert,
  Phone,
  Mail,
  Globe,
  Lock,
  Building2,
  ArrowLeft,
  CheckCircle2,
  Scale,
  Gavel,
  ShieldCheck,
  EyeOff,
  AlertOctagon,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Safety & Legal Protection Hub | Civic Paete",
  description:
    "Official Whistleblower Protection, Anti-Harassment Safeguards, and National Escalation Channels for the Citizens of Paete, Laguna.",
};

// ─── Escalation Contacts Data ──────────────────────────────────────────────────

interface EscalationContact {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  hotline: string;
  email: string;
  website: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ESCALATION_CONTACTS: EscalationContact[] = [
  {
    id: "ombudsman",
    name: "Office of the Ombudsman",
    subtitle: "Luzon Area Office — Public Assistance Bureau",
    description:
      "Statutory oversight agency for formal complaints against public officials, bribery, procurement anomalies, and gross misconduct in office.",
    hotline: "(02) 8479-7300 / 8-888-7032",
    email: "pab@ombudsman.gov.ph",
    website: "https://www.ombudsman.gov.ph",
    badge: "Anti-Corruption",
    badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    icon: Scale,
  },
  {
    id: "dilg",
    name: "DILG Laguna Provincial Office",
    subtitle: "Department of the Interior and Local Government",
    description:
      "Administrative oversight for local government accountability, barangay captain inquiries, and municipal ordinance enforcement reviews.",
    hotline: "(049) 501-1234 / 0917-867-3457",
    email: "laguna@dilg.gov.ph",
    website: "https://www.dilg.gov.ph",
    badge: "LGU Oversight",
    badgeColor: "text-[#60A5FA] border-[#2563EB]/30 bg-[#2563EB]/10",
    icon: Building2,
  },
  {
    id: "npc",
    name: "National Privacy Commission (NPC)",
    subtitle: "Complaints and Investigation Division",
    description:
      "Statutory authority handling unauthorized disclosure of citizen records, privacy breaches, and violations of Republic Act No. 10173.",
    hotline: "(02) 8234-2228",
    email: "complaints@privacy.gov.ph",
    website: "https://www.privacy.gov.ph",
    badge: "Data Privacy",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    icon: Lock,
  },
  {
    id: "pnp",
    name: "PNP Laguna Police Provincial Office",
    subtitle: "Investigation & Detective Management Unit",
    description:
      "Immediate law enforcement intervention for intimidation, physical harassment, or grave threats linked to civic reporting.",
    hotline: "(049) 501-0000 / 0998-598-5721",
    email: "lagunappo_ridmd@yahoo.com",
    website: "https://pro4a.pnp.gov.ph",
    badge: "Law Enforcement",
    badgeColor: "text-red-400 border-red-500/30 bg-red-500/10",
    icon: AlertOctagon,
  },
];

// ─── Legal Protections Data ───────────────────────────────────────────────────

const STATUTORY_PROTECTIONS = [
  {
    statute: "Republic Act No. 6713",
    title: "Code of Conduct and Ethical Standards for Public Officials",
    desc: "Mandates that public officials must respond to citizen requests within fifteen (15) working days and strictly forbids retaliatory acts against residents exercising legitimate civic oversight.",
    clause: "Section 5 & Section 11 Sanctions",
  },
  {
    statute: "Republic Act No. 3019",
    title: "Anti-Graft and Corrupt Practices Act",
    desc: "Provides strict criminal liability (imprisonment and perpetual disqualification from public office) for officials who cause undue injury to citizens through harassment or intimidation.",
    clause: "Section 3(e) Corrupt Practices",
  },
  {
    statute: "Revised Penal Code",
    title: "Article 282 — Grave Threats & Coercion",
    desc: "Penalizes any individual who threatens another with the infliction of any wrong upon their person, honor, or property. Whistleblowers have immediate access to PNP protective warrants.",
    clause: "Criminal Sanctions Enforced",
  },
];

export default function SafetyHubPage() {
  return (
    <div className="min-h-screen bg-[#071126] text-[#F1F5F9] font-sans selection:bg-[#2563EB] selection:text-white">
      {/* Paete Woodcarving Motif Accent Bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-[#2563EB] to-emerald-500" />

      {/* Header Bar */}
      <header className="border-b border-white/10 bg-[#0A1931]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-xl border border-white/10 transition-all active:scale-[0.98] min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Back to Civic Portal</span>
            </Link>
            <span className="hidden sm:inline text-xs text-slate-500">|</span>
            <span className="hidden sm:inline text-xs font-semibold text-slate-400 uppercase tracking-wider font-heading">
              Citizen Legal Protection Hub
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
              href="/legal/terms"
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 font-medium transition-all min-h-[44px] flex items-center"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative border-b border-white/10 bg-gradient-to-b from-[#0A1931] via-[#071126] to-[#071126] pt-12 pb-16 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Citizen Safeguard & Whistleblower Shield</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-4 uppercase"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Legal Protection Hub
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal mb-6">
              Your voice matters. The Municipal Government of Paete guarantees statutory protection against retaliation,
              intimidation, or unlawful harassment for all citizens reporting public hazards or government irregularities.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Anonymous Reporting (Identity Shield) Active
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Scale className="w-3.5 h-3.5 text-[#60A5FA]" /> Anti-Retaliation Protection (RA 6713)
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <Gavel className="w-3.5 h-3.5 text-amber-400" /> Direct Ombudsman Escalation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Section 1: Identity Shield Technology */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#112347]/60 border border-white/10 shadow-xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 mb-6 border-b border-white/10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 font-heading">
                <EyeOff className="w-4 h-4" />
                <span>Feature 6 Architecture</span>
              </div>
              <h2 className="text-2xl font-bold text-white font-heading">
                How Identity Shield Protects Your Submission
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                When you toggle &quot;Submit Anonymously (Identity Shield)&quot; on the report modal, our cryptographic
                middleware strips personal identifiers before publishing to the community feed.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A1931] border border-emerald-500/30 text-xs space-y-2 shrink-0 max-w-xs">
              <span className="text-[11px] font-mono uppercase font-bold text-emerald-300 block">
                Public Feed Display Example
              </span>
              <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-white font-medium flex items-center justify-between">
                <span>Protected Citizen #104</span>
                <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/25">
                  VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Your true Google UID is stored in an encrypted administrative metadata table solely to block spam.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#0A1931]/70 border border-white/5 space-y-1.5">
              <span className="text-xs font-bold text-white font-heading">1. Zero Public Identification</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your name, email address, and profile photo are never rendered on public web feeds or search engines.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A1931]/70 border border-white/5 space-y-1.5">
              <span className="text-xs font-bold text-white font-heading">2. EXIF Metadata Scrubbing</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Camera serial numbers and raw device metadata are automatically sanitized from uploaded report photos.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0A1931]/70 border border-white/5 space-y-1.5">
              <span className="text-xs font-bold text-white font-heading">3. Tamper-Proof Audit Trail</span>
              <p className="text-xs text-slate-400 leading-relaxed">
                Decryption keys require a formal judicial order signed by a regional trial court judge in Laguna.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Statutory Protections */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white font-heading flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>National Legal Framework Protecting Reporters</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Statutory protections enshrined in Philippine law to shield citizen whistleblowers from reprisal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATUTORY_PROTECTIONS.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0A1931]/80 border border-white/10 hover:border-amber-400/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    {stat.statute}
                  </span>
                  <h3 className="text-base font-bold text-white mb-2 font-heading">{stat.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{stat.desc}</p>
                </div>
                <div className="pt-3 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>{stat.clause}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Official Escalation Directory */}
        <section className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#2563EB]/15 text-[#93C5FD] border border-[#2563EB]/30 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>External Redress</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-heading">
              External Escalation Directory (Outside Municipal Influence)
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              If your report involves high-ranking municipal officials or you suspect conflicts of interest within the
              local government, escalate directly to these independent national oversight authorities:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ESCALATION_CONTACTS.map((contact) => {
              const Icon = contact.icon;
              return (
                <div
                  key={contact.id}
                  className="p-6 rounded-2xl bg-[#0A1931] border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${contact.badgeColor}`}>
                        {contact.badge}
                      </span>
                      <Icon className="w-5 h-5 text-slate-400" />
                    </div>

                    <h3 className="text-lg font-bold text-white font-heading mb-0.5">{contact.name}</h3>
                    <p className="text-xs font-medium text-[#60A5FA] mb-2">{contact.subtitle}</p>
                    <p className="text-xs text-slate-300 leading-relaxed mb-6">{contact.description}</p>
                  </div>

                  <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-400">Hotline:</span>
                      <a href={`tel:${contact.hotline.split(" ")[0]}`} className="font-mono text-white hover:underline">
                        {contact.hotline}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
                      <span className="text-slate-400">Email:</span>
                      <a href={`mailto:${contact.email}`} className="font-mono text-[#60A5FA] hover:underline">
                        {contact.email}
                      </a>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <a
                        href={contact.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Emergency Anti-Harassment Protocol */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/30 via-[#0A1931] to-red-950/20 border border-red-500/30 text-xs space-y-4">
          <div className="flex items-center gap-3 text-red-400 font-bold text-base font-heading">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span>Immediate Safety Protocol in Case of Harassment</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            If you or your family experience verbal threats, physical intimidation, or property damage after submitting a
            community report, execute the following protocol immediately:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-white block">Step 1: Document Evidence</span>
              <p className="text-slate-400">
                Preserve timestamps, screenshots, audio recordings, or CCTV footage of any encounters.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-white block">Step 2: Emergency Blotter</span>
              <p className="text-slate-400">
                File an incident blotter with the PNP Paete Police Station (Hotline: 0998-598-5721).
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="font-bold text-white block">Step 3: Escalate to Ombudsman</span>
              <p className="text-slate-400">
                Transmit your police blotter copy directly to the Ombudsman Public Assistance Bureau.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom Disclaimer */}
        <div className="p-6 rounded-2xl bg-[#0A1931]/60 border border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Civic Paete &bull; Document Reference: <span className="font-mono text-slate-300">CP-SAFE-2026-V1</span>
          </p>
          <div className="flex items-center gap-3">
            <Link href="/legal/privacy" className="text-[#60A5FA] hover:underline">
              Privacy Policy
            </Link>
            <span>&bull;</span>
            <Link href="/legal/terms" className="text-[#60A5FA] hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
