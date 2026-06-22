# Agent/MCP Audit Sprint

Static landing page and sales assets for paid Agent/MCP security review packages.

Live target after GitHub Pages is enabled:

https://jackjin1997.github.io/agent-audit-sprint/

## Offer

- USD $99 quick scan, USD $299 focused review, or USD $1,000 full sprint for one agent, MCP server, or tool-using product slice
- Ranked findings with evidence, impact, and fix plan
- Review areas: tool boundaries, secrets, auth, write actions, prompt/tool injection, tests, deployment assumptions
- Payment-ready via ETH or SOL addresses after written scope acceptance, with invoice-first discussion available before work starts
- AI music revenue experiment: USD $29, USD $79, USD $149, and USD $399 AI-assisted jingle/ad-music packages for small businesses, real estate listing videos, wedding videos, podcasts, radio IDs, YouTube/TikTok intros, and local ads; the focused $29 hook sketch page, commercial jingle page, real estate listing music page, wedding video music page, podcast intro page, broad generator, public sample audio, local browser sketch demo, downloadable WAV draft, email brief path, and issue autoresponder are live

## Files

- `index.html` - public landing page
- `ai-agent-security-audit-service.html` / `docs/ai-agent-security-audit-service.md` - broader AI agent security audit service page
- `ai-agent-security-radar.html` - public no-execution radar snapshot of popular AI agent repo scan signals
- `mcp-security-audit-service.html` / `docs/mcp-security-audit-service.md` - commercial intent service page
- `mcp-server-security-scan.html` - search-focused browser scan entry point for MCP server security triage
- `mcp-security-radar.html` - public no-execution radar snapshot of popular MCP repo scan signals
- `mcp-code-scanning-github-action.html` - search-focused GitHub Code Scanning/SARIF workflow page
- `scan.html` / `scan.js` - browser scanner for public GitHub URLs, private local files, and paid audit handoff
- `quick-scan.html` / `templates/quick-scan.md` - low-friction $99, $299, and $1,000 package ladder
- `ai-jingle-generator.html` / `.github/ISSUE_TEMPLATE/ai-jingle-order.yml` - AI-assisted jingle, ad music, podcast intro, and radio ID package page with a USD $29 first hook sketch, local brief builder, sample deliverables, public WAV samples, browser audio sketch, WAV download, and email brief handoff
- `ai-jingle-hook-sketch.html` - focused USD $29 Founding Hook Sketch page with copy-ready email brief, sample audio, order-form path, and written-brief-acceptance payment guardrail
- `ai-commercial-jingle-generator.html` - local-business USD $29 commercial jingle page for audio ads, social promos, radio-style IDs, and small business campaigns
- `ai-real-estate-listing-music.html` - real-estate USD $29 listing video soundtrack page for property reels, walkthroughs, open-house teasers, and agent media teams
- `ai-wedding-video-music.html` - wedding USD $29 highlight soundtrack page for wedding videographers, teaser reels, social cuts, and filmmaker briefs
- `ai-podcast-intro-generator.html` - creator-facing USD $29 podcast intro hook page for show openers, outro bumps, segment stings, and podcast channels that are not ready for sponsor packs
- `podcast-sponsor-jingle.html` - narrow $149 podcast sponsor audio hook landing page for host-read ads, branded segments, media-kit upsells, social promo clips, and non-GitHub email brief intake
- `ai-jingle-quote.html` / `templates/ai-jingle-quote.md` - fixed quote, acceptance text, and payment packet for the AI jingle package ladder
- `templates/ai-jingle-invoice.md` / `templates/ai-jingle-receipt.md` / `templates/ai-jingle-delivery-note.md` - invoice, receipt, and delivery handoff templates for paid AI jingle work
- `quote.html` / `templates/quote.md` - fixed quote, acceptance text, and copyable payment packet
- `trading-mcp-security-audit.html` / `workspace-mcp-security-audit.html` / `cloud-database-mcp-security-audit.html` / `browser-automation-mcp-security-audit.html` - vertical landing pages for high-risk MCP buyer segments
- `samples.html` - public sample report index and conversion page
- `checklist.html` / `docs/mcp-security-audit-checklist.md` - MCP security audit checklist content page
- `llms.txt` / `robots.txt` / `sitemap.xml` - machine-readable LLM/service summary and static search metadata
- `terms.html` / `templates/statement-of-work.md` - statement of work and scope/payment terms
- `action.yml` - reusable GitHub Action wrapper for the heuristic scanner
- Standalone Action repo - https://github.com/jackjin1997/agent-mcp-code-scan-action for cleaner GitHub Action discovery
- `.github/workflows/triage-audit-request.yml` / `scripts/comment-audit-triage.mjs` - automated free triage comment for new audit intake issues
- `.github/workflows/respond-audit-intent.yml` / `scripts/comment-audit-intent.mjs` - automated next-step comment for short paid-slot issues
- `.github/workflows/respond-ai-jingle-order.yml` / `scripts/comment-ai-jingle-order.mjs` - automated next-step comment for AI jingle package orders
- `.github/workflows/respond-code-scanning-audit.yml` / `scripts/comment-code-scanning-audit.mjs` - automated next-step comment for SARIF/Code Scanning audit issues
- `.github/workflows/respond-payment-proof.yml` / `scripts/comment-payment-proof.mjs` - automated payment proof checklist comment
- `.github/workflows/goal-status-monitor.yml` / `scripts/check-goal-status.mjs` / `scripts/install-goal-monitor-launchd.mjs` / `scripts/run-goal-monitor-loop.mjs` - scheduled, launchd, and visible background goal monitors for open intake issues, AI jingle orders, and ETH/SOL stablecoin/native payment signals
- `scripts/find-high-intent-leads.mjs` - GitHub issue search helper for current agent/MCP security, auth, scanner, and transport discussions; writes private lead shortlists without auto-posting
- `examples/github-action.yml` - copyable Markdown artifact workflow example
- `examples/github-code-scanning.yml` - copyable SARIF/code scanning workflow example
- `.github/FUNDING.yml` - GitHub funding link pointing to the audit sprint offer
- GitHub Discussion #1 - booking FAQ and pre-intake questions
- `reports/douban-mcp-sample-audit.md` / `reports/firecrawl-mcp-sample-audit.md` / `reports/browserbase-mcp-sample-audit.md` / `reports/sentinel-agent-dogfood-audit.md` / `reports/agentgap-agent-config-dogfood-audit.md` - sample reports based on real public repos and self-owned dogfood
- `reports/*-security-scan.html` - public Radar detail pages for selected high-intent MCP repos
- `reports/browser-use-ai-agent-security-scan.html` / `reports/openhands-ai-agent-security-scan.html` / `reports/smolagents-ai-agent-security-scan.html` / `reports/openai-agents-python-security-scan.html` - public AI Agent Radar scan briefs for high-intent agent repos
- `.github/ISSUE_TEMPLATE/audit-request.yml` / `.github/ISSUE_TEMPLATE/paid-audit-intent.yml` / `.github/ISSUE_TEMPLATE/payment-confirmation.yml` - full intake, short paid-slot, and payment proof forms
- `.github/ISSUE_TEMPLATE/ai-agent-audit.yml` - dedicated AI agent security audit intake form
- `.github/ISSUE_TEMPLATE/code-scanning-audit.yml` - SARIF/GitHub Code Scanning audit intake form
- `script.js` - local-only request brief builder and payment address copy actions
- `outreach/prospect-list.md` - initial outbound list and message
- `outreach/scanner-led-outreach.md` - safe scanner-led outreach workflow and templates
- `outreach/ai-jingle-outreach.md` - safe AI jingle outreach workflow and templates for podcasts, local businesses, radio/DJ shows, creators, and agencies
- `outreach/qualified-prospects-2026-06-19.md` - public outbound playbook without project-specific claims
- `templates/invoice.md` - invoice template for accepted audit scopes
- `templates/receipt.md` - receipt template after payment confirmation
- `templates/ai-jingle-invoice.md` / `templates/ai-jingle-receipt.md` / `templates/ai-jingle-delivery-note.md` - AI music payment and delivery templates
- `tools/agent-mcp-audit.mjs` - local heuristic scanner for agent/MCP review signals
- `assets/audit-dashboard.html` - source for the hero bitmap
- `assets/audit-dashboard.png` - generated hero bitmap
- `assets/ai-jingle-studio.svg` / `assets/ai-jingle-studio.png` - generated visual asset for the AI music offer
- `assets/audio/*.wav` / `scripts/render-jingle-samples.mjs` - reproducible public sample audio for the AI jingle package cards

