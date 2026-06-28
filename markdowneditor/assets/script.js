const STORAGE_KEY = "markdown-editor-project-v20";
const PREVIOUS_STORAGE_KEYS = ["markdown-editor-project-v19", "markdown-editor-project-v18", "markdown-editor-project-v17", "markdown-editor-project-v16", "markdown-editor-project-v15", "markdown-editor-project-v14", "markdown-editor-project-v13", "markdown-editor-project-v12", "markdown-editor-project-v11", "markdown-editor-project-v10", "markdown-editor-project-v9", "markdown-editor-project-v8", "markdown-editor-project-v7", "markdown-editor-project-v6", "markdown-editor-project-v5", "markdown-editor-project-v4", "markdown-editor-project-v3", "markdown-editor-project-v2"];
const BLOB_SETTINGS_KEY = "markdown-editor-azure-blob-settings-v1";
const AZURE_BLOB_API_VERSION = "2023-11-03";
const DEFAULT_BLOB_SETTINGS = {
  accountName: "",
  endpointSuffix: "core.windows.net",
  accessKey: "",
  container: "",
  folderPath: "",
  postId: "7000"
};
const IMAGE_MIME_EXTENSIONS = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/avif": ".avif",
  "image/bmp": ".bmp",
  "image/tiff": ".tif"
};

const LANGUAGES = [
  ["powershell", "PowerShell"], ["cmd", "cmd"], ["bash", "Bash"], ["json", "JSON"], ["csv", "CSV"],
  ["html", "HTML"], ["css", "CSS"], ["javascript", "JavaScript"], ["typescript", "TypeScript"],
  ["python", "Python"], ["yaml", "YAML"], ["xml", "XML"], ["sql", "SQL"], ["text", "Plain text"]
];
const ALERTS = [
  ["info", "Info", "NOTE"],
  ["warning", "Warning", "WARNING"],
  ["danger", "Failure", "CAUTION"],
  ["success", "Success", "TIP"]
];
const DOCSY_ALERT_TITLE = { info: "Info", warning: "Warning", danger: "Failure", success: "Success" };
const DEFAULT_QUIZ_INTRO = "Answer these question(s) to test your understanding of this post. Your answers are not saved or sent anywhere; this is simply a personal knowledge check. If you refresh the page, your answers will be cleared.";
const DOCSY_GITHUB_BUTTON_TEXT = "View on my GitHub page";
const DOCSY_GITHUB_BUTTON_CLASS = "btn btn-primary";
const DOCSY_GITHUB_BUTTON_DEFAULT_URL = "https://github.com/JustinVerstijnen/JV-AzureServerUpgradeDisk";
const DEFAULT_YOUTUBE_URL = "";
const DEFAULT_IFRAME_URL = "";
const DEFAULT_IFRAME_TITLE = "";

const els = {
  editorBtn: document.getElementById("editorBtn"),
  codeBtn: document.getElementById("codeBtn"),
  postInfoBtn: document.getElementById("postInfoBtn"),
  blobSettingsBtn: document.getElementById("blobSettingsBtn"),
  importBtn: document.getElementById("importBtn"),
  importFile: document.getElementById("importFile"),
  exportBtn: document.getElementById("exportBtn"),
  resetBtn: document.getElementById("resetBtn"),
  projectName: document.getElementById("projectName"),
  saveStatus: document.getElementById("saveStatus"),
  blockGallery: document.getElementById("blockGallery"),
  visualEditor: document.getElementById("visualEditor"),
  markdownEditor: document.getElementById("markdownEditor"),
  editorToolbar: document.getElementById("editorToolbar"),
  headingSelect: document.getElementById("headingSelect"),
  metadataDrawer: document.getElementById("metadataDrawer"),
  closePostInfoBtn: document.getElementById("closePostInfoBtn"),
  savePostInfoBtn: document.getElementById("savePostInfoBtn"),
  fmTitle: document.getElementById("fmTitle"),
  fmSlug: document.getElementById("fmSlug"),
  fmDate: document.getElementById("fmDate"),
  fmDescription: document.getElementById("fmDescription"),
  fmTags: document.getElementById("fmTags"),
  fmCategories: document.getElementById("fmCategories"),
  fmHidden: document.getElementById("fmHidden"),
  imagePanel: document.getElementById("imagePanel"),
  imageUrl: document.getElementById("imageUrl"),
  imageAlt: document.getElementById("imageAlt"),
  imageLink: document.getElementById("imageLink"),
  imageUploadFile: document.getElementById("imageUploadFile"),
  uploadImageFileBtn: document.getElementById("uploadImageFileBtn"),
  cancelImageBtn: document.getElementById("cancelImageBtn"),
  insertImageBtn: document.getElementById("insertImageBtn"),
  blobSettingsPanel: document.getElementById("blobSettingsPanel"),
  blobAccountName: document.getElementById("blobAccountName"),
  blobAccessKey: document.getElementById("blobAccessKey"),
  blobContainer: document.getElementById("blobContainer"),
  blobContainerOptions: document.getElementById("blobContainerOptions"),
  blobFolderPath: document.getElementById("blobFolderPath"),
  blobFolderOptions: document.getElementById("blobFolderOptions"),
  blobPostId: document.getElementById("blobPostId"),
  blobSettingsStatus: document.getElementById("blobSettingsStatus"),
  connectBlobBtn: document.getElementById("connectBlobBtn"),
  loadBlobFoldersBtn: document.getElementById("loadBlobFoldersBtn"),
  cancelBlobSettingsBtn: document.getElementById("cancelBlobSettingsBtn"),
  saveBlobSettingsBtn: document.getElementById("saveBlobSettingsBtn"),
  clearBlobSettingsBtn: document.getElementById("clearBlobSettingsBtn"),
  tablePanel: document.getElementById("tablePanel"),
  tableColumns: document.getElementById("tableColumns"),
  tableRows: document.getElementById("tableRows"),
  tableAlign: document.getElementById("tableAlign"),
  drawioPanel: document.getElementById("drawioPanel"),
  drawioEmbed: document.getElementById("drawioEmbed"),
  cancelDrawioBtn: document.getElementById("cancelDrawioBtn"),
  insertDrawioBtn: document.getElementById("insertDrawioBtn"),
  youtubePanel: document.getElementById("youtubePanel"),
  youtubeUrl: document.getElementById("youtubeUrl"),
  cancelYoutubeBtn: document.getElementById("cancelYoutubeBtn"),
  insertYoutubeBtn: document.getElementById("insertYoutubeBtn"),
  iframePanel: document.getElementById("iframePanel"),
  iframeUrl: document.getElementById("iframeUrl"),
  iframeTitle: document.getElementById("iframeTitle"),
  cancelIframeBtn: document.getElementById("cancelIframeBtn"),
  insertIframeBtn: document.getElementById("insertIframeBtn"),
  cancelTableBtn: document.getElementById("cancelTableBtn"),
  insertTableBtn: document.getElementById("insertTableBtn"),
  buttonPanel: document.getElementById("buttonPanel"),
  buttonText: document.getElementById("buttonText"),
  buttonUrl: document.getElementById("buttonUrl"),
  buttonStyle: document.getElementById("buttonStyle"),
  cancelButtonBtn: document.getElementById("cancelButtonBtn"),
  insertButtonBtn: document.getElementById("insertButtonBtn"),
  githubButtonPanel: document.getElementById("githubButtonPanel"),
  githubButtonUrl: document.getElementById("githubButtonUrl"),
  cancelGithubButtonBtn: document.getElementById("cancelGithubButtonBtn"),
  insertGithubButtonBtn: document.getElementById("insertGithubButtonBtn"),
  quizPanel: document.getElementById("quizPanel"),
  quizQuestions: document.getElementById("quizQuestions"),
  addQuizQuestionBtn: document.getElementById("addQuizQuestionBtn"),
  cancelQuizBtn: document.getElementById("cancelQuizBtn"),
  insertQuizBtn: document.getElementById("insertQuizBtn"),
  slashMenu: document.getElementById("slashMenu"),
  toast: document.getElementById("toast")
};

const state = {
  view: "editor",
  projectName: "markdown-page",
  html: "",
  markdownCache: "",
  rawFrontMatter: "",
  metadata: {
    title: "New Markdown page",
    slug: "new-markdown-page",
    date: new Date().toISOString().slice(0, 10),
    tags: "",
    categories: "",
    description: "",
    hidden: "false"
  }
};

let blobSettings = loadBlobSettings();

let savedRange = null;
let saveTimer = null;
let slashMatches = [];
let activeSlashIndex = 0;
let slashRange = null;
let lastSelectionSavedAt = 0;
let pendingPanelInsertOptions = {};
let pendingInsertAnchorBlock = null;
let pendingInsertMarker = null;
let pendingButtonEditAnchor = null;
let pendingGitHubButtonEditAnchor = null;
let pendingImageEditFigure = null;
let pendingTableEditTarget = null;
let pendingDrawioEditCard = null;
let pendingYoutubeEditCard = null;
let pendingIframeEditCard = null;
let pendingQuizEditCard = null;
let draggedTableRow = null;
let draggedTableColumnIndex = -1;
let normalizeFrame = 0;
let normalizeTimer = 0;
let lastSlashQuery = null;

function isOldStarterContent(html) {
  const text = String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return text === "new markdown page start writing directly in this editor drag blocks from the left menu or type / for commands."
    || text === "new markdown page start writing directly in this editor."
    || text === "start writing directly in this editor drag blocks from the left menu or type / for commands.";
}

