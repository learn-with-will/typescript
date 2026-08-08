---
id: lesson-13
slug: unknown-never-and-assertions
title: "unknown, never, and Type Assertions"
level: intermediate
order: 13
duration: 28
tags:
  - unknown
  - never
  - assertions
  - satisfies
  - exhaustiveness
---

# Learning Objectives

By the end of this lesson you will be able to:

- Use `unknown` as a safe container for values of uncertain type.
- Understand `never` and use it for **exhaustiveness checks**.
- Apply a type assertion with `as` — and know its limits.
- Use the non-null assertion `!` responsibly.
- Use the `satisfies` operator to check a value without widening its type.

# Why It Matters

These features live at the boundaries of the type system: `unknown` at the top (anything), `never` at the bottom (nothing), and assertions where *you* know more than the compiler. Used well, they make code both safe and precise — an exhaustiveness check that fails to compile when you add a case, a `satisfies` that keeps your literal types. Used carelessly, assertions are how bugs sneak back in, so it's worth understanding exactly what each one does.

# Concept Explanation

### `unknown`: the safe top type

You met `unknown` earlier: every value is assignable to it, but you must **narrow** before using it. It's the honest type for values you don't yet understand (parsed JSON, `catch` errors):

```typescript
function process(input: unknown) {
  if (typeof input === 'string') {
    return input.trim(); // narrowed to string
  }
  return String(input);
}
```

Contrast with `any`, which would let you do anything with no check. Prefer `unknown` at every boundary.

### `never`: the bottom type

`never` is the type with **no values** — nothing is assignable to it (except `never` itself). You see it in three places:

1. A function that never returns (always throws or loops forever):

```typescript
function fail(message: string): never {
  throw new Error(message);
}
```

2. A variable narrowed to *impossible*:

```typescript
function f(x: string) {
  if (typeof x === 'number') {
    x; // never — a string can't be a number
  }
}
```

3. **Exhaustiveness checks** — the most useful application. When you handle every case of a union, the "default" case has type `never`; assigning it to a `never` variable makes the compiler error if you ever add a case and forget to handle it:

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'square'; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.side ** 2;
    default: {
      const _exhaustive: never = shape; // errors if a new kind is unhandled
      return _exhaustive;
    }
  }
}
```

Add `{ kind: 'triangle'; … }` to `Shape` and the `default` branch stops compiling — a compile-time reminder to handle it. This pattern is one of TypeScript's most valuable safety nets.

### Type assertions with `as`

Sometimes you know a value's type more precisely than the compiler can. A **type assertion** tells the compiler to treat a value as a given type:

```typescript
const el = document.getElementById('app') as HTMLInputElement;
el.value = 'hi'; // OK — we asserted it's an input
```

An assertion is a **compile-time-only** override — it emits no runtime check and does no conversion. TypeScript allows an assertion only between types that plausibly overlap; to force an unrelated cast you must go through `unknown`:

```typescript
const n = 'hello' as number;            // Error: not sufficiently overlapping
const n2 = 'hello' as unknown as number; // allowed, but a red flag
```

Because assertions bypass checking, treat every `as` as a small promise you're personally responsible for. If it's wrong, you'll get a runtime bug the compiler could have caught. (In `.tsx` files, use `as`; the older `<Type>value` angle-bracket syntax clashes with JSX.)

### The non-null assertion `!`

The postfix `!` asserts that a value is not `null`/`undefined`:

```typescript
function firstChar(text?: string): string {
  return text!.charAt(0); // "trust me, text isn't undefined"
}
```

It's convenient but unsafe — if `text` *is* undefined, this crashes at runtime. Prefer a real check (`if (text)`) or a default; reserve `!` for cases where you can prove non-null but the compiler can't.

### The `satisfies` operator

`satisfies` (added in TypeScript 4.9) checks that a value **conforms to a type without changing the value's inferred type**. It gives you validation *and* keeps precise literal types — something an annotation can't do:

```typescript
type Config = Record<string, string | number>;

// Annotation widens: colors is Config, so colors.red is string | number
const asAnnotated: Config = { red: '#f00', port: 8080 };

// satisfies validates AND preserves the specific inferred types
const colors = {
  red: '#f00',
  port: 8080,
} satisfies Config;

colors.red.toUpperCase(); // OK — red is known to be string
colors.port.toFixed(0);   // OK — port is known to be number
```

With the annotation, `colors.red` would be `string | number` and you couldn't call `.toUpperCase()` directly. With `satisfies`, the object is validated against `Config` *and* keeps its exact member types. Use `satisfies` when you want a type to *check* a value but not *widen* it.

# Key Terminology

- **`unknown`** — the safe top type; must be narrowed before use.
- **`never`** — the bottom type with no values; the return of functions that never return.
- **Exhaustiveness check** — assigning the `default` case to `never` to force handling every union member.
- **Type assertion (`as`)** — a compile-time override of a value's type; no runtime effect.
- **Non-null assertion (`!`)** — asserts a value isn't `null`/`undefined`.
- **`satisfies`** — checks a value against a type without widening the value's inferred type.

# Syntax and Options

| Feature | Syntax | Effect |
| ------- | ------ | ------ |
| Safe top type | `x: unknown` | Must narrow before use |
| Bottom type | `(): never` | Never returns / impossible |
| Exhaustiveness | `const _: never = x` | Errors on unhandled case |
| Assertion | `value as Type` | Compile-time only; no check |
| Force cast | `value as unknown as Type` | Bypasses overlap rule (avoid) |
| Non-null | `value!` | Asserts not null/undefined |
| Satisfies | `value satisfies Type` | Validate, keep inferred type |

# Hands-On Walkthrough

Combine `unknown` at the boundary, an assertion, and `satisfies`:

```typescript
// A palette validated but keeping precise types:
const palette = {
  primary: '#3178C6',
  spacing: 8,
} satisfies Record<string, string | number>;

