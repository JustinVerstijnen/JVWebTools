(function () {
    "use strict";

    const headerInput = document.getElementById("headerInput");
    const searchbox = document.querySelector(".searchbox");
    const inputToggle = document.getElementById("inputToggle");
    const analyzeBtn = document.getElementById("analyzeBtn");
    const clearBtn = document.getElementById("clearBtn");
    const copyBtn = document.getElementById("copyBtn");
    const exportBtn = document.getElementById("exportBtn");
    const exportControl = document.getElementById("exportControl");
    const exportMenu = document.getElementById("exportMenu");
    const resultsSection = document.getElementById("resultsSection");
    const emptyState = document.getElementById("emptyState");

    let lastAnalysis = null;

    const summaryHeaders = [
        "Subject", "Message-ID", "Archived-At", "Date", "From", "Reply-To", "To", "CC", "Return-Path"
    ];

    const summaryLinks = {
        Subject: "https://tools.ietf.org/html/rfc5322#section-3.6.5",
        "Message Id": "https://tools.ietf.org/html/rfc5322#section-3.6.4",
        "Creation time": "https://tools.ietf.org/html/rfc5322#section-3.6.1",
        "Return-Path": "https://tools.ietf.org/html/rfc5321#section-4.4",
        From: "https://tools.ietf.org/html/rfc5322#section-3.6.2",
        To: "https://tools.ietf.org/html/rfc5322#section-3.6.3"
    };

    const securityHeaderNames = [
        "Authentication-Results",
        "ARC-Authentication-Results",
        "Received-SPF",
        "DKIM-Signature",
        "ARC-Seal",
        "ARC-Message-Signature",
        "X-Forefront-Antispam-Report",
        "X-Microsoft-Antispam",
        "X-Microsoft-Antispam-Mailbox-Delivery",
        "X-MS-Exchange-Organization-SCL",
        "X-MS-Exchange-Organization-PCL",
        "X-MS-Exchange-Organization-BCL",
        "X-Originating-IP"
    ];

    document.getElementById("copyright-year").textContent = new Date().getFullYear();

    window.addEventListener("load", () => {
        headerInput.focus();
        headerInput.select();
    });

    headerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            const hasLikelyHeaders = /(^|\n)[A-Za-z0-9.-]+:\s+/m.test(headerInput.value);
            if (hasLikelyHeaders) {
                event.preventDefault();
                analyze();
            }
        }
    });

    headerInput.addEventListener("paste", () => {
        window.setTimeout(() => {
            if (/Received:|Authentication-Results:|From:|Subject:/i.test(headerInput.value)) {
                analyze();
            }
        }, 80);
    });

    analyzeBtn.addEventListener("click", analyze);
    clearBtn.addEventListener("click", clearAll);
    copyBtn.addEventListener("click", copyAnalysis);
    inputToggle.addEventListener("click", toggleInput);
    exportBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        if (exportBtn.disabled) return;
        exportControl.classList.toggle("open");
        exportBtn.setAttribute("aria-expanded", exportControl.classList.contains("open") ? "true" : "false");
    });

    exportMenu.addEventListener("click", (event) => {
        const target = event.target.closest("[data-export-format]");
        if (!target) return;
        exportControl.classList.remove("open");
        exportBtn.setAttribute("aria-expanded", "false");
        exportReport(target.dataset.exportFormat);
    });

    document.addEventListener("click", () => {
        exportControl.classList.remove("open");
        exportBtn.setAttribute("aria-expanded", "false");
    });

    function clearAll() {
        headerInput.value = "";
        lastAnalysis = null;
        expandInput();
        inputToggle.hidden = true;
        resultsSection.hidden = true;
        emptyState.hidden = false;
        copyBtn.disabled = true;
        exportBtn.disabled = true;
        headerInput.focus();
    }

    function analyze() {
        const raw = headerInput.value.trim();
        if (!raw) {
            emptyState.textContent = "No headers found.";
            emptyState.hidden = false;
            resultsSection.hidden = true;
            return;
        }

        const headers = parseHeaders(raw);
        if (!headers.length) {
            emptyState.textContent = "No usable headers found.";
            emptyState.hidden = false;
            resultsSection.hidden = true;
            return;
        }

        lastAnalysis = buildAnalysis(raw, headers);
        render(lastAnalysis);
        emptyState.hidden = true;
        resultsSection.hidden = false;
        copyBtn.disabled = false;
        exportBtn.disabled = false;
        collapseInput();
    }

    function collapseInput() {
        inputToggle.hidden = false;
        requestAnimationFrame(() => searchbox.classList.add("input-collapsed"));
        inputToggle.setAttribute("aria-expanded", "false");
        inputToggle.title = "Show pasted header";
    }

    function expandInput() {
        searchbox.classList.remove("input-collapsed");
        inputToggle.hidden = false;
        inputToggle.setAttribute("aria-expanded", "true");
        inputToggle.title = "Hide pasted header";
    }

    function toggleInput() {
        if (searchbox.classList.contains("input-collapsed")) {
            expandInput();
            window.setTimeout(() => headerInput.focus(), 180);
        } else {
            collapseInput();
        }
    }

    function parseHeaders(raw) {
        const lines = raw.replace(/\r\n|\r/g, "\n").split("\n");
        const headers = [];
        let current = null;
        let sawHeader = false;

        for (const originalLine of lines) {
            const line = originalLine.replace(/\0/g, "");
            if (line === "" && sawHeader) break;
            if (line === "" && !sawHeader) continue;

            const match = line.match(/^([A-Za-z0-9][A-Za-z0-9.-]*):\s*(.*)$/);
            if (match && !/^\d{1,2}$/.test(match[1])) {
                current = { name: match[1], value: decodeMimeWords(match[2] || "") };
                headers.push(current);
                sawHeader = true;
            } else if (current && /^\s+/.test(line)) {
                current.value += " " + decodeMimeWords(line.trim());
            } else if (current && line.trim()) {
                current.value += " " + decodeMimeWords(line.trim());
            }
        }

        return headers;
    }

    function decodeMimeWords(value) {
        return String(value).replace(/=\?([^?]+)\?([BQ])\?([^?]+)\?=/gi, (full, charset, encoding, text) => {
            try {
                let bytes;
                if (encoding.toUpperCase() === "B") {
                    const binary = atob(text);
                    bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
                } else {
                    const qp = text.replace(/_/g, " ").replace(/=([0-9A-F]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
                    bytes = Uint8Array.from(qp, (char) => char.charCodeAt(0));
                }
                return new TextDecoder(charset || "utf-8").decode(bytes);
            } catch {
                return full;
            }
        });
    }

    function buildAnalysis(raw, headers) {
        const byName = groupByHeader(headers);
        const received = parseReceivedHeaders(byName.get("received") || []);
        const auth = parseAuthentication(headers, byName);
        const metrics = buildMetrics(headers, received, auth);
        const summary = buildMessageSummary(byName, metrics);
        const antispam = buildAntispamTables(byName);
        const specializedSecurityHeaders = new Set(["x-forefront-antispam-report", "x-microsoft-antispam"]);
        const security = securityHeaderNames
            .filter((name) => !specializedSecurityHeaders.has(name.toLowerCase()))
            .flatMap((name) => (byName.get(name.toLowerCase()) || []).map((header) => ({ name: header.name, value: header.value })));
        const other = headers
            .filter((header) => !summaryHeaders.some((name) => equalsHeader(name, header.name)))
            .filter((header) => !securityHeaderNames.some((name) => equalsHeader(name, header.name)))
            .filter((header) => !equalsHeader("Received", header.name))
            .map((header, index) => ({ number: index + 1, name: header.name, value: header.value }));
        const findings = buildFindings(headers, received, auth, byName);

        return {
            generatedAt: new Date().toISOString(),
            raw,
            headers,
            summary,
            antispam,
            security,
            other,
            received,
            auth,
            findings,
            metrics
        };
    }

    function buildMessageSummary(byName, metrics) {
        const date = firstValue(byName, "Date");
        const rows = [
            { label: "Subject", value: firstValue(byName, "Subject"), url: summaryLinks.Subject },
            { label: "Message Id", value: firstValue(byName, "Message-ID"), url: summaryLinks["Message Id"] },
            { label: "Creation time", value: date, url: summaryLinks["Creation time"] },
            { label: "Delivery time", value: metrics.totalDelivery, url: summaryLinks["Creation time"] },
            { label: "Return-Path", value: firstValue(byName, "Return-Path"), url: summaryLinks["Return-Path"] },
            { label: "From", value: firstValue(byName, "From"), url: summaryLinks.From },
            { label: "To", value: firstValue(byName, "To"), url: summaryLinks.To }
        ].filter((row) => row.value);

        return {
            rows,
            spam: buildSpamSummary(byName)
        };
    }

    function buildAntispamTables(byName) {
        const forefrontRaw = firstValue(byName, "X-Forefront-Antispam-Report");
        const microsoftRaw = firstValue(byName, "X-Microsoft-Antispam");
        return {
            forefront: buildForefrontRows(forefrontRaw),
            microsoft: buildMicrosoftAntispamRows(microsoftRaw)
        };
    }

    function buildForefrontRows(raw) {
        if (!raw) return [];
        const fields = parseSemicolonFields(raw);
        const rows = [];
        const sfv = String(fields.SFV || "").toUpperCase();
        const cat = String(fields.CAT || "").toUpperCase();
        const scl = String(fields.SCL || "");
        const sfvInfo = {
            NSPM: ["pass", "Not spam", "Microsoft spam filtering classified the message as not spam."],
            SPM: ["fail", "Spam", "Microsoft spam filtering classified the message as spam."],
            SFE: ["pass", "Safe sender", "Filtering was skipped because the sender is in the user's Safe Senders list."],
            SKN: ["pass", "Marked as non-spam", "The message was marked as non-spam before spam filtering."],
            SKS: ["warning", "Marked as spam", "The message was marked as spam before spam filtering."],
            SKQ: ["pass", "Released from quarantine", "The message was released from quarantine."],
            SKB: ["fail", "Blocked sender", "The sender is on the recipient's blocked senders list."],
            BLK: ["fail", "Blocked", "Microsoft filtering blocked the message."],
            SKA: ["pass", "Allowed", "The message matched an allow condition."],
            SKI: ["pass", "Allowed", "The message was allowed by filtering intelligence or policy."]
        };
        const sfvMeta = sfvInfo[sfv] || ["info", sfv || "Unknown", sfv ? "Microsoft returned this spam filtering verdict." : "No spam filtering verdict was present."];

        if (fields.LANG) rows.push({ label: "Language", value: fields.LANG, display: fields.LANG.toLowerCase(), description: "Detected message language." });
        if (scl) {
            const n = Number(scl);
            const status = n === -1 || (Number.isFinite(n) && n <= 1) ? "pass" : (Number.isFinite(n) && n >= 5 ? "fail" : "warning");
            const desc = n === -1 ? "Spam filtering was bypassed for the final message." : "Microsoft Spam Confidence Level.";
            rows.push({ label: "Spam Confidence Level", value: scl, display: `SCL ${scl}`, status, description: desc });
        }
        if (sfv) rows.push({ label: "Spam Filtering Verdict", value: sfv, display: `${sfv} — ${sfvMeta[1]}`, status: sfvMeta[0], description: sfvMeta[2] });
        if (fields.IPV) rows.push({ label: "IP Filter Verdict", value: fields.IPV, display: fields.IPV, description: "IP filtering verdict returned by Microsoft." });
        if (fields.H) rows.push({ label: "HELO/EHLO String", value: fields.H, display: fields.H });
        if (fields.PTR) rows.push({ label: "PTR Record", value: fields.PTR, display: fields.PTR });
        if (fields.CIP) rows.push({ label: "Connecting IP Address", value: fields.CIP, display: fields.CIP });
        if (cat) {
            const status = cat === "NONE" ? "pass" : "warning";
            rows.push({ label: "Protection Policy Category", value: cat, display: cat, status, description: cat === "NONE" ? "No Microsoft threat protection category was applied." : "Microsoft applied this protection category." });
        }
        if (fields.SFS) {
            const rules = String(fields.SFS).match(/\d+/g) || [];
            rows.push({ label: "Spam Rules", value: fields.SFS, display: `${rules.length} rule ID${rules.length === 1 ? "" : "s"}`, description: "Microsoft filtering rule identifiers present in the report.", technical: rules.join(" · ") || fields.SFS });
        }
        if (fields.DIR) rows.push({ label: "Direction", value: fields.DIR, display: fields.DIR === "INB" ? "Inbound" : fields.DIR === "OUT" ? "Outbound" : fields.DIR, description: `DIR:${fields.DIR}` });
        rows.push({ label: "Source header", value: raw, raw: true, summary: "Show X-Forefront-Antispam-Report" });
        return rows;
    }

    function buildMicrosoftAntispamRows(raw) {
        if (!raw) return [];
        const fields = parseSemicolonFields(raw);
        const rows = [];
        if (fields.BCL !== undefined) {
            const bcl = String(fields.BCL);
            const n = Number(bcl);
            const status = Number.isFinite(n) && n <= 3 ? "pass" : Number.isFinite(n) && n >= 7 ? "fail" : "warning";
            rows.push({ label: "Bulk Complaint Level", value: bcl, display: `BCL ${bcl}`, status, description: "Microsoft bulk-mail confidence score." });
        }
        if (fields.ARA) {
            const ids = String(fields.ARA).split("|").map((item) => item.trim()).filter(Boolean);
            rows.push({ label: "Additional Rule IDs", value: fields.ARA, display: `${ids.length} rule ID${ids.length === 1 ? "" : "s"}`, description: "Additional Microsoft antispam rule identifiers.", technical: ids.join(" · ") });
        }
        const known = new Set(["BCL", "ARA"]);
        const extra = Object.entries(fields).filter(([key]) => !known.has(key));
        if (extra.length) rows.push({ label: "Additional fields", value: extra.map(([key, value]) => `${key}:${value}`).join("; "), display: `${extra.length} additional field${extra.length === 1 ? "" : "s"}`, technical: extra.map(([key, value]) => `${key}:${value}`).join(" · ") });
        rows.push({ label: "Source header", value: raw, raw: true, summary: "Show X-Microsoft-Antispam" });
        return rows;
    }

    function buildSpamSummary(byName) {
        const report = firstValue(byName, "X-Forefront-Antispam-Report");
        if (!report) return null;

        const fields = parseSemicolonFields(report);
        const sfv = (fields.SFV || "").toUpperCase();
        const cat = (fields.CAT || "").toUpperCase();
        const dir = (fields.DIR || "").toUpperCase();
        const reportScl = fields.SCL || "";
        const organizationScl = firstValue(byName, "X-MS-Exchange-Organization-SCL").trim();
        const scl = organizationScl || reportScl;
        const context = [
            cat ? `CAT:${cat}` : "",
            sfv ? `SFV:${sfv}` : "",
            scl ? `SCL:${scl}` : "",
            dir ? `DIR:${dir}` : ""
        ].filter(Boolean).join(", ");

        // Microsoft documents CAT as the threat-policy category to use when
        // interpreting cloud filtering. A non-NONE category takes precedence
        // over a generic SFV allow/bypass signal in this summary.
        const categoryVerdicts = {
            SPM: ["warning", "Email Spam", "Microsoft categorized this message as spam."],
            HSPM: ["warning", "High Confidence Spam", "Microsoft categorized this message as high confidence spam."],
            BULK: ["warning", "Bulk Email", "Microsoft categorized this message as bulk email."],
            PHSH: ["warning", "Email Phishing", "Microsoft categorized this message as phishing."],
            HPHSH: ["warning", "High Confidence Phishing", "Microsoft categorized this message as high confidence phishing."],
            HPHISH: ["warning", "High Confidence Phishing", "Microsoft categorized this message as high confidence phishing."],
            SPOOF: ["warning", "Email Spoofing", "Microsoft categorized this message as spoofing."],
            MALW: ["warning", "Email Malware", "Microsoft categorized this message as malware."],
            BIMP: ["warning", "Brand Impersonation", "Microsoft categorized this message as brand impersonation."],
            DIMP: ["warning", "Domain Impersonation", "Microsoft categorized this message as domain impersonation."],
            GIMP: ["warning", "Mailbox Intelligence Impersonation", "Microsoft categorized this message as mailbox intelligence impersonation."],
            UIMP: ["warning", "User Impersonation", "Microsoft categorized this message as user impersonation."],
            INTOS: ["warning", "Intra-Organization Phishing", "Microsoft categorized this message as intra-organization phishing."],
            AMP: ["warning", "Anti-Malware Detection", "Microsoft applied an anti-malware threat category to this message."],
            FTBP: ["warning", "Common Attachment Filter", "Microsoft applied the common attachments filter to this message."],
            SAP: ["warning", "Safe Attachments Detection", "Microsoft applied a Safe Attachments threat category to this message."],
            OSPM: ["warning", "Outbound Spam", "Microsoft categorized this message as outbound spam."]
        };

        if (cat && cat !== "NONE" && categoryVerdicts[cat]) {
            const [level, title, detail] = categoryVerdicts[cat];
            return { level, title, detail: `${detail} (${context})` };
        }

        const sfvVerdicts = {
            NSPM: ["success", "Email Not Spam", "Microsoft spam filtering marked this message as nonspam."],
            SFE: ["success", "Email Allowed - Safe Sender", "Microsoft skipped spam filtering and allowed the message because the sender is in the user's Safe Senders list."],
            SKA: ["success", "Email Allowed - Anti-Spam Allow List", "Microsoft skipped spam filtering because the sender or domain is allowed by an anti-spam policy."],
            SKI: ["success", "Email Allowed - IP Allow List", "Microsoft skipped spam filtering because the source IP address is in the IP Allow List."],
            SKN: ["success", "Spam Filtering Bypassed", "Microsoft bypassed spam filtering because of an Exchange mail flow rule."],
            SKQ: ["warning", "Released From Quarantine", "Microsoft released the message from quarantine and sent it to the intended recipients."],
            SPM: ["warning", "Email Spam", "Microsoft spam filtering marked this message as spam."],
            SKB: ["warning", "Email Spam - Blocked Sender", "Microsoft marked the message as spam because the sender or domain matched an anti-spam block list."],
            SKS: ["warning", "Email Marked as Spam Before Filtering", "The message was marked as spam before spam filtering processed it."],
            BLK: ["warning", "Email Blocked Sender", "Microsoft skipped filtering and blocked the message because the sender is in the user's Blocked Senders list."]
        };

        if (sfvVerdicts[sfv]) {
            const [level, title, detail] = sfvVerdicts[sfv];
            return { level, title, detail: `${detail} (${context})` };
        }

        if (cat === "NONE") {
            return {
                level: "success",
                title: "No Microsoft Threat Category",
                detail: `Microsoft reported CAT:NONE; no documented threat category was applied.${context ? ` (${context})` : ""}`
            };
        }

        if (sfv || cat || scl) {
            return {
                level: "info",
                title: "Microsoft Filtering Result",
                detail: `Filtering headers were found, but this tool does not map the result to spam without a documented spam/threat verdict.${context ? ` (${context})` : ""}`
            };
        }

        return null;
    }

    function parseSemicolonFields(value) {
        const fields = {};
        String(value || "").split(";").forEach((part) => {
            const separator = part.indexOf(":");
            if (separator < 1) return;
            const key = part.slice(0, separator).trim().toUpperCase();
            const fieldValue = part.slice(separator + 1).trim();
            if (key && !(key in fields)) fields[key] = fieldValue;
        });
        return fields;
    }

    function groupByHeader(headers) {
        const map = new Map();
        headers.forEach((header) => {
            const key = header.name.toLowerCase();
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(header);
        });
        return map;
    }

    function firstValue(byName, name) {
        return (byName.get(name.toLowerCase()) || [])[0]?.value || "";
    }

    function equalsHeader(a, b) {
        return String(a).toLowerCase() === String(b).toLowerCase();
    }

    function parseReceivedHeaders(receivedHeaders) {
        const rows = receivedHeaders.map((header) => parseReceived(header.value));
        rows.reverse();

        let lastTime = NaN;
        let positiveDeltaTotal = 0;
        rows.forEach((row) => {
            if (!Number.isNaN(row.timestamp)) {
                if (!Number.isNaN(lastTime) && lastTime < row.timestamp) {
                    positiveDeltaTotal += row.timestamp - lastTime;
                }
                lastTime = row.timestamp;
            }
        });

        lastTime = NaN;
        rows.forEach((row, index) => {
            row.hop = index + 1;
            if (!Number.isNaN(row.timestamp) && !Number.isNaN(lastTime)) {
                row.delayMs = row.timestamp - lastTime;
                row.delay = formatDuration(row.delayMs);
                row.delayPercent = row.delayMs > 0 && positiveDeltaTotal ? Math.round((row.delayMs / positiveDeltaTotal) * 100) : 0;
            } else {
                row.delayMs = NaN;
                row.delay = "";
                row.delayPercent = 0;
            }
            if (!Number.isNaN(row.timestamp)) lastTime = row.timestamp;
        });

        return rows;
    }

    function parseReceived(value) {
        const normalized = String(value || "").replace(/\s+/g, " ").trim().replace(/\bUTC\b/gi, "(UTC)");
        const semicolon = normalized.lastIndexOf(";");
        const body = semicolon >= 0 ? normalized.slice(0, semicolon).trim() : normalized;
        const dateText = semicolon >= 0 ? normalized.slice(semicolon + 1).trim() : findLooseDate(normalized);
        const parsedDate = parseDate(dateText);

        return {
            hop: "",
            from: extractReceivedField(body, "from"),
            by: extractReceivedField(body, "by"),
            with: extractReceivedField(body, "with"),
            id: extractReceivedField(body, "id"),
            for: extractReceivedField(body, "for"),
            via: extractReceivedField(body, "via"),
            date: parsedDate.label || dateText || "",
            timestamp: parsedDate.timestamp,
            delay: "",
            delayMs: NaN,
            source: value
        };
    }

    function findLooseDate(value) {
        const match = value.match(/((Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+)?\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}\s+\d{1,2}:\d{2}:\d{2}\s+[-+]\d{4}/i)
            || value.match(/\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}:\d{2}\s*(?:[-+]\d{4}|Z)?/i);
        return match ? match[0] : "";
    }

    function parseDate(value) {
        if (!value) return { label: "", timestamp: NaN };
        let cleaned = value.replace(/\s+\([^)]+\)\s*$/, "").trim();
        cleaned = cleaned.replace(/(\d{2}:\d{2}:\d{2})\s+UT$/i, "$1 +0000");
        const timestamp = Date.parse(cleaned);
        if (Number.isNaN(timestamp)) return { label: value, timestamp: NaN };
        return {
            label: new Date(timestamp).toLocaleString(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }),
            timestamp
        };
    }

    function extractReceivedField(value, field) {
        const fields = ["from", "by", "with", "id", "for", "via"];
        const nextFields = fields.filter((candidate) => candidate !== field).join("|");
        const pattern = new RegExp("\\b" + field + "\\b\\s+([\\s\\S]*?)(?=\\s+\\b(?:" + nextFields + ")\\b\\s+|$)", "i");
        const match = value.match(pattern);
        return match ? cleanupField(match[1]) : "";
    }

    function cleanupField(value) {
        return String(value || "").replace(/\s+/g, " ").replace(/[;,]\s*$/, "").trim();
    }

    function parseAuthentication(headers, byName) {
        const authResults = [
            ...(byName.get("authentication-results") || []),
            ...(byName.get("arc-authentication-results") || [])
        ];
        const receivedSpf = byName.get("received-spf") || [];
        const dkimSigs = byName.get("dkim-signature") || [];

        const authRows = [];
        const authText = authResults.map((header) => header.value).join(" \n ");
        const receivedSpfText = receivedSpf.map((header) => header.value).join(" \n ");

        authRows.push(extractAuthCheck("SPF", authText, receivedSpfText, "spf", "Received-SPF", authText));
        const dkimRow = extractAuthCheck("DKIM", authText, "", "dkim", "Authentication-Results", authText);
        enrichDkimRowWithSignature(dkimRow, dkimSigs);
        authRows.push(dkimRow);
        authRows.push(extractAuthCheck("DMARC", authText, "", "dmarc", "Authentication-Results", authText));

        const arcStatus = extractToken(authText, "arc");
        if (arcStatus) {
            const status = normalizeStatus(arcStatus.status);
            authRows.push({
                check: "ARC",
                status,
                result: authResultLabel(status),
                description: buildAuthDescription("ARC", status, arcStatus.details || arcStatus.status, authText),
                details: arcStatus.details || arcStatus.status,
                source: "ARC-Authentication-Results"
            });
        }

        const compAuth = extractToken(authText, "compauth");
        if (compAuth) {
            const status = normalizeStatus(compAuth.status);
            authRows.push({
                check: "Composite auth",
                status,
                result: authResultLabel(status),
                description: buildAuthDescription("Composite auth", status, compAuth.details || compAuth.status, authText),
                details: compAuth.details || compAuth.status,
                source: "Authentication-Results"
            });
        }


        return authRows;
    }

    function extractAuthCheck(label, authText, fallbackText, token, fallbackSource, fullAuthText) {
        const tokenResult = extractToken(authText, token);
        if (tokenResult) {
            const status = normalizeStatus(tokenResult.status);
            const details = tokenResult.details || tokenResult.status;
            return {
                check: label,
                status,
                result: authResultLabel(status),
                description: buildAuthDescription(label, status, details, fullAuthText || authText),
                details,
                source: "Authentication-Results"
            };
        }

        if (token === "spf" && fallbackText) {
            const match = fallbackText.match(/\b(pass|fail|softfail|neutral|none|temperror|permerror)\b/i);
            const status = normalizeStatus(match ? match[1] : "unknown");
            const details = cleanupField(fallbackText);
            return {
                check: label,
                status,
                result: authResultLabel(status),
                description: buildAuthDescription(label, status, details, fullAuthText || authText),
                details,
                source: fallbackSource
            };
        }

        return {
            check: label,
            status: "unknown",
            result: "Not found",
            description: "No result was found in the pasted headers.",
            details: "Not found in the pasted headers.",
            source: fallbackSource
        };
    }

    function authResultLabel(status) {
        const normalized = String(status || "unknown").toLowerCase();
        if (normalized === "pass") return "Passed";
        if (normalized === "fail") return "Failed";
        if (normalized === "softfail") return "Soft fail";
        if (normalized === "temperror") return "Temporary error";
        if (normalized === "permerror") return "Permanent error";
        if (normalized === "neutral") return "Neutral";
        if (normalized === "none") return "None";
        return "Unknown";
    }

    function buildAuthDescription(label, status, details, authText) {
        const technical = cleanupField(details);

        if (label === "SPF") {
            const senderIp = firstMatch(technical, /sender\s+ip\s+is\s+([^\s)]+)/i) || firstMatch(technical, /client-ip\s*=\s*([^;\s]+)/i);
            const mailFrom = firstMatch(technical, /smtp\.mailfrom\s*=\s*([^;\s)]+)/i);
            const prefix = status === "pass"
                ? "Sender IP is correctly authorized by SPF."
                : status === "fail"
                    ? "Sender IP is not authorized by SPF."
                    : "SPF returned " + authResultLabel(status).toLowerCase() + ".";
            const parts = [];
            if (senderIp) parts.push("Sender IP: " + senderIp);
            if (mailFrom) parts.push("smtp.mailfrom=" + mailFrom);
            return appendTechnical(prefix, parts.length ? parts.join(" · ") : technical);
        }

        if (label === "DKIM") {
            const domain = firstMatch(technical, /header\.d\s*=\s*([^;\s)]+)/i);
            const prefix = status === "pass"
                ? "DKIM signature was correctly verified."
                : status === "fail"
                    ? "DKIM signature verification failed."
                    : "DKIM verification returned " + authResultLabel(status).toLowerCase() + ".";
            return appendTechnical(prefix, domain ? "header.d=" + domain : technical);
        }

        if (label === "DMARC") {
            const fromDomain = firstMatch(technical, /header\.from\s*=\s*([^;\s)]+)/i);
            const policy = getEffectiveDmarcPolicy(authText);
            const action = firstMatch(technical, /\baction\s*=\s*(none|quarantine|reject)\b/i);
            let prefix = status === "pass"
                ? "DMARC alignment passed."
                : status === "fail"
                    ? "DMARC alignment failed."
                    : "DMARC returned " + authResultLabel(status).toLowerCase() + ".";
            if (policy) prefix += " Effective policy: " + policy + ".";
            const parts = [];
            if (action) parts.push("action=" + action.toLowerCase());
            if (fromDomain) parts.push("header.from=" + fromDomain);
            return appendTechnical(prefix, parts.length ? parts.join(" · ") : technical);
        }

        if (label === "ARC") {
            const prefix = status === "pass"
                ? "Authenticated Received Chain validated successfully."
                : status === "fail"
                    ? "Authenticated Received Chain validation failed."
                    : "ARC returned " + authResultLabel(status).toLowerCase() + ".";
            return appendTechnical(prefix, technical);
        }

        if (label === "Composite auth") {
            const reason = firstMatch(technical, /\breason\s*=\s*([^;\s)]+)/i);
            const instance = firstMatch(technical, /\bi\s*=\s*([^;\s)]+)/i);
            const prefix = status === "pass"
                ? "Microsoft composite authentication passed."
                : status === "fail"
                    ? "Microsoft composite authentication failed."
                    : "Microsoft composite authentication returned " + authResultLabel(status).toLowerCase() + ".";
            const parts = [];
            if (reason) parts.push("reason=" + reason);
            if (instance) parts.push("i=" + instance);
            return appendTechnical(prefix, parts.length ? parts.join(" · ") : technical);
        }

        return technical;
    }

    function enrichDkimRowWithSignature(row, dkimSigs) {
        if (!row || !dkimSigs.length) return;
        const signatures = dkimSigs.map((header) => extractDkimSignatureParts(header.value)).filter((item) => item.domain || item.selector);
        if (!signatures.length) return;

        const uniqueSignatures = [];
        signatures.forEach((signature) => {
            const key = `${signature.domain}|${signature.selector}`;
            if (!uniqueSignatures.some((item) => `${item.domain}|${item.selector}` === key)) uniqueSignatures.push(signature);
        });

        const signatureText = uniqueSignatures.map((signature) => {
            if (signature.domain && signature.selector) return `Signing domain: ${signature.domain} · selector=${signature.selector}`;
            if (signature.domain) return `Signing domain: ${signature.domain}`;
            return `selector=${signature.selector}`;
        }).join(" · ");

        const parts = String(row.description || "").split("||");
        const summary = parts.shift() || "";
        const technical = [parts.join("||"), signatureText].filter(Boolean).join(" · ");
        row.description = appendTechnical(summary, technical);
        row.signature = uniqueSignatures;
    }

    function buildDkimSignatureDescription(domains, status, hasVerdict) {
        const signatureText = domains.length
            ? "Signature present for " + unique(domains).join(", ") + "."
            : "DKIM signature header is present.";
        if (!hasVerdict) return signatureText + " No DKIM verification result was found.";
        if (status === "pass") return signatureText + " The DKIM verification result is Passed.";
        if (status === "fail") return signatureText + " The DKIM verification result is Failed.";
        return signatureText + " DKIM verification returned " + authResultLabel(status) + ".";
    }

    function appendTechnical(summary, technical) {
        const cleanTechnical = cleanupField(technical);
        return cleanTechnical ? summary + "||" + cleanTechnical : summary;
    }

    function firstMatch(text, pattern) {
        const match = String(text || "").match(pattern);
        return match ? cleanupField(match[1]) : "";
    }

    function getEffectiveDmarcPolicy(authText) {
        const text = String(authText || "");
        const dmarcSegments = text.match(/\bdmarc\s*=\s*[^;]+/gi) || [];
        for (const segment of dmarcSegments) {
            const policy = segment.match(/(?:^|[\s(])p\s*=\s*(none|quarantine|reject)\b/i);
            if (policy) return titleCase(policy[1]);
        }
        return "";
    }

    function titleCase(value) {
        const text = String(value || "").toLowerCase();
        return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
    }

    function extractToken(text, token) {
        if (!text) return null;
        const pattern = new RegExp("\\b" + token + "\\s*=\\s*([^;\\s]+)([^;]*)", "i");
        const match = text.match(pattern);
        if (!match) return null;
        return {
            status: cleanupField(match[1]),
            details: cleanupField((match[0] || "").replace(/^[^=]+=/, ""))
        };
    }

    function normalizeStatus(status) {
        const normalized = String(status || "unknown").toLowerCase();
        if (normalized === "pass" || normalized === "bestguesspass") return "pass";
        if (["fail", "hardfail", "policy", "permerror"].includes(normalized)) return "fail";
        if (["softfail", "temperror", "neutral", "none"].includes(normalized)) return normalized;
        return "unknown";
    }

    function extractDkimSignatureParts(value) {
        const domain = String(value || "").match(/\bd=([^;\s]+)/i);
        const selector = String(value || "").match(/\bs=([^;\s]+)/i);
        return {
            domain: domain ? domain[1] : "",
            selector: selector ? selector[1] : ""
        };
    }

    function extractDkimSignatureDomain(value) {
        const parts = extractDkimSignatureParts(value);
        if (parts.domain && parts.selector) return `${parts.domain} (selector ${parts.selector})`;
        return parts.domain;
    }

    function unique(values) {
        return Array.from(new Set(values));
    }

    function buildMetrics(headers, received, auth) {
        const start = received.find((row) => !Number.isNaN(row.timestamp));
        const end = [...received].reverse().find((row) => !Number.isNaN(row.timestamp));
        const dateHeader = headers.find((header) => equalsHeader(header.name, "Date"));
        const messageDate = dateHeader ? parseDate(dateHeader.value).timestamp : NaN;
        const receivedSpanMs = start && end ? end.timestamp - start.timestamp : NaN;
        const messageToDeliveryMs = end && !Number.isNaN(messageDate) ? end.timestamp - messageDate : NaN;
        const totalMs = !Number.isNaN(messageToDeliveryMs) && messageToDeliveryMs >= 0
            ? messageToDeliveryMs
            : receivedSpanMs;
        const countedAuth = auth.filter((row) => row.countsAsCheck !== false);
        const failed = countedAuth.filter((row) => row.status === "fail").length;
        const passed = countedAuth.filter((row) => row.status === "pass").length;
        const unknown = countedAuth.filter((row) => ["unknown", "none", "neutral", "softfail", "temperror"].includes(row.status)).length;

        return {
            headerCount: headers.length,
            hopCount: received.length,
            totalDelivery: Number.isNaN(totalMs) ? "" : formatDuration(totalMs),
            passed,
            failed,
            unknown
        };
    }

    function buildFindings(headers, received, auth, byName) {
        const findings = [];
        const findingAuth = auth.filter((row) => row.countsAsCheck !== false);
        const failRows = findingAuth.filter((row) => row.status === "fail");
        const warnRows = findingAuth.filter((row) => ["softfail", "temperror", "neutral", "none", "unknown"].includes(row.status));
        const longDelays = received.filter((row) => !Number.isNaN(row.delayMs) && row.delayMs > 5 * 60 * 1000);
        const negativeDelays = received.filter((row) => !Number.isNaN(row.delayMs) && row.delayMs < 0);

        if (failRows.length) {
            findings.push({ level: "error", text: `${failRows.map((row) => row.check).join(", ")} returned a fail result. Check spoofing, forwarding or DNS policy.` });
        }
        if (warnRows.length) {
            findings.push({ level: "warning", text: `${warnRows.map((row) => row.check).join(", ")} is unknown or inconclusive. Interpret this together with the receiving system headers.` });
        }
        if (longDelays.length) {
            findings.push({ level: "warning", text: `${longDelays.length} hop(s) have more than 5 minutes of delay.` });
        }
        if (negativeDelays.length) {
            findings.push({ level: "warning", text: "A negative delay usually indicates clock skew between mail servers." });
        }
        if (!received.length) {
            findings.push({ level: "warning", text: "No Received headers were found; route and delay cannot be determined." });
        }
        if (!firstValue(byName, "Authentication-Results") && !firstValue(byName, "Received-SPF")) {
            findings.push({ level: "warning", text: "No Authentication-Results or Received-SPF headers were found." });
        }
        return findings;
    }

    function formatDuration(ms) {
        if (Number.isNaN(ms)) return "";
        const negative = ms < 0;
        let remaining = Math.abs(ms);
        const minutes = Math.floor(remaining / 60000);
        remaining -= minutes * 60000;
        const seconds = Math.floor(remaining / 1000);
        const parts = [];
        if (minutes) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
        if (seconds || !parts.length) parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);
        return `${negative ? "Negative " : ""}${parts.join(" ")}`;
    }

    function render(analysis) {
        renderMessageSummary(analysis.summary);
        renderFindings(analysis.findings);
        renderAuth(analysis.auth);
        renderReceived(analysis.received);
        renderAntispamTable("forefrontTable", analysis.antispam.forefront);
        renderAntispamTable("microsoftAntispamTable", analysis.antispam.microsoft);
        renderKeyValueTable("securityTable", analysis.security);
        renderOther(analysis.other);
    }

    function renderMessageSummary(summary) {
        const messageSummary = document.getElementById("messageSummary");
        const tableRows = summary.rows.length
            ? summary.rows.map((row) => `
                <tr>
                    <td><a class="summary-link" href="${escapeHtml(row.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(row.label)}</a></td>
                    <td>${escapeHtml(row.value)}</td>
                </tr>
            `).join("")
            : `<tr class="row-warning"><td colspan="2">No summary headers found.</td></tr>`;

        const spam = summary.spam ? `
            <div class="spam-summary spam-summary-${statusLevel(summary.spam.level)}">
                <span class="badge ${badgeClass(summary.spam.level)}">${escapeHtml(summary.spam.level)}</span>
                <strong>${escapeHtml(summary.spam.title)}</strong>
                <span>${escapeHtml(summary.spam.detail)}</span>
            </div>
        ` : "";

        messageSummary.innerHTML = `
            ${spam}
            <div class="table-wrapper">
                <table id="messageSummaryTable">
                    <thead><tr><th>Header</th><th>Value</th></tr></thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
        `;
    }

    function renderFindings(findings) {
        const analysisBox = document.getElementById("analysisBox");
        analysisBox.hidden = !findings.length;
        analysisBox.innerHTML = findings.map((finding) => `
            <p><span class="badge ${badgeClass(finding.level)}">${escapeHtml(finding.level)}</span> ${escapeHtml(finding.text)}</p>
        `).join("");
    }

    function renderAuth(rows) {
        const tbody = document.querySelector("#authTable tbody");
        tbody.innerHTML = "";
        rows.forEach((row) => {
            const tr = document.createElement("tr");
            tr.className = rowClass(row.status);
            const descriptionParts = String(row.description || row.details || "").split("||");
            const summary = descriptionParts.shift() || "";
            const technical = descriptionParts.join("||");
            tr.innerHTML = `
                <td class="auth-check"><strong>${escapeHtml(row.check)}</strong></td>
                <td class="auth-result">
                    <div class="auth-result-line">
                        ${statusIcon(row.status, row.details)}
                        <strong class="auth-result-label">${escapeHtml(row.result || authResultLabel(row.status))}</strong>
                    </div>
                    <div class="auth-explanation">${escapeHtml(summary)}</div>
                    ${technical ? `<div class="auth-technical">${escapeHtml(technical)}</div>` : ""}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderReceived(rows) {
        const tbody = document.querySelector("#receivedTable tbody");
        tbody.innerHTML = "";
        if (!rows.length) {
            tbody.innerHTML = `<tr class="row-warning"><td colspan="3">No Received headers found.</td></tr>`;
            return;
        }
        rows.forEach((row) => {
            const tr = document.createElement("tr");
            tr.className = receivedRowClass(row);
            tr.innerHTML = `
                <td>${renderServerValue(row.from)}</td>
                <td>${renderServerValue(row.by)}</td>
                <td>${escapeHtml(row.date)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderAntispamTable(tableId, rows) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        tbody.innerHTML = "";
        if (!rows || !rows.length) {
            tbody.innerHTML = `<tr class="row-warning"><td colspan="2">Not found in this header.</td></tr>`;
            return;
        }
        rows.forEach((row) => {
            const tr = document.createElement("tr");
            if (row.status) tr.className = rowClass(row.status);
            const valueHtml = row.raw
                ? `<details class="inline-details"><summary>${escapeHtml(row.summary || "Show raw header")}</summary><code>${escapeHtml(row.value)}</code></details>`
                : `<div class="antispam-value">${row.status ? statusIcon(row.status, row.value) : ""}<div><strong>${escapeHtml(row.display || row.value)}</strong>${row.description ? `<div class="antispam-description">${escapeHtml(row.description)}</div>` : ""}${row.technical ? `<div class="auth-technical">${escapeHtml(row.technical)}</div>` : ""}</div></div>`;
            tr.innerHTML = `<td class="antispam-field"><strong>${escapeHtml(row.label)}</strong></td><td>${valueHtml}</td>`;
            tbody.appendChild(tr);
        });
    }

    function renderKeyValueTable(tableId, rows) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        tbody.innerHTML = "";
        if (!rows.length) {
            tbody.innerHTML = `<tr class="row-warning"><td colspan="2">Not found.</td></tr>`;
            return;
        }
        rows.forEach((row) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td><strong>${escapeHtml(row.name)}</strong></td><td>${renderValue(row.value)}</td>`;
            tbody.appendChild(tr);
        });
    }

    function renderOther(rows) {
        const tbody = document.querySelector("#otherTable tbody");
        tbody.innerHTML = "";
        if (!rows.length) {
            tbody.innerHTML = `<tr><td colspan="3">No other headers.</td></tr>`;
            return;
        }
        rows.forEach((row) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${row.number}</td><td><strong>${escapeHtml(row.name)}</strong></td><td>${renderValue(row.value)}</td>`;
            tbody.appendChild(tr);
        });
    }

    function renderValue(value) {
        const values = String(value || "").split(/\s+(?=[A-Za-z0-9.-]+=[^;\s]+)/).filter(Boolean);
        if (values.length > 3 && values.every((entry) => /=/.test(entry))) {
            return `<ul class="value-list">${values.map((entry) => `<li>${escapeHtml(entry)}</li>`).join("")}</ul>`;
        }
        return escapeHtml(value);
    }

    function renderServerValue(value) {
        const cleaned = removeIpv6Addresses(value);
        const original = String(value || "");
        const title = cleaned !== original ? ` title="${escapeHtml(original)}"` : "";
        return `<span${title}>${escapeHtml(cleaned)}</span>`;
    }

    function removeIpv6Addresses(value) {
        const cleaned = String(value || "")
            .replace(/\s*\[(?:IPv6:)?[0-9a-f:.%]+\]/gi, "")
            .replace(/\s*\((?:IPv6:)?[0-9a-f]{0,4}:[0-9a-f:.%]+\)/gi, "")
            .replace(/\(\s*\)/g, "")
            .replace(/\s{2,}/g, " ")
            .trim();
        const duplicateHost = cleaned.match(/^(.+?)\s+\((.+)\)$/);
        if (duplicateHost && duplicateHost[1].trim().toLowerCase() === duplicateHost[2].trim().toLowerCase()) {
            return duplicateHost[1].trim();
        }
        return cleaned;
    }

    function rowClass(status) {
        if (status === "pass" || status === "success") return "row-success";
        if (status === "fail" || status === "error") return "row-error";
        return "row-warning";
    }

    function receivedRowClass(row) {
        if (!Number.isNaN(row.delayMs) && row.delayMs < 0) return "row-warning";
        if (!Number.isNaN(row.delayMs) && row.delayMs > 10 * 60 * 1000) return "row-error";
        if (!Number.isNaN(row.delayMs) && row.delayMs > 5 * 60 * 1000) return "row-warning";
        return "";
    }

    function statusBadge(status) {
        return `<span class="badge ${badgeClass(status)}">${escapeHtml(status || "unknown")}</span>`;
    }

    function statusIcon(status, details) {
        const level = statusLevel(status);
        const label = statusTooltipLabel(status);
        return `<span class="status-icon status-${level}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">${statusIconSvg(level)}</span>`;
    }

    function statusTooltipLabel(status) {
        if (status === "pass" || status === "success") return "Pass";
        if (status === "fail" || status === "error") return "Fail";
        return `Other status: ${String(status || "Unknown")}`;
    }

    function statusIconSvg(level) {
        if (level === "success") {
            return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.2 16.6 4.9 12.3 3.5 13.7l5.7 5.7L20.5 8.1l-1.4-1.4-9.9 9.9Z"/></svg>`;
        }
        if (level === "error") {
            return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m13.4 12 5.3-5.3-1.4-1.4-5.3 5.3-5.3-5.3-1.4 1.4 5.3 5.3-5.3 5.3 1.4 1.4 5.3-5.3 5.3 5.3 1.4-1.4-5.3-5.3Z"/></svg>`;
        }
        return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z"/></svg>`;
    }

    function statusLevel(status) {
        if (status === "pass" || status === "success") return "success";
        if (status === "fail" || status === "error") return "error";
        return "warning";
    }

    function badgeClass(status) {
        if (status === "info") return "badge-info";
        if (status === "pass" || status === "success") return "badge-success";
        if (status === "fail" || status === "error") return "badge-error";
        return "badge-warning";
    }

    function copyAnalysis() {
        if (!lastAnalysis) return;
        const text = analysisToText(lastAnalysis);
        navigator.clipboard.writeText(text).then(() => {
            copyBtn.innerHTML = "Copied";
            window.setTimeout(() => {
                copyBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 16H8V7h11v14Z"/></svg>Copy`;
            }, 1100);
        });
    }

    function analysisToText(analysis) {
        const lines = [];
        lines.push("Mail Header Analyzer");
        lines.push(`Generated: ${analysis.generatedAt}`);
        lines.push("");
        lines.push("Message summary:");
        if (analysis.summary.spam) {
            lines.push(`- ${analysis.summary.spam.level.toUpperCase()}: ${analysis.summary.spam.title}`);
            lines.push(`- ${analysis.summary.spam.detail}`);
        }
        analysis.summary.rows.forEach((row) => lines.push(`- ${row.label}: ${row.value}`));
        lines.push("");
        lines.push("Findings:");
        analysis.findings.forEach((finding) => lines.push(`- ${finding.level}: ${finding.text}`));
        lines.push("");
        lines.push("Authentication:");
        analysis.auth.forEach((row) => lines.push(`- ${row.check}: ${row.status} (${row.details})`));
        lines.push("");
        lines.push("Received:");
        analysis.received.forEach((row) => lines.push(`- ${row.from} -> ${row.by}; ${row.date}`));
        lines.push("");
        lines.push("Forefront Antispam Report:");
        analysis.antispam.forefront.forEach((row) => lines.push(`- ${row.label}: ${row.display || row.value}`));
        lines.push("");
        lines.push("Microsoft Antispam Header:");
        analysis.antispam.microsoft.forEach((row) => lines.push(`- ${row.label}: ${row.display || row.value}`));
        return lines.join("\n");
    }

    function exportReport(format) {
        if (!lastAnalysis) return;
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        if (format === "json") {
            download(JSON.stringify(lastAnalysis, null, 2), `mail-header-analysis-${stamp}.json`, "application/json;charset=utf-8");
            return;
        }
        if (format === "txt") {
            download(analysisToText(lastAnalysis), `mail-header-analysis-${stamp}.txt`, "text/plain;charset=utf-8");
            return;
        }
        download(buildHtmlExport(lastAnalysis), `mail-header-analysis-${stamp}.html`, "text/html;charset=utf-8");
    }

    function buildHtmlExport(analysis) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Mail Header Analysis</title>
<style>
body{font-family:Segoe UI,Arial,sans-serif;background:#f6f6f6;color:#111827;margin:24px}
.wrap{max-width:1100px;margin:auto;background:#fff;border-radius:10px;padding:24px;box-shadow:0 0 15px rgba(0,0,0,.08)}
table{width:100%;border-collapse:collapse;margin:16px 0;table-layout:fixed}
th,td{border:1px solid #ddd;padding:9px;text-align:left;vertical-align:top;overflow-wrap:anywhere}
th{background:#f2f2f2}.row-success{background:#eef8f1}.row-warning{background:#fff7e6}.row-error{background:#fdeeee}
</style>
</head>
<body><div class="wrap">
<h1>Mail Header Analysis</h1>
<p><strong>Generated:</strong> ${escapeHtml(analysis.generatedAt)}</p>
<h2>Message Summary</h2>
${analysis.summary.spam ? `<p><strong>${escapeHtml(analysis.summary.spam.level.toUpperCase())}: ${escapeHtml(analysis.summary.spam.title)}</strong><br>${escapeHtml(analysis.summary.spam.detail)}</p>` : ""}
${tableHtml("Summary", ["Header", "Value"], analysis.summary.rows.map((row) => [row.label, row.value]))}
<h2>Findings</h2>
<ul>${analysis.findings.map((f) => `<li><strong>${escapeHtml(f.level)}:</strong> ${escapeHtml(f.text)}</li>`).join("")}</ul>
${tableHtml("Authentication", ["Check", "Details", "Status"], analysis.auth.map((row) => [row.check, row.details, row.status]))}
${tableHtml("Received", ["From", "By", "Time"], analysis.received.map((row) => [removeIpv6Addresses(row.from), removeIpv6Addresses(row.by), row.date]))}
${tableHtml("Forefront Antispam Report", ["Field", "Result"], analysis.antispam.forefront.map((row) => [row.label, row.display || row.value]))}
${tableHtml("Microsoft Antispam Header", ["Field", "Result"], analysis.antispam.microsoft.map((row) => [row.label, row.display || row.value]))}
</div></body></html>`;
    }

    function tableHtml(title, headers, rows) {
        return `<h2>${escapeHtml(title)}</h2><table><thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    }

    function download(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }
})();
