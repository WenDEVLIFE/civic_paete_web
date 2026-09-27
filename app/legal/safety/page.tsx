import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kaligtasan at Legal na Proteksyon | Civic Paete",
  description:
    "Alamin ang inyong mga karapatan bilang whistleblower at ang mga mekanismo ng proteksyon laban sa harassment para sa mga mamamayan ng Paete, Laguna.",
};

// ─── Escalation Contacts ──────────────────────────────────────────────────────

const ESCALATION_CONTACTS = [
  {
    id: "ombudsman",
    name: "Office of the Ombudsman",
    subtitle: "Luzon Sector — Visayas",
    description:
      "Para sa mga reklamo laban sa mga opisyal ng pamahalaan at katiwalian.",
    hotline: "8-888-7032",
    email: "pab@ombudsman.gov.ph",
    website: "https://www.ombudsman.gov.ph",
    badge: "OMBUDSMAN",
    badgeColor: "#F59E0B",
    badgeBg: "rgba(245,158,11,0.12)",
    icon: "⚖️",
  },
  {
    id: "dilg",
    name: "DILG Laguna",
    subtitle: "Dept. of Interior and Local Government",
    description:
      "Para sa mga reklamo laban sa lokal na pamahalaan at mga opisyal ng LGU.",
    hotline: "0917-867-3457",
    email: "laguna@dilg.gov.ph",
    website: "https://www.dilg.gov.ph",
    badge: "DILG",
    badgeColor: "#3B82F6",
    badgeBg: "rgba(59,130,246,0.1)",
    icon: "🏛️",
  },
  {
    id: "npc",
    name: "National Privacy Commission",
    subtitle: "Para sa mga paglabag sa RA 10173",
    description:
      "Para sa mga reklamo tungkol sa hindi tamang paggamit ng personal na datos ng pamahalaan.",
    hotline: "8234-2228",
    email: "complaints@privacy.gov.ph",
    website: "https://www.privacy.gov.ph",
    badge: "NPC",
    badgeColor: "#10B981",
    badgeBg: "rgba(16,185,129,0.1)",
    icon: "🛡️",
  },
  {
    id: "pnp",
    name: "PNP Laguna PPO",
    subtitle: "Philippine National Police — Laguna",
    description:
      "Para sa mga banta, pananakot, o phyiscal na harassment na may kaugnayan sa inyong ulat.",
    hotline: "049-501-0015",
    email: "pnplaguna@pnp.gov.ph",
    website: "https://www.pnp.gov.ph",
    badge: "PNP",
    badgeColor: "#EF4444",
    badgeBg: "rgba(239,68,68,0.1)",
    icon: "🚔",
  },
];

// ─── Whistleblower Rights ─────────────────────────────────────────────────────

const WHISTLEBLOWER_RIGHTS = [
  {
    icon: "🎭",
    title: "Karapatang Mag-ulat nang Hindi Kilala",
    body: "Maaari kayong gumamit ng alias o anonymous na pagkakakilanlan (hal. \"Protektadong Mamamayan #104\") habang ang inyong tunay na pagkakakilanlan ay ligtas na nakaimbak at protektado mula sa publikasyon.",
  },
  {
    icon: "🔒",
    title: "Pagiging Kumpidensyal ng Pagkakakilanlan",
    body: "Ang inyong tunay na pangalan at e-mail ay hindi kailanman ipapakita sa publiko nang wala ang inyong malinaw na pahintulot — kahit sa mga opisyal ng LGU. Makikita lamang ito ng awtorisadong administrator para sa layunin ng anti-spam.",
  },
  {
    icon: "⚖️",
    title: "Legal na Proteksyon sa ilalim ng RA 6713 at RA 9485",
    body: "Protektado kayo ng Code of Conduct and Ethical Standards (RA 6713) at Anti-Red Tape Act (RA 9485) sa pagreretaliasyon ng mga opisyal bilang tugon sa mga lehitimong ulat ng komunidad.",
  },
  {
    icon: "🚫",
    title: "Proteksyon Laban sa Retaliasyon",
    body: "Ang sinumang opisyal o empleyado ng LGU na gumawa ng retaliasyon laban sa isang whistleblower ay maaaring managot sa ilalim ng Civil Service Commission rules at ng Revised Penal Code.",
  },
  {
    icon: "📋",
    title: "Karapatang Malaman ang Katayuan ng Ulat",
    body: "Lahat ng nagsumite ng ulat — kahit anonymous — ay may karapatang malaman ang katayuan ng kanilang ulat sa pamamagitan ng isang natatanging reference code na ibinibigay pagkatapos ng submission.",
  },
  {
    icon: "🏛️",
    title: "Panlabas na Pag-escalate",
    body: "Kung hindi natugunan ng LGU ang inyong ulat sa loob ng SLA, mayroon kayong karapatang direktang mag-escalate sa Ombudsman, DILG, o iba pang panlabas na awtoridad nang walang takot sa legal na parusa.",
  },
];

// ─── Anti-Harassment Provisions ──────────────────────────────────────────────

