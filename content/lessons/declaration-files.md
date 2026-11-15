---
slug: declaration-files
title: "Declaration Files (.d.ts)"
topic: modules-and-config
kind: concept
summary: "Declaration files (.d.ts) contain only type signatures and no runtime code, acting as type blueprints for JavaScript libraries."
tags: [declaration-files, dts, tooling]
related: [ambient-declarations, types-packages, es-modules-import-export]
---
> **In one line:** Declaration files (.d.ts) provide pure type descriptions for existing JavaScript code.

## The idea

When you install a library written in plain JavaScript, or when you compile a TypeScript library for publication on npm, how does the compiler know the types of the exported functions?

The answer is declaration files, which carry the `.d.ts` file extension. A declaration file contains only types, interfaces, and function signatures. It contains zero executable implementation code.

Declaration files serve as type blueprints. When publishing a TypeScript library, setting `"declaration": true` in `tsconfig.json` instructs `tsc` to emit a matching `.d.ts` file alongside every compiled `.js` file, allowing downstream consumers to type-check their code against your library.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// File: dist/math-utils.d.ts (emitted type declaration file)
export declare function calculateArea(width: number, height: number): number;
export declare interface ShapeConfig {
    fillColor: string;
    strokeWidth: number;
}
export declare const DEFAULT_STROKE = 2;

// Downstream consumer file: app.ts
import { calculateArea, ShapeConfig } from './math-utils.js';
// Downstream editor provides full autocomplete and checking based on .d.ts!
```

> **Tip:** Enable `"declaration": true` in your tsconfig if you are authoring a reusable library for other developers.

## Go deeper

Comparing source files and declaration files:

| Characteristic | `.ts` Source File | `.d.ts` Declaration File |
|---|---|---|
| Contains Executable Code | Yes | No (syntax error if present) |
| Emitted by `tsc`? | No (author writes it) | Yes (when `declaration: true`) |
| Consumed by | Runtime + Compiler | Compiler and Language Server only |
| Included in Bundles | Compiled to `.js` | Excluded from runtime bundles |

## Watch out

- You cannot put executable JavaScript code or function bodies inside a .d.ts file.
- A missing or mismatched .d.ts file leads to could not find a declaration file for module errors.

## Remember

- .d.ts declaration files provide type information without executable code.
- Use declaration: true in tsconfig to generate .d.ts files for published libraries.
- Declaration files enable rich IDE autocompletion for JavaScript packages.
