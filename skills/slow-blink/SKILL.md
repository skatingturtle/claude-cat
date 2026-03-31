---
name: slow-blink
description: De-escalation and alignment before risky action. Surfaces tradeoffs, checks shared understanding, and gets explicit buy-in before anything consequential happens.
version: 1.0.0
---

# Slow Blink Skill -- De-escalation and Alignment

## Purpose

A cat slow-blinks to communicate trust. It lowers its guard deliberately, in full view. It is not submission -- it is a chosen de-escalation that says: I see you, I understand the situation, and I am choosing to proceed carefully rather than reactively.

The slow-blink skill does this before risky changes. It pauses. It makes the tradeoffs visible. It checks that both the developer and the system understand what is about to happen. It gets a real answer before proceeding.

This is not hesitation. It is the discipline to slow down at exactly the moment when speed feels most urgent.

---

## 1. This Command vs. the Passive Slow-Blink-Guard Hook

**This command is for manual, intentional alignment before a risky action.**

The passive slow-blink-guard hook handles automatic detection: large diffs exceeding a threshold, critical files being modified (config, auth, migrations, environment), or state-json threat escalations. When those conditions trigger, the hook surfaces a slow-blink automatically.

When you invoke `/slow-blink`, you are asking for a deliberate pause and alignment pass on a specific proposal. The passive hook is a circuit breaker. This command is a considered alignment conversation.

They serve different moments. This one is chosen.

---

## 2. Prey-Size Modifiers

Slow blink behavior changes based on prey size.

| Prey Size | Slow Blink Behavior |
|-----------|-------------------|
| Moth | Skip. No slow blink needed. Just pounce. |
| Mouse | Optional. Available but not auto-suggested. |
| Bird | Optional. Suggested if threat level is elevated or stalk was skipped. |
| Squirrel | Auto-triggered by cat brain before any pounce. Require explicit confirmation to proceed. |
| String | Strongly recommended. Strings are unpredictable. Alignment before execution reduces wasted effort. |

If the user invokes /slow-blink on a moth-sized target:

> "This looks moth-sized. A slow blink here may be more ritual than necessity, but let's do it properly."

Proceed with a lighter version of the full process.

---

## 3. Pre-Slow-Blink Context Load

Before starting, read:

1. `.claude-cat/state.json` -- phase, prey size, threat level, nine lives remaining, energy
2. `.claude-cat/litterbox.md` -- active treats, stalk findings, any prior hiss output
3. `.claude-cat/treatsdrawer.md` -- territory familiarity with the area in question

Note the current threat level. Slow blink will de-escalate it by 1 after completion (see section 8).

**Check for recent /hiss output:** If a hiss was run on this proposal, pull its findings. The slow blink should address any blockers or dangers the hiss identified.

---

## 4. Tradeoff Surface

The core of slow blink is making tradeoffs visible. For the given proposal, work through each dimension:

### What is about to happen

State it plainly, in specific terms. Not "we are going to refactor the auth layer." Instead: "We are going to change how tokens are validated in `auth/middleware.js`. This runs on every authenticated request. If the change introduces a regression, all authenticated users will fail until it is rolled back."

The specificity is the point. Vague descriptions allow vague alignment.

### What could go wrong

List the realistic failure modes. Not exhaustive catastrophizing -- the plausible, specific things that could break.

- If X assumption is wrong, then Y will fail
- If the test suite does not cover Z path, we will not catch W until production
- If the migration runs on a live database with old schema, the constraint will fail

### What is irreversible

Identify any part of the proposal that cannot be undone easily.

- Schema migrations may be difficult to roll back once applied to production data
- Deleted records cannot be recovered without a backup
- Published API changes may have external callers who have already integrated

For each irreversible step, ask: Is there a reversible alternative? If yes, note it. If no, name that explicitly.

### What the alternatives are

Name at least one alternative approach. It does not need to be better -- but it needs to be acknowledged. Choosing the current proposal after considering an alternative is a better decision than choosing it by default.

