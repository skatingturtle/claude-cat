---
name: treats
description: Use when the user invokes /treats or when the cat brain detects work starting without defined success criteria. Interactively derives success criteria, acceptance tests, non-goals, proof-of-success, and prey size classification.
version: 1.0.0
---

# Treats Skill -- Hunt Initialization

## 1. Purpose

The treats are what you are hunting for. Without treats, you do not know when you have caught anything. You could stalk forever, pounce beautifully, and still not know if you succeeded.

This skill defines the hunt before it starts. It derives success criteria from the user's goal, classifies the prey size, identifies what is explicitly out of scope, and establishes what proof-of-success looks like. The output is a crisp treats definition written to `litterbox.md` that every subsequent command can reference.

Run /treats once per hunt. Run it before anything else.

---

## 2. State Gate

Before proceeding, read `.claude-cat/state.json`.

**If `hunt.active` is true:** The hunt is already in progress. Do not silently overwrite it.

Prompt the user:

> "Active hunt in progress. /nap first to close it, or replace this one?"

- If they choose `/nap`: stop here. Let them run /nap, then return.
- If they choose to replace: archive the current litterbox contents to `treatsdrawer.md` as an abandoned hunt entry (outcome: abandoned), then proceed with the new hunt.
- If they are unsure: surface the current treats definition from `litterbox.md` so they can see what they would be replacing.

**If `hunt.active` is false or state.json does not exist:** Proceed normally. This is the only command that can transition the phase from Idle to Scenting.

---

## 3. Interactive Derivation Process

Work with the user to derive the hunt definition. Do not write the definition until you have confirmed the key fields with them.

### Step 1 -- Understand the goal

Repeat the user's goal back to them in your own words. Ask if your interpretation is correct before moving forward.

If the goal is vague or underspecified, ask one clarifying question at a time. Do not fire a list of questions.

### Step 2 -- Classify prey size

Based on the goal, classify the prey size using the table in section 4. State your classification and why.

If the goal maps to a red dot (unbounded, no definition of done), stop here:

> "This looks like a red dot -- no clear end condition. I can't define treats for an unbounded hunt. What would 'done' actually look like?"

Do not proceed until the goal can be constrained to a finite scope.

### Step 3 -- Derive success criteria

Propose 2-5 specific, verifiable success criteria for the goal. Each criterion should be testable -- something that can be checked as done or not done.

Example criteria:
- "The login form submits without a 500 error."
- "All existing unit tests pass."
- "The new endpoint returns a 200 with the expected shape."
- "The component renders in under 200ms."

Ask the user to confirm, add, or remove criteria before finalizing.

### Step 4 -- Define non-goals

Propose what this hunt explicitly will not do. Non-goals prevent scope creep mid-hunt.

Ask the user to confirm. Common non-goals:
- "Will not refactor unrelated modules touched during investigation."
- "Will not add new tests beyond what the task requires."
- "Will not change the public API shape."

### Step 5 -- Establish proof of success

Describe what "done" looks like in concrete terms. This is the final state check at the end of the hunt.

Example: "A new user can register, log in, and see their dashboard without errors. The test suite passes. No new console errors appear."

### Step 6 -- Check treatsdrawer for similar hunts

Read `treatsdrawer.md` if it exists. Scan for completed hunts that overlap with this goal. If found, surface the relevant learnings:

> "Similar hunt: [date] -- [goal]. Key findings: [summary]. Files touched: [list]."

Apply any relevant learnings to refine the current treats definition before finalizing.

---

## 4. Prey Size Classification

Classify based on these signals. When signals conflict, classify upward (err toward the larger size).

| Size | Signal Words and Indicators | Blast Radius | Hunt Approach |
|------|-----------------------------|--------------|---------------|
| String | "keeps happening", "intermittent", "flaky", "sometimes fails", "not always" | Single elusive point | Careful stalk or walk away. Warn the user if time invested is likely to exceed the value of catching it. Strings are often not worth chasing. |
| Moth | "quick fix", "typo", "one-liner", "just change X", "this one thing" | Single file or single line | Skip ceremony. /pounce directly without /stalk. Minimal energy. |
| Mouse | "bug in X", "add Y to Z", "this function is wrong", "fix this behavior" | 1-3 files | Light /stalk then /pounce. Standard sequence. |
| Bird | "feature", "refactor this module", "new component", "redesign this flow" | 3-10 files | Full predatory sequence: treats, stalk, pounce, purr. |
| Squirrel | "architecture change", "new system", "redesign", "overhaul", "from scratch" | 10+ files | Extended stalk, multiple /knead passes, /slow-blink before every pounce. Plan for multiple sessions. |
| Red dot | No definition of done, "make it better", "fix everything", "just make it work", moving or shifting targets | Unbounded | /hiss. Refuse to hunt until treats constrains the scope. In 3 AM mode: bounded chase then hard stop with a report on why it cannot be caught. |

---

## 5. Output -- Write to litterbox.md

Once the user has confirmed the treats definition, write it to `.claude-cat/litterbox.md`. If litterbox.md already exists with content from the replaced hunt, overwrite only the Treats section or initialize a fresh file.

Format:

```markdown
## Treats
- **Goal:** [derived from user input, in your own words]
- **Prey size:** [classified size]
- **Success criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2
  - [ ] Criterion 3
- **Non-goals:**
  - Will not do X
  - Will not do Y
- **Proof of success:** [what "done" looks like in concrete terms]
```

After writing, confirm to the user:

> "Treats defined. Hunt is live. Prey is [size]. Ready to /stalk?"

---

## 6. State Update

After writing the treats definition, update `.claude-cat/state.json`:

```json
{
  "phase": "scenting",
  "prey": {
    "size": "[classified size]",
    "reclassified": false,
    "originalSize": "[classified size]"
  },
  "nineLives": {
    "total": 9,
    "used": 0,
    "checkpoints": []
  },
  "hunt": {
    "active": true,
    "treatsFile": "litterbox.md",
    "startedAt": "[current timestamp]"
  },
  "energy": "[current energy - 5]"
}
```

Append `"scenting"` to `phaseHistory`.

**Energy cost:** -5.

**Nine lives:** Reset to 9 on every new hunt, regardless of how many lives were used in the prior hunt.

---

## 7. Edge Cases

**User provides a fully-formed goal with clear criteria:** Propose the classification and criteria directly and ask for a single confirmation rather than stepping through each sub-question.

**User provides an extremely vague goal:** Ask one focused question. Do not request a complete specification upfront. Narrow the goal one dimension at a time.

**Treatsdrawer does not exist yet:** Skip the similar-hunt check. Proceed normally. Treatsdrawer is created by /nap when the first hunt completes.

**User insists on proceeding with a red-dot goal:** Acknowledge their decision, note the risk explicitly, and define the tightest possible treats definition you can construct given the information available. Flag that scope creep is likely and suggest checking prey size mid-hunt.
