---
name: nap
description: Use when checkpointing progress, ending a session, handing off to another developer, or when energy is low. Saves full state, summarizes progress, archives completed hunts, and updates territory.
version: 1.0.0
---

# Nap Skill -- Checkpoint and Handoff

## 1. Purpose

Every session ends. The nap captures everything that happened so the next session -- whether it is this developer tomorrow, or a different developer entirely -- can pick up exactly where this one left off.

A good nap is a complete handoff. Not a vague summary. The next person reading it should know: what was being hunted, what was caught, what is left, what is tricky, and what to do first.

---

## 2. Pre-Nap Context Load

Read the following files before producing any output:

1. `.claude-cat/state.json` -- full current state
2. `.claude-cat/litterbox.md` -- full hunt record
3. `.claude-cat/treatsdrawer.md` -- territory map and past hunt archive (if it exists)

Assess the hunt's current status:

- **Complete:** All success criteria from the treats definition are satisfied.
- **Partial:** Some criteria satisfied, hunt still active.
- **Abandoned:** Hunt is being closed without completing the criteria (user is stopping anyway).
- **Never started:** /treats was defined but no pounce or stalk occurred.

The outcome assessment determines whether the hunt is archived or continues.

---

## 3. Checkpoint Save

Before writing any summaries, save a checkpoint. This checkpoint is free -- it does not consume a life.

Record in `state.json` nineLives:
```json
{
  "id": "[next sequential ID]",
  "timestamp": "[ISO timestamp]",
  "phase": "napping",
  "description": "nap checkpoint -- pre-handoff state saved"
}
```

Note that this checkpoint was saved without consuming a life. It is a free save.

---

## 4. Determine Outcome -- Archive or Continue

### If all success criteria are satisfied

The hunt is complete. Archive it.

**Create a completed hunt entry in `treatsdrawer.md`.** Append it at the top of the hunt archive section (most recent first):

```markdown
### [date] Hunt: [goal from treats]
- **Prey size:** [classified size]
- **Outcome:** success
- **Treats satisfied:** [N/N]
- **Key learnings:** [specific findings, root causes, patterns discovered -- write this for future reference, not as a summary of what happened]
- **Files touched:** [list of all files modified during this hunt]
- **Watch areas:** [any load-bearing code flagged during purr, any debt noted]
```

After archiving, update the territory map in `treatsdrawer.md`. For every file touched this session, increment its visit count in the territory data.

Clear `.claude-cat/litterbox.md` (the hunt is archived, the litterbox is fresh for the next hunt). Write a single line to confirm:

```markdown
<!-- Litterbox cleared. Hunt archived to treatsdrawer.md on [date]. -->
```

Set `hunt.active = false` in state.json.

### If criteria are partially satisfied (hunt continues)

The hunt is not over. Preserve the full litterbox as-is. Add a handoff section at the bottom of `litterbox.md`:

```markdown
---
## Handoff -- [date]
- **Session ended:** [brief note on why -- energy low, end of work day, context exhausted]
- **Progress:** [N of M criteria satisfied -- list which are done and which remain]
- **Last action:** [the most recent stalk / pounce / knead and its outcome]
- **Blocker:** [if something was blocking progress, describe it specifically]
- **Next session should:** [the single most important first action for whoever picks this up]
- **Watch out for:** [anything tricky, surprising, or discovered that the next session should know about]
- **Files in progress:** [any files that have partial changes or were mid-investigation]
```

Hunt remains active. `hunt.active` stays true.

### If hunt is being abandoned

The user is stopping without completing the criteria. Archive it as abandoned.

Create an abandoned hunt entry in `treatsdrawer.md`:

```markdown
### [date] Hunt: [goal from treats]
- **Prey size:** [classified size]
- **Outcome:** abandoned
- **Treats satisfied:** [N/M]
- **Reason for abandonment:** [if known]
- **Key learnings:** [anything learned even if the hunt did not complete -- this still has value]
- **Files touched:** [list of all files modified]
- **State when abandoned:** [brief description of where the hunt was]
```

Clear litterbox and set `hunt.active = false`.

---

## 5. Territory Update

Update the territory map in `treatsdrawer.md` regardless of outcome. This is always done on nap.

