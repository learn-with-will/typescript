---
id: lesson-14
slug: modules-and-declaration-files
title: "Modules and Declaration Files"
level: intermediate
order: 14
duration: 30
tags:
  - modules
  - import-type
  - declaration-files
  - types-packages
  - resolution
---

# Learning Objectives

By the end of this lesson you will be able to:

- Import and export values and types with ES module syntax.
- Use `import type` / `export type` for type-only imports.
- Explain what a declaration file (`.d.ts`) is and where types come from.
- Install and use community types from `@types`.
- Describe, at a high level, how module resolution finds an import.

# Why It Matters

Real programs are many files, and libraries are many more. Modules are how those files share code, and **declaration files** are how TypeScript knows the types of code it isn't compiling — the standard library, npm packages, or plain JavaScript. Understanding both is what makes "just import it" work with full type safety across your own code and the entire ecosystem.

# Concept Explanation

### ES modules: `import` and `export`

TypeScript uses standard JavaScript module syntax. A file that uses `import`/`export` is a **module**; its top-level names are private unless exported.

```typescript
// math.ts
export function add(a: number, b: number): number {
  return a + b;
}
export const PI = 3.14159;

// A default export (at most one per module):
export default function subtract(a: number, b: number): number {
  return a - b;
}
```

```typescript
// app.ts
import subtract, { add, PI } from './math';
add(2, 3);
subtract(5, 1);
```

You can rename on import (`import { add as sum }`) and re-export (`export { add } from './math'`).

### Types cross module boundaries too

Interfaces and type aliases are exported and imported just like values:

```typescript
// types.ts
export interface User {
  id: number;
  name: string;
}

// app.ts
import { User } from './types';
const u: User = { id: 1, name: 'Ada' };
```

### `import type` — type-only imports

When you import something used **only as a type**, mark the import with `type`. This makes your intent explicit and guarantees the import is fully erased — it never turns into a runtime `import`:

```typescript
import type { User } from './types';
import { type User as U, createUser } from './users'; // inline form
```

Type-only imports matter under single-file transpilation (`isolatedModules`, and the stricter `verbatimModuleSyntax`), where the compiler processes one file at a time and can't always tell whether an imported name is a type or a value. Using `import type` removes the ambiguity and prevents accidental runtime imports of things that don't exist at runtime.

### Declaration files (`.d.ts`)

A **declaration file** contains *types only* — no implementations. Its job is to describe the shape of code that exists elsewhere:

```typescript
// shapes.d.ts
export interface Point {
  x: number;
  y: number;
}
export declare function distance(a: Point, b: Point): number;
```

You rarely write these by hand for your own code — the compiler generates them from your `.ts` files when `declaration` is enabled. But they're everywhere: the TypeScript standard library itself (the `lib.*.d.ts` files describing `Array`, `Promise`, the DOM, etc.) is a set of declaration files.

### Ambient declarations

When you need to describe something with no module of its own — a global variable, or a module written in plain JavaScript — you use an **ambient declaration** with `declare`:

```typescript
// globals.d.ts
declare const APP_VERSION: string; // a global injected at build time

declare module 'untyped-lib' {
  export function doThing(x: number): string;
}
```

`declare` says "this exists at runtime; here is its type" — without emitting any code.

### The `@types` ecosystem (DefinitelyTyped)

Many npm packages ship their own types. For those that don't, the community maintains type packages under the **`@types`** scope on **DefinitelyTyped**:

```bash
npm install --save-dev @types/node
```

