---
slug: strict-mode
title: "Compiler Strict Mode"
topic: getting-started
kind: technique
summary: "Enabling the strict flag activates a family of essential type-safety checks that prevent null pointers and implicit any types."
tags: [strict, safety, configuration]
related: [tsconfig-json, compile-with-tsc, what-typescript-adds]
---
> **In one line:** Setting strict: true in tsconfig activates the complete family of strict type-checking flags at once.

## The idea

When developers discuss the safety and reliability of TypeScript, they are almost always referring to TypeScript with strict mode enabled. By default in older releases or minimal setups, TypeScript permitted variables to implicitly default to `any` and treated `null` and `undefined` as valid values for any type.

Setting `"strict": true` in your `tsconfig.json` turns on a bundle of strict type-checking options simultaneously. These include `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, and `strictPropertyInitialization`.

Running in strict mode eliminates entire categories of runtime bugs, including the dreaded "cannot read property of undefined". While migrating an existing JavaScript codebase into strict mode requires addressing errors gradually, all new projects should start with strict mode enabled from day one.

Strict mode ensures that types represent reality: if a variable can be null, the type must explicitly state it, and code must handle that possibility.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// With "strict": true:

// 1. noImplicitAny prevents untyped parameters:
function calculateTax(amount: number, taxRate: number): number {
  return amount * taxRate;
}

// 2. strictNullChecks requires narrowing null before property access:
function getUsernameLength(name: string | null): number {
  if (name === null) {
    return 0;
  }
  return name.length; // Safe: narrowed to string
}
```

> **Tip:** If strict: true is too strict for an existing legacy codebase, you can toggle individual flags like `noImplicitAny` one by one during migration.

## Go deeper

Sub-flags bundled under the master strict option:

| Sub-flag Enabled by strict | What It Prevents |
|---|---|
| `strictNullChecks` | Assigning null or undefined to ordinary types |
| `noImplicitAny` | Variables falling back to any when inference fails |
| `strictFunctionTypes` | Unsound parameter bivariance on function arguments |
| `strictPropertyInitialization` | Uninitialized class fields without constructors |
| `alwaysStrict` | Emits 'use strict' in every compiled output file |

## Watch out

- Turning off strictNullChecks allows null into any variable, leading to runtime null pointer crashes.
- Disabling strict in new projects creates a false sense of security while leaving types vulnerable.

## Remember

- Setting strict: true enables all core strictness flags simultaneously.
- strictNullChecks prevents unexpected null and undefined runtime errors.
- Always start new TypeScript projects with strict: true enabled from the beginning.
