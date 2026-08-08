---
id: lesson-09
slug: generics
title: "Generics"
level: intermediate
order: 9
duration: 30
tags:
  - generics
  - type-parameters
  - constraints
  - reuse
  - inference
---

# Learning Objectives

By the end of this lesson you will be able to:

- Write a generic function with a type parameter.
- Let TypeScript **infer** type arguments at the call site.
- Define generic interfaces and classes.
- Constrain a type parameter with `extends`.
- Give a type parameter a default.

# Why It Matters

Without generics you face a bad choice: write the same function once per type (duplication), or type it as `any` (no safety). Generics give you the third option — **write it once, keep full type safety** — by letting the *caller's* types flow through your code. Every collection type, every utility type, and most well-designed libraries lean on generics. They are the single biggest step up from "typing values" to "typing reusable code."

# Concept Explanation

### The problem generics solve

Consider a function that returns its argument unchanged. Typed with `any`, it throws away information:

```typescript
function identityAny(value: any): any {
  return value;
}
const x = identityAny('hello'); // x: any — we lost that it's a string
```

A **generic** captures the caller's type in a **type parameter** (conventionally `T`) and reuses it:

```typescript
function identity<T>(value: T): T {
  return value;
}
const s = identity('hello'); // s: string
const n = identity(42);      // n: number
```

`T` is a placeholder for "whatever type the caller uses." The return type `T` means "the same type you passed in."

### Inference: you rarely write the type argument

TypeScript infers `T` from the argument, so you usually don't specify it:

```typescript
identity('hello');       // T inferred as string
identity<number>(42);    // you *can* specify it, but rarely need to
```

### A generic that's actually useful

```typescript
function firstOrNull<T>(items: T[]): T | null {
  return items.length > 0 ? items[0] : null;
}

const a = firstOrNull([1, 2, 3]);       // number | null
const b = firstOrNull(['x', 'y']);      // string | null
```

One function, correct types for every element type.

### Generic interfaces and classes

Types can take parameters too:

```typescript
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 42 };

class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
}

const stack = new Stack<string>();
stack.push('a');
const top = stack.pop(); // string | undefined
```

### Constraints with `extends`

Sometimes a generic function needs to *use* the value, which requires knowing something about it. A **constraint** limits `T` to types that have what you need:

```typescript
function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;
}

longest('hello', 'hi');       // OK — strings have length
longest([1, 2], [1, 2, 3]);   // OK — arrays have length
longest(1, 2);
// Error: Argument of type 'number' is not assignable to
// parameter of type '{ length: number }'.
```

`T extends { length: number }` reads "T can be any type, as long as it has a numeric `length`." Inside the function you may safely read `.length`.

A very common constrained pattern uses `keyof` to read a property safely:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Ada', age: 36 };
getProperty(user, 'name'); // string
getProperty(user, 'age');  // number
getProperty(user, 'oops'); // Error: 'oops' is not a key of the object
```

(We cover `keyof` and `T[K]` in depth in an advanced lesson; here they make a great constraint example.)

### Default type parameters

A type parameter can have a default, used when neither the caller nor inference supplies one:

```typescript
interface ApiResponse<T = unknown> {
  status: number;
  body: T;
}

const raw: ApiResponse = { status: 200, body: 'anything' };       // body: unknown
const typed: ApiResponse<string[]> = { status: 200, body: ['a'] }; // body: string[]
```

# Key Terminology

- **Generic** — code parameterized by a type.
- **Type parameter** — the placeholder type, e.g. `T`, declared in `<...>`.
- **Type argument** — the concrete type supplied (often inferred), e.g. `string`.
- **Constraint** — `T extends SomeType`, limiting what `T` can be.
- **Default type parameter** — `T = SomeType`, a fallback when none is given.

# Syntax and Options

| Feature | Syntax | Meaning |
| ------- | ------ | ------- |
| Generic function | `function f<T>(x: T): T` | Captures the caller's type |
| Explicit argument | `f<number>(42)` | Supply `T` (usually inferred) |
| Generic interface | `interface Box<T>` | Parameterized shape |
| Generic class | `class Stack<T>` | Parameterized class |
| Constraint | `<T extends U>` | `T` must be assignable to `U` |
| Default | `<T = U>` | Fallback when not provided |

# Hands-On Walkthrough

Build a tiny typed cache:

```typescript
class Cache<T> {
  private store = new Map<string, T>();

  set(key: string, value: T): void {
    this.store.set(key, value);
  }

  get(key: string): T | undefined {
    return this.store.get(key);
  }
}

const numbers = new Cache<number>();
numbers.set('a', 1);
const value = numbers.get('a'); // number | undefined

