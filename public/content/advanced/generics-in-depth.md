---
id: lesson-21
slug: generics-in-depth
title: "Generics in Depth"
level: advanced
order: 21
duration: 30
tags:
  - generics
  - variance
  - inference
  - const-type-parameters
  - constraints
---

# Learning Objectives

By the end of this lesson you will be able to:

- Build an intuition for **variance** — why some substitutions are safe and others aren't.
- Understand how TypeScript infers type parameters from multiple positions.
- Use **`const` type parameters** to preserve literal types.
- Apply advanced constraint and default patterns.

# Why It Matters

You already write generics. This lesson explains the behavior that trips people up: why a `Dog[]` is a `Animal[]` but a function taking `Animal` can stand in for one taking `Dog` (not the other way around), and how to make a generic keep literal types like `'GET'` instead of widening to `string`. These are the details that separate "generics that mostly work" from "generics you fully control."

# Concept Explanation

### Variance, intuitively

**Variance** describes when a type built from `T` is substitutable as you change `T`. You don't usually annotate variance in TypeScript — it's inferred — but understanding it explains a lot of assignability rules.

**Covariance (outputs).** If `Dog` is an `Animal`, then a `Dog[]` is usable as an `Animal[]`, and a function *returning* `Dog` is usable where one returning `Animal` is expected. Producers of a subtype fit where the supertype is wanted — the container/return "varies with" `T`:

```typescript
class Animal { name = ''; }
class Dog extends Animal { breed = ''; }

const dogs: Dog[] = [new Dog()];
const animals: Animal[] = dogs; // OK — covariant in the element type
```

**Contravariance (inputs).** Function *parameters* go the other way. A function that accepts an `Animal` can stand in for one that accepts a `Dog`, because anything you'd pass (a `Dog`) is also an `Animal`:

```typescript
type Handler<T> = (value: T) => void;

const handleAnimal: Handler<Animal> = (a) => console.log(a.name);
const handleDog: Handler<Dog> = handleAnimal; // OK — parameters are contravariant
```

Under `strictFunctionTypes` (part of `strict`), TypeScript checks function-*type* parameters contravariantly, catching unsafe substitutions the loose rules would allow. The takeaway: **outputs vary with the subtype direction; inputs vary against it.**

### Inference from multiple positions

TypeScript infers a type parameter by looking at *every* place it appears in the arguments, then finding a type consistent with all of them:

```typescript
function pair<T>(a: T, b: T): [T, T] {
  return [a, b];
}

pair(1, 2);        // T = number
pair('a', 'b');    // T = string
pair(1, 'a');      // T = string | number (the best common type)
```

When a type parameter feeds another (higher-order inference), TypeScript threads it through:

```typescript
function map<T, U>(items: T[], fn: (item: T) => U): U[] {
  return items.map(fn);
}

map([1, 2, 3], (n) => n.toString()); // T = number, U = string → string[]
```

`T` is inferred from the array, and `U` from the callback's return — each from the position where it appears.

### `const` type parameters

By default, inference **widens** literals: passing `'GET'` infers `string`, and an array `['a','b']` infers `string[]`. A **`const` type parameter** (added in TypeScript 5.0) tells the compiler to infer the *narrowest* type, as if the caller wrote `as const` — without making them do it:

```typescript
function asTuple<const T extends readonly unknown[]>(values: T): T {
  return values;
}

const a = asTuple(['x', 'y']);
// without const: string[]
// with const:    readonly ['x', 'y']

function route<const T extends string>(path: T): T {
  return path;
}
const r = route('/home'); // r: '/home' (literal), not string
```

`const` type parameters are ideal for helpers that should preserve exact literal types — config builders, route tables, state machines — so callers get precise types for free.

### Constraint and default patterns

Constraints and defaults can reference other type parameters, which enables expressive APIs:

```typescript
// A default that depends on another parameter:
function createStore<T, S = T>(initial: T, selector: (state: T) => S = (s) => s as unknown as S): S {
  return selector(initial);
}

// A constraint that ties a key to its object:
function set<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}
```

A common, powerful pattern combines a constraint with `keyof` and indexed access so a key and its value type stay in lockstep — impossible to pass a value of the wrong type for a given key.

# Key Terminology

- **Variance** — how substitutability of a generic type changes with its type argument.
- **Covariance** — outputs/containers vary *with* the subtype direction (e.g. `Dog[]` → `Animal[]`).
- **Contravariance** — function parameters vary *against* it (an `Animal` handler fits where a `Dog` handler is needed).
- **Higher-order inference** — inferring type parameters that flow through other functions.
- **`const` type parameter** — `<const T>`, inferring the narrowest (literal) type.

# Syntax and Options

| Feature | Syntax | Purpose |
| ------- | ------ | ------- |
| Covariant use | `const a: Animal[] = dogs` | Subtype array fits supertype array |
| Contravariant use | `Handler<Animal>` as `Handler<Dog>` | Wider-input handler fits |
| Multi-position inference | `pair<T>(a: T, b: T)` | Best common type across args |
| `const` parameter | `<const T>` | Preserve literal types |
| Dependent default | `<T, S = T>` | Default one param from another |
| Key/value lock | `<T, K extends keyof T>(…value: T[K])` | Value must match the key |

# Hands-On Walkthrough

See widening vs `const` inference, and a key/value-locked setter:

