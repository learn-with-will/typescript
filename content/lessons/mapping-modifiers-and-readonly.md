---
slug: mapping-modifiers-and-readonly
title: "Mapping Modifiers (+ and -)"
topic: type-transformations
kind: technique
summary: "Add or strip readonly and optional modifiers during mapping using prefix + or - operators."
tags: [mapped-types, modifiers, immutability]
related: [mapped-type-syntax, key-remapping-with-as, building-utility-types-with-mapping]
---
> **In one line:** Use + or - before readonly and ? in mapped types to explicitly add or remove modifiers.

## The idea

When a mapped type iterates over an existing type `T`, it normally preserves any existing modifiers (like `readonly` and `?`) from the original properties. This behavior is called homomorphic mapping.

However, you often want to explicitly add or strip these modifiers during the transformation. TypeScript provides mapping modifiers using `+` (add) and `-` (remove) prefixes:
- `+readonly` or `readonly`: Adds the readonly modifier to all mapped properties.
- `-readonly`: Removes the readonly modifier, making properties mutable.
- `+?` or `?`: Adds the optional modifier to all mapped properties.
- `-?`: Removes the optional modifier, making properties strictly mandatory.

These prefix modifiers are the exact mechanism used by TypeScript's standard library to implement `Readonly<T>`, `Partial<T>`, and `Required<T>`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface UserProfile {
  readonly id: string;
  name: string;
  bio?: string;
  avatar?: string;
}

// 1. Remove 'readonly' to make mutable:
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};
type EditableUser = Mutable<UserProfile>; // id is now mutable string!

// 2. Remove '?' to make all properties strictly required:
type Concrete<T> = {
  [K in keyof T]-?: T[K];
};
type StrictUser = Concrete<UserProfile>; // bio and avatar are now required!
```

> **Tip:** If you omit the `+` or `-` sign and just write `readonly` or `?`, TypeScript assumes `+` (adding the modifier).

## Go deeper

How built-in utility types are implemented with mapping modifiers:

| Utility Type | Implementation in `lib.es5.d.ts` | Modifier Action |
|---|---|---|
| `Partial<T>` | `{ [P in keyof T]?: T[P]; }` | Adds `+?` (optional) |
| `Required<T>` | `{ [P in keyof T]-?: T[P]; }` | Strips `-?` (mandatory) |
| `Readonly<T>` | `{ readonly [P in keyof T]: T[P]; }` | Adds `+readonly` |
| `Mutable<T>` (custom) | `{ -readonly [P in keyof T]: T[P]; }` | Strips `-readonly` |

## Watch out

- Stripping optionality (-?) does not remove null from properties that are typed as T | null.
- Remember that -readonly only modifies the top-level properties; nested objects remain unchanged.

## Remember

- Prefix readonly and ? with + to add modifiers, or - to strip them.
- Use -? to make all optional properties mandatory (as in Required<T>).
- Use -readonly to make read-only properties mutable.
