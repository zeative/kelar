'use strict';

const fs = require('fs');
const path = require('path');

const KELAR_SRC = path.join(__dirname, '..', '.kelar');
const TEMPLATES_SRC = path.join(__dirname, '..', 'templates');

// ─── Tool name mappings ───────────────────────────────────────────────────────
const GEMINI_TOOLS = {
  Read: 'read_file', Write: 'write_file', Edit: 'replace',
  Bash: 'run_shell_command', Glob: 'glob', Grep: 'search_file_content',
  WebSearch: 'google_web_search', WebFetch: 'web_fetch',
  AskUserQuestion: 'ask_user', Task: 'run_agent', Write: 'write_file',
};

// ─── Content processing ───────────────────────────────────────────────────────
function injectVars(content, vars) {
  let out = content;
  for (const [k, v] of Object.entries(vars)) out = out.split(`{{${k}}}`).join(v);
  return out;
}

function convertToolsForGemini(content) {
  return content.replace(/^([ \t]*-[ \t]+)(\w+)$/gm, (m, prefix, tool) => {
    const mapped = GEMINI_TOOLS[tool];
    return mapped ? `${prefix}${mapped}` : m;
  });
}

function convertPathsForAgent(content, agent) {
  if (!agent || agent.localDir === '.claude') return content;
  return content.replace(/\.claude\//g, `${agent.localDir}/`);
}

function processContent(raw, vars, agent = null) {
  let out = injectVars(raw, vars);
  out = convertPathsForAgent(out, agent);
  if (agent?.toolStyle === 'gemini') out = convertToolsForGemini(out);
  return out;
}

// ─── Var building ─────────────────────────────────────────────────────────────
function buildVars(config) {
  const commit =
    config.autoCommit === 'auto' ? 'Auto-commit: `node .kelar/kelar-tools.cjs git commit "feat(kelar): [task]"`'
    : config.autoCommit === 'ask' ? 'Ask user before committing. Use: `node .kelar/kelar-tools.cjs git commit "feat(kelar): [task]"`'
    : 'Do not auto-commit. User commits manually.';

  const lang =
    config.language === 'id' ? 'Respond in Bahasa Indonesia.'
    : config.language === 'bilingual' ? 'Respond in English, Indonesian translations for key concepts.'
    : 'Respond in English.';

  return { COMMIT_BEHAVIOR: commit, LANGUAGE: lang };
}

// ─── Install functions ────────────────────────────────────────────────────────
function installRules(destDir, vars, agent = null) {
  const src = path.join(KELAR_SRC, 'rules');
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    if (f.endsWith('.md')) {
      const out = processContent(fs.readFileSync(path.join(src, f), 'utf8'), vars, agent);
      fs.writeFileSync(path.join(destDir, f), out);
    }
  }
}

function installSkills(destDir, vars, agent = null) {
  const src = path.join(KELAR_SRC, 'skills');
  if (!fs.existsSync(src)) return;
  for (const skill of fs.readdirSync(src)) {
    const md = path.join(src, skill, 'SKILL.md');
    if (fs.existsSync(md)) {
      const out = processContent(fs.readFileSync(md, 'utf8'), vars, agent);
      const destDir2 = path.join(destDir, skill);
      fs.mkdirSync(destDir2, { recursive: true });
      fs.writeFileSync(path.join(destDir2, 'SKILL.md'), out);
    }
  }
}

function installWorkflows(destDir, vars, agent = null) {
  const src = path.join(KELAR_SRC, 'workflows');
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    if (f.endsWith('.md')) {
      const out = processContent(fs.readFileSync(path.join(src, f), 'utf8'), vars, agent);
      fs.writeFileSync(path.join(destDir, f), out);
    }
  }
}

function installAgents(destDir, vars, agent = null) {
  const src = path.join(KELAR_SRC, 'agents');
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(destDir, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    if (f.endsWith('.md')) {
      let content = fs.readFileSync(path.join(src, f), 'utf8');
      content = injectVars(content, vars);
      content = convertPathsForAgent(content, agent);
      // Antigravity: also convert frontmatter tool names + strip color field
      if (agent?.toolStyle === 'gemini') {
        content = convertAgentForGemini(content);
      }
      fs.writeFileSync(path.join(destDir, f), content);
    }
  }
}

