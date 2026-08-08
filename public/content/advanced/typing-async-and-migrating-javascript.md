---
id: lesson-24
slug: typing-async-and-migrating-javascript
title: "Typing Async Code and Migrating JavaScript"
level: advanced
order: 24
duration: 32
tags:
  - async
  - promises
  - fetch
  - error-handling
  - migration
---

# Learning Objectives

By the end of this lesson you will be able to:

- Type Promises and `async`/`await` correctly.
- Write a typed `fetch` that validates unknown data.
- Handle errors safely when the caught value is `unknown`.
- Migrate a JavaScript codebase to TypeScript step by step.
- Know where to continue after this course.

# Why It Matters

Almost every real program does asynchronous work — network calls, file access, timers — and almost every real program *starts* as JavaScript. This final lesson ties the course together: typing async code (where data crosses the boundary from "outside" into your program) and migrating existing JavaScript gradually. Both are about handling the untyped edges of the world safely, which is exactly where TypeScript earns its keep.

# Concept Explanation

### Promises and `async`/`await`

An asynchronous value has type `Promise<T>`, where `T` is what it eventually resolves to. An `async` function **always returns a `Promise`**, and `await` unwraps it:

```typescript
async function getCount(): Promise<number> {
  return 42; // a plain 42 is wrapped in Promise<number>
}

const count = await getCount(); // count: number
```

If you annotate an `async` function's return type, use `Promise<T>` — the compiler checks that the resolved value matches. `Promise.all` types the results as a tuple:

```typescript
const [a, b] = await Promise.all([getCount(), Promise.resolve('hi')]);
// a: number, b: string
```

### Typed `fetch` and validating unknown data

Data from the network is genuinely untyped. `fetch`'s `response.json()` resolves to `any`, which quietly disables checking. The safe pattern is to treat it as `unknown` and **validate** before trusting it:

```typescript
interface User {
  id: number;
  name: string;
}

function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' && value !== null &&
    typeof (value as Record<string, unknown>).id === 'number' &&
    typeof (value as Record<string, unknown>).name === 'string'
  );
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data: unknown = await response.json();
  if (!isUser(data)) throw new Error('Unexpected response shape');
  return data; // narrowed to User
}
```

This is the recurring theme of the whole course: **types are erased, so external data must be checked at runtime.** A type annotation on the response would be a *hope*, not a guarantee; a type guard makes it real. (In production, a schema-validation library automates the `isUser` check.)

### Handling errors: `catch` is `unknown`

With `strict` (specifically `useUnknownInCatchVariables`), the value in a `catch` clause is typed **`unknown`** — because in JavaScript you can throw *anything*, not just an `Error`. Narrow before using it:

```typescript
try {
  await fetchUser(1);
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message); // safe — narrowed to Error
  } else {
    console.error('Unknown error', error);
  }
}
```

This prevents the common bug of assuming `error.message` exists when the thrown value might be a string, `undefined`, or anything else.

### Migrating JavaScript to TypeScript

You don't rewrite a codebase overnight. TypeScript is designed for **gradual** migration:

1. **Add TypeScript and a config.** Set `allowJs: true` so `.js` and `.ts` files coexist and can import each other.
2. **Check JavaScript in place.** Turn on `checkJs` (or add `// @ts-check` at the top of individual files) to type-check your existing `.js` using inference and JSDoc — no rename required.
3. **Add types with JSDoc.** Before renaming, you can annotate plain JavaScript with JSDoc comments the compiler understands:

```javascript
// @ts-check

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function add(a, b) {
  return a + b;
}
```

4. **Rename file by file.** Change `.js` to `.ts` (or `.tsx`) one module at a time, fixing the errors that surface. Each rename tightens a piece of the codebase without blocking the rest.
5. **Tighten the config.** Start lenient (perhaps `strict: false`), then enable strict options incrementally — `noImplicitAny`, then `strictNullChecks`, and so on — fixing what each reveals.

Because all valid JavaScript is valid TypeScript, the code keeps running throughout. You get value from day one and increase safety at your own pace.

### Where to go next

You've covered the language end to end. From here:

- Practice by adding types to a small project of your own.
- Read library `.d.ts` files to see these features used in the wild.
- Explore a runtime **schema-validation** approach for external data (the automated version of the guards you wrote here).
- Keep the **Handbook** and **release notes** close — the language keeps evolving.

# Key Terminology

- **`Promise<T>`** — the type of an async value resolving to `T`.
- **`async`/`await`** — syntax producing and unwrapping promises.
- **Validation / type guard** — runtime check that narrows untyped external data.
- **`useUnknownInCatchVariables`** — strict option typing `catch` values as `unknown`.
- **`allowJs` / `checkJs`** — options to include and type-check JavaScript.
- **JSDoc types** — type annotations written in comments for `.js` files.

# Syntax and Options

| Feature | Syntax |
| ------- | ------ |
| Async return | `async function f(): Promise<T>` |
| Await | `const x = await f()` |
| Parallel | `await Promise.all([...])` |
| Untyped data | `const data: unknown = await res.json()` |
| Catch value | `catch (error: unknown)` |
| Include JS | `"allowJs": true` |
| Check JS | `"checkJs": true` or `// @ts-check` |
| JSDoc | `/** @param {number} x */` |

# Hands-On Walkthrough

A complete, safe async flow:

