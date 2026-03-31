const {
  readState, writeState, stateExists, defaultState, logThreat
} = require('./state-utils.js');

const CRITICAL_PATHS = [
  /auth/i, /middleware/i, /proxy\.ts/i, /migration/i,
  /payment/i, /billing/i, /\.env/i, /secret/i, /credential/i
];

function run() {
  let input = '';
  try {
    input = require('fs').readFileSync('/dev/stdin', 'utf8');
  } catch {
    return;
  }

  const toolInput = JSON.parse(input || '{}');
  const filePath = toolInput.file_path || '';
  const content = toolInput.old_string || toolInput.content || '';

  const flags = [];

  const criticalMatch = CRITICAL_PATHS.find(p => p.test(filePath));
  if (criticalMatch) {
    flags.push(`Critical file: ${filePath}`);
  }

  if (content.length > 2000) {
    flags.push(`Large edit: ${content.length} characters`);
  }

  if (flags.length === 0) return;

  let state = stateExists() ? readState() : null;
  if (state && (state.threat?.level || 0) < 1) {
    state = logThreat(state, 1, flags.join('; '));
    writeState(state);
  }

  console.log(`[slow-blink] This touches sensitive ground:\n${flags.map(f => `  - ${f}`).join('\n')}\nConsider /slow-blink before proceeding.`);
}

run();
