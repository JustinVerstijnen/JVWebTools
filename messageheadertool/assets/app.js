(function () {
    "use strict";

    const headerInput = document.getElementById("headerInput");
    const searchbox = document.querySelector(".searchbox");
    const inputCollapsedBar = document.getElementById("inputCollapsedBar");
    const newHeaderBtn = document.getElementById("newHeaderBtn");
    const showHeaderBtn = document.getElementById("showHeaderBtn");
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
    newHeaderBtn.addEventListener("click", startNewHeader);
    showHeaderBtn.addEventListener("click", showCurrentHeader);
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
        resultsSection.hidden = true;
        emptyState.hidden = false;
        copyBtn.disabled = true;
        exportBtn.disabled = true;
        headerInput.focus();
    }

    function analyze() {
        const raw = headerInput.value.trim();
        if (!raw) {
            emptyState.textContent = "Geen headers gevonden.";
            emptyState.hidden = false;
            resultsSection.hidden = true;
            return;
        }

        const headers = parseHeaders(raw);
        if (!headers.length) {
            emptyState.textContent = "Geen bruikbare headers gevonden.";
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
        searchbox.classList.add("input-collapsed");
        inputCollapsedBar.hidden = false;
    }

    function expandInput() {
        searchbox.classList.remove("input-collapsed");
        inputCollapsedBar.hidden = true;
    }

    function startNewHeader() {
        headerInput.value = "";
        expandInput();
        headerInput.focus();
    }

    function showCurrentHeader() {
        expandInput();
        headerInput.focus();
        headerInput.select();
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
        const summary = summaryHeaders
            .map((name) => ({ name, value: firstValue(byName, name) }))
            .filter((row) => row.value);
        const security = securityHeaderNames
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
            security,
            other,
            received,
            auth,
            findings,
            metrics: buildMetrics(headers, received, auth)
        };
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

        authRows.push(extractAuthCheck("SPF", authText, receivedSpfText, "spf", "Received-SPF"));
        authRows.push(extractAuthCheck("DKIM", authText, "", "dkim", "Authentication-Results"));
        authRows.push(extractAuthCheck("DMARC", authText, "", "dmarc", "Authentication-Results"));

        const arcStatus = extractToken(authText, "arc");
        if (arcStatus) {
            authRows.push({
                check: "ARC",
                status: normalizeStatus(arcStatus.status),
                details: arcStatus.details || arcStatus.status,
                source: "ARC-Authentication-Results"
            });
        }

        const compAuth = extractToken(authText, "compauth");
        if (compAuth) {
            authRows.push({
                check: "Composite auth",
                status: normalizeStatus(compAuth.status),
                details: compAuth.details || compAuth.status,
                source: "Authentication-Results"
            });
        }

        if (dkimSigs.length) {
            const domains = dkimSigs.map((header) => extractDkimSignatureDomain(header.value)).filter(Boolean);
            authRows.push({
                check: "DKIM-Signature",
                status: "info",
                details: domains.length ? "Signing domain(s): " + unique(domains).join(", ") : dkimSigs.length + " DKIM signature header(s) gevonden.",
                source: "DKIM-Signature"
            });
        }

        return authRows;
    }

    function extractAuthCheck(label, authText, fallbackText, token, fallbackSource) {
        const tokenResult = extractToken(authText, token);
        if (tokenResult) {
            return {
                check: label,
                status: normalizeStatus(tokenResult.status),
                details: tokenResult.details || tokenResult.status,
                source: "Authentication-Results"
            };
        }

        if (token === "spf" && fallbackText) {
            const match = fallbackText.match(/\b(pass|fail|softfail|neutral|none|temperror|permerror)\b/i);
            return {
                check: label,
                status: normalizeStatus(match ? match[1] : "unknown"),
                details: cleanupField(fallbackText),
                source: fallbackSource
            };
        }

        return {
            check: label,
            status: "unknown",
            details: "Niet gevonden in de geplakte headers.",
            source: fallbackSource
        };
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

    function extractDkimSignatureDomain(value) {
        const domain = String(value || "").match(/\bd=([^;\s]+)/i);
        const selector = String(value || "").match(/\bs=([^;\s]+)/i);
        if (domain && selector) return `${domain[1]} (selector ${selector[1]})`;
        if (domain) return domain[1];
        return "";
    }

    function unique(values) {
        return Array.from(new Set(values));
    }

    function buildMetrics(headers, received, auth) {
        const start = received.find((row) => !Number.isNaN(row.timestamp));
        const end = [...received].reverse().find((row) => !Number.isNaN(row.timestamp));
        const totalMs = start && end ? end.timestamp - start.timestamp : NaN;
        const failed = auth.filter((row) => row.status === "fail").length;
        const passed = auth.filter((row) => row.status === "pass").length;
        const unknown = auth.filter((row) => ["unknown", "none", "neutral", "softfail", "temperror"].includes(row.status)).length;

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
        const failRows = auth.filter((row) => row.status === "fail");
        const warnRows = auth.filter((row) => ["softfail", "temperror", "neutral", "none", "unknown"].includes(row.status));
        const longDelays = received.filter((row) => !Number.isNaN(row.delayMs) && row.delayMs > 5 * 60 * 1000);
        const negativeDelays = received.filter((row) => !Number.isNaN(row.delayMs) && row.delayMs < 0);

        if (failRows.length) {
            findings.push({ level: "error", text: `${failRows.map((row) => row.check).join(", ")} heeft een fail-resultaat. Controleer spoofing, forwarding of DNS policy.` });
        }
        if (warnRows.length) {
            findings.push({ level: "warning", text: `${warnRows.map((row) => row.check).join(", ")} is onbekend of niet overtuigend. Interpreteer dit samen met de ontvangerheader.` });
        }
        if (longDelays.length) {
            findings.push({ level: "warning", text: `${longDelays.length} hop(s) hebben meer dan 5 minuten vertraging.` });
        }
        if (negativeDelays.length) {
            findings.push({ level: "warning", text: "Een negatieve delay wijst meestal op klokverschil tussen mailservers." });
        }
        if (!received.length) {
            findings.push({ level: "warning", text: "Er zijn geen Received headers gevonden; de route en vertraging kunnen niet worden bepaald." });
        }
        if (!firstValue(byName, "Authentication-Results") && !firstValue(byName, "Received-SPF")) {
            findings.push({ level: "warning", text: "Er zijn geen Authentication-Results of Received-SPF headers gevonden." });
        }
        if (!findings.length) {
            findings.push({ level: "success", text: "Geen directe rode vlaggen gevonden in de geplakte headers." });
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
        if (minutes) parts.push(`${minutes} min`);
        if (seconds || !parts.length) parts.push(`${seconds} sec`);
        return `${negative ? "Negative " : ""}${parts.join(" ")}`;
    }

    function render(analysis) {
        renderScoreCards(analysis);
        renderFindings(analysis.findings);
        renderAuth(analysis.auth);
        renderReceived(analysis.received);
        renderKeyValueTable("summaryTable", analysis.summary);
        renderKeyValueTable("securityTable", analysis.security);
        renderOther(analysis.other);
    }

    function renderScoreCards(analysis) {
        const scoreCards = document.getElementById("scoreCards");
        const cards = [
            ["Headers", analysis.metrics.headerCount, "Totaal geparst"],
            ["Received hops", analysis.metrics.hopCount, "Mailroute"],
            ["Delivery time", analysis.metrics.totalDelivery || "Onbekend", "Tussen eerste en laatste hop"],
            ["Auth checks", `${analysis.metrics.passed}/${analysis.auth.length}`, `${analysis.metrics.failed} fail, ${analysis.metrics.unknown} overig`]
        ];
        scoreCards.innerHTML = cards.map(([label, value, detail]) => `
            <div class="score-card">
                <div class="score-label">${escapeHtml(label)}</div>
                <div class="score-value">${escapeHtml(value)}</div>
                <div class="score-detail">${escapeHtml(detail)}</div>
            </div>
        `).join("");
    }

    function renderFindings(findings) {
        const analysisBox = document.getElementById("analysisBox");
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
            tr.innerHTML = `
                <td><strong>${escapeHtml(row.check)}</strong></td>
                <td>${escapeHtml(row.details || "")}</td>
                <td>${escapeHtml(row.source || "")}</td>
                <td class="status-cell">${statusIcon(row.status, row.details)}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderReceived(rows) {
        const tbody = document.querySelector("#receivedTable tbody");
        tbody.innerHTML = "";
        if (!rows.length) {
            tbody.innerHTML = `<tr class="row-warning"><td colspan="7">Geen Received headers gevonden.</td></tr>`;
            return;
        }
        rows.forEach((row) => {
            const tr = document.createElement("tr");
            tr.className = receivedRowClass(row);
            tr.innerHTML = `
                <td>${escapeHtml(row.hop)}</td>
                <td>${escapeHtml(row.from)}</td>
                <td>${escapeHtml(row.by)}</td>
                <td>${escapeHtml(row.date)}</td>
                <td>${escapeHtml(row.delay)}${row.delayPercent ? ` (${row.delayPercent}%)` : ""}</td>
                <td>${escapeHtml(row.with)}</td>
                <td>${escapeHtml([row.id, row.for].filter(Boolean).join(" / "))}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderKeyValueTable(tableId, rows) {
        const tbody = document.querySelector(`#${tableId} tbody`);
        tbody.innerHTML = "";
        if (!rows.length) {
            tbody.innerHTML = `<tr class="row-warning"><td colspan="2">Niet gevonden.</td></tr>`;
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
            tbody.innerHTML = `<tr><td colspan="3">Geen overige headers.</td></tr>`;
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
        const label = `${String(status || "unknown").toUpperCase()}${details ? ": " + details : ""}`;
        return `<span class="status-icon status-${level}" title="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">${statusIconSvg(level)}</span>`;
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
        lines.push("Findings:");
        analysis.findings.forEach((finding) => lines.push(`- ${finding.level}: ${finding.text}`));
        lines.push("");
        lines.push("Authentication:");
        analysis.auth.forEach((row) => lines.push(`- ${row.check}: ${row.status} (${row.details})`));
        lines.push("");
        lines.push("Received:");
        analysis.received.forEach((row) => lines.push(`- Hop ${row.hop}: ${row.from} -> ${row.by}; ${row.date}; delay ${row.delay || "unknown"}`));
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
<html lang="nl">
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
<h2>Findings</h2>
<ul>${analysis.findings.map((f) => `<li><strong>${escapeHtml(f.level)}:</strong> ${escapeHtml(f.text)}</li>`).join("")}</ul>
${tableHtml("Authentication", ["Check", "Status", "Details", "Source"], analysis.auth.map((row) => [row.check, row.status, row.details, row.source]))}
${tableHtml("Received", ["Hop", "From", "By", "Time", "Delay", "Type"], analysis.received.map((row) => [row.hop, row.from, row.by, row.date, row.delay, row.with]))}
${tableHtml("Summary", ["Header", "Value"], analysis.summary.map((row) => [row.name, row.value]))}
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
