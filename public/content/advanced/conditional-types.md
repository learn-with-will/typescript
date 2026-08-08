---
id: lesson-18
slug: conditional-types
title: "Conditional Types"
level: advanced
order: 18
duration: 30
tags:
  - conditional-types
  - distributive
  - infer
  - extends
  - type-level
---

# Learning Objectives

By the end of this lesson you will be able to:

- Write a conditional type `T extends U ? X : Y`.
- Explain how conditional types **distribute** over unions.
- Extract a type from within another using `infer`.
- Control distribution when you don't want it.

# Why It Matters

Conditional types let a type **make a decision**: "if this type is an array, give me its element type; otherwise give me the type itself." That's how the standard library types like `ReturnType`, `NonNullable`, and `Awaited` are built. Once you can branch and extract at the type level, you can write your own reusable type transformations instead of reaching for `any`.

# Concept Explanation

### The conditional form

A **conditional type** chooses between two types based on an `extends` test — it's the type-level version of a ternary:

```typescript
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'
```

Read `T extends U ? X : Y` as: "if `T` is assignable to `U`, the type is `X`; otherwise `Y`."

A practical example — default a possibly-nullable type:

```typescript
type OrDefault<T, D> = T extends null | undefined ? D : T;

type X = OrDefault<string | undefined, string>; // see distribution below
```

### Distribution over unions

When the type being checked is a **naked type parameter** (just `T`, not wrapped), a conditional type **distributes over a union**: it applies to each member separately and unions the results.

```typescript
type ToArray<T> = T extends unknown ? T[] : never;

type R = ToArray<string | number>;
// distributes: ToArray<string> | ToArray<number>
// = string[] | number[]
```

This is usually what you want, and it's how `Exclude` works:

```typescript
type MyExclude<T, U> = T extends U ? never : T;

type S = MyExclude<'a' | 'b' | 'c', 'b'>;
// 'a' extends 'b'? no → 'a'
// 'b' extends 'b'? yes → never
// 'c' extends 'b'? no → 'c'
// result: 'a' | 'c'
```

Members that resolve to `never` vanish from the union — that's how filtering works.

### `infer` — extracting a type

Inside the `extends` clause you can introduce a new type variable with **`infer`** to *capture* part of a type and use it in the true branch:

```typescript
type ElementType<T> = T extends (infer U)[] ? U : T;

type A = ElementType<string[]>;  // string
type B = ElementType<number[]>;  // number
type C = ElementType<boolean>;   // boolean (not an array → T itself)
```

`infer U` says "match an array of *something*, and call that something `U`." You can `infer` from many shapes — function return types, promise contents, tuple elements:

```typescript
type MyReturnType<F> = F extends (...args: any[]) => infer R ? R : never;

type Fn = (x: number) => string;
type Out = MyReturnType<Fn>; // string
```

That's essentially how the built-in `ReturnType` is defined. And `Awaited` uses `infer` to unwrap promises:

```typescript
type MyAwaited<T> = T extends Promise<infer V> ? MyAwaited<V> : T;
type Deep = MyAwaited<Promise<Promise<number>>>; // number
```

### Controlling distribution

Sometimes you *don't* want a conditional to distribute — you want to test the whole union at once. Wrap both sides in a one-element tuple to stop distribution:

```typescript
// Distributive (per member):
type IsNever<T> = T extends never ? true : false;
type D = IsNever<never>; // never (distributing over an empty union → never)

// Non-distributive (whole type):
type IsNever2<T> = [T] extends [never] ? true : false;
type N = IsNever2<never>; // true
```

The `[T] extends [U]` trick treats `T` as a single unit, which is the standard way to reliably test a union as a whole (detecting `never` is the classic case).

# Key Terminology

- **Conditional type** — `T extends U ? X : Y`, choosing a type by an `extends` test.
- **Distribution** — applying a conditional to each member of a union separately.
- **Naked type parameter** — a bare `T` (not wrapped), which triggers distribution.
- **`infer`** — declares a type variable inside `extends` to capture part of a type.
- **Non-distributive form** — `[T] extends [U]`, testing the whole type at once.

# Syntax and Options

| Pattern | Meaning |
| ------- | ------- |
| `T extends U ? X : Y` | Type-level ternary |
| `T extends unknown ? … : …` | Force distribution over a union |
| `T extends (infer U)[] ? U : T` | Extract array element type |
| `F extends (...a: any[]) => infer R ? R : never` | Extract return type |
| `T extends Promise<infer V> ? V : T` | Unwrap a promise |
| `[T] extends [U] ? … : …` | Non-distributive test |

# Hands-On Walkthrough

Build a small library of conditional types:

