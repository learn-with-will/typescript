---
slug: typing-parameters-and-returns
title: "Typing Parameters and Returns"
topic: functions
kind: technique
summary: "Annotate function parameters to prevent runtime call mismatches, and annotate return types to lock down public contracts."
tags: [functions, parameters, types]
related: [optional-and-default-parameters, void-return-type, function-type-expressions]
---
> **In one line:** Annotate parameter types to establish call contracts, and annotate return types for interface clarity.

## The idea

In JavaScript, functions accept any number of arguments of any type, returning whatever value happens to be produced. This flexibility makes function boundaries the most common source of bugs in growing codebases: missing arguments, inverted argument orders, or unexpected return shapes.

In TypeScript, function parameter annotations are the primary point of type enforcement. When `noImplicitAny` is enabled, the compiler requires an explicit type annotation for every parameter unless its type can be inferred contextually. This ensures callers cannot pass incompatible arguments.

Return types can be inferred automatically from `return` statements within the function body. However, explicitly annotating return types on exported or public functions is considered best practice. It documents the intended contract, catches accidental return changes during refactoring, and speeds up compiler type checking in large projects.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return `${currency} ${amount.toFixed(2)}`;
}

const formatted = formatCurrency(49.99);
console.log(formatted);

// The compiler catches invalid argument types immediately:
// formatCurrency('49.99'); // Error: Argument of type 'string' is not assignable to 'number'
```

> **Tip:** Annotating return types prevents you from accidentally returning the wrong value when modifying complex logic.

## Go deeper

Function typing best practices across application boundaries:

| Function Role | Parameter Annotations | Return Type Annotations |
|---|---|---|
| Public exported function | Mandatory | Strongly recommended |
| Internal helper function | Mandatory | Inferred |
| Callback in map/filter | Usually inferred contextually | Usually inferred contextually |
| Recursive function | Mandatory | Mandatory (inference may fail) |

## Watch out

- JavaScript allows calling functions with fewer or extra arguments; TypeScript strictly enforces parameter counts.
- Recursive functions often require explicit return type annotations to prevent circular inference errors.

## Remember

- Always annotate function parameters to define expected input contracts.
- Explicit return type annotations prevent accidental changes to public API contracts.
- TypeScript enforces exact parameter counts and argument types at every call site.
