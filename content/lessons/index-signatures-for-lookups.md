---
slug: index-signatures-for-lookups
title: "Index Signatures for Lookups"
topic: objects-and-shapes
kind: technique
summary: "Use index signatures [key: string]: T to describe dictionary objects and lookup tables with dynamic property names."
tags: [index-signatures, dictionaries, objects]
related: [object-type-annotations, interfaces-for-object-shapes, excess-property-checks]
---
> **In one line:** Define dictionary shapes with dynamic keys using index signatures like [key: string]: T.

## The idea

Sometimes you need to represent an object where the exact property names are not known ahead of time, but you know that all values will conform to a specific type. Examples include cache maps, HTTP header dictionaries, environment variable tables, or lookup dictionaries.

TypeScript provides index signatures to describe these dictionary structures: `[key: string]: ValueType`. This informs the compiler that any string property accessed on this object will yield a value of type `ValueType`.

Index signature keys must be either `string`, `number`, `symbol`, or template literal types. If an interface defines both named properties and an index signature, all named property types must be assignable to the index signature's value type.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
interface HeaderMap {
  [headerName: string]: string; // Any string key yields a string value
}

const requestHeaders: HeaderMap = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer secret-token-xyz',
  'X-Custom-Client': 'web-v2'
};

function logHeader(headers: HeaderMap, name: string): void {
  const value = headers[name];
  console.log(`${name}: ${value}`);
}

logHeader(requestHeaders, 'Content-Type');
```

> **Tip:** In modern TypeScript, the built-in utility type `Record<string, ValueType>` is often preferred over manual index signatures.

## Go deeper

Comparing index signatures with typed dictionary alternatives:

| Pattern | Example | Notes |
|---|---|---|
| Interface Index Signature | `interface D { [k: string]: number }` | Can mix with explicit known properties |
| `Record<K, V>` utility | `type D = Record<string, number>` | Concise, idiomatic utility type |
| `Map<K, V>` class | `const m = new Map<string, number>()` | True runtime hash map with arbitrary keys |

## Watch out

- By default, indexing into an index signature returns T even if the key is missing; enable noUncheckedIndexedAccess.
- All explicitly named properties must conform to the index signature return type.

## Remember

- Use [key: string]: T to describe dictionary objects with dynamic property keys.
- Index keys can be string, number, symbol, or template literal patterns.
- Consider enabling noUncheckedIndexedAccess to include undefined in lookup returns.
