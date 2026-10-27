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
- **依据材料教学**：优先利用已有材料，核实版本和时效性事实；明确具体证据缺口，不重复索要已有信息。
- **三档强度**：quick / standard / deep，按问题复杂度选择，默认从轻量开始。
- **一次只问一个问题**：提问后停下等待真实回答，不自问自答，也不一次性倒出问题清单。
- **给足提问上下文**：先说明相关事实、条件和判断目标；区分事实判断、假设与补证，题干缺失先修题，不让学习者猜隐藏答案。
- **准确反馈**：明确指出错误并给依据和修正建议；缺证据标假设，有条件的结论说明边界，不一味附和或刻意反驳。
- **控制单课范围**：围绕当前章节设计案例和追问，只补必要前置；偏题时主动收回，完成目标与一次相关迁移检查后收尾。
- **先调查真实上下文**：讲真实仓库或系统时，先读代码、README、架构文档或日志再设计问题。
- **逐步撤除脚手架**：从提示、类比、部分示例开始，随着学习者理解加深逐步放手。
- **图表优先**：分类、对比、流程、层级、象限——优先用表格或 ASCII 图，别只用文字。
- **代码双语对照**：学习者有熟练的"参考语言"（如 Go）时，目标语言代码同时给参考语言对照版，方便用熟悉的语言推断陌生的。
- **按目标复习**：结合单元检查、间隔复盘和阶段任务，遵循课程约定的标准；关键误解需要针对性复习，不套用统一的 80% 晋级门槛。
- **应试场景按权重分级**：先定"通过线 vs 精通"目标；过线导向时按 T0–T3 给考点分级，集中攻高频高分（T0/T1），低频偏门（T3）战略放弃。先核实适用考纲和试题样本；已有当前权威材料时不重复搜索，不把样本推断当成通过保证。
- **错误模式标签化**：错题打标签（概念混淆 / 单位数字 / 原文不熟 / 计算粗心 / 范围漏边），结合样本数量、出现频率和影响安排复盘。
- **延续真实进度**：依据最近回答继续，区分已讲、提示后完成、独立验证和待复习；不重复诊断，也不编造进度百分比。
- **按需适配**：沿用学习者已表达的语言和呈现偏好；双语学习先评价专业推理，再修正表达，必要时用可见图表代替心像练习。
- **尊重写入范围**：教学不自动授权修改代码、保存持久记忆或创建提醒；个人学习记录和内部项目资料不进入公开产物。

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

明确要求“直接给答案”时，它不会进入教学模式；教学途中要求直接解释、暂停或结束时，也会遵从。

继续上次课程时，可以说“根据上次待验证的内容继续”。它会先找相关学习记录，必要时只问一个恢复进度的问题。只有已请求或已授权的课程流程才会保存笔记、更新进度；源码读过、测试通过和系统实际运行结果会分别说明。

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
