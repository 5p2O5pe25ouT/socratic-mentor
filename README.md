# Socratic Mentor

<p align="center">
  <strong>语言</strong>：
  <a href="./README.md">简体中文</a> |
  <a href="./README.en.md">English</a>
</p>

Socratic Mentor 是一个给 **Claude Code** 和 **Codex** 使用的 Skill。它在用户明确想学习时启动，用苏格拉底式提问帮助学习者自己建立理解；如果用户只是要直接答案、排障结论或事实查询，它会直接回答，不强行进入教学模式。

## 适合什么场景

- 学习一个概念，而不是只拿结论。
- 读懂一段代码、一个模块、或一个系统设计。
- 带新人理解项目背景、实现思路和边界情况。
- 自学时用问题检查自己是否真的理解。

## 核心设计

- **先判断意图**：先分清用户是想学，还是只想要答案；不该教学时直接回答。
- **三档强度**：quick / standard / deep，按问题复杂度选择，默认从轻量开始。
- **一次只问一个问题**：提问后停下等待真实回答，不自问自答，也不一次性倒出问题清单。
- **先调查真实上下文**：讲真实仓库或系统时，先读代码、README、架构文档或日志，再设计问题。
- **逐步撤除脚手架**：从提示、类比、部分示例开始，随着学习者理解加深逐步放手。

## 和原项目的关系

Socratic Mentor 基于 **[socratic-teaching-scaffolds](https://www.skills.sh/lyndonkl/claude/socratic-teaching-scaffolds)**（作者 lyndonkl）重做。

原 skill 提供了核心教学方法：苏格拉底式提问、脚手架搭建与撤除、Feynman 分层解释、误解检测、迁移验证，以及教学质量自检 rubric。Socratic Mentor 保留这些方法，并针对实际 agent 使用做了以下调整：

- 增加**入口判断**，明确什么时候不该进入教学模式。
- 把单一重流程拆成 **quick / standard / deep** 三档。
- 强化**一次只问一个问题**的执行纪律。
- 要求讲真实代码前先调查，避免通用解释脱离仓库事实。
- 修正原 skill 中两套方向相反的 Level 编号，并让 rubric 按档位区分标准。

## 安装

### npx 安装

```bash
# 安装到 Claude Code
npx socratic-mentor install --target claude-code

# 安装到 Codex
npx socratic-mentor install --target codex

# 两边都安装
npx socratic-mentor install --target all
```

不带参数运行 `npx socratic-mentor` 会进入交互式选择。卸载：

```bash
npx socratic-mentor uninstall --target all
```

安装当前 GitHub 版本：

```bash
npx github:5p2O5pe25ouT/socratic-mentor install --target all
```

默认安装到用户级 skills 目录：

- Claude Code：`~/.claude/skills/socratic-mentor`
- Codex：`~/.codex/skills/socratic-mentor`

加 `--scope project` 可安装到当前项目的 `.claude` 或 `.codex` 目录。

### 手动安装

Claude Code：

```bash
git clone https://github.com/5p2O5pe25ouT/socratic-mentor.git ~/.claude/skills/socratic-mentor
```

Codex：

```bash
git clone https://github.com/5p2O5pe25ouT/socratic-mentor.git ~/.codex/skills/socratic-mentor
```

Codex 安装细节见 [.codex/INSTALL.md](.codex/INSTALL.md)。

## 用法

安装后，对 Claude Code 或 Codex 说：

```text
教我 X
带我搞懂 X
help me understand X
walk me through X
```

明确要求“直接给答案”时，它不会进入教学模式。

## 目录结构

```text
socratic-mentor/
├── SKILL.md                  # 入口判断、三档流程、提问纪律
├── resources/
│   ├── template.md           # standard 档工作表
│   ├── deep-dive.md          # deep 档方法
│   └── rubric.md             # 分档自检标准
└── bin/
    └── socratic-mentor.mjs   # npx 安装器
```

## 贡献

欢迎通过 issue 或 PR 改进这个 skill，尤其是：

- 触发条件不准，或不该教学时进入了教学模式。
- 某个教学步骤不清楚、过重、或执行起来别扭。
- 有更好的误解检测、脚手架撤除、迁移验证方法。
- 想补充示例、语言版本，或不同学科的使用场景。

## License

[MIT](LICENSE)
