# Scanner-Led Outreach

Use this playbook to sell the Agent/MCP Audit Sprint without opening PRs, posting project-specific scanner output, or making unverified vulnerability claims.

## Positioning

- Free first step: browser-only local scanner at https://jackjin1997.github.io/agent-audit-sprint/scan.html
- Paid conversion: USD $1,000 fixed-price human audit for one repo or product slice
- Delivery: boundary map, ranked findings, test plan, and launch notes
- Time target: 48 hours after scope acceptance and payment confirmation

## Safe Use Rules

- Do not post scanner results into another project's public issue tracker as a finding.
- Do not claim a vulnerability from heuristic scanner output.
- Prefer direct commercial/security contact, a project website contact form, or a maintainer-invited discussion channel.
- If a public GitHub issue is the only route, send only when the repo accepts vendor/tool/service suggestions.
- Stop after one follow-up.
- Count revenue only after payment is verified.

## Message Template

```text
Subject: Local scanner + fixed-price MCP audit for <project>

Hi <name/team>,

I do fixed-price Agent/MCP audit sprints for teams shipping tool-using AI products. <Project> looks like a fit because <one concrete project-specific reason>.

The sprint is $1,000 for one repo or product slice and returns a ranked report covering tool boundaries, auth/secrets, write-action safety, prompt/tool injection paths, test gaps, and deployment assumptions.

You can run the free browser-only scanner first:
https://jackjin1997.github.io/agent-audit-sprint/scan.html

It reads selected local files in the browser, does not upload code, does not install dependencies, and does not execute target code. If the scanner output looks useful, the paid review turns it into human evidence, fix planning, tests, and launch notes.

Sample reports:
https://jackjin1997.github.io/agent-audit-sprint/samples.html

Intake:
https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml

Short slot reservation:
https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=paid-audit-intent.yml

Best,
Zexu
```

## Follow-Up

```text
Hi <name/team>,

Quick follow-up. The best-fit slice for <project> is <transport/write/secrets/browser/db/workspace reason>. The scanner is free and local-only; the paid sprint is only for teams that want the human report and launch-ready fix plan.

Scanner:
https://jackjin1997.github.io/agent-audit-sprint/scan.html

No worries if this is not relevant right now.
```

## Qualification Checklist

- The project exposes MCP tools, agent tools, remote transports, or a tool-calling product surface.
- A bad tool call could mutate user data, spend money, expose credentials, leak private data, affect infrastructure, or create launch-trust risk.
- There is a public repo, private repo access path, docs site, package, Docker image, or product slice to audit.
- The team has a likely business reason to pay $1,000 for faster launch confidence.
- The outreach can be personalized without making a public security accusation.
