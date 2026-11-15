---
slug: typing-fetch-and-validating-json
title: "Typing fetch & Validating JSON"
topic: advanced-patterns
kind: technique
summary: "Safely type HTTP fetch requests by treating response JSON as unknown and validating data at runtime with type guards."
tags: [fetch, json, validation]
related: [typing-promises-and-async-await, typing-error-handling-in-catch, user-defined-type-guards]
---
> **In one line:** Never cast fetch JSON with as Type; treat it as unknown and validate properties at runtime.

## The idea

The browser’s built-in `fetch()` API returns a `Response` object whose `json()` method is typed in the TypeScript DOM library as returning `Promise<any>`.

Because `response.json()` returns `any`, developers frequently write:
`const user = await response.json() as UserProfile;`

This is unsafe. Type assertions (`as UserProfile`) perform zero runtime validation. If the backend API changes, returns an error object, or returns `null`, your application will crash with unexpected runtime exceptions down the line.

The robust, professional approach is to type incoming JSON as `unknown` and validate the data using a runtime type guard or validation schema (such as Zod, Valibot, or ArkType) before trusting the data.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface UserProfile {
  id: string;
  email: string;
}

function isUserProfile(data: unknown): data is UserProfile {
  return typeof data === 'object' && data !== null &&
    'id' in data && typeof (data as UserProfile).id === 'string' &&
    'email' in data && typeof (data as UserProfile).email === 'string';
}

async function fetchUserSafe(url: string): Promise<UserProfile> {
  const response = await fetch(url);
  const rawData: unknown = await response.json(); // Type as unknown, NOT any!

  if (!isUserProfile(rawData)) {
    throw new Error('Received malformed UserProfile payload from API');
  }

  return rawData; // Safe and verified!
}
```

> **Tip:** In production applications, use schema libraries like Zod (`UserSchema.parse(rawData)`) for automatic validation and type inference.

## Go deeper

Comparing network response typing strategies:

| Strategy | Safety Level | Runtime Overhead | Resilient to API Drift? |
|---|---|---|---|
| Blind Cast (`as User`) | Unsafe (0% check) | Zero | No (silent runtime crashes) |
| Custom Type Guard | 100% Safe | Minimal | Yes (fails immediately with clear error) |
| Schema Parser (Zod) | 100% Safe | Low | Yes (detailed parsing error reports) |

## Watch out

- fetch does not throw an error on 404 or 500 status codes; always check response.ok first.
- Never annotate response.json() with an unsafe generic without validating the payload.

## Remember

- Treat all incoming network data from fetch as unknown rather than any.
- Type assertions (as Type) do not validate data at runtime and can mask malformed payloads.
- Use type guards or schema parsers at application boundaries to guarantee data soundness.
