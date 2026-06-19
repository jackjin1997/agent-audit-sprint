# Qualified Prospects: Agent/MCP Audit Sprint

Generated: 2026-06-19

Rules for use:

- Do not spam. Send only to projects where the audit is clearly relevant.
- Do not post the scanner output as a public accusation. Phrase it as a private/friendly launch-readiness review offer.
- Do not claim a vulnerability from the heuristic scanner alone. Use "risk surface" and "review candidate" language.
- Ask for payment before doing private work. Count revenue only after payment is verified.

## Offer Link

- Landing page: https://jackjin1997.github.io/agent-audit-sprint/
- Sample report: https://jackjin1997.github.io/agent-audit-sprint/reports/douban-mcp-sample-audit.html
- Intake: https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml

## Highest-Intent Prospects

| Priority | Project | Why It Fits | Suggested Hook |
|---:|---|---|---|
| 1 | `alpacahq/alpaca-mcp-server` | Trading MCP server; tool mistakes can place orders or expose brokerage credentials. | "I do fixed-price launch-readiness audits for MCP servers with account-level write actions. Alpaca's MCP surface is exactly the kind of trading/tool-boundary system this is built for." |
| 2 | `korotovsky/slack-mcp-server` | Slack DMs, channel history, and message actions are high-trust workspace surfaces. | "Slack MCP servers need unusually clear permission, redaction, and write-action boundaries because workspace messages are sensitive even when API scopes are minimal." |
| 3 | `Softeria/ms-365-mcp-server` | Microsoft 365 Graph tools can touch mail, calendar, drive, tasks, and org data. | "M365 MCP servers have a large blast radius; a compact third-party audit can check transport exposure, token handling, and write-tool defaults before broader adoption." |
| 4 | `taylorwilsdon/google_workspace_mcp` | Gmail, Calendar, Docs, Sheets, Drive, and Chat tools are account-level and high-value. | "Google Workspace MCP tools combine secrets, write actions, and sensitive content. I can review the tool boundary and launch docs in a 48-hour sprint." |
| 5 | `stickerdaniel/linkedin-mcp-server` | LinkedIn profiles, companies, jobs, and messages imply account and messaging risk. | "Messaging-capable social MCP servers benefit from explicit write confirmations, rate-limit behavior, and account-risk docs." |
| 6 | `browserbase/mcp-server-browserbase` | Browser automation can read, click, submit forms, and bridge private sessions. | "Browser-control MCP servers need strong operator-facing docs around what the agent can transmit or click. I audit those boundaries." |
| 7 | `apify/apify-mcp-server` | Web automation/scraping with third-party actors and account/API keys. | "Apify MCP combines tool orchestration, credentials, and external actions. A focused audit can catch launch docs and safety gaps without a long consulting cycle." |
| 8 | `designcomputer/mysql_mcp_server` | Database access, query execution, and credential scope. | "Database MCP servers need a crisp read/write boundary, query policy, and credential story. I can review that slice and produce issue-ready fixes." |
| 9 | `mongodb-js/mongodb-mcp-server` | Database access and Atlas credentials; likely enterprise interest. | "MongoDB MCP users will care about credential handling, query boundaries, and deployment posture. My sprint is designed around those checks." |
| 10 | `containers/kubernetes-mcp-server` | Kubernetes/OpenShift command surface can mutate production infrastructure. | "Kubernetes MCP tools need explicit destructive-action hints, context safeguards, and remote transport assumptions. I can audit one release slice." |
| 11 | `ariadng/metatrader-mcp-server` | Trading systems are the clearest $1,000-value risk surface. | "If agents can trade, the audit value is obvious: account credentials, order placement, dry-run defaults, and confirmations." |
| 12 | `irinabuht12-oss/google-meta-ads-ga4-mcp` | Ad campaign tools can spend money or alter analytics/reporting. | "Ads MCP tools have direct spend and account-risk implications. I can review write-tool safety and launch docs quickly." |

## Scanner-Backed Hooks

These are heuristic results from local scans. Use only as private context for tailoring, not as public vulnerability claims.

### alpacahq/alpaca-mcp-server

Local scanner summary:

- Score: 62/100
- High: credential signals without obvious redaction signals
- Medium: remote listener needs explicit exposure policy
- Medium: write actions should have confirmation and test coverage

Suggested message:

```text
Hi Alpaca team,

I do fixed-price Agent/MCP audit sprints for tool-using products. Alpaca's MCP server is a strong fit because trading tools combine account credentials, market-data access, and order/write actions.

The audit is $1,000 and produces a ranked report covering tool boundaries, auth/secrets, write-action safety, tests, and launch/deployment assumptions. Turnaround is 48 hours for one repo or product slice.

Sample report: https://jackjin1997.github.io/agent-audit-sprint/reports/douban-mcp-sample-audit.html
Offer: https://jackjin1997.github.io/agent-audit-sprint/

If useful, you can start here:
https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml
```

### korotovsky/slack-mcp-server

Local scanner summary:

- Score: 54/100
- High: write actions without obvious tool safety annotations
- High: credential signals without obvious redaction signals
- Medium: remote listener needs explicit exposure policy

Suggested message:

```text
Hi,

I run compact launch-readiness audits for MCP servers. Your Slack MCP server is a strong fit because it touches workspace messages, DMs, history, and app-level auth where permission and write boundaries matter a lot.

The sprint is fixed at $1,000. Output: ranked findings, evidence, fix plan, and tests/docs recommendations around tool boundaries, secrets, auth, write actions, and transport exposure.

Sample report: https://jackjin1997.github.io/agent-audit-sprint/reports/douban-mcp-sample-audit.html
Offer: https://jackjin1997.github.io/agent-audit-sprint/
```

### Softeria/ms-365-mcp-server

Local scanner summary:

- Score: 72/100
- Medium: remote listener needs explicit exposure policy
- Medium: write actions should have confirmation and test coverage
- Low: credential paths detected; redaction appears present

Suggested message:

```text
Hi Softeria team,

I do $1,000 fixed-price audits for Agent/MCP products. Microsoft 365 MCP is a high-value surface because Graph tools can touch mail, calendar, drive, tasks, and org data.

The sprint checks transport exposure, auth/secrets, write-tool defaults, prompt/tool injection paths, test coverage, and launch docs. It is designed as a 48-hour practical review, not a long compliance engagement.

Sample report: https://jackjin1997.github.io/agent-audit-sprint/reports/douban-mcp-sample-audit.html
Intake: https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml
```

## General Short Message

```text
Hi,

I do fixed-price Agent/MCP audit sprints for teams shipping tool-using AI products.

For $1,000, I review one repo or product slice and deliver a ranked report covering tool boundaries, auth/secrets, write-action safety, prompt/tool injection paths, tests, and deployment assumptions.

Sample report: https://jackjin1997.github.io/agent-audit-sprint/reports/douban-mcp-sample-audit.html
Offer: https://jackjin1997.github.io/agent-audit-sprint/

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
