document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.getAttribute("data-copy") || "";
    try {
      await navigator.clipboard.writeText(value);
      const original = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1300);
    } catch {
      button.textContent = "Select";
    }
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.getAttribute("data-copy-target") || "");
    const value = target?.textContent?.trim() || "";
    try {
      await navigator.clipboard.writeText(value);
      const original = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1300);
    } catch {
      button.textContent = "Select";
    }
  });
});

const intakeForm = document.querySelector("[data-intake-form]");

function setButtonText(button, value) {
  const original = button.textContent;
  button.textContent = value;
  window.setTimeout(() => {
    button.textContent = original;
  }, 1300);
}

function clean(value, fallback = "TBD") {
  const text = String(value || "").trim();
  return text || fallback;
}

function projectNameFromUrl(value) {
  const text = clean(value, "Project");
  try {
    const url = new URL(text);
    const parts = url.pathname.split("/").filter(Boolean);
    return parts.slice(-2).join("/") || url.hostname;
  } catch {
    return text.replace(/^https?:\/\//, "").split(/[?#]/)[0] || "Project";
  }
}

function buildBrief(form) {
  const data = new FormData(form);
  const project = clean(data.get("project"));
  const scope = clean(data.get("scope"));
  const visibility = clean(data.get("visibility"));
  const network = clean(data.get("network"));
  const targetDate = clean(data.get("targetDate"), "48h default after payment confirmation and scope acceptance");
  const risk = clean(data.get("risk"));

  return [
    "## Project or repo URL",
    project,
    "",
    "## Scope",
    scope,
    "",
    "## Delivery visibility",
    visibility,
    "",
    "## Target delivery date",
    targetDate,
    "",
    "## Payment network",
    network,
    "",
    "## Transaction hash",
    "Pending until scope is accepted and payment is sent.",
    "",
    "## Highest concern",
    risk,
    "",
    "## Confirmation",
    "- [x] I will not include secrets, credentials, cookies, private keys, or sensitive customer data.",
    "- [x] I understand this is a USD $1,000 fixed-price audit for one repo or product slice.",
    "- [x] I reviewed the Statement of Work: https://jackjin1997.github.io/agent-audit-sprint/terms.html",
  ].join("\n");
}

function updateBrief() {
  if (!intakeForm) return;
  const output = intakeForm.querySelector("[data-brief-output]");
  const openLink = intakeForm.querySelector("[data-open-brief]");
  const brief = buildBrief(intakeForm);
  const project = clean(new FormData(intakeForm).get("project"), "project name");
  const title = `Audit request: ${projectNameFromUrl(project)}`;
  output.value = brief;
  openLink.href = `https://github.com/jackjin1997/agent-audit-sprint/issues/new?labels=audit-request&title=${encodeURIComponent(title)}&body=${encodeURIComponent(brief)}`;
}

if (intakeForm) {
  updateBrief();
  intakeForm.addEventListener("input", updateBrief);
  intakeForm.addEventListener("change", updateBrief);
  intakeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateBrief();
    intakeForm.querySelector("[data-brief-output]").focus();
  });

  intakeForm.querySelector("[data-copy-brief]").addEventListener("click", async (event) => {
    updateBrief();
    const output = intakeForm.querySelector("[data-brief-output]");
    try {
      await navigator.clipboard.writeText(output.value);
      setButtonText(event.currentTarget, "Copied");
    } catch {
      output.select();
      setButtonText(event.currentTarget, "Select");
    }
  });
}

const openRouterCostForm = document.querySelector("[data-openrouter-cost-form]");

function numberField(form, name, fallback = 0) {
  const value = Number(new FormData(form).get(name));
  return Number.isFinite(value) ? value : fallback;
}

function usd(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 100 ? 0 : 2,
  }).format(Math.max(0, value));
}

function compactNumber(value) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.max(0, value));
}

function openRouterPackage(total, daily, retryPercent, toolCalls) {
  if (total >= 1000 || daily >= 150) {
    return {
      label: "USD $1,000 AI Cost Spike Emergency Sprint",
      template: "ai-cost-spike-emergency.yml",
      tokenMeterPath: "emergency",
      reason: "the estimate is already in emergency-spike territory or the daily burn rate needs containment",
    };
  }
  if (total >= 299 || retryPercent >= 15 || toolCalls >= 5) {
    return {
      label: "USD $299 AI Agent Cost Leak Review",
      template: "agent-cost-leak-review.yml",
      tokenMeterPath: "agent",
      reason: "the workload has enough recurring cost, retry overhead, or tool fanout to justify a focused leak review",
    };
  }
  return {
    label: "USD $99 Quick AI API Cost Audit",
    template: "paid-audit-intent.yml",
    tokenMeterPath: "quick",
    reason: "the estimate looks like a bounded pricing and provider-cost sanity check",
  };
}

function selectedOpenRouterModel(form) {
  const select = form.querySelector("[name='modelPreset']");
  return select?.selectedOptions?.[0]?.value || "OpenRouter editable custom model";
}

function syncOpenRouterPreset(form) {
  const selected = form.querySelector("[name='modelPreset']")?.selectedOptions?.[0];
  if (!selected) return;
  const inputPrice = form.querySelector("[name='inputPrice']");
  const outputPrice = form.querySelector("[name='outputPrice']");
  const cachePrice = form.querySelector("[name='cachePrice']");
  inputPrice.value = selected.dataset.inputPrice || inputPrice.value;
  outputPrice.value = selected.dataset.outputPrice || outputPrice.value;
  cachePrice.value = selected.dataset.cachePrice || cachePrice.value;
}

