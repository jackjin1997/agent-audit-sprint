#!/usr/bin/env node

const MARKER = "<!-- agent-mcp-audit-intent -->";
const SERVICE_URL = "https://jackjin1997.github.io/agent-audit-sprint/mcp-security-audit-service.html";
const AGENT_AUTH_URL = "https://jackjin1997.github.io/agent-audit-sprint/agent-auth-security-review.html";
const MCP_SSRF_URL = "https://jackjin1997.github.io/agent-audit-sprint/mcp-ssrf-security-review.html";
const AGENT_COST_URL = "https://jackjin1997.github.io/agent-audit-sprint/ai-agent-cost-leak-review.html";
const COST_SPIKE_URL = "https://jackjin1997.github.io/agent-audit-sprint/ai-cost-spike-emergency.html";
const OPENROUTER_402_URL = "https://jackjin1997.github.io/agent-audit-sprint/openrouter-402-brownout.html";
const SCANNER_URL = "https://jackjin1997.github.io/agent-audit-sprint/scan.html";
const QUOTE_URL = "https://jackjin1997.github.io/agent-audit-sprint/quote.html";
const TERMS_URL = "https://jackjin1997.github.io/agent-audit-sprint/terms.html";
const FULL_INTAKE_URL = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml";
const PAYMENT_PROOF_URL = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=payment-confirmation.yml";
const DISCUSSION_URL = "https://github.com/jackjin1997/agent-audit-sprint/discussions/1";
const ETH_ADDRESS = "0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF";
const SOL_ADDRESS = "5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM";
const PACKAGE_URL = "https://jackjin1997.github.io/agent-audit-sprint/quick-scan.html";

function extractField(body = "", label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`###\\s+${escaped}\\s+([\\s\\S]*?)(?=\\n###\\s+|$)`, "i");
  const match = body.match(pattern);
  return match?.[1]?.trim().replace(/^_No response_$/i, "") || "";
}

function normalizeGitHubRepoUrl(value = "") {
  const match = value.match(/https?:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/);
  if (!match) return "";
  return `https://github.com/${match[1]}/${match[2].replace(/\.git$/i, "")}`;
}

function scannerLinkFor(project) {
  const repoUrl = normalizeGitHubRepoUrl(project);
  if (!repoUrl) return SCANNER_URL;
  return `${SCANNER_URL}?repo=${encodeURIComponent(repoUrl)}`;
}

