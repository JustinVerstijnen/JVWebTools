const STORAGE_KEY = "markdown-editor-project-v10";
const PREVIOUS_STORAGE_KEYS = ["markdown-editor-project-v9", "markdown-editor-project-v8", "markdown-editor-project-v7", "markdown-editor-project-v6", "markdown-editor-project-v5", "markdown-editor-project-v4", "markdown-editor-project-v3", "markdown-editor-project-v2"];

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

const els = {
  editorBtn: document.getElementById("editorBtn"),
  codeBtn: document.getElementById("codeBtn"),
  postInfoBtn: document.getElementById("postInfoBtn"),
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
  fmDate: document.getElementById("fmDate"),
  fmDescription: document.getElementById("fmDescription"),
  fmTags: document.getElementById("fmTags"),
  fmCategories: document.getElementById("fmCategories"),
  fmWeight: document.getElementById("fmWeight"),
  fmType: document.getElementById("fmType"),
  fmHidden: document.getElementById("fmHidden"),
  imagePanel: document.getElementById("imagePanel"),
  imageUrl: document.getElementById("imageUrl"),
  imageAlt: document.getElementById("imageAlt"),
  cancelImageBtn: document.getElementById("cancelImageBtn"),
  insertImageBtn: document.getElementById("insertImageBtn"),
  tablePanel: document.getElementById("tablePanel"),
  tableColumns: document.getElementById("tableColumns"),
  tableRows: document.getElementById("tableRows"),
  tableAlign: document.getElementById("tableAlign"),
  cancelTableBtn: document.getElementById("cancelTableBtn"),
  insertTableBtn: document.getElementById("insertTableBtn"),
  slashMenu: document.getElementById("slashMenu"),
  toast: document.getElementById("toast")
};

const state = {
  view: "editor",
  projectName: "markdown-page",
  html: "",
  markdownCache: "",
  metadata: {
    title: "New Markdown page",
    date: new Date().toISOString().slice(0, 10),
    description: "",
    tags: [],
    categories: [],
    weight: "",
    type: "docs",
    hidden: "false"
  }
};

