const fs = require('fs');
const path = require('path');

const STATE_DIR = path.join(process.cwd(), '.claude-cat');
const STATE_FILE = path.join(STATE_DIR, 'state.json');
const CONFIG_FILE = path.join(STATE_DIR, 'config.json');
const LITTERBOX_FILE = path.join(STATE_DIR, 'litterbox.md');
const TREATSDRAWER_FILE = path.join(STATE_DIR, 'treatsdrawer.md');

function ensureStateDir() {
  if (!fs.existsSync(STATE_DIR)) {
    fs.mkdirSync(STATE_DIR, { recursive: true });
  }
}

function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeJSON(filePath, data) {
  ensureStateDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

function readState() {
  return readJSON(STATE_FILE);
}

function writeState(state) {
  writeJSON(STATE_FILE, state);
}

function defaultConfig() {
  return {
    personality: 'playful',
    customHissPatterns: [],
    energyThresholds: { nudgeNap: 20 }
  };
}

function readConfig() {
  return readJSON(CONFIG_FILE) || defaultConfig();
}

function writeConfig(config) {
  writeJSON(CONFIG_FILE, config);
}

function initConfig() {
  if (!fs.existsSync(CONFIG_FILE)) {
    writeConfig(defaultConfig());
  }
}

function readLitterbox() {
  try {
    return fs.readFileSync(LITTERBOX_FILE, 'utf8');
  } catch {
    return null;
  }
}

function litterboxExists() {
  return fs.existsSync(LITTERBOX_FILE);
}

function stateExists() {
  return fs.existsSync(STATE_FILE);
}

function defaultState() {
  return {
    version: 1,
    phase: 'idle',
    phaseHistory: ['idle'],
    energy: 100,
    threat: { level: 0, reason: null, log: [] },
    prey: { size: null, reclassified: false, originalSize: null },
    refractoryTimers: { catnip: null, zoomies: null },
    nineLives: { total: 9, used: 0, checkpoints: [], preNocturnal: null },
    territory: { currentSession: [] },
    hunt: { active: false, treatsFile: null, startedAt: null },
    lastActivity: new Date().toISOString()
  };
}

function logThreat(state, level, reason) {
  state.threat.level = level;
  state.threat.reason = reason;
  state.threat.log.push({ level, reason, time: new Date().toISOString() });
  return state;
}

function clampEnergy(energy) {
  return Math.max(0, Math.min(100, energy));
}

module.exports = {
  STATE_DIR, STATE_FILE, CONFIG_FILE, LITTERBOX_FILE, TREATSDRAWER_FILE,
  ensureStateDir, readJSON, writeJSON, readState, writeState,
  readConfig, writeConfig, initConfig, defaultConfig,
  readLitterbox, litterboxExists, stateExists, defaultState, logThreat, clampEnergy
};
