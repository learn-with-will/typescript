---
slug: truthiness-and-equality-narrowing
title: "Truthiness and Equality Narrowing"
topic: unions-and-narrowing
kind: technique
summary: "Narrow nullable and primitive types using truthiness checks and strict equality operators."
tags: [narrowing, truthiness, equality]
related: [typeof-narrowing, instanceof-and-in-narrowing, discriminated-unions]
---
> **In one line:** Use if (val) and === to narrow nullable unions and eliminate null or undefined.

## The idea

Beyond `typeof`, TypeScript recognizes everyday JavaScript truthiness checks and equality comparisons to narrow variable types.

In JavaScript, values like `false`, `0`, `""`, `null`, `undefined`, and `NaN` are falsy; all other values are truthy. When you write `if (value)`, TypeScript narrows `value` by filtering out `null` and `undefined` inside the true branch.

Strict equality checks (`===` and `!==`) are even more precise. If you compare a variable against a specific literal (like `if (status === "success")`) or compare two variables together, TypeScript narrows the variable's type to that exact matching branch.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
function printLength(str: string | null | undefined): void {
  // Truthiness narrowing filters out both null and undefined:
  if (str) {
    console.log(`Length: ${str.length}`); // Inferred as string
  } else {
    console.log('Value is absent or empty');
  }
}

// Equality narrowing between two variables:
function reconcile(a: string | number, b: string | boolean): void {
  if (a === b) {
    // Both variables must share a common type to be equal:
    console.log(`Both are matching strings: ${a.toUpperCase()}`);
  }
}

printLength('hello');
printLength(null);
reconcile('sync', 'sync');
```

> **Tip:** Be cautious with truthiness checks on numbers and strings; `0` and `""` are falsy and will enter the false branch!

## Go deeper

Comparing truthiness vs strict equality narrowing:

| Narrowing Method | Example | What Gets Filtered Out |
|---|---|---|
| Truthiness check | `if (val)` | `null`, `undefined`, `""`, `0`, `false`, `NaN` |
| Null check | `if (val !== null)` | Only `null` (preserves `""` and `0`) |
| Strict equality | `if (val === 'active')` | Narrows to exact literal `"active"` |
| Triple equality | `if (a === b)` | Narrows both to their common intersection |

## Watch out

- Checking if (count) when count is 0 enters the else branch unexpectedly.
- Use explicit !== undefined or !== null checks when 0 or empty string are valid inputs.

## Remember

- Truthiness checks filter out null, undefined, 0, and empty strings.
- Use strict equality (===) to narrow literal values and eliminate nullability safely.
- Prefer explicit null checks over truthiness checks when numeric zero is a valid value.
