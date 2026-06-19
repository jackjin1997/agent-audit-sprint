import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const index = `file://${resolve(root, "index.html")}`;
const doubanReport = `file://${resolve(root, "reports/douban-mcp-sample-audit.html")}`;
const firecrawlReport = `file://${resolve(root, "reports/firecrawl-mcp-sample-audit.html")}`;
const terms = `file://${resolve(root, "terms.html")}`;
const checklist = `file://${resolve(root, "checklist.html")}`;
const service = `file://${resolve(root, "mcp-security-audit-service.html")}`;
const scan = `file://${resolve(root, "scan.html")}`;
const quote = `file://${resolve(root, "quote.html")}`;
const samples = `file://${resolve(root, "samples.html")}`;
const trading = `file://${resolve(root, "trading-mcp-security-audit.html")}`;
const workspace = `file://${resolve(root, "workspace-mcp-security-audit.html")}`;
const cloudDatabase = `file://${resolve(root, "cloud-database-mcp-security-audit.html")}`;
const browserAutomation = `file://${resolve(root, "browser-automation-mcp-security-audit.html")}`;
const requiredFiles = [
  "index.html",
  "mcp-security-audit-service.html",
  "scan.html",
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
  "robots.txt",
  "sitemap.xml",
  "LICENSE",
  "action.yml",
  ".github/FUNDING.yml",
  ".github/workflows/validate.yml",
  ".github/workflows/triage-audit-request.yml",
  ".github/workflows/respond-audit-intent.yml",
  ".github/workflows/respond-payment-proof.yml",
  ".github/workflows/smoke-action-v1.yml",
  "examples/github-action.yml",
  "assets/audit-dashboard.png",
  "assets/payments/eth-address.svg",
  "assets/payments/sol-address.svg",
  "reports/douban-mcp-sample-audit.html",
  "reports/douban-mcp-sample-audit.md",
  "reports/firecrawl-mcp-sample-audit.html",
  "reports/firecrawl-mcp-sample-audit.md",
  ".github/ISSUE_TEMPLATE/audit-request.yml",
  ".github/ISSUE_TEMPLATE/paid-audit-intent.yml",
  ".github/ISSUE_TEMPLATE/payment-confirmation.yml",
  "tools/agent-mcp-audit.mjs",
  "scripts/comment-audit-triage.mjs",
  "scripts/comment-audit-intent.mjs",
  "scripts/comment-payment-proof.mjs",
  "docs/mcp-security-audit-service.md",
  "docs/mcp-security-audit-checklist.md",
  "templates/invoice.md",
  "templates/quote.md",
  "templates/receipt.md",
  "templates/statement-of-work.md",
  "outreach/qualified-prospects-2026-06-19.md",
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) {
    throw new Error(`Missing required file: ${file}`);
  }
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

const intentOutput = execFileSync(process.execPath, [resolve(root, "scripts/comment-audit-intent.mjs")], {
  encoding: "utf8",
  env: {
    ...process.env,
    INTENT_DRY_RUN: "true",
    ISSUE_BODY: [
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
if (!intentOutput.includes("Audit slot received")) {
  throw new Error("Intent dry-run output is missing heading");
}
if (!intentOutput.includes("Do not send payment until scope is accepted")) {
  throw new Error("Intent dry-run output is missing payment guardrail");
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
if (!paymentProofOutput.includes("USD $1,000 equivalent")) {
  throw new Error("Payment proof dry-run output is missing amount verification rule");
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
    if (!title.includes("$1,000")) throw new Error(`Unexpected h1 in ${viewport.name}: ${title}`);
    const indexBody = await page.locator("body").innerText();
    if (!indexBody.includes("invoice-first")) {
      throw new Error(`Index page missing invoice-first payment path in ${viewport.name}`);
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
    if (!indexBody.includes("npm exec --yes github:jackjin1997/agent-audit-sprint -- /path/to/repo")) {
      throw new Error(`Index page missing GitHub npx scanner command in ${viewport.name}`);
    }
    if (!indexBody.includes("Reserve audit slot")) {
      throw new Error(`Index page missing short slot reservation CTA in ${viewport.name}`);
    }
    if (!indexBody.includes("Open the fixed $1,000 quote")) {
      throw new Error(`Index page missing fixed quote link in ${viewport.name}`);
    }
    if (!indexBody.includes("Compare both sample reports")) {
      throw new Error(`Index page missing sample index link in ${viewport.name}`);
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

    await page.goto(scan, { waitUntil: "networkidle" });
    const scanTitle = await page.locator("h1").innerText();
    if (!scanTitle.includes("Local Agent/MCP Audit Scanner")) {
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
    await page.locator("[data-public-repo-url]").fill("https://github.com/example/agent-mcp");
    await page.locator("[data-public-scan-form]").evaluate((form) => form.requestSubmit());
    await page.waitForFunction(() => document.querySelector("[data-local-scan-output]")?.value.includes("Public GitHub Repo Scan"));
    const publicScanOutput = await page.locator("[data-local-scan-output]").inputValue();
    if (!publicScanOutput.includes("https://github.com/example/agent-mcp")) {
      throw new Error(`Public scanner output missing GitHub target in ${viewport.name}`);
    }
    if (!publicScanOutput.includes("Paid 48-hour review")) {
      throw new Error(`Public scanner output missing paid review handoff in ${viewport.name}`);
    }
    const publicScanHref = await page.locator("[data-open-scan-request]").getAttribute("href");
    if (!decodeURIComponent(publicScanHref || "").includes("https://github.com/example/agent-mcp")) {
      throw new Error(`Public scanner request link missing GitHub target in ${viewport.name}`);
    }
    await page.locator("[data-local-scan-input]").setInputFiles(resolve(root, "examples/local-scan-fixture"));
    await page.locator("[data-local-scan-form]").evaluate((form) => form.requestSubmit());
    await page.waitForFunction(() => document.querySelector("[data-local-scan-output]")?.value.includes("Heuristic score"));
    const scanOutput = await page.locator("[data-local-scan-output]").inputValue();
    if (!scanOutput.includes("Paid 48-hour review")) {
      throw new Error(`Scanner output missing paid review handoff in ${viewport.name}`);
    }
    const scanHref = await page.locator("[data-open-scan-request]").getAttribute("href");
    if (!scanHref?.includes("labels=audit-request")) {
      throw new Error(`Scanner request link missing audit label in ${viewport.name}`);
    }
    const scanOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (scanOverflow) throw new Error(`Scanner horizontal overflow detected in ${viewport.name}`);

    await page.goto(quote, { waitUntil: "networkidle" });
    const quoteTitle = await page.locator("h1").innerText();
    if (!quoteTitle.includes("$1,000 Agent/MCP Audit Sprint Quote")) {
      throw new Error(`Unexpected quote h1 in ${viewport.name}: ${quoteTitle}`);
    }
    const quoteText = await page.locator("body").innerText();
    if (!quoteText.includes("Acceptance text")) {
      throw new Error(`Quote page missing acceptance text in ${viewport.name}`);
    }
    if (!quoteText.includes("Submit payment proof")) {
      throw new Error(`Quote page missing payment proof CTA in ${viewport.name}`);
    }
    if (!quoteText.includes("48-hour target")) {
      throw new Error(`Quote page missing delivery target in ${viewport.name}`);
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
    if (!samplesText.includes("douban-mcp") || !samplesText.includes("firecrawl-mcp-server")) {
      throw new Error(`Samples page missing report names in ${viewport.name}`);
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
