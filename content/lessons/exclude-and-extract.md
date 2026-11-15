---
slug: exclude-and-extract
title: "Exclude and Extract"
topic: utility-and-lookup-types
kind: api
summary: "Filter union types using Exclude<T, U> to remove unwanted members and Extract<T, U> to keep matching members."
tags: [utility-types, exclude, extract, unions]
related: [returntype-and-parameters, nonnullable-and-awaited, pick-and-omit]
---
> **In one line:** Use Exclude<T, U> to filter members out of a union and Extract<T, U> to keep matching members.

## The idea

While `Pick` and `Omit` operate on object property keys, `Exclude` and `Extract` operate on union types.

`Exclude<T, U>` constructs a type by excluding from `T` all union members that are assignable to `U`. For example, you can remove nullability, drop specific event names, or exclude internal action types from a public union.

`Extract<T, U>` does the exact opposite: it constructs a type by extracting from `T` all union members that are assignable to `U`. It is useful for finding the intersection of two unions or extracting a family of related event types from a broad union.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
type AllEvents = 'click' | 'hover' | 'scroll' | 'keydown' | 'keyup';

// Exclude mouse events from the union:
type NonMouseEvents = Exclude<AllEvents, 'click' | 'hover' | 'scroll'>;
// Inferred as: "keydown" | "keyup"

// Extract only keyboard events:
type KeyboardEvents = Extract<AllEvents, 'keydown' | 'keyup' | 'focus'>;
// Inferred as: "keydown" | "keyup"

// Removing specific types:
type MixedData = string | number | boolean | (() => void);
type SerializableData = Exclude<MixedData, Function>;
// Inferred as: string | number | boolean
```

> **Tip:** `Exclude` and `Extract` are implemented using distributive conditional types under the hood.

## Go deeper

How `Exclude` and `Extract` distribute across union members:

| Operation | Input Union `T` | Target Filter `U` | Resulting Type |
|---|---|---|---|
| `Exclude<T, U>` | `'a' | 'b' | 'c'` | `'a'` | `'b' | 'c'` |
| `Exclude<T, U>` | `string | number | null` | `null` | `string | number` |
| `Extract<T, U>` | `'a' | 'b' | 'c'` | `'a' | 'f'` | `'a'` |
| `Extract<T, U>` | `string | boolean` | `boolean` | `boolean` |

## Watch out

- Do not confuse Exclude (for unions) with Omit (for object properties).
- Exclude uses assignability; Exclude<string | number, number> removes all numbers.

## Remember

- Exclude<T, U> removes types in U from the union T.
- Extract<T, U> preserves only types in T that match U.
- Use Exclude and Extract to manipulate and specialize union types.