function convertAgentForGemini(content) {
  const lines = content.split('\n');
  const result = [];
  let inFm = false, fmCount = 0;

  for (const line of lines) {
    if (line.trim() === '---') {
      fmCount++;
      if (fmCount <= 2) inFm = fmCount === 1;
      result.push(line);
      continue;
    }
    if (!inFm) { result.push(line); continue; }
    if (/^color:/.test(line.trim())) continue; // strip
    if (/^skills:/.test(line.trim())) continue; // strip
    if (/^tools:/.test(line.trim())) {
      const val = line.split(':')[1]?.trim() || '';
      if (val) {
        const mapped = val.split(',').map(t => GEMINI_TOOLS[t.trim()] || t.trim().toLowerCase()).filter(Boolean).join(', ');
        result.push(`tools: ${mapped}`);
      }
      continue;
    }
    result.push(line);
  }
  return result.join('\n');
}

function installStateFiles(stateDir) {
  const date = new Date().toISOString().split('T')[0];
  const src = path.join(KELAR_SRC, 'state');
  fs.mkdirSync(stateDir, { recursive: true });
  if (!fs.existsSync(src)) return;
  for (const f of fs.readdirSync(src)) {
    if (f.endsWith('.md')) {
      const dest = path.join(stateDir, f);
      if (!fs.existsSync(dest)) { // Never overwrite state
        const out = injectVars(fs.readFileSync(path.join(src, f), 'utf8'), { DATE: date });
        fs.writeFileSync(dest, out);
      }
    }
  }
}

function installMemoryFiles(memoryDir) {
  const date = new Date().toISOString().split('T')[0];
  for (const sub of ['domain', 'technical', 'solutions', 'environment']) {
    fs.mkdirSync(path.join(memoryDir, sub), { recursive: true });
  }
  const index = path.join(memoryDir, 'INDEX.md');
  if (!fs.existsSync(index)) {
    fs.writeFileSync(index, `# KELAR Knowledge Index\nLast updated: ${date}\n\n## Domain\n*(none yet)*\n\n## Technical\n*(none yet)*\n\n## Solutions\n*(none yet)*\n\n## Environment\n*(none yet)*\n`);
  }
}

function installTools(kelarBase) {
  // Copy kelar-tools.cjs to .kelar/ root
  const src = path.join(KELAR_SRC, 'kelar-tools.cjs');
  if (!fs.existsSync(src)) return;
  const dest = path.join(kelarBase, 'kelar-tools.cjs');
  fs.copyFileSync(src, dest);
  // Make executable
  try { require('child_process').execSync(`chmod +x ${dest}`); } catch { /* ok on windows */ }
}

function installPlanDirs(kelarBase) {
  for (const dir of ['plans', 'research']) {
    const d = path.join(kelarBase, dir);
    fs.mkdirSync(d, { recursive: true });
    // Plans are session-state, add a README
    const readme = path.join(d, 'README.md');
    if (!fs.existsSync(readme)) {
      fs.writeFileSync(readme, `# .kelar/${dir}/\n\nAuto-generated by KELAR agents. Not committed to git.\n`);
    }
  }
}

function installRootFiles(projectDir, selectedAgents, vars) {
  if (!fs.existsSync(TEMPLATES_SRC)) return;
  // Always write AGENTS.md
  const agentsMd = path.join(TEMPLATES_SRC, 'AGENTS.md');
  if (fs.existsSync(agentsMd)) {
    fs.writeFileSync(path.join(projectDir, 'AGENTS.md'), injectVars(fs.readFileSync(agentsMd, 'utf8'), vars));
  }
  // Agent-specific files
  const map = { claude: 'CLAUDE.md', antigravity: 'GEMINI.md' };
  for (const key of selectedAgents) {
    const fname = map[key];
    if (!fname) continue;
    const src = path.join(TEMPLATES_SRC, fname);
    if (fs.existsSync(src)) {
      fs.writeFileSync(path.join(projectDir, fname), injectVars(fs.readFileSync(src, 'utf8'), vars));
    }
  }
}

// ─── Name getters ─────────────────────────────────────────────────────────────
function getRuleNames() {
  const d = path.join(KELAR_SRC, 'rules');
  return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.md')) : [];
}
function getSkillNames() {
  const d = path.join(KELAR_SRC, 'skills');
  return fs.existsSync(d) ? fs.readdirSync(d).filter(n => fs.statSync(path.join(d, n)).isDirectory()) : [];
}
function getWorkflowNames() {
  const d = path.join(KELAR_SRC, 'workflows');
  return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.md')) : [];
}
function getAgentNames() {
  const d = path.join(KELAR_SRC, 'agents');
  return fs.existsSync(d) ? fs.readdirSync(d).filter(f => f.endsWith('.md')) : [];
}

module.exports = {
  buildVars, installRules, installSkills, installWorkflows, installAgents,
  installStateFiles, installMemoryFiles, installTools, installPlanDirs, installRootFiles,
  getRuleNames, getSkillNames, getWorkflowNames, getAgentNames,
};