const ANTI_HARASSMENT = [
  {
    law: "RA 11313",
    name: "Safe Spaces Act",
    desc: "Nagbabawal ng gender-based harassment sa mga digital na espasyo. Ang plataporma ay aktibong nagmo-moderate ng mga nilalaman na lumalabag dito.",
  },
  {
    law: "RA 10175",
    name: "Cybercrime Prevention Act",
    desc: "Ang cyber-harassment, online libel, at unjust vexation sa pamamagitan ng plataporma ay maaaring humantong sa criminal prosecution.",
  },
  {
    law: "RA 9262",
    name: "Anti-VAWC Act",
    desc: "Partikular na proteksyon para sa mga babaeng mamamayan na nag-uulat ng mga alalahanin sa pamamagitan ng digital na plataporma.",
  },
  {
    law: "CSC MC 01-2001",
    name: "Civil Service Harassment Rules",
    desc: "Ang mga opisyal ng gobyerno ay mananagot sa CSC sa anumang retaliasyon o harassment laban sa mga mamamayang gumamit ng kanilang karapatang mag-reklamo.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SafetyPage() {
  const effectiveDate = "Setyembre 27, 2026";

  return (
    <div className="min-h-screen" style={{ background: "var(--civic-navy-dark)" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header
        style={{
          background: "linear-gradient(180deg, #0A1931 0%, rgba(10,25,49,0.95) 100%)",
          borderBottom: "1px solid rgba(16,185,129,0.15)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-xs" aria-label="Breadcrumb">
            <Link href="/" className="transition-opacity hover:opacity-80" style={{ color: "#60A5FA" }}>
              Civic Paete
            </Link>
            <span style={{ color: "#475569" }}>/</span>
            <Link href="/legal/privacy" className="transition-opacity hover:opacity-80" style={{ color: "#60A5FA" }}>
              Legal
            </Link>
            <span style={{ color: "#475569" }}>/</span>
            <span style={{ color: "#94A3B8" }}>Kaligtasan at Proteksyon</span>
          </nav>

          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.3)",
              }}
            >
              <svg
                className="w-7 h-7"
                style={{ color: "#10B981" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.016H12v-.016z"
                />
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(16,185,129,0.12)",
                    color: "#10B981",
                    border: "1px solid rgba(16,185,129,0.25)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Proteksyon ng Mamamayan
                </span>
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(37,99,235,0.12)",
                    color: "#60A5FA",
                    border: "1px solid rgba(37,99,235,0.25)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  Opisyal na Dokumento
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight"
                style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
              >
                Kaligtasan at Legal na Proteksyon
              </h1>
              <p className="text-sm mt-1" style={{ color: "#64748B" }}>
                Munisipalidad ng Paete, Lalawigan ng Laguna •{" "}
                <span style={{ color: "#94A3B8" }}>Epektibo: {effectiveDate}</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
        {/* Hero shield callout */}
        <div
          className="rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4"
          style={{
            background:
              "linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(17,35,71,0.7) 60%, rgba(7,17,38,0.5) 100%)",
            border: "1px solid rgba(16,185,129,0.25)",
            boxShadow: "0 0 40px rgba(16,185,129,0.06) inset",
          }}
        >
          <div
            className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{
              background: "rgba(16,185,129,0.15)",
              border: "1px solid rgba(16,185,129,0.3)",
            }}
            aria-hidden="true"
          >
            🛡️
          </div>
          <div>
            <h2
              className="text-lg font-bold mb-1"
              style={{ color: "#34D399", fontFamily: "var(--font-heading)" }}
            >
              Protektado ang Inyong Pagkakakilanlan
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "#94A3B8" }}>
              Ang Civic Paete ay nakatuon sa pagprotekta sa bawat mamamayang
              gumagamit ng kanilang karapatang mag-ulat. Ang inyong kaligtasan at
              pagkakakilanlan ay palaging pinananatiling lihim. Walang opisyal ng
              LGU ang maaaring gamiting ang platapormang ito upang alamin kung sino
              ang nag-file ng reklamo laban sa kanila.
            </p>
          </div>
        </div>

        {/* ── Section 1: Whistleblower Rights ─── */}
        <section aria-labelledby="whistleblower-heading">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)" }}
              aria-hidden="true"
            >
              🎭
            </div>
            <h2
              id="whistleblower-heading"
              className="text-lg font-bold"
              style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
            >
              Mga Karapatan ng Whistleblower
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {WHISTLEBLOWER_RIGHTS.map((right) => (
              <div
                key={right.title}
                className="rounded-xl p-4 flex flex-col gap-2"
                style={{
                  background: "rgba(17,35,71,0.5)",
                  border: "1px solid rgba(16,185,129,0.1)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base" aria-hidden="true">{right.icon}</span>
                  <h3
                    className="text-xs font-bold"
                    style={{ color: "#E2E8F0", fontFamily: "var(--font-heading)" }}
                  >
                    {right.title}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
                  {right.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 2: Anti-Harassment Laws ─── */}
        <section aria-labelledby="anti-harassment-heading">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
              aria-hidden="true"
            >
              🚫
            </div>
            <h2
              id="anti-harassment-heading"
              className="text-lg font-bold"
              style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
            >
              Mga Batas Laban sa Harassment
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            {ANTI_HARASSMENT.map((law) => (
              <div
                key={law.law}
                className="rounded-xl px-4 py-3 flex items-start gap-4"
                style={{
                  background: "rgba(17,35,71,0.5)",
                  border: "1px solid rgba(96,165,250,0.08)",
                }}
              >
                <div className="flex-shrink-0 flex flex-col items-center gap-0.5 pt-0.5">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      color: "#EF4444",
                      border: "1px solid rgba(239,68,68,0.2)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {law.law}
                  </span>
                </div>
                <div>
                  <p
                    className="text-xs font-bold mb-0.5"
                    style={{ color: "#E2E8F0", fontFamily: "var(--font-heading)" }}
                  >
                    {law.name}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
                    {law.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 3: Escalation Contacts ─── */}
        <section aria-labelledby="escalation-heading">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}
              aria-hidden="true"
            >
              📞
            </div>
            <h2
              id="escalation-heading"
              className="text-lg font-bold"
              style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
            >
              Mga Direktang Linya ng Escalation
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ESCALATION_CONTACTS.map((contact) => (
              <div
                key={contact.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: "rgba(17,35,71,0.5)",
                  border: "1px solid rgba(96,165,250,0.08)",
                }}
              >
                {/* Card header */}
                <div
                  className="px-4 py-3 flex items-center justify-between gap-2"
                  style={{
                    background: "rgba(10,25,49,0.6)",
                    borderBottom: "1px solid rgba(96,165,250,0.08)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base" aria-hidden="true">{contact.icon}</span>
                    <div>
                      <p
                        className="text-xs font-bold leading-tight"
                        style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
                      >
                        {contact.name}
                      </p>
                      <p className="text-xs" style={{ color: "#64748B" }}>
                        {contact.subtitle}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      background: contact.badgeBg,
                      color: contact.badgeColor,
                      border: `1px solid ${contact.badgeColor}40`,
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {contact.badge}
                  </span>
                </div>

                {/* Card body */}
                <div className="px-4 py-3 flex flex-col gap-2">
                  <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
                    {contact.description}
                  </p>
                  <div className="flex flex-col gap-1.5 mt-1">
                    <a
                      href={`tel:${contact.hotline}`}
                      className="flex items-center gap-2 text-xs transition-opacity hover:opacity-80"
                      style={{ color: "#60A5FA" }}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                      {contact.hotline}
                    </a>
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center gap-2 text-xs transition-opacity hover:opacity-80"
                      style={{ color: "#60A5FA" }}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      {contact.email}
                    </a>
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs transition-opacity hover:opacity-80"
                      style={{ color: "#94A3B8" }}
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                      {contact.website.replace("https://", "")}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Emergency callout ─── */}
        <div
          className="rounded-xl p-4 flex items-start gap-3"
          style={{
            background: "rgba(239,68,68,0.07)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <span className="text-xl flex-shrink-0" aria-hidden="true">🚨</span>
          <div>
            <p
              className="text-sm font-bold mb-1"
              style={{ color: "#FCA5A5", fontFamily: "var(--font-heading)" }}
            >
              Sa Panganib o Emerhensiya
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
              Kung kayo ay nasa agarang panganib o nangangailangan ng emergency na tulong,
              tumawag agad sa{" "}
              <a href="tel:911" className="font-bold" style={{ color: "#EF4444" }}>
                911
              </a>{" "}
              o sa{" "}
              <a href="tel:049-501-0015" className="font-bold" style={{ color: "#EF4444" }}>
                PNP Laguna (049-501-0015)
              </a>
              . Huwag umasa sa plataporma para sa mga emergency na sitwasyon.
            </p>
          </div>
        </div>

        {/* Legal links */}
        <div
          className="rounded-xl p-4 flex flex-col sm:flex-row gap-3"
          style={{
            background: "rgba(17,35,71,0.4)",
            border: "1px solid rgba(96,165,250,0.08)",
          }}
        >
          <p
            className="text-xs font-semibold tracking-wider uppercase flex-shrink-0 pt-0.5"
            style={{ color: "#475569", fontFamily: "var(--font-heading)" }}
          >
            Kaugnay na Dokumento
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { href: "/legal/privacy", label: "Patakaran sa Privacy", color: "#60A5FA" },
              { href: "/legal/terms", label: "Mga Tuntunin at Kundisyon", color: "#F59E0B" },
            ].map(({ href, label, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
                style={{ background: `${color}14`, color, border: `1px solid ${color}30` }}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                {label}
              </Link>
            ))}
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
              style={{ color: "#94A3B8", border: "1px solid rgba(148,163,184,0.15)", background: "transparent" }}
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Bumalik sa Feed
            </Link>
          </div>
        </div>

        <p className="text-xs text-center py-2" style={{ color: "#475569" }}>
          Huling na-update: {effectiveDate} — Civic Paete, Munisipalidad ng Paete, Laguna
        </p>
      </main>
    </div>
  );
}
