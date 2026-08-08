---
id: lesson-15
slug: tsconfig-options-that-matter
title: "The tsconfig Options That Matter"
level: intermediate
order: 15
duration: 28
tags:
  - tsconfig
  - strict
  - target
  - module-resolution
  - compiler-options
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what the `strict` family turns on and why to keep it.
- Set `target`, `module`, and `moduleResolution` sensibly.
- Understand `esModuleInterop`, `isolatedModules`, and `noEmit`.
- Recognize a few high-value extra options.
- Describe what project references are for.

# Why It Matters

`tsconfig.json` decides how strict the compiler is and what it produces. A handful of options do most of the work; the rest you'll rarely touch. Knowing this handful means you can read any project's config, understand the errors you get, and set up a new project correctly instead of copying a mystery file. The single most important lever — `strict` — directly determines how many real bugs TypeScript catches for you.

# Concept Explanation

Everything below lives under `"compilerOptions"` in `tsconfig.json`.

### The `strict` family

`"strict": true` is an umbrella that enables a family of stricter checks. The ones you'll feel most:

- **`strictNullChecks`** — `null` and `undefined` are not silently allowed in other types. This alone prevents a huge class of "cannot read property of undefined" bugs.
- **`noImplicitAny`** — a value the compiler can't infer a type for is an error, instead of a silent `any`.
- **`strictFunctionTypes`** — stricter, safer checking of function-type compatibility.
- **`strictPropertyInitialization`** — class fields must be initialized.
- **`noImplicitThis`** — using `this` with an implicit `any` type is an error.
- **`useUnknownInCatchVariables`** — a `catch` variable is typed `unknown` instead of `any`, so you must narrow errors.

Keep `strict` on. Turning it off to silence errors usually just hides real problems. New projects from `tsc --init` enable it by default.

### `target`

The JavaScript language version the compiler **emits**. A modern, widely-supported choice is `ES2022`:

```json
{ "compilerOptions": { "target": "ES2022" } }
```

`target` also affects which built-in library types are available (e.g. newer `Array` or `String` methods) unless you override with `lib`.

### `module` and `moduleResolution`

- **`module`** — the module format of the output (`ESNext`, `NodeNext`, `CommonJS`, …).
- **`moduleResolution`** — how the compiler *finds* imports. Use **`bundler`** for apps built with Vite/webpack/esbuild, and **`nodenext`** for Node.js programs.

```json
{ "compilerOptions": { "module": "ESNext", "moduleResolution": "bundler" } }
```

### `esModuleInterop`

Smooths over the difference between CommonJS and ES modules so that default-importing a CommonJS package works as expected:

```typescript
import express from 'express'; // needs esModuleInterop for many CJS packages
```

Leave it **on** (`true`) in most projects; `tsc --init` enables it.

### `isolatedModules`

Guarantees each file can be transpiled **on its own**, without type information from other files. Bundlers like esbuild and SWC require this because they compile file-by-file. With it on, the compiler flags patterns that can't be transpiled in isolation (like re-exporting a type without `export type`, or `const enum`). If you use a bundler, keep it on.

### `noEmit`

Runs the type check but **writes no output**. This is how bundler-based apps use `tsc` — as a checker only, while the bundler produces the JavaScript:

```json
{ "compilerOptions": { "noEmit": true } }
```

### A few high-value extras

- **`skipLibCheck`** — skips type-checking of `.d.ts` files. Speeds up builds; commonly on.
- **`forceConsistentCasingInFileNames`** — prevents import-casing bugs that only appear on case-sensitive file systems (like CI).
- **`noUncheckedIndexedAccess`** — makes indexed access (`arr[i]`, `obj[key]`) include `undefined`, forcing you to handle out-of-range/missing keys. Not part of `strict`, but a great extra safety net.

### Project references

Large codebases split into multiple `tsconfig` projects that depend on each other. **Project references** (`composite: true` plus a `references` array) let the compiler build them in the right order and only rebuild what changed:

```json
{
  "references": [{ "path": "../shared" }],
  "compilerOptions": { "composite": true }
}
```

You won't need this for a single app, but it's worth recognizing in monorepos.

# Key Terminology

- **`strict`** — umbrella option enabling the strict-checking family.
- **`target`** — the emitted JavaScript version (and available lib features).
- **`module`** — the output module format.
- **`moduleResolution`** — how imports are located (`bundler`, `nodenext`, …).
- **`esModuleInterop`** — interop that makes CommonJS default imports work.
- **`isolatedModules`** — guarantees each file is transpilable alone.
- **`noEmit`** — type-check only, emit nothing.
- **Project references** — multi-project builds with dependency order.

# Syntax and Options

| Option | Typical value | Why |
| ------ | ------------- | --- |
| `strict` | `true` | Catch the most bugs |
| `target` | `ES2022` | Modern output + lib features |
| `module` | `ESNext` / `NodeNext` | Output module format |
| `moduleResolution` | `bundler` / `nodenext` | Locate imports correctly |
| `esModuleInterop` | `true` | CJS/ESM default-import interop |
| `isolatedModules` | `true` | Required by many bundlers |
| `noEmit` | `true` (bundled apps) | Use tsc as a checker |
| `skipLibCheck` | `true` | Faster builds |
| `noUncheckedIndexedAccess` | `true` (recommended) | Safer indexing |

