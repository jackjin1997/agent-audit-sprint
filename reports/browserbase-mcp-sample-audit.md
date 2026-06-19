# Sample Audit: browserbase/mcp-server-browserbase

This sample shows the kind of output included in the $1,000 Agent/MCP Audit Sprint. It is based on public code from `browserbase/mcp-server-browserbase` at commit `1e196b3d3c4dc70944e0d19038dd9eb3608b207a` dated 2026-05-05.

This is an independent public-code sample, not a commissioned review and not a private vulnerability disclosure. No Browserbase sessions, customer data, credentials, hosted MCP endpoints, or live websites were used.

## Scope

- STDIO and Streamable HTTP transport setup
- Browserbase and model credential configuration
- Browser session lifecycle tools
- Browser navigation, action, observe, and extract tools
- Tool schemas and test coverage
- CI, build, and evaluation gate shape

Out of scope for this sample: Browserbase production infrastructure, hosted MCP service behavior, live Browserbase account authorization, external website interaction, customer data, and unpublished branches.

## Validation Performed

The source was downloaded through the GitHub API tarball endpoint because this environment's HTTPS git transport intermittently fails.

```bash
gh api /repos/browserbase/mcp-server-browserbase/tarball/main
corepack pnpm --dir /tmp/agent-audit-browserbase install --frozen-lockfile
corepack pnpm --dir /tmp/agent-audit-browserbase build
BROWSERBASE_API_KEY=test-key BROWSERBASE_PROJECT_ID=test-project corepack pnpm --dir /tmp/agent-audit-browserbase test
node tools/agent-mcp-audit.mjs /tmp/agent-audit-browserbase
```

Observed result:

- `pnpm install --frozen-lockfile` passed.
- `pnpm build` passed.
- `pnpm test` passed: 3 test files, 15 tests.
- The heuristic scanner scored the repo 72/100 and flagged transport, browser-action, credential/logging, and release-gate review areas.
- Secret-backed evals were not run because they require real Browserbase and model provider credentials.

## Executive Summary

`mcp-server-browserbase` has a clean, focused MCP surface: six tools match the hosted Browserbase MCP server, inputs use Zod schemas, tests assert tool names and schema behavior, and the self-hosted server supports both stdio and Streamable HTTP. The local build and tests passed in this sample review.

The highest-value review work is around launch and operator boundaries rather than obvious missing code structure. Browser automation MCP servers sit at a sensitive boundary: an agent can navigate authenticated sessions, act on web pages, observe actionable elements, and extract page data. The repo should make transport exposure, session persistence, log sensitivity, and secret-backed evaluation behavior hard to misconfigure before teams deploy it beyond local use.

## Boundary Map

| Area | Evidence | Risk Notes |
|---|---|---|
| Transport | `src/transport.ts`, `README.md`, `src/config.ts` | STDIO and HTTP/SHTTP are supported. The HTTP server binds to the configured `host`; docs say default is localhost and `0.0.0.0` binds all interfaces. |
| MCP tool surface | `src/index.ts`, `src/tools/index.ts` | Six tools are registered: `start`, `end`, `navigate`, `act`, `observe`, and `extract`. |
| Browser sessions | `src/sessionManager.ts`, `src/tools/session.ts` | Session creation uses Browserbase and Stagehand; context IDs and persistence are configurable. |
| Browser actions | `src/tools/navigate.ts`, `src/tools/act.ts`, `src/tools/observe.ts`, `src/tools/extract.ts` | `navigate` opens URLs, `act` performs natural-language page actions, `observe` finds actionable elements, and `extract` returns page data. |
| Credentials | `src/config.ts`, `src/sessionManager.ts`, `README.md` | Browserbase, project, Gemini/Google, and custom model keys are loaded from env/CLI/config. Custom model usage requires a model API key in the schema. |
| Logging | `src/context.ts`, `src/sessionManager.ts` | Tool args, session lifecycle events, Browserbase session IDs, and live debugger URLs are written to stderr. |
| Tests and CI | `src/config.test.ts`, `src/tools/__tests__/tools.test.ts`, `tests/smoke.test.ts`, `.github/workflows/ci.yml` | Unit and smoke tests exist and passed locally. CI also runs secret-backed evals after build/test. |

## Findings

### Medium: HTTP transport needs an operator-facing exposure matrix

Evidence: `README.md` documents SHTTP and `--host`; `src/config.ts` exposes `server.host`; `src/transport.ts` starts an HTTP server, creates per-session Streamable HTTP transports, and prints client config for `/mcp`.

