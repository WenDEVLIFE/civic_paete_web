import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mga Tuntunin at Kundisyon | Civic Paete",
  description:
    "Mga patakaran ng komunidad, responsibilidad ng gumagamit, at legal na kasunduan para sa paggamit ng Civic Paete digital na plataporma ng Munisipalidad ng Paete, Laguna.",
};

// ─── Section Data ─────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "acceptance",
    icon: "✅",
    title: "Pagtanggap ng mga Tuntunin",
    content: [
      "Sa pamamagitan ng pag-access at paggamit ng Civic Paete, tinatanggap ninyo nang buo ang mga Tuntuning ito at Kundisyon. Kung hindi kayo sumasang-ayon sa alinman sa mga probisyong ito, mangyaring huwag gamitin ang plataporma.",
      "Ang Civic Paete ay opisyal na digital na plataporma ng Munisipalidad ng Paete, Lalawigan ng Laguna, na dinisenyo para sa pagmemensahe ng komunidad, pag-uulat ng mga alalahanin ng mamamayan, at pagpapadali ng pakikipag-ugnayan sa pagitan ng mga residente at lokal na pamahalaan.",
    ],
  },
  {
    id: "eligibility",
    icon: "👤",
    title: "Pagiging Karapat-dapat na Gumagamit",
    content: [
      "Ang plataporma ay para sa mga sumusunod na gumagamit:",
    ],
    list: [
      "Mga residente ng Munisipalidad ng Paete, Laguna",
      "Mga opisyal at empleyado ng Paete at Lalawigan ng Laguna LGU",
      "Mga miyembro ng media at mananaliksik na sumusunod sa mga patakaran ng plataporma",
      "Lahat ng gumagamit ay dapat may edad 18 pataas, o may pahintulot ng magulang/guardian",
    ],
  },
  {
    id: "community-guidelines",
    icon: "🤝",
    title: "Mga Alituntunin ng Komunidad",
    content: [
      "Ang Civic Paete ay espasyo para sa makabuluhan at maayos na pakikipag-ugnayan ng mamamayan. Inaasahan namin ang lahat ng gumagamit na:",
    ],
    allowed: {
      label: "✅ Pinapayagan",
      items: [
        "Mag-ulat ng mga tunay na alalahanin ng komunidad nang may katumpakan at katapatan",
        "Magbigay ng nakakonstruktibong feedback sa mga proyekto at serbisyo ng LGU",
        "Suportahan ang mga ulat ng kapwa mamamayan sa pamamagitan ng upvote",
        "Mag-post ng mga komento na nagdaragdag ng halaga sa talakayan",
        "Gumamit ng anonymous alias para sa mga sensitibong ulat (Protektadong Mamamayan)",
      ],
    },
    prohibited: {
      label: "❌ Ipinagbabawal",
      items: [
        "Pagsasumite ng pekeng, mapanlinlang, o malisyosong ulat",
        "Pananakot, harassment, o paninirang-puri sa sinuman",
        "Paglalagay ng personal na impormasyon ng ibang tao nang wala ang kanilang pahintulot",
        "Spam, paulit-ulit na mga post, o pagmamanipula ng sistema ng pagboto",
        "Paggamit ng plataporma para sa komersyal na advertising o political campaigning",
        "Nilalaman na labag sa batas, malaswa, o nagtataguyod ng karahasan",
      ],
    },
  },
  {
    id: "false-reports",
    icon: "⚠️",
    title: "Responsibilidad sa Maling Ulat",
    content: [
      "Ang pagsasumite ng maling ulat ay isang seryosong bagay na may legal na kahihinatnan sa ilalim ng batas ng Pilipinas:",
    ],
    list: [
      "Sinumang mag-file ng maling ulat ay maaaring managot sa ilalim ng Revised Penal Code (Perjury, Art. 183) at iba pang kaugnay na batas.",
      "Ang Munisipalidad ay may karapatang mag-disqualify ng gumagamit na paulit-ulit na nagsusumite ng maling impormasyon.",
      "Ang maling ulat na nagdudulot ng pinsala sa reputasyon ng isang opisyal ay maaaring humantong sa libel case sa ilalim ng RA 10175 (Cybercrime Prevention Act).",
      "Ang mga napatunayang maling ulat ay itatago bilang audit record at maaaring gamitin bilang ebidensya sa legal na proseso.",
    ],
    callout: {
      type: "warning",
      text: "Ang bawat ulat ay nire-review ng mga awtorisadong opisyal ng LGU. Ang buwanang audit ay isinasagawa upang matiyak ang integridad ng plataporma.",
    },
  },
  {
    id: "sla",
    icon: "⏱️",
    title: "Mga SLA ng Pagtugon ng LGU",
    content: [
      "Ang Munisipalidad ng Paete ay nakatuon sa pagtugon sa mga ulat ng komunidad sa loob ng mga sumusunod na timeframe. Ang mga oras na ito ay simula sa sandali ng opisyal na pag-acknowledge ng ulat:",
    ],
    sla: [
      {
        category: "Emerhensiya at Kaligtasan",
        tag: "URGENT",
        tagColor: "#EF4444",
        tagBg: "rgba(239,68,68,0.1)",
        target: "2–4 oras",
        examples: "Mga baha, kalamidad, aksidente, krimen",
      },
      {
        category: "Imprastraktura at Pampublikong Serbisyo",
        tag: "HIGH",
        tagColor: "#F59E0B",
        tagBg: "rgba(245,158,11,0.1)",
        target: "24–48 oras",
        examples: "Sirang streetlights, butas sa kalsada, basura",
      },
      {
        category: "Mga Alalahanin ng Komunidad",
        tag: "STANDARD",
        tagColor: "#3B82F6",
        tagBg: "rgba(59,130,246,0.1)",
        target: "3–5 araw na trabaho",
        examples: "Ingay, mga alitan ng kapitbahay, kalinisan",
      },
      {
        category: "Mungkahi at Proyekto",
        tag: "LOW",
        tagColor: "#10B981",
        tagBg: "rgba(16,185,129,0.1)",
        target: "5–10 araw na trabaho",
        examples: "Mga panukala sa pagpapabuti, programa, events",
      },
    ],
    content2: [
      "Ang mga SLA ay para sa pagtugon lamang — hindi garantiya ng agarang resolusyon. Ang kumplikadong mga isyu ay maaaring mangailangan ng karagdagang oras para sa imbestigasyon at pagpapatupad.",
    ],
  },
  {
    id: "account-conduct",
    icon: "🔑",
    title: "Mga Responsibilidad ng Account",
    list: [
      "Kayo ay may pananagutang personal sa lahat ng aktibidad na nagaganap sa ilalim ng inyong account.",
      "Kailangang mapanatiling ligtas ang inyong credentials — huwag ibahagi ang inyong account sa ibang tao.",
      "Agad na ipagbigay-alam sa amin ang anumang hindi awtorisadong paggamit ng inyong account sa admin@paete.gov.ph.",
      "Maaari naming suspindihin o tanggalin ang mga account na lumalabag sa mga Tuntunin nang wala pang paunang abiso.",
    ],
  },
  {
    id: "intellectual-property",
    icon: "©️",
    title: "Intellectual Property",
    content: [
      "Ang lahat ng nilalaman ng Civic Paete — kabilang ang disenyo, logo, teksto, at software — ay pag-aari ng Munisipalidad ng Paete, Lalawigan ng Laguna.",
    ],
    list: [
      "Ang mga ulat at komento na isinumite ng mga gumagamit ay nananatiling pag-aari ng gumagamit, ngunit nagbibigay kayo ng lisensiya sa LGU na gamitin ang mga ito para sa pampublikong interes.",
      "Hindi maaaring kopyahin, ipamahagi, o gamitin para sa komersyal na layunin ang nilalaman ng plataporma nang wala ang nakasulat na pahintulot ng LGU.",
      "Ang open data na pinal na ini-export sa ilalim ng Feature 10 ay inilalabas sa ilalim ng Creative Commons Attribution 4.0 (CC BY 4.0) lisensiya.",
    ],
  },
  {
    id: "liability",
    icon: "🏛️",
    title: "Limitasyon ng Pananagutan",
    content: [
      "Sa pinakamataas na antas na pinahihintulutan ng batas ng Pilipinas, ang Munisipalidad ng Paete ay hindi mananagot sa:",
    ],
    list: [
      "Anumang pinsala na resulta ng maling impormasyon na isinumite ng mga gumagamit",
      "Pansamantalang hindi pagiging available ng plataporma dahil sa maintenance o teknikal na suliranin",
      "Pagkalugi ng datos na dulot ng mga pangyayaring wala sa aming kontrol (force majeure)",
      "Mga aksyon ng third-party na serbisyo tulad ng Firebase/Google",
    ],
  },
  {
    id: "modifications",
    icon: "📝",
    title: "Pagbabago sa mga Tuntunin",
    content: [
      "Nagreserba kami ng karapatan na baguhin ang mga Tuntuning ito anumang oras. Ang mga makabuluhang pagbabago ay ipapabatid sa pamamagitan ng:",
    ],
    list: [
      "Abiso sa loob ng plataporma na may 30-araw na panahon ng epekto",
      "Email notification sa lahat ng registered na gumagamit",
      "Prominenteng banner sa homepage ng plataporma",
    ],
    content2: [
      "Ang patuloy na paggamit ng plataporma pagkatapos ng mga pagbabago ay itinuturing na pagtanggap ng mga binagong tuntunin.",
    ],
  },
  {
    id: "governing-law",
    icon: "⚖️",
    title: "Namamahalang Batas at Jurisdiction",
    content: [
      "Ang mga Tuntuning ito ay pinamamahalaan ng batas ng Republika ng Pilipinas. Para sa anumang hindi pagkakasundo na may kaugnayan sa paggamit ng plataporma:",
    ],
    list: [
      "Ang unang hakbang ay mediasyon sa pamamagitan ng Opisina ng Municipal Administrator",
      "Kung hindi malutas sa mediasyon, ang mga hindi pagkakasundo ay ipasa sa Regional Trial Court ng Lalawigan ng Laguna",
      "Ang Opisyal na Wika ng mga legal na proseso ay Filipino at English",
    ],
  },
  {
    id: "contact-terms",
    icon: "📬",
    title: "Makipag-ugnayan sa Amin",
    content: [
      "Para sa mga katanungan tungkol sa mga Tuntunin at Kundisyon na ito:",
    ],
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TermsPage() {
  const effectiveDate = "Setyembre 27, 2026";
  const version = "v1.0";

  return (
    <div className="min-h-screen" style={{ background: "var(--civic-navy-dark)" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <header
        style={{
          background: "linear-gradient(180deg, #0A1931 0%, rgba(10,25,49,0.95) 100%)",
          borderBottom: "1px solid rgba(96,165,250,0.12)",
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
            <span style={{ color: "#94A3B8" }}>Mga Tuntunin at Kundisyon</span>
          </nav>

          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.25)",
              }}
            >
              <svg
                className="w-7 h-7"
                style={{ color: "#F59E0B" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(245,158,11,0.12)",
                    color: "#F59E0B",
                    border: "1px solid rgba(245,158,11,0.25)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {version}
                </span>
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    color: "#10B981",
                    border: "1px solid rgba(16,185,129,0.2)",
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
                Mga Tuntunin at Kundisyon
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* Sticky ToC */}
          <aside className="hidden lg:block">
            <div
              className="sticky top-6 rounded-xl p-4"
              style={{
                background: "rgba(17,35,71,0.6)",
                border: "1px solid rgba(96,165,250,0.1)",
              }}
            >
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-3"
                style={{ color: "#475569", fontFamily: "var(--font-heading)" }}
              >
                Nilalaman
              </p>
              <nav className="flex flex-col gap-0.5" aria-label="Table of contents">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-xs px-2 py-1.5 rounded-lg transition-all duration-150"
                    style={{ color: "#94A3B8" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#F59E0B";
                      (e.currentTarget as HTMLAnchorElement).style.background = "rgba(245,158,11,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color = "#94A3B8";
                      (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    }}
                  >
                    {s.icon} {s.title}
                  </a>
                ))}
              </nav>

              <div className="mt-4 pt-4 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(96,165,250,0.1)" }}>
                <Link
                  href="/legal/privacy"
                  className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
                  style={{ color: "#60A5FA" }}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  Patakaran sa Privacy
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
                  style={{ color: "#94A3B8" }}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Bumalik sa Feed
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex flex-col gap-6">
            {/* Intro callout */}
            <div
              className="rounded-xl p-4"
              style={{
                background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(17,35,71,0.6) 100%)",
                border: "1px solid rgba(245,158,11,0.18)",
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                Ang dokumentong ito ay nagtatakda ng mga patakaran at responsibilidad para sa paggamit ng{" "}
                <strong style={{ color: "#F59E0B" }}>Civic Paete</strong> — ang opisyal na digital na plataporma ng
                Munisipalidad ng Paete. Maingat na basahin bago gamitin ang serbisyo. Ang paggamit ng plataporma ay
                katumbas ng inyong pagtanggap sa mga tuntuning ito.
              </p>
            </div>

            {/* Sections */}
            {SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="rounded-xl overflow-hidden scroll-mt-6"
                style={{
                  background: "rgba(17,35,71,0.4)",
                  border: "1px solid rgba(96,165,250,0.08)",
                }}
              >
                {/* Section header */}
                <div
                  className="px-5 py-4 flex items-center gap-3"
                  style={{
                    borderBottom: "1px solid rgba(96,165,250,0.08)",
                    background: "rgba(10,25,49,0.5)",
                  }}
                >
                  <span className="text-xl" aria-hidden="true">{section.icon}</span>
                  <h2
                    className="text-base font-bold"
                    style={{ color: "#F8FAFC", fontFamily: "var(--font-heading)" }}
                  >
                    {section.title}
                  </h2>
                </div>

                {/* Section body */}
                <div className="px-5 py-4 flex flex-col gap-3">
                  {/* Intro paragraphs */}
                  {section.content?.map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                      {para}
                    </p>
                  ))}

                  {/* Allowed / Prohibited two-column (community guidelines) */}
                  {"allowed" in section && section.allowed && "prohibited" in section && section.prohibited && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Allowed */}
                      <div
                        className="rounded-xl p-3"
                        style={{
                          background: "rgba(16,185,129,0.07)",
                          border: "1px solid rgba(16,185,129,0.2)",
                        }}
                      >
                        <p
                          className="text-xs font-bold mb-2"
                          style={{ color: "#10B981", fontFamily: "var(--font-heading)" }}
                        >
                          {section.allowed.label}
                        </p>
                        <ul className="flex flex-col gap-1.5">
                          {section.allowed.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-xs" style={{ color: "#94A3B8" }}>
                              <span className="flex-shrink-0 mt-0.5" style={{ color: "#10B981" }}>•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Prohibited */}
                      <div
                        className="rounded-xl p-3"
                        style={{
                          background: "rgba(239,68,68,0.07)",
                          border: "1px solid rgba(239,68,68,0.2)",
                        }}
                      >
                        <p
                          className="text-xs font-bold mb-2"
                          style={{ color: "#EF4444", fontFamily: "var(--font-heading)" }}
                        >
                          {section.prohibited.label}
                        </p>
                        <ul className="flex flex-col gap-1.5">
                          {section.prohibited.items.map((item) => (
                            <li key={item} className="flex items-start gap-2 text-xs" style={{ color: "#94A3B8" }}>
                              <span className="flex-shrink-0 mt-0.5" style={{ color: "#EF4444" }}>•</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Simple list */}
                  {"list" in section && section.list && (
                    <ul className="flex flex-col gap-1.5">
                      {section.list.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "#94A3B8" }}>
                          <span
                            className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                            style={{ background: "#F59E0B" }}
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Warning callout */}
                  {"callout" in section && section.callout && (
                    <div
                      className="rounded-xl px-4 py-3 flex items-start gap-3"
                      style={{
                        background: "rgba(245,158,11,0.08)",
                        border: "1px solid rgba(245,158,11,0.2)",
                      }}
                    >
                      <span className="text-base flex-shrink-0 mt-0.5" aria-hidden="true">⚠️</span>
                      <p className="text-xs leading-relaxed" style={{ color: "#FCD34D" }}>
                        {section.callout.text}
                      </p>
                    </div>
                  )}

                  {/* SLA table */}
                  {"sla" in section && section.sla && (
                    <div className="flex flex-col gap-2">
                      {section.sla.map((row) => (
                        <div
                          key={row.category}
                          className="rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                          style={{
                            background: "rgba(10,25,49,0.6)",
                            border: "1px solid rgba(96,165,250,0.08)",
                          }}
                        >
                          <div className="flex items-center gap-2 sm:w-28 flex-shrink-0">
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{
                                background: row.tagBg,
                                color: row.tagColor,
                                border: `1px solid ${row.tagColor}40`,
                                fontFamily: "var(--font-heading)",
                              }}
                            >
                              {row.tag}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold" style={{ color: "#E2E8F0", fontFamily: "var(--font-heading)" }}>
                              {row.category}
                            </p>
                            <p className="text-xs" style={{ color: "#64748B" }}>
                              {row.examples}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span
                              className="text-xs font-bold"
                              style={{ color: row.tagColor, fontFamily: "var(--font-heading)" }}
                            >
                              {row.target}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Second paragraph block (after SLA) */}
                  {"content2" in section && section.content2?.map((para, i) => (
                    <p key={i} className="text-sm leading-relaxed" style={{ color: "#64748B" }}>
                      {para}
                    </p>
                  ))}

                  {/* Contact block */}
                  {section.id === "contact-terms" && (
                    <div
                      className="rounded-xl p-4"
                      style={{
                        background: "rgba(17,35,71,0.8)",
                        border: "1px solid rgba(96,165,250,0.15)",
                      }}
                    >
                      <div className="flex flex-col gap-2">
                        <ContactRow label="Opisina" value="Opisina ng Municipal Administrator" />
                        <ContactRow label="Tirahan" value="Municipal Hall, Paete, Laguna 4007" />
                        <ContactRow
                          label="E-mail"
                          value="admin@paete.gov.ph"
                          isLink
                          href="mailto:admin@paete.gov.ph"
                        />
                        <ContactRow
                          label="Privacy"
                          value="dpo@paete.gov.ph"
                          isLink
                          href="mailto:dpo@paete.gov.ph"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}

            {/* Related legal links */}
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
                <LegalLink href="/legal/privacy" label="Patakaran sa Privacy" color="#60A5FA" />
                <LegalLink href="/legal/safety" label="Kaligtasan at Proteksyon" color="#10B981" />
              </div>
            </div>

            {/* Footer */}
            <p className="text-xs text-center py-4" style={{ color: "#475569", borderTop: "1px solid rgba(96,165,250,0.08)" }}>
              Maaaring baguhin ang mga Tuntunin at Kundisyon na ito. Ang mga pagbabago ay may 30-araw na abiso.
              Huling na-update: {effectiveDate} — {version}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ContactRow({
  label,
  value,
  isLink,
  href,
}: {
  label: string;
  value: string;
  isLink?: boolean;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="text-xs font-semibold w-16 flex-shrink-0 pt-0.5"
        style={{ color: "#475569", fontFamily: "var(--font-heading)" }}
      >
        {label}
      </span>
      {isLink && href ? (
        <a
          href={href}
          className="text-xs transition-opacity hover:opacity-80"
          style={{ color: "#60A5FA" }}
        >
          {value}
        </a>
      ) : (
        <span className="text-xs" style={{ color: "#CBD5E1" }}>
          {value}
        </span>
      )}
    </div>
  );
}

function LegalLink({ href, label, color }: { href: string; label: string; color: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-80"
      style={{
        background: `${color}14`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
      </svg>
      {label}
    </Link>
  );
}
