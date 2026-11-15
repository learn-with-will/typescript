---
slug: void-return-type
title: "The void Return Type"
topic: functions
kind: concept
summary: "The void type indicates that a function does not return a meaningful value, distinguishing side-effects from undefined."
tags: [functions, void, return-types]
related: [typing-parameters-and-returns, function-type-expressions, contextual-typing]
---
> **In one line:** Use void to declare that a function executes for side effects and produces no usable return value.

## The idea

In JavaScript, a function that finishes execution without hitting a `return` statement implicitly returns the value `undefined`. However, in type system design, there is a subtle and important conceptual distinction between "this function returns undefined intentionally" and "this function returns nothing meaningful."

TypeScript uses `void` to indicate that a function runs for its side effects (such as logging to the console, rendering to the DOM, or mutating a store) and produces no usable value. If you attempt to assign the result of a `void` function to a variable and use it, the compiler flags an error.

In callback positions, TypeScript permits a callback typed with a `void` return to return an actual value that will simply be ignored by the caller. This allows methods like `Array.prototype.forEach` to accept callback functions that return values without causing type errors.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
function logSystemEvent(message: string): void {
  console.log(`[AUDIT] ${message}`);
  // No return statement, or a bare return;
}

const result = logSystemEvent('Server started');
// console.log(result.toUpperCase()); // Error: Property 'toUpperCase' does not exist on type 'void'

// Callback returning void allows ignored return values:
const numbers = [1, 2, 3];
numbers.forEach((n): void => {
  // Even if an expression returns something, void callback types ignore it safely:
});
```

> **Note:** Do not confuse `void` with `never`; a `void` function completes normally, whereas a `never` function never returns.

## Go deeper

Comparing void, undefined, and never return types:

| Return Type | Function Finishes? | Can Return a Value? | Purpose |
|---|---|---|---|
| `void` | Yes | No usable value | Functions called for side effects |
| `undefined` | Yes | Must return `undefined` | Functions that explicitly yield undefined |
| `never` | No | Never returns | Throws exception or infinite loop |

## Watch out

- Annotating a function as returning undefined requires an explicit return undefined statement.
- Using the returned value of a void function leads to compile-time errors.

## Remember

- void signifies that a function performs side effects and returns no usable value.
- TypeScript prevents code from reading or operating on the return value of a void function.
- Callback signatures with void returns safely ignore any returned value from the callback.
