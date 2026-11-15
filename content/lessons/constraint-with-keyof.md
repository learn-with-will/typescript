---
slug: constraint-with-keyof
title: "Constraining with keyof"
topic: generics
kind: technique
summary: "Use <K extends keyof T> to lock property access to existing keys on an object type, preventing typos at compile time."
tags: [generics, keyof, lookup]
related: [generic-constraints, generic-functions, type-argument-inference]
---
> **In one line:** Use <K extends keyof T> to create type-safe property accessors and getters.

## The idea

A common task in JavaScript is writing helper functions that read or set properties on an object dynamically, such as `getProperty(user, "email")`.

If you type the property name as general `string`, the compiler cannot verify whether that property actually exists on the object. Misspelling `"emial"` compiles cleanly and fails silently at runtime with `undefined`.

TypeScript solves this by allowing one type parameter to be constrained by another using the `keyof` operator: `<T, K extends keyof T>`. This guarantees that `K` can only be a valid key that actually exists on `T`, and the return type is accurately inferred as `T[K]`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

Adopting these idioms early ensures that code remains clean, readable, and resilient against future modifications. Software systems inevitably change as business requirements evolve, and having robust compile-time guarantees allows engineers to focus on business value rather than chasing type-related regressions across the application stack.

## See it

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = {
  id: 'usr_99',
  username: 'coder42',
  age: 28
};

const username = getProperty(user, 'username'); // Inferred as string
const age = getProperty(user, 'age');           // Inferred as number

// getProperty(user, 'unknownKey'); // Error: Argument of type '"unknownKey"' is not assignable to keyof user!
```

> **Tip:** This pattern powers many standard library utilities and framework helper methods like `pluck` or `select`.

## Go deeper

```flow
obj: Object of type T | user object @primary
key: K extends keyof T | validated property key @blue
val: Return type T[K] | exact property type @green
obj -> key: supplies valid keys via keyof
key -> val: indexes return type precisely
```

## Watch out

- Remember that keyof returns a union of all property keys (strings, numbers, symbols).
- Attempting to index an unconstrained generic without keyof causes a compile-time error.

## Remember

- Use <K extends keyof T> to link a key parameter to an object type parameter.
- The return type T[K] accurately reflects the exact type of that specific property.
- TypeScript catches nonexistent property names and typos at compile time.
