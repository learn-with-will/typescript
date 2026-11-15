---
slug: infer-keyword
title: "The infer Keyword"
topic: type-transformations
kind: concept
summary: "Use the infer keyword inside conditional type checks to extract and capture component types dynamically."
tags: [infer, conditional-types, pattern-matching]
related: [infer-return-and-promise, conditional-type-basics, distributive-conditionals]
---
> **In one line:** Use infer R inside conditional types to extract and name component types on the fly.

## The idea

In conditional types, the `infer` keyword introduces pattern matching to TypeScript’s type system.

Instead of merely checking whether a type satisfies a contract, you can use `infer` to declare a new type variable on the fly inside the `extends` clause. If the type matches the specified structure, TypeScript extracts that component type and makes it available for use in the true branch of the conditional.

For example, given an array type `T`, you can test `T extends (infer E)[] ? E : never`. If `T` is `string[]`, the compiler matches the array pattern, binds `E` to `string`, and returns `string`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Extracting the element type of any array:
type Flatten<T> = T extends (infer E)[] ? E : T;

type ArrayOfStrings = string[];
type ExtractedString = Flatten<ArrayOfStrings>; // string

type PlainNumber = number;
type Passthrough = Flatten<PlainNumber>;         // number (didn't match array)

// Extracting a function's return type:
type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never;

function calculateScore(): number { return 100; }
type Score = GetReturn<typeof calculateScore>; // number
```

> **Tip:** You can only use `infer` declarations inside the `extends` clause of a conditional type.

## Go deeper

Visualizing pattern matching with the `infer` keyword:

```flow
input: T = string[] | input type to inspect @primary
match: T extends (infer E)[] | matches array pattern @blue
matched: E = string | extracts component type @green
input -> match: tests structural shape
match -> matched: binds E to element type
```

## Watch out

- The infer keyword can only be used in the true branch of the conditional type; it is inaccessible in the false branch.
- Using multiple infer declarations in union positions reconciles to an intersection or union depending on variance.

## Remember

- infer introduces a new type variable within an extends clause pattern.
- The captured type variable is available for use in the true branch of the conditional.
- infer powers standard library utilities like ReturnType, Parameters, and Awaited.
