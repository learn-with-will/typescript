---
slug: instanceof-and-in-narrowing
title: "instanceof and in Narrowing"
topic: unions-and-narrowing
kind: technique
summary: "Narrow object unions by testing class constructors with instanceof or checking property existence with the in operator."
tags: [instanceof, in-operator, narrowing]
related: [typeof-narrowing, truthiness-and-equality-narrowing, discriminated-unions]
---
> **In one line:** Use instanceof for class instances and in to check for property existence on objects.

## The idea

When working with union types composed of complex object shapes or classes, `typeof` is unhelpful because `typeof` returns `"object"` for all of them. To narrow between distinct object types, TypeScript leverages two standard JavaScript operators: `instanceof` and `in`.

The `instanceof` operator checks whether an object's prototype chain contains a class constructor. When you test `if (err instanceof Error)`, TypeScript narrows `err` to `Error` inside that branch, unlocking properties like `err.message` and `err.stack`.

The `in` operator checks whether a specific property name exists on an object: `if ("swim" in pet)`. TypeScript examines the union members and narrows the variable to only those types that declare that property.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// 1. instanceof narrowing for class instances:
function formatTimestamp(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString(); // Inferred as Date
  }
  return value.trim();          // Inferred as string
}

// 2. in operator narrowing for object shapes:
interface Fish { swim(): void; }
interface Bird { fly(): void; }

function moveCreature(animal: Fish | Bird): void {
  if ('swim' in animal) {
    animal.swim(); // Inferred as Fish
  } else {
    animal.fly();  // Inferred as Bird
  }
}

formatTimestamp(new Date());
```

> **Tip:** The `in` operator is particularly useful when working with plain JSON objects that do not have class prototypes.

## Go deeper

Comparing `instanceof` and `in` narrowing techniques:

| Operator | Syntax | Requirements | Best Used For |
|---|---|---|---|
| `instanceof` | `x instanceof ClassName` | Must be a runtime class constructor | `Date`, `Error`, custom classes |
| `in` | `'prop' in obj` | Property must uniquely distinguish types | Plain object unions, API payloads |
| Discriminated Union | `obj.kind === 'a'` | Shared discriminant tag | Large state machines, actions |

## Watch out

- instanceof cannot be used with TypeScript interfaces because interfaces are erased at compile time.
- Checking "prop" in obj requires obj to be an object; check for null/undefined first.

## Remember

- Use instanceof to narrow class instances like Date, RegExp, or custom classes.
- Use the in operator to narrow plain object unions based on property presence.
- Interfaces are erased at runtime and cannot be passed to instanceof.
