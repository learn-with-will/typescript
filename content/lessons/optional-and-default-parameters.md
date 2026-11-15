---
slug: optional-and-default-parameters
title: "Optional and Default Parameters"
topic: functions
kind: technique
summary: "Use the question mark syntax for optional parameters or assign default values to provide ergonomic function signatures."
tags: [functions, parameters, defaults]
related: [typing-parameters-and-returns, rest-parameters, void-return-type]
---
> **In one line:** Mark optional parameters with ? or provide default values with = for flexible invocation.

## The idea

JavaScript functions frequently support optional settings, allowing callers to omit trailing arguments. In TypeScript, parameters are required by default, matching the exact number of declared parameters.

To declare a parameter as optional, place a question mark (`?`) immediately after the parameter name. The parameter's type automatically becomes a union with `undefined` inside the function body. Because arguments are matched positionally, optional parameters must always follow required parameters.

Alternatively, you can provide default parameter values using the standard JavaScript assignment syntax (`param = defaultValue`). When a default value is provided, TypeScript automatically infers the parameter type and treats the argument as optional for callers.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Optional parameter using ? syntax:
function buildUrl(path: string, query?: string): string {
  return query ? `${path}?${query}` : path;
}

// Default parameter using = syntax (inferred as string):
function createGreeting(name: string, prefix: string = 'Hello'): string {
  return `${prefix}, ${name}!`;
}

console.log(buildUrl('/api/users'));
console.log(createGreeting('Alice'));
console.log(createGreeting('Bob', 'Welcome'));
```

> **Tip:** Prefer default parameters over optional parameters when a sensible fallback value exists, simplifying function logic.

## Go deeper

Comparing optional parameters and default parameter values:

| Feature | Optional Parameter (`?`) | Default Parameter (`=`) |
|---|---|---|
| Type inside function body | `T | undefined` | `T` (guaranteed defined) |
| Fallback handling | Manual check required | Handled automatically by runtime |
| Permitted position | Must follow required parameters | Anywhere (caller passes `undefined` to skip) |
| Syntactic cleanliness | Requires if/ternary checks | Direct variable usage |

## Watch out

- Placing an optional parameter before a required parameter causes a compiler syntax error.
- Passing null does not trigger a default parameter value; default values only trigger on undefined.

## Remember

- Optional parameters use ? and receive undefined when omitted by the caller.
- Default parameters provide fallback values and keep the inner type non-nullable.
- Optional parameters must always appear after all required parameters.
