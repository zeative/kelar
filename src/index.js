'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const p = require('@clack/prompts');

const {
  buildVars,
  installRules,
  installSkills,
  installWorkflows,
  installAgents,
  installStateFiles,
  installMemoryFiles,
  installRootFiles,
  installTools,
  installPlanDirs,
  getRuleNames,
  getSkillNames,
  getWorkflowNames,
  getAgentNames,
} = require('./templates');

// ─── WSL detection (from GSD) ────────────────────────────────────────────────
if (process.platform === 'win32') {
  let isWSL = false;
  try {
    if (process.env.WSL_DISTRO_NAME) isWSL = true;
    else if (fs.existsSync('/proc/version')) {
      isWSL = fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft');
    }
  } catch { /* not WSL */ }
  if (isWSL) {
    console.error('\n  ⚠ WSL + Windows Node detected. Install Linux Node:\n    curl -fsSL https://fnm.vercel.app/install | bash && fnm install --lts\n');
    process.exit(1);
  }
}

// ─── Agent Definitions ────────────────────────────────────────────────────────
// Paths from GSD research:
//   antigravity local  → .agent/
//   antigravity global → ~/.gemini/antigravity/
const AGENTS = {
  antigravity: {
    label: 'Antigravity', hint: 'Google / Gemini 3',
    localDir: '.agent',
    globalDir: path.join(os.homedir(), '.gemini', 'antigravity'),
    supports: ['rules', 'skills', 'workflows', 'agents'],
    rootFile: 'GEMINI.md',
    toolStyle: 'gemini',
  },
  claude: {
    label: 'Claude Code', hint: 'Anthropic',
    localDir: '.claude',
    globalDir: path.join(os.homedir(), '.claude'),
    supports: ['rules', 'skills', 'workflows', 'agents'],
    rootFile: 'CLAUDE.md',
    toolStyle: 'claude',
  },
  cursor: {
    label: 'Cursor', hint: 'rules only',
    localDir: '.cursor/rules',
    globalDir: path.join(os.homedir(), '.cursor', 'rules'),
    supports: ['rules'],
    rootFile: null,
    toolStyle: 'cursor',
  },
  windsurf: {
    label: 'Windsurf', hint: 'rules only',
    localDir: '.windsurf/rules',
    globalDir: path.join(os.homedir(), '.windsurf', 'rules'),
    supports: ['rules'],
    rootFile: null,
    toolStyle: 'claude',
  },
};

function banner() {
  console.log(`
\x1b[1m  ██╗  ██╗███████╗██╗      █████╗ ██████╗
  ██║ ██╔╝██╔════╝██║     ██╔══██╗██╔══██╗
  █████╔╝ █████╗  ██║     ███████║██████╔╝
  ██╔═██╗ ██╔══╝  ██║     ██╔══██║██╔══██╗
  ██║  ██╗███████╗███████╗██║  ██║██║  ██║
  ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝\x1b[0m
  \x1b[2mKept Efficient, Logical, Atomic, Resilient — v2.0\x1b[0m
`);
}

function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function verify(d, label) {
  if (!fs.existsSync(d) || fs.readdirSync(d).length === 0) throw new Error(`Failed: ${label}`);
}
function verifyFile(f, label) { if (!fs.existsSync(f)) throw new Error(`Failed: ${label}`); }
function cleanupFiles(dir, names) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!names.includes(e.name)) continue;
    const full = path.join(dir, e.name);
    e.isDirectory() ? fs.rmSync(full, { recursive: true }) : fs.unlinkSync(full);
  }
}

const CONFIG_PATH = path.join(os.homedir(), '.kelar', 'config.json');
function loadConfig() {
  try { if (fs.existsSync(CONFIG_PATH)) return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); }
  catch { } return {};
}
function saveConfig(c) { ensureDir(path.dirname(CONFIG_PATH)); fs.writeFileSync(CONFIG_PATH, JSON.stringify(c, null, 2)); }
function checkCancel(v) { if (p.isCancel(v)) { p.cancel('Setup cancelled.'); process.exit(0); } }

