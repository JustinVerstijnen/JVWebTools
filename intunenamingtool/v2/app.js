const intuneResourceCategories = [
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

const azureResourceCategories = [
    {
        category: "Identity & Monitoring",
        items: [
            { code: "rg", label: "Resource Group" },
            { code: "appi", label: "Application Insights" },
            { code: "law", label: "Log Analytics Workspace" },
            { code: "mid", label: "Managed Identity" },
            { code: "wbk", label: "Workbook" },
            { code: "dcr", label: "Data Collection Rule" },
            { code: "mar", label: "Monitor Alert Rule" },
            { code: "mag", label: "Monitor Action Group" },
            { code: "mg", label: "Management Group" },
            { code: "dashb", label: "Shared Dashboard" },
            { code: "pol", label: "Policy Definition" },
            { code: "kv", label: "Key Vault" },
            { code: "hsm", label: "Managed HSM" },
            { code: "domain", label: "Entra Domain Services", separator: "." },
            { code: "pview", label: "Purview Instance" },
            { code: "sshk", label: "SSH Key" },
            { code: "apim", label: "API Management Service Instance", separator: "" }
        ]
    },
    {
        category: "Networking",
        items: [
            { code: "vnet", label: "Virtual Network" },
            { code: "snet", label: "Virtual Network Subnet" },
            { code: "peer", label: "Virtual Network Peering" },
            { code: "bas", label: "Bastion Instance" },
            { code: "pip", label: "Public IP Address" },
            { code: "nsg", label: "Network Security Group" },
            { code: "rule", label: "NSG Rule" },
            { code: "nic", label: "Network Interface" },
            { code: "dnsz", label: "Azure DNS Zone" },
            { code: "pdnsz", label: "Private DNS Zone" },
            { code: "asg", label: "Application Security Group" },
            { code: "natg", label: "NAT Gateway" },
            { code: "con", label: "VPN Connection" },
            { code: "vgw", label: "Virtual Network Gateway" },
            { code: "lgw", label: "Local Network Gateway" },
            { code: "nw", label: "Network Watcher Instance" },
            { code: "udr", label: "User Defined Route" },
            { code: "rt", label: "Route Table" },
            { code: "pl", label: "Private Link" },
            { code: "se", label: "Service Endpoint" },
            { code: "vwan", label: "Virtual WAN Hub" },
            { code: "vpng", label: "VPN Gateway" },
            { code: "vpnc", label: "VPN Connection" },
            { code: "vpns", label: "VPN Site" },
            { code: "ippre", label: "Public IP Address Prefix" },
            { code: "agw", label: "Application Gateway" },
            { code: "erc", label: "ExpressRoute Circuit" },
            { code: "tmp", label: "Traffic Manager Profile" },
            { code: "afw", label: "Azure Firewall" },
            { code: "afwp", label: "Azure Firewall Policy" },
            { code: "waf", label: "Web Application Firewall" },
            { code: "wafrg", label: "WAF Rule Group" },
            { code: "cdnp", label: "CDN Profile" },
            { code: "cdne", label: "CDN Endpoint" },
            { code: "fdfp", label: "Front Door Firewall Policy" },
            { code: "fd", label: "Front Door Instance" },
            { code: "rt", label: "Route Filter" },
            { code: "lbi", label: "Internal Load Balancer" },
            { code: "lbe", label: "External Load Balancer" },
            { code: "lbr", label: "Load Balancer Rule" }
        ]
    },
    {
        category: "Compute & Virtual Desktop",
        items: [
            { code: "vm", label: "Virtual Machine" },
            { code: "acm", label: "Arc Connected Machine" },
            { code: "img", label: "Virtual Machine Image" },
            { code: "vdsp", label: "Virtual Desktop Scaling Plan" },
            { code: "vdag", label: "Virtual Desktop Application Group" },
            { code: "vdws", label: "Virtual Desktop Workspace" },
            { code: "vdhp", label: "Virtual Desktop Hostpool" },
            { code: "asp", label: "App Service Plan" },
            { code: "avs", label: "Availability Set" },
            { code: "ase", label: "App Service Environment" },
            { code: "swa", label: "Static Web App" },
            { code: "gal", label: "Gallery" },
            { code: "cld", label: "Arc Connected Kubernetes Cluster" },
            { code: "app", label: "Web Application" },
            { code: "vmss", label: "Virtual Machine Scale Set" },
            { code: "des", label: "Disk Encryption Set" },
            { code: "ntfn", label: "Notification Hub Namespace" },
            { code: "snap", label: "Snapshot" },
            { code: "ntf", label: "Notification Hubs" },
            { code: "cg", label: "Compute Gallery", separator: "" }
        ]
    },
    {
        category: "Storage",
        items: [
            { code: "sql", label: "Azure SQL Database Server" },
            { code: "sqldb", label: "Azure SQL Database" },
            { code: "osdisk", label: "Managed Disk (OS)" },
            { code: "dadisk", label: "Managed Disk (Data)" },
            { code: "sa", label: "Storage Account", separator: "" },
            { code: "sqlmi", label: "SQL Managed Instance" },
            { code: "sqlsdb", label: "SQL Server Stretch Database" },
            { code: "ssimp", label: "StorSimple", separator: "" },
            { code: "cdb", label: "Cosmos Database" },
            { code: "mysql", label: "MySQL Database" },
            { code: "redis", label: "Cache for Redis Instance" },
            { code: "psql", label: "Postgres SQL Database" },
            { code: "syn", label: "Synapse Analytics", separator: "" },
            { code: "syndp", label: "Synapse Analytics Dedicated SQL Pool", separator: "" },
            { code: "synw", label: "Synapse Analytics Workspace", separator: "" },
            { code: "synsp", label: "Synapse Analytics Spark Pool", separator: "" }
        ]
    },
    {
        category: "Backup & Recovery",
        items: [
            { code: "rsv", label: "Recovery Services Vault" },
            { code: "bckpol", label: "Backup Policy" },
            { code: "bkv", label: "Backup Vault" },
            { code: "brg", label: "Resource Guard" }
        ]
    },
    {
        category: "Migration & Automation",
        items: [
            { code: "fa", label: "Function App" },
            { code: "mc", label: "Maintenance Configuration" },
            { code: "la", label: "Logic App" },
            { code: "mipr", label: "Migrate Project" },
            { code: "sb", label: "Service Bus" },
            { code: "dms", label: "Database Migration Service" },
            { code: "sbq", label: "Service Bus Queue" },
            { code: "aa", label: "Automation Account" },
            { code: "sbt", label: "Service Bus Topic" },
            { code: "bp", label: "Blueprint" },
            { code: "bpa", label: "Blueprint Assignment" },
            { code: "ia", label: "Integration Account" }
        ]
    },
    {
        category: "Analytics & IoT",
        items: [
            { code: "as", label: "Analysis Services Server", separator: "" },
            { code: "evgd", label: "Event Grid Domain" },
            { code: "provs", label: "Provisioning Services" },
            { code: "dbw", label: "Databricks Workspace" },
            { code: "evgs", label: "Event Grid Subscription" },
            { code: "pcert", label: "Provisioning Services Certificate" },
            { code: "asa", label: "Stream Analytics" },
            { code: "evgt", label: "Event Grid Topic" },
            { code: "pbi", label: "Power BI Embedded" },
            { code: "dec", label: "Data Explorer Cluster" },
            { code: "hadp", label: "HDInsight Hadoop Cluster" },
            { code: "tsi", label: "Time Series Insights" },
            { code: "dedb", label: "Data Explorer Database" },
            { code: "hbase", label: "HDInsight HBase Cluster" },
            { code: "kafka", label: "HDInsight Kafka Cluster" },
            { code: "adf", label: "Data Factory" },
            { code: "dls", label: "Data Lake Store Account", separator: "" },
            { code: "spark", label: "HDInsight Spark Cluster" },
            { code: "dla", label: "Data Lake Analytics Account", separator: "" },
            { code: "storm", label: "HDInsight Storm Cluster" },
            { code: "evhns", label: "Event Hub Namespace" },
            { code: "mls", label: "HDInsight Machine Learning Cluster" },
            { code: "iot", label: "IoT Hub" },
            { code: "evh", label: "Data Lake Analytics Account" }
        ]
    },
    {
        category: "Dev Tools & Containers",
        items: [
            { code: "appcs", label: "App Configuration Store" },
            { code: "sigr", label: "SignalR" },
            { code: "aks", label: "Azure Kubernetes Cluster" },
            { code: "cr", label: "Container Registry", separator: "" },
            { code: "ci", label: "Container Instance" },
            { code: "sfc", label: "Service Fabric Cluster" }
        ]
    }
];

const platformConfig = {
    intune: {
        label: "Intune",
        pill: "Intune",
        prefixDefault: "JV",
        goalDefault: "OneDrive",
        typeFirstDefault: false,
        objectOptions: [
            { value: "intuneResource", label: "Intune Resource" },
            { value: "group", label: "Group" }
        ]
    },
    entra: {
        label: "Entra",
        pill: "Entra",
        prefixDefault: "CA",
        goalDefault: "RequireMFA",
        typeFirstDefault: false,
        objectOptions: [
            { value: "conditionalAccess", label: "Conditional Access Policy" },
            { value: "group", label: "Group" }
        ]
    },
    azure: {
        label: "Azure",
        pill: "Azure",
        prefixDefault: "jv",
        goalDefault: "prod",
        typeFirstDefault: true,
        objectOptions: [
            { value: "azureResource", label: "Azure Resource" }
        ]
    }
};

const targetOptions = [
    { code: "D", label: "Device" },
    { code: "U", label: "User" }
];

const conditionalAccessActionOptions = [
    { code: "Allow", label: "Allow" },
    { code: "Block", label: "Block" }
];

const conditionalAccessTargetOptions = [
    { code: "U", label: "Users" },
    { code: "D", label: "Devices" },
    { code: "A", label: "Applications" },
    { code: "R", label: "Roles" }
];

const osOptions = [
    { code: "WIN", label: "Windows" },
    { code: "AVD", label: "Azure Virtual Desktop" },
    { code: "W365", label: "Windows 365" },
    { code: "AND", label: "Android" },
    { code: "LIN", label: "Linux" },
    { code: "MACOS", label: "macOS" },
    { code: "IOS", label: "iOS / iPadOS" },
    { code: "ALL", label: "All OS" },
    { code: "", label: "None" }
];

const state = {
    platform: "intune",
    objectType: "intuneResource"
};

const elements = {};

window.addEventListener("DOMContentLoaded", init);

function init() {
    bindElements();
    populateStaticSelects();
    bindEvents();
    setPlatform("intune");
    resetForm(false);
}

function bindElements() {
    elements.tabs = Array.from(document.querySelectorAll(".object-tab"));
    elements.activeModePill = document.getElementById("activeModePill");
    elements.objectTypeSelect = document.getElementById("objectTypeSelect");
    elements.prefixInput = document.getElementById("prefixInput");
    elements.typeFirstToggle = document.getElementById("typeFirstToggle");
    elements.typeFirstHelp = document.getElementById("typeFirstHelp");
    elements.actionField = document.getElementById("actionField");
    elements.actionSelect = document.getElementById("actionSelect");
    elements.targetField = document.getElementById("targetField");
    elements.targetSelect = document.getElementById("targetSelect");
    elements.osField = document.getElementById("osField");
    elements.osSelect = document.getElementById("osSelect");
    elements.resourceTypeSearchInput = document.getElementById("resourceTypeSearchInput");
    elements.groupTypeSearchInput = document.getElementById("groupTypeSearchInput");
    elements.resourceTypeSelect = document.getElementById("resourceTypeSelect");
    elements.groupTypeSelect = document.getElementById("groupTypeSelect");
    elements.resourceTypeField = document.getElementById("resourceTypeField");
    elements.groupTypeField = document.getElementById("groupTypeField");
    elements.resourceTypeLabel = document.getElementById("resourceTypeLabel");
    elements.resourceTypeDescription = document.getElementById("resourceTypeDescription");
    elements.groupTypeDescription = document.getElementById("groupTypeDescription");
    elements.goalInput = document.getElementById("goalInput");
    elements.generateBtn = document.getElementById("generateBtn");
    elements.copyBtn = document.getElementById("copyBtn");
    elements.resetBtn = document.getElementById("resetBtn");
    elements.generatedName = document.getElementById("generatedName");
    elements.validationMessage = document.getElementById("validationMessage");
    elements.partPrefixLabel = document.getElementById("partPrefixLabel");
    elements.partPrefix = document.getElementById("partPrefix");
    elements.partTypeLabel = document.getElementById("partTypeLabel");
    elements.partType = document.getElementById("partType");
    elements.partTargetRow = document.getElementById("partTargetRow");
    elements.partTarget = document.getElementById("partTarget");
    elements.partOsRow = document.getElementById("partOsRow");
    elements.partOs = document.getElementById("partOs");
    elements.partGoal = document.getElementById("partGoal");
    elements.conventionText = document.getElementById("conventionText");
    elements.typeSearchInput = document.getElementById("typeSearchInput");
    elements.typeOverview = document.getElementById("typeOverview");
    elements.toast = document.getElementById("toast");
    elements.collapseButtons = Array.from(document.querySelectorAll("[data-collapse-button]"));
}

function populateStaticSelects() {
    populateSimpleSelect(elements.actionSelect, conditionalAccessActionOptions);
    populateSimpleSelect(elements.targetSelect, targetOptions);
    populateSimpleSelect(elements.osSelect, osOptions);
}

function bindEvents() {
    elements.tabs.forEach((tab) => {
        tab.addEventListener("click", () => setPlatform(tab.dataset.platform));
    });

    [
        elements.prefixInput,
        elements.typeFirstToggle,
        elements.actionSelect,
        elements.targetSelect,
        elements.osSelect,
        elements.resourceTypeSelect,
        elements.groupTypeSelect,
        elements.goalInput
    ].forEach((input) => {
        input.addEventListener("input", updatePreview);
        input.addEventListener("change", updatePreview);
    });

    elements.objectTypeSelect.addEventListener("change", () => {
        state.objectType = elements.objectTypeSelect.value;
        applyObjectTypeUi();
        renderTypeOverview(elements.typeSearchInput.value);
        updatePreview();
    });

    elements.resourceTypeSearchInput.addEventListener("input", () => {
        filterTypeSelect();
        updatePreview();
    });

    elements.groupTypeSearchInput.addEventListener("input", () => {
        filterTypeSelect();
        updatePreview();
    });

    elements.generateBtn.addEventListener("click", () => {
        const result = updatePreview();
        showToast(result.isValid ? "Name generated." : "Complete the required fields first.");
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

    elements.resetBtn.addEventListener("click", () => resetForm(true));

    elements.typeSearchInput.addEventListener("input", () => {
        renderTypeOverview(elements.typeSearchInput.value);
    });

    elements.collapseButtons.forEach((button) => {
        button.addEventListener("click", () => togglePanel(button));
    });
}

function setPlatform(platform) {
    state.platform = platformConfig[platform] ? platform : "intune";
    const config = platformConfig[state.platform];

    elements.tabs.forEach((tab) => {
        const isActive = tab.dataset.platform === state.platform;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
    });

    elements.activeModePill.textContent = config.pill;
    populateObjectTypeSelect();
    state.objectType = config.objectOptions[0].value;
    elements.objectTypeSelect.value = state.objectType;
    elements.prefixInput.value = config.prefixDefault;
    elements.goalInput.value = config.goalDefault;
    elements.typeFirstToggle.checked = config.typeFirstDefault;
    setDefaultSelections();
    applyObjectTypeUi();
    renderTypeOverview(elements.typeSearchInput.value);
    updatePreview();
}

function populateObjectTypeSelect() {
    elements.objectTypeSelect.innerHTML = "";

    platformConfig[state.platform].objectOptions.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.value;
        option.textContent = item.label;
        elements.objectTypeSelect.appendChild(option);
    });
}

function setDefaultSelections() {
    populateTypeSelect(elements.resourceTypeSelect, getResourceCategories());
    populateTypeSelect(elements.groupTypeSelect, groupCategories);
    elements.actionSelect.value = "Allow";
    elements.targetSelect.value = "D";
    elements.osSelect.value = state.objectType === "group" ? "" : "WIN";
}

function applyObjectTypeUi() {
    const isGroup = state.objectType === "group";
    const isConditionalAccess = state.objectType === "conditionalAccess";
    const isAzure = state.objectType === "azureResource";
    const needsResourceType = state.objectType === "intuneResource" || isAzure;

    elements.resourceTypeField.classList.toggle("hidden", !needsResourceType);
    elements.groupTypeField.classList.toggle("hidden", !isGroup);
    elements.actionField.classList.toggle("hidden", !isConditionalAccess);
    elements.targetField.classList.toggle("hidden", isAzure);
    elements.osField.classList.toggle("hidden", isAzure || isConditionalAccess);
    elements.resourceTypeLabel.textContent = isAzure ? "Azure resource type" : "Resource type";
    elements.typeFirstHelp.textContent = getOrderHelpText();

    if (isConditionalAccess) {
        populateSimpleSelect(elements.targetSelect, conditionalAccessTargetOptions);
        elements.goalInput.placeholder = "Such as RequireMFA, BlockLegacyAuth, AdminRoles";
    } else {
        populateSimpleSelect(elements.targetSelect, targetOptions);
        elements.goalInput.placeholder = isAzure ? "Such as prod, core, app01" : "Such as OneDrive, FSLogix, BitLocker, All Devices";
    }

    if (isGroup && !elements.osSelect.value) {
        elements.osSelect.value = "";
    }

    populateTypeSelect(elements.resourceTypeSelect, getResourceCategories(), elements.resourceTypeSearchInput.value, elements.resourceTypeSelect.value);
    populateTypeSelect(elements.groupTypeSelect, groupCategories, elements.groupTypeSearchInput.value, elements.groupTypeSelect.value);
    updateTypeDescription();
}

function getOrderHelpText() {
    if (state.objectType === "conditionalAccess") {
        return "Switch between Prefix-Action and Action-Prefix.";
    }

    if (state.objectType === "azureResource") {
        return "Azure defaults to ResourceType-Prefix-Name. Turn this off for Prefix-ResourceType-Name.";
    }

    return "Switch between Prefix-Type and Type-Prefix.";
}

function getResourceCategories() {
    return state.objectType === "azureResource" ? azureResourceCategories : intuneResourceCategories;
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

        matchingItems.forEach((item, index) => {
            const option = document.createElement("option");
            const itemValue = getTypeValue(item, category.category, index);
            option.value = itemValue;
            option.textContent = `${item.code} - ${item.label}`;
            option.dataset.code = item.code;
            option.dataset.label = item.label;
            option.dataset.category = category.category;
            option.dataset.separator = item.separator ?? "-";
            optgroup.appendChild(option);
        });

        selectElement.appendChild(optgroup);
    });

    if (selectElement.querySelector(`option[value="${cssEscape(previousValue)}"]`)) {
        selectElement.value = previousValue;
    }
}

