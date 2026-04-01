---
name: purr
description: Use when verifying health after changes, after pounce/zoomies/3AM, or when user asks for a status check. Two-part behavior -- diagnostic report plus self-healing reinforcement.
version: 1.0.0
---

# Purr Skill -- Health Diagnostics and Reinforcement

## 1. Purpose

Purring is not just review. It is reinforcement. A cat purrs when things are good, but also when healing.

The purr skill serves two roles simultaneously:

1. **Diagnostic:** Assess the current health of the codebase and the hunt. What is working. What is uncertain. What the safest next move is. Calm, evidence-based, morale-preserving.

2. **Self-healing:** Identify the patterns that are working and actively reinforce them. Build the codebase's immune system. Lock in good patterns before they erode. Flag load-bearing code worth protecting.

Run /purr after any pounce, zoomies, or 3 AM session. The cat brain will keep suggesting it until it is run.

---

## 2. Pre-Purr Context Load

Before running diagnostics, read:

1. `.claude-cat/state.json` -- phase, prey size, energy, threat level, nine lives, nocturnal flag
2. `.claude-cat/litterbox.md` -- treats (success criteria), stalk findings, pounce log
3. The files touched in the current session (from `state.json` territory.currentSession)

**Check for post-3AM state:** If the most recent phase in phaseHistory was `nocturnal` or `recovering`, this is a post-3AM purr. Surface any threat warnings that were suppressed during nocturnal mode (see section 7).

---

## 3. Part One -- Diagnostic Report

Produce a structured health assessment. Evidence-based. Calm. Not a post-mortem -- a current-state snapshot.

### What to check

**For each success criterion in the treats definition:**
- Is it satisfied? Check the code, the pounce log, and any available test output.
- Rate it: satisfied / partially satisfied / not yet checked / blocked.

**For each file in `territory.currentSession`:**
- Does it compile without errors?
- Are there obvious runtime risks (uncaught exceptions, missing null checks, unhandled promise rejections)?
- Are there any partial changes that were started but not completed?
- Is there anything that looks recently broken that was not touched by this session?

**Test suite (if present):**
- Are the relevant tests passing?
- Did any previously passing tests start failing?
- Are there tests that should exist for the changes made but do not?

**Confidence assessment:**
- Rate overall confidence in the current state: high / medium / low.
- High: changes are complete, tested, and criteria are met.
- Medium: changes are complete but not fully verified, or one criterion is unclear.
- Low: changes are in progress, tests are failing, or significant uncertainty exists.

### Report tone

The diagnostic is evidence-based and morale-preserving. It reports what is true without amplifying anxiety.

- State what is working first.
- State what is uncertain with specific evidence, not vague concern.
- State what is not working with a clear path to resolving it.
- The report should leave the user knowing exactly what the next move is.

---

## 4. Part Two -- Self-Healing Reinforcement

After the diagnostic, identify what is working well and actively reinforce it. This is not optional commentary. It is the immune system of the codebase.

### Reinforcement actions

**Suggest tests to lock in good patterns:**
If the pounce introduced a fix, suggest a specific test that would catch a regression. Give the test structure -- do not just say "add tests."

Example:
> "This fix should be locked in with a test: given [input], the function should return [output] without [error]. This prevents the same condition from silently returning."

**Identify load-bearing code:**
Flag code that other parts of the system depend on that was touched or is adjacent to changes. Note why it is load-bearing and suggest extra care or a test.

Example:
> "The auth middleware touched in this pounce is called on every request. It's load-bearing. A regression here breaks the whole session layer, not just the login flow."

**Flag clean abstractions worth preserving:**
If the pounce produced a clean function, interface, or pattern worth keeping as-is, name it explicitly.

Example:
> "The new error handler pattern is clean. It handles both sync and async errors in one place. Worth preserving this shape for future error handling rather than ad-hoc inline checks."

**Note technical debt that appeared but was not addressed:**
If the investigation or pounce revealed adjacent technical debt, name it without pressure. Not everything needs to be fixed now.

