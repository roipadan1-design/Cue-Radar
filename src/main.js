/**
 * ============================================================================
 * CUE RADAR — Career OS & Opportunities Hub (Full Beachhead Edition)
 * Beachhead Markets: Cologne/NRW, Berlin, Brussels, Israel
 * Disciplines: Contemporary Dance, Performance Art, Experimental Sound & Indie Music
 * Integrations: Google Drive API (Portfolio Vault & Dossier Sync) + LocalStorage MVP
 * Architecture: Structured for seamless REST API connection to Supabase / Airtable
 * ============================================================================
 */

import { institutions, liveOpportunities } from "./data.js";
import { initAuth, signInWithGoogle, signOutUser, getAccessToken, getCurrentUser } from "./auth.js";
import { listDriveFiles, exportDossierToDrive, createDriveFolder } from "./drive.js";

// ============================================================================
// 1. GLOBAL STATE & LOCAL STORAGE INITIALIZATION
// ============================================================================

const STORAGE_KEY = "cue_radar_saved_ids";

const state = {
  opportunities: [...liveOpportunities],
  institutions: [...institutions],
  savedIds: new Set(),
  activeRegion: "All", // "All" | "Cologne / NRW" | "Berlin" | "Brussels" | "Israel"
  activeCategory: "All", // "All" | "Dance" | "Sound" | "Residency" | "Funding" | "Saved"
  searchQuery: "",
  sortBy: "deadline-asc",
  // Auth & Drive State
  user: null,
  accessToken: null,
  driveFiles: [],
  driveFilesLoading: false,
  activeModal: null // null | "details" | "drive-vault" | "institutions"
};

/**
 * Load saved bookmarks from LocalStorage
 */
function initStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        state.savedIds = new Set(parsed);
      }
    }
  } catch (err) {
    console.warn("[CUE RADAR] LocalStorage load failed:", err);
    state.savedIds = new Set();
  }
}

/**
 * Persist bookmarks to LocalStorage
 */
function persistSavedIds() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(state.savedIds)));
  } catch (err) {
    console.error("[CUE RADAR] LocalStorage save failed:", err);
  }
}

/**
 * Toggle bookmark state
 */
function toggleSaveOpportunity(oppId) {
  const isSaved = state.savedIds.has(oppId);
  const opp = state.opportunities.find(o => o.id === oppId);
  const oppTitle = opp ? opp.title : "Opportunity";

  if (isSaved) {
    state.savedIds.delete(oppId);
    showToast(`Removed "${truncate(oppTitle, 30)}" from radar`, "removed");
  } else {
    state.savedIds.add(oppId);
    showToast(`Bookmarked "${truncate(oppTitle, 30)}" to radar`, "saved");
  }

  persistSavedIds();
  updateUI();
  return !isSaved;
}

// ============================================================================
// 2. FILTERING & SORTING PIPELINE
// ============================================================================

function getFilteredOpportunities() {
  let list = state.opportunities.filter((opp) => {
    // 1. Region Filter (Cologne / NRW, Berlin, Brussels, Israel)
    if (state.activeRegion !== "All") {
      if (opp.region !== state.activeRegion) return false;
    }

    // 2. Category / Saved Filter
    if (state.activeCategory === "Saved") {
      if (!state.savedIds.has(opp.id)) return false;
    } else if (state.activeCategory !== "All") {
      const matchesCategory = opp.category.some(
        c => c.toLowerCase() === state.activeCategory.toLowerCase()
      );
      const matchesDiscipline = opp.disciplines.some(
        d => d.toLowerCase().includes(state.activeCategory.toLowerCase())
      );
      if (!matchesCategory && !matchesDiscipline) return false;
    }

    // 3. Search Query (Matches Title, Institution, Disciplines, City, Description)
    if (state.searchQuery.trim() !== "") {
      const q = state.searchQuery.toLowerCase().trim();
      const inTitle = opp.title.toLowerCase().includes(q);
      const inInst = opp.institution.toLowerCase().includes(q);
      const inCity = opp.city.toLowerCase().includes(q);
      const inDiscip = opp.disciplines.some(d => d.toLowerCase().includes(q));
      const inDesc = opp.description.toLowerCase().includes(q);

      if (!inTitle && !inInst && !inCity && !inDiscip && !inDesc) {
        return false;
      }
    }

    return true;
  });

  // 4. Sorting
  if (state.sortBy === "deadline-asc") {
    list.sort((a, b) => a.daysRemaining - b.daysRemaining);
  } else if (state.sortBy === "deadline-desc") {
    list.sort((a, b) => b.daysRemaining - a.daysRemaining);
  } else if (state.sortBy === "title-asc") {
    list.sort((a, b) => a.title.localeCompare(b.title));
  }

  return list;
}

