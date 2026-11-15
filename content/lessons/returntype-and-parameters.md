---
slug: returntype-and-parameters
title: "ReturnType and Parameters"
topic: utility-and-lookup-types
kind: api
summary: "Inspect function types to extract their return type with ReturnType<T> and parameter types with Parameters<T>."
tags: [utility-types, functions, reflection]
related: [exclude-and-extract, nonnullable-and-awaited, typeof-type-query]
---
> **In one line:** Use ReturnType<T> and Parameters<T> to extract function signatures into reusable types.

## The idea

In JavaScript development, you frequently work with libraries that export functions without exporting the corresponding types for their parameters or return values. For instance, a third-party library might export `createConnection(config)`, but never export the `ConnectionConfig` interface.

TypeScript provides powerful function reflection utilities: `ReturnType<T>` and `Parameters<T>`.

`ReturnType<T>` extracts the return type of a function type.
`Parameters<T>` extracts the parameter types as a tuple type. Combined with the `typeof` type query, you can extract types directly from any function implementation without duplicating signatures.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
function createUserSession(userId: string, rememberMe: boolean) {
  return {
    sessionId: 'sess_' + Math.random().toString(36),
    userId,
    expiresAt: rememberMe ? Date.now() + 86400000 : null
  };
}

// 1. Extract the return type without duplicating the shape:
type UserSession = ReturnType<typeof createUserSession>;

// 2. Extract parameter types as a tuple:
type SessionArgs = Parameters<typeof createUserSession>; // [userId: string, rememberMe: boolean]

const session: UserSession = {
  sessionId: 'sess_1',
  userId: 'usr_abc',
  expiresAt: 123456789
};
```

> **Tip:** You can access individual parameters from the tuple using indexed access: `Parameters<typeof fn>[0]`.

## Go deeper

Useful function reflection utilities in TypeScript:

| Utility Type | Argument | Resulting Type |
|---|---|---|
| `ReturnType<F>` | Function type `F` | The return value type of `F` |
| `Parameters<F>` | Function type `F` | Tuple of parameter types `[A, B, ...]` |
| `ConstructorParameters<C>` | Class constructor `C` | Tuple of constructor arguments |
| `InstanceType<C>` | Class constructor `C` | The instance type created by `new C()` |

## Watch out

- ReturnType requires a function type, not a function value; pass ReturnType<typeof fn>, not ReturnType<fn>.
- Overloaded functions only reflect the last overload signature when passed to ReturnType.

## Remember

- ReturnType<T> extracts the return type from a function type.
- Parameters<T> extracts parameter types as a typed tuple.
- Pair these utilities with typeof to inspect functions from external libraries.