function getTypeValue(item, category, index) {
    return `${category}-${item.code}-${item.label}-${index}`;
}

function populateSimpleSelect(selectElement, options) {
    selectElement.innerHTML = "";

    options.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.code;
        option.textContent = item.code && item.code !== item.label ? `${item.code} - ${item.label}` : item.label;
        selectElement.appendChild(option);
    });
}

function filterTypeSelect() {
    if (state.objectType === "group") {
        populateTypeSelect(elements.groupTypeSelect, groupCategories, elements.groupTypeSearchInput.value, elements.groupTypeSelect.value);
        return;
    }

    populateTypeSelect(elements.resourceTypeSelect, getResourceCategories(), elements.resourceTypeSearchInput.value, elements.resourceTypeSelect.value);
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
    const parts = getNameParts();
    const validation = validateName(parts);

    elements.generatedName.textContent = parts.name || "Complete the fields to generate a name";
    elements.partPrefixLabel.textContent = parts.prefixLabel;
    elements.partPrefix.textContent = parts.prefix || "-";
    elements.partTypeLabel.textContent = parts.typeLabelName;
    elements.partType.textContent = parts.type || "-";
    elements.partTargetRow.classList.toggle("hidden", !parts.target);
    elements.partTarget.textContent = parts.target || "-";
    elements.partOsRow.classList.toggle("hidden", parts.os === null);
    elements.partOs.textContent = parts.os || "-";
    elements.partGoal.textContent = parts.goal || "-";
    elements.conventionText.textContent = parts.convention;

    elements.validationMessage.textContent = validation.message;
    elements.validationMessage.className = `validation-message ${validation.level}`;

    updateTypeDescription();

    return {
        ...parts,
        isValid: validation.level !== "error"
    };
}