// ============================================================================
// 3. RENDERING ENGINE: CARDS & GRIDS
// ============================================================================

function createOpportunityCardHTML(opp) {
  const isSaved = state.savedIds.has(opp.id);
  const isUrgent = opp.daysRemaining <= 7;

  const tagsHTML = opp.disciplines
    .map(tag => `<span class="discipline-tag">${escapeHTML(tag)}</span>`)
    .join("");

  const countdownText = opp.daysRemaining === 1 
    ? "ENDS IN 1 DAY" 
    : `ENDS IN ${opp.daysRemaining} DAYS`;

  return `
    <article 
      class="opportunity-card ticket-card ${isUrgent ? 'urgent' : ''} ${isSaved ? 'is-saved' : ''}" 
      id="card-${opp.id}"
      data-id="${opp.id}"
    >
      <!-- Ticket Top Header / Stub Info -->
      <header class="card-header ticket-header">
        <div class="institution-group">
          <span class="region-badge">${escapeHTML(opp.city).toUpperCase()} // ${escapeHTML(opp.region).toUpperCase()}</span>
          <span class="institution-tag">${escapeHTML(opp.institution)}</span>
        </div>
        <div class="ticket-header-meta">
          <span class="status-badge ${isUrgent ? 'urgent' : 'open'}">
            ${isUrgent ? '● CLOSING SOON' : '● OPEN CALL'}
          </span>
          <span class="ticket-index">TICKET #0${opp.id}</span>
        </div>
      </header>

      <!-- Ticket Main Body: Title, Tags & Support Info -->
      <div class="card-body ticket-body">
        <h3 class="card-title ticket-title" data-action="view-details" data-id="${opp.id}">
          ${escapeHTML(opp.title)}
        </h3>

        <div class="tags-list ticket-tags">
          ${tagsHTML}
        </div>

        <div class="card-meta-rows ticket-meta-rows">
          <div class="meta-item">
            <span class="meta-label">GRANT / SUPPORT:</span>
            <span class="meta-value grant">${escapeHTML(opp.grantAmount)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">DEADLINE:</span>
            <span class="meta-value">${escapeHTML(opp.deadlineFormatted)}</span>
          </div>
        </div>
      </div>

      <!-- Ticket Perforation Divider & Side Cutout Notches (DICE / RA event ticket style) -->
      <div class="ticket-perforation" aria-hidden="true">
        <span class="ticket-notch ticket-notch-left"></span>
        <div class="ticket-perforation-line"></div>
        <span class="ticket-notch ticket-notch-right"></span>
      </div>

      <!-- Ticket Footer: Clear, Highly Visible Foundation / DICE Countdown & Actions -->
      <footer class="card-footer ticket-footer">
        <div class="countdown-box ticket-countdown ${isUrgent ? 'urgent' : ''}" aria-label="Deadline Countdown">
          <div class="countdown-label-group">
            <span class="countdown-live-dot" aria-hidden="true"></span>
            <span>COUNTDOWN TIMER</span>
          </div>
          <div class="countdown-timer-value">${countdownText}</div>
        </div>

        <div class="card-actions-row ticket-actions-row">
          <button 
            type="button" 
            class="btn-details btn-ticket-call" 
            data-action="view-details" 
            data-id="${opp.id}"
            aria-label="View guidelines for ${escapeHTML(opp.title)}"
          >
            <span>VIEW CALL</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </button>

          <button 
            type="button" 
            class="btn-save ${isSaved ? 'saved' : ''}" 
            data-action="toggle-save" 
            data-id="${opp.id}"
            aria-pressed="${isSaved}"
            aria-label="${isSaved ? 'Remove from saved' : 'Save opportunity'}"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2.5">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            <span class="save-label">${isSaved ? 'SAVED' : 'SAVE'}</span>
          </button>

          <button 
            type="button" 
            class="btn-card-drive-sync" 
            data-action="sync-card-to-drive" 
            data-id="${opp.id}"
            title="Create Application Folder in Google Drive"
            aria-label="Create application folder in Google Drive"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              <line x1="12" y1="11" x2="12" y2="17"></line>
              <line x1="9" y1="14" x2="15" y2="14"></line>
            </svg>
          </button>
        </div>
      </footer>
    </article>
  `;
}

