---
slug: conditional-type-basics
title: "Conditional Type Basics"
topic: type-transformations
kind: concept
summary: "Use the ternary form T extends U ? X : Y to compute types dynamically based on assignability checks."
tags: [conditional-types, types, generics]
related: [distributive-conditionals, infer-keyword, conditional-type-pitfalls]
---
> **In one line:** Use T extends U ? X : Y to choose between two types based on assignability.

## The idea

At the heart of most advanced type programming in TypeScript lies the conditional type. Just as JavaScript code uses the ternary operator (`condition ? a : b`) to choose values dynamically at runtime, TypeScript uses conditional types to choose types dynamically at compile time.

The basic syntax is `T extends U ? X : Y`. The compiler tests whether type `T` is assignable to type `U`. If the assignability check succeeds, the conditional type resolves to type `X`; otherwise, it resolves to type `Y`.

Conditional types allow you to write functions and utility types whose return types adapt dynamically based on the argument types provided by callers. When combined with generics, they enable expressive, type-safe APIs that avoid redundant overloads.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Conditional type that determines an ID type based on input:
type IdType<T> = T extends number ? 'numeric-id' : 'string-id';

type Test1 = IdType<100>;       // 'numeric-id'
type Test2 = IdType<'usr_99'>;   // 'string-id'

// Adaptive function return type:
interface TextResponse { text: string; }
interface BinaryResponse { buffer: Uint8Array; }

function fetchResource<T extends 'text' | 'binary'>(format: T): T extends 'text' ? TextResponse : BinaryResponse {
  if (format === 'text') {
    return { text: 'Hello World' } as any;
  }
  return { buffer: new Uint8Array([1, 2, 3]) } as any;
}

const txt = fetchResource('text');   // Inferred as TextResponse!
const bin = fetchResource('binary'); // Inferred as BinaryResponse!
```

> **Tip:** Conditional types are evaluated at compile time; they add zero bytes and zero runtime execution to your JavaScript.

## Go deeper

Comparing runtime ternary operators with type-level conditional types:

| Concept | Runtime Ternary | Type-Level Conditional Type |
|---|---|---|
| Syntax | `condition ? valA : valB` | `T extends U ? TypeA : TypeB` |
| Evaluation Time | Runtime (when executed) | Compile time (during type checking) |
| Operands | Values / expressions | Types / type variables |
| Purpose | Dynamic control flow | Dynamic type selection |

## Watch out

- Conditional types require extends for assignability checks; you cannot use === or == in type syntax.
- If T is an unresolved generic parameter, TypeScript delays evaluation until T is instantiated.

## Remember

- T extends U ? X : Y selects type X if T is assignable to U, otherwise Y.
- Use conditional types to adapt function return types to caller argument types.
- Conditional types run entirely at compile time and are erased from emitted JavaScript.
