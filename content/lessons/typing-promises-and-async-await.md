---
slug: typing-promises-and-async-await
title: "Typing Promises and async/await"
topic: advanced-patterns
kind: technique
summary: "Accurately type asynchronous operations and async functions using generic Promise<T> signatures."
tags: [async, promises, await]
related: [typing-fetch-and-validating-json, typing-error-handling-in-catch, nonnullable-and-awaited]
---
> **In one line:** Async functions always return Promise<T>, and await unwraps Promise<T> to T.

## The idea

JavaScript asynchronous programming is centered around Promises and `async`/`await` syntax. In TypeScript, asynchronous operations are typed using the generic `Promise<T>` type, where `T` represents the resolved value type.

An `async` function in JavaScript always returns a Promise at runtime, even if you return a raw value inside the function body. Reflecting this, TypeScript requires the return type of any `async` function to be `Promise<T>`.

When you use the `await` keyword inside an `async` function, TypeScript unwraps the Promise: `await Promise<User>` resolves to type `User`. If you `await` a non-promise value (like `await 42`), TypeScript safely leaves the value as `number`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface OrderSummary {
  orderId: string;
  total: number;
}

// Async function explicitly annotated with Promise<T>:
async function fetchOrderSummary(orderId: string): Promise<OrderSummary> {
  // Simulating an asynchronous network call:
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ orderId, total: 149.50 });
    }, 10);
  });
}

async function handleCheckout(): Promise<void> {
  // 'await' unwraps Promise<OrderSummary> to OrderSummary:
  const order = await fetchOrderSummary('ord_882');
  console.log(`Order ${order.orderId} total: $${order.total.toFixed(2)}`);
}

handleCheckout();
```

> **Tip:** You do not need to manually construct Promises for async functions; any returned value is automatically wrapped in `Promise.resolve()`.

## Go deeper

Comparing Promise combinators and their TypeScript return types:

| Promise Method | Input Signature | Inferred Return Type |
|---|---|---|
| `Promise.all([p1, p2])` | `[Promise<A>, Promise<B>]` | `Promise<[A, B]>` (typed tuple) |
| `Promise.allSettled([p1])` | `[Promise<A>]` | `Promise<[PromiseSettledResult<A>]>` |
| `Promise.race([p1, p2])` | `[Promise<A>, Promise<B>]` | `Promise<A | B>` (union of results) |

## Watch out

- An async function cannot return a bare type T without Promise<T>; writing : User causes a compile error.
- Promise rejection types cannot be typed in TypeScript; Promise<T> only parameterizes the resolved value.

## Remember

- Async functions always return Promise<T> in their type annotations.
- The await keyword automatically unwraps Promise<T> into type T.
- Promise.all preserves array and tuple types across parallel asynchronous tasks.