function packageDetails(rawChoice = "") {
  const choice = rawChoice.trim();
  if (/cost spike|emergency/i.test(choice)) {
    return {
      name: "USD $1,000 AI Cost Spike Emergency Sprint",
      price: "USD $1,000",
      target: "24h after scope and payment confirmation",
      deliverable:
        "emergency spend-driver map and containment plan for one runaway AI agent, RAG workflow, coding-agent loop, support bot, or model API bill spike",
      };
    }
  if (/openrouter.*402|402.*openrouter|brownout|payment required|insufficient credits|max_tokens/i.test(choice)) {
    if (choice.includes("$99") || /quick triage/i.test(choice)) {
      return {
        name: "USD $99 OpenRouter 402 Quick Triage",
        price: "USD $99",
        target: "same day when available",
        deliverable:
          "focused triage of one OpenRouter 402, insufficient credits, max_tokens, stale balance, streaming fallback, or retry-containment path with a dispatch decision checklist",
      };
    }
    if (choice.includes("$299") || /cost-control/i.test(choice)) {
      return {
        name: "USD $299 OpenRouter Agent Cost-Control Review",
        price: "USD $299",
        target: "same day when available",
        deliverable:
          "focused review of one OpenRouter-backed agent workflow with reservation, retry containment, actual-cost reconciliation, and user-facing block states",
      };
    }
  }
  if (choice.includes("$99") || /quick scan/i.test(choice)) {
    return {
      name: "USD $99 Quick Scan Report",
      price: "USD $99",
      target: "same day when available",
      deliverable: "one Markdown triage report with scanner output, boundary notes, top risks, and upgrade recommendation",
    };
  }
  if (choice.includes("$299") || /focused/i.test(choice)) {
    if (/cost leak|token spend|llm spend|model routing|rag|cache miss|retry|tool loop|coding agent/i.test(choice)) {
      return {
        name: "USD $299 AI Agent Cost Leak Review",
        price: "USD $299",
        target: "same day when available",
        deliverable:
          "focused review of one AI agent token spend, context bloat, retry loop, cache miss, model-routing, RAG, or tool-call cost leak with ranked fixes and budget guardrails",
      };
    }
    if (/mcp ssrf|ssrf|dynamic url|url fetch|fetch_pagination|pagination_url|callback_url|redirect_url|webhook_url|proxy_url/i.test(choice)) {
      return {
        name: "USD $299 MCP SSRF Focused Review",
        price: "USD $299",
        target: "same day when available",
        deliverable:
          "focused review of one dynamic URL fetch, pagination, callback, redirect, webhook, proxy, or SSRF-with-credentials boundary with ranked risks and regression-test checklist",
      };
    }
    if (/agent auth|cookie vault|token broker|site_login|oauth|hitl/i.test(choice)) {
      return {
        name: "USD $299 Agent Auth Focused Review",
        price: "USD $299",
        target: "same day when available",
        deliverable:
          "focused review of one token broker, cookie vault, site_login, OAuth/HITL, protected-resource metadata, or authenticated browser boundary with ranked risks and regression-test checklist",
      };
    }
    return {
      name: "USD $299 Same-day Focused Review",
      price: "USD $299",
      target: "same day when available",
      deliverable: "focused review of one risky flow with evidence, ranked findings, and concrete fix plan",
    };
  }
  return {
    name: "USD $1,000 Full Audit Sprint",
    price: "USD $1,000",
    target: "48h after scope and payment confirmation",
    deliverable: "full Agent/MCP audit sprint for one repo or product slice",
  };
}

