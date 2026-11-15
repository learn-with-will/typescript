---
slug: tuple-types
title: "Tuple Types"
topic: objects-and-shapes
kind: technique
summary: "Tuples represent fixed-length arrays where each index position holds a distinct, strongly-typed value."
tags: [tuples, arrays, collections]
related: [named-tuple-members, readonly-tuples-and-arrays, type-aliases-basics]
---
> **In one line:** Tuples define fixed-length arrays with distinct types at each specific index position.

## The idea

While standard TypeScript arrays (`T[]`) can hold an arbitrary number of items of the same type, many programming patterns require an array of fixed length where each position has a specific meaning and type. Familiar examples include key-value pairs (`[string, number]`), coordinate pairs (`[number, number]`), or React hook returns (`[state, setState]`).

TypeScript represents this pattern using tuple types. A tuple is written using bracket notation with comma-separated types: `[string, number, boolean]`.

The compiler enforces the exact length of the tuple and verifies that values assigned to each index match the type specified for that position. Attempting to access an index beyond the declared length triggers a compile-time error.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Defining a 2-element tuple for coordinates:
type GeoCoordinate = [number, number];

const officeLocation: GeoCoordinate = [37.7749, -122.4194];

const lat = officeLocation[0]; // Inferred as number
const lng = officeLocation[1]; // Inferred as number

// Tuple bounds and types are strictly enforced:
// officeLocation[2]; // Error: Tuple type has no element at index '2'
// const invalid: GeoCoordinate = [37.77, 'west']; // Error: 'string' not assignable to 'number'
```

> **Tip:** Functions that return multiple related values often return tuples (similar to `React.useState`).

## Go deeper

Comparing standard arrays with tuple types:

| Characteristic | Standard Array (`string[]`) | Tuple Type (`[string, number]`) |
|---|---|---|
| Length | Variable (0 to infinity) | Fixed (unless optional elements used) |
| Element Types | Homogeneous (or union `(A | B)[]`) | Position-specific distinct types |
| Index Access | Always returns element type `T` | Returns exact type for that index |
| Best Used For | Lists, collections, search results | Key-value pairs, coordinate points |

## Watch out

- By default in older TS versions, array.push() on tuples was allowed; use readonly tuples to prevent mutation.
- Initializing an array without an explicit tuple annotation infers a union array rather than a tuple.

## Remember

- Tuples define fixed-length arrays with position-specific types.
- Accessing indices beyond the tuple length produces a compile-time error.
- Tuples are commonly used for coordinate pairs, key-value entries, and hook returns.
