#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";

const DEFAULT_QUERIES = [
  '"MCP" "security" "auth" is:issue is:open updated:>=2026-01-01',
  '"Model Context Protocol" "security" is:issue is:open updated:>=2026-01-01',
  '"MCP server" "remote" "auth" is:issue is:open updated:>=2026-01-01',
  '"MCP" "prompt injection" is:issue is:open updated:>=2026-01-01',
  '"MCP" "Code Scanning" is:issue is:open updated:>=2026-01-01',
  '"agent" "tool" "security" is:issue is:open updated:>=2026-01-01',
  '"AI agent" "security audit" is:issue is:open updated:>=2026-01-01',
  '"MCP" "OAuth" "security" is:issue is:open updated:>=2026-01-01',
];

const BLOCKED_REPOS = new Set([
  "jackjin1997/agent-audit-sprint",
  "jackjin1997/agent-mcp-code-scan-action",
]);

const NOISE_PATTERNS = [
  /daily .*report/i,
  /daily .*digest/i,
  /ecosystem digest/i,
  /community.*digest/i,
  /briefing request/i,
  /dependency dashboard/i,
  /autohealing report/i,
  /engagement-ledger/i,
  /生态日报/,
  /社区动态日报/,
];

const NOISE_REPOS = [
  /agents-radar/i,
  /big_model_radar/i,
  /update_ai_analysis/i,
  /pulse-mind/i,
];

function argValue(name, fallback = "") {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  return process.argv[index + 1] || fallback;
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function hostApi(path) {
  const base = process.env.GITHUB_API_URL || "https://api.github.com";
  return `${base}${path}`;
}

async function githubGet(path) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || localGhToken();
  const response = await fetch(hostApi(path), {
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status}: ${text.slice(0, 300)}`);
  }

  return response.json();
}

function localGhToken() {
  try {
    return execFileSync("gh", ["auth", "token"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function words(text = "") {
  return text.toLowerCase();
}

function scoreIssue(item) {
  const text = words(`${item.title || ""}\n${item.body || ""}`);
  const repo = item.repository_url?.split("/repos/")[1] || "";
  const title = item.title || "";
  let score = 0;
  const reasons = [];

  if (NOISE_PATTERNS.some((pattern) => pattern.test(title)) || NOISE_REPOS.some((pattern) => pattern.test(repo))) {
    return { score: 0, reasons: ["filtered automated digest/noise"] };
  }

  const checks = [
    [/mcp|model context protocol/, 18, "MCP-specific"],
    [/security|secure|vulnerability|exploit|threat|risk/, 16, "security language"],
    [/auth|oauth|authorization|authentication|token|permission/, 14, "auth or permission concern"],
    [/prompt injection|tool injection|tool poisoning|indirect prompt/, 14, "prompt/tool injection concern"],
    [/code scanning|sarif|secret scanning|dependabot|codeql/, 10, "GitHub security workflow angle"],
    [/remote|sse|streamable|http transport|hosted/, 8, "remote transport angle"],
    [/write|delete|update|create|mutate|destructive/, 8, "write-action concern"],
    [/audit|review|scanner|scan|checklist/, 8, "review or scanner intent"],
    [/paid|budget|commercial|enterprise|customer|launch/, 12, "possible buyer context"],
    [/help|support|how do|request|proposal|rfc|initiative/, 5, "active discussion/request"],
  ];

  for (const [pattern, points, reason] of checks) {
    if (pattern.test(text)) {
      score += points;
      reasons.push(reason);
    }
  }

  if (item.comments > 0) score += Math.min(8, item.comments);
  if (repo.includes("modelcontextprotocol/")) score -= 8;
  if (repo.includes("awesome")) score -= 8;
  if (item.pull_request) score -= 20;
  if (BLOCKED_REPOS.has(repo)) score = 0;

  return { score, reasons };
}

function sanitize(text = "") {
  return text.replace(/\s+/g, " ").replace(/\|/g, "\\|").trim();
}

function suggestedMove(item, reasons) {
  const title = item.title || "this issue";
  if (reasons.includes("GitHub security workflow angle")) {
    return `Offer a concrete no-execution SARIF/Code Scanning check for "${sanitize(title)}"; mention $99 quick scan only if they ask for outside review.`;
  }
  if (reasons.includes("remote transport angle") || reasons.includes("auth or permission concern")) {
    return `Reply only with a specific transport/auth checklist and one relevant sample link; offer $299 focused review if they need a scoped outside pass.`;
  }
  if (reasons.includes("prompt/tool injection concern")) {
    return `Share a short prompt/tool-injection test plan and ask whether a focused review would help; avoid generic sales copy.`;
  }
  return "Keep as watchlist unless there is a direct request for review, scanner, or implementation guidance.";
}

function renderMarkdown(leads, queries) {
  const now = new Date().toISOString();
  const lines = [
    "# High-Intent Agent/MCP Security Leads",
    "",
    `Generated: ${now}`,
    "",
    "Rules:",
    "",
    "- Do not post generic ads.",
    "- Only reply when the issue is explicitly asking about security, auth, scanner, MCP transport, prompt/tool injection, or review process.",
    "- Lead with useful technical context. Mention paid packages only after the concrete help is relevant.",
    "- Never ask people to paste secrets, private code, credentials, logs, or customer data into public issues.",
    "",
    "Paid entry points:",
    "",
    "- USD $99 Quick Scan Report: https://jackjin1997.github.io/agent-audit-sprint/quick-scan.html",
    "- USD $299 Same-day Focused Review: https://jackjin1997.github.io/agent-audit-sprint/quick-scan.html",
    "- USD $1,000 Full Audit Sprint: https://jackjin1997.github.io/agent-audit-sprint/quote.html",
    "",
    "## Queries",
    "",
    ...queries.map((query) => `- \`${query}\``),
    "",
    "## Leads",
    "",
    "| Score | Repo | Issue | Updated | Why | Suggested move | URL |",
    "|---:|---|---|---|---|---|---|",
  ];

  for (const lead of leads) {
    lines.push(
      `| ${lead.score} | ${sanitize(lead.repo)} | ${sanitize(lead.title)} | ${lead.updatedAt.slice(0, 10)} | ${sanitize(lead.reasons.join(", "))} | ${sanitize(lead.suggestedMove)} | ${lead.url} |`
    );
  }

  lines.push(
    "",
    "## Reply Pattern",
    "",
    "```text",
    "I saw this thread is specifically about [risk area]. A useful first check is [concrete checklist or test], because [one technical reason].",
    "",
    "If you want an outside no-execution pass, I have a small Agent/MCP security review ladder: $99 quick scan, $299 focused review for one risky flow, or $1,000 full sprint. Payment only after written scope acceptance.",
    "",
    "No need to share secrets or private code in the issue.",
    "```",
    ""
  );

  return `${lines.join("\n")}\n`;
}