function getNameParts() {
    if (state.objectType === "conditionalAccess") {
        return getConditionalAccessParts();
    }

    if (state.objectType === "azureResource") {
        return getAzureResourceParts();
    }

    return getTypeBasedParts();
}

function getTypeBasedParts() {
    const prefix = sanitizePart(elements.prefixInput.value).toUpperCase();
    const goal = sanitizeGoal(elements.goalInput.value, false);
    const selectedType = getSelectedType();
    const type = selectedType.code;
    const target = elements.targetSelect.value;
    const os = elements.osSelect.value;
    const leadParts = elements.typeFirstToggle.checked ? [type, prefix] : [prefix, type];
    const name = [...leadParts, target, os, goal].filter(Boolean).join("-");
    const firstTwo = elements.typeFirstToggle.checked ? "Type-Prefix" : "Prefix-Type";

    return {
        name,
        prefix,
        prefixLabel: "Prefix",
        type,
        typeLabelName: "Type",
        typeLabel: selectedType.label,
        target,
        os,
        goal,
        convention: `${firstTwo}-Target-OS-Name/Goal`,
        requiresOs: false
    };
}

function getConditionalAccessParts() {
    const prefix = sanitizePart(elements.prefixInput.value).toUpperCase();
    const action = elements.actionSelect.value;
    const target = elements.targetSelect.value;
    const goal = sanitizeGoal(elements.goalInput.value, false);
    const leadParts = elements.typeFirstToggle.checked ? [action, prefix] : [prefix, action];
    const name = [...leadParts, target, goal].filter(Boolean).join("-");
    const firstTwo = elements.typeFirstToggle.checked ? "Action-Prefix" : "Prefix-Action";

    return {
        name,
        prefix,
        prefixLabel: "Prefix",
        type: action,
        typeLabelName: "Action",
        typeLabel: "Conditional Access",
        target,
        os: null,
        goal,
        convention: `${firstTwo}-Target-Name/Goal`,
        requiresOs: false
    };
}

