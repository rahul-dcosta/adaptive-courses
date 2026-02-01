# Tech Debt Skill

Find and eliminate technical debt in the codebase.

## What to Look For

### Code Duplication
- Similar functions that could be unified
- Copy-pasted logic across files
- Repeated patterns that should be abstracted

### Dead Code
- Unused imports
- Commented-out code blocks
- Functions never called
- Unreachable code paths

### Outdated Patterns
- Old React patterns (class components, old lifecycle methods)
- Deprecated API usage
- Legacy dependencies that should be updated

### Complexity Hotspots
- Functions over 50 lines
- Files over 500 lines
- Deeply nested conditionals (>3 levels)
- Functions with >5 parameters

### Missing Types
- `any` types in TypeScript
- Missing return types
- Untyped function parameters

### Inconsistencies
- Mixed naming conventions (camelCase vs snake_case)
- Inconsistent file organization
- Different patterns for same task

## Analysis Process

1. **Scan the codebase**
   ```bash
   # Find large files
   find . -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -rn | head -20

   # Find TODO comments
   grep -r "TODO\|FIXME\|HACK\|XXX" --include="*.ts" --include="*.tsx"
   ```

2. **Check for duplicates**
   Look for similar code blocks across files

3. **Review dependencies**
   ```bash
   npm outdated
   ```

4. **Identify refactoring candidates**
   Files touched most often that are hard to work with

## Output Format

```markdown
## Tech Debt Report

### High Priority (fix now)
| Issue | Location | Effort | Impact |
|-------|----------|--------|--------|
| Description | file:line | S/M/L | High/Med/Low |

### Medium Priority (fix soon)
| Issue | Location | Effort | Impact |
|-------|----------|--------|--------|

### Low Priority (fix eventually)
| Issue | Location | Effort | Impact |
|-------|----------|--------|--------|

### Quick Wins (< 30 min each)
1. [Issue] in [file]
2. [Issue] in [file]

### Recommended Actions
1. First priority action
2. Second priority action
```

## When to Use This Skill

Invoke `/techdebt` when:
- Want to find duplicated code
- Looking for refactoring opportunities
- Doing periodic codebase health checks
- Planning cleanup sprints
