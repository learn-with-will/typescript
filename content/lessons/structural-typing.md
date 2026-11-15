---
slug: structural-typing
title: "Structural Typing"
topic: getting-started
kind: concept
summary: "TypeScript compares types by their shape and properties rather than their declared names or nominal classes."
tags: [types, structural-typing, interfaces]
related: [what-typescript-adds, type-erasure, errors-before-runtime]
---
> **In one line:** Two types are compatible if their members and shapes match, regardless of how they are named or declared.

## The idea

Many programming languages like Java, C++, or C# use nominal typing: two objects are only considered compatible if they share an explicit class hierarchy or named interface declaration. Even if two classes define identical fields, an instance of one cannot be passed to a function expecting the other without explicit casting or adapters.

In contrast, JavaScript programs naturally pass object literals with matching shapes across boundaries without declaring formal inheritance. Reflecting this idiom, TypeScript uses a structural type system (often described as compile-time duck typing). If object A has all the properties required by type B with compatible types, object A is assignable to type B.

Structural typing makes TypeScript flexible and expressive. You do not need to implement specific interface names across libraries. As long as the properties match the expected contract, the compiler accepts the value without boilerplate adapters.

This design mirrors how modern web APIs and microservices exchange JSON payloads: data shapes matter far more than the nominal names assigned to classes in source files.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface Point2D {
  x: number;
  y: number;
}

function printCoordinates(point: Point2D): void {
  console.log(`x: ${point.x}, y: ${point.y}`);
}

// An anonymous object literal with identical structure is fully valid:
const userCursor = { x: 10, y: 25, z: 5 };
printCoordinates(userCursor);

class Vector {
  constructor(public x: number, public y: number) {}
}

const vector = new Vector(50, 100);
printCoordinates(vector); // Compatible by shape!
```

> **Note:** Extra properties on existing variables are permitted when passed to functions, as long as all required properties are present.

## Go deeper

```flow
source: Object Value | has x, y, z @primary
target: Parameter Point2D | requires x, y @blue
source -> target: Shape satisfies required contract @green
```

## Watch out

- Passing an object literal directly triggers excess property checks, flagging unrecognized keys.
- Two unrelated domain concepts with identical properties (like UserId and ProductId) will be treated as compatible.

## Remember

- TypeScript compatibility is determined by shape and structure, not declared class names.
- An object is compatible if it contains all required properties with matching types.
- Structural typing matches JavaScript runtime conventions and eliminates boilerplate interface implementations.