For every file in `state.json` territory.currentSession, update the territory record:

```markdown
## Territory Map
| File | Total Visits | Last Visit | Notes |
|------|-------------|------------|-------|
| src/auth/login.ts | 4 | 2024-01-15 | Auth middleware, load-bearing |
```

- If the file already exists in the map, increment visit count and update last visit.
- If the file is new to the map, add it with visit count 1.
- Notes are optional but encouraged for anything load-bearing, tricky, or architecturally significant.

---

## 6. Handoff Summary

Whether the hunt is complete, continuing, or abandoned, produce a clear handoff summary. This is the output shown to the user at the end of the nap.

The handoff summary must be written as if it will be read by a different person who has zero context from this session. Do not assume the reader remembers anything.

### Summary structure

```
## Session Handoff -- [date]

**Hunt:** [goal in one sentence]
**Status:** complete | partial | abandoned
**Prey size:** [size]

**What was accomplished this session:**
[Specific changes made. File names. What each change does. Not "we fixed the bug" but "the null check was added to handleAuth() in src/auth/middleware.ts line 42 to prevent crash when token is missing."]

**What remains:**
[Specific unfinished items. For each unfinished criterion from treats, describe exactly what still needs to happen.]

**The next session should start with:**
[One specific action. Not "continue working on X" but "/pounce the remaining null check in src/user/profile.ts -- stalk findings are in litterbox.md, the pattern is the same as the fix applied in middleware.ts."]

**Watch out for:**
[Anything surprising, tricky, or counter-intuitive discovered during this session. This is the most valuable part of the handoff. Write it for someone who is about to make the same mistakes you almost made.]
```

---

## 7. State Update

After writing all files, update `.claude-cat/state.json`:

```json
{
  "phase": "napping",
  "energy": 100,
  "threat": 0,
  "territory": {
    "currentSession": []
  }
}
```

**Phase state:**
- If hunt was archived (complete or abandoned): set phase to `dreaming`.
- If hunt continues: set phase to `napping`.

**Energy:** Reset to 100. Always. Naps are full resets.

**Threat:** Reset to 0 unless a claws-out (level 3) boundary violation remains unresolved. If a level-3 threat remains, do not reset -- preserve it in the threat log with a note that it carried over from this session.

**Territory currentSession:** Clear to empty array. The session is over. The persistent territory data lives in treatsdrawer.md, not in currentSession.

Append the new phase to `phaseHistory`.

---

## 8. Treatsdrawer Compaction Check

After archiving a completed hunt, check the total hunt count in treatsdrawer.md.

If the count exceeds 50 completed hunts, suggest compaction:

> "Treatsdrawer has [N] hunts recorded. Compaction available when ready -- it summarizes old hunts while preserving territory data and key findings. Suggest it before the next session gets busy."

Do not compact automatically. Do not compact without explicit user approval.

---

## 9. Post-Nap Output

After completing, confirm to the user:

**For a complete hunt:**
> "Hunt archived. [N] treats caught. Litterbox is clear for the next hunt. Good session."

**For a continuing hunt:**
> "Checkpoint saved. Progress recorded. Next session should start with [specific action from handoff]."

**For an abandoned hunt:**
> "Hunt archived as abandoned. [N/M] treats satisfied. Litterbox is clear."

Keep the confirmation brief. The handoff summary has the detail. The closing note just confirms the nap is done.

---

## 10. Edge Cases

**Nap with no treats defined and no hunt activity:** There is nothing to archive. Save a checkpoint (free), reset energy to 100, clear threat. Confirm:

> "No active hunt. State reset. Fresh start next session."

**Litterbox.md does not exist:** Create a minimal entry noting the nap and the date. Archive nothing -- there is nothing to archive.

**Treatsdrawer.md does not exist:** Create it on the first archive. Initialize it with the territory map section and the first hunt entry.

**User runs /nap while 3 AM is unresolved (purr has not been run):** Note it clearly.

> "3 AM mode ran but purr was not completed. The suppressed warnings were not surfaced. Recommend running /purr before this nap, or the next session will start with those warnings still unreviewed."

If the user proceeds anyway, archive the nap but note in the handoff that post-3AM purr is still pending.
