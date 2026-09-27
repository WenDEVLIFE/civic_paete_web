import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Patakaran sa Privacy | Civic Paete",
  description:
    "Alamin kung paano namin pinoprotektahan ang inyong personal na impormasyon alinsunod sa Republic Act 10173 — Data Privacy Act ng Pilipinas.",
};

// ─── Section Data ─────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "scope",
    icon: "🏛️",
    title: "Saklaw ng Patakaran",
    content: [
      "Ang Patakaran sa Privacy na ito ay naaangkop sa lahat ng personal na impormasyon na kinokolekta ng Opisyal na Digital na Plataporma ng Munisipalidad ng Paete, Lalawigan ng Laguna — ang \"Civic Paete\" — mula sa mga mamamayan, opisyal, at bisita.",
      "Sumasaklaw ito sa lahat ng datos na nakolekta sa pamamagitan ng web application, mga form ng ulat, pagpapatunay ng Google, at iba pang paraan ng pakikipag-ugnayan sa plataporma.",
    ],
  },
  {
    id: "data-collected",
    icon: "📋",
    title: "Mga Datos na Kinokolekta",
    subsections: [
      {
        label: "Impormasyon ng Account",
        items: [
          "Pangalan at e-mail address (mula sa Google OAuth)",
          "Larawan ng profile (mula sa Google account)",
          "Barangay ng tirahan (ibinibigay ng mamamayan)",
          "Katayuan ng pagpapatunay ng pagkakakilanlan",
        ],
      },
      {
        label: "Datos ng Ulat at Aktibidad",
        items: [
          "Mga ulat na isinumite (pamagat, paglalarawan, kategorya, lokasyon)",
          "Mga komento at tugon sa komunidad",
          "Mga boto ng suporta sa mga ulat",
          "Mga timestamp ng aktibidad",
        ],
      },
      {
        label: "Teknikal na Datos",
        items: [
          "Mga cookies at kagustuhan (tingnan ang aming Patakaran sa Cookies)",
          "Impormasyon ng browser at device (para sa seguridad)",
          "Mga IP address (pinananatili lamang para sa pag-iwas sa abuso)",
        ],
      },
    ],
  },
  {
    id: "legal-basis",
    icon: "⚖️",
    title: "Legal na Batayan ng Pagpoproseso (RA 10173)",
    content: [
      "Pinoproseso namin ang inyong personal na datos batay sa sumusunod na legal na pundasyon ayon sa Republic Act No. 10173 (Data Privacy Act of 2012):",
    ],
    list: [
      "Pahintulot — Nagbibigay kayo ng malinaw na pahintulot bago namin iproseso ang hindi kinakailangang datos.",
      "Pagtupad sa Kontrata — Kinakailangan para maibigay ang mga serbisyo ng plataporma.",
      "Lehitimong Interes — Pamamahala ng komunidad, pagpapabuti ng serbisyo, at seguridad ng plataporma.",
      "Pagsunod sa Legal na Obligasyon — Pagtugon sa mga legal na kahilingan ng DILG, NPC, at korte.",
    ],
  },
  {
    id: "data-use",
    icon: "🎯",
    title: "Paano Namin Ginagamit ang Inyong Datos",
    list: [
      "Pagbibigay ng serbisyo ng plataporma at pamamahala ng account",
      "Pagpoproseso at pagruruta ng mga ulat ng komunidad sa tamang opisyal",
      "Pagpapadala ng mga abiso tungkol sa katayuan ng inyong mga ulat",
      "Pagsusuri ng pangkomunidad na datos para sa pagpapabuti ng serbisyo ng LGU",
      "Pagpigil sa panloloko, spam, at pag-abuso sa plataporma",
      "Pagsunod sa mga legal na obligasyon at pampublikong interes",
    ],
  },
  {
    id: "sharing",
    icon: "🤝",
    title: "Pagbabahagi ng Datos",
    content: [
      "Hindi namin ibinibenta o isinasalin ang inyong personal na datos sa mga third party para sa komersyal na layunin. Maaari kaming magbahagi ng datos sa sumusunod na limitadong sitwasyon:",
    ],
    list: [
      "Mga Opisyal ng Paete at Laguna LGU — Para sa pagpoproseso ng mga ulat at pag-abot ng mga serbisyo.",
      "Firebase/Google Cloud — Ang aming cloud infrastructure provider para sa pag-iimbak ng datos at authentication.",
      "Mga Ahensya ng Gobyerno — Kung kinakailangan ng batas, utos ng korte, o para sa pampublikong kaligtasan.",
      "Inyong Pahintulot — Para sa anumang ibang pagbabahagi, mangangailangan ng inyong malinaw na pahintulot.",
    ],
  },
  {
    id: "rights",
    icon: "🛡️",
    title: "Inyong mga Karapatan Bilang Mamamayan",
    content: [
      "Sa ilalim ng RA 10173 at ng Konstitusyon ng Pilipinas, mayroon kayong mga sumusunod na karapatan:",
    ],
    rights: [
      {
        name: "Karapatang Mabatid",
        desc: "Alamin kung anong datos ang mayroon kami tungkol sa inyo.",
      },
      {
        name: "Karapatang Mag-access",
        desc: "Humiling ng kopya ng lahat ng personal na datos na iniingatan namin.",
      },
      {
        name: "Karapatang Itama",
        desc: "Itama ang hindi tumpak o hindi kumpleto na datos.",
      },
      {
        name: "Karapatang Burahin",
        desc: "Humiling ng pagtanggal ng inyong datos, maliban kung kinakailangan ng batas.",
      },
      {
        name: "Karapatang Tumutol",
        desc: "Tumutol sa pagpoproseso ng inyong datos para sa ilang layunin.",
      },
      {
        name: "Karapatang Paglipat ng Datos",
        desc: "Humiling ng nada-download na kopya ng inyong datos sa JSON format.",
      },
    ],
  },
  {
    id: "retention",
    icon: "🗓️",
    title: "Panahon ng Pag-iingat ng Datos",
    list: [
      "Datos ng Account — Habang aktibo ang inyong account. Tatanggalin sa loob ng 30 araw pagkatapos ng pagtanggal.",
      "Mga Ulat ng Komunidad — Maaaring pinanatili nang hanggang 5 taon para sa rekord ng pampublikong interes.",
      "Mga Log ng Aktibidad — 90 araw para sa pag-iwas sa abuso, pagkatapos ay awtomatikong tatanggalin.",
      "Mga Cookie — Depende sa uri; tingnan ang Patakaran sa Cookies para sa detalye.",
    ],
  },
  {
    id: "security",
    icon: "🔐",
    title: "Seguridad ng Datos",
    content: [
      "Gumagamit kami ng mga sumusunod na hakbang para protektahan ang inyong datos:",
    ],
    list: [
      "Encryption ng datos habang nililipat (TLS 1.3) at habang nakaimbak (AES-256)",
      "Firebase Authentication para sa secure na pag-access ng account",
      "Role-based access control para sa mga opisyal ng LGU",
      "Regular na security audit at pagsusuri ng access logs",
    ],
  },
  {
    id: "contact",
    icon: "📬",
    title: "Data Protection Officer",
    content: [
      "Para sa lahat ng katanungan, alalahanin, o mga kahilingan tungkol sa inyong datos, makipag-ugnayan sa aming itinalagang Data Protection Officer:",
    ],
  },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function PrivacyPolicyPage() {
  const effectiveDate = "Setyembre 27, 2026";

  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--civic-navy-dark)" }}
    >
      {/* Header */}
      <header
        style={{
          background:
            "linear-gradient(180deg, #0A1931 0%, rgba(10,25,49,0.95) 100%)",
          borderBottom: "1px solid rgba(96,165,250,0.12)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-6 text-xs" aria-label="Breadcrumb">
            <Link
              href="/"
              className="transition-colors hover:opacity-80"
              style={{ color: "#60A5FA" }}
            >
              Civic Paete
            </Link>
            <span style={{ color: "#475569" }}>/</span>
            <span style={{ color: "#94A3B8" }}>Patakaran sa Privacy</span>
          </nav>

          {/* Shield + Title */}
          <div className="flex items-start gap-4">
            <div
              className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                background: "rgba(37,99,235,0.15)",
                border: "1px solid rgba(37,99,235,0.3)",
              }}
            >
              <svg
                className="w-7 h-7"
                style={{ color: "#60A5FA" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span
                  className="text-xs font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full"
                  style={{
                    background: "rgba(37,99,235,0.15)",
                    color: "#60A5FA",
                    border: "1px solid rgba(37,99,235,0.25)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  RA 10173 Compliant
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
                style={{
                  color: "#F8FAFC",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Patakaran sa Privacy
              </h1>
              <p className="text-sm mt-1" style={{ color: "#64748B" }}>
                Munisipalidad ng Paete, Lalawigan ng Laguna •{" "}
                <span style={{ color: "#94A3B8" }}>
                  Epektibo: {effectiveDate}
                </span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
          {/* Sticky Table of Contents */}
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
                style={{
                  color: "#475569",
                  fontFamily: "var(--font-heading)",
                }}
              >
                Nilalaman
              </p>
              <nav className="flex flex-col gap-0.5" aria-label="Table of contents">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="text-xs px-2 py-1.5 rounded-lg transition-colors duration-150 hover:opacity-90"
                    style={{ color: "#94A3B8" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "#60A5FA";
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "rgba(96,165,250,0.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.color =
                        "#94A3B8";
                      (e.currentTarget as HTMLAnchorElement).style.background =
                        "transparent";
                    }}
                  >
                    {s.icon} {s.title}
                  </a>
                ))}
              </nav>

              {/* Back to Home */}
              <div
                className="mt-4 pt-4"
                style={{ borderTop: "1px solid rgba(96,165,250,0.1)" }}
              >
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
                  style={{ color: "#60A5FA" }}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                    />
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
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(17,35,71,0.6) 100%)",
                border: "1px solid rgba(37,99,235,0.2)",
              }}
            >
              <p className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                Iginagalang ng Munisipalidad ng Paete ang inyong karapatang
                maprotektahan ang inyong personal na datos. Ang dokumentong ito
                ay nagpapaliwanag kung paano namin kinokolekta, ginagamit, at
                pinoprotektahan ang inyong impormasyon alinsunod sa{" "}
                <strong style={{ color: "#60A5FA" }}>
                  Republic Act No. 10173 — Data Privacy Act of 2012
                </strong>{" "}
                at ang mga regulasyon ng National Privacy Commission (NPC).
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
                {/* Section Header */}
                <div
                  className="px-5 py-4 flex items-center gap-3"
                  style={{
                    borderBottom: "1px solid rgba(96,165,250,0.08)",
                    background: "rgba(10,25,49,0.5)",
                  }}
                >
                  <span className="text-xl" aria-hidden="true">
                    {section.icon}
                  </span>
                  <h2
                    className="text-base font-bold"
                    style={{
                      color: "#F8FAFC",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {section.title}
                  </h2>
                </div>

                {/* Section Body */}
                <div className="px-5 py-4 flex flex-col gap-3">
                  {/* Paragraphs */}
                  {section.content?.map((para, i) => (
                    <p
                      key={i}
                      className="text-sm leading-relaxed"
                      style={{ color: "#CBD5E1" }}
                    >
                      {para}
                    </p>
                  ))}

                  {/* Sub-sections (for data collected) */}
                  {"subsections" in section &&
                    section.subsections?.map((sub) => (
                      <div key={sub.label}>
                        <p
                          className="text-xs font-semibold tracking-wider uppercase mb-1.5"
                          style={{
                            color: "#60A5FA",
                            fontFamily: "var(--font-heading)",
                          }}
                        >
                          {sub.label}
                        </p>
                        <ul className="flex flex-col gap-1">
                          {sub.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm"
                              style={{ color: "#94A3B8" }}
                            >
                              <span
                                className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                                style={{ background: "#2563EB" }}
                                aria-hidden="true"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                  {/* Simple list */}
                  {"list" in section && section.list && (
                    <ul className="flex flex-col gap-1.5">
                      {section.list.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm"
                          style={{ color: "#94A3B8" }}
                        >
                          <span
                            className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                            style={{ background: "#2563EB" }}
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Rights grid */}
                  {"rights" in section && section.rights && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {section.rights.map((right) => (
                        <div
                          key={right.name}
                          className="rounded-lg p-3"
                          style={{
                            background: "rgba(37,99,235,0.08)",
                            border: "1px solid rgba(37,99,235,0.15)",
                          }}
                        >
                          <p
                            className="text-xs font-bold mb-0.5"
                            style={{
                              color: "#60A5FA",
                              fontFamily: "var(--font-heading)",
                            }}
                          >
                            {right.name}
                          </p>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: "#94A3B8" }}
                          >
                            {right.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* DPO Contact (special section) */}
                  {section.id === "contact" && (
                    <div
                      className="rounded-xl p-4 mt-1"
                      style={{
                        background: "rgba(17,35,71,0.8)",
                        border: "1px solid rgba(96,165,250,0.15)",
                      }}
                    >
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <p
                            className="text-xs font-semibold tracking-wider uppercase mb-3"
                            style={{
                              color: "#60A5FA",
                              fontFamily: "var(--font-heading)",
                            }}
                          >
                            Data Protection Officer
                          </p>
                          <div className="flex flex-col gap-2">
                            <DPORow
                              label="Opisina"
                              value="Opisina ng Municipal Administrator"
                            />
                            <DPORow
                              label="Tirahan"
                              value="Municipal Hall, Paete, Laguna 4007"
                            />
                            <DPORow
                              label="E-mail"
                              value="dpo@paete.gov.ph"
                              isLink
                              href="mailto:dpo@paete.gov.ph"
                            />
                            <DPORow
                              label="NPC Portal"
                              value="www.privacy.gov.ph"
                              isLink
                              href="https://www.privacy.gov.ph"
                            />
                          </div>
                        </div>
                        <div
                          className="flex-shrink-0 flex flex-col items-start sm:items-end gap-2 pt-1"
                        >
                          <span
                            className="text-xs font-medium px-3 py-1.5 rounded-lg"
                            style={{
                              background: "rgba(16,185,129,0.1)",
                              color: "#10B981",
                              border: "1px solid rgba(16,185,129,0.2)",
                            }}
                          >
                            ✓ NPC Registered
                          </span>
                          <span
                            className="text-xs font-medium px-3 py-1.5 rounded-lg"
                            style={{
                              background: "rgba(37,99,235,0.1)",
                              color: "#60A5FA",
                              border: "1px solid rgba(37,99,235,0.2)",
                            }}
                          >
                            RA 10173 Compliant
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ))}

            {/* Footer note */}
            <p
              className="text-xs text-center py-4"
              style={{
                color: "#475569",
                borderTop: "1px solid rgba(96,165,250,0.08)",
              }}
            >
              Maaaring baguhin ang Patakaran sa Privacy na ito. Ang mga
              makabuluhang pagbabago ay ipapabatid sa inyong registered email
              address. Huling na-update: {effectiveDate}.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-component: DPO Row ───────────────────────────────────────────────────

function DPORow({
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
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
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
