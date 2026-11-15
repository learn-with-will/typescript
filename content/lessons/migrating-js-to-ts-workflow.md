---
slug: migrating-js-to-ts-workflow
title: "The JS to TS Migration Workflow"
topic: advanced-patterns
kind: technique
summary: "Follow a proven step-by-step strategy to migrate legacy JavaScript codebases to strict TypeScript smoothly."
tags: [migration, workflow, strategy]
related: [migrating-js-with-check-js, strict-mode, tsconfig-json]
---
> **In one line:** Migrate legacy JavaScript to TypeScript in structured phases: tooling, leaf files, and progressive strictness.

## The idea

Successfully converting an enterprise JavaScript codebase to TypeScript requires a disciplined, phase-based strategy to avoid disrupting ongoing product development.

A proven migration roadmap follows four distinct phases:
1. **Tooling & Baseline:** Add TypeScript as a devDependency, create a starter `tsconfig.json` with `"allowJs": true`, `"checkJs": false`, and relaxed strictness. Integrate `tsc --noEmit` into CI.
2. **Type Core Domain Models:** Create a `types/` folder containing shared interfaces for core domain entities and API payloads.
3. **Bottom-Up Conversion:** Rename files to `.ts` starting with "leaf" utility files (files that have no project dependencies). Work upwards toward controllers and UI components.
4. **Tighten Strictness:** Progressively enable strict flags (`noImplicitAny`, `strictNullChecks`, and eventually `strict: true`) until the codebase is fully typed.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```json
// Step 1: Initial tsconfig.json for migration
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "allowJs": true,        // Allow mixed JS and TS files
    "checkJs": false,       // Don't error on existing JS files yet
    "noEmit": true,         // Type check only
    "strict": false         // Start relaxed, tighten gradually
  },
  "include": ["src/**/*"]
}
```

```bash
# Run migration verification in CI alongside existing build
npx tsc --noEmit
```

> **Tip:** Convert utility functions and models first; converting leaf files establishes types that make higher-level files easy to convert.

## Go deeper

Migration Phase Roadmap:

```flow
p1: Phase 1: Setup tsconfig | allowJs: true @primary
p2: Phase 2: Leaf Files | convert utils to .ts @blue
p3: Phase 3: Core Components | convert business logic @amber
p4: Phase 4: Strict Mode | enable strict: true @green
p1 -> p2: establishes build pipeline
p2 -> p3: bottom-up conversion
p3 -> p4: locks down safety
```

## Watch out

- Avoid typing everything as any during migration; any creates technical debt that is rarely cleaned up.
- Never disable CI type checks; once a file is converted to .ts, keep it error-free.

## Remember

- Use allowJs: true to allow JavaScript and TypeScript to coexist during migration.
- Convert leaf files and utility modules first before converting complex UI components.
- Progressively enable strictness flags until strict: true is achieved across the repository.
