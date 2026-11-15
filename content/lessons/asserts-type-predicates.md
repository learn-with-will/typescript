---
slug: asserts-type-predicates
title: "asserts Type Predicates"
topic: unions-and-narrowing
kind: technique
summary: "Use assertion functions returning asserts condition to narrow types across entire subsequent execution scopes."
tags: [assertions, narrowing, exceptions]
related: [user-defined-type-guards, the-never-type, type-assertions-with-as]
---
> **In one line:** Use asserts condition to narrow variables across the remainder of the current scope by throwing on failure.

## The idea

Standard type guards require an `if` statement to create a narrowed branch. However, many systems follow an assertion pattern: rather than branching on invalid input, an assertion function throws an exception immediately if a condition is not met (fail-fast architecture).

Ordinarily, TypeScript does not know that an assertion function throwing an error guarantees the variable's type for subsequent statements.

In TypeScript 3.7, the language introduced assertion signatures using the `asserts` keyword: `asserts condition` or `asserts val is Type`. When an assertion function completes without throwing, the compiler knows the assertion held and narrows the variable for the entire remainder of the containing function scope.

## See it

```typescript
interface SessionUser {
  id: string;
  authToken: string;
}

// Assertion function with 'asserts' predicate:
function assertIsAuthenticated(user: unknown): asserts user is SessionUser {
  if (
    typeof user !== 'object' ||
    user === null ||
    !('authToken' in user) ||
    typeof (user as SessionUser).authToken !== 'string'
  ) {
    throw new Error('User session is invalid or unauthenticated!');
  }
}

function processOrder(user: unknown): void {
  assertIsAuthenticated(user);

  // No if-statement required! user is narrowed to SessionUser below:
  console.log(`Processing order for token: ${user.authToken}`);
}
```

> **Tip:** Assertion functions are ideal for guarding entry points in controllers, RPC endpoints, and middleware.

## Go deeper

Comparing standard type guards and assertion signatures:

| Feature | Type Guard (`x is T`) | Assertion Function (`asserts x is T`) |
|---|---|---|
| Failure behavior | Returns `false` | Throws runtime exception |
| Usage style | Inside `if (isUser(x)) { ... }` | Standalone call `assertUser(x);` |
| Scope of narrowing | Only inside the conditional block | Entire remainder of the enclosing scope |
| Emitted JavaScript | Standard boolean function | Standard function with throw check |

## Watch out

- An assertion function must throw an exception if the check fails; returning false will not prevent execution.
- Arrow functions can be assertion functions only if explicitly annotated with an assertion signature.

## Remember

- Use asserts val is Type to create functions that narrow types by throwing on failure.
- Subsequent statements in the same scope treat the variable as narrowed without if blocks.
- Assertion signatures are ideal for fail-fast validation in services and API endpoints.
