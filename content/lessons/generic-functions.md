---
slug: generic-functions
title: "Generic Functions"
topic: generics
kind: concept
summary: "Write reusable functions with type parameters that capture argument types and preserve type relationships."
tags: [generics, functions, type-parameters]
related: [generic-interfaces-and-classes, generic-constraints, type-argument-inference]
---
> **In one line:** Use <T> to create functions that work across multiple types while preserving exact type safety.

## The idea

Without generics, you face a frustrating dilemma when writing reusable utilities. If you write a function with a concrete type like `string`, it only works on strings. If you write it with `any`, the function works on everything, but you lose all type safety: the return value is `any`, and TypeScript cannot know what type was returned.

Generics solve this by introducing type variables (commonly named `T`, `U`, `V`). A type parameter acts as a placeholder that captures the specific type provided by the caller at the call site.

When you declare `function first<T>(arr: T[]): T | undefined`, TypeScript binds `T` to the element type of the argument passed in. If you pass an array of numbers, `T` is `number`, and the return type is guaranteed to be `number | undefined`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Generic identity function capturing type T:
function identity<T>(value: T): T {
  return value;
}

const strOutput = identity('hello'); // Inferred as string
const numOutput = identity(42);      // Inferred as number

// Generic utility extracting the first element of any array:
function firstElement<T>(items: T[]): T | undefined {
  return items.length > 0 ? items[0] : undefined;
}

const activeTask = firstElement(['task-1', 'task-2']); // Inferred as string | undefined
const score = firstElement([100, 95, 88]);             // Inferred as number | undefined
```

> **Tip:** In most cases, you do not need to specify `<string>` manually; TypeScript infers `T` automatically from the arguments you pass.

## Go deeper

Comparing non-generic, any, and generic function designs:

| Implementation | Flexibility | Type Safety | Return Type for `fn(42)` |
|---|---|---|---|
| Concrete: `fn(x: number): number` | Low (only numbers) | 100% Safe | `number` |
| Any: `fn(x: any): any` | High (accepts all) | Zero safety | `any` (unsafe) |
| Generic: `fn<T>(x: T): T` | High (accepts all) | 100% Safe | `number` (exact) |

## Watch out

- Do not introduce a type parameter if it appears only once in the signature; standard types are simpler.
- Operations on unconstrained type parameter T are restricted to operations safe on unknown.

## Remember

- Generic functions use type parameters like <T> to capture caller types.
- TypeScript preserves exact type relationships between parameters and returns.
- Type argument inference deduces T automatically from function arguments.
