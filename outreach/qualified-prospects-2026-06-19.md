# Outbound Playbook: Agent/MCP Audit Sprint

Generated: 2026-06-19

This public playbook explains how to sell the audit sprint without posting project-specific scanner results or making unverified vulnerability claims.

## Rules

- Send only to projects where the audit is clearly relevant.
- Do not post heuristic scanner output as a public accusation.
- Do not claim a vulnerability from scanner output alone. Use "risk surface" and "review candidate" language.
- Ask for payment before beginning private work.
- Count revenue only after payment is verified.

## Best-Fit Categories

| Priority | Category | Why It Fits | Suggested Hook |
|---:|---|---|---|
| 1 | Trading and finance MCP servers | Tool mistakes can place orders, alter strategies, or expose brokerage credentials. | "If agents can trade, the audit value is obvious: account credentials, order placement, dry-run defaults, and confirmations." |
| 2 | Workspace, email, calendar, and social messaging MCP servers | These tools touch sensitive user and organization data. | "Workspace MCP servers need unusually clear permission, redaction, and write-action boundaries." |
| 3 | Database, Kubernetes, and cloud MCP servers | These tools can read or mutate infrastructure and production data. | "Infrastructure MCP tools need explicit destructive-action hints, context safeguards, and remote transport assumptions." |
| 4 | Browser automation and scraping MCP servers | Agents can click, submit forms, transmit data, or bridge private sessions. | "Browser-control MCP servers need strong operator-facing docs around what an agent can transmit or click." |
| 5 | MCP gateways and aggregators | Broad tool exposure creates policy, routing, and authorization risk. | "Gateways need clear tool policy, auth boundaries, and safe defaults across many downstream tools." |

## General Short Message

```text
Hi,

I do fixed-price Agent/MCP audit sprints for teams shipping tool-using AI products.

For $1,000, I review one repo or product slice and deliver a ranked report covering tool boundaries, auth/secrets, write-action safety, prompt/tool injection paths, tests, and deployment assumptions.

Offer: https://jackjin1997.github.io/agent-audit-sprint/
Sample reports: https://jackjin1997.github.io/agent-audit-sprint/samples.html
Trading MCP page: https://jackjin1997.github.io/agent-audit-sprint/trading-mcp-security-audit.html
Workspace MCP page: https://jackjin1997.github.io/agent-audit-sprint/workspace-mcp-security-audit.html
Cloud/database MCP page: https://jackjin1997.github.io/agent-audit-sprint/cloud-database-mcp-security-audit.html
Browser automation MCP page: https://jackjin1997.github.io/agent-audit-sprint/browser-automation-mcp-security-audit.html

Public GitHub repo intakes get an automated no-execution scanner triage comment before paid scope acceptance.

If useful, open an intake issue here:
https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml
```

## Send Order

1. Trading and finance MCP servers: highest value and clearest ROI.
2. Workspace/email/calendar/social messaging MCP servers: high trust and high blast radius.
3. Database/Kubernetes/cloud MCP servers: infrastructure and credential risk.
4. Browser automation and scraping MCP servers: transmission/click/action risk.
5. MCP gateways and aggregators: broad tool exposure and policy surface.

## Follow-Up Cadence

- Day 0: Send short message with sample report.
- Day 2: One follow-up with a concrete review angle.
- Day 7: Close loop with "no worries if not relevant."

Do not send more than two follow-ups.
