---
slug: declaring-this-in-functions
title: "Declaring this in Functions"
topic: functions
kind: technique
summary: "Declare the type of this as a fake first parameter to ensure safe execution contexts in callbacks and event handlers."
tags: [this, functions, context]
related: [typing-parameters-and-returns, function-overloads, construct-signatures]
---
> **In one line:** Type the execution context of a function using a fake first parameter named this.

## The idea

In JavaScript, the value of `this` inside a traditional function depends on how the function is invoked at runtime. When passed as a callback or event listener, `this` can easily become `undefined` or point to the global object, leading to subtle runtime bugs.

TypeScript allows you to explicitly declare the expected type of `this` inside a function body. You do this by adding a fake first parameter named `this` with a type annotation.

The `this` parameter is erased completely during compilation and does not count as a runtime parameter. When callers invoke the function, the compiler verifies that `this` points to the expected type.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface UiButton {
  label: string;
  click(this: UiButton): void;
}

const submitBtn: UiButton = {
  label: 'Submit Order',
  click(this: UiButton) {
    console.log(`Clicked button: ${this.label}`);
  }
};

submitBtn.click(); // Valid: 'this' is a UiButton

const detachedClick = submitBtn.click;
// detachedClick(); // Error: The 'this' context of type 'void' is not assignable
```

> **Note:** Arrow functions capture `this` lexically from their enclosing scope and do not accept a `this` parameter.

## Go deeper

Comparing `this` handling between standard functions and arrow functions:

| Feature | Standard Function with `this: T` | Arrow Function (`() => {}`) |
|---|---|---|
| `this` Binding | Dynamic (determined by call site) | Lexical (inherited from definition scope) |
| TypeScript Parameter | Fake first parameter `this: T` | Cannot declare `this` parameter |
| Runtime Code Emit | Parameter stripped completely | Standard arrow function |
| Best Used For | DOM handlers, mixins, fluent APIs | Class methods passed as callbacks |

## Watch out

- Never pass an argument for the fake this parameter at the call site.
- Arrow functions cannot declare a this parameter; they inherit this from their lexical scope.

## Remember

- Declare this: Type as a fake first parameter to type-check execution contexts.
- The this parameter is completely erased and does not affect runtime arguments.
- Arrow functions bind this lexically and do not support explicit this parameters.
