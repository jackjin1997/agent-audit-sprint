import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const index = `file://${resolve(root, "index.html")}`;
const report = `file://${resolve(root, "reports/douban-mcp-sample-audit.html")}`;
const requiredFiles = [
  "index.html",
  "styles.css",
  "script.js",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
  "LICENSE",
  "action.yml",
  ".github/FUNDING.yml",
  ".github/workflows/validate.yml",
  "examples/github-action.yml",
  "assets/audit-dashboard.png",
  "assets/payments/eth-address.svg",
  "assets/payments/sol-address.svg",
  "reports/douban-mcp-sample-audit.html",
  "reports/douban-mcp-sample-audit.md",
  ".github/ISSUE_TEMPLATE/audit-request.yml",
  "tools/agent-mcp-audit.mjs",
  "templates/invoice.md",
  "templates/receipt.md",
  "outreach/qualified-prospects-2026-06-19.md",
];

for (const file of requiredFiles) {
  if (!existsSync(resolve(root, file))) {
    throw new Error(`Missing required file: ${file}`);
  }
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
    await page.screenshot({ path: resolve(root, `tmp-${viewport.name}.png`), fullPage: true });

    await page.goto(report, { waitUntil: "networkidle" });
    const reportTitle = await page.locator("h1").innerText();
    if (!reportTitle.includes("douban-mcp")) throw new Error(`Unexpected report h1 in ${viewport.name}: ${reportTitle}`);
    const reportOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (reportOverflow) throw new Error(`Report horizontal overflow detected in ${viewport.name}`);

    await page.close();
  }
  console.log("Site checks passed for desktop and mobile.");
} finally {
  await browser.close();
}
