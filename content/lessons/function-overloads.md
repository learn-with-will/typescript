---
slug: function-overloads
title: "Function Overloads"
topic: functions
kind: technique
summary: "Specify multiple call signatures for a single function to accurately type functions that behave differently based on inputs."
tags: [overloads, functions, signatures]
related: [typing-parameters-and-returns, declaring-this-in-functions, function-type-expressions]
---
> **In one line:** Declare multiple public overload signatures followed by a single compatible implementation.

## The idea

Some JavaScript functions can be called with different combinations of arguments and return different types accordingly. For example, a function might return a single object when passed an ID, but return an array of objects when passed a search filter.

TypeScript supports this pattern through function overloads. You write one or more overload signatures that describe the valid public ways to call the function. Following the overload signatures, you write a single implementation signature with a compatible implementation body.

Callers can only invoke the function using one of the declared overload signatures. The implementation signature itself is invisible to external callers, ensuring strict type safety at every call site.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Overload signatures (public API):
function makeDate(timestamp: number): Date;
function makeDate(year: number, month: number, day: number): Date;

// Implementation signature (internal):
function makeDate(yearOrTimestamp: number, month?: number, day?: number): Date {
  if (month !== undefined && day !== undefined) {
    return new Date(yearOrTimestamp, month - 1, day);
  }
  return new Date(yearOrTimestamp);
}

const d1 = makeDate(1672531199000); // OK
const d2 = makeDate(2025, 1, 1);    // OK
// const d3 = makeDate(2025, 1);     // Error: No overload expects 2 arguments!
```

> **Tip:** Always order overload signatures from most specific to least specific.

## Go deeper

Comparing function overloads with union parameter types:

| Pattern | When to Use | Advantages |
|---|---|---|
| Function Overloads | Different argument counts or input-dependent return types | Precise caller signatures |
| Union Types (`a: string | number`) | Same return type regardless of input | Simpler signature, less boilerplate |
| Generics | Return type derives directly from input argument type | Maximum flexibility |

## Watch out

- The implementation signature cannot be called directly unless an overload signature matches it.
- The implementation body must be broad enough to handle all declared overload signatures.

## Remember

- Overload signatures define the only valid ways callers can invoke the function.
- The implementation signature must be compatible with all overload signatures.
- Prefer simple union types over overloads when the return type does not change.
