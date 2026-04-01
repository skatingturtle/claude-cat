const fs = require('fs');
const path = require('path');

const STATE_DIR = path.join(process.cwd(), '.claude-cat');
const STATE_FILE = path.join(STATE_DIR, 'state.json');
const CONFIG_FILE = path.join(STATE_DIR, 'config.json');
const LITTERBOX_FILE = path.join(STATE_DIR, 'litterbox.md');
const TREATSDRAWER_FILE = path.join(STATE_DIR, 'treatsdrawer.md');

const CURRENT_STATE_VERSION = 2;

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
  const raw = readJSON(STATE_FILE);
  if (!raw) return null;
  return migrateState(raw);
}

function writeState(state) {
  state.lastActivity = new Date().toISOString();
  writeJSON(STATE_FILE, state);
}

function defaultConfig() {
  return {
    personality: 'playful',
    autonomyMode: 'advisor',
    energyThresholds: { nudgeNap: 20 },
    customHissPatterns: [],
    authorityEscalation: {
      raiseScratchInSensitiveAreas: true,
      raiseWritesAtThreat2: true
    },
    memory: {
      treatsdrawerRetrievalLimit: 3
    }
  };
}

function readConfig() {
  const raw = readJSON(CONFIG_FILE);
  if (!raw) return defaultConfig();
  return migrateConfig(raw);
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
    version: CURRENT_STATE_VERSION,
    phase: 'idle',
    phaseHistory: ['idle'],
    energy: 100,
    threat: { level: 0, reason: null, log: [] },
    prey: { size: null, reclassified: false, originalSize: null },
    hunt: { active: false, treatsFile: null, startedAt: null },
    autonomy: {
      mode: 'advisor',
      activeBehavior: null,
      pendingBehavior: null,
      consentRequired: false,
      consentReason: null,
      lastUserDirective: null
    },
    stringChase: { active: false, label: null, startedAt: null },
    refractoryTimers: { catnip: null, zoomies: null },
    nineLives: { total: 9, used: 0, checkpoints: [], preNocturnal: null },
    territory: { currentSession: [] },
    decisionTrace: [],
    lastActivity: new Date().toISOString()
  };
}

// Migrate v1 state to v2
function migrateState(state) {
  if (!state || typeof state !== 'object') return defaultState();

  const version = state.version || 1;

  if (version >= CURRENT_STATE_VERSION) return state;

  // v1 -> v2 migration
  if (version < 2) {
    if (!state.autonomy) {
      const config = readJSON(CONFIG_FILE);
      state.autonomy = {
        mode: (config && config.autonomyMode) || 'advisor',
        activeBehavior: null,
        pendingBehavior: null,
        consentRequired: false,
        consentReason: null,
        lastUserDirective: null
      };
    }
    if (!state.stringChase) {
      state.stringChase = { active: false, label: null, startedAt: null };
    }
    if (!state.decisionTrace) {
      state.decisionTrace = [];
    }
    if (!state.hunt) {
      state.hunt = { active: false, treatsFile: null, startedAt: null };
    }
    state.version = CURRENT_STATE_VERSION;
  }

  return state;
}

// Migrate v1 config to v2
function migrateConfig(config) {
  if (!config || typeof config !== 'object') return defaultConfig();

  const defaults = defaultConfig();

  if (!config.autonomyMode) {
    config.autonomyMode = 'advisor';
  }
  if (!config.authorityEscalation) {
    config.authorityEscalation = defaults.authorityEscalation;
  }
  if (!config.memory) {
    config.memory = defaults.memory;
  }
  if (!config.energyThresholds) {
    config.energyThresholds = defaults.energyThresholds;
  }

  return config;
}

function logThreat(state, level, reason) {
  const previousLevel = state.threat.level;
  state.threat.log.push({
    time: new Date().toISOString(),
    from: previousLevel,
    to: level,
    reason
  });
  state.threat.level = level;
  state.threat.reason = reason;
  return state;
}

function clampEnergy(energy) {
  return Math.max(0, Math.min(100, energy));
}

// Snapshot broken state file before reinitializing
function snapshotBrokenState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(STATE_DIR, `state.broken.${timestamp}.json`);
      fs.copyFileSync(STATE_FILE, backupPath);
      return backupPath;
    }
  } catch {
    // Best effort
  }
  return null;
}

module.exports = {
  STATE_DIR, STATE_FILE, CONFIG_FILE, LITTERBOX_FILE, TREATSDRAWER_FILE,
  CURRENT_STATE_VERSION,
  ensureStateDir, readJSON, writeJSON, readState, writeState,
  readConfig, writeConfig, initConfig, defaultConfig,
  readLitterbox, litterboxExists, stateExists, defaultState,
  migrateState, migrateConfig,
  logThreat, clampEnergy, snapshotBrokenState
};
