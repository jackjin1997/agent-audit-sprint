import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_REPOSITORY = "jackjin1997/agent-audit-sprint";
const DEFAULT_ETH_ADDRESS = "0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF";
const DEFAULT_SOL_ADDRESS = "5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM";
const REPO_ROOT = resolve(import.meta.dirname, "..");
const DEFAULT_LEAD_WATCHLIST_PATH = resolve(REPO_ROOT, "private-notes", "lead-watchlist.json");
const LEAD_WATCHLIST_PATH = process.env.GOAL_LEAD_WATCHLIST_PATH
  ? resolve(process.env.GOAL_LEAD_WATCHLIST_PATH)
  : DEFAULT_LEAD_WATCHLIST_PATH;
const ETH_RPC_URL = process.env.ETH_RPC_URL || "https://ethereum.publicnode.com";
const SOL_RPC_URLS = uniqueList([
  ...(process.env.SOL_RPC_URLS || process.env.SOL_RPC_URL || "").split(/[,\s]+/),
  "https://api.mainnet-beta.solana.com",
  "https://solana-rpc.publicnode.com",
]);
const FETCH_TIMEOUT_MS = Number(process.env.GOAL_FETCH_TIMEOUT_MS || "6000");
const TARGET_USD = Number(process.env.GOAL_USD_TARGET || "1000");
const ATTENTION_THRESHOLD_USD = Number(process.env.GOAL_ATTENTION_THRESHOLD_USD || "900");
const REVENUE_PACKAGE_ATTENTION_USD = Number(process.env.GOAL_REVENUE_PACKAGE_ATTENTION_USD || "29");
const ETH_ATTENTION_THRESHOLD = Number(process.env.GOAL_ETH_ATTENTION_THRESHOLD || "0.3");
const SOL_ATTENTION_THRESHOLD = Number(process.env.GOAL_SOL_ATTENTION_THRESHOLD || "8");
const ATTENTION_FAIL = process.env.GOAL_ATTENTION_FAIL === "true";

const ETH_ADDRESS = process.env.GOAL_ETH_ADDRESS || DEFAULT_ETH_ADDRESS;
const SOL_ADDRESS = process.env.GOAL_SOL_ADDRESS || DEFAULT_SOL_ADDRESS;
const REPOSITORY = process.env.GITHUB_REPOSITORY || DEFAULT_REPOSITORY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || getLocalGithubToken();

const ERC20_TOKENS = [
  ["USDC", "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 6],
  ["USDT", "0xdAC17F958D2ee523a2206206994597C13D831ec7", 6],
  ["DAI", "0x6B175474E89094C44Da98b954EedeAC495271d0F", 18],
];
const SOL_USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const INTAKE_LABELS = new Set([
  "audit-request",
  "audit-intent",
  "payment-proof",
  "code-scanning-audit",
  "ai-agent-audit",
  "ai-jingle-order",
  "ai-product-video-music-order",
  "ugc-agency-music-hook-order",
]);

function bigintToDecimal(value, decimals) {
  const raw = typeof value === "bigint" ? value : BigInt(value);
  const base = 10n ** BigInt(decimals);
  const whole = raw / base;
  const fraction = raw % base;
  if (fraction === 0n) return whole.toString();
  return `${whole}.${fraction.toString().padStart(decimals, "0").replace(/0+$/, "")}`;
}

function decimalToNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getLocalGithubToken() {
  try {
    return execFileSync("gh", ["auth", "token"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 5000,
    }).trim();
  } catch {
    return "";
  }
}

function uniqueList(values) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

async function fetchJson(url, options = {}) {
  return retry(async () => {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "accept": "application/vnd.github+json",
        "user-agent": "agent-audit-sprint-goal-monitor",
        ...(options.headers || {}),
      },
    });
    if (!response.ok) {
      throw new Error(`${url} returned ${response.status} ${response.statusText}: ${await response.text()}`);
    }
    return response.json();
  });
}

async function rpc(url, method, params, attempts = 3) {
  return retry(async () => {
    const response = await fetch(url, {
      method: "POST",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    });
    if (!response.ok) {
      throw new Error(`${method} returned ${response.status} ${response.statusText}: ${await response.text()}`);
    }
    const result = await response.json();
    if (result.error) {
      throw new Error(`${method} RPC error: ${JSON.stringify(result.error)}`);
    }
    return result.result;
  }, attempts);
}

