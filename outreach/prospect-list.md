# Initial Prospect List

Use this list to sell the Agent/MCP Audit Sprint without opening PRs or touching bounty queues.

## Best-fit categories

1. MCP server maintainers adding remote/SSE/HTTP transports.
2. Agent tool vendors that recently added write actions or account-level permissions.
3. Open-source agent projects preparing hosted/cloud offerings.
4. Small AI devtool startups with launch pages but weak security docs.
5. Teams exposing browser automation, publishing, CRM, email, calendar, or trading tools to agents.

## Search queries

- `"MCP server" "SSE" "write" GitHub`
- `"Model Context Protocol" "DOCKER" "API key" "README"`
- `"agent tools" "DOUBAN_ENABLE_WRITE" OR "ENABLE_WRITE"`
- `"Claude Desktop" "mcpServers" "cookie"`
- `"AI agent" "tool calling" "launch" "waitlist"`

## Outreach message

Subject: Fixed-price audit for your MCP/agent tool launch

Hi,

I do focused Agent/MCP audit sprints for teams shipping tool-using AI products. The output is a ranked report covering tool boundaries, auth/secrets, write-action safety, prompt/tool injection paths, test gaps, and deployment assumptions.

Fixed price: $1,000. Typical turnaround: 48 hours for one repo or product slice.

Sample reports: https://jackjin1997.github.io/agent-audit-sprint/samples.html

Public GitHub repo intakes get an automated no-execution scanner triage comment before paid scope acceptance.

If useful, open a request here:
https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=audit-request.yml

Best,
Zexu

## Qualification checklist

- They have an agent, MCP server, or tool-calling product.
- There is a clear repo, docs site, npm package, Docker image, or demo to audit.
- A bad tool call could mutate user data, leak credentials, or break launch trust.
- They can pay $1,000 without procurement delay.
- They need a practical fix plan, not a long compliance engagement.
