---
slug: parameter-properties
title: "Parameter Properties"
topic: classes-and-enums
kind: technique
summary: "Declare and initialize class member fields in a single line using constructor parameter property shorthand."
tags: [classes, constructors, shorthand]
related: [class-member-visibility, readonly-and-getters-setters, class-inheritance-and-implements]
---
> **In one line:** Prefix constructor arguments with visibility modifiers to declare and assign fields automatically.

## The idea

In standard JavaScript class declarations, initializing class fields requires repetitive boilerplate: you declare the field, add it as a constructor parameter, and write `this.field = field` inside the constructor body.

TypeScript offers a concise shorthand called parameter properties. By prefixing a constructor parameter with a visibility modifier (`public`, `protected`, `private`) or `readonly`, TypeScript automatically does three things at once:
1. Declares a member field on the class with that name and type.
2. Accepts the argument in the constructor.
3. Emits code to assign `this.paramName = paramName` when the constructor executes.

This shorthand drastically reduces boilerplate, particularly in dependency injection patterns where services receive multiple dependencies in their constructor.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Traditional boilerplate vs Parameter Property shorthand:

// Before: Verbose traditional declaration
class VerboseUser {
  public id: string;
  public email: string;
  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }
}

// After: Idiomatic Parameter Properties
class CleanUser {
  constructor(
    public readonly id: string,
    public email: string,
    private apiKey: string
  ) {}
}

const user = new CleanUser('u-1', 'alice@test.com', 'secret_xyz');
console.log(user.id, user.email);
```

> **Tip:** Parameter properties can combine visibility modifiers with `readonly`: `private readonly logger: Logger`.

## Go deeper

Comparing traditional field declarations and parameter properties:

| Syntax Style | Lines of Code | Constructor Body Needed? | Cleanliness |
|---|---|---|---|
| Traditional Field Declaration | 8–12 lines | Yes (`this.x = x`) | Verbose |
| Parameter Property | 3–5 lines | No (empty body `{}`) | Highly concise |
| Dependency Injection | 1 line per service | No manual assignments | Industry standard in Angular / NestJS |

## Watch out

- You must include a modifier (public, private, protected, or readonly); a bare parameter is just an ordinary argument.
- Some code formatters or ESLint configs flag parameter properties; check your team’s style guidelines.

## Remember

- Prefix constructor parameters with modifiers to declare and assign fields automatically.
- Parameter properties combine field declaration, parameter typing, and assignment in one place.
- Widely used in Angular, NestJS, and enterprise backend architectures.
