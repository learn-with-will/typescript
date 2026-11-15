---
slug: type-aliases-basics
title: "Type Aliases Basics"
topic: objects-and-shapes
kind: concept
summary: "Type aliases create custom names for any type in TypeScript, including primitives, unions, tuples, and object shapes."
tags: [types, type-aliases, syntax]
related: [interfaces-for-object-shapes, type-aliases-vs-interfaces, tuple-types]
---
> **In one line:** Use the type keyword to create an alias for any type construct in the language.

## The idea

While interfaces are specifically dedicated to describing object shapes, the `type` keyword (a type alias) provides a universal mechanism to assign a name to any type in TypeScript.

A type alias can name a primitive, an object shape, a union of string literals, a tuple, a function signature, a generic transformation, or a complex mapped type. Once created, the alias name can be used anywhere a type is expected.

It is important to remember that a type alias does not create a new type; it simply gives a new name to an existing type construct. When the compiler displays diagnostics, it will often display the alias name, making complex types easier to read and understand.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Aliasing primitives and unions:
type ID = string | number;
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Aliasing object shapes:
type Coordinates = {
  latitude: number;
  longitude: number;
};

// Aliasing function signatures:
type Predicate<T> = (item: T) => boolean;

const endpointMethod: HttpMethod = 'GET';
const location: Coordinates = { latitude: 37.7749, longitude: -122.4194 };

console.log(`Request: ${endpointMethod} to coords ${location.latitude}`);
```

> **Tip:** Use type aliases when you need union types, tuple types, or primitive aliases that interfaces cannot express.

## Go deeper

Types that can be named with `type` vs `interface`:

| Construct | Expressible with `type`? | Expressible with `interface`? |
|---|---|---|
| Object shapes | Yes | Yes |
| Union types (`A | B`) | Yes | No |
| Primitive alias (`type ID = string`) | Yes | No |
| Tuple types (`[string, number]`) | Yes | No |
| Function signatures | Yes | Yes |

## Watch out

- Type aliases cannot be reopened for declaration merging; use interfaces if merging is needed.
- A type alias cannot appear in an extends clause of a class unless it is statically an object type.

## Remember

- The type keyword assigns a name to any valid TypeScript type expression.
- Use type aliases for unions, primitives, tuples, and function signatures.
- Type aliases do not create new types; they provide meaningful names for existing shapes.
