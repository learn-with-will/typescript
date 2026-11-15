---
slug: interfaces-for-object-shapes
title: "Interfaces for Object Shapes"
topic: objects-and-shapes
kind: concept
summary: "Interfaces name object shapes, providing clean contracts, clear error messages, and support for declaration merging."
tags: [interfaces, contracts, objects]
related: [object-type-annotations, extending-interfaces, type-aliases-vs-interfaces]
---
> **In one line:** Use the interface keyword to name and enforce object shapes across your application.

## The idea

While anonymous object types are useful for one-off parameters, large applications need named, reusable contracts for their domain models. The primary construct for naming object structures in TypeScript is the `interface`.

Declaring an interface establishes a named contract that objects can conform to. Once defined, you can use the interface name anywhere a type annotation is accepted: variable declarations, function parameters, class implementations, and generic constraints.

Interfaces produce clean, readable error messages in your editor. When a property is missing or mistyped, TypeScript reports that the value does not conform to the named interface (e.g. `Type is not assignable to 'UserProfile'`) rather than displaying a massive anonymous object diff.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  createdYear: number;
}

function sendWelcomeEmail(profile: UserProfile): void {
  console.log(`Sending welcome email to ${profile.email}`);
}

const newMember: UserProfile = {
  id: 'usr-101',
  displayName: 'Alex Rivers',
  email: 'alex@example.com',
  createdYear: 2025
};

sendWelcomeEmail(newMember);
```

> **Tip:** Interfaces can be implemented by classes using the `implements` keyword to enforce architectural contracts.

## Go deeper

Key architectural capabilities unique to TypeScript interfaces:

| Interface Capability | What It Enables | Common Use Case |
|---|---|---|
| Reusable Naming | Clean type annotations and error messages | Core domain models |
| Class Implementation | `class C implements I` syntax | Object-oriented service layers |
| Declaration Merging | Augmenting existing interfaces across files | Extending third-party libraries |
| Inheritance | `interface Child extends Parent` | Progressive feature specialization |

## Watch out

- Interfaces can only describe object shapes, functions, and classes; they cannot alias primitives or unions.
- Do not prefix interface names with I (like IUser); modern TypeScript style prefers standard PascalCase.

## Remember

- Interfaces define named, reusable contracts for object structures.
- Named interfaces make compiler diagnostics clearer and more readable.
- Interfaces are the preferred construct for object-oriented designs and public library APIs.