function calculateOpenRouterCost(form) {
  const monthlyRequests = numberField(form, "monthlyRequests", 0);
  const inputTokens = numberField(form, "inputTokens", 0);
  const outputTokens = numberField(form, "outputTokens", 0);
  const cacheReadPercent = Math.min(100, Math.max(0, numberField(form, "cacheReadPercent", 0)));
  const retryPercent = Math.max(0, numberField(form, "retryPercent", 0));
  const toolCalls = Math.max(0, numberField(form, "toolCalls", 0));
  const inputPrice = Math.max(0, numberField(form, "inputPrice", 0));
  const outputPrice = Math.max(0, numberField(form, "outputPrice", 0));
  const cachePrice = Math.max(0, numberField(form, "cachePrice", 0));
  const effectiveRequests = monthlyRequests * (1 + retryPercent / 100);
  const cachedInputTokens = effectiveRequests * inputTokens * (cacheReadPercent / 100);
  const uncachedInputTokens = effectiveRequests * inputTokens - cachedInputTokens;
  const monthlyOutputTokens = effectiveRequests * outputTokens;
  const inputCost = (uncachedInputTokens / 1_000_000) * inputPrice;
  const cacheCost = (cachedInputTokens / 1_000_000) * cachePrice;
  const outputCost = (monthlyOutputTokens / 1_000_000) * outputPrice;
  const total = inputCost + cacheCost + outputCost;
  const daily = total / 30;
  return {
    monthlyRequests,
    inputTokens,
    outputTokens,
    cacheReadPercent,
    retryPercent,
    toolCalls,
    inputPrice,
    outputPrice,
    cachePrice,
    effectiveRequests,
    uncachedInputTokens,
    cachedInputTokens,
    monthlyOutputTokens,
    inputCost,
    cacheCost,
    outputCost,
    total,
    daily,
  };
}

function normalizeUsageKey(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseMaybeNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  const text = String(value ?? "").replace(/[,$]/g, "").trim();
  if (!text) return 0;
  const number = Number(text);
  return Number.isFinite(number) ? number : 0;
}

function flattenUsageRow(value, prefix = "", output = {}) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return output;
  Object.entries(value).forEach(([key, entry]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      flattenUsageRow(entry, path, output);
      return;
    }
    const normalizedPath = normalizeUsageKey(path);
    const normalizedKey = normalizeUsageKey(key);
    output[normalizedPath] = entry;
    if (!(normalizedKey in output)) output[normalizedKey] = entry;
  });
  return output;
}

function usageValue(flat, keys) {
  for (const key of keys) {
    const normalized = normalizeUsageKey(key);
    if (normalized in flat) return flat[normalized];
  }
  return "";
}

function usageNumber(flat, keys) {
  return parseMaybeNumber(usageValue(flat, keys));
}

function usageTruthy(flat, keys) {
  const value = usageValue(flat, keys);
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  const text = String(value || "").toLowerCase().trim();
  return Boolean(text && !["false", "0", "null", "none", "success", "ok"].includes(text));
}

function parseCsvRows(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return [];

  function parseLine(line) {
    const cells = [];
    let cell = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const next = line[index + 1];
      if (char === '"' && quoted && next === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') {
        quoted = !quoted;
      } else if (char === "," && !quoted) {
        cells.push(cell.trim());
        cell = "";
      } else {
        cell += char;
      }
    }
    cells.push(cell.trim());
    return cells;
  }

  const headers = parseLine(lines[0]);
  if (headers.length < 2) return [];
  return lines.slice(1).map((line) => {
    const cells = parseLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = cells[index] ?? "";
      return row;
    }, {});
  });
}

function rowsFromUsageJson(value) {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  for (const key of ["data", "rows", "usage", "items", "results", "requests", "generations", "logs", "records"]) {
    if (Array.isArray(value[key])) return value[key];
  }
  return [value];
}

function parseUsageRows(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return [];
  try {
    return rowsFromUsageJson(JSON.parse(trimmed));
  } catch {
    // Fall through to JSONL or CSV.
  }

  const lines = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1) {
    try {
      return lines.map((line) => JSON.parse(line));
    } catch {
      // Fall through to CSV.
    }
  }
  return parseCsvRows(trimmed);
}

