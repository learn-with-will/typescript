---
slug: building-utility-types-with-mapping
title: "Building Custom Utility Types"
topic: type-transformations
kind: pattern
summary: "Combine mapped types, conditional types, and modifiers to build production-grade custom utility types."
tags: [utility-types, patterns, advanced]
related: [mapped-type-syntax, key-remapping-with-as, filtering-keys-with-never]
---
> **In one line:** Combine mapped types and conditionals to build specialized domain utility types.

## The idea

Now that you understand mapped types, modifiers, and key remapping, you have the complete toolkit needed to build sophisticated, production-grade utility types.

Many enterprise codebases maintain a `types/utils.ts` file with reusable helper utilities that solve domain-specific needs. Examples include:
- `DeepReadonly<T>`: Recursively freezes object trees.
- `Nullable<T>`: Allows all properties to be `null`.
- `StrictOmit<T, K>`: A type-safe version of `Omit` that requires `K` to be an actual key of `T`.

Building custom utilities keeps your application contracts concise, consistent, and resilient to refactorings.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// 1. Recursive DeepReadonly utility:
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends Function
    ? T[K]
    : T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

// 2. NullableProperties utility:
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

interface AppState {
  user: { profile: { displayName: string } };
}

const state: DeepReadonly<AppState> = {
  user: { profile: { displayName: 'Alice' } }
};
// state.user.profile.displayName = 'Bob'; // Error: Cannot assign to read-only property
```

> **Tip:** When building recursive types, always check for `Function` and primitive types to avoid infinite loops.

## Go deeper

Architecture checklist for production utility types:

| Design Goal | Technique | Benefit |
|---|---|---|
| Deep recursion | Conditional check `T[K] extends object ? Utility<T[K]> : T[K]` | Operates across entire nested object graph |
| Property filtering | Key remapping with `as Condition ? K : never` | Selective property inclusion/exclusion |
| Type safety guard | Constrain inputs using `<T extends object>` | Clear error messages on invalid usage |

## Watch out

- Deeply recursive types on complex third-party types (like DOM nodes or React components) can exceed compiler limits.
- Always test custom utility types with unit tests using dtslint or vitest typecheck.

## Remember

- Custom utility types combine mapping, conditionals, and modifier operators.
- Recursive mapped types enable deep transformations like DeepReadonly.
- Centralize reusable utility types to enforce consistent data modeling across teams.
