---
slug: standard-versus-legacy-decorators
title: "Standard vs Legacy Decorators"
topic: advanced-patterns
kind: technique
summary: "Understand the key differences between standard ECMAScript decorators and legacy experimentalDecorators."
tags: [decorators, migration, standards]
related: [standard-decorators-overview, class-and-method-decorators, field-and-accessor-decorators]
---
> **In one line:** Distinguish modern ECMAScript standard decorators from legacy experimentalDecorators.

## The idea

Because decorators took nearly a decade to finalize through the TC39 committee, TypeScript has two completely different decorator implementations:

1. **Legacy Decorators (Stage 2):** Enabled via `"experimentalDecorators": true` in `tsconfig.json`. These decorators rely on `PropertyDescriptor` mutation, support parameter decorators, and often use the `reflect-metadata` library to inspect runtime types. Frameworks like Angular 2–16, TypeORM, and NestJS were built on legacy decorators.
2. **Standard Decorators (Stage 3):** Built-in natively in TypeScript 5.0+ without experimental flags. They follow modern ECMAScript specifications, use `context` objects instead of `PropertyDescriptor`, and emphasize immutability and auto-accessors.

When starting any new project or library, use standard decorators. Only enable `experimentalDecorators` if you are working with an older framework that explicitly mandates it.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

Adopting these idioms early ensures that code remains clean, readable, and resilient against future modifications. Software systems inevitably change as business requirements evolve, and having robust compile-time guarantees allows engineers to focus on business value rather than chasing type-related regressions across the application stack.

## See it

```typescript
// How to identify which decorator implementation you are using:

// Legacy Decorators (Requires "experimentalDecorators": true):
// Signature: (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;

// Standard Decorators (TS 5.0+, No flags required):
// Signature: (target: Function, context: ClassMethodDecoratorContext) => Function | void;

// If you see 'ClassMethodDecoratorContext' or 'accessor', it is a standard decorator!
```

> **Watch out:** Do not mix legacy and standard decorator styles in the same project; choose one based on your framework requirements.

## Go deeper

Feature comparison: Standard vs Legacy Decorators:

| Feature | Legacy Decorators | Standard Decorators |
|---|---|---|
| tsconfig Setting | `"experimentalDecorators": true` | No flags required (`"target": "ES2022"`) |
| Specification Status | Obsolete Stage 2 draft | Official Stage 3 / Standard |
| Parameter Decorators | Supported (`fn(@Param x)`) | Not supported in standard |
| Metadata | `emitDecoratorMetadata` | Metadata via `context.metadata` |
| Auto-accessors | Not supported | Supported via `accessor` keyword |

## Watch out

- Enabling experimentalDecorators disables standard Stage 3 decorator checking in TypeScript.
- Parameter decorators are not part of the standard Stage 3 decorator specification.

## Remember

- Standard decorators (TS 5.0+) conform to official TC39 ECMAScript standards.
- Legacy decorators require experimentalDecorators: true and are deprecated for new code.
- Standard decorators receive a rich context object rather than mutating property descriptors.