function renderGrid() {
  const gridContainer = document.getElementById("opportunities-grid");
  const emptyState = document.getElementById("empty-state");
  const countIndicator = document.getElementById("active-count-indicator");
  
  if (!gridContainer) return;

  const filtered = getFilteredOpportunities();

  if (filtered.length === 0) {
    gridContainer.innerHTML = "";
    if (emptyState) emptyState.classList.add("visible");
  } else {
    if (emptyState) emptyState.classList.remove("visible");
    gridContainer.innerHTML = filtered.map(opp => createOpportunityCardHTML(opp)).join("");
  }

  if (countIndicator) {
    const total = state.opportunities.length;
    countIndicator.innerHTML = `Showing <span class="active-count-highlight">${filtered.length}</span> of ${total} Opportunities`;
  }
}

function updateUI() {
  renderGrid();

  // Update Bookmark Counters
  const navBadge = document.getElementById("nav-saved-count");
  const chipBadge = document.getElementById("chip-saved-count");
  const navSavedBtn = document.getElementById("nav-saved-btn");
  const savedCount = state.savedIds.size;

  if (navBadge) navBadge.textContent = String(savedCount);
  if (chipBadge) chipBadge.textContent = String(savedCount);

  if (navSavedBtn) {
    navSavedBtn.classList.toggle("active", state.activeCategory === "Saved");
  }

  // Update Region Tabs active styling
  document.querySelectorAll(".region-tab").forEach(tab => {
    const region = tab.getAttribute("data-region");
    tab.classList.toggle("active", region === state.activeRegion);
  });

  // Update Category Chips active styling
  document.querySelectorAll(".filter-chip").forEach(chip => {
    const cat = chip.getAttribute("data-filter");
    chip.classList.toggle("active", cat === state.activeCategory);
  });
}

// ============================================================================
// 4. GOOGLE DRIVE INTEGRATION & VAULT MODAL
// ============================================================================

/**
 * Handle Google Auth state changes
 */
function handleAuthStateChange(user, token) {
  state.user = user;
  state.accessToken = token;

  const signInBtn = document.getElementById("gsi-signin-btn");
  const userPill = document.getElementById("drive-user-pill");
  const userName = document.getElementById("drive-user-name");
  const userAvatar = document.getElementById("drive-user-avatar");

  if (user && token) {
    if (signInBtn) signInBtn.style.display = "none";
    if (userPill) userPill.classList.add("connected");
    if (userName) userName.textContent = user.displayName || user.email || "Artist";
    if (userAvatar) userAvatar.src = user.photoURL || "https://www.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png";
  } else {
    if (signInBtn) signInBtn.style.display = "inline-flex";
    if (userPill) userPill.classList.remove("connected");
  }
}

/**
 * Open the Google Drive Artist Vault Modal
 */
