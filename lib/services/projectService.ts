import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ProjectStatus = "completed" | "ongoing" | "bidding" | "planned";

export type ProjectCategory =
  | "road"
  | "drainage"
  | "lighting"
  | "flood"
  | "facility"
  | "environment";

export interface ProjectMilestone {
  label: string;
  done: boolean;
  date: string;
}

export interface TransparencyProject {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  barangay: string;
  budget: number;
  contractor: string;
  startDate: string;
  endDate: string;
  completionPct: number;
  fundSource: string;
  milestones: ProjectMilestone[];
  createdAt?: string;
  updatedAt?: string;
}

export const INITIAL_PROJECTS: TransparencyProject[] = [
  {
    id: "proj-1",
    title: "Drainage Expansion & Catch Basin Network — Quesada Street",
    description:
      "Installation of reinforced concrete pipe culverts (RCPC) and heavy-duty storm catch basins along Quesada Street to prevent flash runoff inundation during typhoons.",
    category: "drainage",
    status: "completed",
    barangay: "Bagumbayan",
    budget: 2_850_000,
    contractor: "Reyes Construction & Civil Supply",
    startDate: "March 2026",
    endDate: "August 2026",
    completionPct: 100,
    fundSource: "20% Municipal Development Fund (2026)",
    milestones: [
      { label: "Site excavation and utility clearing", done: true, date: "March 15" },
      { label: "RCPC installation (Phase 1)", done: true, date: "April 20" },
      { label: "Catch basin masonry & inlet installation", done: true, date: "June 5" },
      { label: "Asphalt pavement restoration", done: true, date: "August 10" },
    ],
  },
  {
    id: "proj-2",
    title: "Solar LED Streetlighting Grid — Barangay Ilaya del Norte",
    description:
      "Replacement of 48 legacy sodium-vapor streetlights with 100W energy-efficient solar LED fixtures, dedicated steel poles, and automated dusk-to-dawn sensors.",
    category: "lighting",
    status: "ongoing",
    barangay: "Ilaya del Norte",
    budget: 1_920_000,
    contractor: "SunPower Laguna Electrical Works",
    startDate: "September 2026",
    endDate: "November 2026",
    completionPct: 45,
    fundSource: "DILG Assistance to Municipalities Grant",
    milestones: [
      { label: "Procurement and delivery of LED units", done: true, date: "Sept. 10" },
      { label: "Erection of 24 lighting poles", done: true, date: "Sept. 25" },
      { label: "Wiring and junction connection", done: false, date: "Oct. 15" },
      { label: "Commissioning and safety inspection", done: false, date: "Nov. 5" },
    ],
  },
  {
    id: "proj-3",
    title: "Flood Defense Structure — Bangkusay Creek Retaining Wall",
    description:
      "Construction of a 120-linear-meter reinforced concrete retaining wall along Bangkusay Creek to mitigate riverbank erosion and protect riverside residential zones.",
    category: "flood",
    status: "ongoing",
    barangay: "Bangkusay",
    budget: 6_400_000,
    contractor: "Dela Cruz Heavy Engineering Corp.",
    startDate: "July 2026",
    endDate: "December 2026",
    completionPct: 60,
    fundSource: "DPWH Provincial Infrastructure Allocation",
    milestones: [
      { label: "East bank foundation excavation", done: true, date: "July 20" },
      { label: "Rebar installation and East wall footing", done: true, date: "August 15" },
      { label: "Concrete pouring (East bank 60m)", done: true, date: "Sept. 18" },
      { label: "West bank excavation and footing", done: false, date: "Oct. 30" },
      { label: "West bank wall completion", done: false, date: "Dec. 10" },
    ],
  },
  {
    id: "proj-4",
    title: "Barangay Road Resurfacing & Walkway Rehabilitation — Maytoong",
    description:
      "Sub-base repair, 2-inch asphalt overlay, and concrete sidewalk restoration across 850 linear meters of Maytoong road connecting to the agricultural highlands.",
    category: "road",
    status: "bidding",
    barangay: "Maytoong",
    budget: 4_200_000,
    contractor: "Under Bidding (BAC Open Competitive)",
    startDate: "November 2026",
    endDate: "February 2027",
    completionPct: 0,
    fundSource: "Barangay Development Fund + Congressional Assistance",
    milestones: [
      { label: "BAC pre-bid conference and tender award", done: false, date: "Oct. 30" },
      { label: "Contractor mobilization and grading", done: false, date: "Nov. 15" },
      { label: "Aggregate base compaction", done: false, date: "Dec. 5" },
      { label: "Asphalt overlay and thermal striping", done: false, date: "Feb. 2027" },
    ],
  },
  {
    id: "proj-5",
    title: "Paete Lakeside Eco-Park & Waste Sorting Pavilion",
    description:
      "Development of a public scenic waterfront park along Laguna de Bay featuring native bamboo landscaping, a civic promenade, and an ecological materials recovery facility.",
    category: "environment",
    status: "planned",
    barangay: "Ermita",
    budget: 3_750_000,
    contractor: "Engineering Design Phase (LGU-MPDC)",
    startDate: "January 2027",
    endDate: "June 2027",
    completionPct: 0,
    fundSource: "DENR Eco-Governance Grant & DOT-TIEZA",
    milestones: [
      { label: "DENR Environmental Compliance Certificate (ECC)", done: false, date: "Dec. 2026" },
      { label: "Detailed Architectural & Engineering Design", done: false, date: "Dec. 2026" },
      { label: "Public Procurement & Bidding", done: false, date: "Jan. 2027" },
      { label: "Promenade construction and planting", done: false, date: "June 2027" },
    ],
  },
  {
    id: "proj-6",
    title: "Paete Municipal Hall Function Wing Modernization",
    description:
      "Structural retrofitting, ceiling restoration, acoustic insulation, and ADA-compliant accessibility ramp construction for the 2nd Floor Municipal Assembly Hall.",
    category: "facility",
    status: "completed",
    barangay: "Ibaba del Norte",
    budget: 1_650_000,
    contractor: "Santillan Builders & Interior Crafts",
    startDate: "January 2026",
    endDate: "April 2026",
    completionPct: 100,
    fundSource: "Municipal Capital Outlay Reserve",
    milestones: [
      { label: "Demolition and ceiling structural retrofit", done: true, date: "Jan. 20" },
      { label: "ADA accessibility ramp installation", done: true, date: "Feb. 28" },
      { label: "Acoustic wall paneling & electrical rewiring", done: true, date: "March 20" },
      { label: "Final municipal inspection & turnover", done: true, date: "April 15" },
    ],
  },
];

