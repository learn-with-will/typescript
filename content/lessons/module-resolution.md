---
slug: module-resolution
title: "Module Resolution Modes"
topic: modules-and-config
kind: technique
summary: "Configure moduleResolution in tsconfig to match how your runtime or bundler locates imported files on disk."
tags: [modules, moduleResolution, tsconfig]
related: [es-modules-import-export, compiler-target-and-lib, verbatim-module-syntax]
---
> **In one line:** Set moduleResolution to NodeNext or Bundler to match modern runtime import behavior.

## The idea

When you write `import { helper } from './utils'`, how does the TypeScript compiler find the file on disk? Does it look for `./utils.ts`, `./utils/index.ts`, or check `package.json` exports?

This process is controlled by the `moduleResolution` setting in `tsconfig.json`. In older TypeScript versions, `node` (Node 10 resolution) was the default. However, modern JavaScript has evolved with ECMAScript modules and package exports maps.

Modern TypeScript provides two primary resolution modes:
- **`NodeNext`:** Emulates modern Node.js ESM/CJS resolution. It respects `package.json` exports fields and strictly requires explicit relative file extensions (`import './utils.js'`).
- **`Bundler`:** Designed for projects built by bundlers like Vite, esbuild, or webpack. It allows extensionless imports while supporting package exports maps.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```json
// tsconfig.json for modern bundler setups (Vite / Next.js / Webpack):
{
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true
  }
}

// tsconfig.json for modern Node.js backend services:
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true
  }
}
```

> **Tip:** Use `moduleResolution: "Bundler"` for client-side applications built with Vite; use `NodeNext` for pure Node.js services.

## Go deeper

Comparing modern TypeScript module resolution modes:

| Resolution Setting | Target Environment | Requires `.js` in imports? | Respects package `exports`? |
|---|---|---|---|
| `NodeNext` | Node.js v16+ runtime | Yes (mandatory for ESM) | Yes |
| `Bundler` | Vite, esbuild, Webpack | No (optional) | Yes |
| `node10` (legacy) | Node.js v10 (deprecated) | No | No |

## Watch out

- Using legacy node resolution prevents TypeScript from discovering types in modern package exports fields.
- NodeNext requires typing relative imports with .js even though the source file is .ts on disk.

## Remember

- moduleResolution controls how TypeScript locates imported files and libraries on disk.
- Use Bundler for frontend applications packaged by Vite, esbuild, or webpack.
- Use NodeNext for modern Node.js backend applications using ES modules.