async function openDriveVaultModal() {
  const modal = document.getElementById("general-modal");
  const modalContainer = document.getElementById("modal-content-container");
  if (!modal || !modalContainer) return;

  state.activeModal = "drive-vault";

  const user = state.user;
  const token = state.accessToken;

  if (!token) {
    modalContainer.innerHTML = `
      <div class="modal-header">
        <div>
          <div class="modal-subtitle">GOOGLE DRIVE INTEGRATION // OAUTH REQUIRED</div>
          <h2 class="modal-title">Artist Dossier &amp; Portfolio Vault</h2>
        </div>
        <button class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="modal-body">
        <p class="modal-desc-text">
          Connect your Google Drive account to sync tracked open call deadlines, export artist application dossiers, and organize portfolio attachments directly from your Drive.
        </p>
        <div style="display: flex; justify-content: center; padding: 1.5rem 0;">
          <button id="modal-gsi-btn" class="gsi-material-button">
            <div class="gsi-material-button-icon">
              <svg viewBox="0 0 48 48" style="display: block; width: 18px; height: 18px;">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
            </div>
            <span>Sign in with Google to Connect Drive</span>
          </button>
        </div>
      </div>
    `;
    modal.classList.add("active");
    document.getElementById("modal-gsi-btn")?.addEventListener("click", async () => {
      await handleGoogleSignInFlow();
      openDriveVaultModal();
    });
    return;
  }

  // User is connected to Google Drive
  const savedCount = state.savedIds.size;
  modalContainer.innerHTML = `
    <div class="modal-header">
      <div>
        <div class="modal-subtitle">GOOGLE DRIVE CONNECTED // ${escapeHTML(user.email || "")}</div>
        <h2 class="modal-title">Artist Dossier &amp; Drive Vault</h2>
      </div>
      <button class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="modal-body">
      <!-- Top Action Banner -->
      <div class="drive-vault-hero">
        <div>
          <div style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--neon-green); margin-bottom: 0.25rem;">
            SYNC RADAR TO DRIVE
          </div>
          <p class="vault-lead">
            Export all ${savedCount > 0 ? savedCount + ' bookmarked' : 'active'} open calls into a master Markdown Dossier in your Google Drive with full deadlines and portal links.
          </p>
        </div>
        <button type="button" class="btn-export-drive" id="btn-do-export-drive">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Export Dossier to Drive</span>
        </button>
      </div>

      <!-- Drive File Browser -->
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <h4 style="font-family: var(--font-mono); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted);">
            Recent Artist Files &amp; Dossiers in Google Drive
          </h4>
          <span id="drive-files-count" style="font-family: var(--font-mono); font-size: 0.6875rem; color: var(--text-muted);">Loading...</span>
        </div>

        <div class="drive-files-search" style="margin-bottom: 0.75rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="drive-search-input" class="drive-search-input" placeholder="Filter files in your Google Drive..." />
        </div>

        <div class="drive-files-list" id="drive-files-list">
          <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-family: var(--font-mono); font-size: 0.75rem;">
            Connecting to Drive v3 API...
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="nav-btn" id="btn-drive-signout" style="border-color: rgba(255,85,0,0.4); color: var(--neon-orange);">
        <span>Disconnect Drive</span>
      </button>
      <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer" class="nav-btn" style="text-decoration: none;">
        <span>Open drive.google.com</span>
      </a>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Bind Export button
  document.getElementById("btn-do-export-drive")?.addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.innerHTML = `<span>Exporting to Drive...</span>`;
    try {
      const itemsToExport = state.savedIds.size > 0 
        ? state.opportunities.filter(o => state.savedIds.has(o.id))
        : state.opportunities;

      const createdFile = await exportDossierToDrive(token, itemsToExport);
      showToast("Artist dossier exported to Google Drive!", "drive");
      btn.innerHTML = `<span>✓ Exported Successfully</span>`;
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = `<span>Export Dossier to Drive</span>`;
      }, 2500);

      // Refresh list
      loadDriveFileList();
    } catch (err) {
      console.error(err);
      alert("Failed to export to Google Drive: " + err.message);
      btn.disabled = false;
      btn.innerHTML = `<span>Export Dossier to Drive</span>`;
    }
  });

  // Bind Sign-out
  document.getElementById("btn-drive-signout")?.addEventListener("click", async () => {
    if (confirm("Disconnect Google Drive from CUE RADAR?")) {
      await signOutUser();
      closeModal();
      showToast("Google Drive disconnected", "removed");
    }
  });

  // Load files from Drive
  loadDriveFileList();

  // Search input in Drive
  document.getElementById("drive-search-input")?.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    renderDriveFiles(q);
  });
}

/**
 * Fetch and render file list from Google Drive
 */
async function loadDriveFileList() {
  const container = document.getElementById("drive-files-list");
  const countSpan = document.getElementById("drive-files-count");
  if (!container || !state.accessToken) return;

  try {
    const files = await listDriveFiles(state.accessToken);
    state.driveFiles = files;
    if (countSpan) countSpan.textContent = `${files.length} files found`;
    renderDriveFiles();
  } catch (err) {
    console.error("[CUE RADAR Drive] Error fetching files:", err);
    if (container) {
      container.innerHTML = `
        <div style="padding: 1rem; color: var(--neon-orange); font-size: 0.75rem; font-family: var(--font-mono);">
          Unable to fetch Drive files: ${escapeHTML(err.message)}
        </div>
      `;
    }
  }
}

function renderDriveFiles(filterQuery = "") {
  const container = document.getElementById("drive-files-list");
  if (!container) return;

  let list = state.driveFiles;
  if (filterQuery) {
    list = list.filter(f => f.name.toLowerCase().includes(filterQuery));
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-size: 0.75rem; font-family: var(--font-mono);">
        No files matched in Google Drive.
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(f => {
    const isFolder = f.mimeType === "application/vnd.google-apps.folder";
    const icon = isFolder ? "📁" : "📄";
    return `
      <div class="drive-file-item">
        <div class="drive-file-main">
          <span>${icon}</span>
          <div style="min-width: 0;">
            <div class="drive-file-name" title="${escapeHTML(f.name)}">${escapeHTML(f.name)}</div>
            <div class="drive-file-meta">${isFolder ? 'Folder' : (f.mimeType ? f.mimeType.split('/').pop() : 'file')}</div>
          </div>
        </div>
        ${f.webViewLink ? `
          <a href="${f.webViewLink}" target="_blank" rel="noopener noreferrer" class="drive-file-link">
            View in Drive ↗
          </a>
        ` : ''}
      </div>
    `;
  }).join("");
}

/**
 * Handle quick creation of an application folder in Drive for a specific opportunity
 */
async function handleQuickDriveFolder(oppId) {
  if (!state.accessToken) {
    const proceed = confirm("Google Drive connection required to create an application dossier folder. Would you like to sign in with Google now?");
    if (proceed) {
      await handleGoogleSignInFlow();
      if (state.accessToken) {
        handleQuickDriveFolder(oppId);
      }
    }
    return;
  }

  const opp = state.opportunities.find(o => o.id === oppId);
  if (!opp) return;

  const folderName = `[CUE RADAR] ${opp.institution} - ${opp.title.slice(0, 30)}`;

  try {
    showToast(`Creating Drive folder: "${folderName}"...`, "drive");
    const folder = await createDriveFolder(state.accessToken, folderName);
    showToast(`Folder created in Google Drive!`, "drive");
    if (folder.id) {
      window.open(`https://drive.google.com/drive/folders/${folder.id}`, "_blank");
    }
  } catch (err) {
    alert("Error creating folder in Google Drive: " + err.message);
  }
}

