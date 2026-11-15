---
slug: union-types
title: "Union Types"
topic: unions-and-narrowing
kind: concept
summary: "Combine multiple types using the pipe operator | to model values that can be one of several different types."
tags: [unions, types, foundations]
related: [literal-types, typeof-narrowing, discriminated-unions]
---
> **In one line:** Use A | B to declare that a value can be either type A or type B.

## The idea

JavaScript values frequently take on different shapes depending on context. For example, a function might accept a user ID as either a numeric integer or a UUID string. An API response might return a user object on success or an error message string on failure.

TypeScript models this reality using union types. Formed using the pipe operator (`|`), a union type `string | number` indicates that a value can be any valid string or any valid number.

When operating on a union value, TypeScript only permits accessing properties or methods that are common to all members of the union. To access properties unique to a specific member (such as `toUpperCase()` on a string), you must first narrow the union using a type guard.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
function printIdentifier(id: number | string): void {
  // Common operations allowed on both string and number:
  console.log(`Identifier: ${id.toString()}`);

  // Narrowing to access string-specific methods:
  if (typeof id === 'string') {
    console.log(`Normalized ID: ${id.toUpperCase()}`);
  } else {
    console.log(`ID value: ${id.toFixed(0)}`);
  }
}

printIdentifier(101);
printIdentifier('usr_abc123');
```

> **Tip:** You can chain multiple union members together: `string | number | boolean | null`.

## Go deeper

Visualizing union assignability and common property access:

| Union Type | Example Valid Values | Permitted Common Operations |
|---|---|---|
| `string | number` | `'hello'`, `42` | `toString()`, `valueOf()` |
| `User | Admin` | `{ id: '1', role: 'admin' }` | Shared properties in both interfaces |
| `string[] | string` | `['a']`, `'a'` | `slice()`, `indexOf()`, `length` |

## Watch out

- Calling a method available on only one member of a union without narrowing causes a compiler error.
- Union types describe values that are A OR B; they do not combine their properties like an intersection (&).

## Remember

- Union types use | to represent values that may be one of several types.
- Only properties shared by all members of the union can be accessed without narrowing.
- Use type guards like typeof to narrow unions to specific types before calling specific methods.
