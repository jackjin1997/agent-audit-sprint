#!/usr/bin/env node

const MARKER = "<!-- agent-mcp-payment-proof -->";
const TERMS_URL = "https://jackjin1997.github.io/agent-audit-sprint/terms.html";
const RECEIPT_TEMPLATE_URL = "https://github.com/jackjin1997/agent-audit-sprint/blob/main/templates/receipt.md";
const JINGLE_RECEIPT_TEMPLATE_URL = "https://github.com/jackjin1997/agent-audit-sprint/blob/main/templates/ai-jingle-receipt.md";
const JINGLE_DELIVERY_TEMPLATE_URL =
  "https://github.com/jackjin1997/agent-audit-sprint/blob/main/templates/ai-jingle-delivery-note.md";
const ETH_ADDRESS = "0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF";
const SOL_ADDRESS = "5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM";

function extractField(body = "", label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`###\\s+${escaped}\\s+([\\s\\S]*?)(?=\\n###\\s+|$)`, "i");
  const match = body.match(pattern);
  return match?.[1]?.trim().replace(/^_No response_$/i, "") || "";
}

function renderPaymentProofComment(issueBody = "") {
  const scopeIssue = extractField(issueBody, "Accepted scope issue URL") || "not provided";
  const acceptedService = extractField(issueBody, "Accepted package or service") || "not provided";
  const network = extractField(issueBody, "Payment network") || "not provided";
  const txHash = extractField(issueBody, "Transaction hash or settlement reference") || "not provided";
  const evidenceUrl = extractField(issueBody, "Explorer or invoice URL") || "not provided";
  const amount = extractField(issueBody, "Amount sent") || "not provided";

  return `${MARKER}
## Payment proof received

Payment evidence has been recorded for manual verification.

| Field | Value |
|---|---|
| Accepted scope/brief issue | ${scopeIssue} |
| Accepted package/service | ${acceptedService} |
| Network | ${network} |
| Transaction / settlement reference | \`${txHash}\` |
| Explorer / invoice evidence | ${evidenceUrl} |
| Reported amount | ${amount} |

### Verification checklist

Before work starts, I will verify:

1. Scope or brief was accepted in writing before payment.
2. The transaction or settlement reference is valid.
3. The recipient matches the agreed address or invoice path.
4. The reported package/service and amount match the accepted package quote, for example USD $29/$79/$149/$399 AI music or jingle work, USD $99/$299 audit entry work, or the USD $1,000 full audit sprint, unless another written agreement exists.
5. The receipt/delivery template matches the accepted service before the work clock starts.

Accepted payment addresses and assets:

- Ethereum: \`${ETH_ADDRESS}\` for ETH or ERC-20 USDC/USDT/DAI
- Solana: \`${SOL_ADDRESS}\` for SOL or SPL USDC

Current receipt paths:

- Audit receipt template: ${RECEIPT_TEMPLATE_URL}
- AI music/jingle receipt template: ${JINGLE_RECEIPT_TEMPLATE_URL}
- AI music/jingle delivery note template: ${JINGLE_DELIVERY_TEMPLATE_URL}

Terms: ${TERMS_URL}  
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

  if (process.env.PAYMENT_PROOF_DRY_RUN === "true" || !repo || !issueNumber || !token) {
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
  const body = renderPaymentProofComment(process.env.ISSUE_BODY || "");
  await upsertIssueComment(body);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