let savedRange = null;
let saveTimer = null;
let slashMatches = [];
let activeSlashIndex = 0;
let slashRange = null;
let lastSelectionSavedAt = 0;
let pendingPanelInsertOptions = {};
let pendingInsertAnchorBlock = null;
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
function iconClass(block) { return block.icon.includes("fa-brands") ? block.icon : "fa-solid " + block.icon; }
function splitList(value) { return String(value || "").split(",").map(item => item.trim()).filter(Boolean); }
function yamlEscape(value) { return String(value || "").replace(/\\/g, "\\\\").replace(/"/g, "\\\""); }
function listToYaml(items) {
  const clean = (Array.isArray(items) ? items : splitList(items)).filter(Boolean);
  return clean.length ? "[" + clean.map(item => `\"${yamlEscape(item)}\"`).join(", ") + "]" : "[]";
}
function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 1800);
}
function isUrl(value) { return /^https?:\/\/[^\s<]+$/i.test(value.trim()); }
function isImageUrl(value) { return /^https?:\/\/\S+\.(png|jpe?g|gif|webp|svg)(\?\S*)?$/i.test(value.trim()); }
function languageOptions(selected = "powershell") {
  return LANGUAGES.map(([value, label]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`).join("");
}
function alertOptions(selected = "info") {
  return ALERTS.map(([value, label]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`).join("");
}

function optionLabel(options, selected) {
  return (options.find(([value]) => value === selected) || options[0] || [selected, selected])[1];
}
function blockDropdownHtml(type, options, selected) {
  const label = optionLabel(options, selected);
  const items = options.map(([value, text]) => `<button type="button" role="option" data-value="${escapeHtml(value)}" aria-selected="${value === selected ? "true" : "false"}">${escapeHtml(text)}</button>`).join("");
  return `<div class="block-dropdown" contenteditable="false" data-dropdown-type="${escapeHtml(type)}" data-value="${escapeHtml(selected)}"><button type="button" class="block-dropdown-toggle" aria-haspopup="listbox" aria-expanded="false"><span>${escapeHtml(label)}</span></button><div class="block-dropdown-menu" role="listbox">${items}</div></div>`;
}
function languageDropdownHtml(selected = "powershell") { return blockDropdownHtml("language", LANGUAGES, selected); }
function alertDropdownHtml(selected = "info") { return blockDropdownHtml("alert", ALERTS.map(([value, label]) => [value, label]), selected); }

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
  return shortcodeCard("Docsy Raw HTML", `{{< rawhtml >}}
${html}
{{< /rawhtml >}}`);
}
function alertBlockHtml(kind = "markdown", color = "info", text = "") {
  const label = ALERTS.find(([value]) => value === color)?.[1] || "Info";
  const cls = kind === "docsy" ? "docsy-alert-block" : "markdown-alert-block";
  const title = kind === "docsy" ? `Docsy ${label}` : `Markdown ${label}`;
  const icon = kind === "docsy" ? "fa-triangle-exclamation" : "fa-bell";
  return `<div class="${cls} editable-card alert-${escapeHtml(color)}" contenteditable="false" data-color="${escapeHtml(color)}"><div class="block-settings" contenteditable="false"><span><i class="fa-solid ${icon}"></i> ${escapeHtml(title)}</span><label>Type ${alertDropdownHtml(color)}</label></div><div class="alert-content" contenteditable="true">${escapeHtml(text)}</div></div><p><br></p>`;
}
function shortcodeCard(title, shortcode) {
  return `<div class="shortcode-card editable-card" data-shortcode="true" contenteditable="false"><div class="block-settings"><span><i class="fa-solid fa-cube"></i> ${escapeHtml(title)}</span></div><textarea>${escapeHtml(shortcode)}</textarea></div><p><br></p>`;
}
function imageHtml(src, alt = "Image", caption = "Optional caption") {
  return `<figure class="image-block" data-resizable="true"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"><figcaption contenteditable="true">${escapeHtml(caption)}</figcaption></figure><p><br></p>`;
}
function guessAltTextFromUrl(url = "") {
  const clean = String(url || "").trim().split("#")[0].split("?")[0];
  const file = clean.split("/").filter(Boolean).pop() || "";
  return file ? decodeURIComponent(file) : "Image";
}
function tableHtml(cols = 3, rows = 3, align = "left") {
  cols = Math.max(1, Math.min(12, Number(cols) || 3));
  rows = Math.max(1, Math.min(30, Number(rows) || 3));
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
  { id: "ul", command: "/ul", icon: "fa-list-ul", category: "Lists", sidebar: true, name: "Bullet list", description: "Unordered Markdown list", html: "<ul><li><br></li></ul><p><br></p>" },
  { id: "ol", command: "/ol", icon: "fa-list-ol", category: "Lists", sidebar: true, name: "Numbered list", description: "Ordered Markdown list", html: "<ol><li><br></li></ol><p><br></p>" },
  { id: "checklist", command: "/checklist", icon: "fa-square-check", category: "Lists", sidebar: true, name: "Checklist", description: "Markdown task list", html: "<ul data-checklist=\"true\"><li><input type=\"checkbox\"> </li></ul><p><br></p>" },
  { id: "link", command: "/link", icon: "fa-link", category: "Content", sidebar: true, name: "Link", description: "Clickable link opening in a new tab", html: "<p><a href=\"https://example.com\" target=\"_blank\" rel=\"noreferrer\">https://example.com</a></p>" },
  { id: "image", command: "/image", icon: "fa-image", category: "Media", sidebar: true, name: "Image", description: "Insert an image at the cursor", action: "image" },
  { id: "table", command: "/table", icon: "fa-table", category: "Content", sidebar: true, name: "Table", description: "Choose columns, body rows and alignment", action: "table" },
  { id: "separator", command: "/separator", icon: "fa-minus", category: "Content", sidebar: true, name: "Separator", description: "Horizontal divider", html: "<hr><p><br></p>" },
  { id: "button", command: "/button", icon: "fa-square-up-right", category: "Content", sidebar: true, name: "Button", description: "Bootstrap / Docsy style link", html: "<p><a class=\"btn btn-primary btn-lg\" href=\"/docs/\" target=\"_blank\" rel=\"noreferrer\">Read the documentation</a></p>" },
  { id: "buttondocsy", command: "/buttondocsy", icon: "fa-square-up-right", category: "Docsy", sidebar: true, name: "Docsy Button", description: "Insert a website styled Docsy button", html: "<p><a class=\"btn btn-primary\" href=\"/blog/\">Go back to Blog homepage</a></p>" },
  { id: "code", command: "/code", icon: "fa-code", category: "Code", sidebar: true, name: "Code", description: "Generic fenced code block", html: codeBlockHtml() },
  { id: "codedocsy", command: "/codedocsy", icon: "fa-file-code", category: "Docsy", sidebar: true, name: "Docsy Code", description: "Docsy card code shortcode", html: docsyCodeBlockHtml() },
  { id: "html", command: "/html", icon: "fa-brands fa-html5", category: "Code", sidebar: true, name: "HTML", description: "HTML code block", html: htmlBlockHtml() },
  { id: "htmldocsy", command: "/htmldocsy", icon: "fa-brands fa-html5", category: "Docsy", sidebar: true, name: "Docsy Raw HTML", description: "Insert raw HTML shortcode", html: rawHtmlDocsyBlockHtml() },
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
  { id: "pageinfo", command: "/pageinfo", icon: "fa-circle-info", category: "Docsy", sidebar: true, name: "Docsy Pageinfo", description: "Docsy page info block", html: shortcodeCard("Docsy Pageinfo", "{{% pageinfo color=\"primary\" %}}\nThis page contains extra context.\n{{% /pageinfo %}}") },
  { id: "tabpane", command: "/tabpane", icon: "fa-folder-tree", category: "Docsy", sidebar: true, name: "Docsy Tabpane", description: "Docsy tabs shortcode", html: shortcodeCard("Docsy Tabpane", "{{< tabpane text=true >}}\n  {{% tab header=\"Step 1\" %}}\n  Content for step 1.\n  {{% /tab %}}\n  {{% tab header=\"Step 2\" %}}\n  Content for step 2.\n  {{% /tab %}}\n{{< /tabpane >}}") },
  { id: "cover", command: "/cover", icon: "fa-window-maximize", category: "Docsy", sidebar: true, name: "Docsy Cover", description: "Landing page hero block", html: shortcodeCard("Docsy Cover", "{{< blocks/cover title=\"Welcome\" height=\"auto td-below-navbar\" color=\"primary\" >}}\nWrite your hero text here.\n{{< /blocks/cover >}}") },
  { id: "section", command: "/section", icon: "fa-layer-group", category: "Docsy", sidebar: true, name: "Docsy Section", description: "Docsy section container", html: shortcodeCard("Docsy Section", "{{< blocks/section color=\"light\" type=\"container\" >}}\n## Section title\n\nWrite your section content here.\n{{< /blocks/section >}}") }
];