// ============================================================================
// 5. OPPORTUNITY DETAILS MODAL & INSTITUTIONS DIRECTORY
// ============================================================================

function openDetailsModal(oppId) {
  const opp = state.opportunities.find(o => o.id === oppId);
  if (!opp) return;

  const modal = document.getElementById("general-modal");
  const modalContainer = document.getElementById("modal-content-container");
  if (!modal || !modalContainer) return;

  state.activeModal = "details";
  const isSaved = state.savedIds.has(opp.id);

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div>
        <div class="modal-subtitle">${escapeHTML(opp.institution)} // ${escapeHTML(opp.city)}, ${escapeHTML(opp.country)}</div>
        <h2 class="modal-title">${escapeHTML(opp.title)}</h2>
      </div>
      <button class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="modal-body">
      <!-- High-contrast highlight box -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.75rem; background-color: var(--bg-black); border: 1px solid var(--border-medium); border-radius: var(--radius-sm); padding: 0.85rem;">
        <div>
          <div style="font-family: var(--font-mono); font-size: 0.625rem; color: var(--text-muted); text-transform: uppercase;">Grant / Support</div>
          <div style="font-family: var(--font-mono); font-size: 0.875rem; font-weight: 700; color: var(--neon-green);">${escapeHTML(opp.grantAmount)}</div>
        </div>
        <div>
          <div style="font-family: var(--font-mono); font-size: 0.625rem; color: var(--text-muted); text-transform: uppercase;">Deadline</div>
          <div style="font-family: var(--font-mono); font-size: 0.8125rem; font-weight: 600; color: var(--text-primary);">${escapeHTML(opp.deadlineFormatted)} (in ${opp.daysRemaining} days)</div>
        </div>
        <div>
          <div style="font-family: var(--font-mono); font-size: 0.625rem; color: var(--text-muted); text-transform: uppercase;">Region & City</div>
          <div style="font-family: var(--font-mono); font-size: 0.8125rem; font-weight: 600; color: var(--text-primary);">${escapeHTML(opp.city)}, ${escapeHTML(opp.region)}</div>
        </div>
        <div>
          <div style="font-family: var(--font-mono); font-size: 0.625rem; color: var(--text-muted); text-transform: uppercase;">Fee</div>
          <div style="font-family: var(--font-mono); font-size: 0.8125rem; font-weight: 600; color: var(--text-primary);">${escapeHTML(opp.applicationFee)}</div>
        </div>
      </div>

      <!-- Description -->
      <div>
        <h4 style="font-family: var(--font-mono); font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 0.35rem;">
          // Open Call Synopsis
        </h4>
        <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">${escapeHTML(opp.description)}</p>
      </div>

      <!-- Eligibility -->
      <div>
        <h4 style="font-family: var(--font-mono); font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 0.35rem;">
          // Eligibility & Artist Profile
        </h4>
        <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.6;">${escapeHTML(opp.eligibility)}</p>
      </div>

      <!-- Disciplines -->
      <div>
        <h4 style="font-family: var(--font-mono); font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 0.35rem;">
          // Curated Disciplines
        </h4>
        <div class="tags-list">
          ${opp.disciplines.map(t => `<span class="discipline-tag">${escapeHTML(t)}</span>`).join("")}
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <button 
        type="button" 
        class="btn-save ${isSaved ? 'saved' : ''}" 
        id="modal-toggle-save-btn" 
        data-id="${opp.id}"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="${isSaved ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        </svg>
        <span>${isSaved ? 'Saved to Radar' : 'Save to Radar'}</span>
      </button>

      <button 
        type="button" 
        class="nav-btn" 
        id="modal-create-drive-folder-btn"
        data-id="${opp.id}"
        style="border-color: var(--drive-blue); color: var(--drive-blue);"
      >
        <span>📁 Folder in Drive</span>
      </button>

      <a 
        href="${opp.applyUrl}" 
        target="_blank" 
        rel="noopener noreferrer" 
        class="btn-export-drive"
        style="text-decoration: none;"
      >
        <span>Open Application Portal ↗</span>
      </a>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Bind modal buttons
  document.getElementById("modal-toggle-save-btn")?.addEventListener("click", () => {
    toggleSaveOpportunity(opp.id);
    openDetailsModal(opp.id);
  });

  document.getElementById("modal-create-drive-folder-btn")?.addEventListener("click", () => {
    handleQuickDriveFolder(opp.id);
  });
}

