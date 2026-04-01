# claude-cat

Observe first. Choose the mode. Act with intent.

Claude Cat is a Claude Code plugin that gives you a shared vocabulary for how to approach problems. Each named behavior maps to a distinct cognitive mode -- the right tool for a different kind of task. Instead of applying the same approach to every problem, you pick the mode that fits the moment.

The model is drawn from real cat cognition. Cats do not operate in one register. They stalk before they pounce, they hiss at real threats, they slow-blink to lower the temperature, they nap deliberately to consolidate before the next action. These are not decorations -- they are a practical framework for situational intelligence.

---

## v2: Approach C (Full Cat Mode)

v2 promotes the cat brain from a passive advisor to an autonomous orchestrator. In **full-cat mode**, the cat owns the hunt loop: it reads your messages, classifies the task, selects the right behavior, and acts or asks depending on the risk level.

Three autonomy modes are available:

| Mode | Behavior |
|------|----------|
| **advisor** | v1 behavior. The cat suggests, you decide. Every transition is a recommendation. |
| **graduated** | Safe behaviors run automatically. Moderate ones announce then proceed. Risky ones ask first. |
| **full-cat** | The cat orchestrates the entire hunt. Safe actions happen autonomously. Code changes always require your consent. |

**Existing v1 users** default to `advisor` mode on upgrade. Change it in `.claude-cat/config.json`:

```json
{
  "personality": "playful",
  "autonomyMode": "full-cat"
}
```

### What Full Cat Means

- The cat brain reads every message and decides which behavior fits.
- Read-only, diagnostic, and protective actions (stalk, meow, purr, hiss, slow-blink) happen without asking.
- Moderate actions (treats, knead, scratch) announce intent and proceed.
- Code-modifying actions (pounce, zoomies, catnip) always require your explicit confirmation.
- Nuclear options (3 AM, rollback) are never autonomous.
- You can always interrupt. Any message, slash command, or "stop" / "hold" / "just review" overrides the cat.

### Authority Tiers

| Tier | Behaviors | What Happens |
|------|-----------|--------------|
| Auto | stalk, meow, purr, groom, hiss, slow-blink | Cat acts without asking |
| Announce-and-act | treats, knead, scratch, nap | Cat announces intent, proceeds in same turn |
| Confirm-first | pounce, zoomies, catnip | Cat recommends, waits for your OK |
| Hard-consent-only | 3 AM, belly-rub rollback | You must invoke the command yourself |

Context can raise a tier: threat level 2+ raises write-capable actions, unfamiliar territory raises scratch for large prey, and destructive side effects always require hard consent.

---

## Core Philosophy

Seven beliefs underpin every behavior in this plugin:

1. **Attention is precious.** Every task deserves its own mode. Do not apply maximum effort to every problem, and do not apply casual effort to a problem that requires precision.

2. **Timing matters as much as effort.** Acting at the wrong moment wastes good work. Observe first. Confirm alignment before committing.

3. **Precision beats flailing.** A focused, bounded action is worth more than a broad sweep that touches everything and solves nothing.

4. **Boundaries matter.** Knowing what not to do is as important as knowing what to do. Scope is a feature.

5. **Recovery is part of competence.** Failure happens. The quality of a system is measured partly by how well it recovers. Diagnosis before correction.

6. **Trust is earned softly.** Introduce risk incrementally. De-escalate before high-stakes changes. Earn confidence through track record.

7. **Testing should endure chaos.** A test suite that only passes under ideal conditions is not a test suite. Provoke. Stress. Verify under pressure.

---

## Installation

```bash
claude plugin install claude-cat
```

Then verify:

```bash
claude /treats
```

If you see a prompt asking you to define success criteria for your current task, the plugin is working.

---

## Commands

### /treats
Define the hunt before you start. Sets success criteria, scopes the work, and names the non-goals. Run this before any nontrivial task so Claude knows exactly what winning looks like.

### /stalk
Quiet, read-only investigation. No changes, no writes, no side effects. Pure observation. Use this when you need to understand a codebase, a bug, or a system before touching anything.

### /pounce
Fast, bounded execution on a well-defined target. Use after /stalk or /treats when you know exactly what needs to happen and you want it done efficiently.

### /scratch
Intentional refactoring. Sharpens, prunes, and tidies without changing behavior. Use when the code works but the surface is rough and you want to improve it without risk.

### /zoomies
Chaotic burst testing and exploration. Generates edge cases, stress tests assumptions, and deliberately tries to break things. Use when you want adversarial coverage, not polite coverage.

