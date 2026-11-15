---
slug: user-defined-type-guards
title: "User-Defined Type Guards"
topic: unions-and-narrowing
kind: technique
summary: "Write custom type guard functions returning parameter is Type to encapsulate complex validation logic and narrow types."
tags: [type-guards, predicates, narrowing]
related: [asserts-type-predicates, typeof-narrowing, instanceof-and-in-narrowing]
---
> **In one line:** Create custom type guards with param is Type return types to encapsulate narrowing logic.

## The idea

While `typeof` and `instanceof` handle built-in primitives and classes, real-world applications often need to validate complex domain shapes, such as verifying whether an incoming JSON payload represents a valid `User` object.

Inlining multi-step property checks everywhere in your codebase is repetitive and hard to maintain.

TypeScript allows you to write user-defined type guards. A type guard is an ordinary JavaScript function whose return type is a type predicate: `parameterName is TargetType`. When the function returns `true` at runtime, TypeScript narrows the passed argument to `TargetType` in calling code.

## See it

```typescript
interface Article {
  title: string;
  wordCount: number;
}

// User-defined type guard with type predicate:
function isArticle(value: unknown): value is Article {
  return (
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    typeof (value as Article).title === 'string' &&
    'wordCount' in value &&
    typeof (value as Article).wordCount === 'number'
  );
}

function displayArticle(item: unknown): void {
  if (isArticle(item)) {
    // Inside this branch, item is narrowed to Article:
    console.log(`Article "${item.title}" (${item.wordCount} words)`);
  } else {
    console.log('Provided item is not a valid Article');
  }
}
```

> **Tip:** You can use type guards with `Array.prototype.filter` to filter out nulls or invalid types cleanly: `items.filter(isArticle)`.

## Go deeper

Comparing standard boolean helper functions with type guards:

| Return Type | Syntax | TypeScript Behavior in `if (check(x))` |
|---|---|---|
| Standard Boolean | `function isValid(x): boolean` | No narrowing; `x` retains original type |
| Type Predicate | `function isValid(x): x is User` | Narrows `x` to `User` in `true` branch |
| Inferred Predicate | (TypeScript 5.5+) `return typeof x === 'string'` | Automatically inferred as `x is string` |

## Watch out

- The compiler trusts your predicate implementation; if your runtime check is flawed, false types will propagate.
- A type guard must return a boolean (true or false); it cannot throw errors.

## Remember

- Use parameterName is Type as the return type to create a user-defined type guard.
- When a type guard returns true, TypeScript narrows the variable in the caller’s conditional branch.
- Use type guards to safely validate external JSON payloads and filter mixed arrays.
