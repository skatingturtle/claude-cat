const { readConfig, readState, writeState } = require('./state-utils.js');

// Authority tier definitions
const AUTHORITY_TIERS = {
  auto: { level: 0, label: 'auto', consentRequired: false },
  'announce-and-act': { level: 1, label: 'announce-and-act', consentRequired: false },
  'confirm-first': { level: 2, label: 'confirm-first', consentRequired: true },
  'hard-consent-only': { level: 3, label: 'hard-consent-only', consentRequired: true }
};

// Baseline authority for each behavior
const BEHAVIOR_AUTHORITY = {
  stalk: 'auto',
  meow: 'auto',
  purr: 'auto',
  groom: 'auto',
  hiss: 'auto',
  'slow-blink': 'auto',
  treats: 'announce-and-act',
  knead: 'announce-and-act',
  scratch: 'announce-and-act',
  pounce: 'confirm-first',
  zoomies: 'confirm-first',
  catnip: 'confirm-first',
  '3am': 'hard-consent-only',
  'belly-rub-diagnosis': 'auto',
  'belly-rub-rollback': 'hard-consent-only',
  nap: 'announce-and-act'
};

// Dynamic escalation: adjust tier based on context
function resolveAuthority(behavior, state, config) {
  let baseTier = BEHAVIOR_AUTHORITY[behavior] || 'confirm-first';
  const escalation = config.authorityEscalation || {};
  const threatLevel = state.threat?.level || 0;
  const territory = assessTerritory(state);
  const preySize = state.prey?.size || null;

  // Rule: threat level 2+ raises any write-capable action by one tier
  if (threatLevel >= 2 && isWriteCapable(behavior) && escalation.raiseWritesAtThreat2 !== false) {
    baseTier = raiseTier(baseTier);
  }

  // Rule: unfamiliar territory + bird-or-larger prey raises scratch to confirm-first
  if (behavior === 'scratch' && territory === 'unfamiliar' && isBirdOrLarger(preySize)) {
    if (escalation.raiseScratchInSensitiveAreas !== false) {
      baseTier = raiseTier(baseTier);
    }
  }

  const tierDef = AUTHORITY_TIERS[baseTier];
  return {
    tier: baseTier,
    level: tierDef.level,
    consentRequired: tierDef.consentRequired,
    reason: buildEscalationReason(behavior, baseTier, BEHAVIOR_AUTHORITY[behavior], threatLevel, territory, preySize)
  };
}

function raiseTier(tier) {
  const order = ['auto', 'announce-and-act', 'confirm-first', 'hard-consent-only'];
  const idx = order.indexOf(tier);
  if (idx < 0 || idx >= order.length - 1) return tier;
  return order[idx + 1];
}

function isWriteCapable(behavior) {
  return ['pounce', 'scratch', 'knead', 'zoomies', 'catnip', '3am', 'belly-rub-rollback'].includes(behavior);
}

function isBirdOrLarger(preySize) {
  return ['bird', 'squirrel', 'red-dot'].includes(preySize);
}

function assessTerritory(state) {
  // Simple heuristic: if currentSession has fewer than 3 files in territory, treat as unfamiliar
  const sessionFiles = state.territory?.currentSession || [];
  if (sessionFiles.length === 0) return 'unfamiliar';
  if (sessionFiles.length < 3) return 'known';
  return 'familiar';
}

function buildEscalationReason(behavior, resolvedTier, baseTier, threatLevel, territory, preySize) {
  if (resolvedTier === baseTier) return null;
  const reasons = [];
  if (threatLevel >= 2) reasons.push(`threat level ${threatLevel}`);
  if (territory === 'unfamiliar') reasons.push('unfamiliar territory');
  if (isBirdOrLarger(preySize)) reasons.push(`${preySize}-sized prey`);
  return reasons.join(', ') || null;
}

// Progressive trust: hybrid model
// Session confidence resets each time, but persistent signals from treatsdrawer
// (territory familiarity, prior hunt patterns) accelerate trust building.
function progressiveTrust(state, treatsdrawerFamiliarity) {
  const sessionFiles = state.territory?.currentSession || [];
  const traceCount = (state.decisionTrace || []).length;
  const huntActive = state.hunt?.active || false;
  const hasPersistentFamiliarity = treatsdrawerFamiliarity === true;

  // Persistent familiarity from treatsdrawer accelerates trust
  // (e.g., cat recognizes territory from prior hunts)
  const effectiveTraceCount = hasPersistentFamiliarity ? traceCount + 3 : traceCount;

  // Early session without persistent context: conservative
  if (effectiveTraceCount < 3) return 'conservative';
  // Mid session with active hunt: moderate
  if (huntActive && effectiveTraceCount < 10) return 'moderate';
  // Extended session with familiar territory: confident
  if (sessionFiles.length >= 5 && effectiveTraceCount >= 10) return 'confident';
  return 'moderate';
}

// Decision trace: log every autonomous decision
function logDecision(state, entry) {
  if (!state.decisionTrace) state.decisionTrace = [];

  const traceEntry = {
    time: new Date().toISOString(),
    sensed: entry.sensed || {},
    chosenBehavior: entry.chosenBehavior || 'unknown',
    authorityTier: entry.authorityTier || 'unknown',
    consentRequested: entry.consentRequested || false,
    outcome: entry.outcome || 'pending',
    nextSuggested: entry.nextSuggested || null
  };

  state.decisionTrace.push(traceEntry);

  // Keep last 50 entries
  if (state.decisionTrace.length > 50) {
    state.decisionTrace = state.decisionTrace.slice(-50);
  }

  return state;
}

// Autonomy mode check
function getAutonomyMode(config) {
  return config.autonomyMode || 'advisor';
}

function isFullCat(config) {
  return getAutonomyMode(config) === 'full-cat';
}

function isGraduated(config) {
  return getAutonomyMode(config) === 'graduated';
}

function isAdvisor(config) {
  return getAutonomyMode(config) === 'advisor';
}

// Override detection from user messages
const OVERRIDE_PATTERNS = [
  /\b(stop|hold|wait|pause)\b/i,
  /\b(just review|review only|only explain|don't edit|no code changes|no changes)\b/i,
  /\b(read.only|explain.only)\b/i
];

function detectOverride(message) {
  for (const pattern of OVERRIDE_PATTERNS) {
    if (pattern.test(message)) return true;
  }
  return false;
}

module.exports = {
  AUTHORITY_TIERS,
  BEHAVIOR_AUTHORITY,
  resolveAuthority,
  raiseTier,
  isWriteCapable,
  isBirdOrLarger,
  assessTerritory,
  progressiveTrust,
  logDecision,
  getAutonomyMode,
  isFullCat,
  isGraduated,
  isAdvisor,
  detectOverride,
  OVERRIDE_PATTERNS
};
