---
slug: class-inheritance-and-implements
title: "Inheritance and implements"
topic: classes-and-enums
kind: concept
summary: "Extend base classes using extends and enforce interface contracts on classes using the implements keyword."
tags: [classes, inheritance, implements]
related: [class-member-visibility, abstract-classes, parameter-properties]
---
> **In one line:** Use extends for class inheritance and implements to guarantee interface conformance.

## The idea

TypeScript brings together object-oriented class inheritance and structural interface contracts.

When one class inherits from another using `extends`, the subclass inherits all fields and methods from the superclass. Inside the subclass constructor, calling `super()` is mandatory before accessing `this`. Subclasses can override methods, and can call the parent implementation using `super.methodName()`.

Separately, a class can declare that it conforms to an interface using the `implements` keyword: `class UserRepo implements IRepository`. The `implements` clause acts as a static contract: the compiler verifies that the class implements all properties and methods declared in the interface, without adding any code to the class itself.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface Loggable {
  log(): void;
}

class BaseService {
  constructor(protected serviceName: string) {}
}

// Class inherits from BaseService and implements Loggable interface:
class AuthService extends BaseService implements Loggable {
  constructor() {
    super('Authentication Service'); // Call parent constructor
  }

  log(): void {
    console.log(`[SERVICE] Active: ${this.serviceName}`);
  }

  authenticate(token: string): boolean {
    return token.length > 0;
  }
}

const auth = new AuthService();
auth.log();
```

> **Note:** A class can only `extend` one base class (single inheritance), but can `implement` multiple interfaces separated by commas.

## Go deeper

Comparing `extends` and `implements` clauses on classes:

| Clause | Target | Inherits Code / Behavior? | Multiple Allowed? |
|---|---|---|---|
| `extends` | Another Class | Yes (inherits methods and fields) | No (single inheritance) |
| `implements` | One or more Interfaces | No (purely a type contract check) | Yes (`implements A, B, C`) |

## Watch out

- implements checks the class shape; it does not automatically add types or default implementations.
- Subclass constructor must call super() before accessing this or returning.

## Remember

- extends inherits behavior and fields from a single parent class.
- implements verifies that a class satisfies one or more interface contracts.
- Subclasses must call super() in constructors before using this.
