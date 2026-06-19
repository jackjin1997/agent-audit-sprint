# Sample Audit: firecrawl/firecrawl-mcp-server

This sample shows the kind of output included in the $1,000 Agent/MCP Audit Sprint. It is based on public code from `firecrawl/firecrawl-mcp-server` at commit `980a76f31f93e865fe6c6636eb938995e1d3444b` dated 2026-06-19.

This is an independent public-code sample, not a commissioned review and not a private vulnerability disclosure. No Firecrawl API calls, customer data, credentials, or live endpoint tests were used.

## Scope

- MCP server startup and transport selection
- OAuth/API-key credential handling
- Tool schemas and safety annotations
- Open-web scrape/search/crawl/interact/monitor tools
- Local file parse tool boundary
- CI, build, and test surface

Out of scope for this sample: private infrastructure, production deployment config, Firecrawl account behavior, live API authorization, rate-limit enforcement, customer data, and unpublished branches.

## Validation Performed

```bash
git clone --depth 1 https://github.com/firecrawl/firecrawl-mcp-server.git
pnpm install --frozen-lockfile
pnpm run build
node tools/agent-mcp-audit.mjs /tmp/agent-audit-firecrawl
```

Observed result:

- `pnpm install --frozen-lockfile` passed.
- `pnpm run build` passed.
- The heuristic scanner scored the repo 72/100 and flagged transport, write-action, credential, and test/release-gate review areas.
- `pnpm test -- --listTests` did not run because the repo's `test` script references `node_modules/jest/bin/jest.js`, but `jest` is not declared in `devDependencies` at this commit. No first-party `*.test.ts` or `*.spec.ts` files were found outside installed dependencies.

## Executive Summary

`firecrawl-mcp-server` has a mature MCP shape: it distinguishes hosted cloud mode from local/stdin use, supports OAuth access-token introspection for hosted MCP, has keyless limits for selected hosted flows, uses Zod schemas, marks many tools with MCP safety annotations, and has cloud safe mode that disables interactive browser actions.

The main launch risks are not "missing auth everywhere" or obvious secret leakage. The practical risks are boundary clarity and regression proof: remote transport behavior is spread across README, versioning docs, env vars, nginx rewrites, and startup code; local-only file parsing can read arbitrary local paths when enabled; monitor/update/delete tools are correctly annotated but need focused tests; and CI currently builds but does not exercise the advertised Jest test script.

## Boundary Map

| Area | Evidence | Risk Notes |
|---|---|---|
| Startup and transport | `src/index.ts`, `VERSIONING.md`, `README.md` | Defaults to stdio; HTTP stream starts when `CLOUD_SERVICE`, `SSE_LOCAL`, or `HTTP_STREAMABLE_SERVER` is true. Non-cloud host defaults to `localhost`; cloud host binds `0.0.0.0`. |
| Auth | `src/index.ts` | Hosted cloud requires OAuth/API key except secret-gated keyless sessions; local stdio can use env credentials; HTTP stream exits if no credential or self-hosted API URL is configured. |
| Safe mode | `src/index.ts` | `SAFE_MODE` follows `CLOUD_SERVICE=true` and restricts scrape action types to wait/screenshot/scroll/scrape. |
| Open-web tools | `src/index.ts`, `src/research.ts` | Search, scrape, map, crawl, extract, agent, research, and interact operate on user-supplied web targets and external APIs. |
| Monitor tools | `src/monitor.ts` | Create/update/delete/run/check monitor resources; update/delete are marked destructive where appropriate. |
| Local file parsing | `src/index.ts` | `firecrawl_parse` is registered only when not in cloud mode, requires `FIRECRAWL_API_URL`, resolves a user-supplied local path, reads it, and uploads it to the configured parse endpoint. |
| CI and release gate | `.github/workflows/ci.yml`, `package.json`, `jest.config.js` | CI installs and builds, but does not run tests. The package advertises a test script but lacks a Jest dependency and first-party test files at this commit. |

## Findings

### Medium: Remote transport exposure policy is scattered across code and docs

Evidence: `src/index.ts` selects HTTP stream mode when `CLOUD_SERVICE`, `SSE_LOCAL`, or `HTTP_STREAMABLE_SERVER` is set. The host is `0.0.0.0` in cloud mode and `process.env.HOST || 'localhost'` otherwise. The README documents local Streamable HTTP at `http://localhost:3000/mcp`; `VERSIONING.md` also documents versioned SSE paths and cloud endpoints.

Impact: The implementation has meaningful protections, but operators have to reconstruct deployment safety from several places. This is exactly where MCP deployments fail in practice: someone enables HTTP/SSE for convenience, adds a tunnel or reverse proxy, and does not understand which auth layer and bind address are expected.

Recommended fix:

