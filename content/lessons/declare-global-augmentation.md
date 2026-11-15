---
slug: declare-global-augmentation
title: "declare global Augmentation"
topic: advanced-patterns
kind: technique
summary: "Extend global interfaces like Window, Document, or ProcessEnv from within module files using declare global."
tags: [declare-global, window, ambient]
related: [interface-declaration-merging, module-augmentation, augmentation-pitfalls]
---
> **In one line:** Use declare global { ... } inside a module to augment standard global browser or Node.js objects.

## The idea

In web development, frontend applications frequently interact with custom globals attached to the browser's `window` object, such as `window.__INITIAL_STATE__`, `window.dataLayer`, or third-party authentication tokens.

Similarly, Node.js applications frequently read environment variables from `process.env`.

Because normal source files in modern projects are ES modules (containing `import` or `export` statements), declarations inside them are scoped to that module by default. To reach out into the global scope and augment standard global interfaces from inside a module, you use `declare global { ... }`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Inside a module file (e.g. src/env.d.ts):
export {}; // Ensures this file is treated as a module

declare global {
  interface Window {
    __APP_CONFIG__: {
      apiUrl: string;
      environment: 'development' | 'production';
    };
  }

  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      PORT?: string;
    }
  }
}

// Application code:
const api = window.__APP_CONFIG__.apiUrl; // Fully typed!
console.log('API URL:', api);
```

> **Tip:** Adding an empty `export {}` at the top of a declaration file guarantees it is parsed as a module with global augmentation support.

## Go deeper

Common global augmentation targets:

| Target Scope | Interface | Typical Use Case |
|---|---|---|
| Browser Global | `Window` | Analytics trackers, state hydration payloads |
| Node.js Environment | `NodeJS.ProcessEnv` | Environment variables with autocomplete |
| Global Scope | `globalThis` | Universal cross-environment runtime globals |

## Watch out

- Global augmentations affect every file in your project compilation; do not introduce conflicting property types.
- Ensure the global variable actually exists at runtime before accessing it without guards.

## Remember

- Use declare global { ... } inside module files to augment global interfaces.
- Ideal for typing window.__INITIAL_STATE__ and process.env variables.
- Always ensure the augmenting file contains an import or export statement.
