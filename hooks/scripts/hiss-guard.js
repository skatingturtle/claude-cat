const {
  readState, writeState, readConfig, stateExists, defaultState, logThreat
} = require('./state-utils.js');
const {
  getAutonomyMode, logDecision, resolveAuthority
} = require('./autonomy-utils.js');

const DEFAULT_PATTERNS = [
  { pattern: /--force|--hard|push\s+-f/i, reason: 'force push or hard reset detected', level: 2 },
  { pattern: /rm\s+-rf/i, reason: 'recursive force delete detected', level: 2 },
  { pattern: /DROP\s+TABLE|DROP\s+DATABASE/i, reason: 'destructive SQL detected', level: 2 },
  { pattern: /--no-verify/i, reason: 'hook bypass detected', level: 2 },
  { pattern: /PRIVATE.KEY|API.KEY|SECRET|PASSWORD|TOKEN/i, reason: 'potential credential in code', level: 2 },
  { pattern: /delete.*migration|remove.*migration/i, reason: 'migration deletion detected', level: 2 },
  { pattern: /\.skip\(|\.only\(/i, reason: 'test skip/only detected', level: 1 },
];

function run() {
  let input = '';
  try {
    input = require('fs').readFileSync('/dev/stdin', 'utf8');
  } catch {
    return;
  }

  const toolInput = JSON.parse(input || '{}');
  const content = toolInput.command || toolInput.content || toolInput.file_path || '';

  const config = readConfig();
  const autonomyMode = getAutonomyMode(config);
  const customPatterns = (config.customHissPatterns || []).map(p => ({
    pattern: new RegExp(p, 'i'), reason: `custom pattern matched: ${p}`, level: 2
  }));

  const allPatterns = [...DEFAULT_PATTERNS, ...customPatterns];
  const matches = allPatterns.filter(p => p.pattern.test(content));

  if (matches.length === 0) return;

  let state = stateExists() ? readState() : defaultState();
  if (!state) state = defaultState();

  const highest = Math.max(...matches.map(m => m.level));
  const reasons = matches.map(m => m.reason).join('; ');

  if (highest > (state.threat?.level || 0)) {
    state = logThreat(state, highest, reasons);
  }

  // Hiss is authority-tier: auto in all modes -- it always fires autonomously
  // In full-cat or graduated mode, log to decisionTrace for transparency
  if (autonomyMode === 'full-cat' || autonomyMode === 'graduated') {
    const authority = resolveAuthority('hiss', state, config);
    state = logDecision(state, {
      sensed: { trigger: 'hiss-guard', threatLevel: highest, reasons },
      chosenBehavior: 'hiss',
      authorityTier: authority.tier,
      consentRequested: false,
      outcome: 'fired',
      nextSuggested: highest >= 2 ? 'slow-blink' : null
    });
  }

  writeState(state);

  const warnings = matches.map(m => `  - ${m.reason}`).join('\n');
  const escalation = highest >= 2
    ? '\n  Escalation: threat level 2+ -- consider /slow-blink before proceeding.'
    : '';
  console.log(`[hiss] Threat level ${highest} detected:\n${warnings}${escalation}`);
}

run();
