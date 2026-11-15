---
slug: module-augmentation
title: "Module Augmentation"
topic: advanced-patterns
kind: technique
summary: "Extend the type definitions of external npm packages or modules from within your application using declare module."
tags: [module-augmentation, modules, extending-libraries]
related: [interface-declaration-merging, declare-global-augmentation, augmentation-pitfalls]
---
> **In one line:** Use declare module "pkg" to add custom properties and methods to third-party library types.

## The idea

In modern full-stack development, you frequently attach custom properties to third-party objects. For example, Express middleware commonly attaches `user` or `tenantId` to the `Request` object, or an HTTP client interceptor adds a custom `requestId` to outgoing configurations.

If you attempt to access `req.user` in TypeScript, the compiler reports: `Property 'user' does not exist on type 'Request'`.

Module augmentation allows you to extend the types of existing modules without modifying their original source code. Inside your own TypeScript file, write `declare module "library-name"` and declare an interface with the new properties. Because of declaration merging, your new properties merge directly into the library’s original interface!

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// File: src/types/express-augmentation.d.ts
// Must import something to ensure file is treated as a module:
import 'express';

declare module 'express' {
  export interface Request {
    userId?: string;
    correlationId: string;
  }
}

// In your application route handlers:
// req.correlationId is now fully typed and verified by the compiler!
```

> **Tip:** Ensure the file doing the augmentation has at least one top-level `import` or `export` so TypeScript treats it as a module.

## Go deeper

Module augmentation requirements:

| Requirement | Why It Is Needed | What Happens If Omitted |
|---|---|---|
| Top-level import/export | Ensures file is parsed as a module | Treated as ambient script; overwrites module entirely! |
| Exact module name | Targets the specific package | Augmentation is ignored |
| Same interface name | Leverages declaration merging | Creates new unrelated interface |

## Watch out

- Forgetting an import statement causes declare module to overwrite the entire package rather than augment it.
- You cannot declare new top-level variables or classes via module augmentation; only types and interfaces merge.

## Remember

- Module augmentation uses declare module "name" to add types to third-party libraries.
- It relies on interface declaration merging to attach properties to existing contracts.
- Always include an import statement to ensure the augmenting file is parsed as an ES module.
