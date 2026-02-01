# UI Design Skill

Create unique, memorable UI components for Adaptive Courses that stand out from generic AI-generated interfaces.

## Design Philosophy

**Anti-generic principle:** Never use the default blue/purple AI aesthetic. Our brand is warm, educational, human.

**Visual identity:**
- Primary: Warm amber/orange tones (not cold tech blue)
- Accents: Deep forest greens, warm grays
- Typography: Clean, readable, generous spacing
- Micro-interactions: Subtle, purposeful animations

## Tailwind v4 Rules

We use Tailwind CSS v4 with CSS-first configuration. Key patterns:

```css
/* Use CSS variables in app/globals.css */
@theme {
  --color-brand: oklch(0.7 0.15 60);
  --color-accent: oklch(0.5 0.1 150);
}
```

**Component patterns:**
- Use `rounded-2xl` or `rounded-3xl` for cards (not `rounded-lg`)
- Generous padding: `p-6` minimum for cards, `p-8` for hero sections
- Shadow hierarchy: `shadow-sm` for subtle, `shadow-xl` for elevated
- Transitions: `transition-all duration-200` on interactive elements

## Anti-Patterns to Avoid

- Generic gradient backgrounds (especially blue-purple)
- Centered everything with no visual hierarchy
- Stock illustration style with floating people
- "AI" in neon colors
- Excessive use of emojis as decoration
- Cookie-cutter SaaS layouts

## Component Checklist

Before delivering any UI component:
1. Does it look like it could only belong to Adaptive Courses?
2. Is there clear visual hierarchy?
3. Are interactive states (hover, focus, active) defined?
4. Is it accessible (proper contrast, focus rings)?
5. Does it work on mobile?

## Example: Good vs Bad

**Bad (generic):**
```tsx
<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4">
  <h2 className="text-white text-center">Welcome!</h2>
</div>
```

**Good (unique):**
```tsx
<div className="bg-gradient-to-br from-amber-50 to-orange-100 rounded-3xl p-8 border border-amber-200/50 shadow-sm">
  <h2 className="text-amber-900 font-semibold tracking-tight">Welcome!</h2>
</div>
```

## When to Use This Skill

Invoke `/design` when:
- Creating new UI components
- Redesigning existing interfaces
- Building landing pages or marketing sections
- Adding micro-interactions or animations
- Reviewing UI for brand consistency
