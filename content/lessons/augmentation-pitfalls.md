---
slug: augmentation-pitfalls
title: "Augmentation Pitfalls"
topic: advanced-patterns
kind: pitfall
summary: "Avoid common pitfalls with declaration merging and module augmentation that can overwrite libraries or break compilation."
tags: [pitfalls, debugging, augmentation]
related: [module-augmentation, declare-global-augmentation, interface-declaration-merging]
---
> **In one line:** Avoid module wiping by ensuring augmenting files contain top-level import statements.

## The idea

While declaration merging and module augmentation are powerful, they are common sources of obscure compiler errors when improperly configured.

The most catastrophic pitfall is the "module wiping" bug. If you create a file with `declare module "axios"` but forget to include any top-level `import` statement in that file, TypeScript treats the file as an ambient script rather than an augmentation. Instead of adding a property to Axios, TypeScript completely replaces the real Axios package with your empty declaration, causing every single Axios method to disappear across your entire project!

Another common pitfall is type mismatches. If you declare a property that already exists on the target interface with an incompatible type, the compiler halts with an irreconcilable duplicate identifier error.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// DANGEROUS: Wipes out the real library completely across the project!
// declare module 'express' {
//   export interface Request { myProp: string; }
// }

// CORRECT: Must have an import to trigger augmentation rather than overwrite:
import 'express';

declare module 'express' {
  export interface Request {
    myProp: string;
  }
}
```

> **Watch out:** Always verify your tsconfig `include` pattern covers your custom `.d.ts` augmentation files!

## Go deeper

Distinguishing module augmentation from ambient module declarations:

| Syntax Structure | File Has Imports? | Compiler Action | Result |
|---|---|---|---|
| `declare module "x" { ... }` | Yes (`import 'x'`) | Augmentation | Merges properties into existing package |
| `declare module "x" { ... }` | No (pure ambient) | Ambient Overwrite | Replaces entire package with declaration! |

## Watch out

- Omitting an import statement in an augmentation file destroys the target library’s types.
- Redeclaring an existing property with a different type produces an unfixable compiler error.

## Remember

- Always include an import statement in files that perform module augmentation.
- Without an import, declare module wipes the target library completely.
- Never redeclare existing properties with incompatible types.