Impact: The defaults and docs point users toward local/self-hosted use, but browser automation is high-impact when exposed remotely. A team moving from local stdio to HTTP, Docker, or a reverse proxy should not have to infer which network boundary, auth layer, and session assumptions are expected.

Recommended fix:

- Add a "Transport exposure matrix" covering hosted MCP, stdio self-hosted, local HTTP, Docker, and any reverse-proxy deployment.
- State the safe default host, when `0.0.0.0` is appropriate, what external auth/proxy layer is required, and whether Browserbase credentials are shared across clients.
- Add a startup summary that prints transport, host, port, context persistence mode, and whether credentials came from env/config without printing secret values.

### Medium: Browser action tools need explicit launch-mode policy

Evidence: `navigate` accepts an arbitrary URL string, `act` accepts natural-language page actions, `observe` returns actionable elements, and `extract` returns page data. These tools are intentionally powerful and map to the hosted MCP server.

Impact: This is the product value, but it also means an MCP client can operate inside browser sessions that may include authenticated state. The repo should make it obvious which launch modes are safe for exploratory browsing, which are safe for logged-in sessions, and what an operator should disable or isolate when untrusted instructions or untrusted web pages are present.

Recommended fix:

- Add a "Session risk modes" section for anonymous browsing, authenticated browsing, persistent context, and verified identity.
- Document when to isolate Browserbase projects, contexts, and model provider keys per user or environment.
- Add tests or examples showing how a deployment can disable or wrap `act` while keeping `observe` / `extract` available for read-mostly use cases.

### Low: Operational logs should be treated as sensitive artifacts

Evidence: `Context.run` logs tool name and serialized args; `SessionManager` logs session lifecycle, Browserbase session IDs, and live debugger URLs; tool failures are returned as text content.

Impact: These logs are useful for debugging, but browser automation args may contain private URLs, instructions, or page context. Browserbase session IDs and live debugger URLs are also operationally sensitive. Teams deploying this in shared CI, hosted logs, or support workflows need a clear retention and redaction story.

Recommended fix:

- Add a log-sensitivity note in the README covering tool args, Browserbase session IDs, debugger URLs, and model/API error messages.
- Consider a `--quiet` or structured logging mode that redacts URL query strings and session IDs.
- Add regression tests for error formatting so provider errors and tool output do not accidentally include API keys or cookies.

### Low: Secret-backed evals should be separated from public CI expectations

Evidence: `.github/workflows/ci.yml` runs install, lint, format, build, tests, then `pnpm evals` with Browserbase/model provider secrets. Local unit and smoke tests passed with dummy Browserbase values; evals were not run in this sample because real secrets are required.

Impact: Secret-backed evals are a positive signal for maintainers, but external contributors and release operators need a clear distinction between "public validation should pass" and "internal evals require service credentials." Otherwise launch readiness can be hard to reproduce outside the maintainer environment.

Recommended fix:

- Split public CI and secret-backed evals into separate jobs with clear names.
- Skip evals when required secrets are absent, or document that they are maintainer-only.
- Publish the minimum local validation command set: install, lint, build, unit tests, smoke test, and optional evals.

## Positive Signals

- The MCP surface is intentionally small and testable: six named tools.
- Tool input schemas reject empty `url`, `action`, and `instruction` values where appropriate.
- Tests verify removed legacy tools are not exposed.
- `configSchema` requires `modelApiKey` when a non-default model is explicitly configured.
- Local build and tests passed in this sample.
- Session cleanup handles concurrent cleanup attempts and always removes cleanup tracking.
- HTTP sessions use generated session IDs and remove sessions on transport close.
- The README clearly distinguishes hosted MCP from self-hosted stdio use.

## Priority Fix Plan

1. Add a transport exposure matrix and startup summary for self-hosted HTTP/SHTTP.
2. Add a session risk-mode section for authenticated browsing, persistent context, and verified identity.
3. Add log sensitivity and redaction guidance for tool args, URLs, session IDs, and debugger URLs.
4. Split public CI from secret-backed evals or document the secret-backed job behavior.
5. Add example wrappers or config guidance for deployments that want observe/extract without unrestricted act.

## Example Validation Commands

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm build
BROWSERBASE_API_KEY=test-key BROWSERBASE_PROJECT_ID=test-project corepack pnpm test
node tools/agent-mcp-audit.mjs /path/to/mcp-server-browserbase --sarif > agent-mcp-audit.sarif
```

## What the Paid Sprint Adds

The paid sprint would go deeper than this public sample: focused tests against the repo's actual CI shape, a deployment-mode threat table, log-redaction checks, recommended wrapper policy for browser actions, issue-ready remediation text, and a concise launch handoff for owners.
