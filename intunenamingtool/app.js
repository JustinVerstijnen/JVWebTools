const resourceCategories = [
    {
        category: "Device Configuration",
        items: [
            { code: "CP", label: "Configuration Profile" },
            { code: "SCR", label: "Script (PowerShell / Custom)" }
        ]
    },
    {
        category: "Updates & Patches",
        items: [
            { code: "WU", label: "Windows Update Ring" },
            { code: "FU", label: "Feature Update" },
            { code: "DU", label: "Driver Update" }
        ]
    },
    {
        category: "Restrictions",
        items: [
            { code: "DLR", label: "Device Limit Restriction" },
            { code: "DPR", label: "Device Platform Restriction" }
        ]
    },
    {
        category: "Compliance & Identity",
        items: [
            { code: "COM", label: "Compliance Policy" },
            { code: "CA", label: "Conditional Access" }
        ]
    },
    {
        category: "Categorization & Cleanup",
        items: [
            { code: "DCR", label: "Device Clean-up Rule" },
            { code: "DC", label: "Device Category" },
            { code: "POS", label: "Policy Set" }
        ]
    },
    {
        category: "Windows Autopilot",
        items: [
            { code: "WAD", label: "Windows Autopilot Deployment Profile" },
            { code: "WAP", label: "Windows Autopilot Preparation Policy" },
            { code: "WAS", label: "Windows Autopilot Enrollment Status Page" },
            { code: "EN", label: "Enrollment Notification" }
        ]
    },
    {
        category: "Windows 365",
        items: [
            { code: "PP", label: "Provisioning Policy" },
            { code: "CI", label: "Custom Image" },
            { code: "ANC", label: "Azure Network Connection" }
        ]
    },
    {
        category: "Endpoint Security",
        items: [
            { code: "AV", label: "Antivirus" },
            { code: "ASR", label: "Attack Surface Reduction" },
            { code: "ACP", label: "Account Protection" },
            { code: "DE", label: "Disk Encryption" },
            { code: "EPM", label: "Endpoint Privilege Management" },
            { code: "AP", label: "App Protection" },
            { code: "ACB", label: "App Control for Business" },
            { code: "FW", label: "Firewall" },
            { code: "AC", label: "App Config" }
        ]
    }
];

const groupCategories = [
    {
        category: "Groups",
        items: [
            { code: "SG", label: "Security Group" },
            { code: "AG", label: "Assigned Group" },
            { code: "DUG", label: "Dynamic User Group" },
            { code: "DDG", label: "Dynamic Device Group" },
            { code: "M365", label: "Microsoft 365 Group" }
        ]
    }
];

const targetOptions = [
    { code: "D", label: "Device" },
    { code: "U", label: "User" }
];

const osOptions = [
    { code: "Win", label: "Windows" },
    { code: "AVD", label: "Azure Virtual Desktop" },
    { code: "W365", label: "Windows 365" },
    { code: "And", label: "Android" },
    { code: "Lin", label: "Linux" },
    { code: "macOS", label: "macOS" },
    { code: "iOS", label: "iOS / iPadOS" },
    { code: "All", label: "All OS" }
];

const state = {
    mode: "resource",
    history: []
};

const elements = {};

window.addEventListener("DOMContentLoaded", init);

function init() {
    bindElements();
    populateSelects();
    bindEvents();
    setMode("resource");
    updatePreview();
}

function bindElements() {
    elements.tabs = Array.from(document.querySelectorAll(".object-tab"));
    elements.activeModePill = document.getElementById("activeModePill");
    elements.prefixInput = document.getElementById("prefixInput");
    elements.targetSelect = document.getElementById("targetSelect");
    elements.osSelect = document.getElementById("osSelect");
    elements.resourceTypeSearchInput = document.getElementById("resourceTypeSearchInput");
    elements.groupTypeSearchInput = document.getElementById("groupTypeSearchInput");
    elements.resourceTypeSelect = document.getElementById("resourceTypeSelect");
    elements.groupTypeSelect = document.getElementById("groupTypeSelect");
    elements.resourceTypeField = document.getElementById("resourceTypeField");
    elements.groupTypeField = document.getElementById("groupTypeField");
    elements.resourceTypeDescription = document.getElementById("resourceTypeDescription");
    elements.groupTypeDescription = document.getElementById("groupTypeDescription");
    elements.goalInput = document.getElementById("goalInput");
    elements.generateBtn = document.getElementById("generateBtn");
    elements.copyBtn = document.getElementById("copyBtn");
    elements.resetBtn = document.getElementById("resetBtn");
    elements.generatedName = document.getElementById("generatedName");
    elements.validationMessage = document.getElementById("validationMessage");
    elements.partPrefix = document.getElementById("partPrefix");
    elements.partType = document.getElementById("partType");
    elements.partTarget = document.getElementById("partTarget");
    elements.partOs = document.getElementById("partOs");
    elements.partGoal = document.getElementById("partGoal");
    elements.typeSearchInput = document.getElementById("typeSearchInput");
    elements.typeOverview = document.getElementById("typeOverview");
    elements.historyTableBody = document.querySelector("#historyTable tbody");
    elements.clearHistoryBtn = document.getElementById("clearHistoryBtn");
    elements.exportCsvBtn = document.getElementById("exportCsvBtn");
    elements.toast = document.getElementById("toast");
    elements.collapseButtons = Array.from(document.querySelectorAll("[data-collapse-button]"));
}