function summarizeUsageRows(rows, sampleDays) {
  const modelCounts = new Map();
  let inputTokensTotal = 0;
  let outputTokensTotal = 0;
  let cacheTokensTotal = 0;
  let toolCallsTotal = 0;
  let rowsWithToolCalls = 0;
  let retryOrFailedRows = 0;

  rows.forEach((row) => {
    const flat = flattenUsageRow(row);
    inputTokensTotal += usageNumber(flat, [
      "input_tokens",
      "prompt_tokens",
      "inputTokens",
      "promptTokens",
      "usage.prompt_tokens",
      "tokens_in",
      "tokensIn",
    ]);
    outputTokensTotal += usageNumber(flat, [
      "output_tokens",
      "completion_tokens",
      "outputTokens",
      "completionTokens",
      "usage.completion_tokens",
      "tokens_out",
      "tokensOut",
    ]);
    cacheTokensTotal += usageNumber(flat, [
      "cache_read_tokens",
      "cached_tokens",
      "cached_prompt_tokens",
      "cacheReadTokens",
      "prompt_cache_hit_tokens",
      "usage.prompt_tokens_details.cached_tokens",
    ]);

    const directToolCalls = Array.isArray(row?.tool_calls) ? row.tool_calls.length : 0;
    const toolCalls = directToolCalls || usageNumber(flat, ["tool_calls", "toolCalls", "tool_call_count", "toolCallCount"]);
    if (toolCalls > 0) {
      toolCallsTotal += toolCalls;
      rowsWithToolCalls += 1;
    }

    const model = clean(usageValue(flat, ["model", "model_id", "modelId", "generation_model", "provider_model"]), "");
    if (model) modelCounts.set(model, (modelCounts.get(model) || 0) + 1);

    const status = String(usageValue(flat, ["status", "state", "finish_reason", "finishReason"]) || "").toLowerCase();
    const failedStatus = /fail|error|timeout|rate[_ -]?limit|cancel|retry/.test(status);
    if (failedStatus || usageTruthy(flat, ["error", "failed", "retry", "retried", "timeout"])) {
      retryOrFailedRows += 1;
    }
  });

  const rowCount = rows.length;
  const safeSampleDays = Math.min(31, Math.max(1, Number(sampleDays) || 30));
  const monthlyRequests = Math.max(1, Math.round(rowCount * (30 / safeSampleDays)));
  const averageInputTokens = Math.round((inputTokensTotal || cacheTokensTotal) / Math.max(1, rowCount));
  const averageOutputTokens = Math.round(outputTokensTotal / Math.max(1, rowCount));
  const cacheBase = Math.max(inputTokensTotal, cacheTokensTotal);
  const cacheReadPercent = cacheBase > 0 ? Math.round((cacheTokensTotal / cacheBase) * 100) : 0;
  const successfulRows = Math.max(1, rowCount - retryOrFailedRows);
  const retryPercent = Math.round((retryOrFailedRows / successfulRows) * 100);
  const averageToolCalls = rowsWithToolCalls ? Math.round(toolCallsTotal / rowsWithToolCalls) : 0;
  const models = [...modelCounts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 4)
    .map(([model, count]) => `${model} (${count})`);

  return {
    rowCount,
    sampleDays: safeSampleDays,
    monthlyRequests,
    averageInputTokens,
    averageOutputTokens,
    cacheReadPercent: Math.min(100, Math.max(0, cacheReadPercent)),
    retryPercent,
    averageToolCalls,
    inputTokensTotal,
    outputTokensTotal,
    cacheTokensTotal,
    retryOrFailedRows,
    models,
  };
}

function applyUsageImportToOpenRouterForm(form) {
  const importText = form.querySelector("[name='usageImport']")?.value || "";
  const summaryTarget = form.querySelector("[data-openrouter-import-summary]");
  let rows = [];
  try {
    rows = parseUsageRows(importText).filter((row) => row && typeof row === "object");
  } catch {
    rows = [];
  }
  if (!rows.length) {
    form.dataset.openrouterImportedUsageSummary = "";
    if (summaryTarget) summaryTarget.textContent = "No usage rows imported. Paste sanitized JSON, JSONL, or CSV with token count fields.";
    return;
  }

  const summary = summarizeUsageRows(rows, numberField(form, "usageSampleDays", 30));
  form.querySelector("[name='monthlyRequests']").value = String(summary.monthlyRequests);
  form.querySelector("[name='inputTokens']").value = String(summary.averageInputTokens);
  form.querySelector("[name='outputTokens']").value = String(summary.averageOutputTokens);
  form.querySelector("[name='cacheReadPercent']").value = String(summary.cacheReadPercent);
  form.querySelector("[name='retryPercent']").value = String(summary.retryPercent);
  if (summary.averageToolCalls > 0) {
    form.querySelector("[name='toolCalls']").value = String(summary.averageToolCalls);
  }

  const modelSummary = summary.models.length ? summary.models.join(", ") : "model field not detected";
  form.dataset.openrouterImportedUsageSummary = [
    `Imported usage rows: ${compactNumber(summary.rowCount)} over ${summary.sampleDays} day sample`,
    `Scaled monthly requests: ${compactNumber(summary.monthlyRequests)}`,
    `Detected models: ${modelSummary}`,
    `Imported token totals: ${compactNumber(summary.inputTokensTotal)} input, ${compactNumber(summary.outputTokensTotal)} output, ${compactNumber(summary.cacheTokensTotal)} cache-read`,
    `Retry or failed rows: ${compactNumber(summary.retryOrFailedRows)}`,
  ].join("\n");
  if (summaryTarget) {
    summaryTarget.textContent = `Imported ${compactNumber(summary.rowCount)} rows over ${summary.sampleDays} day sample; scaled to ${compactNumber(summary.monthlyRequests)} monthly requests. Models: ${modelSummary}.`;
  }
  updateOpenRouterCost();
}