### /hiss
Adversarial review and boundary protection. Audits a change, file, or plan for risk, hidden coupling, and things that should not be touched. Claude will push back if it finds danger.

### /meow
Translate a technical decision, change, or result into plain language for a non-technical stakeholder. Use when you need a commit message, a Slack summary, or an explanation for someone who does not read code.

### /purr
Health check and self-healing reinforcement. Scans the current state of the project for drift, missing configuration, broken links, or degraded conditions -- then repairs what it can.

### /slow-blink
De-escalate and align before a risky change. Surfaces assumptions, confirms scope, and asks clarifying questions before proceeding. Use when a task feels high-stakes or under-specified.

### /knead
Iterative refinement through repeated passes. Each pass improves the previous result slightly. Use for prose, prompts, structured data, or anything where quality improves through iteration rather than a single shot.

### /catnip
Structured creative exploration in six phases. Generates options, stress-tests them, selects the strongest, and refines it. Use when you need ideas, not just execution.

### /belly-rub
Error recovery with honest diagnosis. When something broke, this mode diagnoses without blaming, names what failed and why, proposes a recovery path, and checks that the fix holds.

### /nap
Checkpoint and handoff for the next session. Summarizes what was done, what is in progress, what decisions were made, and what the next action should be. Use at the end of a working session or before handing off to another agent.

---

## Configuration

Claude Cat stores its configuration and runtime state in `.claude-cat/` at your project root. This directory is excluded from version control by default.

```json
// .claude-cat/config.json
{
  "personality": "playful",
  "autonomyMode": "full-cat",
  "energyThresholds": { "nudgeNap": 20 },
  "customHissPatterns": [],
  "authorityEscalation": {
    "raiseScratchInSensitiveAreas": true,
    "raiseWritesAtThreat2": true
  },
  "memory": {
    "treatsdrawerRetrievalLimit": 3
  }
}
```

### Personality

| Level | Behavior |
|-------|----------|
| `minimal` | Behavior names only. No cat flavor in responses. Pure utility. |
| `playful` | Light cat framing in section headers and transitions. Default. |
| `full-cat` | Full persona. Claude responds as a cat would narrate its own behavior. |

### Autonomy Mode

| Mode | Behavior |
|------|----------|
| `advisor` | Suggest only. v1 compatibility mode. |
| `graduated` | Auto-tier runs. Announce-and-act announces. Confirm-first waits. |
| `full-cat` | Full orchestration with consent boundaries. |

---

## Passive Behaviors

These run automatically based on context. You do not invoke them directly.

**Groom** detects unnecessary files, stale imports, and leftover debug code at the end of a session and offers to clean them up without changing logic.

**Hiss guard** monitors file writes and flags any changes to files marked as protected in your config. It will surface a warning before the write completes.

**Slow blink guard** detects when Claude is about to act on a file marked as critical (config files, migrations, auth logic) and inserts a confirmation step automatically.

**Belly rub trigger** activates when Claude encounters a test failure or unhandled exception during a task. It switches to recovery mode and routes through honest diagnosis before attempting a fix.

In v2, these hooks also feed into the cat brain's decision trace, building an audit log of why the cat chose what it chose.

---

## The Cognitive Kernel

The `cat-brain` skill is the underlying model that all commands draw from. It encodes the behavioral logic: when to act, when to wait, when to push back, and when to hand off. It is modeled on published research in cat ethology and cognitive behavioral science.

In v2, the cat brain is promoted from a passive advisor to an autonomous orchestrator. It runs the core loop on every turn: sense, classify, decide, select behavior, check authority, execute or ask, evaluate and chain.

You do not invoke cat-brain directly. It runs underneath every command and, in full-cat mode, underneath every turn.

See the full design spec for details.

---

## Upgrading from v1

v2 is backward compatible with v1. Existing `.claude-cat/` directories are automatically migrated:

- `state.json` gains new fields (`autonomy`, `stringChase`, `decisionTrace`) with safe defaults.
- `config.json` gains `autonomyMode` (defaults to `advisor` for existing users).
- All slash commands continue to work exactly as before in advisor mode.
- No data is lost. No formats break.

To enable v2 features, set `autonomyMode` to `graduated` or `full-cat` in your config.

---

## License

MIT. Built by Ammar Bardesi. v2 architecture designed in collaboration with Claude (Anthropic) and Codex (OpenAI).
