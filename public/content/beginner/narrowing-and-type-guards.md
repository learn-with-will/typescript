---
id: lesson-08
slug: narrowing-and-type-guards
title: "Narrowing and Type Guards"
level: beginner
order: 8
duration: 28
tags:
  - narrowing
  - type-guards
  - discriminated-unions
  - typeof
  - instanceof
---

# Learning Objectives

By the end of this lesson you will be able to:

- Narrow a value with `typeof`, truthiness, equality, `in`, and `instanceof`.
- Design a **discriminated union** and switch over it.
- Write your own **type guard** function with a `value is Type` predicate.
- Understand how narrowing makes union types safe to use.

# Why It Matters

Union types describe what a value *might* be; **narrowing** is how you safely find out what it *is* right now. Every branch of an `if`, every `case` of a `switch`, can teach the compiler the exact type in that spot. Master narrowing and you can work with rich union types confidently — the compiler tracks the type for you and stops you touching a property that isn't there.

# Concept Explanation

TypeScript watches your control flow and refines a value's type inside checks. This is **control-flow analysis**. Here are the tools that trigger it.

### `typeof` narrowing

Best for primitives:

```typescript
function double(x: string | number): string | number {
  if (typeof x === 'number') return x * 2; // x: number
  return x.repeat(2);                       // x: string
}
```

### Truthiness narrowing

A plain truthiness check removes `null`, `undefined`, `0`, `''`, etc.:

```typescript
function greet(name?: string) {
  if (name) {
    console.log(name.toUpperCase()); // name: string (not undefined)
  }
}
```

### Equality narrowing

Comparing values narrows both sides:

```typescript
function example(x: string | number, y: string | boolean) {
  if (x === y) {
    // both must be string here — the only overlapping type
    x.toUpperCase();
    y.toUpperCase();
  }
}
```

### The `in` operator

Checks whether a property exists, narrowing object unions:

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ('swim' in animal) {
    animal.swim(); // animal: Fish
  } else {
    animal.fly();  // animal: Bird
  }
}
```

### `instanceof` narrowing

For class instances and built-ins:

```typescript
function toISO(date: Date | string): string {
  if (date instanceof Date) return date.toISOString(); // date: Date
  return date;                                          // date: string
}
```

### Discriminated unions

The most powerful pattern: give each member of a union a **common literal property** (the *discriminant*, often called `kind` or `type`). Switching on that property narrows the whole object:

```typescript
type Circle = { kind: 'circle'; radius: number };
type Square = { kind: 'square'; side: number };
type Shape = Circle | Square;

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2; // shape: Circle
    case 'square':
      return shape.side ** 2;             // shape: Square
  }
}
```

Because `kind` is a literal type unique to each member, `case 'circle'` narrows `shape` to `Circle`, so `shape.radius` is available and `shape.side` would error. This pattern scales cleanly to many cases and is the idiomatic way to model "a value that is one of several kinds of thing."

### User-defined type guards

Sometimes the check is too complex for the built-ins. Write a function whose return type is a **type predicate** `value is Type`:

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function isFish(animal: Fish | Bird): animal is Fish {
  return 'swim' in animal;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim(); // narrowed to Fish by the predicate
  } else {
    animal.fly();
  }
}
```

When `isFish` returns `true`, the compiler treats the argument as `Fish`. You are responsible for making the runtime check actually match the predicate — a guard that lies leads to unsafe code.

# Key Terminology

- **Narrowing** — refining a value to a more specific type inside a check.
- **Control-flow analysis** — how TypeScript tracks a value's type across branches.
- **Discriminant** — a common literal property that distinguishes union members.
- **Discriminated (tagged) union** — a union whose members share a discriminant.
- **Type predicate** — a return type `value is Type` that narrows the argument.
- **Type guard** — a check (built-in or user-defined) that narrows a type.

# Syntax and Options

| Tool | Narrows | Example |
| ---- | ------- | ------- |
| `typeof x === 'number'` | Primitives | `string \| number` → `number` |
| `if (x)` | Truthy values | removes `null`/`undefined`/`0`/`''` |
| `x === y` | Both operands | to the overlap |
| `'prop' in obj` | Object unions | member with that property |
| `x instanceof C` | Class instances | to `C` |
| `switch (x.kind)` | Discriminated unions | to the matching member |
| `x is Type` | Custom | user-defined guard function |

# Hands-On Walkthrough

Design a discriminated union for an async result and handle each case:

```typescript
type Result =
  | { status: 'loading' }
  | { status: 'success'; data: string[] }
  | { status: 'error'; message: string };

function render(result: Result): string {
  switch (result.status) {
    case 'loading':
      return 'Loading…';
    case 'success':
      return `Loaded ${result.data.length} items`; // data available
    case 'error':
      return `Error: ${result.message}`;           // message available
  }
}

render({ status: 'success', data: ['a', 'b'] }); // "Loaded 2 items"
```

