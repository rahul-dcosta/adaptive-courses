# Design System & Principles

**Last Updated:** 2026-02-01

This document defines the visual language, design principles, and implementation standards for the Adaptive Courses platform. **Reference this file before making any UI changes.**

---

## Brand Identity

### Positioning
**Academic Premium** - Serious, credible, sophisticated learning platform for complex topics. We are NOT a casual "learn anything" app. We are a personalized academic course builder for professionals who want to master difficult subjects adapted to their specific context.

### Tone
- Elegant, not flashy
- Serious, not stuffy  
- Sophisticated, not complicated
- Premium, not pretentious

---

## Color Palette

### Primary: Royce Royal Blue
```css
--royal-blue: #003F87        /* Primary brand color */
--royal-blue-light: #0056B3  /* Hover states, lighter accents */
--royal-blue-dark: #002D5F   /* Headers, emphasis */
```

**Usage:**
- Primary actions (buttons, CTAs)
- Key headings and titles
- Progress indicators
- Links and interactive elements
- Accent borders for important sections

### Neutrals
```css
Background: linear-gradient(135deg, #e8f0f9 0%, #d0e2f4 100%)
White: #FFFFFF (cards, content boxes)
Gray-900: #1f2937 (primary text)
Gray-700: #374151 (body text)
Gray-600: #4b5563 (secondary text)
Gray-500: #6b7280 (tertiary text)
Gray-300: #d1d5db (dividers)
Gray-100: #f3f4f6 (subtle backgrounds)
```

### Accent Colors
```css
Success: rgba(34, 197, 94, ...) /* Green for completion, success */
Warning: rgba(245, 158, 11, ...) /* Amber for warnings */
Error: rgba(239, 68, 68, ...) /* Red for errors */
```

---

## Typography

### Fonts
```css
Serif (Headings): 'Merriweather', Georgia, serif
Sans-Serif (Body): 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
Monospace (Code): 'Monaco', 'Courier New', monospace
```

### Hierarchy

**Display (Hero Headers)**
- Size: 3.5rem - 4rem (56px - 64px)
- Weight: 900 (Black)
- Font: Merriweather
- Color: --royal-blue-dark
- Line Height: 1.1
- Letter Spacing: -0.025em

**H1 (Page Titles)**
- Size: 3rem (48px)
- Weight: 900
- Font: Merriweather
- Color: --royal-blue
- Line Height: 1.2

**H2 (Section Headers)**
- Size: 2.25rem (36px)
- Weight: 700
- Font: Merriweather
- Color: --royal-blue-dark
- Line Height: 1.3

**H3 (Subsection Headers)**
- Size: 1.5rem (24px)
- Weight: 700
- Font: Merriweather
- Color: #111827
- Line Height: 1.4

**Body (Regular Text)**
- Size: 1.125rem (18px)
- Weight: 400
- Font: Inter
- Color: #374151
- Line Height: 1.875 (33.75px)

**Small (Captions, Labels)**
- Size: 0.875rem - 1rem (14px - 16px)
- Weight: 400-500
- Font: Inter
- Color: #6b7280

---

## Spacing System

