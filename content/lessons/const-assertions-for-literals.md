---
slug: const-assertions-for-literals
title: "const Assertions for Literals"
topic: unions-and-narrowing
kind: technique
summary: "Append as const to object and array literals to lock in exact literal types and make properties deeply readonly."
tags: [as-const, literals, immutability]
related: [literal-widening, literal-types, const-assertions-as-const]
---
> **In one line:** Use as const to prevent literal widening and make objects deeply readonly.

## The idea

When you declare an object literal using `const config = { role: 'admin' }`, TypeScript infers `role` as general `string` rather than literal `"admin"`. This is because JavaScript objects are mutable by default: code could later execute `config.role = 'user'`.

This automatic widening creates problems when passing configuration objects to functions expecting specific literal types.

To instruct TypeScript to treat an entire object or array literal as completely immutable and retain exact literal types, append `as const` (a const assertion). A const assertion tells the compiler:
1. No literal types in the expression should be widened to general primitives.
2. Object properties become `readonly`.
3. Array literals become `readonly` tuples.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Standard object: properties widen to string
const userWithoutConst = { role: 'admin' }; // { role: string }

// Object with const assertion: exact literal and readonly
const userWithConst = { role: 'admin' } as const; // { readonly role: "admin" }

type AdminRole = 'admin';

function verifyAdmin(role: AdminRole): void {
  console.log(`Verified admin role: ${role}`);
}

// verifyAdmin(userWithoutConst.role); // Error: Type 'string' is not assignable to 'admin'
verifyAdmin(userWithConst.role); // Compiles perfectly!
```

> **Tip:** You can derive a union type directly from a const array using `typeof MY_ARRAY[number]`.

## Go deeper

Comparing standard object declarations with `as const` assertions:

| Feature | `const obj = { val: 1 }` | `const obj = { val: 1 } as const` |
|---|---|---|
| Inferred Property Type | `number` (widened) | `1` (exact literal) |
| Mutability | Properties mutable (`obj.val = 2`) | Deeply `readonly` (mutation blocked) |
| Array Handling | Inferred as `number[]` | Inferred as `readonly [1]` tuple |
| Runtime Overhead | Standard object | Zero runtime overhead (erased) |

## Watch out

- as const is a compile-time assertion; it does not call Object.freeze() at runtime.
- as const can only be applied to literal expressions, not to variables or function calls.

## Remember

- Use as const on literals to retain exact primitive literal types.
- Const assertions turn object fields into readonly properties and arrays into readonly tuples.
- Derive reusable union types from const collections using typeof array[number].
