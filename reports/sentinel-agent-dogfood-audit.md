# Dogfood Audit: jackjin1997/sentinel

This sample shows the kind of output included in the $1,000 Agent/MCP Audit Sprint. It is based on public code from `jackjin1997/sentinel` at commit `2ebf5a5363db4ee95483ef3ecbae8e0842550131` dated 2026-06-12.

This is a self-owned public-code dogfood sample, not a commissioned review and not a private vulnerability disclosure. No Sentinel deployment, real incident telemetry, API keys, customer data, model provider accounts, Bright Data account, or live on-call environment was used.

## Scope

- Next.js `POST /api/agent` request and SSE streaming boundary
- Multi-vendor LLM orchestration in `lib/agent.ts`
- Agent tool registration and tool output flow
- Bright Data backed external web tools
- Model and Bright Data credential configuration
- Vultr and Cloudflare demo deployment scripts
- Test, lint, typecheck, and CI readiness

Out of scope for this sample: live Sentinel deployments, model provider account configuration, Bright Data account behavior, private telemetry, Vultr host state, Cloudflare account state, and unpublished branches.

## Validation Performed

The source was downloaded through the GitHub API tarball endpoint and reviewed statically. Target dependencies were not installed and target project code was not executed.

```bash
gh api repos/jackjin1997/sentinel/tarball/main
node tools/agent-mcp-audit.mjs private-notes/dogfood/sentinel-20260621T0325Z/src --json
node tools/agent-mcp-audit.mjs private-notes/dogfood/sentinel-20260621T0325Z/src
rg -n "process\\.env|API_KEY|SECRET|TOKEN|fetch\\(|tool|agent|auth|redact|sanitize" private-notes/dogfood/sentinel-20260621T0325Z/src
```

Observed result:

- The heuristic scanner scored the repo 54/100.
- Scanner findings: 1 high, 2 medium, 2 low, 1 info.
- Manual review confirmed a public agent run endpoint, LLM/tool streaming, credential-backed external web tools, and deploy scripts that need production guardrails before reuse beyond a demo.
- Manual review also found strong existing safeguards: small request body limit, abort handling, backpressure cut-off, Zod tool schemas, step limits, token/output caps, and mock fallback behavior.

## Executive Summary

`sentinel` is a useful dogfood target because it is a real autonomous incident-response agent: a browser UI starts a server-side agent run, multiple model vendors participate in four phases, tools can query internal mock telemetry and external web data, and results stream back to the operator over SSE.

The repo already includes several good defensive choices for a demo-grade agent. Request bodies are capped, client disconnects abort provider calls, slow consumers are cut off, tool schemas restrict common inputs, phase output is bounded, and the external vendor-status tool uses a fixed vendor allowlist.

The main production risk is not a single obvious code injection bug. It is the missing operator boundary around a cost-bearing, credential-backed agent endpoint. Before Sentinel is reused outside a controlled demo, it needs authentication, rate/concurrency limits, output redaction, deployment hardening, and CI gates that prove those controls do not regress.

## Boundary Map

| Area | Evidence | Risk Notes |
|---|---|---|
| Browser entry | `app/page.tsx:119-124` | The UI posts `{ incidentId }` directly to `/api/agent` and reads streamed events. No caller token or session proof is sent. |
| Agent API | `app/api/agent/route.ts:19-73` | The route validates body size and JSON, then starts `runIncidentAgent`. No auth, rate limit, origin policy, or concurrency cap is visible. |
| SSE output | `app/api/agent/route.ts:52-56`, `lib/agent.ts:8-15` | Tool calls, tool results, text deltas, errors, and final report objects are serialized to the client. |
| Model credentials | `lib/agent.ts:31-55`, `.env.local.example` | Qwen, Anthropic, Google, and Bright Data credentials are environment backed. The public example uses placeholders. |
| Tool surface | `lib/tools/index.ts`, `lib/tools/brightdata.ts` | Internal mock telemetry tools and external Bright Data tools are registered for model use. |
| External web tools | `lib/tools/brightdata.ts:83-200` | Vendor status is allowlisted; public postmortem search and GitHub commit lookups can still spend Bright Data/API quota and return untrusted web content. |
| Deployment | `scripts/deploy-vultr.sh:47-88`, `scripts/add-cf-tunnel.sh` | Demo deployment copies `.env.local`, runs a root-managed systemd service, exposes HTTP `:80`, and can create an ephemeral Cloudflare Tunnel. |
| Validation gates | `package.json` | `dev`, `build`, and `start` exist, but no `test`, `lint`, `typecheck`, or CI workflow was visible in the public tree. |

## Findings

### High: Public agent run endpoint needs auth, quota, and concurrency boundaries

Evidence: `app/page.tsx:119-124` starts a run with a plain POST to `/api/agent`. `app/api/agent/route.ts:19-73` accepts any request with a small JSON body and invokes `runIncidentAgent`, which can call multiple LLM providers and tools across phases.

Impact: A public deployment can let anonymous callers burn model and Bright Data quota, create many concurrent incident runs, and stream tool outputs back to a browser. The existing body, abort, and backpressure controls reduce memory waste, but they do not limit who can start a run or how often they can spend provider credits.

Recommended fix:

- Add an auth gate before `runIncidentAgent`: signed session, shared demo token, or deployment-specific operator identity.
- Add per-IP or per-token rate limits, a global concurrency cap, and a per-run budget ceiling.
- Reject unknown origins when deployed as a public demo, or document that the endpoint must sit behind an authenticated reverse proxy.
- Emit a clear operator-facing error when a request is denied instead of silently starting a partial run.

