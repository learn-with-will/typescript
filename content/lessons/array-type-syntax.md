---
slug: array-type-syntax
title: "Array Type Syntax"
topic: basic-types
kind: technique
summary: "Define array types using either square bracket syntax T[] or generic syntax Array<T> with identical compiler semantics."
tags: [arrays, syntax, collections]
related: [primitives-and-inference, type-annotations-vs-inference, any-the-escape-hatch]
---
> **In one line:** Annotate lists using either T[] or Array<T> syntax for full type safety across array operations.

## The idea

JavaScript arrays are dynamic collections that can hold mixed values at runtime. In TypeScript, arrays are almost always homogeneous lists containing values of a specific type. Typing arrays ensures that methods like `push()`, `map()`, and `filter()` preserve type safety and prevent runtime errors.

TypeScript provides two syntaxes for array types: square bracket notation (`T[]`) and generic notation (`Array<T>`). Both notations have identical semantics under the type checker. The `T[]` style is widely preferred in the TypeScript community for its conciseness and visual clarity.

When you initialize an array, TypeScript infers its element type from the initial values. If elements have mixed types, TypeScript infers a union array like `(string | number)[]`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

Adopting these idioms early ensures that code remains clean, readable, and resilient against future modifications. Software systems inevitably change as business requirements evolve, and having robust compile-time guarantees allows engineers to focus on business value rather than chasing type-related regressions across the application stack.

## See it

```typescript
// Square bracket syntax (idiomatic):
const tags: string[] = ['typescript', 'angular', 'web'];

// Generic array syntax (equivalent):
const scores: Array<number> = [95, 88, 100];

// Inferred element types:
const mixed = ['status', 200]; // Inferred as (string | number)[]

tags.push('frontend');
// tags.push(42); // Error: Argument of type 'number' is not assignable to parameter of type 'string'
```

> **Tip:** Use `readonly T[]` or `ReadonlyArray<T>` when you want to prevent mutating methods like `push()` or `splice()`.

## Go deeper

Comparing array syntax options and immutability modifiers:

| Syntax | Example | Mutability | Community Usage |
|---|---|---|---|
| Bracket syntax | `string[]` | Mutable | Standard default |
| Generic syntax | `Array<string>` | Mutable | Common in generic code |
| Readonly bracket | `readonly string[]` | Immutable | Recommended for function inputs |
| Readonly generic | `ReadonlyArray<string>` | Immutable | Standard library definition |

## Watch out

- An empty array initialized as const arr = [] infers any[] if not annotated or immediately populated.
- Array indexing (arr[i]) returns T by default, even if the index is out of bounds; consider noUncheckedIndexedAccess.

## Remember

- Annotate arrays using either T[] or Array<T> for identical compile-time guarantees.
- TypeScript infers element types automatically from the array initializer values.
- Use readonly T[] to prevent accidental mutation inside functions.
