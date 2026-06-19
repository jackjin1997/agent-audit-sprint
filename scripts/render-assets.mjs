import { chromium } from "playwright";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = `file://${resolve(root, "assets/audit-dashboard.html")}`;
const output = resolve(root, "assets/audit-dashboard.png");

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(source, { waitUntil: "networkidle" });
  await page.screenshot({ path: output, fullPage: false });
  console.log(`Rendered ${output}`);
} finally {
  await browser.close();
}
