# AI Agent Security Audit Service

Fixed-price human review for one AI agent, MCP server, or tool-using product slice.

- Price: USD $1,000
- Turnaround target: 48 hours after written scope acceptance and payment confirmation
- Output: boundary map, ranked findings, test plan, and launch notes
- Service page: https://jackjin1997.github.io/agent-audit-sprint/ai-agent-security-audit-service.html
- Browser scanner for public GitHub URLs and private local files: https://jackjin1997.github.io/agent-audit-sprint/scan.html
- GitHub Code Scanning/SARIF guide: https://jackjin1997.github.io/agent-audit-sprint/mcp-code-scanning-github-action.html
- MCP server security scan entry point: https://jackjin1997.github.io/agent-audit-sprint/mcp-server-security-scan.html
- Fixed quote: https://jackjin1997.github.io/agent-audit-sprint/quote.html
- Intake: https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml
- Short slot reservation: https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=paid-audit-intent.yml
- Terms: https://jackjin1997.github.io/agent-audit-sprint/terms.html

## Review Areas

- Tool inventory, write/destructive classification, and human approval gates
- Prompt injection and tool output injection from web pages, tickets, docs, logs, memory, and RAG content
- Credential loading, token scope, secret redaction, and agent-readable error or log exposure
- Auth and tenant boundaries across users, workspaces, sessions, and connected providers
- Browser automation risks around authenticated sessions, clicks, downloads, form submission, and JavaScript execution
- Tests, CI, rollback notes, and launch gates that prove high-impact tools fail closed

## Good Fit

- AI agents that can send messages, edit files, publish content, place orders, query databases, control browsers, or call cloud APIs
- Teams adding MCP, function calling, LangGraph, hosted tool execution, RAG, browser automation, or workspace integrations
- Launching products that need a ranked security fix plan, not a broad compliance project
- Public repos, private repo access, sanitized docs, traces, SARIF findings, or focused product slices that can be reviewed without secrets

## Flow

1. Open an intake issue with repo/product URL, scope, evidence, delivery visibility, payment network, and highest concern.
2. Optionally attach browser scanner output, SARIF alerts, traces, or sanitized architecture notes.
3. Scope is accepted in writing for one repo, agent, MCP server, or product slice.
4. Pay USD $1,000 equivalent only after scope acceptance, or agree an invoice-first path before work starts.
5. The 48-hour target starts after both scope acceptance and payment confirmation.