```typescript
function tuple<const T extends readonly unknown[]>(...items: T): T {
  return items;
}

const point = tuple(3, 4);       // readonly [3, 4]
const flags = tuple(true, false); // readonly [true, false]

function update<T, K extends keyof T>(obj: T, key: K, value: T[K]): T {
  return { ...obj, [key]: value };
}

const user = { id: 1, name: 'Ada' };
update(user, 'name', 'Ada L.'); // OK
// update(user, 'name', 42);    // Error: 42 is not assignable to string
```

`tuple` keeps exact literal types thanks to `const`, and `update` guarantees the value type matches the chosen key.

# Real World Analogy

Variance is the logic of **substitute workers**. If a job produces "any animal," a worker who only ever produces dogs can fill it — their output still counts (covariance). If a job requires handling "any animal that shows up," a worker trained on *all* animals can fill a dog-only role, but a dog-only specialist can't safely take the all-animals role (contravariance). `const` type parameters are like asking the worker to record the *exact* item they handled ("a corgi at 3:15"), not just "a dog."

# Examples

## Example 1 — Basic: best common type across positions

```typescript
function firstOf<T>(...items: T[]): T {
  return items[0];
}

const x = firstOf(1, 2, 3);     // number
const y = firstOf('a', 1, true); // string | number | boolean
```

**Why this works:** `T` appears in every argument, so TypeScript infers the *best common type* across them — a single type for uniform inputs, or a union when they differ.

## Example 2 — Real-world: preserve literals with `const`

```typescript
function defineConfig<const T extends Record<string, unknown>>(config: T): T {
  return config;
}

const config = defineConfig({
  mode: 'production',
  retries: 3,
});
// config.mode is 'production' (literal), not string
```

**Why this works:** the `const` type parameter infers the narrowest type for the object, keeping `mode` as the literal `'production'`. Callers get precise types without writing `as const` themselves — a common pattern in config-builder APIs.

## Example 3 — Best practice / edge case: contravariant callbacks

```typescript
type Logger<T> = (value: T) => void;

const logUnknown: Logger<unknown> = (v) => console.log(v);
const logString: Logger<string> = logUnknown; // OK — unknown handler accepts strings

// const logNarrow: Logger<unknown> = logString; // Error under strictFunctionTypes
```

**Why this works:** a handler for `unknown` can safely handle a `string` (contravariance), so assigning it to `Logger<string>` is allowed. The reverse — using a string-only handler where any value might arrive — is unsafe, and `strictFunctionTypes` rejects it.

# Common Mistakes

- **Expecting parameters to be covariant.** They're contravariant; a narrow-input callback can't stand in for a wide-input one.
- **Losing literal types.** Without a `const` type parameter (or `as const`), helpers widen `'GET'` to `string` and `[1,2]` to `number[]`.
- **Over-annotating inference.** Let multi-position inference find the common type; specifying `T` can force a worse result.
- **Ignoring `strictFunctionTypes`.** It's what makes contravariant checks sound — don't disable it to dodge an error.

# Best Practices

- Rely on **multi-position inference** for the best common type; annotate only when needed.
- Use **`const` type parameters** in builders and helpers that should preserve literal types.
- Tie keys to values with **`K extends keyof T`** + **`T[K]`** so mismatches are impossible.
- Keep **`strictFunctionTypes`** on for sound parameter checking.

# Summary

- **Variance**: outputs/containers are **covariant**; function parameters are **contravariant** (checked under `strictFunctionTypes`).
- TypeScript infers type parameters from **all** positions they appear in, threading them through higher-order functions.
- **`const` type parameters** (`<const T>`) infer the narrowest, literal-preserving type.
- Constraints and defaults can **depend on other parameters**, enabling key/value-locked and self-defaulting APIs.

# Flash Cards

Q: Are arrays covariant or contravariant in their element type?
A: Covariant — a `Dog[]` is usable as an `Animal[]` because `Dog` is a subtype of `Animal`.

Q: Why can a `Handler<Animal>` be used where a `Handler<Dog>` is expected?
A: Function parameters are contravariant — a handler that accepts any `Animal` can safely accept a `Dog`.

Q: What does a `const` type parameter do?
A: It infers the narrowest type for the argument (as if `as const` were written), preserving literal types.

Q: When you call `pair(1, 'a')` for `pair<T>(a: T, b: T)`, what is `T`?
A: `string | number` — the best common type across both argument positions.

Q: Which strict option makes function-parameter checking sound?
A: `strictFunctionTypes`, which checks function-type parameters contravariantly.

Q: How do you guarantee a value matches the specific key it's set on?
A: Constrain with `K extends keyof T` and type the value as `T[K]`.

# Exercises

### Easy
Assign a `Dog[]` to an `Animal[]` variable and explain why it's allowed. Then try the reverse and describe the risk.

### Medium
Write `function tuple<const T extends readonly unknown[]>(...items: T): T` and confirm `tuple(1, 'a')` infers `readonly [1, 'a']` rather than `(string | number)[]`.

### Challenging
Write `function on<T, K extends keyof T>(obj: T, key: K, handler: (value: T[K]) => void): void`. Explain how the constraint and indexed access keep the handler's parameter type tied to the chosen key.

# Further Reading

- [Handbook — Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [`const` Type Parameters (TypeScript 5.0)](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters)
- [tsconfig — `strictFunctionTypes`](https://www.typescriptlang.org/tsconfig/#strictFunctionTypes)