Each `case` narrows `result` to exactly one member, so `result.data` and `result.message` are only accessible where they exist. Try reading `result.data` in the `'error'` case and the compiler will stop you.

# Real World Analogy

Narrowing is **airport security sorting passengers**. Everyone starts as "a traveler" (the union). At each checkpoint a question — "domestic or international?", "passport shows a visa?" — routes each person into a more specific line where you know exactly what applies to them. A discriminant is the boarding-pass label that instantly tells the agent which gate you belong to.

# Examples

## Example 1 — Basic: `typeof` guard

```typescript
function pad(value: string | number): string {
  return typeof value === 'number' ? String(value).padStart(3, '0') : value;
}

pad(7);    // "007"
pad('hi'); // "hi"
```

**Why this works:** `typeof value === 'number'` narrows `value` to `number` in the first branch and to `string` in the second, so each branch uses only valid operations.

## Example 2 — Real-world: discriminated union for events

```typescript
type UiEvent =
  | { type: 'click'; x: number; y: number }
  | { type: 'keypress'; key: string };

function handle(event: UiEvent): string {
  switch (event.type) {
    case 'click':
      return `Click at ${event.x},${event.y}`;
    case 'keypress':
      return `Key ${event.key}`;
  }
}
```

**Why this works:** the shared `type` discriminant lets a single `switch` handle every event kind, with the correct extra properties available in each branch. Adding a new event kind and forgetting to handle it can be caught with an exhaustiveness check (later lesson).

## Example 3 — Best practice / edge case: a reusable type guard

```typescript
function isNonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

const values = ['a', null, 'b', undefined];
const clean = values.filter(isNonNull); // string[]
```

**Why this works:** the predicate `value is T` tells the compiler that `filter` removes `null`/`undefined`, so the result narrows from `(string | null | undefined)[]` to `string[]`. A generic guard like this is a common, reusable helper.

# Common Mistakes

- **Using a union member's property without narrowing.** Access is only allowed after a guard proves the member.
- **Forgetting the discriminant.** Without a shared literal property, a `switch` can't narrow the union — add a `kind`/`type` field.
- **Writing a lying type guard.** If `isFish` returns `true` for a bird, the compiler trusts it and you get an unsafe cast. Make the runtime check match the predicate.
- **Relying on truthiness for `0` or `''`.** `if (count)` skips `0`; use an explicit `!= null` check when zero/empty are valid.

# Best Practices

- Model "one of several kinds" as a **discriminated union** with a `kind`/`type` field.
- Prefer built-in guards (`typeof`, `in`, `instanceof`) before writing custom ones.
- Write **type guards** for checks you repeat, and keep the runtime logic honest.
- Handle **every** union member; add an exhaustiveness check so new members can't be forgotten.

# Summary

- **Narrowing** refines a union inside checks; TypeScript tracks it via control-flow analysis.
- Tools: `typeof`, truthiness, equality, `in`, `instanceof`.
- A **discriminated union** shares a literal discriminant, so a `switch` narrows each case.
- A **type guard** function returns `value is Type` to narrow its argument — keep the runtime check truthful.

# Flash Cards

Q: What is narrowing?
A: Refining a value to a more specific type inside a check (like an `if` or `switch`), so member-specific operations become safe.

Q: Which operator narrows an object union by checking for a property?
A: The `in` operator, e.g. `if ('swim' in animal)`.

Q: What makes a union a "discriminated" union?
A: Each member shares a common literal property (the discriminant, e.g. `kind: 'circle'`) that a `switch` can narrow on.

Q: How do you write a custom type guard?
A: A function returning a type predicate: `function isA(x: A | B): x is A { … }`.

Q: Why is a lying type guard dangerous?
A: The compiler trusts the predicate; if the runtime check doesn't actually match the type, you get an unsafe narrowing and possible runtime errors.

Q: Which narrows a class instance: `typeof` or `instanceof`?
A: `instanceof` — `typeof` is for primitives; `instanceof` narrows to a class type.

# Exercises

### Easy
Write `len(x: string | string[]): number` that returns `x.length` for both — then explain why no narrowing is needed here, and when it would be.

### Medium
Define `type Shape = { kind: 'rect'; w: number; h: number } | { kind: 'circle'; r: number }` and write `area(shape): number` using a `switch` on `kind`.

### Challenging
Write a generic type guard `isDefined<T>(v: T | undefined): v is T` and use it with `Array.prototype.filter` to turn a `(number | undefined)[]` into a `number[]`. Explain how the predicate changes the result type.

# Further Reading

- [Handbook — Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [Handbook — Discriminated Unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [Handbook — Type Predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
