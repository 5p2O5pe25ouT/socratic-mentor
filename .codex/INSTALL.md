# 在 Codex 中安装 Socratic Mentor

## 推荐：用 npx 安装

```bash
npx socratic-mentor install --target codex --scope user
```

这会把 `SKILL.md` 与 `resources/` 复制到 `$CODEX_HOME/skills/socratic-mentor`；未设置 `CODEX_HOME` 时默认是 `~/.codex/skills/socratic-mentor`。

项目级安装（只对当前目录生效）：

```bash
npx socratic-mentor install --target codex --scope project
```

npm 包发布之前，把命令里的 `socratic-mentor` 换成 GitHub 形式即可：

```bash
npx github:5p2O5pe25ouT/socratic-mentor install --target codex
```

## 手动安装

把 `SKILL.md` 和 `resources/` 复制到 Codex 的 skills 目录：

```bash
mkdir -p ~/.codex/skills/socratic-mentor
cp -R SKILL.md resources ~/.codex/skills/socratic-mentor/
```

## 卸载

```bash
npx socratic-mentor uninstall --target codex
```

## 用法

安装后，对 Codex 说“教我 X”“带我搞懂 X”“walk me through X”即可触发。明确要求直接给答案、或处于排障 / 纯查询场景时，它不会进入教学模式。
