---
id: lesson-06
slug: union-and-literal-types
title: "Union and Literal Types"
level: beginner
order: 6
duration: 24
tags:
  - union-types
  - literal-types
  - narrowing
  - widening
  - typeof
---

# Learning Objectives

By the end of this lesson you will be able to:

- Write a union type for a value that can be one of several types.
- Use literal types to restrict a value to exact values.
- Combine literal types into a union of allowed options.
- Explain literal **widening** and how `const` prevents it.
- Narrow a union with `typeof` before using it.

# Why It Matters

Real values are often "one of a few things": a status that is `"active"` or `"archived"`, an id that's a `string` or a `number`, a setting that's `"small" | "medium" | "large"`. Union and literal types let you model exactly those possibilities — no more, no less — so the compiler stops you from using a value that isn't on the list, and makes you handle each case you *did* allow.

# Concept Explanation

### Union types

A **union** type, written with `|`, means "this value is one of these types":

```typescript
let id: string | number;
id = 'abc'; // OK
id = 123;   // OK
id = true;  // Error: Type 'boolean' is not assignable to type 'string | number'.
```

You can only use operations valid for **every** member of the union until you narrow it (next section):

```typescript
function printId(id: string | number) {
  console.log(id.toUpperCase());
  // Error: Property 'toUpperCase' does not exist on type 'number'.
}
```

### Literal types

A **literal type** is a single, exact value used as a type. `'active'` is a type that only the string `"active"` satisfies:

```typescript
let status: 'active';
status = 'active';   // OK
status = 'archived'; // Error
```

On its own that's not very useful — but combine literals into a union and you get a precise set of allowed options:

```typescript
type Status = 'active' | 'archived' | 'draft';

function setStatus(status: Status) {
  /* ... */
}

setStatus('active');  // OK
setStatus('deleted'); // Error: Argument of type '"deleted"' is not
                      // assignable to parameter of type 'Status'.
```

Literal types work for numbers and booleans too:

```typescript
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
type Answer = true | false; // (just boolean, but shown for clarity)
```

This is often a better tool than an enum for a fixed set of string options — we compare them in a later lesson.

### Literal widening

By default, a `let` variable **widens** a literal to its general type, because you can reassign it:

```typescript
let a = 'active'; // inferred as string (widened)
a = 'anything';   // allowed
```

A `const` cannot be reassigned, so TypeScript keeps the **narrow literal type**:

```typescript
const b = 'active'; // inferred as the literal type 'active'
```

This matters when passing values around. If a function expects `Status`, a `const` literal fits directly, but a `let` variable typed as `string` does not — you'd annotate it or use `as const` (covered later).

### Narrowing a union with `typeof`

To use a value whose type is a union, first check which member you have. The `typeof` operator narrows primitives:

```typescript
function printId(id: string | number): string {
  if (typeof id === 'string') {
    return id.toUpperCase(); // id is string here
  }
  return id.toFixed(0);      // id is number here
}
```

Inside each branch, TypeScript **narrows** `id` to the matching type, so the operations are safe. Narrowing is a big topic with its own lesson; `typeof` is the first tool.

# Key Terminology

- **Union type** — `A | B`, a value that is one of several types.
- **Literal type** — a single exact value used as a type (e.g. `'active'`, `42`).
- **Union of literals** — a set of allowed exact values (e.g. `'sm' | 'md' | 'lg'`).
- **Widening** — inferring a general type (`string`) instead of a literal (`'active'`).
- **Narrowing** — refining a union to a specific member inside a check.
- **`typeof` (narrowing)** — a runtime check that tells the compiler a value's primitive type.

# Syntax and Options

| Feature | Example | Meaning |
| ------- | ------- | ------- |
| Union | `string \| number` | One of the listed types |
| String literal | `'active'` | Only that exact string |
| Numeric literal | `404` | Only that exact number |
| Union of literals | `'a' \| 'b' \| 'c'` | A fixed set of options |
| `const` literal | `const s = 'a'` | Keeps literal type `'a'` |
| `let` widening | `let s = 'a'` | Widens to `string` |

# Hands-On Walkthrough

Model a resizable UI element:

```typescript
type Size = 'small' | 'medium' | 'large';

function heightFor(size: Size): number {
  switch (size) {
    case 'small':
      return 24;
    case 'medium':
      return 32;
    case 'large':
      return 48;
  }
}

console.log(heightFor('medium')); // 32
// heightFor('huge'); // Error: '"huge"' is not assignable to 'Size'
```

Now see widening bite, and fix it:

