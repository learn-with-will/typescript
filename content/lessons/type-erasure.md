---
slug: type-erasure
title: "Type Erasure"
topic: getting-started
kind: concept
summary: "All type annotations, interfaces, and type aliases are erased during compilation, leaving clean plain JavaScript."
tags: [compiler, runtime, erasure]
related: [what-typescript-adds, structural-typing, annotations-do-not-validate-data]
---
> **In one line:** Type annotations exist solely during compilation and are completely removed from the emitted JavaScript output.

## The idea

A common misunderstanding when learning TypeScript is expecting type annotations to exist at runtime. Developers sometimes try to inspect types using JavaScript operators or assume that an interface will reject malformed JSON arriving from a network request.

TypeScript operates through complete type erasure. When the compiler finishes type-checking your files, it strips away every interface, type alias, generic parameter, and type annotation. The emitted output is clean, standard JavaScript that can run in any modern browser, Node.js, Deno, or Bun environment.

Because types do not exist at runtime, they add zero bytes to your production bundle overhead and cause zero runtime performance penalties. However, this also means TypeScript cannot perform runtime reflection on interfaces.

Understanding type erasure clarifies why certain patterns are impossible in TypeScript. You cannot inspect an interface at runtime or check if an object implements a type alias using `instanceof`. Runtime validations require runtime JavaScript code.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Before: TypeScript source code with type annotations
interface User {
  id: string;
  active: boolean;
}

function verifyUser(user: User): boolean {
  return user.active;
}

// After: Emitted JavaScript with all types erased
// function verifyUser(user) {
//   return user.active;
// }
```

> **Watch out:** You cannot use `typeof x === "User"` or `x instanceof User` with interfaces because interfaces are completely erased.

## Go deeper

The TypeScript compiler erases type constructs while preserving JavaScript syntax:

| Construct | Preserved at Runtime? | Emitted JavaScript |
|---|---|---|
| `interface`, `type` | No | Completely stripped |
| Type annotations (`: string`) | No | Completely stripped |
| Generics (`<T>`) | No | Completely stripped |
| `class` | Yes | Emitted as standard ES class |
| `enum` | Yes | Emitted as a lookup object |

## Watch out

- Do not expect TypeScript types to validate untrusted user input or external API responses at runtime.
- Trying to check instanceof with an interface will produce a compile-time syntax error.

## Remember

- All type annotations, interfaces, and aliases are completely erased during compilation.
- TypeScript adds zero runtime performance overhead to your generated JavaScript.
- Runtime checks must use runtime values like classes or validation libraries rather than type aliases.
