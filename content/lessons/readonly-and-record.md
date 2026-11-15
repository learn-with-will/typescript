---
slug: readonly-and-record
title: "Readonly and Record"
topic: utility-and-lookup-types
kind: api
summary: "Use Readonly<T> to freeze object properties at compile time, and Record<K, T> to construct typed dictionary maps."
tags: [utility-types, readonly, record]
related: [partial-and-required, pick-and-omit, keyof-type-operator]
---
> **In one line:** Use Readonly<T> for immutable object contracts and Record<K, T> for dictionary maps.

## The idea

Two more essential built-in utilities are `Readonly<T>` and `Record<K, T>`.

`Readonly<T>` adds the `readonly` modifier to every property of type `T`. Once typed as `Readonly<T>`, properties cannot be reassigned. This is standard in Redux reducers, state management, and functional programming where data must not be mutated in-place.

`Record<K, T>` constructs an object type whose keys are `K` and whose values are `T`. It provides a clean, concise alternative to manual index signatures. When `K` is a union of string literals (like `'admin' | 'user'`), `Record<K, T>` requires every single key in the union to be defined, preventing missing dictionary entries.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface ConfigSettings {
  apiEndpoint: string;
  maxRetries: number;
}

// 1. Readonly<T> prevents property reassignment:
const appConfig: Readonly<ConfigSettings> = {
  apiEndpoint: 'https://api.example.com',
  maxRetries: 3
};
// appConfig.maxRetries = 5; // Error: Cannot assign to 'maxRetries' because it is a read-only property

// 2. Record<K, T> creates typed dictionary maps:
type Role = 'admin' | 'editor' | 'guest';

const rolePermissions: Record<Role, string[]> = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  guest: ['read']
};
```

> **Tip:** If `Record<string, T>` is used, consider enabling `noUncheckedIndexedAccess` so lookup results include `undefined`.

## Go deeper

Comparing `Record<K, T>` with manual index signatures:

| Approach | Key Flexibility | Enforces Exhaustive Keys? |
|---|---|---|
| `Record<'a' | 'b', number>` | Literal Union | Yes (both `'a'` and `'b'` required) |
| `{ [key: string]: number }` | Arbitrary string | No (any string allowed) |
| `Record<string, number>` | Arbitrary string | No (any string allowed) |

## Watch out

- Readonly<T> is shallow; objects nested inside properties remain mutable.
- Record with a literal union requires ALL keys in the union to be populated; use Partial<Record<...>> if optional.

## Remember

- Readonly<T> marks all properties of T as read-only at compile time.
- Record<K, T> maps a set of keys K to values of type T.
- Using Record with a literal union enforces exhaustive key coverage.
