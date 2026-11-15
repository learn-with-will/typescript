---
slug: non-null-assertion-operator
title: "The Non-Null Assertion Operator"
topic: unions-and-narrowing
kind: technique
summary: "Use the postfix exclamation mark ! to assert that an expression is neither null nor undefined when you know it is defined."
tags: [non-null, assertions, strictNullChecks]
related: [type-assertions-with-as, strict-null-checks, truthiness-and-equality-narrowing]
---
> **In one line:** Append ! to remove null and undefined from an expression’s type.

## The idea

When `strictNullChecks` is enabled, TypeScript actively flags any property access on an expression that could be `null` or `undefined`. However, there are scenarios where the developer knows with certainty that a value is present, even though the compiler cannot prove it through static analysis.

Examples include accessing an element from an array right after checking `array.length > 0`, or looking up a map entry immediately after calling `map.set()`.

TypeScript provides the non-null assertion operator: a postfix exclamation mark (`!`). Placing `!` after an expression asserts to the compiler that the value is neither `null` nor `undefined`, stripping those types from the expression's inferred type.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface UserAccount {
  id: string;
  avatarUrl?: string;
}

function renderUserAvatar(user: UserAccount): void {
  // If we already verified presence outside compiler analysis:
  if (user.avatarUrl !== undefined) {
    // Postfix ! tells the compiler avatarUrl is guaranteed to be a string:
    const url: string = user.avatarUrl!;
    console.log(`Rendering avatar from: ${url.trim()}`);
  }
}

const lookupMap = new Map<string, number>();
lookupMap.set('total', 100);

// Map.get returns V | undefined; ! asserts existence:
const totalAmount: number = lookupMap.get('total')!;
console.log(`Total amount: ${totalAmount}`);
```

> **Watch out:** If the value actually is `null` or `undefined` at runtime, using `!` will cause an unhandled `TypeError`!

## Go deeper

Comparing safety strategies for nullable values:

| Approach | Syntax | Safety Level | Runtime Overhead |
|---|---|---|---|
| Optional Chaining | `user.profile?.name` | 100% Safe (returns undefined if absent) | Negligible |
| Nullish Coalescing | `user.profile ?? defaultProfile` | 100% Safe (provides fallback) | Negligible |
| Type Guard | `if (user.profile) { ... }` | 100% Safe (verified in branch) | None |
| Non-null Assertion | `user.profile!` | Risky (crashes if wrong) | Zero |

## Watch out

- Overusing ! masks architectural flaws and missing error handling in your application.
- Never use ! to silence compiler errors on external API data or user inputs.

## Remember

- The postfix ! operator removes null and undefined from an expression’s type.
- It is a compile-time assertion with zero runtime checks or emitted JavaScript.
- Prefer optional chaining (?.) and nullish coalescing (??) over non-null assertions.
