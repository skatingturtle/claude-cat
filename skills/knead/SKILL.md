---
name: knead
description: Iterative refinement through repeated passes. Works something through until it feels right. Each pass sharpens further. Stops when improvement per pass diminishes.
version: 1.0.0
---

# Knead Skill -- Iterative Refinement

## Purpose

Kneading is a cat's instinct for working something soft until it is ready. Not one pass. Not a single review. Repeated pressure, shifting focus, building comfort.

The knead skill applies this to drafts, solutions, and problems. You work it through multiple passes. Each pass produces a better version than the last. You stop when the returns diminish -- when pass N+1 produces less than 10% improvement over pass N.

This is not the same as polishing a draft once. This is the sustained, deliberate effort of working something from rough to ready.

---

## 1. Pre-Knead Context Load

Before starting, read:

1. `.claude-cat/state.json` -- phase, prey size, energy
2. `.claude-cat/litterbox.md` -- active treats, success criteria, any prior work on this target
3. `.claude-cat/treatsdrawer.md` -- has this been kneaded before? What version was it last time?

**Read treats for "what right means."**

The success criteria in the treats definition are the standard against which each pass is measured. "Right" is not a feeling. It is a concrete description. If no treats are defined, ask the user to articulate what "done" looks like before starting.

> "What does right look like for this knead? I'll use that as the target for each pass."

---

## 2. Pass Structure

Each knead runs between 2 and 5 passes by default. Adjust based on prey size (see section 5).

### Pass 1 -- Exploratory (Shape Assessment)

The first pass is about understanding, not fixing.

Ask: What is the shape of this thing? What is it trying to do? What is working? What is pulling against it?

Do not rewrite anything in Pass 1. Produce:
- A statement of what the draft/solution/problem is actually doing
- A statement of what it is trying to do
- The top 2-3 gaps between those two descriptions
- An initial impression of complexity: is this a rename-level fix or a structural rethink?

Output Pass 1 as a brief assessment. Label it clearly:

> **Pass 1 (Exploratory):** [Shape assessment. What it is. What it wants to be. Key gaps.]

### Pass 2 -- Structural Polish

Address the structural gaps identified in Pass 1. This is the heaviest pass.

Focus on:
- Organization: Does the order of ideas, sections, or logic match how a reader or user will encounter them?
- Clarity of intent: Does each part clearly serve the goal?
- Redundancy: Is anything repeated that does not need to be? Remove it.
- Missing pieces: Is anything critical absent that Pass 1 identified?

Make substantive changes here. Produce a revised version.

Output:

> **Pass 2 (Structural):** [Brief changelog. What moved, what was cut, what was added. Then the revised version.]

### Pass 3 -- Surface Polish

Tighten what Pass 2 produced. This pass is for:
- Word choice and precision
- Sentence-level clarity
- Removing hedging language that weakens the output
- Ensuring terminology is consistent throughout
- Fixing anything that reads awkwardly

Output:

> **Pass 3 (Surface):** [Brief changelog. Then the revised version.]

### Pass 4 and Beyond -- Diminishing Returns Check

Before running Pass 4, assess improvement from Pass 2 to Pass 3.

If the change was less than 10% by the author's judgment (fewer than 1 in 10 sentences changed meaningfully, or the structure is essentially the same), stop.

> "Pass 3 produced minor improvements. Returns are diminishing. Stopping here unless you want another pass."

If improvement was substantial, run Pass 4 with the same surface-polish focus. Apply the 10% check again before Pass 5.

**Maximum passes: 5.** After 5 passes, stop regardless. Report the final version.

---

## 3. Per-Pass Changelog

Each pass must produce a changelog. Not a vague summary. Specific changes.

Format:

```
Pass [N] changelog:
- [Specific change: what changed and why]
- [Specific change: what changed and why]
```

If a pass produced no meaningful changes (rare but possible), note that explicitly:

> "Pass [N] found no meaningful improvements. Stopping."

---

## 4. Stopping Condition

Stop kneading when any of the following is true:

1. **Diminishing returns:** Less than 10% change from one pass to the next
2. **Success criteria met:** The output satisfies what "right" means per the treats definition
3. **Pass limit reached:** Maximum passes completed (5 by default, adjusted by prey size)
4. **User stops it:** The user says "that's enough" or "good enough"

When stopping:

> "Kneading complete after [N] passes. [What changed most. What the final version is. What, if anything, is still not fully resolved.]"

---

## 5. Prey-Size Modifiers

Adjust pass count based on prey size.

| Prey Size | Pass Count | Notes |
|-----------|-----------|-------|
| Moth | 1 pass only. Exploratory only. | Moths do not need knead. If something is moth-sized, a single pass and a light rewrite should be enough. Consider /pounce instead. |
| Mouse | 2-3 passes. | Standard depth. Stop at 3 unless improvement is substantial. |
| Bird | 3-4 passes. | Full structural pass required. Surface polish after. |
| Squirrel | 4-5 passes. | Multiple structural passes may be needed. Do not rush to surface polish until structure is solid. |
| String | 2-3 passes with explicit acknowledgment that strings may resist clean solutions. | Note that a refined-looking output for a string-sized problem may hide ongoing ambiguity. |

**Not suggested for moths:** If the user runs /knead on a moth-sized target, note it:

> "This looks moth-sized. One quick pass, then /pounce is probably more efficient than repeated knead cycles."

---

## 6. Cat Brain Integration

The cat brain often suggests /knead between /stalk and /pounce for complex problems.

If you are being invoked in a stalk-to-pounce sequence:
- The stalk produced a model of the problem
- The knead refines the proposed solution before it is executed
- After knead, the user pounces on the refined version

In this context, the "draft" being kneaded is the proposed solution from the stalk findings. Read the stalk report from litterbox.md as the input.

> "Reading stalk findings as the knead input. Working the proposed solution through before pounce."

---

## 7. State Update

After completing the knead, update `.claude-cat/state.json`:

```json
{
  "phase": "kneading",
  "energy": "[current energy - 10]"
}
```

Append `"kneading"` to `phaseHistory`.

**Energy cost:** -10. Knead is focused work but contained. Less draining than a full stalk or pounce.

---

## 8. Write to litterbox.md

Append the knead record to `.claude-cat/litterbox.md`:

```markdown
### [ISO timestamp] Knead: [target description]
- **Passes run:** [N]
- **Stopping reason:** [diminishing returns / criteria met / pass limit / user stopped]
- **What changed most:** [brief summary]
- **Final version:** [inline or reference to where it lives]
```

---

## 9. Edge Cases

**User provides no target:** Ask what they want to knead. One clarifying question.

> "What are we kneading? A draft, a solution, a problem framing?"

**Target is already polished:** Note it after Pass 1 and ask if the user wants to continue.

> "Pass 1 found this already in good shape. The main gaps are minor: [list]. Continue kneading, or is this ready?"

**Knead reveals the problem needs redesign, not refinement:** Stop. Report it.

> "Kneading found that the structure may need rethinking, not just polishing. The core issue is [description]. Recommend /stalk on [specific area] before continuing to knead. Kneading a misshapen structure produces a well-polished misshapen structure."

**User asks for more passes after stopping:** Run them. The stopping conditions are suggestions, not hard blocks. The user decides when it is done.

---

## v2 Autonomy Note

Authority tier: announce-and-act. In full-cat mode, knead announces intent and proceeds. The cat may suggest knead when stalk reveals structural tangles.