## Heuristic Scanner

Run a quick local triage pass against an agent or MCP repo:

Browser:

- LLM/agent summary: https://jackjin1997.github.io/agent-audit-sprint/llms.txt
- AI jingle generator offer: https://jackjin1997.github.io/agent-audit-sprint/ai-jingle-generator.html
- AI jingle $29 hook sketch: https://jackjin1997.github.io/agent-audit-sprint/ai-jingle-hook-sketch.html
- AI commercial jingle generator: https://jackjin1997.github.io/agent-audit-sprint/ai-commercial-jingle-generator.html
- AI real estate listing music generator: https://jackjin1997.github.io/agent-audit-sprint/ai-real-estate-listing-music.html
- AI wedding video music generator: https://jackjin1997.github.io/agent-audit-sprint/ai-wedding-video-music.html
- AI podcast intro generator: https://jackjin1997.github.io/agent-audit-sprint/ai-podcast-intro-generator.html
- Podcast sponsor jingle pack: https://jackjin1997.github.io/agent-audit-sprint/podcast-sponsor-jingle.html
- AI jingle quote/payment packet: https://jackjin1997.github.io/agent-audit-sprint/ai-jingle-quote.html
- AI jingle email brief: jackjin1997@gmail.com after copying the short brief template; payment is still after written brief acceptance only
- AI agent security audit service: https://jackjin1997.github.io/agent-audit-sprint/ai-agent-security-audit-service.html
- AI Agent Security Radar: https://jackjin1997.github.io/agent-audit-sprint/ai-agent-security-radar.html
- Quick Scan package ladder: https://jackjin1997.github.io/agent-audit-sprint/quick-scan.html
- AI Agent Radar scan briefs: https://jackjin1997.github.io/agent-audit-sprint/reports/browser-use-ai-agent-security-scan.html, https://jackjin1997.github.io/agent-audit-sprint/reports/openhands-ai-agent-security-scan.html, https://jackjin1997.github.io/agent-audit-sprint/reports/smolagents-ai-agent-security-scan.html, https://jackjin1997.github.io/agent-audit-sprint/reports/openai-agents-python-security-scan.html
- Sentinel dogfood AI agent audit sample: https://jackjin1997.github.io/agent-audit-sprint/reports/sentinel-agent-dogfood-audit.html
- AgentGap dogfood agent config/MCP bridge audit sample: https://jackjin1997.github.io/agent-audit-sprint/reports/agentgap-agent-config-dogfood-audit.html
- AI agent audit intake: https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=ai-agent-audit.yml
- MCP server scan entry point: https://jackjin1997.github.io/agent-audit-sprint/mcp-server-security-scan.html
- MCP Security Radar: https://jackjin1997.github.io/agent-audit-sprint/mcp-security-radar.html
- GitHub Code Scanning workflow: https://jackjin1997.github.io/agent-audit-sprint/mcp-code-scanning-github-action.html
- Public repo URL scan: https://jackjin1997.github.io/agent-audit-sprint/scan.html
- Shareable scan link: `https://jackjin1997.github.io/agent-audit-sprint/scan.html?repo=https://github.com/org/repo`
- Private repo scan: use the local folder selector on the same page
- Audit request packet: generated after each browser scan for copy/paste into a paid audit intake
- Paid package intake: https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=paid-audit-intent.yml

