---
slug: distributive-conditionals
title: "Distributive Conditional Types"
topic: type-transformations
kind: concept
summary: "Understand how naked type parameters in conditional types automatically distribute across each member of a union."
tags: [conditional-types, unions, distribution]
related: [conditional-type-basics, stop-distribution-with-tuples, infer-keyword]
---
> **In one line:** When a generic parameter in a conditional is a union, the check automatically applies to each member individually.

## The idea

One of the most defining characteristics of conditional types in TypeScript is distributive behavior.

When a conditional type acts on a naked (unwrapped) generic type parameter `T`, and `T` is instantiated with a union type (such as `A | B | C`), the conditional type automatically distributes across each member of the union:

`(A | B | C) extends U ? X : Y` expands into:
`(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)`

The results of each branch are then recombined into a new union. This distributive property is the foundation for built-in utility types like `Exclude<T, U>` and `Extract<T, U>`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Distributive conditional type:
type ToArray<T> = T extends any ? T[] : never;

// Distributes over string | number:
// (string extends any ? string[] : never) | (number extends any ? number[] : never)
type Distributed = ToArray<string | number>;
// Result is: string[] | number[]  (NOT (string | number)[])

// How Exclude works via distribution:
type MyExclude<T, U> = T extends U ? never : T;

type Clean = MyExclude<'apple' | 'banana' | 'cherry', 'banana'>;
// Evaluates 'apple' -> 'apple', 'banana' -> never, 'cherry' -> 'cherry'
// Recombines: 'apple' | never | 'cherry' -> 'apple' | 'cherry'
```

> **Note:** `never` in a union automatically disappears because `never` represents the empty set: `A | never` resolves to `A`.

## Go deeper

Step-by-step distribution of `Exclude<'a' | 'b', 'b'>`:

| Step | Expression | Result |
|---|---|---|
| Initial | `MyExclude<'a' | 'b', 'b'>` | Applies to each union member |
| Member 1 | `'a' extends 'b' ? never : 'a'` | `'a'` |
| Member 2 | `'b' extends 'b' ? never : 'b'` | `never` |
| Union Recombination | `'a' | never` | `'a'` |

## Watch out

- Distribution only happens for naked type parameters; wrapping T in a tuple or array prevents distribution.
- Distributive conditionals can unintentionally split unions when you wanted to test the entire union as a whole.

## Remember

- Naked generic parameters in conditional types distribute across union members automatically.
- Each union member is evaluated independently and the results are recombined into a union.
- Returning never filters that member out of the final recombined union.
