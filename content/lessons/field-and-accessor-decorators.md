---
slug: field-and-accessor-decorators
title: "Field & Accessor Decorators"
topic: advanced-patterns
kind: technique
summary: "Decorate class fields and auto-accessors to intercept property reads, writes, and initial values."
tags: [decorators, fields, accessors]
related: [standard-decorators-overview, class-and-method-decorators, standard-versus-legacy-decorators]
---
> **In one line:** Use field and accessor decorators to intercept property initializations, reads, and writes.

## The idea

Beyond methods and classes, standard ECMAScript decorators support field decorators and auto-accessor decorators.

A field decorator is applied directly to a class property declaration. A field decorator can return an initializer function that modifies the initial value assigned to the field when an instance is constructed.

JavaScript also introduced auto-accessors using the `accessor` keyword: `accessor count = 0`. An auto-accessor automatically generates an underlying private storage slot with implicit `get` and `set` methods. An accessor decorator can intercept and replace both the getter and setter, allowing validation, data-binding, and reactive change observation.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Auto-accessor decorator that validates incoming values:
function positiveOnly(
  target: ClassAccessorDecoratorTarget<any, number>,
  context: ClassAccessorDecoratorContext
): ClassAccessorDecoratorResult<any, number> {
  return {
    get() {
      return target.get.call(this);
    },
    set(value: number) {
      if (value < 0) throw new Error('Value must be positive!');
      target.set.call(this, value);
    }
  };
}

class InventoryItem {
  @positiveOnly
  accessor quantity: number = 10;
}

const item = new InventoryItem();
console.log(item.quantity); // 10
item.quantity = 25;         // Valid
// item.quantity = -5;      // Runtime Error: Value must be positive!
```

> **Tip:** Auto-accessors (`accessor prop: T`) are supported in TypeScript 4.9+ and provide the ideal hook for reactive state libraries.

## Go deeper

Comparing field decorators and auto-accessor decorators:

| Feature | Field Decorator (`@dec prop: T`) | Auto-accessor (`@dec accessor prop: T`) |
|---|---|---|
| Intercepts initial value | Yes (returns initializer) | Yes (returns initializer) |
| Intercepts subsequent reads | No | Yes (custom `get` method) |
| Intercepts subsequent writes | No | Yes (custom `set` method) |
| Requires `accessor` keyword | No | Yes |

## Watch out

- Standard field decorators cannot intercept subsequent property reads or writes; use accessor for that.
- Remember that auto-accessors require ES2022 target or higher for native private field support.

## Remember

- Field decorators return initializer functions to transform initial field values.
- Auto-accessors (accessor prop) generate implicit getters and setters.
- Accessor decorators can intercept and validate all property reads and writes.
