---
slug: no-unchecked-indexed-access
title: "noUncheckedIndexedAccess"
topic: modules-and-config
kind: technique
summary: "Enable noUncheckedIndexedAccess to include undefined in lookup types on arrays and index signatures."
tags: [compiler-flags, arrays, safety]
related: [strict-flag-breakdown, compiler-target-and-lib, verbatim-module-syntax]
---
> **In one line:** Enable noUncheckedIndexedAccess to automatically add undefined to all array and dictionary lookups.

## The idea

By default—even with `"strict": true` enabled—TypeScript makes an unsound assumption about array indexing. If you have an array `const users: string[] = []`, accessing `users[0]` is typed as `string`, even though the array is completely empty at runtime and `users[0]` evaluates to `undefined`!

This default exists for historical ergonomics, but it is a major source of runtime `TypeError` bugs in production software.

Enabling `"noUncheckedIndexedAccess": true` in `tsconfig.json` fixes this blind spot. Whenever you look up an element by index in an array or dictionary, TypeScript types the result as `T | undefined`, forcing you to verify that the element actually exists before using it.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// With "noUncheckedIndexedAccess": true

const names: string[] = ['Alice', 'Bob'];

// Without flag: inferred as string (unsound!)
// With flag: inferred as string | undefined (sound!)
const firstPerson = names[0];
const tenthPerson = names[10];

// Compiler forces you to check before accessing properties:
// console.log(tenthPerson.toUpperCase()); // Error: 'tenthPerson' is possibly 'undefined'

if (tenthPerson !== undefined) {
  console.log(tenthPerson.toUpperCase()); // Safe
}
```

> **Tip:** Pair `noUncheckedIndexedAccess` with optional chaining (`names[0]?.toUpperCase()`) for clean, safe access.

## Go deeper

Comparing indexing behavior with and without the flag:

| Code Expression | Default `strict: true` | With `noUncheckedIndexedAccess: true` |
|---|---|---|
| `const item = list[5];` | `Item` (assumes element exists) | `Item | undefined` (forces check) |
| `const val = dict['key'];` | `Value` (assumes key exists) | `Value | undefined` (forces check) |
| Array destructuring `[a, b]` | `a: Item, b: Item` | `a: Item | undefined, b: Item | undefined` |

## Watch out

- Array methods like forEach and map already guarantee items exist; this flag only affects direct index access ([i]).
- Enabling this flag on an existing large codebase will surface dozens of unhandled undefined warnings.

## Remember

- noUncheckedIndexedAccess adds undefined to all array index and dictionary lookups.
- It eliminates unexpected runtime undefined errors when accessing out-of-bounds indices.
- Use optional chaining (?.) to access properties cleanly under this flag.
