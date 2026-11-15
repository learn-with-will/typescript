---
slug: stop-distribution-with-tuples
title: "Stopping Distribution with Tuples"
topic: type-transformations
kind: technique
summary: "Wrap generic type parameters in square brackets [T] extends [U] to test a union as a single whole without distributing."
tags: [conditional-types, tuples, unions]
related: [distributive-conditionals, conditional-type-basics, conditional-type-pitfalls]
---
> **In one line:** Wrap T and U in square brackets ([T] extends [U]) to prevent distribution across unions.

## The idea

While distributive conditional types are essential for filtering unions, there are situations where you specifically do NOT want distribution.

For example, suppose you want to write a type `IsStringUnion<T>` that checks whether `T` is assignable to `string`. If `T` is `string | number`, distributive conditionals test `string` (which evaluates to `true`) and `number` (which evaluates to `false`), recombining them into `boolean` (`true | false`). But you wanted a single answer: is the entire union assignable to string? The answer should be `false`!

To prevent distribution, wrap both sides of the `extends` keyword in square brackets: `[T] extends [U]`. This informs the compiler that `T` is no longer a naked type parameter, forcing it to test the entire union as a single, indivisible candidate.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// 1. Distributive version (tests each member independently):
type IsStringDistributive<T> = T extends string ? true : false;
type TestDist = IsStringDistributive<string | number>; // true | false -> boolean!

// 2. Non-distributive version using tuple wrapping:
type IsStringWhole<T> = [T] extends [string] ? true : false;
type TestWhole = IsStringWhole<string | number>; // false! (Entire union checked together)

// Practical use: Checking if T is exactly never:
// Because never distributes to zero iterations, naked T extends never yields never!
type IsNever<T> = [T] extends [never] ? true : false;
type Check1 = IsNever<never>;  // true
type Check2 = IsNever<string>; // false
```

> **Tip:** Always use `[T] extends [never]` when testing if a generic parameter is `never`.

## Go deeper

Comparing distributive vs non-distributive conditional evaluations:

| Generic Style | Syntax | Evaluation for `string | number` |
|---|---|---|
| Distributive (Naked) | `T extends string ? true : false` | Tests `string` (true), tests `number` (false) -> `boolean` |
| Non-Distributive (Wrapped) | `[T] extends [string] ? true : false` | Tests `string | number` as whole against `string` -> `false` |
| Testing for `never` | `[T] extends [never]` | Accurately detects `never` without disappearing |

## Watch out

- You must wrap BOTH sides in square brackets: [T] extends [U]; wrapping only one side will fail.
- Forgetting to prevent distribution is the #1 reason custom type guards for unions return boolean.

## Remember

- Wrap type parameters in square brackets ([T] extends [U]) to stop automatic distribution.
- Non-distributive checks evaluate the union as a single monolithic type.
- Use [T] extends [never] to reliably test if a type parameter is never.