function buildOpenRouterPacket(form, result, route) {
  const data = new FormData(form);
  const project = clean(data.get("project"), "Project or workflow TBD");
  const question = clean(data.get("question"), "Which cost controls should change first?");
  const evidence = clean(data.get("evidence"), "Sanitized evidence TBD");
  const model = selectedOpenRouterModel(form);
  const importSummary = clean(form.dataset.openrouterImportedUsageSummary, "");
  return [
    "## OpenRouter / LLM cost review request",
    "",
    `Project or workflow URL: ${project}`,
    `Recommended package: ${route.label}`,
    `Reason: ${route.reason}.`,
    `Model preset or editable model: ${model}`,
    "",
    "## Calculator snapshot",
    "",
    `Estimated monthly model cost: ${usd(result.total)}`,
    `Estimated daily model cost: ${usd(result.daily)}`,
    `Monthly requests: ${compactNumber(result.monthlyRequests)}`,
    `Effective requests after retry overhead: ${compactNumber(result.effectiveRequests)}`,
    `Average input tokens/request: ${compactNumber(result.inputTokens)}`,
    `Average output tokens/request: ${compactNumber(result.outputTokens)}`,
    `Cache-read share of input tokens: ${result.cacheReadPercent}%`,
    `Retry or failed-run overhead: ${result.retryPercent}%`,
    `Tool calls per run: ${compactNumber(result.toolCalls)}`,
    `Uncached input tokens/month: ${compactNumber(result.uncachedInputTokens)}`,
    `Cached input tokens/month: ${compactNumber(result.cachedInputTokens)}`,
    `Output tokens/month: ${compactNumber(result.monthlyOutputTokens)}`,
    `Input price per 1M uncached tokens: ${usd(result.inputPrice)}`,
    `Output price per 1M tokens: ${usd(result.outputPrice)}`,
    `Cache-read price per 1M tokens: ${usd(result.cachePrice)}`,
    ...(importSummary ? ["", "## Usage import summary", "", importSummary] : []),
    "",
    "## Highest cost question",
    "",
    question,
    "",
    "## Sanitized evidence summary",
    "",
    evidence,
    "",
    "## Links",
    "",
    `TokenMeter audit path: https://tokenmeter-mu.vercel.app/audit?path=${route.tokenMeterPath}&source=openrouter-calculator`,
    "Focused review page: https://jackjin1997.github.io/agent-audit-sprint/ai-agent-cost-leak-review.html",
    "Emergency sprint page: https://jackjin1997.github.io/agent-audit-sprint/ai-cost-spike-emergency.html",
    "",
    "## Confirmation",
    "",
    "- [x] I will not include private prompts, API keys, customer data, provider account IDs, raw production traces, or sensitive billing details in a public issue.",
    "- [x] I understand payment is only requested after written scope acceptance.",
    "- [x] I understand calculator pricing is an editable estimate and final scope/payment must be accepted in writing.",
  ].join("\n");
}

function updateOpenRouterCost() {
  if (!openRouterCostForm) return;
  const result = calculateOpenRouterCost(openRouterCostForm);
  const route = openRouterPackage(result.total, result.daily, result.retryPercent, result.toolCalls);
  const packet = buildOpenRouterPacket(openRouterCostForm, result, route);
  const total = document.querySelector("[data-openrouter-total]");
  const daily = document.querySelector("[data-openrouter-daily]");
  const fit = document.querySelector("[data-openrouter-fit]");
  const output = openRouterCostForm.querySelector("[data-openrouter-packet]");
  const openLink = openRouterCostForm.querySelector("[data-openrouter-open-brief]");
  const project = clean(new FormData(openRouterCostForm).get("project"), "OpenRouter cost review");
  total.textContent = `${usd(result.total)} estimated monthly model cost`;
  daily.textContent = `${usd(result.daily)} estimated daily model cost`;
  fit.textContent = route.label;
  output.value = packet;
  openLink.href = `https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=${encodeURIComponent(route.template)}&title=${encodeURIComponent(`OpenRouter cost review: ${projectNameFromUrl(project)}`)}&body=${encodeURIComponent(packet)}`;
}

if (openRouterCostForm) {
  updateOpenRouterCost();
  openRouterCostForm.addEventListener("input", updateOpenRouterCost);
  openRouterCostForm.addEventListener("change", (event) => {
    if (event.target?.name === "modelPreset") {
      syncOpenRouterPreset(openRouterCostForm);
    }
    updateOpenRouterCost();
  });
  openRouterCostForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateOpenRouterCost();
    openRouterCostForm.querySelector("[data-openrouter-packet]").focus();
  });
  openRouterCostForm.querySelector("[data-copy-openrouter-packet]").addEventListener("click", async (event) => {
    updateOpenRouterCost();
    const output = openRouterCostForm.querySelector("[data-openrouter-packet]");
    try {
      await navigator.clipboard.writeText(output.value);
      setButtonText(event.currentTarget, "Copied");
    } catch {
      output.select();
      setButtonText(event.currentTarget, "Select");
    }
  });
  openRouterCostForm.querySelector("[data-import-openrouter-usage]")?.addEventListener("click", () => {
    applyUsageImportToOpenRouterForm(openRouterCostForm);
  });
  openRouterCostForm.querySelector("[data-clear-openrouter-usage]")?.addEventListener("click", () => {
    const importBox = openRouterCostForm.querySelector("[name='usageImport']");
    const summary = openRouterCostForm.querySelector("[data-openrouter-import-summary]");
    if (importBox) importBox.value = "";
    openRouterCostForm.dataset.openrouterImportedUsageSummary = "";
    if (summary) summary.textContent = "Usage import has not been applied.";
    updateOpenRouterCost();
  });
}

const jingleForm = document.querySelector("[data-jingle-form]");
let currentSketchUrl = "";
const jingleEmailRecipient = "jackjin1997@gmail.com";
const ethereumPaymentAddress = "0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF";
const solanaPaymentAddress = "5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM";
const paymentProofUrl = "https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=payment-confirmation.yml";

