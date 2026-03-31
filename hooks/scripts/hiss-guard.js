const {
  readState, writeState, readConfig, stateExists, defaultState, logThreat
} = require('./state-utils.js');

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
    writeState(state);
  }

  const warnings = matches.map(m => `  - ${m.reason}`).join('\n');
  console.log(`[hiss] Threat level ${highest} detected:\n${warnings}`);
}

run();
