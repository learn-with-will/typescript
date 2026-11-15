---
slug: compiler-target-and-lib
title: "compilerOptions: target and lib"
topic: modules-and-config
kind: technique
summary: "Configure target to set the emitted JavaScript version and lib to define which built-in global APIs are available."
tags: [compiler, target, lib]
related: [module-resolution, strict-flag-breakdown, skip-lib-check]
---
> **In one line:** Use target to set output JavaScript syntax and lib to control available built-in APIs.

## The idea

Two of the most foundational settings in `tsconfig.json` are `target` and `lib`. While they sound similar, they perform completely different roles in compilation.

`target` specifies the ECMAScript language version of the emitted JavaScript. If you set `"target": "ES2022"`, the compiler will preserve modern syntax like async/await, class fields, and optional chaining. If you set `"target": "ES5"`, the compiler downlevels modern syntax into older function and prototype equivalents.

`lib` tells the compiler which standard runtime APIs are available in your execution environment. For example, `"DOM"` provides types for `window`, `document`, and HTML elements. `"ES2022"` provides types for `Array.prototype.at` and `Promise.allSettled`. If you are writing a Node.js backend, you omit `"DOM"` so that browser-only globals are flagged as errors.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```json
{
  "compilerOptions": {
    // 1. Output ECMAScript version:
    "target": "ES2022",

    // 2. Available global type definitions:
    "lib": ["ES2022", "DOM", "DOM.Iterable"],

    "module": "ESNext",
    "strict": true
  }
}
```

```typescript
// If 'DOM' is in lib, browser globals are typed:
const button = document.querySelector('button');

// If 'ES2022' is in lib, modern array methods are typed:
const items = ['a', 'b', 'c'];
console.log(items.at(-1)); // 'c' (typed properly)
```

> **Tip:** If `lib` is omitted, TypeScript defaults to the standard library matching your configured `target`.

## Go deeper

Comparing `target` and `lib` in compiler architecture:

| Compiler Setting | What It Controls | Affects Emitted JavaScript? |
|---|---|---|
| `target` | Syntax level of generated `.js` files | Yes (downlevels modern syntax if needed) |
| `lib` | Available global type definitions | No (purely compile-time type declarations) |

## Watch out

- Adding a library to lib does not polyfill it; you must ensure the runtime actually supports the API.
- Targeting older ES versions increases bundle size due to downlevel helper functions.

## Remember

- target defines the JavaScript version of the emitted code (e.g. ES2022).
- lib controls which built-in global types (like DOM or ES2022) are recognized.
- Omit DOM from lib in Node.js backend services to catch accidental browser references.
