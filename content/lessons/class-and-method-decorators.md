---
slug: class-and-method-decorators
title: "Class and Method Decorators"
topic: advanced-patterns
kind: technique
summary: "Write class decorators to augment constructors and method decorators to wrap execution with logging, caching, or timing."
tags: [decorators, classes, methods]
related: [standard-decorators-overview, field-and-accessor-decorators, standard-versus-legacy-decorators]
---
> **In one line:** Use class decorators to wrap constructors and method decorators to intercept invocations.

## The idea

Method decorators and class decorators are the two most common decorator types in enterprise architecture.

A method decorator receives two arguments:
1. `target`: The method function being decorated.
2. `context`: A `ClassMethodDecoratorContext` object containing metadata like the method’s `name`, whether it is `private` or `static`, and an `addInitializer` callback.

By returning a replacement function from the method decorator, you can wrap method execution with logging, metrics, authentication checks, or caching.

A class decorator receives the class constructor and a `ClassDecoratorContext`. It can return a subclass constructor to augment instantiation behavior.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
// Method decorator that measures execution duration:
function timed<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext
) {
  return function (this: This, ...args: Args): Return {
    const start = performance.now();
    const result = target.call(this, ...args);
    const duration = performance.now() - start;
    console.log(`${String(context.name)} executed in ${duration.toFixed(2)}ms`);
    return result;
  };
}

class BenchmarkTask {
  @timed
  runComputation(iterations: number): number {
    let sum = 0;
    for (let i = 0; i < iterations; i++) sum += i;
    return sum;
  }
}

const task = new BenchmarkTask();
task.runComputation(100000);
```

> **Tip:** Use `context.addInitializer` to register methods or bind callbacks automatically when instances are constructed.

## Go deeper

Metadata available on `ClassMethodDecoratorContext`:

| Context Property | Type | Meaning |
|---|---|---|
| `name` | `string | symbol` | The name of the method being decorated |
| `kind` | `"method"` | Identifies this as a method decorator |
| `static` | `boolean` | Whether the method is a static class method |
| `private` | `boolean` | Whether the method is an ECMAScript `#private` method |
| `addInitializer` | `Function` | Callback to execute during instance construction |

## Watch out

- Method decorators must preserve the parameter types and return type of the wrapped method.
- Remember to preserve the this context using target.call(this, ...args).

## Remember

- Method decorators wrap, monitor, or replace class methods declaratively.
- The context object provides name, visibility, and lifecycle initializers.
- Always preserve this execution context when wrapping method implementations.