- Add a single "Transport exposure matrix" to the README covering stdio, local HTTP stream, local SSE, cloud, host binding, auth source, and expected network boundary.
- Add a startup log line that prints transport, host, port, credential source category, and safe-mode state without secrets.
- Add a CI smoke test for the three startup modes: stdio env credential, HTTP stream without credentials failing closed, and HTTP stream with self-hosted URL.

### Medium: Local file parse is useful but needs an explicit trust boundary

Evidence: `firecrawl_parse` is registered only when `CLOUD_SERVICE !== 'true'`; it requires `FIRECRAWL_API_URL`, resolves `filePath` with `path.resolve`, reads the local file with `readFile`, and posts the file to the configured `/v2/parse` endpoint.

Impact: This is intentionally local/self-hosted functionality and the tool is marked read-only, which is correct for filesystem mutation. The missing boundary is operator-facing: read-only is not the same as low-risk when an MCP client can ask the server to read arbitrary local documents and upload them to an API endpoint. In local agent setups, a compromised or over-broad agent instruction could use this as an unintended local-file exfiltration path.

Recommended fix:

- Document that `firecrawl_parse` should only be enabled for trusted local MCP clients and trusted self-hosted parse endpoints.
- Add optional allowlist controls such as `FIRECRAWL_PARSE_ROOT` and reject paths outside that directory.
- Add tests for path normalization, missing `FIRECRAWL_API_URL`, unsupported extensions, and parse-root escape attempts.

### Medium: CI builds, but does not prove auth/tool regressions stay fixed

Evidence: `.github/workflows/ci.yml` runs `pnpm install` and `pnpm run build`. `package.json` defines `test` as `node --experimental-vm-modules node_modules/jest/bin/jest.js`, but `jest` is not in `devDependencies`. No first-party `*.test.ts` or `*.spec.ts` files were found outside installed dependencies.

Impact: The build passing is useful, and strict TypeScript catches a class of defects. It does not prove MCP auth failures, safe-mode action filtering, monitor destructive annotations, keyless behavior, or local parse boundaries. The advertised test command also fails in a fresh checkout at this commit because Jest is missing.

Recommended fix:

- Add `jest` and `ts-jest` as explicit dev dependencies or replace the test script with the actual runner used by the repo.
- Add focused tests for `resolveCredentialFromHeaders`, cloud OAuth introspection failure, HTTP stream fail-closed startup, safe-mode action schema, monitor destructive annotations, and parse-root enforcement if added.
- Update CI to run `pnpm run lint`, `pnpm run build`, and `pnpm test`.

### Low: Feedback tools create server-side records and deserve rate/error regression tests

Evidence: `firecrawl_search_feedback` and `firecrawl_feedback` are marked `readOnlyHint: false`, `destructiveHint: false`, and submit structured feedback to API endpoints. The code handles 4xx responses as terminal structured payloads for search feedback.

Impact: The annotations are reasonable: feedback is additive and not destructive, but it still writes account-associated records and can trigger credit refund behavior. These are small write surfaces that should have regression tests because agents may retry or loop when responses are ambiguous.

Recommended fix:

- Add tests for 400/409 non-retry behavior, daily cap handling, already-submitted handling, and missing credential behavior in cloud mode.
- Document when users can disable feedback tools with `FIRECRAWL_NO_SEARCH_FEEDBACK` / `FIRECRAWL_NO_ENDPOINT_FEEDBACK`.

## Positive Signals

- OAuth access tokens are distinguished by `fco_` prefix and introspected before being converted to API credentials.
- Hosted cloud mode has OAuth protected-resource metadata and explicit credential failure behavior.
- HTTP stream mode fails closed without credentials or a self-hosted API URL.
- Cloud safe mode removes click/write/press/executeJavascript/generatePDF from scrape actions.
- Search domain filters use a hostname-only schema and reject simultaneous include/exclude domain lists.
- Monitor update/delete tools have destructive annotations.
- `redactPII`, `zeroDataRetention`, `lockdown`, and parse/scrape format guidance are exposed in schemas or tool descriptions.
- `pnpm run build` passed at the audited commit.

## Priority Fix Plan

1. Add a transport exposure matrix and startup summary covering mode, host, port, auth source, and safe mode.
2. Fix the test script/dependencies and run tests in CI.
3. Add auth, safe-mode, monitor annotation, feedback, and parse-boundary unit tests.
4. Add a parse-root allowlist for local file parsing.
5. Add a short operator checklist for local HTTP/SSE deployments.

## Example Validation Commands

```bash
pnpm install --frozen-lockfile
pnpm run build
pnpm test
HTTP_STREAMABLE_SERVER=true node dist/index.js
```

## What the Paid Sprint Adds

The paid sprint would go deeper than this public sample: live local reproduction where safe, focused tests written against the repo's actual runner, issue-ready remediation text, deployment-mode threat table, and a concise launch handoff for owners.
