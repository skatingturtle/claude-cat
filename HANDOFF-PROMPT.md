# Claude Cat v2 -- Handoff Prompt

Copy everything below this line into a new Claude Code session for continued development.

---

## Project: Claude Cat v2 (Approach C -- Full Cat Mode)

**Repository:** github.com/skatingturtle/claude-cat
**Local:** `~/Documents/01 Business/01 Sprouties/0 Claude/claude-cat/`
**Version:** 2.0.0
**Status:** Implemented, ready for testing and iteration

### What v2 delivers (over v1)

v2 promotes the cat brain from a passive advisor (Approach B) to an autonomous orchestrator (Approach C). The cat now owns the hunt loop.

**New capabilities:**
- Autonomous behavior selection based on user messages and context
- Four authority tiers: auto, announce-and-act, confirm-first, hard-consent-only
- Dynamic escalation (context raises tiers based on threat, territory, prey size)
- Progressive trust (cat starts cautious, builds confidence across the session)
- Ambient awareness: drift detection, fatigue sensing, territorial instinct, prey reclassification
- Decision trace: every autonomous action logged with what was sensed, chosen, and why
- String chase: lightweight side-hunt tracking in state.json
- Hunt memory: treatsdrawer retrieval for past hunt patterns
- Graceful degradation: full-cat > graduated > advisor > direct commands
- Three autonomy modes: advisor (v1 compat), graduated (training wheels), full-cat (full orchestration)

### Key files

| File | Role |
|------|------|
| `skills/cat-brain/SKILL.md` | The autonomous orchestrator. The single most important file. |
| `hooks/scripts/autonomy-utils.js` | Authority matrix, progressive trust, decision trace, escalation logic |
| `hooks/scripts/state-utils.js` | State/config schemas with v1-to-v2 migration |
| `hooks/hooks.json` | Hook configuration (sensory pipeline) |
| `hooks/scripts/resume-state.js` | Session resume with v2 awareness |
| `hooks/scripts/hiss-guard.js` | Threat sensor |
| `hooks/scripts/slow-blink-guard.js` | Tradeoff sensor |
| `hooks/scripts/groom.js` | Cleanup sensor |
| `hooks/scripts/belly-rub-trigger.js` | Failure sensor |
| `.claude-cat/config.json` | User preferences (personality, autonomyMode, escalation settings) |
| `.claude-cat/state.json` | Runtime state (v2 schema with autonomy block) |

### Design docs

| Document | Location |
|----------|----------|
| v2 design spec | `docs/superpowers/specs/2026-04-01-claude-cat-v2-design.md` |
| v1 design spec | `docs/superpowers/specs/2026-03-31-claude-cat-design.md` |
| Cat cognition research | `references/cat-cognition.md` |
| Config example | `references/config.example.json` |
| State v2 example | `references/state.v2.example.json` |

### Architecture decisions

1. The cat brain remains a SKILL, not an agent file. It gets agency through the hook system (SessionStart injects context, PreToolUse/PostToolUse hooks feed sensory data). This is cleaner than trying to make an always-on agent fit Claude Code's task-dispatch model.

2. Authority tiers are defined in `autonomy-utils.js` and referenced by metadata in every command, agent, and skill frontmatter. Dynamic escalation adjusts tiers at runtime based on threat level, territory, and prey size.

3. The decision trace is an append-only log in state.json (capped at 50 entries). It is the "why did the cat do that?" audit trail. User-facing explanations derive from this log.

4. Progressive trust resets each session. It does not persist. The cat proves itself fresh each time.

5. v1 backward compatibility is maintained: advisor mode is v1 behavior exactly. No breaking changes to state or config formats.

### Collaboration history

v2 was designed through a collaboration between Claude (Anthropic, Opus) and Codex (OpenAI, GPT-5.4). The design session produced:
- An Approach C spec with 15 sections
- A file-by-file implementation brief
- Consensus on authority tiers, interruption model, and graceful degradation

Built by Ammar Bardesi.
