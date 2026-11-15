---
slug: key-remapping-with-templates
title: "Key Remapping with Templates"
topic: type-transformations
kind: technique
summary: "Combine mapped types and template literal types to dynamically generate typed event emitters and state accessors."
tags: [template-literals, mapped-types, event-emitter]
related: [key-remapping-with-as, intrinsic-string-manipulation, extracting-parts-with-infer]
---
> **In one line:** Combine mapped types with template literals to build typed event listeners and store accessors.

## The idea

One of the most elegant design patterns in modern TypeScript is combining mapped types with template literal types to create type-safe event buses and reactive store watchers.

Suppose you have an interface describing state properties (`{ username: string; loggedIn: boolean }`). You want to automatically generate an API that exposes typed event listeners for each property, such as `onUsernameChange(callback)` and `onLoggedInChange(callback)`.

By using key remapping with a template literal string in a mapped type, you can generate this complete event listener interface dynamically without declaring a single redundant method signature.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
interface StateModel {
  name: string;
  age: number;
}

// Generate typed watcher methods automatically:
type StateWatcher<T> = {
  [K in keyof T as `on${Capitalize<string & K>}Change`]: (newValue: T[K]) => void;
};

type UserWatcher = StateWatcher<StateModel>;
// Inferred as:
// {
//   onNameChange: (newValue: string) => void;
//   onAgeChange: (newValue: number) => void;
// }

const watcher: UserWatcher = {
  onNameChange: (newName) => console.log(`New name: ${newName.toUpperCase()}`),
  onAgeChange: (newAge) => console.log(`New age: ${newAge.toFixed(0)}`)
};
```

> **Tip:** This pattern powers state stores in libraries like Vue, Pinia, and reactive micro-frontends.

## Go deeper

Step-by-step transformation:

```flow
state: StateModel { name: string, age: number } @primary
mapping: [K in keyof T as onCapitalizeChange] @blue
output: UserWatcher with onNameChange and onAgeChange @green
state -> mapping: provides source keys
mapping -> output: renames and types listener methods
```

## Watch out

- Always intersect K with string (string & K) before passing to Capitalize.
- Keep property names concise so generated method names remain readable.

## Remember

- Combine mapped types and template literals to generate method names from data models.
- Automatically creates typed event listeners like onPropertyChange.
- Eliminates manual boilerplate in event buses and state stores.
