---
slug: mapped-type-syntax
title: "Mapped Type Syntax"
topic: type-transformations
kind: concept
summary: "Use mapped types [K in keyof T] to create new object shapes by transforming properties of an existing type."
tags: [mapped-types, types, metaprogramming]
related: [mapping-modifiers-and-readonly, key-remapping-with-as, building-utility-types-with-mapping]
---
> **In one line:** Use [K in Keys]: ValueType to generate new object types by iterating over a union of keys.

## The idea

In JavaScript, when you want to transform an array of values into a new array, you use `Array.prototype.map()`. In TypeScript, when you want to transform the properties of an object type into a new object type, you use a mapped type.

A mapped type uses the index signature syntax combined with the `in` operator: `[K in Keys]: ValueType`. It iterates over each member of the union `Keys`, binding `K` to the current key name and establishing the property's type.

Mapped types allow you to avoid duplicating interface definitions. Instead of manually declaring an interface where all properties are booleans, or where all properties are getters, you can transform an existing model dynamically.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface FeatureFlags {
  darkMode: boolean;
  betaSearch: boolean;
  analyticsTracking: boolean;
}

// Mapped type that turns every property into a promise returning that type:
type PromisedProperties<T> = {
  [K in keyof T]: Promise<T[K]>;
};

type AsyncFeatureFlags = PromisedProperties<FeatureFlags>;
// Inferred as:
// {
//   darkMode: Promise<boolean>;
//   betaSearch: Promise<boolean>;
//   analyticsTracking: Promise<boolean>;
// }
```

> **Tip:** Mapped types can only be declared using type alias syntax (`type Mapped = ...`); they cannot be declared with `interface`.

## Go deeper

Comparing array `.map()` with type-level mapped types:

| Operation | JavaScript Runtime | TypeScript Compile Time |
|---|---|---|
| Syntax | `keys.map(k => transform(k))` | `{ [K in Keys]: Transform<K> }` |
| Input | Array of values | Union of string/number keys (`keyof T`) |
| Output | New JavaScript Array | New TypeScript Object Type |
| Purpose | Transform runtime data | Transform static compile-time shapes |

## Watch out

- Mapped types cannot be declared inside interfaces; always use type MyType = { [K in ...]: ... }.
- Iterating over a broad string index signature requires key remapping with as.

## Remember

- Mapped types iterate over keys using [K in keyof T]: NewType.
- They generate new object types by transforming existing property shapes.
- Mapped types must always be defined using type alias syntax.
