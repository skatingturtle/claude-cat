# claude-cat

Observe first. Choose the mode. Act with intent.

Claude Cat is a Claude Code plugin that gives you a shared vocabulary for how to approach problems. Each named behavior maps to a distinct cognitive mode -- the right tool for a different kind of task. Instead of applying the same approach to every problem, you pick the mode that fits the moment.

The model is drawn from real cat cognition. Cats do not operate in one register. They stalk before they pounce, they hiss at real threats, they slow-blink to lower the temperature, they nap deliberately to consolidate before the next action. These are not decorations -- they are a practical framework for situational intelligence.

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

## Personality Configuration

Claude Cat adjusts how much of the cat metaphor it surfaces. Three levels are available:

```json
// .claude-cat/config.json
{
  "personality": "playful"
}
```

| Level | Behavior |
|-------|----------|
| `minimal` | Behavior names only. No cat flavor in responses. Pure utility. |
| `playful` | Light cat framing in section headers and transitions. Default. |
| `full-cat` | Full persona. Claude responds as a cat would narrate its own behavior. |

The config file is created at `.claude-cat/config.json` in your project root on first use. It is excluded from version control by default.

---

## Passive Behaviors

These run automatically based on context. You do not invoke them directly.

**Groom** detects unnecessary files, stale imports, and leftover debug code at the end of a session and offers to clean them up without changing logic.

**Hiss guard** monitors file writes and flags any changes to files marked as protected in your config. It will surface a warning before the write completes.

**Slow blink guard** detects when Claude is about to act on a file marked as critical (config files, migrations, auth logic) and inserts a confirmation step automatically.

**Belly rub trigger** activates when Claude encounters a test failure or unhandled exception during a task. It switches to recovery mode and routes through honest diagnosis before attempting a fix.

---

## The Cognitive Kernel

The `cat-brain` skill is the underlying model that all commands draw from. It encodes the behavioral logic: when to act, when to wait, when to push back, and when to hand off. It is modeled on published research in cat ethology and cognitive behavioral science -- specifically the way cats modulate attention, threat response, and energy allocation across different environmental contexts.

You do not invoke cat-brain directly. It runs underneath every command.

See the full design spec for details.

---

## License

MIT. Built by Ammar Bardesi.
