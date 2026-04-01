---
name: hiss
description: Adversarial review and boundary protection. Looks for scope creep, security risks, breaking changes, architectural violations, hidden costs, and things that simply should not be done. Protective, not hostile.
version: 1.0.0
---

# Hiss Skill -- Adversarial Review

## Purpose

A cat hisses to protect something. The territory. The hunt. The kittens. Not from aggression -- from awareness. Hissing is what a cat does when it has assessed a situation and determined that something is threatening, and that the threat needs to be named clearly before it gets closer.

The hiss skill is this applied to code, scope, and proposals. It is the adversarial review lens. It looks for what is wrong, dangerous, boundary-violating, or insufficiently considered. It says so directly.

Protective. Not hostile. There is a difference.

---

## 1. This Command vs. the Passive Hiss-Guard Hook

**This command is for manual, intentional adversarial review.**

The passive hiss-guard hook handles automatic detection of known dangerous patterns (force push, `rm -rf` without flags, destructive migrations without backups, etc.) and triggers automatically when those patterns appear in commands.

When you invoke `/hiss`, you are asking for a deliberate, deep review of a specific scope, change, or proposal. The passive hook is a tripwire. This command is a full investigation.

Do not conflate the two.

---

## 2. Custom Hiss Patterns

Users can configure additional patterns to hiss at in `.claude-cat/config.json`:

```json
{
  "hiss": {
    "customPatterns": [
      {
        "pattern": "description of what to hiss at",
        "severity": "warning | danger | blocker",
        "reason": "why this is a concern in this codebase"
      }
    ]
  }
}
```

Read `.claude-cat/config.json` before starting the review. Apply any custom patterns alongside the standard categories.

---

## 3. Pre-Hiss Context Load

Before reviewing, read:

1. `.claude-cat/state.json` -- current phase, prey size, threat level, energy
2. `.claude-cat/litterbox.md` -- active treats, non-goals, scope boundaries defined by the hunt
3. `.claude-cat/treatsdrawer.md` -- territory map, prior sessions in this area

**Read treats specifically for non-goals and scope boundaries.**

The treats definition often contains what the hunt is explicitly NOT supposed to do. These are the first place to check for scope creep. Any proposal that touches a non-goal should be flagged immediately.

---

## 4. Review Scope

Look for these categories. Do not skip categories because they seem unlikely -- adversarial review means assuming they are there and checking.

### Scope Creep

- Does this change do more than what was asked?
- Does it touch files or systems outside the defined prey-size blast radius?
- Does it make decisions that were not granted by the treats definition?
- Does it introduce new abstractions that extend beyond the current need?
- Does it silently expand the surface area in ways that will cost maintenance later?

### Security Risks

- Are user inputs validated before use?
- Is authentication or authorization bypassed, weakened, or assumed?
- Are secrets, keys, or tokens exposed (in code, logs, error messages, or URLs)?
- Are there SQL injection, XSS, CSRF, or injection vectors introduced?
- Is data persisted in a way that violates privacy or compliance requirements?
- Are third-party dependencies introduced with known vulnerabilities or unusual permissions?

### Breaking Changes

- Does this change the public interface of a module, function, or API?
- Are there callers in other parts of the codebase that will break silently?
- Does this change database schema, serialized data formats, or stored state in a way that existing data cannot satisfy?
- Does this alter expected behavior that tests, documentation, or users are depending on?
- Does this change a contract without versioning or migration?

### Architectural Violations

- Does this bypass a layer that was deliberately placed there (e.g., calling the database directly from the UI layer)?
- Does this violate a separation of concerns that the rest of the codebase maintains?
- Does this introduce circular dependencies?
- Does this ignore existing abstractions in favor of ad-hoc solutions?
- Does this couple two systems that were deliberately kept independent?

### Hidden Costs

- Does this introduce a performance regression (N+1 queries, synchronous blocking calls, memory growth)?
- Does this add operational complexity (new services, new dependencies, new monitoring requirements)?
- Does this create future technical debt that is not acknowledged?
- Does this require infrastructure changes that are not part of the proposal?
- Does this create a maintenance burden disproportionate to the problem it solves?