Terminal:

```bash
npm exec --yes github:jackjin1997/agent-audit-sprint -- /path/to/repo
npm run audit:repo -- /path/to/repo
npm --silent run audit:repo -- /path/to/repo --json
node tools/agent-mcp-audit.mjs /path/to/repo --sarif > agent-mcp-audit.sarif
node tools/agent-mcp-audit.mjs /path/to/repo --json
node scripts/find-high-intent-leads.mjs --limit 30 --out private-notes/high-intent-leads-$(date +%F).md
```

The scanner looks for tool registration, remote transports, write actions, credential paths, auth gates, redaction, tests, and CI. It is a triage helper, not a security certification.
The Markdown output and browser-generated audit request packet include paid audit request, fixed quote, and terms links so a free scanner artifact can become an audit handoff without losing scanner evidence.
The lead finder searches current GitHub issues for explicit agent/MCP security demand signals and is designed for manual review only; it does not post comments.

Use it from GitHub Actions:

```yaml
- uses: jackjin1997/agent-mcp-code-scan-action@v1
  with:
    path: "."
    output: "agent-mcp-audit.md"
```

See [`examples/github-action.yml`](examples/github-action.yml) for a complete workflow.

Use GitHub Code Scanning:

```yaml
- uses: jackjin1997/agent-mcp-code-scan-action@v1
  with:
    path: "."
    sarif: "true"
    output: "agent-mcp-audit.sarif"
- uses: github/codeql-action/upload-sarif@v4
  with:
    sarif_file: agent-mcp-audit.sarif
```

