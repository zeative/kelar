'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');
const p    = require('@clack/prompts');

const {
  buildVars,
  installRules,
  installSkills,
  installWorkflows,
  installStateFiles,
  getSkillNames,
  getWorkflowNames,
  getRuleNames,
} = require('./templates');

// ─── Agent config ─────────────────────────────────────────────────────────────

const AGENTS = {
  antigravity: {
    label: 'Antigravity',
    hint: 'Google',
    local:  '.agent',
    global: path.join(os.homedir(), '.agent'),
    supports: ['rules', 'skills', 'workflows'],
  },
  claude: {
    label: 'Claude Code',
    hint: 'Anthropic',
    local:  '.claude',
    global: path.join(os.homedir(), '.claude'),
    supports: ['rules', 'skills', 'workflows'],
  },
  cursor: {
    label: 'Cursor',
    hint: 'rules only',
    local:  '.cursor/rules',
    global: path.join(os.homedir(), '.cursor', 'rules'),
    supports: ['rules'],
  },
  windsurf: {
    label: 'Windsurf',
    hint: 'rules only',
    local:  '.windsurf/rules',
    global: path.join(os.homedir(), '.windsurf', 'rules'),
    supports: ['rules'],
  },
};

// ─── Banner ───────────────────────────────────────────────────────────────────

