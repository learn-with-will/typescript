---
slug: combining-keyof-and-indexed-access
title: "Combining keyof & Indexed Access"
topic: utility-and-lookup-types
kind: technique
summary: "Combine keyof and indexed access Type[keyof Type] to extract unions of all property value types from an object."
tags: [keyof, indexed-access, metaprogramming]
related: [keyof-type-operator, indexed-access-types, typeof-type-query]
---
> **In one line:** Use Type[keyof Type] to generate a union of all possible property value types in an object.

## The idea

Individually, `keyof` extracts property keys and indexed access (`Type[Key]`) extracts property values. When combined together, they form one of TypeScript's most powerful idioms: `Type[keyof Type]`.

Passing `keyof Type` into an indexed access query asks the compiler: "What are all the possible value types across all properties of this object?"

This pattern is especially valuable when working with configuration maps or lookup dictionaries. If you have an object mapping action names to action payloads, `Actions[keyof Actions]` produces a clean union of all possible payload types. Combined with `typeof`, you can extract unions directly from runtime objects.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
const EVENT_PAYLOADS = {
  login: { username: 'alice', timestamp: 100 },
  logout: { reason: 'session_timeout' },
  click: { x: 50, y: 150 }
} as const;

// 1. Extract the union of all keys:
type EventName = keyof typeof EVENT_PAYLOADS; // "login" | "logout" | "click"

// 2. Extract the union of all values:
type EventPayload = typeof EVENT_PAYLOADS[keyof typeof EVENT_PAYLOADS];
// Inferred as union of the 3 payload shapes!

function handleEvent(payload: EventPayload): void {
  console.log('Received event payload:', payload);
}
```

> **Tip:** This pattern eliminates the need to manually declare separate action union types in Redux and state machine architectures.

## Go deeper

Step-by-step evaluation of `Type[keyof Type]`:

```flow
obj: const OBJ = { a: 1, b: "hi" } as const @primary
step1: typeof OBJ | readonly a: 1, readonly b: "hi" @blue
step2: keyof typeof OBJ | keys "a" or "b" @amber
step3: typeof OBJ["a" or "b"] | 1 or "hi" @green
obj -> step1: queries runtime type
step1 -> step2: extracts keys
step2 -> step3: indexes all values into union
```

## Watch out

- If properties share identical types, TypeScript deduplicates them automatically in the resulting union.
- Applying this pattern to objects with methods will include the function signatures in the value union.

## Remember

- Type[keyof Type] extracts a union of all property value types from an object.
- Pair keyof and indexed access with typeof to derive union types from runtime data.
- Prevents manual type duplication in event buses, state machines, and API handlers.
