---
slug: intrinsic-string-manipulation
title: "Intrinsic String Manipulation"
topic: type-transformations
kind: api
summary: "Use built-in string manipulation types Uppercase, Lowercase, Capitalize, and Uncapitalize in the type system."
tags: [intrinsic-types, strings, casing]
related: [template-literal-type-basics, template-literals-with-unions, key-remapping-with-templates]
---
> **In one line:** Use Uppercase, Lowercase, Capitalize, and Uncapitalize to transform string types.

## The idea

When manipulating string types, you often need to alter character casing: for example, converting a property name like `name` into `getName` (capitalizing the first character) or normalizing a status string to uppercase.

TypeScript provides four built-in intrinsic string manipulation types:
- **`Uppercase<StringType>`:** Converts every character in the string type to uppercase.
- **`Lowercase<StringType>`:** Converts every character in the string type to lowercase.
- **`Capitalize<StringType>`:** Converts only the first character to uppercase.
- **`Uncapitalize<StringType>`:** Converts only the first character to lowercase.

These utilities are called "intrinsic" because their implementation is built directly into the TypeScript compiler engine for speed, taking full advantage of Unicode character mapping.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
type Role = 'admin' | 'moderator' | 'user';

// 1. Uppercase conversion:
type UppercaseRole = Uppercase<Role>;
// "ADMIN" | "MODERATOR" | "USER"

// 2. Capitalize conversion:
type EventName = 'click' | 'focus';
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus"

// 3. Lowercase normalization:
type RawHeaders = 'Content-Type' | 'Authorization';
type NormalizedHeaders = Lowercase<RawHeaders>;
// "content-type" | "authorization"

function bindHandler(name: HandlerName): void {
  console.log(`Registering handler: ${name}`);
}
bindHandler('onClick');
```

> **Tip:** Combine `Capitalize` with key remapping in mapped types to automatically generate typed getter/setter methods.

## Go deeper

Summary of intrinsic string manipulation utilities:

| Intrinsic Type | Input String Type | Transformed Output Type |
|---|---|---|
| `Uppercase<S>` | `"hello world"` | `"HELLO WORLD"` |
| `Lowercase<S>` | `"HELLO WORLD"` | `"hello world"` |
| `Capitalize<S>` | `"user"` | `"User"` |
| `Uncapitalize<S>` | `"UserProfile"` | `"userProfile"` |

## Watch out

- Intrinsic string utilities only accept string types; passing number or symbol fails compilation.
- Locale-specific casing rules are not supported; transformations follow standard Unicode casing.

## Remember

- TypeScript provides four intrinsic string casing utilities: Uppercase, Lowercase, Capitalize, Uncapitalize.
- They are implemented inside the compiler for optimal performance.
- Combine with template literals to generate idiomatic handler and accessor names.