### Things That Should Not Be Done

- Is there a simpler solution that was not considered?
- Is this solving a problem that does not need solving?
- Is this adding flexibility that will never be used?
- Does this violate an established team or codebase convention?
- Would a senior developer on this codebase say "we don't do it that way here"?

---

## 5. Severity Levels

Every finding is assigned a severity level.

| Level | Meaning | Action Required |
|-------|---------|----------------|
| Blocker | This should not proceed. The risk is too high or the violation is too fundamental. | Hard stop. Do not proceed without addressing this. |
| Danger | Significant risk. Proceeding without addressing this creates real vulnerability. | Pause. Resolve or explicitly accept the risk before proceeding. |
| Warning | Something to watch. Not a showstopper but worth understanding and tracking. | Note it. Decide whether to address now or log for later. |
| Advisory | Worth knowing. Low urgency. | Take or leave at the developer's discretion. |

---

## 6. Output -- Risk Report

Produce the risk report in this format:

```
## Hiss: [target name]

### Blockers
- [Finding]: [Specific description of the risk or violation]
  Safer alternative: [What to do instead, or how to mitigate]

### Dangers
- [Finding]: [Specific description]
  Safer alternative: [What to do instead]

### Warnings
- [Finding]: [Specific description]
  Note: [Context or mitigation]

### Advisories
- [Finding]: [Specific description]

### Do Not Do This
- [Specific callout]: [Why this particular thing should not happen, stated plainly]

### Verdict
[Overall assessment: clear to proceed / proceed with caution / do not proceed]
[One sentence on the single most important thing to address before moving forward]
```

If a category has no findings, omit it. If all findings are advisory, say so explicitly -- the verdict should reflect that it is essentially clear.

Be direct. Hiss is not the place for softened language. "This will break" is more useful than "this could potentially cause issues."

---

## 7. Escalate Threat Level

If a blocker or danger finding is present, escalate the threat level in `state.json`.

Update `state.json`:

```json
{
  "threat": {
    "level": "[current level + 1, max 5]",
    "log": [
      {
        "timestamp": "[ISO timestamp]",
        "from": "[prior level]",
        "to": "[new level]",
        "trigger": "hiss: [brief description of the finding that triggered escalation]"
      }
    ]
  }
}
```

If findings are only warnings or advisories, do not escalate.

---

## 8. Reactive Overlay Behavior

Hiss is a reactive overlay. It does not change the session's phase state.

- No phase change
- No phase history entry
- Energy cost: -5

When hiss completes, the session continues from where it was. If the verdict is "do not proceed," that is a recommendation -- the user decides.

---

## 9. Write to litterbox.md

Append the risk report to `.claude-cat/litterbox.md`:

```markdown
### [ISO timestamp] Hiss: [target]
- **Blockers:** [count or "none"]
- **Dangers:** [count or "none"]
- **Warnings:** [count or "none"]
- **Verdict:** [clear / caution / do not proceed]
- **Threat level change:** [escalated to N / no change]
```

---

## 10. Edge Cases

**User asks to hiss their own idea:** Run it fully. The hiss is not personal. It is the same lens regardless of who proposed the thing.

**Everything looks fine:** Say so clearly, with evidence.

> "Hiss found no meaningful risks in this scope. Checked: scope, security, breaking changes, architecture, costs. All clear. Verdict: proceed."

Do not manufacture findings to seem thorough.

**Blocker found but user wants to proceed anyway:** Record the override.

> "Noted: proceeding despite the blocker finding on [issue]. Logging the override."

Add to litterbox.md: `Override: user proceeded despite blocker -- [description]`.

**User asks to hiss regularly at a specific pattern:** Direct them to add it to `.claude-cat/config.json` under the `hiss.customPatterns` array.

---

## v2 Autonomy Note

Authority tier: auto. In full-cat mode, hiss fires autonomously whenever scope, safety, or architecture is threatened. This is a promotion from v1 where hiss was manual-only. The dual-mode: slash command /hiss remains available for explicit adversarial review. Autonomous hiss is a warning, not a block.