async function rpcWithFallback(urls, method, params) {
  const errors = [];
  for (const url of urls) {
    try {
      return await rpc(url, method, params, 1);
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }
  throw new Error(`${method} failed on all RPC URLs: ${errors.join(" | ")}`);
}

async function retry(operation, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }
  throw lastError;
}

async function getOpenIssues() {
  const headers = GITHUB_TOKEN ? { authorization: `Bearer ${GITHUB_TOKEN}` } : {};
  const issues = await fetchJson(`https://api.github.com/repos/${REPOSITORY}/issues?state=open&per_page=100`, { headers });
  return issues
    .filter((issue) => !issue.pull_request)
    .map((issue) => {
      const labels = issue.labels.map((label) => label.name);
      return {
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        labels,
        createdAt: issue.created_at,
        isIntake: labels.some((label) => INTAKE_LABELS.has(label)),
      };
    });
}

function readLeadWatchlist() {
  if (!existsSync(LEAD_WATCHLIST_PATH)) return [];
  const parsed = JSON.parse(readFileSync(LEAD_WATCHLIST_PATH, "utf8"));
  if (!Array.isArray(parsed)) {
    throw new Error(`${LEAD_WATCHLIST_PATH} must contain a JSON array`);
  }
  return parsed
    .filter((entry) => entry && entry.repo && entry.issue)
    .map((entry) => ({
      repo: String(entry.repo),
      issue: Number(entry.issue),
      self: String(entry.self || "jackjin1997"),
      watchAfter: entry.watchAfter ? new Date(entry.watchAfter) : new Date(0),
      url: entry.url ? String(entry.url) : `https://github.com/${entry.repo}/issues/${entry.issue}`,
      reason: entry.reason ? String(entry.reason) : "watched lead",
    }))
    .filter((entry) => Number.isInteger(entry.issue) && !Number.isNaN(entry.watchAfter.getTime()));
}

async function getLeadReplies() {
  const watchlist = readLeadWatchlist();
  if (!watchlist.length) return [];
  const headers = GITHUB_TOKEN ? { authorization: `Bearer ${GITHUB_TOKEN}` } : {};
  const replies = [];
  for (const lead of watchlist) {
    let comments;
    try {
      comments = await fetchJson(`https://api.github.com/repos/${lead.repo}/issues/${lead.issue}/comments?per_page=100`, {
        headers,
      });
    } catch (error) {
      if (/ returned (404|410) /.test(error.message)) {
        continue;
      }
      throw error;
    }
    for (const comment of comments) {
      const createdAt = new Date(comment.created_at);
      if (comment.user?.login !== lead.self && createdAt > lead.watchAfter) {
        replies.push({
          repo: lead.repo,
          issue: lead.issue,
          issueUrl: lead.url,
          reason: lead.reason,
          author: comment.user?.login || "unknown",
          createdAt: comment.created_at,
          url: comment.html_url,
        });
      }
    }
  }
  return replies;
}

async function getPrices() {
  try {
    const prices = await fetchJson(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum,solana&vs_currencies=usd",
      { headers: { accept: "application/json" } }
    );
    return {
      ETH: Number(prices.ethereum?.usd) || null,
      SOL: Number(prices.solana?.usd) || null,
    };
  } catch (error) {
    return { ETH: null, SOL: null, error: error.message };
  }
}

async function getEthereumBalances() {
  const nativeHex = await rpc(ETH_RPC_URL, "eth_getBalance", [ETH_ADDRESS, "latest"]);
  const addressWord = ETH_ADDRESS.toLowerCase().replace(/^0x/, "").padStart(64, "0");
  const erc20 = {};
  for (const [symbol, contract, decimals] of ERC20_TOKENS) {
    const balanceHex = await rpc(ETH_RPC_URL, "eth_call", [
      { to: contract, data: `0x70a08231${addressWord}` },
      "latest",
    ]);
    erc20[symbol] = bigintToDecimal(balanceHex, decimals);
  }
  return {
    address: ETH_ADDRESS,
    nativeETH: bigintToDecimal(nativeHex, 18),
    erc20,
  };
}

