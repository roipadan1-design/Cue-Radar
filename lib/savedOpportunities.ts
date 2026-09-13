const STORAGE_KEY = "cue_radar_saved_opportunities";

export interface SavedOpportunity {
  opp_id: string;
  pipeline_status: "saved" | "drafting" | "submitted" | "accepted" | "rejected";
  notes?: string;
  saved_at: string;
  opportunity?: {
    source_name?: string;
    [key: string]: any;
  };
}

export function getSavedOpportunities(): SavedOpportunity[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load saved opportunities:", error);
    return [];
  }
}

export function saveOpportunity(opp_id: string, pipeline_status: SavedOpportunity["pipeline_status"] = "saved", notes?: string, opportunity?: any): void {
  if (typeof window === "undefined") return;
  try {
    const saved = getSavedOpportunities();
    const existingIndex = saved.findIndex((item) => item.opp_id === opp_id);
    
    if (existingIndex >= 0) {
      saved[existingIndex] = {
        ...saved[existingIndex],
        pipeline_status,
        notes: notes !== undefined ? notes : saved[existingIndex].notes,
        opportunity: opportunity || saved[existingIndex].opportunity
      };
    } else {
      saved.push({
        opp_id,
        pipeline_status,
        notes,
        saved_at: new Date().toISOString(),
        opportunity
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  } catch (error) {
    console.error("Failed to save opportunity:", error);
  }
}

export function removeSavedOpportunity(opp_id: string): void {
  if (typeof window === "undefined") return;
  try {
    const saved = getSavedOpportunities();
    const filtered = saved.filter((item) => item.opp_id !== opp_id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to remove saved opportunity:", error);
  }
}

export function getPipelineStages() {
  return {
    saved: { label: "Saved", description: "Opportunities saved for later", color: "text-blue-400" },
    drafting: { label: "Drafting", description: "Currently working on application", color: "text-yellow-400" },
    submitted: { label: "Submitted", description: "Application sent out", color: "text-purple-400" },
    accepted: { label: "Accepted", description: "Successfully accepted", color: "text-[#D7FF3F]" },
    rejected: { label: "Rejected", description: "Not moving forward", color: "text-red-400" }
  };
}