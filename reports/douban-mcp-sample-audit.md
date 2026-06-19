# Sample Audit: jackjin1997/douban-mcp

This sample shows the kind of output included in the $1,000 Agent/MCP Audit Sprint. It is based on public code from `jackjin1997/douban-mcp` at commit `452db35dc9a80742a3be243531beeb8edb88a080` dated 2026-05-10.

## Scope

- MCP server registration and tool metadata
- CLI and stdio/SSE entry points
- Cookie and write-action handling
- Secret redaction and error boundaries
- Tests and launch documentation surface

Out of scope for this sample: private credentials, live Douban account behavior, unpublished branches, and production traffic.

## Executive Summary

`douban-mcp` has a solid agent-facing shape: one tool registry feeds CLI and MCP surfaces, write tools are opt-in, write actions are marked destructive, and common cookie values are redacted in structured logs. The main launch risk is not a missing code primitive; it is operator exposure. Remote SSE mode, write enablement, and cookie readiness should be documented and tested as explicit deployment states before broader distribution.

## Boundary Map

| Area | Evidence | Risk Notes |
|---|---|---|
| Tool registry | `src/tools/registry.ts` | Single source for CLI/MCP tools reduces schema drift. |
| MCP registration | `src/server.ts` | Zod object shape is passed to SDK; handlers parse args before execution. |
| Write tools | `src/tools/mutation.ts` | `destructiveHint` is present; tools require auth and env-level enablement. |
| Cookie handling | `src/auth/CookieManager.ts`, `src/datasources/HtmlDataSource.ts` | `dbcl2` identifies login, `ck` token required before writes. |
| Remote transport | `src/server-entry.ts` | SSE mode starts an HTTP server on the requested port with no app-level auth. |
| Error handling | `src/tools/_boundary.ts`, `src/utils/logger.ts` | Known domain errors are mapped; unknown errors are logged through pino redaction. |

## Findings

### High: Remote SSE deployment policy is underspecified

Evidence: `src/server-entry.ts` starts an HTTP server when `--transport sse` is selected and logs `SSE listening on http://localhost:${opts.port}/sse`.

Impact: For local use this is reasonable. In container, tunnel, or reverse-proxy deployments, the same command can become remotely reachable. Because MCP tools may expose authenticated account operations when `DOUBAN_COOKIE` and `DOUBAN_ENABLE_WRITE=true` are present, deployment docs should state that SSE is local-only unless protected by network policy or an authenticated proxy.

Recommended fix:

- Bind explicitly to loopback for local mode or document the current binding behavior.
- Add README deployment language: never expose SSE with write tools enabled without upstream auth.
- Add a smoke test or launch checklist item for transport, bind address, and write mode.

### Medium: Write enablement is safe by code path, but operator confirmation is too implicit

Evidence: `src/tools/registry.ts` registers mutation tools only when `enableWrite` is true. `src/server-entry.ts` refuses `DOUBAN_ENABLE_WRITE=true` without a cookie. `src/tools/mutation.ts` marks actions with `destructiveHint: true`.

Impact: The code has the right gates, but agent operators may not understand that enabling writes lets a connected client mutate a real Douban account. This should be called out near every setup path, not only in the main README.

Recommended fix:

- In `examples/claude-desktop-config.json`, keep write mode omitted or explicitly false.
- Add "write mode checklist" near MCP client setup: account, cookie source, intended client, network exposure, rollback.
- Add tests that assert mutation tools are absent unless `enableWrite` is true.

### Low: Cookie readiness should distinguish login from write-token readiness

Evidence: `CookieManager.hasLogin()` checks `dbcl2`, while write methods separately require `ck`.

Impact: This split is fine internally, but user-facing diagnostics can report a cookie as valid even when write actions will fail due to a missing `ck` token.

Recommended fix:

- Add a `hasWriteToken()` helper.
- Update `doctor` output to include `login_cookie` and `write_token`.
- Keep the current write-time `ck` guard.

### Low: Unknown CLI fatal errors can bypass the friendly renderer

Evidence: `src/index.ts` catches top-level failures and prints `fatal` plus the raw error object. Tool-level errors use `renderError`, but bootstrap failures can still hit the top-level catch.

Impact: Most axios-related tool failures are normalized before this catch. Bootstrap and unexpected initialization errors could still be noisy or include implementation details.

Recommended fix:

- Route top-level errors through a small bootstrap formatter.
- Keep structured logging on stderr, but avoid raw object output in user-facing CLI text.

## Positive Signals

- `src/utils/logger.ts` defines redaction paths for common cookie locations under top-level, config, request, response, and serialized error shapes.
- `src/datasources/HtmlDataSource.ts` locks write operations for the process after 401/403 risk-control responses.
- `shareToFeed` defaults false in the mutation schema.
- The README clearly warns about account risk and write mode requirements.
- The project includes unit, integration, e2e, stdio, and CLI tests.

## Priority Fix Plan

1. Document and test SSE exposure assumptions before promoting remote usage.
2. Add write-mode checklist to all MCP client setup examples.
3. Split `doctor` diagnostics into login readiness and write readiness.
4. Add registry tests for mutation tool absence/presence by env state.
5. Normalize top-level CLI bootstrap errors.

## Example Validation Commands

```bash
pnpm test __tests__/unit/tools/registry.test.ts
pnpm test __tests__/integration/server-bootstrap.test.ts
pnpm test __tests__/e2e/stdio.test.ts
pnpm typecheck
```

## What the Paid Sprint Adds

The paid sprint would go deeper than this public sample: live local reproduction where possible, a full threat/risk table, issue-ready fix text, test cases written to match the repository's stack, and a launch handoff for the owner.
