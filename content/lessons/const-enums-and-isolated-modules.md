---
slug: const-enums-and-isolated-modules
title: "const enums & isolatedModules"
topic: classes-and-enums
kind: pitfall
summary: "const enums inline member values at compile time, but interact poorly with single-file transpilers like Babel and Vite."
tags: [const-enums, isolatedModules, inlining]
related: [numeric-enums-and-reverse-mapping, string-enums, enums-versus-union-of-literals]
---
> **In one line:** const enums inline values at compile time but fail under isolatedModules bundlers like Vite.

## The idea

To avoid emitting the runtime lookup object associated with standard enums, TypeScript introduced `const enum`. When an enum is declared with the `const` keyword (`const enum Direction { Up, Down }`), TypeScript completely erases the enum and inlines the raw literal value wherever the enum is referenced in source code.

While this saves a few bytes of bundle size, it creates a serious problem for modern build tools. Transpilers like Babel, SWC, esbuild, and Vite process files one at a time in isolation (`isolatedModules`). Because they do not perform cross-file type resolution, a single-file transpiler cannot know what value a `const enum` imported from another file holds.

For this reason, most modern TypeScript projects enable `"isolatedModules": true` in `tsconfig.json`, which causes the compiler to flag `const enum` usage across files as an error.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Declaration of a const enum:
const enum SpeedLimit {
  City = 30,
  Highway = 65
}

// In standard tsc emit, this code:
const maxAllowed = SpeedLimit.Highway;

// Compiles directly into:
// const maxAllowed = 65; // Inlined directly! No SpeedLimit object emitted.
```

> **Tip:** If your project uses Vite, esbuild, or Babel, avoid `const enum`; use `as const` object literals instead.

## Go deeper

Comparing enum compilation modes across modern tooling:

| Construct | Emits Runtime Object? | Inlines Values? | Compatible with Vite / isolatedModules? |
|---|---|---|---|
| Standard `enum` | Yes | No | Yes |
| `const enum` | No | Yes | Problematic (causes build errors) |
| `as const` object | Yes (standard JS object) | Inferred literals | 100% Compatible everywhere |

## Watch out

- const enums cause build breaks when imported across files in Vite or Babel projects.
- Ambient const enums (.d.ts) cannot be inlined by single-file transpilers.

## Remember

- const enums inline their member values directly into call sites at compile time.
- Modern bundlers with isolatedModules cannot compile imported const enums.
- Use union of string literals or as const objects instead of const enum.
