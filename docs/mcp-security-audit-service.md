# MCP Security Audit Service

Fixed-price human review for one MCP server, agent tool surface, or tool-using product slice.

- Price: USD $1,000
- Turnaround target: 48 hours after scope acceptance and payment confirmation
- Output: boundary map, ranked findings, test plan, launch notes
- Intake: https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml
- Terms: https://jackjin1997.github.io/agent-audit-sprint/terms.html

## Review Areas

- Tool inventory and read/write/destructive classification
- Remote transport exposure, bind address, CORS/origin, TLS, and proxy assumptions
- Auth boundaries across user identity, provider tokens, and tool permissions
- Secret redaction across logs, errors, telemetry, and agent-readable output
- Input schema constraints for paths, URLs, command fragments, and oversized payloads
- Prompt/tool injection tests using malicious external content and tool output

## Good Fit

- MCP servers with write tools, account mutation, messaging, publishing, file access, database access, browser control, or shell execution
- Teams moving from local stdio use to remote HTTP, SSE, WebSocket, hosted cloud, or multi-tenant deployment
- Launching projects that need a ranked fix plan, not a broad compliance project
- Public repos, private repo access, sanitized docs, or focused product slices that can be reviewed without secrets

## Flow

1. Open an intake issue with repo/product URL, scope, delivery visibility, payment network, and highest concern.
2. Scope is accepted for one repo or product slice.
3. Pay USD $1,000 equivalent via Ethereum or Solana and reply with the transaction hash.
4. The 48-hour target starts after payment confirmation and scope acceptance.
