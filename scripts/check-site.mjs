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
const requiredFiles = [
  "index.html",
  "mcp-security-audit-service.html",
  "checklist.html",
  "terms.html",
  "styles.css",
  "script.js",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
  "LICENSE",
  "action.yml",
  ".github/FUNDING.yml",
  ".github/workflows/validate.yml",
  ".github/workflows/triage-audit-request.yml",
  "examples/github-action.yml",
  "assets/audit-dashboard.png",
  "assets/payments/eth-address.svg",
  "assets/payments/sol-address.svg",
  "reports/douban-mcp-sample-audit.html",
  "reports/douban-mcp-sample-audit.md",
  "reports/firecrawl-mcp-sample-audit.html",
  "reports/firecrawl-mcp-sample-audit.md",
  ".github/ISSUE_TEMPLATE/audit-request.yml",
  "tools/agent-mcp-audit.mjs",
  "scripts/comment-audit-triage.mjs",
  "docs/mcp-security-audit-service.md",
  "docs/mcp-security-audit-checklist.md",
  "templates/invoice.md",
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
    const serviceCta = await page.locator("a.button.primary").first().getAttribute("href");
    if (!serviceCta?.includes("audit-request.yml")) {
      throw new Error(`Service CTA missing intake URL in ${viewport.name}`);
    }
    const serviceOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (serviceOverflow) throw new Error(`Service horizontal overflow detected in ${viewport.name}`);

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