async function getSolanaBalances() {
  const checkErrors = [];
  let nativeSOL = "0";
  let splUSDC = "0";
  try {
    const native = await rpcWithFallback(SOL_RPC_URLS, "getBalance", [SOL_ADDRESS]);
    nativeSOL = bigintToDecimal(native.value, 9);
  } catch (error) {
    checkErrors.push({ source: "solanaNativeSOL", error: error.message });
  }
  try {
    const tokenAccounts = await rpcWithFallback(SOL_RPC_URLS, "getTokenAccountsByOwner", [
      SOL_ADDRESS,
      { mint: SOL_USDC_MINT },
      { encoding: "jsonParsed" },
    ]);
    let usdcRaw = 0n;
    for (const account of tokenAccounts.value || []) {
      const amount = account.account?.data?.parsed?.info?.tokenAmount?.amount;
      if (amount) usdcRaw += BigInt(amount);
    }
    splUSDC = bigintToDecimal(usdcRaw, 6);
  } catch (error) {
    checkErrors.push({ source: "solanaSplUSDC", error: error.message });
  }
  if (checkErrors.length >= 2) {
    throw new Error(checkErrors.map((error) => `${error.source}: ${error.error}`).join("; "));
  }
  return {
    address: SOL_ADDRESS,
    nativeSOL,
    splUSDC,
    checkErrors,
  };
}

function computePaymentSignal(ethereum, solana, prices) {
  const stablecoinUsd =
    decimalToNumber(ethereum.erc20.USDC) +
    decimalToNumber(ethereum.erc20.USDT) +
    decimalToNumber(ethereum.erc20.DAI) +
    decimalToNumber(solana.splUSDC);
  const nativeEstimateUsd =
    decimalToNumber(ethereum.nativeETH) * (prices.ETH || 0) +
    decimalToNumber(solana.nativeSOL) * (prices.SOL || 0);
  const nativeFallbackSignal =
    decimalToNumber(ethereum.nativeETH) >= ETH_ATTENTION_THRESHOLD ||
    decimalToNumber(solana.nativeSOL) >= SOL_ATTENTION_THRESHOLD;
  const estimatedUsd = stablecoinUsd + nativeEstimateUsd;
  return {
    stablecoinUsd,
    nativeEstimateUsd,
    estimatedUsd,
    revenuePackageAttentionUsd: REVENUE_PACKAGE_ATTENTION_USD,
    nativeFallbackSignal,
    nativeFallbackThresholds: {
      ETH: ETH_ATTENTION_THRESHOLD,
      SOL: SOL_ATTENTION_THRESHOLD,
    },
    potentialPayment:
      stablecoinUsd >= REVENUE_PACKAGE_ATTENTION_USD ||
      estimatedUsd >= REVENUE_PACKAGE_ATTENTION_USD ||
      stablecoinUsd >= ATTENTION_THRESHOLD_USD ||
      estimatedUsd >= ATTENTION_THRESHOLD_USD ||
      nativeFallbackSignal,
    targetUsd: TARGET_USD,
    attentionThresholdUsd: ATTENTION_THRESHOLD_USD,
  };
}

