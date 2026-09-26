---
name: civic-paete-ui
description: Frontend craft and design system skill for Civic Paete. Use when building UI components, layouts, pages, animations, or styling in Next.js to ensure distinct, anti-generic aesthetic reflecting Paete's civic identity.
---

# Civic Paete Frontend Craft & Design System

## 1. Core Mission: Anti "AI Slop"
Avoid cookie-cutter, generic AI templates. Civic Paete is a local civic application for the **Carving Capital of the Philippines (Paete, Laguna)**. It must feel authentic, authoritative, tactile, and distinct.

### What to Avoid:
- **Overused Fonts:** Strictly avoid default `Inter`, `Roboto`, `Open Sans`, `Arial`, or unconfigured system fallbacks.
- **Cliché Templates:** No generic purple/indigo gradients or white cards on sterile light-gray backgrounds.
- **Cookie-cutter Layouts:** Avoid boring, predictable 3-column feature grids that look like every SaaS landing page.

### What to Embrace:
- **Distinctive Typography:** Use character-rich typefaces via `next/font/google` (e.g., **Outfit** or **Archivo** for bold civic authority, paired with crisp numerical/data weights).
- **Paete Cultural Identity:** Subtle textures reflecting Paete’s woodcarving (*ukit*) relief motifs, Laguna de Bay wave geometries, and deep municipal navy tones.
- **Atmospheric Depth:** Layered CSS radial gradients, subtle noise/grid textures, glassmorphism (`backdrop-blur-md`), and 1px crisp borders.
- **Tactile Micro-interactions:** Deliberate feedback for submitting reports, upvoting community concerns, and toggling map filters.

---

## 2. Color Palette & Semantic Tokens

Directly anchored to the official Civic Paete emblem:

| Token | CSS Variable | Hex | Purpose |
| :--- | :--- | :--- | :--- |
| **Civic Deep Dark** | `--civic-navy-dark` | `#071126` | Dark-mode base canvas, deep contrast |
| **Civic Navy** | `--civic-navy` | `#0A1931` | **Official Brand Dominant**: Navbars, hero background, authority headers |
| **Civic Surface** | `--civic-navy-surface` | `#112347` | Elevated dark cards, interactive panels |
| **Paete Blue** | `--paete-blue` | `#2563EB` | Primary CTA, highlight accent, brand mark |
| **Paete Blue Hover** | `--paete-blue-hover` | `#1D4ED8` | Focused/active state |
| **Laguna Sky** | `--laguna-sky` | `#60A5FA` | Wave motif, status badges, secondary accents |
| **Laguna Sky Light** | `--laguna-sky-light` | `#93C5FD` | Active indicators, soft glow borders |
| **Canvas Light** | `--background` | `#F8FAFC` | Light-mode base |

### Civic Status Indicator Tokens
- **Urgent / Hazard:** `#EF4444` (`bg-red-500/10 text-red-500 border-red-500/20`)
- **Pending Verification:** `#F59E0B` (`bg-amber-500/10 text-amber-500 border-amber-500/20`)
- **In Progress / Dispatched:** `#3B82F6` (`bg-blue-500/10 text-blue-400 border-blue-500/20`)
- **Resolved / Action Taken:** `#10B981` (`bg-emerald-500/10 text-emerald-400 border-emerald-500/20`)

---

## 3. Typography Architecture (next/font/google)

Configure in `app/layout.tsx`:
- **Primary Display & Headings:** `Outfit` or `Archivo` (weights: `600`, `800`, `900` for bold civic statements).
- **Body & Data:** `Plus Jakarta Sans` or `IBM Plex Sans` for readability in sunlight and mobile screens.
- **High-contrast hierarchy:**
  - Display: Large size jumps (`text-3xl` to `text-5xl`), tight tracking (`tracking-tight`), uppercase headers.
  - Form & Meta: `text-xs font-semibold tracking-wider uppercase text-slate-400`.

---

## 4. Layout & Motion Guidelines

- **Mobile-First Priority:** Community reporters use mobile phones outdoors in Paete barangays. All tap targets MUST be `>= 44px`.
- **Orchestrated Reveals:** Use staggered motion for listing community reports (`opacity` + `translateY` reveal).
- **Tactile Feedback:** Buttons and cards react instantly on touch/hover (`active:scale-[0.98] transition-transform duration-100`).
- **Surface Elevation:** Use 1px translucent borders (`border border-white/10` in dark mode, `border-slate-200` in light mode) over heavy drop shadows.

---

## 5. Implementation Checklist

When creating or modifying frontend components:
- [ ] Uses design tokens from `globals.css` (never hardcoded arbitrary colors).
- [ ] No generic AI-slop fonts (configured via Next.js Google font variables).
- [ ] Mobile touch target >= 44px for buttons, chips, and inputs.
- [ ] Dark & Light mode accessibility compliant (minimum 4.5:1 contrast).
- [ ] Has clear loading, empty, and error feedback states.
