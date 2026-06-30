import { appendFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawn } from "node:child_process";

const repoRoot = resolve(import.meta.dirname, "..");
const privateMonitorDir = join(repoRoot, "private-notes", "monitor");
const logsDir = join(repoRoot, "logs");
const pidPath = join(privateMonitorDir, "goal-monitor-loop.pid");
const heartbeatPath = join(privateMonitorDir, "goal-monitor-loop-heartbeat.json");
const latestStatusPath = join(privateMonitorDir, "latest-goal-status.txt");
const historyLogPath = join(logsDir, "goal-monitor-history.log");
const processLogPath = join(logsDir, "goal-monitor-loop.process.log");
const localEnvPath = join(repoRoot, "private-notes", "tokenmeter-admin-token.env");
const intervalSeconds = Number(process.env.GOAL_LOOP_INTERVAL_SECONDS || "900");
const force = process.env.GOAL_LOOP_FORCE === "true";

if (!Number.isFinite(intervalSeconds) || intervalSeconds < 30) {
  throw new Error("GOAL_LOOP_INTERVAL_SECONDS must be at least 30 seconds.");
}

mkdirSync(privateMonitorDir, { recursive: true });
mkdirSync(logsDir, { recursive: true });

if (!force && existsSync(pidPath)) {
  const existingPid = Number(readFileSync(pidPath, "utf8").trim());
  if (Number.isInteger(existingPid) && existingPid > 0 && isProcessAlive(existingPid)) {
    console.error(`Goal monitor loop already running with PID ${existingPid}.`);
    process.exit(0);
  }
}

writeFileSync(pidPath, `${process.pid}\n`);
appendProcessLog(`started pid=${process.pid} intervalSeconds=${intervalSeconds}`);

let stopRequested = false;
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    stopRequested = true;
    appendProcessLog(`received ${signal}; stopping after current run`);
  });
}

while (!stopRequested) {
  const startedAt = new Date();
  const result = await runCheck();
  const finishedAt = new Date();
  const nextRunAt = new Date(finishedAt.getTime() + intervalSeconds * 1000);
  const header = `===== goal monitor run started=${startedAt.toISOString()} finished=${finishedAt.toISOString()} status=${result.status} pid=${process.pid} next=${nextRunAt.toISOString()} =====`;

  writeFileSync(latestStatusPath, result.output);
  appendFile(historyLogPath, `${header}\n${result.output}\n`);
  writeFileSync(
    heartbeatPath,
    `${JSON.stringify(
      {
        pid: process.pid,
        intervalSeconds,
        startedAt: startedAt.toISOString(),
        finishedAt: finishedAt.toISOString(),
        nextRunAt: nextRunAt.toISOString(),
        lastExitCode: result.status,
        attentionRequired: result.status !== 0,
      },
      null,
      2
    )}\n`
  );
  appendProcessLog(`run finished status=${result.status} next=${nextRunAt.toISOString()}`);

  if (result.status !== 0) {
    await notifyAttention();
  }

  await sleepUntil(nextRunAt);
}

appendProcessLog("stopped");
if (existsSync(pidPath) && readFileSync(pidPath, "utf8").trim() === String(process.pid)) {
  unlinkSync(pidPath);
}

async function runCheck() {
  return new Promise((resolveRun) => {
    const localEnv = readLocalEnv(localEnvPath);
    const child = spawn(process.execPath, ["scripts/check-goal-status.mjs"], {
      cwd: repoRoot,
      env: { ...process.env, ...localEnv, GOAL_ATTENTION_FAIL: "true" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let output = "";
    child.stdout.on("data", (chunk) => {
      output += chunk;
    });
    child.stderr.on("data", (chunk) => {
      output += chunk;
    });
    child.on("error", (error) => {
      resolveRun({ status: 1, output: `${error.stack || error.message}\n` });
    });
    child.on("close", (status) => {
      resolveRun({ status: status ?? 1, output });
    });
  });
}

function readLocalEnv(path) {
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index <= 0) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (/^[A-Z0-9_]+$/.test(key)) {
      env[key] = value;
    }
  }
  return env;
}

function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function appendFile(path, content) {
  appendFileSync(path, content);
}

function appendProcessLog(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  appendFileSync(processLogPath, line);
}

async function notifyAttention() {
  await new Promise((resolveNotify) => {
    const child = spawn("/usr/bin/osascript", [
      "-e",
      'display notification "Open issue or payment signal detected. Check latest-goal-status.txt." with title "Agent Audit Goal Monitor"',
    ]);
    child.on("close", resolveNotify);
    child.on("error", resolveNotify);
  });
}

async function sleepUntil(target) {
  while (!stopRequested) {
    const delay = target.getTime() - Date.now();
    if (delay <= 0) return;
    await new Promise((resolveSleep) => setTimeout(resolveSleep, Math.min(delay, 1000)));
  }
}
