---
slug: tsconfig-json
title: "The tsconfig.json File"
topic: getting-started
kind: tool
summary: "The tsconfig.json file configures compiler options, file boundaries, and type-checking strictness for a TypeScript project."
tags: [tsconfig, configuration, compiler]
related: [compile-with-tsc, strict-mode, install-typescript]
---
> **In one line:** A tsconfig.json file marks the root of a TypeScript project and configures compiler rules and output targets.

## The idea

Every professional TypeScript repository centers around a `tsconfig.json` file placed in the project root. This file tells the compiler which files to compile, what version of JavaScript to emit, how to resolve modules, and how strictly to enforce type rules.

When you run `tsc` without arguments, the compiler locates the nearest `tsconfig.json` in the current directory or its parent hierarchy. This defines the project root and scopes type checking across all related source files.

You can initialize a documented starter configuration using `tsc --init`. The generated file includes standard defaults and commented explanations for dozens of available compiler options.

A properly configured tsconfig ensures that team members and automated build systems compile files with identical assumptions and strictness levels.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "outDir": "./dist",
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

> **Tip:** You can generate a fresh tsconfig.json with recommended defaults by running `npx tsc --init`.

## Go deeper

Essential settings found in almost every modern tsconfig.json:

| Key Setting | Recommended Value | What It Does |
|---|---|---|
| `target` | `ES2022` or `ESNext` | ECMAScript version for generated JavaScript |
| `module` | `NodeNext` or `ESNext` | Module system format (ES modules vs CommonJS) |
| `strict` | `true` | Enables the full suite of strong type checks |
| `outDir` | `./dist` | Folder where compiled files are saved |
| `skipLibCheck` | `true` | Skips type checking declaration files for speed |

## Watch out

- Omitting include or files may cause TypeScript to compile unwanted files like node_modules or build outputs.
- Remember that tsconfig.json comments are permitted in JSON files parsed by TypeScript.

## Remember

- The tsconfig.json file defines the root of a project and configures compiler behavior.
- Always set strict: true to enable TypeScript’s strongest safety checks.
- Use include and exclude to control exactly which files the compiler checks.