function mailtoHref(subject, body) {
  return `mailto:${jingleEmailRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

document.querySelectorAll("[data-mailto-target]").forEach((link) => {
  const target = document.querySelector(link.getAttribute("data-mailto-target") || "");
  const subject = link.getAttribute("data-mailto-subject") || "AI music brief";
  const body = target?.textContent?.trim() || "";
  if (body) {
    link.href = mailtoHref(subject, body);
  }
});

const sampleBriefForm = document.querySelector("[data-sample-brief-form]");

function selectedSampleOption(form) {
  return form.querySelector("[name='sample']")?.selectedOptions?.[0] || null;
}

function selectedSamplePackage(form, option) {
  const selectedPackage = clean(new FormData(form).get("package"), "Use sample default package");
  return selectedPackage === "Use sample default package"
    ? option?.dataset.package || "USD $29 Founding Hook Sketch"
    : selectedPackage;
}

function buildSampleBrief(form) {
  const data = new FormData(form);
  const option = selectedSampleOption(form);
  const sample = clean(option?.value, "SaaS Launch Hero Hook");
  const selectedPackage = selectedSamplePackage(form, option);
  const brand = clean(data.get("brand"), "Brand, show, channel, or product TBD");
  const projectUrl = clean(data.get("projectUrl"), "Website, product page, or social link TBD");
  const channel = clean(data.get("channel"), "Publishing channel TBD");
  const rights = clean(data.get("rights"), "Source material rights TBD");
  const audience = clean(data.get("audience"), "Audience and offer TBD");
  const cta = clean(data.get("cta"), "Required CTA or product claim TBD");
  const deadline = clean(data.get("deadline"), "Deadline TBD");
  const sampleUrl = option?.dataset.url || "https://jackjin1997.github.io/agent-audit-sprint/ai-music-samples.html";
  const primaryUse = option?.dataset.primaryUse || "short paid music hook";
  const delivery = option?.dataset.delivery || "one selected short AI-assisted music hook sketch";
  const service = option?.dataset.service || "https://jackjin1997.github.io/agent-audit-sprint/ai-music-generator.html";

  return [
    "AI music sample brief",
    "",
    `Package: ${selectedPackage}`,
    `Reference sample: ${sample}`,
    `Sample URL: ${sampleUrl}`,
    `Best-fit service page: ${service}`,
    `Brand, show, channel, or product name: ${brand}`,
    `Website, product page, or social link: ${projectUrl}`,
    `Primary use: ${primaryUse}`,
    `Publishing channel: ${channel}`,
    `Source material rights: ${rights}`,
    `Audience and offer: ${audience}`,
    `Required CTA or product claim: ${cta}`,
    `Deadline: ${deadline}`,
    `Delivery: ${delivery}, production prompt, rough cut note, source/tool note, commercial-use memo, and usage guardrails`,
    "Payment timing: after written brief acceptance only",
    "Avoid: known-artist soundalikes, celebrity/living voice clones, copyrighted songs, and third-party lyrics without rights",
  ].join("\n");
}

function updateSampleBrief() {
  if (!sampleBriefForm) return;
  const option = selectedSampleOption(sampleBriefForm);
  const packet = buildSampleBrief(sampleBriefForm);
  const selectedPackage = selectedSamplePackage(sampleBriefForm, option);
  const template = option?.dataset.template || "ai-jingle-order.yml";
  const labels = option?.dataset.labels || "ai-jingle-order";
  const data = new FormData(sampleBriefForm);
  const brand = clean(data.get("brand"), "AI music sample");
  const sample = clean(option?.value, "sample reference");
  const title = `AI music sample order: ${compactTitle(brand)} - ${sample}`;
  const price = sampleBriefForm.querySelector("[data-sample-brief-price]");
  const templateSummary = sampleBriefForm.querySelector("[data-sample-brief-template]");
  const output = sampleBriefForm.querySelector("[data-sample-brief-output]");
  const emailLink = sampleBriefForm.querySelector("[data-sample-email-brief]");
  const openLink = sampleBriefForm.querySelector("[data-sample-open-order]");
  price.textContent = selectedPackage;
  templateSummary.textContent = template;
  output.value = packet;
  emailLink.href = mailtoHref(`AI music sample brief: ${sample}`, packet);
  openLink.href = `https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=${encodeURIComponent(template)}&labels=${encodeURIComponent(labels)}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(packet)}`;
}

if (sampleBriefForm) {
  updateSampleBrief();
  sampleBriefForm.addEventListener("input", updateSampleBrief);
  sampleBriefForm.addEventListener("change", updateSampleBrief);
  sampleBriefForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateSampleBrief();
    sampleBriefForm.querySelector("[data-sample-brief-output]").focus();
  });
  sampleBriefForm.querySelector("[data-copy-sample-brief]").addEventListener("click", async (event) => {
    updateSampleBrief();
    const output = sampleBriefForm.querySelector("[data-sample-brief-output]");
    try {
      await navigator.clipboard.writeText(output.value);
      setButtonText(event.currentTarget, "Copied");
    } catch {
      output.select();
      setButtonText(event.currentTarget, "Select");
    }
  });
}

function compactTitle(value, fallback = "brand") {
  return clean(value, fallback).replace(/\s+/g, " ").slice(0, 80);
}

function packageAmount(value) {
  const match = String(value || "").match(/USD\s+\$(\d+)/i);
  return match ? `USD $${match[1]}` : "USD $29";
}

function buildJinglePacket(form) {
  const data = new FormData(form);
  const orderHeading = form.dataset.orderHeading || "AI jingle order";
  const brand = clean(data.get("brand"), "Brand TBD");
  const selectedPackage = clean(data.get("package"), "USD $29 Founding Hook Sketch");
  const usage = clean(data.get("usage"), "30 second social ad");
  const timing = clean(data.get("timing"), "48h target");
  const mood = clean(data.get("mood"), "catchy, brand-safe, memorable");
  const style = clean(data.get("style"), "clear vocal hook with polished ad music bed");
  const audience = clean(data.get("audience"), "Audience and offer TBD");
  const tagline = clean(data.get("tagline"), "No required tagline provided");
  const channel = data.has("channel") ? clean(data.get("channel"), "Publishing channel TBD") : "";
  const rightsSource = data.has("rightsSource") ? clean(data.get("rightsSource"), "Source material rights TBD") : "";

  const productionPrompt = [
    `Create a ${usage.toLowerCase()} for "${brand}".`,
    `Mood: ${mood}.`,
    `Voice or style: ${style}.`,
    `Audience and offer: ${audience}.`,
    `Required line or tagline: ${tagline}.`,
    ...(channel ? [`Publishing channel: ${channel}.`] : []),
    ...(rightsSource ? [`Source material rights: ${rightsSource}.`] : []),
    "Keep the hook simple, pronounce the brand clearly, avoid known-artist soundalikes, avoid third-party lyrics, and end cleanly for ad placement.",
  ].join("\n");

  return [
    `## ${orderHeading}`,
    "",
    `Package: ${selectedPackage}`,
    `Brand/show: ${brand}`,
    `Primary use: ${usage}`,
    `Timing: ${timing}`,
    ...(channel ? [`Publishing channel: ${channel}`] : []),
    ...(rightsSource ? [`Source material rights: ${rightsSource}`] : []),
    "",
    "## Brand brief",
    "",
    audience,
    "",
    "## Required line or tagline",
    "",
    tagline,
    "",
    "## Production prompt",
    "",
    productionPrompt,
    "",
    "## Delivery expectations",
    "",
    "- AI-assisted generation with human selection for pronunciation, hook clarity, length fit, and obvious artifacts.",
    "- Payment timing: after written brief acceptance only.",
    "- Deliver prompt/lyric sheet, selected cut notes, source tool summary, and commercial-use assumptions.",
    "- Do not imitate named artists, clone living voices, or include third-party lyrics unless rights are provided.",
    "- Payment is requested only after the brief and package are accepted in writing.",
    "- AI-generated music may have copyright-registration limits; this is not legal clearance.",
  ].join("\n");
}