function populateSelects() {
    populateTypeSelect(elements.resourceTypeSelect, resourceCategories);
    populateTypeSelect(elements.groupTypeSelect, groupCategories);
    populateSimpleSelect(elements.targetSelect, targetOptions);
    populateSimpleSelect(elements.osSelect, osOptions);
}

function populateTypeSelect(selectElement, categories, filter = "", preferredValue = "") {
    const normalizedFilter = filter.trim().toLowerCase();
    const previousValue = preferredValue || selectElement.value;
    selectElement.innerHTML = "";

    categories.forEach((category) => {
        const matchingItems = category.items.filter((item) => matchesTypeFilter(item, category.category, normalizedFilter));

        if (matchingItems.length === 0) {
            return;
        }

        const optgroup = document.createElement("optgroup");
        optgroup.label = category.category;

        matchingItems.forEach((item) => {
            const option = document.createElement("option");
            option.value = item.code;
            option.textContent = `${item.code} - ${item.label}`;
            option.dataset.label = item.label;
            option.dataset.category = category.category;
            optgroup.appendChild(option);
        });

        selectElement.appendChild(optgroup);
    });

    if (selectElement.querySelector(`option[value="${cssEscape(previousValue)}"]`)) {
        selectElement.value = previousValue;
    }
}

function populateSimpleSelect(selectElement, options) {
    selectElement.innerHTML = "";

    options.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.code;
        option.textContent = `${item.code} - ${item.label}`;
        selectElement.appendChild(option);
    });
}

function bindEvents() {
    elements.tabs.forEach((tab) => {
        tab.addEventListener("click", () => setMode(tab.dataset.mode));
    });

    [
        elements.prefixInput,
        elements.targetSelect,
        elements.osSelect,
        elements.resourceTypeSelect,
        elements.groupTypeSelect,
        elements.goalInput
    ].forEach((input) => {
        input.addEventListener("input", updatePreview);
        input.addEventListener("change", updatePreview);
    });

    elements.resourceTypeSearchInput.addEventListener("input", () => {
        filterTypeSelect("resource");
        updatePreview();
    });

    elements.groupTypeSearchInput.addEventListener("input", () => {
        filterTypeSelect("group");
        updatePreview();
    });

    elements.generateBtn.addEventListener("click", () => {
        const result = updatePreview();
        if (!result.isValid) {
            showToast("Complete the required fields first.");
            return;
        }

        addToHistory(result);
        showToast("Name generated and added to history.");
    });

    elements.copyBtn.addEventListener("click", async () => {
        const result = updatePreview();
        if (!result.isValid) {
            showToast("Complete the required fields first.");
            return;
        }

        await copyText(result.name);
    });

    elements.generatedName.addEventListener("click", async () => {
        const result = updatePreview();
        if (result.isValid) {
            await copyText(result.name);
        }
    });

    elements.resetBtn.addEventListener("click", resetForm);

    elements.typeSearchInput.addEventListener("input", () => {
        renderTypeOverview(elements.typeSearchInput.value);
    });

    elements.clearHistoryBtn.addEventListener("click", () => {
        state.history = [];
        renderHistory();
        showToast("History cleared.");
    });

    elements.exportCsvBtn.addEventListener("click", exportHistoryCsv);

    elements.collapseButtons.forEach((button) => {
        button.addEventListener("click", () => togglePanel(button));
    });
}

