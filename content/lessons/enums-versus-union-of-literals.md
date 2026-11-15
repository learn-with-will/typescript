---
slug: enums-versus-union-of-literals
title: "Enums vs Union of Literals"
topic: classes-and-enums
kind: technique
summary: "Learn why union of string literals with as const is the preferred modern alternative to enums in TypeScript."
tags: [enums, unions, best-practices]
related: [string-enums, const-enums-and-isolated-modules, const-assertions-as-const]
---
> **In one line:** Prefer union of string literals over enums for zero-overhead, idiomatic TypeScript.

## The idea

Enums were added to TypeScript before ECMAScript had finalized many modern language features. Over years of real-world usage, the TypeScript community and core team have increasingly gravitated toward union of string literals as the preferred idiom.

Enums introduce subtle quirks: they emit runtime objects, numeric enums allow unsound number assignments, string enums reject plain string literals, and `const enum` breaks single-file bundlers.

In contrast, a union of string literals (`type Status = 'pending' | 'active' | 'archived'`) is completely erased at compile time, has zero bundle overhead, accepts plain string literals naturally, and works seamlessly with all bundlers and JSON APIs without imports.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// The Modern Alternative: as const object + derived union type

export const ORDER_STATUS = {
  Pending: 'pending',
  Shipped: 'shipped',
  Delivered: 'delivered'
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
// Derived type: "pending" | "shipped" | "delivered"

function updateOrder(status: OrderStatus): void {
  console.log(`Updating status to ${status}`);
}

// Callers can pass either the object constant or the plain string:
updateOrder(ORDER_STATUS.Shipped); // OK
updateOrder('delivered');           // OK! (Enums forbid this)
```

> **Tip:** The `as const` pattern gives you both runtime object access (for dropdowns/iteration) and a compile-time union type.

## Go deeper

Comparing TypeScript enums vs string literal unions:

| Feature | TypeScript `enum` | Union of String Literals (`as const`) |
|---|---|---|
| Runtime Overhead | Emits JavaScript object | Zero runtime code (purely type) |
| Accepts raw literal? | No (`fn(Role.Admin)` required) | Yes (`fn('admin')` allowed) |
| Tooling compatibility | Can cause issues with Vite/Babel | 100% Native compatibility |
| JSON Serialization | Requires manual mapping | Direct transparent serialization |
| Autocomplete | Yes | Yes |

## Watch out

- Enums require importing the enum definition everywhere it is used; string literal unions do not.
- Refactoring string literals without TypeScript compiler checks is risky; always type the parameter.

## Remember

- Union of string literals is the modern, idiomatic alternative to enums in TypeScript.
- Use as const objects when you need both runtime array iteration and compile-time types.
- String literal unions add zero bytes to production bundle output.
