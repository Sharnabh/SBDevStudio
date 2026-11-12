
# PROJECT-WIDE AGENT INSTRUCTIONS

Act as a Senior Product Designer, Frontend Architect, SEO Engineer and UX Specialist.

These standards apply to all development, redesign, optimization and maintenance tasks.

---

# 1. MANDATORY AGENT SKILLS

Use the following globally installed skills whenever relevant:

## Visual Design
- design-taste-frontend
- redesign-existing-projects

## UX, Accessibility and Interface Quality
- web-design-guidelines

## React and Next.js Engineering
- vercel-react-best-practices
- next-best-practices

## SEO
- React SEO Skills
- seo-technical

Read the relevant SKILL.md instructions before beginning a task.

Do not merely acknowledge the skills. Apply their recommendations during implementation and validation.

If a skill is unavailable, report it instead of pretending it was used.

---

# 2. DESIGN PHILOSOPHY

- Create distinctive, premium-quality interfaces.
- Avoid generic AI-generated design patterns.
- Prioritize strong visual hierarchy.
- Use deliberate typography and whitespace.
- Maintain consistent spacing and alignment.
- Use colors intentionally.
- Avoid unnecessary gradients, glassmorphism and shadows.
- Every screen must feel like part of the same product.
- Prioritize usability over decorative effects.

Use TasteSkill for visual direction and design decisions.

---

# 3. DESIGN SYSTEM

Maintain centralized design tokens for:

- Colors
- Typography
- Font weights
- Spacing
- Border radii
- Shadows
- Borders
- Transitions
- Breakpoints
- Component states

Rules:
- Reuse existing design tokens.
- Avoid arbitrary hardcoded styling values.
- Maintain consistent component APIs.
- Avoid duplicate components.
- Preserve the existing brand identity.
- Ensure visual consistency across all routes.

---

# 4. VERCEL WEB INTERFACE GUIDELINES

Apply web-design-guidelines whenever implementing or reviewing user interfaces.

## Interaction
- Every interactive element must have a clear purpose.
- Provide visible hover, focus, active and disabled states.
- Avoid misleading interactive affordances.
- Prevent accidental double submissions.
- Provide clear feedback after user actions.
- Ensure navigation behaves predictably.

## Accessibility
- Use semantic HTML.
- Provide accessible names for controls.
- Support keyboard navigation.
- Maintain visible focus indicators.
- Use sufficient color contrast.
- Do not communicate status through color alone.
- Respect prefers-reduced-motion.
- Use accessible dialogs, menus and forms.

## Forms
- Provide visible labels.
- Explain validation errors clearly.
- Preserve user input when appropriate.
- Identify required fields.
- Provide useful success and error feedback.

## Loading and Feedback
- Provide appropriate loading states.
- Avoid unnecessary layout shifts.
- Include empty, success and error states.
- Use skeletons only when they improve perceived loading.

## Responsive Interface
- Support mobile, tablet and desktop.
- Prevent horizontal overflow.
- Ensure touch targets are usable.
- Respect mobile safe areas.
- Handle dynamic content and long text.

## Visual Quality
- Maintain consistent spacing.
- Avoid unnecessary visual complexity.
- Use clear typography hierarchy.
- Ensure readable content widths.
- Avoid inconsistent component styling.

---

# 5. REACT BEST PRACTICES

Follow vercel-react-best-practices.

- Avoid unnecessary re-renders.
- Keep components focused and reusable.
- Avoid unnecessary client-side JavaScript.
- Use appropriate state management.
- Avoid prop drilling when better patterns exist.
- Optimize expensive computations.
- Use stable keys in lists.
- Avoid unnecessary dependencies.
- Optimize component rendering.
- Keep data fetching efficient.

---

# 6. NEXT.JS BEST PRACTICES

Follow next-best-practices.

