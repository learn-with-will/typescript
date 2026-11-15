---
slug: infer-return-and-promise
title: "infer in Real World Utilities"
topic: type-transformations
kind: technique
summary: "Examine how the TypeScript standard library implements ReturnType, Parameters, and Awaited using infer."
tags: [infer, utility-types, promises]
related: [infer-keyword, conditional-type-basics, conditional-type-pitfalls]
---
> **In one line:** Learn how infer extracts return types, constructor parameters, and unwraps Promise payloads.

## The idea

To appreciate the real-world utility of the `infer` keyword, it helps to inspect how the TypeScript standard library implements built-in utility types.

Almost every advanced reflection utility in `lib.es5.d.ts` is built from conditional types and `infer`:
- `ReturnType<T>`: Tests if `T` matches a callable signature, inferring `R`.
- `Parameters<T>`: Tests if `T` matches a callable signature, inferring the parameter tuple `P`.
- `Awaited<T>`: Recursively unwraps thenable objects by inferring the value passed to `then()`.

Understanding these patterns empowers you to write your own custom domain extractors, such as extracting component props in React, response payloads in Axios, or state types in Redux.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Official definition of ReturnType:
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// Official definition of Parameters:
type MyParameters<T> = T extends (...args: infer P) => any ? P : never;

// Custom utility: Unwrapping an API response container
interface ApiEnvelope<T> {
  status: number;
  payload: T;
}

type UnwrapPayload<T> = T extends ApiEnvelope<infer P> ? P : never;

type OrderPayload = UnwrapPayload<ApiEnvelope<{ orderId: string; total: number }>>;
// Inferred as: { orderId: string; total: number }
```

> **Tip:** You can make `infer` utilities recursive: `type DeepAwaited<T> = T extends Promise<infer U> ? DeepAwaited<U> : T`.

## Go deeper

Standard library utilities implemented using `infer`:

| Utility Type | Implementation Pattern | What It Extracts |
|---|---|---|
| `ReturnType<T>` | `T extends (...args: any[]) => infer R ? R : any` | Function return type |
| `Parameters<T>` | `T extends (...args: infer P) => any ? P : never` | Function parameters tuple |
| `ConstructorParameters<T>` | `T extends abstract new (...args: infer P) => any ? P : never` | Constructor parameter tuple |
| `InstanceType<T>` | `T extends abstract new (...args: any[]) => infer R ? R : any` | Class instance shape |

## Watch out

- Passing a non-function to ReturnType resolves to any or never; verify constraints using extends Function.
- Recursive infer types must have a base case to avoid compiler recursion depth errors.

## Remember

- ReturnType and Parameters use infer to extract function signatures dynamically.
- Custom utilities can pattern-match API envelopes and database model wrappers.
- Recursive conditional types with infer can unwrap nested structures like promises.
