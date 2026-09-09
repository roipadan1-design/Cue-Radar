/**
 * ============================================================================
 * CUE RADAR — Digital Career OS for Alternative Artists
 * Relational Two-Table Architecture: Sources & Opportunities
 * Master Database Brain: 268 Sources · 23 Markets · 18 Countries
 * Design System: Japanese Minimalism & Resident Advisor Editorial Feed
 * ============================================================================
 */

import {
  sources,
  opportunities,
  masterMetadata,
  getOpportunityWithSource,
  calculateDaysRemaining,
  formatDeadlineDate,
  parseMasterCSV,
  exportSourcesToCSV,
  artistProfile,
  artistPortfolio
} from "./data.js";

import { initAuth, signInWithGoogle, signOutUser } from "./auth.js";
import { mountReactProfile } from "./mountProfile.tsx";

// ============================================================================
// 1. APPLICATION STATE
// ============================================================================
const STORAGE_KEY = "cue_radar_saved_opp_ids_v2";
const STORAGE_SOURCES_KEY = "cue_radar_master_sources_v2";
const STORAGE_OPPS_KEY = "cue_radar_master_opps_v2";

const state = {
  activeView: "hub", // "hub" | "profile"
  activeProfileTab: "saved", // "saved" | "portfolio"

  // Master Database Metadata
  masterMetadata: { ...masterMetadata },

  // Relational data collections
  sources: [...sources],
  opportunities: [...opportunities],

  // Filter state
  activeCity: "All", // "All" | "Berlin" | "Cologne" | "Tel Aviv" | "Brussels" | etc.
  activeDiscipline: "All", // "All" | "Dance" | "Sound" | "Multidisciplinary"
  activeType: "All", // "All" | "Funding" | "Residency" | "Open Call"
  savedOnly: false,
  searchQuery: "",
  sortBy: "deadline-asc", // "deadline-asc" | "deadline-desc" | "title-asc"

  // Bookmarks in LocalStorage
  savedIds: new Set(),

  // Auth state
  user: null,

  // Showreel video state
  isVideoPlaying: false,
  isVideoMuted: false,

  // Modal state
  activeModalData: null,
  activeSyncTab: "overview", // "overview" | "import" | "guide" | "export"
  stagedParsedSources: []
};

// ============================================================================
// 2. LOCAL STORAGE PERSISTENCE
// ============================================================================
function initStorage() {
  try {
    // 1. Load saved opportunity IDs
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        state.savedIds = new Set(parsed);
      }
    }
  } catch (err) {
    console.warn("[CUE RADAR] LocalStorage savedIds load failed:", err);
    state.savedIds = new Set();
  }

  try {
    // 2. Load custom/updated sources if stored
    const customSourcesRaw = localStorage.getItem(STORAGE_SOURCES_KEY);
    if (customSourcesRaw) {
      const parsedSources = JSON.parse(customSourcesRaw);
      if (Array.isArray(parsedSources) && parsedSources.length > 0) {
        state.sources = parsedSources;
        console.log(`[CUE RADAR] Loaded ${parsedSources.length} custom sources from LocalStorage.`);
      }
    }
  } catch (err) {
    console.warn("[CUE RADAR] Custom sources load failed, using default master dataset:", err);
  }

  try {
    // 3. Load custom/updated opportunities if stored
    const customOppsRaw = localStorage.getItem(STORAGE_OPPS_KEY);
    if (customOppsRaw) {
      const parsedOpps = JSON.parse(customOppsRaw);
      if (Array.isArray(parsedOpps) && parsedOpps.length > 0) {
        state.opportunities = parsedOpps;
        console.log(`[CUE RADAR] Loaded ${parsedOpps.length} custom opportunities from LocalStorage.`);
      }
    }
  } catch (err) {
    console.warn("[CUE RADAR] Custom opps load failed, using default opportunities:", err);
  }
}

function persistSavedIds() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(state.savedIds)));
  } catch (err) {
    console.error("[CUE RADAR] LocalStorage save failed:", err);
  }
}

function persistSourcesToStorage(sourcesArray) {
  try {
    localStorage.setItem(STORAGE_SOURCES_KEY, JSON.stringify(sourcesArray));
  } catch (err) {
    console.error("[CUE RADAR] Failed to save sources to LocalStorage:", err);
  }
}

function resetMasterSourcesToDefault() {
  try {
    localStorage.removeItem(STORAGE_SOURCES_KEY);
    localStorage.removeItem(STORAGE_OPPS_KEY);
    state.sources = [...sources];
    state.opportunities = [...opportunities];
    updateUI();
    showToast("Reset database to master default (268 sources)");
  } catch (err) {
    console.error("[CUE RADAR] Failed to reset sources:", err);
  }
}

/**
 * Toggle bookmark state for an opportunity ID
 * @param {string} oppId
 */
function toggleSaveOpportunity(oppId) {
  const isSaved = state.savedIds.has(oppId);
  const opp = state.opportunities.find((o) => o.opp_id === oppId);
  const title = opp ? opp.title : "Opportunity";

  if (isSaved) {
    state.savedIds.delete(oppId);
    showToast(`Removed "${truncate(title, 28)}" from saved`);
  } else {
    state.savedIds.add(oppId);
    showToast(`Saved "${truncate(title, 28)}"`);
  }

  persistSavedIds();
  updateUI();
  return !isSaved;
}

