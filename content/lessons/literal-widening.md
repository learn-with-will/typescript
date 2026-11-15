---
slug: literal-widening
title: "Literal Widening"
topic: unions-and-narrowing
kind: concept
summary: "Understand how TypeScript widens literal values to general primitives when variables are declared with let instead of const."
tags: [inference, widening, literals]
related: [literal-types, const-assertions-for-literals, union-types]
---
> **In one line:** Variables declared with let widen to general types, while const preserves exact literal types.

## The idea

When TypeScript infers the type of an initialized variable, its inference strategy depends directly on whether the variable can be reassigned.

If you declare a variable using `const`, TypeScript knows that the value can never change. Therefore, it infers the narrowest possible type: the exact literal type (for example, `const method = 'GET'` is inferred as the literal type `"GET"`).

Conversely, if you declare the variable using `let`, TypeScript assumes you intend to reassign it to other values in the future. To allow this, it widens the literal type to its parent primitive: `let method = 'GET'` is inferred as the general type `string`. This process is known as literal widening.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// const infers the narrow literal type:
const defaultMethod = 'GET'; // Inferred type is "GET"

// let widens to the broad primitive type:
let dynamicMethod = 'GET'; // Inferred type is string

type HttpMethod = 'GET' | 'POST';

function makeRequest(url: string, method: HttpMethod): void {
  console.log(`${method} ${url}`);
}

makeRequest('/api', defaultMethod); // OK: "GET" is assignable to HttpMethod
// makeRequest('/api', dynamicMethod); // Error: Type 'string' is not assignable to 'HttpMethod'
```

> **Tip:** If you need a `let` variable to hold a literal union, add an explicit type annotation: `let method: HttpMethod = 'GET'`.

## Go deeper

Demonstrating inference behavior between variable declaration keywords:

| Declaration Syntax | Inferred Type | Reassignable? | Assignable to Literal Union? |
|---|---|---|---|
| `const x = 'light'` | `"light"` | No | Yes |
| `let x = 'light'` | `string` | Yes (to any string) | No (too wide) |
| `let x: 'light' | 'dark' = 'light'` | `"light" | "dark"` | Yes (to allowed union) | Yes |
| `const obj = { mode: 'light' }` | `{ mode: string }` | Properties mutable | No (property widens) |

## Watch out

- Object literal properties widen to string even when declared with const: { mode: "light" } has mode: string.
- Use as const to prevent object properties from widening to general primitive types.

## Remember

- let declarations widen literal values to general primitives like string or number.
- const declarations preserve exact literal types for immutable values.
- Annotate let variables with union types when they will be reassigned among a finite set.