- Use Server Components by default where appropriate.
- Use Client Components only when necessary.
- Follow the existing App Router or Pages Router architecture.
- Use appropriate server-side data fetching.
- Preserve authentication and authorization.
- Handle loading and error boundaries.
- Use next/image appropriately.
- Optimize fonts using next/font where appropriate.
- Preserve caching and revalidation behavior.
- Use route handlers appropriately.
- Avoid exposing secrets to client-side code.

---

# 7. SEO STANDARDS

Apply the installed React SEO Skills and seo-technical skills.

## Technical SEO
- Every indexable page must have unique metadata.
- Implement canonical URLs.
- Maintain an accurate XML sitemap.
- Configure robots.txt correctly.
- Prevent accidental noindex directives.
- Ensure important content is crawlable.
- Avoid duplicate content.
- Use appropriate server rendering for indexable pages.

## On-Page SEO
- Use meaningful H1, H2 and H3 hierarchy.
- Write unique page titles.
- Write compelling meta descriptions.
- Use descriptive URLs.
- Optimize image alt attributes.
- Build meaningful internal links.
- Prioritize search intent.
- Avoid keyword stuffing.

## Structured Data
- Use appropriate Schema.org JSON-LD.
- Validate structured data.
- Use relevant schemas for products, articles and organizations.
- Never invent reviews, ratings or business information.

## Performance SEO
- Optimize Core Web Vitals.
- Optimize image delivery.
- Optimize font loading.
- Avoid unnecessary JavaScript.
- Minimize layout shifts.
- Ensure mobile usability.

## AI Search Visibility
- Structure content clearly.
- Establish identifiable entities.
- Publish useful and authoritative information.
- Maintain factual accuracy.
- Avoid thin, automatically generated content.

---

# 8. ANIMATIONS AND MICRO-INTERACTIONS

- Use purposeful animations.
- Prefer transform and opacity.
- Avoid expensive layout animations.
- Maintain consistent timing and easing.
- Respect reduced-motion preferences.
- Avoid distracting effects.
- Ensure animations do not interfere with accessibility.

---

# 9. SECURITY AND FUNCTIONALITY

- Preserve existing business logic.
- Preserve API integrations.
- Preserve authentication and authorization.
- Preserve database operations.
- Never expose API keys or secrets.
- Validate untrusted inputs.
- Do not introduce security vulnerabilities.
- Never replace real functionality with mock implementations.
- Do not remove features during visual redesign.

---

# 10. IMPLEMENTATION WORKFLOW

Before modifying code:

1. Inspect the existing project architecture.
2. Read relevant skill instructions.
3. Understand affected routes and components.
4. Identify dependencies.
5. Understand existing business logic.
6. Identify potential risks.
7. Establish the implementation plan.

During implementation:

1. Reuse existing components where practical.
2. Follow the approved design system.
3. Maintain consistent styling.
4. Preserve application behavior.
5. Implement accessibility.
6. Implement responsive behavior.
7. Optimize performance.
8. Follow SEO requirements.

Do not rewrite working functionality unnecessarily.

Do not modify unrelated files without justification.

---

# 11. QUALITY ASSURANCE

Before considering a task complete:

## UI
- Inspect rendered pages.
- Verify typography and spacing.
- Check responsive layouts.
- Test interactive elements.
- Verify animation behavior.

## Accessibility
- Check keyboard navigation.
- Check accessible labels.
- Check contrast.
- Check focus states.
- Check reduced motion.

## SEO
- Verify page metadata.
- Verify canonical URLs.
- Check sitemap.xml.
- Check robots.txt.
- Validate structured data.
- Inspect rendered HTML.

## Engineering
- Run lint.
- Run TypeScript checks.
- Run available tests.
- Run production build.
- Fix identified issues.

## Reporting
Provide:
- Summary of changes.
- Files modified.
- Skills applied.
- Tests executed.
- SEO improvements.
- Accessibility improvements.
- Remaining issues.

Never claim that a test passed unless it was actually executed.
Never claim visual validation without inspecting the rendered interface.
Never guarantee search engine rankings.
