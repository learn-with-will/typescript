---
id: lesson-11
slug: enums-and-const-assertions
title: "Enums and const Assertions"
level: intermediate
order: 11
duration: 26
tags:
  - enums
  - const-enum
  - as-const
  - literal-unions
  - runtime
---

# Learning Objectives

By the end of this lesson you will be able to:

- Declare numeric and string enums and know what they emit at runtime.
- Explain the reverse mapping of numeric enums.
- Understand the `const enum` caveat.
- Use `as const` to lock a value to literal types.
- Decide between an enum, a literal union, and an `as const` object.

# Why It Matters

Enums are one of the few TypeScript features that generate runtime code, so they behave differently from the types you've met so far. They're handy, but they come with surprises — and in many cases a **union of literals** or an **`as const` object** does the same job with a smaller footprint and fewer gotchas. Knowing the trade-offs lets you pick the right tool instead of reaching for `enum` by habit.

# Concept Explanation

### Numeric enums

An `enum` names a set of related constants. By default the members are numbers, auto-numbered from `0`:

```typescript
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

const move = Direction.Up; // Direction (value 0)
```

Unlike almost everything else in this course, an enum **emits a runtime object**. And a numeric enum gets a **reverse mapping** — the object maps names to values *and* values back to names:

```typescript
Direction.Up;        // 0
Direction[0];        // "Up"  — reverse mapping
```

### String enums

Give members string values for readable, debuggable output. String enums do **not** get a reverse mapping:

```typescript
enum Status {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
}

Status.Active;        // "ACTIVE"
// Status['ACTIVE'];  // not a name-lookup — no reverse mapping for string enums
```

### The `const enum` caveat

A `const enum` is **inlined** at compile time — the compiler replaces each usage with its literal value and emits no enum object at all:

```typescript
const enum Size {
  Small,
  Large,
}
const s = Size.Large; // compiles to: const s = 1;
```

That sounds efficient, but it comes with real caveats. Inlining requires the compiler to see the enum's definition, which breaks under **`isolatedModules`** — the single-file transpilation mode that many bundlers (esbuild, SWC, Babel) rely on. For that reason, `const enum` is often discouraged in application code. If you use enums, a plain `enum` is the safer default; if you want zero runtime cost, prefer the `as const` object pattern below.

### `as const` assertions

An **`as const`** assertion tells TypeScript to infer the **narrowest, deeply read-only** type for a literal — keeping literal types instead of widening them:

```typescript
const point = { x: 1, y: 2 };
// type: { x: number; y: number }

const frozen = { x: 1, y: 2 } as const;
// type: { readonly x: 1; readonly y: 2 }

const sizes = ['small', 'medium', 'large'] as const;
// type: readonly ['small', 'medium', 'large']
```

This is the key to turning runtime data into precise types. A common pattern replaces an enum entirely:

```typescript
const Roles = {
  Admin: 'admin',
  Editor: 'editor',
  Viewer: 'viewer',
} as const;

type Role = (typeof Roles)[keyof typeof Roles];
// type Role = 'admin' | 'editor' | 'viewer'
```

`Roles` is a normal object at runtime (no special enum semantics), and `Role` is a literal union derived from it. You get named constants *and* a precise type, with nothing exotic emitted. (We unpack `typeof` and `keyof` in an advanced lesson; here they extract the union for you.)

### Choosing between them

- **Literal union** (`type Size = 'sm' | 'md' | 'lg'`) — simplest; no runtime cost; great when you only need the type.
- **`as const` object** — when you also want named runtime constants and a derived union.
- **`enum`** — when you specifically want enum semantics (e.g. a numeric enum with reverse mapping, or an established codebase convention). Prefer plain `enum` over `const enum`.

# Key Terminology

- **Enum** — a named set of constants that emits a runtime object.
- **Reverse mapping** — a numeric enum's value → name lookup.
- **`const enum`** — an inlined enum with no runtime object (has caveats).
- **`isolatedModules`** — single-file transpile mode that conflicts with `const enum`.
- **`as const`** — an assertion producing the narrowest, deeply read-only literal type.
- **Literal union** — a union of literal types used instead of an enum.

# Syntax and Options

| Feature | Syntax | Runtime |
| ------- | ------ | ------- |
| Numeric enum | `enum E { A, B }` | Object with reverse mapping |
| String enum | `enum E { A = 'a' }` | Object, no reverse mapping |
| `const enum` | `const enum E { A }` | Inlined; no object (caveats) |
| `as const` | `[...] as const` | Normal value; narrow readonly type |
| Literal union | `type T = 'a' \| 'b'` | Type only; no runtime |

# Hands-On Walkthrough

Compare a string enum with the `as const` pattern:

```typescript
// Enum version
enum Level {
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
}
function logEnum(level: Level) { /* ... */ }
logEnum(Level.Warn);

// as const version
const Level2 = { Info: 'info', Warn: 'warn', Error: 'error' } as const;
type Level2 = (typeof Level2)[keyof typeof Level2]; // 'info' | 'warn' | 'error'
function logConst(level: Level2) { /* ... */ }
logConst('warn');       // accepts the plain string
logConst(Level2.Warn);  // and the named constant
```

