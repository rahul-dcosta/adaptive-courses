# Claude Code Workflow Guide

**Based on tips from the Claude Code team (Boris Cherny @bcherny)**

This document establishes power-user workflows for working with Claude Code on Adaptive Courses.

---

## 1. Parallel Sessions with Git Worktrees

**Why:** Run 3-5 Claude sessions at once, each working on different tasks.

### Setup Worktrees
```bash
# Create worktrees for parallel work
git worktree add .claude/worktrees/feature-auth origin/dev
git worktree add .claude/worktrees/bug-fixes origin/dev
git worktree add .claude/worktrees/experiments origin/dev

# Quick aliases (add to ~/.zshrc or ~/.bashrc)
alias za='cd .claude/worktrees/feature-auth && claude'
alias zb='cd .claude/worktrees/bug-fixes && claude'
alias zc='cd .claude/worktrees/experiments && claude'
```

### Use Cases
- **Worktree A:** Main feature development
- **Worktree B:** Bug fixes / quick patches
- **Worktree C:** Research / exploration / analysis

Each worktree has its own Claude context - no stepping on each other.

---

## 2. Plan Mode for Complex Tasks

**Why:** Pour energy into planning so Claude can 1-shot the implementation.

### Workflow
1. Start with: `"Plan the implementation of [feature]"`
2. Claude enters plan mode, explores codebase
3. Review the plan, ask questions
4. Once satisfied: Claude implements in one go

### Pro Tips
- **Two-Claude review:** Have one Claude write the plan, spin up a second to review it "as a staff engineer"
- **When things go sideways:** "Knowing everything you know now, scrap this and implement the elegant solution"
- **Before handing off:** Write detailed specs, reduce ambiguity

### Example
```
> Plan the implementation of Stripe checkout for course purchases

Claude explores:
- Current payment flow
- Stripe integration points
- Database schema needs
- API routes required
- UI components needed

You review, approve, Claude executes.
```

---

## 3. CLAUDE.md Investment

**Why:** Claude learns from CLAUDE.md. Keep it updated, reduce repeated mistakes.

### Rules
1. After every bug fix: "Update CLAUDE.md so this doesn't happen again"
2. After every architecture decision: Document the "why"
3. Ruthlessly edit over time - keep what's useful, cut what's not

### Our CLAUDE.md Structure
```
apps/web/CLAUDE.md
├── Quick Start (commands, URLs)
├── Latest Updates (what changed recently)
├── Product Vision (what we are/aren't)
├── Architecture (system diagrams)
├── Tech Stack (versions, tools)
├── API Reference (endpoints)
├── Security (current state)
└── Roadmap (phases)
```

### Memory Check
Run `/memory` to see token usage:
```
Memory files
├── ~/.claude/CLAUDE.md: 76 tokens
└── CLAUDE.md: 4k tokens
```

---

## 4. Custom Skills & Commands

**Why:** Automate repeated tasks, reuse across projects.

### Skills to Build
| Skill | Purpose |
|-------|---------|
| `/deploy` | Build, test, push to production |
| `/techdebt` | Find and kill duplicated code |
| `/review` | Review current changes as senior engineer |
| `/test` | Run tests, report failures, suggest fixes |
| `/db` | Query Supabase, analyze data |

### Creating a Skill
```bash
# Skills live in .claude/skills/
mkdir -p .claude/skills
```

Example `/deploy` skill:
```markdown
# .claude/skills/deploy.md
Run these steps in order:
1. Run `npm run build` and fix any errors
2. Run `npm run lint` and fix any errors
3. Run tests if they exist
4. Stage all changes, create commit with good message
5. Push to current branch
6. If on dev, ask if I want to merge to main
```

---

## 5. Bug Fixing Flow

**Why:** Zero context switching. Just point Claude at the problem.

### Workflows
1. **From error logs:** "Fix this error: [paste error]"
2. **From Slack:** "Fix this bug thread: [paste thread]"
3. **From CI:** "Go fix the failing CI tests"
4. **From logs:** "Point at these docker logs and troubleshoot"

### Example
```
> fix this https://github.com/rahul-dcosta/adaptive-courses/issues/42

Claude:
1. Fetches the issue
2. Reads relevant code
3. Implements fix
4. Tests it
5. Creates PR
```

---

## 6. Prompting Power-Ups

**Why:** Better prompts = better output.

### Techniques

**Challenge Claude:**
```
"Grill me on these changes and don't make a PR until I pass your test"
```

**Demand elegance:**
```
"Knowing everything you know now, scrap this and implement the elegant solution"
```

**Diff behavior:**
```
"Prove to me this works - diff behavior between main and this branch"
```

**Be specific:**
```
"Write detailed specs. The more specific you are, the better the output."
```

---

## 7. Subagents for Parallel Work

**Why:** Keep main context clean, throw compute at problems.

### Usage
```
> use 5 subagents to explore the codebase

Claude spawns:
├── Explore entry points and startup
├── Explore React components structure
├── Explore tools implementation
├── Explore state management
└── Explore testing infrastructure
```

### When to Use Subagents
- Codebase exploration
- Running multiple searches in parallel
- Offloading research while you continue main work
- Complex multi-file refactors

### Syntax
```
"Use subagents to [task]"
"Run this in parallel with 3 agents"
"Offload this research to a subagent"
```

---

## 8. Environment Setup

### Terminal
- **Recommended:** Ghostty (synchronized rendering, 24-bit color, proper unicode)
- **Alternative:** iTerm2, Warp

### Status Line
Run `/statusline` to show context usage and git branch in your prompt.

### Voice Dictation
Hit `fn fn` (double tap function key on Mac) for voice input. You speak 3x faster than you type - prompts get more detailed.

### Terminal Tabs
Name your tabs per task:
- Tab 1: Main Claude session
- Tab 2: Dev server (`npm run dev`)
- Tab 3: Worktree A
- Tab 4: Worktree B

---

## 9. Learning Mode

### Enable Explanatory Output
```
/config
→ Set output style to "Explanatory" or "Learning"
```

Claude will explain the "why" behind changes.

### Have Claude Teach You
```
"Generate a visual HTML presentation explaining this code"
"Draw an ASCII diagram of this architecture"
"Explain this like I'm new to the codebase"
```

### Spaced Repetition
After Claude explains something:
```
"Quiz me on this in 3 messages"
"Ask me to explain it back to you"
```

---

## 10. Quick Reference Commands

| Command | Purpose |
|---------|---------|
| `/help` | Show all commands |
| `/memory` | Show memory file usage |
| `/statusline` | Configure status bar |
| `/config` | Open configuration |
| `/compact` | Summarize and reduce context |
| `shift+tab` | Toggle plan mode |
| `ctrl+o` | Expand agent output |
| `ctrl+b` | Run agent in background |

---

## Our Workflow for Adaptive Courses

### Daily Development
1. `git checkout dev`
2. `npm run dev` (keep running)
3. `claude` - start session
4. Use plan mode for new features
5. Use subagents for exploration
6. Commit frequently with good messages
7. Merge to main only when ready

### Before Complex Changes
```
> Plan the implementation of [feature]
```

### After Bugs
```
> Update CLAUDE.md so this doesn't happen again
```

### Weekly Maintenance
```
> Run /techdebt and find duplicated code
> Review CLAUDE.md and remove outdated sections
```

---

## Resources

- [Claude Code Docs](https://code.claude.com/docs)
- [Git Worktrees Guide](https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees)
- [Hooks Documentation](https://code.claude.com/docs/en/hooks)
- [Boris Cherny's Tips Thread](https://x.com/bcherny/status/2017742743125299476)

---

*Let's lock in.*