### Medium: Tool results and errors need centralized redaction before streaming

Evidence: `AgentEvent` includes `tool-result` and `error` payloads with `unknown` content. The API route streams `JSON.stringify(event)` directly to the client. Bright Data fallback/error notes include provider error messages, and future real telemetry tools would likely return logs, metrics, runbook content, URLs, and incident details.

Impact: The current repo uses mock telemetry, so this sample did not observe real secret leakage. The production pattern is still sensitive: a real on-call agent can easily handle tokens, private URLs, incident IDs, customer identifiers, stack traces, or vendor response bodies. Once streamed to the browser, those artifacts can land in screenshots, browser logs, support tickets, or recordings.

Recommended fix:

- Add a single `sanitizeAgentEvent(event)` layer before SSE serialization.
- Redact common key names and values: `authorization`, `cookie`, `api_key`, `token`, `password`, signed URLs, session IDs, and query strings.
- Add tests that feed representative tool results and provider errors through the sanitizer.
- Keep a server-side full trace only when explicitly enabled and documented as sensitive.

### Medium: External web tools need a stricter tool policy for production telemetry

Evidence: `fetchVendorStatus` uses an enum allowlist, which is a good signal. `searchPublicPostmortems` accepts an LLM-provided search query, and `fetchGithubRecentCommits` accepts an LLM-provided public repo name. Both call Bright Data and return untrusted public content into the model loop.

Impact: Public web content can be stale, maliciously framed, or irrelevant. In an incident-response workflow, the risk is not only data leakage; it is wrong remediation advice grounded in untrusted public search output. The search path also has quota and provenance implications.

Recommended fix:

- Add a tool policy that marks each tool as internal, external, read-only, write-capable, cost-bearing, and prompt-injection exposed.
- Include source URL, fetch time, fallback status, and freshness in each external tool result.
- Require the final report to distinguish internal telemetry from external public web signals.
- Add regression fixtures for malicious public snippets and stale vendor-status responses.

### Medium: Demo deploy scripts need production hardening notes

Evidence: `scripts/deploy-vultr.sh:47-88` syncs code to `/opt/sentinel`, copies `.env.local`, creates a systemd service as root-managed infrastructure, and exposes `:80` through Caddy. `scripts/add-cf-tunnel.sh` can publish a trycloudflare URL.

Impact: This is acceptable for a hackathon/demo script, but the script can be reused as a production shortcut. A cost-bearing agent with model credentials should not be exposed over unauthenticated HTTP or an ephemeral tunnel without an explicit operator checklist.

Recommended fix:

- Add a `DEPLOYMENT_SECURITY.md` or deploy-script warning for demo-only assumptions.
- Run the service as a non-root user and store secrets in a host secret manager or locked-down env file.
- Require HTTPS hostname configuration and an auth proxy for public deployments.
- Add firewall and log-retention guidance, including how to avoid printing secrets in `journalctl`.

### Low: Release gates are too thin for a security-sensitive agent

Evidence: `package.json` exposes only `dev`, `build`, and `start`; no `test`, `lint`, or `typecheck` scripts were visible. No `.github/workflows` directory was present in the public tree.

Impact: The code has safety logic that deserves regression coverage: body limits, unknown incident handling, abort propagation, phase output caps, sanitizer behavior, and tool input bounds. Without repeatable checks, production guardrails can drift.

Recommended fix:

- Add `typecheck`, `lint`, and `test` scripts.
- Add focused tests for `/api/agent` request validation, unauthorized requests, concurrency/rate denial, redaction, and tool schema rejection.
- Add a CI workflow that runs install, typecheck, lint, unit tests, and build on pull request and push.

## Positive Signals

- `POST /api/agent` caps honest and post-read request bodies at 1 KB.
- Client disconnect aborts the agent run so the server stops spending provider tokens.
- The SSE route tracks slow consumers and aborts after repeated backpressure misses.
- `runIncidentAgent` rejects unknown incident IDs before running the model chain.
- Tool schemas use Zod enums, minimums, maximums, and runtime validation for the GitHub repo shape.
- The external vendor-status tool uses a fixed vendor allowlist.
- Phase outputs are locally capped and provider output tokens are bounded.
- `.env.local.example` uses placeholders rather than committed secrets.

## Priority Fix Plan

1. Put `/api/agent` behind auth and add rate, concurrency, and spend controls.
2. Add centralized SSE event redaction with tests for tool results and provider errors.
3. Add a tool policy table for internal/external, cost-bearing, prompt-exposed, and fallback-capable tools.
4. Harden deploy docs and scripts for non-root service execution, HTTPS, firewall, auth proxy, and secret handling.
5. Add CI with typecheck, lint, unit tests, build, and scanner output generation.

## Example Validation Commands

```bash
node tools/agent-mcp-audit.mjs /path/to/sentinel --json
node tools/agent-mcp-audit.mjs /path/to/sentinel --sarif > agent-mcp-audit.sarif
bun run typecheck
bun run lint
bun test
bun run build
```

## What the Paid Sprint Adds

The paid sprint would go deeper than this public dogfood sample: implementation-ready patches for auth and rate limiting, sanitizer tests, deployment-mode threat table, CI workflow, agent tool policy, and a concise launch handoff for the repo owner. Payment is requested only after written scope acceptance.
