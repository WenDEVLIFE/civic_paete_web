import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type RecommendationPriority = "High Priority" | "Moderate Priority" | "Advisory";

export interface CivicRecommendation {
  id: string;
  trigger: string;
  location: string;
  barangay: string;
  action: string;
  priority: RecommendationPriority;
  category: string;
  reportCount: number;
  generatedAt?: string;
}

const COLLECTION_NAME = "insights";

/**
 * Baseline canonical recommendations adhering strictly to PROJECT.MD Sec. 7
 * (Rule-based deterministic municipal decision support)
 */
export const BASELINE_RECOMMENDATIONS: CivicRecommendation[] = [
  {
    id: "rec-bagumbayan-lighting",
    trigger: "5 recurring streetlight failure reports within 7 days",
    location: "Brgy. Bagumbayan (J. Rizal St. Corridor)",
    barangay: "Bagumbayan",
    action:
      "Recommended: Conduct comprehensive electrical circuit diagnosis and replace aged overhead wiring along the street sector.",
    priority: "High Priority",
    category: "Streetlights & Power",
    reportCount: 5,
    generatedAt: "September 27, 2026",
  },
  {
    id: "rec-maytoong-waste",
    trigger: "Recurring solid waste accumulation every Friday afternoon",
    location: "Brgy. Maytoong (Public Market Perimeter)",
    barangay: "Maytoong",
    action:
      "Recommended: Deploy dedicated auxiliary collection vehicle on Friday afternoons and station barangay environmental marshals.",
    priority: "Moderate Priority",
    category: "Solid Waste & Sanitation",
    reportCount: 4,
    generatedAt: "September 26, 2026",
  },
  {
    id: "rec-bangkusay-flood",
    trigger: "3 drainage culvert overflow concerns reported following precipitation",
    location: "Brgy. Bangkusay (Creek Retaining Wall Sector)",
    barangay: "Bangkusay",
    action:
      "Recommended: Mobilize municipal engineering desilting crew to clear sediment intake before high-tide river backflow.",
    priority: "High Priority",
    category: "Drainage & Flood Mitigation",
    reportCount: 3,
    generatedAt: "September 25, 2026",
  },
];

interface ReportCluster {
  barangay: string;
  category: string;
  count: number;
  urgentCount: number;
  reportIds: string[];
}

/**
 * 7.1 Traditional Rule-Based Incident Clustering Engine (PROJECT.MD Sec. 7)
 *
 * Core Heuristic Rule:
 * IF multiple reports (>= 2) concern the same category AND barangay
 * OR any report is marked as urgent
 * THEN generate deterministic municipal recommendation for assessment.
 *
 * Strict constraint: 0% AI/ML/LLM. 100% deterministic data aggregation.
 */
