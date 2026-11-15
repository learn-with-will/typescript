---
slug: keyof-type-operator
title: "The keyof Type Operator"
topic: utility-and-lookup-types
kind: concept
summary: "The keyof operator extracts a union of all property keys (strings, numbers, symbols) from an object type."
tags: [keyof, types, metaprogramming]
related: [typeof-type-query, indexed-access-types, combining-keyof-and-indexed-access]
---
> **In one line:** Use keyof Type to produce a string literal union of all property names on an object.

## The idea

In dynamic JavaScript, functions often accept property names as arguments (such as sorting by a column name, filtering by a field, or observing an object property). In untyped JavaScript, passing an invalid property name leads to silent bugs.

The `keyof` operator takes an object type and produces a union of its keys. For example, if `User` has properties `name`, `email`, and `age`, then `keyof User` produces the union type `"name" | "email" | "age"`.

When you combine `keyof` with function parameters or generic constraints, TypeScript validates that arguments match existing property names on the object, providing instant autocomplete and catching typos at compile time.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
interface Product {
  id: string;
  title: string;
  price: number;
  inStock: boolean;
}

// keyof produces: "id" | "title" | "price" | "inStock"
type ProductKey = keyof Product;

function sortProductsBy(field: ProductKey): void {
  console.log(`Sorting catalog by: ${field}`);
}

sortProductsBy('title'); // Valid
sortProductsBy('price'); // Valid
// sortProductsBy('discount'); // Error: Argument of type '"discount"' is not assignable to 'ProductKey'
```

> **Tip:** If an interface has an index signature `[k: string]: any`, `keyof` includes `string | number` because JavaScript coerces numbers to strings in object keys.

## Go deeper

Evaluating `keyof` across different object definitions:

| Type Definition | Result of `keyof T` |
|---|---|
| `interface User { name: string; age: number }` | `"name" | "age"` |
| `type Empty = {}` | `never` |
| `type Dict = { [k: string]: boolean }` | `string | number` |
| `type ArrayKeys = keyof [string, number]` | `"0" | "1" | "length" | "slice" ...` |

## Watch out

- keyof applied to an empty object type yields never.
- Remember that keyof operates on types, not on runtime values; use keyof typeof obj for runtime values.

## Remember

- keyof T produces a union of all known property keys of T.
- Combine keyof with function parameters to constrain arguments to valid property names.
- Use keyof typeof obj to query the keys of an existing runtime JavaScript object.
