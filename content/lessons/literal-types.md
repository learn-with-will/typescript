---
slug: literal-types
title: "Literal Types"
topic: unions-and-narrowing
kind: concept
summary: "Literal types represent exact, specific values such as specific strings or numbers rather than general primitive sets."
tags: [literals, unions, types]
related: [union-types, literal-widening, const-assertions-for-literals]
---
> **In one line:** Use literal types to restrict values to exact strings, numbers, or booleans.

## The idea

In general type systems, `string` represents any possible sequence of characters, and `number` represents any numeric value. However, in JavaScript programs, variables frequently only accept a specific set of known values, such as HTTP status codes, UI placement strings, or action types.

TypeScript supports literal types. A literal type represents an exact value, such as `"north"`, `200`, or `true`. By itself, a single literal type like `let x: "hello"` is rarely useful.

When combined with union types, however, literal types become extraordinarily powerful. You can define exact sets of permitted options, such as `type Direction = 'north' | 'south' | 'east' | 'west'`. The compiler enforces that only these exact values can ever be assigned.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
type Alignment = 'left' | 'center' | 'right';
type StatusCode = 200 | 400 | 404 | 500;

function setAlignment(align: Alignment): void {
  console.log(`Aligning UI elements to: ${align}`);
}

setAlignment('center'); // Valid
// setAlignment('justify'); // Error: Argument of type '"justify"' is not assignable to 'Alignment'

function handleStatus(code: StatusCode): void {
  console.log(`Received HTTP status ${code}`);
}

handleStatus(200);
// handleStatus(418); // Error: Argument of type '418' is not assignable to 'StatusCode'
```

> **Tip:** Use string literal unions instead of numeric enums for modern, idiomatic TypeScript APIs.

## Go deeper

Comparing general primitive types with literal union types:

| General Primitive Type | Literal Union Alternative | Benefit of Literal Union |
|---|---|---|
| `string` | `'admin' | 'user' | 'guest'` | Prevents invalid string values, provides autocomplete |
| `number` | `1 | 2 | 3 | 4 | 5` | Constrains numeric input to valid rating scale |
| `boolean` | `true` | Forces an explicit truthy acknowledgement flag |

## Watch out

- Typing let align = "left" infers general string rather than "left"; use const to retain literal types.
- Literal types are case-sensitive; "Left" is not assignable to "left".

## Remember

- Literal types represent exact values rather than general primitive sets.
- Combine literal types with unions to model finite choices with full autocomplete.
- Literal unions provide a lightweight, zero-runtime alternative to enums.
