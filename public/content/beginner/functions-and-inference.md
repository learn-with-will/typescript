---
id: lesson-04
slug: functions-and-inference
title: "Functions and Inference"
level: beginner
order: 4
duration: 26
tags:
  - functions
  - parameters
  - return-types
  - inference
  - void
---

# Learning Objectives

By the end of this lesson you will be able to:

- Annotate function parameters and return types.
- Use optional, default, and rest parameters correctly.
- Understand what `void` means for a return type.
- Write a function type expression.
- Explain contextual typing — how TypeScript types callback parameters for you.

# Why It Matters

Functions are where types earn their keep. A function's parameter types document what it needs and reject bad calls; its return type tells every caller what they'll get back. Type a function well and everything that uses it becomes safer and self-documenting — often without a single annotation at the call site.

# Concept Explanation

### Typing parameters and returns

Annotate each parameter; the return type is usually **inferred** from what you return:

```typescript
function add(a: number, b: number) {
  return a + b; // return type inferred as number
}
```

You *can* annotate the return type, and doing so is a good idea for public functions — it makes the compiler check that your implementation actually returns what you promised:

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

Arrow functions work the same way:

```typescript
const multiply = (a: number, b: number): number => a * b;
```

### Optional parameters

A parameter marked with `?` may be omitted; inside the function its type includes `undefined`:

```typescript
function greet(name: string, greeting?: string): string {
  return `${greeting ?? 'Hello'}, ${name}`;
}

greet('Ada');            // "Hello, Ada"
greet('Ada', 'Welcome'); // "Welcome, Ada"
```

Here `greeting` has type `string | undefined`, so we supply a fallback with `??`. Optional parameters must come **after** required ones.

### Default parameters

A default value makes a parameter optional *and* gives it a value when omitted. You don't write `?`:

```typescript
function greet(name: string, greeting = 'Hello'): string {
  return `${greeting}, ${name}`;
}
```

TypeScript infers `greeting` as `string` from the default, and callers may skip it.

### Rest parameters

Collect any number of trailing arguments into an array with `...`:

```typescript
function sum(...values: number[]): number {
  return values.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4); // 10
```

### `void` return type

A function that doesn't return a useful value has the return type `void`:

```typescript
function log(message: string): void {
  console.log(message);
}
```

`void` means "ignore whatever this returns." It's what you'll see on functions used purely for their side effects.

### Function type expressions

You can describe the *type* of a function — for a variable, a parameter, or a property — with the arrow syntax `(params) => returnType`:

```typescript
let operation: (a: number, b: number) => number;
operation = add;      // OK
operation = multiply; // OK
```

This is how you type a callback: a function that takes another function.

### Contextual typing

When TypeScript already knows the expected function type from context, it **infers the parameter types for you** — you don't annotate them:

```typescript
const numbers = [1, 2, 3];
numbers.map((n) => n * 2); // n is inferred as number
```

Because `map` on a `number[]` expects a callback whose parameter is a `number`, TypeScript types `n` automatically. This is called **contextual typing**, and it's why idiomatic TypeScript callbacks are so clean.

# Key Terminology

- **Parameter type** — the declared type of a function input.
- **Return type** — the type a function produces; usually inferred.
- **Optional parameter** — one marked `?` that may be omitted (type includes `undefined`).
- **Default parameter** — one with a default value, making it optional.
- **Rest parameter** — `...name: T[]`, collecting extra arguments into an array.
- **`void`** — the return type of a function that returns no useful value.
- **Function type expression** — `(a: T) => R`, the type of a function.
- **Contextual typing** — inferring a callback's parameter types from the surrounding context.

# Syntax and Options

| Feature | Syntax | Notes |
| ------- | ------ | ----- |
| Parameter type | `(a: number)` | Annotate inputs |
| Return type | `): number {` | Often inferred; annotate public APIs |
| Optional | `(greeting?: string)` | Type includes `undefined`; must follow required |
| Default | `(greeting = 'Hi')` | Optional; no `?` |
| Rest | `(...values: number[])` | Must be last |
| `void` | `): void {` | No useful return |
| Function type | `(a: number) => number` | Type of a function/callback |

# Hands-On Walkthrough

Build a small function that uses several of these features:

```typescript
function formatList(
  items: string[],
  separator = ', ',
  prefix?: string,
): string {
  const body = items.join(separator);
  return prefix ? `${prefix}: ${body}` : body;
}

formatList(['a', 'b', 'c']);              // "a, b, c"
formatList(['a', 'b', 'c'], ' | ');       // "a | b | c"
formatList(['a', 'b'], ', ', 'Letters');  // "Letters: a, b"
```

