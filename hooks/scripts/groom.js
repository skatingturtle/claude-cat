const { readConfig } = require('./state-utils.js');

function run() {
  let input = '';
  try {
    input = require('fs').readFileSync('/dev/stdin', 'utf8');
  } catch {
    return;
  }

  const toolInput = JSON.parse(input || '{}');
  const content = toolInput.new_string || toolInput.content || '';
  if (!content) return;

  const issues = [];

  const lines = content.split('\n');
  const trailingWS = lines.filter((l, i) => /\s+$/.test(l) && l.trim().length > 0);
  if (trailingWS.length > 0) {
    issues.push(`${trailingWS.length} line(s) with trailing whitespace`);
  }

  const consoleLogs = (content.match(/console\.log\(/g) || []).length;
  if (consoleLogs > 0) {
    issues.push(`${consoleLogs} console.log() call(s) -- intentional?`);
  }

  const todos = (content.match(/\b(TODO|FIXME|HACK|XXX)\b/g) || []);
  if (todos.length > 0) {
    issues.push(`${todos.length} TODO/FIXME marker(s)`);
  }

  if (issues.length === 0) return;

  const config = readConfig();
  const personality = config.personality || 'playful';

  if (personality === 'minimal') {
    console.log(`[groom] ${issues.join('. ')}.`);
  } else if (personality === 'full-cat') {
    console.log(`[groom] *licks paw* Spotted some fur out of place: ${issues.join('. ')}.`);
  } else {
    console.log(`[groom] Quick cleanup notes: ${issues.join('. ')}.`);
  }
}

run();