function isEditorEffectivelyEmpty() {
  const text = els.visualEditor.textContent.replace(/\u200B/g, "").trim();
  return text === "" && !els.visualEditor.querySelector("img, table, .editable-card, hr, blockquote, ul, ol");
}
function updateEditorPlaceholder() {
  els.visualEditor.removeAttribute("data-empty");
}
function clearEditorPlaceholderBeforeInput() {
  // Placeholder text is CSS-only/disabled; keep this as a no-op for safe older calls.
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function unescapeHtml(value) {
  const node = document.createElement("textarea");
  node.innerHTML = value;
  return node.value;
}
function escapeShortcodeAttribute(value) {
  return String(value || "")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"');
}
function getShortcodeAttribute(attrs, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i");
  const match = String(attrs || "").match(pattern);
  if (!match) return "";
  return String(match[1] ?? match[2] ?? "")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}
function getDefaultDocsyAlertTitle(color = "info") {
  return DOCSY_ALERT_TITLE[color] || "Info";
}
function isDefaultDocsyAlertTitle(title = "") {
  return Object.values(DOCSY_ALERT_TITLE).includes(String(title || "").trim());
}
function iconClass(block) { return block.icon.includes("fa-brands") ? block.icon : "fa-solid " + block.icon; }
function splitList(value) { return String(value || "").split(",").map(item => item.trim()).filter(Boolean); }
function yamlEscape(value) { return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, "\\\""); }
function yamlScalar(value) { return Array.isArray(value) ? value.join(", ") : String(value || "").trim(); }
function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "markdown-page";
}
function coerceYamlList(value) {
  if (Array.isArray(value)) return value.map(item => String(item || "").trim()).filter(Boolean);
  const raw = String(value || "").trim();
  if (!raw) return [];
  if (raw.startsWith("[") && raw.endsWith("]")) return parseYamlArray(raw);
  return raw
    .split(/\r?\n|,/)
    .map(item => item.replace(/^\s*-\s*/, "").trim())
    .filter(Boolean);
}
function yamlListItem(value) {
  const item = String(value || "").trim();
  if (!item) return '""';
  const needsQuotes = /^[-?:,\[\]{}#&*!|>'"%@`]/.test(item)
    || /:\s/.test(item)
    || /\s#/.test(item)
    || /[\r\n]/.test(item)
    || /^(true|false|null|yes|no|on|off)$/i.test(item);
  return needsQuotes ? `"${yamlEscape(item)}"` : item;
}
function appendYamlList(lines, key, value) {
  const items = coerceYamlList(value);
  if (!items.length) {
    lines.push(`${key}: []`);
    return;
  }
  lines.push(`${key}:`);
  items.forEach(item => lines.push(`- ${yamlListItem(item)}`));
}
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}
function isUrl(value) { return /^https?:\/\/[^\s<]+$/i.test(value.trim()); }
function isImageUrl(value) { return /^https?:\/\/\S+\.(png|jpe?g|gif|webp|svg)(\?\S*)?$/i.test(value.trim()); }
function normalizeBlobFolderPath(value = "") {
  return String(value || "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "")
    .replace(/\/+/g, "/");
}
function normalizeBlobSettings(value = {}) {
  const settings = { ...DEFAULT_BLOB_SETTINGS, ...(value || {}) };
  return {
    accountName: String(settings.accountName || "").trim(),
    endpointSuffix: DEFAULT_BLOB_SETTINGS.endpointSuffix,
    accessKey: String(settings.accessKey || "").trim(),
    container: String(settings.container || "").trim(),
    folderPath: normalizeBlobFolderPath(settings.folderPath),
    postId: String(settings.postId || "").trim() || DEFAULT_BLOB_SETTINGS.postId
  };
}
function loadBlobSettings() {
  try {
    return normalizeBlobSettings(JSON.parse(localStorage.getItem(BLOB_SETTINGS_KEY) || "{}"));
  } catch (error) {
    console.warn("Could not load blob settings", error);
    return normalizeBlobSettings();
  }
}
function getBlobSettingsError(settings = blobSettings) {
  const normalized = normalizeBlobSettings(settings);
  if (!normalized.accountName) return "Enter a storage account.";
  if (!normalized.accessKey) return "Enter an access key.";
  if (!normalized.container) return "Enter a container.";
  if (!normalized.folderPath) return "Enter a folder / blob prefix.";
  if (!/^\d+$/.test(normalized.postId)) return "Post ID must be a whole number.";
  return "";
}
function isBlobUploadConfigured(settings = blobSettings) {
  return !getBlobSettingsError(settings);
}
function setBlobSettingsStatus(message = "", type = "") {
  if (!els.blobSettingsStatus) return;
  els.blobSettingsStatus.textContent = message;
  els.blobSettingsStatus.classList.toggle("error", type === "error");
  els.blobSettingsStatus.classList.toggle("success", type === "success");
}
function updateBlobSettingsButton() {
  const configured = isBlobUploadConfigured();
  els.blobSettingsBtn?.classList.toggle("configured", configured);
  if (els.blobSettingsBtn) {
    els.blobSettingsBtn.title = configured ? "Azure Blob upload is configured" : "Set Azure Blob upload settings";
  }
}
function fillBlobSettingsForm() {
  const settings = normalizeBlobSettings(blobSettings);
  if (els.blobAccountName) els.blobAccountName.value = settings.accountName;
  if (els.blobAccessKey) els.blobAccessKey.value = settings.accessKey;
  if (els.blobContainer) els.blobContainer.value = settings.container;
  if (els.blobFolderPath) els.blobFolderPath.value = settings.folderPath;
  if (els.blobPostId) els.blobPostId.value = settings.postId;
  const error = getBlobSettingsError(settings);
  setBlobSettingsStatus(error ? "Incomplete settings." : "Ready to upload pasted images.", error ? "" : "success");
}
function readBlobSettingsForm() {
  return normalizeBlobSettings({
    accountName: els.blobAccountName?.value,
    accessKey: els.blobAccessKey?.value,
    container: els.blobContainer?.value,
    folderPath: els.blobFolderPath?.value,
    postId: els.blobPostId?.value
  });
}
function openBlobSettingsPanel() {
  fillBlobSettingsForm();
  els.blobSettingsPanel?.classList.add("open");
  setTimeout(() => els.blobAccountName?.focus(), 80);
}
function closeBlobSettingsPanel() {
  els.blobSettingsPanel?.classList.remove("open");
  setBlobSettingsStatus("");
}
function saveBlobSettingsFromForm() {
  const settings = readBlobSettingsForm();
  const error = getBlobSettingsError(settings);
  if (error) {
    setBlobSettingsStatus(error, "error");
    return false;
  }
  blobSettings = settings;
  localStorage.setItem(BLOB_SETTINGS_KEY, JSON.stringify(settings));
  updateBlobSettingsButton();
  closeBlobSettingsPanel();
  showToast("Blob settings saved");
  return true;
}
function clearBlobSettings() {
  blobSettings = normalizeBlobSettings();
  localStorage.removeItem(BLOB_SETTINGS_KEY);
  setDatalistOptions(els.blobContainerOptions, []);
  setDatalistOptions(els.blobFolderOptions, []);
  fillBlobSettingsForm();
  updateBlobSettingsButton();
  setBlobSettingsStatus("Blob settings cleared.", "success");
}
function getContentTypeFromExtension(extension = "") {
  switch (String(extension || "").toLowerCase()) {
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".gif": return "image/gif";
    case ".webp": return "image/webp";
    case ".svg": return "image/svg+xml";
    case ".avif": return "image/avif";
    case ".bmp": return "image/bmp";
    case ".tif":
    case ".tiff": return "image/tiff";
    default: return "application/octet-stream";
  }
}
function getImageExtension(file) {
  const allowed = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif", ".bmp", ".tif", ".tiff"]);
  const match = String(file?.name || "").match(/\.[a-z0-9]+$/i);
  const byName = match ? match[0].toLowerCase() : "";
  if (allowed.has(byName)) return byName;
  return IMAGE_MIME_EXTENSIONS[String(file?.type || "").toLowerCase()] || ".png";
}
function encodeBlobPathForUrl(blobPath = "") {
  return String(blobPath || "").split("/").map(segment => encodeURIComponent(segment)).join("/");
}
function bytesToHex(bytes) {
  return Array.from(bytes).map(byte => byte.toString(16).padStart(2, "0")).join("");
}
function bytesToBase64(bytes) {
  let binary = "";
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}
function base64ToBytes(value = "") {
  const binary = atob(String(value || "").replace(/\s/g, ""));
  return Uint8Array.from(binary, char => char.charCodeAt(0));
}
async function hmacSha256Base64(base64Key, message) {
  if (!globalThis.crypto?.subtle) throw new Error("Web Crypto is not available in this browser context.");
  const key = await globalThis.crypto.subtle.importKey(
    "raw",
    base64ToBytes(base64Key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await globalThis.crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return bytesToBase64(new Uint8Array(signature));
}
async function getArrayBufferHash12(buffer) {
  if (!globalThis.crypto?.subtle) throw new Error("Web Crypto is not available in this browser context.");
  const hash = await globalThis.crypto.subtle.digest("SHA-256", buffer);
  return bytesToHex(new Uint8Array(hash)).slice(0, 12);
}
function getCanonicalizedHeaders(headers) {
  return Object.keys(headers)
    .filter(key => key.toLowerCase().startsWith("x-ms-"))
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    .map(key => `${key.toLowerCase().trim()}:${String(headers[key]).trim()}`)
    .join("\n");
}
async function buildAzureAuthorizationHeader({ method, contentLength, contentType, canonicalizedResource, headers, accountName, accessKey }) {
  const contentLengthValue = contentLength === undefined || contentLength === null ? "" : String(contentLength);
  const stringToSign = [
    method,
    "",
    "",
    contentLengthValue,
    "",
    contentType || "",
    "",
    "",
    "",
    "",
    "",
    "",
    getCanonicalizedHeaders(headers),
    canonicalizedResource
  ].join("\n");
  const signature = await hmacSha256Base64(accessKey, stringToSign);
  return `SharedKey ${accountName}:${signature}`;
}
function getBlobStorageBaseUrl(settings = blobSettings) {
  const normalized = normalizeBlobSettings(settings);
  return `https://${normalized.accountName}.blob.${normalized.endpointSuffix}`;
}
function getBlobConnectionError(settings = blobSettings) {
  const normalized = normalizeBlobSettings(settings);
  if (!normalized.accountName) return "Enter a storage account.";
  if (!normalized.accessKey) return "Enter an access key.";
  return "";
}
function getBlobFolderLoadError(settings = blobSettings) {
  const connectionError = getBlobConnectionError(settings);
  if (connectionError) return connectionError;
  if (!normalizeBlobSettings(settings).container) return "Enter or select a container.";
  return "";
}
function getAzureCorsHelp() {
  return "Azure CORS is blocking this browser request. Allow this editor origin with GET, PUT, OPTIONS and the Authorization, Content-Type and x-ms-* headers.";
}
function getAzureRequestErrorMessage(error) {
  const message = String(error?.message || error || "");
  if (/failed to fetch|networkerror|cors/i.test(message)) return getAzureCorsHelp();
  return message || "Azure request failed.";
}
async function invokeAzureBlobRequest({ settings, method, url, canonicalizedResource, body = null, contentType = "", extraHeaders = {} }) {
  const normalized = normalizeBlobSettings(settings);
  const headers = {
    "x-ms-date": new Date().toUTCString(),
    "x-ms-version": AZURE_BLOB_API_VERSION,
    ...extraHeaders
  };
  const bodyBytes = body instanceof ArrayBuffer ? body : null;
  const authorization = await buildAzureAuthorizationHeader({
    method,
    contentLength: bodyBytes ? bodyBytes.byteLength : null,
    contentType,
    canonicalizedResource,
    headers,
    accountName: normalized.accountName,
    accessKey: normalized.accessKey
  });
  const fetchHeaders = {
    ...headers,
    Authorization: authorization
  };
  if (contentType) fetchHeaders["Content-Type"] = contentType;

  let response;
  try {
    response = await fetch(url, {
      method,
      headers: fetchHeaders,
      body: bodyBytes || undefined
    });
  } catch (error) {
    throw new Error(getAzureRequestErrorMessage(error));
  }

  const responseText = await response.text().catch(() => "");
  if (!response.ok) {
    throw new Error(`Azure request failed (${response.status}): ${responseText || response.statusText}`);
  }
  return responseText;
}
function parseAzureXml(xmlText) {
  const parser = new DOMParser();
  const xml = parser.parseFromString(String(xmlText || ""), "application/xml");
  if (xml.querySelector("parsererror")) throw new Error("Azure returned invalid XML.");
  return xml;
}
async function getContainerList(settings = blobSettings) {
  const normalized = normalizeBlobSettings(settings);
  const baseUrl = getBlobStorageBaseUrl(normalized);
  const xmlText = await invokeAzureBlobRequest({
    settings: normalized,
    method: "GET",
    url: `${baseUrl}/?comp=list`,
    canonicalizedResource: `/${normalized.accountName}/\ncomp:list`
  });
  return Array.from(parseAzureXml(xmlText).querySelectorAll("Containers > Container > Name"))
    .map(node => node.textContent.trim())
    .filter(Boolean);
}
async function getBlobListPage(settings = blobSettings, marker = "", maxResults = 5000) {
  const normalized = normalizeBlobSettings(settings);
  const baseUrl = getBlobStorageBaseUrl(normalized);
  const encodedContainer = encodeURIComponent(normalized.container);
  const queryParts = ["restype=container", "comp=list", `maxresults=${maxResults}`];
  if (marker) queryParts.push(`marker=${encodeURIComponent(marker)}`);
  const canonicalizedResource = [
    `/${normalized.accountName}/${normalized.container}`,
    "comp:list",
    marker ? `marker:${marker}` : "",
    `maxresults:${maxResults}`,
    "restype:container"
  ].filter(Boolean).join("\n");
  const xmlText = await invokeAzureBlobRequest({
    settings: normalized,
    method: "GET",
    url: `${baseUrl}/${encodedContainer}?${queryParts.join("&")}`,
    canonicalizedResource
  });
  const xml = parseAzureXml(xmlText);
  return {
    blobNames: Array.from(xml.querySelectorAll("Blobs > Blob > Name"))
      .map(node => node.textContent.trim())
      .filter(Boolean),
    nextMarker: (xml.querySelector("NextMarker")?.textContent || "").trim()
  };
}
async function getBlobNames(settings = blobSettings) {
  const all = [];
  let marker = "";
  do {
    const page = await getBlobListPage(settings, marker);
    all.push(...page.blobNames);
    marker = page.nextMarker;
  } while (marker);
  return all;
}
function getFolderSuggestionsFromBlobNames(blobNames = []) {
  const folders = new Set();
  blobNames.forEach(blobName => {
    const segments = String(blobName || "").replace(/\\/g, "/").split("/").filter(Boolean);
    for (let index = 0; index < segments.length - 1; index += 1) {
      folders.add(segments.slice(0, index + 1).join("/"));
    }
  });
  return Array.from(folders).sort((a, b) => a.localeCompare(b));
}
function setDatalistOptions(datalist, values = []) {
  if (!datalist) return;
  datalist.innerHTML = values.map(value => `<option value="${escapeHtml(value)}"></option>`).join("");
}
async function connectBlobStorage() {
  const settings = readBlobSettingsForm();
  const error = getBlobConnectionError(settings);
  if (error) {
    setBlobSettingsStatus(error, "error");
    return;
  }
  els.connectBlobBtn.disabled = true;
  setBlobSettingsStatus("Connecting to Azure...", "");
  try {
    const containers = await getContainerList(settings);
    setDatalistOptions(els.blobContainerOptions, containers);
    if (!els.blobContainer.value.trim() && containers.length) els.blobContainer.value = containers[0];
    setBlobSettingsStatus(`${containers.length} container${containers.length === 1 ? "" : "s"} loaded.`, "success");
    if (els.blobContainer.value.trim()) await loadBlobFoldersFromForm(true);
  } catch (error) {
    console.error(error);
    setBlobSettingsStatus(getAzureRequestErrorMessage(error), "error");
  } finally {
    els.connectBlobBtn.disabled = false;
  }
}
async function loadBlobFoldersFromForm(fromConnect = false) {
  const settings = readBlobSettingsForm();
  const error = getBlobFolderLoadError(settings);
  if (error) {
    setBlobSettingsStatus(error, "error");
    return [];
  }
  els.loadBlobFoldersBtn.disabled = true;
  setBlobSettingsStatus("Loading folders from container...", "");
  try {
    const folders = getFolderSuggestionsFromBlobNames(await getBlobNames(settings));
    setDatalistOptions(els.blobFolderOptions, folders);
    setBlobSettingsStatus(`${folders.length} folder suggestion${folders.length === 1 ? "" : "s"} loaded.`, "success");
    return folders;
  } catch (error) {
    console.error(error);
    setBlobSettingsStatus(getAzureRequestErrorMessage(error), "error");
    if (!fromConnect) showToast("Could not load folders");
    return [];
  } finally {
    els.loadBlobFoldersBtn.disabled = false;
  }
}
function getUploadErrorMessage(error) {
  const message = String(error?.message || error || "");
  if (/failed to fetch|networkerror|cors/i.test(message)) {
    return "Upload blocked by Azure CORS. Open Blob settings.";
  }
  return message || "Upload failed";
}
async function uploadImageFileToBlob(file) {
  const settings = normalizeBlobSettings(blobSettings);
  const settingsError = getBlobSettingsError(settings);
  if (settingsError) throw new Error(settingsError);

  const body = await file.arrayBuffer();
  const hash12 = await getArrayBufferHash12(body);
  const extension = getImageExtension(file);
  const contentType = getContentTypeFromExtension(extension);
  const fileName = `jv-media-${settings.postId}-${hash12}${extension}`;
  const blobPath = `${settings.folderPath}/${fileName}`;
  const baseUrl = `https://${settings.accountName}.blob.${settings.endpointSuffix}`;
  const encodedContainer = encodeURIComponent(settings.container);
  const encodedBlobPath = encodeBlobPathForUrl(blobPath);
  const url = `${baseUrl}/${encodedContainer}/${encodedBlobPath}`;
  const headers = {
    "x-ms-date": new Date().toUTCString(),
    "x-ms-version": AZURE_BLOB_API_VERSION,
    "x-ms-blob-type": "BlockBlob",
    "x-ms-blob-content-type": contentType,
    "x-ms-blob-content-disposition": "inline",
    "x-ms-blob-cache-control": "no-cache"
  };
  const authorization = await buildAzureAuthorizationHeader({
    method: "PUT",
    contentLength: body.byteLength,
    contentType,
    canonicalizedResource: `/${settings.accountName}/${settings.container}/${blobPath}`,
    headers,
    accountName: settings.accountName,
    accessKey: settings.accessKey
  });

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": contentType,
      Authorization: authorization
    },
    body
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => "");
    throw new Error(`Upload failed (${response.status}): ${bodyText || response.statusText}`);
  }

  return { url, fileName, blobPath };
}
function dataImageUrlToFile(dataUrl = "") {
  const commaIndex = String(dataUrl).indexOf(",");
  if (commaIndex < 0) throw new Error("Invalid image data URL.");
  const meta = dataUrl.slice(0, commaIndex);
  const data = dataUrl.slice(commaIndex + 1);
  const mime = (meta.match(/^data:([^;]+)/i)?.[1] || "image/png").toLowerCase();
  const isBase64 = /;base64/i.test(meta);
  const binary = isBase64 ? atob(data) : decodeURIComponent(data);
  const bytes = Uint8Array.from(binary, char => char.charCodeAt(0));
  const extension = IMAGE_MIME_EXTENSIONS[mime] || ".png";
  return new File([bytes], `pasted-image${extension}`, { type: mime });
}
function getFileAltText(file, fallback = "Image") {
  const name = String(file?.name || "").trim();
  return name && name !== "image.png" ? name : fallback;
}
async function uploadImageSourceToBlob(source) {
  const file = source?.type === "file" ? source.value : dataImageUrlToFile(source?.value || "");
  return { file, result: await uploadImageFileToBlob(file) };
}
async function uploadAndInsertPastedImage(source) {
  if (!isBlobUploadConfigured()) {
    openBlobSettingsPanel();
    showToast("Set blob settings first");
    return;
  }
  const range = getCurrentEditorRange() || getFreshSavedRange(15000) || createEndRange();
  const marker = createInsertionMarkerAtRange(range);
  showToast("Uploading image...");
  try {
    const { file, result } = await uploadImageSourceToBlob(source);
    insertHtmlAtCursor(imageHtml(result.url, getFileAltText(file, result.fileName), "Optional caption", result.url), { allowOldSelection: false, marker });
    showToast("Image uploaded");
  } catch (error) {
    if (marker?.isConnected) marker.remove();
    console.error(error);
    showToast(getUploadErrorMessage(error));
  }
}
async function uploadImageSourceToPanel(source) {
  if (!isBlobUploadConfigured()) return false;
  showToast("Uploading image...");
  try {
    const { file, result } = await uploadImageSourceToBlob(source);
    els.imageUrl.value = result.url;
    if (!els.imageAlt.value.trim()) els.imageAlt.value = getFileAltText(file, result.fileName);
    if (!els.imageLink.value.trim() || els.imageLink.value.trim() === els.imageLink.dataset.autoValue) {
      els.imageLink.value = result.url;
      els.imageLink.dataset.autoValue = result.url;
    }
    showToast("Image uploaded");
    return true;
  } catch (error) {
    console.error(error);
    showToast(getUploadErrorMessage(error));
    return true;
  }
}
async function uploadImageFileFromPanel(file) {
  if (!file) return;
  if (!isBlobUploadConfigured()) {
    openBlobSettingsPanel();
    showToast("Set blob settings first");
    return;
  }
  await uploadImageSourceToPanel({ type: "file", value: file });
}
function languageOptions(selected = "powershell") {
  return LANGUAGES.map(([value, label]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`).join("");
}
function alertOptions(selected = "info") {
  return ALERTS.map(([value, label]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`).join("");
}

function optionLabel(options, selected) {
  return (options.find(([value]) => value === selected) || options[0] || [selected, selected])[1];
}
function languageTitle(language) {
  const normalized = String(language || "").trim();
  return LANGUAGES.find(([value]) => value === normalized)?.[1] || normalized || "Plain text";
}
function blockDropdownHtml(type, options, selected) {
  const label = optionLabel(options, selected);
  const items = options.map(([value, text]) => `<button type="button" role="option" data-value="${escapeHtml(value)}" aria-selected="${value === selected ? "true" : "false"}">${escapeHtml(text)}</button>`).join("");
  return `<div class="block-dropdown" contenteditable="false" data-dropdown-type="${escapeHtml(type)}" data-value="${escapeHtml(selected)}"><button type="button" class="block-dropdown-toggle" aria-haspopup="listbox" aria-expanded="false"><span>${escapeHtml(label)}</span></button><div class="block-dropdown-menu" role="listbox">${items}</div></div>`;
}
function languageDropdownHtml(selected = "powershell") { return blockDropdownHtml("language", LANGUAGES, selected); }
function alertDropdownHtml(selected = "info") { return blockDropdownHtml("alert", ALERTS.map(([value, label]) => [value, label]), selected); }
function alertTitleInputHtml(color = "info", title = "") {
  const value = String(title || "").trim() || getDefaultDocsyAlertTitle(color);
  return `<label class="alert-title-field">Title <input class="alert-title" type="text" value="${escapeHtml(value)}" placeholder="${escapeHtml(getDefaultDocsyAlertTitle(color))}" contenteditable="false" /></label>`;
}
function getAlertBlockTitle(block) {
  const color = block?.dataset?.color || "info";
  const input = block?.querySelector?.(".alert-title");
  const title = String(input?.value || input?.getAttribute("value") || block?.dataset?.title || "").trim();
  return title || getDefaultDocsyAlertTitle(color);
}

function codeBlockHtml(language = "powershell", code = "") {
  return `<div class="code-block editable-card" contenteditable="false" data-language="${escapeHtml(language)}"><div class="block-settings" contenteditable="false"><span><i class="fa-solid fa-code"></i> Code block</span><label>Language ${languageDropdownHtml(language)}</label></div><pre contenteditable="true" spellcheck="false"><code>${escapeHtml(code)}</code></pre></div><p><br></p>`;
}
function docsyCodeBlockHtml(language = "bash", code = "") {
  return `<div class="docsy-code-block editable-card" contenteditable="false" data-language="${escapeHtml(language)}"><div class="block-settings" contenteditable="false"><span><i class="fa-solid fa-file-code"></i> Docsy code card</span><label>Language ${languageDropdownHtml(language)}</label></div><pre contenteditable="true" spellcheck="false"><code>${escapeHtml(code)}</code></pre></div><p><br></p>`;
}
function htmlBlockHtml() {
  return codeBlockHtml("html", `<section class="custom-block">\n  <h2>Custom HTML</h2>\n  <p>Edit this HTML block.</p>\n</section>`);
}
function rawHtmlDocsyBlockHtml(html = `<section class="custom-block">
  <h2>Custom HTML</h2>
  <p>Edit this raw HTML block.</p>
</section>`) {
  return rawHtmlCard("Raw HTML", html);
}
function getDefaultDrawioEmbed() {
  return `<!-- draw.io diagram -->
<iframe frameborder="0" style="width:100%;height:409px;background:#ffffff;display:block;border:0;" src="https://viewer.diagrams.net/?lightbox=1&highlight=0000ff&layers=1&nav=1&dark=0"></iframe>`;
}
function cleanDrawioEmbed(html = "") {
  const value = String(html || "").trim() || getDefaultDrawioEmbed();
  const sandbox = document.createElement("div");
  sandbox.innerHTML = value;

  // Keep the draw.io block idempotent when switching between editor/code.
  // Older versions could wrap an already wrapped iframe again, which caused repeated
  // <!-- draw.io diagram --> + .drawio-white-background blocks in Markdown view.
  const drawioIframe = Array.from(sandbox.querySelectorAll("iframe"))
    .find(iframe => /(?:viewer|app)\.diagrams\.net/i.test(iframe.getAttribute("src") || ""));
  const iframe = drawioIframe || sandbox.querySelector("iframe");
  const inner = iframe
    ? iframe.outerHTML.trim()
    : value
        .replace(/<!--\s*draw\.io diagram\s*-->/gi, "")
        .replace(/<div\b([^>]*\sclass=["'][^"']*drawio-white-background[^"']*["'][^>]*)>/gi, "")
        .replace(/<\/div>\s*$/i, "")
        .trim();

  return `<!-- draw.io diagram -->
<div class="drawio-white-background" style="background:#ffffff; padding:24px; border-radius:12px; overflow-x:auto;">
${inner}
</div>`;
}
function drawioBlockHtml(html = getDefaultDrawioEmbed()) {
  return rawHtmlCard("Draw.io diagram", cleanDrawioEmbed(html)).replace('data-raw-html="true"', 'data-raw-html="true" data-drawio="true"');
}
function getYouTubeVideoId(value = "") {
  const raw = String(value || "").trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");
    if (host === "youtu.be") return (url.pathname.split("/").filter(Boolean)[0] || "").slice(0, 11);
    if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
      const byQuery = url.searchParams.get("v");
      if (byQuery) return byQuery.slice(0, 11);
      const parts = url.pathname.split("/").filter(Boolean);
      const markerIndex = parts.findIndex(part => ["embed", "shorts", "live"].includes(part));
      if (markerIndex >= 0 && parts[markerIndex + 1]) return parts[markerIndex + 1].slice(0, 11);
    }
  } catch (error) {
    // Fall back to regex parsing below.
  }
  const match = raw.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?[^\s#]*v=|embed\/|shorts\/|live\/))([a-zA-Z0-9_-]{11})/i);
  return match ? match[1] : "";
}
function getYouTubeEmbedSrc(value = DEFAULT_YOUTUBE_URL) {
  const videoId = getYouTubeVideoId(value);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1` : "";
}
function buildYouTubeIframe(value = DEFAULT_YOUTUBE_URL) {
  const src = getYouTubeEmbedSrc(value);
  if (!src) return "";
  return `<iframe
width="960"
height="540"
src="${src}"
title="JV video player"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen>
</iframe>`;
}
function isYouTubeHtml(html = "") {
  return /<iframe[\s\S]+(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)/i.test(String(html || ""));
}
function getYouTubeSourceFromCard(card) {
  const raw = card?.querySelector?.("textarea")?.value || card?.dataset?.youtubeUrl || DEFAULT_YOUTUBE_URL;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = raw;
  const iframeSrc = wrapper.querySelector("iframe")?.getAttribute("src") || raw;
  return iframeSrc;
}
function youtubeBlockHtml(value = DEFAULT_YOUTUBE_URL) {
  const cleanValue = String(value || "").trim();
  const iframe = buildYouTubeIframe(cleanValue);
  const videoId = getYouTubeVideoId(cleanValue);
  return `<div class="raw-html-card youtube-card editable-card" data-raw-html="true" data-youtube="true" data-youtube-url="${escapeHtml(cleanValue)}" contenteditable="false"><div class="block-settings" contenteditable="false"><span><i class="fa-brands fa-youtube"></i> YouTube video</span><small>${escapeHtml(videoId)}</small></div><textarea>${escapeHtml(iframe)}</textarea><div class="youtube-preview" contenteditable="false">${iframe}</div></div><p><br></p>`;
}
function isStandardIframeHtml(html = "") {
  const value = String(html || "");
  return /<iframe\b[\s\S]*?>[\s\S]*?<\/iframe>/i.test(value) && !isYouTubeHtml(value) && !isDrawioHtml(value);
}
function buildStandardIframe(url = DEFAULT_IFRAME_URL, title = DEFAULT_IFRAME_TITLE) {
  const src = String(url || "").trim();
  const iframeTitle = String(title ?? DEFAULT_IFRAME_TITLE).trim();
  return `<iframe frameborder="0" width="960" height="540" src="${escapeHtml(src)}" title="${escapeHtml(iframeTitle)}"></iframe>`;
}
function getIframeDataFromHtml(html = "") {
  const wrapper = document.createElement("div");
  wrapper.innerHTML = String(html || "");
  const iframe = wrapper.querySelector("iframe");
  return {
    url: iframe?.getAttribute("src") || "",
    title: iframe?.getAttribute("title") || DEFAULT_IFRAME_TITLE
  };
}
function getStandardIframeDataFromCard(card) {
  const raw = card?.querySelector?.("textarea")?.value || "";
  const parsed = getIframeDataFromHtml(raw);
  return {
    url: parsed.url || card?.dataset?.iframeUrl || DEFAULT_IFRAME_URL,
    title: parsed.title || card?.dataset?.iframeTitle || DEFAULT_IFRAME_TITLE
  };
}
function standardIframeBlockHtml(url = DEFAULT_IFRAME_URL, title = DEFAULT_IFRAME_TITLE) {
  const cleanUrl = String(url || "").trim();
  const cleanTitle = String(title ?? DEFAULT_IFRAME_TITLE).trim();
  const iframe = buildStandardIframe(cleanUrl, cleanTitle);
  const label = cleanUrl || "No URL set";
  return `<div class="raw-html-card iframe-card editable-card" data-raw-html="true" data-iframe="true" data-iframe-url="${escapeHtml(cleanUrl)}" data-iframe-title="${escapeHtml(cleanTitle)}" contenteditable="false"><div class="block-settings" contenteditable="false"><span><i class="fa-solid fa-window-maximize"></i> Iframe</span><small>${escapeHtml(label)}</small></div><textarea>${escapeHtml(iframe)}</textarea><div class="iframe-preview" contenteditable="false">${cleanUrl ? iframe : ""}</div></div><p><br></p>`;
}
function isDrawioHtml(html = "") {
  return /drawio-white-background|viewer\.diagrams\.net|app\.diagrams\.net/i.test(String(html || ""));
}
function htmlBlockToInteractiveBlock(html = "") {
  const value = String(html || "").trim();
  if (!value) return rawHtmlCard("Raw HTML", "");
  const wrapper = document.createElement("div");
  wrapper.innerHTML = value;
  const anchor = wrapper.querySelector('a.btn[href]');
  if (anchor && wrapper.textContent.trim() === anchor.textContent.trim()) {
    return `<p>${anchor.outerHTML}</p>`;
  }
  if (isDrawioHtml(value)) return drawioBlockHtml(value);
  if (isYouTubeHtml(value)) return youtubeBlockHtml(value);
  if (isStandardIframeHtml(value)) {
    const iframeData = getIframeDataFromHtml(value);
    return standardIframeBlockHtml(iframeData.url, iframeData.title);
  }
  return rawHtmlCard("Raw HTML", value);
}
function markdownFragmentToHtml(markdown) {
  const value = String(markdown || "").trim();
  if (!value) return "";
  return markdownToHtml(value).replace(/(?:<p><br><\/p>\s*)+$/i, "").trim();
}
function alertBlockHtml(kind = "markdown", color = "info", text = "", customTitle = "") {
  const normalizedColor = ALERTS.find(([value]) => value === color)?.[0] || "info";
  const label = ALERTS.find(([value]) => value === normalizedColor)?.[1] || "Info";
  const cls = kind === "docsy" ? "docsy-alert-block" : "markdown-alert-block";
  const title = kind === "docsy" ? `Docsy ${label}` : `Markdown ${label}`;
  const icon = kind === "docsy" ? "fa-triangle-exclamation" : "fa-bell";
  const contentHtml = markdownFragmentToHtml(text);
  const docsyTitle = String(customTitle || "").trim() || getDefaultDocsyAlertTitle(normalizedColor);
  const titleControl = kind === "docsy" ? alertTitleInputHtml(normalizedColor, docsyTitle) : "";
  const titleData = kind === "docsy" ? ` data-title="${escapeHtml(docsyTitle)}"` : "";
  return `<div class="${cls} editable-card alert-${escapeHtml(normalizedColor)}" contenteditable="false" data-color="${escapeHtml(normalizedColor)}"${titleData}><div class="block-settings" contenteditable="false"><span><i class="fa-solid ${icon}"></i> ${escapeHtml(title)}</span><label>Type ${alertDropdownHtml(normalizedColor)}</label>${titleControl}</div><div class="alert-content" contenteditable="true">${contentHtml}</div></div><p><br></p>`;
}
function shortcodeCard(title, shortcode) {
  return `<div class="shortcode-card editable-card" data-shortcode="true" contenteditable="false"><div class="block-settings"><span><i class="fa-solid fa-cube"></i> ${escapeHtml(title)}</span></div><textarea>${escapeHtml(shortcode)}</textarea></div><p><br></p>`;
}
function rawHtmlCard(title, html) {
  return `<div class="raw-html-card editable-card" data-raw-html="true" contenteditable="false"><div class="block-settings"><span><i class="fa-brands fa-html5"></i> ${escapeHtml(title)}</span></div><textarea>${escapeHtml(html)}</textarea></div><p><br></p>`;
}
function getDefaultQuizData() {
  return {
    intro: DEFAULT_QUIZ_INTRO,
    questions: [
      {
        question: "Add your question here",
        reference: "See the section: Section title",
        referenceUrl: "#section-title",
        answers: [
          { text: "Correct answer", correct: true, message: "Correct! This is the right answer." },
          { text: "Incorrect answer", correct: false, message: "Incorrect. Review the referenced section and try again." }
        ]
      }
    ]
  };
}
function normalizeQuizData(data = {}) {
  const source = data && typeof data === "object" ? data : {};
  const normalized = {
    intro: DEFAULT_QUIZ_INTRO,
    questions: Array.isArray(source.questions) ? source.questions.map(question => {
      const answers = Array.isArray(question?.answers) ? question.answers.map(answer => ({
        text: String(answer?.text || "").trim(),
        correct: answer?.correct === true,
        message: String(answer?.message || "").trim()
      })) : [];
      const cleanAnswers = answers.length ? answers : [
        { text: "Correct answer", correct: true, message: "Correct! This is the right answer." },
        { text: "Incorrect answer", correct: false, message: "Incorrect. Review the referenced section and try again." }
      ];
      if (cleanAnswers.length === 1) cleanAnswers.push({ text: "Incorrect answer", correct: false, message: "Incorrect. Review the referenced section and try again." });
      if (!cleanAnswers.some(answer => answer.correct)) cleanAnswers[0].correct = true;
      return {
        question: String(question?.question || "Add your question here").trim(),
        reference: String(question?.reference || "See the section: Section title").trim(),
        referenceUrl: String(question?.referenceUrl || "#section-title").trim(),
        answers: cleanAnswers
      };
    }) : []
  };
  if (!normalized.questions.length) normalized.questions = getDefaultQuizData().questions;
  return normalized;
}
function parseQuizJson(value) {
  try {
    return normalizeQuizData(JSON.parse(String(value || "{}")));
  } catch (error) {
    console.warn("Invalid quiz JSON", error);
    return getDefaultQuizData();
  }
}
function getQuizDataFromCard(card) {
  const json = card?.querySelector?.(".quiz-json-source")?.value || card?.dataset?.quizJson || "";
  return parseQuizJson(json);
}
function buildQuizShortcode(data) {
  return `{{< quiz >}}
${JSON.stringify(normalizeQuizData(data), null, 2)}
{{< /quiz >}}`;
}
function quizPreviewQuestionHtml(question, index) {
  const correctAnswer = question.answers.find(answer => answer.correct) || question.answers[0] || {};
  return `<div class="quiz-preview-question">
    <div class="quiz-preview-question-title"><span>Question ${index + 1}</span>${escapeHtml(question.question)}</div>
    <div class="quiz-preview-meta"><span>${question.answers.length} answers</span><span>Correct: ${escapeHtml(correctAnswer.text || "Not set")}</span></div>
    <div class="quiz-preview-reference">${escapeHtml(question.reference || "No reference set")} ${question.referenceUrl ? `<code>${escapeHtml(question.referenceUrl)}</code>` : ""}</div>
  </div>`;
}
function quizBlockHtml(data = getDefaultQuizData()) {
  const quiz = normalizeQuizData(data);
  const json = JSON.stringify(quiz);
  return `<div class="quiz-card editable-card" data-quiz="true" contenteditable="false"><div class="block-settings" contenteditable="false"><span><i class="fa-solid fa-circle-question"></i> Quiz shortcode</span><small>${quiz.questions.length} question${quiz.questions.length === 1 ? "" : "s"}</small></div><textarea class="quiz-json-source" hidden>${escapeHtml(json)}</textarea><div class="quiz-preview" contenteditable="false"><p class="quiz-preview-intro">${escapeHtml(quiz.intro)}</p>${quiz.questions.map(quizPreviewQuestionHtml).join("")}</div></div><p><br></p>`;
}
function imageHtml(src, alt = "Image", caption = "Optional caption", href = "") {
  const linkTarget = String(href || "").trim() || src;
  return `<figure class="image-block" data-resizable="true" data-link="${escapeHtml(linkTarget)}"><a class="image-link" href="${escapeHtml(linkTarget)}" target="_blank" rel="noreferrer"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"></a><figcaption contenteditable="true">${escapeHtml(caption)}</figcaption></figure><p><br></p>`;
}
function docsyButtonHtml(text = "Read the documentation", href = "/docs/", classes = "btn btn-primary") {
  return `<p><a class="${escapeHtml(classes)}" href="${escapeHtml(href)}" target="_blank" rel="noreferrer">${escapeHtml(text)}</a></p>`;
}
function docsyGitHubButtonHtml(href = DOCSY_GITHUB_BUTTON_DEFAULT_URL) {
  const targetHref = String(href || "").trim() || DOCSY_GITHUB_BUTTON_DEFAULT_URL;
  return `<p><a class="${DOCSY_GITHUB_BUTTON_CLASS}" href="${escapeHtml(targetHref)}" target="_blank" rel="noreferrer" data-docsy-github-button="true">${DOCSY_GITHUB_BUTTON_TEXT}</a></p>`;
}
function isDocsyGitHubButtonAnchor(anchor) {
  if (!anchor?.classList?.contains("btn")) return false;
  const text = String(anchor.textContent || "").trim();
  const classes = String(anchor.getAttribute("class") || "").trim();
  return anchor.dataset.docsyGithubButton === "true" || (text === DOCSY_GITHUB_BUTTON_TEXT && classes === DOCSY_GITHUB_BUTTON_CLASS);
}
function guessAltTextFromUrl(url = "") {
  const clean = String(url || "").trim().split("#")[0].split("?")[0];
  const file = clean.split("/").filter(Boolean).pop() || "";
  return file ? decodeURIComponent(file) : "Image";
}
function tableHtml(cols = 3, rows = 3, align = "left") {
  cols = Math.max(1, Math.min(12, Number(cols) || 3));
  rows = Math.max(1, Number(rows) || 3);
  const cls = align === "center" ? "table-center" : "table-left";
  const head = Array.from({ length: cols }, () => `<th contenteditable="true"><br></th>`).join("");
  const bodyRows = Array.from({ length: rows }, () => `<tr>${Array.from({ length: cols }, () => `<td contenteditable="true"><br></td>`).join("")}</tr>`).join("");
  return `<table data-align="${align}" class="${cls}"><thead><tr>${head}</tr></thead><tbody>${bodyRows}</tbody></table><p><br></p>`;
}

const blocks = [
  { id: "heading", command: "/heading", icon: "fa-heading", category: "Text", sidebar: true, name: "Heading", description: "Default H2 heading", html: "<h2><br></h2><p><br></p>" },
  { id: "h2", command: "/h2", icon: "fa-heading", category: "Text", sidebar: false, name: "Heading 2", description: "Large section heading", html: "<h2><br></h2><p><br></p>" },
  { id: "h3", command: "/h3", icon: "fa-heading", category: "Text", sidebar: false, name: "Heading 3", description: "Medium section heading", html: "<h3><br></h3><p><br></p>" },
  { id: "h4", command: "/h4", icon: "fa-heading", category: "Text", sidebar: false, name: "Heading 4", description: "Small section heading", html: "<h4><br></h4><p><br></p>" },
  { id: "h5", command: "/h5", icon: "fa-heading", category: "Text", sidebar: false, name: "Heading 5", description: "Compact heading", html: "<h5><br></h5><p><br></p>" },
  { id: "h6", command: "/h6", icon: "fa-heading", category: "Text", sidebar: false, name: "Heading 6", description: "Small heading", html: "<h6><br></h6><p><br></p>" },
  { id: "paragraph", command: "/paragraph", icon: "fa-align-left", category: "Text", sidebar: true, name: "Paragraph", description: "Simple text block", html: "<p><br></p>" },
  { id: "quote", command: "/quote", icon: "fa-quote-left", category: "Text", sidebar: true, name: "Blockquote", description: "Markdown quote block", html: "<blockquote><br></blockquote><p><br></p>" },
  { id: "ul", command: "/ul", icon: "fa-list-ul", category: "Text", sidebar: true, name: "Bullet list", description: "Unordered Markdown list", html: "<ul><li><br></li></ul><p><br></p>" },
  { id: "ol", command: "/ol", icon: "fa-list-ol", category: "Text", sidebar: true, name: "Numbered list", description: "Ordered Markdown list", html: "<ol><li><br></li></ol><p><br></p>" },
  { id: "link", command: "/link", icon: "fa-link", category: "Content", sidebar: true, name: "Link", description: "Clickable link opening in a new tab", html: "<p><a href=\"https://example.com\" target=\"_blank\" rel=\"noreferrer\">https://example.com</a></p>" },
  { id: "image", command: "/image", icon: "fa-image", category: "Content", sidebar: true, name: "Image", description: "Insert an image at the cursor", action: "image" },
  { id: "table", command: "/table", icon: "fa-table", category: "Content", sidebar: true, name: "Table", description: "Choose columns, body rows and alignment", action: "table" },
  { id: "separator", command: "/separator", icon: "fa-minus", category: "Content", sidebar: true, name: "Separator", description: "Horizontal divider", html: "<hr><p><br></p>" },
  { id: "button", command: "/button", icon: "fa-square-up-right", category: "Content", sidebar: true, name: "Button", description: "Bootstrap / Docsy style link", html: "<p><a class=\"btn btn-primary btn-lg\" href=\"/docs/\" target=\"_blank\" rel=\"noreferrer\">Read the documentation</a></p>" },
  { id: "buttondocsy", command: "/buttondocsy", icon: "fa-square-up-right", category: "Docsy", sidebar: true, name: "Docsy Button", description: "Insert a website styled Docsy button", html: "<p><a class=\"btn btn-primary\" href=\"/blog/\">Go back to Blog homepage</a></p>" },
  { id: "buttondocsygithub", command: "/buttondocsygithub", icon: "fa-brands fa-github", category: "Docsy", sidebar: true, name: "GitHub Button", description: "Fixed GitHub button; only set the link", action: "buttondocsygithub" },
  { id: "code", command: "/code", icon: "fa-code", category: "Code", sidebar: true, name: "Code", description: "Generic fenced code block", html: codeBlockHtml() },
  { id: "codedocsy", command: "/codedocsy", icon: "fa-file-code", category: "Docsy", sidebar: true, name: "Docsy Code", description: "Docsy card code shortcode", html: docsyCodeBlockHtml() },
  { id: "html", command: "/html", icon: "fa-brands fa-html5", category: "Code", sidebar: true, name: "HTML", description: "HTML code block", html: htmlBlockHtml() },
  { id: "htmldocsy", command: "/htmldocsy", icon: "fa-brands fa-html5", category: "Docsy", sidebar: true, name: "Docsy Raw HTML", description: "Insert raw HTML", html: rawHtmlDocsyBlockHtml() },
  { id: "drawio", command: "/drawio", icon: "fa-diagram-project", category: "Content", sidebar: true, name: "Draw.io diagram", description: "Paste a diagrams.net HTML embed with light/dark wrapper", action: "drawio" },
  { id: "youtube", command: "/youtube", icon: "fa-youtube", category: "Content", sidebar: true, name: "YouTube video", description: "Embed a YouTube video iframe", action: "youtube" },
  { id: "iframe", command: "/iframe", icon: "fa-window-maximize", category: "Content", sidebar: true, name: "Iframe", description: "Insert a standard iframe with your own URL", action: "iframe" },
  { id: "alert", command: "/alert", icon: "fa-bell", category: "Alerts", sidebar: true, name: "Alert", description: "Markdown alert", html: alertBlockHtml("markdown", "info") },
  { id: "info", command: "/info", icon: "fa-circle-info", category: "Alerts", sidebar: false, name: "Info", description: "Markdown info alert", html: alertBlockHtml("markdown", "info") },
  { id: "warning", command: "/warning", icon: "fa-triangle-exclamation", category: "Alerts", sidebar: true, name: "Warning", description: "Markdown warning alert", html: alertBlockHtml("markdown", "warning") },
  { id: "failure", command: "/failure", icon: "fa-circle-xmark", category: "Alerts", sidebar: false, name: "Failure", description: "Markdown failure alert", html: alertBlockHtml("markdown", "danger") },
  { id: "error", command: "/error", icon: "fa-circle-xmark", category: "Alerts", sidebar: false, name: "Error", description: "Markdown error alert", html: alertBlockHtml("markdown", "danger") },
  { id: "success", command: "/success", icon: "fa-circle-check", category: "Alerts", sidebar: true, name: "Success", description: "Markdown success alert", html: alertBlockHtml("markdown", "success") },
  { id: "alertdocsy", command: "/alertdocsy", icon: "fa-bell", category: "Docsy", sidebar: true, name: "Docsy Alert", description: "Docsy alert shortcode", html: alertBlockHtml("docsy", "info") },
  { id: "infodocsy", command: "/infodocsy", icon: "fa-circle-info", category: "Docsy", sidebar: false, name: "Docsy Info", description: "Docsy info alert shortcode", html: alertBlockHtml("docsy", "info") },
  { id: "warningdocsy", command: "/warningdocsy", icon: "fa-triangle-exclamation", category: "Docsy", sidebar: false, name: "Docsy Warning", description: "Docsy warning alert shortcode", html: alertBlockHtml("docsy", "warning") },
  { id: "failuredocsy", command: "/failuredocsy", icon: "fa-circle-xmark", category: "Docsy", sidebar: false, name: "Docsy Failure", description: "Docsy failure alert shortcode", html: alertBlockHtml("docsy", "danger") },
  { id: "errordocsy", command: "/errordocsy", icon: "fa-circle-xmark", category: "Docsy", sidebar: false, name: "Docsy Error", description: "Docsy error alert shortcode", html: alertBlockHtml("docsy", "danger") },
  { id: "successdocsy", command: "/successdocsy", icon: "fa-circle-check", category: "Docsy", sidebar: false, name: "Docsy Success", description: "Docsy success alert shortcode", html: alertBlockHtml("docsy", "success") },
  { id: "quiz", command: "/quiz", icon: "fa-circle-question", category: "Docsy", sidebar: true, name: "Docsy Quiz", description: "Interactive quiz shortcode with questions, answers and feedback", action: "quiz" },
  { id: "adsdocsy", command: "/ads", icon: "fa-rectangle-ad", category: "Docsy", sidebar: true, name: "Docsy Ads", description: "Insert ads shortcode", html: shortcodeCard("Docsy Ads", "{{< ads >}}") },
  { id: "articledocsy", command: "/article-footer", icon: "fa-shoe-prints", category: "Docsy", sidebar: true, name: "Docsy Article Footer", description: "Insert article footer shortcode", html: shortcodeCard("Docsy Article Footer", "{{< article-footer >}}") },
  { id: "pageinfo", command: "/pageinfo", icon: "fa-circle-info", category: "Docsy", sidebar: true, name: "Docsy Pageinfo", description: "Docsy page info block", html: shortcodeCard("Docsy Pageinfo", "{{% pageinfo color=\"primary\" %}}\nThis page contains extra context.\n{{% /pageinfo %}}") },
  { id: "tabpane", command: "/tabpane", icon: "fa-folder-tree", category: "Docsy", sidebar: true, name: "Docsy Tabpane", description: "Docsy tabs shortcode", html: shortcodeCard("Docsy Tabpane", "{{< tabpane text=true >}}\n  {{% tab header=\"Step 1\" %}}\n  Content for step 1.\n  {{% /tab %}}\n  {{% tab header=\"Step 2\" %}}\n  Content for step 2.\n  {{% /tab %}}\n{{< /tabpane >}}") },
  { id: "cover", command: "/cover", icon: "fa-window-maximize", category: "Docsy", sidebar: true, name: "Docsy Cover", description: "Landing page hero block", html: shortcodeCard("Docsy Cover", "{{< blocks/cover title=\"Welcome\" height=\"auto td-below-navbar\" color=\"primary\" >}}\nWrite your hero text here.\n{{< /blocks/cover >}}") },
  { id: "section", command: "/section", icon: "fa-layer-group", category: "Docsy", sidebar: true, name: "Docsy Section", description: "Docsy section container", html: shortcodeCard("Docsy Section", "{{< blocks/section color=\"light\" type=\"container\" >}}\n## Section title\n\nWrite your section content here.\n{{< /blocks/section >}}") }
];

const sidebarCategoryOrder = ["Text", "Content", "Code", "Alerts", "Docsy"];

function buildFrontMatter() {
  const m = state.metadata || {};
  const title = m.title || state.projectName || "New Markdown page";
  const slug = m.slug || slugify(title);
  const lines = ["---"];
  lines.push(`title: "${yamlEscape(title)}"`);
  lines.push(`slug: "${yamlEscape(slug)}"`);
  if (m.date) lines.push(`date: ${m.date}`);
  appendYamlList(lines, "tags", m.tags);
  appendYamlList(lines, "categories", m.categories);
  lines.push(`description: "${yamlEscape(m.description || "")}"`);
  lines.push(`hidden: ${m.hidden === "true" ? "true" : "false"}`);
  lines.push("---");
  return lines.join("\n");
}
function buildMarkdown() { return `${buildFrontMatter()}\n\n${htmlToMarkdown(els.visualEditor.innerHTML).trim()}\n`; }
function rememberRawFrontMatter(frontMatter) {
  state.rawFrontMatter = String(frontMatter || "").trim();
}
function splitMarkdownFrontMatter(text) {
  const value = String(text || "");
  const match = value.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { frontMatter: "", body: value };
  return { frontMatter: match[1], body: value.slice(match[0].length) };
}
function replaceMarkdownFrontMatter(markdown) {
  const { body } = splitMarkdownFrontMatter(markdown || "");
  const cleanBody = String(body || "").replace(/^\s+/, "");
  return `${buildFrontMatter()}\n\n${cleanBody}`;
}
function syncMarkdownEditorFrontMatter() {
  if (state.view !== "markdown" || els.markdownEditor.style.display !== "block") return;
  const start = els.markdownEditor.selectionStart || 0;
  const end = els.markdownEditor.selectionEnd || 0;
  els.markdownEditor.value = replaceMarkdownFrontMatter(els.markdownEditor.value);
  state.markdownCache = els.markdownEditor.value;
  const safeStart = Math.min(start, els.markdownEditor.value.length);
  const safeEnd = Math.min(end, els.markdownEditor.value.length);
  els.markdownEditor.setSelectionRange(safeStart, safeEnd);
}
function setMetadataTitleFromProjectName() {
  const previousTitle = state.metadata?.title || "";
  const previousSlug = state.metadata?.slug || "";
  const nextTitle = els.projectName.value.trim();
  if (!nextTitle) return;
  if (!state.metadata) state.metadata = {};
  const previousAutoSlug = slugify(previousTitle || state.projectName || "");
  const shouldUpdateSlug = !previousSlug || previousSlug === previousAutoSlug || previousSlug === slugify(previousTitle);
  state.projectName = nextTitle;
  state.metadata.title = nextTitle;
  if (shouldUpdateSlug) state.metadata.slug = slugify(nextTitle);
  if (els.fmTitle) els.fmTitle.value = state.metadata.title || "";
  if (els.fmSlug && shouldUpdateSlug) {
    els.fmSlug.value = state.metadata.slug || "";
    els.fmSlug.dataset.autogenerated = "true";
  }
  syncMarkdownEditorFrontMatter();
}
function parseYamlScalar(raw) {
  const value = String(raw || "").trim();
  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) return value.slice(1, -1);
  return value;
}
function parseYamlArray(raw) {
  const value = String(raw || "").trim();
  if (!value.startsWith("[") || !value.endsWith("]")) return splitList(value);
  return value.slice(1, -1).split(",").map(item => parseYamlScalar(item)).map(item => item.trim()).filter(Boolean);
}
function parseYamlListBlock(lines, startIndex, rawValue) {
  const raw = String(rawValue || "").trim();
  if (raw) return { value: coerceYamlList(raw).join(", "), nextIndex: startIndex };

  const items = [];
  let index = startIndex + 1;
  while (index < lines.length) {
    const itemMatch = lines[index].match(/^\s*-\s*(.*)$/);
    if (!itemMatch) break;
    items.push(parseYamlScalar(itemMatch[1]).trim());
    index += 1;
  }
  return { value: items.filter(Boolean).join(", "), nextIndex: Math.max(startIndex, index - 1) };
}
function applyParsedFrontMatter(frontMatter) {
  if (!frontMatter) return;
  const nextMetadata = { ...state.metadata };
  const lines = String(frontMatter || "").split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    const normalizedKey = key.toLowerCase();
    if (normalizedKey === "title") nextMetadata.title = parseYamlScalar(rawValue);
    if (normalizedKey === "slug") nextMetadata.slug = parseYamlScalar(rawValue);
    if (normalizedKey === "date") nextMetadata.date = parseYamlScalar(rawValue);
    if (normalizedKey === "tags" || normalizedKey === "categories") {
      const parsed = parseYamlListBlock(lines, index, rawValue);
      nextMetadata[normalizedKey] = parsed.value;
      index = parsed.nextIndex;
    }
    if (normalizedKey === "description") nextMetadata.description = parseYamlScalar(rawValue);
    if (normalizedKey === "hidden") nextMetadata.hidden = parseYamlScalar(rawValue) === "true" ? "true" : "false";
  }
  state.metadata = nextMetadata;
  if (nextMetadata.title) {
    state.projectName = nextMetadata.title;
    if (els.projectName) els.projectName.value = nextMetadata.title;
  }
}
function importMarkdownFile(file) {
  if (!file) return;
  file.text().then(text => {
    const match = String(text || "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (match) {
      rememberRawFrontMatter(match[1]);
      applyParsedFrontMatter(match[1]);
    } else {
      rememberRawFrontMatter("");
    }
    const body = match ? text.slice(match[0].length) : text;
    if (!state.metadata?.title) {
      state.projectName = (file.name || "markdown-page").replace(/\.(md|markdown)$/i, "") || "markdown-page";
    }
    els.projectName.value = state.projectName;
    els.visualEditor.innerHTML = markdownToHtml(body);
    normalizeEditorContent();
    updateEditorPlaceholder();
    fillPostInfoForm();
    setView("editor");
    saveProject();
    showToast(`Imported ${file.name}`);
  }).catch(error => {
    console.error(error);
    showToast("Could not import that Markdown file");
  });
}
function scheduleNormalizeEditorContent(scope = null) {
  const target = scope || getActiveTextBlock() || getCurrentTable() || els.visualEditor;
  if (normalizeTimer) window.clearTimeout(normalizeTimer);
  normalizeTimer = window.setTimeout(() => {
    normalizeTimer = 0;
    normalizeEditorContent(target === els.visualEditor ? els.visualEditor : target.closest?.(".editable-card, figure.image-block, table, p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol") || target);
  }, 80);
}
function selectionInsideEditor() {
  const selection = window.getSelection();
  return !!(selection.rangeCount && els.visualEditor.contains(selection.getRangeAt(0).commonAncestorContainer));
}
function getActiveTextBlock() {
  const range = getCurrentEditorRange();
  if (!range) return null;
  let node = range.commonAncestorContainer;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  return node?.closest?.("p, h1, h2, h3, h4, h5, h6") || null;
}
function getBlockAnchorFromNode(node) {
  if (!node) return null;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  const anchor = node?.closest?.("p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol, table, figure.image-block, .editable-card, hr");
  return anchor && els.visualEditor.contains(anchor) ? anchor : null;
}
function getBlockAnchorFromRange(range) {
  return range ? getBlockAnchorFromNode(range.commonAncestorContainer) : null;
}
function syncHeadingSelect() {
  const block = getActiveTextBlock();
  if (!block || !els.visualEditor.contains(block)) {
    els.headingSelect.value = "";
    return;
  }
  const tag = block.tagName.toLowerCase();
  els.headingSelect.value = /^h[1-6]$/.test(tag) ? tag : "";
}
function replaceBlockTag(block, tagName) {
  if (!block || !tagName) return null;
  const replacement = document.createElement(tagName);
  replacement.innerHTML = block.innerHTML;
  block.replaceWith(replacement);
  return replacement;
}
function htmlToMarkdown(html) {
  const root = document.createElement("div");
  root.innerHTML = html;
  return nodesToMarkdown(root.childNodes).replace(/\n{3,}/g, "\n\n");
}
function nodesToMarkdown(nodes) { return Array.from(nodes).map(nodeToMarkdown).join("").replace(/\n{3,}/g, "\n\n"); }
function alertContentToMarkdown(alertBlock) {
  const content = alertBlock.querySelector(".alert-content");
  if (!content) return "";
  return nodesToMarkdown(content.childNodes).replace(/\n{3,}/g, "\n\n").trim();
}
function nodeToMarkdown(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\u00a0/g, " ");
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  if (node.matches(".quiz-card")) return `

${buildQuizShortcode(getQuizDataFromCard(node))}

`;
  if (node.matches(".shortcode-card")) return `

${node.querySelector("textarea")?.value.trim() || ""}

`;
  if (node.matches(".raw-html-card")) {
    const rawValue = node.querySelector("textarea")?.value.trim() || "";
    const value = node.dataset.drawio === "true" || isDrawioHtml(rawValue) ? cleanDrawioEmbed(rawValue) : rawValue;
    return `

${value}

`;
  }
  if (node.matches(".markdown-alert-block")) {
    const color = node.dataset.color || "info";
    const alert = ALERTS.find(([v]) => v === color) || ALERTS[0];
    const txt = alertContentToMarkdown(node);
    const quoted = txt ? txt.split(/\r?\n/).map(line => line ? `> ${line}` : ">").join("\n") : ">";
    return `\n\n> [!${alert[2]}]\n${quoted}\n\n`;
  }
  if (node.matches(".docsy-alert-block")) {
    const color = node.dataset.color || "info";
    const title = getAlertBlockTitle(node);
    const txt = alertContentToMarkdown(node);
    return `

{{% alert title="${escapeShortcodeAttribute(title)}" color="${escapeShortcodeAttribute(color)}" %}}
${txt}
{{% /alert %}}

`;
  }
  if (node.matches(".docsy-code-block")) {
    const lang = node.dataset.language || "bash";
    const title = languageTitle(lang);
    const code = node.querySelector("pre")?.textContent || "";
    return `\n\n{{< card code=true header="**${title}**" lang="${lang}" >}}\n${code.replace(/\n$/, "")}\n{{< /card >}}\n\n`;
  }
  if (node.matches(".code-block")) {
    const lang = node.dataset.language || "text";
    const code = node.querySelector("pre")?.textContent || "";
    return `\n\n\`\`\`${lang === "text" ? "" : lang}\n${code.replace(/\n$/, "")}\n\`\`\`\n\n`;
  }
  const tag = node.tagName.toLowerCase();
  const content = nodesToMarkdown(node.childNodes).trim();
  switch (tag) {
    case "h1": return `\n# ${content}\n\n`;
    case "h2": return `\n## ${content}\n\n`;
    case "h3": return `\n### ${content}\n\n`;
    case "h4": return `\n#### ${content}\n\n`;
    case "h5": return `\n##### ${content}\n\n`;
    case "h6": return `\n###### ${content}\n\n`;
    case "p": return content ? `\n${content}\n\n` : "\n";
    case "strong": case "b": return `**${content}**`;
    case "em": case "i": return `_${content}_`;
    case "input": return node.type === "checkbox" ? (node.checked ? "[x] " : "[ ] ") : "";
    case "button": return "";
    case "a": {
      const href = node.getAttribute("href") || "";
      const classes = (node.getAttribute("class") || "").trim();
      if (classes.includes("btn")) {
        const target = node.getAttribute("target");
        const rel = node.getAttribute("rel");
        const attrs = [`class="${escapeHtml(classes)}"`, `href="${escapeHtml(href)}"`];
        if (target) attrs.push(`target="${escapeHtml(target)}"`);
        if (rel) attrs.push(`rel="${escapeHtml(rel)}"`);
        return `<a ${attrs.join(" ")}>${content || href}</a>`;
      }
      return `[${content || href}](${href})`;
    }
    case "img": return `\n![${node.getAttribute("alt") || ""}](${node.getAttribute("src") || ""})\n\n`;
    case "figure": return figureToMarkdown(node);
    case "br": return "\n";
    case "hr": return "\n---\n\n";
    case "pre": return preToMarkdown(node);
    case "code": return node.textContent;
    case "blockquote": return `\n${node.textContent.split("\n").map(line => `> ${line}`).join("\n")}\n\n`;
    case "ul": return listToMarkdown(node, false);
    case "ol": return listToMarkdown(node, true);
    case "table": return tableToMarkdown(node);
    case "div": return content ? `\n${content}\n\n` : "";
    default: return content;
  }
}
function figureToMarkdown(node) {
  const img = node.querySelector("img");
  const caption = node.querySelector("figcaption")?.textContent.trim();
  if (!img) return nodesToMarkdown(node.childNodes);
  const src = img.getAttribute("src") || "";
  const href = node.getAttribute("data-link") || node.querySelector("a.image-link")?.getAttribute("href") || src;
  const alt = img.getAttribute("alt") || "";
  const line = `[![${alt}](${src})](${href || src})`;
  return caption && caption !== "Optional caption" ? `
${line}

_${caption}_

` : `
${line}

`;
}
function preToMarkdown(node) {
  const code = node.querySelector("code")?.textContent || node.textContent || "";
  return `\n\n\`\`\`\n${code.replace(/\n$/, "")}\n\`\`\`\n\n`;
}
function listToMarkdown(node, ordered, level = 0) {
  const checklist = node.dataset.checklist === "true";
  const items = Array.from(node.children).filter(child => child.tagName.toLowerCase() === "li");
  const indent = "\t".repeat(level);
  const lines = [];

  items.forEach((item, index) => {
    const parts = [];
    Array.from(item.childNodes).forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE && ["ul", "ol"].includes(child.tagName.toLowerCase())) return;
      if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === "input") return;
      const part = nodesToMarkdown([child]).trim();
      if (part) parts.push(part);
    });
    const content = parts.join(" ").replace(/\s+/g, " ").trim() || " ";
    lines.push(`${indent}${ordered ? index + 1 + "." : "-"} ${checklist ? (item.querySelector(":scope > input")?.checked ? "[x] " : "[ ] ") : ""}${content}`.trimEnd());

    Array.from(item.children).forEach(child => {
      const tag = child.tagName.toLowerCase();
      if (tag === "ul") lines.push(listToMarkdown(child, false, level + 1).trimEnd());
      if (tag === "ol") lines.push(listToMarkdown(child, true, level + 1).trimEnd());
    });
  });

  return `\n${lines.filter(Boolean).join("\n")}\n\n`;
}
function tableToMarkdown(table) {
  const rows = Array.from(table.querySelectorAll("tr"));
  if (!rows.length) return "";
  const data = rows.map(row => Array.from(row.children).map(cell => {
    const clone = cell.cloneNode(true);
    clone.querySelectorAll(".table-drag-handle").forEach(handle => handle.remove());
    return clone.textContent.trim().replace(/\|/g, "\\|");
  }));
  const maxCols = Math.max(...data.map(row => row.length));
  const normalized = data.map(row => [...row, ...Array(Math.max(0, maxCols - row.length)).fill("")]);
  const align = table.getAttribute("data-align") || "left";
  const separator = Array(maxCols).fill(align === "center" ? ":---:" : "---");
  const toRow = row => `| ${row.join(" | ")} |`;
  return `\n${[toRow(normalized[0]), toRow(separator), ...normalized.slice(1).map(toRow)].join("\n")}\n\n`;
}