function renderIntentComment(issueBody = "") {
  const requestedPackage = extractField(issueBody, "Requested package");
  const packageInfo = packageDetails(requestedPackage);
  const project =
    extractField(issueBody, "Project or repo URL") ||
    extractField(issueBody, "Project, repo, product, or workflow URL") ||
    "the project";
  const contact = extractField(issueBody, "Preferred contact") || "this issue";
  const timing = extractField(issueBody, "Timing") || "48h target";
  const paymentPath = extractField(issueBody, "Payment path") || "to confirm";
  const authFlow = extractField(issueBody, "Auth flow type");
  const authBoundary = extractField(issueBody, "Boundary to review");
  const fetchBoundary = extractField(issueBody, "URL fetch boundary");
  const credentialContext = extractField(issueBody, "Credential or network context");
  const costBoundary = extractField(issueBody, "Cost boundary");
  const costSpike = extractField(issueBody, "Cost spike type");
  const brownoutState = extractField(issueBody, "Brownout state");
  const usageEvidence = extractField(issueBody, "Sanitized usage evidence");
  const sanitizedCostEvidence = extractField(issueBody, "Sanitized cost evidence");
  const brownoutEvidence = extractField(issueBody, "Sanitized evidence");
  const highestRisk = extractField(issueBody, "Highest risk or decision");
  const highestCostQuestion = extractField(issueBody, "Highest cost question");
  const emergencyDecision = extractField(issueBody, "Emergency decision");
  const dispatchDecision = extractField(issueBody, "Dispatch decision needed");
  const deadline = extractField(issueBody, "Deadline or billing risk window") || extractField(issueBody, "Deadline or launch window");
  const authContext = authFlow || authBoundary || packageInfo.name.includes("Agent Auth");
  const ssrfContext = fetchBoundary || credentialContext;
  const openRouter402Context = brownoutState || dispatchDecision || packageInfo.name.includes("OpenRouter 402");
  const costSpikeContext = costSpike || sanitizedCostEvidence || packageInfo.name.includes("Cost Spike");
  const costContext =
    openRouter402Context ||
    costBoundary ||
    costSpike ||
    usageEvidence ||
    sanitizedCostEvidence ||
    brownoutEvidence ||
    packageInfo.name.includes("Cost Leak");
  const serviceDetailsUrl = costSpikeContext
    ? COST_SPIKE_URL
    : openRouter402Context
    ? OPENROUTER_402_URL
    : packageInfo.name.includes("AI Agent Cost Leak") || costContext
    ? AGENT_COST_URL
    : packageInfo.name.includes("MCP SSRF") || ssrfContext
    ? MCP_SSRF_URL
    : packageInfo.name.includes("Agent Auth") || authContext
      ? AGENT_AUTH_URL
      : SERVICE_URL;
  const authDetails = authContext
    ? `
Auth flow type: **${authFlow || "not specified"}**
Boundary to review: **${authBoundary || "not specified"}**
Highest risk or decision: **${highestRisk || "not specified"}**
`
    : "";
  const ssrfDetails = ssrfContext
    ? `
URL fetch boundary: **${fetchBoundary || "not specified"}**
Credential or network context: **${credentialContext || "not specified"}**
Highest risk or decision: **${highestRisk || "not specified"}**
`
    : "";
  const costDetails = costContext
    ? `
Cost boundary: **${brownoutState || costBoundary || costSpike || "not specified"}**
Sanitized usage evidence: **${brownoutEvidence || usageEvidence || sanitizedCostEvidence || "not specified"}**
Highest cost question: **${dispatchDecision || highestCostQuestion || emergencyDecision || highestRisk || "not specified"}**
Deadline or billing risk window: **${deadline || "not specified"}**
`
    : "";

  return `${MARKER}
## Audit package request received

Thanks for requesting **${packageInfo.name}** for **${project}**.

### Next step

Please reply in this issue with either:

1. A short scope note here covering the exact repo/product slice, delivery visibility, and highest concern
2. A full scope using the intake form if this should become the full sprint: ${FULL_INTAKE_URL}

Preferred contact recorded from the form: **${contact}**
Requested package: **${packageInfo.name}**
Requested timing: **${timing}**
Payment path: **${paymentPath}**
Expected deliverable: ${packageInfo.deliverable}
${authDetails}
${ssrfDetails}
${costDetails}

Package ladder and copyable payment packets: ${PACKAGE_URL}
Full sprint quote: ${QUOTE_URL}

### Payment/start rule

Do not send payment until scope is accepted in writing. After scope is accepted, pay **${packageInfo.price} equivalent** through the agreed path and submit the transaction hash or invoice settlement evidence here:

${PAYMENT_PROOF_URL}

- Ethereum: \`${ETH_ADDRESS}\`
- Solana: \`${SOL_ADDRESS}\`
- Terms: ${TERMS_URL}

### Optional before scope

Run the browser scanner before scope acceptance and paste the generated Markdown into this issue. Public GitHub repos can use the shareable scan link; private repos can use the local folder selector:

${scannerLinkFor(project)}

It does not upload code, install dependencies, or execute target code.

Questions before booking can go here: ${DISCUSSION_URL}
Service details: ${serviceDetailsUrl}
Target delivery for this package: ${packageInfo.target}
`;
}

async function githubRequest(pathOrUrl, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  const apiUrl = process.env.GITHUB_API_URL || "https://api.github.com";
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${apiUrl}${pathOrUrl}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status}: ${text.slice(0, 300)}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function upsertIssueComment(body) {
  const repo = process.env.GITHUB_REPOSITORY;
  const issueNumber = process.env.ISSUE_NUMBER;
  const token = process.env.GITHUB_TOKEN;

  if (process.env.INTENT_DRY_RUN === "true" || !repo || !issueNumber || !token) {
    process.stdout.write(`${body}\n`);
    return;
  }

  const comments = await githubRequest(`/repos/${repo}/issues/${issueNumber}/comments?per_page=100`);
  const existing = comments.find((comment) => comment.body?.includes(MARKER));

  if (existing) {
    await githubRequest(existing.url, {
      method: "PATCH",
      body: JSON.stringify({ body }),
    });
    return;
  }

  await githubRequest(`/repos/${repo}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

async function main() {
  const body = renderIntentComment(process.env.ISSUE_BODY || "");
  await upsertIssueComment(body);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
