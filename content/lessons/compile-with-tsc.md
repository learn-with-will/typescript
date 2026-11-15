---
slug: compile-with-tsc
title: "Compiling with tsc"
topic: getting-started
kind: tool
summary: "The tsc command-line tool type-checks your code and compiles TypeScript source files into clean JavaScript."
tags: [tsc, cli, compiler]
related: [install-typescript, tsconfig-json, tsc-checks-and-emits]
---
> **In one line:** Use the tsc CLI to validate types, report diagnostics, and emit executable JavaScript files.

## The idea

The TypeScript compiler CLI is named `tsc`. It performs two distinct responsibilities: it analyzes your code to report type errors, and it emits standard JavaScript by removing annotations and transforming syntax according to your target settings.

When passed a single file name (such as `tsc index.ts`), the compiler runs in single-file mode and ignores any `tsconfig.json` in the folder. In project mode (running bare `tsc` with no file arguments), the compiler searches for a `tsconfig.json` file in the current directory and compiles all included files as a coherent program.

Understanding common `tsc` flags helps streamline your daily development workflow, whether you are building a bundle or running quick type checks in automated test scripts.

Integrating `tsc` into your npm scripts gives team members a standard command to build and verify the application across development and production environments.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```bash
# Compile a whole project using tsconfig.json settings:
npx tsc

# Run in watch mode to recompile automatically on file save:
npx tsc --watch

# Verify types without writing any JavaScript files to disk:
npx tsc --noEmit
```

> **Tip:** Modern bundlers (Vite, esbuild, webpack) often bundle code without type checking; run `tsc --noEmit` in your CI pipeline to catch errors.

## Go deeper

Common tsc command-line options and their roles in development:

| Flag | Purpose | Typical Use Case |
|---|---|---|
| `--noEmit` | Type check only; generate no files | CI pipelines, pre-commit hooks |
| `--watch` | Watch files and re-check on changes | Local development |
| `--project` | Path to specific tsconfig file | Monorepos with multiple configs |
| `--strict` | Enable strict type checking | Quick command-line checks |

## Watch out

- Running tsc with a file argument (tsc src/app.ts) ignores tsconfig.json completely.
- By default, tsc emits JavaScript even if type errors occur unless noEmitOnError is configured.

## Remember

- Run tsc with no arguments to compile a project using its tsconfig.json settings.
- Use tsc --noEmit in CI pipelines for fast validation without generating disk artifacts.
- Use tsc --watch during development for rapid continuous feedback.
