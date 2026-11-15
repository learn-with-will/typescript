---
slug: nonnullable-and-awaited
title: "NonNullable and Awaited"
topic: utility-and-lookup-types
kind: api
summary: "Strip null and undefined with NonNullable<T>, and unwrap nested Promises recursively using Awaited<T>."
tags: [utility-types, promises, async]
related: [exclude-and-extract, returntype-and-parameters, partial-and-required]
---
> **In one line:** Use NonNullable<T> to remove null/undefined and Awaited<T> to unwrap Promise types.

## The idea

Two common challenges in modern TypeScript applications are eliminating nullability from unions and typing asynchronous operations that return Promises.

`NonNullable<T>` constructs a type by removing `null` and `undefined` from `T`. If a type is `string | number | null | undefined`, passing it through `NonNullable` yields clean `string | number`.

`Awaited<T>` (introduced in TypeScript 4.5) models the runtime unwrapping behavior of `await` in `async` functions. It recursively unwraps Promises, `PromiseLike` objects, and nested `Promise<Promise<T>>` types until the underlying resolved value is reached.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

Adopting these idioms early ensures that code remains clean, readable, and resilient against future modifications. Software systems inevitably change as business requirements evolve, and having robust compile-time guarantees allows engineers to focus on business value rather than chasing type-related regressions across the application stack.

## See it

```typescript
// 1. NonNullable strips null and undefined:
type RawInput = string | number | null | undefined;
type CleanInput = NonNullable<RawInput>; // string | number

// 2. Awaited unwraps Promises recursively:
type SimplePromise = Promise<string>;
type ResolvedString = Awaited<SimplePromise>; // string

async function fetchOrderData() {
  return { orderId: 101, status: 'shipped' };
}

// Extract the resolved data shape from an async function:
type OrderData = Awaited<ReturnType<typeof fetchOrderData>>;
// Inferred as: { orderId: number; status: string }
```

> **Tip:** `Awaited<T>` accurately models `Promise.all` and `await` expressions in generic async pipelines.

## Go deeper

Comparing `NonNullable` and `Awaited` behaviors:

| Utility | Input Type | Transformed Output Type |
|---|---|---|
| `NonNullable<T>` | `string | null` | `string` |
| `NonNullable<T>` | `undefined | number` | `number` |
| `Awaited<T>` | `Promise<number>` | `number` |
| `Awaited<T>` | `Promise<Promise<boolean>>` | `boolean` (recursive unwrap) |
| `Awaited<T>` | `string` (not a promise) | `string` (passthrough) |

## Watch out

- NonNullable only removes null and undefined; it does not remove empty string or 0.
- Awaited requires TypeScript 4.5 or later.

## Remember

- NonNullable<T> eliminates null and undefined from any type union.
- Awaited<T> recursively unwraps Promise and Thenable types to their resolved values.
- Combine Awaited with ReturnType to type the results of asynchronous functions.
