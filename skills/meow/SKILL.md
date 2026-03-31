---
name: meow
description: Translates technical reality into human language. Explains decisions, summarizes systems, bridges the gap between what the code does and what people need to understand about it.
version: 1.0.0
---

# Meow Skill -- Human Translation

## Purpose

A cat meows specifically to communicate with humans. It is not the sound cats make with each other. It is the sound they learned to use to cross the species gap.

The meow skill is the same crossing. Technical decisions, code architecture, what just happened in a session, what a bug means, what a system does -- translated into language a specific human can actually receive and use.

This is not dumbing down. It is precision in the other direction.

---

## 1. Audience Assessment

Before translating anything, identify the audience. The translation changes based on who is receiving it.

Ask yourself (or ask the user directly if unclear):

**Who is this for?**

| Audience | Translation Approach |
|----------|---------------------|
| Developer (same domain) | Technical accuracy preserved. Jargon allowed. Focus on the "why" over the "what." |
| Developer (different domain) | Keep the concepts but replace domain-specific terms with analogies. |
| PM / Product Owner | Focus on impact and tradeoff. Skip implementation details unless they drive a decision. Timelines and scope matter more than mechanics. |
| Executive / Non-technical stakeholder | What changed, what it means for the product, what they need to decide or know. No implementation. Pure outcome language. |
| New team member | Full context. Assume nothing. Explain the system, the decision, and how it fits into the bigger picture. |
| Developer (this is the user) | Reflective translation. "Here is what we just did in plain terms" -- useful for decision review, handoffs, or documentation. |

If the user has not specified, default to "same-domain developer" and note the assumption.

> "Explaining this as if for a developer familiar with the stack. Let me know if you want a different angle."

---

## 2. What Can Be Meowed

The meow skill can translate any of the following:

### Technical Decisions

A decision was made during a stalk, pounce, or knead. Someone needs to know why.

Translate: What the decision was. What the alternatives were. Why this one. What it costs and what it buys.

### Code and Systems

A file, a function, a module, a whole service. Someone needs to understand what it does.

Translate: The job of this code. The inputs, outputs, and side effects in plain terms. Where it lives in the larger system. When things go wrong, how you know it is this piece.

### "What Just Happened"

A session produced changes. Someone needs to know what happened.

Translate: What changed. What was left alone and why. What is still open. What the safest next action is.

### Bug Reports

A bug exists. Someone needs to understand its impact.

Translate: What the user experiences. What the system actually does. Why those differ. How serious it is. What is needed to fix it.

### Architecture

A system or component has a structure. Someone needs a mental model.

Translate: The shape of the thing. How data flows. What depends on what. Where the load-bearing pieces are.

---

## 3. Translation Principles

Apply these regardless of audience:

**Benefits before mechanisms.** What does this mean for the person receiving it, before you explain how it works.

**One idea per sentence.** If a sentence contains a semicolon and an "and," consider splitting it.

**Name the tradeoff explicitly.** If a decision had a cost, say so. Unexplained decisions breed distrust.

**Use the user's vocabulary when you know it.** If the user calls something a "handler" not a "controller," use "handler." Match their language where possible.

**No false simplification.** If something is genuinely complex, say "this is complex because..." and explain the source of the complexity. Do not pretend it is simple when it is not.

**Active voice.** "The function returns the user's ID" not "the user ID is returned by the function."

---

## 4. Output Format

The format changes by audience and purpose.

### For developers and PMs: Structured explanation

```
What this does: [one sentence]
Why it works this way: [1-3 sentences on the decision or design]
What to watch out for: [any gotchas, edge cases, or fragility]
What it connects to: [dependencies or related systems, if relevant]
```

### For executives: Short brief

```
What changed: [one sentence outcome]
What it means: [one sentence impact]
What needs a decision (if anything): [one sentence, or omit if none]
```

### For new team members: Contextual explanation

Full prose. Set the scene. Explain the system, then the decision, then where this piece fits. Do not assume prior knowledge. End with: "Questions to ask if confused: [2-3 diagnostic questions they can use to orient themselves further]."

### For handoffs and documentation

Structured prose suitable for writing to a document. Clear headings. Complete enough to stand alone. Write to litterbox.md when the user confirms it is handoff-relevant (see section 6).

---

## 5. Reactive Overlay Behavior

Meow is a reactive overlay. It does not change the session state. It does not move the hunt forward or backward. It is a translation layer run on top of whatever is happening.

- No phase change
- No phase history entry
- Energy cost: -5

When meow completes, the session continues from exactly where it was.

---

## 6. Read-Only Default

By default, meow does not write to any file. It produces output for the conversation.

**Write to litterbox.md only when:**
- The output is handoff-relevant (e.g., it explains a decision that a future developer needs to understand)
- The user explicitly asks to save it

When writing to litterbox.md:

```markdown
### [ISO timestamp] Meow: [topic]
- **Audience:** [who this was for]
- **Summary:** [the translated explanation]
```

---

## 7. When Meow Is Suggested

The cat brain suggests /meow when:

- The user asks "why," "explain," or "what does this mean"
- Code complexity reaches a level where a plain-language model would reduce future friction
- A decision was made in this session that has no written rationale
- A handoff is approaching (nap following a complex session)

Meow does not need a hunt. It does not need treats. It can run at any point, from any state.

---

## 8. Edge Cases

**User asks for a meow on something that does not exist yet:** Acknowledge it.

> "Nothing to translate yet -- this hasn't been built or decided. Want me to translate the proposed approach instead?"

**The thing is genuinely inexplicable without implementation detail:** Say so.

> "This one resists plain language without losing accuracy. Here is the clearest version I can offer, plus a note on where the complexity actually lives: [...]"

**User wants meow output in a specific format (email, Slack message, PR description, commit message):** Match the format. Adjust length and register to fit the medium.

> "Formatting this as a Slack message -- keeping it short enough to read in a channel."
