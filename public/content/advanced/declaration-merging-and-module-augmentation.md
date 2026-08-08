---
id: lesson-22
slug: declaration-merging-and-module-augmentation
title: "Declaration Merging and Module Augmentation"
level: advanced
order: 22
duration: 28
tags:
  - declaration-merging
  - module-augmentation
  - declare-global
  - namespaces
  - interfaces
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain how TypeScript merges multiple declarations of the same name.
- Add properties to an existing third-party module with **module augmentation**.
- Extend global types with `declare global`.
- Recognize where **namespaces** still have a role.

# Why It Matters

Sometimes the type you need to change isn't yours — it's in a library or the global environment. **Declaration merging** is the mechanism that lets you *add* to an existing interface or module without editing its source: telling TypeScript that `express`'s `Request` now has a `user` property, or that `window` has a global your build injects. It's the sanctioned way to teach the type system about extensions the original authors didn't know about.

# Concept Explanation

### Interface declaration merging

Unlike a `type` alias, you can declare the **same interface more than once**, and TypeScript **merges** the declarations into one:

```typescript
interface Box {
  width: number;
}
interface Box {
  height: number;
}

// Box is now { width: number; height: number }
const b: Box = { width: 10, height: 20 };
```

This is the foundation of everything else in the lesson. (A `type` alias can't do this — a duplicate name is an error.) Merging is why library authors expose interfaces you can extend, and why the DOM's `Window`, `Document`, etc. can be augmented.

### Module augmentation

To add members to types declared in **another module**, you *augment* that module with `declare module`, using an interface that merges with the library's:

```typescript
// The library declares: interface Session { id: string }
// You want to add a `userId`.

import 'express-session'; // ensure the module is loaded

declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}
```

Inside the `declare module 'name'` block you re-open one of the module's interfaces; your members merge into it everywhere the type is used. This is how plugins add typed properties to frameworks (e.g. adding `req.user` to Express) without you casting to `any`.

Two rules make augmentation work:

1. The file must be a **module** (it has top-level `import`/`export`), so the augmentation is scoped rather than global.
2. You augment an **interface** the library exposes — merging only works on interfaces (and namespaces), not `type` aliases.

### Extending the global scope with `declare global`

To add to **global** types — `window`, `globalThis`, or a global variable — use a `declare global` block inside a module:

```typescript
export {}; // make this file a module

declare global {
  interface Window {
    __APP_VERSION__: string;
  }
}

window.__APP_VERSION__; // now typed as string
```

This is the correct way to type a global your bundler or a script injects, instead of reaching for `(window as any)`.

### Namespaces — where they still fit

**Namespaces** are TypeScript's older way of grouping related declarations under a single name. For organizing application code, **ES modules replaced them** — prefer `import`/`export`. But namespaces still appear in a few places:

- **Merging with functions, classes, or enums** — e.g. adding static-like members or nested types to a function:

```typescript
function makeId(): string { return crypto.randomUUID(); }
namespace makeId {
  export const version = 1;
}
makeId();          // "…"
makeId.version;    // 1
```

- **Ambient declaration files** (`.d.ts`) that describe global libraries loaded via `<script>` tags, where a global namespace is the natural shape.

For everyday module code, though, reach for modules, not namespaces.

# Key Terminology

- **Declaration merging** — combining multiple same-named declarations into one.
- **Interface merging** — the most common form; interfaces of the same name combine.
- **Module augmentation** — adding members to another module's types via `declare module`.
- **`declare global`** — a block that augments global types from inside a module.
- **Namespace** — an older grouping construct, largely superseded by ES modules.

# Syntax and Options

| Goal | Syntax |
| ---- | ------ |
| Merge your own interfaces | declare `interface X` twice |
| Augment a library type | `declare module 'lib' { interface Y { … } }` |
| Type a global | `declare global { interface Window { … } }` |
| Group with a value | `function f(){} ` + `namespace f { … }` |
| Make a file a module | add `export {}` |

# Hands-On Walkthrough

Add a typed property to Express's request, and a typed global:

```typescript
// express-augmentation.ts
import 'express';

declare module 'express' {
  interface Request {
    user?: { id: number; role: 'admin' | 'user' };
  }
}

// Now in a handler, req.user is typed:
// app.get('/me', (req, res) => res.json(req.user));
```

```typescript
// globals.ts
export {};

declare global {
  interface Window {
    analytics?: { track(event: string): void };
  }
}

window.analytics?.track('page_view'); // typed, optional
```

Neither file changes the library or the DOM lib — they *merge* new members into the existing interfaces.

# Real World Analogy

Declaration merging is **adding sticky notes to a shared reference manual**. You don't rewrite the manual (the library's source); you attach notes that everyone reading it will now see — "this request also carries a `user`." `declare global` is pinning a note to the building's public directory (the global scope). Namespaces are the old three-ring binder system: still around for legacy documents, but for new work everyone files things as separate modules.

