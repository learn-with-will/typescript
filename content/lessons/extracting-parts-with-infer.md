---
slug: extracting-parts-with-infer
title: "Extracting Parts with infer & Templates"
topic: type-transformations
kind: technique
summary: "Parse and decompose formatted string types into structured tuples using infer within template literal types."
tags: [infer, template-literals, string-parsing]
related: [template-literal-type-basics, infer-keyword, key-remapping-with-templates]
---
> **In one line:** Use infer inside template literal patterns to parse structured strings like paths and routes.

## The idea

The combination of the `infer` keyword and template literal types creates a full pattern-matching string parser directly inside the TypeScript type system!

Just as you can match an array with `infer E`, you can match a string pattern with `infer Head` and `infer Tail`. For example, testing `S extends `${infer Head}/${infer Tail}`` allows you to split a string path by its forward slashes.

This technique is used by modern web frameworks (such as Next.js, Express, and TanStack Router) to parse URL path parameters like `/users/:userId/posts/:postId` and automatically infer the exact types of the `params` object passed to route handlers!

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Extracting parameter names from route paths:
type ExtractRouteParams<Path extends string> =
  Path extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractRouteParams<Rest>
    : Path extends `${string}:${infer Param}`
    ? Param
    : never;

type MyRoute = '/users/:userId/posts/:postId';
type RouteParams = ExtractRouteParams<MyRoute>;
// Inferred as: "userId" | "postId"!

// Function that enforces route parameters:
function navigate<P extends string>(path: P, params: Record<ExtractRouteParams<P>, string>): void {
  console.log('Navigating with params:', params);
}

navigate('/users/:userId/posts/:postId', {
  userId: 'usr_123',
  postId: 'post_456'
});
```

> **Tip:** You can build recursive string splitters, CSV line parsers, and SQL query parameter checkers using this pattern.

## Go deeper

Deconstructing a route string step-by-step:

| Iteration | Pattern Tested | Extracted `Param` | Remaining `Rest` |
|---|---|---|---|
| Step 1 | `${string}:${infer Param}/${infer Rest}` | `"userId"` | `"posts/:postId"` |
| Step 2 | Recursively tests remaining `Rest` | `"postId"` | (No trailing slash) |
| Combined | Recombines extracted param names | `"userId" | "postId"` | Finished |

## Watch out

- Recursive string parsing has a limit of around 50 iterations; avoid parsing arbitrarily long user strings.
- Greedy matching: infer inside templates matches lazily by default; test edge cases thoroughly.

## Remember

- Use infer inside template literal patterns to parse strings at compile time.
- Extract route parameters like :userId into typed parameter objects automatically.
- Powers modern routing libraries and type-safe URL navigators.
