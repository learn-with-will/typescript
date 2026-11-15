---
slug: annotations-do-not-validate-data
title: "Annotations Do Not Validate Data"
topic: getting-started
kind: pitfall
summary: "Type annotations tell the compiler what you expect, but they cannot validate incoming network or external data at runtime."
tags: [validation, runtime, security]
related: [type-erasure, what-typescript-adds, errors-before-runtime]
---
> **In one line:** TypeScript annotations verify compile-time intent, not untrusted runtime payloads from networks or storage.

## The idea

When developers write `const user: User = await response.json()`, they often believe TypeScript guarantees that `user` matches the `User` interface. This is a dangerous misconception that leads to unexpected runtime crashes in production.

Because TypeScript types are completely erased during compilation, type annotations emit no validation instructions into the compiled JavaScript. If the API returns `null`, an empty object, or unexpected fields, the variable will hold whatever data the server returned without triggering any compiler error until property access fails.

To safely handle external data from HTTP requests, localStorage, or user input, you must validate values at runtime. You can use explicit runtime type guards or schema validation libraries like Zod, Valibot, or ArkType.

Type annotations establish a contract for internal application logic. External boundaries require active defensive programming where runtime checks verify that data conforms to expected shapes before passing it into typed subsystems.

## See it

```typescript
interface Profile {
  username: string;
  email: string;
}

// Unsafe: The compiler trusts this annotation blindly:
async function unsafeFetch(url: string): Promise<Profile> {
  const res = await fetch(url);
  return res.json() as Promise<Profile>;
}

// Safe: Verify properties at runtime before trusting the type:
function isProfile(data: unknown): data is Profile {
  return (
    typeof data === 'object' &&
    data !== null &&
    'username' in data &&
    typeof (data as Profile).username === 'string' &&
    'email' in data &&
    typeof (data as Profile).email === 'string'
  );
}
```

> **Tip:** Treat all data entering from outside the application boundary (APIs, files, query parameters) as `unknown`.

## Go deeper

Comparing external data handling strategies across JavaScript and TypeScript:

| Approach | Checked When | Handles Malformed Data? |
|---|---|---|
| Type assertion (`as Type`) | Compile time only | No, silently causes runtime exceptions |
| Custom Type Guard | Runtime | Yes, narrows type based on runtime boolean |
| Schema Validator (Zod/Valibot) | Runtime + Compile time | Yes, parses and guarantees matching type |

## Watch out

- Casting JSON responses with as Type bypasses compiler checks without protecting your runtime.
- Assuming third-party payloads will always conform to your TypeScript interfaces leads to silent bugs.

## Remember

- TypeScript types do not exist at runtime and cannot validate incoming network payloads.
- Use unknown rather than any for incoming external data to require explicit verification.
- Pair TypeScript interfaces with runtime validation guards for robust production boundaries.
