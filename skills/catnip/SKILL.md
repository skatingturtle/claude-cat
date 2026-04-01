---
name: catnip
description: Structured creative exploration through six behavioral phases modeled on real catnip response. Wild but disciplined. Generates novel approaches, challenges assumptions, and returns ranked survivors after a refractory cooldown.
version: 1.0.0
---

# Catnip Skill -- Structured Creative Exploration

## Purpose

Catnip does something specific to a cat's brain. It is not random chaos. There is a sequence: sniff, lick, chin-rub, head-shake, full body roll, then stillness. The cat goes through something. It comes out the other side. The experience has a shape.

The catnip skill applies this shape to creative problem-solving. It is structured exploration. It is not brainstorming (too loose), not analysis (too cold), and not prototyping (too committed too early). It is the deliberate act of moving through phases of engagement with a problem until you have found what is genuinely worth pursuing.

Wild, but disciplined. Expansive, then selective.

---

## Refractory Period

**One non-catnip command must pass before catnip is available again.**

Catnip has a refractory period. Running catnip back-to-back without a gap between produces diminishing creative output and burns energy without return. After completing a catnip session, the skill is unavailable until at least one other command has run in the session.

If the user invokes /catnip immediately after a prior catnip session:

> "Refractory period active. Run one other command first. Catnip right after catnip produces noise, not signal."

---

## Cat Brain Behavior

**The cat brain never auto-suggests catnip directly.**

It may hint: "This problem might not have a conventional answer..." or "The standard approaches all have the same flaw -- there might be something else here."

It does not say "/catnip." That is intentional. Catnip is a tool the developer reaches for deliberately, not one the system nudges them toward. The hint creates space for the developer to recognize when they need it. The command is their choice.

---

## Prey-Size Guidance

| Prey Size | Catnip Guidance |
|-----------|----------------|
| Moth | "You don't need catnip for this. It is a moth." Decline gently. The developer can override. |
| Mouse | Not recommended. Standard analysis is more efficient. Note this, then proceed if the user insists. |
| Bird | Valuable. Run the full six phases. |
| Squirrel | Most valuable. This is what catnip is built for -- complex, multi-part problems with no obvious solution. |
| String | Highly appropriate. Strings are often problems that resist conventional framing. Catnip can surface a non-obvious approach. |

---

## The Six Phases

### Phase 1 -- Sniff

**Scan the problem space. What is interesting? What patterns exist? What smells different?**

This is the arrival phase. You are not solving anything yet. You are orienting.

Observe the problem from outside. What is the conventional framing? What does everyone assume about this? What is the shape of existing solutions? What would a generic answer look like?

Then: what is wrong with the generic answer? Where does it fail? What assumption does it depend on that might not be true?

Produce: a brief scan of the problem landscape. 3-5 observations. At least one observation should challenge the framing of the problem itself.

End Phase 1 with:

> "**Sniff complete.** [Most interesting observation. What to pursue next.]"

---

### Phase 2 -- Lick

**Taste one idea. Quick spike, sketch, prototype. Do not commit.**

Take the most interesting thread from the sniff phase. Pursue it just far enough to taste it. This is not a full design. It is a quick sketch. You are answering: does this have something to it, or is it all smell and no substance?

Keep it short. 2-3 paragraphs or a brief sketch of how the idea would actually work. Do not invest in polish. This phase is expendable.

End Phase 2 with:

> "**Lick complete.** [Quick verdict: does this have legs, or does it fall apart on first contact?]"

---

### Phase 3 -- Chin-Rub

**Mark the promising direction. "This one has legs." Claim it.**

A cat chin-rubs to mark something as its own. This is the phase where you commit to a direction -- not to implementation, but to exploration. You are saying: this approach is worth going deeper on.

Assess what you tasted in Phase 2. If it has something real: name it, claim it, and articulate why it is worth pursuing. What is the insight at its core? What makes it different from the conventional answer?

If Phase 2 produced nothing worth claiming: go back to the sniff findings and lick a different thread. You may run Phase 2 again before proceeding to Phase 3. Do not proceed to Phase 3 without something worth claiming.

End Phase 3 with:

> "**Chin-rub complete.** [Named direction. Why it is worth pursuing. The core insight.]"

---

### Phase 4 -- Head-Shake

**Challenge it. What is wrong? Shake off assumptions. Play devil's advocate.**

The head-shake is the adversarial phase. You have committed to a direction. Now you try to break it.

Look for:
- The assumption the approach depends on that might not hold
- The edge case it does not handle
- The reason conventional solutions did not go this way (was it tried? was there a reason it was abandoned?)
- What the cost is in complexity, time, or tradeoffs
- Who would push back on this and why

