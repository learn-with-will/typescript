---
slug: primitives-and-inference
title: "Primitives and Inference"
topic: basic-types
kind: concept
summary: "TypeScript primitive types mirror JavaScript primitives, with lowercase keywords like string, number, and boolean."
tags: [primitives, types, inference]
related: [array-type-syntax, any-the-escape-hatch, unknown-safe-top-type]
---
> **In one line:** Use lowercase keywords like string and number to type JavaScript primitive values.

## The idea

JavaScript defines seven primitive types: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, and `undefined`. TypeScript mirrors each of these runtime primitives with a corresponding lowercase type keyword. When you annotate a variable with one of these types, the compiler ensures that only compatible values are assigned and provides accurate autocompletion for valid methods.

It is important to never use the uppercase wrapper types like `String`, `Number`, or `Boolean` as type annotations. In JavaScript, those are wrapper object constructors. In TypeScript typing, annotating with `String` refers to the rare boxed object wrapper rather than the primitive string value, leading to confusing assignability errors.

When declaring variables with initial values, TypeScript often infers the primitive type automatically. You do not need to clutter your code with redundant annotations like `let count: number = 0`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Primitives with explicit annotations:
const username: string = 'alice';
const loginAttempts: number = 3;
const isAccountActive: boolean = true;
const sessionToken: symbol = Symbol('session');
const maxTransaction: bigint = 9007199254740995n;

console.log(username.toUpperCase());
// username = 42; // Error: Type 'number' is not assignable to type 'string'
```

> **Tip:** Always use lowercase `string`, `number`, and `boolean` instead of uppercase wrapper types like `String` or `Number`.

## Go deeper

Comparing primitive annotations with object wrapper constructors:

| JavaScript Primitive | Correct TypeScript Type | Dangerous Wrapper Object |
|---|---|---|
| Text strings | `string` | `String` |
| Floating/integer numbers | `number` | `Number` |
| True / false | `boolean` | `Boolean` |
| Arbitrary precision integers | `bigint` | `BigInt` |
| Unique identifiers | `symbol` | `Symbol` |

## Watch out

- Never use uppercase String or Number for annotations; they represent boxed wrapper objects.
- JavaScript numbers are all 64-bit floats; TypeScript does not have separate int or float types.

## Remember

- TypeScript primitives use lowercase keywords: string, number, boolean, bigint, and symbol.
- Never annotate variables with uppercase wrapper constructors like String or Number.
- TypeScript infers primitive types automatically when variables are initialized on declaration.