Both are type-safe. The `as const` version emits an ordinary object and its type is a plain string union, so it interoperates naturally with plain strings from JSON or an API.

# Real World Analogy

An `enum` is a **vending machine** installed in your building: it's a real object at runtime with slots and a coin return (the reverse mapping). An **`as const` object** is a **laminated price list** taped to the wall — just the named values, no machinery. A **literal union** is the price list existing only in the manager's head (compile time): everyone knows the allowed prices, but there's nothing physical at all.

# Examples

## Example 1 — Basic: numeric enum reverse mapping

```typescript
enum HttpCode {
  OK = 200,
  NotFound = 404,
}

HttpCode.NotFound; // 404
HttpCode[404];     // "NotFound" — reverse mapping
```

**Why this works:** numeric enums emit an object that maps both directions, so you can look up the name from the value. (String enums don't provide this.)

## Example 2 — Real-world: an `as const` config with a derived type

```typescript
const Theme = {
  Light: 'light',
  Dark: 'dark',
} as const;

type Theme = (typeof Theme)[keyof typeof Theme]; // 'light' | 'dark'

function applyTheme(theme: Theme) { /* ... */ }
applyTheme(Theme.Dark); // OK
applyTheme('light');    // OK — plain string also fits
```

**Why this works:** `as const` freezes the object's values to literal types, and indexing by `keyof typeof` extracts them into a union. The result is a normal object plus a precise type — no enum runtime semantics needed.

## Example 3 — Best practice / edge case: prefer a literal union when you only need the type

```typescript
type Alignment = 'left' | 'center' | 'right';

function align(text: string, how: Alignment): string {
  /* ... */
  return text;
}

align('hi', 'center'); // OK
align('hi', 'top');    // Error: not assignable to Alignment
```

**Why this works:** if you never need runtime constants, a literal union is the leanest option — zero runtime code and full checking. Reach for enums or `as const` only when you also want named values at runtime.

# Common Mistakes

- **Forgetting enums emit runtime code.** Unlike types, an `enum` produces an object; a numeric one even adds reverse-mapping entries.
- **Using `const enum` under a bundler.** It often breaks with `isolatedModules`; prefer a plain `enum` or the `as const` pattern.
- **Expecting string enums to reverse-map.** Only numeric enums do.
- **Forgetting `as const`.** Without it, `['a','b']` widens to `string[]` and object values widen to `string`, losing the literal types you wanted.

# Best Practices

- Default to a **literal union** when you need only the type.
- Use an **`as const` object** when you also want named runtime constants and a derived union.
- If you use enums, prefer a plain **`enum`** and avoid **`const enum`** in bundler-based projects.
- Prefer **string** enum values over numeric when the runtime value should be readable.

# Summary

- **Numeric enums** auto-number from 0 and emit an object with a **reverse mapping**; **string enums** don't reverse-map.
- **`const enum`** inlines values (no runtime object) but conflicts with `isolatedModules` — use with care.
- **`as const`** produces the narrowest, deeply read-only literal type — the key to deriving unions from runtime data.
- Choose **literal unions** for type-only needs, **`as const` objects** for named constants, and **enums** when you want enum semantics.

# Flash Cards

Q: What runtime artifact does a numeric enum produce?
A: An object mapping names to values and, via reverse mapping, values back to names.

Q: Do string enums have a reverse mapping?
A: No — only numeric enums map values back to names.

Q: Why can `const enum` be problematic?
A: It's inlined at compile time and conflicts with `isolatedModules`, the single-file transpile mode many bundlers use.

Q: What does `as const` do to `['a', 'b']`?
A: It infers the narrowest deeply read-only type: `readonly ['a', 'b']`, keeping the literal element types instead of widening to `string[]`.

Q: How do you derive a `'admin' | 'editor'` union from an `as const` object of roles?
A: `type Role = (typeof Roles)[keyof typeof Roles]`.

Q: When is a plain literal union the best choice over an enum?
A: When you only need the type and no runtime constants — it emits no code and is fully checked.

# Exercises

### Easy
Write a numeric `enum Weekday` with the seven days and log both `Weekday.Monday` and the reverse lookup for its value.

### Medium
Replace a string enum `enum Color { Red='red', Green='green', Blue='blue' }` with an `as const` object plus a derived `Color` union type. Confirm a function typed to `Color` accepts both `Color.Red`-style and plain `'red'`-style values.

### Challenging
Explain, with a two-line example, why `const enum` might break in a project bundled by esbuild, and rewrite that enum using the `as const` pattern to avoid the issue.

# Further Reading

- [Handbook — Enums](https://www.typescriptlang.org/docs/handbook/enums.html)
- [Handbook — `const` Assertions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
- [Handbook — `const enum` pitfalls / `isolatedModules`](https://www.typescriptlang.org/tsconfig/#isolatedModules)
