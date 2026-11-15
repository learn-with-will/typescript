---
slug: readonly-tuples-and-arrays
title: "readonly Tuples and Arrays"
topic: objects-and-shapes
kind: technique
summary: "Protect collections from accidental mutation using the readonly modifier or const assertions."
tags: [readonly, immutability, tuples]
related: [tuple-types, named-tuple-members, optional-and-readonly-properties]
---
> **In one line:** Prefix arrays and tuples with readonly to forbid mutating methods like push and pop.

## The idea

JavaScript arrays are inherently mutable: calling `push()`, `pop()`, `splice()`, or mutating elements by index directly alters the original collection. In modern functional programming and state-driven frameworks (like React or Angular Signals), mutating arrays in-place causes hard-to-track bugs and broken change detection.

TypeScript provides the `readonly` modifier for arrays and tuples. When you type an array as `readonly string[]` or a tuple as `readonly [number, number]`, the compiler removes all mutating methods from its type definition.

Attempts to call `push()`, `sort()`, or assign to an index (`arr[0] = 5`) result in immediate compile-time errors. Only non-mutating methods like `map()`, `filter()`, `slice()`, and `concat()` remain available.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Readonly array:
const allowedRoles: readonly string[] = ['admin', 'moderator', 'editor'];

// allowedRoles.push('guest'); // Error: Property 'push' does not exist on type 'readonly string[]'
// allowedRoles[0] = 'superadmin'; // Error: Index signature in type 'readonly string[]' only permits reading

// Readonly tuple via 'as const':
const originPoint = [0, 0] as const; // Inferred as readonly [0, 0]
// originPoint[0] = 1; // Error: Cannot assign to '0' because it is a read-only property

const upperRoles = allowedRoles.map(r => r.toUpperCase()); // Non-mutating methods work!
console.log(upperRoles);
```

> **Tip:** Use `as const` on array literals to instantly create a deeply `readonly` tuple with exact literal values.

## Go deeper

Comparing mutable arrays with readonly collections:

| Operation | Mutable Array (`string[]`) | Readonly Array (`readonly string[]`) |
|---|---|---|
| `arr.push('item')` | Allowed | Compile error |
| `arr[0] = 'new'` | Allowed | Compile error |
| `arr.map(...)` | Allowed (returns new array) | Allowed (returns new array) |
| `arr.slice(...)` | Allowed | Allowed |
| Assignable to `string[]`? | Yes | No (prevents downstream mutation) |

## Watch out

- A readonly array cannot be passed to a function expecting a mutable array parameter.
- readonly is shallow; if the array holds objects, those object properties remain mutable unless typed readonly.

## Remember

- Prefix arrays with readonly to disable mutating methods like push, pop, and splice.
- Use as const to create immutable tuples with precise literal element types.
- Readonly collections promote functional, immutable data flows in application state.