async function main() {
  const limit = Number(argValue("--limit", "20"));
  const outPath = argValue("--out", "");
  const minScore = Number(argValue("--min-score", "34"));
  const queries = hasFlag("--default") || !argValue("--query") ? DEFAULT_QUERIES : [argValue("--query")];
  const seen = new Map();

  for (const query of queries) {
    const params = new URLSearchParams({
      q: `${query} -repo:jackjin1997/agent-audit-sprint -repo:jackjin1997/agent-mcp-code-scan-action`,
      sort: "updated",
      order: "desc",
      per_page: "20",
    });
    const data = await githubGet(`/search/issues?${params.toString()}`);
    for (const item of data.items || []) {
      const repo = item.repository_url?.split("/repos/")[1] || "";
      const { score, reasons } = scoreIssue(item);
      if (score < minScore || !repo || BLOCKED_REPOS.has(repo)) continue;
      const existing = seen.get(item.html_url);
      const lead = {
        score,
        repo,
        title: item.title || "",
        url: item.html_url,
        updatedAt: item.updated_at || item.created_at || "",
        reasons,
        suggestedMove: suggestedMove(item, reasons),
      };
      if (!existing || existing.score < score) {
        seen.set(item.html_url, lead);
      }
    }
  }

  const leads = [...seen.values()]
    .sort((a, b) => b.score - a.score || b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit);

  const markdown = renderMarkdown(leads, queries);
  if (outPath) {
    const resolved = resolve(outPath);
    mkdirSync(dirname(resolved), { recursive: true });
    writeFileSync(resolved, markdown);
  }
  process.stdout.write(markdown);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