function renderSummary(result) {
  const issueRows = result.openIssues.length
    ? result.openIssues
        .slice(0, 20)
        .map((issue) => `| #${issue.number} | ${issue.title.replaceAll("|", "\\|")} | ${issue.labels.join(", ")} | ${issue.url} |`)
        .join("\n")
    : "| None | - | - | - |";
  const priceLine = result.prices.error
    ? `Price lookup failed: ${result.prices.error}`
    : `ETH $${result.prices.ETH ?? "unknown"}, SOL $${result.prices.SOL ?? "unknown"}`;
  const errorLines = result.checkErrors.length
    ? result.checkErrors.map((error) => `- ${error.source}: ${error.error}`).join("\n")
    : "None";
  const leadRows = result.leadReplies.length
    ? result.leadReplies
        .slice(0, 20)
        .map(
          (reply) =>
            `| ${reply.repo}#${reply.issue} | ${reply.author} | ${reply.createdAt} | ${reply.reason.replaceAll("|", "\\|")} | ${reply.url} |`
        )
        .join("\n")
    : "| None | - | - | - | - |";
  return [
    "# Goal Status Monitor",
    "",
    `Checked at: ${result.checkedAt}`,
    `Target: verified paid revenue of USD $${result.paymentSignal.targetUsd}`,
    `Revenue package alert threshold: USD $${result.paymentSignal.revenuePackageAttentionUsd}`,
    `Result: ${result.attentionRequired ? "attention required" : "no verified payment or open intake issue detected"}`,
    `Health: ${result.checkErrors.length ? "degraded; retrying next interval" : "ok"}`,
    "",
    "## Open Issues",
    "",
    "| Issue | Title | Labels | URL |",
    "|---|---|---|---|",
    issueRows,
    "",
    "## Watched Lead Replies",
    "",
    "| Lead | Author | Created | Reason | URL |",
    "|---|---|---|---|---|",
    leadRows,
    "",
    "## Wallet Snapshot",
    "",
    `Ethereum: ${result.ethereum.nativeETH} ETH; USDC ${result.ethereum.erc20.USDC}; USDT ${result.ethereum.erc20.USDT}; DAI ${result.ethereum.erc20.DAI}`,
    `Solana: ${result.solana.nativeSOL} SOL; SPL USDC ${result.solana.splUSDC}`,
    priceLine,
    `Stablecoin total: approximately $${result.paymentSignal.stablecoinUsd.toFixed(2)}`,
    `Native estimate: approximately $${result.paymentSignal.nativeEstimateUsd.toFixed(2)}`,
    `Estimated total balance: approximately $${result.paymentSignal.estimatedUsd.toFixed(2)}`,
    `Revenue package alert threshold: $${result.paymentSignal.revenuePackageAttentionUsd.toFixed(2)} for small AI jingle or audit entry packages`,
    `Native fallback thresholds: ${result.paymentSignal.nativeFallbackThresholds.ETH} ETH or ${result.paymentSignal.nativeFallbackThresholds.SOL} SOL`,
    "",
    "## Accounting Rule",
    "",
    "This monitor is an alerting aid only. Count revenue only after a payment is verified against an accepted written scope or accepted jingle brief.",
    "",
    "## Check Errors",
    "",
    errorLines,
  ].join("\n");
}

const [openIssuesResult, leadRepliesResult, pricesResult, ethereumResult, solanaResult] = await Promise.allSettled([
  getOpenIssues(),
  getLeadReplies(),
  getPrices(),
  getEthereumBalances(),
  getSolanaBalances(),
]);
const checkErrors = [];
const openIssues = unwrap(openIssuesResult, [], "githubIssues");
const leadReplies = unwrap(leadRepliesResult, [], "leadReplies");
const prices = unwrap(pricesResult, { ETH: null, SOL: null, error: "price lookup unavailable" }, "prices");
const ethereum = unwrap(
  ethereumResult,
  { address: ETH_ADDRESS, nativeETH: "0", erc20: { USDC: "0", USDT: "0", DAI: "0" } },
  "ethereumBalances"
);
const solana = unwrap(solanaResult, { address: SOL_ADDRESS, nativeSOL: "0", splUSDC: "0" }, "solanaBalances");
if (Array.isArray(solana.checkErrors) && solana.checkErrors.length) {
  checkErrors.push(...solana.checkErrors);
}
delete solana.checkErrors;
const paymentSignal = computePaymentSignal(ethereum, solana, prices);
const attentionRequired = openIssues.length > 0 || leadReplies.length > 0 || paymentSignal.potentialPayment;
const result = {
  checkedAt: new Date().toISOString(),
  repository: REPOSITORY,
  openIssues,
  leadReplies,
  prices,
  ethereum,
  solana,
  paymentSignal,
  attentionRequired,
  checkErrors,
};
const summary = renderSummary(result);

console.log(JSON.stringify(result, null, 2));
console.log("\n" + summary);

if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFileSync } = await import("node:fs");
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary + "\n");
}

if (ATTENTION_FAIL && attentionRequired) {
  console.error("Attention required: open issue or potential payment detected.");
  process.exit(2);
}

function unwrap(result, fallback, source) {
  if (result.status === "fulfilled") {
    return result.value;
  }
  checkErrors.push({ source, error: result.reason?.message || String(result.reason) });
  return fallback;
}
