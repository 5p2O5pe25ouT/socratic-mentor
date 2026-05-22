#!/usr/bin/env node
// socratic-mentor installer — installs the skill for Claude Code and Codex.

import os from "node:os";
import path from "node:path";
import process from "node:process";
import readline from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { cp, mkdir, readFile, rm, stat } from "node:fs/promises";

const SKILL_NAME = "socratic-mentor";
const ASSETS = ["SKILL.md", "resources"];
const ALIASES = {
  cc: "claude-code",
  claude: "claude-code",
  "claude-code": "claude-code",
  codex: "codex",
};

const binDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(binDir, "..");

const out = (s = "") => process.stdout.write(`${s}\n`);
const err = (s = "") => process.stderr.write(`${s}\n`);

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function readVersion() {
  try {
    const pkg = JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8"));
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function catalog({ homeDir = os.homedir(), cwd = process.cwd(), env = process.env } = {}) {
  const codexHome = env.CODEX_HOME || path.join(homeDir, ".codex");
  return {
    "claude-code": {
      id: "claude-code",
      name: "Claude Code",
      paths: {
        user: path.join(homeDir, ".claude", "skills", SKILL_NAME),
        project: path.join(cwd, ".claude", "skills", SKILL_NAME),
      },
      markers: [path.join(homeDir, ".claude"), path.join(cwd, ".claude")],
    },
    codex: {
      id: "codex",
      name: "Codex",
      paths: {
        user: path.join(codexHome, "skills", SKILL_NAME),
        project: path.join(cwd, ".codex", "skills", SKILL_NAME),
      },
      markers: [codexHome, path.join(cwd, ".codex")],
    },
  };
}

async function detectedMarker(platform) {
  for (const m of platform.markers) {
    if (await exists(m)) return true;
  }
  return false;
}

// Guard: only ever create/remove a directory whose own name is the skill name.
function assertManaged(targetRoot) {
  if (path.basename(targetRoot) !== SKILL_NAME) {
    throw new Error(`拒绝操作非托管路径：${targetRoot}`);
  }
}

async function installOne(platform, scope) {
  const targetRoot = platform.paths[scope];
  if (!targetRoot) throw new Error(`${platform.name} 没有 ${scope} 范围的安装路径`);
  assertManaged(targetRoot);

  for (const asset of ASSETS) {
    if (!(await exists(path.join(packageRoot, asset)))) {
      throw new Error(`包内缺少资源：${asset}`);
    }
  }

  await rm(targetRoot, { recursive: true, force: true });
  await mkdir(targetRoot, { recursive: true });
  for (const asset of ASSETS) {
    await cp(path.join(packageRoot, asset), path.join(targetRoot, asset), {
      recursive: true,
      force: true,
    });
  }
  return targetRoot;
}

async function uninstallOne(platform, scope) {
  const targetRoot = platform.paths[scope];
  if (!targetRoot) throw new Error(`${platform.name} 没有 ${scope} 范围的安装路径`);
  assertManaged(targetRoot);

  const had = await exists(targetRoot);
  await rm(targetRoot, { recursive: true, force: true });
  return had ? targetRoot : null;
}

function resolveTargets(rawList, cat) {
  const ids = Object.keys(cat);
  const result = [];
  for (const raw of rawList) {
    if (!raw) continue;
    for (const piece of String(raw).split(",")) {
      const key = piece.trim().toLowerCase();
      if (!key) continue;
      if (key === "all") return ids;
      const mapped = ALIASES[key];
      if (!mapped) {
        throw new Error(`未知平台：${key}（可选：claude-code / cc、codex、all）`);
      }
      result.push(mapped);
    }
  }
  return [...new Set(result)];
}

function parseArgs(argv) {
  const parsed = { command: null, targets: [], scope: "user" };
  const args = [...argv];
  while (args.length) {
    const token = args.shift();
    switch (token) {
      case "install":
      case "uninstall":
      case "help":
        parsed.command = token;
        break;
      case "--target":
      case "-t":
        parsed.targets.push(args.shift());
        break;
      case "--scope":
        parsed.scope = args.shift() ?? parsed.scope;
        break;
      case "--project":
        parsed.scope = "project";
        break;
      case "--user":
        parsed.scope = "user";
        break;
      case "--help":
      case "-h":
        parsed.command = "help";
        break;
      case "--version":
      case "-v":
        parsed.command = "version";
        break;
      default:
        if (!parsed.command && token && !token.startsWith("-")) {
          parsed.command = token;
          break;
        }
        throw new Error(`未知参数：${token}`);
    }
  }
  if (parsed.scope !== "user" && parsed.scope !== "project") {
    throw new Error(`--scope 只能是 user 或 project，收到：${parsed.scope}`);
  }
  return parsed;
}

async function printHelp() {
  const version = await readVersion();
  out(`socratic-mentor v${version} — 苏格拉底式教学 skill 安装器

用法：
  npx socratic-mentor                              交互式安装
  npx socratic-mentor install --target <平台> [--scope user|project]
  npx socratic-mentor uninstall --target <平台> [--scope user|project]
  npx socratic-mentor --help
  npx socratic-mentor --version

平台：
  claude-code (别名 cc)   ~/.claude/skills/socratic-mentor
  codex                   ~/.codex/skills/socratic-mentor
  all                     以上两个都装

范围：
  user     当前用户（默认）
  project  当前目录下的 .claude / .codex

示例：
  npx socratic-mentor install --target cc
  npx socratic-mentor install --target codex --scope project
  npx socratic-mentor install --target all`);
}

function isInteractive() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

async function promptChoices(cat) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    out("选择安装目标：");
    const platforms = Object.values(cat);
    for (let i = 0; i < platforms.length; i++) {
      const detected = await detectedMarker(platforms[i]);
      out(`  ${i + 1}. ${platforms[i].name}${detected ? "（已检测到）" : ""}`);
    }
    out(`  ${platforms.length + 1}. 全部`);

    const def = platforms.length + 1;
    const answer = (await rl.question(`输入序号 [${def}]：`)).trim();
    const idx = Number(answer || def) - 1;

    let targets;
    if (idx === platforms.length) targets = ["all"];
    else if (platforms[idx]) targets = [platforms[idx].id];
    else throw new Error("无效的序号。");

    const scopeAnswer = (await rl.question("安装范围 user/project [user]：")).trim().toLowerCase();
    const scope = scopeAnswer === "project" ? "project" : "user";
    return { targets, scope };
  } finally {
    rl.close();
  }
}