See [`examples/github-code-scanning.yml`](examples/github-code-scanning.yml) for a complete workflow.
The standalone action repository is available at https://github.com/jackjin1997/agent-mcp-code-scan-action and has a passing `@v1` smoke workflow.
When Code Scanning findings justify human review, use the dedicated intake:
https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=code-scanning-audit.yml

## Local Preview

Open `index.html` directly in a browser or serve the directory with any static file server.

## Payment Ops

Use `templates/invoice.md` after accepting audit scope, or `templates/ai-jingle-invoice.md` after accepting an AI jingle brief. Crypto payment can use ETH or ERC-20 USDC/USDT/DAI on Ethereum, or SOL or SPL USDC on Solana. Use `templates/receipt.md` for audit receipts and `templates/ai-jingle-receipt.md` for AI jingle receipts after the buyer provides a verifiable transaction hash.

Run the goal monitor manually with:

```bash
node scripts/check-goal-status.mjs
```

Install or refresh the visible local 15-minute macOS launchd loop with:

```bash
node scripts/install-goal-monitor-launchd.mjs
```

The visible loop writes `private-notes/monitor/goal-monitor-loop.pid` and `private-notes/monitor/goal-monitor-loop-heartbeat.json`, so it can be inspected with `ps -p "$(cat private-notes/monitor/goal-monitor-loop.pid)" -o pid,ppid,etime,command`.

The scheduled GitHub Action runs every 4 hours and fails only when an open issue or likely payment signal needs attention. The local launchd loop stays resident, checks every 15 minutes, writes `private-notes/monitor/latest-goal-status.txt`, appends `logs/goal-monitor-history.log`, and shows a macOS notification when attention is required. The monitor treats USD $29+ as a small-package payment signal so first AI jingle orders are not missed, while the revenue goal remains USD $1,000. Revenue is still counted only after payment is verified against an accepted written scope or accepted jingle brief.

## npm Publishing

The package name `agent-mcp-audit` is currently available, but this machine is not logged in to npm. After npm login, publish with:

```bash
npm publish --registry https://registry.npmjs.org/
```

After publish, the public CLI command will be:

```bash
npx agent-mcp-audit /path/to/repo
```
