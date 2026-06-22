import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const index = `file://${resolve(root, "index.html")}`;
const doubanReport = `file://${resolve(root, "reports/douban-mcp-sample-audit.html")}`;
const firecrawlReport = `file://${resolve(root, "reports/firecrawl-mcp-sample-audit.html")}`;
const browserbaseReport = `file://${resolve(root, "reports/browserbase-mcp-sample-audit.html")}`;
const sentinelDogfoodReport = `file://${resolve(root, "reports/sentinel-agent-dogfood-audit.html")}`;
const agentgapDogfoodReport = `file://${resolve(root, "reports/agentgap-agent-config-dogfood-audit.html")}`;
const playwrightScanReport = `file://${resolve(root, "reports/playwright-mcp-security-scan.html")}`;
const chromeDevtoolsScanReport = `file://${resolve(root, "reports/chrome-devtools-mcp-security-scan.html")}`;
const githubMcpScanReport = `file://${resolve(root, "reports/github-mcp-server-security-scan.html")}`;
const browserMcpScanReport = `file://${resolve(root, "reports/browsermcp-mcp-security-scan.html")}`;
const browserUseAiAgentScanReport = `file://${resolve(root, "reports/browser-use-ai-agent-security-scan.html")}`;
const openHandsAiAgentScanReport = `file://${resolve(root, "reports/openhands-ai-agent-security-scan.html")}`;
const smolagentsAiAgentScanReport = `file://${resolve(root, "reports/smolagents-ai-agent-security-scan.html")}`;
const openAiAgentsPythonScanReport = `file://${resolve(root, "reports/openai-agents-python-security-scan.html")}`;
const terms = `file://${resolve(root, "terms.html")}`;
const checklist = `file://${resolve(root, "checklist.html")}`;
const aiAgentService = `file://${resolve(root, "ai-agent-security-audit-service.html")}`;
const aiAgentSecurityRadar = `file://${resolve(root, "ai-agent-security-radar.html")}`;
const service = `file://${resolve(root, "mcp-security-audit-service.html")}`;
const mcpServerScan = `file://${resolve(root, "mcp-server-security-scan.html")}`;
const mcpSecurityRadar = `file://${resolve(root, "mcp-security-radar.html")}`;
const mcpCodeScanning = `file://${resolve(root, "mcp-code-scanning-github-action.html")}`;
const scan = `file://${resolve(root, "scan.html")}`;
const quickScan = `file://${resolve(root, "quick-scan.html")}`;
const aiJingle = `file://${resolve(root, "ai-jingle-generator.html")}`;
const podcastSponsorJingle = `file://${resolve(root, "podcast-sponsor-jingle.html")}`;
const aiJingleQuote = `file://${resolve(root, "ai-jingle-quote.html")}`;
const quote = `file://${resolve(root, "quote.html")}`;
const samples = `file://${resolve(root, "samples.html")}`;
const trading = `file://${resolve(root, "trading-mcp-security-audit.html")}`;
const workspace = `file://${resolve(root, "workspace-mcp-security-audit.html")}`;
const cloudDatabase = `file://${resolve(root, "cloud-database-mcp-security-audit.html")}`;
const browserAutomation = `file://${resolve(root, "browser-automation-mcp-security-audit.html")}`;
const requiredFiles = [
  "index.html",
  "ai-agent-security-audit-service.html",
  "ai-agent-security-radar.html",
  "mcp-security-audit-service.html",
  "mcp-server-security-scan.html",
  "mcp-security-radar.html",
  "mcp-code-scanning-github-action.html",
  "scan.html",
  "quick-scan.html",
  "ai-jingle-generator.html",
  "podcast-sponsor-jingle.html",
  "ai-jingle-quote.html",
  "quote.html",
  "trading-mcp-security-audit.html",
  "workspace-mcp-security-audit.html",
  "cloud-database-mcp-security-audit.html",
  "browser-automation-mcp-security-audit.html",
  "samples.html",
  "checklist.html",
  "terms.html",
  "styles.css",
  "script.js",
  "scan.js",
  ".nojekyll",
  "llms.txt",
  "robots.txt",
  "sitemap.xml",
  "LICENSE",
  "action.yml",
  ".github/FUNDING.yml",
  ".github/workflows/goal-status-monitor.yml",
  ".github/ISSUE_TEMPLATE/ai-agent-audit.yml",
  ".github/ISSUE_TEMPLATE/ai-jingle-order.yml",
  ".github/workflows/validate.yml",
  ".github/workflows/triage-audit-request.yml",
  ".github/workflows/respond-audit-intent.yml",
  ".github/workflows/respond-ai-jingle-order.yml",
  ".github/workflows/respond-code-scanning-audit.yml",
  ".github/workflows/respond-payment-proof.yml",
  ".github/workflows/smoke-action-v1.yml",
  "examples/github-action.yml",
  "examples/github-code-scanning.yml",
  "assets/audit-dashboard.png",
  "assets/ai-jingle-studio.png",
  "assets/ai-jingle-studio.svg",
  "assets/audio/coffee-shop-30s-hook.wav",
  "assets/audio/business-show-intro.wav",
  "assets/audio/radio-id-drop.wav",
  "assets/payments/eth-address.svg",
  "assets/payments/sol-address.svg",
  "reports/douban-mcp-sample-audit.html",
  "reports/douban-mcp-sample-audit.md",
  "reports/firecrawl-mcp-sample-audit.html",
  "reports/firecrawl-mcp-sample-audit.md",
  "reports/browserbase-mcp-sample-audit.html",
  "reports/browserbase-mcp-sample-audit.md",
  "reports/sentinel-agent-dogfood-audit.html",
  "reports/sentinel-agent-dogfood-audit.md",
  "reports/agentgap-agent-config-dogfood-audit.html",
  "reports/agentgap-agent-config-dogfood-audit.md",
  "reports/playwright-mcp-security-scan.html",
  "reports/chrome-devtools-mcp-security-scan.html",
  "reports/github-mcp-server-security-scan.html",
  "reports/browsermcp-mcp-security-scan.html",
  "reports/browser-use-ai-agent-security-scan.html",
  "reports/openhands-ai-agent-security-scan.html",
  "reports/smolagents-ai-agent-security-scan.html",
  "reports/openai-agents-python-security-scan.html",
  ".github/ISSUE_TEMPLATE/audit-request.yml",
  ".github/ISSUE_TEMPLATE/code-scanning-audit.yml",
  ".github/ISSUE_TEMPLATE/paid-audit-intent.yml",
  ".github/ISSUE_TEMPLATE/payment-confirmation.yml",
  "tools/agent-mcp-audit.mjs",
  "scripts/comment-audit-triage.mjs",
  "scripts/comment-audit-intent.mjs",
  "scripts/comment-ai-jingle-order.mjs",
  "scripts/comment-code-scanning-audit.mjs",
  "scripts/comment-payment-proof.mjs",
  "scripts/find-high-intent-leads.mjs",
  "scripts/render-jingle-samples.mjs",
  "scripts/check-goal-status.mjs",
  "scripts/install-goal-monitor-launchd.mjs",
  "scripts/run-goal-monitor-loop.mjs",
  "docs/mcp-security-audit-service.md",
  "docs/ai-agent-security-audit-service.md",
  "docs/mcp-security-audit-checklist.md",
  "templates/invoice.md",
  "templates/quick-scan.md",
  "templates/ai-jingle-quote.md",
  "templates/ai-jingle-invoice.md",
  "templates/ai-jingle-receipt.md",
  "templates/ai-jingle-delivery-note.md",
  "templates/quote.md",
  "templates/receipt.md",
  "templates/statement-of-work.md",
  "outreach/ai-jingle-outreach.md",
  "outreach/qualified-prospects-2026-06-19.md",
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) {
    throw new Error(`Missing required file: ${file}`);
  }
}

const llmsText = readFileSync(resolve(root, "llms.txt"), "utf8");
if (!llmsText.includes("USD $99 Quick Scan Report") || !llmsText.includes("USD $299 Same-day Focused Review")) {
  throw new Error("llms.txt is missing the package ladder summary");
}
if (!llmsText.includes("payment only after written scope acceptance")) {
  throw new Error("llms.txt is missing the payment timing guardrail");
}
if (!llmsText.includes("MCP Security Radar")) {
  throw new Error("llms.txt is missing the Radar link context");
}
if (!llmsText.includes("AI Agent Security Radar")) {
  throw new Error("llms.txt is missing the AI Agent Radar link context");
}
if (!llmsText.includes("AI Jingle Generator")) {
  throw new Error("llms.txt is missing the AI Jingle Generator offer context");
}
if (!llmsText.includes("USD $29 Founding Hook Sketch")) {
  throw new Error("llms.txt is missing the AI jingle first-sale package");
}
if (!llmsText.includes("Podcast Sponsor Jingle Pack")) {
  throw new Error("llms.txt is missing the Podcast Sponsor Jingle Pack context");
}
if (!llmsText.includes("AI Jingle quote/payment packet")) {
  throw new Error("llms.txt is missing the AI Jingle quote context");
}
if (!llmsText.includes("AI Agent Radar Detail Briefs")) {
  throw new Error("llms.txt is missing the AI Agent Radar detail brief context");
}
if (!llmsText.includes("AgentGap agent config/MCP bridge dogfood sample")) {
  throw new Error("llms.txt is missing the AgentGap dogfood sample link");
}
if (!llmsText.includes("jackjin1997/agent-mcp-code-scan-action@v1")) {
  throw new Error("llms.txt is missing the standalone Action usage");
}
if (!llmsText.includes("Do not paste secrets")) {
  throw new Error("llms.txt is missing the secret-handling warning");
}
const robotsText = readFileSync(resolve(root, "robots.txt"), "utf8");
if (!robotsText.includes("llms.txt")) {
  throw new Error("robots.txt is missing the llms.txt pointer");
}