Use consistent spacing multiples of 4px (Tailwind's spacing scale):

```
4px  = 0.25rem = gap-1, p-1
8px  = 0.5rem  = gap-2, p-2
12px = 0.75rem = gap-3, p-3
16px = 1rem    = gap-4, p-4
24px = 1.5rem  = gap-6, p-6
32px = 2rem    = gap-8, p-8
48px = 3rem    = gap-12, p-12
64px = 4rem    = gap-16, p-16
```

**Section Spacing:**
- Between major sections: 4rem (64px) - 6rem (96px)
- Between components: 2rem (32px) - 3rem (48px)
- Between related elements: 1rem (16px) - 1.5rem (24px)

---

## Border & Shadow System

### Borders - ALWAYS SUBTLE
**Philosophy:** Borders define structure without overwhelming. Keep them light and minimal.

```css
/* Subtle dividers */
border: 1px solid rgba(0, 63, 135, 0.08)

/* Light container borders */
border: 1px solid rgba(0, 63, 135, 0.1)

/* Medium emphasis borders */
border: 1px solid rgba(0, 63, 135, 0.12)

/* Strong emphasis (rare - only for important callouts) */
border: 2px solid rgba(0, 63, 135, 0.15)
```

**Never use:**
- Borders darker than rgba(0, 63, 135, 0.2)
- Multiple thick borders competing for attention
- Borders everywhere - let white space breathe

### Shadows - RESTRAINED ELEVATION
```css
/* Subtle card shadow */
box-shadow: 0 1px 3px rgba(0, 63, 135, 0.08)

/* Medium card elevation */
box-shadow: 0 4px 12px rgba(0, 63, 135, 0.1)

/* Strong elevation (modals, popovers) */
box-shadow: 0 8px 32px rgba(0, 63, 135, 0.15)
```

**Usage:**
- Cards: subtle shadow (0 1px 3px)
- Hover states: increase shadow slightly
- Modals/popovers: strong shadow for clear separation
- Active elements: inner shadow for pressed effect

---

## Component Patterns

### Cards & Containers

**Standard Content Card:**
```tsx
<div className="bg-white rounded-xl p-8" 
     style={{ border: '1px solid rgba(0, 63, 135, 0.1)' }}>
  {/* Content */}
</div>
```

**Highlighted Section:**
```tsx
<div className="rounded-xl p-8" 
     style={{ 
       backgroundColor: 'rgba(0, 63, 135, 0.04)',
       border: '1px solid rgba(0, 63, 135, 0.12)' 
     }}>
  {/* Content */}
</div>
```

**Important Callout:**
```tsx
<div className="bg-white rounded-xl p-8 shadow-md" 
     style={{ border: '2px solid var(--royal-blue)' }}>
  {/* Content */}
</div>
```

### Buttons

**Primary CTA:**
```tsx
<button 
  className="px-6 py-3 rounded-xl font-semibold text-white transition-all shadow-lg hover:shadow-xl"
  style={{ backgroundColor: 'var(--royal-blue)' }}
>
  Action
</button>
```

**Secondary:**
```tsx
<button 
  className="px-5 py-3 border-2 rounded-xl font-medium transition-all"
  style={{ 
    borderColor: 'var(--royal-blue)',
    color: 'var(--royal-blue)'
  }}
>
  Action
</button>
```

**Ghost/Tertiary:**
```tsx
<button 
  className="px-4 py-2 rounded-lg font-medium transition-all hover:bg-gray-50"
  style={{ color: 'var(--royal-blue)' }}
>
  Action
</button>
```

### Badges & Tags

```tsx
<span 
  className="inline-block px-3 py-1 text-xs font-semibold rounded-full border"
  style={{ 
    backgroundColor: 'rgba(0, 63, 135, 0.05)',
    borderColor: 'rgba(0, 63, 135, 0.15)',
    color: 'var(--royal-blue)'
  }}
>
  Tag
</span>
```

### Progress Indicators

**Circular Progress:**
- Use SVG circles with royal blue stroke
- Background: rgba(0, 63, 135, 0.1)
- Foreground: var(--royal-blue)
- Stroke width: 8px for large (80px+), 6px for medium (60px), 4px for small (40px)

**Linear Progress Bar:**
```tsx
<div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
  <div 
    className="h-2 transition-all duration-500 rounded-full"
    style={{ 
      width: `${progress}%`,
      backgroundColor: 'var(--royal-blue)'
    }}
  />
</div>
```

---

## Layout Principles

### Container Widths
```
Hero/Landing: max-w-7xl (1280px)
Content: max-w-3xl (768px)
Sidebar: w-80 (320px)
Wide Content: max-w-5xl (1024px)
```

### Responsive Breakpoints
```
sm: 640px   (mobile landscape)
md: 768px   (tablet)
lg: 1024px  (desktop)
xl: 1280px  (large desktop)
```

### Grid & Flexbox
- Use flexbox for 1-dimensional layouts (rows, columns)
- Use grid for 2-dimensional layouts (cards, galleries)
- Gap: prefer gap-6 (24px) to gap-8 (32px) for breathing room

---

## Interaction Design

### Hover States
- Buttons: darken background by 10-15%, increase shadow
- Links: underline thickness increases from 1px to 2px
- Cards: subtle shadow increase (from 0 1px 3px to 0 4px 12px)
- Icons: opacity change (from 1 to 0.75)

### Active States
- Buttons: slight scale down (transform: scale(0.98))
- Toggle/selection: border or background color change
- Input focus: blue ring (ring-2 ring-royal-blue)

### Transitions
```css
transition: all 0.2s ease      /* Standard */
transition: all 0.3s ease      /* Slower, deliberate */
transition-duration: 500ms     /* Smooth animations */
```

**Never:**
- Jarring instant changes
- Slow transitions > 500ms (feels sluggish)
- Excessive animation (distracting)

---

## Content Formatting

### Prose Styling
Use the `.prose` class for rich text content:
- Font size: 1.125rem (18px)
- Line height: 1.875 (generous for readability)
- Paragraph spacing: 1.5rem (24px)
- Code inline: subtle blue background, monospace font
- Blockquotes: left blue border, italic, light background

### Lists
- Bullet lists: disc marker, 2rem left indent
- Numbered lists: decimal marker, 2rem left indent
- Nested lists: circle/square markers
- List item spacing: 0.75rem (12px) between items

### Code Blocks
```tsx
<pre className="p-6 rounded-xl overflow-x-auto" 
     style={{ 
       backgroundColor: 'rgba(0, 63, 135, 0.05)',
       border: '1px solid rgba(0, 63, 135, 0.15)'
     }}>
  <code className="text-sm font-mono" 
        style={{ color: 'var(--royal-blue-dark)' }}>
    {/* Code */}
  </code>
</pre>
```

---

## Mermaid Diagrams

**Container:**
```tsx
<div className="mermaid-container my-6 flex justify-center items-center">
  {/* Mermaid SVG */}
</div>
```

**Styling:**
- Container: light background (rgba(255,255,255,0.7)), rounded corners, subtle border
- Nodes: royal blue stroke, light blue fill
- Text: royal blue-dark, Inter font
- Arrows/paths: royal blue stroke
- Keep diagrams simple and focused - clarity over complexity

---

## Accessibility

### Color Contrast
- Text on white: minimum 4.5:1 ratio (WCAG AA)
- Interactive elements: clear focus indicators
- Never rely on color alone (use icons, labels, patterns)

### Focus States
```css
focus:outline-none focus:ring-2 focus:ring-royal-blue focus:ring-offset-2
```

### Screen Readers
- Use semantic HTML (header, nav, main, article, aside)
- ARIA labels on icon-only buttons
- Alt text on images
- Skip links for navigation

---

## Loading & Empty States

### Loading Spinner
```tsx
<div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-4" 
     style={{ borderTopColor: 'var(--royal-blue)' }}>
</div>
```

### Loading Screens
- Centered content (fixed inset-0, flex items-center justify-center)
- Royal blue spinner
- Short, clear loading message
- Background: gradient matching site

### Empty States
- Icon or illustration (muted colors)
- Clear, empathetic message ("No courses yet")
- CTA to create/add ("Generate your first course")

---

## Do's and Don'ts

### ✅ DO
- Keep borders subtle (0.08 - 0.12 opacity)
- Use generous white space
- Maintain consistent royal blue accents
- Use Merriweather for headings, Inter for body
- Add shadows for depth, not decoration
- Use rounded corners (rounded-xl = 12px)
- Keep animations smooth and purposeful
- Test on mobile and desktop

### ❌ DON'T
- Use bright, saturated colors outside the palette
- Create heavy, boxy layouts with thick borders
- Mix too many font weights or sizes
- Overuse animations or transitions
- Clutter the interface with unnecessary elements
- Use more than 2-3 border styles on one page
- Create "floating" elements without clear hierarchy
- Ignore mobile responsiveness

---

## Example Courses Section

**Design Specs:**
- Grid: 2 columns (lg:grid-cols-2)
- Card: White background, subtle border, rounded-xl
- Hover: Shadow increase, slight scale (1.02)
- Icon/emoji: Large (text-4xl), royal blue
- Title: Bold, serif font, 1.5rem
- Description: Gray-700, 1rem, line-height 1.5
- Tag: Pill shape, royal blue accent

**Content Guidelines:**
- Choose impressive, complex academic topics
- Make the personalization angle clear in description
- Examples: "Game Theory for...", "Behavioral Economics for..."
- Show seriousness and credibility
- Avoid casual "learn anything" messaging

---

## Versioning

**v1.0** - Initial design system (2026-02-01)
- Royal blue color palette
- Academic premium aesthetic
- Subtle borders and shadows
- Merriweather + Inter typography
- Component patterns established

---

**When making UI changes:**
1. Read this file first
2. Follow color palette strictly
3. Keep borders subtle (0.08-0.12 opacity max)
4. Use consistent spacing (multiples of 4px)
5. Match existing component patterns
6. Test responsiveness
7. Update this file if adding new patterns
