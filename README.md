# Agent/MCP Audit Sprint

Static landing page and sales assets for a $1,000 fixed-price engineering audit service.

Live target after GitHub Pages is enabled:

https://jackjin1997.github.io/agent-audit-sprint/

## Offer

- 48-hour async audit for one agent, MCP server, or tool-using product slice
- Ranked findings with evidence, impact, and fix plan
- Review areas: tool boundaries, secrets, auth, write actions, prompt/tool injection, tests, deployment assumptions
- Payment-ready via ETH or SOL addresses, with invoice-first discussion available before work starts

## Files

- `index.html` - public landing page
- `mcp-security-audit-service.html` / `docs/mcp-security-audit-service.md` - commercial intent service page
- `checklist.html` / `docs/mcp-security-audit-checklist.md` - MCP security audit checklist content page
- `robots.txt` / `sitemap.xml` - static search metadata
- `terms.html` / `templates/statement-of-work.md` - statement of work and scope/payment terms
- `action.yml` - reusable GitHub Action wrapper for the heuristic scanner
- `.github/workflows/triage-audit-request.yml` / `scripts/comment-audit-triage.mjs` - automated free triage comment for new audit intake issues
- `examples/github-action.yml` - copyable workflow example
- `.github/FUNDING.yml` - GitHub funding link pointing to the audit sprint offer
- GitHub Discussion #1 - booking FAQ and pre-intake questions
- `reports/douban-mcp-sample-audit.md` / `reports/firecrawl-mcp-sample-audit.md` - sample reports based on real public repos
- `.github/ISSUE_TEMPLATE/audit-request.yml` - intake form
- `script.js` - local-only request brief builder and payment address copy actions
- `outreach/prospect-list.md` - initial outbound list and message
- `outreach/qualified-prospects-2026-06-19.md` - public outbound playbook without project-specific claims
- `templates/invoice.md` - invoice template for accepted audit scopes
- `templates/receipt.md` - receipt template after payment confirmation
- `tools/agent-mcp-audit.mjs` - local heuristic scanner for agent/MCP review signals
- `assets/audit-dashboard.html` - source for the hero bitmap
- `assets/audit-dashboard.png` - generated hero bitmap

## Heuristic Scanner

Run a quick local triage pass against an agent or MCP repo:

```bash
npm run audit:repo -- /path/to/repo
npm --silent run audit:repo -- /path/to/repo --json
node tools/agent-mcp-audit.mjs /path/to/repo --json
```

The scanner looks for tool registration, remote transports, write actions, credential paths, auth gates, redaction, tests, and CI. It is a triage helper, not a security certification.
The Markdown output includes paid audit request and terms links so a free scanner artifact can become an audit handoff.

Use it from GitHub Actions:

```yaml
- uses: jackjin1997/agent-audit-sprint@v1
  with:
    path: "."
    output: "agent-mcp-audit.md"
```

See [`examples/github-action.yml`](examples/github-action.yml) for a complete workflow.

## Local Preview

Open `index.html` directly in a browser or serve the directory with any static file server.

## Payment Ops

Use `templates/invoice.md` after accepting scope. Use `templates/receipt.md` after the buyer provides a verifiable transaction hash.

## npm Publishing

The package name `agent-mcp-audit` is currently available, but this machine is not logged in to npm. After npm login, publish with:

```bash
npm publish --registry https://registry.npmjs.org/
```

After publish, the public CLI command will be:

```bash
npx agent-mcp-audit /path/to/repo
```