// ============================================================================
// 3. FILTERING & SORTING PIPELINE
// Relational join with Sources for city, market and institution details
// ============================================================================
function getFilteredOpportunities() {
  // First join with Sources
  const joinedList = state.opportunities.map((opp) => getOpportunityWithSource(opp, state.sources));

  const filtered = joinedList.filter((item) => {
    // 1. City / Market Filter (Row 1)
    if (state.activeCity !== "All") {
      const target = state.activeCity.toLowerCase();
      const city = (item.city || "").toLowerCase();
      const market = (item.market || "").toLowerCase();
      const country = (item.country || "").toLowerCase();

      const match =
        city.includes(target) ||
        market.includes(target) ||
        target.includes(city) ||
        (target.includes("cologne") && (city.includes("köln") || market.includes("köln"))) ||
        (target.includes("köln") && city.includes("cologne"));

      if (!match) {
        return false;
      }
    }

    // 2. Discipline Filter (Row 2)
    if (state.activeDiscipline !== "All") {
      if (item.discipline.toLowerCase() !== state.activeDiscipline.toLowerCase()) {
        return false;
      }
    }

    // 3. Opportunity Type Filter (Row 3)
    if (state.activeType !== "All") {
      if (item.type.toLowerCase() !== state.activeType.toLowerCase()) {
        return false;
      }
    }

    // 4. Saved Only Toggle
    if (state.savedOnly) {
      if (!state.savedIds.has(item.opp_id)) {
        return false;
      }
    }

    // 5. Search Query
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase().trim();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSource = item.source_name.toLowerCase().includes(q);
      const matchCity = item.city.toLowerCase().includes(q);
      const matchDiscipline = item.discipline.toLowerCase().includes(q);
      const matchType = item.type.toLowerCase().includes(q);
      const matchDesc = item.description ? item.description.toLowerCase().includes(q) : false;

      if (!matchTitle && !matchSource && !matchCity && !matchDiscipline && !matchType && !matchDesc) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  filtered.sort((a, b) => {
    if (state.sortBy === "deadline-asc") {
      return a.daysRemaining - b.daysRemaining;
    }
    if (state.sortBy === "deadline-desc") {
      return b.daysRemaining - a.daysRemaining;
    }
    if (state.sortBy === "title-asc") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return filtered;
}

// ============================================================================
// 4. CARD RENDERING — MOBILE FIRST CARD HIERARCHY
// ============================================================================
/**
 * Generates an HTML card element conforming strictly to PART 3:
 * 1. Top row: Institution Name & City (DM Sans, small, light grey)
 * 2. Title: Space Grotesk, large, pure white, prominent
 * 3. Tags: Discipline & Type tags aligned horizontally (DM Sans, small)
 * 4. Compensation details: clear secondary line
 * 5. Footer: Countdown badge on left ("Ends in X days"), Pill Save button on right
 */
function getCountryFlag(country = "") {
  const normalized = country.toLowerCase().trim();
  const flags = {
    germany: "🇩🇪", deutschland: "🇩🇪", israel: "🇮🇱", belgium: "🇧🇪", switzerland: "🇨🇭", austria: "🇦🇹", netherlands: "🇳🇱", france: "🇫🇷", uk: "🇬🇧", "united kingdom": "🇬🇧", usa: "🇺🇸", "united states": "🇺🇸"
  };
  return flags[normalized] || "🌍";
}

function createOpportunityCardHTML(item) {
  const isSaved = state.savedIds.has(item.opp_id);
  const days = item.daysRemaining;

  // Countdown text formatting & urgency
  let countdownText = "";
  const isClosed = days < 0;
  const isUrgent = days >= 0 && days <= 7;

  if (isClosed) {
    countdownText = "Call Closed";
  } else if (days === 0) {
    countdownText = "Ends Today";
  } else if (days === 1) {
    countdownText = "Ends in 1 day";
  } else {
    countdownText = `Ends in ${days} days`;
  }

  return `
    <article 
      class="opportunity-card" 
      data-opp-id="${escapeHtml(item.opp_id)}"
      tabindex="0"
      role="button"
      aria-label="${escapeHtml(item.title)} by ${escapeHtml(item.source_name)}"
    >
      <!-- 1. Header Line: Institution Name + City (DM Sans, small, light grey) -->
      <div class="card-header-line">
        <div class="card-institution-wrap">
          <span class="card-institution-name">${escapeHtml(item.source_name)}</span>
          <span class="card-bullet" aria-hidden="true">·</span>
          <span class="card-city-name">${escapeHtml(item.city)}</span>
        </div>
        <span class="card-country-tag"><span class="country-flag" aria-hidden="true">${getCountryFlag(item.country)}</span>${escapeHtml(item.country)}</span>
      </div>

      <!-- 2. Opportunity Title: Space Grotesk, large, pure white, prominent -->
      <h2 class="card-title">${escapeHtml(item.title)}</h2>

      <!-- 3. Tags: Discipline and Type tags aligned horizontally (DM Sans, small) -->
      <div class="card-tags-row">
        <span class="card-discipline-pill">${escapeHtml(item.discipline)}</span>
        <span class="card-type-pill">${escapeHtml(item.type)}</span>
      </div>

      <!-- Compensation Details Line -->
      ${
        item.compensation_details
          ? `<div class="card-compensation-line">
              <span class="compensation-label">Grant:</span>
              <span class="compensation-val">${escapeHtml(item.compensation_details)}</span>
            </div>`
          : ""
      }

      <!-- 4. Footer / Action Bar: Countdown badge & Save pill -->
      <div class="card-footer-action-bar">
        <div class="countdown-badge ${isUrgent ? "urgent" : ""} ${isClosed ? "closed" : ""}">
          <span class="countdown-dot" aria-hidden="true"></span>
          <span>${escapeHtml(countdownText)}</span>
        </div>

        <button 
          type="button" 
          class="btn-save-pill ${isSaved ? "saved" : ""}" 
          data-action="save"
          data-opp-id="${escapeHtml(item.opp_id)}"
          aria-pressed="${isSaved}"
          aria-label="${isSaved ? "Remove from saved" : "Save opportunity"}"
        >
          <span class="save-pill-star" aria-hidden="true">★</span>
          <span class="save-pill-label">${isSaved ? "Saved" : "Save"}</span>
        </button>
      </div>
    </article>
  `;
}

// ============================================================================
// 5. VIEW RENDERING (THE HUB & ARTIST PROFILE)
// ============================================================================

/**
 * Render the Opportunities Feed in The Hub
 */
function renderFeed() {
  const container = document.getElementById("opportunities-grid");
  const emptyBox = document.getElementById("empty-feed-box");
  const countDisplay = document.getElementById("feed-count-indicator");

  if (!container) return;

  const items = getFilteredOpportunities();

  // Update count indicator
  if (countDisplay) {
    const total = state.opportunities.length;
    if (items.length === total) {
      countDisplay.textContent = `Showing all ${total} opportunities`;
    } else {
      countDisplay.textContent = `Showing ${items.length} of ${total} opportunities`;
    }
  }

  if (items.length === 0) {
    container.innerHTML = "";
    if (emptyBox) emptyBox.style.display = "flex";
  } else {
    if (emptyBox) emptyBox.style.display = "none";
    container.innerHTML = items.map((item) => createOpportunityCardHTML(item)).join("");
  }

  // Update floating quick-filter pill label
  updateFloatingPill(items.length);
}

/**
 * Updates floating quick-filter pill label with active criteria
 */
function updateFloatingPill(count) {
  const label = document.getElementById("floating-pill-label");
  if (!label) return;

  const activeParts = [];
  if (state.activeCity !== "All") activeParts.push(state.activeCity);
  if (state.activeDiscipline !== "All") activeParts.push(state.activeDiscipline);
  if (state.activeType !== "All") activeParts.push(state.activeType);
  if (state.savedOnly) activeParts.push("Saved");

  if (activeParts.length > 0) {
    label.textContent = `Filters (${activeParts.join(" · ")}) · ${count}`;
  } else {
    label.textContent = `Filters · ${count} Calls`;
  }
}

/**
 * Render Artist Profile View (Part 4: Digital Artist Card & Setup Wizard)
 */
function renderProfileView() {
  mountReactProfile("view-profile");
}

/**
 * Update global UI elements (Counters, active filter indicators, view toggles)
 */
function updateUI() {
  const savedCount = state.savedIds.size;

  // Header & filter badges (desktop and mobile)
  const navSavedBadge = document.getElementById("nav-saved-count");
  if (navSavedBadge) navSavedBadge.textContent = savedCount.toString();

  const navMobileSavedBadge = document.getElementById("nav-mobile-saved-count");
  if (navMobileSavedBadge) navMobileSavedBadge.textContent = savedCount.toString();

  const filterSavedBadge = document.getElementById("filter-saved-count");
  if (filterSavedBadge) filterSavedBadge.textContent = savedCount.toString();

  const navSavedBtn = document.getElementById("nav-saved-btn");
  if (navSavedBtn) {
    navSavedBtn.classList.toggle("active", state.savedOnly);
  }

  const btnMobileSaved = document.getElementById("btn-mobile-saved");
  if (btnMobileSaved) {
    btnMobileSaved.classList.toggle("active", state.savedOnly);
  }

  const btnMobileProfile = document.getElementById("btn-mobile-profile");
  if (btnMobileProfile) {
    btnMobileProfile.classList.toggle("active", state.activeView === "profile");
    btnMobileProfile.setAttribute("aria-pressed", state.activeView === "profile" ? "true" : "false");
  }

  const btnFilterSaved = document.getElementById("btn-filter-saved");
  if (btnFilterSaved) {
    btnFilterSaved.classList.toggle("active", state.savedOnly);
  }

  // Update view navigation tabs (desktop and mobile drawer)
  const hubView = document.getElementById("view-hub");
  const profileView = document.getElementById("view-profile");
  const navViewHub = document.getElementById("nav-view-hub");
  const navViewProfile = document.getElementById("nav-view-profile");
  const drawerViewHub = document.getElementById("drawer-view-hub");
  const drawerViewProfile = document.getElementById("drawer-view-profile");

  if (state.activeView === "hub") {
    if (hubView) hubView.style.display = "block";
    if (profileView) {
      profileView.style.display = "none";
      profileView.classList.remove("active");
    }
    if (navViewHub) {
      navViewHub.classList.add("active");
      navViewHub.setAttribute("aria-pressed", "true");
    }
    if (navViewProfile) {
      navViewProfile.classList.remove("active");
      navViewProfile.setAttribute("aria-pressed", "false");
    }
    if (drawerViewHub) drawerViewHub.classList.add("active");
    if (drawerViewProfile) drawerViewProfile.classList.remove("active");
    renderFeed();
  } else {
    if (hubView) hubView.style.display = "none";
    if (profileView) {
      profileView.style.display = "";
      profileView.classList.add("active");
    }
    if (navViewHub) {
      navViewHub.classList.remove("active");
      navViewHub.setAttribute("aria-pressed", "false");
    }
    if (navViewProfile) {
      navViewProfile.classList.add("active");
      navViewProfile.setAttribute("aria-pressed", "true");
    }
    if (drawerViewHub) drawerViewHub.classList.remove("active");
    if (drawerViewProfile) drawerViewProfile.classList.add("active");
    renderProfileView();
  }

  // Update active chips across the 3 filter rows
  updateFilterChipsUI();

  // Update clear all button visibility
  const hasActiveFilters =
    state.activeCity !== "All" ||
    state.activeDiscipline !== "All" ||
    state.activeType !== "All" ||
    state.savedOnly ||
    state.searchQuery.trim().length > 0;

  const btnClearAll = document.getElementById("btn-clear-all-filters");
  if (btnClearAll) {
    btnClearAll.style.display = hasActiveFilters ? "inline-block" : "none";
  }

  const searchClearBtn = document.getElementById("search-clear-btn");
  if (searchClearBtn) {
    searchClearBtn.classList.toggle("visible", state.searchQuery.trim().length > 0);
  }
}

/**
 * Sync active classes on filter chips across all 3 rows
 */
function updateFilterChipsUI() {
  // Row 1: City
  document.querySelectorAll('[data-filter-group="city"]').forEach((btn) => {
    const val = btn.getAttribute("data-filter");
    btn.classList.toggle("active", val === state.activeCity);
  });

  // Row 2: Discipline
  document.querySelectorAll('[data-filter-group="discipline"]').forEach((btn) => {
    const val = btn.getAttribute("data-filter");
    btn.classList.toggle("active", val === state.activeDiscipline);
  });

  // Row 3: Type
  document.querySelectorAll('[data-filter-group="type"]').forEach((btn) => {
    const val = btn.getAttribute("data-filter");
    btn.classList.toggle("active", val === state.activeType);
  });
}

// ============================================================================
// 6. MODALS (Opportunity Detail, Institutions Directory)
// ============================================================================

/**
 * Open Opportunity Details Modal
 */
function openOpportunityModal(oppId) {
  const opp = state.opportunities.find((o) => o.opp_id === oppId);
  if (!opp) return;

  const item = getOpportunityWithSource(opp);
  const isSaved = state.savedIds.has(item.opp_id);
  const days = item.daysRemaining;

  const modalContainer = document.getElementById("modal-content-container");
  const modalOverlay = document.getElementById("general-modal");

  if (!modalContainer || !modalOverlay) return;

  modalContainer.innerHTML = `
    <button type="button" class="modal-close-btn" id="btn-modal-close" aria-label="Close dialog">✕ Close</button>
    <div class="modal-kicker">${escapeHtml(item.discipline)} · ${escapeHtml(item.type)}</div>
    <h2 class="modal-title">${escapeHtml(item.title)}</h2>

    <div class="modal-meta-grid">
      <div class="modal-meta-item">
        <span class="modal-meta-label">Institution</span>
        <span class="modal-meta-value">${escapeHtml(item.source_name)}</span>
      </div>
      <div class="modal-meta-item">
        <span class="modal-meta-label">City &amp; Country</span>
        <span class="modal-meta-value">${escapeHtml(item.city)}, ${escapeHtml(item.country)}</span>
      </div>
      <div class="modal-meta-item">
        <span class="modal-meta-label">Application Deadline</span>
        <span class="modal-meta-value" style="color: var(--vermilion);">${formatDeadlineDate(item.deadline)} (${days >= 0 ? `Ends in ${days} days` : "Closed"})</span>
      </div>
      <div class="modal-meta-item">
        <span class="modal-meta-label">Compensation / Support</span>
        <span class="modal-meta-value">${escapeHtml(item.compensation_details || "See official guidelines")}</span>
      </div>
    </div>

    <div class="modal-section-title">Overview &amp; Scope</div>
    <p class="modal-body-text">${escapeHtml(item.description || "No detailed description available.")}</p>

    ${
      item.eligibility
        ? `<div class="modal-section-title">Eligibility Criteria</div>
           <p class="modal-body-text">${escapeHtml(item.eligibility)}</p>`
        : ""
    }

    <div class="modal-section-title">About the Institution</div>
    <p class="modal-body-text">${escapeHtml(item.source.description || "")}</p>

    <div class="modal-actions-row">
      <button 
        type="button" 
        class="btn-save-pill ${isSaved ? "saved" : ""}" 
        id="modal-btn-save"
        data-opp-id="${escapeHtml(item.opp_id)}"
      >
        <span class="save-pill-star">★</span>
        <span>${isSaved ? "Saved to Radar" : "Save Opportunity"}</span>
      </button>

      <a 
        href="${escapeHtml(item.application_url)}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="btn-primary-action"
      >
        <span>Apply via Official Portal</span>
        <span aria-hidden="true">↗</span>
      </a>
    </div>
  `;

  modalOverlay.classList.add("active");
  modalOverlay.setAttribute("aria-hidden", "false");

  // Bind close button
  document.getElementById("btn-modal-close")?.addEventListener("click", closeModal);

  // Bind modal save button
  document.getElementById("modal-btn-save")?.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSaveOpportunity(item.opp_id);
    const updatedSaved = state.savedIds.has(item.opp_id);
    const btn = document.getElementById("modal-btn-save");
    if (btn) {
      btn.classList.toggle("saved", updatedSaved);
      btn.querySelector("span:last-child").textContent = updatedSaved ? "Saved to Radar" : "Save Opportunity";
    }
  });
}

/**
 * Open Institutions Directory Modal with Search & Market Filter
 */
function openInstitutionsModal(selectedMarket = "All") {
  const modalContainer = document.getElementById("modal-content-container");
  const modalOverlay = document.getElementById("general-modal");

  if (!modalContainer || !modalOverlay) return;

  const totalSources = state.sources.length;
  const verifiedCount = state.sources.filter(s => !s.needs_verification).length;
  const flaggedCount = state.sources.filter(s => s.needs_verification).length;

  const uniqueMarkets = ["All", ...Array.from(new Set(state.sources.map(s => s.market || s.city).filter(Boolean))).sort()];

  function renderDirectoryList(filterQuery = "", marketFilter = selectedMarket) {
    const listContainer = document.getElementById("inst-directory-list");
    if (!listContainer) return;

    const q = filterQuery.toLowerCase().trim();
    const filtered = state.sources.filter(src => {
      if (marketFilter !== "All") {
        const sm = (src.market || src.city || "").toLowerCase();
        if (!sm.includes(marketFilter.toLowerCase())) return false;
      }
      if (q) {
        const name = (src.source_name || "").toLowerCase();
        const city = (src.city || "").toLowerCase();
        const disc = (src.discipline_focus || "").toLowerCase();
        const desc = (src.description || "").toLowerCase();
        return name.includes(q) || city.includes(q) || disc.includes(q) || desc.includes(q);
      }
      return true;
    });

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div style="padding: 2.5rem 1rem; text-align: center; color: var(--text-muted);">
          <p>No institutions match your search criteria.</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = filtered.map(src => {
      const isFlagged = src.needs_verification;
      return `
        <div style="border-bottom: 1px solid var(--border-line); padding: 1.25rem 0;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.4rem;">
            <div>
              <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                <span style="font-family: monospace; font-size: 0.75rem; color: var(--text-muted); background: #1F1F1F; padding: 0.1rem 0.4rem; border-radius: 2px;">
                  ${escapeHtml(src.source_id)}
                </span>
                <h3 style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin: 0;">
                  ${escapeHtml(src.source_name)}
                </h3>
                ${isFlagged ? `
                  <span class="badge-verification-warning" title="Flagged in Master Intake">
                    ⚠️ Needs URL Verification
                  </span>
                ` : ""}
              </div>
              <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: 0.35rem; flex-wrap: wrap;">
                <span style="font-size: 0.8rem; color: var(--vermilion); font-weight: 600;">${escapeHtml(src.market || src.city)}</span>
                <span style="color: var(--text-muted);">·</span>
                <span style="font-size: 0.8rem; color: var(--text-muted);">${escapeHtml(src.city)}, ${escapeHtml(src.country)}</span>
                <span style="color: var(--text-muted);">·</span>
                <span style="font-size: 0.75rem; background: #222; color: #AAA; padding: 0.1rem 0.5rem; border-radius: 9999px;">
                  ${escapeHtml(src.discipline_focus || "Multidisciplinary")}
                </span>
                <span style="font-size: 0.75rem; background: #222; color: #888; padding: 0.1rem 0.5rem; border-radius: 9999px;">
                  ${escapeHtml(src.source_type || "Production House")}
                </span>
              </div>
            </div>
          </div>

          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.5; margin: 0.65rem 0;">
            ${escapeHtml(src.description || "Verified cultural institution and residency producer.")}
          </p>

          ${isFlagged && src.verification_note ? `
            <div style="font-size: 0.8rem; color: #FBBF24; margin-bottom: 0.6rem; font-style: italic;">
              Note: ${escapeHtml(src.verification_note)}
            </div>
          ` : ""}

          <div style="display: flex; gap: 1.25rem; align-items: center; font-size: 0.85rem; margin-top: 0.4rem;">
            ${src.website_url ? `
              <a href="${escapeHtml(src.website_url)}" target="_blank" rel="noopener noreferrer" style="color: var(--text-primary); text-decoration: underline; font-weight: 500;">
                Official Website ↗
              </a>
            ` : `
              <span style="color: var(--text-muted); font-style: italic;">No official website URL confirmed</span>
            `}
            ${src.instagram_url ? `
              <a href="${escapeHtml(src.instagram_url)}" target="_blank" rel="noopener noreferrer" style="color: var(--text-muted); text-decoration: underline;">
                Instagram ↗
              </a>
            ` : ""}
          </div>
        </div>
      `;
    }).join("");
  }

  modalContainer.innerHTML = `
    <button type="button" class="modal-close-btn" id="btn-modal-close" aria-label="Close dialog">✕ Close</button>
    <div class="modal-kicker">CUE RADAR · Master Brain Directory</div>
    <h2 class="modal-title">Verified Cultural Sources (${totalSources})</h2>
    <p class="modal-body-text" style="margin-bottom: 1.25rem;">
      Curated network of 268 independent institutions, choreographic production houses, electroacoustic studios, and public funding councils across 23 international markets.
    </p>

    <div style="display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
      <button type="button" class="btn-primary-action" id="btn-open-sync-from-directory" style="padding: 0.45rem 0.9rem; font-size: 0.8rem; background-color: #222; border: 1px solid #444; color: #fff;">
        ⚙ Master Database Brain &amp; Live Sync
      </button>
      <button type="button" class="nav-text-btn" id="btn-export-sources-csv" style="padding: 0.45rem 0.9rem; font-size: 0.8rem; border: 1px solid #333;">
        Export Sources CSV ⤓
      </button>
    </div>

    <!-- Filter Bar -->
    <div style="display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap;">
      <input 
        type="text" 
        id="inst-search-input" 
        class="db-source-search-input" 
        placeholder="Filter by name, city, discipline, keyword..." 
        style="flex: 2; min-width: 220px;"
      />
      <select id="inst-market-select" class="db-source-search-input" style="flex: 1; min-width: 160px; background-color: #181818;">
        ${uniqueMarkets.map(m => `<option value="${escapeHtml(m)}" ${m === selectedMarket ? "selected" : ""}>${escapeHtml(m)}</option>`).join("")}
      </select>
    </div>

    <div id="inst-directory-list" style="display: flex; flex-direction: column; max-height: 520px; overflow-y: auto; padding-right: 0.5rem;"></div>
  `;

  modalOverlay.classList.add("active");
  modalOverlay.setAttribute("aria-hidden", "false");

  // Render initial list
  renderDirectoryList("", selectedMarket);

  // Bind search & select
  const searchInput = document.getElementById("inst-search-input");
  const marketSelect = document.getElementById("inst-market-select");

  searchInput?.addEventListener("input", (e) => {
    renderDirectoryList(e.target.value, marketSelect ? marketSelect.value : "All");
  });

  marketSelect?.addEventListener("change", (e) => {
    renderDirectoryList(searchInput ? searchInput.value : "", e.target.value);
  });

  document.getElementById("btn-open-sync-from-directory")?.addEventListener("click", () => {
    openDatabaseSyncModal();
  });

  document.getElementById("btn-export-sources-csv")?.addEventListener("click", () => {
    downloadCSV("cue_radar_sources_master.csv", exportSourcesToCSV(state.sources));
    showToast("Downloaded master sources CSV");
  });

  document.getElementById("btn-modal-close")?.addEventListener("click", closeModal);
}

/**
 * Open Master Database Brain & Live Sync Modal
 */
function openDatabaseSyncModal() {
  const modalContainer = document.getElementById("modal-content-container");
  const modalOverlay = document.getElementById("general-modal");

  if (!modalContainer || !modalOverlay) return;

  const totalSources = state.sources.length;
  const totalMarkets = 23;
  const totalCountries = 18;
  const activeOppsCount = state.opportunities.length;

  function renderActiveTab(tabName) {
    state.activeSyncTab = tabName;

    // Update tab button classes
    document.querySelectorAll(".db-modal-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
    });

    const contentArea = document.getElementById("db-tab-content-area");
    if (!contentArea) return;

    if (tabName === "overview") {
      contentArea.innerHTML = `
        <div class="db-stats-grid">
          <div class="db-stat-card">
            <span class="db-stat-num">${totalSources}</span>
            <span class="db-stat-label">Master Sources</span>
          </div>
          <div class="db-stat-card">
            <span class="db-stat-num">${totalMarkets}</span>
            <span class="db-stat-label">Key Markets</span>
          </div>
          <div class="db-stat-card">
            <span class="db-stat-num">${totalCountries}</span>
            <span class="db-stat-label">Countries</span>
          </div>
          <div class="db-stat-card">
            <span class="db-stat-num">${activeOppsCount}</span>
            <span class="db-stat-label">Active Calls</span>
          </div>
        </div>

        <div class="db-integrity-banner" style="margin-top: 1.25rem;">
          <div class="db-integrity-title">
            <span>●</span> Data Integrity &amp; Curatorial Notes (2026-09-08)
          </div>
          <ul class="db-integrity-list">
            <li><strong>SRC015 &amp; SRC154:</strong> Kulturrådet (Sweden) and Body/Mind Festival (Warsaw) flagged for manual verification due to missing official URL in master intake.</li>
            <li><strong>STEIM Amsterdam:</strong> Deliberately excluded from active research — ceased structural funding and closed at end of 2020.</li>
            <li><strong>Relational Integrity:</strong> 100% of active open calls and residencies are joined to verified sources via <code>source_id</code>.</li>
          </ul>
        </div>

        <div style="margin-top: 1.25rem; display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button type="button" class="btn-primary-action" id="btn-browse-inst-now" style="padding: 0.55rem 1.15rem; font-size: 0.85rem;">
            Browse 268 Verified Institutions ↗
          </button>
          <button type="button" class="nav-text-btn" id="btn-reset-master-db" style="padding: 0.55rem 1.15rem; font-size: 0.85rem; border: 1px solid #444; color: #BBB;">
            Restore Original Master Data
          </button>
        </div>
      `;

      document.getElementById("btn-browse-inst-now")?.addEventListener("click", () => {
        openInstitutionsModal();
      });

      document.getElementById("btn-reset-master-db")?.addEventListener("click", () => {
        if (confirm("Restore database to original master dataset (268 sources)?")) {
          resetMasterSourcesToDefault();
          openDatabaseSyncModal();
        }
      });
    } else if (tabName === "import") {
      contentArea.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">
            Paste any updated CSV from Google Sheets or Excel below (matching columns: <code>source_id, source_name, market, city, country, website_url, description</code>).
          </p>

          <textarea 
            id="csv-import-textarea" 
            class="db-csv-textarea" 
            placeholder="source_id,source_name,market,city,country,source_type,discipline_focus,website_url&#10;SRC001,HAU Hebbel am Ufer,Berlin,Berlin,Germany,Production House,Multidisciplinary,https://www.hebbel-am-ufer.de"
          ></textarea>

          <div style="display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap;">
            <input type="file" id="csv-file-input" accept=".csv,.txt" style="display: none;" />
            <button type="button" class="nav-text-btn" id="btn-trigger-file-upload" style="border: 1px solid #444; padding: 0.5rem 0.9rem; font-size: 0.85rem;">
              Choose .CSV File
            </button>
            <button type="button" class="btn-primary-action" id="btn-parse-csv" style="padding: 0.5rem 1.1rem; font-size: 0.85rem;">
              Parse &amp; Preview
            </button>
          </div>

          <div id="csv-preview-feedback" style="font-size: 0.85rem; color: var(--text-muted);"></div>
        </div>
      `;

      const textarea = document.getElementById("csv-import-textarea");
      const fileInput = document.getElementById("csv-file-input");
      const triggerBtn = document.getElementById("btn-trigger-file-upload");
      const parseBtn = document.getElementById("btn-parse-csv");
      const feedback = document.getElementById("csv-preview-feedback");

      triggerBtn?.addEventListener("click", () => fileInput?.click());

      fileInput?.addEventListener("change", (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (evt) => {
            if (textarea && evt.target?.result) {
              textarea.value = evt.target.result;
              feedback.innerHTML = `Loaded file: <strong>${file.name}</strong> (${(file.size / 1024).toFixed(1)} KB). Click "Parse &amp; Preview".`;
            }
          };
          reader.readAsText(file);
        }
      });

      parseBtn?.addEventListener("click", () => {
        const text = textarea?.value || "";
        const parsed = parseMasterCSV(text);
        if (parsed.length === 0) {
          feedback.innerHTML = `<span style="color: var(--vermilion);">⚠️ Could not detect valid source rows. Please check headers and commas/semicolons.</span>`;
          return;
        }

        feedback.innerHTML = `
          <div style="background: #1B1B1B; border: 1px solid #333; padding: 1rem; border-radius: 4px; margin-top: 0.5rem;">
            <div style="font-weight: 700; color: #10B981; margin-bottom: 0.35rem;">
              ✓ Successfully parsed ${parsed.length} sources across ${new Set(parsed.map(s => s.market)).size} markets!
            </div>
            <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.75rem;">
              Preview sample: "${escapeHtml(parsed[0].source_name)}" (${escapeHtml(parsed[0].city)}, ${escapeHtml(parsed[0].country)})
            </p>
            <button type="button" class="btn-primary-action" id="btn-apply-parsed-sources" style="padding: 0.5rem 1rem; font-size: 0.85rem;">
              Save &amp; Apply to Live Application Now
            </button>
          </div>
        `;

        document.getElementById("btn-apply-parsed-sources")?.addEventListener("click", () => {
          state.sources = parsed;
          persistSourcesToStorage(parsed);
          updateUI();
          showToast(`Applied ${parsed.length} sources to CUE RADAR!`);
          openDatabaseSyncModal();
        });
      });
    } else if (tabName === "guide") {
      contentArea.innerHTML = `
        <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1.25rem;">
          <div style="background: #181818; border: 1px solid var(--border-line); padding: 1.25rem; border-radius: 4px;">
            <h3 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">
              1. סנכרון רציף עם GitHub וסריקה אוטומטית (Continuous Automation)
            </h3>
            <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 0.75rem;">
              הגדרנו עבור הפרויקט מנוע סריקה מלא וקובץ <strong>GitHub Actions</strong> שרץ אוטומטית:
            </p>
            <ul style="list-style: disc; margin-left: 1.25rem; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
              <li><strong>קובץ ה-Workflow:</strong> <code>.github/workflows/cue-radar-crawler.yml</code></li>
              <li><strong>תדירות הריצה:</strong> רץ כל 3 ימים בשעה 06:00 UTC (או בלחיצת כפתור ב-GitHub).</li>
              <li><strong>פעולת הבוט:</strong> הבוט מריץ את <code>scripts/crawl-opportunities.js</code>, בודק את כל 268 המקורות, מעדכן מועדי הגשה, מסנן קולות קוראים שפגו, ודוחף אוטומטית (Git Commit &amp; Push) חזרה ל-Repository.</li>
            </ul>
          </div>

          <div style="background: #181818; border: 1px solid var(--border-line); padding: 1.25rem; border-radius: 4px;">
            <h3 style="font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">
              2. צעד אחר צעד: איך להעלות את הפרויקט לאוויר (Roadmap)
            </h3>
            <ol style="margin-left: 1.25rem; font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6; display: flex; flex-direction: column; gap: 0.6rem;">
              <li>
                <strong>חיבור ל-GitHub:</strong> פתח Repository חדש ב-GitHub (למשל <code>cue-radar</code>), וחבר אליו את התיקייה הנוכחית עם <code>git push origin main</code>.
              </li>
              <li>
                <strong>הפעלת ה-GitHub Action:</strong> בלשונית Actions ב-GitHub תראה את <em>"CUE RADAR Automated Scanner &amp; Database Syncer"</em>. הוא כבר מוגדר לפעול כל 3 ימים.
              </li>
              <li>
                <strong>פריסה לאוויר (Deployment):</strong> ניתן לפרוס בלחיצה אחת ל-Cloud Run, Vercel או Netlify. בכל פעם שה-Action מעדכן את <code>public/data/opportunities.json</code>, האתר באוויר יתעדכן מיד!
              </li>
              <li>
                <strong>עדכון ידני של הדאטה-בייס:</strong> בכל שלב תוכל להדביק או להעלות CSV מעודכן בלשונית "Import / Paste CSV", או להחליף את <code>public/data/sources.json</code>.
              </li>
            </ol>
          </div>
        </div>
      `;
    } else if (tabName === "export") {
      contentArea.innerHTML = `
        <div style="margin-top: 1.25rem; display: flex; flex-direction: column; gap: 1rem;">
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5;">
            Export the master dataset in standard formats for backup, analysis in Google Sheets, or publishing:
          </p>

          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
            <button type="button" class="btn-primary-action" id="btn-export-full-csv" style="padding: 0.6rem 1.2rem; font-size: 0.85rem;">
              Download Sources as CSV ⤓
            </button>
            <button type="button" class="nav-text-btn" id="btn-export-full-json" style="padding: 0.6rem 1.2rem; font-size: 0.85rem; border: 1px solid #444;">
              Download Opportunities JSON ⤓
            </button>
          </div>
        </div>
      `;

      document.getElementById("btn-export-full-csv")?.addEventListener("click", () => {
        downloadCSV("cue_radar_master_sources.csv", exportSourcesToCSV(state.sources));
        showToast("Exported sources CSV");
      });

      document.getElementById("btn-export-full-json")?.addEventListener("click", () => {
        const jsonStr = JSON.stringify(state.opportunities, null, 2);
        downloadFile("cue_radar_opportunities.json", jsonStr, "application/json");
        showToast("Exported opportunities JSON");
      });
    }
  }

  modalContainer.innerHTML = `
    <button type="button" class="modal-close-btn" id="btn-modal-close" aria-label="Close dialog">✕ Close</button>
    <div class="modal-kicker">CUE RADAR · Brain Architecture</div>
    <h2 class="modal-title">Master Database Brain &amp; Live Sync</h2>
    <p class="modal-body-text">
      The central operational brain powering CUE RADAR. Synchronized with GitHub Actions and our automated 3-day crawler engine.
    </p>

    <!-- Tabs Header -->
    <div class="db-modal-tabs">
      <button type="button" class="db-modal-tab-btn active" data-tab="overview">Overview &amp; Integrity</button>
      <button type="button" class="db-modal-tab-btn" data-tab="import">Import / Paste CSV</button>
      <button type="button" class="db-modal-tab-btn" data-tab="guide">GitHub &amp; Auto-Scan Guide</button>
      <button type="button" class="db-modal-tab-btn" data-tab="export">Export</button>
    </div>

    <!-- Tab Content -->
    <div id="db-tab-content-area"></div>
  `;

  modalOverlay.classList.add("active");
  modalOverlay.setAttribute("aria-hidden", "false");

  // Render default tab
  renderActiveTab("overview");

  // Bind tab buttons
  document.querySelectorAll(".db-modal-tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.getAttribute("data-tab");
      if (tab) renderActiveTab(tab);
    });
  });

  document.getElementById("btn-modal-close")?.addEventListener("click", closeModal);
}

function downloadCSV(filename, content) {
  downloadFile(filename, content, "text/csv;charset=utf-8;");
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function closeModal() {
  const modalOverlay = document.getElementById("general-modal");
  if (modalOverlay) {
    modalOverlay.classList.remove("active");
    modalOverlay.setAttribute("aria-hidden", "true");
  }
}

// ============================================================================
// 7. SHOWREEL VIDEO PLAYER CONTROLS (PART 4)
// ============================================================================
function setupShowreelControls() {
  const video = document.getElementById("profile-video-element");
  const playBtn = document.getElementById("btn-showreel-play");
  const playIcon = document.getElementById("showreel-play-icon");
  const hud = document.getElementById("showreel-hud");
  const muteBtn = document.getElementById("btn-showreel-mute");
  const fsBtn = document.getElementById("btn-showreel-fs");
  const timeDisplay = document.getElementById("showreel-time-display");

  if (!video) return;

  function togglePlay() {
    if (video.paused) {
      video.play().catch((err) => console.log("Autoplay blocked:", err));
      if (playIcon) playIcon.textContent = "❚❚";
      if (hud) hud.classList.add("playing");
      state.isVideoPlaying = true;
    } else {
      video.pause();
      if (playIcon) playIcon.textContent = "▶";
      if (hud) hud.classList.remove("playing");
      state.isVideoPlaying = false;
    }
  }

  playBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    togglePlay();
  });

  video.addEventListener("click", togglePlay);

  muteBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "Unmute" : "Mute";
  });

  fsBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      const container = document.getElementById("showreel-aspect-ratio");
      if (container?.requestFullscreen) {
        container.requestFullscreen();
      }
    }
  });

  video.addEventListener("timeupdate", () => {
    if (timeDisplay && !isNaN(video.duration)) {
      const curM = Math.floor(video.currentTime / 60);
      const curS = Math.floor(video.currentTime % 60);
      const durM = Math.floor(video.duration / 60);
      const durS = Math.floor(video.duration % 60);
      timeDisplay.textContent = `${padZero(curM)}:${padZero(curS)} / ${padZero(durM)}:${padZero(durS)}`;
    }
  });
}

// ============================================================================
// 8. EVENT LISTENERS
// ============================================================================
function setupEventListeners() {
  // 1. Navigation View Switcher (The Hub vs Artist Profile)
  document.getElementById("nav-view-hub")?.addEventListener("click", () => {
    state.activeView = "hub";
    updateUI();
  });

  document.getElementById("nav-view-profile")?.addEventListener("click", () => {
    state.activeView = "profile";
    updateUI();
  });

  document.getElementById("brand-logo")?.addEventListener("click", (e) => {
    e.preventDefault();
    state.activeView = "hub";
    state.activeCity = "All";
    state.activeDiscipline = "All";
    state.activeType = "All";
    state.savedOnly = false;
    state.searchQuery = "";
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
    updateUI();
  });

  document.getElementById("btn-goto-hub")?.addEventListener("click", () => {
    state.activeView = "hub";
    updateUI();
  });

  // 2. Saved Filter Shortcut in Top Nav & Mobile Header
  document.getElementById("nav-saved-btn")?.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    if (state.activeView !== "hub") {
      state.activeView = "hub";
    }
    updateUI();
  });

  // Mobile Header 1-Tap Profile Shortcut
  document.getElementById("btn-mobile-profile")?.addEventListener("click", () => {
    state.activeView = state.activeView === "profile" ? "hub" : "profile";
    closeMobileDrawer();
    updateUI();
  });

  // Mobile Header Saved Shortcut
  document.getElementById("btn-mobile-saved")?.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    if (state.activeView !== "hub") {
      state.activeView = "hub";
    }
    closeMobileDrawer();
    updateUI();
  });

  // Mobile Slide-over Drawer Controls
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileMenuToggle = document.getElementById("btn-mobile-menu-toggle");
  const drawerBackdrop = document.getElementById("mobile-drawer-backdrop");

  function toggleMobileDrawer() {
    if (!mobileDrawer) return;
    const isOpen = mobileDrawer.classList.toggle("open");
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.toggle("active", isOpen);
      mobileMenuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
    mobileDrawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }

  function closeMobileDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove("open");
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.remove("active");
      mobileMenuToggle.setAttribute("aria-expanded", "false");
    }
    mobileDrawer.setAttribute("aria-hidden", "true");
  }

  mobileMenuToggle?.addEventListener("click", toggleMobileDrawer);
  drawerBackdrop?.addEventListener("click", closeMobileDrawer);

  document.getElementById("drawer-view-hub")?.addEventListener("click", () => {
    state.activeView = "hub";
    closeMobileDrawer();
    updateUI();
  });

  document.getElementById("drawer-view-profile")?.addEventListener("click", () => {
    state.activeView = "profile";
    closeMobileDrawer();
    updateUI();
  });

  // 4. Three Filter Rows Delegation
  // Row 1: City
  document.querySelectorAll('[data-filter-group="city"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeCity = btn.getAttribute("data-filter") || "All";
      updateUI();
    });
  });

  // Row 2: Discipline
  document.querySelectorAll('[data-filter-group="discipline"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeDiscipline = btn.getAttribute("data-filter") || "All";
      updateUI();
    });
  });

  // Row 3: Opportunity Type
  document.querySelectorAll('[data-filter-group="type"]').forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeType = btn.getAttribute("data-filter") || "All";
      updateUI();
    });
  });

  // Auxiliary Saved button in row 3
  document.getElementById("btn-filter-saved")?.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    updateUI();
  });

  // Reset Filters button
  document.getElementById("btn-clear-all-filters")?.addEventListener("click", resetAllFilters);
  document.getElementById("btn-reset-filters")?.addEventListener("click", resetAllFilters);

  // 5. Search Bar Input
  const searchInput = document.getElementById("search-input");
  const searchClearBtn = document.getElementById("search-clear-btn");

  searchInput?.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    updateUI();
  });

  searchClearBtn?.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    state.searchQuery = "";
    updateUI();
  });

  // 6. Sorting Select
  const sortSelect = document.getElementById("sort-select");
  sortSelect?.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderFeed();
  });

  // 7. Opportunity Cards Click & Save (Event Delegation on #opportunities-grid & #profile-saved-list)
  function handleCardClick(e) {
    const saveBtn = e.target.closest('[data-action="save"]');
    if (saveBtn) {
      e.stopPropagation();
      const oppId = saveBtn.getAttribute("data-opp-id");
      if (oppId) {
        toggleSaveOpportunity(oppId);
      }
      return;
    }

    const card = e.target.closest(".opportunity-card");
    if (card) {
      const oppId = card.getAttribute("data-opp-id");
      if (oppId) {
        openOpportunityModal(oppId);
      }
    }
  }

  document.getElementById("opportunities-grid")?.addEventListener("click", handleCardClick);
  document.getElementById("profile-saved-list")?.addEventListener("click", handleCardClick);

  // 8. Profile View Tabs Switcher (Saved Opportunities vs Portfolio / Media)
  const tabSaved = document.getElementById("btn-tab-saved");
  const tabPortfolio = document.getElementById("btn-tab-portfolio");
  const panelSaved = document.getElementById("panel-tab-saved");
  const panelPortfolio = document.getElementById("panel-tab-portfolio");

  tabSaved?.addEventListener("click", () => {
    state.activeProfileTab = "saved";
    tabSaved.classList.add("active");
    tabSaved.setAttribute("aria-selected", "true");
    tabPortfolio?.classList.remove("active");
    tabPortfolio?.setAttribute("aria-selected", "false");

    if (panelSaved) panelSaved.style.display = "block";
    if (panelPortfolio) panelPortfolio.style.display = "none";
    renderProfileView();
  });

  tabPortfolio?.addEventListener("click", () => {
    state.activeProfileTab = "portfolio";
    tabPortfolio.classList.add("active");
    tabPortfolio.setAttribute("aria-selected", "true");
    tabSaved?.classList.remove("active");
    tabSaved?.setAttribute("aria-selected", "false");

    if (panelSaved) panelSaved.style.display = "none";
    if (panelPortfolio) panelPortfolio.style.display = "block";
    renderProfileView();
  });

  // 9. Profile share action
  document.getElementById("profile-share-btn")?.addEventListener("click", async () => {
    const shareData = {
      title: "Roi Padan · CUE RADAR",
      text: "Roi Padan — choreographer and experimental sound artist",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Profile link copied");
      }
    } catch (error) {
      if (error?.name !== "AbortError") showToast("Unable to share profile");
    }
  });

  // 10. Google Sign-In Listeners
  const googleBtn = document.getElementById("gsi-signin-btn");
  const profileGoogleBtn = document.getElementById("profile-google-signin-btn");
  const profileSignoutBtn = document.getElementById("profile-signout-btn");

  async function handleSignIn() {
    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        state.user = result.user;
        showToast(`Signed in as ${result.user.displayName || "Artist"}`);
        syncAuthState();
      }
    } catch (err) {
      console.log("[CUE RADAR] Auth sign-in popup closed or restricted:", err);
    }
  }

  googleBtn?.addEventListener("click", handleSignIn);
  profileGoogleBtn?.addEventListener("click", handleSignIn);
  document.getElementById("drawer-gsi-signin-btn")?.addEventListener("click", () => {
    closeMobileDrawer();
    handleSignIn();
  });

  profileSignoutBtn?.addEventListener("click", async () => {
    await signOutUser();
    state.user = null;
    showToast("Signed out");
    syncAuthState();
  });

  // 10. Close modal when clicking outside
  document.getElementById("general-modal")?.addEventListener("click", (e) => {
    if (e.target.id === "general-modal") {
      closeModal();
    }
  });

  // Escape key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  });

  // 11. Floating Quick-Filter Pill (Reveals smoothly when scrolled past filter section)
  const floatingPill = document.getElementById("btn-floating-filter");
  const filterDeck = document.getElementById("sticky-filter-wrapper");

  function checkFloatingPill() {
    if (!floatingPill || !filterDeck) return;
    if (state.activeView !== "hub") {
      floatingPill.classList.remove("visible");
      return;
    }

    const filterBottom = filterDeck.offsetTop + filterDeck.offsetHeight;
    if (window.scrollY > filterBottom + 30) {
      floatingPill.classList.add("visible");
    } else {
      floatingPill.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", checkFloatingPill, { passive: true });

  floatingPill?.addEventListener("click", () => {
    if (filterDeck) {
      const navOffset = 64;
      const targetY = filterDeck.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    }
  });
}

function resetAllFilters() {
  state.activeCity = "All";
  state.activeDiscipline = "All";
  state.activeType = "All";
  state.savedOnly = false;
  state.searchQuery = "";
  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.value = "";
  updateUI();
}

function syncAuthState() {
  const loggedBlock = document.getElementById("profile-logged-user");
  const profileGoogleBtn = document.getElementById("profile-google-signin-btn");
  const driveUserPill = document.getElementById("drive-user-pill");
  const gsiBtn = document.getElementById("gsi-signin-btn");
  const drawerLoggedUser = document.getElementById("drawer-logged-user");
  const drawerGsiBtn = document.getElementById("drawer-gsi-signin-btn");

  if (state.user) {
    if (profileGoogleBtn) profileGoogleBtn.style.display = "none";
    if (loggedBlock) loggedBlock.style.display = "inline-flex";
    if (drawerGsiBtn) drawerGsiBtn.style.display = "none";
    if (drawerLoggedUser) drawerLoggedUser.style.display = "flex";

    const avatar = document.getElementById("profile-user-avatar");
    if (avatar && state.user.photoURL) avatar.src = state.user.photoURL;

    const drawerAvatar = document.getElementById("drawer-user-avatar");
    if (drawerAvatar && state.user.photoURL) drawerAvatar.src = state.user.photoURL;

    const name = document.getElementById("profile-user-name");
    if (name) name.textContent = state.user.displayName || "Artist User";

    const drawerName = document.getElementById("drawer-user-name");
    if (drawerName) drawerName.textContent = state.user.displayName || "Artist User";

    if (gsiBtn) gsiBtn.style.display = "none";
    if (driveUserPill) {
      driveUserPill.style.display = "inline-flex";
      const driveAvatar = document.getElementById("drive-user-avatar");
      if (driveAvatar && state.user.photoURL) driveAvatar.src = state.user.photoURL;
      const driveName = document.getElementById("drive-user-name");
      if (driveName) driveName.textContent = (state.user.displayName || "Drive").split(" ")[0];
    }
  } else {
    if (profileGoogleBtn) profileGoogleBtn.style.display = "inline-flex";
    if (loggedBlock) loggedBlock.style.display = "none";
    if (drawerGsiBtn) drawerGsiBtn.style.display = "flex";
    if (drawerLoggedUser) drawerLoggedUser.style.display = "none";
    if (gsiBtn) gsiBtn.style.display = "inline-flex";
    if (driveUserPill) driveUserPill.style.display = "none";
  }
}

// ============================================================================
// 9. UTILITIES
// ============================================================================
function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.2s ease";
    setTimeout(() => toast.remove(), 200);
  }, 2200);
}

function truncate(str, maxLen = 30) {
  if (!str) return "";
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
}

function padZero(num) {
  return num < 10 ? `0${num}` : num.toString();
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ============================================================================
// 10. INITIALIZATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  setupShowreelControls();
  setupEventListeners();

  // Listen to Firebase auth changes
  try {
    initAuth((user) => {
      state.user = user;
      syncAuthState();
    });
  } catch (err) {
    console.log("[CUE RADAR] Auth init skipped in sandboxed preview:", err);
  }

  updateUI();
});