async function runInstall(parsed) {
  const cat = catalog();
  let { targets, scope } = parsed;

  if (targets.length === 0) {
    if (!isInteractive()) {
      throw new Error("非交互模式下必须用 --target 指定平台。");
    }
    ({ targets, scope } = await promptChoices(cat));
  }

  const ids = resolveTargets(targets, cat);
  if (ids.length === 0) throw new Error("没有要安装的平台。");

  for (const id of ids) {
    const root = await installOne(cat[id], scope);
    out(`✓ ${cat[id].name} 已安装到 ${root}`);
  }
  out("完成。对 Claude / Codex 说“教我 X”“带我搞懂 X”即可触发。");
}

async function runUninstall(parsed) {
  const cat = catalog();
  if (parsed.targets.length === 0) {
    throw new Error("uninstall 必须用 --target 指定平台。");
  }

  const ids = resolveTargets(parsed.targets, cat);
  for (const id of ids) {
    const removed = await uninstallOne(cat[id], parsed.scope);
    out(removed
      ? `✓ 已从 ${removed} 卸载 ${cat[id].name}`
      : `· ${cat[id].name} 未安装（${parsed.scope} 范围）`);
  }
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2));
  const command = parsed.command ?? "install";

  if (command === "help") return printHelp();
  if (command === "version") return out(await readVersion());
  if (command === "install") return runInstall(parsed);
  if (command === "uninstall") return runUninstall(parsed);
  throw new Error(`未知命令：${command}`);
}

try {
  await main();
} catch (error) {
  err(`错误：${error.message}`);
  process.exitCode = 1;
}
