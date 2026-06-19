# Statement of Work: Agent/MCP Audit Sprint

Version: 2026-06-19

## Summary

Fixed-price engineering review for one agent, MCP server, or tool-using product slice.

- Price: USD $1,000
- Turnaround target: 48 hours after payment confirmation and scope acceptance
- Delivery: Markdown report
- Operator: Zexu Jin
- Offer page: https://jackjin1997.github.io/agent-audit-sprint/

## Included

- Tool, transport, credential, external API, write-action, destructive-path, and privileged-operation boundary map
- Ranked risk findings with evidence, impact, and remediation path
- Focused test plan for schemas, auth gates, secret redaction, write-mode defaults, and transport assumptions
- Launch notes with immediate fixes, monitoring recommendations, and defer-safe items

## Not Included

- Implementing fixes unless separately agreed
- Legal, financial, compliance, SOC 2, or penetration-test certification
- Handling private keys, cookies, customer data, live production credentials, or unsanitized sensitive logs
- Emergency incident response
- More than one repo or product slice

## Payment

Payment is due after scope acceptance and before private audit work begins.

Amount: USD $1,000 equivalent.

Accepted networks:

- Ethereum: `0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF`
- Solana: `5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM`

If invoice-first processing is needed, billing details, payment method, and settlement evidence must be agreed before work starts.

Buyer should reply with network, transaction hash, payer wallet address, and intake issue URL.

## Data Handling

Do not provide secrets, private keys, cookies, production customer data, or unsanitized logs. Share only the minimum access needed. Remove access after delivery.

## Delivery

Default output is a Markdown report. Public or private delivery is selected in the intake issue.

## Acceptance

Scope is accepted when both sides agree on:

- repo/product URL
- exact slice to review
- delivery visibility
- payment network
- target delivery window