### What success looks like

State the specific, verifiable outcome. Not "it works" -- what does it look like when it works? What can be checked?

---

## 5. The Alignment Check

After surfacing tradeoffs, ask the alignment question directly:

> "Do we both understand what's about to happen?"

Then enumerate the key points of understanding required before proceeding:

1. [Specific thing that needs to be true for this to succeed]
2. [Specific assumption being made]
3. [Specific risk being accepted]

This is not a rhetorical question. Wait for a real answer. If the user says "yes, proceed" -- that is explicit buy-in. Log it and proceed.

If the user says "actually, let me think about that" -- that is the slow blink working. Do not rush them.

---

## 6. Explicit Buy-In Required

Do not proceed until the user responds explicitly. The slow blink is not complete until buy-in is received or the user aborts.

**User says proceed:** Log the buy-in and proceed.

> "Alignment confirmed. Proceeding with [proposal]."

**User asks to modify the proposal:** Work through the modifications. Re-run the tradeoff surface on the revised approach.

**User says abort:** Stop. Log the abort.

> "Slow blink complete. Proposal aborted at user's decision. No changes made."

Update litterbox.md with the abort and the reason if the user provides one.

---

## 7. Proceed or Abort Recommendation

After the tradeoff surface and before waiting for buy-in, give an explicit recommendation:

**Proceed if:**
- No irreversible steps without a recovery path
- All assumptions are verifiable
- Test coverage exists for the critical paths

**Proceed with caution if:**
- One or more assumptions are unverified but checkable
- Irreversible steps exist but have a recovery path (backup, rollback plan)
- Threat level is elevated but within accepted range

**Do not proceed if:**
- Irreversible steps have no recovery path and consequences are significant
- A blocker from a prior /hiss has not been addressed
- Key assumptions cannot be verified before execution

State the recommendation plainly:

> "Recommendation: [proceed / proceed with caution / do not proceed]. [One sentence on the primary reason.]"

---

## 8. De-escalate Threat Level

After the slow blink completes (whether the user proceeds or aborts), de-escalate the threat level by 1 in `state.json`.

The slow blink itself is the de-escalation act. By naming the risks and aligning, you have reduced the system's ambient danger regardless of what the user decides to do.

```json
{
  "threat": {
    "level": "[current level - 1, min 0]",
    "log": [
      {
        "timestamp": "[ISO timestamp]",
        "from": "[prior level]",
        "to": "[new level]",
        "trigger": "slow-blink: alignment completed on [proposal]"
      }
    ]
  }
}
```

---

## 9. Reactive Overlay Behavior

Slow blink is a reactive overlay. It does not change the session's active phase.

- No phase change
- No phase history entry
- Energy cost: -5

When slow blink completes, the session returns to whatever phase it was in.

---

## 10. Write to litterbox.md

Append the alignment record to `.claude-cat/litterbox.md`:

```markdown
### [ISO timestamp] Slow Blink: [proposal]
- **Tradeoffs surfaced:** [brief summary of key tradeoffs]
- **Irreversible steps:** [list, or "none"]
- **Recommendation:** [proceed / caution / abort]
- **User decision:** [proceed / abort / modified]
- **Threat level:** [N -> N-1]
```

---

## 11. Edge Cases

**No specific proposal provided:** Ask for one.

> "Slow blink on what, specifically? Give me the change or proposal you want to review before moving forward."

**Proposal is already low-risk:** Note it and abbreviate.

> "This looks low-risk. Tradeoffs are minor: [brief summary]. No irreversible steps. Recommendation: proceed."

Then ask for quick buy-in and continue.

**User is in a hurry and wants to skip:** Note the skip, log it, and de-escalate anyway.

> "Slow blink skipped at user's request. Logging it. [Noting the key risk that was not reviewed.] Proceeding."

The threat level still de-escalates. The act of choosing to skip is itself a form of alignment.

**Threat level is already 0:** De-escalation logs a "no change" entry.
