const {
  readState, writeState, stateExists, defaultState, readConfig, clampEnergy
} = require('./state-utils.js');
const { getAutonomyMode, logDecision } = require('./autonomy-utils.js');

function run() {
  let input = '';
  try {
    input = require('fs').readFileSync('/dev/stdin', 'utf8');
  } catch {
    return;
  }

  const toolInput = JSON.parse(input || '{}');
  const output = toolInput.stdout || toolInput.stderr || toolInput.output || '';
  const exitCode = toolInput.exit_code;

  if (exitCode === 0 && !hasErrorSignals(output)) return;

  let state = stateExists() ? readState() : defaultState();
  if (!state) state = defaultState();

  if (!state._failureTracker) {
    state._failureTracker = { count: 0, recent: [] };
  }
  state._failureTracker.count++;
  state._failureTracker.recent.push({
    time: new Date().toISOString(),
    snippet: output.slice(0, 200)
  });
  if (state._failureTracker.recent.length > 10) {
    state._failureTracker.recent = state._failureTracker.recent.slice(-10);
  }

  const count = state._failureTracker.count;
  const config = readConfig();
  const personality = config.personality || 'playful';
  const autonomyMode = getAutonomyMode(config);

  // Severity tiers:
  // 1 failure: ignored (noise)
  // 2-3 failures: belly-rub diagnosis overlay (auto/announce-and-act tier)
  // 4+ failures: suggest belly-rub with rollback options (hard-consent-only -- just suggest, don't auto)

  if (count < 2) {
    writeState(state);
    return;
  }

  if (count < 4) {
    // Diagnosis is auto/announce-and-act tier
    if (autonomyMode === 'full-cat' || autonomyMode === 'graduated') {
      state = logDecision(state, {
        sensed: { trigger: 'belly-rub-trigger', failureCount: count, severity: 'moderate' },
        chosenBehavior: 'belly-rub-diagnosis',
        authorityTier: 'auto',
        consentRequested: false,
        outcome: 'fired',
        nextSuggested: count === 3 ? 'belly-rub' : null
      });
    }

    writeState(state);

    if (personality === 'full-cat') {
      console.log(`[belly-rub] *rolls over* Something keeps failing (${count}x). /belly-rub to see what hurts?`);
    } else {
      console.log(`[belly-rub] Repeated failure detected (${count}x). /belly-rub to diagnose?`);
    }
    return;
  }

  // 4+ failures: hard-consent-only for rollback -- just suggest, don't auto-execute
  // Set pendingBehavior so the cat brain knows a belly-rub is warranted
  if (state.autonomy) {
    state.autonomy.pendingBehavior = 'belly-rub';
    state.autonomy.consentRequired = true;
    state.autonomy.consentReason = `Extended failure detected (${count}x). Rollback options require explicit consent.`;
  }

  if (autonomyMode === 'full-cat' || autonomyMode === 'graduated') {
    state = logDecision(state, {
      sensed: { trigger: 'belly-rub-trigger', failureCount: count, severity: 'critical' },
      chosenBehavior: 'belly-rub-rollback',
      authorityTier: 'hard-consent-only',
      consentRequested: true,
      outcome: 'pending-consent',
      nextSuggested: 'belly-rub'
    });
  }

  writeState(state);

  if (personality === 'full-cat') {
    console.log(`[belly-rub] *ears flat, belly exposed* This is a crash loop (${count}x). Please /belly-rub. I need help. Rollback options available with your consent.`);
  } else {
    console.log(`[belly-rub] Crash loop detected (${count}x). Strongly recommend /belly-rub for full diagnosis and rollback options. Rollback requires explicit consent.`);
  }
}

function hasErrorSignals(output) {
  return /error|failed|exception|panic|FAIL|fatal/i.test(output);
}

run();
