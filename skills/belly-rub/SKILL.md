---
name: belly-rub
description: Error recovery, honest diagnosis, and vulnerability. Exposes what went wrong completely and without defense. Offers rollback options, invites the developer into co-decision, and tracks failure patterns for 3 AM nudge detection.
version: 1.0.0
---

# Belly Rub Skill -- Error Recovery and Honest Diagnosis

## Purpose

When a cat shows its belly, it is an act of trust. It is also an exposure of vulnerability. The belly is soft. The cat knows it.

The belly-rub skill is invoked when something has gone wrong. It does not hide, retry blindly, or perform confidence it does not have. It lays out what failed, why, what the current state is, and what is recoverable. It invites the developer in to decide together what to do next.

This is not defeat. Recovery requires honesty first.

---

## 1. This Command vs. the Passive Belly-Rub-Trigger Hook

**This command is for manual invocation or when the trigger explicitly offers it.**

The passive belly-rub-trigger hook handles automatic detection: repeated test failures, stack traces appearing in output, state corruption patterns, crash loops. When those conditions appear, the hook surfaces a belly-rub prompt automatically.

When you invoke `/belly-rub` directly, you are choosing to open this space explicitly -- after a confusing failure, when something is wrong but not yet triggering the hook, or when the hook offered it and you accepted.

---

## 2. Hybrid Behavior -- Overlay vs. State Transition

Belly-rub operates in two modes depending on the failure pattern.

### Overlay Mode (Quick Diagnosis)

**Trigger:** Single failure, isolated incident, no pattern of repetition.

Behavior:
- Diagnose the failure fully and honestly
- Offer recovery options
- Return to the current session state after

No phase change. No phase history entry. The session continues where it was once the diagnosis is complete.

### Recovering Mode (State Transition)

**Trigger:** Any of the following:
- Repeated failure on the same target (3 or more attempts)
- Crash loop detected (pounce -> fail -> pounce -> fail)
- State corruption: `state.json` is in an inconsistent state
- The developer's own assessment: "this is bad"

Behavior:
- Full belly-rub diagnosis
- Transition phase to `"recovering"`
- Stay in recovering until the issue is resolved and the developer explicitly exits

When transitioning to recovering:

```json
{
  "phase": "recovering",
  "phaseHistory": ["...prior entries...", "recovering"]
}
```

The cat brain will note the recovering state on every subsequent command until it is resolved.

---

## 3. Pre-Belly-Rub Context Load

Before diagnosing, read:

1. `.claude-cat/state.json` -- phase, nine lives remaining, threat level, energy, any prior belly-rub entries in the state
2. `.claude-cat/litterbox.md` -- full history. What was attempted. What the success criteria are. Prior stalk findings.
3. `.claude-cat/treatsdrawer.md` -- territory map. Has this area failed before?
4. The specific error output or failure description provided by the user

If no failure description is provided, ask:

> "Show me what failed. Error message, stack trace, unexpected behavior -- whatever you have."

Do not proceed without knowing what failed.

---

## 4. Honest Diagnosis

The diagnosis covers four things. All four. No shortcuts.

### What Failed

Name the specific failure. Not a category of failure -- the specific thing.

- Which function, file, test, build step, or API call failed
- The exact error message or unexpected behavior
- The inputs or conditions that triggered it

If the failure is vague ("it's broken"), ask for specifics before proceeding:

> "What specifically is broken? Give me the error or the unexpected behavior."

### Why It Failed

Root cause analysis. This is the hard part. Work through it.

- What was the code expected to do?
- What did it actually do?
- Where did those diverge?
- What is the most likely cause of the divergence?

Be honest about confidence level: high (root cause identified), medium (likely cause), low (suspicious area, not certain).

If confidence is low:

> "Root cause is not clear. Best hypothesis: [description]. Would need /stalk to confirm. You can attempt recovery based on the hypothesis or investigate first."

### What State Things Are In Now

Describe the current state of the system:

- Is the codebase in a partially-modified state? Which files?
- Did any part of the operation succeed before the failure?
- Is any data in an inconsistent state (database writes that partially completed, files that were renamed but not updated)?
- Are there uncommitted changes that need to be either committed or reverted?

Be specific about what the developer is looking at right now.

### What Is Salvageable

Not everything a failure touches is lost. Name what can be kept.

- Which parts of the attempted solution are still valid?
- Which changes, if any, are worth keeping even though the overall pounce failed?
- Is there a smaller version of the goal that could be accomplished with what is already done?

---

## 5. Nine-Lives Rollback Options

Check `state.json` for available nine-lives checkpoints.

If checkpoints exist, list them:

```
Available rollback points:
1. [Checkpoint ID] -- [ISO timestamp] -- [description]
2. [Checkpoint ID] -- [ISO timestamp] -- [description]
...
```

For each checkpoint, note:
- What state it represents
- What would be lost if rolling back to it
- Whether it is a clean rollback or whether manual cleanup would be needed after

**Recommend a specific rollback point** if the situation warrants it. Do not make the developer search through a list without guidance.

> "Recommended rollback: checkpoint [ID] ([timestamp]). This is before [what happened]. Rolling back here loses [specific work] but gets you to a clean known state."

