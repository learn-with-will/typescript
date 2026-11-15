---
slug: what-typescript-adds
title: "What TypeScript Adds"
topic: getting-started
kind: concept
summary: "TypeScript adds a compile-time type system on top of JavaScript without changing how your code executes at runtime."
tags: [fundamentals, javascript, compiler]
related: [type-erasure, structural-typing, errors-before-runtime]
---
> **In one line:** TypeScript adds compile-time type checking to JavaScript while preserving identical runtime semantics.

## The idea

JavaScript is dynamically typed: values have types, but variables and expressions do not carry compile-time constraints. Type errors only surface when your code actually runs in production or during manual testing. This flexibility makes initial prototyping fast, but as codebases grow across multiple teams and dozens of files, refactoring becomes risky and subtle typos go unnoticed until users encounter runtime crashes.

TypeScript solves this by adding an optional compile-time type layer directly on top of standard JavaScript syntax. Every valid JavaScript program is already valid TypeScript. You can introduce type annotations gradually where they provide the most clarity and safety, without rewriting existing code.

The TypeScript compiler checks your code against your annotations and inferred relationships. If you attempt to call a method that does not exist, pass invalid arguments to a function, or treat a string like an array, the compiler flags the problem immediately in your editor before the code ever runs.

Because the type system is completely erased during compilation, using TypeScript introduces zero performance overhead at runtime. Your browser or server executes standard, optimized JavaScript while your editor gives you instant auto-completion, inline documentation, and automated refactoring tools.

## See it

```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function calculateOrderTotal(items: CartItem[], discountRate: number): number {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = subtotal * (discountRate / 100);
  return subtotal - discount;
}

const cart: CartItem[] = [
  { id: 'item-1', name: 'TypeScript Handbook', price: 30, quantity: 2 },
  { id: 'item-2', name: 'Mechanical Keyboard', price: 120, quantity: 1 }
];

const total = calculateOrderTotal(cart, 10);
console.log(`Final order total: $${total.toFixed(2)}`);
```

> **Tip:** Start by typing function boundaries (parameters and return values); TypeScript will infer most local variables automatically.

## Go deeper

TypeScript’s approach to typing provides immense advantages across the software lifecycle compared to plain dynamic JavaScript:

| Capability | Plain JavaScript | TypeScript |
|---|---|---|
| Type Checking | At runtime when executed | At compile time in editor |
| Tooling & Autocomplete | Best-effort heuristic | Exact, schema-backed intelligence |
| Refactoring Safety | Manual find-and-replace | Automated, rename-safe transforms |
| Documentation | JSDoc comments (often outdated) | Living types enforced by compiler |
| Runtime Overhead | Standard execution | Zero runtime performance cost |

## Watch out

- TypeScript does not alter runtime behavior or fix logical errors that are syntactically valid.
- Relying entirely on any disables the type checker and removes the guarantees TypeScript provides.

## Remember

- TypeScript is a compile-time superset of JavaScript that preserves existing runtime semantics.
- Every valid JavaScript file is valid TypeScript and can be adopted incrementally.
- Type checking catches property mismatches and missing arguments before your code executes.