function banner() {
  console.log(`
\x1b[1m  ██╗  ██╗███████╗██╗      █████╗ ██████╗
  ██║ ██╔╝██╔════╝██║     ██╔══██╗██╔══██╗
  █████╔╝ █████╗  ██║     ███████║██████╔╝
  ██╔═██╗ ██╔══╝  ██║     ██╔══██║██╔══██╗
  ██║  ██╗███████╗███████╗██║  ██║██║  ██║
  ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝\x1b[0m

  \x1b[2mKept Efficient, Logical, Atomic, Resilient\x1b[0m
  \x1b[2m"You don't vibe code. You KELAR it."\x1b[0m
  \x1b[2m"Lo nggak asal vibe coding. Lo KELAR-in."\x1b[0m
`);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function verify(dirPath, label) {
  if (!fs.existsSync(dirPath) || fs.readdirSync(dirPath).length === 0) {
    throw new Error(`Failed to install ${label}`);
  }
}

function verifyFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Failed to install ${label}`);
  }
}

// Remove only KELAR-managed files — user files in same folder are safe
function cleanupKelarFiles(dirPath, names) {
  if (!fs.existsSync(dirPath)) return;
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (names.includes(entry.name)) {
      const full = path.join(dirPath, entry.name);
      entry.isDirectory() ? fs.rmSync(full, { recursive: true }) : fs.unlinkSync(full);
    }
  }
}

// ─── User config ──────────────────────────────────────────────────────────────

const CONFIG_PATH = path.join(os.homedir(), '.kelar', 'config.json');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {}
  return {};
}

function saveConfig(cfg) {
  ensureDir(path.dirname(CONFIG_PATH));
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2), 'utf8');
}

function checkCancel(val) {
  if (p.isCancel(val)) { p.cancel('Setup cancelled.'); process.exit(0); }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function init() {
  banner();
  p.intro('Initial Setup');

  const prev = loadConfig();

  const agents = await p.multiselect({
    message: 'Which AI agent(s) are you using?',
    options: Object.entries(AGENTS).map(([value, { label, hint }]) => ({ value, label, hint })),
    required: true,
  });
  checkCancel(agents);

  const scope = await p.select({
    message: 'Install scope?',
    options: [
      { value: 'local',  label: 'Local',  hint: 'this project only' },
      { value: 'global', label: 'Global', hint: 'all projects' },
    ],
    initialValue: prev.scope || 'local',
  });
  checkCancel(scope);

  const autoCommit = await p.select({
    message: 'Auto-commit after each micro-task?',
    options: [
      { value: 'auto', label: 'Yes', hint: 'commit automatically after every task' },
      { value: 'ask',  label: 'Ask', hint: 'prompt before each commit' },
      { value: 'off',  label: 'No',  hint: 'manual commits only' },
    ],
    initialValue: prev.autoCommit || 'auto',
  });
  checkCancel(autoCommit);

  const commitKelar = await p.select({
    message: 'Commit agent files to git?',
    options: [
      { value: 'no-state', label: 'Partial', hint: 'commit rules/skills/workflows, ignore .kelar/state/ (recommended)' },
      { value: 'all',      label: 'All',     hint: 'commit everything including session state' },
      { value: 'none',     label: 'None',    hint: 'ignore all KELAR files' },
    ],
    initialValue: prev.commitKelar || 'no-state',
  });
  checkCancel(commitKelar);

  const language = await p.select({
    message: 'Response language?',
    options: [
      { value: 'en',        label: 'English' },
      { value: 'id',        label: 'Bahasa Indonesia' },
      { value: 'bilingual', label: 'Bilingual', hint: 'EN primary' },
    ],
    initialValue: prev.language || 'en',
  });
  checkCancel(language);

  const config = { agents, scope, autoCommit, commitKelar, language, installedAt: new Date().toISOString() };
  saveConfig(config);

  // Build dynamic vars (only COMMIT_BEHAVIOR for now — easy to extend later)
  const vars = buildVars(config);

  const s = p.spinner();
  s.start('Installing...');

  try {
    for (const agentKey of agents) {
      const agent    = AGENTS[agentKey];
      const agentDir = scope === 'global'
        ? agent.global
        : path.join(process.cwd(), agent.local);

      if (agent.supports.includes('rules')) {
        const rulesDir = path.join(agentDir, 'rules');
        cleanupKelarFiles(rulesDir, getRuleNames());
        installRules(rulesDir, vars);
        verify(rulesDir, `${agentKey}/rules`);
      }

      if (agent.supports.includes('skills')) {
        const skillsDir = path.join(agentDir, 'skills');
        cleanupKelarFiles(skillsDir, getSkillNames());
        installSkills(skillsDir, vars);
        // Verify each skill individually
        for (const skill of getSkillNames()) {
          verifyFile(path.join(skillsDir, skill, 'SKILL.md'), `${agentKey}/skills/${skill}`);
        }
      }

      if (agent.supports.includes('workflows')) {
        const workflowsDir = path.join(agentDir, 'workflows');
        cleanupKelarFiles(workflowsDir, getWorkflowNames());
        installWorkflows(workflowsDir, vars);
        verify(workflowsDir, `${agentKey}/workflows`);
      }
    }

    // .kelar/state/ — ONLY state and scripts, never agent files
    const kelarBase = scope === 'global'
      ? path.join(os.homedir(), '.kelar')
      : path.join(process.cwd(), '.kelar');

    installStateFiles(path.join(kelarBase, 'state'));
    ensureDir(path.join(kelarBase, 'scripts'));

    handleGitignore(commitKelar, process.cwd(), agents, scope);

    s.stop('Done.');

  } catch (err) {
    s.stop('Installation failed.');
    p.cancel(err.message);
    process.exit(1);
  }

  // ── Summary ────────────────────────────────────────────────────────────────

  const agentLabels = agents.map(a => AGENTS[a].label).join(', ');
  const commitNote  =
    commitKelar === 'all'      ? 'all files committed'
    : commitKelar === 'no-state' ? 'rules/skills committed, state ignored'
    : 'all KELAR files ignored';

  p.note(
    [
      `Agents   ${agentLabels}`,
      `Scope    ${scope}`,
      `Commits  ${autoCommit}`,
      `Git      ${commitNote}`,
      `Language ${language}`,
      `Config   ~/.kelar/config.json`,
    ].join('\n'),
    'Summary'
  );

  p.outro('Start here → /kelar:map');
}

// ─── .gitignore ───────────────────────────────────────────────────────────────

function handleGitignore(commitKelar, cwd, agents = [], scope = 'local') {
  const gitignorePath = path.join(cwd, '.gitignore');
  if (!fs.existsSync(gitignorePath)) fs.writeFileSync(gitignorePath, '');

  let content = fs.readFileSync(gitignorePath, 'utf8');

  if (commitKelar === 'none') {
    const lines = ['\n# KELAR'];
    if (!content.includes('.kelar')) lines.push('.kelar/');
    for (const agentKey of agents) {
      const agentLocal = AGENTS[agentKey].local;
      if (!content.includes(agentLocal)) lines.push(`${agentLocal}/`);
    }
    if (lines.length > 1) {
      fs.writeFileSync(gitignorePath, content + lines.join('\n') + '\n');
    }
  } else if (commitKelar === 'no-state') {
    const lines = ['\n# KELAR — session state'];
    if (!content.includes('.kelar/state'))   lines.push('.kelar/state/');
    if (!content.includes('.kelar/scripts')) lines.push('.kelar/scripts/');
    if (lines.length > 1) {
      fs.writeFileSync(gitignorePath, content + lines.join('\n') + '\n');
    }
  }
  // 'all' → nothing added to .gitignore
}

module.exports = { init };