async function init() {
  banner();
  p.intro('KELAR Setup — Multi-Agent Edition');

  const prev = loadConfig();

  const agents = await p.multiselect({
    message: 'Which AI agent(s)?',
    options: Object.entries(AGENTS).map(([v, { label, hint }]) => ({ value: v, label, hint })),
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
    message: 'Auto-commit after each task?',
    options: [
      { value: 'auto', label: 'Yes, automatic' },
      { value: 'ask', label: 'Ask each time' },
      { value: 'off', label: 'Manual only' },
    ],
    initialValue: prev.autoCommit || 'auto',
  });
  checkCancel(autoCommit);

  const commitKelar = await p.select({
    message: 'Commit KELAR files to git?',
    options: [
      { value: 'no-state', label: 'Partial (recommended)', hint: 'commit config+knowledge, ignore session state' },
      { value: 'all', label: 'Everything' },
      { value: 'none', label: 'Nothing' },
    ],
    initialValue: prev.commitKelar || 'no-state',
  });
  checkCancel(commitKelar);

  const language = await p.select({
    message: 'Response language?',
    options: [
      { value: 'en', label: 'English' },
      { value: 'id', label: 'Bahasa Indonesia' },
      { value: 'bilingual', label: 'Bilingual (EN primary)' },
    ],
    initialValue: prev.language || 'en',
  });
  checkCancel(language);

  const config = { agents, scope, autoCommit, commitKelar, language, installedAt: new Date().toISOString() };
  saveConfig(config);

  const vars = buildVars(config);
  const projectDir = process.cwd();

  const s = p.spinner();
  s.start('Installing KELAR multi-agent system...');

  try {
    for (const agentKey of agents) {
      const agent = AGENTS[agentKey];
      const agentDir = scope === 'global' ? agent.globalDir : path.join(projectDir, agent.localDir);

      // Rules
      if (agent.supports.includes('rules')) {
        const rulesDir = path.join(agentDir, 'rules');
        cleanupFiles(rulesDir, getRuleNames());
        installRules(rulesDir, vars, agent);
        verify(rulesDir, `${agentKey}/rules`);
      }

      // Skills
      if (agent.supports.includes('skills')) {
        const skillsDir = path.join(agentDir, 'skills');
        cleanupFiles(skillsDir, getSkillNames());
        installSkills(skillsDir, vars, agent);
      }

      // Workflows
      if (agent.supports.includes('workflows')) {
        const workflowsDir = path.join(agentDir, 'workflows');
        cleanupFiles(workflowsDir, getWorkflowNames());
        installWorkflows(workflowsDir, vars, agent);
        verify(workflowsDir, `${agentKey}/workflows`);
      }

      // Agents (sub-AI agents)
      if (agent.supports.includes('agents')) {
        const agentsDir = path.join(agentDir, 'agents');
        cleanupFiles(agentsDir, getAgentNames());
        installAgents(agentsDir, vars, agent);
      }
    }

    const kelarBase = scope === 'global'
      ? path.join(os.homedir(), '.kelar')
      : path.join(projectDir, '.kelar');

    // State files (append-only — never overwrite)
    installStateFiles(path.join(kelarBase, 'state'));
    // Memory structure
    installMemoryFiles(path.join(kelarBase, 'memory'));
    // Tools
    installTools(kelarBase);
    // Plan/research dirs
    installPlanDirs(kelarBase);
    // Scripts dir
    ensureDir(path.join(kelarBase, 'scripts'));

    // Root config files (AGENTS.md, CLAUDE.md, GEMINI.md)
    const rootDir = scope === 'global' ? os.homedir() : projectDir;
    installRootFiles(rootDir, agents, vars);

    // Gitignore
    handleGitignore(commitKelar, projectDir);

    s.stop('Installation complete.');

  } catch (err) {
    s.stop('Installation failed.');
    p.cancel(err.message);
    process.exit(1);
  }

  const agentLabels = agents.map(a => AGENTS[a].label).join(', ');
  p.note([
    `Agents   : ${agentLabels}`,
    `Scope    : ${scope}`,
    `Commits  : ${autoCommit}`,
    `Language : ${language}`,
    ``,
    `Sub-agents: kelar-planner, kelar-executor, kelar-researcher,`,
    `            kelar-plan-checker, kelar-verifier, kelar-debugger,`,
    `            kelar-repair, kelar-ui-designer, kelar-codebase-mapper`,
    ``,
    `Tools    : .kelar/kelar-tools.cjs`,
  ].join('\n'), 'Summary');

  p.outro('Start here → /kelar:map');
}

function handleGitignore(commitKelar, cwd) {
  const gitignorePath = path.join(cwd, '.gitignore');
  if (!fs.existsSync(gitignorePath)) fs.writeFileSync(gitignorePath, '');
  let content = fs.readFileSync(gitignorePath, 'utf8');
  const lines = ['\n# KELAR'];

  if (commitKelar === 'none') {
    if (!content.includes('.kelar')) lines.push('.kelar/');
  } else if (commitKelar === 'no-state') {
    // State = session-specific, ignore it
    if (!content.includes('.kelar/state')) lines.push('.kelar/state/');
    if (!content.includes('.kelar/plans')) lines.push('.kelar/plans/');
    if (!content.includes('.kelar/research')) lines.push('.kelar/research/');
    if (!content.includes('.kelar/scripts')) lines.push('.kelar/scripts/');
    // memory/ = project knowledge → COMMITTED
    // rules/, skills/, workflows/, agents/ → COMMITTED
    // kelar-tools.cjs → COMMITTED
  }
  // 'all' → nothing added

  if (lines.length > 1) fs.writeFileSync(gitignorePath, content + lines.join('\n') + '\n');
}

module.exports = { init };
