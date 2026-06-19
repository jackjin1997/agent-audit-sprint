# Agent/MCP Audit Sprint

Static landing page and sales assets for a $1,000 fixed-price engineering audit service.

Live target after GitHub Pages is enabled:

https://jackjin1997.github.io/agent-audit-sprint/

## Offer

- 48-hour async audit for one agent, MCP server, or tool-using product slice
- Ranked findings with evidence, impact, and fix plan
- Review areas: tool boundaries, secrets, auth, write actions, prompt/tool injection, tests, deployment assumptions
- Payment-ready via ETH or SOL addresses on the page

## Files

- `index.html` - public landing page
- `reports/douban-mcp-sample-audit.md` - sample report based on a real public repo
- `.github/ISSUE_TEMPLATE/audit-request.yml` - intake form
- `outreach/prospect-list.md` - initial outbound list and message
- `outreach/qualified-prospects-2026-06-19.md` - prioritized prospect list with tailored drafts
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

## Local Preview

Open `index.html` directly in a browser or serve the directory with any static file server.
