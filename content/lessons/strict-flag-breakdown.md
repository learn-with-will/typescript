---
slug: strict-flag-breakdown
title: "The strict Flag Breakdown"
topic: modules-and-config
kind: concept
summary: "Explore every individual compiler sub-flag activated by the master strict setting in tsconfig.json."
tags: [strict, compiler-flags, quality]
related: [compiler-target-and-lib, no-unchecked-indexed-access, skip-lib-check]
---
> **In one line:** Setting strict: true activates eight individual type-checking flags simultaneously.

## The idea

Setting `"strict": true` in `tsconfig.json` is the single most impactful setting for TypeScript code quality. Rather than being a single check, `strict` is a master toggle that activates a family of eight individual compiler strictness flags.

Understanding each sub-flag helps you understand why the compiler behaves the way it does, and allows you to adopt them individually if you are migrating an older codebase.

The eight flags enabled by `strict: true` are:
1. `strictNullChecks`
2. `noImplicitAny`
3. `strictFunctionTypes`
4. `strictBindCallApply`
5. `strictPropertyInitialization`
6. `noImplicitThis`
7. `alwaysStrict`
8. `useUnknownInCatchVariables`

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// 1. noImplicitAny flags unannotated parameters:
// function multiply(a, b) { return a * b; } // Error: 'a' implicitly has an 'any' type

// 2. useUnknownInCatchVariables types catch error as unknown instead of any:
try {
  JSON.parse('{ invalid json }');
} catch (err) {
  // err is unknown! Compiler prevents: console.log(err.message);
  if (err instanceof Error) {
    console.log('Error caught:', err.message); // Safe
  }
}
```

> **Tip:** You can enable `strict: true` and selectively disable a single sub-flag if migrating a legacy project.

## Go deeper

Complete breakdown of flags activated by `"strict": true`:

| Sub-flag | What It Enforces |
|---|---|
| `noImplicitAny` | Forbids unannotated parameters falling back to `any` |
| `strictNullChecks` | Treats `null` and `undefined` as distinct types |
| `strictFunctionTypes` | Enforces strict contravariance on function parameters |
| `strictBindCallApply` | Checks argument types on `bind`, `call`, and `apply` |
| `strictPropertyInitialization` | Requires class fields to be initialized in constructor |
| `noImplicitThis` | Raises error when `this` has type `any` |
| `alwaysStrict` | Parses files in ECMAScript strict mode and emits `"use strict"` |
| `useUnknownInCatchVariables` | Types catch clause variables as `unknown` instead of `any` |

## Watch out

- Leaving strict off in new projects allows silent any propagation and unhandled null errors.
- strict does not enable all possible checks; flags like noUncheckedIndexedAccess must be added manually.

## Remember

- strict: true enables eight comprehensive type-safety flags at once.
- useUnknownInCatchVariables prevents unsafe property access on caught exceptions.
- Always start new repositories with strict: true enabled from the first commit.
