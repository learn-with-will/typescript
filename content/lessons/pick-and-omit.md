---
slug: pick-and-omit
title: "Pick and Omit"
topic: utility-and-lookup-types
kind: api
summary: "Construct new object shapes by picking a subset of properties with Pick<T, K> or dropping unwanted properties with Omit<T, K>."
tags: [utility-types, pick, omit]
related: [partial-and-required, readonly-and-record, keyof-type-operator]
---
> **In one line:** Use Pick<T, K> to select specific properties and Omit<T, K> to remove specific properties.

## The idea

In real applications, you frequently need variations of an existing object shape. For example, a `User` entity might contain twenty fields in the database, but a user card UI component only needs `id`, `name`, and `avatarUrl`. Conversely, creating a new user needs all fields except the auto-generated `id` and `createdAt`.

Rather than creating separate interfaces and duplicating properties, TypeScript provides `Pick<T, K>` and `Omit<T, K>`.

`Pick<T, K>` constructs a type by picking the set of properties `K` from `T`.
`Omit<T, K>` constructs a type by taking all properties from `T` and removing the specified keys `K`. Both utilities keep your types DRY and synchronized with domain models.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  passwordHash: string;
}

// 1. Pick only the public fields for display:
type UserCardProps = Pick<UserAccount, 'id' | 'name' | 'role'>;
const card: UserCardProps = { id: 'u1', name: 'Alice', role: 'admin' };

// 2. Omit sensitive or generated fields for registration input:
type RegisterUserInput = Omit<UserAccount, 'id' | 'passwordHash'>;
const input: RegisterUserInput = {
  name: 'Bob',
  email: 'bob@example.com',
  role: 'editor'
};
```

> **Tip:** `K` must be a valid key of `T` in `Pick<T, K>`, catching typos if you attempt to pick a nonexistent key.

## Go deeper

Comparing `Pick` and `Omit` selection strategies:

| Strategy | When to Prefer | Advantage |
|---|---|---|
| `Pick<T, K>` | Selecting a small subset of properties from a large object | Type safe: `K extends keyof T` enforced |
| `Omit<T, K>` | Keeping almost all properties except one or two | Minimal typing when dropping few keys |

## Watch out

- Omit does not strictly enforce that K is a key of T; misspelling an omitted key will not trigger a compiler error.
- Prefer Pick over Omit when defining public API contracts for greater resilience to added fields.

## Remember

- Pick<T, K> selects specific keys from an existing type.
- Omit<T, K> removes specific keys from an existing type.
- Use Pick and Omit to derive specialized shapes without duplicating field definitions.