const users = new Cache<{ name: string }>();
users.set('ada', { name: 'Ada' });
users.get('ada')?.name; // string | undefined
```

One class serves both a number cache and a user cache, each fully typed. Now add a constrained helper:

```typescript
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map((item) => item[key]);
}

const people = [{ name: 'Ada' }, { name: 'Alan' }];
pluck(people, 'name'); // string[]
```

# Real World Analogy

A generic is a **shipping box that adapts to its contents**. The box's design (how you seal it, stack it, label it) is the same no matter what goes inside — but once you put in books, it's a "box of books," and the label reflects that. `T` is "whatever you put in"; the box guarantees that what you take out is the same kind of thing you put in.

# Examples

## Example 1 — Basic: a generic wrapper

```typescript
function wrap<T>(value: T): { value: T } {
  return { value };
}

const w = wrap(true); // { value: boolean }
```

**Why this works:** `T` is inferred as `boolean` from the argument, and the return type reuses it, so `w.value` is precisely `boolean` — not `any`, not a widened type.

## Example 2 — Real-world: a constrained merge

```typescript
function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}

const merged = merge({ name: 'Ada' }, { age: 36 });
merged.name; // string
merged.age;  // number
```

**Why this works:** constraining both parameters to `object` ensures they can be spread, and the return type `T & U` (an intersection) precisely describes the combined shape, so both `name` and `age` are known.

## Example 3 — Best practice / edge case: don't over-generify

```typescript
// Overkill: T is used only once, so it buys nothing over `string`.
function shout<T extends string>(text: T): string {
  return text.toUpperCase();
}

// Simpler and clearer:
function shout2(text: string): string {
  return text.toUpperCase();
}
```

**Why this works:** a type parameter only earns its place when it *connects* two positions (e.g. input to output, or key to value). If `T` appears once and isn't returned, a plain type is clearer. Reach for generics when they carry a relationship, not by reflex.

# Common Mistakes

- **Using `any` instead of a type parameter.** `any` erases the relationship between input and output; a generic preserves it.
- **Adding a type parameter that's used only once.** It adds noise without safety — use a concrete type.
- **Forgetting constraints.** To use `.length` or `obj[key]` inside a generic, constrain `T` so the compiler knows the operation is valid.
- **Over-specifying type arguments.** Let inference supply `T`; only write `f<...>()` when inference can't.

# Best Practices

- Introduce a **type parameter** when a type must flow from input to output (or key to value).
- **Constrain** type parameters so you can safely use the values inside.
- Prefer **inference**; specify type arguments only when necessary.
- Use **defaults** for optional type parameters (e.g. API response bodies).

# Summary

- **Generics** let you write reusable code without losing type information.
- A **type parameter** (`T`) captures the caller's type; TypeScript usually **infers** it.
- Interfaces and classes can be generic too (`Box<T>`, `Stack<T>`).
- **Constraints** (`T extends U`) let you use the value safely inside the generic.
- **Default type parameters** (`T = U`) provide a fallback.

# Flash Cards

Q: What problem do generics solve that `any` does not?
A: They preserve the relationship between types (e.g. input to output), keeping full type safety instead of discarding it.

Q: Do you usually pass type arguments explicitly, like `identity<string>('hi')`?
A: No — TypeScript infers the type argument from the value; you specify it only when inference can't.

Q: What does the constraint `T extends { length: number }` allow you to do inside the function?
A: Safely read `.length` on the value, because `T` is guaranteed to have a numeric `length`.

Q: How do you make `getProperty(obj, key)` reject keys that don't exist on `obj`?
A: Constrain the key: `<T, K extends keyof T>(obj: T, key: K): T[K]`.

Q: What is a default type parameter?
A: A fallback type used when the caller/inference doesn't provide one, written `<T = SomeType>`.

Q: When is adding a type parameter *not* worth it?
A: When it appears only once and carries no relationship — a concrete type is clearer there.

# Exercises

### Easy
Write a generic function `last<T>(items: T[]): T | undefined` that returns the final element. Confirm the inferred return type for a `string[]` and a `number[]`.

### Medium
Write `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]` and use it on an array of objects to extract one property. Try an invalid key and read the error.

### Challenging
Write a generic `class Result<T, E = Error>` with a static-like pair of constructors `ok(value: T)` and `err(error: E)` (as factory functions), storing a discriminated union internally. Explain where the default type parameter `E = Error` is used.

# Further Reading

- [Handbook — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Handbook — Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)
- [Handbook — Using Type Parameters in Generic Constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#using-type-parameters-in-generic-constraints)
