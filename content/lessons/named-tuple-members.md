---
slug: named-tuple-members
title: "Named Tuple Members"
topic: objects-and-shapes
kind: technique
summary: "Label tuple elements with descriptive names to provide self-documenting code and clear editor hover documentation."
tags: [tuples, documentation, tooling]
related: [tuple-types, readonly-tuples-and-arrays, type-aliases-basics]
---
> **In one line:** Add labels to tuple elements [name: Type] for self-documenting signatures and editor hints.

## The idea

While tuple types like `[string, number, boolean]` provide strong type safety, they can be difficult to interpret when reading code or function signatures. What does the string represent? Is the number an age, a score, or an ID?

In TypeScript 4.0, the language introduced named tuple members (also known as labeled tuple elements). You can prefix each tuple element type with a descriptive label: `[username: string, age: number, isAdmin: boolean]`.

These labels have no runtime effect and do not change how values are accessed (you still access them by index, such as `tuple[0]`). However, the labels appear in editor hover tooltips, autocompletion dialogs, and error messages, significantly improving code readability and developer communication.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Labeled tuple elements provide self-documenting clarity:
type HttpRequestResult = [statusCode: number, payload: string, durationMs: number];

function executeRequest(url: string): HttpRequestResult {
  return [200, '{"success": true}', 45];
}

const [code, body, duration] = executeRequest('/api/status');
console.log(`Request finished with code ${code} in ${duration}ms`);
```

> **Tip:** When using labeled tuples, all elements in the tuple must have labels; you cannot mix labeled and unlabeled elements.

## Go deeper

Comparing unlabeled vs labeled tuples in developer tooling:

| Tuple Definition | Editor Hover Display | Documentation Value |
|---|---|---|
| `[number, number]` | `[number, number]` | Ambiguous (which is latitude/longitude?) |
| `[lat: number, lng: number]` | `[lat: number, lng: number]` | Completely clear without consulting docs |
| `[string, () => void]` | `[string, () => void]` | Generic callback pair |
| `[state: string, reset: () => void]` | `[state: string, reset: () => void]` | Self-documenting hook return |

## Watch out

- You cannot label only some elements in a tuple; either all elements are labeled or none are.
- Labeled tuple members cannot be accessed by property name (tuple.lat fails; use tuple[0]).

## Remember

- Prefix tuple types with labels like [label: Type] for enhanced readability.
- Labels appear in editor tooltips and parameter documentation.
- Labels are purely compile-time documentation and do not alter index access.
