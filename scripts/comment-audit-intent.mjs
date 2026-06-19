#!/usr/bin/env node

const MARKER = "<!-- agent-mcp-audit-intent -->";
const SERVICE_URL = "https://jackjin1997.github.io/agent-audit-sprint/mcp-security-audit-service.html";
const SCANNER_URL = "https://jackjin1997.github.io/agent-audit-sprint/scan.html";
const QUOTE_URL = "https://jackjin1997.github.io/agent-audit-sprint/quote.html";
const TERMS_URL = "https://jackjin1997.github.io/agent-audit-sprint/terms.html";
const FULL_INTAKE_URL = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml";
const PAYMENT_PROOF_URL = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=payment-confirmation.yml";
const DISCUSSION_URL = "https://github.com/jackjin1997/agent-audit-sprint/discussions/1";
const ETH_ADDRESS = "0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF";
const SOL_ADDRESS = "5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM";

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

function renderIntentComment(issueBody = "") {
  const project = extractField(issueBody, "Project or repo URL") || "the project";
  const contact = extractField(issueBody, "Preferred contact") || "this issue";
  const timing = extractField(issueBody, "Timing") || "48h target";
  const paymentPath = extractField(issueBody, "Payment path") || "to confirm";

  return `${MARKER}
## Audit slot received

Thanks for reserving a $1,000 Agent/MCP Audit Sprint slot for **${project}**.

### Next step

Please reply in this issue with either:

1. A full scope using the intake form: ${FULL_INTAKE_URL}
2. A short scope note here covering the exact repo/product slice, delivery visibility, and highest concern

Preferred contact recorded from the form: **${contact}**  
Requested timing: **${timing}**  
Payment path: **${paymentPath}**

Fixed quote and copyable payment packet: ${QUOTE_URL}

### Payment/start rule

Do not send payment until scope is accepted in writing. After scope is accepted, pay USD $1,000 equivalent through the agreed path and submit the transaction hash or invoice settlement evidence here:

${PAYMENT_PROOF_URL}

- Ethereum: \`${ETH_ADDRESS}\`
- Solana: \`${SOL_ADDRESS}\`
- Terms: ${TERMS_URL}

### Optional before scope

Run the browser scanner before scope acceptance and paste the generated Markdown into this issue. Public GitHub repos can use the shareable scan link; private repos can use the local folder selector:

${scannerLinkFor(project)}

It does not upload code, install dependencies, or execute target code.

Questions before booking can go here: ${DISCUSSION_URL}
Service details: ${SERVICE_URL}
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
