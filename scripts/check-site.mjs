import { chromium } from "playwright";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const chromiumExecutablePath = process.env.SITE_CHECK_CHROMIUM_EXECUTABLE_PATH || "";
if (chromiumExecutablePath && !existsSync(chromiumExecutablePath)) {
  throw new Error(`SITE_CHECK_CHROMIUM_EXECUTABLE_PATH does not exist: ${chromiumExecutablePath}`);
}
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
const aiCostSpikeEmergency = `file://${resolve(root, "ai-cost-spike-emergency.html")}`;
const openRouterCostCalculator = `file://${resolve(root, "openrouter-cost-calculator.html")}`;
const aiAgentCostLeakReview = `file://${resolve(root, "ai-agent-cost-leak-review.html")}`;
const agentAuthReview = `file://${resolve(root, "agent-auth-security-review.html")}`;
const mcpSsrfReview = `file://${resolve(root, "mcp-ssrf-security-review.html")}`;
const aiAgentSecurityRadar = `file://${resolve(root, "ai-agent-security-radar.html")}`;
const service = `file://${resolve(root, "mcp-security-audit-service.html")}`;
const mcpServerScan = `file://${resolve(root, "mcp-server-security-scan.html")}`;
const mcpSecurityRadar = `file://${resolve(root, "mcp-security-radar.html")}`;
const mcpCodeScanning = `file://${resolve(root, "mcp-code-scanning-github-action.html")}`;
const scan = `file://${resolve(root, "scan.html")}`;
const quickScan = `file://${resolve(root, "quick-scan.html")}`;
const aiMusicGenerator = `file://${resolve(root, "ai-music-generator.html")}`;
const aiMusicSamples = `file://${resolve(root, "ai-music-samples.html")}`;
const aiJingle = `file://${resolve(root, "ai-jingle-generator.html")}`;
const aiJingleHookSketch = `file://${resolve(root, "ai-jingle-hook-sketch.html")}`;
const aiCommercialJingle = `file://${resolve(root, "ai-commercial-jingle-generator.html")}`;
const aiSaasLaunchVideoMusic = `file://${resolve(root, "ai-saas-launch-video-music.html")}`;
const aiProductVideoMusic = `file://${resolve(root, "ai-product-video-music.html")}`;
const aiShortFormAdMusic = `file://${resolve(root, "ai-short-form-ad-music.html")}`;
const ugcAgencyAiMusicHooks = `file://${resolve(root, "ugc-agency-ai-music-hooks.html")}`;
const aiRealEstateListingMusic = `file://${resolve(root, "ai-real-estate-listing-music.html")}`;
const aiWeddingVideoMusic = `file://${resolve(root, "ai-wedding-video-music.html")}`;
const aiPodcastIntro = `file://${resolve(root, "ai-podcast-intro-generator.html")}`;
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
  "ai-cost-spike-emergency.html",
  "openrouter-cost-calculator.html",
  "ai-agent-cost-leak-review.html",
  "agent-auth-security-review.html",
  "mcp-ssrf-security-review.html",
  "ai-agent-security-radar.html",
  "mcp-security-audit-service.html",
  "mcp-server-security-scan.html",
  "mcp-security-radar.html",
  "mcp-code-scanning-github-action.html",
  "scan.html",
  "quick-scan.html",
  "openrouter-cost-calculator.html",
  "ai-music-generator.html",
  "ai-music-samples.html",
  "ai-jingle-generator.html",
  "ai-jingle-hook-sketch.html",
  "ai-commercial-jingle-generator.html",
  "ai-saas-launch-video-music.html",
  "ai-product-video-music.html",
  "ai-short-form-ad-music.html",
  "ugc-agency-ai-music-hooks.html",
  "ai-real-estate-listing-music.html",
  "ai-wedding-video-music.html",
  "ai-podcast-intro-generator.html",
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
  ".github/ISSUE_TEMPLATE/ai-cost-spike-emergency.yml",
  ".github/ISSUE_TEMPLATE/agent-cost-leak-review.yml",
  ".github/ISSUE_TEMPLATE/agent-auth-review.yml",
  ".github/ISSUE_TEMPLATE/mcp-ssrf-review.yml",
  ".github/ISSUE_TEMPLATE/ai-jingle-order.yml",
  ".github/ISSUE_TEMPLATE/ai-saas-launch-video-music-order.yml",
  ".github/ISSUE_TEMPLATE/ai-product-video-music-order.yml",
  ".github/ISSUE_TEMPLATE/ugc-agency-music-hook-order.yml",
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
  "assets/audio/product-demo-hook.wav",
  "assets/audio/saas-launch-hero-hook.wav",
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
if (!llmsText.includes("AI Agent Cost Leak Review")) {
  throw new Error("llms.txt is missing the AI Agent Cost Leak review context");
}
if (!llmsText.includes("OpenRouter Cost Calculator")) {
  throw new Error("llms.txt is missing the OpenRouter Cost Calculator context");
}
if (!llmsText.includes("openrouter-cost-calculator.html")) {
  throw new Error("llms.txt is missing the OpenRouter Cost Calculator URL");
}
if (!llmsText.includes("AI Cost Spike Emergency Sprint")) {
  throw new Error("llms.txt is missing the AI Cost Spike Emergency Sprint context");
}
if (!llmsText.includes("USD $299 AI Agent Cost Leak Review")) {
  throw new Error("llms.txt is missing the AI Agent Cost Leak review package price");
}
if (!llmsText.includes("USD $1,000 AI Cost Spike Emergency Sprint")) {
  throw new Error("llms.txt is missing the AI Cost Spike Emergency Sprint package price");
}
if (!llmsText.includes("cache-read assumptions") || !llmsText.includes("tool-call fanout")) {
  throw new Error("llms.txt is missing the OpenRouter cost calculator routing context");
}
if (!llmsText.includes("ai-cost-spike-emergency.yml")) {
  throw new Error("llms.txt is missing the AI Cost Spike Emergency intake link");
}
if (!llmsText.includes("agent-cost-leak-review.yml")) {
  throw new Error("llms.txt is missing the AI Agent Cost Leak review intake link");
}
const costSpikeTemplate = readFileSync(resolve(root, ".github/ISSUE_TEMPLATE/ai-cost-spike-emergency.yml"), "utf8");
if (
  !costSpikeTemplate.includes("USD $1,000 AI Cost Spike Emergency Sprint") ||
  !costSpikeTemplate.includes("labels: [\"audit-intent\", \"ai-cost-spike-emergency\"]") ||
  !costSpikeTemplate.includes("Cost spike type") ||
  !costSpikeTemplate.includes("payment is only requested after written scope acceptance")
) {
  throw new Error("AI Cost Spike emergency template is missing price, label, cost-spike field, or payment guardrail");
}
if (!llmsText.includes("Agent Auth and Cookie Vault Security Review")) {
  throw new Error("llms.txt is missing the Agent Auth focused review context");
}
if (!llmsText.includes("USD $299 Agent Auth Focused Review")) {
  throw new Error("llms.txt is missing the Agent Auth focused review package price");
}
if (!llmsText.includes("agent-auth-review.yml")) {
  throw new Error("llms.txt is missing the Agent Auth focused review intake link");
}
if (!llmsText.includes("MCP SSRF and Dynamic URL Fetch Review")) {
  throw new Error("llms.txt is missing the MCP SSRF focused review context");
}
if (!llmsText.includes("USD $299 MCP SSRF Focused Review")) {
  throw new Error("llms.txt is missing the MCP SSRF focused review package price");
}
if (!llmsText.includes("mcp-ssrf-review.yml")) {
  throw new Error("llms.txt is missing the MCP SSRF focused review intake link");
}
if (!llmsText.includes("dynamic URL fetch") || !llmsText.includes("MCP SSRF")) {
  throw new Error("llms.txt is missing the MCP SSRF/dynamic URL fetch scanner context");
}
if (!llmsText.includes("AI Jingle Generator")) {
  throw new Error("llms.txt is missing the AI Jingle Generator offer context");
}
if (!llmsText.includes("AI Music Generator for Videos, Ads, and Podcasts")) {
  throw new Error("llms.txt is missing the AI Music Generator storefront context");
}
if (!llmsText.includes("AI Music Samples and Order Packets")) {
  throw new Error("llms.txt is missing the AI Music Samples and Order Packets page");
}
if (!llmsText.includes("ai-music-samples.html")) {
  throw new Error("llms.txt is missing the AI music samples page URL");
}
if (!llmsText.includes("USD $29 Founding Hook Sketch")) {
  throw new Error("llms.txt is missing the AI jingle first-sale package");
}
if (!llmsText.includes("AI Jingle $29 hook sketch")) {
  throw new Error("llms.txt is missing the AI Jingle $29 hook sketch page");
}
if (!llmsText.includes("AI Podcast Intro Generator")) {
  throw new Error("llms.txt is missing the AI Podcast Intro Generator page");
}
if (!llmsText.includes("AI Commercial Jingle Generator")) {
  throw new Error("llms.txt is missing the AI Commercial Jingle Generator page");
}
const aiJingleOrderTemplate = readFileSync(resolve(root, ".github/ISSUE_TEMPLATE/ai-jingle-order.yml"), "utf8");
if (
  !aiJingleOrderTemplate.includes("id: reference_sample") ||
  !aiJingleOrderTemplate.includes("Reference sample or direction") ||
  !aiJingleOrderTemplate.includes("SaaS Launch Hero Hook sample") ||
  !aiJingleOrderTemplate.includes("Coffee Shop 30s Hook sample") ||
  !aiJingleOrderTemplate.includes("Business Show Intro sample") ||
  !aiJingleOrderTemplate.includes("Radio ID And Drop sample") ||
  !aiJingleOrderTemplate.includes("Product Demo Hook sample")
) {
  throw new Error("AI jingle order template is missing the general reference sample selector");
}
if (!llmsText.includes("AI SaaS Launch Video Music Generator")) {
  throw new Error("llms.txt is missing the AI SaaS Launch Video Music Generator page");
}
if (!llmsText.includes("ai-saas-launch-video-music-order.yml")) {
  throw new Error("llms.txt is missing the AI SaaS launch video music order intake");
}
const saasLaunchOrderTemplate = readFileSync(resolve(root, ".github/ISSUE_TEMPLATE/ai-saas-launch-video-music-order.yml"), "utf8");
if (
  !saasLaunchOrderTemplate.includes("id: reference_sample") ||
  !saasLaunchOrderTemplate.includes("Reference sample or direction") ||
  !saasLaunchOrderTemplate.includes("SaaS Launch Hero Hook sample") ||
  !saasLaunchOrderTemplate.includes("Product Demo Hook sample") ||
  !saasLaunchOrderTemplate.includes("Product Hunt launch video") ||
  !saasLaunchOrderTemplate.includes("SaaS demo walkthrough")
) {
  throw new Error("AI SaaS launch video music order template is missing reference, Product Hunt, or demo fields");
}
if (!llmsText.includes("AI Product Video Music Generator")) {
  throw new Error("llms.txt is missing the AI Product Video Music Generator page");
}
if (!llmsText.includes("ai-product-video-music-order.yml")) {
  throw new Error("llms.txt is missing the AI product video music order intake");
}
const productVideoOrderTemplate = readFileSync(resolve(root, ".github/ISSUE_TEMPLATE/ai-product-video-music-order.yml"), "utf8");
if (
  !productVideoOrderTemplate.includes("id: reference_sample") ||
  !productVideoOrderTemplate.includes("Reference sample or direction") ||
  !productVideoOrderTemplate.includes("Product Demo Hook sample")
) {
  throw new Error("AI product video music order template is missing the reference sample selector");
}
if (!llmsText.includes("AI Short-Form Ad Music Generator")) {
  throw new Error("llms.txt is missing the AI Short-Form Ad Music Generator page");
}
if (!llmsText.includes("AI UGC Agency Music Hook Pack")) {
  throw new Error("llms.txt is missing the AI UGC Agency Music Hook Pack page");
}
if (!llmsText.includes("ugc-agency-music-hook-order.yml")) {
  throw new Error("llms.txt is missing the UGC agency music hook order intake");
}
if (!llmsText.includes("AI Real Estate Listing Music Generator")) {
  throw new Error("llms.txt is missing the AI Real Estate Listing Music Generator page");
}
if (!llmsText.includes("AI Wedding Video Music Generator")) {
  throw new Error("llms.txt is missing the AI Wedding Video Music Generator page");
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
if (!markdownOutput.includes("MCP SSRF Focused Review") || !markdownOutput.includes("mcp-ssrf-review.yml")) {
  throw new Error("Scanner Markdown output is missing MCP SSRF focused-review handoff");
}
if (!markdownOutput.includes("Agent Auth Focused Review") || !markdownOutput.includes("agent-auth-review.yml")) {
  throw new Error("Scanner Markdown output is missing Agent Auth focused-review handoff");
}
if (!markdownOutput.includes("Dynamic URL fetch or SSRF surface") || !markdownOutput.includes("SSRF-with-credentials boundary")) {
  throw new Error("Scanner Markdown output is missing MCP SSRF/dynamic URL fetch handoff");
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

const agentAuthIntentOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-audit-intent.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    INTENT_DRY_RUN: "true",
    ISSUE_BODY: [
      "### Requested package",
      "",
      "USD $299 Agent Auth Focused Review",
      "",
      "### Project or repo URL",
      "",
      "https://github.com/example/agent-auth-mcp",
      "",
      "### Auth flow type",
      "",
      "Token broker / RFC 8693 token exchange",
      "",
      "### Boundary to review",
      "",
      "gatewayExchange from MCP client to STS",
      "",
      "### Highest risk or decision",
      "",
      "subject/actor separation and metadata binding",
      "",
      "### Preferred contact",
      "",
      "reply in this issue",
      "",
      "### Timing",
      "",
      "Same day if available",
      "",
      "### Payment path",
      "",
      "Ethereum ERC-20 USDC/USDT/DAI after scope acceptance",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (!agentAuthIntentOutput.includes("USD $299 Agent Auth Focused Review")) {
  throw new Error("Agent Auth intent dry-run output is missing package name");
}
if (!agentAuthIntentOutput.includes("Token broker / RFC 8693 token exchange")) {
  throw new Error("Agent Auth intent dry-run output is missing auth flow type");
}
if (!agentAuthIntentOutput.includes("gatewayExchange from MCP client to STS")) {
  throw new Error("Agent Auth intent dry-run output is missing boundary");
}
if (!agentAuthIntentOutput.includes("subject/actor separation and metadata binding")) {
  throw new Error("Agent Auth intent dry-run output is missing highest-risk field");
}
if (!agentAuthIntentOutput.includes("agent-auth-security-review.html")) {
  throw new Error("Agent Auth intent dry-run output is missing Agent Auth service link");
}
if (!agentAuthIntentOutput.includes("Do not send payment until scope is accepted")) {
  throw new Error("Agent Auth intent dry-run output is missing payment guardrail");
}
if (!agentAuthIntentOutput.includes("payment-confirmation.yml")) {
  throw new Error("Agent Auth intent dry-run output is missing payment proof link");
}

const mcpSsrfIntentOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-audit-intent.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    INTENT_DRY_RUN: "true",
    ISSUE_BODY: [
      "### Requested package",
      "",
      "USD $299 MCP SSRF Focused Review",
      "",
      "### Project or repo URL",
      "",
      "https://github.com/example/agent-mcp",
      "",
      "### URL fetch boundary",
      "",
      "fetch_pagination_url / next_url",
      "",
      "### Credential or network context",
      "",
      "Bearer token can be attached to pagination fetches; no secrets included.",
      "",
      "### Highest risk or decision",
      "",
      "metadata IP, unsafe redirect, and credential stripping tests before launch",
      "",
      "### Preferred contact",
      "",
      "reply in this issue",
      "",
      "### Timing",
      "",
      "Same day if available",
      "",
      "### Payment path",
      "",
      "Ethereum ERC-20 USDC/USDT/DAI after scope acceptance",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (!mcpSsrfIntentOutput.includes("USD $299 MCP SSRF Focused Review")) {
  throw new Error("MCP SSRF intent dry-run output is missing package name");
}
if (!mcpSsrfIntentOutput.includes("fetch_pagination_url / next_url")) {
  throw new Error("MCP SSRF intent dry-run output is missing URL fetch boundary");
}
if (!mcpSsrfIntentOutput.includes("Bearer token can be attached to pagination fetches")) {
  throw new Error("MCP SSRF intent dry-run output is missing credential context");
}
if (!mcpSsrfIntentOutput.includes("mcp-ssrf-security-review.html")) {
  throw new Error("MCP SSRF intent dry-run output is missing MCP SSRF service link");
}
if (!mcpSsrfIntentOutput.includes("Do not send payment until scope is accepted")) {
  throw new Error("MCP SSRF intent dry-run output is missing payment guardrail");
}
if (!mcpSsrfIntentOutput.includes("payment-confirmation.yml")) {
  throw new Error("MCP SSRF intent dry-run output is missing payment proof link");
}

const costSpikeIntentOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-audit-intent.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    INTENT_DRY_RUN: "true",
    ISSUE_BODY: [
      "### Requested package",
      "",
      "USD $1,000 AI Cost Spike Emergency Sprint",
      "",
      "### Project, repo, product, or workflow URL",
      "",
      "https://github.com/example/runaway-agent",
      "",
      "### Cost spike type",
      "",
      "Runaway coding agent or repeated tool calls",
      "",
      "### Sanitized cost evidence",
      "",
      "Spend moved from $200/day to $900/day after agent launch; no private prompts included.",
      "",
      "### Emergency decision",
      "",
      "which caps, model routes, cache changes, retrieval limits, or kill switches can stop the bill spike this week",
      "",
      "### Deadline or billing risk window",
      "",
      "Within 24h",
      "",
      "### Preferred contact",
      "",
      "reply in this issue",
      "",
      "### Payment path",
      "",
      "Ethereum ERC-20 USDC/USDT/DAI after scope acceptance",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (!costSpikeIntentOutput.includes("USD $1,000 AI Cost Spike Emergency Sprint")) {
  throw new Error("AI Cost Spike emergency dry-run output is missing package name");
}
if (!costSpikeIntentOutput.includes("Runaway coding agent or repeated tool calls")) {
  throw new Error("AI Cost Spike emergency dry-run output is missing cost spike type");
}
if (!costSpikeIntentOutput.includes("Spend moved from $200/day to $900/day")) {
  throw new Error("AI Cost Spike emergency dry-run output is missing sanitized evidence");
}
if (!costSpikeIntentOutput.includes("Within 24h")) {
  throw new Error("AI Cost Spike emergency dry-run output is missing deadline");
}
if (!costSpikeIntentOutput.includes("ai-cost-spike-emergency.html")) {
  throw new Error("AI Cost Spike emergency dry-run output is missing service link");
}
if (!costSpikeIntentOutput.includes("Do not send payment until scope is accepted")) {
  throw new Error("AI Cost Spike emergency dry-run output is missing payment guardrail");
}
if (!costSpikeIntentOutput.includes("payment-confirmation.yml")) {
  throw new Error("AI Cost Spike emergency dry-run output is missing payment proof link");
}

const agentCostIntentOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-audit-intent.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    INTENT_DRY_RUN: "true",
    ISSUE_BODY: [
      "### Requested package",
      "",
      "USD $299 AI Agent Cost Leak Review",
      "",
      "### Project, repo, product, or workflow URL",
      "",
      "https://github.com/example/agent-cost-app",
      "",
      "### Cost boundary",
      "",
      "Coding agent loop / repeated tool calls",
      "",
      "### Sanitized usage evidence",
      "",
      "2,400 agent runs/week with repeated tool retries and long RAG context; no private prompts included.",
      "",
      "### Highest cost question",
      "",
      "whether prompt trimming, cache reuse, and model routing can cut spend before launch",
      "",
      "### Preferred contact",
      "",
      "reply in this issue",
      "",
      "### Timing",
      "",
      "Same day if available",
      "",
      "### Payment path",
      "",
      "Ethereum ERC-20 USDC/USDT/DAI after scope acceptance",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (!agentCostIntentOutput.includes("USD $299 AI Agent Cost Leak Review")) {
  throw new Error("AI Agent Cost Leak intent dry-run output is missing package name");
}
if (!agentCostIntentOutput.includes("Coding agent loop / repeated tool calls")) {
  throw new Error("AI Agent Cost Leak intent dry-run output is missing cost boundary");
}
if (!agentCostIntentOutput.includes("https://github.com/example/agent-cost-app")) {
  throw new Error("AI Agent Cost Leak intent dry-run output is missing project URL");
}
if (!agentCostIntentOutput.includes("2,400 agent runs/week with repeated tool retries")) {
  throw new Error("AI Agent Cost Leak intent dry-run output is missing usage evidence");
}
if (!agentCostIntentOutput.includes("ai-agent-cost-leak-review.html")) {
  throw new Error("AI Agent Cost Leak intent dry-run output is missing service link");
}
if (!agentCostIntentOutput.includes("Do not send payment until scope is accepted")) {
  throw new Error("AI Agent Cost Leak intent dry-run output is missing payment guardrail");
}
if (!agentCostIntentOutput.includes("payment-confirmation.yml")) {
  throw new Error("AI Agent Cost Leak intent dry-run output is missing payment proof link");
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
      "### Reference sample or direction",
      "",
      "Coffee Shop 30s Hook sample",
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
if (!jingleOrderOutput.includes("Reference sample or direction: **Coffee Shop 30s Hook sample**")) {
  throw new Error("AI jingle order dry-run output is missing the selected public reference sample");
}
if (
  !jingleOrderOutput.includes("Selected sample fast lane") ||
  !jingleOrderOutput.includes("assets/audio/coffee-shop-30s-hook.wav") ||
  !jingleOrderOutput.includes("ai-music-samples.html")
) {
  throw new Error("AI jingle order dry-run output is missing the public sample fast lane");
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

const genericSaasReferenceOrderOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-ai-jingle-order.mjs")], {
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
      "LaunchPad Lite",
      "",
      "### Website or social link",
      "",
      "https://example.com",
      "",
      "### Primary use",
      "",
      "15 second social ad",
      "",
      "### Reference sample or direction",
      "",
      "SaaS Launch Hero Hook sample",
      "",
      "### Brand brief",
      "",
      "SaaS launch demo hook for a Product Hunt teaser.",
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
      "Solana SPL USDC after brief acceptance",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (
  !genericSaasReferenceOrderOutput.includes("USD $29 SaaS Launch Video Music Hook Sketch") ||
  !genericSaasReferenceOrderOutput.includes("Reference sample or direction: **SaaS Launch Hero Hook sample**") ||
  !genericSaasReferenceOrderOutput.includes("assets/audio/saas-launch-hero-hook.wav") ||
  !genericSaasReferenceOrderOutput.includes("ai-saas-launch-video-music.html") ||
  !genericSaasReferenceOrderOutput.includes("ai-saas-launch-video-music-order.yml")
) {
  throw new Error("Generic AI jingle order dry-run did not route SaaS Launch Hero sample to the SaaS fast lane");
}

const ugcAgencyOrderOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-ai-jingle-order.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    JINGLE_ORDER_DRY_RUN: "true",
    ISSUE_BODY: [
      "### Requested package",
      "",
      "USD $29 UGC Agency Audio Hook Sketch",
      "",
      "### Agency or client project",
      "",
      "Launch Reel Client Test",
      "",
      "### Website, store, or creative brief link",
      "",
      "https://example.com",
      "",
      "### Primary use",
      "",
      "Client approval audio hook",
      "",
      "### Publishing channel",
      "",
      "Client approval only",
      "",
      "### Source material rights",
      "",
      "Original prompt only; no third-party lyrics or melodies",
      "",
      "### Target viewer and offer",
      "",
      "Ecommerce skincare buyers seeing a creator-led product demo and launch-week offer.",
      "",
      "### Required line or CTA",
      "",
      "Three steps, one brighter routine.",
      "",
      "### Visual pacing",
      "",
      "Product demo",
      "",
      "### Client approval need",
      "",
      "One direction",
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
      "Need invoice/discussion first",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (!ugcAgencyOrderOutput.includes("USD $29 UGC Agency Audio Hook Sketch")) {
  throw new Error("UGC agency order dry-run output is missing package name");
}
if (
  !ugcAgencyOrderOutput.includes("Launch Reel Client Test") ||
  !ugcAgencyOrderOutput.includes("Publishing channel: **Client approval only**") ||
  !ugcAgencyOrderOutput.includes("Source material rights: **Original prompt only; no third-party lyrics or melodies**") ||
  !ugcAgencyOrderOutput.includes("Client approval need: **One direction**")
) {
  throw new Error("UGC agency order dry-run output is missing agency project, channel, rights, or approval details");
}
if (
  !ugcAgencyOrderOutput.includes("ugc-agency-ai-music-hooks.html") ||
  !ugcAgencyOrderOutput.includes("payment-confirmation.yml") ||
  !ugcAgencyOrderOutput.includes("Please do not send payment until the brief/package is accepted in writing")
) {
  throw new Error("UGC agency order dry-run output is missing service, payment proof, or payment guardrail");
}

const productVideoOrderOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-ai-jingle-order.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    JINGLE_ORDER_DRY_RUN: "true",
    ISSUE_BODY: [
      "### Requested package",
      "",
      "USD $29 Product Video Music Hook Sketch",
      "",
      "### Product or store name",
      "",
      "BrightBottle Launch",
      "",
      "### Reference sample or direction",
      "",
      "Product Demo Hook sample",
      "",
      "### Store, product page, or creative brief link",
      "",
      "https://example.com/products/bottle",
      "",
      "### Primary use",
      "",
      "Shopify product page video",
      "",
      "### Publishing channel",
      "",
      "Shopify product page",
      "",
      "### Source material rights",
      "",
      "Original prompt only; no third-party lyrics or melodies",
      "",
      "### Product offer and target buyer",
      "",
      "Hydration bottle buyers watching a fast product demo and launch-week bundle offer.",
      "",
      "### Required CTA or product claim",
      "",
      "Hydrate smarter before the next refill.",
      "",
      "### Visual pacing",
      "",
      "Product demo",
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
      "Solana SPL USDC after brief acceptance",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (!productVideoOrderOutput.includes("USD $29 Product Video Music Hook Sketch")) {
  throw new Error("Product video order dry-run output is missing package name");
}
if (
  !productVideoOrderOutput.includes("BrightBottle Launch") ||
  !productVideoOrderOutput.includes("Reference sample or direction: **Product Demo Hook sample**") ||
  !productVideoOrderOutput.includes("Publishing channel: **Shopify product page**") ||
  !productVideoOrderOutput.includes("Source material rights: **Original prompt only; no third-party lyrics or melodies**") ||
  !productVideoOrderOutput.includes("Required CTA or product claim: **Hydrate smarter before the next refill.**")
) {
  throw new Error("Product video order dry-run output is missing product, sample, channel, rights, or CTA details");
}
if (
  !productVideoOrderOutput.includes("ai-product-video-music.html") ||
  !productVideoOrderOutput.includes("payment-confirmation.yml") ||
  !productVideoOrderOutput.includes("Please do not send payment until the brief/package is accepted in writing")
) {
  throw new Error("Product video order dry-run output is missing service, payment proof, or payment guardrail");
}

const saasLaunchOrderOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-ai-jingle-order.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    JINGLE_ORDER_DRY_RUN: "true",
    ISSUE_BODY: [
      "### Requested package",
      "",
      "USD $29 SaaS Launch Video Music Hook Sketch",
      "",
      "### Product, app, or SaaS name",
      "",
      "LaunchPad AI Demo",
      "",
      "### Reference sample or direction",
      "",
      "SaaS Launch Hero Hook sample",
      "",
      "### Landing page, demo, or launch brief link",
      "",
      "https://example.com/launch",
      "",
      "### Primary use",
      "",
      "Product Hunt launch video",
      "",
      "### Publishing channel",
      "",
      "Product Hunt launch page",
      "",
      "### Source material rights",
      "",
      "Original prompt only; no third-party lyrics or melodies",
      "",
      "### Product positioning and target user",
      "",
      "Indie founders launching an AI workflow product who need to understand the value in the first 10 seconds.",
      "",
      "### Required CTA or product claim",
      "",
      "Launch the demo, understand the workflow, ship with confidence.",
      "",
      "### Visual pacing",
      "",
      "Problem-solution demo",
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
      "Solana SPL USDC after brief acceptance",
    ].join("\n"),
  },
  maxBuffer: 1024 * 1024,
});
if (!saasLaunchOrderOutput.includes("USD $29 SaaS Launch Video Music Hook Sketch")) {
  throw new Error("SaaS launch video music order dry-run output is missing package name");
}
if (
  !saasLaunchOrderOutput.includes("LaunchPad AI Demo") ||
  !saasLaunchOrderOutput.includes("Reference sample or direction: **SaaS Launch Hero Hook sample**") ||
  !saasLaunchOrderOutput.includes("Publishing channel: **Product Hunt launch page**") ||
  !saasLaunchOrderOutput.includes("Source material rights: **Original prompt only; no third-party lyrics or melodies**") ||
  !saasLaunchOrderOutput.includes("Required CTA or product claim: **Launch the demo, understand the workflow, ship with confidence.**")
) {
  throw new Error("SaaS launch video music order dry-run output is missing project, sample, channel, rights, or CTA details");
}
if (
  !saasLaunchOrderOutput.includes("ai-saas-launch-video-music.html") ||
  !saasLaunchOrderOutput.includes("payment-confirmation.yml") ||
  !saasLaunchOrderOutput.includes("Please do not send payment until the brief/package is accepted in writing")
) {
  throw new Error("SaaS launch video music order dry-run output is missing service, payment proof, or payment guardrail");
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
      "### Accepted package or service",
      "",
      "USD $29 AI short-form or UGC hook sketch",
      "",
      "### Payment network",
      "",
      "Ethereum",
      "",
      "### Transaction hash or settlement reference",
      "",
      "0xabc123",
      "",
      "### Explorer or invoice URL",
      "",
      "https://etherscan.io/tx/0xabc123",
      "",
      "### Amount sent",
      "",
      "USD 29 equivalent",
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
  !paymentProofOutput.includes("USD $29 AI short-form or UGC hook sketch") ||
  !paymentProofOutput.includes("https://etherscan.io/tx/0xabc123") ||
  !paymentProofOutput.includes("USD $29/$79/$149/$399 AI music or jingle work") ||
  !paymentProofOutput.includes("USD $99/$299 audit entry work") ||
  !paymentProofOutput.includes("USD $1,000 full audit sprint")
) {
  throw new Error("Payment proof dry-run output is missing service, evidence URL, or package amount verification rule");
}
if (!paymentProofOutput.includes("ERC-20 USDC/USDT/DAI") || !paymentProofOutput.includes("SPL USDC")) {
  throw new Error("Payment proof dry-run output is missing stablecoin asset options");
}
if (!paymentProofOutput.includes("AI music/jingle receipt template") || !paymentProofOutput.includes("AI music/jingle delivery note template")) {
  throw new Error("Payment proof dry-run output is missing AI music receipt or delivery templates");
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

const browser = await chromium.launch(chromiumExecutablePath ? { executablePath: chromiumExecutablePath } : {});
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
    if (
      !indexBody.includes("AI Music Generator storefront for a $29 first order") ||
      !indexBody.includes("Open the AI Music Generator storefront") ||
      !indexBody.includes("Copy the $29 AI music brief") ||
      !indexBody.includes("Open SaaS launch video music page") ||
      !indexBody.includes("Open product video music page") ||
      !indexBody.includes("Open short-form ad music page") ||
      !indexBody.includes("Open UGC agency music hook page") ||
      !indexBody.includes("SaaS/Product Hunt launch videos, product videos, ads, Reels, Shorts, UGC videos") ||
      !indexBody.includes("Payment after written brief acceptance only")
    ) {
      throw new Error(`Index page missing AI music storefront promotion in ${viewport.name}`);
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
    if (
      !indexBody.includes("Cost spike emergency") ||
      !indexBody.includes("AI Cost Spike Emergency Sprint for runaway LLM bills") ||
      !indexBody.includes("Open the emergency intake")
    ) {
      throw new Error(`Index page missing AI Cost Spike emergency entry in ${viewport.name}`);
    }
    if (
      !indexBody.includes("OpenRouter cost calculator") ||
      !indexBody.includes("OpenRouter Cost Calculator for model spend triage") ||
      !indexBody.includes("Open the OpenRouter Cost Calculator") ||
      !indexBody.includes("cache-read assumptions, retry overhead, tool-call fanout")
    ) {
      throw new Error(`Index page missing OpenRouter cost calculator entry in ${viewport.name}`);
    }
    if (!indexBody.includes("Cost leak review") || !indexBody.includes("AI agent cost leak reviews")) {
      throw new Error(`Index page missing AI Agent Cost Leak focused review entry in ${viewport.name}`);
    }
    if (!indexBody.includes("Agent auth review") || !indexBody.includes("Agent auth and cookie vault reviews")) {
      throw new Error(`Index page missing Agent Auth focused review entry in ${viewport.name}`);
    }
    if (!indexBody.includes("MCP SSRF review") || !indexBody.includes("MCP SSRF focused reviews")) {
      throw new Error(`Index page missing MCP SSRF focused review entry in ${viewport.name}`);
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
    if (!indexBody.includes("Open the MCP SSRF focused review page")) {
      throw new Error(`Index page missing MCP SSRF focused review scanner link in ${viewport.name}`);
    }
    if (!indexBody.includes("Open the AI cost spike emergency page")) {
      throw new Error(`Index page missing AI Cost Spike emergency scanner link in ${viewport.name}`);
    }
    if (!indexBody.includes("Open the OpenRouter cost calculator")) {
      throw new Error(`Index page missing OpenRouter cost calculator scanner link in ${viewport.name}`);
    }
    if (!indexBody.includes("Open the AI agent cost leak review page")) {
      throw new Error(`Index page missing AI Agent Cost Leak review scanner link in ${viewport.name}`);
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
    const indexAiMusicLinks = await page.locator("a[href='ai-music-generator.html'], a[href='ai-music-generator.html#brief']").count();
    if (indexAiMusicLinks < 3) {
      throw new Error(`Index page missing AI music storefront links in ${viewport.name}`);
    }
    const indexAiMusicSamplesLinks = await page.locator("a[href='ai-music-samples.html']").count();
    if (indexAiMusicSamplesLinks < 2) {
      throw new Error(`Index page missing AI music samples page links in ${viewport.name}`);
    }
    const indexShortFormAdMusicLinks = await page.locator("a[href='ai-short-form-ad-music.html']").count();
    if (indexShortFormAdMusicLinks < 1) {
      throw new Error(`Index page missing short-form ad music page link in ${viewport.name}`);
    }
    const indexProductVideoMusicLinks = await page.locator("a[href='ai-product-video-music.html']").count();
    if (indexProductVideoMusicLinks < 1) {
      throw new Error(`Index page missing product video music page link in ${viewport.name}`);
    }
    const indexUgcAgencyMusicLinks = await page.locator("a[href='ugc-agency-ai-music-hooks.html']").count();
    if (indexUgcAgencyMusicLinks < 1) {
      throw new Error(`Index page missing UGC agency music hook page link in ${viewport.name}`);
    }

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
      !aiJingleText.includes("Open AI jingle order form") ||
      !aiJingleText.includes("AI music storefront")
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
    const aiJingleHookPageLinks = await page.locator("a[href='ai-jingle-hook-sketch.html']").count();
    if (aiJingleHookPageLinks < 2) {
      throw new Error(`AI jingle page missing focused $29 hook sketch links in ${viewport.name}`);
    }
    const aiJingleOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (aiJingleOverflow) throw new Error(`AI jingle horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiMusicGenerator, { waitUntil: "networkidle" });
    const aiMusicGeneratorTitle = await page.locator("h1").innerText();
    if (!aiMusicGeneratorTitle.includes("AI Music Generator for Videos, Ads, and Podcasts")) {
      throw new Error(`Unexpected AI music generator h1 in ${viewport.name}: ${aiMusicGeneratorTitle}`);
    }
    const aiMusicGeneratorText = await page.locator("body").innerText();
    if (
      !aiMusicGeneratorText.includes("USD $29 Founding Hook Sketch") ||
      !aiMusicGeneratorText.includes("Email AI music brief") ||
      !aiMusicGeneratorText.includes("Open order form") ||
      !aiMusicGeneratorText.includes("Generate an order-ready AI music prompt") ||
      !aiMusicGeneratorText.includes("Choose the fastest buyer path") ||
      !aiMusicGeneratorText.includes("Publishing channel") ||
      !aiMusicGeneratorText.includes("Source material rights") ||
      !aiMusicGeneratorText.includes("Copy usage memo") ||
      !aiMusicGeneratorText.includes("Payment is requested only after the written brief and package are accepted") ||
      !aiMusicGeneratorText.includes("SaaS Launch Video Music") ||
      !aiMusicGeneratorText.includes("Open SaaS launch page") ||
      !aiMusicGeneratorText.includes("Local Commercial Jingle") ||
      !aiMusicGeneratorText.includes("Product video music") ||
      !aiMusicGeneratorText.includes("Reels, Shorts, And UGC Ads") ||
      !aiMusicGeneratorText.includes("UGC Agency Client Approval Hooks") ||
      !aiMusicGeneratorText.includes("Short-form ad music") ||
      !aiMusicGeneratorText.includes("Real Estate Listing Music") ||
      !aiMusicGeneratorText.includes("Wedding Video Music") ||
      !aiMusicGeneratorText.includes("Podcast Intro") ||
      !aiMusicGeneratorText.includes("Podcast sponsor pack")
    ) {
      throw new Error(`AI music generator page missing package, router, payment, or CTA copy in ${viewport.name}`);
    }
    const aiMusicGeneratorHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!aiMusicGeneratorHeroLoaded) throw new Error(`AI music generator hero image failed to load in ${viewport.name}`);
    const aiMusicGeneratorAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      aiMusicGeneratorAudioSources.length !== 3 ||
      !aiMusicGeneratorAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !aiMusicGeneratorAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !aiMusicGeneratorAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`AI music generator sample audio sources missing in ${viewport.name}`);
    }
    const aiMusicGeneratorBrief = await page.locator("textarea[aria-label='AI music generator brief template']").inputValue();
    if (
      !aiMusicGeneratorBrief.includes("Package: USD $29 Founding Hook Sketch") ||
      !aiMusicGeneratorBrief.includes("Use case: SaaS launch video / Product Hunt launch video / local ad") ||
      !aiMusicGeneratorBrief.includes("Publishing channel: paid social / YouTube monetized video") ||
      !aiMusicGeneratorBrief.includes("Source material rights: original prompt only / buyer-owned tagline") ||
      !aiMusicGeneratorBrief.includes("Delivery: one selected short AI-assisted music sketch, production prompt, rough cut note, source/tool note, commercial-use memo") ||
      !aiMusicGeneratorBrief.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`AI music generator brief missing package, delivery, use-case, rights, channel, or payment copy in ${viewport.name}`);
    }
    const aiMusicGeneratorOrderLinks = await page.locator("a[href*='template=ai-jingle-order.yml']").count();
    if (aiMusicGeneratorOrderLinks < 1) {
      throw new Error(`AI music generator page missing order link in ${viewport.name}`);
    }
    await page.locator("[data-jingle-form] [name='brand']").fill("Quick Fit Studio");
    await page.locator("[data-jingle-form] [name='audience']").fill(
      "Busy local customers who need a short memorable cue for a paid social video."
    );
    await page.locator("[data-jingle-form] [name='tagline']").fill("Make the first five seconds count.");
    await page.locator("[data-jingle-form]").evaluate((form) => form.requestSubmit());
    const aiMusicGeneratedPacket = await page.locator("[data-jingle-output]").inputValue();
    if (
      !aiMusicGeneratedPacket.includes("## AI music generator brief") ||
      !aiMusicGeneratedPacket.includes("Quick Fit Studio") ||
      !aiMusicGeneratedPacket.includes("USD $29 Founding Hook Sketch") ||
      !aiMusicGeneratedPacket.includes("Publishing channel: Paid social ad or pre-roll") ||
      !aiMusicGeneratedPacket.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !aiMusicGeneratedPacket.includes("## Production prompt") ||
      !aiMusicGeneratedPacket.includes("Payment timing: after written brief acceptance only") ||
      !aiMusicGeneratedPacket.includes("Payment is requested only after the brief and package are accepted in writing")
    ) {
      throw new Error(`AI music generator dynamic packet missing brand, prompt, or payment guardrail in ${viewport.name}`);
    }
    const aiMusicGeneratedOrderHref = await page.locator("[data-open-jingle-brief]").getAttribute("href");
    if (!aiMusicGeneratedOrderHref?.includes("template=ai-jingle-order.yml")) {
      throw new Error(`AI music generator dynamic order link missing order template in ${viewport.name}`);
    }
    if (!decodeURIComponent(aiMusicGeneratedOrderHref).includes("AI music brief: Quick Fit Studio")) {
      throw new Error(`AI music generator dynamic order link missing brand title in ${viewport.name}`);
    }
    const aiMusicAcceptancePacket = await page.locator("[data-jingle-acceptance-output]").inputValue();
    if (
      !aiMusicAcceptancePacket.includes("## Acceptance and payment handoff") ||
      !aiMusicAcceptancePacket.includes("Use this only after the written brief and selected package are accepted") ||
      !aiMusicAcceptancePacket.includes("Amount: USD $29 equivalent") ||
      !aiMusicAcceptancePacket.includes("I accept the USD $29 Founding Hook Sketch for Quick Fit Studio") ||
      !aiMusicAcceptancePacket.includes("Publishing channel: Paid social ad or pre-roll") ||
      !aiMusicAcceptancePacket.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !aiMusicAcceptancePacket.includes("Payment timing: after written brief acceptance only") ||
      !aiMusicAcceptancePacket.includes("0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF") ||
      !aiMusicAcceptancePacket.includes("5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM") ||
      !aiMusicAcceptancePacket.includes("payment-confirmation.yml")
    ) {
      throw new Error(`AI music generator acceptance packet missing amount, acceptance, payment, or guardrail copy in ${viewport.name}`);
    }
    const aiMusicAcceptanceEmailHref = decodeURIComponent(
      (await page.locator("[data-email-jingle-acceptance]").getAttribute("href")) || ""
    );
    if (
      !aiMusicAcceptanceEmailHref.includes("AI music generator brief accepted package: Quick Fit Studio") ||
      !aiMusicAcceptanceEmailHref.includes("## Acceptance and payment handoff") ||
      !aiMusicAcceptanceEmailHref.includes("Amount: USD $29 equivalent") ||
      !aiMusicAcceptanceEmailHref.includes("Payment timing: after written brief acceptance only") ||
      !aiMusicAcceptanceEmailHref.includes("0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF") ||
      !aiMusicAcceptanceEmailHref.includes("payment-confirmation.yml")
    ) {
      throw new Error(`AI music generator acceptance email missing subject, amount, payment, or guardrail copy in ${viewport.name}`);
    }
    const aiMusicCommercialMemo = await page.locator("[data-jingle-commercial-output]").inputValue();
    if (
      !aiMusicCommercialMemo.includes("## Commercial-use music memo") ||
      !aiMusicCommercialMemo.includes("This is an order memo and usage record, not legal clearance") ||
      !aiMusicCommercialMemo.includes("Publishing channel: Paid social ad or pre-roll") ||
      !aiMusicCommercialMemo.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !aiMusicCommercialMemo.includes("Source tool and plan/tier note recorded") ||
      !aiMusicCommercialMemo.includes("No claim that fully AI-generated music is copyright-registerable") ||
      !aiMusicCommercialMemo.includes("Paid delivery starts only after the written brief")
    ) {
      throw new Error(`AI music generator commercial-use memo missing channel, source, legal, or start-rule copy in ${viewport.name}`);
    }
    const aiMusicCommercialMemoEmailHref = decodeURIComponent(
      (await page.locator("[data-email-jingle-commercial-memo]").getAttribute("href")) || ""
    );
    if (
      !aiMusicCommercialMemoEmailHref.includes("AI music generator brief commercial-use memo: Quick Fit Studio") ||
      !aiMusicCommercialMemoEmailHref.includes("## Commercial-use music memo") ||
      !aiMusicCommercialMemoEmailHref.includes("Publishing channel: Paid social ad or pre-roll") ||
      !aiMusicCommercialMemoEmailHref.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !aiMusicCommercialMemoEmailHref.includes("not legal clearance")
    ) {
      throw new Error(`AI music generator commercial-use memo email missing subject, channel, source, or legal copy in ${viewport.name}`);
    }
    const aiMusicSketchStatus = await page.locator("[data-jingle-sketch-status]").innerText();
    if (!aiMusicSketchStatus.includes("Browser sketch ready") || !aiMusicSketchStatus.includes("Paid delivery uses selected AI-assisted generations")) {
      throw new Error(`AI music generator sketch status missing ready or paid-delivery copy in ${viewport.name}`);
    }
    const aiMusicSketchHref = await page.locator("[data-download-jingle-sketch]").getAttribute("href");
    if (!aiMusicSketchHref?.startsWith("blob:")) {
      throw new Error(`AI music generator WAV sketch link was not generated in ${viewport.name}`);
    }
    const aiMusicGeneratorEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']:not([data-email-jingle-acceptance]):not([data-email-jingle-commercial-memo])").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      aiMusicGeneratorEmailLinks.length < 2 ||
      !aiMusicGeneratorEmailLinks.every((href) => href.includes("AI music generator brief")) ||
      !aiMusicGeneratorEmailLinks.every((href) => href.includes("USD $29 Founding Hook Sketch")) ||
      !aiMusicGeneratorEmailLinks.every((href) => href.includes("Publishing channel")) ||
      !aiMusicGeneratorEmailLinks.every((href) => href.includes("Source material rights")) ||
      !aiMusicGeneratorEmailLinks.every((href) => href.includes("Payment timing: after written brief acceptance only"))
    ) {
      throw new Error(`AI music generator page missing email brief link, channel/source rights, or payment guardrail in ${viewport.name}`);
    }
    const aiMusicGeneratorOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (aiMusicGeneratorOverflow) throw new Error(`AI music generator horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiMusicSamples, { waitUntil: "networkidle" });
    const aiMusicSamplesTitle = await page.locator("h1").innerText();
    if (!aiMusicSamplesTitle.includes("AI Music Samples and Order Packets")) {
      throw new Error(`Unexpected AI music samples h1 in ${viewport.name}: ${aiMusicSamplesTitle}`);
    }
    const aiMusicSamplesText = await page.locator("body").innerText();
    if (
      !aiMusicSamplesText.includes("USD $29 hook sketch") ||
      !aiMusicSamplesText.includes("SaaS Launch Hero Hook Packet") ||
      !aiMusicSamplesText.includes("Product Demo Hook Packet") ||
      !aiMusicSamplesText.includes("Coffee Shop Hook Packet") ||
      !aiMusicSamplesText.includes("Business Show Intro Packet") ||
      !aiMusicSamplesText.includes("Radio ID And Drop Packet") ||
      !aiMusicSamplesText.includes("Payment timing: after written brief acceptance only") ||
      !aiMusicSamplesText.includes("Submit payment proof after acceptance") ||
      !aiMusicSamplesText.includes("ETH or ERC-20 USDC/USDT/DAI only after the written brief") ||
      !aiMusicSamplesText.includes("SOL or SPL USDC only after the written brief") ||
      !aiMusicSamplesText.includes("0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF") ||
      !aiMusicSamplesText.includes("5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM")
    ) {
      throw new Error(`AI music samples page missing package, sample packet, payment address, or proof copy in ${viewport.name}`);
    }
    const aiMusicSamplesHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!aiMusicSamplesHeroLoaded) throw new Error(`AI music samples hero image failed to load in ${viewport.name}`);
    const aiMusicSamplesAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      aiMusicSamplesAudioSources.length !== 5 ||
      !aiMusicSamplesAudioSources.includes("assets/audio/saas-launch-hero-hook.wav") ||
      !aiMusicSamplesAudioSources.includes("assets/audio/product-demo-hook.wav") ||
      !aiMusicSamplesAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !aiMusicSamplesAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !aiMusicSamplesAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`AI music samples page audio sources missing in ${viewport.name}`);
    }
    const aiMusicSamplePacketIds = [
      "#sample-packet-saas-launch",
      "#sample-packet-product-demo",
      "#sample-packet-coffee-shop",
      "#sample-packet-business-show",
      "#sample-packet-radio-id",
    ];
    for (const packetId of aiMusicSamplePacketIds) {
      const packetText = await page.locator(packetId).innerText();
      if (
        !packetText.includes("Reference sample:") ||
        !packetText.includes("Sample URL: https://jackjin1997.github.io/agent-audit-sprint/assets/audio/") ||
        !packetText.includes("Source material rights:") ||
        !packetText.includes("Payment timing: after written brief acceptance only")
      ) {
        throw new Error(`AI music samples packet ${packetId} missing reference, source, rights, or payment copy in ${viewport.name}`);
      }
      const copyTarget = await page.locator(`[data-copy-target='${packetId}']`).getAttribute("data-copy-target");
      if (copyTarget !== packetId) {
        throw new Error(`AI music samples packet ${packetId} copy target missing in ${viewport.name}`);
      }
      const emailHref = await page.locator(`[data-mailto-target='${packetId}']`).getAttribute("href");
      if (
        !emailHref?.startsWith("mailto:jackjin1997@gmail.com") ||
        !decodeURIComponent(emailHref).includes("Reference sample:") ||
        !decodeURIComponent(emailHref).includes("Payment timing: after written brief acceptance only")
      ) {
        throw new Error(`AI music samples packet ${packetId} email handoff missing reference or payment copy in ${viewport.name}`);
      }
    }
    const aiMusicSamplesProductOrderHref = await page.locator("a[href*='Product%20Demo%20Hook%20reference']").getAttribute("href");
    if (!aiMusicSamplesProductOrderHref?.includes("template=ai-product-video-music-order.yml")) {
      throw new Error(`AI music samples product order link missing product-video template in ${viewport.name}`);
    }
    const aiMusicSamplesSaasOrderHref = await page.locator("a[href*='SaaS%20Launch%20Hero%20Hook%20reference']").getAttribute("href");
    if (!aiMusicSamplesSaasOrderHref?.includes("template=ai-saas-launch-video-music-order.yml")) {
      throw new Error(`AI music samples SaaS order link missing SaaS launch template in ${viewport.name}`);
    }
    const aiMusicSamplesGeneralOrderLinks = await page.locator("a[href*='template=ai-jingle-order.yml']").count();
    if (aiMusicSamplesGeneralOrderLinks < 4) {
      throw new Error(`AI music samples page missing general AI music order links in ${viewport.name}`);
    }
    const aiMusicSamplesOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (aiMusicSamplesOverflow) throw new Error(`AI music samples horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiSaasLaunchVideoMusic, { waitUntil: "networkidle" });
    const saasLaunchTitle = await page.locator("h1").innerText();
    if (!saasLaunchTitle.includes("AI SaaS Launch Video Music Generator")) {
      throw new Error(`Unexpected AI SaaS launch video music h1 in ${viewport.name}: ${saasLaunchTitle}`);
    }
    const saasLaunchText = await page.locator("body").innerText();
    if (
      !saasLaunchText.includes("USD $29 SaaS Launch Video Music Hook Sketch") ||
      !saasLaunchText.includes("Product Hunt launch videos") ||
      !saasLaunchText.includes("SaaS demo walkthroughs") ||
      !saasLaunchText.includes("Generate launch packet") ||
      !saasLaunchText.includes("Email launch brief") ||
      !saasLaunchText.includes("Open SaaS launch order") ||
      !saasLaunchText.includes("Source material rights") ||
      !saasLaunchText.includes("commercial-use memo") ||
      !saasLaunchText.includes("Payment is requested only after the written brief and package are accepted") ||
      !saasLaunchText.includes("source/tool note") ||
      !saasLaunchText.includes("AI music storefront")
    ) {
      throw new Error(`AI SaaS launch video music page missing package, launch fit, payment, rights, or CTA copy in ${viewport.name}`);
    }
    const saasLaunchHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!saasLaunchHeroLoaded) throw new Error(`AI SaaS launch video music hero image failed to load in ${viewport.name}`);
    const saasLaunchAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      saasLaunchAudioSources.length !== 5 ||
      !saasLaunchAudioSources.includes("assets/audio/saas-launch-hero-hook.wav") ||
      !saasLaunchAudioSources.includes("assets/audio/product-demo-hook.wav") ||
      !saasLaunchAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !saasLaunchAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !saasLaunchAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`AI SaaS launch video music sample audio sources missing in ${viewport.name}`);
    }
    const saasLaunchSamplePacket = await page.locator("#saas-launch-sample-order-packet").innerText();
    if (
      !saasLaunchSamplePacket.includes("Package: USD $29 SaaS Launch Video Music Hook Sketch") ||
      !saasLaunchSamplePacket.includes("Sample direction: SaaS Launch Hero Hook") ||
      !saasLaunchSamplePacket.includes("assets/audio/saas-launch-hero-hook.wav") ||
      !saasLaunchSamplePacket.includes("Delivery: one selected 6-15 second SaaS launch video music hook sketch") ||
      !saasLaunchSamplePacket.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`AI SaaS launch video music sample-to-order packet missing sample, delivery, or payment copy in ${viewport.name}`);
    }
    const saasLaunchSampleCopyTarget = await page
      .locator("[data-copy-target='#saas-launch-sample-order-packet']")
      .getAttribute("data-copy-target");
    if (saasLaunchSampleCopyTarget !== "#saas-launch-sample-order-packet") {
      throw new Error(`AI SaaS launch video music sample packet copy target missing in ${viewport.name}`);
    }
    const saasLaunchSampleOrderHref = await page.locator("a[href*='SaaS%20Launch%20Hero%20Hook%20reference']").getAttribute("href");
    if (!saasLaunchSampleOrderHref?.includes("template=ai-saas-launch-video-music-order.yml")) {
      throw new Error(`AI SaaS launch video music sample-based order link missing SaaS launch order template in ${viewport.name}`);
    }
    await page.locator("[data-jingle-form] [name='brand']").fill("LaunchPad AI Demo");
    await page.locator("[data-jingle-form] [name='audience']").fill(
      "Indie founders launching an AI workflow product who need to understand the value in the first 10 seconds."
    );
    await page.locator("[data-jingle-form] [name='tagline']").fill(
      "Launch the demo, understand the workflow, ship with confidence."
    );
    await page.locator("[data-jingle-form]").evaluate((form) => form.requestSubmit());
    const saasLaunchGeneratedPacket = await page.locator("[data-jingle-output]").inputValue();
    if (
      !saasLaunchGeneratedPacket.includes("## AI SaaS launch video music brief") ||
      !saasLaunchGeneratedPacket.includes("LaunchPad AI Demo") ||
      !saasLaunchGeneratedPacket.includes("USD $29 SaaS Launch Video Music Hook Sketch") ||
      !saasLaunchGeneratedPacket.includes("Primary use: Product Hunt launch video") ||
      !saasLaunchGeneratedPacket.includes("Publishing channel: Product Hunt launch page") ||
      !saasLaunchGeneratedPacket.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !saasLaunchGeneratedPacket.includes("## Production prompt") ||
      !saasLaunchGeneratedPacket.includes("Payment timing: after written brief acceptance only") ||
      !saasLaunchGeneratedPacket.includes("Payment is requested only after the brief and package are accepted in writing")
    ) {
      throw new Error(`AI SaaS launch video music dynamic packet missing project, channel, rights, prompt, or payment guardrail in ${viewport.name}`);
    }
    const saasLaunchGeneratedOrderHref = await page.locator("[data-open-jingle-brief]").getAttribute("href");
    if (!saasLaunchGeneratedOrderHref?.includes("template=ai-saas-launch-video-music-order.yml")) {
      throw new Error(`AI SaaS launch video music dynamic order link missing SaaS launch order template in ${viewport.name}`);
    }
    if (!saasLaunchGeneratedOrderHref.includes("labels=ai-jingle-order%2Cai-saas-launch-video-music-order")) {
      throw new Error(`AI SaaS launch video music dynamic order link missing SaaS launch order labels in ${viewport.name}`);
    }
    if (!decodeURIComponent(saasLaunchGeneratedOrderHref).includes("AI SaaS launch video music order: LaunchPad AI Demo")) {
      throw new Error(`AI SaaS launch video music dynamic order link missing project title in ${viewport.name}`);
    }
    const saasLaunchAcceptancePacket = await page.locator("[data-jingle-acceptance-output]").inputValue();
    if (
      !saasLaunchAcceptancePacket.includes("## Acceptance and payment handoff") ||
      !saasLaunchAcceptancePacket.includes("Amount: USD $29 equivalent") ||
      !saasLaunchAcceptancePacket.includes("I accept the USD $29 SaaS Launch Video Music Hook Sketch for LaunchPad AI Demo") ||
      !saasLaunchAcceptancePacket.includes("Publishing channel: Product Hunt launch page") ||
      !saasLaunchAcceptancePacket.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !saasLaunchAcceptancePacket.includes("Payment timing: after written brief acceptance only") ||
      !saasLaunchAcceptancePacket.includes("Payment proof service field: USD $29 SaaS Launch Video Music Hook Sketch") ||
      !saasLaunchAcceptancePacket.includes("payment-confirmation.yml")
    ) {
      throw new Error(`AI SaaS launch video music acceptance packet missing amount, acceptance, payment, or guardrail copy in ${viewport.name}`);
    }
    const saasLaunchCommercialMemo = await page.locator("[data-jingle-commercial-output]").inputValue();
    if (
      !saasLaunchCommercialMemo.includes("## Commercial-use music memo") ||
      !saasLaunchCommercialMemo.includes("Project: LaunchPad AI Demo") ||
      !saasLaunchCommercialMemo.includes("This is an order memo and usage record, not legal clearance") ||
      !saasLaunchCommercialMemo.includes("Publishing channel: Product Hunt launch page") ||
      !saasLaunchCommercialMemo.includes("Source tool and plan/tier note recorded") ||
      !saasLaunchCommercialMemo.includes("Paid delivery starts only after the written brief")
    ) {
      throw new Error(`AI SaaS launch video music usage memo missing project, channel, source note, legal, or start-rule copy in ${viewport.name}`);
    }
    const saasLaunchSketchHref = await page.locator("[data-download-jingle-sketch]").getAttribute("href");
    if (!saasLaunchSketchHref?.startsWith("blob:")) {
      throw new Error(`AI SaaS launch video music WAV sketch link was not generated in ${viewport.name}`);
    }
    const saasLaunchBrief = await page.locator("textarea[aria-label='AI SaaS launch video music brief template']").inputValue();
    if (
      !saasLaunchBrief.includes("Package: USD $29 SaaS Launch Video Music Hook Sketch") ||
      !saasLaunchBrief.includes("Primary use: Product Hunt launch video") ||
      !saasLaunchBrief.includes("Publishing channel: Product Hunt launch page") ||
      !saasLaunchBrief.includes("Source material rights: original prompt only") ||
      !saasLaunchBrief.includes("Delivery: one selected 6-15 second SaaS launch video music hook sketch") ||
      !saasLaunchBrief.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`AI SaaS launch video music brief missing package, delivery, rights, channel, or payment copy in ${viewport.name}`);
    }
    const saasLaunchOrderLinks = await page.locator("a[href*='template=ai-saas-launch-video-music-order.yml']").count();
    if (saasLaunchOrderLinks < 2) {
      throw new Error(`AI SaaS launch video music page missing dedicated SaaS launch order links in ${viewport.name}`);
    }
    const saasLaunchPaymentProofLinks = await page.locator("a[href*='template=payment-confirmation.yml']").count();
    if (saasLaunchPaymentProofLinks < 2) {
      throw new Error(`AI SaaS launch video music page missing payment proof links in ${viewport.name}`);
    }
    const saasLaunchEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      saasLaunchEmailLinks.length < 4 ||
      !saasLaunchEmailLinks.every((href) => href.includes("AI SaaS launch video music brief")) ||
      !saasLaunchEmailLinks.every((href) => href.includes("USD $29 SaaS Launch Video Music Hook Sketch")) ||
      !saasLaunchEmailLinks.every((href) => href.includes("Payment timing: after written brief acceptance only"))
    ) {
      throw new Error(`AI SaaS launch video music page missing email brief link or payment guardrail in ${viewport.name}`);
    }
    const saasLaunchOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (saasLaunchOverflow) throw new Error(`AI SaaS launch video music horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiProductVideoMusic, { waitUntil: "networkidle" });
    const productVideoTitle = await page.locator("h1").innerText();
    if (!productVideoTitle.includes("AI Product Video Music Generator")) {
      throw new Error(`Unexpected AI product video music h1 in ${viewport.name}: ${productVideoTitle}`);
    }
    const productVideoText = await page.locator("body").innerText();
    if (
      !productVideoText.includes("USD $29 Product Video Music Hook Sketch") ||
      !productVideoText.includes("Email product brief") ||
      !productVideoText.includes("Open product video order") ||
      !productVideoText.includes("Generate a product video music order packet") ||
      !productVideoText.includes("Generate product packet") ||
      !productVideoText.includes("SAMPLE-TO-ORDER FAST LANE") ||
      !productVideoText.includes("Use Product Demo Hook as the paid brief reference") ||
      !productVideoText.includes("Copy sample packet") ||
      !productVideoText.includes("Open sample-based order") ||
      !productVideoText.includes("Shopify") ||
      !productVideoText.includes("TikTok Shop") ||
      !productVideoText.includes("Meta ad creative") ||
      !productVideoText.includes("Amazon listing video") ||
      !productVideoText.includes("Source material rights") ||
      !productVideoText.includes("commercial-use memo") ||
      !productVideoText.includes("Payment is requested only after the written brief and package are accepted") ||
      !productVideoText.includes("source/tool note") ||
      !productVideoText.includes("AI music storefront")
    ) {
      throw new Error(`AI product video music page missing package, ecommerce fit, payment, rights, or CTA copy in ${viewport.name}`);
    }
    const productVideoHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!productVideoHeroLoaded) throw new Error(`AI product video music hero image failed to load in ${viewport.name}`);
    const productVideoAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      productVideoAudioSources.length !== 4 ||
      !productVideoAudioSources.includes("assets/audio/product-demo-hook.wav") ||
      !productVideoAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !productVideoAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !productVideoAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`AI product video music sample audio sources missing in ${viewport.name}`);
    }
    const productVideoSamplePacket = await page.locator("#product-video-sample-order-packet").innerText();
    if (
      !productVideoSamplePacket.includes("Package: USD $29 Product Video Music Hook Sketch") ||
      !productVideoSamplePacket.includes("Sample direction: Product Demo Hook") ||
      !productVideoSamplePacket.includes("assets/audio/product-demo-hook.wav") ||
      !productVideoSamplePacket.includes("Delivery: one selected 6-15 second product video music hook sketch") ||
      !productVideoSamplePacket.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`AI product video music sample-to-order packet missing sample, delivery, or payment copy in ${viewport.name}`);
    }
    const productVideoSampleCopyTarget = await page
      .locator("[data-copy-target='#product-video-sample-order-packet']")
      .getAttribute("data-copy-target");
    if (productVideoSampleCopyTarget !== "#product-video-sample-order-packet") {
      throw new Error(`AI product video music sample packet copy target missing in ${viewport.name}`);
    }
    const productVideoSampleOrderHref = await page.locator("a[href*='Product%20Demo%20Hook%20reference']").getAttribute("href");
    if (!productVideoSampleOrderHref?.includes("template=ai-product-video-music-order.yml")) {
      throw new Error(`AI product video music sample-based order link missing product order template in ${viewport.name}`);
    }
    await page.locator("[data-jingle-form] [name='brand']").fill("BrightBottle Launch");
    await page.locator("[data-jingle-form] [name='audience']").fill(
      "Hydration bottle buyers watching a fast product demo and launch-week bundle offer."
    );
    await page.locator("[data-jingle-form] [name='tagline']").fill("Hydrate smarter before the next refill.");
    await page.locator("[data-jingle-form]").evaluate((form) => form.requestSubmit());
    const productVideoGeneratedPacket = await page.locator("[data-jingle-output]").inputValue();
    if (
      !productVideoGeneratedPacket.includes("## AI product video music brief") ||
      !productVideoGeneratedPacket.includes("BrightBottle Launch") ||
      !productVideoGeneratedPacket.includes("USD $29 Product Video Music Hook Sketch") ||
      !productVideoGeneratedPacket.includes("Primary use: Shopify product page video") ||
      !productVideoGeneratedPacket.includes("Publishing channel: Shopify product page") ||
      !productVideoGeneratedPacket.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !productVideoGeneratedPacket.includes("## Production prompt") ||
      !productVideoGeneratedPacket.includes("Payment timing: after written brief acceptance only") ||
      !productVideoGeneratedPacket.includes("Payment is requested only after the brief and package are accepted in writing")
    ) {
      throw new Error(`AI product video music dynamic packet missing product, channel, rights, prompt, or payment guardrail in ${viewport.name}`);
    }
    const productVideoGeneratedOrderHref = await page.locator("[data-open-jingle-brief]").getAttribute("href");
    if (!productVideoGeneratedOrderHref?.includes("template=ai-product-video-music-order.yml")) {
      throw new Error(`AI product video music dynamic order link missing product order template in ${viewport.name}`);
    }
    if (!productVideoGeneratedOrderHref.includes("labels=ai-jingle-order%2Cai-product-video-music-order")) {
      throw new Error(`AI product video music dynamic order link missing product order labels in ${viewport.name}`);
    }
    if (!decodeURIComponent(productVideoGeneratedOrderHref).includes("AI product video music order: BrightBottle Launch")) {
      throw new Error(`AI product video music dynamic order link missing project title in ${viewport.name}`);
    }
    const productVideoAcceptancePacket = await page.locator("[data-jingle-acceptance-output]").inputValue();
    if (
      !productVideoAcceptancePacket.includes("## Acceptance and payment handoff") ||
      !productVideoAcceptancePacket.includes("Amount: USD $29 equivalent") ||
      !productVideoAcceptancePacket.includes("I accept the USD $29 Product Video Music Hook Sketch for BrightBottle Launch") ||
      !productVideoAcceptancePacket.includes("Publishing channel: Shopify product page") ||
      !productVideoAcceptancePacket.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !productVideoAcceptancePacket.includes("Payment timing: after written brief acceptance only") ||
      !productVideoAcceptancePacket.includes("Payment proof service field: USD $29 Product Video Music Hook Sketch") ||
      !productVideoAcceptancePacket.includes("payment-confirmation.yml")
    ) {
      throw new Error(`AI product video music acceptance packet missing amount, acceptance, payment, or guardrail copy in ${viewport.name}`);
    }
    const productVideoCommercialMemo = await page.locator("[data-jingle-commercial-output]").inputValue();
    if (
      !productVideoCommercialMemo.includes("## Commercial-use music memo") ||
      !productVideoCommercialMemo.includes("Project: BrightBottle Launch") ||
      !productVideoCommercialMemo.includes("This is an order memo and usage record, not legal clearance") ||
      !productVideoCommercialMemo.includes("Publishing channel: Shopify product page") ||
      !productVideoCommercialMemo.includes("Source tool and plan/tier note recorded") ||
      !productVideoCommercialMemo.includes("Paid delivery starts only after the written brief")
    ) {
      throw new Error(`AI product video music usage memo missing project, channel, source note, legal, or start-rule copy in ${viewport.name}`);
    }
    const productVideoSketchHref = await page.locator("[data-download-jingle-sketch]").getAttribute("href");
    if (!productVideoSketchHref?.startsWith("blob:")) {
      throw new Error(`AI product video music WAV sketch link was not generated in ${viewport.name}`);
    }
    const productVideoBrief = await page.locator("textarea[aria-label='AI product video music brief template']").inputValue();
    if (
      !productVideoBrief.includes("Package: USD $29 Product Video Music Hook Sketch") ||
      !productVideoBrief.includes("Primary use: Shopify product page video") ||
      !productVideoBrief.includes("Publishing channel: product page") ||
      !productVideoBrief.includes("Source material rights: original prompt only") ||
      !productVideoBrief.includes("Delivery: one selected 6-15 second product video music hook sketch") ||
      !productVideoBrief.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`AI product video music brief missing package, delivery, rights, channel, or payment copy in ${viewport.name}`);
    }
    const productVideoOrderLinks = await page.locator("a[href*='template=ai-product-video-music-order.yml']").count();
    if (productVideoOrderLinks < 2) {
      throw new Error(`AI product video music page missing dedicated product order links in ${viewport.name}`);
    }
    const productVideoPaymentProofLinks = await page.locator("a[href*='template=payment-confirmation.yml']").count();
    if (productVideoPaymentProofLinks < 2) {
      throw new Error(`AI product video music page missing payment proof links in ${viewport.name}`);
    }
    const productVideoEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      productVideoEmailLinks.length < 3 ||
      !productVideoEmailLinks.every((href) => href.includes("AI product video music brief")) ||
      !productVideoEmailLinks.every((href) => href.includes("USD $29 Product Video Music Hook Sketch")) ||
      !productVideoEmailLinks.every((href) => href.includes("Payment timing: after written brief acceptance only"))
    ) {
      throw new Error(`AI product video music page missing email brief link or payment guardrail in ${viewport.name}`);
    }
    const productVideoOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (productVideoOverflow) throw new Error(`AI product video music horizontal overflow detected in ${viewport.name}`);

    await page.goto(ugcAgencyAiMusicHooks, { waitUntil: "networkidle" });
    const ugcAgencyTitle = await page.locator("h1").innerText();
    if (!ugcAgencyTitle.includes("AI UGC Agency Music Hook Pack")) {
      throw new Error(`Unexpected UGC agency music hook h1 in ${viewport.name}: ${ugcAgencyTitle}`);
    }
    const ugcAgencyText = await page.locator("body").innerText();
    if (
      !ugcAgencyText.includes("USD $29 UGC Agency Audio Hook Sketch") ||
      !ugcAgencyText.includes("Email agency brief") ||
      !ugcAgencyText.includes("Open agency order form") ||
      !ugcAgencyText.includes("Generate a client approval music hook packet") ||
      !ugcAgencyText.includes("Generate agency packet") ||
      !ugcAgencyText.includes("Client Approval") ||
      !ugcAgencyText.includes("paid-social") ||
      !ugcAgencyText.includes("source-material rights") ||
      !ugcAgencyText.includes("commercial-use memo") ||
      !ugcAgencyText.includes("Payment is requested only after the written brief and package are accepted") ||
      !ugcAgencyText.includes("No known-artist soundalikes") ||
      !ugcAgencyText.includes("AI music storefront")
    ) {
      throw new Error(`UGC agency music hook page missing package, agency fit, payment, rights, or CTA copy in ${viewport.name}`);
    }
    const ugcAgencyHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!ugcAgencyHeroLoaded) throw new Error(`UGC agency music hook hero image failed to load in ${viewport.name}`);
    const ugcAgencyAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      ugcAgencyAudioSources.length !== 3 ||
      !ugcAgencyAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !ugcAgencyAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !ugcAgencyAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`UGC agency music hook sample audio sources missing in ${viewport.name}`);
    }
    await page.locator("[data-jingle-form] [name='brand']").fill("Launch Reel Client Test");
    await page.locator("[data-jingle-form] [name='audience']").fill(
      "Ecommerce skincare buyers seeing a creator-led product demo and launch-week offer."
    );
    await page.locator("[data-jingle-form] [name='tagline']").fill("Three steps, one brighter routine.");
    await page.locator("[data-jingle-form]").evaluate((form) => form.requestSubmit());
    const ugcAgencyGeneratedPacket = await page.locator("[data-jingle-output]").inputValue();
    if (
      !ugcAgencyGeneratedPacket.includes("## AI UGC agency music hook brief") ||
      !ugcAgencyGeneratedPacket.includes("Launch Reel Client Test") ||
      !ugcAgencyGeneratedPacket.includes("USD $29 UGC Agency Audio Hook Sketch") ||
      !ugcAgencyGeneratedPacket.includes("Primary use: Client approval audio hook") ||
      !ugcAgencyGeneratedPacket.includes("Publishing channel: Client approval only") ||
      !ugcAgencyGeneratedPacket.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !ugcAgencyGeneratedPacket.includes("## Production prompt") ||
      !ugcAgencyGeneratedPacket.includes("Payment timing: after written brief acceptance only") ||
      !ugcAgencyGeneratedPacket.includes("Payment is requested only after the brief and package are accepted in writing")
    ) {
      throw new Error(`UGC agency music hook dynamic packet missing brand, channel, rights, prompt, or payment guardrail in ${viewport.name}`);
    }
    const ugcAgencyGeneratedOrderHref = await page.locator("[data-open-jingle-brief]").getAttribute("href");
    if (!ugcAgencyGeneratedOrderHref?.includes("template=ugc-agency-music-hook-order.yml")) {
      throw new Error(`UGC agency music hook dynamic order link missing agency order template in ${viewport.name}`);
    }
    if (!ugcAgencyGeneratedOrderHref.includes("labels=ai-jingle-order%2Cugc-agency-music-hook-order")) {
      throw new Error(`UGC agency music hook dynamic order link missing agency order labels in ${viewport.name}`);
    }
    if (!decodeURIComponent(ugcAgencyGeneratedOrderHref).includes("AI UGC agency music hook order: Launch Reel Client Test")) {
      throw new Error(`UGC agency music hook dynamic order link missing project title in ${viewport.name}`);
    }
    const ugcAgencyAcceptancePacket = await page.locator("[data-jingle-acceptance-output]").inputValue();
    if (
      !ugcAgencyAcceptancePacket.includes("## Acceptance and payment handoff") ||
      !ugcAgencyAcceptancePacket.includes("Amount: USD $29 equivalent") ||
      !ugcAgencyAcceptancePacket.includes("I accept the USD $29 UGC Agency Audio Hook Sketch for Launch Reel Client Test") ||
      !ugcAgencyAcceptancePacket.includes("Publishing channel: Client approval only") ||
      !ugcAgencyAcceptancePacket.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !ugcAgencyAcceptancePacket.includes("Payment timing: after written brief acceptance only") ||
      !ugcAgencyAcceptancePacket.includes("Payment proof service field: USD $29 UGC Agency Audio Hook Sketch") ||
      !ugcAgencyAcceptancePacket.includes("payment-confirmation.yml")
    ) {
      throw new Error(`UGC agency music hook acceptance packet missing amount, acceptance, payment, or guardrail copy in ${viewport.name}`);
    }
    const ugcAgencyCommercialMemo = await page.locator("[data-jingle-commercial-output]").inputValue();
    if (
      !ugcAgencyCommercialMemo.includes("## Commercial-use music memo") ||
      !ugcAgencyCommercialMemo.includes("Project: Launch Reel Client Test") ||
      !ugcAgencyCommercialMemo.includes("This is an order memo and usage record, not legal clearance") ||
      !ugcAgencyCommercialMemo.includes("Publishing channel: Client approval only") ||
      !ugcAgencyCommercialMemo.includes("Source tool and plan/tier note recorded") ||
      !ugcAgencyCommercialMemo.includes("Paid delivery starts only after the written brief")
    ) {
      throw new Error(`UGC agency music hook usage memo missing project, channel, source note, legal, or start-rule copy in ${viewport.name}`);
    }
    const ugcAgencySketchHref = await page.locator("[data-download-jingle-sketch]").getAttribute("href");
    if (!ugcAgencySketchHref?.startsWith("blob:")) {
      throw new Error(`UGC agency music hook WAV sketch link was not generated in ${viewport.name}`);
    }
    const ugcAgencyBrief = await page.locator("textarea[aria-label='AI UGC agency music hook brief template']").inputValue();
    if (
      !ugcAgencyBrief.includes("Package: USD $29 UGC Agency Audio Hook Sketch") ||
      !ugcAgencyBrief.includes("Primary use: client approval audio hook") ||
      !ugcAgencyBrief.includes("Publishing channel: client approval only") ||
      !ugcAgencyBrief.includes("Source material rights: original prompt only") ||
      !ugcAgencyBrief.includes("Delivery: one selected 6-15 second agency audio hook sketch") ||
      !ugcAgencyBrief.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`UGC agency music hook brief missing package, delivery, rights, channel, or payment copy in ${viewport.name}`);
    }
    const ugcAgencyOrderLinks = await page.locator("a[href*='template=ugc-agency-music-hook-order.yml']").count();
    if (ugcAgencyOrderLinks < 2) {
      throw new Error(`UGC agency music hook page missing dedicated agency order links in ${viewport.name}`);
    }
    const ugcAgencyEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      ugcAgencyEmailLinks.length < 3 ||
      !ugcAgencyEmailLinks.every((href) => href.includes("AI UGC agency music hook brief")) ||
      !ugcAgencyEmailLinks.every((href) => href.includes("USD $29 UGC Agency Audio Hook Sketch")) ||
      !ugcAgencyEmailLinks.every((href) => href.includes("Payment timing: after written brief acceptance only"))
    ) {
      throw new Error(`UGC agency music hook page missing email brief link or payment guardrail in ${viewport.name}`);
    }
    const ugcAgencyOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (ugcAgencyOverflow) throw new Error(`UGC agency music hook horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiShortFormAdMusic, { waitUntil: "networkidle" });
    const shortFormAdMusicTitle = await page.locator("h1").innerText();
    if (!shortFormAdMusicTitle.includes("AI Short-Form Ad Music Generator")) {
      throw new Error(`Unexpected AI short-form ad music h1 in ${viewport.name}: ${shortFormAdMusicTitle}`);
    }
    const shortFormAdMusicText = await page.locator("body").innerText();
    if (
      !shortFormAdMusicText.includes("USD $29 Short-Form Ad Hook Sketch") ||
      !shortFormAdMusicText.includes("Email short-form brief") ||
      !shortFormAdMusicText.includes("Open order form") ||
      !shortFormAdMusicText.includes("Build a ready-to-send short-form ad music packet") ||
      !shortFormAdMusicText.includes("Generate short-form packet") ||
      !shortFormAdMusicText.includes("Email acceptance") ||
      !shortFormAdMusicText.includes("Download WAV") ||
      !shortFormAdMusicText.includes("TikTok") ||
      !shortFormAdMusicText.includes("Instagram Reels") ||
      !shortFormAdMusicText.includes("YouTube Shorts") ||
      !shortFormAdMusicText.includes("UGC ads") ||
      !shortFormAdMusicText.includes("publishing channel") ||
      !shortFormAdMusicText.includes("source material rights") ||
      !shortFormAdMusicText.includes("commercial-use memo") ||
      !shortFormAdMusicText.includes("Payment is requested only after the written brief and package are accepted") ||
      !shortFormAdMusicText.includes("No known-artist soundalikes") ||
      !shortFormAdMusicText.includes("TikTok Commercial Music Library") ||
      !shortFormAdMusicText.includes("AI music storefront")
    ) {
      throw new Error(`AI short-form ad music page missing package, market, payment, rights, or CTA copy in ${viewport.name}`);
    }
    const shortFormAdMusicHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!shortFormAdMusicHeroLoaded) throw new Error(`AI short-form ad music hero image failed to load in ${viewport.name}`);
    const shortFormAdMusicAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      shortFormAdMusicAudioSources.length !== 3 ||
      !shortFormAdMusicAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !shortFormAdMusicAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !shortFormAdMusicAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`AI short-form ad music sample audio sources missing in ${viewport.name}`);
    }
    await page.locator("[data-jingle-form] [name='brand']").fill("Launch Reel Co");
    await page.locator("[data-jingle-form] [name='audience']").fill(
      "Skincare buyers watching a fast before-after UGC product demo with a launch-week offer."
    );
    await page.locator("[data-jingle-form] [name='tagline']").fill("Glow in three steps.");
    await page.locator("[data-jingle-form]").evaluate((form) => form.requestSubmit());
    const shortFormGeneratedPacket = await page.locator("[data-jingle-output]").inputValue();
    if (
      !shortFormGeneratedPacket.includes("## AI short-form ad music brief") ||
      !shortFormGeneratedPacket.includes("Launch Reel Co") ||
      !shortFormGeneratedPacket.includes("USD $29 Short-Form Ad Hook Sketch") ||
      !shortFormGeneratedPacket.includes("Primary use: 6-10s TikTok/Reels/Shorts hook") ||
      !shortFormGeneratedPacket.includes("Publishing channel: TikTok organic or paid ad") ||
      !shortFormGeneratedPacket.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !shortFormGeneratedPacket.includes("## Production prompt") ||
      !shortFormGeneratedPacket.includes("Payment timing: after written brief acceptance only") ||
      !shortFormGeneratedPacket.includes("Payment is requested only after the brief and package are accepted in writing")
    ) {
      throw new Error(`AI short-form ad music dynamic packet missing brand, channel, rights, prompt, or payment guardrail in ${viewport.name}`);
    }
    const shortFormGeneratedOrderHref = await page.locator("[data-open-jingle-brief]").getAttribute("href");
    if (!shortFormGeneratedOrderHref?.includes("template=ai-jingle-order.yml")) {
      throw new Error(`AI short-form ad music dynamic order link missing order template in ${viewport.name}`);
    }
    if (!decodeURIComponent(shortFormGeneratedOrderHref).includes("AI short-form ad music order: Launch Reel Co")) {
      throw new Error(`AI short-form ad music dynamic order link missing campaign title in ${viewport.name}`);
    }
    const shortFormAcceptancePacket = await page.locator("[data-jingle-acceptance-output]").inputValue();
    if (
      !shortFormAcceptancePacket.includes("## Acceptance and payment handoff") ||
      !shortFormAcceptancePacket.includes("Amount: USD $29 equivalent") ||
      !shortFormAcceptancePacket.includes("I accept the USD $29 Short-Form Ad Hook Sketch for Launch Reel Co") ||
      !shortFormAcceptancePacket.includes("Publishing channel: TikTok organic or paid ad") ||
      !shortFormAcceptancePacket.includes("Source material rights: Original prompt only; no third-party lyrics or melodies") ||
      !shortFormAcceptancePacket.includes("Payment timing: after written brief acceptance only") ||
      !shortFormAcceptancePacket.includes("0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF") ||
      !shortFormAcceptancePacket.includes("Payment proof service field: USD $29 Short-Form Ad Hook Sketch") ||
      !shortFormAcceptancePacket.includes("payment-confirmation.yml")
    ) {
      throw new Error(`AI short-form ad music acceptance packet missing amount, acceptance, payment, or guardrail copy in ${viewport.name}`);
    }
    const shortFormCommercialMemo = await page.locator("[data-jingle-commercial-output]").inputValue();
    if (
      !shortFormCommercialMemo.includes("## Commercial-use music memo") ||
      !shortFormCommercialMemo.includes("Project: Launch Reel Co") ||
      !shortFormCommercialMemo.includes("This is an order memo and usage record, not legal clearance") ||
      !shortFormCommercialMemo.includes("Publishing channel: TikTok organic or paid ad") ||
      !shortFormCommercialMemo.includes("Source tool and plan/tier note recorded") ||
      !shortFormCommercialMemo.includes("Paid delivery starts only after the written brief")
    ) {
      throw new Error(`AI short-form ad music usage memo missing project, channel, source note, legal, or start-rule copy in ${viewport.name}`);
    }
    const shortFormSketchStatus = await page.locator("[data-jingle-sketch-status]").innerText();
    if (!shortFormSketchStatus.includes("Browser sketch ready") || !shortFormSketchStatus.includes("Paid delivery uses selected AI-assisted generations")) {
      throw new Error(`AI short-form ad music sketch status missing ready or paid-delivery copy in ${viewport.name}`);
    }
    const shortFormSketchHref = await page.locator("[data-download-jingle-sketch]").getAttribute("href");
    if (!shortFormSketchHref?.startsWith("blob:")) {
      throw new Error(`AI short-form ad music WAV sketch link was not generated in ${viewport.name}`);
    }
    const shortFormAdMusicBrief = await page.locator("textarea[aria-label='AI short-form ad music brief template']").inputValue();
    if (
      !shortFormAdMusicBrief.includes("Package: USD $29 Short-Form Ad Hook Sketch") ||
      !shortFormAdMusicBrief.includes("Primary use: 6-10s TikTok/Reels/Shorts hook") ||
      !shortFormAdMusicBrief.includes("Publishing channel: TikTok / Instagram Reels / YouTube Shorts") ||
      !shortFormAdMusicBrief.includes("Source material rights: original prompt only / buyer-owned tagline") ||
      !shortFormAdMusicBrief.includes("Delivery: one selected 6-15 second short-form ad music hook sketch") ||
      !shortFormAdMusicBrief.includes("commercial-use memo") ||
      !shortFormAdMusicBrief.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`AI short-form ad music brief missing package, delivery, rights, channel, or payment copy in ${viewport.name}`);
    }
    const shortFormAdMusicOrderLinks = await page.locator("a[href*='template=ai-jingle-order.yml']").count();
    if (shortFormAdMusicOrderLinks < 2) {
      throw new Error(`AI short-form ad music page missing order link in ${viewport.name}`);
    }
    const shortFormAdMusicEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      shortFormAdMusicEmailLinks.length < 3 ||
      !shortFormAdMusicEmailLinks.every((href) => href.includes("AI short-form ad music brief")) ||
      !shortFormAdMusicEmailLinks.every((href) => href.includes("USD $29 Short-Form Ad Hook Sketch")) ||
      !shortFormAdMusicEmailLinks.every((href) => href.includes("Publishing channel")) ||
      !shortFormAdMusicEmailLinks.every((href) => href.includes("Source material rights")) ||
      !shortFormAdMusicEmailLinks.every((href) => href.includes("Payment timing: after written brief acceptance only"))
    ) {
      throw new Error(`AI short-form ad music page missing email brief link, channel/source rights, or payment guardrail in ${viewport.name}`);
    }
    const shortFormAdMusicOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (shortFormAdMusicOverflow) throw new Error(`AI short-form ad music horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiJingleHookSketch, { waitUntil: "networkidle" });
    const hookSketchTitle = await page.locator("h1").innerText();
    if (!hookSketchTitle.includes("$29 AI Jingle Hook Sketch")) {
      throw new Error(`Unexpected AI jingle hook sketch h1 in ${viewport.name}: ${hookSketchTitle}`);
    }
    const hookSketchText = await page.locator("body").innerText();
    if (
      !hookSketchText.includes("USD $29 Founding Hook Sketch") ||
      !hookSketchText.includes("Email $29 brief") ||
      !hookSketchText.includes("Open order form") ||
      !hookSketchText.includes("One selected 8-12 second branded hook sketch") ||
      !hookSketchText.includes("Payment is requested only after the written brief and package are accepted") ||
      !hookSketchText.includes("No known-artist soundalikes") ||
      !hookSketchText.includes("General AI jingle page") ||
      !hookSketchText.includes("AI music storefront")
    ) {
      throw new Error(`AI jingle hook sketch page missing package, payment, rights, or CTA copy in ${viewport.name}`);
    }
    const hookSketchHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!hookSketchHeroLoaded) throw new Error(`AI jingle hook sketch hero image failed to load in ${viewport.name}`);
    const hookSketchAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      hookSketchAudioSources.length !== 3 ||
      !hookSketchAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !hookSketchAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !hookSketchAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`AI jingle hook sketch sample audio sources missing in ${viewport.name}`);
    }
    const hookSketchBrief = await page.locator("textarea.brief-output").inputValue();
    if (
      !hookSketchBrief.includes("Package: USD $29 Founding Hook Sketch") ||
      !hookSketchBrief.includes("Delivery: one selected 8-12 second branded hook sketch") ||
      !hookSketchBrief.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`AI jingle hook sketch brief missing package, delivery, or payment copy in ${viewport.name}`);
    }
    const hookSketchOrderLinks = await page.locator("a[href*='template=ai-jingle-order.yml']").count();
    if (hookSketchOrderLinks < 2) {
      throw new Error(`AI jingle hook sketch page missing order links in ${viewport.name}`);
    }
    const hookSketchEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      hookSketchEmailLinks.length < 3 ||
      !hookSketchEmailLinks.every((href) => href.includes("USD $29 Founding Hook Sketch")) ||
      !hookSketchEmailLinks.every((href) => href.includes("Payment timing: after written brief acceptance only")) ||
      !hookSketchEmailLinks.some((href) => href.includes("one selected 8-12 second branded hook sketch"))
    ) {
      throw new Error(`AI jingle hook sketch page missing email brief link or payment guardrail in ${viewport.name}`);
    }
    const hookSketchOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (hookSketchOverflow) throw new Error(`AI jingle hook sketch horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiCommercialJingle, { waitUntil: "networkidle" });
    const commercialJingleTitle = await page.locator("h1").innerText();
    if (!commercialJingleTitle.includes("AI Commercial Jingle Generator")) {
      throw new Error(`Unexpected AI commercial jingle h1 in ${viewport.name}: ${commercialJingleTitle}`);
    }
    const commercialJingleText = await page.locator("body").innerText();
    if (
      !commercialJingleText.includes("USD $29 Local Ad Hook Sketch") ||
      !commercialJingleText.includes("Email local ad brief") ||
      !commercialJingleText.includes("Open order form") ||
      !commercialJingleText.includes("Copy the local ad brief before asking for payment") ||
      !commercialJingleText.includes("Payment is requested only after the written brief and package are accepted") ||
      !commercialJingleText.includes("AudioGo small business audio advertising guide") ||
      !commercialJingleText.includes("SiriusXM small business audio marketing guide") ||
      !commercialJingleText.includes("SBA local radio advertising note") ||
      !commercialJingleText.includes("General AI jingle page") ||
      !commercialJingleText.includes("AI music storefront")
    ) {
      throw new Error(`AI commercial jingle page missing package, market, payment, rights, or CTA copy in ${viewport.name}`);
    }
    const commercialJingleHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!commercialJingleHeroLoaded) throw new Error(`AI commercial jingle hero image failed to load in ${viewport.name}`);
    const commercialJingleAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      commercialJingleAudioSources.length !== 3 ||
      !commercialJingleAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !commercialJingleAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !commercialJingleAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`AI commercial jingle sample audio sources missing in ${viewport.name}`);
    }
    const commercialJingleBrief = await page.locator("textarea.brief-output").inputValue();
    if (
      !commercialJingleBrief.includes("Package: USD $29 Local Ad Hook Sketch") ||
      !commercialJingleBrief.includes("Primary use: 8-12s local ad hook") ||
      !commercialJingleBrief.includes("Delivery: one selected 8-12 second local ad hook sketch") ||
      !commercialJingleBrief.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`AI commercial jingle brief missing package, delivery, or payment copy in ${viewport.name}`);
    }
    const commercialJingleOrderLinks = await page.locator("a[href*='template=ai-jingle-order.yml']").count();
    if (commercialJingleOrderLinks < 1) {
      throw new Error(`AI commercial jingle page missing order link in ${viewport.name}`);
    }
    const commercialJingleEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      commercialJingleEmailLinks.length < 2 ||
      !commercialJingleEmailLinks.every((href) => href.includes("AI commercial jingle brief")) ||
      !commercialJingleEmailLinks.every((href) => href.includes("USD $29 Local Ad Hook Sketch")) ||
      !commercialJingleEmailLinks.every((href) => href.includes("Payment timing: after written brief acceptance only"))
    ) {
      throw new Error(`AI commercial jingle page missing email brief link or payment guardrail in ${viewport.name}`);
    }
    const commercialJingleOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (commercialJingleOverflow) throw new Error(`AI commercial jingle horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiRealEstateListingMusic, { waitUntil: "networkidle" });
    const realEstateListingMusicTitle = await page.locator("h1").innerText();
    if (!realEstateListingMusicTitle.includes("AI Real Estate Listing Music Generator")) {
      throw new Error(`Unexpected AI real estate listing music h1 in ${viewport.name}: ${realEstateListingMusicTitle}`);
    }
    const realEstateListingMusicText = await page.locator("body").innerText();
    if (
      !realEstateListingMusicText.includes("USD $29 Listing Video Soundtrack Sketch") ||
      !realEstateListingMusicText.includes("Email listing brief") ||
      !realEstateListingMusicText.includes("Open order form") ||
      !realEstateListingMusicText.includes("Copy the listing music brief before asking for payment") ||
      !realEstateListingMusicText.includes("Payment is requested only after the written brief and package are accepted") ||
      !realEstateListingMusicText.includes("NAR REALTOR Technology Survey") ||
      !realEstateListingMusicText.includes("Zillow real estate social media video guide") ||
      !realEstateListingMusicText.includes("Zillow Media Experts listing media packages") ||
      !realEstateListingMusicText.includes("Soundstripe music for real estate videos guide") ||
      !realEstateListingMusicText.includes("Commercial jingle") ||
      !realEstateListingMusicText.includes("AI music storefront")
    ) {
      throw new Error(`AI real estate listing music page missing package, market, payment, rights, or CTA copy in ${viewport.name}`);
    }
    const realEstateListingMusicHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!realEstateListingMusicHeroLoaded) throw new Error(`AI real estate listing music hero image failed to load in ${viewport.name}`);
    const realEstateListingMusicAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      realEstateListingMusicAudioSources.length !== 3 ||
      !realEstateListingMusicAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !realEstateListingMusicAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !realEstateListingMusicAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`AI real estate listing music sample audio sources missing in ${viewport.name}`);
    }
    const realEstateListingMusicBrief = await page.locator("textarea.brief-output").inputValue();
    if (
      !realEstateListingMusicBrief.includes("Package: USD $29 Listing Video Soundtrack Sketch") ||
      !realEstateListingMusicBrief.includes("Primary use: 15s vertical reel") ||
      !realEstateListingMusicBrief.includes("Delivery: one selected 15-30 second listing video soundtrack sketch") ||
      !realEstateListingMusicBrief.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`AI real estate listing music brief missing package, delivery, or payment copy in ${viewport.name}`);
    }
    const realEstateListingMusicOrderLinks = await page.locator("a[href*='template=ai-jingle-order.yml']").count();
    if (realEstateListingMusicOrderLinks < 1) {
      throw new Error(`AI real estate listing music page missing order link in ${viewport.name}`);
    }
    const realEstateListingMusicEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      realEstateListingMusicEmailLinks.length < 2 ||
      !realEstateListingMusicEmailLinks.every((href) => href.includes("AI real estate listing music brief")) ||
      !realEstateListingMusicEmailLinks.every((href) => href.includes("USD $29 Listing Video Soundtrack Sketch")) ||
      !realEstateListingMusicEmailLinks.every((href) => href.includes("Payment timing: after written brief acceptance only"))
    ) {
      throw new Error(`AI real estate listing music page missing email brief link or payment guardrail in ${viewport.name}`);
    }
    const realEstateListingMusicOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (realEstateListingMusicOverflow) throw new Error(`AI real estate listing music horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiWeddingVideoMusic, { waitUntil: "networkidle" });
    const weddingVideoMusicTitle = await page.locator("h1").innerText();
    if (!weddingVideoMusicTitle.includes("AI Wedding Video Music Generator")) {
      throw new Error(`Unexpected AI wedding video music h1 in ${viewport.name}: ${weddingVideoMusicTitle}`);
    }
    const weddingVideoMusicText = await page.locator("body").innerText();
    if (
      !weddingVideoMusicText.includes("USD $29 Wedding Highlight Soundtrack Sketch") ||
      !weddingVideoMusicText.includes("Email wedding brief") ||
      !weddingVideoMusicText.includes("Open order form") ||
      !weddingVideoMusicText.includes("Copy the wedding music brief before asking for payment") ||
      !weddingVideoMusicText.includes("Payment is requested only after the written brief and package are accepted") ||
      !weddingVideoMusicText.includes("The Knot wedding videographer cost guide") ||
      !weddingVideoMusicText.includes("Musicbed wedding video music licensing guide") ||
      !weddingVideoMusicText.includes("Musicbed wedding single-song license note") ||
      !weddingVideoMusicText.includes("Soundstripe wedding video songs guide") ||
      !weddingVideoMusicText.includes("Listing video music") ||
      !weddingVideoMusicText.includes("AI music storefront")
    ) {
      throw new Error(`AI wedding video music page missing package, market, payment, rights, or CTA copy in ${viewport.name}`);
    }
    const weddingVideoMusicHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!weddingVideoMusicHeroLoaded) throw new Error(`AI wedding video music hero image failed to load in ${viewport.name}`);
    const weddingVideoMusicAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      weddingVideoMusicAudioSources.length !== 3 ||
      !weddingVideoMusicAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !weddingVideoMusicAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !weddingVideoMusicAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`AI wedding video music sample audio sources missing in ${viewport.name}`);
    }
    const weddingVideoMusicBrief = await page.locator("textarea.brief-output").inputValue();
    if (
      !weddingVideoMusicBrief.includes("Package: USD $29 Wedding Highlight Soundtrack Sketch") ||
      !weddingVideoMusicBrief.includes("Primary use: 15s teaser") ||
      !weddingVideoMusicBrief.includes("Delivery: one selected 15-30 second wedding highlight soundtrack sketch") ||
      !weddingVideoMusicBrief.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`AI wedding video music brief missing package, delivery, or payment copy in ${viewport.name}`);
    }
    const weddingVideoMusicOrderLinks = await page.locator("a[href*='template=ai-jingle-order.yml']").count();
    if (weddingVideoMusicOrderLinks < 1) {
      throw new Error(`AI wedding video music page missing order link in ${viewport.name}`);
    }
    const weddingVideoMusicEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      weddingVideoMusicEmailLinks.length < 2 ||
      !weddingVideoMusicEmailLinks.every((href) => href.includes("AI wedding video music brief")) ||
      !weddingVideoMusicEmailLinks.every((href) => href.includes("USD $29 Wedding Highlight Soundtrack Sketch")) ||
      !weddingVideoMusicEmailLinks.every((href) => href.includes("Payment timing: after written brief acceptance only"))
    ) {
      throw new Error(`AI wedding video music page missing email brief link or payment guardrail in ${viewport.name}`);
    }
    const weddingVideoMusicOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (weddingVideoMusicOverflow) throw new Error(`AI wedding video music horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiPodcastIntro, { waitUntil: "networkidle" });
    const podcastIntroTitle = await page.locator("h1").innerText();
    if (!podcastIntroTitle.includes("AI Podcast Intro Generator")) {
      throw new Error(`Unexpected AI podcast intro h1 in ${viewport.name}: ${podcastIntroTitle}`);
    }
    const podcastIntroText = await page.locator("body").innerText();
    if (
      !podcastIntroText.includes("USD $29 Founding Hook Sketch") ||
      !podcastIntroText.includes("Email intro brief") ||
      !podcastIntroText.includes("Open order form") ||
      !podcastIntroText.includes("Copy the short brief before asking for payment") ||
      !podcastIntroText.includes("Payment is requested only after the written brief and package are accepted") ||
      !podcastIntroText.includes("Spotify podcast ads overview") ||
      !podcastIntroText.includes("ElevenLabs Music commercial-use note") ||
      !podcastIntroText.includes("Suno ownership and copyright help note") ||
      !podcastIntroText.includes("Podcast sponsor pack") ||
      !podcastIntroText.includes("AI music storefront")
    ) {
      throw new Error(`AI podcast intro page missing package, market, payment, rights, or CTA copy in ${viewport.name}`);
    }
    const podcastIntroHeroLoaded = await page.locator(".hero-bg").evaluate((img) => img.complete && img.naturalWidth > 0);
    if (!podcastIntroHeroLoaded) throw new Error(`AI podcast intro hero image failed to load in ${viewport.name}`);
    const podcastIntroAudioSources = await page.locator(".sample-card audio").evaluateAll((audioElements) =>
      audioElements.map((audio) => audio.getAttribute("src") || "")
    );
    if (
      podcastIntroAudioSources.length !== 3 ||
      !podcastIntroAudioSources.includes("assets/audio/business-show-intro.wav") ||
      !podcastIntroAudioSources.includes("assets/audio/coffee-shop-30s-hook.wav") ||
      !podcastIntroAudioSources.includes("assets/audio/radio-id-drop.wav")
    ) {
      throw new Error(`AI podcast intro sample audio sources missing in ${viewport.name}`);
    }
    const podcastIntroBrief = await page.locator("textarea.brief-output").inputValue();
    if (
      !podcastIntroBrief.includes("Package: USD $29 Founding Hook Sketch") ||
      !podcastIntroBrief.includes("Primary use: 8-12s intro hook") ||
      !podcastIntroBrief.includes("Delivery: one selected 8-12 second podcast intro hook sketch") ||
      !podcastIntroBrief.includes("Payment timing: after written brief acceptance only")
    ) {
      throw new Error(`AI podcast intro brief missing package, delivery, or payment copy in ${viewport.name}`);
    }
    const podcastIntroOrderLinks = await page.locator("a[href*='template=ai-jingle-order.yml']").count();
    if (podcastIntroOrderLinks < 1) {
      throw new Error(`AI podcast intro page missing order link in ${viewport.name}`);
    }
    const podcastIntroEmailLinks = await page.locator("a[href^='mailto:jackjin1997@gmail.com']").evaluateAll((links) =>
      links.map((link) => decodeURIComponent(link.getAttribute("href") || ""))
    );
    if (
      podcastIntroEmailLinks.length < 2 ||
      !podcastIntroEmailLinks.every((href) => href.includes("AI podcast intro brief")) ||
      !podcastIntroEmailLinks.every((href) => href.includes("USD $29 Founding Hook Sketch")) ||
      !podcastIntroEmailLinks.every((href) => href.includes("Payment timing: after written brief acceptance only"))
    ) {
      throw new Error(`AI podcast intro page missing email brief link or payment guardrail in ${viewport.name}`);
    }
    const podcastIntroOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (podcastIntroOverflow) throw new Error(`AI podcast intro horizontal overflow detected in ${viewport.name}`);

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
      !podcastSponsorText.includes("Open order form") ||
      !podcastSponsorText.includes("AI music storefront")
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
      !aiJingleQuoteText.includes("Delivery note") ||
      !aiJingleQuoteText.includes("AI music storefront")
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

    await page.goto(aiCostSpikeEmergency, { waitUntil: "networkidle" });
    const costSpikeTitle = await page.locator("h1").innerText();
    if (!costSpikeTitle.includes("AI Cost Spike Emergency Sprint")) {
      throw new Error(`Unexpected AI Cost Spike emergency h1 in ${viewport.name}: ${costSpikeTitle}`);
    }
    const costSpikeText = await page.locator("body").innerText();
    if (
      !costSpikeText.includes("USD $1,000 AI Cost Spike Emergency Sprint") ||
      !costSpikeText.includes("24h containment plan") ||
      !costSpikeText.includes("runaway LLM bills") ||
      !costSpikeText.includes("Payment timing: after written scope acceptance only.")
    ) {
      throw new Error(`AI Cost Spike emergency page missing package, urgency, or payment guardrail in ${viewport.name}`);
    }
    const costSpikeCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!costSpikeCta?.includes("ai-cost-spike-emergency.yml")) {
      throw new Error(`AI Cost Spike emergency CTA missing dedicated intake URL in ${viewport.name}`);
    }
    const costSpikeCopyTarget = await page.locator("[data-copy-target='#cost-spike-payment-packet']").getAttribute("data-copy-target");
    if (costSpikeCopyTarget !== "#cost-spike-payment-packet") {
      throw new Error(`AI Cost Spike emergency payment packet copy target missing in ${viewport.name}`);
    }
    const costSpikeOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (costSpikeOverflow) throw new Error(`AI Cost Spike emergency horizontal overflow detected in ${viewport.name}`);

    await page.goto(openRouterCostCalculator, { waitUntil: "networkidle" });
    const openRouterTitle = await page.locator("h1").innerText();
    if (!openRouterTitle.includes("OpenRouter Cost Calculator")) {
      throw new Error(`Unexpected OpenRouter Cost Calculator h1 in ${viewport.name}: ${openRouterTitle}`);
    }
    const openRouterText = await page.locator("body").innerText();
    if (
      !openRouterText.includes("USD $99 Quick AI API Cost Audit") ||
      !openRouterText.includes("USD $299 AI Agent Cost Leak Review") ||
      !openRouterText.includes("USD $1,000 AI Cost Spike Emergency Sprint") ||
      !openRouterText.includes("cache-read share") ||
      !openRouterText.includes("tool-call fanout") ||
      !openRouterText.includes("Payment only after written scope acceptance")
    ) {
      throw new Error(`OpenRouter Cost Calculator page missing package ladder, calculator scope, or payment guardrail in ${viewport.name}`);
    }
    await page.locator("[data-openrouter-cost-form] [name='project']").fill("https://github.com/example/openrouter-agent");
    await page.locator("[data-openrouter-cost-form] [name='monthlyRequests']").fill("24000");
    await page.locator("[data-openrouter-cost-form] [name='retryPercent']").fill("18");
    await page.locator("[data-openrouter-cost-form]").evaluate((form) => form.requestSubmit());
    const openRouterPacket = await page.locator("[data-openrouter-packet]").inputValue();
    if (
      !openRouterPacket.includes("USD $299 AI Agent Cost Leak Review") ||
      !openRouterPacket.includes("https://github.com/example/openrouter-agent") ||
      !openRouterPacket.includes("Estimated monthly model cost") ||
      !openRouterPacket.includes("Tool calls per run") ||
      !openRouterPacket.includes("I will not include private prompts")
    ) {
      throw new Error(`OpenRouter calculator packet is missing focused review routing or safety text in ${viewport.name}`);
    }
    const openRouterHref = await page.locator("[data-openrouter-open-brief]").getAttribute("href");
    if (!openRouterHref?.includes("agent-cost-leak-review.yml")) {
      throw new Error(`OpenRouter calculator default intake link is missing cost leak review template in ${viewport.name}`);
    }
    await page.locator("[data-openrouter-cost-form] [name='monthlyRequests']").fill("300000");
    await page.locator("[data-openrouter-cost-form] [name='outputTokens']").fill("3000");
    await page.locator("[data-openrouter-cost-form]").evaluate((form) => form.requestSubmit());
    const openRouterEmergencyPacket = await page.locator("[data-openrouter-packet]").inputValue();
    const openRouterEmergencyHref = await page.locator("[data-openrouter-open-brief]").getAttribute("href");
    if (
      !openRouterEmergencyPacket.includes("USD $1,000 AI Cost Spike Emergency Sprint") ||
      !openRouterEmergencyHref?.includes("ai-cost-spike-emergency.yml")
    ) {
      throw new Error(`OpenRouter calculator did not route high spend to emergency intake in ${viewport.name}`);
    }
    const openRouterOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (openRouterOverflow) throw new Error(`OpenRouter Cost Calculator horizontal overflow detected in ${viewport.name}`);

    await page.goto(aiAgentCostLeakReview, { waitUntil: "networkidle" });
    const aiAgentCostTitle = await page.locator("h1").innerText();
    if (!aiAgentCostTitle.includes("AI Agent Cost Leak Review")) {
      throw new Error(`Unexpected AI Agent Cost Leak review h1 in ${viewport.name}: ${aiAgentCostTitle}`);
    }
    const aiAgentCostText = await page.locator("body").innerText();
    if (
      !aiAgentCostText.includes("USD $299 AI Agent Cost Leak Review") ||
      !aiAgentCostText.includes("context bloat") ||
      !aiAgentCostText.includes("model-routing") ||
      !aiAgentCostText.includes("cache misses") ||
      !aiAgentCostText.includes("Payment only after written scope acceptance") ||
      !aiAgentCostText.includes("Payment timing: after written scope acceptance only.")
    ) {
      throw new Error(`AI Agent Cost Leak review page missing package, cost scope, or payment guardrail in ${viewport.name}`);
    }
    const aiAgentCostCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!aiAgentCostCta?.includes("agent-cost-leak-review.yml")) {
      throw new Error(`AI Agent Cost Leak review CTA missing dedicated intake URL in ${viewport.name}`);
    }
    const aiAgentCostCopyTarget = await page.locator("[data-copy-target='#cost-payment-packet']").getAttribute("data-copy-target");
    if (aiAgentCostCopyTarget !== "#cost-payment-packet") {
      throw new Error(`AI Agent Cost Leak payment packet copy target missing in ${viewport.name}`);
    }
    const aiAgentCostOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (aiAgentCostOverflow) throw new Error(`AI Agent Cost Leak review horizontal overflow detected in ${viewport.name}`);

    await page.goto(agentAuthReview, { waitUntil: "networkidle" });
    const agentAuthTitle = await page.locator("h1").innerText();
    if (!agentAuthTitle.includes("Agent Auth and Cookie Vault Security Review")) {
      throw new Error(`Unexpected Agent Auth review h1 in ${viewport.name}: ${agentAuthTitle}`);
    }
    const agentAuthText = await page.locator("body").innerText();
    if (
      !agentAuthText.includes("USD $299 Agent Auth Focused Review") ||
      !agentAuthText.includes("site_login") ||
      !agentAuthText.includes("token broker") ||
      !agentAuthText.includes("cache key") ||
      !agentAuthText.includes("SSRF with cookies") ||
      !agentAuthText.includes("Payment only after written scope acceptance") ||
      !agentAuthText.includes("Payment timing: after written scope acceptance only.")
    ) {
      throw new Error(`Agent Auth review page missing package, auth scope, or payment guardrail in ${viewport.name}`);
    }
    const agentAuthCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!agentAuthCta?.includes("agent-auth-review.yml")) {
      throw new Error(`Agent Auth review CTA missing dedicated Agent Auth intake URL in ${viewport.name}`);
    }
    const agentAuthCopyTarget = await page.locator("[data-copy-target='#auth-payment-packet']").getAttribute("data-copy-target");
    if (agentAuthCopyTarget !== "#auth-payment-packet") {
      throw new Error(`Agent Auth payment packet copy target missing in ${viewport.name}`);
    }
    const agentAuthOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (agentAuthOverflow) throw new Error(`Agent Auth review horizontal overflow detected in ${viewport.name}`);

    await page.goto(mcpSsrfReview, { waitUntil: "networkidle" });
    const mcpSsrfTitle = await page.locator("h1").innerText();
    if (!mcpSsrfTitle.includes("MCP SSRF and Dynamic URL Fetch Review")) {
      throw new Error(`Unexpected MCP SSRF review h1 in ${viewport.name}: ${mcpSsrfTitle}`);
    }
    const mcpSsrfText = await page.locator("body").innerText();
    if (
      !mcpSsrfText.includes("USD $299 MCP SSRF Focused Review") ||
      !mcpSsrfText.includes("fetch_pagination_url") ||
      !mcpSsrfText.includes("SSRF-with-credentials") ||
      !mcpSsrfText.includes("metadata IPs") ||
      !mcpSsrfText.includes("Payment only after written scope acceptance") ||
      !mcpSsrfText.includes("Payment timing: after written scope acceptance only.")
    ) {
      throw new Error(`MCP SSRF review page missing package, URL fetch scope, or payment guardrail in ${viewport.name}`);
    }
    const mcpSsrfCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!mcpSsrfCta?.includes("mcp-ssrf-review.yml")) {
      throw new Error(`MCP SSRF review CTA missing dedicated intake URL in ${viewport.name}`);
    }
    const mcpSsrfCopyTarget = await page.locator("[data-copy-target='#ssrf-payment-packet']").getAttribute("data-copy-target");
    if (mcpSsrfCopyTarget !== "#ssrf-payment-packet") {
      throw new Error(`MCP SSRF payment packet copy target missing in ${viewport.name}`);
    }
    const mcpSsrfOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (mcpSsrfOverflow) throw new Error(`MCP SSRF review horizontal overflow detected in ${viewport.name}`);

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
    if (!mcpServerScanText.includes("USD $299 focused path for dynamic URL fetch findings")) {
      throw new Error(`MCP server scan page missing MCP SSRF focused-review handoff in ${viewport.name}`);
    }
    if (!mcpServerScanText.includes("does not execute target code")) {
      throw new Error(`MCP server scan page missing no-execution safety copy in ${viewport.name}`);
    }
    if (!mcpServerScanText.includes("Open MCP Security Radar")) {
      throw new Error(`MCP server scan page missing Radar link in ${viewport.name}`);
    }
    if (!mcpServerScanText.includes("MCP SSRF review")) {
      throw new Error(`MCP server scan page missing MCP SSRF CTA in ${viewport.name}`);
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
    if (!mcpCodeScanningText.includes("Dynamic URL fetch alerts can use the USD $299 focused review")) {
      throw new Error(`MCP code scanning page missing MCP SSRF focused-review copy in ${viewport.name}`);
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
    if (!mcpCodeScanningText.includes("Start SSRF review")) {
      throw new Error(`MCP code scanning page missing SSRF review CTA in ${viewport.name}`);
    }
    const mcpCodeScanningCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (mcpCodeScanningCta !== "examples/github-code-scanning.yml") {
      throw new Error(`MCP code scanning primary CTA should open workflow example in ${viewport.name}`);
    }
    const codeScanningAuditLinks = await page.locator("a[href*='template=code-scanning-audit.yml']").count();
    if (codeScanningAuditLinks < 1) {
      throw new Error(`MCP code scanning page missing code scanning audit issue link in ${viewport.name}`);
    }
    const ssrfReviewLinks = await page.locator("a[href*='template=mcp-ssrf-review.yml']").count();
    if (ssrfReviewLinks < 1) {
      throw new Error(`MCP code scanning page missing MCP SSRF review issue link in ${viewport.name}`);
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
    if (!scanText.includes("MCP SSRF review")) {
      throw new Error(`Scanner page missing MCP SSRF focused-review CTA in ${viewport.name}`);
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
    if (!scanOutput.includes("MCP SSRF Focused Review") || !scanOutput.includes("mcp-ssrf-review.yml")) {
      throw new Error(`Scanner output missing MCP SSRF focused-review handoff in ${viewport.name}`);
    }
    if (!scanOutput.includes("Agent Auth Focused Review") || !scanOutput.includes("agent-auth-review.yml")) {
      throw new Error(`Scanner output missing related Agent Auth focused-review handoff in ${viewport.name}`);
    }
    if (!scanOutput.includes("Dynamic URL fetch or SSRF surface") || !scanOutput.includes("Dynamic URL fetch can become SSRF with credentials")) {
      throw new Error(`Scanner output missing MCP SSRF/dynamic URL fetch finding in ${viewport.name}`);
    }
    const scanHref = await page.locator("[data-open-scan-request]").first().getAttribute("href");
    if (!scanHref?.includes("mcp-ssrf-review.yml")) {
      throw new Error(`Scanner request link missing MCP SSRF focused-review template in ${viewport.name}`);
    }
    const localAuditPacket = await page.locator("[data-audit-packet-output]").inputValue();
    if (!localAuditPacket.includes("Private or local repo; access details to be shared after scope acceptance.")) {
      throw new Error(`Local scanner audit packet missing private repo handoff in ${viewport.name}`);
    }
    if (!localAuditPacket.includes("USD $299 MCP SSRF Focused Review") || !localAuditPacket.includes("mcp-ssrf-review.yml")) {
      throw new Error(`Local scanner audit packet missing MCP SSRF focused-review path in ${viewport.name}`);
    }
    if (!localAuditPacket.includes("SSRF-with-credentials boundary")) {
      throw new Error(`Local scanner audit packet missing MCP SSRF focused-review boundary in ${viewport.name}`);
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
      !quickScanText.includes("USD $299 MCP SSRF Focused Review") ||
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
