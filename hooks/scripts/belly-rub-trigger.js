const {
  readState, writeState, stateExists, defaultState, readConfig, clampEnergy
} = require('./state-utils.js');

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
  writeState(state);

  const count = state._failureTracker.count;
  const config = readConfig();
  const personality = config.personality || 'playful';

  if (count < 2) return;

  if (count < 4) {
    if (personality === 'full-cat') {
      console.log(`[belly-rub] *rolls over* Something keeps failing (${count}x). /belly-rub to see what hurts?`);
    } else {
      console.log(`[belly-rub] Repeated failure detected (${count}x). /belly-rub to diagnose?`);
    }
    return;
  }

  if (personality === 'full-cat') {
    console.log(`[belly-rub] *ears flat, belly exposed* This is a crash loop (${count}x). Please /belly-rub. I need help.`);
  } else {
    console.log(`[belly-rub] Crash loop detected (${count}x). Strongly recommend /belly-rub for full diagnosis and rollback options.`);
  }
}

function hasErrorSignals(output) {
  return /error|failed|exception|panic|FAIL|fatal/i.test(output);
}

run();
