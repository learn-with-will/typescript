---
slug: the-never-type
title: "The never Type"
topic: unions-and-narrowing
kind: concept
summary: "The never type represents the bottom of the type system, denoting values that can never exist or code that cannot return."
tags: [never, bottom-type, control-flow]
related: [exhaustive-checks-with-never, void-return-type, union-types]
---
> **In one line:** The never type represents impossible values and code paths that can never be reached.

## The idea

Just as `unknown` is the top type (capable of containing any value), TypeScript features a complementary bottom type called `never`. The `never` type represents values that can never occur.

A function returns `never` if it can never complete normally: for example, a function that always throws an exception or a function containing an infinite loop.

In type narrowing, `never` appears naturally when control flow analysis proves that all possible variants of a union have been checked and handled. If you narrow a `string | number` union through both `typeof === "string"` and `typeof === "number"`, any remaining `else` branch leaves the variable typed as `never`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// 1. Function that never returns normally:
function failWithPanic(message: string): never {
  throw new Error(`Fatal Error: ${message}`);
}

// 2. Control flow narrowing down to never:
function checkValue(x: string | number): void {
  if (typeof x === 'string') {
    console.log(x.toUpperCase());
  } else if (typeof x === 'number') {
    console.log(x.toFixed(2));
  } else {
    // x is impossible here! Inferred as never:
    const impossible: never = x;
    console.log(impossible);
  }
}
```

> **Note:** Nothing is assignable to `never` except `never` itself; conversely, `never` is assignable to every type.

## Go deeper

Comparing void, undefined, and never in type theory:

| Type | Set-Theoretic Meaning | Can a value of this type exist? |
|---|---|---|
| `void` | Return value should be ignored | Yes (`undefined` at runtime) |
| `undefined` | The single value `undefined` | Yes (`undefined`) |
| `never` | The empty set (`∅`) | No (impossible state) |

## Watch out

- Assigning a value to never fails compilation unless that value is also typed never.
- A function that returns normally cannot return never; use void for side-effect functions.

## Remember

- never is the bottom type representing impossible states and unreachable code.
- Functions that always throw or loop forever have a return type of never.
- Narrowing all members of a union leaves any remaining branch typed as never.
