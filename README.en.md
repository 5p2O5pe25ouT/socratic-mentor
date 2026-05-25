# Socratic Mentor

<p align="center">
  <strong>Language</strong>:
  <a href="./README.md">简体中文</a> |
  <a href="./README.en.md">English</a>
</p>

Socratic Mentor is a Skill for **Claude Code** and **Codex**. It activates when a user clearly wants to learn, then uses Socratic questioning to help the learner build understanding themselves. When the user wants a direct answer, troubleshooting result, or factual lookup, it answers directly instead of forcing a teaching flow.

## Use Cases

- Learn a concept instead of only receiving the conclusion.
- Understand a piece of code, a module, or a system design.
- Onboard teammates into project context, implementation choices, and edge cases.
- Check whether your own understanding holds up during self-study.

## Core Design

- **Intent gate**: first decide whether the user wants to learn or just wants the answer; answer directly when teaching is not appropriate.
- **Declare knowledge scope**: before teaching, disclose what is reliable vs. not (especially time-sensitive or source-specific content); when insufficient, ask the learner for authoritative sources or fetch them proactively.
- **Three effort tiers**: quick / standard / deep, selected by complexity, starting lightweight by default.
- **One question at a time**: ask, then stop and wait for a real answer; do not self-answer or dump a full question list.
- **Investigate real context first**: for real repositories or systems, read code, README files, architecture notes, or logs before designing questions.
- **Fade scaffolding gradually**: start with hints, analogies, or partial examples, then reduce support as the learner gains understanding.
- **Visual-first**: for classification, comparison, flow, hierarchy, or quadrant content, prefer tables or ASCII diagrams over prose.
- **Bilingual code samples**: when the learner has a fluent "reference language" (e.g. Go), give code in the target language alongside an equivalent reference-language version, so the familiar language helps decode the unfamiliar.
- **Three-layer retrieval for multi-session learning**: daily mini check (5 min) + weekly review + phase-end full test. End-of-session "transfer validation" alone cannot fight the forgetting curve; active retrieval beats re-reading.

## Relationship to the Original Project

Socratic Mentor is a rework of **[socratic-teaching-scaffolds](https://www.skills.sh/lyndonkl/claude/socratic-teaching-scaffolds)** by lyndonkl.

The original skill provides the core teaching method: Socratic questioning, building and fading scaffolding, layered Feynman explanation, misconception detection, transfer validation, and a teaching-quality rubric. Socratic Mentor keeps those methods and adjusts them for practical agent use:

- adds an **intent gate**, including when not to enter teaching mode;
- splits one heavy flow into **quick / standard / deep** tiers;
- strengthens the **one-question-at-a-time** discipline;
- requires real-code investigation before teaching an actual repository;
- fixes two conflicting Level numbering schemes and makes the rubric tier-aware.

## Installation

### Install with npx

```bash
# Install for Claude Code
npx socratic-mentor install --target claude-code

# Install for Codex
npx socratic-mentor install --target codex

# Install for both
npx socratic-mentor install --target all
```

Running `npx socratic-mentor` with no arguments starts an interactive picker. To uninstall:

```bash
npx socratic-mentor uninstall --target all
```

Install the current GitHub version:

```bash
npx github:5p2O5pe25ouT/socratic-mentor install --target all
```

By default, the installer writes to user-level skill directories:

- Claude Code: `~/.claude/skills/socratic-mentor`
- Codex: `~/.codex/skills/socratic-mentor`

Add `--scope project` to install into the current project's `.claude` or `.codex` directory.

### Manual installation

Claude Code:

```bash
git clone https://github.com/5p2O5pe25ouT/socratic-mentor.git ~/.claude/skills/socratic-mentor
```

Codex:

```bash
git clone https://github.com/5p2O5pe25ouT/socratic-mentor.git ~/.codex/skills/socratic-mentor
```

For Codex installation details, see [.codex/INSTALL.md](.codex/INSTALL.md).

## Usage

After installation, say one of these to Claude Code or Codex:

```text
teach me X
help me understand X
walk me through X
带我搞懂 X
```

When you explicitly ask for a direct answer, it will not enter teaching mode.

## Directory Layout

```text
socratic-mentor/
├── SKILL.md                  # intent gate, three-tier flow, questioning discipline
├── resources/
│   ├── template.md           # standard-tier worksheet
│   ├── deep-dive.md          # deep-tier method
│   └── rubric.md             # per-tier self-review rubric
└── bin/
    └── socratic-mentor.mjs   # npx installer
```

## Contributing

Issues and PRs are welcome, especially for:

- trigger conditions that are inaccurate, or cases where teaching mode starts when it should not;
- teaching steps that are unclear, too heavy, or awkward to execute;
- better methods for misconception detection, scaffolding fade-out, or transfer validation;
- examples, additional language versions, or use cases from different subjects.

## License

[MIT](LICENSE)
