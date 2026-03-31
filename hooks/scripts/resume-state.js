const {
  readState, writeState, readConfig, initConfig, readLitterbox,
  stateExists, litterboxExists, defaultState
} = require('./state-utils.js');

function resume() {
  initConfig();

  const hasState = stateExists();
  const hasLitterbox = litterboxExists();
  const config = readConfig();
  const personality = config.personality || 'playful';

  if (!hasState && !hasLitterbox) {
    return null;
  }

  let state = readState();
  const litterbox = readLitterbox();

  if (hasState && !hasLitterbox) {
    const phase = state.phase || 'idle';
    const energy = state.energy || 100;
    const msg = formatResume(personality, phase, state.prey?.size, energy,
      'Lost the litterbox notes but remember the state. Proceeding with caution.');
    return msg;
  }

  if (!hasState && hasLitterbox) {
    const hasActiveTreats = litterbox.includes('## Treats') && litterbox.includes('**Goal:**');
    state = defaultState();
    if (hasActiveTreats) {
      state.phase = 'scenting';
      state.phaseHistory = ['idle', 'scenting'];
      state.hunt.active = true;
    }
    writeState(state);
    const msg = formatResume(personality, state.phase, null, state.energy,
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

  return formatResume(personality, state.phase, state.prey?.size, state.energy, null);
}

function formatResume(personality, phase, preySize, energy, note) {
  const prey = preySize ? ` on ${preySize}-sized prey` : '';
  const extra = note ? ` ${note}` : '';

  if (personality === 'minimal') {
    return `Resuming. Phase: ${phase}${prey}. Energy: ${energy}.${extra}`;
  }
  if (personality === 'full-cat') {
    return `*[stretches, yawns]* ...I'm back. Was ${phase}${prey}. Energy at ${energy}. Let's continue.${extra}`;
  }
  return `Resuming session. Currently ${phase}${prey}. Energy: ${energy}/100.${extra}`;
}

const result = resume();
if (result) {
  console.log(result);
}
