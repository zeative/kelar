'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');
const prompts = require('prompts');
const k    = require('kleur');

// ─── Agent install paths ─────────────────────────────────────────────────────

const AGENTS = {
  antigravity: {
    label: 'Antigravity',
    local:  '.agent',
    global: path.join(os.homedir(), '.agent'),
    supports: ['rules', 'skills', 'workflows'],
  },
  claude: {
    label: 'Claude Code',
    local:  '.claude',
    global: path.join(os.homedir(), '.claude'),
    supports: ['rules', 'skills', 'workflows'],
  },
  cursor: {
    label: 'Cursor',
    local:  '.cursor/rules',
    global: path.join(os.homedir(), '.cursor', 'rules'),
    supports: ['rules'],
  },
  windsurf: {
    label: 'Windsurf',
    local:  '.windsurf/rules',
    global: path.join(os.homedir(), '.windsurf', 'rules'),
    supports: ['rules'],
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function banner() {
  console.log(k.bold().white(`
  ██╗  ██╗███████╗██╗      █████╗ ██████╗
  ██║ ██╔╝██╔════╝██║     ██╔══██╗██╔══██╗
  █████╔╝ █████╗  ██║     ███████║██████╔╝
  ██╔═██╗ ██╔══╝  ██║     ██╔══██║██╔══██╗
  ██║  ██╗███████╗███████╗██║  ██║██║  ██║
  ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝
  `));
  console.log(k.dim('  Kept Efficient, Logical, Atomic, Resilient'));
  console.log(k.dim('  "You don\'t vibe code. You KELAR it."\n'));
}

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function writeFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function step(msg) {
  console.log(k.cyan('  →'), msg);
}

function done(msg) {
  console.log(k.green('  ✓'), msg);
}

function warn(msg) {
  console.log(k.yellow('  ⚠'), msg);
}

function separator() {
  console.log(k.dim('  ──────────────────────────────────────────'));
}

// ─── Config file ─────────────────────────────────────────────────────────────

const CONFIG_PATH = path.join(os.homedir(), '.kelar', 'config.json');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    }
  } catch {}
  return {};
}

function saveConfig(config) {
  ensureDir(path.dirname(CONFIG_PATH));
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
}

// ─── File generators ─────────────────────────────────────────────────────────

const { getRules, getSkills, getWorkflows, getStateFiles } = require('./templates');

// ─── Main installer ───────────────────────────────────────────────────────────

