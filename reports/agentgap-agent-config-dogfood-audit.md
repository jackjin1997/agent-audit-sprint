# Dogfood Audit: jackjin1997/agentgap

This sample shows the kind of output included in the USD $1,000 Agent/MCP Audit Sprint. It is based on public code from `jackjin1997/agentgap` at commit `ebaf3dfb07ab90b50a2879f3ce06bb37aeac2f65` dated 2026-06-02.

This is a self-owned public-code dogfood sample, not a commissioned review and not a private vulnerability disclosure. No user workstation, live agent client, GitHub token, MCP server, or private repository was used.

## Scope

- `bridge.yaml` schema and validation model
- `agentgap sync`, `agentgap diff`, and `agentgap init` command behavior
- Claude Code, Codex, and Cursor adapter write paths
- MCP JSON merge and permission handling
- Example MCP server configuration files
- Test and CI readiness for a config-writing agent tool

Out of scope for this sample: private agent configurations, real user tokens, running configured MCP servers, executing `agentgap sync` against a live workspace, and unpublished branches.

## Validation Performed

The source was downloaded through the GitHub API tarball endpoint and reviewed statically. Target dependencies were not installed and target project code was not executed.

```bash
gh api repos/jackjin1997/agentgap/tarball/main
node tools/agent-mcp-audit.mjs private-notes/dogfood/agentgap-20260621T1240Z/src --json
node tools/agent-mcp-audit.mjs private-notes/dogfood/agentgap-20260621T1240Z/src
rg -n "os\\.WriteFile|MkdirAll|mcp|command|env|token|auth|permission|diff|sync" private-notes/dogfood/agentgap-20260621T1240Z/src
```

Observed result:

- The heuristic scanner scored the repo 42/100.
- Scanner findings: 3 high, 1 low.
- Manual review confirmed a focused config bridge that writes agent instruction files and MCP JSON for Claude Code, Codex, and Cursor.
- Manual review also found useful safety choices: MCP JSON files are written with `0600` permissions, agent config directories are created with restrictive permissions, and existing MCP server entries are preserved unless a same-name server is intentionally replaced.

## Executive Summary

`agentgap` is a good dogfood target because it sits directly on a sensitive boundary: it turns one `bridge.yaml` into the files that coding agents read as instructions and MCP server configuration. That is valuable tooling, but it means a bad or unreviewed config can change how multiple agents behave and which tools they can launch.

The repo is small and easier to reason about than a full agent product. The main risk is not a remote exploit in `agentgap` itself. The risk is configuration supply-chain drift: syncing a project-local file can rewrite `CLAUDE.md`, `AGENTS.md`, Cursor rule files, and MCP server maps in one command, with no default preview or backup step.

Before positioning this as a reusable agent config bridge, it should make the trust boundary explicit: preview first, require an `--apply` or confirmation path for writes, validate MCP transports and command shapes, normalize rule names, and add regression tests around file output and merge behavior.

## Boundary Map

| Area | Evidence | Risk Notes |
|---|---|---|
| Config source | `internal/config/config.go:62-99`, `bridge.yaml:6-60` | `bridge.yaml` controls agent rules, MCP server command/args/env/url fields, and target agents. Validation currently checks required names/content and defaults transport. |
| Sync command | `cmd/root.go:125-148` | `agentgap sync` loads the config and calls `SyncAll(false)`, so the default sync path writes files rather than previewing changes. |
| Agent instruction writes | `internal/adapter/claude/claude.go:31-43`, `internal/adapter/codex/codex.go:30-42`, `internal/adapter/cursor/cursor.go:30-53` | Rule content is rendered into `CLAUDE.md`, `AGENTS.md`, and `.cursor/rules/*.mdc`, which become future agent instruction surfaces. |
| MCP config writes | `internal/adapter/claude/claude.go:46-69`, `internal/adapter/codex/codex.go:45-68`, `internal/adapter/cursor/cursor.go:56-79` | The tool merges and writes project MCP JSON for three agent clients. |
| MCP merge behavior | `internal/mcpio/mcpio.go:41-69` | Existing servers are preserved, but same-name servers from `bridge.yaml` replace existing entries. MCP JSON files are written `0600`. |
| MCP server schema | `internal/mcpio/mcpio.go:75-96` | `stdio` emits `command` and `args`; `sse` and `streamable_http` emit `url`; `env` is copied through. Unknown transports are not rejected here. |
| Example MCP config | `.cursor/mcp.json:21-27` | The sample includes `my-custom-tool --port 8080`; this is not proof of public exposure, but it needs documented bind/auth assumptions. |
| Validation gates | public tree | No tests, CI workflow, or README were visible in the public tarball reviewed. |

## Findings

### High: Default sync writes agent instructions and MCP configs without a preview-first guardrail

Evidence: `cmd/root.go:125-148` makes `agentgap sync` call `SyncAll(false)`. The adapters write `CLAUDE.md`, `AGENTS.md`, Cursor rule files, and MCP JSON directly.

Impact: In a real workspace, one command can change future agent behavior and tool access across three clients. A malicious or careless `bridge.yaml` can introduce permissive rules, swap an MCP server command, or replace a same-name MCP entry. That is expected functionality, but the current default makes the risky path the easy path.

