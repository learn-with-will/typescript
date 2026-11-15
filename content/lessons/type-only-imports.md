---
slug: type-only-imports
title: "Type-Only Imports and Exports"
topic: modules-and-config
kind: technique
summary: "Use import type and export type to guarantee zero runtime module emission and prevent side-effect imports."
tags: [imports, type-only, bundlers]
related: [es-modules-import-export, verbatim-module-syntax, declaration-files]
---
> **In one line:** Use import type to guarantee that an import is stripped completely from emitted JavaScript.

## The idea

When you import an interface or type alias, TypeScript normally inspects the imported identifier and strips it from the emitted JavaScript if it is used only as a type. However, this type-elision process requires full cross-file type checking.

Single-file transpilers like Babel, esbuild, SWC, and Vite do not perform cross-file type resolution. If you write `import { User } from './models'`, a single-file transpiler cannot know whether `User` is a class (value) or an interface (type), and may accidentally leave the import in place, causing runtime module-not-found errors.

TypeScript 3.8 introduced type-only imports: `import type { User } from './models'`. This explicitly tells all tools that the import exists solely for type checking and must be stripped completely from the emitted JavaScript.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Explicit type-only import:
import type { UserProfile, AccountStatus } from './models.js';

// Inline type-only import (combining value and type from one module):
import { fetchUserData, type UserApiResponse } from './api.js';

function renderAccount(user: UserProfile, status: AccountStatus): void {
  console.log(`User: ${user.name}, Status: ${status}`);
}

// In the compiled JavaScript output:
// 'import type { UserProfile... }' is 100% erased!
// 'import { fetchUserData } from "./api.js";' is emitted cleanly.
```

> **Tip:** Enable `"verbatimModuleSyntax": true` in `tsconfig.json` to require `import type` for all type imports.

## Go deeper

Comparing standard imports with type-only imports:

| Syntax | Intent | Behavior in Single-File Bundlers |
|---|---|---|
| `import { A } from './m'` | Value or Type | Transpiler must guess; may leave dead import |
| `import type { A } from './m'` | Strictly Type | 100% Guaranteed to be stripped |
| `import { type A, b } from './m'` | Mixed Value & Type | Strips `A`, emits `import { b } from './m'` |

## Watch out

- Values imported with import type cannot be used at runtime (e.g. cannot call new User() or read User.prop).
- Type-only imports do not trigger module side-effects (like polyfills or global registration).

## Remember

- Use import type to guarantee zero runtime code emission for imported types.
- Type-only imports solve compilation issues with Vite, esbuild, and Babel.
- Use inline type modifiers (import { value, type Type }) for mixed module imports.
