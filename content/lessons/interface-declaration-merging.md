---
slug: interface-declaration-merging
title: "Interface Declaration Merging"
topic: advanced-patterns
kind: concept
summary: "When multiple interfaces are declared with the same name, TypeScript merges their properties into a single unified interface."
tags: [declaration-merging, interfaces, types]
related: [module-augmentation, declare-global-augmentation, augmentation-pitfalls]
---
> **In one line:** Interfaces with the same name in the same scope automatically merge their member definitions.

## The idea

In TypeScript, declaring two variables, functions, or type aliases with the exact same name causes a duplicate identifier error. However, interfaces follow a deliberate and unique design rule: declaration merging.

When you declare an interface with the same name multiple times in the same scope, the compiler does not produce an error. Instead, it merges all declared properties and methods from all declarations into a single, unified interface contract.

Declaration merging was designed to model JavaScript’s open-ended runtime environment. In browsers, the global `Window` and `Document` objects are continually extended by polyfills, third-party libraries, and new web standards. Declaration merging allows each library to contribute its own properties to `Window` without conflicting or overwriting existing definitions.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// First declaration: Core user properties
interface UserAccount {
  id: string;
  email: string;
}

// Second declaration: Adds profile metadata (merges automatically!)
interface UserAccount {
  displayName: string;
  avatarUrl?: string;
}

// Consuming code must satisfy the merged shape of both declarations:
const activeUser: UserAccount = {
  id: 'usr_1',
  email: 'user@example.com',
  displayName: 'Alex Rivers'
};

console.log(activeUser.id, activeUser.displayName);
```

> **Tip:** Non-function members with the same name must have identical types; you cannot redefine `id: string` as `id: number`.

## Go deeper

How declaration merging reconciles properties and methods:

| Member Type | Merging Behavior | Duplicate Key Handling |
|---|---|---|
| Non-function property | Merged into interface | Must have identical type (conflicts cause error) |
| Method signature | Overloaded | Later declarations take higher overload precedence |
| Type aliases | Not merged | Always produces duplicate identifier error |

## Watch out

- Conflicting property types between merged interfaces cause compile errors.
- Type aliases do not support declaration merging; only interfaces can merge.

## Remember

- Interfaces sharing the same name in the same scope automatically merge their properties.
- Method signatures merge as overloads, with later declarations taking priority.
- Declaration merging enables safely extending standard global interfaces like Window.
