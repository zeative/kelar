#!/usr/bin/env node
'use strict';

/**
 * KELAR Tools — Central CLI utility for agents and workflows
 * 
 * Usage: node kelar-tools.cjs <command> [args...]
 * 
 * Commands:
 *   state get <field>              Read a field from STATE.md
 *   state patch <field> <value>    Update a field in STATE.md
 *   state snapshot                 Return compact JSON of key state fields
 *
 *   tasks log <type> <message>     Append a log entry to TASKS.md
 *   tasks active                   Return current active task as JSON
 *   tasks complete <id>            Mark a task step as complete
 *   tasks pause <id> <next_step>   Write PAUSED entry with exact next step
 *
 *   memory search <query>          Search .kelar/memory/ for relevant entries
 *   memory save <category> <title> <content>   Save knowledge entry
 *   memory index                   Rebuild INDEX.md from all memory files
 *
 *   patterns get <category>        Get approved pattern for a category
 *   patterns set <category> <pattern>  Save approved pattern
 *   patterns list                  List all approved patterns
 *
 *   handoff write                  Generate HANDOFF.md from current state
 *   handoff read                   Return HANDOFF.md content as JSON
 *
 *   plan validate <file>           Validate XML plan structure
 *   plan tasks <file>              Extract tasks from XML plan as JSON
 *   plan wave <file> <number>      Extract specific wave as JSON
 *
 *   git status                     Current git status as JSON
 *   git changed                    List changed files since last commit
 *   git commit <msg>               Stage all and commit with message
 *   git checkpoint                 Create a kelar-checkpoint stash
 *
 *   debt add <file> <issue> <priority>  Log tech debt entry
 *   debt list                      List all debt items as JSON
 *
 *   session start <task>           Initialize session tracking
 *   session end                    Finalize session, write diary entry
 *
 *   health                         Check .kelar/ structure is intact
 *   version                        Print kelar-tools version
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ─── Config ───────────────────────────────────────────────────────────────────

const VERSION = '1.0.0';
const KELAR_DIR = findKelarDir();
const STATE_FILE = path.join(KELAR_DIR, 'state', 'STATE.md');
const TASKS_FILE = path.join(KELAR_DIR, 'state', 'TASKS.md');
const PATTERNS_FILE = path.join(KELAR_DIR, 'state', 'PATTERNS.md');
const DEBT_FILE = path.join(KELAR_DIR, 'state', 'DEBT.md');
const DIARY_FILE = path.join(KELAR_DIR, 'state', 'DIARY.md');
const HANDOFF_FILE = path.join(KELAR_DIR, 'state', 'HANDOFF.md');
const MEMORY_DIR = path.join(KELAR_DIR, 'memory');
const MEMORY_INDEX = path.join(MEMORY_DIR, 'INDEX.md');

function findKelarDir() {
  // Look up the directory tree for .kelar/
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    const candidate = path.join(dir, '.kelar');
    if (fs.existsSync(candidate)) return candidate;
    dir = path.dirname(dir);
  }
  // Default to cwd/.kelar (will be created if needed)
  return path.join(process.cwd(), '.kelar');
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function now() {
  return new Date().toISOString().replace('T', ' ').split('.')[0];
}

function nowDate() {
  return new Date().toISOString().split('T')[0];
}

function ensureFile(filePath, defaultContent = '') {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, defaultContent, 'utf8');
  }
}

function readFile(filePath) {
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf8');
}

function appendFile(filePath, content) {
  ensureFile(filePath);
  fs.appendFileSync(filePath, '\n' + content, 'utf8');
}

function out(data) {
  if (typeof data === 'object') {
    process.stdout.write(JSON.stringify(data, null, 2) + '\n');
  } else {
    process.stdout.write(String(data) + '\n');
  }
}

function err(msg) {
  process.stderr.write('ERROR: ' + msg + '\n');
  process.exit(1);
}

// ─── State Operations ─────────────────────────────────────────────────────────

function stateGet(field) {
  const content = readFile(STATE_FILE);
  // Look for "field : value" or "## field\nvalue"
  const inline = new RegExp(`^${field}\\s*:\\s*(.+)$`, 'm');
  const m = content.match(inline);
  if (m) { out(m[1].trim()); return; }
  
  // Section match: ## FieldName\ncontent until next ##
  const section = new RegExp(`^## ${field}\\s*\\n([\\s\\S]*?)(?=^## |$)`, 'm');
  const s = content.match(section);
  if (s) { out(s[1].trim()); return; }
  
  out('');
}

function statePatch(field, value) {
  let content = readFile(STATE_FILE);
  const inline = new RegExp(`^(${field}\\s*:\\s*)(.+)$`, 'm');
  
  if (inline.test(content)) {
    content = content.replace(inline, `$1${value}`);
  } else {
    content += `\n${field}: ${value}`;
  }
  
  fs.writeFileSync(STATE_FILE, content, 'utf8');
  out({ ok: true, field, value });
}

function stateSnapshot() {
  const content = readFile(STATE_FILE);
  const snapshot = {};
  
  // Extract key fields
  const fields = ['Type', 'Stack', 'Working on', 'Progress', 'Last completed'];
  for (const field of fields) {
    const m = content.match(new RegExp(`^${field}\\s*:\\s*(.+)$`, 'm'));
    if (m) snapshot[field.toLowerCase().replace(/ /g, '_')] = m[1].trim();
  }
  
  // Extract current feature
  const featureMatch = content.match(/## Current Feature\s*\n([\s\S]*?)(?=^## |$)/m);
  if (featureMatch) snapshot.current_feature = featureMatch[1].trim().split('\n')[0];
  
  out(snapshot);
}

// ─── Task Operations ──────────────────────────────────────────────────────────

function tasksLog(type, message) {
  const timestamp = now();
  const types = {
    start: `\n## [${timestamp}] TASK STARTED\n${message}`,
    done: `[${timestamp}] ✅ ${message}`,
    pause: `\n## [${timestamp}] PAUSED ⏸\n${message}`,
    note: `[${timestamp}] 📝 ${message}`,
    notice: `[${timestamp}] 🔍 NOTICED: ${message}`,
    knowledge: `[${timestamp}] 📚 KNOWLEDGE: ${message}`,
    error: `[${timestamp}] ❌ ERROR: ${message}`,
    wave: `\n### [${timestamp}] WAVE COMPLETE\n${message}`,
    feature_start: `\n## [${timestamp}] FEATURE STARTED: ${message}`,
    feature_done: `\n## [${timestamp}] FEATURE COMPLETE ✅: ${message}`,
    fix_start: `\n## [${timestamp}] FIX STARTED: ${message}`,
    fix_done: `\n## [${timestamp}] FIX COMPLETE ✅: ${message}`,
  };
  
  const entry = types[type] || `[${timestamp}] ${type.toUpperCase()}: ${message}`;
  appendFile(TASKS_FILE, entry);
  out({ ok: true, type, timestamp });
}

function tasksActive() {
  const content = readFile(TASKS_FILE);
  // Find last STARTED block that's not followed by COMPLETE
  const blocks = content.split(/(?=^## \[)/m).filter(Boolean);
  
  for (let i = blocks.length - 1; i >= 0; i--) {
    const block = blocks[i];
    if (block.includes('TASK STARTED') || block.includes('FEATURE STARTED')) {
      // Check if this task was completed
      const taskName = block.match(/STARTED[^:]*:\s*(.+)/)?.[1]?.trim() || 'unknown';
      const completedLater = blocks.slice(i + 1).some(b => 
        b.includes('COMPLETE') && b.includes(taskName.split(' ').slice(0, 3).join(' '))
      );
      
      if (!completedLater) {
        // Find next step if paused
        const pausedMatch = block.match(/Next step\s*:\s*(.+)/);
        out({
          name: taskName,
          status: block.includes('PAUSED') ? 'paused' : 'active',
          next_step: pausedMatch?.[1]?.trim() || null,
          started_at: block.match(/\[(.+?)\]/)?.[1] || null,
        });
        return;
      }
    }
  }
  
  out({ name: null, status: 'idle', next_step: null });
}

function tasksPause(id, nextStep) {
  const timestamp = now();
  const entry = `\n## [${timestamp}] PAUSED ⏸\nTask    : ${id}\nStopped at: [current position]\nNext step : ${nextStep}\nResume with: /kelar:resume`;
  appendFile(TASKS_FILE, entry);
  out({ ok: true, next_step: nextStep });
}

// ─── Memory Operations ────────────────────────────────────────────────────────

function memorySearch(query) {
  if (!fs.existsSync(MEMORY_DIR)) { out([]); return; }
  
  const results = [];
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  function searchDir(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) { searchDir(fullPath); continue; }
      if (!entry.name.endsWith('.md')) continue;
      
      const content = readFile(fullPath);
      const contentLower = content.toLowerCase();
      
      // Score relevance
      let score = 0;
      for (const word of queryWords) {
        const matches = (contentLower.match(new RegExp(word, 'g')) || []).length;
        score += matches;
      }
      
      if (score > 0) {
        const title = content.match(/^##\s+(.+)/m)?.[1] || entry.name;
        const snippet = content.split('\n').find(l => 
          queryWords.some(w => l.toLowerCase().includes(w))
        ) || '';
        results.push({
          file: fullPath.replace(KELAR_DIR, '.kelar'),
          title,
          score,
          snippet: snippet.trim().substring(0, 120),
        });
      }
    }
  }
  
  searchDir(MEMORY_DIR);
  results.sort((a, b) => b.score - a.score);
  out(results.slice(0, 5));
}

function memorySave(category, title, content) {
  const validCategories = ['domain', 'technical', 'solutions', 'environment'];
  if (!validCategories.includes(category)) {
    err(`Invalid category. Use: ${validCategories.join(', ')}`);
  }
  
  const fileName = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.md';
  const filePath = path.join(MEMORY_DIR, category, fileName);
  
  const entry = `## ${title}\nAdded: ${nowDate()}\n\n${content}\n`;
  
  if (fs.existsSync(filePath)) {
    // Append to existing entry
    fs.appendFileSync(filePath, '\n---\n\n' + entry, 'utf8');
  } else {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, entry, 'utf8');
  }
  
  // Update index
  memoryRebuildIndex();
  
  out({ ok: true, file: filePath.replace(KELAR_DIR, '.kelar'), category, title });
}

function memoryRebuildIndex() {
  if (!fs.existsSync(MEMORY_DIR)) return;
  
  const index = { domain: [], technical: [], solutions: [], environment: [] };
  
  for (const category of Object.keys(index)) {
    const catDir = path.join(MEMORY_DIR, category);
    if (!fs.existsSync(catDir)) continue;
    
    for (const file of fs.readdirSync(catDir)) {
      if (!file.endsWith('.md')) continue;
      const content = readFile(path.join(catDir, file));
      const title = content.match(/^##\s+(.+)/m)?.[1] || file.replace('.md', '');
      const summary = content.split('\n').find(l => l.length > 20 && !l.startsWith('#') && !l.startsWith('Added:')) || '';
      index[category].push({ title, file, summary: summary.trim().substring(0, 80) });
    }
  }
  
  const lines = [
    '# KELAR Knowledge Index',
    `Last updated: ${nowDate()}`,
    '',
    '## Domain (business rules, data model)',
    ...index.domain.map(e => `- **${e.title}** — ${e.summary}`),
    index.domain.length === 0 ? '*(none yet)*' : '',
    '',
    '## Technical (gotchas, undocumented behavior)',
    ...index.technical.map(e => `- **${e.title}** — ${e.summary}`),
    index.technical.length === 0 ? '*(none yet)*' : '',
    '',
    '## Solutions (reusable approaches)',
    ...index.solutions.map(e => `- **${e.title}** — ${e.summary}`),
    index.solutions.length === 0 ? '*(none yet)*' : '',
    '',
    '## Environment (setup, env vars, tooling)',
    ...index.environment.map(e => `- **${e.title}** — ${e.summary}`),
    index.environment.length === 0 ? '*(none yet)*' : '',
  ];
  
  fs.writeFileSync(MEMORY_INDEX, lines.filter(l => l !== undefined).join('\n'), 'utf8');
  out({ ok: true, total: Object.values(index).flat().length });
}

// ─── Pattern Operations ───────────────────────────────────────────────────────

function patternsGet(category) {
  const content = readFile(PATTERNS_FILE);
  const section = new RegExp(`## ${category}[^\n]*\n([\\s\\S]*?)(?=^## |$)`, 'm');
  const m = content.match(section);
  out(m ? { category, pattern: m[1].trim() } : { category, pattern: null });
}

function patternsSet(category, pattern) {
  let content = readFile(PATTERNS_FILE);
  const existing = new RegExp(`## ${category}[^\n]*\n[\\s\\S]*?(?=^## |$)`, 'm');
  const entry = `## ${category} — ${nowDate()}\n${pattern}\n\n`;
  
  if (existing.test(content)) {
    content = content.replace(existing, entry);
  } else {
    content += '\n' + entry;
  }
  
  fs.writeFileSync(PATTERNS_FILE, content, 'utf8');
  out({ ok: true, category });
}

function patternsList() {
  const content = readFile(PATTERNS_FILE);
  const matches = [...content.matchAll(/^## (.+?) —/gm)];
  out(matches.map(m => m[1].trim()));
}

// ─── Handoff Operations ───────────────────────────────────────────────────────

function handoffWrite() {
  const tasksContent = readFile(TASKS_FILE);
  const stateContent = readFile(STATE_FILE);
  
  // Extract last N lines of tasks for context
  const recentTasks = tasksContent.split('\n').slice(-40).join('\n');
  
  // Find last paused or active task
  const lastActivity = tasksContent.match(/## \[(.+?)\] (?:TASK STARTED|PAUSED)[^\n]*\n([^#]+)/g);
  const lastBlock = lastActivity ? lastActivity[lastActivity.length - 1] : '';
  const nextStep = lastBlock.match(/Next step\s*:\s*(.+)/)?.[1] || 'Check TASKS.md for context';
  
  // Extract feature name
  const featureMatch = stateContent.match(/Working on\s*:\s*(.+)/);
  const feature = featureMatch?.[1]?.trim() || 'Unknown';
  
  const handoff = [
    '# KELAR HANDOFF',
    `Generated: ${now()}`,
    '',
    '## Status',
    `Feature   : ${feature}`,
    `Next step : ${nextStep}`,
    '',
    '## Recent Activity (last 40 lines of TASKS.md)',
    '```',
    recentTasks,
    '```',
    '',
    '## How To Resume',
    '1. Run /kelar:resume',
    '2. Review this file + .kelar/state/TASKS.md',
    '3. Confirm: "Continue with [next step]?"',
  ].join('\n');
  
  fs.writeFileSync(HANDOFF_FILE, handoff, 'utf8');
  out({ ok: true, next_step: nextStep, feature });
}

function handoffRead() {
  const content = readFile(HANDOFF_FILE);
  if (!content) { out({ exists: false }); return; }
  
  const nextStep = content.match(/Next step\s*:\s*(.+)/)?.[1]?.trim() || null;
  const feature = content.match(/Feature\s*:\s*(.+)/)?.[1]?.trim() || null;
  const generated = content.match(/Generated:\s*(.+)/)?.[1]?.trim() || null;
  
  out({ exists: true, feature, next_step: nextStep, generated, raw: content });
}

// ─── Plan Operations ──────────────────────────────────────────────────────────

function planValidate(filePath) {
  if (!fs.existsSync(filePath)) { err(`Plan file not found: ${filePath}`); }
  const content = readFile(filePath);
  
  const errors = [];
  const warnings = [];
  
  // Required XML elements
  if (!content.includes('<kelar_plan>')) errors.push('Missing <kelar_plan> root element');
  if (!content.includes('<meta>')) errors.push('Missing <meta> block');
  if (!content.includes('<goal>')) errors.push('Missing <goal> in meta');
  if (!content.includes('<wave')) errors.push('No waves defined');
  
  // Task validation
  const tasks = [...content.matchAll(/<task id="([^"]+)">/g)];
  for (const task of tasks) {
    const id = task[1];
    // Find task content
    const taskStart = content.indexOf(`<task id="${id}">`);
    const taskEnd = content.indexOf('</task>', taskStart);
    const taskContent = content.slice(taskStart, taskEnd);
    
    if (!taskContent.includes('<action>')) warnings.push(`Task ${id}: missing <action>`);
    if (!taskContent.includes('<done>')) warnings.push(`Task ${id}: missing <done> condition`);
    if (!taskContent.includes('<verify>')) warnings.push(`Task ${id}: missing <verify>`);
    if (!taskContent.includes('<file>')) errors.push(`Task ${id}: missing <file>`);
  }
  
  out({
    valid: errors.length === 0,
    task_count: tasks.length,
    errors,
    warnings,
  });
}

function planTasks(filePath) {
  if (!fs.existsSync(filePath)) { err(`Plan file not found: ${filePath}`); }
  const content = readFile(filePath);
  
  const tasks = [];
  const taskMatches = [...content.matchAll(/<task id="([^"]+)">([\s\S]*?)<\/task>/g)];
  
  for (const match of taskMatches) {
    const id = match[1];
    const body = match[2];
    
    const extract = (tag) => {
      const m = body.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim() : null;
    };
    
    const dependsOn = extract('depends_on');
    tasks.push({
      id,
      title: extract('title'),
      file: extract('file'),
      action: extract('action'),
      verify: extract('verify'),
      done: extract('done'),
      depends_on: dependsOn ? dependsOn.split(',').map(s => s.trim()).filter(Boolean) : [],
    });
  }
  
  out(tasks);
}

function planWave(filePath, waveNumber) {
  if (!fs.existsSync(filePath)) { err(`Plan file not found: ${filePath}`); }
  const content = readFile(filePath);
  
  const waveMatch = content.match(
    new RegExp(`<wave number="${waveNumber}"([^>]*)>([\\s\\S]*?)<\\/wave>`)
  );
  
  if (!waveMatch) { out({ wave: null, tasks: [] }); return; }
  
  const attrs = waveMatch[1];
  const waveContent = waveMatch[2];
  const parallel = attrs.includes('parallel="true"');
  const title = attrs.match(/title="([^"]+)"/)?.[1] || '';
  
  const tasks = [];
  const taskMatches = [...waveContent.matchAll(/<task id="([^"]+)">([\s\S]*?)<\/task>/g)];
  for (const match of taskMatches) {
    const body = match[2];
    const extract = (tag) => {
      const m = body.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim() : null;
    };
    tasks.push({ id: match[1], title: extract('title'), file: extract('file'), action: extract('action'), verify: extract('verify'), done: extract('done') });
  }
  
  out({ wave: parseInt(waveNumber), title, parallel, tasks });
}

// ─── Git Operations ───────────────────────────────────────────────────────────

function gitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    const changed = status.trim().split('\n').filter(Boolean).map(l => ({
      status: l.substring(0, 2).trim(),
      file: l.substring(3).trim(),
    }));
    out({ branch, changed_count: changed.length, changed });
  } catch {
    out({ branch: 'unknown', changed_count: 0, changed: [], error: 'not a git repo' });
  }
}

function gitChanged() {
  try {
    const changed = execSync('git diff --name-only HEAD 2>/dev/null || git status --short', { encoding: 'utf8' });
    out(changed.trim().split('\n').filter(Boolean));
  } catch {
    out([]);
  }
}

function gitCommit(message) {
  try {
    execSync('git add -A', { stdio: 'inherit' });
    execSync(`git commit -m ${JSON.stringify(message)}`, { stdio: 'inherit' });
    const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
    out({ ok: true, hash, message });
  } catch (e) {
    out({ ok: false, error: e.message });
  }
}

function gitCheckpoint() {
  const label = `kelar-checkpoint-${nowDate().replace(/-/g, '')}-${Date.now()}`;
  try {
    execSync(`git stash push -m "${label}"`, { stdio: 'inherit' });
    out({ ok: true, label, rollback: `git stash pop` });
  } catch (e) {
    out({ ok: false, error: e.message });
  }
}

// ─── Debt Operations ──────────────────────────────────────────────────────────

function debtAdd(file, issue, priority) {
  const validPriorities = ['HIGH', 'MEDIUM', 'LOW'];
  const p = (priority || 'MEDIUM').toUpperCase();
  if (!validPriorities.includes(p)) err(`Priority must be HIGH, MEDIUM, or LOW`);
  
  const emoji = { HIGH: '🔴', MEDIUM: '🟡', LOW: '🟢' }[p];
  const entry = `| ${nowDate()} | ${file} | ${issue} | ${emoji} ${p} | ? |`;
  
  let content = readFile(DEBT_FILE);
  // Insert before the Resolved section
  const insertPoint = content.indexOf('## Resolved');
  if (insertPoint > -1) {
    content = content.slice(0, insertPoint) + entry + '\n' + content.slice(insertPoint);
  } else {
    content += '\n' + entry;
  }
  
  fs.writeFileSync(DEBT_FILE, content, 'utf8');
  out({ ok: true, file, issue, priority: p });
}

function debtList() {
  const content = readFile(DEBT_FILE);
  const rows = [...content.matchAll(/^\| (\d{4}-\d{2}-\d{2}) \| (.+?) \| (.+?) \| (.+?) \| (.+?) \|$/gm)];
  out(rows.map(r => ({
    date: r[1], file: r[2].trim(), issue: r[3].trim(), priority: r[4].trim(), est: r[5].trim()
  })));
}

// ─── Session Operations ───────────────────────────────────────────────────────

function sessionStart(taskName) {
  tasksLog('start', `Task: ${taskName}`);
  out({ ok: true, started: now(), task: taskName });
}

function sessionEnd() {
  const content = readFile(TASKS_FILE);
  const recentLines = content.split('\n').slice(-20).join('\n');
  
  const diaryEntry = [
    `\n## ${nowDate()} ${now().split(' ')[1]}`,
    `Worked on : ${stateGetSync('Working on') || 'unknown'}`,
    `Activity  :`,
    recentLines.split('\n').filter(l => l.includes('✅')).slice(-5).map(l => `  - ${l.trim()}`).join('\n'),
    `Next      : [see HANDOFF.md]`,
    '',
  ].join('\n');
  
  appendFile(DIARY_FILE, diaryEntry);
  handoffWrite();
  out({ ok: true, diary_updated: true, handoff_updated: true });
}

function stateGetSync(field) {
  const content = readFile(STATE_FILE);
  const m = content.match(new RegExp(`^${field}\\s*:\\s*(.+)$`, 'm'));
  return m ? m[1].trim() : null;
}

// ─── Health Check ─────────────────────────────────────────────────────────────

function health() {
  const required = [
    path.join(KELAR_DIR, 'state', 'STATE.md'),
    path.join(KELAR_DIR, 'state', 'TASKS.md'),
    path.join(KELAR_DIR, 'state', 'PATTERNS.md'),
    path.join(KELAR_DIR, 'memory', 'INDEX.md'),
  ];
  
  const checks = required.map(f => ({
    file: f.replace(KELAR_DIR, '.kelar'),
    exists: fs.existsSync(f),
  }));
  
  const allOk = checks.every(c => c.exists);
  out({ healthy: allOk, kelar_dir: KELAR_DIR, checks });
}

// ─── Router ───────────────────────────────────────────────────────────────────

const [,, cmd, ...args] = process.argv;

switch (cmd) {
  // State
  case 'state':
    if (args[0] === 'get') stateGet(args[1]);
    else if (args[0] === 'patch') statePatch(args[1], args.slice(2).join(' '));
    else if (args[0] === 'snapshot') stateSnapshot();
    else err('Unknown state command');
    break;
    
  // Tasks
  case 'tasks':
    if (args[0] === 'log') tasksLog(args[1], args.slice(2).join(' '));
    else if (args[0] === 'active') tasksActive();
    else if (args[0] === 'complete') tasksLog('done', args.slice(1).join(' '));
    else if (args[0] === 'pause') tasksPause(args[1], args.slice(2).join(' '));
    else err('Unknown tasks command');
    break;
    
  // Memory
  case 'memory':
    if (args[0] === 'search') memorySearch(args.slice(1).join(' '));
    else if (args[0] === 'save') memorySave(args[1], args[2], args.slice(3).join(' '));
    else if (args[0] === 'index') memoryRebuildIndex();
    else err('Unknown memory command');
    break;
    
  // Patterns
  case 'patterns':
    if (args[0] === 'get') patternsGet(args.slice(1).join(' '));
    else if (args[0] === 'set') patternsSet(args[1], args.slice(2).join(' '));
    else if (args[0] === 'list') patternsList();
    else err('Unknown patterns command');
    break;
    
  // Handoff
  case 'handoff':
    if (args[0] === 'write') handoffWrite();
    else if (args[0] === 'read') handoffRead();
    else err('Unknown handoff command');
    break;
    
  // Plan
  case 'plan':
    if (args[0] === 'validate') planValidate(args[1]);
    else if (args[0] === 'tasks') planTasks(args[1]);
    else if (args[0] === 'wave') planWave(args[1], args[2]);
    else err('Unknown plan command');
    break;
    
  // Git
  case 'git':
    if (args[0] === 'status') gitStatus();
    else if (args[0] === 'changed') gitChanged();
    else if (args[0] === 'commit') gitCommit(args.slice(1).join(' '));
    else if (args[0] === 'checkpoint') gitCheckpoint();
    else err('Unknown git command');
    break;
    
  // Debt
  case 'debt':
    if (args[0] === 'add') debtAdd(args[1], args[2], args[3]);
    else if (args[0] === 'list') debtList();
    else err('Unknown debt command');
    break;
    
  // Session
  case 'session':
    if (args[0] === 'start') sessionStart(args.slice(1).join(' '));
    else if (args[0] === 'end') sessionEnd();
    else err('Unknown session command');
    break;
    
  case 'health': health(); break;
  case 'version': out(VERSION); break;
  
  default:
    err(`Unknown command: ${cmd}\nRun with no args to see usage.`);
}
