---
slug: contextual-typing
title: "Contextual Typing"
topic: functions
kind: concept
summary: "TypeScript infers the types of function parameters automatically from the location and context in which the function appears."
tags: [inference, contextual-typing, callbacks]
related: [function-type-expressions, typing-parameters-and-returns, void-return-type]
---
> **In one line:** Contextual typing infers callback parameter types from the surrounding expression.

## The idea

Ordinarily, TypeScript determines the type of an expression from right to left: the type of the assigned value determines the type of the variable. However, TypeScript also works in the opposite direction through a process called contextual typing.

When a function expression appears in a location where its type is already known—such as an argument to `Array.prototype.map()` or an event listener—TypeScript uses the context to infer the types of the function's parameters and return value automatically.

Because of contextual typing, you rarely need to annotate parameter types inside inline callbacks. The compiler already knows what arguments will be passed and verifies that your callback body handles them safely.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

Adopting these idioms early ensures that code remains clean, readable, and resilient against future modifications. Software systems inevitably change as business requirements evolve, and having robust compile-time guarantees allows engineers to focus on business value rather than chasing type-related regressions across the application stack.

## See it

```typescript
const names = ['Alice', 'Bob', 'Charlie'];

// Contextual typing infers 'name' as string automatically:
const greetings = names.map((name) => {
  return `Hello, ${name.toLowerCase()}`; // Autocomplete works on 'name'!
});

window.addEventListener('click', (event) => {
  // 'event' is contextually typed as MouseEvent:
  console.log(`Clicked at ${event.clientX}, ${event.clientY}`);
});
```

> **Tip:** Do not write redundant parameter types in callbacks; let contextual typing keep your code clean and readable.

## Go deeper

```flow
source: names: string[] | array of strings @primary
method: names.map(callback) | expects (item: string) => U @blue
param: callback item | inferred as string contextually @green
source -> method: supplies element type
method -> param: infers parameter type
```

## Watch out

- Extracting an anonymous callback into a standalone variable removes context and requires annotations.
- Calling a method on an untyped collection removes contextual inference.

## Remember

- Contextual typing infers callback parameter types from their surrounding call sites.
- You do not need to annotate parameters in array methods like map and filter.
- Separating a callback into a standalone variable may require explicit annotations.
