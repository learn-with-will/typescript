---
slug: es-modules-import-export
title: "ES Modules: import and export"
topic: modules-and-config
kind: concept
summary: "TypeScript uses standard ECMAScript module syntax import and export to share code and types across files."
tags: [modules, esm, imports]
related: [type-only-imports, declaration-files, module-resolution]
---
> **In one line:** Use standard ES module import and export statements to share values and types across files.

## The idea

In modern JavaScript and TypeScript, any file containing a top-level `import` or `export` is treated as a module. Files without imports or exports run in the global scope, where variables can clash and pollute the global namespace.

TypeScript fully adopts standard ECMAScript module syntax (`import` and `export`). You can export and import functions, classes, variables, constants, and TypeScript-specific constructs like `interface` and `type` aliases.

When compiling modules, TypeScript erases any imports or exports that refer purely to types, while emitting standard JavaScript `import` and `export` statements for runtime values based on your configured `module` setting in `tsconfig.json`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// File: src/math.ts
export interface CalculationResult {
  value: number;
  units: string;
}

export function addWithUnits(a: number, b: number, units: string): CalculationResult {
  return { value: a + b, units };
}

// File: src/app.ts
import { CalculationResult, addWithUnits } from './math.js';

const res: CalculationResult = addWithUnits(10, 20, 'px');
console.log(`Result: ${res.value}${res.units}`);
```

> **Tip:** In modern `NodeNext` module resolution, TypeScript requires including the `.js` file extension in relative imports.

## Go deeper

Comparing module syntax styles and compiler emission:

| Syntax | What It Exports/Imports | Preserved in Emitted JS? |
|---|---|---|
| `export const x = 1;` | Runtime constant value | Yes (standard ES export) |
| `export function f() {}` | Runtime function | Yes (standard ES export) |
| `export interface User {}` | Type-only construct | No (completely erased) |
| `export type ID = string;` | Type-only construct | No (completely erased) |

## Watch out

- A file without any import or export statements is treated as global script, polluting global scope.
- Always ensure your runtime environment and tsconfig module settings match (e.g. NodeNext with ESM package.json).

## Remember

- Any file with an import or export is an isolated ES module.
- You can export both runtime values and compile-time type constructs.
- Type-only imports and exports are completely removed during compilation.
