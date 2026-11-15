---
slug: rest-parameters
title: "Rest Parameters"
topic: functions
kind: technique
summary: "Use ES6 rest parameter syntax with an array type annotation to accept arbitrary numbers of arguments with full type safety."
tags: [functions, rest, arrays]
related: [typing-parameters-and-returns, optional-and-default-parameters, function-type-expressions]
---
> **In one line:** Annotate rest parameters with an array type ...items: T[] to handle variable argument lists safely.

## The idea

In older JavaScript code, functions that accepted variable numbers of arguments accessed the implicit `arguments` object. The `arguments` object was array-like but lacked standard array methods and provided zero compile-time type safety.

Modern JavaScript and TypeScript use ES6 rest parameters (`...rest`) to collect zero or more trailing arguments into a real JavaScript array. In TypeScript, you annotate a rest parameter with an array or tuple type: `...names: string[]`.

The compiler verifies every argument passed at the call site against the element type. Inside the function, the rest parameter is a genuine array with full autocompletion for methods like `map()`, `reduce()`, and `forEach()`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
function sumAll(multiplier: number, ...numbers: number[]): number {
  const sum = numbers.reduce((total, n) => total + n, 0);
  return sum * multiplier;
}

// Callers can pass any number of numeric arguments:
const total1 = sumAll(2, 10, 20, 30); // 120
const total2 = sumAll(5);             // 0

console.log(`Total: ${total1}, ${total2}`);
// sumAll(2, 10, '20'); // Error: Argument of type 'string' is not assignable to 'number'
```

> **Tip:** You can also use tuple types for rest parameters to require a fixed pattern of arguments.

## Go deeper

Comparing rest parameters with legacy arguments:

| Feature | Rest Parameters (`...items: T[]`) | Legacy `arguments` object |
|---|---|---|
| Type Safety | Strictly checked against `T` | Untyped (`any`) |
| Array Methods | Full array support (`map`, `filter`) | Requires `Array.from()` conversion |
| Arrow Function Support | Fully supported | Not supported |
| Position | Must be the final parameter | Accessible anywhere in function body |

## Watch out

- A function can have at most one rest parameter, and it must always be the last parameter.
- Passing an array directly without spreading (...arr) will trigger a type mismatch.

## Remember

- Rest parameters collect variable numbers of arguments into a typed array.
- Annotate rest parameters using array syntax like ...items: T[].
- A rest parameter must always be the final parameter in the parameter list.
