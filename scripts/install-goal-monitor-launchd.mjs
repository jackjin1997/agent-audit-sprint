import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const label = "com.jackjin.agent-audit-goal-monitor";
const repoRoot = resolve(import.meta.dirname, "..");
const home = process.env.HOME;
if (!home) {
  throw new Error("HOME is required to install the LaunchAgent.");
}

const launchAgentsDir = join(home, "Library", "LaunchAgents");
const privateMonitorDir = join(repoRoot, "private-notes", "monitor");
const logsDir = join(repoRoot, "logs");
const plistPath = join(launchAgentsDir, `${label}.plist`);
const localPlistCopy = join(privateMonitorDir, `${label}.plist`);
const nodePath = existsSync("/opt/homebrew/bin/node") ? "/opt/homebrew/bin/node" : process.execPath;
const uid = execFileSync("id", ["-u"], { encoding: "utf8" }).trim();
const target = `gui/${uid}/${label}`;

mkdirSync(launchAgentsDir, { recursive: true });
mkdirSync(privateMonitorDir, { recursive: true });
mkdirSync(logsDir, { recursive: true });

const command = [
  `cd ${shellQuote(repoRoot)}`,
  "started=$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "rc=0",
  `GOAL_ATTENTION_FAIL=true ${shellQuote(nodePath)} scripts/check-goal-status.mjs > private-notes/monitor/latest-goal-status.txt 2>&1 || rc=$?`,
  "finished=$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "printf '%s\\n' \"===== goal monitor run started=${started} finished=${finished} status=${rc} =====\" >> logs/goal-monitor-history.log",
  "cat private-notes/monitor/latest-goal-status.txt >> logs/goal-monitor-history.log",
  "printf '\\n' >> logs/goal-monitor-history.log",
  "if [ \"${rc}\" != \"0\" ]; then /usr/bin/osascript -e 'display notification \"Open issue or payment signal detected. Check latest-goal-status.txt.\" with title \"Agent Audit Goal Monitor\"' || true; fi",
  "exit ${rc}",
].join("; ");

const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${label}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/zsh</string>
    <string>-lc</string>
    <string>${escapePlist(command)}</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${escapePlist(repoRoot)}</string>
  <key>RunAtLoad</key>
  <true/>
  <key>StartInterval</key>
  <integer>900</integer>
  <key>StandardOutPath</key>
  <string>${escapePlist(join(logsDir, "goal-monitor.stdout.log"))}</string>
  <key>StandardErrorPath</key>
  <string>${escapePlist(join(logsDir, "goal-monitor.stderr.log"))}</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
  </dict>
</dict>
</plist>
`;

writeFileSync(plistPath, plist);
writeFileSync(localPlistCopy, plist);

try {
  execFileSync("launchctl", ["bootout", `gui/${uid}`, plistPath], { stdio: "ignore" });
} catch {
  // It is fine if the LaunchAgent was not previously loaded.
}

execFileSync("launchctl", ["bootstrap", `gui/${uid}`, plistPath], { stdio: "inherit" });
execFileSync("launchctl", ["kickstart", "-k", target], { stdio: "inherit" });

console.log(JSON.stringify({
  label,
  target,
  plistPath,
  localPlistCopy,
  repoRoot,
  nodePath,
  intervalSeconds: 900,
  latestStatusPath: join(privateMonitorDir, "latest-goal-status.txt"),
  historyLogPath: join(logsDir, "goal-monitor-history.log"),
}, null, 2));

function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`;
}

function escapePlist(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
