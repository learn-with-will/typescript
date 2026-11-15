---
slug: verbatim-module-syntax
title: "verbatimModuleSyntax"
topic: modules-and-config
kind: technique
summary: "Enable verbatimModuleSyntax to enforce predictable, unambiguous import/export emission matching ECMAScript standards."
tags: [modules, esm, compiler-flags]
related: [type-only-imports, es-modules-import-export, module-resolution]
---
> **In one line:** Use verbatimModuleSyntax to ensure that imports and exports are emitted exactly as written.

## The idea

Historically, TypeScript attempted to determine whether an `import` was a type or a runtime value through complex elision heuristics. This often led to confusion with single-file transpilers like Vite and esbuild, which do not perform cross-file type resolution.

TypeScript 5.0 introduced `"verbatimModuleSyntax": true`. Under this setting, the compiler follows a simple and predictable rule:
1. Any import written with `import type` is completely stripped.
2. Any regular `import` without the `type` modifier is emitted as a real runtime JavaScript import, unchanged.

This eliminates all guesswork. If you import an interface using standard `import { User }`, the compiler flags an error, instructing you to write `import type { User }`. This guarantees 100% compatibility across all modern bundlers and runtimes.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

Adopting these idioms early ensures that code remains clean, readable, and resilient against future modifications. Software systems inevitably change as business requirements evolve, and having robust compile-time guarantees allows engineers to focus on business value rather than chasing type-related regressions across the application stack.

## See it

```typescript
// With "verbatimModuleSyntax": true

// Error: UserInterface is only a type!
// import { UserInterface } from './models.js';

// Correct: Explicit type import is stripped without ambiguity:
import type { UserInterface } from './models.js';

// Correct: Runtime value import is emitted verbatim:
import { calculateTax } from './tax.js';

// Correct: Mixed import using inline type modifier:
import { formatCurrency, type CurrencyCode } from './currency.js';
```

> **Tip:** `verbatimModuleSyntax` supersedes older flags like `importsNotUsedAsValues` and `preserveValueImports`.

## Go deeper

How verbatimModuleSyntax simplifies compiler emission rules:

| Syntax in TypeScript Source | Emitted in JavaScript Output |
|---|---|
| `import { value } from './mod.js'` | `import { value } from './mod.js';` |
| `import type { Type } from './mod.js'` | Completely erased (zero output) |
| `import { value, type Type } from './mod.js'` | `import { value } from './mod.js';` |
| `import './side-effect.js'` | `import './side-effect.js';` |

## Watch out

- Forgetting the type modifier on an interface import will cause the compiler to flag an error.
- You must include appropriate file extensions (.js) when targeting NodeNext.

## Remember

- verbatimModuleSyntax provides simple, predictable import and export emission rules.
- It requires explicit import type for all type-only dependencies.
- Guarantees flawless compatibility with modern build tools like Vite and esbuild.
