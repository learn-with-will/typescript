---
slug: partial-and-required
title: "Partial and Required"
topic: utility-and-lookup-types
kind: api
summary: "Use Partial<T> to make all properties optional for patches, and Required<T> to make all properties mandatory."
tags: [utility-types, partial, required]
related: [readonly-and-record, pick-and-omit, keyof-type-operator]
---
> **In one line:** Use Partial<T> to make all fields optional and Required<T> to make all fields mandatory.

## The idea

TypeScript includes a rich standard library of built-in utility types that facilitate common type transformations. Two of the most foundational utilities are `Partial<T>` and `Required<T>`.

`Partial<T>` transforms an existing object type by adding the optional modifier (`?`) to every property. This is particularly valuable when typing update operations, patch endpoints, or form state where a user may only provide a subset of fields to update.

Conversely, `Required<T>` removes the optional modifier (`-?`) from every property on `T`, ensuring that all properties must be defined and present. This is useful when normalizing input configurations with default options, guaranteeing that no property remains `undefined`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

Furthermore, modern development workflows benefit substantially from living documentation that never becomes outdated. When APIs or shared data models change, the TypeScript compiler highlights every affected call site throughout the codebase, turning what would normally be risky manual find-and-replace refactorings into confident, automated updates that prevent regressions before merging into production releases.

## See it

```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

// Partial makes every field optional (ideal for PATCH updates):
function updateUser(id: string, patch: Partial<UserProfile>): void {
  console.log(`Updating user ${id} with fields:`, Object.keys(patch));
}

updateUser('u_101', { name: 'Alice New Name' }); // OK: Only name passed!

// Required ensures all optional fields are strictly defined:
type CompleteUserProfile = Required<UserProfile>;
// avatarUrl is now strictly string (no longer optional!)
```

> **Tip:** `Partial<T>` is shallow; if you need nested optional properties, you can create a recursive `DeepPartial<T>` utility.

## Go deeper

Comparing `Partial<T>` and `Required<T>` transformations:

| Original Property | In `Partial<T>` | In `Required<T>` |
|---|---|---|
| `name: string` | `name?: string` | `name: string` |
| `avatarUrl?: string` | `avatarUrl?: string` | `avatarUrl: string` |
| `age?: number | null` | `age?: number | null` | `age: number | null` |

## Watch out

- Partial does not remove null from properties; if a property is string | null, it becomes (string | null) | undefined.
- Required only removes the optional modifier; it does not remove null from values.

## Remember

- Partial<T> makes all properties on T optional (adds ? to every key).
- Required<T> makes all properties on T mandatory (removes ? from every key).
- Both utilities are shallow and operate on top-level properties.
