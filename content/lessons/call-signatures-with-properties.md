---
slug: call-signatures-with-properties
title: "Call Signatures with Properties"
topic: functions
kind: pattern
summary: "Type functions that have callable signatures and attached properties using interface syntax."
tags: [interfaces, functions, callable-objects]
related: [function-type-expressions, construct-signatures, contextual-typing]
---
> **In one line:** Use interface call signatures to describe functions that also carry properties.

## The idea

In JavaScript, functions are objects. This means you can attach arbitrary properties to a function instance, such as configuration settings, default options, or state counters. Popular libraries like jQuery (`$`), Express, and Lodash rely heavily on this callable-object pattern.

While arrow syntax `(x: number) => number` is great for simple functions, it cannot describe attached properties.

In TypeScript, you can use interface syntax with a call signature to type callable objects. An interface with a call signature describes an entity that can be invoked as a function while simultaneously exposing typed properties.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Interface describing a function with attached properties:
interface CounterFunction {
  (): number;             // Call signature
  reset(): void;          // Attached method
  currentCount: number;   // Attached property
}

function makeCounter(): CounterFunction {
  let count = 0;
  const counter = (() => ++count) as CounterFunction;
  counter.currentCount = count;
  counter.reset = () => { count = 0; };
  return counter;
}

const counter = makeCounter();
console.log(counter()); // 1
counter.reset();
```

> **Tip:** Use this pattern when creating customizable utility functions or middleware functions with default options.

## Go deeper

Comparing function typing representations:

| Feature | Function Type Expression | Interface with Call Signature |
|---|---|---|
| Syntax | `type F = (x: T) => R` | `interface F { (x: T): R; }` |
| Supports attached properties | No | Yes |
| Supports multiple overloads | No | Yes |
| Brevity | High | Moderate |

## Watch out

- Creating callable objects in JavaScript requires casting (as MyFunction) because object literals cannot be invoked.
- Do not use this pattern for simple callbacks; reserve it for APIs that legitimately attach properties to functions.

## Remember

- Interfaces can define call signatures alongside standard object properties.
- This pattern accurately models JavaScript libraries that attach utilities to functions.
- Call signatures allow the typed value to be invoked directly with parentheses.
