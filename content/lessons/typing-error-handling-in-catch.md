---
slug: typing-error-handling-in-catch
title: "Typing error in catch Clauses"
topic: advanced-patterns
kind: technique
summary: "Under strict mode, catch variables are typed as unknown because JavaScript allows throwing arbitrary values."
tags: [errors, catch, exceptions]
related: [typing-promises-and-async-await, typing-fetch-and-validating-json, strict-flag-breakdown]
---
> **In one line:** Catch clause errors are typed as unknown; narrow with instanceof Error before accessing .message.

## The idea

In JavaScript, a `throw` statement can throw absolutely anything: a standard `Error` instance, a string, a number, `null`, or an arbitrary object: `throw "Server timed out"`.

Because of this runtime reality, TypeScript cannot know what type of error will be thrown by a `try` block. Under older TypeScript settings, catch variables defaulted to `any`, allowing developers to write `console.log(err.message)` without verifying that `err` was actually an `Error` instance.

With `useUnknownInCatchVariables` enabled (which is turned on automatically by `"strict": true`), catch clause variables are typed as `unknown`. You must narrow the caught value before reading properties.

## See it

```typescript
function parseConfiguration(rawJson: string): Record<string, unknown> {
  try {
    return JSON.parse(rawJson);
  } catch (err: unknown) { // err is unknown under strict mode
    // Direct property access is prevented:
    // console.log(err.message); // Error: 'err' is of type 'unknown'

    // Safe error message extraction:
    if (err instanceof Error) {
      console.error('JSON parsing failed:', err.message);
    } else {
      console.error('An unexpected error was thrown:', String(err));
    }

    return {};
  }
}

parseConfiguration('{ invalid json }');
```

> **Tip:** Create a reusable helper function `getErrorMessage(err: unknown): string` to normalize caught errors across your app.

## Go deeper

Reusable error extractor utility for production code:

```typescript
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unknown error occurred';
}

try {
  throw new Error('Database connection failed');
} catch (err) {
  const message = getErrorMessage(err);
  console.log('Normalized message:', message);
}
```

## Watch out

- You cannot type a catch clause as catch (err: Error); TypeScript only permits : unknown or : any.
- Libraries that reject Promises with plain objects will fail an err instanceof Error check; handle fallbacks.

## Remember

- Catch clause variables are typed as unknown under strict mode.
- JavaScript allows throwing any runtime value including strings and numbers.
- Always narrow caught errors using instanceof Error before accessing .message.