function filterTypeSelect(mode) {
    if (mode === "group") {
        populateTypeSelect(elements.groupTypeSelect, groupCategories, elements.groupTypeSearchInput.value, elements.groupTypeSelect.value);
        return;
    }

    populateTypeSelect(elements.resourceTypeSelect, resourceCategories, elements.resourceTypeSearchInput.value, elements.resourceTypeSelect.value);
}

function setMode(mode) {
    state.mode = mode === "group" ? "group" : "resource";

    elements.tabs.forEach((tab) => {
        const isActive = tab.dataset.mode === state.mode;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });

    const isGroup = state.mode === "group";
    elements.resourceTypeField.classList.toggle("hidden", isGroup);
    elements.groupTypeField.classList.toggle("hidden", !isGroup);
    elements.activeModePill.textContent = isGroup ? "Group" : "Intune Resource";

    updateTypeDescription();
    renderTypeOverview(elements.typeSearchInput.value);
    updatePreview();
}

function togglePanel(button) {
    const panelId = button.getAttribute("aria-controls");
    const panel = document.getElementById(panelId);
    const isOpen = button.getAttribute("aria-expanded") === "true";
    const nextOpen = !isOpen;

    button.setAttribute("aria-expanded", String(nextOpen));
    panel.hidden = !nextOpen;

    const label = button.querySelector(".collapse-label");
    if (label) {
        label.textContent = nextOpen ? "Collapse" : "Expand";
    }
}

function updatePreview() {
    const prefix = sanitizePart(elements.prefixInput.value).toUpperCase();
    const goal = sanitizeGoal(elements.goalInput.value);
    const selectedType = getSelectedType();
    const type = selectedType.code;
    const target = elements.targetSelect.value;
    const os = elements.osSelect.value;
    const name = [prefix, type, target, os, goal].filter(Boolean).join("-");
    const validation = validateName({ prefix, type, target, os, goal, name });

    elements.generatedName.textContent = name || "Complete the fields to generate a name";
    elements.partPrefix.textContent = prefix || "-";
    elements.partType.textContent = type || "-";
    elements.partTarget.textContent = target || "-";
    elements.partOs.textContent = os || "-";
    elements.partGoal.textContent = goal || "-";

    elements.validationMessage.textContent = validation.message;
    elements.validationMessage.className = `validation-message ${validation.level}`;

    updateTypeDescription();

    return {
        name,
        object: state.mode === "group" ? "Group" : "Intune Resource",
        type,
        typeLabel: selectedType.label,
        target,
        os,
        goal,
        prefix,
        isValid: validation.level !== "error"
    };
}

function updateTypeDescription() {
    const selectedType = getSelectedType();
    const message = selectedType.code
        ? `${selectedType.code} means ${selectedType.label}.`
        : "No matching type found. Clear or adjust the search field.";

    if (state.mode === "group") {
        elements.groupTypeDescription.textContent = message;
    } else {
        elements.resourceTypeDescription.textContent = message;
    }
}

function getSelectedType() {
    const select = state.mode === "group" ? elements.groupTypeSelect : elements.resourceTypeSelect;
    const option = select.selectedOptions[0];

    return {
        code: option ? select.value : "",
        label: option?.dataset.label || option?.textContent || "",
        category: option?.dataset.category || ""
    };
}

function validateName(parts) {
    if (!parts.prefix || !parts.type || !parts.target || !parts.os || !parts.goal) {
        return { level: "error", message: "Prefix, type, target, OS and name/goal are required." };
    }

    if (parts.name.length > 80) {
        return { level: "warning", message: "Looks good, but the name is longer than 80 characters." };
    }

    return { level: "valid", message: "Looks good." };
}

function sanitizePart(value) {
    return String(value || "")
        .trim()
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 20);
}

function sanitizeGoal(value) {
    return String(value || "")
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

function resetForm() {
    elements.prefixInput.value = "JV";
    elements.targetSelect.value = "D";
    elements.osSelect.value = "Win";
    elements.resourceTypeSearchInput.value = "";
    elements.groupTypeSearchInput.value = "";
    populateTypeSelect(elements.resourceTypeSelect, resourceCategories);
    populateTypeSelect(elements.groupTypeSelect, groupCategories);
    elements.resourceTypeSelect.value = "CP";
    elements.groupTypeSelect.value = "SG";
    elements.goalInput.value = "OneDrive";
    setMode("resource");
    updatePreview();
    showToast("Form reset.");
}

async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            fallbackCopy(text);
        }
        showToast("Copied to clipboard.");
    } catch (error) {
        fallbackCopy(text);
        showToast("Copied to clipboard.");
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(() => {
        elements.toast.classList.remove("show");
    }, 1800);
}

