const {
  readState, writeState, readConfig, stateExists, defaultState, logThreat
} = require('./state-utils.js');
const {
  getAutonomyMode, logDecision, resolveAuthority, progressiveTrust
} = require('./autonomy-utils.js');

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

  const config = readConfig();
  const autonomyMode = getAutonomyMode(config);

  let state = stateExists() ? readState() : null;
  const trustLevel = state ? progressiveTrust(state) : 'conservative';

  const flags = [];

  const criticalMatch = CRITICAL_PATHS.find(p => p.test(filePath));
  if (criticalMatch) {
    flags.push(`Critical file: ${filePath}`);
  }

  // Progressive trust: in conservative mode, lower the large-edit threshold
  const largeEditThreshold = trustLevel === 'conservative' ? 1000 : 2000;
  if (content.length > largeEditThreshold) {
    flags.push(`Large edit: ${content.length} characters (threshold: ${largeEditThreshold} at ${trustLevel} trust)`);
  }

  // Conservative trust: also flag any file not yet in territory
  if (trustLevel === 'conservative' && state) {
    const knownFiles = state.territory?.currentSession || [];
    if (filePath && !knownFiles.some(f => filePath.includes(f))) {
      flags.push(`Unfamiliar file in conservative trust: ${filePath}`);
    }
  }

  if (flags.length === 0) return;

  if (!state) state = defaultState();

  if ((state.threat?.level || 0) < 1) {
    state = logThreat(state, 1, flags.join('; '));
  }

  // Slow-blink is auto-tier: fires autonomously in all modes
  // In full-cat mode, log to decisionTrace and fire without prompting
  // In other modes, surface the tradeoff and suggest /slow-blink
  if (autonomyMode === 'full-cat' || autonomyMode === 'graduated') {
    const authority = resolveAuthority('slow-blink', state, config);
    state = logDecision(state, {
      sensed: { trigger: 'slow-blink-guard', flags, trustLevel },
      chosenBehavior: 'slow-blink',
      authorityTier: authority.tier,
      consentRequested: false,
      outcome: 'fired',
      nextSuggested: null
    });
  }

  writeState(state);

  // Present alternatives, not just a warning -- the tradeoff-surfacing role
  const alternatives = flags.length > 0
    ? '\n  Alternatives: proceed with /slow-blink review, reduce edit scope, or confirm intent.'
    : '';
  console.log(`[slow-blink] This touches sensitive ground:\n${flags.map(f => `  - ${f}`).join('\n')}\nConsider /slow-blink before proceeding.${alternatives}`);
}

run();
