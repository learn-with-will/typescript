---
slug: const-assertions-as-const
title: "const Assertions Deep Dive"
topic: unions-and-narrowing
kind: technique
summary: "Master const assertions to create deeply immutable configurations, tuple types, and extract type unions from data."
tags: [as-const, immutability, utility-patterns]
related: [const-assertions-for-literals, literal-widening, type-assertions-with-as]
---
> **In one line:** Use as const to lock data structures into deeply readonly literal representations.

## The idea

While we introduced `as const` for simple literals, its true power surfaces when applied to complex data structures like arrays of configuration objects or application route definitions.

When you apply `as const` to an entire data structure, TypeScript applies recursive immutability. Every nested object property becomes `readonly`, every array becomes a `readonly` tuple, and every primitive value retains its exact literal type rather than widening.

This technique bridges the gap between runtime data and compile-time types: you define your single source of truth as a plain JavaScript data structure, append `as const`, and then derive your TypeScript types directly from that data using `typeof`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Single source of truth data structure:
const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
  settings: '/settings/profile'
} as const;

// Derive a union of valid route paths from the data:
type AppRoute = typeof ROUTES[keyof typeof ROUTES]; // "/" | "/dashboard" | "/settings/profile"

function navigateTo(route: AppRoute): void {
  console.log(`Navigating to ${route}`);
}

navigateTo(ROUTES.home);
navigateTo('/dashboard');
// navigateTo('/unknown'); // Error: Argument of type '"/unknown"' is not assignable to 'AppRoute'
```

> **Tip:** Use `const ACTIONS = [...] as const` to derive Redux/store action type unions automatically.

## Go deeper

Comparing manual type declarations with `as const` derived types:

| Strategy | Maintenance Burden | Risk of Drift | Autocomplete Support |
|---|---|---|---|
| Manual enum + object | High (update both in sync) | High | Yes |
| Separate union type + data | Moderate (update type and array) | Moderate | Yes |
| Single `as const` object + derived type | Zero (single source of truth) | None | Complete |

## Watch out

- Attempting to mutate an as const structure anywhere will cause a compile-time error.
- as const can only be placed on literal expressions; it cannot be applied to an existing variable name.

## Remember

- as const makes entire object and array hierarchies deeply readonly and unwidened.
- Derive types directly from data using typeof DATA[keyof typeof DATA].
- Eliminate duplication by maintaining a single source of truth for constants and types.
