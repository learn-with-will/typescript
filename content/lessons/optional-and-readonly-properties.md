---
slug: optional-and-readonly-properties
title: "Optional and readonly Properties"
topic: objects-and-shapes
kind: technique
summary: "Mark object properties with ? to denote optional fields or with readonly to prevent reassignment after initialization."
tags: [properties, optional, readonly]
related: [object-type-annotations, interfaces-for-object-shapes, index-signatures-for-lookups]
---
> **In one line:** Use ? for optional object fields and readonly to prevent property reassignment.

## The idea

Real-world objects often contain optional properties that may or may not be present, such as a user's middle name or phone number. Furthermore, certain properties should never be mutated after creation, such as database primary keys or configuration constants.

TypeScript addresses these needs with property modifiers. Adding a question mark (`?`) after a property name marks it as optional. Optional properties receive the type `T | undefined`, and code accessing them must verify their presence.

Prefixing a property with the `readonly` keyword prevents reassignment after initialization. The compiler flags any attempt to overwrite a readonly property. Note that `readonly` is a compile-time check; it emits no runtime freeze instructions, and nested objects remain mutable unless also marked readonly.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface DatabaseRecord {
  readonly id: string;           // Cannot be modified after creation
  readonly createdAt: Date;
  title: string;                 // Mutable
  description?: string;          // Optional (string | undefined)
}

const record: DatabaseRecord = {
  id: 'rec_4829',
  createdAt: new Date(),
  title: 'TypeScript Bite'
};

record.title = 'Updated Title'; // Valid
// record.id = 'rec_9999';       // Error: Cannot assign to 'id' because it is a read-only property
console.log(record.description?.toUpperCase()); // Safe optional chaining
```

> **Tip:** Use optional chaining (`?.`) when accessing optional properties to handle `undefined` safely without nested if statements.

## Go deeper

Comparing property modifiers and their compile-time behavior:

| Modifier | Syntax | Compile-time Behavior | Runtime Effect |
|---|---|---|---|
| Optional | `field?: string` | Permits omission, types as `string | undefined` | None (erased) |
| Readonly | `readonly field: string` | Forbids assignment after creation | None (erased) |
| Readonly Optional | `readonly field?: string` | Optional and immutable if provided | None (erased) |

## Watch out

- readonly is shallow; properties on nested objects can still be mutated unless marked readonly.
- Accessing an optional property without checking for undefined can lead to runtime TypeError crashes.

## Remember

- Use ? to mark properties that may be omitted by callers.
- Use readonly to prevent properties from being reassigned after creation.
- Modifiers are enforced entirely at compile time and add zero runtime overhead.