function getAzureResourceParts() {
    const prefix = sanitizePart(elements.prefixInput.value).toLowerCase();
    const selectedType = getSelectedType();
    const type = selectedType.code.toLowerCase();
    const separator = selectedType.separator;
    const allowsHyphen = separator === "-";
    const goal = sanitizeGoal(elements.goalInput.value, true);
    const leadParts = elements.typeFirstToggle.checked ? [type, prefix] : [prefix, type];
    const name = allowsHyphen
        ? [...leadParts, goal].filter(Boolean).join("-")
        : [...leadParts, goal].filter(Boolean).join(separator);
    const firstTwo = elements.typeFirstToggle.checked ? "ResourceType-Prefix" : "Prefix-ResourceType";

    return {
        name,
        prefix,
        prefixLabel: "Prefix",
        type,
        typeLabelName: "Resource type",
        typeLabel: selectedType.label,
        target: "",
        os: null,
        goal,
        convention: `${firstTwo}${allowsHyphen ? "-Name" : "-Name (no hyphens for this type)"}`,
        requiresOs: false
    };
}

function updateTypeDescription() {
    const selectedType = getSelectedType();
    const message = selectedType.code
        ? `${selectedType.code} means ${selectedType.label}.`
        : "No matching type found. Clear or adjust the search field.";

    if (state.objectType === "group") {
        elements.groupTypeDescription.textContent = message;
    } else if (state.objectType === "conditionalAccess") {
        elements.resourceTypeDescription.textContent = "Conditional Access uses Action, Target and Name / Goal.";
    } else {
        elements.resourceTypeDescription.textContent = message;
    }
}

