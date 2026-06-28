#!/usr/bin/env node

const MARKER = "<!-- ai-jingle-order-response -->";
const SERVICE_URL = "https://jackjin1997.github.io/agent-audit-sprint/ai-jingle-generator.html";
const UGC_AGENCY_SERVICE_URL = "https://jackjin1997.github.io/agent-audit-sprint/ugc-agency-ai-music-hooks.html";
const QUOTE_URL = "https://jackjin1997.github.io/agent-audit-sprint/ai-jingle-quote.html";
const TERMS_URL = "https://jackjin1997.github.io/agent-audit-sprint/terms.html";
const PAYMENT_PROOF_URL = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=payment-confirmation.yml";
const INVOICE_TEMPLATE_URL = "https://github.com/jackjin1997/agent-audit-sprint/blob/main/templates/ai-jingle-invoice.md";
const DELIVERY_NOTE_TEMPLATE_URL = "https://github.com/jackjin1997/agent-audit-sprint/blob/main/templates/ai-jingle-delivery-note.md";
const ETH_ADDRESS = "0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF";
const SOL_ADDRESS = "5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM";

function extractField(body = "", label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`###\\s+${escaped}\\s+([\\s\\S]*?)(?=\\n###\\s+|$)`, "i");
  const match = body.match(pattern);
  return match?.[1]?.trim().replace(/^_No response_$/i, "") || "";
}

function packageDetails(rawChoice = "") {
  const choice = rawChoice.trim();
  if (/UGC Agency Audio Hook/i.test(choice)) {
    return {
      name: "USD $29 UGC Agency Audio Hook Sketch",
      price: "USD $29",
      target: "24-48h after brief and payment confirmation",
      deliverable: "one selected 6-15 second agency audio hook sketch, production prompt, rough cut note, source/tool note, client-ready usage memo, and guardrails",
      serviceUrl: UGC_AGENCY_SERVICE_URL,
    };
  }
  if (choice.includes("$29") || /founding|sketch/i.test(choice)) {
    return {
      name: "USD $29 Founding Hook Sketch",
      price: "USD $29",
      target: "24h after brief and payment confirmation when available",
      deliverable: "one selected 8-12 second branded hook sketch, production prompt, rough cut note, and usage guardrails",
      serviceUrl: SERVICE_URL,
    };
  }
  if (choice.includes("$79") || /hook/i.test(choice)) {
    return {
      name: "USD $79 Jingle Hook Pack",
      price: "USD $79",
      target: "24-48h after brief and payment confirmation",
      deliverable: "two short jingle directions, one selected rough cut, prompt/lyric sheet, and usage memo",
      serviceUrl: SERVICE_URL,
    };
  }
  if (choice.includes("$399") || /sonic launch/i.test(choice)) {
    return {
      name: "USD $399 Sonic Launch Kit",
      price: "USD $399",
      target: "48h after brief and payment confirmation",
      deliverable: "jingle, podcast intro/outro, five social stings, brand sound direction, prompt history, and two revision passes",
      serviceUrl: SERVICE_URL,
    };
  }
  if (/Agency Ad Music/i.test(choice)) {
    return {
      name: "USD $149 Agency Ad Music Pack",
      price: "USD $149",
      target: "24-48h after brief and payment confirmation",
      deliverable: "three selected agency audio directions for one client concept, 15/30/60 second cut plan, one revision pass, and commercial-use notes",
      serviceUrl: UGC_AGENCY_SERVICE_URL,
    };
  }
  return {
    name: "USD $149 Ad Music Pack",
    price: "USD $149",
    target: "24-48h after brief and payment confirmation",
    deliverable: "three selected variants for one campaign, 15/30/60 second cut plan, one revision pass, and commercial-use notes",
    serviceUrl: choice.includes("Agency") ? UGC_AGENCY_SERVICE_URL : SERVICE_URL,
  };
}