function buildJingleAcceptancePacket(form) {
  const data = new FormData(form);
  const brand = clean(data.get("brand"), "Brand TBD");
  const selectedPackage = clean(data.get("package"), "USD $29 Founding Hook Sketch");
  const usage = clean(data.get("usage"), "8-12s local ad hook");
  const timing = clean(data.get("timing"), "48h target after accepted brief");
  const tagline = clean(data.get("tagline"), "No required tagline provided");
  const channel = data.has("channel") ? clean(data.get("channel"), "Publishing channel TBD") : "";
  const rightsSource = data.has("rightsSource") ? clean(data.get("rightsSource"), "Source material rights TBD") : "";
  const amount = packageAmount(selectedPackage);

  return [
    "## Acceptance and payment handoff",
    "",
    "Use this only after the written brief and selected package are accepted.",
    "",
    `Package: ${selectedPackage}`,
    `Amount: ${amount} equivalent`,
    `Brand/show/project: ${brand}`,
    `Scope: ${usage}`,
    ...(channel ? [`Publishing channel: ${channel}`] : []),
    ...(rightsSource ? [`Source material rights: ${rightsSource}`] : []),
    `Required line or tagline: ${tagline}`,
    `Delivery target: ${timing} and payment confirmation`,
    "",
    "Acceptance reply:",
    `I accept the ${selectedPackage} for ${brand}. Scope: ${usage}. ${channel ? `Publishing channel: ${channel}. ` : ""}${rightsSource ? `Source material rights: ${rightsSource}. ` : ""}Required line/tagline: ${tagline}. Payment timing: after written brief acceptance only. I will not request known-artist soundalikes, living voice clones, or third-party lyrics without rights.`,
    "",
    "Payment paths after acceptance:",
    `Ethereum address for ETH or ERC-20 USDC/USDT/DAI: ${ethereumPaymentAddress}`,
    `Solana address for SOL or SPL USDC: ${solanaPaymentAddress}`,
    `Payment proof form: ${paymentProofUrl}`,
    `Payment proof service field: ${selectedPackage}`,
    "",
    "Start rule:",
    "The delivery target starts after written brief acceptance and verifiable payment confirmation.",
    "",
    "Usage guardrails:",
    "AI-generated music can have copyright-registration limits; delivery includes usage notes, not legal clearance.",
  ].join("\n");
}