palette.primary.startsWith('#'); // OK — primary is string
palette.spacing.toFixed(1);      // OK — spacing is number

// A boundary value:
function readName(json: unknown): string {
  if (
    typeof json === 'object' && json !== null &&
    'name' in json && typeof (json as { name: unknown }).name === 'string'
  ) {
    return (json as { name: string }).name;
  }
  throw new Error('No name');
}
```

# Real World Analogy

A **type assertion** is signing a waiver that says "I take responsibility — treat this as an input element." No one checks; if you're wrong, you get hurt at runtime. **`satisfies`** is a **spell-checker that reads your document but doesn't rewrite it** — it confirms everything is valid while leaving your exact words (literal types) intact. **`never`** is the **"this should be impossible" sign**: if code ever reaches it, something upstream changed and the compiler tells you.

# Examples

## Example 1 — Basic: exhaustiveness with `never`

```typescript
type Direction = 'up' | 'down';

function step(d: Direction): number {
  switch (d) {
    case 'up': return 1;
    case 'down': return -1;
    default: {
      const _never: never = d;
      return _never;
    }
  }
}
```

**Why this works:** in the `default` branch, `d` has been narrowed to `never` because both members are handled. If you later add `'left'` to `Direction`, `d` would be `'left'` there — not assignable to `never` — and the file won't compile until you handle it.

## Example 2 — Real-world: `satisfies` for a typed route table

```typescript
type Handler = (req: string) => string;

const routes = {
  '/': (req) => `home ${req}`,
  '/about': (req) => `about ${req}`,
} satisfies Record<string, Handler>;

routes['/'];      // known key; type checked as Handler
// routes['/x'];  // would be flagged as a non-existent key
```

**Why this works:** `satisfies Record<string, Handler>` checks every value is a `Handler`, while keeping `routes` typed with its *specific* keys — so you get both validation and precise key knowledge.

## Example 3 — Best practice / edge case: avoid `as` when narrowing works

```typescript
function lengthOf(value: unknown): number {
  // Bad: unchecked assertion
  // return (value as string).length;

  // Good: narrow instead
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length;
  }
  return 0;
}
```

**Why this works:** the assertion version would crash if `value` weren't a string. Narrowing proves the type at runtime, so it's both safe and type-correct. Prefer narrowing; use `as` only when you truly know more than the compiler.

# Common Mistakes

- **Using `as` to silence an error you don't understand.** Assertions do no runtime check — you may be hiding a real bug.
- **Reaching for `!` by habit.** A wrong non-null assertion crashes at runtime; prefer a real check.
- **Skipping the exhaustiveness check.** Without the `never` default, adding a union member won't force you to handle it.
- **Using an annotation when you meant `satisfies`.** An annotation widens the value's type; `satisfies` validates while preserving it.

# Best Practices

- Accept boundary values as **`unknown`** and narrow them.
- Add a **`never` exhaustiveness check** to every `switch` over a union.
- Treat each **`as`** and **`!`** as a personal promise; prefer narrowing/checks where possible.
- Use **`satisfies`** to validate configuration and tables without losing literal types.

# Summary

- **`unknown`** is the safe top type; narrow before using.
- **`never`** is the bottom type; use it for **exhaustiveness checks** that fail when a case is added.
- A **type assertion (`as`)** is a compile-time-only override with no runtime check — use sparingly.
- The **non-null assertion (`!`)** claims a value isn't null/undefined; prefer real checks.
- **`satisfies`** validates a value against a type while keeping its precise inferred type.

# Flash Cards

Q: What is `never`, and where is it most useful?
A: The bottom type with no values; most useful for exhaustiveness checks — assigning the `default` case to a `never` forces you to handle every union member.

Q: Does a type assertion (`as`) perform a runtime check or conversion?
A: No — it's a compile-time-only override; if you're wrong, the bug surfaces at runtime.

Q: How do you force a cast between unrelated types, and why is it a warning sign?
A: `value as unknown as Type`; it bypasses TypeScript's overlap rule, so you've fully opted out of checking.

Q: What does `satisfies` do that a type annotation does not?
A: It validates a value against a type without widening the value's inferred type, so precise literal/member types are preserved.

Q: When should you avoid the non-null assertion `!`?
A: Whenever a real check or default is possible — a wrong `!` crashes at runtime.

Q: Why prefer `unknown` over `any` for a `catch` clause or parsed JSON?
A: `unknown` forces you to narrow before using the value, preventing silent runtime errors.

# Exercises

### Easy
Write `assertNever(x: never): never { throw new Error('Unexpected: ' + x); }` and use it in the `default` of a `switch` over a two-member union.

### Medium
Create an object `theme` with `{ color: '#000', radius: 4 }` using `satisfies Record<string, string | number>`, then call `.toUpperCase()` on `color` and `.toFixed()` on `radius`. Explain why an annotation would have blocked both.

### Challenging
Given `type Event = { kind: 'a' } | { kind: 'b' } | { kind: 'c' }`, write a `handle` function with a `never` exhaustiveness check. Then add a `{ kind: 'd' }` member and describe the exact compile error you get.

# Further Reading

- [Handbook — `unknown` and `never`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
- [Handbook — Type Assertions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)
- [Handbook — `satisfies` operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)
- [Handbook — Exhaustiveness checking](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking)
