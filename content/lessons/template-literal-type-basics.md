---
slug: template-literal-type-basics
title: "Template Literal Type Basics"
topic: type-transformations
kind: concept
summary: "Use template literal types `prefix_${T}` to construct and validate string patterns directly in the type system."
tags: [template-literals, strings, types]
related: [template-literals-with-unions, intrinsic-string-manipulation, key-remapping-with-templates]
---
> **In one line:** Use backtick syntax `prefix_${T}` to compose and constrain string types dynamically.

## The idea

JavaScript introduced template literals in ES2015 to interpolate expressions into strings: ```Hello, ${name}```.

In TypeScript 4.1, the language brought this exact syntax to the type system with template literal types. Written using backticks in type positions (`type Greeting = `Hello, ${string}``), template literal types allow you to define string types based on patterns and concatenation.

Template literal types can match exact string prefixes, suffixes, protocols, or formats. For example, you can enforce that an image URL must end in `.png` or `.jpg`, or that a CSS measurement must end with `px` or `rem`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
// Enforcing CSS measurement units:
type CssLength = `${number}px` | `${number}rem` | `${number}%`;

function setPadding(padding: CssLength): void {
  console.log(`Setting padding to ${padding}`);
}

setPadding('16px');  // Valid
setPadding('1.5rem'); // Valid
setPadding('100%');   // Valid
// setPadding('20em'); // Error: Argument of type '"20em"' is not assignable to 'CssLength'

// Enforcing URL protocols:
type SecureUrl = `https://${string}`;
const apiUrl: SecureUrl = 'https://api.example.com/v1';
// const insecureUrl: SecureUrl = 'http://api.example.com'; // Error!
```

> **Tip:** Combine template literal types with `number` to validate formatted strings like currency or dimensions.

## Go deeper

Comparing runtime template strings with type-level template literal types:

| Feature | Runtime Template String | Type-Level Template Literal |
|---|---|---|
| Syntax | `` `prefix_${value}` `` | `` type T = `prefix_${OtherType}` `` |
| Operands | Runtime values / variables | Compile-time string/number types |
| Result | Single string value in memory | String constraint type in compiler |
| Validation | None (always produces string) | Strictly validates conforming string shapes |

## Watch out

- Template literal types do not validate regex patterns; they check structural string prefixes/suffixes.
- Overly broad patterns like `${string}-${string}` match any string containing a hyphen.

## Remember

- Template literal types use backtick syntax to define structured string formats.
- Use them to enforce URL protocols, CSS dimensions, and file extensions.
- Template literal types catch invalid string formats at compile time.
