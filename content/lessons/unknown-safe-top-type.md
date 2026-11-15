---
slug: unknown-safe-top-type
title: "unknown: The Safe Top Type"
topic: basic-types
kind: technique
summary: "The unknown type represents any value safely, requiring you to narrow or inspect the type before performing operations."
tags: [unknown, narrowing, safety]
related: [any-the-escape-hatch, primitives-and-inference, strict-null-checks]
---
> **In one line:** The unknown type accepts any value but forbids any property access or invocation until narrowed.

## The idea

TypeScript needed a type that could represent any possible JavaScript value (the "top type") without disabling the type checker like `any` does. In TypeScript 3.0, the language introduced `unknown`.

Like `any`, any value in JavaScript can be assigned to a variable of type `unknown`: numbers, strings, objects, functions, or arrays. Unlike `any`, however, TypeScript refuses to let you perform any operations on an `unknown` value until you prove what type it actually is through type narrowing.

You cannot access properties, call methods, or pass an `unknown` value to a typed function without first narrowing it using `typeof`, `instanceof`, or custom type guards. This makes `unknown` the ideal choice for parsing JSON, API responses, or dynamic inputs.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
function handleUnknownInput(value: unknown): void {
  // Direct access is forbidden:
  // value.toUpperCase(); // Error: 'value' is of type 'unknown'

  // Safe access after narrowing:
  if (typeof value === 'string') {
    console.log('String value:', value.toUpperCase());
  } else if (typeof value === 'number') {
    console.log('Numeric value:', value.toFixed(2));
  }
}

handleUnknownInput('test');
handleUnknownInput(42.5);
```

> **Tip:** Whenever you are tempted to write `any` for dynamic payloads, write `unknown` instead to retain compiler safety.

## Go deeper

Comparing `any` versus `unknown` in daily TypeScript code:

| Behavior | `any` | `unknown` |
|---|---|---|
| Accepts any value? | Yes | Yes |
| Allows arbitrary property access? | Yes (unsafe) | No (compiler error) |
| Allows method calls? | Yes (unsafe) | No (compiler error) |
| Assignable to typed variables? | Yes (unsafe) | No (requires narrowing or cast) |
| Recommended for API inputs? | No | Yes |

## Watch out

- You cannot assign unknown to boolean, number, or string without explicit type narrowing.
- Using as MyType directly on unknown bypasses runtime validation; prefer narrowing guards.

## Remember

- unknown is TypeScript’s type-safe top type that can accept any value.
- TypeScript blocks property access and method calls on unknown until it is narrowed.
- Use unknown as the return type for JSON parsers and untrusted network endpoints.
