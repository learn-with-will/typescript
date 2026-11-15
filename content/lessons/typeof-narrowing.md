---
slug: typeof-narrowing
title: "typeof Narrowing"
topic: unions-and-narrowing
kind: technique
summary: "Use JavaScript typeof type guards inside conditionals to narrow primitive union types safely."
tags: [narrowing, typeof, guards]
related: [union-types, truthiness-and-equality-narrowing, instanceof-and-in-narrowing]
---
> **In one line:** Use typeof checks in if statements to narrow unions to specific primitive types.

## The idea

TypeScript's type checker is aware of JavaScript runtime control flow. When you inspect a value using standard JavaScript conditionals, the compiler understands that the value's type is constrained within that branch. This feature is called control flow based type narrowing.

The most common narrowing mechanism for primitive values is the JavaScript `typeof` operator. TypeScript recognizes all runtime return values of `typeof`: `"string"`, `"number"`, `"bigint"`, `"boolean"`, `"symbol"`, `"undefined"`, `"object"`, and `"function"`.

When you check `if (typeof x === "string")`, TypeScript narrows `x` to `string` inside the `if` block. In the corresponding `else` block, TypeScript removes `string` from the remaining union.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
function padPadding(input: string | number, padding: number): string {
  // Narrowing using typeof check:
  if (typeof input === 'number') {
    // Inside this branch, input is known to be number:
    return input.toFixed(2).padStart(padding, '0');
  }

  // Inside this branch, input is known to be string:
  return input.padStart(padding, ' ');
}

console.log(padPadding(5, 6));      // '005.00'
console.log(padPadding('item', 8)); // '    item'
```

> **Watch out:** In JavaScript, `typeof null === "object"`! Do not rely solely on `typeof x === "object"` to check for non-null objects.

## Go deeper

Comparing `typeof` operator results and their corresponding narrowed types:

| `typeof x === ...` | Narrowed Type | Caveat |
|---|---|---|
| `"string"` | `string` | Exact primitive match |
| `"number"` | `number` | Includes `NaN` and `Infinity` |
| `"boolean"` | `boolean` | Matches `true` or `false` |
| `"object"` | `object | null` | Must verify `x !== null` separately! |
| `"function"` | Function type | Callable signature |

## Watch out

- typeof null returns "object" in JavaScript; always pair object checks with x !== null.
- typeof arrays also returns "object"; use Array.isArray(x) to narrow array types.

## Remember

- TypeScript uses typeof checks to narrow union types in conditional branches.
- In the else branch, the checked type is automatically removed from the union.
- Remember that typeof null is "object" due to historical JavaScript runtime design.
