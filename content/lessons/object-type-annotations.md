---
slug: object-type-annotations
title: "Object Type Annotations"
topic: objects-and-shapes
kind: concept
summary: "Describe the shape of JavaScript objects using anonymous object types with property names and type annotations."
tags: [objects, shapes, types]
related: [interfaces-for-object-shapes, optional-and-readonly-properties, type-aliases-basics]
---
> **In one line:** Use { key: Type } to describe the expected shape and property types of JavaScript objects.

## The idea

Objects are the fundamental building blocks of JavaScript applications. Almost all state, configuration, and data structures in a web app exist as objects with key-value pairs.

In TypeScript, you can describe an object's structure directly using an anonymous object type: `{ name: string; age: number }`. Each property is separated by a semicolon or comma. When a variable, parameter, or function return is annotated with an object type, the compiler guarantees that any assigned value provides all specified properties with compatible types.

Anonymous object types are ideal for inline function parameters, one-off utility functions, or quick transformations where creating a named interface or type alias would add unnecessary boilerplate.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Inline anonymous object type annotation:
function renderUserBadge(user: { name: string; role: string; points: number }): string {
  return `[${user.role.toUpperCase()}] ${user.name} (${user.points} pts)`;
}

const currentUser = {
  name: 'Sarah Connor',
  role: 'admin',
  points: 1500
};

console.log(renderUserBadge(currentUser));
// renderUserBadge({ name: 'John' }); // Error: Property 'role' is missing
```

> **Tip:** If you find yourself reusing the same object type in multiple places, extract it into an `interface` or `type` alias.

## Go deeper

Comparing inline object types with named type declarations:

| Syntax Approach | Example | When to Prefer |
|---|---|---|
| Inline Anonymous Object | `fn(user: { id: string })` | One-off helper parameters |
| Named Interface | `interface User { id: string }` | Domain entities, public APIs |
| Named Type Alias | `type User = { id: string }` | Unions, primitives, intersections |

## Watch out

- Separating object type properties with commas or semicolons is valid, but semicolons are idiomatic.
- Using the broad object or Record<string, any> type loses specific property autocomplete.

## Remember

- Use { propertyName: Type } to define the shape and types of object properties.
- TypeScript strictly checks that all required properties exist with matching types.
- Extract recurring anonymous object types into named interfaces for maintainability.
