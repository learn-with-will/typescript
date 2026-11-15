---
slug: type-aliases-vs-interfaces
title: "type vs interface"
topic: objects-and-shapes
kind: technique
summary: "Understand the exact architectural differences between type aliases and interfaces to choose the right tool for each job."
tags: [interface, type, best-practices]
related: [interfaces-for-object-shapes, type-aliases-basics, extending-interfaces]
---
> **In one line:** Use interfaces for extensible object shapes and type aliases for unions, primitives, and tuples.

## The idea

One of the most frequently asked questions in TypeScript is when to use `interface` versus `type`. Because both constructs can describe object shapes and support inheritance (via `extends` or intersections `&`), they often appear interchangeable.

However, key architectural differences exist between them:

1. **Declaration Merging:** Interfaces support declaration merging: if you declare an interface with the same name twice, TypeScript merges their definitions into one. Type aliases cannot be redeclared and will produce a duplicate identifier error.
2. **Type Kinds:** Type aliases can describe any type: unions, primitives, tuples, and mapped types. Interfaces can only describe object shapes and functions.
3. **Compiler Performance:** Historically, interfaces offer slightly faster compiler performance in very large codebases because the compiler caches named interface shapes by identity.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Interface declaration merging (allowed):
interface WindowSettings {
  width: number;
}
interface WindowSettings {
  height: number; // Merged into WindowSettings!
}

// Type aliases cannot merge (duplicate identifier error):
type AppTheme = { primary: string };
// type AppTheme = { secondary: string }; // Error: Duplicate identifier 'AppTheme'

// Recommended rule of thumb:
interface UserEntity {
  id: string;
  name: string;
}

type UserStatus = 'active' | 'suspended' | 'pending'; // Unions require 'type'
```

> **Tip:** Standard community convention: use `interface` for public object APIs and class contracts; use `type` for unions and transformations.

## Go deeper

Feature-by-feature comparison between `interface` and `type`:

| Feature | `interface` | `type` |
|---|---|---|
| Describes object shapes | Yes | Yes |
| Extends other shapes | Yes (`extends`) | Yes (intersection `&`) |
| Declaration Merging | Yes (automatic) | No (duplicate error) |
| Can describe unions (`A | B`) | No | Yes |
| Can describe primitives / tuples | No | Yes |
| Implemented by classes | Yes | Yes (if object shape) |

## Watch out

- Accidental declaration merging with interfaces can introduce unexpected properties if names clash.
- Excessive type intersections (&) can produce confusing compiler error messages compared to extends.

## Remember

- Interfaces support declaration merging; type aliases cannot be redeclared.
- Only type aliases can represent union types, primitives, and tuple types.
- Use interface for object models and type for unions, tuples, and mapped types.
