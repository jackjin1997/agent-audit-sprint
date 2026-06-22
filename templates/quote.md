# Agent/MCP Security Review Quotes

Quote date: 2026-06-22

## Fixed Packages

| Package | Price | Delivery Target |
|---|---:|---|
| Quick Scan Report | USD $99 | Same day when available after scope and payment confirmation |
| Same-day Focused Review | USD $299 | Same day when available after scope and payment confirmation |
| Full Audit Sprint | USD $1,000 | 48 hours after scope and payment confirmation |

## Scope

One MCP server, agent tool surface, or tool-using product slice.

Included:

- Scanner result and boundary notes for quick scan
- One risky-flow review for focused review
- Tool boundary map for full sprint
- Auth, secrets, write-action, and transport review
- Prompt/tool injection review paths
- Focused test plan
- Launch notes and ranked fix plan

Not included:

- Legal, financial, compliance, SOC 2, or penetration-test certification
- Handling private keys, cookies, production credentials, or raw sensitive customer data
- More than one repo/product slice unless separately agreed

## Acceptance Text

```text
I accept the selected Agent/MCP security review package.
Package: [USD $99 Quick Scan Report / USD $299 Same-day Focused Review / USD $1,000 Full Audit Sprint].
Scope: [repo/product slice].
Delivery: [public issue comment or private Markdown report].
Payment path: [Ethereum ETH/ERC-20 stablecoin, Solana SOL/SPL USDC, or invoice-first].
I will not share secrets or sensitive customer data in GitHub.
```

## Payment

Payment is due after written scope acceptance and before private audit work begins.

Ethereum (ETH or ERC-20 USDC/USDT/DAI):

```text
0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF
```

Solana (SOL or SPL USDC):

```text
5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM
```

Payment proof form:

https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=payment-confirmation.yml

## Payment Packet

```text
I accept the selected Agent/MCP security review package.

Package: [USD $99 Quick Scan Report / USD $299 Same-day Focused Review / USD $1,000 Full Audit Sprint]
Scope: [repo/product slice]
Delivery: [public issue comment or private Markdown report]
Payment timing: after written scope acceptance only.

Ethereum address (ETH or ERC-20 USDC/USDT/DAI):
0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF

Solana address (SOL or SPL USDC):
5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM

Payment proof form:
https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=payment-confirmation.yml

Start rule:
The selected package target starts after both scope acceptance and payment confirmation.
```

## Start Rule

The delivery target starts after both:

1. Scope is accepted in writing.
2. Payment is confirmed.