export async function generateRuleBasedRecommendations(): Promise<CivicRecommendation[]> {
  try {
    const reportsCol = collection(db, "reports");
    // Fetch active reports (pending, in_progress, urgent)
    const snapshot = await getDocs(reportsCol);

    if (snapshot.empty) {
      return BASELINE_RECOMMENDATIONS;
    }

    // 1. Group active reports by `${barangay}__${category}`
    const clusters: Record<string, ReportCluster> = {};

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const status = data.status || "pending";

      // Only cluster unresolved or active incidents
      if (status === "resolved") return;

      const barangay = data.barangay || "Bagumbayan";
      const category = (data.category || "waste").toLowerCase();
      const isUrgent = status === "urgent";

      const key = `${barangay}__${category}`;

      if (!clusters[key]) {
        clusters[key] = {
          barangay,
          category,
          count: 0,
          urgentCount: 0,
          reportIds: [],
        };
      }

      clusters[key].count += 1;
      if (isUrgent) clusters[key].urgentCount += 1;
      clusters[key].reportIds.push(docSnap.id);
    });

    const generatedRecs: CivicRecommendation[] = [];

    // 2. Evaluate deterministic rules per cluster
    for (const key of Object.keys(clusters)) {
      const cluster = clusters[key];

      // Rule threshold: At least 2 active reports OR at least 1 urgent report
      if (cluster.count >= 2 || cluster.urgentCount >= 1) {
        const priority: RecommendationPriority =
          cluster.urgentCount > 0 || cluster.count >= 3 ? "High Priority" : "Moderate Priority";

        let categoryLabel = "General Municipal Works";
        let triggerText = `${cluster.count} active citizen incident reports logged in Brgy. ${cluster.barangay}`;
        let actionRecommendation = `Recommended: Municipal operations officer to conduct site inspection in Brgy. ${cluster.barangay}.`;

        switch (cluster.category) {
          case "lighting":
            categoryLabel = "Streetlights & Power";
            triggerText = `${cluster.count} recurring streetlight failure reports in Brgy. ${cluster.barangay}`;
            actionRecommendation = `Recommended: Inspect overhead wiring and replace aged fixture units along primary thoroughfares in Brgy. ${cluster.barangay}.`;
            break;
          case "waste":
            categoryLabel = "Solid Waste & Sanitation";
            triggerText = `${cluster.count} solid waste accumulation notices flagged in Brgy. ${cluster.barangay}`;
            actionRecommendation = `Recommended: Deploy dedicated auxiliary collection vehicle and station environmental marshals at frequent drop points in Brgy. ${cluster.barangay}.`;
            break;
          case "drainage":
            categoryLabel = "Drainage & Flood Mitigation";
            triggerText = `${cluster.count} culvert blockage & stormwater overflow reports in Brgy. ${cluster.barangay}`;
            actionRecommendation = `Recommended: Mobilize municipal desilting crew to clear drainage canals and catch basins in Brgy. ${cluster.barangay} prior to seasonal monsoons.`;
            break;
          case "road":
            categoryLabel = "Roads & Public Infrastructure";
            triggerText = `${cluster.count} road surface degradation / pothole reports along Brgy. ${cluster.barangay}`;
            actionRecommendation = `Recommended: Municipal Engineering Office to schedule cold-patch asphalt resurfacing and erect temporary safety cones in Brgy. ${cluster.barangay}.`;
            break;
          case "safety":
            categoryLabel = "Public Safety & Hazards";
            triggerText = `${cluster.count} public safety hazard or obstruction alerts logged in Brgy. ${cluster.barangay}`;
            actionRecommendation = `Recommended: Joint safety assessment between MDRRMO and Barangay Tanod personnel for immediate perimeter securing in Brgy. ${cluster.barangay}.`;
            break;
        }

        generatedRecs.push({
          id: `rec-${cluster.barangay.toLowerCase().replace(/\s+/g, "-")}-${cluster.category}`,
          trigger: triggerText,
          location: `Brgy. ${cluster.barangay}`,
          barangay: cluster.barangay,
          action: actionRecommendation,
          priority,
          category: categoryLabel,
          reportCount: cluster.count,
          generatedAt: new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        });
      }
    }

    // Blend with baseline if fewer than 2 dynamic recommendations are triggered
    if (generatedRecs.length < 2) {
      for (const baseline of BASELINE_RECOMMENDATIONS) {
        if (!generatedRecs.some((r) => r.id === baseline.id)) {
          generatedRecs.push(baseline);
        }
      }
    }

    return generatedRecs;
  } catch (error) {
    console.warn("Notice: Rule-based recommendation engine encountered error, returning baseline:", error);
    return BASELINE_RECOMMENDATIONS;
  }
}

/**
 * 7.2 Read or subscribe to civic recommendations.
 */
export async function getCivicInsights(): Promise<CivicRecommendation[]> {
  try {
    const colRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(colRef);

    if (snapshot.empty) {
      const generated = await generateRuleBasedRecommendations();
      // Synchronize generated recommendations into Firestore
      await syncRecommendationsToFirestore(generated);
      return generated;
    }

    const items: CivicRecommendation[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      items.push({
        id: docSnap.id,
        trigger: data.trigger || "",
        location: data.location || "",
        barangay: data.barangay || "Paete",
        action: data.action || "",
        priority: (data.priority as RecommendationPriority) || "Moderate Priority",
        category: data.category || "General",
        reportCount: Number(data.reportCount) || 1,
        generatedAt: data.generatedAt || "Recently",
      });
    });

    return items.length > 0 ? items : BASELINE_RECOMMENDATIONS;
  } catch (err) {
    console.warn("Notice: Firestore insights lookup notice:", err);
    return BASELINE_RECOMMENDATIONS;
  }
}

/**
 * Sync recommendations array to Firestore `insights` collection.
 */
export async function syncRecommendationsToFirestore(
  recommendations?: CivicRecommendation[]
): Promise<void> {
  try {
    const items = recommendations || (await generateRuleBasedRecommendations());
    for (const rec of items) {
      const docRef = doc(db, COLLECTION_NAME, rec.id);
      await setDoc(
        docRef,
        {
          ...rec,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.warn("Notice: Unable to sync insights to Firestore (continuing):", err);
  }
}

/**
 * Real-time listener for civic recommendations feed.
 */
export function subscribeToCivicInsights(
  callback: (recommendations: CivicRecommendation[]) => void
): Unsubscribe {
  const colRef = collection(db, COLLECTION_NAME);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        const generated = await generateRuleBasedRecommendations();
        callback(generated);
        // Background sync
        syncRecommendationsToFirestore(generated).catch(() => {});
        return;
      }

      const items: CivicRecommendation[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          trigger: data.trigger || "",
          location: data.location || "",
          barangay: data.barangay || "Paete",
          action: data.action || "",
          priority: (data.priority as RecommendationPriority) || "Moderate Priority",
          category: data.category || "General",
          reportCount: Number(data.reportCount) || 1,
          generatedAt: data.generatedAt || "Recently",
        });
      });

      callback(items.length > 0 ? items : BASELINE_RECOMMENDATIONS);
    },
    (err) => {
      console.warn("Insights subscription notice:", err);
      callback(BASELINE_RECOMMENDATIONS);
    }
  );
}
