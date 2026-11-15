---
slug: conditional-type-pitfalls
title: "Conditional Type Pitfalls"
topic: type-transformations
kind: pitfall
summary: "Avoid common pitfalls with conditional types including unexpected distribution, never handling, and circular recursion."
tags: [conditional-types, pitfalls, debugging]
related: [conditional-type-basics, distributive-conditionals, stop-distribution-with-tuples]
---
> **In one line:** Watch out for unintended distribution, invisible never branches, and recursion limits.

## The idea

While conditional types are powerful, their advanced metaprogramming capabilities can produce subtle and confusing bugs if you do not understand their edge cases.

The three most frequent pitfalls are:
1. **Unintended Distribution:** Passing a union to a naked conditional splits the union when you meant to test the whole type together.
2. **The `never` Trap:** Because `never` is an empty union of zero members, a distributive conditional type acting on `never` evaluates zero times, returning `never` immediately without ever entering the true or false branches!
3. **Type Instantiation Depth Limits:** Writing deeply recursive conditional types (like parsing strings or deeply nested objects) can exceed TypeScript's compiler recursion depth limit (typically 50 levels), failing with `Type instantiation is excessively deep and possibly infinite`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// The 'never' trap:
type IsNeverDistributive<T> = T extends never ? true : false;
type BuggedResult = IsNeverDistributive<never>; // Result is 'never', NOT true!

// The fix: Prevent distribution using tuples:
type IsNeverSafe<T> = [T] extends [never] ? true : false;
type FixedResult = IsNeverSafe<never>; // true!

// Unintended boolean split:
type IsBoolean<T> = T extends boolean ? 'yes' : 'no';
type BoolCheck = IsBoolean<boolean>; // Inferred as "yes" | "no" because boolean is true | false!
```

> **Watch out:** Remember that in TypeScript, `boolean` is internally defined as the union `true | false`, which triggers distributive behavior!

## Go deeper

Common conditional type bugs and their solutions:

| Bug Scenario | Why It Happens | Solution |
|---|---|---|
| `never` returns `never` | `never` is an empty union; 0 iterations run | Use `[T] extends [never]` |
| `boolean` returns both branches | `boolean` is `true | false` union | Wrap in tuple `[T] extends [boolean]` |
| Excessively deep recursion | Exceeds compiler recursion stack | Simplify recursion, use tail-call patterns |
| Return type becomes `any` | Fallback in `infer` was typed `any` | Use `never` as the fallback branch |

## Watch out

- Do not use any as the fallback branch in custom utilities; use never to avoid polluting types.
- Keep type transformations as simple as possible to ensure fast editor performance.

## Remember

- Always wrap type parameters in tuples ([T]) when testing for never or boolean.
- Remember that boolean is an internal union of true | false that distributes.
- Guard against excessively deep recursion when building recursive type utilities.