function isHtmlBlockLine(line) {
  const trimmed = line.trim();
  return /^<!--[\s\S]*-->$/.test(trimmed) || /^<([a-z][\w:-]*)(?:\s[^>]*)?>/i.test(trimmed) || /^<\/[a-z][\w:-]*>$/i.test(trimmed);
}
function htmlBlockToCard(lines) {
  return htmlBlockToInteractiveBlock(lines.join("\n").trim());
}
function markdownQuoteToHtml(lines, startIndex) {
  const quoteLines = [];
  let index = startIndex;
  while (index < lines.length) {
    const rawLine = lines[index];
    if (!/^>\s?/.test(rawLine.trim())) break;
    quoteLines.push(rawLine);
    index += 1;
  }
  const firstLine = quoteLines[0]?.trim() || "";
  const alertMatch = firstLine.match(/^>\s*\[!(NOTE|TIP|WARNING|CAUTION)\]\s*$/i);
  if (alertMatch) {
    const keyword = alertMatch[1].toUpperCase();
    const colorMap = { NOTE: "info", TIP: "success", WARNING: "warning", CAUTION: "danger" };
    const color = colorMap[keyword] || "info";
    const body = quoteLines
      .slice(1)
      .map(line => line.replace(/^>\s?/, ""))
      .join("\n")
      .trim();
    return { html: alertBlockHtml("markdown", color, body), nextIndex: Math.max(startIndex, index - 1) };
  }

  const body = quoteLines.map(line => line.replace(/^>\s?/, "")).join("\n").trim();
  return {
    html: `<blockquote>${body.split("\n").map(line => line ? inlineMarkdown(line) : '<br>').join('<br>')}</blockquote><p><br></p>`,
    nextIndex: Math.max(startIndex, index - 1)
  };
}
function getListLineInfo(rawLine = "") {
  const raw = String(rawLine || "");
  if (!raw.trim()) return null;

  // Accept normal items like "- text" / "1. text", but also empty items like "-" or "1.".
  // This is needed because htmlToMarkdown() exports an empty <li> as "-", and line.trim()
  // removes the trailing space from "- ".
  const match = raw.match(/^(\s*)(?:([-*+])(?:\s+(.*))?|(\d+)\.(?:\s+(.*))?)$/);
  if (!match) return null;

  const indentToken = match[1] || "";
  const indentSpaces = Array.from(indentToken).reduce((total, char) => total + (char === "	" ? 2 : 1), 0);
  const level = Math.min(2, Math.floor(indentSpaces / 2));
  const ordered = Boolean(match[4]);
  const body = ordered ? (match[5] || "") : (match[3] || "");

  return { level, ordered, body };
}

