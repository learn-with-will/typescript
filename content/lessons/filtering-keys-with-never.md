---
slug: filtering-keys-with-never
title: "Filtering Keys with never"
topic: type-transformations
kind: technique
summary: "Filter out unwanted properties in mapped types by remapping their keys to never using the as clause."
tags: [mapped-types, filtering, never]
related: [key-remapping-with-as, mapped-type-syntax, building-utility-types-with-mapping]
---
> **In one line:** Remap a key to never using the as clause to exclude that property from the output type.

## The idea

A recurring need in TypeScript is creating a new object type that only includes properties of a certain type: for example, picking only the methods from a class, or picking only the string properties from a model.

While `Omit` can drop keys by name, it cannot filter keys by value type.

Using key remapping with `as`, you can conditionally evaluate each property's value. If the property does not match your criteria, you remap its key to `never`. When a key resolves to `never` in a mapped type, TypeScript completely omits that property from the generated object type.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface MixedModel {
  id: string;
  title: string;
  viewCount: number;
  published: boolean;
  calculateScore: () => number;
}

// Filter to keep ONLY function properties:
type OnlyMethods<T> = {
  [K in keyof T as T[K] extends Function ? K : never]: T[K];
};

type ModelMethods = OnlyMethods<MixedModel>;
// Inferred as: { calculateScore: () => number }

// Filter to keep ONLY string properties:
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type ModelStrings = OnlyStrings<MixedModel>;
// Inferred as: { id: string; title: string }
```

> **Tip:** This pattern provides a type-safe way to create DTOs that strip methods and metadata from database models.

## Go deeper

Step-by-step key filtering execution:

| Key `K` | Property Type `T[K]` | Condition `T[K] extends Function` | Remapped Key | Output in Type |
|---|---|---|---|---|
| `id` | `string` | False | `never` | Omitted |
| `viewCount` | `number` | False | `never` | Omitted |
| `calculateScore` | `() => number` | True | `calculateScore` | Preserved |

## Watch out

- Filtering keys using as K extends ... ? K : never only removes keys; it does not alter values.
- Be careful when filtering on boolean, as boolean is a union of true | false.

## Remember

- Remapping a key to never in a mapped type removes that property completely.
- Use conditional types inside the as clause to filter properties based on their value types.
- Enables extracting methods, primitives, or serializable fields from complex types.