The compiler automatically picks up `@types/*` packages. So `import ... from 'node:fs'` becomes fully typed once `@types/node` is installed (for packages that don't bundle their own types).

### How module resolution finds an import

When you write `import { add } from './math'` or `import x from 'some-lib'`, the compiler must locate the file and its types. The strategy is set by **`moduleResolution`**:

- **`bundler`** — matches how modern bundlers resolve; the common choice for apps.
- **`node16`/`nodenext`** — follows Node.js's rules, including `package.json` `exports` and file extensions.

You don't resolve modules by hand, but knowing the setting explains errors like "cannot find module" (often a wrong `moduleResolution` or a missing `@types` package).

# Key Terminology

- **Module** — a file that uses `import`/`export`; its top-level names are scoped to it.
- **Named / default export** — the two export forms (`export { x }` vs `export default`).
- **`import type`** — a type-only import that's always erased.
- **Declaration file (`.d.ts`)** — types-only file describing code implemented elsewhere.
- **Ambient declaration** — `declare …`, describing a global or external module.
- **`@types` / DefinitelyTyped** — community type packages for libraries without their own.
- **`moduleResolution`** — the setting that controls how imports are located.

# Syntax and Options

| Feature | Syntax |
| ------- | ------ |
| Named export/import | `export { add }` / `import { add } from './m'` |
| Default export/import | `export default fn` / `import fn from './m'` |
| Rename | `import { add as sum } from './m'` |
| Re-export | `export { add } from './m'` |
| Type-only import | `import type { T } from './m'` |
| Ambient module | `declare module 'name' { … }` |
| Install types | `npm i -D @types/<pkg>` |

# Hands-On Walkthrough

Split a tiny program into modules with a shared type:

```typescript
// user.ts
export interface User {
  id: number;
  name: string;
}
export function createUser(id: number, name: string): User {
  return { id, name };
}
```

```typescript
// greet.ts
import type { User } from './user';

export function greet(user: User): string {
  return `Hello, ${user.name}`;
}
```

```typescript
// main.ts
import { createUser } from './user';
import { greet } from './greet';

const ada = createUser(1, 'Ada');
console.log(greet(ada)); // "Hello, Ada"
```

Note `greet.ts` uses `import type` because it needs `User` only as a type — that import is guaranteed to disappear from the output.

# Real World Analogy

A module is a **department in a company**: it does its own work privately and publishes only what it chooses (its exports). A declaration file is the **org chart and job descriptions** for a department you don't manage — it tells you who does what and how to call them, without showing you their actual work. `@types` packages are org charts contributed by the community for departments (libraries) that never published their own.

# Examples

## Example 1 — Basic: named vs default export

```typescript
// logger.ts
export default class Logger {
  log(msg: string): void { console.log(msg); }
}
export const LEVELS = ['info', 'warn', 'error'] as const;

// app.ts
import Logger, { LEVELS } from './logger';
new Logger().log(LEVELS[0]);
```

**Why this works:** a module can have one default export (imported without braces) and any number of named exports (imported with braces). Here `Logger` is default and `LEVELS` is named.

## Example 2 — Real-world: typing an untyped module

```typescript
// legacy.d.ts
declare module 'legacy-math' {
  export function factorial(n: number): number;
}

// app.ts
import { factorial } from 'legacy-math';
factorial(5); // now typed as (n: number) => number
```

**Why this works:** the ambient `declare module` gives TypeScript the types for a JavaScript library that ships none, so imports from it are checked. (Installing an `@types/legacy-math` package would do the same if one existed.)

## Example 3 — Best practice / edge case: `import type` prevents a runtime import

```typescript
// Only the type is needed, so this import is erased:
import type { Config } from './config';

export function validate(config: Config): boolean {
  return Object.keys(config).length > 0;
}
```

**Why this works:** because `Config` is used only in a type position, `import type` guarantees the statement leaves no `import './config'` in the emitted JavaScript — important under `verbatimModuleSyntax`/`isolatedModules`, and it avoids pulling in a module you don't actually run.

# Common Mistakes

- **Mixing up default and named imports.** `import { Logger }` fails if `Logger` is a default export (use `import Logger`).
- **Forgetting `@types`.** "Cannot find module 'x' or its type declarations" often means you need `@types/x` (for a library without bundled types).
- **Runtime-importing a type.** Importing an interface without `import type` can leave a needless (or invalid) runtime import under strict module settings.
- **Wrong `moduleResolution`.** App code usually wants `bundler`; Node programs want `node16`/`nodenext`. The wrong one causes resolution errors.

# Best Practices

- Prefer **named exports** for discoverability; use a default export sparingly.
- Use **`import type`** whenever an import is only a type.
- Install **`@types/*`** for libraries that don't ship their own types.
- Set **`moduleResolution`** to match your environment (`bundler` for most apps).

# Summary

- Modules share code with `import`/`export`; types cross module boundaries like values.
- **`import type`** marks type-only imports so they're always erased.
- **Declaration files (`.d.ts`)** describe code implemented elsewhere; the standard library is made of them.
- **`declare`** writes ambient declarations for globals and untyped modules.
- Libraries without built-in types get them from **`@types`** (DefinitelyTyped).
- **`moduleResolution`** controls how imports are located.

# Flash Cards

Q: What makes a file a "module" in TypeScript?
A: Using top-level `import`/`export`. Its top-level names are private to the file unless exported.

Q: When should you use `import type`?
A: When an imported name is used only as a type — it makes the import always erased and avoids accidental runtime imports.

Q: What is a `.d.ts` declaration file?
A: A types-only file describing the shape of code implemented elsewhere (like the standard library or a JavaScript package).

Q: Where do types for a library that ships none usually come from?
A: A community `@types/<package>` package on DefinitelyTyped, which the compiler picks up automatically.

Q: What does an ambient `declare module 'x' { … }` do?
A: It provides types for a module (often plain JavaScript) that has no type declarations of its own.

Q: What setting controls how imports are located, and what's typical for apps?
A: `moduleResolution`; apps commonly use `bundler`, while Node programs use `node16`/`nodenext`.

# Exercises

### Easy
Split a program into `math.ts` (exporting `add`) and `main.ts` (importing and using it). Add a default export to `math.ts` and import it too.

### Medium
Create `types.ts` exporting an interface, then import it into another file with `import type`. Explain what changes in the emitted JavaScript compared to a regular import.

### Challenging
Write an ambient `declare module` for a fictional untyped package `tiny-uuid` that exports `v4(): string`, then import and use it. Describe how installing `@types/tiny-uuid` would replace your hand-written declaration.

# Further Reading

- [Handbook — Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html)
- [Handbook — Declaration Files: Introduction](https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html)
- [Handbook — Type-Only Imports and Exports](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-exports)
- [`moduleResolution` reference](https://www.typescriptlang.org/tsconfig/#moduleResolution)