function buildJingleCommercialMemo(form) {
  const data = new FormData(form);
  const brand = clean(data.get("brand"), "Brand TBD");
  const selectedPackage = clean(data.get("package"), "USD $29 Founding Hook Sketch");
  const usage = clean(data.get("usage"), "8-12s local ad hook");
  const channel = clean(data.get("channel"), "Publishing channel TBD");
  const rightsSource = clean(data.get("rightsSource"), "Original prompt only; no third-party lyrics or melodies");
  const tagline = clean(data.get("tagline"), "No required tagline provided");
  const amount = packageAmount(selectedPackage);

  return [
    "## Commercial-use music memo",
    "",
    "This is an order memo and usage record, not legal clearance.",
    "",
    `Project: ${brand}`,
    `Package: ${selectedPackage}`,
    `Amount: ${amount} equivalent`,
    `Primary use: ${usage}`,
    `Publishing channel: ${channel}`,
    `Source material rights: ${rightsSource}`,
    `Required line or tagline: ${tagline}`,
    "Payment timing: after written brief acceptance only",
    "",
    "Included delivery record:",
    "- Selected AI-assisted music direction after human review for pronunciation, hook clarity, placement fit, and obvious artifacts.",
    "- Source tool and plan/tier note recorded for the selected cut when applicable.",
    "- Prompt or lyric sheet, rough cut note, revision scope if included, and usage memo.",
    "",
    "Excluded requests:",
    "- No known-artist soundalikes, living voice clones, copyrighted songs, or third-party lyrics without rights.",
    "- No claim that fully AI-generated music is copyright-registerable in every jurisdiction.",
    "",
    "Start rule:",
    "Paid delivery starts only after the written brief, selected package, publishing channel, and payment path are accepted.",
  ].join("\n");
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function midiToHz(note) {
  return 440 * 2 ** ((note - 69) / 12);
}

function jingleSketchPlan(form) {
  const data = new FormData(form);
  const brand = clean(data.get("brand"), "Brand TBD");
  const usage = clean(data.get("usage"), "30 second social ad");
  const mood = clean(data.get("mood"), "catchy");
  const seed = hashString(`${brand}|${usage}|${mood}`);
  const roots = [
    { name: "C", midi: 60 },
    { name: "D", midi: 62 },
    { name: "E", midi: 64 },
    { name: "G", midi: 67 },
    { name: "A", midi: 69 },
  ];
  const root = roots[seed % roots.length];
  const bpm = 104 + (seed % 29);
  const scale = [0, 2, 4, 7, 9, 12];
  const melody = Array.from({ length: 12 }, (_, index) => {
    const step = (seed >> (index % 16)) + index * 3;
    return root.midi + scale[step % scale.length] + (index % 4 === 3 ? 12 : 0);
  });
  return {
    brand,
    usage,
    mood,
    root: root.name,
    bpm,
    durationSeconds: 8,
    sampleRate: 44100,
    melody,
  };
}

function synthesizeJingleSketch(plan) {
  const totalSamples = plan.sampleRate * plan.durationSeconds;
  const samples = new Float32Array(totalSamples);
  const beatSeconds = 60 / plan.bpm;
  const noteSeconds = beatSeconds * 0.78;

  for (let noteIndex = 0; noteIndex < plan.melody.length; noteIndex += 1) {
    const start = Math.floor(noteIndex * beatSeconds * plan.sampleRate);
    const length = Math.floor(noteSeconds * plan.sampleRate);
    const freq = midiToHz(plan.melody[noteIndex]);
    const harmony = midiToHz(plan.melody[noteIndex] - 12);
    for (let offset = 0; offset < length && start + offset < totalSamples; offset += 1) {
      const time = offset / plan.sampleRate;
      const envelope = Math.min(1, offset / 700) * Math.max(0, 1 - offset / length);
      const tone = Math.sin(2 * Math.PI * freq * time) * 0.22 + Math.sin(2 * Math.PI * harmony * time) * 0.08;
      samples[start + offset] += tone * envelope;
    }
  }

  for (let beat = 0; beat < Math.floor(plan.durationSeconds / beatSeconds); beat += 1) {
    const start = Math.floor(beat * beatSeconds * plan.sampleRate);
    const isAccent = beat % 4 === 0;
    const length = Math.floor((isAccent ? 0.1 : 0.045) * plan.sampleRate);
    for (let offset = 0; offset < length && start + offset < totalSamples; offset += 1) {
      const time = offset / plan.sampleRate;
      const envelope = Math.max(0, 1 - offset / length);
      const freq = isAccent ? 64 - time * 90 : 180;
      samples[start + offset] += Math.sin(2 * Math.PI * freq * time) * envelope * (isAccent ? 0.32 : 0.12);
    }
  }

  for (let index = 0; index < samples.length; index += 1) {
    samples[index] = Math.max(-0.92, Math.min(0.92, samples[index]));
  }

  return samples;
}

function writeAscii(view, offset, value) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function encodeWav(samples, sampleRate) {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  writeAscii(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeAscii(view, 8, "WAVE");
  writeAscii(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, "data");
  view.setUint32(40, samples.length * 2, true);
  let offset = 44;
  for (let index = 0; index < samples.length; index += 1) {
    const value = Math.max(-1, Math.min(1, samples[index]));
    view.setInt16(offset, value < 0 ? value * 0x8000 : value * 0x7fff, true);
    offset += 2;
  }
  return new Blob([view], { type: "audio/wav" });
}

function updateSketchDownload(form) {
  const link = form.querySelector("[data-download-jingle-sketch]");
  const status = form.querySelector("[data-jingle-sketch-status]");
  const plan = jingleSketchPlan(form);
  const samples = synthesizeJingleSketch(plan);
  const blob = encodeWav(samples, plan.sampleRate);
  if (currentSketchUrl) URL.revokeObjectURL(currentSketchUrl);
  currentSketchUrl = URL.createObjectURL(blob);
  link.href = currentSketchUrl;
  link.download = `${plan.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "ai-jingle"}-sketch.wav`;
  status.textContent = `Browser sketch ready: ${plan.root} major, ${plan.bpm} BPM, ${plan.durationSeconds}s draft for ${plan.usage}. Paid delivery uses selected AI-assisted generations and a usage memo.`;
  return { plan, samples };
}

async function playJingleSketch(form) {
  const status = form.querySelector("[data-jingle-sketch-status]");
  const { plan, samples } = updateSketchDownload(form);
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    status.textContent = "Audio preview is not supported in this browser, but the WAV sketch download is ready.";
    return;
  }
  const context = new AudioContextClass();
  const buffer = context.createBuffer(1, samples.length, plan.sampleRate);
  buffer.copyToChannel(samples, 0);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  source.start();
  status.textContent = `Playing browser sketch: ${plan.root} major, ${plan.bpm} BPM, ${plan.durationSeconds}s draft for ${plan.brand}.`;
}

function updateJingleBrief() {
  if (!jingleForm) return;
  const output = jingleForm.querySelector("[data-jingle-output]");
  const acceptanceOutput = jingleForm.querySelector("[data-jingle-acceptance-output]");
  const commercialOutput = jingleForm.querySelector("[data-jingle-commercial-output]");
  const openLink = jingleForm.querySelector("[data-open-jingle-brief]");
  const emailLink = jingleForm.querySelector("[data-email-jingle-brief]");
  const acceptanceEmailLink = jingleForm.querySelector("[data-email-jingle-acceptance]");
  const commercialEmailLink = jingleForm.querySelector("[data-email-jingle-commercial-memo]");
  const packet = buildJinglePacket(jingleForm);
  const acceptancePacket = buildJingleAcceptancePacket(jingleForm);
  const commercialMemo = buildJingleCommercialMemo(jingleForm);
  const brand = compactTitle(new FormData(jingleForm).get("brand"), "brand");
  const titlePrefix = jingleForm.dataset.orderTitlePrefix || "AI jingle order";
  const emailPrefix = jingleForm.dataset.emailSubjectPrefix || "AI jingle brief";
  const orderTemplate = jingleForm.dataset.orderTemplate || "ai-jingle-order.yml";
  const orderLabels = jingleForm.dataset.orderLabels || "ai-jingle-order";
  const title = `${titlePrefix}: ${brand}`;
  output.value = packet;
  if (acceptanceOutput) {
    acceptanceOutput.value = acceptancePacket;
  }
  if (commercialOutput) {
    commercialOutput.value = commercialMemo;
  }
  openLink.href = `https://github.com/jackjin1997/agent-audit-sprint/issues/new?template=${encodeURIComponent(orderTemplate)}&labels=${encodeURIComponent(orderLabels)}&title=${encodeURIComponent(title)}&body=${encodeURIComponent(packet)}`;
  if (emailLink) {
    emailLink.href = mailtoHref(`${emailPrefix}: ${brand}`, packet);
  }
  if (acceptanceEmailLink) {
    acceptanceEmailLink.href = mailtoHref(`${emailPrefix} accepted package: ${brand}`, acceptancePacket);
  }
  if (commercialEmailLink) {
    commercialEmailLink.href = mailtoHref(`${emailPrefix} commercial-use memo: ${brand}`, commercialMemo);
  }
  updateSketchDownload(jingleForm);
}

if (jingleForm) {
  updateJingleBrief();
  jingleForm.addEventListener("input", updateJingleBrief);
  jingleForm.addEventListener("change", updateJingleBrief);
  jingleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateJingleBrief();
    jingleForm.querySelector("[data-jingle-output]").focus();
  });

  jingleForm.querySelector("[data-copy-jingle-brief]").addEventListener("click", async (event) => {
    updateJingleBrief();
    const output = jingleForm.querySelector("[data-jingle-output]");
    try {
      await navigator.clipboard.writeText(output.value);
      setButtonText(event.currentTarget, "Copied");
    } catch {
      output.select();
      setButtonText(event.currentTarget, "Select");
    }
  });

  const copyAcceptanceButton = jingleForm.querySelector("[data-copy-jingle-acceptance]");
  if (copyAcceptanceButton) {
    copyAcceptanceButton.addEventListener("click", async (event) => {
      updateJingleBrief();
      const output = jingleForm.querySelector("[data-jingle-acceptance-output]");
      try {
        await navigator.clipboard.writeText(output.value);
        setButtonText(event.currentTarget, "Copied");
      } catch {
        output.select();
        setButtonText(event.currentTarget, "Select");
      }
    });
  }

  const copyCommercialMemoButton = jingleForm.querySelector("[data-copy-jingle-commercial-memo]");
  if (copyCommercialMemoButton) {
    copyCommercialMemoButton.addEventListener("click", async (event) => {
      updateJingleBrief();
      const output = jingleForm.querySelector("[data-jingle-commercial-output]");
      try {
        await navigator.clipboard.writeText(output.value);
        setButtonText(event.currentTarget, "Copied");
      } catch {
        output.select();
        setButtonText(event.currentTarget, "Select");
      }
    });
  }

  jingleForm.querySelector("[data-play-jingle-sketch]").addEventListener("click", async () => {
    await playJingleSketch(jingleForm);
  });

  jingleForm.querySelector("[data-download-jingle-sketch]").addEventListener("click", () => {
    updateSketchDownload(jingleForm);
  });
}
