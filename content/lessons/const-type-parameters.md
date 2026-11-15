---
slug: const-type-parameters
title: "const Type Parameters"
topic: generics
kind: technique
summary: "Use <const T> on generic functions to preserve exact literal types and readonly tuple structures without manual as const."
tags: [generics, const-type-parameters, literals]
related: [const-assertions-as-const, generic-functions, type-argument-inference]
---
> **In one line:** Prefix type parameters with const (<const T>) to infer exact literal types automatically.

## The idea

Before TypeScript 5.0, when you passed an object or array literal to a generic function, TypeScript would widen the literal types to general primitives. Callers had to remember to manually append `as const` at the call site if they wanted to preserve exact literal values.

TypeScript 5.0 introduced `const` type parameters. By prefixing a type parameter with the `const` modifier (`<const T>`), you instruct the compiler to infer the narrowest possible literal types automatically at every call site.

This eliminates call-site ceremony. Callers can pass standard object and array literals, and TypeScript automatically infers them with exact literal properties and `readonly` tuple shapes.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Standard generic function (widens properties to string):
function createConfigStandard<T extends { routes: string[] }>(config: T): T {
  return config;
}
const c1 = createConfigStandard({ routes: ['/home', '/about'] });
// c1.routes is string[]

// Generic function with const type parameter (preserves literals):
function createConfigConst<const T extends { routes: readonly string[] }>(config: T): T {
  return config;
}
const c2 = createConfigConst({ routes: ['/home', '/about'] });
// c2.routes is readonly ["/home", "/about"]! Exact literals preserved!
```

> **Tip:** Use `<const T>` when authoring router configuration helpers, schema builders, or Redux store factories.

## Go deeper

Comparing standard type parameters and const type parameters:

| Feature | Standard `<T>` | Const Modifier `<const T>` |
|---|---|---|
| Inferred string literal | Widened to `string` | Preserved as exact `"literal"` |
| Inferred array | Inferred as mutable `T[]` | Inferred as `readonly [T, ...]` tuple |
| Caller requirements | Must manually write `as const` | Standard literal syntax (zero ceremony) |
| Added in version | TypeScript 1.0 | TypeScript 5.0 |

## Watch out

- Const type parameters result in readonly data structures; mutating properties in the body is forbidden.
- Passing an existing variable will not retroactively narrow it; the variable must already be typed narrowly.

## Remember

- Add const to type parameters (<const T>) to preserve literal types automatically.
- Array arguments are inferred as readonly tuples rather than mutable arrays.
- Const type parameters eliminate the need for callers to manually write as const.
