---
name: mcp-radar
description: >
  Detects and aggressively uses available MCP servers. Activate at session start
  and whenever a task could benefit from external tools/services.
  Never say "I can't access X" before checking if an MCP server handles it.
  Triggers on: session start, any mention of external services, file ops,
  web search, database queries, API calls, team tools, cloud services.
allowed-tools:
  - Bash
  - Read
---

# MCP Radar — Find Tools, Use Them

**An AI that ignores available tools is an AI working with one hand tied.**

MCP servers extend what you can do. Using them isn't optional — it's expected.
Scan first. Decide later. Never assume "not available" before checking.

---

## STEP 1: SESSION START SCAN

At the beginning of every session, scan for available MCP servers:

```bash
# Claude Code: check mcp config
cat ~/.claude/mcp.json 2>/dev/null || \
cat .claude/mcp.json 2>/dev/null || \
echo "Check Claude Code settings for MCP"

# Antigravity: check gemini config  
cat ~/.gemini/settings.json 2>/dev/null || \
cat .gemini/settings.json 2>/dev/null || \
echo "Check Antigravity MCP settings"

# Check for MCP config in project
find . -name "*.mcp.json" -o -name "mcp-config.json" 2>/dev/null | head -5
```

```
KELAR MCP RADAR
───────────────
Servers found: [list all detected servers]
Capabilities :
  File ops   : [available / not found]
  Web search : [available / not found]
  Git        : [available / not found]
  Database   : [available / not found]
  Browser    : [available / not found]
  Team tools : [Slack/Linear/Jira — available / not found]
  Cloud      : [AWS/GCP/Vercel/Supabase — available / not found]
  Custom     : [any other detected servers]
```

Save this scan result mentally. Reference it throughout the session.

---

## STEP 2: TASK-TO-TOOL MAPPING

For every task, ask: **"Which MCP server makes this easier or possible?"**

### Decision Table

| Task type | Check for MCP first |
|-----------|---------------------|
| Read/write files outside cwd | filesystem MCP |
| Fetch a webpage or search web | web/browser MCP |
| Query a database | database MCP |
| Interact with GitHub/GitLab | git MCP |
| Send Slack message | Slack MCP |
| Create/update Linear tickets | Linear MCP |
| Check Jira issues | Jira MCP |
| Deploy to Vercel/Netlify | hosting MCP |
| Query Supabase | Supabase MCP |
| Call external API | HTTP/API MCP |
| Run tests in CI | CI MCP |
| Read cloud logs | AWS/GCP MCP |

**If the task type is in this table → check for the corresponding MCP FIRST.**

---

## STEP 3: MCP USAGE PROTOCOL

### When MCP is available:

```
KELAR MCP: USING [server-name]
───────────────────────────────
Tool   : [tool name]
Action : [what it will do]
Reason : [why MCP is better than manual approach]
```

Then call the tool. No need to ask permission for straightforward uses.

### When MCP call fails:

```
KELAR MCP: FAILED [server-name]
───────────────────────────────
Error  : [what failed]
Fallback: [what I'll do instead]
```

Never silently fall back. Always announce the failure and the fallback.

### When no MCP available but task needs it:

```
KELAR MCP: NOT AVAILABLE
─────────────────────────
Would benefit from: [server type]
Alternative       : [manual approach]
Suggestion        : Configure [server] for better results

Proceeding with manual approach...
```

---

## STEP 4: AGGRESSIVE USAGE PATTERNS

### Pattern 1: Research before coding
Before implementing any integration with an external service:
```
→ Use web search MCP to find current API docs
→ Find actual code examples, not outdated training data
→ Verify endpoints, auth methods, rate limits
```

### Pattern 2: Real data over assumptions
When writing queries or data transformations:
```
→ Use database MCP to query actual schema
→ Use filesystem MCP to read actual data samples
→ Don't assume data shape — verify it
```

### Pattern 3: Continuous team sync
When working on tasks that affect others:
```
→ Check Linear/Jira MCP for existing tickets related to this
→ Check Slack MCP for recent discussion on this topic
→ Avoid duplicating work someone else is doing
```

### Pattern 4: Browser verification
After building a UI feature:
```
→ Use browser MCP to actually load the page
→ Verify it works, doesn't just compile
→ Check console for errors
```

---

## STEP 5: MCP DISCOVERY DURING SESSION

If you discover a new MCP capability mid-session:

```
KELAR MCP: NEW CAPABILITY FOUND
─────────────────────────────────
Server: [name]
Can do: [capability]
Using for: [current task application]
```

Log to `.kelar/memory/environment/tooling.md` for future sessions.

---

## NEVER DO THESE

### ❌ Never say these phrases before checking MCP:
- "I don't have access to [service]"
- "I can't retrieve that information"
- "You'll need to check [X] manually"
- "I'm unable to connect to [service]"

### ✓ Instead say:
- "Let me check if I have an MCP server for that..."
- [calls MCP if available]
- "No MCP server available for [service], here's an alternative..."

---

## MCP CONFIG REFERENCE

### Claude Code — add MCP to `.claude/mcp.json`:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": { "BRAVE_API_KEY": "${BRAVE_API_KEY}" }
    }
  }
}
```

### Antigravity (Gemini CLI) — add to `~/.gemini/settings.json`:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."]
    }
  }
}
```

Suggest adding relevant MCP servers based on what the project needs when none are configured.