async function init() {
  banner();

  const prevConfig = loadConfig();

  console.log(k.bold('  Setup\n'));

  // 1. Which agent?
  const { agents } = await prompts({
    type: 'multiselect',
    name: 'agents',
    message: 'Which AI agent(s) are you using?',
    choices: Object.entries(AGENTS).map(([value, { label }]) => ({ title: label, value })),
    min: 1,
    hint: '- Space to select. Return to submit',
  });

  if (!agents || agents.length === 0) {
    console.log(k.red('\n  No agents selected. Exiting.\n'));
    process.exit(0);
  }

  // 2. Local or global?
  const { scope } = await prompts({
    type: 'select',
    name: 'scope',
    message: 'Install scope?',
    choices: [
      { title: 'Local  — this project only  (.agent/ or .claude/ in current dir)', value: 'local' },
      { title: 'Global — all projects       (~/.agent/ or ~/.claude/)', value: 'global' },
    ],
  });

  // 3. Auto-commit?
  const { autoCommit } = await prompts({
    type: 'select',
    name: 'autoCommit',
    message: 'AI auto-commit after each micro-task?',
    choices: [
      { title: 'Yes — commit automatically after every task', value: 'auto' },
      { title: 'Ask  — ask me before each commit',            value: 'ask'  },
      { title: 'No  — I\'ll commit manually',                 value: 'off'  },
    ],
    initial: prevConfig.autoCommit === 'ask' ? 1 : prevConfig.autoCommit === 'off' ? 2 : 0,
  });

  // 4. Include .kelar/ in git commits?
  const { commitKelar } = await prompts({
    type: 'select',
    name: 'commitKelar',
    message: 'Include .kelar/ folder in git commits?',
    hint: '.kelar/state/ contains AI session logs, tasks, and patterns',
    choices: [
      { title: 'Yes — commit everything  (share with team)',                value: 'all'       },
      { title: 'State only — commit rules/skills, ignore session state',    value: 'no-state'  },
      { title: 'No  — add .kelar/ to .gitignore entirely',                  value: 'none'      },
    ],
  });

  // 5. Preferred language?
  const { language } = await prompts({
    type: 'select',
    name: 'language',
    message: 'Response language preference?',
    choices: [
      { title: 'English', value: 'en' },
      { title: 'Bahasa Indonesia', value: 'id' },
      { title: 'Bilingual (EN primary)', value: 'bilingual' },
    ],
    initial: prevConfig.language === 'id' ? 1 : prevConfig.language === 'bilingual' ? 2 : 0,
  });

  // ── Save user config ──────────────────────────────────────────────────────

  const config = { agents, scope, autoCommit, commitKelar, language, installedAt: new Date().toISOString() };
  saveConfig(config);

  // ── Install ───────────────────────────────────────────────────────────────

  console.log('');
  separator();
  console.log(k.bold('\n  Installing KELAR...\n'));

  for (const agentKey of agents) {
    const agent = AGENTS[agentKey];
    const agentDir = scope === 'global' ? agent.global : path.join(process.cwd(), agent.local);

    console.log(k.bold(`  ${agent.label}`));

    // Rules (all agents support rules)
    if (agent.supports.includes('rules')) {
      const rulesDir = path.join(agentDir, 'rules');
      ensureDir(rulesDir);
      const rules = getRules(config);
      for (const [filename, content] of Object.entries(rules)) {
        writeFile(path.join(rulesDir, filename), content);
      }
      done(`Rules installed → ${path.relative(process.cwd(), rulesDir) || rulesDir}`);
    }

    // Skills (Antigravity + Claude Code only)
    if (agent.supports.includes('skills')) {
      const skillsDir = path.join(agentDir, 'skills');
      const skills = getSkills(config);
      for (const [skillName, content] of Object.entries(skills)) {
        const skillPath = path.join(skillsDir, skillName, 'SKILL.md');
        writeFile(skillPath, content);
      }
      done(`Skills installed → ${path.relative(process.cwd(), skillsDir) || skillsDir}`);
    }

    // Workflows (Antigravity + Claude Code only)
    if (agent.supports.includes('workflows')) {
      const workflowsDir = path.join(agentDir, 'workflows');
      const workflows = getWorkflows(config);
      for (const [filename, content] of Object.entries(workflows)) {
        writeFile(path.join(workflowsDir, filename), content);
      }
      done(`Workflows installed → ${path.relative(process.cwd(), workflowsDir) || workflowsDir}`);
    }

    console.log('');
  }

  // ── .kelar/state/ ─────────────────────────────────────────────────────────

  const kelarDir = scope === 'global'
    ? path.join(os.homedir(), '.kelar')
    : path.join(process.cwd(), '.kelar');

  const stateDir = path.join(kelarDir, 'state');
  const stateFiles = getStateFiles(config);
  for (const [filename, content] of Object.entries(stateFiles)) {
    const fp = path.join(stateDir, filename);
    if (!fs.existsSync(fp)) {  // never overwrite existing state
      writeFile(fp, content);
    }
  }
  done(`State files ready → ${path.relative(process.cwd(), stateDir) || stateDir}`);

  // scripts dir
  ensureDir(path.join(kelarDir, 'scripts'));
  done(`Scripts dir ready → ${path.relative(process.cwd(), path.join(kelarDir, 'scripts')) || path.join(kelarDir, 'scripts')}`);

  // ── .gitignore handling ───────────────────────────────────────────────────

  handleGitignore(commitKelar, process.cwd());

  // ── Done ──────────────────────────────────────────────────────────────────

  separator();
  console.log(k.bold().green('\n  KELAR is ready.\n'));
  console.log(k.dim('  Config saved to: ~/.kelar/config.json'));
  console.log('');
  console.log('  Next step:');
  console.log(k.cyan('    /kelar:map') + k.dim('   — run this once to let AI understand your codebase'));
  console.log('');
  console.log(k.dim('  Then:'));
  console.log(k.cyan('    /kelar:feature') + k.dim(' [desc]  — build something'));
  console.log(k.cyan('    /kelar:fix') + k.dim(' [error]     — fix something'));
  console.log(k.cyan('    /kelar:quick') + k.dim(' [desc]   — small task'));
  console.log('');
}

// ─── .gitignore ──────────────────────────────────────────────────────────────

function handleGitignore(commitKelar, cwd) {
  const gitignorePath = path.join(cwd, '.gitignore');
  let content = fs.existsSync(gitignorePath) ? fs.readFileSync(gitignorePath, 'utf8') : '';

  const alreadyHasKelar = content.includes('.kelar');

  if (commitKelar === 'none') {
    if (!alreadyHasKelar) {
      content += '\n# KELAR — AI session files\n.kelar/\n';
      fs.writeFileSync(gitignorePath, content);
      done('.kelar/ added to .gitignore');
    }
  } else if (commitKelar === 'no-state') {
    if (!content.includes('.kelar/state')) {
      content += '\n# KELAR — ignore session state, commit rules/skills\n.kelar/state/\n.kelar/scripts/\n';
      fs.writeFileSync(gitignorePath, content);
      done('.kelar/state/ added to .gitignore (rules/skills will be committed)');
    }
  } else {
    // 'all' — commit everything, make sure .kelar/ is NOT in gitignore
    if (alreadyHasKelar) {
      warn('.kelar/ found in .gitignore — remove it manually if you want to commit KELAR files');
    } else {
      done('.kelar/ will be committed (shared with team)');
    }
  }
}

module.exports = { init };