const COLLECTION_NAME = "transparency_projects";

/**
 * Fetch all public works projects from Firestore `transparency_projects`.
 * Gracefully falls back to INITIAL_PROJECTS if Firestore is empty or unpopulated.
 */
export async function getTransparencyProjects(): Promise<TransparencyProject[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const q = query(colRef, orderBy("budget", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return INITIAL_PROJECTS;
    }

    const projects: TransparencyProject[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      projects.push({
        id: docSnap.id,
        title: data.title || "",
        description: data.description || "",
        category: (data.category as ProjectCategory) || "road",
        status: (data.status as ProjectStatus) || "planned",
        barangay: data.barangay || "",
        budget: Number(data.budget) || 0,
        contractor: data.contractor || "TBD",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        completionPct: Number(data.completionPct) || 0,
        fundSource: data.fundSource || "Municipal Development Fund",
        milestones: Array.isArray(data.milestones) ? data.milestones : [],
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt || undefined,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt || undefined,
      });
    });

    return projects.length > 0 ? projects : INITIAL_PROJECTS;
  } catch (error) {
    console.warn("Notice: Firestore transparency_projects lookup failed, returning default registry:", error);
    return INITIAL_PROJECTS;
  }
}

/**
 * Fetch a single transparency project by ID.
 */
export async function getTransparencyProjectById(projectId: string): Promise<TransparencyProject | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, projectId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        title: data.title || "",
        description: data.description || "",
        category: data.category || "road",
        status: data.status || "planned",
        barangay: data.barangay || "",
        budget: Number(data.budget) || 0,
        contractor: data.contractor || "TBD",
        startDate: data.startDate || "",
        endDate: data.endDate || "",
        completionPct: Number(data.completionPct) || 0,
        fundSource: data.fundSource || "",
        milestones: Array.isArray(data.milestones) ? data.milestones : [],
        createdAt: data.createdAt?.toDate?.()?.toISOString?.() || data.createdAt || undefined,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() || data.updatedAt || undefined,
      };
    }
  } catch (error) {
    console.warn(`Failed to fetch project ${projectId}:`, error);
  }

  // Check fallback list
  return INITIAL_PROJECTS.find((p) => p.id === projectId) || null;
}

/**
 * Seed initial municipal projects into Firestore if empty or on-demand.
 */
export async function seedTransparencyProjects(): Promise<void> {
  for (const project of INITIAL_PROJECTS) {
    const docRef = doc(db, COLLECTION_NAME, project.id);
    await setDoc(
      docRef,
      {
        ...project,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
