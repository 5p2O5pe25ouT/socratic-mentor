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
- **Ground teaching in sources**: reuse available material, verify versions and time-sensitive facts, and identify specific evidence gaps without asking for information already available.
- **Three effort tiers**: quick / standard / deep, selected by complexity, starting lightweight by default.
- **One question at a time**: ask, then stop and wait for a real answer; do not self-answer or dump a full question list.
- **Provide enough context**: supply relevant facts, constraints, and the decision to make. Distinguish factual judgment, hypotheses, and missing-evidence tasks; repair incomplete prompts instead of expecting learners to guess hidden answers.
- **Give accurate feedback**: identify errors with evidence and a correction; label unsupported hypotheses and conditional claims. Avoid blanket agreement and objections made only to appear rigorous.
- **Keep lessons focused**: examples and follow-ups serve the current chapter, with only necessary prerequisites. Return from detours and close after the goal and a relevant transfer check are complete.
- **Investigate real context first**: for real repositories or systems, read code, README files, architecture notes, or logs before designing questions.
- **Fade scaffolding gradually**: start with hints, analogies, or partial examples, then reduce support as the learner gains understanding.
- **Visual-first**: for classification, comparison, flow, hierarchy, or quadrant content, prefer tables or ASCII diagrams over prose.
- **Bilingual code samples**: when the learner has a fluent "reference language" (e.g. Go), give code in the target language alongside an equivalent reference-language version, so the familiar language helps decode the unfamiliar.
- **Review according to the goal**: combine unit checks, spaced review, and practical tasks using the course’s agreed standard. Revisit unresolved misconceptions without imposing a universal 80% advancement threshold.
- **Weight-based prioritization for exams**: first set the goal — "pass line vs. mastery"; when aiming to pass, rank topics into T0–T3 tiers, focus on high-frequency/high-score (T0/T1), and strategically skip low-frequency edge cases (T3). Verify the applicable syllabus and available exam samples; reuse current authoritative material and do not turn sample-based estimates into a guarantee of passing.
- **Error-pattern tagging**: tag each wrong answer (concept confusion / units & numbers / unfamiliar terminology / careless calculation / missed boundary), then prioritize review using sample size, frequency, and impact.
- **Resume from evidence**: use recent answers to distinguish material covered, completion with hints, independent validation, and pending review; avoid repeated diagnosis and invented progress percentages.
- **Adapt when useful**: follow the learner’s stated language and presentation preferences. In bilingual learning, assess subject reasoning before correcting expression; use visible diagrams when mental imagery is unsuitable.
- **Respect write scope**: teaching does not automatically authorize code changes, persistent memory writes, or reminders. Keep personal learning records and internal project material out of public artifacts.

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

When you explicitly ask for a direct answer, it will not enter teaching mode. Requests to explain directly, pause, or end an ongoing lesson are also respected.

To resume, try “continue from the pending checks in my last session.” It will first consult relevant learning records, asking only for missing context needed to resume. Notes and progress files are saved only when requested or already authorized by the course workflow. Reading source, passing tests, and observing runtime outcomes are reported separately.

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
