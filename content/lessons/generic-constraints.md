---
slug: generic-constraints
title: "Generic Constraints with extends"
topic: generics
kind: technique
summary: "Restrict type parameters using the extends keyword to guarantee required properties and methods."
tags: [generics, constraints, extends]
related: [generic-functions, constraint-with-keyof, when-to-use-generics]
---
> **In one line:** Use <T extends ExpectedShape> to require that a type parameter possesses specific properties.

## The idea

When you write an unconstrained generic function like `function log<T>(item: T)`, TypeScript knows nothing about `T`. Consequently, it prevents you from accessing any properties or methods (such as `item.length` or `item.id`) because not all JavaScript types have those properties.

To allow property access while retaining generic flexibility, you can constrain the type parameter using the `extends` keyword: `<T extends HasLength>`.

A generic constraint acts as a boundary. Callers can pass any type, provided that the type satisfies the constraint (i.e. it contains all required properties). Inside the function, the compiler permits accessing all properties defined in the constraint while preserving the specific return type of the argument.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
interface HasLength {
  length: number;
}

// Constrained generic function:
function logLength<T extends HasLength>(item: T): T {
  console.log(`Length of item is: ${item.length}`);
  return item;
}

// Allowed: All of these have a .length property:
logLength('TypeScript');        // Works on strings
logLength([1, 2, 3, 4]);       // Works on arrays
logLength({ length: 10, count: 5 }); // Works on custom objects

// logLength(42); // Error: Argument of type 'number' does not satisfy constraint 'HasLength'
```

> **Tip:** Constraining a generic parameter is almost always preferable to using `any` or casting.

## Go deeper

Comparing unconstrained vs constrained generics:

| Generic Style | Syntax | Allowed in Body | Caller Restrictions |
|---|---|---|---|
| Unconstrained | `<T>` | Only universal properties (like `toString`) | Any type accepted |
| Constrained | `<T extends { id: string }>` | Property `.id` accessible safely | Must contain `id: string` |
| Union Constraint | `<T extends string | number>` | Operations common to string & number | Only strings or numbers |

## Watch out

- Do not confuse extends in generics (subtyping constraint) with extends in classes (inheritance).
- If you do not need the return type to match the input type, a plain parameter type is simpler than a generic.

## Remember

- Use <T extends Constraint> to require specific properties on type parameters.
- Constraints unlock property access inside the function body safely.
- Callers must provide arguments that satisfy the structural constraint.