# Examples

## Example 1 — Basic: merge your own interfaces

```typescript
interface Config { host: string; }
interface Config { port: number; }

const c: Config = { host: 'localhost', port: 8080 }; // both required
```

**Why this works:** two interface declarations with the same name merge into one type containing all members. (Try this with `type Config` and you'll get a "duplicate identifier" error — only interfaces merge.)

## Example 2 — Real-world: augment a library module

```typescript
import 'vue'; // a framework that exposes an interface to extend

declare module 'vue' {
  interface ComponentCustomProperties {
    $formatCurrency: (value: number) => string;
  }
}
// Now `this.$formatCurrency(10)` is typed inside components.
```

**Why this works:** the library deliberately exposes `ComponentCustomProperties` as an interface so users can merge in the properties a plugin adds. Your `declare module` block merges your method into it, giving type-safe access without `any`.

## Example 3 — Best practice / edge case: type an injected global

```typescript
export {};

declare global {
  // A build-time constant injected by the bundler:
  const __BUILD_TIME__: string;
}

console.log(`Built at ${__BUILD_TIME__}`); // typed as string
```

**Why this works:** the `export {}` makes the file a module (so `declare global` is allowed), and the global declaration types a value the bundler defines. This replaces unsafe `(globalThis as any).__BUILD_TIME__` access with a proper type.

# Common Mistakes

- **Trying to merge `type` aliases.** Only interfaces (and namespaces) merge; duplicate `type` names are errors.
- **Forgetting to make the file a module.** `declare global` and scoped `declare module` augmentation require the file to have a top-level `import`/`export` (add `export {}` if needed).
- **Augmenting a type the library didn't expose as an interface.** You can only merge into interfaces/namespaces the library declares.
- **Reaching for namespaces in app code.** Prefer ES modules; use namespaces mainly for value-merging and ambient global libraries.

# Best Practices

- Use **interface merging** to extend types you own across files.
- Use **module augmentation** (not casts) to add typed members to libraries that expose extendable interfaces.
- Type globals with **`declare global`** instead of `(window as any)`.
- Prefer **modules** over namespaces; keep namespaces for value merging and ambient global typings.

# Summary

- **Declaration merging** combines same-named interfaces (and namespaces) into one; `type` aliases don't merge.
- **Module augmentation** (`declare module 'lib' { interface … }`) adds members to another module's types.
- **`declare global`** extends global types (`Window`, global consts) from inside a module.
- **Namespaces** are largely superseded by ES modules but remain useful for merging with values and for ambient global libraries.

# Flash Cards

Q: What happens if you declare two interfaces with the same name?
A: TypeScript merges them into a single interface containing all their members.

Q: Can `type` aliases be merged like interfaces?
A: No — a duplicate `type` name is an error; only interfaces (and namespaces) merge.

Q: How do you add a typed property to a third-party module's interface?
A: Module augmentation: `declare module 'lib' { interface X { … } }` in a file that's a module.

Q: How do you add a typed property to `window`?
A: Inside a module, use `declare global { interface Window { … } }`.

Q: Why might you need `export {}` at the top of an augmentation file?
A: It makes the file a module, which is required for `declare global` and scoped `declare module` augmentation.

Q: Where do namespaces still make sense?
A: For merging extra members onto a function/class/enum value, and in ambient `.d.ts` files describing global (script-loaded) libraries.

# Exercises

### Easy
Declare `interface User { id: number }` twice — once adding `name: string` — and create a value that satisfies the merged type.

### Medium
Write a `declare global` block that adds an optional `featureFlags?: Record<string, boolean>` to `Window`, then read it safely with optional chaining.

### Challenging
Given a fictional library `charts` that exposes `interface ChartOptions`, write a module augmentation adding a `theme?: 'light' | 'dark'` option. Explain the two requirements (module file, interface target) that make the augmentation valid.

# Further Reading

- [Handbook — Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html)
- [Handbook — Module Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)
- [Handbook — Namespaces](https://www.typescriptlang.org/docs/handbook/namespaces.html)
