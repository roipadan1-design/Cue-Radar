/**
 * ============================================================================
 * CUE RADAR — Google Drive API Client (Drive v3 REST API)
 * Enables independent artists to browse dossiers, upload application portfolios,
 * and sync tracked open calls directly to their Google Drive.
 * ============================================================================
 */

const DRIVE_API_URL = "https://www.googleapis.com/drive/v3";
const UPLOAD_API_URL = "https://www.googleapis.com/upload/drive/v3";

/**
 * List files and folders from the user's Google Drive
 * @param {string} accessToken 
 * @param {string} searchKeyword 
 * @returns {Promise<Array>}
 */
export async function listDriveFiles(accessToken, searchKeyword = "") {
  if (!accessToken) {
    throw new Error("Missing Google Drive authorization token.");
  }

  let q = "trashed = false";
  if (searchKeyword && searchKeyword.trim() !== "") {
    const escaped = searchKeyword.replace(/'/g, "\\'");
    q += ` and name contains '${escaped}'`;
  }

  const params = new URLSearchParams({
    q: q,
    pageSize: "25",
    fields: "nextPageToken, files(id, name, mimeType, webViewLink, iconLink, size, modifiedTime, thumbnailLink)",
    orderBy: "modifiedTime desc"
  });

  const response = await fetch(`${DRIVE_API_URL}/files?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error?.message || `Google Drive API error (${response.status})`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Creates an Application Dossier Folder in Google Drive for an open call
 * @param {string} accessToken 
 * @param {string} folderName 
 * @returns {Promise<object>} Created folder metadata
 */
export async function createDriveFolder(accessToken, folderName) {
  if (!accessToken) throw new Error("Missing Google Drive authorization token.");

  const metadata = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder"
  };

  const response = await fetch(`${DRIVE_API_URL}/files`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(metadata)
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to create Google Drive folder");
  }

  return await response.json();
}

/**
 * Exports saved/tracked opportunities to a Markdown dossier file in Google Drive
 * @param {string} accessToken 
 * @param {Array} opportunities 
 * @returns {Promise<object>} Created file info
 */
export async function exportDossierToDrive(accessToken, opportunities) {
  if (!accessToken) throw new Error("Missing Google Drive authorization token.");

  const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  
  // Build dossier text
  let content = `# CUE RADAR // ARTIST CAREER OS — TRACKED DOSSIER\n`;
  content += `Generated: ${dateStr}\n`;
  content += `Aggregated Opportunities Count: ${opportunities.length}\n\n`;
  content += `===================================================================\n\n`;

  opportunities.forEach((opp, index) => {
    content += `### [${index + 1}] ${opp.title}\n`;
    content += `- Institution: ${opp.institution} (${opp.location})\n`;
    content += `- Region: ${opp.region}\n`;
    content += `- Disciplines: ${opp.disciplines.join(", ")}\n`;
    content += `- Grant / Support: ${opp.grantAmount}\n`;
    content += `- Deadline: ${opp.deadlineFormatted} (${opp.daysRemaining} days remaining)\n`;
    content += `- Application Fee: ${opp.applicationFee}\n`;
    content += `- Application Portal: ${opp.applyUrl}\n`;
    content += `- Summary: ${opp.description}\n`;
    content += `- Eligibility: ${opp.eligibility}\n\n`;
    content += `-------------------------------------------------------------------\n\n`;
  });

  content += `\nCUE RADAR — Underground Career OS for Contemporary Dance, Experimental Sound & Alternative Arts.\n`;

  const fileName = `CUE_RADAR_Artist_Dossier_${new Date().toISOString().slice(0, 10)}.md`;

  // Multipart upload for metadata + content
  const boundary = "-------314159265358979323846";
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const metadata = {
    name: fileName,
    mimeType: "text/markdown",
    description: "Exported opportunities and deadline radar from CUE RADAR Artist Career OS."
  };

  const multipartRequestBody =
    delimiter +
    "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: text/markdown\r\n\r\n" +
    content +
    closeDelimiter;

  const response = await fetch(`${UPLOAD_API_URL}/files?uploadType=multipart`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": `multipart/related; boundary=${boundary}`
    },
    body: multipartRequestBody
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || "Failed to export dossier to Google Drive");
  }

  return await response.json();
}
