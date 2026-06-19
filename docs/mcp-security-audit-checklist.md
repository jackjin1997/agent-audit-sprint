# MCP Security Audit Checklist

Practical pre-launch checklist for MCP servers, agent tools, and tool-using products.

## 1. Tool Inventory

- List every tool, resource, prompt, and external API call.
- Classify each path as read-only, write, destructive, privileged, or external.
- Document which tools are disabled by default and which require operator opt-in.

## 2. Transport Exposure

- State whether stdio, local HTTP, remote HTTP, SSE, or WebSocket transports are supported.
- Document bind address, trusted clients, proxy layer, CORS/origin assumptions, and TLS expectations.
- Fail closed when remote mode is enabled without an explicit exposure policy.

## 3. Auth And Session Boundaries

- Separate user identity, app identity, tool permission, and provider token scopes.
- Check auth failures for each transport and each write-capable tool.
- Make session expiry, refresh, revocation, and tenant isolation visible in tests.

## 4. Write Action Controls

- Gate write, delete, publish, send, transfer, and execute actions behind explicit config.
- Use dry-run or preview modes for high-impact operations.
- Test that write tools are absent or blocked when the safe mode is active.

## 5. Schema And Input Constraints

- Constrain strings with length, format, enum, and path rules where possible.
- Reject path traversal, command fragments, unexpected URLs, and oversized payloads.
- Keep tool descriptions clear enough that agents do not infer hidden permissions.

## 6. Secret Handling

- Redact provider keys, cookies, Authorization headers, private keys, and account tokens.
- Apply redaction to logs, thrown errors, telemetry, tool output, and report artifacts.
- Test real object shapes from HTTP clients, SDK errors, and config loaders.

## 7. Prompt And Tool Injection

- Treat tool output, retrieved documents, web pages, tickets, and logs as untrusted data.
- Keep instructions separate from data when returning external content to an agent.
- Test malicious tool output that asks the agent to call privileged tools or reveal secrets.

## 8. Release Gate

- Run install, lint, typecheck, focused tests, and the heuristic scanner in CI.
- Keep a launch note that lists accepted risks, owner, monitoring, and rollback path.
- Block release when auth, secret redaction, or write-mode tests are missing.

## Paid Human Review

The fixed-price Agent/MCP Audit Sprint turns this checklist into a ranked report for one repo or product slice.

- Price: USD $1,000
- Public GitHub repo intakes receive an automated no-execution scanner triage comment
- Sample reports:
  - https://jackjin1997.github.io/agent-audit-sprint/reports/douban-mcp-sample-audit.html
  - https://jackjin1997.github.io/agent-audit-sprint/reports/firecrawl-mcp-sample-audit.html
- Terms: https://jackjin1997.github.io/agent-audit-sprint/terms.html
- Intake: https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml
