---
id: lesson-12
slug: advanced-function-types
title: "Advanced Function Types"
level: intermediate
order: 12
duration: 28
tags:
  - functions
  - overloads
  - this
  - assertion-functions
  - generics
---

# Learning Objectives

By the end of this lesson you will be able to:

- Write function **overload** signatures for a function that behaves differently by argument shape.
- Type the value of `this` inside a function.
- Write an **assertion function** that narrows a type as a side effect.
- Combine these with generics for precise, reusable APIs.

# Why It Matters

The everyday function typing you learned earlier covers most code. But some functions are trickier: one that returns a different type depending on its arguments, a callback that needs a specific `this`, or a runtime check that should teach the compiler about a value from that point on. These tools — overloads, `this` typing, and assertion functions — let you type those precisely instead of falling back to `any`.

# Concept Explanation

### Function overloads

Some functions accept different argument shapes and return different types. **Overload signatures** describe each allowed way to call the function, followed by a single **implementation signature** that must be compatible with all of them:

```typescript
function toArray(value: string): string[];
function toArray(value: number): number[];
function toArray(value: string | number): string[] | number[] {
  return typeof value === 'string' ? value.split('') : [value];
}

const chars = toArray('hi'); // string[]
const nums = toArray(42);    // number[]
```

Callers see only the two overload signatures. The implementation signature (the third one) is **not** callable from outside — it exists to implement the overloads, so it must handle every case. Overloads shine when the return type *depends on* the input type in a way a single signature can't express.

> Tip: if a union return type would be just as accurate, prefer a single signature — overloads are more work and can hide mistakes. Reach for them when the input/output relationship genuinely varies.

### Typing `this`

In a standalone function that will be called with a particular `this`, you can declare `this` as a **fake first parameter**. It's type-only — it's erased and does not change the real parameters:

```typescript
interface Button {
  label: string;
  onClick(this: Button): void;
}

const button: Button = {
  label: 'Save',
  onClick() {
    console.log(`Clicked ${this.label}`); // this: Button
  },
};
```

Declaring `this: Button` makes `this.label` type-checked and prevents the function from being called with the wrong `this`. This is especially useful for callbacks and event handlers.

### Assertion functions

A normal type guard returns a boolean you check. An **assertion function** instead *throws* if a condition fails, and its special return annotation tells the compiler that, if the function returns at all, the condition held. There are two forms.

**`asserts condition`** — narrows based on a boolean expression:

```typescript
function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) throw new Error(message ?? 'Assertion failed');
}

function use(value: string | undefined) {
  assert(value !== undefined, 'value is required');
  value.toUpperCase(); // value: string — narrowed after the assertion
}
```

**`asserts x is Type`** — narrows a specific value to a type:

```typescript
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') throw new Error('Not a string');
}

function shout(input: unknown) {
  assertIsString(input);
  return input.toUpperCase(); // input: string from here on
}
```

After the assertion call, the compiler treats the value as narrowed for the rest of the scope — no `if` needed. As with type guards, your runtime check must genuinely match the assertion, or you've told the compiler a lie.

### Generic constraints, applied

Combine these ideas with generics for reusable, precise helpers:

```typescript
function assertHasKey<T extends object, K extends PropertyKey>(
  obj: T,
  key: K,
): asserts obj is T & Record<K, unknown> {
  if (!(key in obj)) throw new Error(`Missing key: ${String(key)}`);
}
```

# Key Terminology

- **Overload signature** — one of several public ways to call a function.
- **Implementation signature** — the single body signature that satisfies all overloads (not callable externally).
- **`this` parameter** — a type-only first parameter declaring the type of `this`.
- **Assertion function** — a function that throws on failure and narrows via an `asserts` return type.
- **`asserts condition`** / **`asserts x is T`** — the two assertion-function return forms.

# Syntax and Options

| Feature | Syntax | Purpose |
| ------- | ------ | ------- |
| Overloads | two+ signatures + one impl | Return type varies by input |
| `this` param | `function f(this: T)` | Type `this`; erased at runtime |
| Assert condition | `): asserts condition` | Narrow after a boolean check |
| Assert value | `): asserts x is T` | Narrow a specific value |

# Hands-On Walkthrough

Write an overloaded `parse` and an assertion helper together:

```typescript
function parse(value: string, as: 'number'): number;
function parse(value: string, as: 'boolean'): boolean;
function parse(value: string, as: 'number' | 'boolean'): number | boolean {
  return as === 'number' ? Number(value) : value === 'true';
}

const count = parse('42', 'number');   // number
const flag = parse('true', 'boolean'); // boolean

function assertDefined<T>(value: T | undefined): asserts value is T {
  if (value === undefined) throw new Error('Expected a value');
}

function firstUpper(items: string[]): string {
  const first = items[0]; // string | undefined
  assertDefined(first);
  return first.toUpperCase(); // first: string
}
```

The overloads give `parse` a precise return type per `as` value, and `assertDefined` removes `undefined` without an `if`.

# Real World Analogy

An **assertion function** is a **bouncer with a clipboard**. Before you enter the club (the rest of your code), the bouncer checks your name against the list; if you're not on it, you're thrown out (an exception). If you *do* get in, everyone afterward can safely assume you're a verified guest — no one re-checks. **Overloads** are like a help desk with a sign listing exactly which requests it handles and what each returns, even though one clerk (the implementation) processes them all.

# Examples

## Example 1 — Basic: overloaded return type

```typescript
function wrap(value: string): { text: string };
function wrap(value: number): { amount: number };
function wrap(value: string | number): object {
  return typeof value === 'string' ? { text: value } : { amount: value };
}

wrap('hi').text;   // string
wrap(10).amount;   // number
```

**Why this works:** the two overload signatures let callers get a precisely-shaped object per input type; the implementation handles both. A single signature returning a union couldn't give each caller the exact property.

## Example 2 — Real-world: assertion for runtime input

```typescript
function assertIsUser(value: unknown): asserts value is { id: number; name: string } {
  if (
    typeof value !== 'object' || value === null ||
    typeof (value as any).id !== 'number' ||
    typeof (value as any).name !== 'string'
  ) {
    throw new Error('Invalid user');
  }
}

function handle(payload: unknown) {
  assertIsUser(payload);
  console.log(payload.name); // payload is narrowed to the user shape
}
```

**Why this works:** the assertion validates a value from outside your program (e.g. an API response) at runtime, and its `asserts value is …` return teaches the compiler the shape for the rest of the function.

## Example 3 — Best practice / edge case: typing `this` in a handler

```typescript
function toggle(this: HTMLButtonElement): void {
  this.disabled = !this.disabled; // this is a button
}
```

**Why this works:** declaring `this: HTMLButtonElement` types `this` inside the handler and ensures it's only used where `this` really is a button. The parameter is erased and doesn't affect how the function is called with arguments.

# Common Mistakes

- **Calling the implementation signature directly.** Only the overload signatures are public; the implementation signature isn't part of the callable type.
- **Overusing overloads.** If a union return type is accurate, prefer one signature — overloads are easy to get subtly wrong.
- **Writing a dishonest assertion.** If the runtime check doesn't match the `asserts` type, you've created an unsafe narrowing.
- **Confusing the `this` parameter with a real argument.** It's type-only and erased; callers don't pass it.

# Best Practices

- Use **overloads** only when the return type genuinely depends on the argument shape.
- Prefer **assertion functions** for validating external input once, then using it with confidence.
- Type **`this`** in standalone handlers and callbacks that rely on a specific receiver.
- Keep runtime checks in guards and assertions **honest** — the compiler trusts them.

# Summary

- **Overloads** declare several public call signatures plus one implementation signature (not externally callable).
- A **`this` parameter** types `this` inside a function and is erased.
- **Assertion functions** throw on failure and narrow via `asserts condition` or `asserts x is T` — no `if` needed afterward.
- Combine these with **generics** for precise, reusable APIs, and keep the runtime checks truthful.

# Flash Cards

Q: In an overloaded function, which signature can callers use?
A: Only the overload signatures; the implementation signature exists to implement them and isn't callable from outside.

Q: What does a `this` parameter do, and does it affect the arguments?
A: It types the value of `this` inside the function; it's a type-only first parameter that's erased and doesn't change the real parameters.

Q: How is an assertion function different from a type guard?
A: A type guard returns a boolean you branch on; an assertion function throws on failure and narrows the value for the rest of the scope via an `asserts` return type.

Q: Write the return annotation that narrows `value` to `string` if the function doesn't throw.
A: `asserts value is string`.

Q: When should you prefer a single signature over overloads?
A: When a union return type is just as accurate — overloads add complexity and can hide mistakes.

Q: What happens if an assertion function's runtime check doesn't match its `asserts` type?
A: The compiler still trusts the assertion, producing an unsafe narrowing that can crash at runtime.

# Exercises

### Easy
Write an assertion function `assertNonEmpty(arr: unknown[]): asserts arr is [unknown, ...unknown[]]` that throws on an empty array, and use it before reading `arr[0]`.

### Medium
Write an overloaded `createElement` where `createElement('a')` returns `HTMLAnchorElement` and `createElement('div')` returns `HTMLDivElement` (you can return `document.createElement(tag)` in the implementation).

### Challenging
Write `assertIsArrayOf<T>(value: unknown, guard: (x: unknown) => x is T): asserts value is T[]` that validates an array where every element passes `guard`, then narrows `value` to `T[]`.

# Further Reading

- [Handbook — Function Overloads](https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads)
- [Handbook — `this` Parameters](https://www.typescriptlang.org/docs/handbook/2/functions.html#declaring-this-in-a-function)
- [Handbook — Assertion Functions](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions)