**If no checkpoints exist:**

> "No nine-lives checkpoints available for rollback. Options: manual revert using git, forward-only recovery, or accept the current state and proceed carefully."

---

## 6. Co-Decision Invitation

After the diagnosis, do not prescribe a single path. Lay out the options and invite the developer to decide.

Format:

```
Options:
1. [Option name]: [What it means. What it costs. What it gives back.]
2. [Option name]: [What it means. What it costs. What it gives back.]
3. [Option name]: [What it means. What it costs. What it gives back.]

What would you like to do?
```

Common options to consider:

- **Rollback to checkpoint:** Costs any work since checkpoint. Returns to clean state.
- **Forward recovery:** Accept the failure, patch the specific break, continue.
- **Reframe and restart:** The approach was wrong. Start the stalk again with new framing.
- **Investigate first:** /stalk the failure before attempting any recovery.
- **Accept and document:** The failure is acceptable or expected. Document it and continue.

The developer chooses. Present the options clearly, note your recommendation, and wait.

---

## 7. Failure Pattern Tracking

Every belly-rub is tracked. Repeat belly-rubs on the same target feed the 3 AM nudge detection system.

Update `state.json` with a failure pattern entry:

```json
{
  "failurePatterns": [
    {
      "target": "[file, function, or area that failed]",
      "timestamp": "[ISO timestamp]",
      "category": "[test failure / build failure / runtime error / state corruption / other]",
      "bellyRubCount": [increment from prior count or 1 if first]
    }
  ]
}
```

**If `bellyRubCount` reaches 3 on the same target:**

> "This is the third belly-rub on [target]. The 3 AM nudge system is watching this area. If it continues to fail, it will surface as a persistent concern in the next /purr."

The 3 AM nudge system uses this data to surface chronic failure areas even when the developer is not explicitly asking about them.

---

## 8. Reset Threat Level

After completing the belly-rub (regardless of outcome), reset the threat level.

The act of honest diagnosis and co-decision is itself stabilizing. The threat level reflects the system's anxiety about what is unknown or unaddressed. A belly-rub names the thing. That reduces the threat even if the problem is not yet solved.

```json
{
  "threat": {
    "level": 0,
    "log": [
      {
        "timestamp": "[ISO timestamp]",
        "from": "[prior level]",
        "to": 0,
        "trigger": "belly-rub: honest diagnosis completed, threat named and addressed"
      }
    ]
  }
}
```

---

## 9. Energy Cost -- Restorative

**Energy cost: +10**

Belly-rub adds energy, not subtracts it. Recovery builds resilience. Facing what went wrong honestly and deciding clearly what to do next is energizing, not depleting.

Energy cap is 100. If energy is already 95-100, the +10 is absorbed but does not exceed 100.

Update `state.json`:

```json
{
  "energy": "[current energy + 10]"
}
```

---

## 10. Write to litterbox.md

Append the belly-rub record to `.claude-cat/litterbox.md`:

```markdown
### [ISO timestamp] Belly Rub: [failure description]
- **What failed:** [specific failure]
- **Root cause:** [diagnosis, with confidence level]
- **Current state:** [what is in what condition right now]
- **Salvageable:** [what can be kept]
- **Rollback options:** [checkpoints listed, or "none available"]
- **Developer decision:** [what was chosen]
- **Mode:** overlay | recovering
- **Belly-rub count on this target:** [N]
- **Threat level reset to:** 0
```

---

## 11. Post-Belly-Rub Behavior

### Overlay mode (single failure, resolved)

> "Diagnosis complete. [One sentence summary of what happened and what was decided.] Continuing from [current phase]."

Session resumes from the prior phase.

### Recovering mode (active, not yet resolved)

> "In recovering mode. The diagnosis is above. What would you like to do first?"

Stay in recovering. On every subsequent command, note the recovering state:

> "[Command result.] Still in recovering mode. [Brief status of the recovery.]"

When the developer says recovery is complete:

> "Exiting recovering mode. [Brief note on what was resolved.] What next?"

Transition phase back to `"idle"` unless there is an active hunt, in which case return to the appropriate hunt phase.

---

## 12. Edge Cases

**Developer cannot describe what failed:** Help them find it.

> "Tell me what you expected to happen and what actually happened instead. We will find the failure from there."

**Everything is on fire (multiple simultaneous failures):** Triage first.

> "Multiple failures. Let's address the most critical first. What is the biggest problem right now?"

Work through them in order of severity.

**Failure is in the belly-rub skill itself (meta failure):** Report it plainly.

> "The belly-rub ran into a problem of its own: [description]. This is unusual. Check `.claude-cat/state.json` manually for corruption."

**Developer wants to abort the hunt entirely after a belly-rub:** Support it without judgment.

> "Hunt closed. [Brief note on what was attempted and why it was closed.] /nap to archive, or continue with a fresh /treats?"

---

## v2 Autonomy Note

Authority tier: auto (diagnosis) / hard-consent-only (rollback). In full-cat mode, belly-rub diagnosis can fire automatically when repeated failures are detected. Rollback options are always presented for user choice, never executed autonomously.
