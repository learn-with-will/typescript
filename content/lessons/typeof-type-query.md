---
slug: typeof-type-query
title: "The typeof Type Query"
topic: utility-and-lookup-types
kind: technique
summary: "Use the TypeScript typeof type query in type positions to extract the type of an existing JavaScript variable or constant."
tags: [typeof, type-query, inference]
related: [keyof-type-operator, indexed-access-types, combining-keyof-and-indexed-access]
---
> **In one line:** Use typeof in type positions to refer to the compile-time type of an existing variable.

## The idea

JavaScript has a runtime `typeof` operator that returns a string describing a value's primitive type (such as `"string"` or `"object"`).

TypeScript introduces a distinct, compile-time `typeof` operator called the type query. When `typeof` is used in a type position (such as after a colon in an annotation or inside a type alias), it extracts the full compile-time type of a variable, function, or object without executing any code.

This allows you to treat a JavaScript configuration object, default settings map, or factory function as your single source of truth, deriving your TypeScript types directly from the implementation rather than writing redundant interfaces.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
const appSettings = {
  theme: 'dark',
  locale: 'en-US',
  timeoutMs: 5000,
  features: {
    experimentalSearch: true,
    betaDashboard: false
  }
};

// Extract the full object type directly from the runtime variable:
type AppSettings = typeof appSettings;

function initializeApp(settings: AppSettings): void {
  console.log(`Initialized app with theme ${settings.theme} and timeout ${settings.timeoutMs}ms`);
}

initializeApp(appSettings);
```

> **Tip:** You can combine `typeof` with `keyof` to extract the keys of an object: `keyof typeof obj`.

## Go deeper

Comparing JavaScript runtime `typeof` vs TypeScript compile-time `typeof`:

| Feature | JS Runtime `typeof x` | TS Type-Level `typeof x` |
|---|---|---|
| Where it appears | Inside expressions (`if (typeof x === ...)`) | Inside type annotations (`type T = typeof x`) |
| Return Value | String primitive name (e.g. `"object"`) | Full compile-time static type shape |
| Output in compiled JS | Preserved as `typeof` check | Completely erased from emitted JS |

## Watch out

- typeof can only be used on identifier names or property accesses; you cannot call functions inside typeof (typeof fn() fails).
- Do not confuse the type query with runtime typeof conditionals in if statements.

## Remember

- In type positions, typeof extracts the static type of a variable or constant.
- Use typeof to avoid duplicate type declarations for configuration objects.
- The type query is completely erased and adds zero runtime code.
