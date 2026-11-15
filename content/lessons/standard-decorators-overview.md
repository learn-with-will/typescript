---
slug: standard-decorators-overview
title: "Standard Decorators Overview"
topic: advanced-patterns
kind: concept
summary: "Understand ECMAScript Stage 3 standard decorators supported natively in TypeScript 5.0+ without experimental flags."
tags: [decorators, ecmascript, oop]
related: [class-and-method-decorators, field-and-accessor-decorators, standard-versus-legacy-decorators]
---
> **In one line:** Standard decorators (TS 5.0+) conform to ECMAScript standards and require no experimental compiler flags.

## The idea

For many years, TypeScript supported an early, non-standard version of decorators under the `"experimentalDecorators": true` flag. Popular frameworks like Angular and NestJS adopted this syntax extensively.

In TypeScript 5.0, the language introduced full support for the official ECMAScript Stage 3 standard decorators specification. Standard decorators work out of the box with zero experimental compiler flags required.

A standard decorator is simply a function applied to a class, method, getter, setter, or field using the `@decorator` syntax. Decorators allow you to wrap, observe, modify, or replace class members cleanly and declaratively.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Standard ECMAScript decorator function:
// Receives the target value and a context object
function logged<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
  const methodName = String(context.name);
  return function (this: This, ...args: Args): Return {
    console.log(`Calling method: ${methodName}`);
    return target.call(this, ...args);
  };
}

class PaymentService {
  @logged
  processPayment(amount: number): boolean {
    return amount > 0;
  }
}

const service = new PaymentService();
service.processPayment(50); // Automatically logs: "Calling method: processPayment"
```

> **Tip:** Standard decorators do not require `experimentalDecorators: true` in `tsconfig.json`.

## Go deeper

Decorators execution order during class definition:

| Decorator Type | Decorates | Evaluated When? |
|---|---|---|
| Method Decorator | Class methods | Once when class definition is evaluated |
| Accessor Decorator | `get` and `set` accessors | Once when class definition is evaluated |
| Field Decorator | Class instance fields | Runs initializer on each new instance |
| Class Decorator | The constructor itself | Once after all members are decorated |

## Watch out

- Standard decorators cannot decorate function parameters; parameter decorators were in legacy decorators only.
- Do not enable experimentalDecorators if you intend to use standard ECMAScript decorators.

## Remember

- Standard decorators conform to the official ECMAScript Stage 3 specification.
- They work out of the box in TypeScript 5.0+ without experimental compiler flags.
- Decorators receive the decorated entity and a strongly typed context object.
