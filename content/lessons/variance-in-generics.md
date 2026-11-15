---
slug: variance-in-generics
title: "Variance in Generics"
topic: generics
kind: concept
summary: "Understand covariance, contravariance, and how subtyping relationships of type parameters affect generic compatibility."
tags: [variance, subtyping, type-theory]
related: [generic-interfaces-and-classes, inference-from-multiple-positions, when-to-use-generics]
---
> **In one line:** Variance determines how subtyping between T and U translates to subtyping between Container<T> and Container<U>.

## The idea

Variance describes how subtyping between constituent types relates to subtyping between the complex generic types that wrap them.

If `Cat` is a subtype of `Animal`, is `List<Cat>` a subtype of `List<Animal>`?
- **Covariance:** Subtyping is preserved in the same direction. Readonly collections and output positions are covariant: you can safely pass a `ReadonlyList<Cat>` to code expecting a `ReadonlyList<Animal>`.
- **Contravariance:** Subtyping is inverted. Function parameter positions are contravariant: a handler that can process any `Animal` can safely be used where a handler for `Cat` is expected.
- **Invariance:** Subtyping cannot be safely converted in either direction. Mutable arrays are invariant because writing an `Animal` (like a `Dog`) into a `List<Cat>` would corrupt the collection at runtime.

TypeScript computes variance automatically based on where type parameters appear in an interface.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
class Animal { name = 'Animal'; }
class Cat extends Animal { meow() { console.log('meow'); } }

// 1. Covariant output (Producer):
interface Producer<T> {
  produce(): T;
}
let catProducer: Producer<Cat> = { produce: () => new Cat() };
let animalProducer: Producer<Animal> = catProducer; // Valid: Cat produces an Animal

// 2. Contravariant input (Consumer):
interface Consumer<T> {
  consume(item: T): void;
}
let animalConsumer: Consumer<Animal> = { consume: (a) => console.log(a.name) };
let catConsumer: Consumer<Cat> = animalConsumer; // Valid: can safely consume a Cat!
```

> **Note:** TypeScript 4.7 added optional `in` and `out` variance annotations (`interface Producer<out T>`) for compiler performance.

## Go deeper

Summary of variance behaviors based on position:

| Parameter Position | Variance Kind | Subtyping Rule (if `Sub` extends `Super`) |
|---|---|---|
| Return value / readonly output | Covariant | `Box<Sub>` assignable to `Box<Super>` |
| Function parameter / input | Contravariant | `Handler<Super>` assignable to `Handler<Sub>` |
| Both read and write (mutable) | Invariant | Neither is assignable to the other |

## Watch out

- Passing mutable arrays covariantly can cause runtime errors; TypeScript checks array mutability under strictFunctionTypes.
- Method syntax (m(x): void) is bivariant by default; use function property syntax (m: (x) => void) for strict contravariance.

## Remember

- Covariant types preserve subtyping direction (outputs, readonly containers).
- Contravariant types invert subtyping direction (function inputs).
- TypeScript computes variance automatically from where type parameters appear.
