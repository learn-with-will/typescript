---
id: lesson-03
slug: basic-types
title: "Basic Types"
level: beginner
order: 3
duration: 24
tags:
  - types
  - primitives
  - inference
  - any
  - unknown
---

# Learning Objectives

By the end of this lesson you will be able to:

- Name and use TypeScript's primitive types.
- Type arrays two equivalent ways.
- Let TypeScript **infer** types instead of annotating everything.
- Explain the crucial difference between `any` and `unknown`.
- Understand how `null` and `undefined` behave under strict mode.

# Why It Matters

Types are the vocabulary of TypeScript. Almost everything you build — objects, functions, generics — rests on the handful of basic types in this lesson. Getting comfortable with them, and knowing when to *let the compiler figure the type out for you*, makes the rest of the language feel natural instead of noisy.

# Concept Explanation

### The primitive types

TypeScript's primitives mirror JavaScript's:

```typescript
let title: string = 'TypeScript';
let lessons: number = 24;
let published: boolean = true;
let big: bigint = 9007199254740993n;
let id: symbol = Symbol('id');
```

Two notes that surprise newcomers:

- **`number` covers all ordinary numbers** — integers and decimals alike. There is no separate `int` or `float`. Very large whole numbers beyond the safe range use the separate **`bigint`** type (written with an `n` suffix).
- `null` and `undefined` are their own types (more below).

### Inference: you don't annotate everything

TypeScript reads the value you assign and **infers** the type. You rarely need to write the type when it's obvious:

```typescript
let title = 'TypeScript'; // inferred as string
let lessons = 24;         // inferred as number
```

Hover over `title` in an editor and you'll see `string`. Annotate when it adds clarity or when there's no initializer to infer from; otherwise let inference do the work. Idiomatic TypeScript is *not* covered in `: type` everywhere.

### Arrays

An array of a single element type is written `T[]` or, equivalently, `Array<T>`:

```typescript
const scores: number[] = [90, 85, 100];
const names: Array<string> = ['Ada', 'Alan'];
```

Both forms mean the same thing. `number[]` is the more common style.

### `any` — the escape hatch

The `any` type turns type checking **off** for a value. You can do anything to an `any` and the compiler stays silent:

```typescript
let x: any = 5;
x = 'now a string'; // fine
x.foo.bar();        // no error — but may crash at runtime
```

`any` is occasionally necessary when adopting TypeScript in messy code, but it's a hole in your safety net. Reach for it rarely.

### `unknown` — the safe top type

`unknown` is the type "we don't know yet." Like `any`, *any value* is assignable to it — but unlike `any`, you **cannot use it until you narrow it** to something specific. That makes it the safe choice for values whose type you genuinely don't know (like parsed JSON):

```typescript
let data: unknown = JSON.parse('{"ok":true}');

data.toUpperCase();
// Error: 'data' is of type 'unknown'.

if (typeof data === 'string') {
  data.toUpperCase(); // OK here — narrowed to string
}
```

The rule of thumb: **prefer `unknown` over `any`** whenever you must accept an unknown value, because it forces you to check before you use it.

### `null` and `undefined` under strict mode

With `strictNullChecks` on (part of `strict`, which this course assumes), `null` and `undefined` are **not** silently allowed in other types. If a value might be missing, you say so with a union (covered soon):

```typescript
let nickname: string | undefined;
nickname = undefined; // OK
nickname = 'Ada';     // OK

let required: string = null;
// Error: Type 'null' is not assignable to type 'string'.
```

This is one of TypeScript's most valuable features: the classic "cannot read property of undefined" bug becomes a compile-time error.

# Key Terminology

- **Primitive** — a basic built-in type: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`.
- **Type inference** — TypeScript deducing a type from a value instead of an annotation.
- **`any`** — a type that disables type checking for a value.
- **`unknown`** — the type-safe top type; accepts any value but must be narrowed before use.
- **Top type** — a type that every value is assignable to (`unknown`, and unsafely `any`).
- **`strictNullChecks`** — the option that keeps `null`/`undefined` out of other types unless declared.

# Syntax and Options

| Type | Example | Notes |
| ---- | ------- | ----- |
| `string` | `'hi'` | Text |
| `number` | `42`, `3.14` | All ordinary numbers |
| `boolean` | `true` | |
| `bigint` | `10n` | Integers beyond the safe range |
| `symbol` | `Symbol('k')` | Unique keys |
| `T[]` / `Array<T>` | `number[]` | Array of `T` |
| `any` | `let x: any` | **Disables** checking — avoid |
| `unknown` | `let x: unknown` | Safe; must narrow before use |
| `null` / `undefined` | `string \| undefined` | Kept separate under `strict` |

# Hands-On Walkthrough

Paste this into the Playground and hover each variable:

```typescript
const language = 'TypeScript';   // string (inferred)
const version = 7;               // number (inferred)
const features = ['types', 'inference', 'generics']; // string[]