Example:
> "Noticed the config loader has no validation on required fields. Not part of this hunt, but worth a separate mouse hunt."

---

## 5. Prey-Size Modifiers

Adjust report depth based on prey size.

| Prey Size | Purr Depth |
|-----------|-----------|
| Moth | Single-pass check. Did the fix work? Any obvious breakage? One reinforcement note if relevant. Light output. |
| Mouse | Standard check. All criteria. Brief reinforcement section. |
| Bird | Full diagnostic. All criteria. Multiple reinforcement actions. Test suggestions with structure. |
| Squirrel | Deep review. Full criteria check. Comprehensive reinforcement. Explicit identification of all load-bearing code touched. Test suggestions required, not optional. |
| String | Check whether the intermittent behavior is still observable. Note that strings may not be confirmable without extended observation. Flag if the fix addresses only a symptom. |

---

## 6. Threat Decay

After completing the diagnostic, evaluate threat level.

**If the purr found no new risk signals since the last threat escalation:** De-escalate threat by 1 level.

Update `state.json` threat.level and append to threat.log:
```json
{
  "timestamp": "[ISO timestamp]",
  "from": [prior level],
  "to": [new level],
  "trigger": "purr completed with no new risk signals"
}
```

**If the purr found new risk signals:** Do not de-escalate. Report the new signals as part of the diagnostic.

**If threat level is 0:** No change.

---

## 7. Post-3AM Purr Protocol

If the prior phase was `nocturnal` or `recovering`, this purr has additional responsibilities.

Surface all suppressed threat warnings that were logged during 3 AM but not shown:

> "3 AM suppressed [N] warnings during nocturnal mode. Here they are now: [list with specifics]."

Do not minimize these. The user needs to see them now that the intensity has passed.

After surfacing the warnings, assess which (if any) require immediate action versus which can be tracked as future work.

---

## 8. Output -- Write to litterbox.md

Append the health report to `.claude-cat/litterbox.md`:

```markdown
### [ISO timestamp] Purr
- **Healthy:** [list of confirmed-working items with evidence]
- **Uncertain:** [list of items not fully verified, with what evidence is missing]
- **Not working:** [list of failing items, if any]
- **Confidence:** high | medium | low
- **Criteria status:** [each criterion from treats marked satisfied / partial / pending / blocked]
- **Reinforcements:** [tests suggested, load-bearing code flagged, clean abstractions noted, debt observed]
- **Safest next move:** [one specific recommended action]
```

---

## 9. State Update

After writing the report, update `.claude-cat/state.json`:

```json
{
  "phase": "purring",
  "threat": {
    "level": "[new level after decay, if applicable]"
  },
  "energy": "[current energy + 5]"
}
```

Append `"purring"` to `phaseHistory`.

**Energy cost:** +5. Purring is restorative. It heals. Purring adds energy, not subtracts it.

Energy cap is 100. If energy is already 95-100, the +5 is absorbed but does not exceed 100.

---

## 10. Post-Purr Suggestion

After completing:

**If all success criteria are satisfied:**
> "Criteria satisfied. Hunt looks successful. /nap to close it out?"

**If criteria are partially satisfied:**
> "[N of M] criteria satisfied. [Remaining criteria]. Another /pounce on the remainder, or /nap if this is the intended stopping point?"

**If confidence is low or significant issues remain:**
> "Health check flagged [summary]. Recommend addressing [specific item] before closing the hunt."

---

## 11. Special Rule -- Mandatory Post-3AM Behavior

After any 3 AM session, the cat brain will keep suggesting /purr on every subsequent command until the user runs it or explicitly says they do not want it.

The suggestion is not a nag -- it is a quiet note after each command:

> "[After whatever just happened.] Purr still pending from 3 AM."

When the user finally runs /purr post-3AM, surface the suppressed warnings (section 7) before the standard diagnostic.

---

## v2 Autonomy Note

Authority tier: auto. In full-cat mode, purr may run automatically after a successful pounce or zoomies session. Post-3AM, purr surfaces all suppressed threat warnings. Threat de-escalation: drops threat by 1 level if no new risk signals since last escalation.
