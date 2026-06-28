const localScanForm = document.querySelector("[data-local-scan-form]");
const localScanInput = document.querySelector("[data-local-scan-input]");
const localScanOutput = document.querySelector("[data-local-scan-output]");
const localScanSummary = document.querySelector("[data-local-scan-summary]");
const openScanRequests = document.querySelectorAll("[data-open-scan-request]");
const auditPacketOutput = document.querySelector("[data-audit-packet-output]");
const publicScanForm = document.querySelector("[data-public-scan-form]");
const publicRepoInput = document.querySelector("[data-public-repo-url]");
const copyPublicScanLink = document.querySelector("[data-copy-public-scan-link]");
const copyAuditPacket = document.querySelector("[data-copy-audit-packet]");

const maxRemoteFiles = 45;

const fallbackRemotePaths = [
  "package.json",
  "README.md",
  "readme.md",
  "src/index.ts",
  "src/index.js",
  "src/server.ts",
  "src/server.js",
  "src/mcp.ts",
  "src/mcp.js",
  "src/app.ts",
  "src/app.js",
  "src/main.ts",
  "src/main.js",
  "src/tools/index.ts",
  "src/tools/index.js",
  "src/tools/registry.ts",
  "src/tools/registry.js",
  "src/tools/auth.ts",
  "src/tools/auth.js",
  "src/transport.ts",
  "src/transport.js",
  "src/auth.ts",
  "src/auth.js",
  "server.ts",
  "server.js",
  "index.ts",
  "index.js",
  "mcp.ts",
  "mcp.js",
  ".github/workflows/ci.yml",
  ".github/workflows/ci.yaml",
  ".github/workflows/test.yml",
  ".github/workflows/test.yaml",
];

const ignorePathParts = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  ".next",
  ".turbo",
  "coverage",
  "private-notes",
  ".venv",
  "venv",
  "__pycache__",
]);

const textExtensions = new Set([
  ".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs",
  ".py", ".go", ".rs", ".java", ".kt", ".rb", ".php",
  ".json", ".jsonc", ".yaml", ".yml", ".toml", ".env", ".md",
  ".sh", ".bash", ".zsh", ".dockerfile", "",
]);