/**
 * Open the Permanent Institutions Directory Modal
 */
function openInstitutionsModal() {
  const modal = document.getElementById("general-modal");
  const modalContainer = document.getElementById("modal-content-container");
  if (!modal || !modalContainer) return;

  state.activeModal = "institutions";

  modalContainer.innerHTML = `
    <div class="modal-header">
      <div>
        <div class="modal-subtitle">PERMANENT RELATIONAL DATABASE // BEACHHEAD DIRECTORY</div>
        <h2 class="modal-title">Institutions Radar: Cologne, Berlin, Brussels &amp; Israel</h2>
      </div>
      <button class="modal-close-btn" id="modal-close-btn" aria-label="Close modal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <div class="modal-body">
      <p style="font-size: 0.875rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 0.5rem;">
        CUE RADAR tracks both dynamic open calls and permanent institutional anchors across contemporary dance, experimental sound, and alternative spaces.
      </p>

      <div class="institutions-grid">
        ${state.institutions.map(inst => `
          <div class="institution-card">
            <div>
              <div class="inst-card-header">
                <h4 class="inst-name">${escapeHTML(inst.name)}</h4>
                <span class="inst-location">${escapeHTML(inst.city)} // ${escapeHTML(inst.region)}</span>
              </div>
              <p class="inst-desc">${escapeHTML(inst.description)}</p>
            </div>
            <div>
              <div class="tags-list">
                ${inst.focus.map(f => `<span class="discipline-tag">${escapeHTML(f)}</span>`).join("")}
              </div>
              <a href="${inst.website}" target="_blank" rel="noopener noreferrer" class="inst-website-link">
                <span>Official Institution Portal ↗</span>
              </a>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="nav-btn" id="modal-inst-close-btn">Close Directory</button>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
  document.getElementById("modal-inst-close-btn")?.addEventListener("click", closeModal);
}