```typescript
interface Post {
  id: number;
  title: string;
}

function isPostArray(value: unknown): value is Post[] {
  return (
    Array.isArray(value) &&
    value.every(
      (p) =>
        typeof p === 'object' && p !== null &&
        typeof (p as Record<string, unknown>).id === 'number' &&
        typeof (p as Record<string, unknown>).title === 'string',
    )
  );
}

async function loadPosts(): Promise<Post[]> {
  try {
    const res = await fetch('/api/posts');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: unknown = await res.json();
    if (!isPostArray(data)) throw new Error('Bad response');
    return data; // Post[]
  } catch (error: unknown) {
    if (error instanceof Error) console.error(error.message);
    return [];
  }
}
```

Every boundary is handled: the HTTP status, the unknown JSON shape, and the unknown thrown error.

# Real World Analogy

Async boundaries are the **loading dock of a warehouse**. Trucks (network responses) arrive with cargo you didn't pack — you can't assume the manifest is right. So you **inspect each shipment at the dock** (validate the `unknown` data) before it enters the warehouse (your typed program). Migration is **renovating the warehouse while it stays open**: you upgrade one aisle (`.js` → `.ts`) at a time, and the store never closes because the old and new aisles work together.

# Examples

## Example 1 — Basic: typing an async function

```typescript
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

await delay(100); // resolves to void
```

**Why this works:** the function is annotated `Promise<void>`, and `await`ing it yields nothing (`void`). The compiler checks that the promise resolves consistently with the annotation.

## Example 2 — Real-world: safe error handling

```typescript
function toMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

try {
  throw 'oops'; // JS lets you throw anything
} catch (error) {
  console.error(toMessage(error)); // "oops" — handled safely
}
```

**Why this works:** because `catch` values are `unknown`, `toMessage` narrows every possibility — an `Error`, a raw string, or something else — instead of assuming `.message` exists. A reusable helper like this keeps error handling honest across a codebase.

## Example 3 — Best practice / edge case: JSDoc-typed JavaScript during migration

```javascript
// @ts-check

/**
 * @param {string[]} names
 * @returns {string}
 */
function joinNames(names) {
  return names.join(', ');
}

joinNames('nope');
// Error: Argument of type 'string' is not assignable to parameter of type 'string[]'.
```

**Why this works:** with `// @ts-check`, the compiler reads the JSDoc types and checks the `.js` file as if it were typed — catching the bad call *before* you've renamed anything to `.ts`. It's a low-friction first step in migration.

# Common Mistakes

- **Trusting `response.json()`.** It's `any`; treat network data as `unknown` and validate it.
- **Assuming `catch` gives you an `Error`.** Under strict it's `unknown`; narrow with `instanceof Error` first.
- **Forgetting `async` wraps the return.** An `async` function returning `T` has type `Promise<T>`; annotate accordingly.
- **Trying to migrate all at once.** Use `allowJs`/`checkJs`, JSDoc, and file-by-file renames instead of a big-bang rewrite.

# Best Practices

- Type async functions as **`Promise<T>`** and `await` at the call site.
- Treat all external data as **`unknown`** and **validate** it (a schema library automates this).
- Narrow **`catch`** values before use; a shared `toMessage`/error helper keeps it consistent.
- Migrate **gradually**: `allowJs` → `checkJs`/`// @ts-check` + JSDoc → rename per file → tighten `strict`.

# Summary

- `async` functions return **`Promise<T>`**; `await` unwraps them, and `Promise.all` yields a typed tuple.
- Network data is untyped — accept it as **`unknown`** and **validate** before trusting it, because types are erased.
- Under strict, **`catch` values are `unknown`** — narrow with `instanceof Error`.
- Migrate JavaScript **incrementally** with `allowJs`, `checkJs`/`// @ts-check`, JSDoc types, and file-by-file renames, then tighten strictness.
- You've completed the language — keep practicing, read real `.d.ts` files, and lean on the Handbook.

# Flash Cards

Q: What type does an `async` function that returns a `number` have?
A: `Promise<number>` — `async` functions always return a promise.

Q: What type does `response.json()` resolve to, and how should you handle it?
A: `any` — treat the result as `unknown` and validate it with a type guard before using it.

Q: Under `strict`, what is the type of the value in a `catch` clause?
A: `unknown` (via `useUnknownInCatchVariables`), because JavaScript can throw any value — narrow it before use.

Q: Which options let you include and type-check JavaScript during migration?
A: `allowJs` (include `.js`) and `checkJs` (or `// @ts-check` per file), often with JSDoc type annotations.

Q: Why can you migrate a codebase gradually rather than all at once?
A: All valid JavaScript is valid TypeScript, so `.js` and `.ts` files interoperate; you rename and tighten one piece at a time.

Q: Why isn't annotating a fetch result as a type enough on its own?
A: Types are erased, so the annotation isn't checked at runtime; you must validate the actual data with runtime code.

# Exercises

### Easy
Write `async function sum(promises: Promise<number>[]): Promise<number>` that awaits all the promises and adds the results. Use `Promise.all`.

### Medium
Write a type guard `isStringArray(value: unknown): value is string[]` and a `loadTags()` function that fetches, validates the JSON with it, and returns `string[]` or throws.

### Challenging
Take a 10–15 line JavaScript file, add `// @ts-check` and JSDoc types to its functions, and fix any errors the compiler reports — without renaming it to `.ts`. Then describe the next two steps you'd take to finish migrating it.

# Further Reading

- [Handbook — Everyday Types (async patterns build on these)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Handbook — Migrating from JavaScript](https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html)
- [Handbook — Type Checking JavaScript Files](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html)
- [JSDoc Reference for TypeScript](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
