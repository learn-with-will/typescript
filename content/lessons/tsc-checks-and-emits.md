---
slug: tsc-checks-and-emits
title: "How tsc Checks and Emits"
topic: getting-started
kind: concept
summary: "Understand the distinct phases of tsc: parsing syntax, checking types, and emitting JavaScript regardless of type errors."
tags: [compiler, build, pipeline]
related: [compile-with-tsc, type-erasure, tsconfig-json]
---
> **In one line:** Type checking and JavaScript code emit are separate stages in the compiler pipeline.

## The idea

Many developers coming from languages like Java or C++ assume that a compiler will refuse to output executable files if any type error occurs. In TypeScript, however, type checking and file emission are separate pipeline stages.

By default, even when `tsc` reports type errors in your console, it will still emit the corresponding JavaScript files. The philosophy is that you should always be able to test or inspect your code in the browser even while midway through refactoring or debugging a complex type definition.

If you want your build process to strictly halt and emit nothing whenever a type error exists, you can configure `"noEmitOnError": true` in `tsconfig.json`. This is standard for production build pipelines to guarantee that only fully verified code reaches deployment.

Understanding this decoupling also explains how modern bundlers like Vite operate: they strip types instantly without checking them, while `tsc` runs alongside to verify soundness.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```json
// tsconfig.json setting to stop emit on errors:
{
  "compilerOptions": {
    "noEmitOnError": true,
    "outDir": "./dist"
  }
}
```

```bash
# If there is a type error and noEmitOnError is set:
# tsc reports the error and deletes/omits the output in dist/
npx tsc
```

> **Note:** Modern build tools like Vite and esbuild only perform the emit phase; use `tsc --noEmit` in CI to perform the checking phase.

## Go deeper

```sequence
actor dev: Developer
actor tsc: TypeScript Compiler
actor dist: Output Disk
dev -> tsc: Runs npx tsc
note tsc: 1. Parse & Check Types @blue
note tsc: 2. Erase Types & Downlevel @primary
tsc -> dist: Emits JavaScript files
```

## Watch out

- Assuming that emitted JavaScript implies zero type errors; check the CLI exit code or use noEmitOnError.
- Relying on bundlers for type checking; tools like Vite or Babel strip types without validating them.

## Remember

- Type checking and code generation are distinct compiler stages.
- By default, tsc emits JavaScript even if type errors are reported.
- Enable noEmitOnError in production builds to ensure zero-error deployments.
