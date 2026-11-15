---
slug: inference-from-multiple-positions
title: "Inference from Multiple Positions"
topic: generics
kind: concept
summary: "Learn how TypeScript reconciles type arguments when a type parameter appears in multiple function arguments."
tags: [inference, generics, unions]
related: [type-argument-inference, generic-functions, variance-in-generics]
---
> **In one line:** When a type parameter appears across multiple arguments, TypeScript infers a candidate union type.

## The idea

What happens when a single generic type parameter `T` appears in multiple function arguments, and the caller passes values of different types?

For example:
`function choose<T>(a: T, b: T): T`
If a caller executes `choose('hello', 42)`, what should `T` become?

TypeScript's inference algorithm collects type candidates from each argument position. In covariant positions, TypeScript resolves conflicting candidates by calculating their best common type—usually a union of the candidates. Thus, `choose('hello', 42)` infers `T` as `string | number`.

However, if `T` also appears in a return type or callback, this inferred union might not be what you intended. Understanding how multi-position inference works helps you design cleaner generic APIs.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
function pickRandom<T>(first: T, second: T): T {
  return Math.random() > 0.5 ? first : second;
}

// TypeScript infers T as string | number from both positions:
const mixed = pickRandom('heads', 1); // Inferred type is string | number

// If you want to enforce that both arguments share the exact same type:
function strictEqualCheck<T>(a: T, b: NoInfer<T>): boolean {
  return a === b;
}

strictEqualCheck('apple', 'banana'); // OK
// strictEqualCheck('apple', 10);     // Error: Argument of type 'number' is not assignable to 'string'
```

> **Tip:** TypeScript 5.4 introduced `NoInfer<T>` to prevent specific argument positions from participating in type inference.

## Go deeper

Multi-position inference behavior across different position types:

| Candidate Sources | Resolution Strategy | Example Inferred Type |
|---|---|---|
| Multiple covariant positions (`T`) | Union of all candidates | `string` and `number` -> `string | number` |
| Multiple contravariant positions | Intersection of all candidates | `User` and `Admin` -> `User & Admin` |
| Constrained parameter (`T extends Base`) | Best common ancestor satisfying constraint | Common subtype |

## Watch out

- Relying on automatic union inference can mask typos when arguments were intended to be identical.
- Use NoInfer<T> when one argument should dictate the type and another should merely conform.

## Remember

- TypeScript collects candidates from all positions where T appears.
- Conflicting candidate types in parameter positions are reconciled into a union.
- Use NoInfer<T> in TypeScript 5.4+ to exclude secondary arguments from inference.