function getSelectedType() {
    const select = state.objectType === "group" ? elements.groupTypeSelect : elements.resourceTypeSelect;
    const option = select.selectedOptions[0];

    return {
        code: option?.dataset.code || "",
        label: option?.dataset.label || option?.textContent || "",
        category: option?.dataset.category || "",
        separator: option?.dataset.separator ?? "-"
    };
}

function validateName(parts) {
    if (!parts.prefix || !parts.type || !parts.goal) {
        return { level: "error", message: "Prefix, type/action and name/goal are required." };
    }

    if (parts.target === "" && state.objectType !== "azureResource") {
        return { level: "error", message: "Target is required." };
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

function sanitizeGoal(value, lowercase) {
    const cleanValue = String(value || "")
        .trim()
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-zA-Z0-9-]/g, "")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    return lowercase ? cleanValue.toLowerCase() : cleanValue;
}

function resetForm(showMessage = true) {
    const config = platformConfig[state.platform];
    elements.prefixInput.value = config.prefixDefault;
    elements.goalInput.value = config.goalDefault;
    elements.typeFirstToggle.checked = config.typeFirstDefault;
    elements.resourceTypeSearchInput.value = "";
    elements.groupTypeSearchInput.value = "";
    elements.typeSearchInput.value = "";
    setDefaultSelections();
    applyObjectTypeUi();
    renderTypeOverview("");
    updatePreview();

    if (showMessage) {
        showToast("Form reset.");
    }
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

function renderTypeOverview(filter = "") {
    const categories = getOverviewCategories();
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

        matchingItems.forEach((item, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "type-item";
            button.innerHTML = `<span class="type-code">${escapeHtml(item.code)}</span><span>${escapeHtml(item.label)}</span>`;
            button.addEventListener("click", () => selectTypeFromOverview(item, category.category, index));
            list.appendChild(button);
        });

        card.appendChild(list);
        elements.typeOverview.appendChild(card);
    });

    if (!elements.typeOverview.children.length) {
        elements.typeOverview.innerHTML = '<p class="empty-message">No matching types found.</p>';
    }
}