const markdownOutput = execFileSync(process.execPath, [resolve(root, "tools/agent-mcp-audit.mjs"), root], {
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
});
if (!markdownOutput.includes("## Paid 48-hour review")) {
  throw new Error("Scanner Markdown output is missing paid review CTA");
}
if (!markdownOutput.includes("https://jackjin1997.github.io/agent-audit-sprint/terms.html")) {
  throw new Error("Scanner Markdown output is missing terms URL");
}
if (markdownOutput.includes("private-notes")) {
  throw new Error("Scanner Markdown output should not include private-notes paths");
}
const sarifOutput = execFileSync(process.execPath, [resolve(root, "tools/agent-mcp-audit.mjs"), root, "--sarif"], {
  encoding: "utf8",
  maxBuffer: 10 * 1024 * 1024,
});
const sarifReport = JSON.parse(sarifOutput);
if (sarifReport.version !== "2.1.0") {
  throw new Error("Scanner SARIF output is missing SARIF 2.1.0 version");
}
const sarifRun = sarifReport.runs?.[0];
if (!sarifRun?.tool?.driver?.rules?.length) {
  throw new Error("Scanner SARIF output is missing rules");
}
if (!Array.isArray(sarifRun.results)) {
  throw new Error("Scanner SARIF output is missing results array");
}
if (!sarifRun.tool.driver.informationUri?.includes("mcp-server-security-scan.html")) {
  throw new Error("Scanner SARIF output is missing scanner information URI");
}
if (!sarifRun.tool.driver.rules.some((rule) => rule.helpUri?.includes("mcp-server-security-scan.html"))) {
  throw new Error("Scanner SARIF rules are missing help URI");
}

const triageOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-audit-triage.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    TRIAGE_DRY_RUN: "true",
    TRIAGE_SKIP_CLONE: "true",
    ISSUE_BODY: "### Project or repo URL\n\nhttps://github.com/example/agent-mcp\n",
  },
  maxBuffer: 1024 * 1024,
});
if (!triageOutput.includes("Automated free triage")) {
  throw new Error("Triage dry-run output is missing heading");
}
if (!triageOutput.includes("https://github.com/example/agent-mcp")) {
  throw new Error("Triage dry-run output is missing normalized repo URL");
}
if (!triageOutput.includes("Safety: no dependencies were installed")) {
  throw new Error("Triage dry-run output is missing safety statement");
}
if (!triageOutput.includes("payment-confirmation.yml")) {
  throw new Error("Triage dry-run output is missing payment proof link");
}
if (!triageOutput.includes("quote.html")) {
  throw new Error("Triage dry-run output is missing fixed quote link");
}
if (!triageOutput.includes("scan.html?repo=https%3A%2F%2Fgithub.com%2Fexample%2Fagent-mcp")) {
  throw new Error("Triage dry-run output is missing shareable scanner link");
}

const intentOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-audit-intent.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    INTENT_DRY_RUN: "true",
    ISSUE_BODY: [
      "### Requested package",
      "",
      "USD $99 Quick Scan Report",
      "",
      "### Project or repo URL",
      "",
      "https://github.com/example/agent-mcp",
      "",
      "### Preferred contact",
      "",
      "reply in this issue",
      "",
      "### Timing",
      "",
      "48h target",
      "",
      "### Payment path",
      "",
      "Ethereum after scope acceptance",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (!intentOutput.includes("Audit package request received")) {
  throw new Error("Intent dry-run output is missing heading");
}
if (!intentOutput.includes("Do not send payment until scope is accepted")) {
  throw new Error("Intent dry-run output is missing payment guardrail");
}
if (!intentOutput.includes("USD $99 Quick Scan Report") || !intentOutput.includes("USD $99 equivalent")) {
  throw new Error("Intent dry-run output is missing requested package price");
}
if (!intentOutput.includes("https://github.com/example/agent-mcp")) {
  throw new Error("Intent dry-run output is missing project URL");
}
if (!intentOutput.includes("payment-confirmation.yml")) {
  throw new Error("Intent dry-run output is missing payment proof link");
}
if (!intentOutput.includes("audit-request.yml")) {
  throw new Error("Intent dry-run output is missing conversion links");
}
if (!intentOutput.includes("quote.html")) {
  throw new Error("Intent dry-run output is missing fixed quote link");
}
if (!intentOutput.includes("quick-scan.html")) {
  throw new Error("Intent dry-run output is missing package ladder link");
}
if (!intentOutput.includes("scan.html?repo=https%3A%2F%2Fgithub.com%2Fexample%2Fagent-mcp")) {
  throw new Error("Intent dry-run output is missing shareable scanner link");
}

const jingleOrderOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-ai-jingle-order.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    JINGLE_ORDER_DRY_RUN: "true",
    ISSUE_BODY: [
      "### Requested package",
      "",
      "USD $29 Founding Hook Sketch",
      "",
      "### Brand, podcast, channel, or product name",
      "",
      "Bean There Coffee",
      "",
      "### Website or social link",
      "",
      "https://example.com",
      "",
      "### Primary use",
      "",
      "30 second ad cut",
      "",
      "### Brand brief",
      "",
      "Warm local coffee shop jingle for morning commuters with a clean ending.",
      "",
      "### Preferred contact",
      "",
      "reply in this issue",
      "",
      "### Timing",
      "",
      "48h target",
      "",
      "### Payment path",
      "",
      "Ethereum ERC-20 USDC/USDT/DAI after brief acceptance",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (!jingleOrderOutput.includes("AI jingle order received")) {
  throw new Error("AI jingle order dry-run output is missing heading");
}
if (!jingleOrderOutput.includes("Bean There Coffee") || !jingleOrderOutput.includes("USD $29 equivalent")) {
  throw new Error("AI jingle order dry-run output is missing brand or package price");
}
if (!jingleOrderOutput.includes("Please do not send payment until the brief/package is accepted in writing")) {
  throw new Error("AI jingle order dry-run output is missing payment guardrail");
}
if (
  !jingleOrderOutput.includes("payment-confirmation.yml") ||
  !jingleOrderOutput.includes("ai-jingle-generator.html") ||
  !jingleOrderOutput.includes("ai-jingle-quote.html") ||
  !jingleOrderOutput.includes("templates/ai-jingle-invoice.md") ||
  !jingleOrderOutput.includes("templates/ai-jingle-delivery-note.md")
) {
  throw new Error("AI jingle order dry-run output is missing payment proof, service, or quote link");
}
if (!jingleOrderOutput.includes("AI-generated music can have copyright-registration limits")) {
  throw new Error("AI jingle order dry-run output is missing rights guardrail");
}

const paymentProofOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-payment-proof.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    PAYMENT_PROOF_DRY_RUN: "true",
    ISSUE_BODY: [
      "### Accepted scope issue URL",
      "",
      "https://github.com/jackjin1997/agent-audit-sprint/issues/123",
      "",
      "### Payment network",
      "",
      "Ethereum",
      "",
      "### Transaction hash or settlement reference",
      "",
      "0xabc123",
      "",
      "### Amount sent",
      "",
      "USD 1,000 equivalent",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (!paymentProofOutput.includes("Payment proof received")) {
  throw new Error("Payment proof dry-run output is missing heading");
}
if (!paymentProofOutput.includes("https://github.com/jackjin1997/agent-audit-sprint/issues/123")) {
  throw new Error("Payment proof dry-run output is missing scope issue");
}
if (
  !paymentProofOutput.includes("USD $29/$79/$149/$399 AI jingle work") ||
  !paymentProofOutput.includes("USD $99/$299 audit entry work") ||
  !paymentProofOutput.includes("USD $1,000 full audit sprint")
) {
  throw new Error("Payment proof dry-run output is missing package amount verification rule");
}
if (!paymentProofOutput.includes("ERC-20 USDC/USDT/DAI") || !paymentProofOutput.includes("SPL USDC")) {
  throw new Error("Payment proof dry-run output is missing stablecoin asset options");
}
if (!paymentProofOutput.includes("AI jingle receipt template")) {
  throw new Error("Payment proof dry-run output is missing AI jingle receipt template");
}

const codeScanningAuditOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-code-scanning-audit.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    CODE_SCANNING_AUDIT_DRY_RUN: "true",
    ISSUE_BODY: [
      "### Project or repo URL",
      "",
      "https://github.com/example/agent-mcp",
      "",
      "### Code scanning or SARIF evidence URL",
      "",
      "https://github.com/example/agent-mcp/security/code-scanning/1",
      "",
      "### Alert summary",
      "",
      "Remote MCP transport and write tool alerts.",
      "",
      "### Desired audit scope",
      "",
      "Review the hosted MCP transport, write tools, auth gates, and SARIF findings.",
      "",
      "### Delivery visibility",
      "",
      "Private Markdown report",
      "",
      "### Payment path",
      "",
      "Ethereum after scope acceptance",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (!codeScanningAuditOutput.includes("Code scanning audit received")) {
  throw new Error("Code scanning audit dry-run output is missing heading");
}
if (!codeScanningAuditOutput.includes("https://github.com/example/agent-mcp/security/code-scanning/1")) {
  throw new Error("Code scanning audit dry-run output is missing evidence URL");
}
if (!codeScanningAuditOutput.includes("Do not send payment until scope is accepted in writing")) {
  throw new Error("Code scanning audit dry-run output is missing payment guardrail");
}
if (!codeScanningAuditOutput.includes("payment-confirmation.yml")) {
  throw new Error("Code scanning audit dry-run output is missing payment proof link");
}
if (!codeScanningAuditOutput.includes("mcp-code-scanning-github-action.html")) {
  throw new Error("Code scanning audit dry-run output is missing Code Scanning page link");
}
if (!codeScanningAuditOutput.includes("scan.html?repo=https%3A%2F%2Fgithub.com%2Fexample%2Fagent-mcp")) {
  throw new Error("Code scanning audit dry-run output is missing shareable scanner link");
}

const browser = await chromium.launch();
try {
  for (const viewport of [
    { width: 1440, height: 1000, name: "desktop" },
    { width: 390, height: 844, name: "mobile" },
  ]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.goto(index, { waitUntil: "networkidle" });
    const title = await page.locator("h1").innerText();
    if (!title.includes("Agent/MCP Security Review Packages")) throw new Error(`Unexpected h1 in ${viewport.name}: ${title}`);
    const indexBody = await page.locator("body").innerText();
    if (!indexBody.includes("invoice-first")) {
      throw new Error(`Index page missing invoice-first payment path in ${viewport.name}`);
    }
    if (!indexBody.includes("ERC-20 USDC/USDT/DAI") || !indexBody.includes("SPL USDC")) {
      throw new Error(`Index page missing stablecoin payment options in ${viewport.name}`);
    }
    if (!indexBody.includes("$99 quick scan") || !indexBody.includes("$299 same-day review")) {
      throw new Error(`Index page missing package ladder in ${viewport.name}`);
    }
    if (!indexBody.includes("AI jingle generator")) {
      throw new Error(`Index page missing AI jingle generator entry in ${viewport.name}`);
    }
    if (!indexBody.includes("automated no-execution scanner triage")) {
      throw new Error(`Index page missing automated triage copy in ${viewport.name}`);
    }
    if (!indexBody.includes("browser scanner for public GitHub URLs")) {
      throw new Error(`Index page missing public GitHub scanner copy in ${viewport.name}`);
    }
    if (!indexBody.includes("Paste a public GitHub URL")) {
      throw new Error(`Index page missing public scanner link in ${viewport.name}`);
    }
    if (!indexBody.includes("Open the MCP server security scan page")) {
      throw new Error(`Index page missing MCP server security scan link in ${viewport.name}`);
    }
    if (!indexBody.includes("Open the AI agent security audit page")) {
      throw new Error(`Index page missing AI agent security audit link in ${viewport.name}`);
    }
    if (!indexBody.includes("Open the AI Agent Security Radar")) {
      throw new Error(`Index page missing AI Agent Security Radar link in ${viewport.name}`);
    }
    if (!indexBody.includes("Open the MCP Security Radar")) {
      throw new Error(`Index page missing MCP Security Radar link in ${viewport.name}`);
    }
    if (!indexBody.includes("Use the GitHub Code Scanning workflow")) {
      throw new Error(`Index page missing Code Scanning workflow link in ${viewport.name}`);
    }
    if (!indexBody.includes("jackjin1997/agent-mcp-code-scan-action@v1")) {
      throw new Error(`Index page missing standalone Code Scanning action usage in ${viewport.name}`);
    }
    if (!indexBody.includes("npm exec --yes github:jackjin1997/agent-audit-sprint -- /path/to/repo")) {
      throw new Error(`Index page missing GitHub npx scanner command in ${viewport.name}`);
    }
    if (!indexBody.includes("Reserve audit slot")) {
      throw new Error(`Index page missing short slot reservation CTA in ${viewport.name}`);
    }
    if (!indexBody.includes("Buy quick scan")) {
      throw new Error(`Index page missing quick scan CTA in ${viewport.name}`);
    }
    if (!indexBody.includes("Compare all five sample reports")) {
      throw new Error(`Index page missing sample index link in ${viewport.name}`);
    }
    if (!indexBody.includes("browserbase/mcp-server-browserbase")) {
      throw new Error(`Index page missing Browserbase sample copy in ${viewport.name}`);
    }
    if (!indexBody.includes("Open the Browserbase MCP sample report")) {
      throw new Error(`Index page missing Browserbase sample report link in ${viewport.name}`);
    }
    if (!indexBody.includes("jackjin1997/agentgap") || !indexBody.includes("Open the AgentGap dogfood report")) {
      throw new Error(`Index page missing AgentGap dogfood sample link in ${viewport.name}`);
    }
    const heroImageLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!heroImageLoaded) throw new Error(`Hero image failed to load in ${viewport.name}`);
    const qrImagesLoaded = await page.locator(".qr-code").evaluateAll((images) =>
      images.length === 2 && images.every((img) => img.complete && img.naturalWidth > 0)
    );
    if (!qrImagesLoaded) throw new Error(`Payment QR images failed to load in ${viewport.name}`);
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (horizontalOverflow) throw new Error(`Horizontal overflow detected in ${viewport.name}`);
    const buttons = await page.locator("a.button").count();
    if (buttons < 2) throw new Error(`Expected CTA buttons in ${viewport.name}`);
    const discussionLinks = await page.locator("a[href='https://github.com/jackjin1997/agent-audit-sprint/discussions/1']").count();
    if (discussionLinks < 1) throw new Error(`Expected booking FAQ link in ${viewport.name}`);

    await page.locator("[name='project']").fill("https://github.com/example/agent-mcp");
    await page.locator("[name='scope']").fill("Review MCP transport, write tools, and auth gates.");
    await page.locator("[name='risk']").fill("Remote write tools exposed without clear auth boundaries.");
    await page.locator("[data-intake-form]").evaluate((form) => form.requestSubmit());
    const brief = await page.locator("[data-brief-output]").inputValue();
    if (!brief.includes("https://github.com/example/agent-mcp")) {
      throw new Error(`Generated brief missing project URL in ${viewport.name}`);
    }
    if (!brief.includes("USD $1,000")) {
      throw new Error(`Generated brief missing price confirmation in ${viewport.name}`);
    }
    const prefilledHref = await page.locator("[data-open-brief]").getAttribute("href");
    if (!prefilledHref?.includes("labels=audit-request")) {
      throw new Error(`Prefilled issue link missing audit label in ${viewport.name}`);
    }
    if (!decodeURIComponent(prefilledHref).includes("Audit request: example/agent-mcp")) {
      throw new Error(`Prefilled issue link missing project title in ${viewport.name}`);
    }
    await page.screenshot({ path: resolve(root, `tmp-${viewport.name}.png`), fullPage: true });

    await page.goto(aiJingle, { waitUntil: "networkidle" });
    const aiJingleTitle = await page.locator("h1").innerText();
    if (!aiJingleTitle.includes("AI Jingle Generator for Ads and Podcasts")) {
      throw new Error(`Unexpected AI jingle h1 in ${viewport.name}: ${aiJingleTitle}`);
    }
    const aiJingleText = await page.locator("body").innerText();
    if (
      !aiJingleText.includes("USD $149 Ad Music Pack") ||
      !aiJingleText.includes("USD $29 Founding Hook Sketch") ||
      !aiJingleText.includes("Founding Hook Sketch") ||
      !aiJingleText.includes("Coffee Shop 30s Hook") ||
      !aiJingleText.includes("Business Show Intro") ||
      !aiJingleText.includes("Podcast Sponsor Jingle Pack") ||
      !aiJingleText.includes("Quote/payment packet") ||
      !aiJingleText.includes("Email AI jingle brief to jackjin1997@gmail.com") ||
      !aiJingleText.includes("Pay after accepted brief") ||
      !aiJingleText.includes("AI-generated music may not be copyright-registerable") ||
      !aiJingleText.includes("Open AI jingle order form")
    ) {
      throw new Error(`AI jingle page missing package, payment, rights, or order copy in ${viewport.name}`);
    }
    const aiJingleHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!aiJingleHeroLoaded) throw new Error(`AI jingle hero image failed to load in ${viewport.name}`);
    const sampleAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      sampleAudioSources.length !== 3 ||
      !sampleAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !sampleAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !sampleAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`AI jingle sample audio sources missing in ${viewport.name}`);
    }
    await page.locator("[name='brand']").fill("Bean There Coffee");
    await page.locator("[name='audience']").fill("Morning commuters who need fast coffee and pastries near the station.");
    await page.locator("[name='tagline']").fill("Wake up with us.");
    await page.locator("[data-jingle-form]").evaluate((form) => form.requestSubmit());
    const jinglePacket = await page.locator("[data-jingle-output]").inputValue();
    if (
      !jinglePacket.includes("Bean There Coffee") ||
      !jinglePacket.includes("USD $29 Founding Hook Sketch") ||
      !jinglePacket.includes("## Production prompt") ||
      !jinglePacket.includes("Payment is requested only after the brief and package are accepted in writing")
    ) {
      throw new Error(`AI jingle generated packet missing brand, prompt, or payment guardrail in ${viewport.name}`);
    }
    const jingleHref = await page.locator("[data-open-jingle-brief]").getAttribute("href");
    if (!jingleHref?.includes("template=ai-jingle-order.yml")) {
      throw new Error(`AI jingle prefilled issue link missing order template in ${viewport.name}`);
    }
    if (!decodeURIComponent(jingleHref).includes("AI jingle order: Bean There Coffee")) {
      throw new Error(`AI jingle prefilled issue link missing brand title in ${viewport.name}`);
    }
    const jingleEmailHref = await page.locator("[data-email-jingle-brief]").getAttribute("href");
    if (!jingleEmailHref?.startsWith("mailto:jackjin1997@gmail.com")) {
      throw new Error(`AI jingle generated email link missing recipient in ${viewport.name}`);
    }
    const decodedJingleEmailHref = decodeURIComponent(jingleEmailHref);
    if (
      !decodedJingleEmailHref.includes("AI jingle brief: Bean There Coffee") ||
      !decodedJingleEmailHref.includes("USD $29 Founding Hook Sketch") ||
      !decodedJingleEmailHref.includes("Payment is requested only after the brief and package are accepted in writing")
    ) {
      throw new Error(`AI jingle generated email link missing subject or payment guardrail in ${viewport.name}`);
    }
    const sketchStatus = await page.locator("[data-jingle-sketch-status]").innerText();
    if (!sketchStatus.includes("Browser sketch ready") || !sketchStatus.includes("Paid delivery uses selected AI-assisted generations")) {
      throw new Error(`AI jingle sketch status missing ready or paid-delivery copy in ${viewport.name}`);
    }
    const sketchHref = await page.locator("[data-download-jingle-sketch]").getAttribute("href");
    if (!sketchHref?.startsWith("blob:")) {
      throw new Error(`AI jingle sketch WAV link was not generated in ${viewport.name}`);
    }
    const aiJingleOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (aiJingleOverflow) throw new Error(`AI jingle horizontal overflow detected in ${viewport.name}`);

    await page.goto(podcastSponsorJingle, { waitUntil: "networkidle" });
    const podcastSponsorTitle = await page.locator("h1").innerText();
    if (!podcastSponsorTitle.includes("Podcast Sponsor Jingle Pack")) {
      throw new Error(`Unexpected podcast sponsor jingle h1 in ${viewport.name}: ${podcastSponsorTitle}`);
    }
    const podcastSponsorText = await page.locator("body").innerText();
    if (
      !podcastSponsorText.includes("USD $149 AI-assisted ad music pack") ||
      !podcastSponsorText.includes("host-read ads") ||
      !podcastSponsorText.includes("media-kit owners") ||
      !podcastSponsorText.includes("Email sponsor brief") ||
      !podcastSponsorText.includes("jackjin1997@gmail.com") ||
      !podcastSponsorText.includes("Payment is requested only after the written brief and package are accepted") ||
      !podcastSponsorText.includes("Acast 2026 podcast advertising guide") ||
      !podcastSponsorText.includes("Open order form")
    ) {
      throw new Error(`Podcast sponsor jingle page missing package, market, payment, or CTA copy in ${viewport.name}`);
    }
    const podcastSponsorHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!podcastSponsorHeroLoaded) throw new Error(`Podcast sponsor jingle hero image failed to load in ${viewport.name}`);
    const podcastSponsorAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      podcastSponsorAudioSources.length !== 3 ||
      !podcastSponsorAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !podcastSponsorAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !podcastSponsorAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`Podcast sponsor jingle sample audio sources missing in ${viewport.name}`);
    }
    const podcastSponsorOrderLinks = await page.locator("a[href*='template=ai-jingle-order.yml']").count();
    if (podcastSponsorOrderLinks < 1) {
      throw new Error(`Podcast sponsor jingle page missing order link in ${viewport.name}`);
    }
    const podcastSponsorEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      podcastSponsorEmailLinks.length < 2 ||
      !podcastSponsorEmailLinks.some((href) => href.includes("Podcast sponsor jingle brief")) ||
      !podcastSponsorEmailLinks.some((href) => href.includes("Payment timing: after written brief acceptance only"))
    ) {
      throw new Error(`Podcast sponsor jingle page missing email brief link or payment guardrail in ${viewport.name}`);
    }
    const podcastSponsorOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (podcastSponsorOverflow) throw new Error(`Podcast sponsor jingle horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiJingleQuote, { waitUntil: "networkidle" });
    const aiJingleQuoteTitle = await page.locator("h1").innerText();
    if (!aiJingleQuoteTitle.includes("AI Jingle Package Quotes")) {
      throw new Error(`Unexpected AI jingle quote h1 in ${viewport.name}: ${aiJingleQuoteTitle}`);
    }
    const aiJingleQuoteText = await page.locator("body").innerText();
    if (
      !aiJingleQuoteText.includes("USD $79 hook pack") ||
      !aiJingleQuoteText.includes("USD $29 hook sketch") ||
      !aiJingleQuoteText.includes("USD $149 ad music pack") ||
      !aiJingleQuoteText.includes("USD $399 sonic launch kit") ||
      !aiJingleQuoteText.includes("Payment timing:") ||
      !aiJingleQuoteText.includes("After written brief acceptance only") ||
      !aiJingleQuoteText.includes("Email brief") ||
      !aiJingleQuoteText.includes("AI-generated music can have copyright-registration limits") ||
      !aiJingleQuoteText.includes("Invoice template") ||
      !aiJingleQuoteText.includes("Delivery note")
    ) {
      throw new Error(`AI jingle quote page missing package, payment, or rights copy in ${viewport.name}`);
    }
    const jinglePaymentPacketTarget = await page.locator("[data-copy-target='#jingle-payment-packet']").getAttribute("data-copy-target");
    if (jinglePaymentPacketTarget !== "#jingle-payment-packet") {
      throw new Error(`AI jingle quote payment packet copy target missing in ${viewport.name}`);
    }
    const aiJingleQuotePaymentProofLinks = await page.locator("a[href*='template=payment-confirmation.yml']").count();
    if (aiJingleQuotePaymentProofLinks < 1) {
      throw new Error(`AI jingle quote page missing payment proof link in ${viewport.name}`);
    }
    const aiJingleQuoteEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      aiJingleQuoteEmailLinks.length < 2 ||
      !aiJingleQuoteEmailLinks.some((href) => href.includes("AI jingle brief")) ||
      !aiJingleQuoteEmailLinks.some((href) => href.includes("Payment timing: after written brief acceptance only"))
    ) {
      throw new Error(`AI jingle quote page missing email brief link or payment guardrail in ${viewport.name}`);
    }
    const aiJingleQuoteOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (aiJingleQuoteOverflow) throw new Error(`AI jingle quote horizontal overflow detected in ${viewport.name}`);

    await page.goto(doubanReport, { waitUntil: "networkidle" });
    const reportTitle = await page.locator("h1").innerText();
    if (!reportTitle.includes("douban-mcp")) throw new Error(`Unexpected report h1 in ${viewport.name}: ${reportTitle}`);
    const reportOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (reportOverflow) throw new Error(`Report horizontal overflow detected in ${viewport.name}`);

    await page.goto(firecrawlReport, { waitUntil: "networkidle" });
    const firecrawlReportTitle = await page.locator("h1").innerText();
    if (!firecrawlReportTitle.includes("firecrawl")) {
      throw new Error(`Unexpected Firecrawl report h1 in ${viewport.name}: ${firecrawlReportTitle}`);
    }
    const firecrawlReportText = await page.locator("body").innerText();
    if (!firecrawlReportText.includes("independent public-code sample")) {
      throw new Error(`Firecrawl report missing sample disclaimer in ${viewport.name}`);
    }
    const firecrawlReportCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!firecrawlReportCta?.includes("audit-request.yml")) {
      throw new Error(`Firecrawl report CTA missing intake URL in ${viewport.name}`);
    }
    const firecrawlReportOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (firecrawlReportOverflow) {
      throw new Error(`Firecrawl report horizontal overflow detected in ${viewport.name}`);
    }

    await page.goto(browserbaseReport, { waitUntil: "networkidle" });
    const browserbaseReportTitle = await page.locator("h1").innerText();
    if (!browserbaseReportTitle.includes("browserbase")) {
      throw new Error(`Unexpected Browserbase report h1 in ${viewport.name}: ${browserbaseReportTitle}`);
    }
    const browserbaseReportText = await page.locator("body").innerText();
    if (!browserbaseReportText.includes("independent public-code sample")) {
      throw new Error(`Browserbase report missing sample disclaimer in ${viewport.name}`);
    }
    if (!browserbaseReportText.includes("pnpm install + build + tests passed")) {
      throw new Error(`Browserbase report missing validation summary in ${viewport.name}`);
    }
    const browserbaseReportCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!browserbaseReportCta?.includes("audit-request.yml")) {
      throw new Error(`Browserbase report CTA missing intake URL in ${viewport.name}`);
    }
    const browserbaseReportOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (browserbaseReportOverflow) {
      throw new Error(`Browserbase report horizontal overflow detected in ${viewport.name}`);
    }

    await page.goto(sentinelDogfoodReport, { waitUntil: "networkidle" });
    const sentinelReportTitle = await page.locator("h1").innerText();
    if (!sentinelReportTitle.includes("jackjin1997/sentinel")) {
      throw new Error(`Unexpected Sentinel dogfood report h1 in ${viewport.name}: ${sentinelReportTitle}`);
    }
    const sentinelReportText = await page.locator("body").innerText();
    if (
      !sentinelReportText.includes("No-execution dogfood sample") ||
      !sentinelReportText.includes("54/100 heuristic score") ||
      !sentinelReportText.includes("Public agent run endpoint needs auth, quota, and concurrency boundaries")
    ) {
      throw new Error(`Sentinel dogfood report missing guardrail, score, or finding in ${viewport.name}`);
    }
    const sentinelReportCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!sentinelReportCta?.includes("ai-agent-audit.yml")) {
      throw new Error(`Sentinel dogfood report CTA missing AI agent intake URL in ${viewport.name}`);
    }
    const sentinelReportOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (sentinelReportOverflow) {
      throw new Error(`Sentinel dogfood report horizontal overflow detected in ${viewport.name}`);
    }

    await page.goto(agentgapDogfoodReport, { waitUntil: "networkidle" });
    const agentgapReportTitle = await page.locator("h1").innerText();
    if (!agentgapReportTitle.includes("jackjin1997/agentgap")) {
      throw new Error(`Unexpected AgentGap dogfood report h1 in ${viewport.name}: ${agentgapReportTitle}`);
    }
    const agentgapReportText = await page.locator("body").innerText();
    if (
      !agentgapReportText.includes("No-execution dogfood sample") ||
      !agentgapReportText.includes("42/100 heuristic score") ||
      !agentgapReportText.includes("Default sync writes agent instructions and MCP configs without a preview-first guardrail")
    ) {
      throw new Error(`AgentGap dogfood report missing guardrail, score, or finding in ${viewport.name}`);
    }
    const agentgapReportCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!agentgapReportCta?.includes("ai-agent-audit.yml")) {
      throw new Error(`AgentGap dogfood report CTA missing AI agent intake URL in ${viewport.name}`);
    }
    const agentgapReportOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (agentgapReportOverflow) {
      throw new Error(`AgentGap dogfood report horizontal overflow detected in ${viewport.name}`);
    }

    await page.goto(aiAgentService, { waitUntil: "networkidle" });
    const aiAgentServiceTitle = await page.locator("h1").innerText();
    if (!aiAgentServiceTitle.includes("AI Agent Security Audit Service")) {
      throw new Error(`Unexpected AI agent service h1 in ${viewport.name}: ${aiAgentServiceTitle}`);
    }
    const aiAgentServiceText = await page.locator("body").innerText();
    if (
      !aiAgentServiceText.includes("USD $1,000") ||
      !aiAgentServiceText.includes("tool calls") ||
      !aiAgentServiceText.includes("prompt/tool injection") ||
      !aiAgentServiceText.includes("browser sessions") ||
      !aiAgentServiceText.includes("Pay USD $1,000 equivalent only after scope acceptance")
    ) {
      throw new Error(`AI agent service page missing price, risk surface, or payment guardrail in ${viewport.name}`);
    }
    const aiAgentServiceCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!aiAgentServiceCta?.includes("ai-agent-audit.yml")) {
      throw new Error(`AI agent service CTA missing dedicated intake URL in ${viewport.name}`);
    }
    if (!aiAgentServiceText.includes("Open AI Agent Radar")) {
      throw new Error(`AI agent service page missing AI Agent Radar link in ${viewport.name}`);
    }
    const aiAgentIntakeLinks = await page.locator("a[href*='template=ai-agent-audit.yml']").count();
    if (aiAgentIntakeLinks < 2) {
      throw new Error(`AI agent service page missing dedicated intake links in ${viewport.name}`);
    }
    const aiAgentServiceOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (aiAgentServiceOverflow) throw new Error(`AI agent service horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiAgentSecurityRadar, { waitUntil: "networkidle" });
    const aiAgentRadarTitle = await page.locator("h1").innerText();
    if (!aiAgentRadarTitle.includes("AI Agent Security Radar")) {
      throw new Error(`Unexpected AI Agent Radar h1 in ${viewport.name}: ${aiAgentRadarTitle}`);
    }
    const aiAgentRadarText = await page.locator("body").innerText();
    if (
      !aiAgentRadarText.includes("browser-use/browser-use") ||
      !aiAgentRadarText.includes("OpenHands/OpenHands") ||
      !aiAgentRadarText.includes("microsoft/autogen") ||
      !aiAgentRadarText.includes("crewAIInc/crewAI") ||
      !aiAgentRadarText.includes("agno-agi/agno") ||
      !aiAgentRadarText.includes("langchain-ai/langgraph") ||
      !aiAgentRadarText.includes("huggingface/smolagents") ||
      !aiAgentRadarText.includes("openai/openai-agents-python")
    ) {
      throw new Error(`AI Agent Radar missing expected public repo entries in ${viewport.name}`);
    }
    if (!aiAgentRadarText.includes("90 selected public text files per repo")) {
      throw new Error(`AI Agent Radar missing methodology copy in ${viewport.name}`);
    }
    if (!aiAgentRadarText.includes("not confirmed vulnerabilities")) {
      throw new Error(`AI Agent Radar missing non-certification guardrail in ${viewport.name}`);
    }
    if (!aiAgentRadarText.includes("Start audit from Radar")) {
      throw new Error(`AI Agent Radar missing paid audit handoff in ${viewport.name}`);
    }
    const aiAgentRadarDetailLinks = await page.locator(
      "a[href='reports/browser-use-ai-agent-security-scan.html'], a[href='reports/openhands-ai-agent-security-scan.html'], a[href='reports/smolagents-ai-agent-security-scan.html'], a[href='reports/openai-agents-python-security-scan.html']"
    ).count();
    if (aiAgentRadarDetailLinks !== 4) {
      throw new Error(`AI Agent Radar missing detail report links in ${viewport.name}`);
    }
    const aiAgentRadarCards = await page.locator(".radar-card").count();
    if (aiAgentRadarCards !== 8) {
      throw new Error(`AI Agent Radar expected 8 cards in ${viewport.name}, found ${aiAgentRadarCards}`);
    }
    const aiAgentRadarOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (aiAgentRadarOverflow) {
      throw new Error(`AI Agent Radar horizontal overflow detected in ${viewport.name}`);
    }

    for (const reportPage of [
      { url: browserUseAiAgentScanReport, title: "browser-use/browser-use AI agent security scan", marker: "62/100 heuristic" },
      { url: openHandsAiAgentScanReport, title: "OpenHands/OpenHands AI agent security scan", marker: "68/100 heuristic" },
      { url: smolagentsAiAgentScanReport, title: "huggingface/smolagents AI agent security scan", marker: "62/100 heuristic" },
      { url: openAiAgentsPythonScanReport, title: "openai/openai-agents-python AI agent security scan", marker: "76/100 heuristic" },
    ]) {
      await page.goto(reportPage.url, { waitUntil: "networkidle" });
      const reportPageTitle = await page.locator("h1").innerText();
      if (!reportPageTitle.includes(reportPage.title)) {
        throw new Error(`Unexpected AI Agent Radar detail h1 in ${viewport.name}: ${reportPageTitle}`);
      }
      const reportPageText = await page.locator("body").innerText();
      if (
        !reportPageText.includes(reportPage.marker) ||
        !reportPageText.includes("Partial no-execution triage") ||
        !reportPageText.includes("90 selected public text files") ||
        !reportPageText.includes("not a commissioned audit") ||
        !reportPageText.includes("not confirmed vulnerabilities") ||
        !reportPageText.includes("Start audit from Radar") ||
        !reportPageText.includes("Pay USD $1,000 only after written scope acceptance")
      ) {
        throw new Error(`AI Agent Radar detail page missing score, guardrail, or paid handoff in ${viewport.name}: ${reportPage.title}`);
      }
      const reportPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (reportPageOverflow) {
        throw new Error(`AI Agent Radar detail page horizontal overflow detected in ${viewport.name}: ${reportPage.title}`);
      }
    }

    await page.goto(service, { waitUntil: "networkidle" });
    const serviceTitle = await page.locator("h1").innerText();
    if (!serviceTitle.includes("MCP Security Audit Service")) {
      throw new Error(`Unexpected service h1 in ${viewport.name}: ${serviceTitle}`);
    }
    const serviceText = await page.locator("body").innerText();
    if (!serviceText.includes("USD $1,000")) {
      throw new Error(`Service page missing fixed price in ${viewport.name}`);
    }
    if (!serviceText.includes("invoice-first")) {
      throw new Error(`Service page missing invoice-first payment path in ${viewport.name}`);
    }
    if (!serviceText.includes("automated no-execution scanner triage")) {
      throw new Error(`Service page missing automated triage copy in ${viewport.name}`);
    }
    if (!serviceText.includes("Ask before booking")) {
      throw new Error(`Service page missing booking discussion CTA in ${viewport.name}`);
    }
    if (!serviceText.includes("Reserve audit slot")) {
      throw new Error(`Service page missing short slot reservation CTA in ${viewport.name}`);
    }
    if (!serviceText.includes("View quote")) {
      throw new Error(`Service page missing fixed quote CTA in ${viewport.name}`);
    }
    if (
      !serviceText.includes("Trading MCP security audit") ||
      !serviceText.includes("Workspace MCP security audit") ||
      !serviceText.includes("Cloud and database MCP security audit") ||
      !serviceText.includes("Browser automation MCP security audit")
    ) {
      throw new Error(`Service page missing vertical audit links in ${viewport.name}`);
    }
    const serviceCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!serviceCta?.includes("audit-request.yml")) {
      throw new Error(`Service CTA missing intake URL in ${viewport.name}`);
    }
    const serviceOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (serviceOverflow) throw new Error(`Service horizontal overflow detected in ${viewport.name}`);

    await page.goto(mcpServerScan, { waitUntil: "networkidle" });
    const mcpServerScanTitle = await page.locator("h1").innerText();
    if (!mcpServerScanTitle.includes("MCP Server Security Scan")) {
      throw new Error(`Unexpected MCP server scan h1 in ${viewport.name}: ${mcpServerScanTitle}`);
    }
    const mcpServerScanText = await page.locator("body").innerText();
    if (!mcpServerScanText.includes("scan.html?repo=https://github.com/org/repo")) {
      throw new Error(`MCP server scan page missing shareable URL format in ${viewport.name}`);
    }
    if (!mcpServerScanText.includes("USD $1,000") || !mcpServerScanText.includes("Open fixed quote")) {
      throw new Error(`MCP server scan page missing paid audit handoff in ${viewport.name}`);
    }
    if (!mcpServerScanText.includes("does not execute target code")) {
      throw new Error(`MCP server scan page missing no-execution safety copy in ${viewport.name}`);
    }
    if (!mcpServerScanText.includes("Open MCP Security Radar")) {
      throw new Error(`MCP server scan page missing Radar link in ${viewport.name}`);
    }
    const mcpServerScanCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (mcpServerScanCta !== "scan.html") {
      throw new Error(`MCP server scan primary CTA should open scan.html in ${viewport.name}`);
    }
    const mcpServerScanOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (mcpServerScanOverflow) {
      throw new Error(`MCP server scan horizontal overflow detected in ${viewport.name}`);
    }

    await page.goto(mcpSecurityRadar, { waitUntil: "networkidle" });
    const radarTitle = await page.locator("h1").innerText();
    if (!radarTitle.includes("MCP Security Radar")) {
      throw new Error(`Unexpected MCP Security Radar h1 in ${viewport.name}: ${radarTitle}`);
    }
    const radarText = await page.locator("body").innerText();
    if (
      !radarText.includes("microsoft/playwright-mcp") ||
      !radarText.includes("ChromeDevTools/chrome-devtools-mcp") ||
      !radarText.includes("github/github-mcp-server") ||
      !radarText.includes("googleapis/mcp-toolbox") ||
      !radarText.includes("BrowserMCP/mcp")
    ) {
      throw new Error(`MCP Security Radar missing expected public repo entries in ${viewport.name}`);
    }
    if (!radarText.includes("Up to 90 selected text files per repo")) {
      throw new Error(`MCP Security Radar missing methodology copy in ${viewport.name}`);
    }
    if (!radarText.includes("Scores are heuristic triage signals")) {
      throw new Error(`MCP Security Radar missing non-certification guardrail in ${viewport.name}`);
    }
    if (!radarText.includes("Start audit from scan")) {
      throw new Error(`MCP Security Radar missing paid audit handoff in ${viewport.name}`);
    }
    const radarDetailLinks = await page.locator(
      "a[href='reports/playwright-mcp-security-scan.html'], a[href='reports/chrome-devtools-mcp-security-scan.html'], a[href='reports/github-mcp-server-security-scan.html'], a[href='reports/browsermcp-mcp-security-scan.html']"
    ).count();
    if (radarDetailLinks !== 4) {
      throw new Error(`MCP Security Radar missing detail report links in ${viewport.name}`);
    }
    const radarCards = await page.locator(".radar-card").count();
    if (radarCards !== 8) {
      throw new Error(`MCP Security Radar expected 8 cards in ${viewport.name}, found ${radarCards}`);
    }
    const radarOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (radarOverflow) {
      throw new Error(`MCP Security Radar horizontal overflow detected in ${viewport.name}`);
    }

    for (const reportPage of [
      { url: playwrightScanReport, title: "microsoft/playwright-mcp security scan", marker: "32/100 heuristic" },
      { url: chromeDevtoolsScanReport, title: "ChromeDevTools/chrome-devtools-mcp security scan", marker: "72/100 heuristic" },
      { url: githubMcpScanReport, title: "github/github-mcp-server security scan", marker: "76/100 heuristic" },
      { url: browserMcpScanReport, title: "BrowserMCP/mcp security scan", marker: "38/100 heuristic" },
    ]) {
      await page.goto(reportPage.url, { waitUntil: "networkidle" });
      const reportPageTitle = await page.locator("h1").innerText();
      if (!reportPageTitle.includes(reportPage.title)) {
        throw new Error(`Unexpected Radar detail h1 in ${viewport.name}: ${reportPageTitle}`);
      }
      const reportPageText = await page.locator("body").innerText();
      if (
        !reportPageText.includes(reportPage.marker) ||
        !reportPageText.includes("Partial no-execution triage") ||
        !reportPageText.includes("not a commissioned audit") ||
        !reportPageText.includes("Start audit from scan") ||
        !reportPageText.includes("Pay USD $1,000 only after written scope acceptance")
      ) {
        throw new Error(`Radar detail page missing score, guardrail, or paid handoff in ${viewport.name}: ${reportPage.title}`);
      }
      const reportPageOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (reportPageOverflow) {
        throw new Error(`Radar detail page horizontal overflow detected in ${viewport.name}: ${reportPage.title}`);
      }
    }

    await page.goto(mcpCodeScanning, { waitUntil: "networkidle" });
    const mcpCodeScanningTitle = await page.locator("h1").innerText();
    if (!mcpCodeScanningTitle.includes("MCP Code Scanning GitHub Action")) {
      throw new Error(`Unexpected MCP code scanning h1 in ${viewport.name}: ${mcpCodeScanningTitle}`);
    }
    const mcpCodeScanningText = await page.locator("body").innerText();
    if (!mcpCodeScanningText.includes("SARIF 2.1.0")) {
      throw new Error(`MCP code scanning page missing SARIF copy in ${viewport.name}`);
    }
    if (!mcpCodeScanningText.includes("github/codeql-action/upload-sarif@v4")) {
      throw new Error(`MCP code scanning page missing upload-sarif workflow step in ${viewport.name}`);
    }
    if (!mcpCodeScanningText.includes("security-events: write")) {
      throw new Error(`MCP code scanning page missing security-events permission in ${viewport.name}`);
    }
    if (!mcpCodeScanningText.includes("sarif: \"true\"")) {
      throw new Error(`MCP code scanning page missing action SARIF input in ${viewport.name}`);
    }
    if (!mcpCodeScanningText.includes("jackjin1997/agent-mcp-code-scan-action@v1")) {
      throw new Error(`MCP code scanning page missing standalone action usage in ${viewport.name}`);
    }
    if (!mcpCodeScanningText.includes("Public @v1 smoke workflow checks Markdown and SARIF output")) {
      throw new Error(`MCP code scanning page missing standalone action verification copy in ${viewport.name}`);
    }
    if (!mcpCodeScanningText.includes("jackjin1997/agent-mcp-code-scan-action")) {
      throw new Error(`MCP code scanning page missing standalone action repo link in ${viewport.name}`);
    }
    if (!mcpCodeScanningText.includes("Pay USD $1,000 only after written scope acceptance")) {
      throw new Error(`MCP code scanning page missing payment guardrail in ${viewport.name}`);
    }
    if (!mcpCodeScanningText.includes("Start code scanning audit")) {
      throw new Error(`MCP code scanning page missing dedicated intake CTA in ${viewport.name}`);
    }
    const mcpCodeScanningCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (mcpCodeScanningCta !== "examples/github-code-scanning.yml") {
      throw new Error(`MCP code scanning primary CTA should open workflow example in ${viewport.name}`);
    }
    const codeScanningAuditLinks = await page.locator("a[href*='template=code-scanning-audit.yml']").count();
    if (codeScanningAuditLinks < 1) {
      throw new Error(`MCP code scanning page missing code scanning audit issue link in ${viewport.name}`);
    }
    const mcpCodeScanningOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (mcpCodeScanningOverflow) {
      throw new Error(`MCP code scanning horizontal overflow detected in ${viewport.name}`);
    }

    await page.route("https://api.github.com/repos/example/agent-mcp**", async (route) => {
      const url = route.request().url();
      if (url.endsWith("/git/trees/main?recursive=1")) {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            truncated: false,
            tree: [
              { path: "package.json", type: "blob", size: 150 },
              { path: "src/server.ts", type: "blob", size: 1200 },
              { path: ".github/workflows/ci.yml", type: "blob", size: 260 },
            ],
          }),
        });
        return;
      }
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          full_name: "example/agent-mcp",
          default_branch: "main",
          html_url: "https://github.com/example/agent-mcp",
        }),
      });
    });
    await page.route("https://raw.githubusercontent.com/example/agent-mcp/main/**", async (route) => {
      const url = decodeURIComponent(route.request().url());
      if (url.endsWith("/package.json")) {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            scripts: {
              test: "vitest",
            },
          }),
        });
        return;
      }
      if (url.endsWith("/.github/workflows/ci.yml")) {
        await route.fulfill({
          contentType: "text/yaml",
          body: "name: ci\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n",
        });
        return;
      }
      await route.fulfill({
        contentType: "text/typescript",
        body: [
          "import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';",
          "import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';",
          "const server = new McpServer({ name: 'agent-mcp', version: '1.0.0' });",
          "server.registerTool('write_note', { description: 'write', inputSchema: {} }, async () => fetch('https://api.example.test/notes', { method: 'POST' }));",
          "server.listen(process.env.PORT);",
        ].join("\n"),
      });
    });
    await page.route("https://api.github.com/repos/example/rate-limited**", async (route) => {
      await route.fulfill({
        status: 403,
        contentType: "application/json",
        body: JSON.stringify({ message: "API rate limit exceeded" }),
      });
    });
    await page.route("https://raw.githubusercontent.com/example/rate-limited/HEAD/**", async (route) => {
      const url = decodeURIComponent(route.request().url());
      if (url.endsWith("/package.json")) {
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            scripts: {
              test: "vitest",
              lint: "eslint .",
            },
          }),
        });
        return;
      }
      if (url.endsWith("/src/server.ts")) {
        await route.fulfill({
          contentType: "text/typescript",
          body: [
            "import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';",
            "const server = new McpServer({ name: 'rate-limited', version: '1.0.0' });",
            "server.registerTool('write_note', { description: 'write' }, async () => fetch('https://api.example.test/notes', { method: 'POST' }));",
          ].join("\n"),
        });
        return;
      }
      await route.fulfill({ status: 404, body: "" });
    });

    await page.goto(`${scan}?repo=${encodeURIComponent("https://github.com/example/agent-mcp")}`, { waitUntil: "networkidle" });
    const scanTitle = await page.locator("h1").innerText();
    if (!scanTitle.includes("Browser Agent/MCP Audit Scanner")) {
      throw new Error(`Unexpected scanner h1 in ${viewport.name}: ${scanTitle}`);
    }
    const scanText = await page.locator("body").innerText();
    if (!scanText.includes("does not upload code") || !scanText.includes("does not execute target code")) {
      throw new Error(`Scanner page missing safety copy in ${viewport.name}`);
    }
    if (!scanText.includes("Reserve audit slot")) {
      throw new Error(`Scanner page missing short slot reservation CTA in ${viewport.name}`);
    }
    if (!scanText.includes("npm exec --yes github:jackjin1997/agent-audit-sprint -- /path/to/repo")) {
      throw new Error(`Scanner page missing GitHub npx scanner command in ${viewport.name}`);
    }
    if (!scanText.includes("Paste a GitHub URL")) {
      throw new Error(`Scanner page missing public GitHub URL scan copy in ${viewport.name}`);
    }
    if (!scanText.includes("scan.html?repo=https://github.com/org/repo")) {
      throw new Error(`Scanner page missing shareable repo URL format in ${viewport.name}`);
    }
    if (!scanText.includes("Copy scan link")) {
      throw new Error(`Scanner page missing copy scan link action in ${viewport.name}`);
    }
    if (!scanText.includes("Copy audit request packet")) {
      throw new Error(`Scanner page missing audit request packet action in ${viewport.name}`);
    }
    if (!scanText.includes("Payment timing: after written scope acceptance only.")) {
      throw new Error(`Scanner page missing audit packet payment timing in ${viewport.name}`);
    }
    await page.waitForFunction(() => document.querySelector("[data-local-scan-output]")?.value.includes("Public GitHub Repo Scan"));
    const publicScanOutput = await page.locator("[data-local-scan-output]").inputValue();
    if (!publicScanOutput.includes("https://github.com/example/agent-mcp")) {
      throw new Error(`Public scanner output missing GitHub target in ${viewport.name}`);
    }
    if (!publicScanOutput.includes("Paid 48-hour review")) {
      throw new Error(`Public scanner output missing paid review handoff in ${viewport.name}`);
    }
    if (!page.url().includes("repo=https%3A%2F%2Fgithub.com%2Fexample%2Fagent-mcp")) {
      throw new Error(`Public scanner URL missing shareable repo parameter in ${viewport.name}`);
    }
    const publicScanHrefs = await page.locator("[data-open-scan-request]").evaluateAll((links) =>
      links.map((link) => link.getAttribute("href") || "")
    );
    if (publicScanHrefs.length !== 2) {
      throw new Error(`Expected two scanner request links in ${viewport.name}`);
    }
    if (new Set(publicScanHrefs).size !== 1) {
      throw new Error(`Scanner request links are not synchronized in ${viewport.name}`);
    }
    const publicScanHref = publicScanHrefs[0];
    if (!decodeURIComponent(publicScanHref || "").includes("https://github.com/example/agent-mcp")) {
      throw new Error(`Public scanner request link missing GitHub target in ${viewport.name}`);
    }
    if (decodeURIComponent(publicScanHref || "").length > 9000) {
      throw new Error(`Public scanner request link is too long in ${viewport.name}`);
    }
    const publicAuditPacket = await page.locator("[data-audit-packet-output]").inputValue();
    if (!publicAuditPacket.includes("## Payment and start terms")) {
      throw new Error(`Public scanner audit packet missing payment terms in ${viewport.name}`);
    }
    if (!publicAuditPacket.includes("Fixed quote: https://jackjin1997.github.io/agent-audit-sprint/quote.html")) {
      throw new Error(`Public scanner audit packet missing fixed quote link in ${viewport.name}`);
    }
    if (!publicAuditPacket.includes("## Scanner report")) {
      throw new Error(`Public scanner audit packet missing report body in ${viewport.name}`);
    }
    await page.goto(`${scan}?repo=${encodeURIComponent("https://github.com/example/rate-limited")}`, { waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelector("[data-local-scan-output]")?.value.includes("raw-file fallback"));
    const fallbackScanOutput = await page.locator("[data-local-scan-output]").inputValue();
    if (!fallbackScanOutput.includes("Public GitHub Repo Scan: example/rate-limited")) {
      throw new Error(`Fallback public scanner output missing title in ${viewport.name}`);
    }
    if (!fallbackScanOutput.includes("Paid 48-hour review")) {
      throw new Error(`Fallback public scanner output missing paid review handoff in ${viewport.name}`);
    }
    await page.locator("[data-local-scan-input]").setInputFiles(resolve(root, "examples/local-scan-fixture"));
    await page.locator("[data-local-scan-form]").evaluate((form) => form.requestSubmit());
    await page.waitForFunction(() => document.querySelector("[data-local-scan-output]")?.value.includes("Heuristic score"));
    const scanOutput = await page.locator("[data-local-scan-output]").inputValue();
    if (!scanOutput.includes("Paid 48-hour review")) {
      throw new Error(`Scanner output missing paid review handoff in ${viewport.name}`);
    }
    const scanHref = await page.locator("[data-open-scan-request]").first().getAttribute("href");
    if (!scanHref?.includes("labels=audit-request")) {
      throw new Error(`Scanner request link missing audit label in ${viewport.name}`);
    }
    const localAuditPacket = await page.locator("[data-audit-packet-output]").inputValue();
    if (!localAuditPacket.includes("Private or local repo; access details to be shared after scope acceptance.")) {
      throw new Error(`Local scanner audit packet missing private repo handoff in ${viewport.name}`);
    }
    if (!localAuditPacket.includes("Payment timing: after written scope acceptance only.")) {
      throw new Error(`Local scanner audit packet missing payment guardrail in ${viewport.name}`);
    }
    const scanOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (scanOverflow) throw new Error(`Scanner horizontal overflow detected in ${viewport.name}`);

    await page.goto(quickScan, { waitUntil: "networkidle" });
    const quickScanTitle = await page.locator("h1").innerText();
    if (!quickScanTitle.includes("Agent/MCP Quick Scan Packages")) {
      throw new Error(`Unexpected quick scan h1 in ${viewport.name}: ${quickScanTitle}`);
    }
    const quickScanText = await page.locator("body").innerText();
    if (
      !quickScanText.includes("USD $99 Quick Scan Report") ||
      !quickScanText.includes("USD $299 Same-day Focused Review") ||
      !quickScanText.includes("USD $1,000 Full Audit Sprint") ||
      !quickScanText.includes("Pay after scope acceptance") ||
      !quickScanText.includes("Copy payment packet")
    ) {
      throw new Error(`Quick scan page missing package ladder or payment guardrail in ${viewport.name}`);
    }
    const quickScanCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!quickScanCta?.includes("paid-audit-intent.yml")) {
      throw new Error(`Quick scan primary CTA missing package intake URL in ${viewport.name}`);
    }
    const quickScanOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (quickScanOverflow) throw new Error(`Quick scan horizontal overflow detected in ${viewport.name}`);

    await page.goto(quote, { waitUntil: "networkidle" });
    const quoteTitle = await page.locator("h1").innerText();
    if (!quoteTitle.includes("Agent/MCP Security Review Quotes")) {
      throw new Error(`Unexpected quote h1 in ${viewport.name}: ${quoteTitle}`);
    }
    const quoteText = await page.locator("body").innerText();
    if (!quoteText.includes("Acceptance text")) {
      throw new Error(`Quote page missing acceptance text in ${viewport.name}`);
    }
    if (!quoteText.includes("Submit payment proof")) {
      throw new Error(`Quote page missing payment proof CTA in ${viewport.name}`);
    }
    if (!quoteText.includes("ERC-20 USDC/USDT/DAI") || !quoteText.includes("SPL USDC")) {
      throw new Error(`Quote page missing stablecoin payment options in ${viewport.name}`);
    }
    if (!quoteText.includes("Copy payment packet")) {
      throw new Error(`Quote page missing copyable payment packet action in ${viewport.name}`);
    }
    if (!quoteText.includes("USD $99 Quick Scan Report") || !quoteText.includes("USD $299 Same-day Focused Review")) {
      throw new Error(`Quote page missing package ladder in ${viewport.name}`);
    }
    if (!quoteText.includes("Payment timing: after written scope acceptance only.")) {
      throw new Error(`Quote page missing payment packet timing guardrail in ${viewport.name}`);
    }
    if (!quoteText.includes("The 48-hour target starts after both scope acceptance and payment confirmation.")) {
      throw new Error(`Quote page missing payment packet start rule in ${viewport.name}`);
    }
    if (!quoteText.includes("48-hour target")) {
      throw new Error(`Quote page missing delivery target in ${viewport.name}`);
    }
    const paymentPacketTarget = await page.locator("[data-copy-target='#payment-packet']").getAttribute("data-copy-target");
    if (paymentPacketTarget !== "#payment-packet") {
      throw new Error(`Quote page payment packet copy target missing in ${viewport.name}`);
    }
    const quoteOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (quoteOverflow) throw new Error(`Quote horizontal overflow detected in ${viewport.name}`);

    for (const verticalPage of [
      { url: trading, title: "Trading MCP Security Audit", marker: "order placement", name: "trading" },
      { url: workspace, title: "Workspace MCP Security Audit", marker: "workspace systems", name: "workspace" },
      { url: cloudDatabase, title: "Cloud and Database MCP Security Audit", marker: "production systems", name: "cloud-database" },
      { url: browserAutomation, title: "Browser Automation MCP Security Audit", marker: "authenticated browser sessions", name: "browser-automation" },
    ]) {
      await page.goto(verticalPage.url, { waitUntil: "networkidle" });
      const verticalTitle = await page.locator("h1").innerText();
      if (!verticalTitle.includes(verticalPage.title)) {
        throw new Error(`Unexpected ${verticalPage.name} h1 in ${viewport.name}: ${verticalTitle}`);
      }
      const verticalText = await page.locator("body").innerText();
      if (!verticalText.includes("USD $1,000") || !verticalText.includes(verticalPage.marker)) {
        throw new Error(`${verticalPage.name} page missing price or marker copy in ${viewport.name}`);
      }
      if (
        verticalPage.name === "browser-automation" &&
        (!verticalText.includes("browserbase/mcp-server-browserbase") ||
          !verticalText.includes("Read Browserbase sample") ||
          !verticalText.includes("Use Code Scanning"))
      ) {
        throw new Error(`Browser automation page missing Browserbase sample conversion path in ${viewport.name}`);
      }
      const verticalCta = await page.locator("a.button.primary").first().getAttribute("href");
      if (!verticalCta?.includes("audit-request.yml")) {
        throw new Error(`${verticalPage.name} CTA missing intake URL in ${viewport.name}`);
      }
      const verticalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      if (verticalOverflow) throw new Error(`${verticalPage.name} horizontal overflow detected in ${viewport.name}`);
    }

    await page.goto(samples, { waitUntil: "networkidle" });
    const samplesTitle = await page.locator("h1").innerText();
    if (!samplesTitle.includes("Sample Reports")) {
      throw new Error(`Unexpected samples h1 in ${viewport.name}: ${samplesTitle}`);
    }
    const samplesText = await page.locator("body").innerText();
    if (
      !samplesText.includes("douban-mcp") ||
      !samplesText.includes("firecrawl-mcp-server") ||
      !samplesText.includes("browserbase/mcp-server-browserbase") ||
      !samplesText.includes("jackjin1997/sentinel") ||
      !samplesText.includes("jackjin1997/agentgap")
    ) {
      throw new Error(`Samples page missing report names in ${viewport.name}`);
    }
    if (!samplesText.includes("5 real public repos")) {
      throw new Error(`Samples page missing updated sample count in ${viewport.name}`);
    }
    if (!samplesText.includes("automated triage clones the public repo")) {
      throw new Error(`Samples page missing automated triage flow in ${viewport.name}`);
    }
    const samplesCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!samplesCta?.includes("audit-request.yml")) {
      throw new Error(`Samples CTA missing intake URL in ${viewport.name}`);
    }
    const samplesOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (samplesOverflow) throw new Error(`Samples horizontal overflow detected in ${viewport.name}`);

    await page.goto(checklist, { waitUntil: "networkidle" });
    const checklistTitle = await page.locator("h1").innerText();
    if (!checklistTitle.includes("MCP Security Audit Checklist")) {
      throw new Error(`Unexpected checklist h1 in ${viewport.name}: ${checklistTitle}`);
    }
    const checklistCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!checklistCta?.includes("audit-request.yml")) {
      throw new Error(`Checklist CTA missing intake URL in ${viewport.name}`);
    }
    const checklistText = await page.locator("body").innerText();
    if (!checklistText.includes("automated no-execution scanner triage")) {
      throw new Error(`Checklist page missing automated triage copy in ${viewport.name}`);
    }
    const checklistOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (checklistOverflow) throw new Error(`Checklist horizontal overflow detected in ${viewport.name}`);

    await page.goto(terms, { waitUntil: "networkidle" });
    const termsTitle = await page.locator("h1").innerText();
    if (!termsTitle.includes("Terms")) throw new Error(`Unexpected terms h1 in ${viewport.name}: ${termsTitle}`);
    const termsBody = await page.locator("body").innerText();
    if (!termsBody.includes("invoice-first")) {
      throw new Error(`Terms page missing invoice-first payment path in ${viewport.name}`);
    }
    if (!termsBody.includes("ERC-20 USDC/USDT/DAI") || !termsBody.includes("SPL USDC")) {
      throw new Error(`Terms page missing stablecoin payment options in ${viewport.name}`);
    }
    if (!termsBody.includes("0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF")) {
      throw new Error(`Ethereum payment address missing from terms in ${viewport.name}`);
    }
    if (!termsBody.includes("5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM")) {
      throw new Error(`Solana payment address missing from terms in ${viewport.name}`);
    }
    const termsOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (termsOverflow) throw new Error(`Terms horizontal overflow detected in ${viewport.name}`);

    await page.close();
  }
  console.log("Site checks passed for desktop and mobile.");
} finally {
  await browser.close();
}