```typescript
let chosen = 'small'; // widened to string
// heightFor(chosen); // Error: string is not assignable to Size

const picked = 'small'; // literal 'small'
heightFor(picked);      // OK
```

# Real World Analogy

A union of literals is a **drop-down menu**. The menu offers a fixed set of choices — "Small / Medium / Large" — and you cannot type in your own option. A plain `string` is a **free-text box**: anything goes. Literal unions turn a free-text box into a drop-down, so invalid choices are impossible instead of merely discouraged.

# Examples

## Example 1 — Basic: a union parameter

```typescript
function formatId(id: string | number): string {
  return `ID-${id}`;
}

formatId('abc'); // "ID-abc"
formatId(42);    // "ID-42"
```

**Why this works:** template-string interpolation is valid for both `string` and `number`, so no narrowing is needed here. Both members support the operation, so the compiler is satisfied.

## Example 2 — Real-world: a fixed set of statuses

```typescript
type RequestState = 'idle' | 'loading' | 'success' | 'error';

function label(state: RequestState): string {
  const labels: Record<RequestState, string> = {
    idle: 'Ready',
    loading: 'Loading…',
    success: 'Done',
    error: 'Failed',
  };
  return labels[state];
}
```

**Why this works:** `RequestState` enumerates exactly the states your UI supports. Using it as the key type of a `Record` means the compiler checks you provided a label for *every* state — miss one and it errors.

## Example 3 — Best practice / edge case: `const` keeps the literal type

```typescript
type Method = 'GET' | 'POST';

function request(method: Method, url: string) {
  /* ... */
}

const method = 'GET';   // literal 'GET'
request(method, '/api'); // OK

let mutable = 'GET';    // widened to string
// request(mutable, '/api'); // Error: string not assignable to Method
```

**Why this works:** `const method` can never change, so TypeScript keeps its precise literal type `'GET'`, which fits `Method`. A `let` variable could be reassigned, so it widens to `string` and no longer fits.

# Common Mistakes

- **Using a union member's method without narrowing.** `id.toUpperCase()` on `string | number` errors — narrow first.
- **Expecting `let x = 'a'` to keep the literal type.** It widens to `string`; use `const` (or annotate) to keep `'a'`.
- **Reaching for a plain `string` when a small fixed set exists.** A literal union catches invalid values that a `string` would let through.
- **Forgetting to handle every case.** With unions, cover each member (a `switch` plus an exhaustiveness check, shown in later lessons).

# Best Practices

- Model fixed sets of options as **unions of literal types**.
- Use **`const`** (or an annotation) when you need a value to keep its literal type.
- **Narrow** a union before using member-specific operations.
- Pair literal unions with `Record<Union, T>` to force handling of every option.

# Summary

- A **union** (`A | B`) allows a value to be one of several types; you must narrow before using member-specific operations.
- A **literal type** is a single exact value; a **union of literals** is a precise set of allowed options.
- `let` **widens** a literal to its general type; `const` keeps the literal.
- `typeof` is the first tool for **narrowing** a union.

# Flash Cards

Q: What does the union type `string | number` allow?
A: A value that is either a string or a number — and only operations valid for both until you narrow it.

Q: What is a literal type?
A: A single exact value used as a type, e.g. `'active'` is a type only the string "active" satisfies.

Q: Why does `let x = 'active'` have type `string` but `const x = 'active'` have type `'active'`?
A: `let` can be reassigned, so the literal widens to `string`; `const` can't change, so the narrow literal type is kept.

Q: How do you narrow `string | number` to use `.toUpperCase()`?
A: Check `if (typeof id === 'string')`; inside that branch the value is narrowed to `string`.

Q: Why prefer a literal union over `string` for a size setting?
A: It restricts the value to the exact allowed options, turning invalid values into compile-time errors.

Q: How can you force handling of every member of a literal union?
A: Use it as the key type of a `Record`, e.g. `Record<Status, string>`, so the compiler requires an entry for each.

# Exercises

### Easy
Define `type Direction = 'up' | 'down' | 'left' | 'right'` and a function `move(d: Direction)`. Call it with a valid and an invalid value; read the error.

### Medium
Write `describe(value: string | number | boolean): string` that returns a different sentence for each type, using `typeof` to narrow.

### Challenging
Given `type Level = 'info' | 'warn' | 'error'`, build a `Record<Level, number>` mapping each level to a numeric severity, and a function `severity(level: Level): number`. Remove one entry from the record and explain the resulting error.

# Further Reading

- [Handbook — Unions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [Handbook — Literal Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)
- [Handbook — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