function getOverviewCategories() {
    if (state.objectType === "group") {
        return groupCategories;
    }

    if (state.objectType === "azureResource") {
        return azureResourceCategories;
    }

    if (state.objectType === "conditionalAccess") {
        return [
            {
                category: "Conditional Access",
                items: [
                    { code: "Allow", label: "Allow access policy" },
                    { code: "Block", label: "Block access policy" }
                ]
            },
            {
                category: "Targets",
                items: conditionalAccessTargetOptions.map((item) => ({ code: item.code, label: item.label }))
            }
        ];
    }

    return intuneResourceCategories;
}

function selectTypeFromOverview(item, category, index) {
    if (state.objectType === "conditionalAccess") {
        const action = conditionalAccessActionOptions.find((option) => option.code === item.code);
        const target = conditionalAccessTargetOptions.find((option) => option.code === item.code);

        if (action) {
            elements.actionSelect.value = action.code;
        }

        if (target) {
            elements.targetSelect.value = target.code;
        }

        updatePreview();
        showToast(`${item.code} selected.`);
        return;
    }

    if (state.objectType === "group") {
        elements.groupTypeSearchInput.value = "";
        populateTypeSelect(elements.groupTypeSelect, groupCategories);
        elements.groupTypeSelect.value = getTypeValue(item, category, index);
    } else {
        elements.resourceTypeSearchInput.value = "";
        populateTypeSelect(elements.resourceTypeSelect, getResourceCategories());
        elements.resourceTypeSelect.value = getTypeValue(item, category, index);
    }

    updatePreview();
    showToast(`${item.code} selected.`);
}

function matchesTypeFilter(item, category, normalizedFilter) {
    if (!normalizedFilter) {
        return true;
    }

    const searchValue = `${item.code} ${item.label} ${category}`.toLowerCase();
    return searchValue.includes(normalizedFilter);
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