function renderJingleOrderComment(issueBody = "") {
  const packageInfo = packageDetails(extractField(issueBody, "Requested package"));
  const brand =
    extractField(issueBody, "Brand, podcast, channel, or product name") ||
    extractField(issueBody, "Agency or client project") ||
    "the brand/show";
  const website =
    extractField(issueBody, "Website or social link") ||
    extractField(issueBody, "Website, store, or creative brief link") ||
    "not provided";
  const usage = extractField(issueBody, "Primary use") || "short branded audio";
  const channel = extractField(issueBody, "Publishing channel");
  const rightsSource = extractField(issueBody, "Source material rights");
  const targetViewer = extractField(issueBody, "Target viewer and offer");
  const requiredLine = extractField(issueBody, "Required line or CTA");
  const visualPacing = extractField(issueBody, "Visual pacing");
  const approvalNeed = extractField(issueBody, "Client approval need");
  const brief = extractField(issueBody, "Brand brief") || targetViewer || "brief to confirm";
  const contact = extractField(issueBody, "Preferred contact") || "this issue";
  const timing = extractField(issueBody, "Timing") || packageInfo.target;
  const paymentPath = extractField(issueBody, "Payment path") || "to confirm";
  const agencyDetails = [
    channel ? `- Publishing channel: **${channel}**` : "",
    rightsSource ? `- Source material rights: **${rightsSource}**` : "",
    visualPacing ? `- Visual pacing: **${visualPacing}**` : "",
    approvalNeed ? `- Client approval need: **${approvalNeed}**` : "",
    requiredLine ? `- Required line or CTA: **${requiredLine}**` : "",
  ].filter(Boolean);

  return `${MARKER}
## AI jingle order received

Thanks for requesting **${packageInfo.name}** for **${brand}**.

### Brief captured

- Brand/show: **${brand}**
- Website/social: **${website}**
- Primary use: **${usage}**
- Preferred contact: **${contact}**
- Requested timing: **${timing}**
- Payment path: **${paymentPath}**
- Expected deliverable: ${packageInfo.deliverable}
${agencyDetails.length ? `\nAgency/client approval details:\n\n${agencyDetails.join("\n")}\n` : ""}

Brief summary:

> ${brief.replace(/\n+/g, "\n> ")}

### Next step

I will confirm whether the brief is accepted as-is or reply with the smallest scope adjustment needed before payment. Please do not send payment until the brief/package is accepted in writing.

After written brief acceptance, pay **${packageInfo.price} equivalent** through the agreed path and submit transaction or settlement evidence here:

${PAYMENT_PROOF_URL}

- Ethereum: \`${ETH_ADDRESS}\`
- Solana: \`${SOL_ADDRESS}\`
- Service page and browser sketch demo: ${packageInfo.serviceUrl}
- Fixed jingle quote and payment packet: ${QUOTE_URL}
- Invoice template: ${INVOICE_TEMPLATE_URL}
- Delivery note template: ${DELIVERY_NOTE_TEMPLATE_URL}
- Terms and payment handling: ${TERMS_URL}

### Usage guardrails

- No known-artist soundalikes, living voice clones, or third-party lyrics without rights.
- Paid delivery includes source tool summary, prompt/lyric sheet, selected cut notes, and usage assumptions.
- AI-generated music can have copyright-registration limits; this is not legal clearance.

Target delivery for this package: ${packageInfo.target}
`;
}

async function githubRequest(pathOrUrl, options = {}) {
  const token = process.env.GITHUB_TOKEN;
  const apiUrl = process.env.GITHUB_API_URL || "https://api.github.com";
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${apiUrl}${pathOrUrl}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`GitHub API ${response.status}: ${text.slice(0, 300)}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function upsertIssueComment(body) {
  const repo = process.env.GITHUB_REPOSITORY;
  const issueNumber = process.env.ISSUE_NUMBER;
  const token = process.env.GITHUB_TOKEN;

  if (process.env.JINGLE_ORDER_DRY_RUN === "true" || !repo || !issueNumber || !token) {
    process.stdout.write(`${body}\n`);
    return;
  }

  const comments = await githubRequest(`/repos/${repo}/issues/${issueNumber}/comments?per_page=100`);
  const existing = comments.find((comment) => comment.body?.includes(MARKER));

  if (existing) {
    await githubRequest(existing.url, {
      method: "PATCH",
      body: JSON.stringify({ body }),
    });
    return;
  }

  await githubRequest(`/repos/${repo}/issues/${issueNumber}/comments`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

async function main() {
  const body = renderJingleOrderComment(process.env.ISSUE_BODY || "");
  await upsertIssueComment(body);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
