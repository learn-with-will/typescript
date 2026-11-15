---
slug: default-type-parameters
title: "Default Type Parameters"
topic: generics
kind: technique
summary: "Provide fallback types using <T = DefaultType> so callers can omit type arguments when sensible defaults apply."
tags: [generics, defaults, syntax]
related: [generic-interfaces-and-classes, type-argument-inference, when-to-use-generics]
---
> **In one line:** Use <T = DefaultType> to provide fallback types for generic interfaces and classes.

## The idea

Just as function parameters can have default values (`prefix = 'Hello'`), generic type parameters can have default types: `<T = HTMLElement>`.

Default type parameters make generic types and interfaces much more ergonomic to use. If a caller does not provide an explicit type argument and the compiler cannot infer one from usage, TypeScript falls back to the default type.

This pattern is widely used in DOM libraries, HTTP clients, and UI frameworks. For instance, an HTML element reference might default to `HTMLElement`, but allow callers to specialize it to `HTMLInputElement` when needed.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Generic interface with a default type parameter:
interface PaginatedResponse<T = string> {
  page: number;
  totalPages: number;
  items: T[];
}

// 1. Using the default type (T defaults to string):
const stringList: PaginatedResponse = {
  page: 1,
  totalPages: 5,
  items: ['item-1', 'item-2']
};

// 2. Overriding the default type:
interface Order { id: number; total: number; }
const orderList: PaginatedResponse<Order> = {
  page: 1,
  totalPages: 10,
  items: [{ id: 101, total: 49.99 }]
};
```

> **Tip:** When combining constraints and defaults, the constraint comes first: `<T extends Element = HTMLElement>`.

## Go deeper

Comparing default type parameters with required type parameters:

| Declaration Style | Example | Caller Omits Type Argument? |
|---|---|---|
| Required Type Parameter | `interface Box<T> { ... }` | Error: Generic type requires 1 type argument |
| Default Type Parameter | `interface Box<T = unknown> { ... }` | Valid: `T` resolves to `unknown` |
| Constrained with Default | `interface Box<T extends HTMLElement = HTMLDivElement>` | Valid: `T` resolves to `HTMLDivElement` |

## Watch out

- Required type parameters cannot follow default type parameters in the parameter list.
- Default types must satisfy any extends constraint declared on the parameter.

## Remember

- Use <T = Default> to provide sensible fallback types for generic declarations.
- Callers can omit type arguments when the default type is sufficient.
- Constraints precede defaults: <T extends Constraint = Default>.