Be genuinely adversarial here. If the direction survives the head-shake, it is stronger for it. If it collapses, better to know now than after the body roll.

End Phase 4 with:

> "**Head-shake complete.** [What survived. What was shaken off. How the direction is modified, if at all.]"

---

### Phase 5 -- Body Roll

**Full creative immersion in the chosen direction. Expand, combine, go wild.**

This is the peak of the catnip response. Full engagement. No filtering. You are inside the idea now.

Take the direction that survived Phase 4 and push it as far as it can go. Expand it. Combine it with other approaches. Consider the non-obvious extensions. What does this look like at its best? What could it enable beyond the immediate problem? What adjacent problems does it suggest solutions for?

This is the only phase where you are allowed to be genuinely unconstrained. Produce volume. Produce combinations. Do not evaluate yet.

End Phase 5 with a list of what was generated. Not a judgment. A catalog.

> "**Body roll complete.** [List of what was generated: approaches, variants, combinations, extensions.]"

---

### Phase 6 -- Refractory

**Come down. Evaluate soberly. What survived the trip? Rank survivors.**

The refractory phase is the return to clarity. The creative intensity of Phase 5 is over. Now you assess what was produced.

Apply a sober filter to everything generated in Phase 5:

- What is genuinely novel and worth pursuing?
- What looks interesting but is actually impractical?
- What is a good idea for a different problem than the one we started with?
- What is worth keeping as a secondary approach if the primary fails?

Produce a ranked list of survivors. Most promising first.

For each survivor:

```
[Rank]. [Brief name for the idea]
Why it survived: [What makes it worth pursuing]
What it needs next: [The specific next action -- /pounce, /stalk, /knead, further exploration]
Confidence: high | medium | low
```

End Phase 6 with the ranked list and a recommendation on what to do first.

> "**Refractory complete.** [N] survivors ranked. Top recommendation: [name]. Suggested next: [/pounce / /stalk / /knead]."

---

## Energy Cost and State

Catnip is the most energy-intensive skill in the toolkit.

- **Energy cost:** -20
- **State change:** No phase change. Reactive overlay.
- **No phase history entry.**

Update `state.json` energy after completion:

```json
{
  "energy": "[current energy - 20]"
}
```

If energy would drop below 10 after catnip, warn the user before starting:

> "Energy is low. Catnip costs 20. Current energy: [N]. Running catnip will leave you at [N-20]. Suggest /purr or /nap to restore first, or proceed knowing energy will be critically low."

---

## Output -- Write to litterbox.md

Append the catnip record to `.claude-cat/litterbox.md`:

```markdown
### [ISO timestamp] Catnip: [problem]
- **Direction explored:** [named direction from Phase 3]
- **Survived the head-shake:** [yes/modified/barely]
- **Survivors ranked:**
  1. [top idea]: [why it survived]
  2. [second idea]: [why it survived]
  ...
- **Suggested next:** [command]
- **Refractory until:** [next non-catnip command]
```

---

## Pre-Catnip Context Load

Before starting, read:

1. `.claude-cat/state.json` -- energy level, refractory status, prey size
2. `.claude-cat/litterbox.md` -- active treats, prior stalk findings, current hunt context
3. `.claude-cat/treatsdrawer.md` -- territory. Has this problem area been catnipped before?

**If catnipped before in this area:** Note what was explored and what survived. Do not repeat Phase 2-3 on already-explored directions unless the problem has changed.

---

## Edge Cases

**User provides a vague problem:** Invest more in Phase 1 (Sniff) to develop a workable framing. If the problem is too vague for even Phase 1, ask one clarifying question.

> "What specifically are you trying to find a better answer for? Give me the problem in one sentence."

**Phase 2 produces nothing worth claiming:** Go back. Lick a different thread. You may run up to 3 licks before proceeding to Phase 3. If three licks produce nothing, report it honestly.

> "Three licks, nothing worth claiming. The problem may not have an unconventional answer. Recommend conventional analysis: /stalk or /knead."

**The refractory filter wipes out everything from Phase 5:** That is a valid outcome. Report it.

> "Body roll produced a lot but refractory found nothing that survived sober evaluation. The conventional approach remains the best answer. No survivors."

Do not manufacture survivors to seem productive. An honest null result is more useful.

---

## v2 Autonomy Note

Authority tier: confirm-first. In full-cat mode, catnip requires explicit user confirmation. The cat may suggest catnip for creative exploration but will not auto-launch.
