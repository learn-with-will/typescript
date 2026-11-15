---
slug: when-to-use-generics
title: "When to Use Generics"
topic: generics
kind: technique
summary: "Learn the golden rule of generics: only introduce a type parameter to express a relationship between multiple values."
tags: [generics, best-practices, design]
related: [generic-functions, generic-constraints, type-argument-inference]
---
> **In one line:** Only use generics when you need to link the types of multiple parameters or a parameter and the return value.

## The idea

A common anti-pattern among developers learning TypeScript is adding generic type parameters unnecessarily. You may see functions like `function print<T extends string>(text: T): void`.

Here, `T` appears only once, in a single parameter position. The type parameter does not link the parameter to any return type, nor does it link it to any other parameter. Writing `text: string` is simpler, faster to compile, and much easier to read.

The golden rule of generics is: **Only introduce a type parameter if it relates two or more things.** For example, relating an input argument to a return value, relating one parameter to another parameter, or parameterizing a reusable container class. If a type parameter is used only once, remove it.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// BAD: Unnecessary generic (type parameter appears only once):
function logMessageBad<T extends string>(message: T): void {
  console.log(message);
}

// GOOD: Simple, idiomatic concrete parameter:
function logMessageGood(message: string): void {
  console.log(message);
}

// GOOD: Generic legitimately links parameter type to return type:
function cloneAndFreeze<T extends object>(target: T): Readonly<T> {
  return Object.freeze({ ...target });
}

const frozenUser = cloneAndFreeze({ id: '1', name: 'Alice' });
// Return type is Readonly<{ id: string; name: string }>, preserving exact shape!
```

> **Tip:** If a type parameter doesn't relate two different places in your signature, replace it with a plain type.

## Go deeper

Evaluation checklist: Does this function need a generic parameter?

| Criterion | Generic Needed? | Recommendation |
|---|---|---|
| Return type depends directly on input parameter type | Yes | Use `function fn<T>(x: T): T` |
| Two parameters must share the same type | Yes | Use `function fn<T>(a: T, b: T)` |
| Parameter is an interface with no return relationship | No | Use plain interface parameter |
| Only need to accept a union of known types | No | Use union type: `x: string | number` |

## Watch out

- Adding unnecessary type parameters makes error messages much harder to decipher.
- Never use generics solely to avoid writing a union type.

## Remember

- Only use generics when relating two or more values in a type signature.
- If a type parameter appears only once in a function signature, remove it.
- Prefer simple concrete types and union types whenever relationships are not required.