const scanSignals = [
  {
    id: "mcp_surface",
    label: "MCP or agent tool surface",
    pattern: /\b(McpServer|registerTool|tools\/list|mcpServers|Model Context Protocol|tool_call|function_call|ToolMessage)\b/i,
  },
  {
    id: "remote_transport",
    label: "Remote transport or listener",
    pattern: /\b(SSEServerTransport|StreamableHTTP|http\.createServer|app\.listen|server\.listen|0\.0\.0\.0|localhost|PORT|--port|websocket|WebSocket)\b/i,
  },
  {
    id: "write_action",
    label: "Write or destructive action",
    pattern: /\b(writeFile|appendFile|rm\(|unlink|mkdir|rmdir|rename|exec\(|spawn\(|execa|child_process|axios\.(post|put|patch|delete)|fetch\([^)]*,\s*\{[^}]*method:\s*['"`](POST|PUT|PATCH|DELETE)|DELETE FROM|INSERT INTO|UPDATE\s+\w+)\b/i,
  },
  {
    id: "secret_env",
    label: "Secret-bearing environment or credential path",
    pattern: /\b(process\.env|API[_-]?KEY|SECRET|TOKEN|PRIVATE[_-]?KEY|COOKIE|PASSWORD|AUTHORIZATION|Bearer|SESSION)\b/i,
  },
  {
    id: "auth_gate",
    label: "Auth or permission gate",
    pattern: /\b(auth|authorize|permission|scope|role|login|session|cookie|csrf|jwt|token|requireAuth|requiresAuth)\b/i,
  },
  {
    id: "agent_auth_focus",
    label: "Agent auth or credential boundary",
    pattern: /\b(site_login|site_logout|oauth|ciba|hitl|cookie|session|jwt|bearer|authorization|api[_-]?key|credential|token broker|token|refresh_token|access_token)\b/i,
  },
  {
    id: "dynamic_url_fetch",
    label: "Dynamic URL fetch or SSRF surface",
    pattern: /\b(fetch_pagination_url|pagination_url|next_url|callback_url|redirect_url|webhook_url|proxy_url|target_url|input_url|request_url|url_to_fetch|urlToFetch|fetchUrl|targetUrl|requestUrl|callbackUrl|redirectUrl|webhookUrl|proxyUrl)\b|(?:\b(fetch|axios\.(?:get|request)|got|request|superagent|undici|httpx\.(?:get|request)|requests\.(?:get|request)|urllib\.request|aiohttp\.ClientSession|reqwest::Client)\s*\([^)]*\b(url|uri|href|endpoint|target|next|pagination|callback|redirect|webhook|proxy)\b)|(?:\b(url|uri|href|endpoint|target|next|pagination|callback|redirect|webhook|proxy)\b[^;\n]{0,140}\b(fetch|axios\.(?:get|request)|httpx\.(?:get|request)|requests\.(?:get|request)|urllib\.request|reqwest)\b)/i,
  },
  {
    id: "redaction",
    label: "Redaction or secret handling",
    pattern: /\b(redact|redaction|censor|mask|sanitize|scrub|REDACTED|redacted)\b/i,
  },
  {
    id: "tool_annotations",
    label: "Tool safety annotations",
    pattern: /\b(readOnlyHint|destructiveHint|idempotentHint|openWorldHint|requiresAuth|readOnly|dangerous|destructive)\b/i,
  },
  {
    id: "tests",
    label: "Tests",
    pattern: /\b(describe\(|it\(|test\(|pytest|unittest|cargo test|go test|vitest|jest|bun:test)\b/i,
  },
  {
    id: "ci",
    label: "CI or release automation",
    pattern: /\b(github\/workflows|ci\.yml|ci\.yaml|release\.yml|release\.yaml|CircleCI|Buildkite|GitLab CI)\b/i,
  },
];

function pathForFile(file) {
  return file.webkitRelativePath || file.name;
}

function extensionFor(path) {
  const normalized = path.toLowerCase();
  if (normalized.endsWith("dockerfile")) return ".dockerfile";
  const index = normalized.lastIndexOf(".");
  return index >= 0 ? normalized.slice(index) : "";
}

function shouldScanFile(file) {
  const path = pathForFile(file);
  return shouldScanPath(path, file.size);
}

function shouldScanPath(path, size = 0) {
  const parts = path.split(/[\\/]+/);
  if (parts.some((part) => ignorePathParts.has(part))) return false;
  if (size > 700_000) return false;
  return textExtensions.has(extensionFor(path));
}

function addFinding(findings, severity, title, evidence, why, fix) {
  findings.push({ severity, title, evidence, why, fix });
}

function severityRank(severity) {
  return { High: 0, Medium: 1, Low: 2, Info: 3 }[severity] ?? 9;
}

function score(findings) {
  let value = 100;
  for (const finding of findings) {
    if (finding.severity === "High") value -= 18;
    if (finding.severity === "Medium") value -= 10;
    if (finding.severity === "Low") value -= 4;
  }
  return Math.max(0, value);
}

const fullAuditIntakeUrl = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml";
const agentAuthIntakeUrl = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=agent-auth-review.yml";
const agentAuthReviewUrl = "https://jackjin1997.github.io/agent-audit-sprint/agent-auth-security-review.html";
const mcpSsrfIntakeUrl = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=mcp-ssrf-review.yml";
const mcpSsrfReviewUrl = "https://jackjin1997.github.io/agent-audit-sprint/mcp-ssrf-security-review.html";

function hasMcpSsrfFocus(result) {
  return (result.signals?.dynamic_url_fetch?.files?.length || 0) > 0;
}

function hasAgentAuthFocus(result) {
  return (result.signals?.agent_auth_focus?.files?.length || 0) > 0;
}

function hasFocusedReviewPath(result) {
  return hasMcpSsrfFocus(result) || hasAgentAuthFocus(result);
}

function focusedReviewDetails(result) {
  if (hasMcpSsrfFocus(result)) {
    return {
      name: "USD $299 MCP SSRF Focused Review",
      titlePrefix: "MCP SSRF focused review",
      intakeUrl: mcpSsrfIntakeUrl,
      reviewUrl: mcpSsrfReviewUrl,
      scope: "one pagination URL, callback URL, redirect URL, webhook URL, proxy URL, user-provided URL fetch, or SSRF-with-credentials boundary",
      summaryLabel: "MCP SSRF focused path",
    };
  }
  return {
    name: "USD $299 Agent Auth Focused Review",
    titlePrefix: "Agent Auth focused review",
    intakeUrl: agentAuthIntakeUrl,
    reviewUrl: agentAuthReviewUrl,
    scope: "one token broker, cookie vault, site_login/site_logout flow, OAuth/HITL consent boundary, authenticated scraping path, or MCP gateway auth split",
    summaryLabel: "Agent Auth focused path",
  };
}

function focusedReviewSummary(result) {
  if (!hasFocusedReviewPath(result)) return [];
  const authFiles = result.signals?.agent_auth_focus?.files || [];
  const dynamicUrlFiles = result.signals?.dynamic_url_fetch?.files || [];
  const files = compactEvidence(uniqueFiles(authFiles, dynamicUrlFiles), 4);
  const details = focusedReviewDetails(result);
  const signalNotes = [];
  if (authFiles.length) {
    signalNotes.push("token, cookie, session, OAuth, Bearer, API key, or credential-boundary signals");
  }
  if (dynamicUrlFiles.length) {
    signalNotes.push("dynamic URL fetching, pagination URL, callback URL, redirect URL, webhook, or proxy-fetch signals");
  }
  return [
    `${details.summaryLabel}: this scan saw ${signalNotes.join("; ")}.`,
    `Best fit: ${details.name} for ${details.scope}.`,
    `Focused intake: ${details.intakeUrl}`,
    `Review page: ${details.reviewUrl}`,
    ...(hasMcpSsrfFocus(result) && authFiles.length
      ? [`Related auth path: USD $299 Agent Auth Focused Review for token, cookie, session, OAuth, and credential-boundary review. Intake: ${agentAuthIntakeUrl}`]
      : []),
    `Evidence examples: ${files.map((file) => `\`${file}\``).join(", ") || "scanner signal match"}`,
  ];
}

function uniqueFiles(...groups) {
  return Array.from(new Set(groups.flat().filter(Boolean)));
}

function compactEvidence(files, max = 5) {
  return files.slice(0, max);
}

async function analyzeBrowserFiles(files) {
  const candidates = Array.from(files).filter(shouldScanFile);
  const signals = Object.fromEntries(scanSignals.map((signal) => [signal.id, { ...signal, files: [] }]));
  let packageJson = null;
  const fileTexts = await Promise.all(candidates.map(async (file) => {
    const path = pathForFile(file);
    const text = await file.text().catch(() => "");
    return { path, text };
  }));

  for (const { path, text } of fileTexts) {
    if (!text) continue;
    if (path.endsWith("package.json")) {
      try {
        packageJson = JSON.parse(text);
      } catch {
        packageJson = null;
      }
    }
    for (const signal of scanSignals) {
      if (signal.pattern.test(text) || (signal.id === "ci" && path.includes(".github/workflows"))) {
        signals[signal.id].files.push(path);
      }
    }
  }

  const findings = [];
  const hasMcp = signals.mcp_surface.files.length > 0;
  const hasRemote = signals.remote_transport.files.length > 0;
  const hasWrite = signals.write_action.files.length > 0;
  const hasSecrets = signals.secret_env.files.length > 0;
  const hasAuth = signals.auth_gate.files.length > 0;
  const hasDynamicUrlFetch = signals.dynamic_url_fetch.files.length > 0;
  const hasRedaction = signals.redaction.files.length > 0;
  const hasAnnotations = signals.tool_annotations.files.length > 0;
  const hasTests = signals.tests.files.length > 0 || candidates.some((file) => /(^|\/)(__tests__|tests?|spec)\//i.test(pathForFile(file)));
  const hasCi = signals.ci.files.length > 0 || candidates.some((file) => pathForFile(file).startsWith(".github/workflows/"));

  if (!hasMcp) {
    addFinding(
      findings,
      "Info",
      "No obvious MCP or tool-calling surface detected",
      [],
      "The scanner is tuned for agent and MCP projects. A low signal here may mean the selected files are outside scope or use different naming.",
      "Scan the package or service that registers tools, not only docs or a monorepo root."
    );
  }

  if (hasRemote && !hasAuth) {
    addFinding(
      findings,
      "High",
      "Remote listener detected without nearby auth/permission signals",
      compactEvidence(signals.remote_transport.files),
      "Agent tool transports are high leverage. If a listener is reachable beyond localhost, tool access needs explicit network and auth assumptions.",
      "Document bind address, trusted clients, proxy/auth layer, and safe defaults."
    );
  } else if (hasRemote) {
    addFinding(
      findings,
      "Medium",
      "Remote listener needs an explicit exposure policy",
      compactEvidence(signals.remote_transport.files),
      "Auth-related code exists, but launch docs should still state whether the transport is local-only, proxy-protected, or safe for remote use.",
      "Add transport docs covering bind address, allowed clients, auth layer, CORS/origin assumptions, and write-mode behavior."
    );
  }

  if (hasWrite && !hasAnnotations) {
    addFinding(
      findings,
      "High",
      "Write actions detected without obvious tool safety annotations",
      compactEvidence(signals.write_action.files),
      "Agents need machine-readable hints and operator-facing warnings around write, destructive, and privileged tool calls.",
      "Add read-only/destructive annotations where the SDK supports them, and test that write tools are absent unless explicitly enabled."
    );
  } else if (hasWrite) {
    addFinding(
      findings,
      "Medium",
      "Write actions should have confirmation and test coverage",
      compactEvidence(signals.write_action.files),
      "Write paths exist and annotations or gating signals are present. The next risk is proving those gates stay in place across CLI, MCP, and remote transports.",
      "Add tests for disabled-by-default write tools, auth failures, dry-run behavior, and lockout."
    );
  }

  if (hasDynamicUrlFetch && (hasSecrets || hasAuth)) {
    addFinding(
      findings,
      "High",
      "Dynamic URL fetch can become SSRF with credentials",
      compactEvidence(uniqueFiles(signals.dynamic_url_fetch.files, signals.agent_auth_focus.files, signals.secret_env.files)),
      "Tool-callable URL fetch paths can turn attacker-controlled pagination, callback, redirect, webhook, or proxy URLs into SSRF. If auth state exists nearby, the blast radius can include bearer forwarding, cookies, internal services, and metadata endpoints.",
      "Validate scheme and hostname against an allowlist, resolve final redirect targets before sending credentials, block localhost/link-local/RFC1918/metadata IPs, strip credentials from dynamic fetches, and test unsafe redirects, metadata IPs, non-HTTP schemes, and sibling domains."
    );
  } else if (hasDynamicUrlFetch) {
    addFinding(
      findings,
      "Medium",
      "Dynamic URL fetch needs destination allowlist and redirect tests",
      compactEvidence(signals.dynamic_url_fetch.files),
      "Agent and MCP tools that fetch user-provided URLs can be steered toward private networks or untrusted destinations even when the tool is read-only.",
      "Add explicit destination policy, scheme checks, DNS/final-target validation, redirect handling, and regression tests for localhost, metadata IPs, private ranges, and unsafe host lookalikes."
    );
  }

  if (hasSecrets && !hasRedaction) {
    addFinding(
      findings,
      "High",
      "Credential signals detected without redaction signals",
      compactEvidence(signals.secret_env.files),
      "Secrets often leak through thrown errors, debug logs, telemetry payloads, and agent-readable tool output.",
      "Add redaction at logger, error-boundary, and tool-output layers."
    );
  } else if (hasSecrets) {
    addFinding(
      findings,
      "Low",
      "Credential paths detected; redaction appears present",
      compactEvidence(signals.secret_env.files),
      "This is a positive sign, but secret handling should be tested against real object shapes used by HTTP clients and loggers.",
      "Keep redaction tests for request config, response config, serialized errors, and plain strings."
    );
  }

  if (!hasTests) {
    addFinding(
      findings,
      "High",
      "No obvious tests found",
      [],
      "Agent-facing bugs often sit at protocol boundaries and error paths. Without tests, write gates and tool schemas can regress silently.",
      "Add focused tests for tool registration, schema parsing, auth failures, read/write mode selection, and transport startup."
    );
  }

  if (!hasCi) {
    addFinding(
      findings,
      "Low",
      "No obvious CI workflow detected",
      [],
      "CI is not required for a private prototype, but public agent tools need repeatable validation before users connect accounts or secrets.",
      "Add a minimal workflow for install, typecheck, lint, and focused tests."
    );
  }

  if (packageJson?.scripts) {
    const missing = ["test", "typecheck", "lint"].filter((name) => !packageJson.scripts[name]);
    if (missing.length > 0) {
      addFinding(
        findings,
        "Low",
        `package.json is missing common quality scripts: ${missing.join(", ")}`,
        ["package.json"],
        "Agent and MCP projects benefit from predictable local validation commands before users connect credentials.",
        "Add the missing scripts or document the equivalent command."
      );
    }
  }

  findings.sort((a, b) => severityRank(a.severity) - severityRank(b.severity));

  return {
    filesScanned: candidates.length,
    score: score(findings),
    signals,
    findings,
  };
}

function renderReport(result) {
  const signalRows = scanSignals.map((signal) => {
    const current = result.signals[signal.id];
    const files = current.files.slice(0, 5).map((file) => `\`${file}\``).join(", ") || "None";
    return `| ${current.label} | ${current.files.length} | ${files} |`;
  });

  const findingBlocks = result.findings.map((finding) => [
    `### ${finding.severity}: ${finding.title}`,
    "",
    `Evidence: ${finding.evidence.length ? finding.evidence.map((file) => `\`${file}\``).join(", ") : "No file evidence"}`,
    "",
    `Why it matters: ${finding.why}`,
    "",
    `Fix direction: ${finding.fix}`,
  ].join("\n"));

  const title = result.sourceTitle || "Local Agent/MCP Audit Scanner Report";
  const safety = result.sourceKind === "github"
    ? "This browser scan fetched selected public GitHub repository files through GitHub and raw file URLs. No dependencies were installed, and no target code was executed."
    : "This browser-only scan read local files selected by the user. No code was uploaded, no dependencies were installed, and no target code was executed.";
  const targetLine = result.targetUrl ? [`Target: ${result.targetUrl}`, ""] : [];

  return [
    `# ${title}`,
    "",
    safety,
    "",
    ...targetLine,
    "",
    `Heuristic score: ${result.score}/100`,
    `Files scanned: ${result.filesScanned}`,
    "",
    "## Signals",
    "",
    "| Signal | Count | Example files |",
    "|---|---:|---|",
    ...signalRows,
    "",
    "## Findings",
    "",
    findingBlocks.join("\n\n") || "No ranked findings emitted.",
    "",
    "## Paid 48-hour review",
    "",
    "The scanner is triage, not a security certification.",
    "",
    ...focusedReviewSummary(result),
    hasFocusedReviewPath(result) ? "" : "",
    "For one repo or product slice, the $1,000 Agent/MCP Audit Sprint adds human review, evidence, fix planning, tests, and launch notes.",
    "",
    `Start a full audit: ${fullAuditIntakeUrl}`,
    "Terms: https://jackjin1997.github.io/agent-audit-sprint/terms.html",
  ].join("\n");
}

function updateSummary(result) {
  const topFindings = result.findings.slice(0, 3);
  const rows = [
    `<div class="report-row pass"><span>Score</span><strong>${result.score}/100 heuristic score across ${result.filesScanned} files</strong></div>`,
    ...topFindings.map((finding) => {
      const className = finding.severity === "High" ? "high" : finding.severity === "Medium" ? "medium" : "low";
      const label = finding.severity === "High" ? "High" : finding.severity === "Medium" ? "Med" : finding.severity;
      return `<div class="report-row ${className}"><span>${label}</span><strong>${finding.title}</strong></div>`;
    }),
    `<div class="report-row medium"><span>Next</span><strong>${hasFocusedReviewPath(result) ? `Use the ${focusedReviewDetails(result).name.replace("USD ", "")} intake or full sprint for human review.` : "Book the paid sprint for human review and issue-ready fixes."}</strong></div>`,
  ];
  localScanSummary.innerHTML = rows.join("");
}

function buildAuditRequestPacket(report, projectUrl = "TBD", result = null) {
  const target = projectUrl === "TBD" ? "Private or local repo; access details to be shared after scope acceptance." : projectUrl;
  const details = result && hasFocusedReviewPath(result) ? focusedReviewDetails(result) : null;
  const focusedPath = details
    ? [
        "## Recommended paid path",
        `${details.name} for ${details.scope}.`,
        `Focused intake: ${details.intakeUrl}`,
        `Review page: ${details.reviewUrl}`,
        "",
      ]
    : [];
  const paymentTerms = details
    ? [
        `This is a fixed ${details.name} for ${details.scope}.`,
        "Payment timing: after written scope acceptance only.",
        "The target delivery window starts after both scope acceptance and payment confirmation.",
        "Terms: https://jackjin1997.github.io/agent-audit-sprint/terms.html",
        `Focused review page: ${details.reviewUrl}`,
      ]
    : [
        "This is a fixed USD $1,000 Agent/MCP Audit Sprint for one repo or product slice.",
        "Payment timing: after written scope acceptance only.",
        "The 48-hour target starts after both scope acceptance and payment confirmation.",
        "Terms: https://jackjin1997.github.io/agent-audit-sprint/terms.html",
        "Fixed quote: https://jackjin1997.github.io/agent-audit-sprint/quote.html",
      ];
  return [
    "## Project or repo URL",
    target,
    "",
    ...focusedPath,
    "## Scope",
    "Review the repo or product slice represented by this scanner report.",
    "",
    "## Delivery visibility",
    "Private Markdown report",
    "",
    "## Target delivery date",
    "48h default after payment confirmation and scope acceptance",
    "",
    "## Payment network",
    "Need invoice/discussion first",
    "",
    "## Transaction hash",
    "Pending until scope is accepted and payment is sent.",
    "",
    "## Highest concern",
    "Scanner report attached below.",
    "",
    "## Payment and start terms",
    ...paymentTerms,
    "",
    "## Scanner report",
    report,
  ].join("\n");
}

function compactIssueBody(packet, report, projectUrl, result = null) {
  const target = projectUrl === "TBD" ? "Private/local repo" : projectUrl;
  const details = result && hasFocusedReviewPath(result) ? focusedReviewDetails(result) : null;
  const focusedLines = details
    ? [
        "## Recommended paid path",
        `${details.name} for one focused boundary.`,
        `Focused intake: ${details.intakeUrl}`,
        "",
      ]
    : [];
  return [
    "## Project or repo URL",
    target,
    "",
    ...focusedLines,
    "## Scope",
    "Review the repo or product slice represented by the scanner report.",
    "",
    "## Delivery visibility",
    "Private Markdown report",
    "",
    "## Target delivery date",
    "48h default after payment confirmation and scope acceptance",
    "",
    "## Payment network",
    "Need invoice/discussion first",
    "",
    "## Transaction hash",
    "Pending until scope is accepted and payment is sent.",
    "",
    "## Highest concern",
    "Scanner report attached below. If this prefilled issue body is truncated, paste the copied audit request packet from the scanner page.",
    "",
    "## Payment and start terms",
    details
      ? `Fixed ${details.name}. Do not send payment until scope is accepted in writing.`
      : "Fixed USD $1,000 Agent/MCP Audit Sprint. Do not send payment until scope is accepted in writing.",
    "",
    "## Scanner report excerpt",
    report.slice(0, 4500),
    report.length > 4500 ? "\n\n[Report truncated for URL length; paste the copied audit request packet here.]" : "",
    "",
    "## Full copied packet status",
    packet.length > 4500 ? "Copied packet recommended because the scanner report is long." : "Prefilled body includes the scanner report.",
  ].join("\n");
}

function updateIssueLink(report, projectUrl = "TBD", result = null) {
  const details = result && hasFocusedReviewPath(result) ? focusedReviewDetails(result) : null;
  const titlePrefix = details ? details.titlePrefix : "Audit request";
  const title = projectUrl === "TBD" ? `${titlePrefix}: scanner report` : `${titlePrefix}: ${projectUrl.replace(/^https:\/\/github\.com\//, "")}`;
  const packet = buildAuditRequestPacket(report, projectUrl, result);
  const body = compactIssueBody(packet, report, projectUrl, result);
  if (auditPacketOutput) {
    auditPacketOutput.value = packet;
  }
  const requestUrl = details
    ? `${details.intakeUrl}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    : `https://github.com/jackjin1997/agent-audit-sprint/issues/new?labels=audit-request&title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
  openScanRequests.forEach((link) => {
    link.href = requestUrl;
  });
}

function publicScanUrl(repoUrl) {
  const url = new URL(window.location.href);
  url.searchParams.set("repo", repoUrl);
  return url.toString();
}

function syncPublicScanUrl(repoUrl) {
  const nextUrl = publicScanUrl(repoUrl);
  window.history.replaceState(null, "", nextUrl);
  return nextUrl;
}

function parseGitHubRepoUrl(value) {
  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    return null;
  }
  if (parsed.hostname !== "github.com") return null;
  const [owner, repo] = parsed.pathname.replace(/^\/+/, "").replace(/\.git$/, "").split("/");
  if (!owner || !repo) return null;
  return { owner, repo, fullName: `${owner}/${repo}`, htmlUrl: `https://github.com/${owner}/${repo}` };
}

function remoteFilePriority(path) {
  const normalized = path.toLowerCase();
  let value = 0;
  if (normalized === "package.json") value += 100;
  if (normalized.startsWith(".github/workflows/")) value += 90;
  if (/(mcp|agent|tool|server|transport|auth|permission|secret|credential|route|api)/.test(normalized)) value += 60;
  if (/(ssrf|fetch|url|pagination|callback|redirect|proxy|webhook)/.test(normalized)) value += 45;
  if (/(src|lib|app|packages|server|tools)\//.test(normalized)) value += 25;
  if (/(test|spec|__tests__)/.test(normalized)) value += 12;
  return value;
}

function encodePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 6000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    window.clearTimeout(timeout);
  }
}

async function fetchJson(url) {
  const response = await fetchWithTimeout(url, {
    headers: {
      accept: "application/vnd.github+json",
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub request failed (${response.status})`);
  }
  return response.json();
}

async function fetchRawText(repo, ref, path) {
  const rawUrl = `https://raw.githubusercontent.com/${repo.fullName}/${encodeURIComponent(ref)}/${encodePath(path)}`;
  const response = await fetchWithTimeout(rawUrl);
  if (!response.ok) return "";
  return response.text();
}

function cachedRemoteFile(path, text) {
  return {
    name: path.split("/").pop(),
    webkitRelativePath: path,
    size: text.length,
    text: async () => text,
  };
}

async function fetchFallbackPublicGitHubFiles(repo, apiError) {
  const fetched = await Promise.all(fallbackRemotePaths.map(async (path) => {
    const text = await fetchRawText(repo, "HEAD", path).catch(() => "");
    return text ? cachedRemoteFile(path, text) : null;
  }));
  return {
    branch: "HEAD",
    files: fetched.filter(Boolean),
    truncated: false,
    htmlUrl: repo.htmlUrl,
    apiError,
  };
}

async function fetchPublicGitHubFiles(repo) {
  const repoApiUrl = `https://api.github.com/repos/${repo.fullName}`;
  let repoMeta;
  let tree;
  let branch = "main";
  try {
    repoMeta = await fetchJson(repoApiUrl);
    branch = repoMeta.default_branch || "main";
    tree = await fetchJson(`${repoApiUrl}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  } catch (error) {
    return fetchFallbackPublicGitHubFiles(repo, error instanceof Error ? error.message : "GitHub API unavailable");
  }
  const entries = Array.isArray(tree.tree) ? tree.tree : [];
  const candidates = entries
    .filter((entry) => entry.type === "blob" && shouldScanPath(entry.path, entry.size || 0))
    .sort((a, b) => remoteFilePriority(b.path) - remoteFilePriority(a.path) || a.path.localeCompare(b.path))
    .slice(0, maxRemoteFiles);

  const files = candidates.map((entry) => ({
    name: entry.path.split("/").pop(),
    webkitRelativePath: entry.path,
    size: entry.size || 0,
    text: async () => {
      return fetchRawText(repo, branch, entry.path);
    },
  }));

  return { branch, files, truncated: Boolean(tree.truncated), htmlUrl: repoMeta.html_url || repo.htmlUrl };
}

async function runPublicScan() {
  const repo = parseGitHubRepoUrl(publicRepoInput?.value || "");
  if (!repo) {
    localScanOutput.value = "Paste a public GitHub repo URL like https://github.com/org/repo.";
    return;
  }

  localScanOutput.value = `Fetching public GitHub metadata for ${repo.fullName}...`;
  syncPublicScanUrl(repo.htmlUrl);
  try {
    const { files, truncated, htmlUrl, apiError } = await fetchPublicGitHubFiles(repo);
    if (!files.length) {
      localScanOutput.value = `No text files under 700 KB were found in ${repo.fullName}.`;
      return;
    }

    localScanOutput.value = `Scanning ${files.length} selected public files from ${repo.fullName}...`;
    const result = await analyzeBrowserFiles(files);
    result.sourceKind = "github";
    result.sourceTitle = `Public GitHub Repo Scan: ${repo.fullName}`;
    result.targetUrl = htmlUrl;

    if (truncated) {
      addFinding(
        result.findings,
        "Info",
        "GitHub tree response was truncated",
        [],
        "Large repositories may exceed GitHub tree response limits, so this browser scan may miss some files.",
        "Run the terminal scanner locally for a complete scan, then attach the report to the paid audit request."
      );
    }
    if (apiError) {
      addFinding(
        result.findings,
        "Info",
        "GitHub API unavailable; used raw-file fallback",
        [],
        `The GitHub API request failed (${apiError}), so this browser scan tried a conservative set of common source, package, README, and CI paths through raw.githubusercontent.com.`,
        "For a complete scan, use the terminal scanner locally or open an intake issue with repo access details."
      );
    }

    const report = renderReport(result);
    localScanOutput.value = report;
    updateSummary(result);
    updateIssueLink(report, htmlUrl, result);
  } catch (error) {
    localScanOutput.value = [
      `Could not scan ${repo.fullName}.`,
      "",
      error instanceof Error ? error.message : "Unknown error",
      "",
      "If the repo is private or GitHub rate-limited this browser, use the local folder scanner or terminal command instead.",
    ].join("\n");
  }
}

async function runLocalScan() {
  if (!localScanInput?.files?.length) {
    localScanOutput.value = "Select a local repo folder or files first.";
    return;
  }
  localScanOutput.value = "Scanning selected local files in this browser...";
  const result = await analyzeBrowserFiles(localScanInput.files);
  const report = renderReport(result);
  localScanOutput.value = report;
  updateSummary(result);
  updateIssueLink(report, "TBD", result);
}

if (publicScanForm) {
  publicScanForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runPublicScan();
  });
}

if (copyPublicScanLink) {
  copyPublicScanLink.addEventListener("click", async (event) => {
    const repo = parseGitHubRepoUrl(publicRepoInput?.value || "");
    if (!repo) {
      localScanOutput.value = "Paste a public GitHub repo URL before copying a scan link.";
      return;
    }
    const link = syncPublicScanUrl(repo.htmlUrl);
    try {
      await navigator.clipboard.writeText(link);
      event.currentTarget.textContent = "Copied";
      window.setTimeout(() => {
        event.currentTarget.textContent = "Copy scan link";
      }, 1300);
    } catch {
      localScanOutput.value = link;
      event.currentTarget.textContent = "Link shown";
    }
  });
}

const initialRepo = new URLSearchParams(window.location.search).get("repo");
if (initialRepo && publicRepoInput) {
  publicRepoInput.value = initialRepo;
  runPublicScan();
}

if (localScanForm) {
  localScanForm.addEventListener("submit", (event) => {
    event.preventDefault();
    runLocalScan();
  });
  localScanInput.addEventListener("change", runLocalScan);
  document.querySelector("[data-copy-scan]").addEventListener("click", async (event) => {
    try {
      await navigator.clipboard.writeText(localScanOutput.value);
      event.currentTarget.textContent = "Copied";
      window.setTimeout(() => {
        event.currentTarget.textContent = "Copy report";
      }, 1300);
    } catch {
      localScanOutput.select();
      event.currentTarget.textContent = "Select";
    }
  });
}

if (copyAuditPacket) {
  copyAuditPacket.addEventListener("click", async (event) => {
    try {
      await navigator.clipboard.writeText(auditPacketOutput?.value || "");
      event.currentTarget.textContent = "Copied";
      window.setTimeout(() => {
        event.currentTarget.textContent = "Copy audit request packet";
      }, 1300);
    } catch {
      auditPacketOutput?.select();
      event.currentTarget.textContent = "Select";
    }
  });
}