const sidebarCategoryOrder = ["Text", "Lists", "Media", "Content", "Code", "Alerts", "Docsy"];

function buildFrontMatter() {
  const m = state.metadata;
  const lines = ["---"];
  lines.push(`title: "${yamlEscape(m.title || state.projectName)}"`);
  if (m.date) lines.push(`date: ${m.date}`);
  if (m.description) lines.push(`description: "${yamlEscape(m.description)}"`);
  lines.push(`tags: ${listToYaml(m.tags)}`);
  lines.push(`categories: ${listToYaml(m.categories)}`);
  if (m.weight !== "") lines.push(`weight: ${Number(m.weight) || 0}`);
  if (m.type) lines.push(`type: "${yamlEscape(m.type)}"`);
  lines.push(`hidden: ${m.hidden === "true" ? "true" : "false"}`);
  lines.push("---");
  return lines.join("\n");
}
function buildMarkdown() { return `${buildFrontMatter()}\n\n${htmlToMarkdown(els.visualEditor.innerHTML).trim()}\n`; }
function splitMarkdownFrontMatter(text) {
  const value = String(text || "");
  const match = value.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return { frontMatter: "", body: value };
  return { frontMatter: match[1], body: value.slice(match[0].length) };
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
function applyParsedFrontMatter(frontMatter) {
  if (!frontMatter) return;
  const nextMetadata = { ...state.metadata };
  frontMatter.split(/\r?\n/).forEach(line => {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) return;
    const [, key, rawValue] = match;
    const normalizedKey = key.toLowerCase();
    if (normalizedKey === "title") nextMetadata.title = parseYamlScalar(rawValue);
    if (normalizedKey === "date") nextMetadata.date = parseYamlScalar(rawValue);
    if (normalizedKey === "description") nextMetadata.description = parseYamlScalar(rawValue);
    if (normalizedKey === "tags") nextMetadata.tags = parseYamlArray(rawValue);
    if (normalizedKey === "categories") nextMetadata.categories = parseYamlArray(rawValue);
    if (normalizedKey === "weight") nextMetadata.weight = parseYamlScalar(rawValue);
    if (normalizedKey === "type") nextMetadata.type = parseYamlScalar(rawValue);
    if (normalizedKey === "hidden") nextMetadata.hidden = parseYamlScalar(rawValue) === "true" ? "true" : "false";
  });
  state.metadata = nextMetadata;
}
function importMarkdownFile(file) {
  if (!file) return;
  file.text().then(text => {
    const match = String(text || "").match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (match) applyParsedFrontMatter(match[1]);
    const body = match ? text.slice(match[0].length) : text;
    state.projectName = (file.name || "markdown-page").replace(/\.(md|markdown)$/i, "") || "markdown-page";
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
function nodeToMarkdown(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent.replace(/\u00a0/g, " ");
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  if (node.matches(".shortcode-card")) return `\n\n${node.querySelector("textarea")?.value.trim() || ""}\n\n`;
  if (node.matches(".markdown-alert-block")) {
    const color = node.dataset.color || "info";
    const alert = ALERTS.find(([v]) => v === color) || ALERTS[0];
    const txt = node.querySelector(".alert-content")?.textContent.trim() || "";
    return `\n\n> [!${alert[2]}]\n${txt.split("\n").map(line => `> ${line}`).join("\n")}\n\n`;
  }
  if (node.matches(".docsy-alert-block")) {
    const color = node.dataset.color || "info";
    const title = DOCSY_ALERT_TITLE[color] || "Info";
    const txt = node.querySelector(".alert-content")?.textContent.trim() || "";
    return `\n\n{{% alert title="${title}" color="${color}" %}}\n${txt}\n{{% /alert %}}\n\n`;
  }
  if (node.matches(".docsy-code-block")) {
    const lang = node.dataset.language || "bash";
    const code = node.querySelector("pre")?.textContent || "";
    return `\n\n{{< card code=true header="**${lang.toUpperCase()}**" lang="${lang}" >}}\n${code.replace(/\n$/, "")}\n{{< /card >}}\n\n`;
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
    case "a": return `[${content || node.getAttribute("href")}](${node.getAttribute("href") || ""})`;
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
  const line = `![${img.getAttribute("alt") || ""}](${img.getAttribute("src") || ""})`;
  return caption && caption !== "Optional caption" ? `\n${line}\n\n_${caption}_\n\n` : `\n${line}\n\n`;
}
function preToMarkdown(node) {
  const code = node.querySelector("code")?.textContent || node.textContent || "";
  return `\n\n\`\`\`\n${code.replace(/\n$/, "")}\n\`\`\`\n\n`;
}
function listToMarkdown(node, ordered) {
  const checklist = node.dataset.checklist === "true";
  const items = Array.from(node.children).filter(child => child.tagName.toLowerCase() === "li");
  return `\n${items.map((item, index) => `${ordered ? index + 1 + "." : "-"} ${checklist ? (item.querySelector("input")?.checked ? "[x] " : "[ ] ") : ""}${nodesToMarkdown(Array.from(item.childNodes).filter(n => !(n.tagName && n.tagName.toLowerCase() === "input"))).trim()}`).join("\n")}\n\n`;
}
function tableToMarkdown(table) {
  const rows = Array.from(table.querySelectorAll("tr"));
  if (!rows.length) return "";
  const data = rows.map(row => Array.from(row.children).map(cell => cell.textContent.trim().replace(/\|/g, "\\|")));
  const maxCols = Math.max(...data.map(row => row.length));
  const normalized = data.map(row => [...row, ...Array(Math.max(0, maxCols - row.length)).fill("")]);
  const align = table.getAttribute("data-align") || "left";
  const separator = Array(maxCols).fill(align === "center" ? ":---:" : "---");
  const toRow = row => `| ${row.join(" | ")} |`;
  return `\n${[toRow(normalized[0]), toRow(separator), ...normalized.slice(1).map(toRow)].join("\n")}\n\n`;
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
  text = text.replace(/{{%\s*alert[^%]*color="([^"]+)"[^%]*%}}([\s\S]*?){{%\s*\/alert\s*%}}/g, (_, color, body) => {
    const token = `__TOKEN_${tokens.length}__`;
    tokens.push(alertBlockHtml("docsy", color, body.trim()));
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
    if (/^!\[[^\]]*\]\([^)]+\)/.test(line.trim())) {
      const match = line.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)/);
      html.push(imageHtml(match[2], match[1], "Optional caption"));
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
  return escapeHtml(value)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/_([^_]+)_/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<a href=\"$2\" target=\"_blank\" rel=\"noreferrer\">$1</a>");
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
  els.blockGallery.querySelectorAll(".block-chip").forEach(button => {
    button.addEventListener("click", () => insertBlock(button.dataset.block, { fromSidebar: true }));
    button.addEventListener("dragstart", event => {
      event.dataTransfer.setData("text/plain", button.dataset.block);
      button.classList.add("dragging");
    });
    button.addEventListener("dragend", () => button.classList.remove("dragging"));
  });
}
function render() {
  els.projectName.value = state.projectName || "markdown-page";
  els.visualEditor.innerHTML = state.html || "";
  normalizeEditorContent();
  updateEditorPlaceholder();
  fillPostInfoForm();
  renderGallery();
  updateTableToolbarVisibility();
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
function insertHtmlAtCursor(html, options = {}) {
  const fragment = document.createRange().createContextualFragment(html);
  const insertedNodes = Array.from(fragment.childNodes);
  const lastNode = insertedNodes[insertedNodes.length - 1];
  const preferredAnchor = options.anchorBlock && options.anchorBlock.isConnected ? options.anchorBlock : null;
  if (preferredAnchor) {
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
  const useOldSelection = !options.fromSidebar || (Date.now() - lastSelectionSavedAt < 60000);
  if (block.action === "image") { openImagePanel({ allowOldSelection: useOldSelection }); return; }
  if (block.action === "table") { openTablePanel({ allowOldSelection: useOldSelection }); return; }
  insertHtmlAtCursor(block.html, { allowOldSelection: useOldSelection });
  showToast(`${block.name} inserted`);
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
  const selector = ".editable-card, figure.image-block, table";
  const blocksWithControls = [];
  if (root.matches?.(selector)) blocksWithControls.push(root);
  root.querySelectorAll(selector).forEach(block => blocksWithControls.push(block));
  blocksWithControls.forEach(block => {
    let button = null;
    try {
      button = block.querySelector(":scope > .block-remove-button");
    } catch (error) {
      button = Array.from(block.children).find(child => child.classList?.contains("block-remove-button")) || null;
    }
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "block-remove-button";
      button.contentEditable = "false";
      button.title = "Remove block";
      button.setAttribute("aria-label", "Remove block");
      button.innerHTML = '<i class="fa-solid fa-xmark"></i>';
      block.insertBefore(button, block.firstChild);
    }
  });
  root.querySelectorAll(".block-remove-button").forEach(button => {
    const host = button.parentElement;
    if (!host?.matches?.(selector)) button.remove();
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
      if (frontMatter) {
        applyParsedFrontMatter(frontMatter);
        fillPostInfoForm();
      }
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
    if (url) { document.execCommand("createLink", false, url); normalizeEditorContent(); }
  }
  if (format === "image") openImagePanel();
  if (format === "table") openTablePanel();
  if (format === "code") insertBlock("code");
  if (format === "codedocsy") insertBlock("codedocsy");
  if (format === "buttondocsy") insertBlock("buttondocsy");
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
  saveProject();
  showToast("Column removed");
}
function handlePanelKeydown(event) {
  const panel = event.currentTarget;
  if (event.key === "Escape") {
    event.preventDefault();
    panel.classList.remove("open");
    pendingInsertAnchorBlock = null;
    restoreSelection();
    return;
  }
  if (event.key !== "Enter") return;
  event.preventDefault();
  if (panel === els.imagePanel) insertImageFromPanel();
  if (panel === els.tablePanel) insertTableFromPanel();
}
function openImagePanel(options = {}) {
  pendingPanelInsertOptions = { allowOldSelection: options.allowOldSelection !== false };
  const currentRange = getCurrentEditorRange();
  pendingInsertAnchorBlock = getBlockAnchorFromRange(currentRange) || (hasFreshSavedRange() ? getBlockAnchorFromRange(savedRange) : null);
  if (currentRange) {
    savedRange = currentRange;
    lastSelectionSavedAt = Date.now();
  } else if (options.allowOldSelection === false || !hasFreshSavedRange()) {
    savedRange = createEndRange();
    lastSelectionSavedAt = Date.now();
    pendingPanelInsertOptions.allowOldSelection = true;
  }
  els.imageUrl.value = "";
  els.imageAlt.value = "";
  els.imagePanel.classList.add("open");
  setTimeout(() => els.imageUrl.focus(), 80);
}
function insertImageFromPanel() {
  const url = els.imageUrl.value.trim();
  const alt = els.imageAlt.value.trim() || guessAltTextFromUrl(url);
  if (!url) { showToast("Paste an image URL first"); return; }
  els.imagePanel.classList.remove("open");
  insertHtmlAtCursor(imageHtml(url, alt || "Image", "Optional caption"), { ...pendingPanelInsertOptions, anchorBlock: pendingInsertAnchorBlock });
  pendingInsertAnchorBlock = null;
  showToast("Image inserted");
}
function openTablePanel(options = {}) {
  pendingPanelInsertOptions = { allowOldSelection: options.allowOldSelection !== false };
  const currentRange = getCurrentEditorRange();
  pendingInsertAnchorBlock = getBlockAnchorFromRange(currentRange) || (hasFreshSavedRange() ? getBlockAnchorFromRange(savedRange) : null);
  if (currentRange) {
    savedRange = currentRange;
    lastSelectionSavedAt = Date.now();
  } else if (options.allowOldSelection === false || !hasFreshSavedRange()) {
    savedRange = createEndRange();
    lastSelectionSavedAt = Date.now();
    pendingPanelInsertOptions.allowOldSelection = true;
  }
  els.tableColumns.value = 3;
  els.tableRows.value = 3;
  els.tableAlign.value = "left";
  els.tablePanel.classList.add("open");
  setTimeout(() => els.tableColumns.focus(), 80);
}
function insertTableFromPanel() {
  els.tablePanel.classList.remove("open");
  insertHtmlAtCursor(tableHtml(els.tableColumns.value, els.tableRows.value, els.tableAlign.value), { ...pendingPanelInsertOptions, anchorBlock: pendingInsertAnchorBlock });
  pendingInsertAnchorBlock = null;
  showToast("Table inserted");
}

function fillPostInfoForm() {
  const m = state.metadata;
  els.fmTitle.value = m.title || "";
  els.fmDate.value = m.date || "";
  els.fmDescription.value = m.description || "";
  els.fmTags.value = Array.isArray(m.tags) ? m.tags.join(", ") : m.tags || "";
  els.fmCategories.value = Array.isArray(m.categories) ? m.categories.join(", ") : m.categories || "";
  els.fmWeight.value = m.weight || "";
  els.fmType.value = m.type || "";
  els.fmHidden.value = m.hidden === "true" ? "true" : "false";
}
function savePostInfoForm() {
  state.metadata = {
    title: els.fmTitle.value.trim(),
    date: els.fmDate.value,
    description: els.fmDescription.value.trim(),
    tags: splitList(els.fmTags.value),
    categories: splitList(els.fmCategories.value),
    weight: els.fmWeight.value,
    type: els.fmType.value.trim(),
    hidden: els.fmHidden.value
  };
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
  localStorage.removeItem(STORAGE_KEY);
  state.projectName = "markdown-page";
  state.html = "";
  state.metadata = { title: "New Markdown page", date: new Date().toISOString().slice(0, 10), description: "", tags: [], categories: [], weight: "", type: "docs", hidden: "false" };
  render();
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
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(slashRange);
  slashRange.deleteContents();
  savedRange = slashRange.cloneRange();
  lastSelectionSavedAt = Date.now();
  hideSlashMenu();
  insertBlock(block.id);
}
function handleEditorKeydown(event) {
  if (handleBlockDropdownKeydown(event)) return;
  if (handleSlashMenuKey(event)) return;
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
  if (!event || !["insertText", "insertParagraph"].includes(event.inputType)) return;
  const selection = window.getSelection();
  if (!selection.rangeCount) return;
  const range = selection.getRangeAt(0);
  const node = range.startContainer;
  if (node.nodeType !== Node.TEXT_NODE) return;
  const before = node.textContent.slice(0, range.startOffset);
  const match = before.match(/(https?:\/\/[^\s<]+)(\s|$)$/i);
  if (!match) return;
  const url = match[1];
  if (!isUrl(url)) return;
  const start = range.startOffset - match[0].length;
  const linkRange = range.cloneRange();
  linkRange.setStart(node, start);
  linkRange.setEnd(node, start + url.length);
  linkRange.deleteContents();
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.target = "_blank";
  anchor.rel = "noreferrer";
  anchor.textContent = url;
  linkRange.insertNode(anchor);
  const spacer = document.createTextNode(" ");
  anchor.after(spacer);
  const newRange = document.createRange();
  newRange.setStartAfter(spacer);
  newRange.collapse(true);
  selection.removeAllRanges();
  selection.addRange(newRange);
  saveSelection();
}
function handlePaste(event) {
  const text = event.clipboardData?.getData("text/plain") || "";
  if (isImageUrl(text)) {
    event.preventDefault();
    insertHtmlAtCursor(imageHtml(text, "Image", "Optional caption"));
    showToast("Image inserted from URL");
    return;
  }
  if (isUrl(text)) {
    event.preventDefault();
    insertHtmlAtCursor(`<a href="${escapeHtml(text)}" target="_blank" rel="noreferrer">${escapeHtml(text)}</a>&nbsp;`);
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
    block.dataset.color = value;
    refreshBlockDropdown(dropdown, value);
    refreshAlertBlockAppearance(block);
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
function refreshAlertBlockAppearance(block) {
  const color = block.dataset.color || "info";
  const label = ALERTS.find(([value]) => value === color)?.[1] || "Info";
  const title = block.classList.contains("docsy-alert-block") ? `Docsy ${label}` : `Markdown ${label}`;
  const titleNode = block.querySelector(".block-settings span");
  const icon = titleNode?.querySelector("i")?.outerHTML || "";
  if (titleNode) titleNode.innerHTML = `${icon} ${escapeHtml(title)}`;
  const base = block.classList.contains("docsy-alert-block") ? "docsy-alert-block" : "markdown-alert-block";
  block.className = `${base} editable-card alert-${color}`;
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
els.closePostInfoBtn.addEventListener("click", () => els.metadataDrawer.classList.remove("open"));
els.savePostInfoBtn.addEventListener("click", savePostInfoForm);
els.importBtn?.addEventListener("click", () => els.importFile?.click());
els.importFile?.addEventListener("change", event => {
  importMarkdownFile(event.target.files?.[0]);
  event.target.value = "";
});
els.exportBtn.addEventListener("click", exportMarkdown);
els.resetBtn.addEventListener("click", resetProject);
els.projectName.addEventListener("input", saveProject);
els.editorToolbar.addEventListener("pointerdown", () => saveSelection());
els.headingSelect.addEventListener("change", event => setHeading(event.target.value));
els.visualEditor.addEventListener("beforeinput", clearEditorPlaceholderBeforeInput);
els.visualEditor.addEventListener("input", event => { autoLinkCurrentText(event); updateSlashMenu(); scheduleNormalizeEditorContent(event.target); updateEditorPlaceholder(); updateTableToolbarVisibility(); saveProject(); });
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
els.visualEditor.addEventListener("input", event => {
  if (event.target.matches(".code-language")) updateCodeLanguageSelect(event.target);
  if (event.target.matches(".alert-color")) updateAlertColorSelect(event.target);
});
els.visualEditor.addEventListener("change", event => {
  if (event.target.matches(".code-language")) updateCodeLanguageSelect(event.target);
  if (event.target.matches(".alert-color")) updateAlertColorSelect(event.target);
});
els.visualEditor.addEventListener("click", event => {
  if (handleBlockDropdownClick(event)) return;
  const removeButton = event.target.closest(".block-remove-button");
  if (removeButton) {
    event.preventDefault();
    event.stopPropagation();
    const block = removeButton.closest(".editable-card, figure.image-block, table");
    if (block) {
      block.remove();
      saveProject();
      showToast("Block removed");
    }
    return;
  }
  updateTableToolbarVisibility();
  if (event.target.closest("a") && (event.ctrlKey || event.metaKey)) window.open(event.target.closest("a").href, "_blank", "noopener");
});
els.markdownEditor.addEventListener("input", () => {
  state.markdownCache = els.markdownEditor.value;
  const { frontMatter } = splitMarkdownFrontMatter(els.markdownEditor.value);
  if (frontMatter) {
    applyParsedFrontMatter(frontMatter);
    fillPostInfoForm();
  }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    els.saveStatus.textContent = "Saved at " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, 120);
});
els.editorToolbar.querySelectorAll("button[data-format]").forEach(button => button.addEventListener("click", () => execFormat(button.dataset.format)));
els.cancelImageBtn.addEventListener("click", () => { els.imagePanel.classList.remove("open"); pendingInsertAnchorBlock = null; });
els.insertImageBtn.addEventListener("click", insertImageFromPanel);
els.imageUrl.addEventListener("input", () => {
  if (els.imageAlt.value.trim()) return;
  els.imageAlt.value = guessAltTextFromUrl(els.imageUrl.value);
});
els.imagePanel.addEventListener("click", event => { if (event.target === els.imagePanel) { els.imagePanel.classList.remove("open"); pendingInsertAnchorBlock = null; } });
els.imagePanel.addEventListener("keydown", handlePanelKeydown);
els.cancelTableBtn.addEventListener("click", () => { els.tablePanel.classList.remove("open"); pendingInsertAnchorBlock = null; });
els.insertTableBtn.addEventListener("click", insertTableFromPanel);
els.tablePanel.addEventListener("click", event => { if (event.target === els.tablePanel) { els.tablePanel.classList.remove("open"); pendingInsertAnchorBlock = null; } });
els.tablePanel.addEventListener("keydown", handlePanelKeydown);
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