Recommended fix:

- Make `agentgap sync` show a diff by default and require `--apply` for writes, or add an interactive confirmation unless `--yes` is passed.
- Write `.bak` or timestamped backups before replacing existing agent instruction or MCP config files.
- Print a clear summary of new, modified, and same-name overwritten MCP servers before applying changes.
- Add a `--check` mode for CI that fails when generated files drift.

### Medium: MCP server definitions need stricter validation before they become executable agent config

Evidence: `internal/config/config.go:84-91` validates only the MCP server name and defaults an empty transport to `stdio`. `internal/mcpio/mcpio.go:80-92` maps supported transports but does not surface an error for unknown transport values, missing `command` for `stdio`, missing `url` for remote transports, or risky command patterns. `bridge.yaml:39-54` includes GitHub and filesystem MCP server templates.

Impact: `agentgap` does not launch those commands itself, but it writes the files that agent clients later trust. Weak validation can silently produce partial or dangerous MCP config and make the eventual execution boundary unclear.

Recommended fix:

- Reject unknown transports and require `command` for `stdio`, `url` for `sse` or `streamable_http`.
- Warn when commands use package runners such as `npx -y` without a pinned package version.
- Add an optional command allowlist or signed template mode for team use.
- Treat `env` values as secret-bearing and redact them in logs, diffs, and errors.

### Medium: Rule names and prompt content need a clearer trust model

Evidence: `internal/config/config.go:74-82` requires a non-empty rule name and content, but does not normalize rule names. `internal/adapter/cursor/cursor.go:40-48` uses the rule name to build `.cursor/rules/agentgap-<name>.mdc`. Claude and Codex adapters render rule content directly into agent instruction files.

Impact: A config bridge is also a prompt distribution system. Names with path separators, unusual characters, or collisions can produce surprising files, while unreviewed rule content becomes durable instructions for later agent sessions.

Recommended fix:

- Normalize rule names to a conservative slug such as `[a-z0-9-]+` and reject path separators.
- Detect duplicate normalized names before writing.
- Add a generated-file banner that states the source `bridge.yaml` path and a content hash.
- Document that `bridge.yaml` is trusted input and should be code-reviewed like an agent policy file.

### Medium: Example port-based MCP config lacks transport exposure notes

Evidence: `.cursor/mcp.json:21-27` includes a sample `my-custom-tool` command with `--port 8080`. The scanner flagged this as a remote listener signal. Manual review did not confirm public network exposure from this alone.

Impact: MCP users often copy examples directly. A port-based server example without bind address, trusted-client, and auth assumptions can lead operators to expose a tool server beyond localhost by accident.

Recommended fix:

- Replace the sample with a clearly local-only example, or add comments/docs that state expected bind address and authentication assumptions.
- Add a checklist for remote MCP transports: localhost binding, auth proxy, TLS, allowed clients, logging, and write-tool policy.
- Prefer examples that do not imply an open port unless the repo also documents the exposure model.

### Low: Tests and CI are missing for a security-sensitive config writer

Evidence: no test files or `.github/workflows` entries were visible in the public tarball. The scanner also reported no obvious tests or CI.

Impact: Most important regressions here are small and mechanical: merge behavior, file permissions, duplicate names, invalid transports, and generated output stability. They are exactly the kind of behavior that focused tests catch cheaply.

Recommended fix:

- Add Go tests for config validation, MCP server conversion, JSON merge precedence, file permissions, and adapter output.
- Add fixture tests for invalid transport, missing command, missing URL, duplicate rule names, and unsafe rule names.
- Add CI for `go test ./...`, `go vet ./...`, and scanner output generation.

## Positive Signals

- MCP config writers create agent config directories with restrictive permissions.
- MCP JSON files are written with `0600`, which is appropriate for token-bearing config.
- Existing MCP server entries are preserved unless the new config intentionally uses the same name.
- The project keeps Claude, Codex, and Cursor translation logic in small adapters.
- The default `bridge.yaml` uses environment placeholders rather than committed token values.
- The repo is small enough for fast manual review and targeted tests.

## Priority Fix Plan

1. Make preview/diff the default path and require an explicit apply flag for writes.
2. Add validation for transport, command, URL, duplicate names, and normalized rule slugs.
3. Add backup and same-name overwrite reporting for MCP config merges.
4. Add tests for adapter output, MCP JSON permissions, merge behavior, and invalid configs.
5. Add CI with `go test ./...`, `go vet ./...`, and scanner report generation.

## Example Validation Commands

```bash
node tools/agent-mcp-audit.mjs /path/to/agentgap --json
node tools/agent-mcp-audit.mjs /path/to/agentgap --sarif > agent-mcp-audit.sarif
go test ./...
go vet ./...
agentgap diff
agentgap sync --check
```

## What the Paid Sprint Adds

The paid sprint would go deeper than this public dogfood sample: implementation-ready validation patches, fixture tests, CI workflow, safer sync UX, generated-file provenance, and a short operator guide for using `bridge.yaml` as trusted agent policy. Payment is requested only after written scope acceptance.