function isMarkdownListLine(rawLine = "") {
  return getListLineInfo(rawLine) !== null;
}

function buildListHtml(lines, startIndex) {
  const first = getListLineInfo(lines[startIndex]);
  if (!first) return { html: "", nextIndex: startIndex };

  let index = startIndex;
  const root = document.createElement(first.ordered ? "ol" : "ul");
  const stack = [{ list: root, level: first.level, ordered: first.ordered }];
  let currentLi = null;

  while (index < lines.length) {
    const rawLine = lines[index] || "";
    if (!String(rawLine).trim()) {
      const nextInfo = getListLineInfo(lines[index + 1] || "");
      if (!nextInfo) break;
      index += 1;
      continue;
    }

    const info = getListLineInfo(rawLine);
    if (!info || info.level < first.level) break;

    while (stack.length > 1 && info.level < stack[stack.length - 1].level) stack.pop();

    if (info.level > stack[stack.length - 1].level) {
      if (!currentLi || info.level > 2) break;
      const nested = document.createElement(info.ordered ? "ol" : "ul");
      currentLi.appendChild(nested);
      stack.push({ list: nested, level: info.level, ordered: info.ordered });
    } else if (info.ordered !== stack[stack.length - 1].ordered) {
      const parentLi = stack[stack.length - 1].list.lastElementChild;
      if (!parentLi) break;
      const nested = document.createElement(info.ordered ? "ol" : "ul");
      parentLi.appendChild(nested);
      stack.push({ list: nested, level: info.level, ordered: info.ordered });
    }

    const li = document.createElement("li");
    const taskMatch = info.body.match(/^\[( |x|X)\]\s+(.*)$/);
    if (taskMatch) {
      stack[stack.length - 1].list.dataset.checklist = "true";
      li.innerHTML = `<input type="checkbox" ${/[xX]/.test(taskMatch[1]) ? "checked" : ""}> ${inlineMarkdown(taskMatch[2])}`;
    } else {
      li.innerHTML = info.body ? inlineMarkdown(info.body) : "<br>";
    }
    stack[stack.length - 1].list.appendChild(li);
    currentLi = li;
    index += 1;
  }

  return { html: `${root.outerHTML}<p><br></p>`, nextIndex: Math.max(startIndex, index - 1) };
}