# Hands-On Walkthrough

A solid starting config for a bundler-based web app:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noEmit": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "noUncheckedIndexedAccess": true
  },
  "include": ["src"]
}
```

Try the effect of one option: with `noUncheckedIndexedAccess` on,

```typescript
const items = ['a', 'b'];
const first = items[0]; // string | undefined  (must handle undefined)
```

Turn it off and `first` becomes `string`. On is safer — it reflects that an index might be out of range.

# Real World Analogy

`tsconfig.json` is the **settings panel of a power tool**. `strict` is the safety guard — keep it on unless you enjoy stitches. `target` and `module` are the bit and the material setting; `moduleResolution` is how the tool finds its attachments. `noEmit` is "run it but don't cut" — a dry run to check everything lines up. A few extra switches (`noUncheckedIndexedAccess`) add guards for specific hazards.

# Examples

## Example 1 — Basic: turning `strict` off hides a real bug

```typescript
// With strictNullChecks ON (recommended):
function first(items: string[]): string {
  return items[0].toUpperCase();
  // With noUncheckedIndexedAccess, items[0] is string | undefined → error to fix
}
```

**Why this works:** strict options surface exactly the cases that crash at runtime (empty arrays, missing values). Fixing them at compile time is the whole point; disabling the checks just defers the crash.

## Example 2 — Real-world: a Node.js service config

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "nodenext",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

**Why this works:** a Node service emits real JavaScript (so no `noEmit`), uses `NodeNext` module settings to match Node's resolution and `package.json` `exports`, and keeps `strict` and `esModuleInterop` for safety and smooth imports.

## Example 3 — Best practice / edge case: `noUncheckedIndexedAccess`

```typescript
const config: Record<string, string> = { host: 'localhost' };
const port = config['port']; // string | undefined with the option on

const value = port ?? '8080'; // forced to handle the missing key
```

**Why this works:** the option makes indexed lookups honest — a key might not be present — so you handle the `undefined` case instead of assuming every key exists. It catches a very common source of runtime `undefined` bugs.

# Common Mistakes

- **Disabling `strict` to make errors go away.** The errors are usually real; fix the code.
- **Wrong `moduleResolution`.** `bundler` for apps, `nodenext` for Node. The wrong one causes "cannot find module" errors.
- **Forgetting `noEmit` in a bundled app.** Without it, `tsc` may scatter `.js` files you don't want.
- **Assuming `strict` covers everything.** Useful options like `noUncheckedIndexedAccess` are *not* in `strict` — opt in.

# Best Practices

- Start every project with **`strict: true`**, and consider **`noUncheckedIndexedAccess`**.
- Use **`moduleResolution: "bundler"`** for apps, **`"nodenext"`** for Node.
- In bundler-based apps, add **`isolatedModules`** and run `tsc` with **`noEmit`** as a CI check.
- Keep **`esModuleInterop`** and **`skipLibCheck`** on for smooth, fast builds.

# Summary

- **`strict`** enables the checks that catch the most bugs — keep it on.
- **`target`/`module`/`moduleResolution`** control output and import resolution; pick values that match your environment.
- **`esModuleInterop`** smooths CommonJS/ESM imports; **`isolatedModules`** supports bundlers; **`noEmit`** makes `tsc` a checker.
- Extras like **`noUncheckedIndexedAccess`** add safety beyond `strict`; **project references** organize large multi-project builds.

# Flash Cards

Q: What is the single most impactful check that `strict` turns on?
A: `strictNullChecks` — it keeps `null`/`undefined` out of other types, preventing many "cannot read property of undefined" bugs.

Q: Which `moduleResolution` value suits a Vite/webpack app, and which suits Node?
A: `bundler` for the app; `nodenext` for Node.js.

Q: What does `noEmit` do, and when is it used?
A: It type-checks without producing JavaScript — used in bundler-based apps where the bundler emits the code and `tsc` only checks.

Q: What does `isolatedModules` guarantee, and who needs it?
A: That every file can be transpiled on its own; bundlers like esbuild/SWC that compile file-by-file require it.

Q: Is `noUncheckedIndexedAccess` part of `strict`?
A: No — it's a separate, recommended option that makes `arr[i]`/`obj[key]` include `undefined`.

Q: What are project references for?
A: Building multiple interdependent `tsconfig` projects in the right order and rebuilding only what changed (via `composite` + `references`).

# Exercises

### Easy
Create a `tsconfig.json` for a bundler app with `strict`, `noEmit`, and `moduleResolution: "bundler"`. Explain each in one line.

### Medium
Turn on `noUncheckedIndexedAccess` and write code that reads `arr[0]`; handle the `undefined` the compiler now reports. Then turn the option off and note the type change.

### Challenging
Given a Node.js CLI that emits to `dist`, write an appropriate `tsconfig.json` (target, module, moduleResolution, strict, outDir) and justify why each differs from a bundler-app config.

# Further Reading

- [tsconfig reference — all options](https://www.typescriptlang.org/tsconfig/)
- [Handbook — `strict` and the strict family](https://www.typescriptlang.org/tsconfig/#strict)
- [Handbook — Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