```typescript
// Remove null/undefined (like NonNullable):
type Defined<T> = T extends null | undefined ? never : T;
type D = Defined<string | null>; // string

// Unwrap an array once, else keep the type:
type Unwrap<T> = T extends (infer U)[] ? U : T;
type U1 = Unwrap<number[]>; // number
type U2 = Unwrap<string>;   // string

// Get the first element type of a tuple:
type Head<T extends readonly unknown[]> =
  T extends readonly [infer First, ...unknown[]] ? First : never;
type H = Head<[boolean, number, string]>; // boolean
```

Each derives a type by testing structure and, where needed, capturing part of it with `infer`.

# Real World Analogy

A conditional type is an **automated sorting machine on a conveyor belt**. Each item (union member) passes a sensor (`extends U`) and is routed left or right (`X` or `Y`). `infer` is a **scanner that reads a label off the item** — "this box contains *books*" — and hands you just that label. When a whole batch goes through, each item is sorted individually (distribution); clamp them together first (`[T]`) and the machine treats the batch as one unit.

# Examples

## Example 1 — Basic: a type-level test

```typescript
type IsArray<T> = T extends unknown[] ? true : false;

type A = IsArray<number[]>; // true
type B = IsArray<number>;   // false
```

**Why this works:** the `extends unknown[]` test asks "is `T` an array of anything?" and returns the boolean literal type accordingly. It's a pure compile-time computation.

## Example 2 — Real-world: extract a promise's value

```typescript
type Resolved<T> = T extends Promise<infer V> ? V : T;

async function loadUser() {
  return { id: 1, name: 'Ada' };
}

type User = Resolved<ReturnType<typeof loadUser>>;
// ReturnType is Promise<{id,name}>; Resolved unwraps it → { id: number; name: string }
```

**Why this works:** `infer V` captures whatever a `Promise` wraps. Composed with `ReturnType`, it turns an async function's type into the shape it ultimately resolves to — the same idea behind the built-in `Awaited`.

## Example 3 — Best practice / edge case: stop distribution to test a whole union

```typescript
type IsSingle<T> = [T] extends [string] ? true : false;

type A = IsSingle<string>;          // true
type B = IsSingle<string | number>; // false
```

**Why this works:** wrapping in `[T]`/`[string]` prevents distribution, so the test asks "is the *entire* type assignable to `string`?" For `string | number` the answer is no. Without the tuples, the conditional would distribute and give a misleading per-member result.

# Common Mistakes

- **Not realizing conditionals distribute.** A naked `T extends …` applies per union member, which can surprise you — wrap in `[T]` to test the whole thing.
- **Using `infer` outside an `extends` clause.** `infer` is only valid inside the `extends` part of a conditional type.
- **Forgetting the `never` collapse.** In a distributive conditional, members that become `never` disappear from the resulting union (that's how filtering works — sometimes unintentionally).
- **Overcomplicating.** If a utility type already does the job (`NonNullable`, `ReturnType`, `Awaited`), use it instead of rebuilding it.

# Best Practices

- Use conditional types to **derive** types by structure; prefer built-ins when they exist.
- Reach for **`infer`** to extract element, return, or wrapped types.
- Remember **distribution** is the default over unions — usually helpful, occasionally not.
- Use **`[T] extends [U]`** when you must test a union as a single unit.

# Summary

- A **conditional type** `T extends U ? X : Y` branches at the type level.
- Over a union, a naked `T` **distributes** — applied to each member, results unioned; `never` members drop out.
- **`infer`** captures part of a matched type (element, return, promise value) for use in the true branch.
- Wrap in **`[T]`** to prevent distribution and test the whole type.

# Flash Cards

Q: How do you read `T extends U ? X : Y`?
A: If `T` is assignable to `U`, the type is `X`; otherwise it's `Y` — a type-level ternary.

Q: What does it mean that conditional types distribute over unions?
A: A naked `T extends …` is applied to each union member separately, and the results are unioned together.

Q: What does `infer` do?
A: Inside an `extends` clause it declares a type variable that captures part of the matched type, e.g. `T extends (infer U)[] ? U : T`.

Q: How do you extract a function's return type with a conditional?
A: `F extends (...args: any[]) => infer R ? R : never`.

Q: How do you stop a conditional type from distributing over a union?
A: Wrap both sides in a one-element tuple: `[T] extends [U] ? … : …`.

Q: In a distributive conditional, what happens to members that resolve to `never`?
A: They drop out of the resulting union — which is how filtering (e.g. `Exclude`) works.

# Exercises

### Easy
Write `type IsNumber<T> = T extends number ? true : false` and evaluate it for `number` and `string`.

### Medium
Write `type Flatten<T> = T extends (infer U)[] ? U : T` and test it on `string[]`, `number[][]` (one level), and `boolean`. Explain each result.

### Challenging
Reimplement `NonNullable<T>` as a distributive conditional type, then explain why `MyNonNullable<string | null | undefined>` yields `string`, referencing distribution and the `never` collapse.

# Further Reading

- [Handbook — Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
- [Handbook — Distributive Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)
- [Handbook — Inferring Within Conditional Types (`infer`)](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#inferring-within-conditional-types)
