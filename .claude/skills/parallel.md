# Parallel Work Skill

Spawn multiple subagents to execute large workloads simultaneously.

## How It Works

Claude Code can spawn subagents that:
- Run in parallel (not sequentially)
- Each has independent context
- Report back when complete
- Can run in background while you continue chatting

## Invocation Patterns

### Explicit Agent Count
```
Use 5 subagents to [task]
Run this with 3 parallel agents
Spawn agents for each of these tasks
```

### Implicit Parallelization
```
Research X, Y, and Z simultaneously
Do all of these in parallel
```

### Background Execution
```
Run this in the background and let me know when done
Kick off these tasks, I'll check back later
```

## Use Case Templates

### Codebase Audit (5 agents)
1. Security audit - check for vulnerabilities
2. Performance audit - find slow code paths
3. Accessibility audit - check WCAG compliance
4. SEO audit - meta tags, structured data
5. Code quality - find duplication, complexity

### Launch Research (6 agents)
1. Legal requirements for the product category
2. Competitor pricing analysis
3. Marketing channel research
4. SEO keyword opportunities
5. Payment processor comparison
6. Launch checklist from successful products

### Feature Implementation (4 agents)
1. Research existing patterns in codebase
2. Design component architecture
3. Find relevant tests to update
4. Check for breaking changes

### Content Generation (unlimited)
```
Generate 10 blog post outlines about [topic]
Use a subagent for each outline
```

## Best Practices

**When to parallelize:**
- Independent tasks with no dependencies
- Research that doesn't need sequential discovery
- Audits across different concerns
- Bulk content generation

**When NOT to parallelize:**
- Tasks where output of one feeds into another
- Exploratory work where you don't know the path yet
- Small tasks (overhead not worth it)

## Output Handling

Agents return results that get synthesized into a final response. For large outputs, I'll:
1. Summarize key findings from each agent
2. Identify conflicts or overlaps
3. Provide consolidated recommendations
4. Link to detailed findings if needed

## Example Prompt

```
I want to prepare for launch. Use subagents to research in parallel:

1. LEGAL: What do I need to sell digital courses? Terms of service, privacy policy, refund policy requirements.

2. COMPETITORS: Analyze Udemy, Coursera, Skillshare, MasterClass pricing and positioning. What's their weakness?

3. MARKETING: Best channels for reaching adult learners. Rank by cost and effectiveness.

4. TECHNICAL: Audit our codebase for production readiness. Security, performance, error handling.

5. CONTENT: Generate 20 blog post ideas that would rank for "learn [skill] fast" keywords.

Compile everything into a launch readiness report.
```

## When to Use This Skill

Invoke `/parallel` when:
- You have multiple independent tasks
- You want to maximize throughput
- Research needs to cover many angles
- Bulk operations on similar items
