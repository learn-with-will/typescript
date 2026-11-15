---
slug: type-argument-inference
title: "Type Argument Inference"
topic: generics
kind: concept
summary: "Learn how TypeScript automatically deduces generic type arguments from values passed into function calls."
tags: [generics, inference, tooling]
related: [generic-functions, generic-constraints, default-type-parameters]
---
> **In one line:** TypeScript automatically infers generic type parameters from the values you pass.

## The idea

When calling a generic function like `identity<T>(val: T): T`, you can explicitly write the type argument inside angle brackets: `identity<string>("hello")`.

However, doing this at every call site is verbose and unnecessary. In almost all circumstances, TypeScript’s type argument inference automatically inspects the arguments passed to the function and chooses the best type argument for you.

TypeScript examines the types of the arguments and determines the most specific common type that satisfies all uses of `T` in the parameter list. Explicit type arguments are only needed when a function has no arguments to infer from (like `fetchJson<User>()`) or when inference picks a type wider than you want.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

// Automatic type argument inference (idiomatic):
const inferredPair = pair('alice', 100); // Inferred as [string, number]

// Explicit type arguments (rarely needed unless overriding):
const explicitPair = pair<string, number>('bob', 200);

// Example requiring explicit type parameter (no argument to infer from):
function createEmptyList<T>(): T[] {
  return [];
}

const userList = createEmptyList<string>(); // Explicitly typed as string[]
```

> **Tip:** Trust type inference first; only provide explicit `<Type>` arguments when the compiler cannot infer from inputs.

## Go deeper

When explicit type arguments are required vs inferred:

| Scenario | Inference Possible? | Recommendation |
|---|---|---|
| Function has parameter typed as `T` | Yes | Rely on automatic inference |
| Return type uses `T` but no parameters do | No | Provide explicit type argument |
| Want to force a wider union type | Partial | Specify explicit union type argument |
| Factory / DI instantiation | No | Provide explicit target type |

## Watch out

- If argument types disagree across multiple positions, TypeScript infers a union type: pair(1, "a") -> (number | string)[].
- Over-specifying explicit type arguments makes refactoring harder and clutters code.

## Remember

- TypeScript infers type parameters automatically from function arguments.
- Only specify explicit type arguments when the function has no arguments to infer from.
- Inference chooses the narrowest common type satisfying all parameter positions.