function markdownToHtml(markdown) {
  let text = String(markdown || "").replace(/^---\n[\s\S]*?\n---\n?/, "");
  const tokens = [];
  text = text.replace(/```([^\n`]*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const token = `__TOKEN_${tokens.length}__`;
    tokens.push(codeBlockHtml((lang || "text").trim(), code.trim()));
    return token;
  });
  text = text.replace(/{{<\s*card\s+code=true[^>]*lang="([^"]+)"[^>]*>}}([\s\S]*?){{<\s*\/card\s*>}}/g, (_, lang, code) => {
    const token = `__TOKEN_${tokens.length}__`;
    tokens.push(docsyCodeBlockHtml((lang || "bash").trim(), code.trim()));
    return token;
  });
  text = text.replace(/{{%\s*alert([^%]*)%}}([\s\S]*?){{%\s*\/alert\s*%}}/g, (_, attrs, body) => {
    const color = getShortcodeAttribute(attrs, "color") || "info";
    const title = getShortcodeAttribute(attrs, "title") || getDefaultDocsyAlertTitle(color);
    const token = `__TOKEN_${tokens.length}__`;
    tokens.push(alertBlockHtml("docsy", color, body.trim(), title));
    return token;
  });
  text = text.replace(/{{<\s*quiz\s*>}}([\s\S]*?){{<\s*\/quiz\s*>}}/g, (_, body) => {
    const token = `__TOKEN_${tokens.length}__`;
    tokens.push(quizBlockHtml(parseQuizJson(body.trim())));
    return token;
  });
  text = text.replace(/{{<\s*ads\s*>}}/g, match => {
    const token = `__TOKEN_${tokens.length}__`;
    tokens.push(shortcodeCard("Docsy Ads", match.trim()));
    return token;
  });
  text = text.replace(/{{<\s*article-footer\s*>}}/g, match => {
    const token = `__TOKEN_${tokens.length}__`;
    tokens.push(shortcodeCard("Docsy Article Footer", match.trim()));
    return token;
  });
  text = text.replace(/{{[%<][\s\S]*?[%>]}}(?:[\s\S]*?{{[%<]\s*\/[\s\S]*?[%>]}})?/g, match => {
    const token = `__TOKEN_${tokens.length}__`;
    tokens.push(shortcodeCard("Docsy Shortcode", match.trim()));
    return token;
  });
  const lines = text.split("\n");
  const html = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    if (/^__TOKEN_\d+__$/.test(line.trim())) { html.push(line.trim()); continue; }
    if (/^#{1,6}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      html.push(`<h${level}>${inlineMarkdown(line.replace(/^#{1,6}\s/, ""))}</h${level}>`);
      continue;
    }
    if (/^---+$/.test(line.trim())) { html.push("<hr><p><br></p>"); continue; }
    if (/^\[!\[[^\]]*\]\([^)]+\)\]\([^)]+\)/.test(line.trim())) {
      const match = line.trim().match(/^\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/);
      html.push(imageHtml(match[2], match[1], "Optional caption", match[3] || match[2]));
      continue;
    }
    if (/^!\[[^\]]*\]\([^)]+\)/.test(line.trim())) {
      const match = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      html.push(imageHtml(match[2], match[1], "Optional caption", match[2]));
      continue;
    }
    if (/^>\s?/.test(line.trim())) {
      const quoteResult = markdownQuoteToHtml(lines, index);
      html.push(quoteResult.html);
      index = quoteResult.nextIndex;
      continue;
    }
    if (isMarkdownListLine(line)) {
      const listResult = buildListHtml(lines, index);
      html.push(listResult.html);
      index = listResult.nextIndex;
      continue;
    }
    if (isHtmlBlockLine(line)) {
      const htmlLines = [line];
      while (index + 1 < lines.length && lines[index + 1].trim() && isHtmlBlockLine(lines[index + 1])) {
        index += 1;
        htmlLines.push(lines[index]);
      }
      html.push(htmlBlockToCard(htmlLines));
      continue;
    }
    if (/^\|.*\|$/.test(line.trim())) {
      const tableLines = [];
      while (index < lines.length && /^\|.*\|$/.test(lines[index].trim())) { tableLines.push(lines[index]); index++; }
      index--;
      html.push(markdownTableToHtml(tableLines));
      continue;
    }
    if (line.trim()) html.push(`<p>${inlineMarkdown(line)}</p>`);
  }
  return html.join("\n").replace(/__TOKEN_(\d+)__/g, (_, number) => tokens[Number(number)] || "");
}
function inlineMarkdown(value) {
  const normalizedValue = String(value || "")
    .replace(/\\([<>])/g, "$1")
    .replace(/\\\[([^\]]+)\\\]\(([^)]+)\)/g, "[$1]($2)");

  return escapeHtml(normalizedValue)
    .replace(/&lt;a\s+([^&]*)&gt;([\s\S]*?)&lt;\/a&gt;/gi, (_, attrs, body) => {
      const hrefMatch = attrs.match(/href="([^"]+)"/i);
      const classMatch = attrs.match(/class="([^"]+)"/i);
      const targetMatch = attrs.match(/target="([^"]+)"/i);
      const relMatch = attrs.match(/rel="([^"]+)"/i);
      const attrsOut = [];
      if (classMatch) attrsOut.push(`class="${classMatch[1]}"`);
      if (hrefMatch) attrsOut.push(`href="${hrefMatch[1]}"`);
      attrsOut.push(`target="${targetMatch ? targetMatch[1] : "_blank"}"`);
      attrsOut.push(`rel="${relMatch ? relMatch[1] : "noreferrer"}"`);
      return `<a ${attrsOut.join(" ")}>${body}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    .replace(/&lt;(https?:\/\/[^\s<>]+)&gt;/gi, '<a href="$1" target="_blank" rel="noreferrer">$1</a>');
}
function markdownTableToHtml(lines) {
  const rows = lines.map(row => row.split("|").slice(1, -1).map(cell => cell.trim()));
  const hasSeparator = rows[1] && rows[1].every(cell => /^:?-{3,}:?$/.test(cell));
  const align = hasSeparator && rows[1].some(cell => /^:-{3,}:$/.test(cell)) ? "center" : "left";
  const head = rows[0] || [];
  const body = hasSeparator ? rows.slice(2) : rows.slice(1);
  return `<table data-align="${align}" class="table-${align}"><thead><tr>${head.map(cell => `<th contenteditable="true">${inlineMarkdown(cell)}</th>`).join("")}</tr></thead><tbody>${body.map(row => `<tr>${row.map(cell => `<td contenteditable="true">${inlineMarkdown(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table><p><br></p>`;
}

function saveProject() {
  updateEditorPlaceholder();
  if (document.activeElement === els.projectName) setMetadataTitleFromProjectName();
  syncMarkdownEditorFrontMatter();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    state.projectName = els.projectName.value.trim() || "markdown-page";
    state.html = els.visualEditor.innerHTML;
    if (state.view === "markdown") state.markdownCache = els.markdownEditor.value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    els.saveStatus.textContent = "Saved at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, 120);
}
function loadProject() {
  const saved = localStorage.getItem(STORAGE_KEY) || PREVIOUS_STORAGE_KEYS.map(key => localStorage.getItem(key)).find(Boolean);
  if (!saved) {
    state.html = "";
    return;
  }
  try {
    Object.assign(state, JSON.parse(saved));
    if (!state.metadata) state.metadata = {};
    if (isOldStarterContent(state.html)) state.html = "";
  } catch (error) { console.warn(error); }
}
function renderGallery() {
  const visibleBlocks = blocks.filter(block => block.sidebar !== false);
  els.blockGallery.innerHTML = sidebarCategoryOrder.map(category => {
    const categoryBlocks = visibleBlocks.filter(block => block.category === category);
    if (!categoryBlocks.length) return "";
    return `<section class="gallery-category"><h3>${escapeHtml(category)}</h3>${categoryBlocks.map(block => `
      <button class="block-chip" type="button" draggable="true" data-block="${block.id}">
        <i class="${iconClass(block)}"></i>
        <span><strong>${escapeHtml(block.name)}</strong><span>${escapeHtml(block.description)}</span></span>
        <small class="command-pill">${block.command}</small>
      </button>`).join("")}</section>`;
  }).join("");
  els.blockGallery.addEventListener("pointerdown", event => {
    if (event.target.closest(".block-chip")) saveSelection();
  }, { once: true });
  els.blockGallery.querySelectorAll(".block-chip").forEach(button => {
    button.addEventListener("pointerdown", () => saveSelection());
    button.addEventListener("click", () => insertBlock(button.dataset.block, { fromSidebar: true }));
    button.addEventListener("dragstart", event => {
      event.dataTransfer.setData("text/plain", button.dataset.block);
      button.classList.add("dragging");
    });
    button.addEventListener("dragend", () => button.classList.remove("dragging"));
  });
}
function render() {
  if (state.metadata?.title) state.projectName = state.metadata.title;
  els.projectName.value = state.projectName || "markdown-page";
  els.visualEditor.innerHTML = state.html || "";
  normalizeEditorContent();
  updateEditorPlaceholder();
  fillPostInfoForm();
  renderGallery();
  updateTableToolbarVisibility();
  updateBlobSettingsButton();
  setView("editor");
  saveProject();
}

function createEndRange() {
  const range = document.createRange();
  if (!els.visualEditor.lastChild) els.visualEditor.innerHTML = "<p><br></p>";
  range.selectNodeContents(els.visualEditor);
  range.collapse(false);
  return range;
}
function saveSelection() {
  const selection = window.getSelection();
  if (selection.rangeCount && els.visualEditor.contains(selection.getRangeAt(0).commonAncestorContainer)) {
    savedRange = selection.getRangeAt(0).cloneRange();
    lastSelectionSavedAt = Date.now();
  }
  syncHeadingSelect();
}
function getCurrentEditorRange() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  return els.visualEditor.contains(range.commonAncestorContainer) ? range.cloneRange() : null;
}
function hasFreshSavedRange(maxAge = 60000) {
  return savedRange && els.visualEditor.contains(savedRange.commonAncestorContainer) && Date.now() - lastSelectionSavedAt < maxAge;
}
function getFreshSavedRange(maxAge = 15000) {
  return hasFreshSavedRange(maxAge) ? savedRange.cloneRange() : null;
}
function getPanelInsertionRange(options = {}) {
  const currentRange = getCurrentEditorRange();
  if (currentRange) return currentRange;
  if (options.allowOldSelection !== false) return getFreshSavedRange(15000);
  return null;
}
function restoreSelection(options = {}) {
  els.visualEditor.focus({ preventScroll: true });
  const selection = window.getSelection();
  const currentRange = getCurrentEditorRange();
  const allowOldSelection = options.allowOldSelection !== false;
  const range = currentRange || (allowOldSelection && hasFreshSavedRange() ? savedRange : createEndRange());
  selection.removeAllRanges();
  selection.addRange(range);
}
function placeCursorAfter(node) {
  if (!node) return;
  const range = document.createRange();
  const selection = window.getSelection();
  range.setStartAfter(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  savedRange = range.cloneRange();
  lastSelectionSavedAt = Date.now();
}
function placeCursorAtStart(node) {
  if (!node) return;
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(node);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  savedRange = range.cloneRange();
  lastSelectionSavedAt = Date.now();
}
function focusFirstEditableIn(nodes) {
  const firstElement = nodes.find(node => node.nodeType === Node.ELEMENT_NODE);
  const target = firstElement?.matches?.('p, h1, h2, h3, h4, h5, h6, blockquote, li, figcaption, .alert-content, pre, td, th')
    ? firstElement
    : firstElement?.querySelector?.('p, h1, h2, h3, h4, h5, h6, blockquote, li, figcaption, .alert-content, pre, td, th');
  if (!target) return false;
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(target);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  savedRange = range.cloneRange();
  lastSelectionSavedAt = Date.now();
  return true;
}
function isEffectivelyEmptyTextBlock(block) {
  if (!block || !block.matches?.("p, h1, h2, h3, h4, h5, h6, blockquote")) return false;
  const clone = block.cloneNode(true);
  clone.querySelectorAll(".slash-insert-marker, br").forEach(node => node.remove());
  return !clone.textContent.trim() && !clone.querySelector("img, a, table, figure, .editable-card, pre, code, input, select, button");
}
function insertFragmentAtMarker(fragment, marker) {
  if (!marker || !marker.isConnected || !els.visualEditor.contains(marker)) return false;
  const host = getBlockAnchorFromNode(marker);
  if (host && host !== els.visualEditor) {
    host.after(fragment);
    marker.remove();
    if (isEffectivelyEmptyTextBlock(host)) host.remove();
    return true;
  }
  marker.replaceWith(fragment);
  return true;
}
function insertHtmlAtCursor(html, options = {}) {
  const fragment = document.createRange().createContextualFragment(html);
  const insertedNodes = Array.from(fragment.childNodes);
  const lastNode = insertedNodes[insertedNodes.length - 1];
  const preferredMarker = options.marker && options.marker.isConnected ? options.marker : null;
  const preferredAnchor = options.anchorBlock && options.anchorBlock.isConnected ? options.anchorBlock : null;
  if (preferredMarker && insertFragmentAtMarker(fragment, preferredMarker)) {
    // Inserted at the exact slash-command marker.
  } else if (preferredAnchor) {
    preferredAnchor.after(fragment);
  } else {
    restoreSelection(options);
    const selection = window.getSelection();
    const range = selection.rangeCount && els.visualEditor.contains(selection.getRangeAt(0).commonAncestorContainer) ? selection.getRangeAt(0) : createEndRange();
    const blockAnchor = getBlockAnchorFromRange(range);
    if (blockAnchor) blockAnchor.after(fragment);
    else {
      range.deleteContents();
      range.insertNode(fragment);
    }
  }
  normalizeEditorContent();
  if (!focusFirstEditableIn(insertedNodes)) placeCursorAfter(lastNode || els.visualEditor.lastChild);
  saveProject();
}
function insertBlock(blockId, options = {}) {
  const block = blocks.find(item => item.id === blockId);
  if (!block) return;
  const useOldSelection = !options.fromSidebar || (Date.now() - lastSelectionSavedAt < 15000);
  const insertionOptions = {
    allowOldSelection: useOldSelection,
    anchorBlock: options.anchorBlock && options.anchorBlock.isConnected ? options.anchorBlock : null,
    marker: options.marker && options.marker.isConnected ? options.marker : null
  };
  if (block.action === "image") { openImagePanel(insertionOptions); return; }
  if (block.action === "table") { openTablePanel(insertionOptions); return; }
  if (block.action === "buttondocsy") { openButtonPanel(insertionOptions); return; }
  if (block.action === "buttondocsygithub") { openGitHubButtonPanel(insertionOptions); return; }
  if (block.action === "drawio") { openDrawioPanel(insertionOptions); return; }
  if (block.action === "youtube") { openYoutubePanel(insertionOptions); return; }
  if (block.action === "iframe") { openIframePanel(insertionOptions); return; }
  if (block.action === "quiz") { openQuizPanel(insertionOptions); return; }
  insertHtmlAtCursor(block.html, insertionOptions);
  showToast(`${block.name} inserted`);
}


function getManagedBlockHost(node) {
  if (!node) return null;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  if (!node || !node.closest) return null;
  const direct = node.closest('.editable-card, figure.image-block, table');
  if (direct && els.visualEditor.contains(direct)) return direct;
  const buttonParagraph = node.closest('p');
  if (buttonParagraph && els.visualEditor.contains(buttonParagraph) && buttonParagraph.querySelector(':scope > a.btn')) return buttonParagraph;
  return null;
}
function getManagedBlocks(root = els.visualEditor) {
  const blocks = [];
  const pushUnique = item => {
    if (item && item !== els.visualEditor && !blocks.includes(item)) blocks.push(item);
  };
  if (root.matches?.('.editable-card, figure.image-block, table')) pushUnique(root);
  if (root.matches?.('p') && root.querySelector?.(':scope > a.btn')) pushUnique(root);
  root.querySelectorAll?.('.editable-card, figure.image-block, table').forEach(pushUnique);
  root.querySelectorAll?.('p').forEach(p => {
    if (p.querySelector(':scope > a.btn')) pushUnique(p);
  });
  return blocks;
}
function isTableHost(block) {
  return !!block?.matches?.('table');
}
function isImageHost(block) {
  return !!block?.matches?.('figure.image-block');
}
function isButtonHost(block) {
  return !!block?.matches?.('p') && !!block.querySelector?.(':scope > a.btn');
}

function getDeletableBlockFromNode(node) {
  if (!node) return null;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  if (!node || !node.closest) return null;
  const direct = node.closest(".editable-card, figure.image-block, table, hr, blockquote, pre, h1, h2, h3, h4, h5, h6, p, ul, ol");
  return direct && els.visualEditor.contains(direct) ? direct : null;
}
function deleteCurrentBlock() {
  const selection = window.getSelection();
  let target = null;
  if (selection.rangeCount) target = getDeletableBlockFromNode(selection.getRangeAt(0).commonAncestorContainer);
  if (!target && savedRange) target = getDeletableBlockFromNode(savedRange.commonAncestorContainer);
  if (!target) { showToast("Click inside a block first"); return; }
  const next = target.nextSibling || target.previousSibling;
  target.remove();
  if (!els.visualEditor.innerHTML.trim()) els.visualEditor.innerHTML = "";
  if (next && els.visualEditor.contains(next)) placeCursorAfter(next);
  saveProject();
  showToast("Block removed");
}
function addInlineBlockControls(scope = els.visualEditor) {
  const root = getScopeRoot(scope);
  if (!root || !root.querySelectorAll) return;
  const blocksWithControls = getManagedBlocks(root);
  blocksWithControls.forEach(block => {
    let controls = null;
    try {
      controls = block.querySelector(":scope > .block-inline-controls");
    } catch (error) {
      controls = Array.from(block.children).find(child => child.classList?.contains("block-inline-controls")) || null;
    }
    if (!controls) {
      controls = document.createElement("div");
      controls.className = "block-inline-controls";
      controls.contentEditable = "false";
      controls.innerHTML = `
        <button type="button" class="block-edit-button" title="Edit block" aria-label="Edit block"><i class="fa-solid fa-pen"></i></button>
        <button type="button" class="block-remove-button" title="Remove block" aria-label="Remove block"><i class="fa-solid fa-xmark"></i></button>
      `;
      block.insertBefore(controls, block.firstChild);
    }
  });
  root.querySelectorAll(".block-inline-controls").forEach(controls => {
    const host = controls.parentElement;
    if (!getManagedBlockHost(host)) controls.remove();
  });
}

function setView(view) {
  state.view = view;
  els.editorBtn.classList.toggle("active", view === "editor");
  els.codeBtn.classList.toggle("active", view === "markdown");
  if (view === "editor") {
    const markdownValue = els.markdownEditor.value.trim();
    if (markdownValue && els.markdownEditor.style.display === "block") {
      const { frontMatter, body } = splitMarkdownFrontMatter(markdownValue);
      rememberRawFrontMatter(frontMatter);
      applyParsedFrontMatter(frontMatter);
      els.visualEditor.innerHTML = markdownToHtml(body);
    }
    els.visualEditor.style.display = "block";
    els.editorToolbar.style.display = "flex";
    els.markdownEditor.style.display = "none";
    normalizeEditorContent();
  } else {
    state.markdownCache = buildMarkdown();
    els.markdownEditor.value = state.markdownCache;
    els.visualEditor.style.display = "none";
    els.editorToolbar.style.display = "none";
    els.markdownEditor.style.display = "block";
  }
  saveProject();
}
function execFormat(format) {
  restoreSelection();
  if (format === "bold") document.execCommand("bold");
  if (format === "italic") document.execCommand("italic");
  if (format === "link") {
    const url = window.prompt("Paste the link URL");
    if (url && !createLinkAtSelection(url)) {
      document.execCommand("createLink", false, url);
      normalizeEditorContent();
      saveProject();
    }
  }
  if (format === "image") openImagePanel();
  if (format === "table") openTablePanel();
  if (format === "code") insertBlock("code");
  if (format === "codedocsy") insertBlock("codedocsy");
  if (format === "buttondocsy") insertBlock("buttondocsy");
  if (format === "buttondocsygithub") insertBlock("buttondocsygithub");
  if (format === "drawio") insertBlock("drawio");
  if (format === "youtube") insertBlock("youtube");
  if (format === "iframe") insertBlock("iframe");
  if (format === "html") insertBlock("html");
  if (format === "separator") insertBlock("separator");
  if (format === "delete-block") deleteCurrentBlock();
  if (format === "align-left") setCurrentTableAlignment("left");
  if (format === "align-center") setCurrentTableAlignment("center");
  if (format === "table-add-row") addTableRow(true);
  if (format === "table-remove-row") removeTableRow();
  if (format === "table-add-column") addTableColumn(true);
  if (format === "table-remove-column") removeTableColumn();
  saveProject();
}
function setHeading(value) {
  restoreSelection();
  const currentBlock = getActiveTextBlock();
  const targetTag = value || "p";
  if (currentBlock) {
    const replacement = replaceBlockTag(currentBlock, targetTag);
    if (replacement) {
      const range = document.createRange();
      range.selectNodeContents(replacement);
      range.collapse(false);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      savedRange = range.cloneRange();
      lastSelectionSavedAt = Date.now();
      syncHeadingSelect();
      saveProject();
      return;
    }
  }
  document.execCommand("formatBlock", false, targetTag);
  saveSelection();
  syncHeadingSelect();
  saveProject();
}
function getCurrentTable() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  let node = selection.getRangeAt(0).commonAncestorContainer;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  return node && node.closest ? node.closest("table") : null;
}
function setCurrentTableAlignment(align) {
  const table = getCurrentTable();
  if (!table) { showToast("Place your cursor inside a table first"); return; }
  table.dataset.align = align;
  table.classList.toggle("table-center", align === "center");
  table.classList.toggle("table-left", align !== "center");
  table.querySelectorAll("th, td").forEach(cell => { cell.style.textAlign = align === "center" ? "center" : "left"; });
  showToast(align === "center" ? "Table centered" : "Table aligned left");
  saveProject();
}
function getSelectedTableCell() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  let node = selection.getRangeAt(0).commonAncestorContainer;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  const cell = node?.closest?.("th, td");
  return cell && els.visualEditor.contains(cell) ? cell : null;
}
function getCurrentTableContext() {
  const table = getCurrentTable();
  const cell = getSelectedTableCell();
  if (!table || !cell || !table.contains(cell)) return { table, cell: null, rowIndex: -1, colIndex: -1, isHeader: false };
  const row = cell.parentElement;
  const section = row?.parentElement;
  const rowIndex = Array.from(section?.children || []).indexOf(row);
  const colIndex = Array.from(row?.children || []).indexOf(cell);
  return { table, cell, row, section, rowIndex, colIndex, isHeader: cell.tagName.toLowerCase() === "th" };
}
function createTableCell(tagName) {
  const cell = document.createElement(tagName);
  cell.contentEditable = "true";
  cell.innerHTML = "<br>";
  return cell;
}
function focusTableCell(cell) {
  if (!cell) return;
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(cell);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
  savedRange = range.cloneRange();
  lastSelectionSavedAt = Date.now();
}
function addTableRow(after = true) {
  const { table, row, section, colIndex } = getCurrentTableContext();
  if (!table || !row || !section) { showToast("Place your cursor inside a table cell first"); return; }
  const newRow = document.createElement("tr");
  const tagName = section.tagName.toLowerCase() === "thead" ? "th" : "td";
  const colCount = row.children.length || table.querySelector("tr")?.children.length || 1;
  for (let i = 0; i < colCount; i++) newRow.appendChild(createTableCell(tagName));
  row[after ? "after" : "before"](newRow);
  focusTableCell(newRow.children[Math.max(0, colIndex)] || newRow.firstElementChild);
  table.dataset.dragHandlesReady = "false";
  ensureTableDragHandles(table);
  saveProject();
  showToast(after ? "Row added" : "Row inserted above");
}
function removeTableRow() {
  const { table, row, section, rowIndex, colIndex } = getCurrentTableContext();
  if (!table || !row || !section) { showToast("Place your cursor inside a table cell first"); return; }
  const rows = Array.from(section.children);
  if (rows.length <= 1 && section.tagName.toLowerCase() === "tbody") { showToast("A table needs at least one body row"); return; }
  const fallbackRow = rows[rowIndex + 1] || rows[rowIndex - 1] || table.querySelector("tbody tr") || table.querySelector("thead tr");
  row.remove();
  if (!table.querySelector("tbody tr")) {
    const tbody = table.querySelector("tbody") || table.appendChild(document.createElement("tbody"));
    const headerCells = table.querySelector("thead tr")?.children.length || 1;
    const replacementRow = document.createElement("tr");
    for (let i = 0; i < headerCells; i++) replacementRow.appendChild(createTableCell("td"));
    tbody.appendChild(replacementRow);
  }
  const targetRow = fallbackRow && fallbackRow.isConnected ? fallbackRow : (table.querySelector("tbody tr") || table.querySelector("thead tr"));
  focusTableCell(targetRow?.children[Math.max(0, Math.min(colIndex, (targetRow?.children.length || 1) - 1))]);
  table.dataset.dragHandlesReady = "false";
  ensureTableDragHandles(table);
  saveProject();
  showToast("Row removed");
}
function addTableColumn(after = true) {
  const { table, colIndex } = getCurrentTableContext();
  if (!table || colIndex < 0) { showToast("Place your cursor inside a table cell first"); return; }
  table.querySelectorAll("tr").forEach(row => {
    const tagName = row.parentElement?.tagName.toLowerCase() === "thead" ? "th" : "td";
    const newCell = createTableCell(tagName);
    const cells = row.children;
    const refIndex = after ? colIndex + 1 : colIndex;
    if (refIndex >= cells.length) row.appendChild(newCell);
    else row.insertBefore(newCell, cells[refIndex]);
  });
  const targetRow = getCurrentTableContext().row || table.querySelector("tbody tr") || table.querySelector("thead tr");
  focusTableCell(targetRow?.children[after ? colIndex + 1 : colIndex]);
  table.dataset.dragHandlesReady = "false";
  ensureTableDragHandles(table);
  saveProject();
  showToast(after ? "Column added" : "Column inserted left");
}
function removeTableColumn() {
  const { table, colIndex } = getCurrentTableContext();
  if (!table || colIndex < 0) { showToast("Place your cursor inside a table cell first"); return; }
  const firstRow = table.querySelector("tr");
  if (!firstRow || firstRow.children.length <= 1) { showToast("A table needs at least one column"); return; }
  table.querySelectorAll("tr").forEach(row => row.children[colIndex]?.remove());
  const targetRow = getCurrentTableContext().row || table.querySelector("tbody tr") || table.querySelector("thead tr");
  const nextIndex = Math.max(0, Math.min(colIndex, (targetRow?.children.length || 1) - 1));
  focusTableCell(targetRow?.children[nextIndex]);
  table.dataset.dragHandlesReady = "false";
  ensureTableDragHandles(table);
  saveProject();
  showToast("Column removed");
}
function handlePanelKeydown(event) {
  const panel = event.currentTarget;
  if (event.key === "Escape") {
    event.preventDefault();
    panel.classList.remove("open");
    pendingInsertAnchorBlock = null;
    if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove();
    pendingInsertMarker = null;
    restoreSelection();
    return;
  }
  if (event.key !== "Enter") return;
  event.preventDefault();
  if (panel === els.imagePanel) insertImageFromPanel();
  if (panel === els.blobSettingsPanel) saveBlobSettingsFromForm();
  if (panel === els.buttonPanel) saveButtonFromPanel();
  if (panel === els.githubButtonPanel) saveGitHubButtonFromPanel();
  if (panel === els.tablePanel) insertTableFromPanel();
  if (panel === els.drawioPanel) saveDrawioFromPanel();
  if (panel === els.youtubePanel) saveYoutubeFromPanel();
  if (panel === els.iframePanel) saveIframeFromPanel();
}
function openImagePanel(options = {}) {
  preparePanelInsertion(options, !!options.editFigure);
  pendingImageEditFigure = options.editFigure || null;
  const figure = options.editFigure || null;
  const img = figure?.querySelector?.("img") || null;
  const anchor = figure?.querySelector?.(":scope > a.image-link") || figure?.querySelector?.("a.image-link") || null;
  els.imageUrl.value = img?.getAttribute?.("src") || "";
  els.imageAlt.value = img?.getAttribute?.("alt") || "";
  els.imageLink.value = figure?.getAttribute?.("data-link") || anchor?.getAttribute?.("href") || img?.getAttribute?.("src") || "";
  els.imagePanel.classList.add("open");
  setTimeout(() => els.imageUrl.focus(), 80);
}
function getImageSourceFromClipboard(event) {
  const clipboard = event.clipboardData;
  if (!clipboard) return null;
  const imageItem = Array.from(clipboard.items || []).find(item => item.kind === "file" && /^image\//i.test(item.type));
  if (imageItem) return { type: "file", value: imageItem.getAsFile() };
  const text = clipboard.getData("text/plain") || "";
  if (text.trim() && (isImageUrl(text) || /^data:image\//i.test(text.trim()))) return { type: "text", value: text.trim() };
  const html = clipboard.getData("text/html") || "";
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match?.[1]) return { type: "text", value: match[1] };
  return null;
}
async function handleImagePanelPaste(event) {
  const source = getImageSourceFromClipboard(event);
  if (!source) return;
  event.preventDefault();
  if ((source.type === "file" && source.value) || (source.type === "text" && /^data:image\//i.test(source.value))) {
    if (await uploadImageSourceToPanel(source)) return;
  }
  if (source.type === "text") {
    els.imageUrl.value = source.value;
    if (!els.imageAlt.value.trim()) els.imageAlt.value = guessAltTextFromUrl(source.value);
    if (!els.imageLink.value.trim()) els.imageLink.value = source.value;
    return;
  }
  if (source.type === "file" && source.value) {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      els.imageUrl.value = dataUrl;
      if (!els.imageAlt.value.trim()) els.imageAlt.value = source.value.name || "Image";
      if (!els.imageLink.value.trim()) els.imageLink.value = dataUrl;
      showToast("Image ready to insert");
    };
    reader.readAsDataURL(source.value);
  }
}
function insertImageFromPanel() {
  const url = els.imageUrl.value.trim();
  const alt = els.imageAlt.value.trim() || guessAltTextFromUrl(url);
  const link = els.imageLink.value.trim() || url;
  if (!url) { showToast("Paste an image URL first"); return; }
  els.imagePanel.classList.remove("open");
  if (pendingImageEditFigure && pendingImageEditFigure.isConnected) {
    let anchor = pendingImageEditFigure.querySelector(":scope > a.image-link") || pendingImageEditFigure.querySelector("a.image-link");
    let img = pendingImageEditFigure.querySelector("img");
    if (!img) img = document.createElement("img");
    img.setAttribute("src", url);
    img.setAttribute("alt", alt || "Image");
    if (!anchor) {
      anchor = document.createElement("a");
      anchor.className = "image-link";
      pendingImageEditFigure.insertBefore(anchor, pendingImageEditFigure.firstChild);
    }
    anchor.setAttribute("href", link);
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noreferrer");
    if (!anchor.contains(img)) {
      anchor.innerHTML = "";
      anchor.appendChild(img);
    }
    pendingImageEditFigure.setAttribute("data-link", link);
    normalizeEditorContent(pendingImageEditFigure);
    saveProject();
    showToast("Image updated");
  } else {
    insertHtmlAtCursor(imageHtml(url, alt || "Image", "Optional caption", link), { ...pendingPanelInsertOptions, marker: pendingInsertMarker, anchorBlock: pendingInsertAnchorBlock });
    showToast("Image inserted");
  }
  pendingInsertAnchorBlock = null;
  pendingInsertMarker = null;
  pendingImageEditFigure = null;
}
function createInsertionMarkerAtRange(range) {
  if (!range || !els.visualEditor.contains(range.commonAncestorContainer)) return null;
  const marker = document.createElement("span");
  marker.className = "slash-insert-marker";
  marker.setAttribute("data-panel-insert-marker", "true");
  marker.contentEditable = "false";
  marker.style.display = "none";
  const markerRange = range.cloneRange();
  markerRange.collapse(false);
  markerRange.insertNode(marker);
  const afterMarkerRange = document.createRange();
  afterMarkerRange.setStartAfter(marker);
  afterMarkerRange.collapse(true);
  savedRange = afterMarkerRange.cloneRange();
  lastSelectionSavedAt = Date.now();
  return marker;
}
function preparePanelInsertion(options = {}, isEditing = false) {
  const explicitMarker = options.marker && options.marker.isConnected ? options.marker : null;
  const insertionRange = getPanelInsertionRange(options);
  const marker = isEditing ? explicitMarker : (explicitMarker || createInsertionMarkerAtRange(insertionRange));
  const anchorBlock = options.anchorBlock || (marker ? getBlockAnchorFromNode(marker) : getBlockAnchorFromRange(insertionRange));
  if (!marker && insertionRange) {
    savedRange = insertionRange.cloneRange();
    lastSelectionSavedAt = Date.now();
  }
  if (!marker && !insertionRange) {
    savedRange = createEndRange();
    lastSelectionSavedAt = Date.now();
  }
  pendingPanelInsertOptions = {
    allowOldSelection: options.allowOldSelection !== false && !!(marker || insertionRange),
    marker
  };
  pendingInsertMarker = marker;
  pendingInsertAnchorBlock = anchorBlock && anchorBlock.isConnected ? anchorBlock : null;
  return { insertionRange, marker, anchorBlock: pendingInsertAnchorBlock };
}
function clearPendingPanelInsertion() {
  pendingInsertAnchorBlock = null;
  if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove();
  pendingInsertMarker = null;
}
function openButtonPanel(options = {}) {
  preparePanelInsertion(options, !!options.editAnchor);
  pendingButtonEditAnchor = options.editAnchor || null;
  const anchor = options.editAnchor || null;
  els.buttonText.value = anchor?.textContent?.trim() || "Go back to Blog homepage";
  els.buttonUrl.value = anchor?.getAttribute?.("href") || "/blog/";
  const currentClass = (anchor?.getAttribute?.("class") || "").trim();
  const fallbackClass = "btn btn-primary";
  const hasExactOption = Array.from(els.buttonStyle.options).some(option => option.value === currentClass);
  els.buttonStyle.value = hasExactOption ? currentClass : fallbackClass;
  els.buttonPanel.classList.add("open");
  setTimeout(() => els.buttonText.focus(), 80);
}
function saveButtonFromPanel() {
  const textValue = els.buttonText.value.trim() || "Go back to Blog homepage";
  const hrefValue = els.buttonUrl.value.trim() || "/blog/";
  const classValue = els.buttonStyle.value || "btn btn-primary";
  els.buttonPanel.classList.remove("open");
  if (pendingButtonEditAnchor && pendingButtonEditAnchor.isConnected) {
    pendingButtonEditAnchor.textContent = textValue;
    pendingButtonEditAnchor.setAttribute("href", hrefValue);
    pendingButtonEditAnchor.setAttribute("class", classValue);
    pendingButtonEditAnchor.setAttribute("target", "_blank");
    pendingButtonEditAnchor.setAttribute("rel", "noreferrer");
    normalizeEditorContent(pendingButtonEditAnchor.closest("p") || pendingButtonEditAnchor);
    saveProject();
    showToast("Docsy button updated");
  } else {
    insertHtmlAtCursor(docsyButtonHtml(textValue, hrefValue, classValue), { ...pendingPanelInsertOptions, marker: pendingInsertMarker, anchorBlock: pendingInsertAnchorBlock });
    showToast("Docsy button inserted");
  }
  pendingInsertAnchorBlock = null;
  pendingInsertMarker = null;
  pendingButtonEditAnchor = null;
}
function openGitHubButtonPanel(options = {}) {
  preparePanelInsertion(options, !!options.editAnchor);
  pendingGitHubButtonEditAnchor = options.editAnchor || null;
  const anchor = options.editAnchor || null;
  els.githubButtonUrl.value = anchor?.getAttribute?.("href") || DOCSY_GITHUB_BUTTON_DEFAULT_URL;
  els.githubButtonPanel.classList.add("open");
  setTimeout(() => els.githubButtonUrl.focus(), 80);
}
function saveGitHubButtonFromPanel() {
  const hrefValue = els.githubButtonUrl.value.trim() || DOCSY_GITHUB_BUTTON_DEFAULT_URL;
  els.githubButtonPanel.classList.remove("open");
  if (pendingGitHubButtonEditAnchor && pendingGitHubButtonEditAnchor.isConnected) {
    pendingGitHubButtonEditAnchor.textContent = DOCSY_GITHUB_BUTTON_TEXT;
    pendingGitHubButtonEditAnchor.setAttribute("href", hrefValue);
    pendingGitHubButtonEditAnchor.setAttribute("class", DOCSY_GITHUB_BUTTON_CLASS);
    pendingGitHubButtonEditAnchor.setAttribute("target", "_blank");
    pendingGitHubButtonEditAnchor.setAttribute("rel", "noreferrer");
    pendingGitHubButtonEditAnchor.dataset.docsyGithubButton = "true";
    normalizeEditorContent(pendingGitHubButtonEditAnchor.closest("p") || pendingGitHubButtonEditAnchor);
    saveProject();
    showToast("GitHub button updated");
  } else {
    insertHtmlAtCursor(docsyGitHubButtonHtml(hrefValue), { ...pendingPanelInsertOptions, marker: pendingInsertMarker, anchorBlock: pendingInsertAnchorBlock });
    showToast("GitHub button inserted");
  }
  pendingInsertAnchorBlock = null;
  pendingInsertMarker = null;
  pendingGitHubButtonEditAnchor = null;
}
function openTablePanel(options = {}) {
  preparePanelInsertion(options, !!options.editTable);
  pendingTableEditTarget = options.editTable || null;
  const editTable = options.editTable || null;
  els.tableColumns.value = editTable?.querySelector?.("tr")?.children?.length || 3;
  els.tableRows.value = editTable?.querySelectorAll?.("tbody tr")?.length || 3;
  els.tableAlign.value = editTable?.getAttribute?.("data-align") || "left";
  els.insertTableBtn.textContent = editTable ? "Update table" : "Insert table";
  els.tablePanel.classList.add("open");
  setTimeout(() => els.tableColumns.focus(), 80);
}
function copyTableContent(sourceTable, targetTable) {
  if (!sourceTable || !targetTable) return;
  const sourceRows = Array.from(sourceTable.querySelectorAll("tr"));
  const targetRows = Array.from(targetTable.querySelectorAll("tr"));
  targetRows.forEach((targetRow, rowIndex) => {
    const sourceRow = sourceRows[rowIndex];
    if (!sourceRow) return;
    Array.from(targetRow.children).forEach((targetCell, cellIndex) => {
      const sourceCell = sourceRow.children[cellIndex];
      if (!sourceCell) return;
      targetCell.innerHTML = stripTableDragHandlesFromCell(sourceCell);
    });
  });
}
function insertTableFromPanel() {
  els.tablePanel.classList.remove("open");
  const html = tableHtml(els.tableColumns.value, els.tableRows.value, els.tableAlign.value);
  if (pendingTableEditTarget && pendingTableEditTarget.isConnected) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const newTable = wrapper.querySelector("table");
    if (newTable) {
      copyTableContent(pendingTableEditTarget, newTable);
      pendingTableEditTarget.replaceWith(newTable);
      normalizeEditorContent(newTable);
      saveProject();
      showToast("Table updated");
    }
  } else {
    insertHtmlAtCursor(html, { ...pendingPanelInsertOptions, marker: pendingInsertMarker, anchorBlock: pendingInsertAnchorBlock });
    showToast("Table inserted");
  }
  pendingInsertAnchorBlock = null;
  pendingInsertMarker = null;
  pendingTableEditTarget = null;
  els.insertTableBtn.textContent = "Insert table";
}

function openDrawioPanel(options = {}) {
  preparePanelInsertion(options, !!options.editCard);
  pendingDrawioEditCard = options.editCard || null;
  els.drawioEmbed.value = options.editCard?.querySelector?.("textarea")?.value || getDefaultDrawioEmbed();
  els.insertDrawioBtn.textContent = options.editCard ? "Update draw.io" : "Insert draw.io";
  els.drawioPanel.classList.add("open");
  setTimeout(() => els.drawioEmbed.focus(), 80);
}
function saveDrawioFromPanel() {
  const html = drawioBlockHtml(els.drawioEmbed.value);
  els.drawioPanel.classList.remove("open");
  if (pendingDrawioEditCard && pendingDrawioEditCard.isConnected) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const newCard = wrapper.querySelector(".raw-html-card");
    if (newCard) {
      pendingDrawioEditCard.replaceWith(newCard);
      normalizeEditorContent(newCard);
      saveProject();
      showToast("Draw.io diagram updated");
    }
  } else {
    insertHtmlAtCursor(html, { ...pendingPanelInsertOptions, marker: pendingInsertMarker, anchorBlock: pendingInsertAnchorBlock });
    showToast("Draw.io diagram inserted");
  }
  pendingInsertAnchorBlock = null;
  pendingInsertMarker = null;
  pendingDrawioEditCard = null;
  els.insertDrawioBtn.textContent = "Insert draw.io";
}
function openYoutubePanel(options = {}) {
  preparePanelInsertion(options, !!options.editCard);
  pendingYoutubeEditCard = options.editCard || null;
  els.youtubeUrl.value = options.editCard ? getYouTubeSourceFromCard(options.editCard) : DEFAULT_YOUTUBE_URL;
  els.insertYoutubeBtn.textContent = options.editCard ? "Update YouTube video" : "Insert YouTube video";
  els.youtubePanel.classList.add("open");
  setTimeout(() => els.youtubeUrl.focus(), 80);
}
function saveYoutubeFromPanel() {
  const inputValue = els.youtubeUrl.value.trim();
  const videoId = getYouTubeVideoId(inputValue);
  if (!videoId) {
    showToast("Paste a valid YouTube URL first");
    return;
  }
  const html = youtubeBlockHtml(inputValue);
  els.youtubePanel.classList.remove("open");
  if (pendingYoutubeEditCard && pendingYoutubeEditCard.isConnected) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const newCard = wrapper.querySelector(".youtube-card");
    if (newCard) {
      pendingYoutubeEditCard.replaceWith(newCard);
      normalizeEditorContent(newCard);
      saveProject();
      showToast("YouTube video updated");
    }
  } else {
    insertHtmlAtCursor(html, { ...pendingPanelInsertOptions, marker: pendingInsertMarker, anchorBlock: pendingInsertAnchorBlock });
    showToast("YouTube video inserted");
  }
  clearPendingPanelInsertion();
  pendingYoutubeEditCard = null;
  els.insertYoutubeBtn.textContent = "Insert YouTube video";
}
function openIframePanel(options = {}) {
  preparePanelInsertion(options, !!options.editCard);
  pendingIframeEditCard = options.editCard || null;
  const iframeData = options.editCard ? getStandardIframeDataFromCard(options.editCard) : { url: DEFAULT_IFRAME_URL, title: DEFAULT_IFRAME_TITLE };
  els.iframeUrl.value = iframeData.url || DEFAULT_IFRAME_URL;
  els.iframeTitle.value = iframeData.title || DEFAULT_IFRAME_TITLE;
  els.insertIframeBtn.textContent = options.editCard ? "Update iframe" : "Insert iframe";
  els.iframePanel.classList.add("open");
  setTimeout(() => els.iframeUrl.focus(), 80);
}
function saveIframeFromPanel() {
  const inputValue = els.iframeUrl.value.trim();
  const titleValue = els.iframeTitle.value.trim();
  if (!inputValue) {
    showToast("Paste an iframe URL first");
    return;
  }
  const html = standardIframeBlockHtml(inputValue, titleValue);
  els.iframePanel.classList.remove("open");
  if (pendingIframeEditCard && pendingIframeEditCard.isConnected) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const newCard = wrapper.querySelector(".iframe-card");
    if (newCard) {
      pendingIframeEditCard.replaceWith(newCard);
      normalizeEditorContent(newCard);
      saveProject();
      showToast("Iframe updated");
    }
  } else {
    insertHtmlAtCursor(html, { ...pendingPanelInsertOptions, marker: pendingInsertMarker, anchorBlock: pendingInsertAnchorBlock });
    showToast("Iframe inserted");
  }
  clearPendingPanelInsertion();
  pendingIframeEditCard = null;
  els.insertIframeBtn.textContent = "Insert iframe";
}

function quizAnswerFormHtml(answer, qIndex, aIndex) {
  return `<div class="quiz-answer-editor" data-answer-index="${aIndex}">
    <div class="quiz-answer-correct-wrap"><input class="quiz-answer-correct" type="radio" name="quiz-correct-${qIndex}" ${answer.correct ? "checked" : ""} aria-label="Correct answer"></div>
    <div class="field quiz-answer-text-field"><label>Answer text</label><textarea class="quiz-answer-text" rows="2" placeholder="Answer option">${escapeHtml(answer.text)}</textarea></div>
    <div class="field quiz-answer-message-field"><label>Feedback message</label><textarea class="quiz-answer-message" rows="2" placeholder="Feedback shown after this answer is selected">${escapeHtml(answer.message)}</textarea></div>
    <button class="pill danger quiz-remove-answer" type="button" title="Remove answer" aria-label="Remove answer"><i class="fa-solid fa-xmark"></i></button>
  </div>`;
}
function quizQuestionFormHtml(question, qIndex) {
  return `<section class="quiz-question-editor" data-question-index="${qIndex}">
    <div class="quiz-question-editor-head">
      <h3>Question ${qIndex + 1}</h3>
      <button class="pill danger quiz-remove-question" type="button"><i class="fa-solid fa-trash-can"></i> Remove question</button>
    </div>
    <div class="field"><label>Question</label><textarea class="quiz-question-text" rows="2" placeholder="Question text">${escapeHtml(question.question)}</textarea></div>
    <div class="quiz-reference-grid">
      <div class="field"><label>Reference text</label><input class="quiz-reference" type="text" value="${escapeHtml(question.reference)}" placeholder="See the section: Section title" /></div>
      <div class="field"><label>Reference URL / anchor</label><input class="quiz-reference-url" type="text" value="${escapeHtml(question.referenceUrl)}" placeholder="#section-title" /></div>
    </div>
    <div class="quiz-answer-list">${question.answers.map((answer, aIndex) => quizAnswerFormHtml(answer, qIndex, aIndex)).join("")}</div>
    <button class="pill quiz-add-answer" type="button"><i class="fa-solid fa-plus"></i> Add answer</button>
  </section>`;
}
function renderQuizForm(data = getDefaultQuizData()) {
  const quiz = normalizeQuizData(data);
  els.quizQuestions.innerHTML = quiz.questions.map(quizQuestionFormHtml).join("");
}
function collectQuizFormData() {
  const questions = Array.from(els.quizQuestions.querySelectorAll(".quiz-question-editor")).map(questionEl => {
    const answers = Array.from(questionEl.querySelectorAll(".quiz-answer-editor")).map(answerEl => ({
      text: answerEl.querySelector(".quiz-answer-text")?.value || "",
      correct: !!answerEl.querySelector(".quiz-answer-correct")?.checked,
      message: answerEl.querySelector(".quiz-answer-message")?.value || ""
    }));
    return {
      question: questionEl.querySelector(".quiz-question-text")?.value || "",
      reference: questionEl.querySelector(".quiz-reference")?.value || "",
      referenceUrl: questionEl.querySelector(".quiz-reference-url")?.value || "",
      answers
    };
  });
  return normalizeQuizData({ intro: DEFAULT_QUIZ_INTRO, questions });
}
function closeQuizPanel() {
  els.quizPanel.classList.remove("open");
  pendingInsertAnchorBlock = null;
  if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove();
  pendingInsertMarker = null;
  pendingQuizEditCard = null;
  els.insertQuizBtn.textContent = "Insert quiz";
}
function handleQuizPanelKeydown(event) {
  if (event.key !== "Escape") return;
  event.preventDefault();
  closeQuizPanel();
  restoreSelection();
}
function openQuizPanel(options = {}) {
  preparePanelInsertion(options, !!options.editCard);
  pendingQuizEditCard = options.editCard || null;
  renderQuizForm(options.editCard ? getQuizDataFromCard(options.editCard) : getDefaultQuizData());
  els.insertQuizBtn.textContent = options.editCard ? "Update quiz" : "Insert quiz";
  els.quizPanel.classList.add("open");
  setTimeout(() => (els.quizQuestions.querySelector(".quiz-question-text") || els.addQuizQuestionBtn)?.focus(), 80);
}
function saveQuizFromPanel() {
  const data = collectQuizFormData();
  const invalidQuestion = data.questions.find(question => !question.question.trim() || question.answers.length < 2 || question.answers.filter(answer => answer.text.trim()).length < 2);
  if (invalidQuestion) {
    showToast("Add a question text and at least two answers");
    return;
  }
  const html = quizBlockHtml(data);
  els.quizPanel.classList.remove("open");
  if (pendingQuizEditCard && pendingQuizEditCard.isConnected) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = html;
    const newCard = wrapper.querySelector(".quiz-card");
    if (newCard) {
      pendingQuizEditCard.replaceWith(newCard);
      normalizeEditorContent(newCard);
      saveProject();
      showToast("Quiz updated");
    }
  } else {
    insertHtmlAtCursor(html, { ...pendingPanelInsertOptions, marker: pendingInsertMarker, anchorBlock: pendingInsertAnchorBlock });
    showToast("Quiz inserted");
  }
  pendingInsertAnchorBlock = null;
  pendingInsertMarker = null;
  pendingQuizEditCard = null;
  els.insertQuizBtn.textContent = "Insert quiz";
}

function fillPostInfoForm() {
  const m = state.metadata;
  els.fmTitle.value = m.title || "";
  els.fmSlug.value = m.slug || slugify(m.title || state.projectName || "");
  els.fmDate.value = m.date || "";
  els.fmTags.value = yamlScalar(m.tags);
  els.fmCategories.value = yamlScalar(m.categories);
  els.fmDescription.value = m.description || "";
  els.fmHidden.value = m.hidden === "true" ? "true" : "false";
}
function savePostInfoForm() {
  state.rawFrontMatter = "";
  state.metadata = {
    title: els.fmTitle.value.trim(),
    slug: els.fmSlug.value.trim() || slugify(els.fmTitle.value || state.projectName),
    date: els.fmDate.value,
    tags: els.fmTags.value.trim(),
    categories: els.fmCategories.value.trim(),
    description: els.fmDescription.value.trim(),
    hidden: els.fmHidden.value
  };
  state.projectName = state.metadata.title || state.projectName || "markdown-page";
  els.projectName.value = state.projectName;
  syncMarkdownEditorFrontMatter();
  els.metadataDrawer.classList.remove("open");
  saveProject();
  showToast("Post Information saved");
}
function exportMarkdown() {
  const markdown = state.view === "markdown" ? els.markdownEditor.value : buildMarkdown();
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const baseName = (els.projectName.value || "markdown-page").toLowerCase().replace(/[^a-z0-9-_]+/g, "-").replace(/^-|-$/g, "") || "markdown-page";
  a.href = url;
  a.download = baseName.endsWith(".md") ? baseName : baseName + ".md";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast("Markdown exported");
}
function resetProject() {
  if (!window.confirm("Delete the locally saved project and start over?")) return;
  const preferredView = state.view === "markdown" ? "markdown" : "editor";
  clearTimeout(saveTimer);
  [STORAGE_KEY, ...PREVIOUS_STORAGE_KEYS].forEach(key => localStorage.removeItem(key));
  state.projectName = "markdown-page";
  state.html = "";
  state.markdownCache = "";
  state.rawFrontMatter = "";
  state.metadata = { title: "New Markdown page", slug: "new-markdown-page", date: new Date().toISOString().slice(0, 10), tags: "", categories: "", description: "", hidden: "false" };

  els.projectName.value = state.projectName;
  els.visualEditor.innerHTML = "";
  els.markdownEditor.value = "";
  normalizeEditorContent();
  updateEditorPlaceholder();
  fillPostInfoForm();
  updateTableToolbarVisibility();

  state.view = preferredView;
  els.editorBtn.classList.toggle("active", preferredView === "editor");
  els.codeBtn.classList.toggle("active", preferredView === "markdown");
  els.visualEditor.style.display = preferredView === "editor" ? "block" : "none";
  els.editorToolbar.style.display = preferredView === "editor" ? "flex" : "none";
  els.markdownEditor.style.display = preferredView === "markdown" ? "block" : "none";
  if (preferredView === "markdown") {
    state.markdownCache = `${buildFrontMatter()}

`;
    els.markdownEditor.value = state.markdownCache;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  els.saveStatus.textContent = "Saved at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  showToast("Project reset");
}


function getToolbarButton(format) {
  return els.editorToolbar.querySelector(`[data-format="${format}"]`);
}
function updateTableToolbarVisibility() {
  const inTable = !!getCurrentTable();
  ["align-left", "align-center", "table-add-row", "table-remove-row", "table-add-column", "table-remove-column"].forEach(format => {
    const button = getToolbarButton(format);
    if (!button) return;
    button.style.display = inTable ? "inline-flex" : "none";
  });
}
function ensureFigureBlock(figure) {
  if (!figure) return;
  figure.classList.add("image-block");
  if (!figure.querySelector("figcaption")) {
    const caption = document.createElement("figcaption");
    caption.contentEditable = "true";
    caption.textContent = "Optional caption";
    figure.appendChild(caption);
  }
}
function getScopeRoot(scope) {
  if (!scope || scope === els.visualEditor) return els.visualEditor;
  return scope.nodeType === Node.ELEMENT_NODE ? scope : scope.parentElement || els.visualEditor;
}
function normalizeEditorContent(scope = els.visualEditor) {
  const root = getScopeRoot(scope);
  if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
  if (root.matches?.("a[href]")) {
    root.target = "_blank";
    root.rel = "noreferrer";
  }
  root.querySelectorAll?.("a[href]").forEach(anchor => { anchor.target = "_blank"; anchor.rel = "noreferrer"; });

  if (root.matches?.("figure")) ensureFigureBlock(root);
  root.querySelectorAll?.("figure").forEach(ensureFigureBlock);
  const figures = [];
  if (root.matches?.("figure.image-block")) figures.push(root);
  root.querySelectorAll?.("figure.image-block").forEach(figure => figures.push(figure));
  figures.forEach(figure => {
    const img = figure.querySelector("img");
    if (!img) return;
    let anchor = figure.querySelector(":scope > a.image-link");
    const desiredHref = figure.getAttribute("data-link") || anchor?.getAttribute("href") || img.getAttribute("src") || "";
    if (!anchor) {
      anchor = document.createElement("a");
      anchor.className = "image-link";
      anchor.href = desiredHref;
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      img.replaceWith(anchor);
      anchor.appendChild(img);
    } else {
      anchor.href = desiredHref;
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
    }
    figure.setAttribute("data-link", desiredHref);
  });

  const standaloneImages = [];
  if (root.matches?.("img") && !root.closest("figure")) standaloneImages.push(root);
  root.querySelectorAll?.("img").forEach(img => { if (!img.closest("figure")) standaloneImages.push(img); });
  standaloneImages.forEach(img => {
    if (!img.isConnected || img.closest("figure")) return;
    const figure = document.createElement("figure");
    figure.className = "image-block";
    img.replaceWith(figure);
    figure.appendChild(img);
    ensureFigureBlock(figure);
  });

  const codeBlocks = [];
  if (root.matches?.('.code-block, .docsy-code-block')) codeBlocks.push(root);
  root.querySelectorAll?.('.code-block, .docsy-code-block').forEach(block => codeBlocks.push(block));
  codeBlocks.forEach(block => {
    block.contentEditable = "false";
    block.querySelectorAll(".block-settings").forEach(settings => { settings.contentEditable = "false"; });
    block.querySelectorAll("pre" ).forEach(pre => { pre.contentEditable = "true"; });
    ensureBlockDropdown(block, "language");
  });

  const rawHtmlCards = [];
  if (root.matches?.('.raw-html-card')) rawHtmlCards.push(root);
  root.querySelectorAll?.('.raw-html-card').forEach(card => rawHtmlCards.push(card));
  rawHtmlCards.forEach(card => {
    card.contentEditable = "false";
    card.querySelectorAll(".block-settings").forEach(settings => { settings.contentEditable = "false"; });
    const textarea = card.querySelector("textarea");
    if (textarea && isDrawioHtml(textarea.value)) card.dataset.drawio = "true";
    if (textarea && isYouTubeHtml(textarea.value)) card.dataset.youtube = "true";
    if (textarea && isStandardIframeHtml(textarea.value)) card.dataset.iframe = "true";
  });

  const quizCards = [];
  if (root.matches?.('.quiz-card')) quizCards.push(root);
  root.querySelectorAll?.('.quiz-card').forEach(card => quizCards.push(card));
  quizCards.forEach(card => {
    card.contentEditable = "false";
    card.querySelectorAll(".block-settings, .quiz-preview").forEach(item => { item.contentEditable = "false"; });
  });

  const tables = [];
  if (root.matches?.('table')) tables.push(root);
  root.querySelectorAll?.('table').forEach(table => tables.push(table));
  tables.forEach(ensureTableDragHandles);

  const alertBlocks = [];
  if (root.matches?.('.docsy-alert-block, .markdown-alert-block')) alertBlocks.push(root);
  root.querySelectorAll?.('.docsy-alert-block, .markdown-alert-block').forEach(block => alertBlocks.push(block));
  alertBlocks.forEach(block => {
    block.contentEditable = "false";
    block.querySelectorAll(".block-settings").forEach(settings => { settings.contentEditable = "false"; });
    block.querySelectorAll(".alert-content").forEach(content => { content.contentEditable = "true"; });
    ensureBlockDropdown(block, "alert");
    refreshAlertBlockAppearance(block);
  });

  addInlineBlockControls(root);
  updateTableToolbarVisibility();
}
function setupDragDrop() {
  els.visualEditor.addEventListener("dragover", event => { event.preventDefault(); els.visualEditor.classList.add("drag-over"); });
  els.visualEditor.addEventListener("dragleave", () => els.visualEditor.classList.remove("drag-over"));
  els.visualEditor.addEventListener("drop", event => {
    clearEditorPlaceholderBeforeInput();
    event.preventDefault();
    els.visualEditor.classList.remove("drag-over");
    const blockId = event.dataTransfer.getData("text/plain");
    const block = blocks.find(item => item.id === blockId);
    if (!block) return;
    const range = document.caretRangeFromPoint ? document.caretRangeFromPoint(event.clientX, event.clientY) : (document.caretPositionFromPoint ? (() => {
      const pos = document.caretPositionFromPoint(event.clientX, event.clientY);
      if (!pos) return null;
      const r = document.createRange();
      r.setStart(pos.offsetNode, pos.offset);
      r.collapse(true);
      return r;
    })() : null);
    savedRange = range && els.visualEditor.contains(range.commonAncestorContainer) ? range : createEndRange();
    lastSelectionSavedAt = Date.now();
    insertBlock(block.id);
  });
}
function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return matrix[a.length][b.length];
}
function getSlashInfo() {
  const selection = window.getSelection();
  if (!selection.rangeCount || !els.visualEditor.contains(selection.getRangeAt(0).commonAncestorContainer)) return null;
  const range = selection.getRangeAt(0);
  if (!range.collapsed) return null;
  const node = range.startContainer;
  if (node.nodeType !== Node.TEXT_NODE) return null;
  const before = node.textContent.slice(0, range.startOffset);
  const match = before.match(/(?:^|\s)(\/[a-z0-9]*)$/i);
  if (!match) return null;
  const start = range.startOffset - match[1].length;
  const slashRangeLocal = range.cloneRange();
  slashRangeLocal.setStart(node, start);
  slashRangeLocal.setEnd(node, range.startOffset);
  return { text: match[1], range: slashRangeLocal };
}
function updateSlashMenu() {
  const info = getSlashInfo();
  if (!info) { hideSlashMenu(); return; }
  slashRange = info.range;
  const query = info.text.slice(1).toLowerCase();
  const exactish = blocks.filter(block => !query || block.id.includes(query) || block.name.toLowerCase().includes(query) || block.command.includes(query));
  const fuzzy = blocks.map(block => ({ block, score: levenshtein(query, block.id) })).filter(item => query && item.score <= 2).map(item => item.block);
  slashMatches = [...new Map([...exactish, ...fuzzy].map(block => [block.id, block])).values()].slice(0, 10);
  if (!slashMatches.length) { hideSlashMenu(); return; }
  if (lastSlashQuery !== query) activeSlashIndex = 0;
  lastSlashQuery = query;
  activeSlashIndex = Math.min(activeSlashIndex, slashMatches.length - 1);
  renderSlashMenu();
  const rect = info.range.getBoundingClientRect();
  const fallback = els.visualEditor.getBoundingClientRect();
  els.slashMenu.style.left = Math.min((rect.left || fallback.left + 32), window.innerWidth - 410) + "px";
  els.slashMenu.style.top = Math.min((rect.bottom || fallback.top + 70) + 8, window.innerHeight - 420) + "px";
  els.slashMenu.classList.add("open");
}
function renderSlashMenu() {
  els.slashMenu.setAttribute("aria-activedescendant", `slash-item-${activeSlashIndex}`);
  els.slashMenu.innerHTML = slashMatches.map((block, index) => `<button class="slash-item ${index === activeSlashIndex ? "active" : ""}" type="button" tabindex="-1" id="slash-item-${index}" data-index="${index}" role="option" aria-selected="${index === activeSlashIndex ? "true" : "false"}"><i class="${iconClass(block)}"></i><span><strong>${block.command} · ${escapeHtml(block.name)}</strong><span>${escapeHtml(block.description)}</span></span></button>`).join("");
  els.slashMenu.querySelectorAll(".slash-item").forEach(button => button.addEventListener("mousedown", event => {
    event.preventDefault();
    activeSlashIndex = Number(button.dataset.index);
    insertSlashSelection();
  }));
}
function hideSlashMenu() { els.slashMenu.classList.remove("open"); els.slashMenu.removeAttribute("aria-activedescendant"); slashMatches = []; slashRange = null; lastSlashQuery = null; }
function handleSlashMenuKey(event) {
  if (!els.slashMenu.classList.contains("open")) return false;
  if (!slashMatches.length) return false;
  if (event.key === "ArrowDown") { event.preventDefault(); event.stopPropagation(); activeSlashIndex = (activeSlashIndex + 1) % slashMatches.length; renderSlashMenu(); return true; }
  if (event.key === "ArrowUp") { event.preventDefault(); event.stopPropagation(); activeSlashIndex = (activeSlashIndex - 1 + slashMatches.length) % slashMatches.length; renderSlashMenu(); return true; }
  if (event.key === "Enter" || event.key === "Tab") { event.preventDefault(); event.stopPropagation(); insertSlashSelection(); return true; }
  if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); hideSlashMenu(); return true; }
  return false;
}
function insertSlashSelection() {
  const block = slashMatches[activeSlashIndex];
  if (!block || !slashRange) return;
  const anchorBlock = getBlockAnchorFromRange(slashRange);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(slashRange);
  slashRange.deleteContents();

  let marker = null;
  if (block.action === "image" || block.action === "table" || block.action === "buttondocsy" || block.action === "buttondocsygithub" || block.action === "drawio") {
    marker = document.createElement("span");
    marker.className = "slash-insert-marker";
    marker.setAttribute("data-slash-insert-marker", "true");
    marker.style.display = "none";
    slashRange.insertNode(marker);
    slashRange.setStartAfter(marker);
    slashRange.collapse(true);
  }

  savedRange = slashRange.cloneRange();
  lastSelectionSavedAt = Date.now();
  hideSlashMenu();
  insertBlock(block.id, { anchorBlock, marker });
}
function normalizeMarkdownListSpacing(markdown) {
  const lines = String(markdown || "").split("\n");
  const output = [];
  for (let i = 0; i < lines.length; i += 1) {
    const current = lines[i];
    const trimmed = current.trim();
    const next = i + 1 < lines.length ? lines[i + 1].trim() : "";
    const prev = output.length ? output[output.length - 1].trim() : "";
    const currentIsList = isMarkdownListLine(current) || /^\[(?: |x|X)\]\s+/.test(trimmed);
    const nextIsList = isMarkdownListLine(lines[i + 1] || "") || /^\[(?: |x|X)\]\s+/.test(next);
    const prevIsList = isMarkdownListLine(output.length ? output[output.length - 1] : "") || /^\[(?: |x|X)\]\s+/.test(prev);
    if (!trimmed && prevIsList && nextIsList) continue;
    output.push(current);
  }
  return output.join("\n");
}
const AUTO_LIST_TEXT_BLOCK_SELECTOR = "p, blockquote";

function isEditableLineDiv(element) {
  if (!element || element === els.visualEditor || !els.visualEditor.contains(element)) return false;
  if (element.matches(".editable-card, .block-settings, .docsy-alert-block, .markdown-alert-block, .code-block, .docsy-code-block, .raw-html-docsy-block, .alert-content")) return false;
  if (element.closest(".block-settings, pre, table")) return false;
  const parent = element.parentElement;
  return parent === els.visualEditor || parent?.matches?.(".alert-content");
}

function findEditableLineBlockFromNode(node) {
  let element = node?.nodeType === Node.TEXT_NODE ? node.parentElement : node;
  while (element && element !== els.visualEditor) {
    if (element.matches?.(AUTO_LIST_TEXT_BLOCK_SELECTOR)) return element;
    if (element.matches?.("div") && isEditableLineDiv(element)) return element;
    element = element.parentElement;
  }
  return null;
}

function getCurrentParagraphBlock() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  const directBlock = findEditableLineBlockFromNode(range.commonAncestorContainer);
  if (directBlock) return directBlock;

  if (range.startContainer.nodeType === Node.ELEMENT_NODE) {
    const container = range.startContainer;
    const candidates = [container.childNodes[range.startOffset], container.childNodes[range.startOffset - 1]].filter(Boolean);
    for (const candidate of candidates) {
      const block = findEditableLineBlockFromNode(candidate);
      if (block) return block;
    }
  }
  return null;
}

function getCurrentRootTextNode() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  return range.startContainer.nodeType === Node.TEXT_NODE && range.startContainer.parentNode === els.visualEditor ? range.startContainer : null;
}

function selectionIsCollapsedInside(block) {
  const selection = window.getSelection();
  return !!(selection.rangeCount && selection.getRangeAt(0).collapsed && block?.contains?.(selection.getRangeAt(0).commonAncestorContainer));
}

function getTextBeforeCaretInBlock(block) {
  const selection = window.getSelection();
  if (!selection.rangeCount || !block) return "";
  const activeRange = selection.getRangeAt(0);
  const range = activeRange.cloneRange();
  range.selectNodeContents(block);
  range.setEnd(activeRange.startContainer, activeRange.startOffset);
  return range.toString().replace(/ /g, " ");
}

function getTextAfterCaretInBlock(block) {
  const selection = window.getSelection();
  if (!selection.rangeCount || !block) return "";
  const activeRange = selection.getRangeAt(0);
  const range = activeRange.cloneRange();
  range.selectNodeContents(block);
  range.setStart(activeRange.endContainer, activeRange.endOffset);
  return range.toString().replace(/ /g, " ");
}

function convertParagraphToList(block, ordered = false) {
  if (!block || !els.visualEditor.contains(block)) return false;
  const rawText = (block.textContent || "").replace(/ /g, " ");
  const match = rawText.match(ordered ? /^\s*(\d+)\.\s*(.*)$/ : /^\s*[-*+]\s*(.*)$/);
  if (!match) return false;
  const content = ordered ? match[2] : match[1];
  return replaceParagraphWithList(block, ordered, content);
}

function focusListItem(li) {
  const range = document.createRange();
  range.selectNodeContents(li);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  saveSelection();
}

function replaceParagraphWithList(block, ordered = false, content = "") {
  if (!block || !els.visualEditor.contains(block)) return false;
  const list = document.createElement(ordered ? "ol" : "ul");
  const li = document.createElement("li");
  li.innerHTML = content && String(content).trim() ? inlineMarkdown(String(content).trim()) : "<br>";
  list.appendChild(li);
  const trailingParagraph = document.createElement("p");
  trailingParagraph.innerHTML = "<br>";
  block.replaceWith(list, trailingParagraph);
  normalizeEditorContent(list);
  focusListItem(li);
  saveProject();
  return true;
}

function insertEmptyListAtCurrentSelection(ordered = false) {
  const selection = window.getSelection();
  if (!selection.rangeCount || !selectionInsideEditor()) return false;
  const range = selection.getRangeAt(0);
  const list = document.createElement(ordered ? "ol" : "ul");
  const li = document.createElement("li");
  li.innerHTML = "<br>";
  list.appendChild(li);
  const trailingParagraph = document.createElement("p");
  trailingParagraph.innerHTML = "<br>";

  if (range.startContainer === els.visualEditor) {
    const nextNode = els.visualEditor.childNodes[range.startOffset];
    const previousNode = els.visualEditor.childNodes[range.startOffset - 1];
    if (nextNode?.nodeName === "BR") nextNode.remove();
    if (previousNode?.nodeName === "BR") previousNode.remove();
  }

  range.deleteContents();
  range.insertNode(list);
  list.after(trailingParagraph);
  normalizeEditorContent(list);
  focusListItem(li);
  saveProject();
  return true;
}

function replaceRootTextNodeWithList(textNode, ordered = false, content = "") {
  if (!textNode || textNode.parentNode !== els.visualEditor) return false;
  const list = document.createElement(ordered ? "ol" : "ul");
  const li = document.createElement("li");
  li.innerHTML = content && String(content).trim() ? inlineMarkdown(String(content).trim()) : "<br>";
  list.appendChild(li);
  const trailingParagraph = document.createElement("p");
  trailingParagraph.innerHTML = "<br>";
  textNode.replaceWith(list, trailingParagraph);
  normalizeEditorContent(list);
  focusListItem(li);
  saveProject();
  return true;
}

function isEmptyInlineNode(node) {
  if (!node) return false;
  if (node.nodeType === Node.TEXT_NODE) return !normalizedAutoListText(node.textContent);
  if (node.nodeName === "BR") return true;
  return false;
}

function isEmptyEditableLineElement(element) {
  if (!element || element === els.visualEditor) return false;
  if (!element.matches?.(AUTO_LIST_TEXT_BLOCK_SELECTOR) && !(element.matches?.("div") && isEditableLineDiv(element))) return false;
  if (element.querySelector?.("img, table, figure, .editable-card, hr, ul, ol")) return false;
  return !normalizedAutoListText(element.textContent);
}

function isEmptyParagraphForAutoList(block) {
  if (!block || !els.visualEditor.contains(block) || !selectionIsCollapsedInside(block)) return false;
  if (!isEmptyEditableLineElement(block)) return false;
  return !getTextBeforeCaretInBlock(block).trim() && !getTextAfterCaretInBlock(block).trim();
}

function isPlainAutoListKey(event, key) {
  return event.key === key && !event.ctrlKey && !event.metaKey && !event.altKey;
}

function isAutoListIgnoredTarget(target) {
  return !!target?.closest?.("input, textarea, select, pre, code, .block-settings, .block-dropdown");
}

function normalizedAutoListText(value) {
  return String(value || "")
    .replace(/ /g, " ")
    .replace(/​/g, "")
    .trim();
}

function selectionIsOnEmptyRootTextLine(textNode) {
  if (!textNode || textNode.parentNode !== els.visualEditor) return false;
  const selection = window.getSelection();
  if (!selection.rangeCount) return false;
  const range = selection.getRangeAt(0);
  if (!range.collapsed || range.startContainer !== textNode) return false;
  const before = textNode.textContent.slice(0, range.startOffset).replace(/ /g, " ");
  const after = textNode.textContent.slice(range.endOffset).replace(/ /g, " ");
  return !normalizedAutoListText(before) && !normalizedAutoListText(after);
}

function selectionIsOnEmptyEditorInsertionLine() {
  const selection = window.getSelection();
  if (!selection.rangeCount || !selectionInsideEditor()) return false;
  const range = selection.getRangeAt(0);
  if (!range.collapsed || range.startContainer !== els.visualEditor) return false;
  if (isEditorEffectivelyEmpty()) return true;

  const before = els.visualEditor.childNodes[range.startOffset - 1] || null;
  const after = els.visualEditor.childNodes[range.startOffset] || null;
  if (isEmptyInlineNode(before) || isEmptyInlineNode(after)) return true;

  // Some browsers place the caret directly in the editor after a paragraph when the user is on a new empty line.
  // Only allow this top-level position; selections inside text nodes are handled separately and will not match here.
  return range.startOffset === els.visualEditor.childNodes.length || range.startOffset === 0;
}

function getEmptyAutoListTarget() {
  const selection = window.getSelection();
  if (!selection.rangeCount || !selectionInsideEditor()) return null;
  const range = selection.getRangeAt(0);
  if (!range.collapsed) return null;

  const block = getCurrentParagraphBlock();
  if (block && isEmptyParagraphForAutoList(block)) return { type: "block", block };

  const rootTextNode = getCurrentRootTextNode();
  if (rootTextNode && selectionIsOnEmptyRootTextLine(rootTextNode)) return { type: "root-text", rootTextNode };

  if (selectionIsOnEmptyEditorInsertionLine()) return { type: "insertion" };

  return null;
}

function replaceEmptyAutoListTarget(target, ordered = false) {
  if (!target) return false;
  if (target.type === "block") return replaceParagraphWithList(target.block, ordered, "");
  if (target.type === "root-text") return replaceRootTextNodeWithList(target.rootTextNode, ordered, "");
  if (target.type === "insertion") {
    if (isEditorEffectivelyEmpty()) {
      const block = document.createElement("p");
      block.innerHTML = "<br>";
      els.visualEditor.innerHTML = "";
      els.visualEditor.appendChild(block);
      return replaceParagraphWithList(block, ordered, "");
    }
    return insertEmptyListAtCurrentSelection(ordered);
  }
  return false;
}

function maybeConvertAutoListMarkerInCurrentBlock() {
  const block = getCurrentParagraphBlock();
  if (block && selectionIsCollapsedInside(block)) {
    const text = normalizedAutoListText(block.textContent);
    const before = normalizedAutoListText(getTextBeforeCaretInBlock(block));
    const after = normalizedAutoListText(getTextAfterCaretInBlock(block));
    if (!after && text === "-" && before === "-") return replaceParagraphWithList(block, false, "");
    if (!after && /^\d+\.$/.test(text) && before === text) return replaceParagraphWithList(block, true, "");
  }

  const rootTextNode = getCurrentRootTextNode();
  if (rootTextNode && selectionIsOnEmptyRootTextLine(rootTextNode)) {
    const text = normalizedAutoListText(rootTextNode.textContent);
    if (text === "-") return replaceRootTextNodeWithList(rootTextNode, false, "");
    if (/^\d+\.$/.test(text)) return replaceRootTextNodeWithList(rootTextNode, true, "");
  }

  return false;
}

function maybeAutoCreateList(event) {
  if (isAutoListIgnoredTarget(event.target)) return false;

  if (isPlainAutoListKey(event, "-")) {
    const target = getEmptyAutoListTarget();
    if (!target) return false;
    event.preventDefault();
    return replaceEmptyAutoListTarget(target, false);
  }

  if (isPlainAutoListKey(event, ".")) {
    const block = getCurrentParagraphBlock();
    if (block && selectionIsCollapsedInside(block)) {
      const before = getTextBeforeCaretInBlock(block);
      const after = getTextAfterCaretInBlock(block);
      if (/^\s*\d+$/.test(before) && !after.trim()) {
        event.preventDefault();
        return replaceParagraphWithList(block, true, "");
      }
    }
    const rootTextNode = getCurrentRootTextNode();
    if (rootTextNode) {
      const selection = window.getSelection();
      const range = selection.rangeCount ? selection.getRangeAt(0) : null;
      const before = range ? rootTextNode.textContent.slice(0, range.startOffset).replace(/ /g, " ") : "";
      const after = range ? rootTextNode.textContent.slice(range.endOffset).replace(/ /g, " ") : "";
      if (/^\s*\d+$/.test(before) && !after.trim()) {
        event.preventDefault();
        return replaceRootTextNodeWithList(rootTextNode, true, "");
      }
    }
  }

  if (event.key !== " ") return false;
  if (maybeConvertAutoListMarkerInCurrentBlock()) {
    event.preventDefault();
    return true;
  }
  return false;
}

function maybeAutoCreateListAfterInput(event) {
  if (!event || event.isComposing || isAutoListIgnoredTarget(event.target)) return false;
  if (event.inputType !== "insertText") return false;
  if (!["-", ".", " "].includes(event.data)) return false;
  return maybeConvertAutoListMarkerInCurrentBlock();
}
function getCurrentListItem() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  let node = selection.getRangeAt(0).commonAncestorContainer;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  return node?.closest?.("li") || null;
}

function getListDepth(list) {
  let depth = 0;
  let current = list;
  while (current && ["UL", "OL"].includes(current.tagName)) {
    depth += 1;
    const parentLi = current.parentElement?.closest?.("li");
    current = parentLi?.parentElement || null;
  }
  return depth;
}

function indentCurrentListItem() {
  const li = getCurrentListItem();
  const list = li?.parentElement;
  if (!li || !list || !["UL", "OL"].includes(list.tagName)) return false;
  const prev = li.previousElementSibling;
  if (!prev) return true;
  const depth = getListDepth(list);
  if (depth >= 3) return true;
  let nested = Array.from(prev.children).find(child => ["UL", "OL"].includes(child.tagName));
  if (!nested) {
    nested = document.createElement(list.tagName.toLowerCase());
    prev.appendChild(nested);
  }
  nested.appendChild(li);
  normalizeEditorContent(nested);
  placeCursorAtStart(li);
  saveProject();
  return true;
}

function outdentCurrentListItem() {
  const li = getCurrentListItem();
  const list = li?.parentElement;
  const parentLi = list?.parentElement?.closest?.("li");
  const parentList = parentLi?.parentElement;
  if (!li || !list || !parentLi || !parentList) return false;
  parentLi.after(li);
  if (!list.children.length) list.remove();
  normalizeEditorContent(parentList);
  placeCursorAtStart(li);
  saveProject();
  return true;
}

function stripTableDragHandlesFromCell(cell) {
  const clone = cell.cloneNode(true);
  clone.querySelectorAll(".table-drag-handle").forEach(handle => handle.remove());
  return clone.innerHTML || "<br>";
}
function ensureTableDragHandles(table) {
  if (!table) return;
  table.classList.add("table-drag-enabled");
  if (table.dataset.dragHandlesReady === "true" && table.querySelector(".table-column-drag-handle")) return;
  table.dataset.dragHandlesReady = "true";
  table.querySelectorAll(".table-drag-handle").forEach(handle => handle.remove());

  const bodyRows = Array.from(table.querySelectorAll("tbody tr"));
  const rowsForDrag = bodyRows.length ? bodyRows : Array.from(table.querySelectorAll("tr")).slice(1);
  rowsForDrag.forEach(row => {
    const firstCell = row.children[0];
    if (!firstCell) return;
    firstCell.insertAdjacentHTML("afterbegin", '<span class="table-drag-handle table-row-drag-handle" draggable="true" contenteditable="false" title="Drag row" aria-label="Drag row">↕</span>');
  });

  const headerRow = table.querySelector("thead tr") || table.querySelector("tr");
  Array.from(headerRow?.children || []).forEach((cell, index) => {
    cell.insertAdjacentHTML("afterbegin", `<span class="table-drag-handle table-column-drag-handle" draggable="true" contenteditable="false" data-column-index="${index}" title="Drag column" aria-label="Drag column">↔</span>`);
  });
}
function moveTableColumn(table, fromIndex, toIndex) {
  if (!table || fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;
  table.querySelectorAll("tr").forEach(row => {
    const cells = Array.from(row.children);
    const moving = cells[fromIndex];
    const target = cells[toIndex];
    if (!moving || !target) return;
    if (fromIndex < toIndex) target.after(moving);
    else target.before(moving);
  });
  table.dataset.dragHandlesReady = "false";
  ensureTableDragHandles(table);
  saveProject();
  showToast("Column moved");
}
function handleTableDragStart(event) {
  const rowHandle = event.target.closest?.(".table-row-drag-handle");
  const columnHandle = event.target.closest?.(".table-column-drag-handle");
  if (!rowHandle && !columnHandle) return;
  event.stopPropagation();
  const table = event.target.closest("table");
  if (rowHandle) {
    draggedTableRow = rowHandle.closest("tr");
    draggedTableColumnIndex = -1;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", "table-row");
    draggedTableRow?.classList.add("table-dragging");
  } else {
    draggedTableRow = null;
    draggedTableColumnIndex = Number(columnHandle.dataset.columnIndex || 0);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", "table-column");
    table?.classList.add("table-dragging-column");
  }
}
function handleTableDragOver(event) {
  if (!draggedTableRow && draggedTableColumnIndex < 0) return;
  const table = event.target.closest?.("table");
  if (!table) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}
function handleTableDrop(event) {
  const table = event.target.closest?.("table");
  if (!table) return;
  if (draggedTableRow) {
    const targetRow = event.target.closest("tr");
    if (targetRow && targetRow.parentElement === draggedTableRow.parentElement && targetRow !== draggedTableRow) {
      const rows = Array.from(targetRow.parentElement.children);
      if (rows.indexOf(draggedTableRow) < rows.indexOf(targetRow)) targetRow.after(draggedTableRow);
      else targetRow.before(draggedTableRow);
      table.dataset.dragHandlesReady = "false";
      ensureTableDragHandles(table);
      saveProject();
      showToast("Row moved");
    }
  } else if (draggedTableColumnIndex >= 0) {
    const targetCell = event.target.closest("th,td");
    const targetIndex = targetCell ? Array.from(targetCell.parentElement.children).indexOf(targetCell) : -1;
    if (targetIndex >= 0) moveTableColumn(table, draggedTableColumnIndex, targetIndex);
  }
  handleTableDragEnd(event);
}
function handleTableDragEnd(event) {
  document.querySelectorAll(".table-dragging").forEach(el => el.classList.remove("table-dragging"));
  document.querySelectorAll(".table-dragging-column").forEach(el => el.classList.remove("table-dragging-column"));
  draggedTableRow = null;
  draggedTableColumnIndex = -1;
}

function handleEditorKeydown(event) {
  if (handleBlockDropdownKeydown(event)) return;
  if (handleSlashMenuKey(event)) return;
  if (maybeAutoCreateList(event)) return;
  if (event.key === "Tab") {
    const li = getCurrentListItem();
    if (li) {
      event.preventDefault();
      if (event.shiftKey) outdentCurrentListItem();
      else indentCurrentListItem();
    }
    return;
  }
  if (event.key !== "Enter") return;
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  let node = selection.getRangeAt(0).commonAncestorContainer;
  if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
  const pre = node?.closest?.("pre");
  if (!pre || !els.visualEditor.contains(pre)) return;
  const text = pre.textContent || "";
  if (text.endsWith("\n") || text.trim() === "") {
    event.preventDefault();
    const paragraph = document.createElement("p");
    paragraph.innerHTML = "<br>";
    pre.closest(".code-block, .docsy-code-block")?.insertAdjacentElement("afterend", paragraph) || pre.insertAdjacentElement("afterend", paragraph);
    const range = document.createRange();
    range.setStart(paragraph, 0);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    saveSelection();
    saveProject();
  }
}
function autoLinkCurrentText(event) {
  const shouldAutolink = event?.inputType === "insertParagraph" || (event?.inputType === "insertText" && /\s/.test(event.data || ""));
  if (!shouldAutolink) return;
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const node = range.startContainer;
  if (node.nodeType !== Node.TEXT_NODE) return;
  const before = node.textContent.slice(0, range.startOffset);
  const match = before.match(/(https?:\/\/[^\s<]+)(\s*)$/i);
  if (!match) return;
  const url = match[1];
  const trailingWhitespace = match[2] || "";
  if (!isUrl(url)) return;

  const start = range.startOffset - trailingWhitespace.length - url.length;
  const end = start + url.length;
  const linkRange = range.cloneRange();
  linkRange.setStart(node, start);
  linkRange.setEnd(node, end);
  linkRange.deleteContents();

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.textContent = url;
  linkRange.insertNode(anchor);

  const newRange = document.createRange();
  const afterAnchor = anchor.nextSibling;
  if (trailingWhitespace && afterAnchor?.nodeType === Node.TEXT_NODE) newRange.setStart(afterAnchor, Math.min(afterAnchor.textContent.length, trailingWhitespace.length));
  else newRange.setStartAfter(anchor);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);
  saveSelection();
}
function insertInlineHtmlAtCursor(html, options = {}) {
  const fragment = document.createRange().createContextualFragment(html);
  const insertedNodes = Array.from(fragment.childNodes);
  if (!insertedNodes.length) return false;

  restoreSelection({ ...options, allowOldSelection: options.allowOldSelection ?? false });
  const selection = window.getSelection();
  if (!selection.rangeCount) return false;
  const range = selection.getRangeAt(0);
  if (!els.visualEditor.contains(range.commonAncestorContainer)) return false;

  const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ? range.commonAncestorContainer.parentElement : range.commonAncestorContainer;
  if (container?.closest?.("input, textarea, select, button, .block-settings, .block-dropdown")) return false;

  range.deleteContents();
  range.insertNode(fragment);

  const lastNode = insertedNodes[insertedNodes.length - 1];
  const newRange = document.createRange();
  newRange.setStartAfter(lastNode);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);
  savedRange = newRange.cloneRange();
  lastSelectionSavedAt = Date.now();

  normalizeEditorContent(lastNode.parentElement || els.visualEditor);
  updateEditorPlaceholder();
  saveProject();
  return true;
}
function createLinkAtSelection(url) {
  const cleanUrl = String(url || "").trim();
  if (!cleanUrl) return false;
  restoreSelection();
  const selection = window.getSelection();
  if (!selection.rangeCount) return false;
  const range = selection.getRangeAt(0);
  if (!els.visualEditor.contains(range.commonAncestorContainer)) return false;

  const container = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ? range.commonAncestorContainer.parentElement : range.commonAncestorContainer;
  if (container?.closest?.("input, textarea, select, button, .block-settings, .block-dropdown")) return false;

  const anchor = document.createElement("a");
  anchor.href = cleanUrl;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";

  if (range.collapsed) {
    anchor.textContent = cleanUrl;
    range.insertNode(anchor);
  } else {
    const selected = range.extractContents();
    anchor.appendChild(selected);
    if (!anchor.textContent.trim()) anchor.textContent = cleanUrl;
    range.insertNode(anchor);
  }

  const newRange = document.createRange();
  newRange.setStartAfter(anchor);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);
  savedRange = newRange.cloneRange();
  lastSelectionSavedAt = Date.now();
  normalizeEditorContent(anchor.parentElement || els.visualEditor);
  saveProject();
  return true;
}
async function handlePaste(event) {
  const source = getImageSourceFromClipboard(event);
  if ((source?.type === "file" && source.value) || (source?.type === "text" && /^data:image\//i.test(source.value))) {
    event.preventDefault();
    await uploadAndInsertPastedImage(source);
    return;
  }
  const text = source?.type === "text" ? source.value : (event.clipboardData?.getData("text/plain") || "");
  if (isImageUrl(text)) {
    event.preventDefault();
    insertHtmlAtCursor(imageHtml(text, guessAltTextFromUrl(text), "Optional caption"));
    showToast("Image inserted from URL");
    return;
  }
  if (isUrl(text)) {
    event.preventDefault();
    const linkHtml = `<a href="${escapeHtml(text)}" target="_blank" rel="noreferrer">${escapeHtml(text)}</a>&nbsp;`;
    if (!insertInlineHtmlAtCursor(linkHtml, { allowOldSelection: false })) {
      insertHtmlAtCursor(`<p>${linkHtml}</p>`, { allowOldSelection: false });
    }
  }
}

function closeAllBlockDropdowns(except = null) {
  document.querySelectorAll(".block-dropdown.open").forEach(dropdown => {
    if (dropdown === except) return;
    dropdown.classList.remove("open");
    dropdown.querySelector(".block-dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
}
function refreshBlockDropdown(dropdown, value) {
  const type = dropdown.dataset.dropdownType;
  const options = type === "alert" ? ALERTS.map(([v, label]) => [v, label]) : LANGUAGES;
  const label = optionLabel(options, value);
  dropdown.dataset.value = value;
  const labelNode = dropdown.querySelector(".block-dropdown-toggle span");
  if (labelNode) labelNode.textContent = label;
  dropdown.querySelectorAll(".block-dropdown-menu button").forEach(button => button.setAttribute("aria-selected", button.dataset.value === value ? "true" : "false"));
}
function ensureBlockDropdown(block, type) {
  const label = block.querySelector(".block-settings label");
  if (!label) return;
  let dropdown = label.querySelector(`.block-dropdown[data-dropdown-type="${type}"]`);
  const nativeSelect = type === "alert" ? label.querySelector("select.alert-color") : label.querySelector("select.code-language");
  const value = nativeSelect?.value || (type === "alert" ? (block.dataset.color || "info") : (block.dataset.language || "text"));
  if (!dropdown) {
    if (nativeSelect) nativeSelect.remove();
    label.insertAdjacentHTML("beforeend", type === "alert" ? alertDropdownHtml(value) : languageDropdownHtml(value));
    dropdown = label.querySelector(`.block-dropdown[data-dropdown-type="${type}"]`);
  }
  refreshBlockDropdown(dropdown, value);
}
function applyBlockDropdownValue(dropdown, value) {
  const block = dropdown.closest(".code-block, .docsy-code-block, .docsy-alert-block, .markdown-alert-block");
  if (!block) return;
  if (dropdown.dataset.dropdownType === "language") {
    block.dataset.language = value;
    refreshBlockDropdown(dropdown, value);
  } else {
    const previousColor = block.dataset.color || "info";
    block.dataset.color = value;
    refreshBlockDropdown(dropdown, value);
    refreshAlertBlockAppearance(block, previousColor);
  }
  closeAllBlockDropdowns();
  saveProject();
}
function handleBlockDropdownClick(event) {
  const toggle = event.target.closest(".block-dropdown-toggle");
  const option = event.target.closest(".block-dropdown-menu button");
  if (!toggle && !option) return false;
  const dropdown = event.target.closest(".block-dropdown");
  if (!dropdown) return false;
  event.preventDefault();
  event.stopPropagation();
  if (toggle) {
    const isOpen = dropdown.classList.contains("open");
    closeAllBlockDropdowns(dropdown);
    dropdown.classList.toggle("open", !isOpen);
    toggle.setAttribute("aria-expanded", !isOpen ? "true" : "false");
    return true;
  }
  if (option) applyBlockDropdownValue(dropdown, option.dataset.value);
  return true;
}
function handleBlockDropdownKeydown(event) {
  const dropdown = event.target.closest?.(".block-dropdown");
  if (!dropdown) return false;
  if (!["ArrowDown", "ArrowUp", "Enter", " ", "Escape"].includes(event.key)) return false;
  event.preventDefault();
  event.stopPropagation();
  const buttons = Array.from(dropdown.querySelectorAll(".block-dropdown-menu button"));
  const selectedIndex = Math.max(0, buttons.findIndex(button => button.getAttribute("aria-selected") === "true"));
  if (event.key === "Escape") { closeAllBlockDropdowns(); return true; }
  if (!dropdown.classList.contains("open")) {
    dropdown.classList.add("open");
    dropdown.querySelector(".block-dropdown-toggle")?.setAttribute("aria-expanded", "true");
    buttons[selectedIndex]?.focus();
    return true;
  }
  if (event.key === "Enter" || event.key === " ") {
    const active = document.activeElement?.closest?.(".block-dropdown-menu button");
    applyBlockDropdownValue(dropdown, active?.dataset.value || buttons[selectedIndex]?.dataset.value);
    dropdown.querySelector(".block-dropdown-toggle")?.focus();
    return true;
  }
  const nextIndex = event.key === "ArrowDown" ? (selectedIndex + 1) % buttons.length : (selectedIndex - 1 + buttons.length) % buttons.length;
  refreshBlockDropdown(dropdown, buttons[nextIndex].dataset.value);
  buttons[nextIndex]?.focus();
  return true;
}

function syncSelectSelectedAttributes(select) {
  Array.from(select.options).forEach(option => {
    if (option.value === select.value) option.setAttribute("selected", "selected");
    else option.removeAttribute("selected");
  });
}
function ensureAlertTitleInput(block) {
  if (!block?.classList?.contains("docsy-alert-block")) return;
  const settings = block.querySelector(".block-settings");
  if (!settings) return;
  const color = block.dataset.color || "info";
  let input = settings.querySelector("input.alert-title");
  const title = String(input?.value || input?.getAttribute("value") || block.dataset.title || getDefaultDocsyAlertTitle(color)).trim() || getDefaultDocsyAlertTitle(color);
  block.dataset.title = title;
  if (!input) {
    settings.insertAdjacentHTML("beforeend", alertTitleInputHtml(color, title));
    input = settings.querySelector("input.alert-title");
  }
  if (input) {
    input.value = title;
    input.setAttribute("value", title);
    input.placeholder = getDefaultDocsyAlertTitle(color);
    input.contentEditable = "false";
  }
}
function refreshAlertBlockAppearance(block, previousColor = null) {
  const color = block.dataset.color || "info";
  const label = ALERTS.find(([value]) => value === color)?.[1] || "Info";
  const title = block.classList.contains("docsy-alert-block") ? `Docsy ${label}` : `Markdown ${label}`;
  const titleNode = block.querySelector(".block-settings span");
  const icon = titleNode?.querySelector("i")?.outerHTML || "";
  if (titleNode) titleNode.innerHTML = `${icon} ${escapeHtml(title)}`;
  const base = block.classList.contains("docsy-alert-block") ? "docsy-alert-block" : "markdown-alert-block";
  block.className = `${base} editable-card alert-${color}`;

  if (base === "docsy-alert-block") {
    ensureAlertTitleInput(block);
    const input = block.querySelector(".alert-title");
    const currentTitle = String(input?.value || block.dataset.title || "").trim();
    const previousDefault = getDefaultDocsyAlertTitle(previousColor || color);
    const shouldUseNewDefault = previousColor ? (!currentTitle || currentTitle === previousDefault) : !currentTitle;
    if (shouldUseNewDefault) {
      const nextTitle = getDefaultDocsyAlertTitle(color);
      block.dataset.title = nextTitle;
      if (input) {
        input.value = nextTitle;
        input.setAttribute("value", nextTitle);
      }
    }
    if (input) input.placeholder = getDefaultDocsyAlertTitle(color);
  }
}

function bindEmbeddedSelect(select) {
  if (select.dataset.boundSelect === "true") return;
  select.dataset.boundSelect = "true";
  select.contentEditable = "false";
  select.tabIndex = 0;
  const stop = event => { event.stopPropagation(); };
  ["pointerdown", "pointerup", "mousedown", "mouseup", "click", "focus"].forEach(type => select.addEventListener(type, stop));
  select.addEventListener("keydown", event => {
    event.stopPropagation();
  });
  select.addEventListener("change", event => {
    if (event.currentTarget.matches(".code-language")) updateCodeLanguageSelect(event.currentTarget);
    if (event.currentTarget.matches(".alert-color")) updateAlertColorSelect(event.currentTarget);
  });
}

function updateCodeLanguageSelect(select) {
  const block = select.closest(".code-block, .docsy-code-block");
  if (!block) return;
  block.dataset.language = select.value;
  syncSelectSelectedAttributes(select);
  saveProject();
}
function updateAlertColorSelect(select) {
  const block = select.closest(".docsy-alert-block, .markdown-alert-block");
  if (!block) return;
  block.dataset.color = select.value;
  syncSelectSelectedAttributes(select);
  refreshAlertBlockAppearance(block);
  saveProject();
}

els.editorBtn.addEventListener("click", () => setView("editor"));
els.codeBtn.addEventListener("click", () => setView("markdown"));
els.postInfoBtn.addEventListener("click", () => { fillPostInfoForm(); els.metadataDrawer.classList.add("open"); });
els.blobSettingsBtn?.addEventListener("click", openBlobSettingsPanel);
els.closePostInfoBtn.addEventListener("click", () => els.metadataDrawer.classList.remove("open"));
els.savePostInfoBtn.addEventListener("click", savePostInfoForm);
els.fmTitle.addEventListener("input", () => {
  const title = els.fmTitle.value.trim();
  if (!els.fmSlug.value.trim() || els.fmSlug.dataset.autogenerated === "true") {
    els.fmSlug.value = slugify(title);
    els.fmSlug.dataset.autogenerated = "true";
  }
  if (title) {
    state.projectName = title;
    state.metadata.title = title;
    state.metadata.slug = els.fmSlug.value.trim() || slugify(title);
    els.projectName.value = title;
    syncMarkdownEditorFrontMatter();
  }
});
els.fmSlug.addEventListener("input", () => { els.fmSlug.dataset.autogenerated = "false"; });
els.importBtn?.addEventListener("click", () => els.importFile?.click());
els.importFile?.addEventListener("change", event => {
  importMarkdownFile(event.target.files?.[0]);
  event.target.value = "";
});
els.exportBtn.addEventListener("click", exportMarkdown);
els.resetBtn.addEventListener("click", resetProject);
els.projectName.addEventListener("input", () => {
  setMetadataTitleFromProjectName();
  saveProject();
});
els.editorToolbar.addEventListener("pointerdown", () => saveSelection());
els.headingSelect.addEventListener("change", event => setHeading(event.target.value));
els.visualEditor.addEventListener("beforeinput", clearEditorPlaceholderBeforeInput);
els.visualEditor.addEventListener("input", event => {
  if (maybeAutoCreateListAfterInput(event)) {
    updateSlashMenu();
    updateEditorPlaceholder();
    updateTableToolbarVisibility();
    return;
  }
  autoLinkCurrentText(event);
  updateSlashMenu();
  scheduleNormalizeEditorContent(event.target);
  updateEditorPlaceholder();
  updateTableToolbarVisibility();
  saveProject();
});
els.visualEditor.addEventListener("keydown", handleEditorKeydown);
els.visualEditor.addEventListener("keyup", event => {
  saveSelection();
  updateTableToolbarVisibility();
  if (["ArrowDown", "ArrowUp", "Enter", "Tab", "Escape"].includes(event.key)) return;
  updateSlashMenu();
});
els.visualEditor.addEventListener("mouseup", () => { saveSelection(); updateTableToolbarVisibility(); });
els.visualEditor.addEventListener("focus", () => { saveSelection(); updateTableToolbarVisibility(); });
els.visualEditor.addEventListener("paste", handlePaste);
els.imagePanel.addEventListener("paste", handleImagePanelPaste);
function updateAlertTitleInput(input) {
  const block = input?.closest?.(".docsy-alert-block");
  if (!block) return;
  const title = String(input.value || "").trim();
  block.dataset.title = title || getDefaultDocsyAlertTitle(block.dataset.color || "info");
  input.setAttribute("value", input.value);
  saveProject();
}
els.visualEditor.addEventListener("input", event => {
  if (event.target.matches(".code-language")) updateCodeLanguageSelect(event.target);
  if (event.target.matches(".alert-color")) updateAlertColorSelect(event.target);
  if (event.target.matches(".alert-title")) updateAlertTitleInput(event.target);
});
els.visualEditor.addEventListener("change", event => {
  if (event.target.matches(".code-language")) updateCodeLanguageSelect(event.target);
  if (event.target.matches(".alert-color")) updateAlertColorSelect(event.target);
  if (event.target.matches(".alert-title")) updateAlertTitleInput(event.target);
});
els.visualEditor.addEventListener("click", event => {
  if (handleBlockDropdownClick(event)) return;
  const removeButton = event.target.closest(".block-remove-button");
  if (removeButton) {
    event.preventDefault();
    event.stopPropagation();
    const block = getManagedBlockHost(removeButton);
    if (block) {
      block.remove();
      saveProject();
      showToast("Block removed");
    }
    return;
  }
  const editButton = event.target.closest(".block-edit-button");
  if (editButton) {
    event.preventDefault();
    event.stopPropagation();
    const block = getManagedBlockHost(editButton);
    if (isImageHost(block)) {
      openImagePanel({ editFigure: block, anchorBlock: block, allowOldSelection: true });
      return;
    }
    if (isButtonHost(block)) {
      const anchor = block.querySelector(':scope > a.btn');
      if (isDocsyGitHubButtonAnchor(anchor)) {
        openGitHubButtonPanel({ editAnchor: anchor, anchorBlock: block, allowOldSelection: true });
      } else {
        openButtonPanel({ editAnchor: anchor, anchorBlock: block, allowOldSelection: true });
      }
      return;
    }
    if (isTableHost(block)) {
      openTablePanel({ editTable: block, anchorBlock: block, allowOldSelection: true });
      return;
    }
    if (block?.matches?.('.quiz-card[data-quiz="true"]')) {
      openQuizPanel({ editCard: block, anchorBlock: block, allowOldSelection: true });
      return;
    }
    if (block?.matches?.('.raw-html-card[data-youtube="true"], .youtube-card')) {
      openYoutubePanel({ editCard: block, anchorBlock: block, allowOldSelection: true });
      return;
    }
    if (block?.matches?.('.raw-html-card[data-iframe="true"], .iframe-card')) {
      openIframePanel({ editCard: block, anchorBlock: block, allowOldSelection: true });
      return;
    }
    if (block?.matches?.('.raw-html-card[data-drawio="true"]')) {
      openDrawioPanel({ editCard: block, anchorBlock: block, allowOldSelection: true });
      return;
    }
    const textarea = block?.querySelector?.('textarea');
    const editable = textarea || block?.querySelector?.('[contenteditable="true"]');
    editable?.focus?.();
    return;
  }
  updateTableToolbarVisibility();
  const anchor = event.target.closest("a");
  if (anchor?.classList.contains("btn") && !event.ctrlKey && !event.metaKey) {
    event.preventDefault();
    event.stopPropagation();
    if (isDocsyGitHubButtonAnchor(anchor)) {
      openGitHubButtonPanel({ editAnchor: anchor, anchorBlock: anchor.closest("p") || null, allowOldSelection: true });
    } else {
      openButtonPanel({ editAnchor: anchor, anchorBlock: anchor.closest("p") || null, allowOldSelection: true });
    }
    return;
  }
  if (anchor && (event.ctrlKey || event.metaKey || anchor.classList.contains("image-link"))) window.open(anchor.href, "_blank", "noopener");
});
els.visualEditor.addEventListener("dragstart", handleTableDragStart);
els.visualEditor.addEventListener("dragover", handleTableDragOver);
els.visualEditor.addEventListener("drop", handleTableDrop);
els.visualEditor.addEventListener("dragend", handleTableDragEnd);
els.markdownEditor.addEventListener("input", () => {
  const normalized = normalizeMarkdownListSpacing(els.markdownEditor.value);
  if (normalized !== els.markdownEditor.value) {
    const start = els.markdownEditor.selectionStart;
    const end = els.markdownEditor.selectionEnd;
    els.markdownEditor.value = normalized;
    els.markdownEditor.setSelectionRange(Math.min(start, normalized.length), Math.min(end, normalized.length));
  }
  state.markdownCache = els.markdownEditor.value;
  const { frontMatter } = splitMarkdownFrontMatter(els.markdownEditor.value);
  rememberRawFrontMatter(frontMatter);
  applyParsedFrontMatter(frontMatter);
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    els.saveStatus.textContent = "Saved at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, 120);
});
els.editorToolbar.querySelectorAll("button[data-format]").forEach(button => button.addEventListener("click", () => execFormat(button.dataset.format)));
els.cancelImageBtn.addEventListener("click", () => { els.imagePanel.classList.remove("open"); pendingInsertAnchorBlock = null; if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove(); pendingInsertMarker = null; pendingImageEditFigure = null; });
els.insertImageBtn.addEventListener("click", insertImageFromPanel);
els.cancelButtonBtn.addEventListener("click", () => { els.buttonPanel.classList.remove("open"); pendingInsertAnchorBlock = null; if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove(); pendingInsertMarker = null; pendingButtonEditAnchor = null; });
els.insertButtonBtn.addEventListener("click", saveButtonFromPanel);
els.cancelGithubButtonBtn.addEventListener("click", () => { els.githubButtonPanel.classList.remove("open"); pendingInsertAnchorBlock = null; if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove(); pendingInsertMarker = null; pendingGitHubButtonEditAnchor = null; });
els.insertGithubButtonBtn.addEventListener("click", saveGitHubButtonFromPanel);
els.imageUrl.addEventListener("input", () => {
  if (!els.imageAlt.value.trim()) els.imageAlt.value = guessAltTextFromUrl(els.imageUrl.value);
  if (!els.imageLink.value.trim() || els.imageLink.value.trim() === els.imageLink.dataset.autoValue) {
    els.imageLink.value = els.imageUrl.value.trim();
    els.imageLink.dataset.autoValue = els.imageUrl.value.trim();
  }
});
els.uploadImageFileBtn?.addEventListener("click", () => {
  if (!isBlobUploadConfigured()) {
    openBlobSettingsPanel();
    showToast("Set blob settings first");
    return;
  }
  els.imageUploadFile?.click();
});
els.imageUploadFile?.addEventListener("change", event => {
  uploadImageFileFromPanel(event.target.files?.[0]);
  event.target.value = "";
});
els.imagePanel.addEventListener("click", event => { if (event.target === els.imagePanel) { els.imagePanel.classList.remove("open"); pendingInsertAnchorBlock = null; if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove(); pendingInsertMarker = null; pendingImageEditFigure = null; } });
els.imagePanel.addEventListener("keydown", handlePanelKeydown);
els.connectBlobBtn?.addEventListener("click", connectBlobStorage);
els.loadBlobFoldersBtn?.addEventListener("click", () => loadBlobFoldersFromForm(false));
els.blobContainer?.addEventListener("change", () => loadBlobFoldersFromForm(false));
els.cancelBlobSettingsBtn?.addEventListener("click", closeBlobSettingsPanel);
els.saveBlobSettingsBtn?.addEventListener("click", saveBlobSettingsFromForm);
els.clearBlobSettingsBtn?.addEventListener("click", clearBlobSettings);
els.blobSettingsPanel?.addEventListener("click", event => { if (event.target === els.blobSettingsPanel) closeBlobSettingsPanel(); });
els.blobSettingsPanel?.addEventListener("keydown", handlePanelKeydown);
els.buttonPanel.addEventListener("click", event => { if (event.target === els.buttonPanel) { els.buttonPanel.classList.remove("open"); pendingInsertAnchorBlock = null; if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove(); pendingInsertMarker = null; pendingButtonEditAnchor = null; } });
els.buttonPanel.addEventListener("keydown", handlePanelKeydown);
els.githubButtonPanel.addEventListener("click", event => { if (event.target === els.githubButtonPanel) { els.githubButtonPanel.classList.remove("open"); pendingInsertAnchorBlock = null; if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove(); pendingInsertMarker = null; pendingGitHubButtonEditAnchor = null; } });
els.githubButtonPanel.addEventListener("keydown", handlePanelKeydown);
els.cancelTableBtn.addEventListener("click", () => { els.tablePanel.classList.remove("open"); pendingInsertAnchorBlock = null; if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove(); pendingInsertMarker = null; pendingTableEditTarget = null; els.insertTableBtn.textContent = "Insert table"; });
els.insertTableBtn.addEventListener("click", insertTableFromPanel);
els.tablePanel.addEventListener("click", event => { if (event.target === els.tablePanel) { els.tablePanel.classList.remove("open"); pendingInsertAnchorBlock = null; if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove(); pendingInsertMarker = null; pendingTableEditTarget = null; els.insertTableBtn.textContent = "Insert table"; } });
els.tablePanel.addEventListener("keydown", handlePanelKeydown);
els.cancelDrawioBtn.addEventListener("click", () => { els.drawioPanel.classList.remove("open"); pendingInsertAnchorBlock = null; if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove(); pendingInsertMarker = null; pendingDrawioEditCard = null; els.insertDrawioBtn.textContent = "Insert draw.io"; });
els.insertDrawioBtn.addEventListener("click", saveDrawioFromPanel);
els.drawioPanel.addEventListener("click", event => { if (event.target === els.drawioPanel) { els.drawioPanel.classList.remove("open"); pendingInsertAnchorBlock = null; if (pendingInsertMarker && pendingInsertMarker.isConnected) pendingInsertMarker.remove(); pendingInsertMarker = null; pendingDrawioEditCard = null; els.insertDrawioBtn.textContent = "Insert draw.io"; } });
els.drawioPanel.addEventListener("keydown", handlePanelKeydown);
els.cancelYoutubeBtn.addEventListener("click", () => { els.youtubePanel.classList.remove("open"); clearPendingPanelInsertion(); pendingYoutubeEditCard = null; els.insertYoutubeBtn.textContent = "Insert YouTube video"; });
els.insertYoutubeBtn.addEventListener("click", saveYoutubeFromPanel);
els.youtubePanel.addEventListener("click", event => { if (event.target === els.youtubePanel) { els.youtubePanel.classList.remove("open"); clearPendingPanelInsertion(); pendingYoutubeEditCard = null; els.insertYoutubeBtn.textContent = "Insert YouTube video"; } });
els.youtubePanel.addEventListener("keydown", handlePanelKeydown);
els.cancelIframeBtn.addEventListener("click", () => { els.iframePanel.classList.remove("open"); clearPendingPanelInsertion(); pendingIframeEditCard = null; els.insertIframeBtn.textContent = "Insert iframe"; });
els.insertIframeBtn.addEventListener("click", saveIframeFromPanel);
els.iframePanel.addEventListener("click", event => { if (event.target === els.iframePanel) { els.iframePanel.classList.remove("open"); clearPendingPanelInsertion(); pendingIframeEditCard = null; els.insertIframeBtn.textContent = "Insert iframe"; } });
els.iframePanel.addEventListener("keydown", handlePanelKeydown);
els.cancelQuizBtn.addEventListener("click", closeQuizPanel);
els.insertQuizBtn.addEventListener("click", saveQuizFromPanel);
els.addQuizQuestionBtn.addEventListener("click", () => {
  const data = collectQuizFormData();
  data.questions.push({
    question: "Add your question here",
    reference: "See the section: Section title",
    referenceUrl: "#section-title",
    answers: [
      { text: "Correct answer", correct: true, message: "Correct! This is the right answer." },
      { text: "Incorrect answer", correct: false, message: "Incorrect. Review the referenced section and try again." }
    ]
  });
  renderQuizForm(data);
});
els.quizQuestions.addEventListener("click", event => {
  const data = collectQuizFormData();
  const questionEl = event.target.closest(".quiz-question-editor");
  const qIndex = Number(questionEl?.dataset?.questionIndex || 0);
  if (event.target.closest(".quiz-add-answer")) {
    data.questions[qIndex].answers.push({ text: "New answer", correct: false, message: "Add feedback for this answer." });
    renderQuizForm(data);
    return;
  }
  if (event.target.closest(".quiz-remove-answer")) {
    const answerEl = event.target.closest(".quiz-answer-editor");
    const aIndex = Number(answerEl?.dataset?.answerIndex || 0);
    if (data.questions[qIndex].answers.length <= 2) { showToast("A question needs at least two answers"); return; }
    data.questions[qIndex].answers.splice(aIndex, 1);
    if (!data.questions[qIndex].answers.some(answer => answer.correct)) data.questions[qIndex].answers[0].correct = true;
    renderQuizForm(data);
    return;
  }
  if (event.target.closest(".quiz-remove-question")) {
    if (data.questions.length <= 1) { showToast("A quiz needs at least one question"); return; }
    data.questions.splice(qIndex, 1);
    renderQuizForm(data);
  }
});
els.quizPanel.addEventListener("click", event => { if (event.target === els.quizPanel) closeQuizPanel(); });
els.quizPanel.addEventListener("keydown", handleQuizPanelKeydown);
document.addEventListener("keydown", event => {
  const active = document.activeElement;
  if (els.slashMenu.classList.contains("open") && (selectionInsideEditor() || els.visualEditor.contains(active) || els.slashMenu.contains(active) || active === document.body)) {
    if (handleSlashMenuKey(event)) return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") { event.preventDefault(); saveProject(); showToast("Project saved"); }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") { event.preventDefault(); exportMarkdown(); }
});
document.addEventListener("click", event => {
  if (!event.target.closest?.(".block-dropdown")) closeAllBlockDropdowns();
  if (!els.slashMenu.contains(event.target) && !els.visualEditor.contains(event.target)) hideSlashMenu();
});
document.addEventListener("selectionchange", () => {
  if (selectionInsideEditor()) { syncHeadingSelect(); updateTableToolbarVisibility(); }
  else updateTableToolbarVisibility();
});

loadProject();
render();
setupDragDrop();
