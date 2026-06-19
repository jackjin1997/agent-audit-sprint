#!/usr/bin/env node

const MARKER = "<!-- agent-mcp-code-scanning-audit -->";
const CODE_SCANNING_PAGE_URL = "https://jackjin1997.github.io/agent-audit-sprint/mcp-code-scanning-github-action.html";
const SERVICE_URL = "https://jackjin1997.github.io/agent-audit-sprint/mcp-security-audit-service.html";
const SCANNER_URL = "https://jackjin1997.github.io/agent-audit-sprint/scan.html";
const QUOTE_URL = "https://jackjin1997.github.io/agent-audit-sprint/quote.html";
const TERMS_URL = "https://jackjin1997.github.io/agent-audit-sprint/terms.html";
const PAYMENT_PROOF_URL = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=payment-confirmation.yml";
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

function renderCodeScanningComment(issueBody = "") {
  const project = extractField(issueBody, "Project or repo URL") || "the project";
  const evidence = extractField(issueBody, "Code scanning or SARIF evidence URL") || "not provided";
  const alertSummary = extractField(issueBody, "Alert summary") || "not provided";
  const scope = extractField(issueBody, "Desired audit scope") || "not provided";
  const visibility = extractField(issueBody, "Delivery visibility") || "not provided";
  const paymentPath = extractField(issueBody, "Payment path") || "not provided";

  return `${MARKER}
## Code scanning audit received

I received the SARIF / GitHub Code Scanning audit request for **${project}**.

| Field | Value |
|---|---|
| Code scanning / SARIF evidence | ${evidence} |
| Alert summary | ${alertSummary} |
| Desired scope | ${scope} |
| Delivery visibility | ${visibility} |
| Payment path | ${paymentPath} |

### Next step

I will use the Code Scanning findings as the starting evidence and confirm the exact one-repo or product-slice scope before any payment is sent.

If the project is public, the free browser scanner link is ready here:

${scannerLinkFor(project)}

If the project is private, attach a sanitized SARIF report, workflow run, or screenshot after removing secrets and customer data.

### Payment/start rule

Do not send payment until scope is accepted in writing. After scope acceptance, pay USD $1,000 equivalent through the agreed path and submit transaction or settlement evidence:

${PAYMENT_PROOF_URL}

- Fixed quote and copyable payment packet: ${QUOTE_URL}
- Terms and payment/start rules: ${TERMS_URL}
- Code Scanning workflow page: ${CODE_SCANNING_PAGE_URL}
- Service details: ${SERVICE_URL}
- Ethereum: \`${ETH_ADDRESS}\`
- Solana: \`${SOL_ADDRESS}\`
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

  if (process.env.CODE_SCANNING_AUDIT_DRY_RUN === "true" || !repo || !issueNumber || !token) {
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
  const body = renderCodeScanningComment(process.env.ISSUE_BODY || "");
  await upsertIssueComment(body);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
