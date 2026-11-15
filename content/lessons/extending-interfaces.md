---
slug: extending-interfaces
title: "Extending Interfaces"
topic: objects-and-shapes
kind: technique
summary: "Compose and specialize object shapes hierarchically using the extends keyword to promote code reuse and modularity."
tags: [interfaces, inheritance, composition]
related: [interfaces-for-object-shapes, type-aliases-vs-interfaces, object-type-annotations]
---
> **In one line:** Use interface Child extends Parent to inherit and specialize existing object shapes.

## The idea

In complex applications, data models often share common fields. For instance, multiple database entities might share `id`, `createdAt`, and `updatedAt` fields, while user models might share basic contact information.

Duplicating these shared properties across dozens of interfaces is tedious and error-prone. If a shared field name or type changes, you must remember to update every interface manually.

TypeScript interfaces support inheritance using the `extends` keyword. An interface can extend one or more parent interfaces, inheriting all their properties while adding specialized properties of its own. This creates a clean hierarchy that mirrors domain relationships.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface BaseEntity {
  id: string;
  createdAt: Date;
}

interface AuditableEntity extends BaseEntity {
  updatedBy: string;
}

interface Article extends AuditableEntity {
  title: string;
  published: boolean;
}

const post: Article = {
  id: 'post-1',
  createdAt: new Date(),
  updatedBy: 'admin',
  title: 'Learning TypeScript Bites',
  published: true
};

console.log(post.title);
```

> **Tip:** An interface can extend multiple interfaces simultaneously using comma separation: `interface C extends A, B`.

## Go deeper

Comparing interface extension with type intersection:

| Feature | Interface Extension (`extends`) | Type Intersection (`&`) |
|---|---|---|
| Syntax | `interface B extends A {}` | `type B = A & {}` |
| Conflict Handling | Detects conflicting property types as compile errors | Merges conflicting types into `never` |
| Performance | Faster compiler caching | Slightly more work for compiler |
| Inheritance Type | True object subtyping | Set-theoretic intersection |

## Watch out

- Redeclaring a property with an incompatible type in a sub-interface causes a compiler error.
- Avoid creating excessively deep inheritance trees; favor shallow composition where possible.

## Remember

- Use extends to inherit properties from one or more parent interfaces.
- Extending interfaces eliminates duplication and creates clear domain hierarchies.
- TypeScript verifies that overridden properties remain compatible with parent types.