Now pass it to something that expects a callback, and watch contextual typing at work:

```typescript
const rows = [['a', 'b'], ['c', 'd']];
const formatted = rows.map((row) => formatList(row));
// `row` is inferred as string[] — no annotation needed
console.log(formatted); // ["a, b", "c, d"]
```

# Real World Analogy

A function signature is a **job posting**. The parameters are the required skills ("must have two numbers"); optional and default parameters are "nice-to-haves with a sensible default"; the return type is what the role delivers. A caller who doesn't meet the requirements is turned away at compile time — no interview needed.

# Examples

## Example 1 — Basic: optional vs default

```typescript
function power(base: number, exponent = 2): number {
  return base ** exponent;
}

power(5);    // 25 — exponent defaulted to 2
power(5, 3); // 125
```

**Why this works:** the default value `2` makes `exponent` optional and gives it a concrete `number` type. Callers may omit it, and inside the function it is never `undefined`.

## Example 2 — Real-world: a typed callback

```typescript
function retry(times: number, action: () => boolean): boolean {
  for (let i = 0; i < times; i++) {
    if (action()) return true;
  }
  return false;
}

retry(3, () => Math.random() > 0.5);
```

**Why this works:** `action: () => boolean` is a function type expression. It documents that `retry` needs a no-argument function returning a boolean, and the compiler checks the callback matches — including that it returns a boolean.

## Example 3 — Best practice / edge case: annotate the return type of a public function

```typescript
function parseAge(input: string): number {
  const n = Number(input);
  return Number.isNaN(n) ? 0 : n;
}
```

**Why this works:** annotating `: number` makes the compiler verify *every* return path yields a number. If you later added a branch that returned `undefined` by mistake, the annotation would catch it — inference alone would silently widen the return type instead.

# Common Mistakes

- **Putting an optional parameter before a required one.** `(a?: string, b: string)` is an error; optionals come last.
- **Confusing `?` and defaults.** Use `?` for "may be `undefined`"; use a default value for "use this when omitted." Don't write both.
- **Forgetting a callback's parameters are contextually typed.** You usually don't (and shouldn't) re-annotate `n` in `map((n) => …)`.
- **Ignoring the return type on important functions.** Without it, a wrong return path may widen the type instead of erroring.

# Best Practices

- Annotate **parameters**; let **return types** infer, except on public APIs where an explicit return type is a helpful contract.
- Prefer **default parameters** over manual `if (x === undefined)` checks.
- Use **rest parameters** instead of the old `arguments` object.
- Lean on **contextual typing** for callbacks — cleaner and just as safe.

# Summary

- Annotate parameters; return types are usually inferred (annotate public ones).
- `?` marks an optional parameter (`T | undefined`); a default value also makes it optional.
- Rest parameters (`...args: T[]`) collect extra arguments and must be last.
- `void` is the return type of side-effect-only functions.
- A function type is written `(a: T) => R`.
- **Contextual typing** infers callback parameter types from context.

# Flash Cards

Q: Do you usually annotate a function's return type?
A: No — it's inferred. Annotate it on public functions so the compiler checks every return path.

Q: What is the difference between `greeting?: string` and `greeting = 'Hi'`?
A: `?` makes the parameter optional with type `string | undefined`; a default makes it optional and supplies a value, so it's never `undefined` inside.

Q: How do you collect an unknown number of arguments into an array?
A: A rest parameter: `function f(...values: number[])`. It must be the last parameter.

Q: What does a `void` return type mean?
A: The function returns no useful value; callers should ignore whatever it returns.

Q: What is contextual typing?
A: TypeScript inferring a callback's parameter types from the surrounding context, e.g. `n` in `[1,2].map(n => n*2)` is a number automatically.

Q: Write the function type of a callback taking a string and returning a boolean.
A: `(value: string) => boolean`.

# Exercises

### Easy
Write `greet(name: string, greeting = 'Hello')` and call it once with and once without the second argument.

### Medium
Write `max(...values: number[]): number` that returns the largest argument, or `-Infinity` if called with none. Confirm the compiler infers the parameter type inside `reduce`.

### Challenging
Declare a variable `transformer` whose type is a function taking a `string` and returning a `string`. Assign it an arrow function, then pass it to `['a','b'].map(transformer)` and explain why no annotation is needed on the map callback.

# Further Reading

- [Handbook — More on Functions](https://www.typescriptlang.org/docs/handbook/2/functions.html)
- [Handbook — Everyday Types: Functions](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#functions)
