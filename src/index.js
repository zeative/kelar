'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const p = require('@clack/prompts');

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

const AGENTS = {
  antigravity: {
    label: 'Antigravity',
    hint: 'Google',
    local: '.agent',
    global: path.join(os.homedir(), '.agent'),
    supports: ['rules', 'skills', 'workflows'],
  },
  claude: {
    label: 'Claude Code',
    hint: 'Anthropic',
    local: '.claude',
    global: path.join(os.homedir(), '.claude'),
    supports: ['rules', 'skills', 'workflows'],
  },
  cursor: {
    label: 'Cursor',
    hint: 'rules only',
    local: '.cursor/rules',
    global: path.join(os.homedir(), '.cursor', 'rules'),
    supports: ['rules'],
  },
  windsurf: {
    label: 'Windsurf',
    hint: 'rules only',
    local: '.windsurf/rules',
    global: path.join(os.homedir(), '.windsurf', 'rules'),
    supports: ['rules'],
  },
};

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

const CONFIG_PATH = path.join(os.homedir(), '.kelar', 'config.json');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }
  } catch { }
  return {};
}

function saveConfig(config) {
  ensureDir(path.dirname(CONFIG_PATH));
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}

function checkCancel(value) {
  if (p.isCancel(value)) {
    p.cancel('Setup cancelled.');
    process.exit(0);
  }
}

async function init() {
  banner();

  p.intro('Initial Setup');

  const prev = loadConfig();

  const agents = await p.multiselect({
    message: 'Which AI agent(s) are you using?',
    options: Object.entries(AGENTS).map(([value, { label, hint }]) => ({
      value,
      label,
      hint,
    })),
    required: true,
  });
  checkCancel(agents);

  const scope = await p.select({
    message: 'Install scope?',
    options: [
      { value: 'local', label: 'Local', hint: 'this project only' },
      { value: 'global', label: 'Global', hint: 'all projects' },
    ],
    initialValue: prev.scope || 'local',
  });
  checkCancel(scope);

  const autoCommit = await p.select({
    message: 'Auto-commit after each micro-task?',
    options: [
      { value: 'auto', label: 'Yes', hint: 'commit automatically after every task' },
      { value: 'ask', label: 'Ask', hint: 'prompt before each commit' },
      { value: 'off', label: 'No', hint: 'manual commits only' },
    ],
    initialValue: prev.autoCommit || 'auto',
  });
  checkCancel(autoCommit);

  const commitKelar = await p.select({
    message: 'Include .kelar/ in git commits?',
    options: [
      { value: 'no-state', label: 'Partial', hint: 'rules/skills committed, state ignored (recommended)' },
      { value: 'all', label: 'All', hint: 'commit everything — share with team' },
      { value: 'none', label: 'None', hint: 'add .kelar/ to .gitignore entirely' },
    ],
    initialValue: prev.commitKelar || 'no-state',
  });
  checkCancel(commitKelar);

  const language = await p.select({
    message: 'Response language?',
    options: [
      { value: 'en', label: 'English' },
      { value: 'id', label: 'Bahasa Indonesia' },
      { value: 'bilingual', label: 'Bilingual', hint: 'EN primary' },
    ],
    initialValue: prev.language || 'en',
  });
  checkCancel(language);

  const config = {
    agents,
    scope,
    autoCommit,
    commitKelar,
    language,
    installedAt: new Date().toISOString(),
  };
  saveConfig(config);

  const { getRules, getSkills, getWorkflows, getStateFiles } = require('./templates');

  const s = p.spinner();
  s.start('Installing...');

  try {
    for (const agentKey of agents) {
      const agent = AGENTS[agentKey];
      const agentDir = scope === 'global'
        ? agent.global
        : path.join(process.cwd(), agent.local);

      if (agent.supports.includes('rules')) {
        for (const [filename, content] of Object.entries(getRules(config))) {
          writeFile(path.join(agentDir, 'rules', filename), content);
        }
      }

      if (agent.supports.includes('skills')) {
        for (const [skillName, content] of Object.entries(getSkills(config))) {
          writeFile(path.join(agentDir, 'skills', skillName, 'SKILL.md'), content);
        }
      }

      if (agent.supports.includes('workflows')) {
        for (const [filename, content] of Object.entries(getWorkflows(config))) {
          writeFile(path.join(agentDir, 'workflows', filename), content);
        }
      }
    }

    const kelarBase = scope === 'global'
      ? path.join(os.homedir(), '.kelar')
      : path.join(process.cwd(), '.kelar');

    const stateDir = path.join(kelarBase, 'state');
    for (const [filename, content] of Object.entries(getStateFiles(config))) {
      const fp = path.join(stateDir, filename);
      if (!fs.existsSync(fp)) writeFile(fp, content);
    }

    ensureDir(path.join(kelarBase, 'scripts'));
    handleGitignore(commitKelar, process.cwd());

    s.stop('Done.');

  } catch (err) {
    s.stop('Installation failed.');
    p.cancel(err.message);
    process.exit(1);
  }

  const agentLabels = agents.map(a => AGENTS[a].label).join(', ');
  const commitNote = commitKelar === 'all' ? 'all files committed'
    : commitKelar === 'no-state' ? 'rules/skills committed, state ignored'
      : '.kelar/ added to .gitignore';

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

function handleGitignore(commitKelar, cwd) {
  const gitignorePath = path.join(cwd, '.gitignore');
  if (!fs.existsSync(gitignorePath)) return;

  let content = fs.readFileSync(gitignorePath, 'utf8');

  if (commitKelar === 'none' && !content.includes('.kelar')) {
    content += '\n# KELAR\n.kelar/\n';
    fs.writeFileSync(gitignorePath, content);
  } else if (commitKelar === 'no-state' && !content.includes('.kelar/state')) {
    content += '\n# KELAR — session state\n.kelar/state/\n.kelar/scripts/\n';
    fs.writeFileSync(gitignorePath, content);
  }
}

module.exports = { init };