import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
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

const plist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${label}</string>
  <key>ProgramArguments</key>
  <array>
    <string>${escapePlist(nodePath)}</string>
    <string>scripts/run-goal-monitor-loop.mjs</string>
  </array>
  <key>WorkingDirectory</key>
  <string>${escapePlist(repoRoot)}</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>${escapePlist(join(logsDir, "goal-monitor-resident.stdout.log"))}</string>
  <key>StandardErrorPath</key>
  <string>${escapePlist(join(logsDir, "goal-monitor-resident.stderr.log"))}</string>
  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin</string>
    <key>GOAL_LOOP_INTERVAL_SECONDS</key>
    <string>900</string>
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
  pidPath: join(privateMonitorDir, "goal-monitor-loop.pid"),
  heartbeatPath: join(privateMonitorDir, "goal-monitor-loop-heartbeat.json"),
  latestStatusPath: join(privateMonitorDir, "latest-goal-status.txt"),
  historyLogPath: join(logsDir, "goal-monitor-history.log"),
}, null, 2));

function escapePlist(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
