---
slug: strict-null-checks
title: "strictNullChecks in Practice"
topic: basic-types
kind: technique
summary: "With strictNullChecks enabled, null and undefined are distinct types that cannot be assigned to regular variables without unioning."
tags: [null, undefined, strictNullChecks]
related: [primitives-and-inference, unknown-safe-top-type, type-annotations-vs-inference]
---
> **In one line:** Enable strictNullChecks to treat null and undefined as distinct types that must be explicitly handled.

## The idea

In JavaScript, attempting to access properties on `null` or `undefined` produces the classic runtime exception: `TypeError: Cannot read properties of undefined`. In older TypeScript versions or when strict mode is disabled, `null` and `undefined` were assignable to every type, meaning a `string` variable could secretly be `null` at any time.

With `"strictNullChecks": true` (which is automatically turned on by `"strict": true`), `null` and `undefined` become distinct types in their own right. A variable annotated as `string` can only hold string values; it can never be assigned `null` or `undefined`.

If a variable or function parameter might be absent, you must explicitly declare it as a union type such as `string | null` or `string | undefined`. The compiler then forces you to check for existence before accessing properties.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
function printUserName(name: string | null): void {
  // The compiler flags possible null dereference:
  // console.log(name.toUpperCase()); // Error: 'name' is possibly 'null'

  if (name !== null) {
    // Inside this branch, name is narrowed to string:
    console.log(name.toUpperCase());
  } else {
    console.log('Guest User');
  }
}

printUserName('Alice');
printUserName(null);
```

> **Tip:** Optional properties (declared with `?`) automatically include `undefined` in their type union.

## Go deeper

Comparing compiler behavior with strictNullChecks toggled:

| Expression | With `strictNullChecks: false` | With `strictNullChecks: true` |
|---|---|---|
| `let name: string = null;` | Allowed (dangerous) | Compile error |
| `let name: string = undefined;` | Allowed (dangerous) | Compile error |
| `name.trim()` | Compiles, may crash at runtime | Compiler requires null check first |
| `let name: string | null = null;` | Allowed | Allowed and safely checked |

## Watch out

- Disabling strictNullChecks reintroduces unhandled null pointer exceptions to your runtime.
- The non-null assertion operator (!) silences the compiler; use it only when existence is guaranteed.

## Remember

- strictNullChecks prevents assigning null or undefined to non-nullable variables.
- Use union types like string | null when a value can be intentionally absent.
- The compiler forces you to narrow nullable values before accessing their properties.