function firstFeature(list: string[]): string {
  return list[0];
}

console.log(`${language} ${version}: ${firstFeature(features)}`);
// "TypeScript 7: types"
```

Now add an unknown value and try to use it directly:

```typescript
const parsed: unknown = JSON.parse('42');

// const doubled = parsed * 2;
// Error: 'parsed' is of type 'unknown'.

const doubled = typeof parsed === 'number' ? parsed * 2 : 0;
console.log(doubled); // 84
```

Notice how `unknown` made you prove the value was a number before multiplying.

# Real World Analogy

`any` is a **blank check** — whoever holds it can write any amount, no questions asked, and you might get burned. `unknown` is a **sealed envelope**: you're told there's *something* inside, but you have to open it and look (narrow it) before you can spend what's there. One trusts blindly; the other makes you verify.

# Examples

## Example 1 — Basic: inference vs annotation

```typescript
let a = 10;         // inferred number
let b: number = 10; // annotated number — identical type
```

**Why this works:** the initializer `10` is a `number`, so TypeScript infers `number` for `a`. The explicit annotation on `b` is redundant here. Prefer inference for obvious cases.

## Example 2 — Real-world: accepting JSON safely

```typescript
function parseConfig(raw: string): unknown {
  return JSON.parse(raw);
}

const cfg = parseConfig('{"retries": 3}');
if (typeof cfg === 'object' && cfg !== null && 'retries' in cfg) {
  console.log('has retries');
}
```

**Why this works:** `JSON.parse` genuinely returns something of unknown shape, so `unknown` is the honest return type. Callers must narrow it (here with `typeof`, a null check, and `in`) before trusting any property — exactly the discipline `unknown` enforces.

## Example 3 — Best practice / edge case: `any` erases safety silently

```typescript
const value: any = 'hello';
const n: number = value; // no error — but it's really a string!
console.log(n.toFixed(2)); // runtime crash: n.toFixed is not a function
```

**Why this works — as a warning:** assigning `any` to a `number` compiles with no complaint because `any` is compatible with everything. The bug only appears at runtime. Swap `any` for `unknown` and the compiler forces you to check first.

# Common Mistakes

- **Using `any` as a quick fix.** It silences the compiler *and* the bug. Prefer `unknown` and narrow.
- **Over-annotating.** Writing `: string` on every obvious variable adds noise; trust inference.
- **Assuming `number` has integers vs floats.** It doesn't — it's one numeric type. Use `bigint` only for very large integers.
- **Expecting `null`/`undefined` to be allowed anywhere.** Under `strict` you must include them in the type (e.g. `string | undefined`).

# Best Practices

- **Let TypeScript infer** obvious types; annotate function boundaries and unclear cases.
- **Prefer `unknown` to `any`** for values of uncertain type; narrow before use.
- Model "might be missing" explicitly with `| undefined` or `| null`.
- Reserve `any` for rare, well-understood interop situations — and add a comment when you do.

# Summary

- Primitives: `string`, `number`, `boolean`, `bigint`, `symbol`, plus `null`/`undefined`.
- `number` is a single numeric type; there's no separate int/float.
- Arrays are `T[]` or `Array<T>`.
- **Inference** means you don't annotate everything.
- `any` **disables** checking; `unknown` is the **safe** top type that must be narrowed.
- Under `strict`, `null`/`undefined` stay out of other types unless you declare them.

# Flash Cards

Q: What is the difference between `any` and `unknown`?
A: `any` turns off type checking; `unknown` accepts any value but must be narrowed before you can use it.

Q: Does TypeScript have separate integer and float types?
A: No — `number` covers all ordinary numbers. `bigint` exists only for integers beyond the safe range.

Q: Write two equivalent ways to type an array of numbers.
A: `number[]` and `Array<number>`.

Q: With `strictNullChecks` on, does `let x: string = null` compile?
A: No — `null` isn't assignable to `string` unless you widen the type, e.g. `string | null`.

Q: Why prefer `unknown` over `any` for parsed JSON?
A: `unknown` forces you to check the value's type before using it, preventing silent runtime bugs.

Q: If you write `let count = 5`, what type does TypeScript infer?
A: `number` — it infers from the initializer, so no annotation is needed.

# Exercises

### Easy
Declare a `string`, a `number`, and a `boolean` using inference (no annotations). Then reassign one to a value of the wrong type and read the error.

### Medium
Write a function `len(value: unknown): number` that returns the length of `value` if it is a string or an array, and `0` otherwise. You'll need to narrow `unknown` before reading `.length`.

### Challenging
Explain why the following compiles but is dangerous, and rewrite it to be safe:
```typescript
const input: any = getUserInput();
const age: number = input;
```

# Further Reading

- [Handbook — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [Handbook — `unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
- [Handbook — Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html)
