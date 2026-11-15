---
slug: construct-signatures
title: "Construct Signatures"
topic: functions
kind: concept
summary: "Define construct signatures using the new keyword to describe constructor functions and classes passed as factory parameters."
tags: [constructors, factory, classes]
related: [function-type-expressions, declaring-this-in-functions, call-signatures-with-properties]
---
> **In one line:** Use new (args: Type) => Instance to type constructor functions and class references.

## The idea

In JavaScript, functions can be invoked as regular functions or instantiated as constructors using the `new` operator. When writing factory functions or dependency injection containers, you often need to accept a class constructor as an argument and instantiate it.

If you annotate a parameter with `Function`, you lose all type safety regarding constructor arguments and the produced instance type.

TypeScript allows you to write construct signatures using the `new` keyword. A construct signature like `new (name: string) => User` specifies that the passed value must be callable with `new` and must produce an instance of `User`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
interface UserInstance {
  id: string;
  name: string;
}

// Construct signature describing a class constructor:
type UserConstructor = new (name: string) => UserInstance;

class RegisteredUser implements UserInstance {
  id: string = Math.random().toString();
  constructor(public name: string) {}
}

function createEntity(Ctor: UserConstructor, name: string): UserInstance {
  return new Ctor(name);
}

const user = createEntity(RegisteredUser, 'Alice');
console.log(`Created user: ${user.name}`);
```

> **Tip:** In modern TypeScript, `new (...args: any[]) => any` is often used as a generic constraint for constructor types.

## Go deeper

Comparing call signatures and construct signatures in interfaces:

| Signature Type | Syntax | How Callers Invoke It |
|---|---|---|
| Call Signature | `(input: string): number;` | Standard function call `fn('test')` |
| Construct Signature | `new (input: string): Widget;` | Instantiation with `new Widget('test')` |
| Combined | Both signatures in one interface | Functions like `Date` or `RegExp` |

## Watch out

- Passing an ordinary arrow function to a parameter expecting a construct signature fails compilation.
- Construct signatures require the new operator; calling them like regular functions is forbidden.

## Remember

- Use new (...args: A) => R to type class constructors and factory parameters.
- Construct signatures guarantee that values can be instantiated safely with new.
- TypeScript enforces argument types and verifies the produced instance type.
