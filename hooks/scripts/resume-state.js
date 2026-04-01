const {
  readState, writeState, readConfig, initConfig, readLitterbox,
  stateExists, litterboxExists, defaultState
} = require('./state-utils.js');
const { getAutonomyMode } = require('./autonomy-utils.js');

function resume() {
  initConfig();

  const hasState = stateExists();
  const hasLitterbox = litterboxExists();
  const config = readConfig();
  const personality = config.personality || 'playful';
  const autonomyMode = getAutonomyMode(config);

  if (!hasState && !hasLitterbox) {
    return null;
  }

  let state = readState(); // migrateState is called internally by readState
  const litterbox = readLitterbox();

  if (hasState && !hasLitterbox) {
    const phase = state.phase || 'idle';
    const energy = state.energy || 100;
    const pending = state.autonomy?.pendingBehavior;
    const pendingNote = pending ? ` Pending behavior: ${pending}.` : '';
    const msg = formatResume(personality, autonomyMode, phase, state.prey?.size, energy,
      `Lost the litterbox notes but remember the state. Proceeding with caution.${pendingNote}`);
    return msg;
  }

  if (!hasState && hasLitterbox) {
    const hasActiveTreats = litterbox.includes('## Treats') && litterbox.includes('**Goal:**');
    state = defaultState();
    state.autonomy.mode = autonomyMode;
    if (hasActiveTreats) {
      state.phase = 'scenting';
      state.phaseHistory = ['idle', 'scenting'];
      state.hunt.active = true;
    }
    writeState(state);
    const msg = formatResume(personality, autonomyMode, state.phase, null, state.energy,
      'Found litterbox but lost state. Reconstructed.');
    return msg;
  }

  if (state.phase === 'nocturnal') {
    state.phase = 'recovering';
    state.phaseHistory.push('recovering');
    writeState(state);
  }
  if (state.phase === 'dreaming') {
    state.phase = 'idle';
    state.phaseHistory = ['idle'];
    state.hunt.active = false;
    writeState(state);
  }

  // Sync autonomy mode from config into state
  if (state.autonomy) {
    state.autonomy.mode = autonomyMode;
    writeState(state);
  }

  const pending = state.autonomy?.pendingBehavior;
  const pendingNote = pending ? ` Pending behavior: ${pending}.` : '';
  const extra = pendingNote || null;

  return formatResume(personality, autonomyMode, state.phase, state.prey?.size, state.energy, extra);
}

function formatResume(personality, autonomyMode, phase, preySize, energy, note) {
  const prey = preySize ? ` on ${preySize}-sized prey` : '';
  const extra = note ? ` ${note}` : '';
  const modeTag = `[${autonomyMode}]`;

  if (personality === 'minimal') {
    return `Resuming ${modeTag}. Phase: ${phase}${prey}. Energy: ${energy}.${extra}`;
  }
  if (personality === 'full-cat') {
    return `*[stretches, yawns]* ...I'm back ${modeTag}. Was ${phase}${prey}. Energy at ${energy}. Let's continue.${extra}`;
  }
  return `Resuming session ${modeTag}. Currently ${phase}${prey}. Energy: ${energy}/100.${extra}`;
}

const result = resume();
if (result) {
  console.log(result);
}
