---
slug: discriminated-unions
title: "Discriminated Unions"
topic: unions-and-narrowing
kind: pattern
summary: "Combine object shapes sharing a common literal tag property to create robust, self-narrowing state machines and event models."
tags: [discriminated-unions, patterns, state-machines]
related: [union-types, exhaustive-checks-with-never, instanceof-and-in-narrowing]
---
> **In one line:** Use a common literal property (tag) across union variants for effortless, safe narrowing.

## The idea

A discriminated union (also known as a tagged union or algebraic data type) is one of the most powerful and idiomatic design patterns in TypeScript.

To create a discriminated union, each member interface in the union defines a common property (the "discriminant" or "tag") whose type is a unique literal type, such as `status: "loading"` or `kind: "circle"`.

When you inspect this single discriminant property using an `if` statement or `switch` block, TypeScript automatically narrows the entire object to that specific variant. You gain immediate access to all properties belonging to that variant without manual type assertions.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
interface LoadingState { status: 'loading'; }
interface SuccessState { status: 'success'; data: string[]; }
interface ErrorState { status: 'error'; errorMessage: string; }

type AsyncState = LoadingState | SuccessState | ErrorState;

function renderState(state: AsyncState): string {
  switch (state.status) {
    case 'loading':
      return 'Loading data...';
    case 'success':
      return `Received ${state.data.length} items`;
    case 'error':
      return `Failed: ${state.errorMessage}`;
  }
}
```

> **Tip:** Use `status`, `type`, or `kind` as consistent discriminant property names across your application.

## Go deeper

Discriminated unions provide unmatched safety when modeling UI states:

```flow
state: AsyncState | union of 3 states @primary
switch: switch(state.status) | tests discriminant @blue
load: "loading" | LoadingState @amber
succ: "success" | SuccessState @green
err: "error" | ErrorState @red
state -> switch
switch -> load
switch -> succ
switch -> err
```

## Watch out

- The discriminant property name must be identical across all members of the union.
- Each variant must assign a unique literal value to the discriminant property.

## Remember

- Discriminated unions share a common property with distinct literal types on each variant.
- Checking the discriminant property in switch or if statements automatically narrows the whole object.
- Use discriminated unions for API responses, Redux actions, and application state machines.
