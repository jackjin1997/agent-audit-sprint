#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const MARKER = "<!-- agent-mcp-audit-triage -->";
const SERVICE_URL = "https://jackjin1997.github.io/agent-audit-sprint/";
const SCANNER_URL = "https://jackjin1997.github.io/agent-audit-sprint/scan.html";
const QUOTE_URL = "https://jackjin1997.github.io/agent-audit-sprint/quote.html";
const TERMS_URL = "https://jackjin1997.github.io/agent-audit-sprint/terms.html";
const REQUEST_URL = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml";
const PAYMENT_PROOF_URL = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=payment-confirmation.yml";
const root = resolve(import.meta.dirname, "..");

function extractGitHubRepoUrl(body = "") {
  const matches = body.matchAll(/https?:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)(?:[/?#\s)]|$)/g);
  for (const match of matches) {
    const owner = match[1].replace(/[).,;:]+$/, "");
    const repo = match[2].replace(/\.git$/i, "").replace(/[).,;:]+$/, "");
    if (!owner || !repo) continue;
    return { owner, repo, url: `https://github.com/${owner}/${repo}` };
  }
  return null;
}

function escapeTableCell(value) {
  return String(value ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n+/g, " ")
    .trim();
}

function renderEvidence(evidence = []) {
  if (!evidence.length) return "No file evidence";
  return evidence.slice(0, 3).map((file) => `\`${file}\``).join(", ");
}

function renderFindings(findings = []) {
  if (!findings.length) {
    return "No ranked findings were emitted by the heuristic scanner. This usually means the target is outside the MCP/agent shape or uses naming the scanner does not recognize.";
  }

  const rows = findings.slice(0, 4).map((finding) =>
    `| ${escapeTableCell(finding.severity)} | ${escapeTableCell(finding.title)} | ${renderEvidence(finding.evidence)} |`
  );

  return [
    "| Severity | Finding | Evidence |",
    "|---|---|---|",
    ...rows,
  ].join("\n");
}

function renderSuccessComment(repoInfo, result) {
  const scannerUrl = `${SCANNER_URL}?repo=${encodeURIComponent(repoInfo.url)}`;
  return `${MARKER}
## Automated free triage

I found ${repoInfo.url} and ran the public \`agent-mcp-audit\` heuristic scanner.

- Score: **${result.score}/100**
- Files scanned: **${result.filesScanned}**
- Scope: public repository files only
- Safety: no dependencies were installed, no target code was executed, and no live services were called

### Top scanner findings

${renderFindings(result.findings)}

### What this means

This is a first-pass signal scan, not the paid audit. It helps decide whether the repo has enough MCP/agent surface for a focused review and gives the owner an immediate starting point.

### Convert this to the $1,000 sprint

Reply in this issue with any scope corrections and preferred delivery visibility. After scope acceptance and payment confirmation, I will deliver the full ranked report, evidence, patch plan, and launch notes.

- Service page: ${SERVICE_URL}
- Browser scanner link: ${scannerUrl}
- Fixed quote and copyable payment packet: ${QUOTE_URL}
- Terms and payment/start rules: ${TERMS_URL}
- New request form: ${REQUEST_URL}
- Payment proof form, after scope acceptance only: ${PAYMENT_PROOF_URL}
`;
}

function renderNoRepoComment() {
  return `${MARKER}
## Automated free triage

I could not run the scanner automatically because this intake does not include a public GitHub repository URL.

The paid sprint can still cover product docs, private repos, demos, or a narrow code slice, but the automated no-execution triage only works for public GitHub repositories.

- Service page: ${SERVICE_URL}
- Browser scanner: ${SCANNER_URL}
- Fixed quote and copyable payment packet: ${QUOTE_URL}
- Terms and payment/start rules: ${TERMS_URL}
`;
}

function renderFailureComment(repoInfo, error) {
  const message = String(error?.message || "Unknown scanner failure").split("\n")[0].slice(0, 240);
  return `${MARKER}
## Automated free triage

I found ${repoInfo.url}, but the automated scanner could not complete.

Reason: \`${message}\`

This can happen when the repo is private, very large, temporarily unavailable, or outside the shape expected by the scanner. The paid sprint can still proceed after scope acceptance.

- Service page: ${SERVICE_URL}
- Browser scanner: ${SCANNER_URL}?repo=${encodeURIComponent(repoInfo.url)}
- Fixed quote and copyable payment packet: ${QUOTE_URL}
- Terms and payment/start rules: ${TERMS_URL}
`;
}

async function scanPublicRepo(repoInfo) {
  if (process.env.TRIAGE_SKIP_CLONE === "true") {
    return {
      filesScanned: 12,
      score: 82,
      findings: [
        {
          severity: "Medium",
          title: "Remote listener needs an explicit exposure policy",
          evidence: ["src/server.ts"],
        },
      ],
    };
  }

  const tmpRoot = await mkdtemp(join(tmpdir(), "agent-mcp-intake-"));
  const targetDir = join(tmpRoot, `${repoInfo.owner}-${repoInfo.repo}`);
  try {
    execFileSync("git", ["clone", "--depth", "1", "--single-branch", repoInfo.url, targetDir], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
      timeout: 120_000,
      maxBuffer: 10 * 1024 * 1024,
    });

    const output = execFileSync(process.execPath, [resolve(root, "tools/agent-mcp-audit.mjs"), targetDir, "--json"], {
      encoding: "utf8",
      timeout: 120_000,
      maxBuffer: 10 * 1024 * 1024,
    });
    return JSON.parse(output);
  } finally {
    await rm(tmpRoot, { recursive: true, force: true });
  }
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

  if (process.env.TRIAGE_DRY_RUN === "true" || !repo || !issueNumber || !token) {
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
  const issueBody = process.env.ISSUE_BODY || "";
  const repoInfo = extractGitHubRepoUrl(issueBody);

  if (!repoInfo) {
    await upsertIssueComment(renderNoRepoComment());
    return;
  }

  let comment;
  try {
    const result = await scanPublicRepo(repoInfo);
    comment = renderSuccessComment(repoInfo, result);
  } catch (error) {
    comment = renderFailureComment(repoInfo, error);
  }

  await upsertIssueComment(comment);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
