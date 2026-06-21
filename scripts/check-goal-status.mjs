import { execFileSync } from "node:child_process";

const DEFAULT_REPOSITORY = "jackjin1997/agent-audit-sprint";
const DEFAULT_ETH_ADDRESS = "0xa7F2235a77FBc4eCcbF60923BCDF6Df74eC710FF";
const DEFAULT_SOL_ADDRESS = "5CjUaMAsbXx2Hjczwoqi4MChTU1KjfUzbdiwPqZeceVM";
const ETH_RPC_URL = process.env.ETH_RPC_URL || "https://ethereum.publicnode.com";
const SOL_RPC_URL = process.env.SOL_RPC_URL || "https://api.mainnet-beta.solana.com";
const TARGET_USD = Number(process.env.GOAL_USD_TARGET || "1000");
const ATTENTION_THRESHOLD_USD = Number(process.env.GOAL_ATTENTION_THRESHOLD_USD || "900");
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

async function fetchJson(url, options = {}) {
  return retry(async () => {
    const response = await fetch(url, {
      ...options,
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

async function rpc(url, method, params) {
  return retry(async () => {
    const response = await fetch(url, {
      method: "POST",
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
  });
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
  const native = await rpc(SOL_RPC_URL, "getBalance", [SOL_ADDRESS]);
  const tokenAccounts = await rpc(SOL_RPC_URL, "getTokenAccountsByOwner", [
    SOL_ADDRESS,
    { mint: SOL_USDC_MINT },
    { encoding: "jsonParsed" },
  ]);
  let usdcRaw = 0n;
  for (const account of tokenAccounts.value || []) {
    const amount = account.account?.data?.parsed?.info?.tokenAmount?.amount;
    if (amount) usdcRaw += BigInt(amount);
  }
  return {
    address: SOL_ADDRESS,
    nativeSOL: bigintToDecimal(native.value, 9),
    splUSDC: bigintToDecimal(usdcRaw, 6),
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
    nativeFallbackSignal,
    nativeFallbackThresholds: {
      ETH: ETH_ATTENTION_THRESHOLD,
      SOL: SOL_ATTENTION_THRESHOLD,
    },
    potentialPayment:
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
  return [
    "# Goal Status Monitor",
    "",
    `Checked at: ${result.checkedAt}`,
    `Target: verified paid revenue of USD $${result.paymentSignal.targetUsd}`,
    `Result: ${result.attentionRequired ? "attention required" : "no verified payment or open intake issue detected"}`,
    `Health: ${result.checkErrors.length ? "degraded; retrying next interval" : "ok"}`,
    "",
    "## Open Issues",
    "",
    "| Issue | Title | Labels | URL |",
    "|---|---|---|---|",
    issueRows,
    "",
    "## Wallet Snapshot",
    "",
    `Ethereum: ${result.ethereum.nativeETH} ETH; USDC ${result.ethereum.erc20.USDC}; USDT ${result.ethereum.erc20.USDT}; DAI ${result.ethereum.erc20.DAI}`,
    `Solana: ${result.solana.nativeSOL} SOL; SPL USDC ${result.solana.splUSDC}`,
    priceLine,
    `Stablecoin total: approximately $${result.paymentSignal.stablecoinUsd.toFixed(2)}`,
    `Native estimate: approximately $${result.paymentSignal.nativeEstimateUsd.toFixed(2)}`,
    `Estimated total balance: approximately $${result.paymentSignal.estimatedUsd.toFixed(2)}`,
    `Native fallback thresholds: ${result.paymentSignal.nativeFallbackThresholds.ETH} ETH or ${result.paymentSignal.nativeFallbackThresholds.SOL} SOL`,
    "",
    "## Accounting Rule",
    "",
    "This monitor is an alerting aid only. Count revenue only after a payment is verified against an accepted written scope.",
    "",
    "## Check Errors",
    "",
    errorLines,
  ].join("\n");
}

const [openIssuesResult, pricesResult, ethereumResult, solanaResult] = await Promise.allSettled([
  getOpenIssues(),
  getPrices(),
  getEthereumBalances(),
  getSolanaBalances(),
]);
const checkErrors = [];
const openIssues = unwrap(openIssuesResult, [], "githubIssues");
const prices = unwrap(pricesResult, { ETH: null, SOL: null, error: "price lookup unavailable" }, "prices");
const ethereum = unwrap(
  ethereumResult,
  { address: ETH_ADDRESS, nativeETH: "0", erc20: { USDC: "0", USDT: "0", DAI: "0" } },
  "ethereumBalances"
);
const solana = unwrap(solanaResult, { address: SOL_ADDRESS, nativeSOL: "0", splUSDC: "0" }, "solanaBalances");
const paymentSignal = computePaymentSignal(ethereum, solana, prices);
const attentionRequired = openIssues.length > 0 || paymentSignal.potentialPayment;
const result = {
  checkedAt: new Date().toISOString(),
  repository: REPOSITORY,
  openIssues,
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
