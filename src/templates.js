'use strict';

const fs   = require('fs');
const path = require('path');

// Source directories inside the package
const AGENT_SRC      = path.join(__dirname, '..', '.agent');
const STATE_TMPL_SRC = path.join(__dirname, '..', '.kelar-state');

// ─── Placeholder injection ────────────────────────────────────────────────────

function injectVars(content, vars) {
  let out = content;
  for (const [key, val] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(val);
  }
  return out;
}

function copyWithVars(srcPath, destPath, vars) {
  const raw = fs.readFileSync(srcPath, 'utf8');
  const out = Object.keys(vars).length ? injectVars(raw, vars) : raw;
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, out, 'utf8');
}

// ─── Build dynamic vars from config ──────────────────────────────────────────

function buildVars(config) {
  const commitNote =
    config.autoCommit === 'auto' ? 'Auto-commit after each micro-task: git add [files] && git commit -m "feat(kelar): [task description]"'
    : config.autoCommit === 'ask' ? 'Ask user before committing each micro-task.'
    : 'Do not auto-commit. User commits manually.';

  return { COMMIT_BEHAVIOR: commitNote };
}

// ─── Install functions ────────────────────────────────────────────────────────

function installRules(destDir, vars) {
  const src = path.join(AGENT_SRC, 'rules');
  for (const file of fs.readdirSync(src)) {
    if (file.endsWith('.md')) {
      copyWithVars(path.join(src, file), path.join(destDir, file), vars);
    }
  }
}

function installSkills(destDir, vars) {
  const src = path.join(AGENT_SRC, 'skills');
  for (const skill of fs.readdirSync(src)) {
    const skillMd = path.join(src, skill, 'SKILL.md');
    if (fs.existsSync(skillMd)) {
      copyWithVars(skillMd, path.join(destDir, skill, 'SKILL.md'), vars);
    }
  }
}

function installWorkflows(destDir, vars) {
  const src = path.join(AGENT_SRC, 'workflows');
  for (const file of fs.readdirSync(src)) {
    if (file.endsWith('.md')) {
      copyWithVars(path.join(src, file), path.join(destDir, file), vars);
    }
  }
}

function installStateFiles(stateDir) {
  const date = new Date().toISOString().split('T')[0];
  const vars = { DATE: date };
  for (const file of fs.readdirSync(STATE_TMPL_SRC)) {
    if (file.endsWith('.md')) {
      const dest = path.join(stateDir, file);
      // Never overwrite existing state — preserves user's session history
      if (!fs.existsSync(dest)) {
        copyWithVars(path.join(STATE_TMPL_SRC, file), dest, vars);
      }
    }
  }
}

// List skill dir names for cleanup (used by index.js)
function getSkillNames() {
  return fs.readdirSync(path.join(AGENT_SRC, 'skills'));
}

// List workflow file names for cleanup
function getWorkflowNames() {
  return fs.readdirSync(path.join(AGENT_SRC, 'workflows'))
    .filter(f => f.endsWith('.md'));
}

// List rule file names for cleanup
function getRuleNames() {
  return fs.readdirSync(path.join(AGENT_SRC, 'rules'))
    .filter(f => f.endsWith('.md'));
}

module.exports = {
  buildVars,
  installRules,
  installSkills,
  installWorkflows,
  installStateFiles,
  getSkillNames,
  getWorkflowNames,
  getRuleNames,
};
