---
slug: readonly-and-getters-setters
title: "readonly and Getters/Setters"
topic: classes-and-enums
kind: technique
summary: "Use readonly properties for immutable fields and getters/setters for computed or validated property access."
tags: [classes, readonly, getters-setters]
related: [class-member-visibility, parameter-properties, class-inheritance-and-implements]
---
> **In one line:** Use readonly for immutable fields and get/set accessors to control property reads and writes.

## The idea

Managing mutable state is one of the most critical responsibilities in class design. TypeScript provides complementary mechanisms to control how fields are read and modified: `readonly` and accessors (`get` / `set`).

Marking a class field as `readonly` ensures that its value can only be assigned during declaration or inside the `constructor`. Any attempt to modify the field from outside or from other class methods triggers a compile-time error.

Accessors (`get` and `set` keywords) allow you to intercept property reads and writes with custom logic while presenting a standard property interface to consumers. In TypeScript, if a property has a `get` accessor without a corresponding `set` accessor, TypeScript automatically infers the property as `readonly`.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
class Circle {
  private _radius: number;
  constructor(radius: number) { this._radius = Math.max(0, radius); }

  get radius(): number { return this._radius; }
  set radius(value: number) {
    if (value < 0) throw new Error('Radius cannot be negative');
    this._radius = value;
  }

  get area(): number {
    return Math.PI * this._radius ** 2;
  }
}

const c = new Circle(10);
console.log(c.area.toFixed(2));
c.radius = 15;
// c.area = 100; // Error: Cannot assign to 'area' because it is a read-only property
```

> **Tip:** TypeScript automatically matches the return type of a getter with the parameter type of the setter.

## Go deeper

Comparing `readonly` fields and getter accessors:

| Feature | `readonly property: T` | `get property(): T` |
|---|---|---|
| Computation | Evaluated once at creation | Recomputed dynamically on each read |
| Memory Footprint | Stores value directly in instance | Runs accessor method |
| Syntax for Callers | `obj.prop` | `obj.prop` (transparent to caller) |
| Allows Mutation? | No | Only if explicit `set` provided |

## Watch out

- Getters that perform expensive calculations on every property read can cause performance bottlenecks.
- Compiling getters and setters requires ES5 or higher as your compiler target.

## Remember

- readonly class fields can only be set in the declaration or constructor.
- A property with a get accessor and no set accessor is automatically readonly.
- Accessors provide transparent property syntax while running custom logic.