function addToHistory(result) {
    const entry = {
        ...result,
        createdAt: new Date().toISOString()
    };

    state.history = [entry, ...state.history.filter((item) => item.name !== entry.name)].slice(0, 25);
    renderHistory();
}

function renderHistory() {
    elements.historyTableBody.innerHTML = "";

    if (state.history.length === 0) {
        const row = document.createElement("tr");
        row.className = "empty-row";
        row.innerHTML = '<td colspan="6">No generated names yet.</td>';
        elements.historyTableBody.appendChild(row);
        return;
    }

    state.history.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${escapeHtml(item.name)}</strong></td>
            <td>${escapeHtml(item.object)}</td>
            <td>${escapeHtml(item.type)} - ${escapeHtml(item.typeLabel)}</td>
            <td>${escapeHtml(item.target)}</td>
            <td>${escapeHtml(item.os)}</td>
            <td><button class="history-copy-btn icon-btn" type="button" data-name="${escapeAttribute(item.name)}"><svg class="btn-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-8a2 2 0 0 1-2-2V7Zm2 0v11h8V7h-8ZM4 3a2 2 0 0 1 2-2h9v2H6v12H4V3Z"/></svg>Copy</button></td>
        `;
        elements.historyTableBody.appendChild(row);
    });

    elements.historyTableBody.querySelectorAll(".history-copy-btn").forEach((button) => {
        button.addEventListener("click", async () => {
            await copyText(button.dataset.name);
        });
    });
}

function renderTypeOverview(filter = "") {
    const categories = state.mode === "group" ? groupCategories : resourceCategories;
    const normalizedFilter = filter.trim().toLowerCase();
    elements.typeOverview.innerHTML = "";

    categories.forEach((category) => {
        const matchingItems = category.items.filter((item) => matchesTypeFilter(item, category.category, normalizedFilter));

        if (matchingItems.length === 0) {
            return;
        }

        const card = document.createElement("article");
        card.className = "type-category";

        const title = document.createElement("h3");
        title.textContent = category.category;
        card.appendChild(title);

        const list = document.createElement("div");
        list.className = "type-list";

        matchingItems.forEach((item) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "type-item";
            button.innerHTML = `<span class="type-code">${escapeHtml(item.code)}</span><span>${escapeHtml(item.label)}</span>`;
            button.addEventListener("click", () => {
                if (state.mode === "group") {
                    elements.groupTypeSearchInput.value = "";
                    populateTypeSelect(elements.groupTypeSelect, groupCategories);
                    elements.groupTypeSelect.value = item.code;
                } else {
                    elements.resourceTypeSearchInput.value = "";
                    populateTypeSelect(elements.resourceTypeSelect, resourceCategories);
                    elements.resourceTypeSelect.value = item.code;
                }
                updatePreview();
                showToast(`${item.code} selected.`);
            });
            list.appendChild(button);
        });

        card.appendChild(list);
        elements.typeOverview.appendChild(card);
    });

    if (!elements.typeOverview.children.length) {
        elements.typeOverview.innerHTML = '<p class="empty-message">No matching types found.</p>';
    }
}

function matchesTypeFilter(item, category, normalizedFilter) {
    if (!normalizedFilter) {
        return true;
    }

    const searchValue = `${item.code} ${item.label} ${category}`.toLowerCase();
    return searchValue.includes(normalizedFilter);
}

function exportHistoryCsv() {
    if (state.history.length === 0) {
        showToast("No history to export.");
        return;
    }

    const rows = [
        ["Name", "Object", "Type", "Type Label", "Target", "OS", "Goal", "Prefix", "Created At"],
        ...state.history.map((item) => [
            item.name,
            item.object,
            item.type,
            item.typeLabel,
            item.target,
            item.os,
            item.goal,
            item.prefix,
            item.createdAt
        ])
    ];

    const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "intune-naming-history.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("CSV exported.");
}

function csvEscape(value) {
    const stringValue = String(value ?? "");
    if (/[",\n]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
}

function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === "function") {
        return window.CSS.escape(value);
    }

    return String(value || "").replace(/"/g, '\\"');
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#096;");
}