function closeModal() {
  const modal = document.getElementById("general-modal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
  state.activeModal = null;
}

/**
 * Toast Notifications
 */
function showToast(message, type = "saved") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-item ${type}`;
  toast.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>
    <span>${escapeHTML(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "all 0.2s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    setTimeout(() => toast.remove(), 220);
  }, 2700);
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function truncate(str, maxLen) {
  if (!str) return "";
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + "…";
}

// ============================================================================
// 6. EVENT SETUP & BOOTSTRAP
// ============================================================================

async function handleGoogleSignInFlow() {
  try {
    const res = await signInWithGoogle();
    if (res) {
      handleAuthStateChange(res.user, res.accessToken);
      showToast("Google Drive connected to CUE RADAR", "drive");
    }
  } catch (err) {
    console.error("[CUE RADAR] Sign-in failed:", err);
  }
}

function setupEventListeners() {
  // 1. Google Sign-In button
  document.getElementById("gsi-signin-btn")?.addEventListener("click", handleGoogleSignInFlow);

  // 2. Drive User Pill Click (Opens Drive Vault)
  document.getElementById("drive-user-pill")?.addEventListener("click", openDriveVaultModal);

  // 3. Drive Sync Shortcut button in grid header
  document.getElementById("btn-header-drive-vault")?.addEventListener("click", openDriveVaultModal);

  // 4. Institutions Directory toggle button
  document.getElementById("btn-institutions-directory")?.addEventListener("click", openInstitutionsModal);

  // 5. Region Tabs
  document.querySelectorAll(".region-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      state.activeRegion = tab.getAttribute("data-region") || "All";
      updateUI();
    });
  });

  // 6. Category Filter Chips
  document.querySelectorAll(".filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      state.activeCategory = chip.getAttribute("data-filter") || "All";
      updateUI();
    });
  });

  // 7. Saved Nav Button
  document.getElementById("nav-saved-btn")?.addEventListener("click", () => {
    if (state.activeCategory === "Saved") {
      state.activeCategory = "All";
    } else {
      state.activeCategory = "Saved";
    }
    updateUI();
  });

  // 8. Search Input
  const searchInput = document.getElementById("search-input");
  const searchClear = document.getElementById("search-clear-btn");

  searchInput?.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    if (searchClear) {
      searchClear.classList.toggle("visible", state.searchQuery.length > 0);
    }
    renderGrid();
  });

  searchClear?.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
    state.searchQuery = "";
    searchClear.classList.remove("visible");
    renderGrid();
  });

  // 9. Sort Select
  document.getElementById("sort-select")?.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderGrid();
  });

  // 10. Reset Filters in Empty State
  document.getElementById("btn-reset-filters")?.addEventListener("click", () => {
    state.activeRegion = "All";
    state.activeCategory = "All";
    state.searchQuery = "";
    if (searchInput) searchInput.value = "";
    if (searchClear) searchClear.classList.remove("visible");
    updateUI();
  });

  // 11. Grid Click Delegation (Save, View, Quick Drive sync)
  const gridContainer = document.getElementById("opportunities-grid");
  gridContainer?.addEventListener("click", (e) => {
    const target = e.target;

    // Toggle save
    const saveBtn = target.closest('[data-action="toggle-save"]');
    if (saveBtn) {
      e.stopPropagation();
      const oppId = saveBtn.getAttribute("data-id");
      if (oppId) toggleSaveOpportunity(oppId);
      return;
    }

    // Quick Drive folder
    const driveBtn = target.closest('[data-action="sync-card-to-drive"]');
    if (driveBtn) {
      e.stopPropagation();
      const oppId = driveBtn.getAttribute("data-id");
      if (oppId) handleQuickDriveFolder(oppId);
      return;
    }

    // View details
    const detailsBtn = target.closest('[data-action="view-details"]');
    if (detailsBtn) {
      const oppId = detailsBtn.getAttribute("data-id");
      if (oppId) openDetailsModal(oppId);
      return;
    }

    // Fallback card click
    const card = target.closest(".opportunity-card");
    if (card && !target.closest("button") && !target.closest("a")) {
      const oppId = card.getAttribute("data-id");
      if (oppId) openDetailsModal(oppId);
    }
  });

  // 12. Modal backdrop close & close button delegation
  const modal = document.getElementById("general-modal");
  modal?.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("#modal-close-btn")) {
      closeModal();
    }
  });

  // 13. Global Keys
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.activeModal) {
      closeModal();
    }
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput?.focus();
    }
  });
}

// App Initialization
document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  initAuth(handleAuthStateChange);
  setupEventListeners();
  updateUI();
  console.log("[CUE RADAR] Loaded successfully with Beachhead Markets & Google Drive API.");
});
