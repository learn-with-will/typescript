---
id: lesson-23
slug: decorators
title: "Decorators"
level: advanced
order: 23
duration: 30
tags:
  - decorators
  - classes
  - metadata
  - ecmascript
  - experimental-decorators
---

# Learning Objectives

By the end of this lesson you will be able to:

- Explain what a decorator is and what it can decorate.
- Write a standard method decorator using the `(value, context)` shape.
- Understand the `context` object and `addInitializer`.
- Distinguish standard decorators from the legacy `experimentalDecorators`.

# Why It Matters

Decorators let you attach reusable behavior — logging, validation, memoization, registration — to classes and their members with a single `@name` annotation. Frameworks like Angular and NestJS are built around them. TypeScript 5.0 adopted the **standard ECMAScript decorators**, so they now work with no special flag and follow the same rules browsers are standardizing. Knowing the modern shape (and how it differs from the older experimental one) keeps your code aligned with where the language is going.

# Concept Explanation

### What a decorator is

A **decorator** is a function you attach with `@` to a class or a class member. It runs when the class is defined and can observe or replace what it decorates:

```typescript
@registered
class Service {
  @logged
  run() { /* ... */ }
}
```

Standard decorators (TypeScript 5.0+) can decorate **classes, methods, getters, setters, fields, and auto-accessors**. (Parameter decorators are *not* part of the standard set — they exist only in the legacy mode described later.)

### The `(value, context)` shape

Every standard decorator is a function taking two arguments: the **value** being decorated and a **context** object describing it. What `value` is depends on the target — for a method it's the function; for a class it's the constructor.

A method decorator that logs each call:

```typescript
function logged<This, Args extends unknown[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
) {
  const name = String(context.name);
  return function (this: This, ...args: Args): Return {
    console.log(`→ ${name}(${args.join(', ')})`);
    const result = target.call(this, ...args);
    console.log(`← ${name}`);
    return result;
  };
}

class Calculator {
  @logged
  add(a: number, b: number): number {
    return a + b;
  }
}

new Calculator().add(2, 3);
// → add(2, 3)
// ← add
// returns 5
```

The decorator **returns a replacement** function; returning `void` leaves the method unchanged. The typed `context` (`ClassMethodDecoratorContext`) tells you it's a method and gives you its `name`.

### The context object

The `context` argument carries useful information and hooks. Common members:

- **`kind`** — what's being decorated (`'class'`, `'method'`, `'field'`, `'getter'`, `'setter'`, `'accessor'`).
- **`name`** — the member's name (a `string | symbol`).
- **`static`** / **`private`** — booleans describing the member.
- **`addInitializer(fn)`** — register code to run when the instance (or class) initializes — handy for binding methods or registering instances.

```typescript
function bound(target: unknown, context: ClassMethodDecoratorContext) {
  context.addInitializer(function (this: any) {
    this[context.name] = this[context.name].bind(this);
  });
}
```

### Class and field decorators

A **class decorator** receives the constructor and may return a replacement class:

```typescript
function sealed<T extends new (...args: any[]) => object>(
  value: T,
  _context: ClassDecoratorContext,
) {
  Object.seal(value);
  Object.seal(value.prototype);
  return value;
}
```

A **field decorator** receives `undefined` as its value and may return an initializer that transforms the field's initial value:

```typescript
function double(_value: undefined, _context: ClassFieldDecoratorContext) {
  return (initial: number) => initial * 2;
}

class Box {
  @double size = 5; // initialized to 10
}
```

### Standard vs legacy (`experimentalDecorators`)

Before the standard existed, TypeScript shipped an **experimental** decorator implementation (a different, earlier proposal). It requires the **`experimentalDecorators`** compiler option and has a *different* function signature (e.g. method decorators receive `target, propertyKey, descriptor`). It also supports **parameter decorators** and pairs with **`emitDecoratorMetadata`** plus the `reflect-metadata` library — a combination many established frameworks (Angular, NestJS, TypeORM) still rely on.

Key distinctions:

- **Standard decorators** (TS 5.0+): no flag needed, `(value, context)` shape, no parameter decorators, aligned with the ECMAScript proposal.
- **Legacy decorators**: require `experimentalDecorators`, older `(target, key, descriptor)` shape, support parameter decorators and `emitDecoratorMetadata`.

For new code not tied to a framework that mandates the legacy form, prefer the **standard** decorators. If you work in Angular/NestJS/TypeORM, follow that framework's guidance (usually legacy, for now).

# Key Terminology

- **Decorator** — a function attached with `@` that runs at class-definition time.
- **`(value, context)`** — the standard decorator signature.
- **Context object** — describes the decorated member (`kind`, `name`, `addInitializer`, …).
- **`addInitializer`** — registers code to run during initialization.
- **`experimentalDecorators`** — the compiler option enabling the older, legacy decorators.
- **`emitDecoratorMetadata`** — legacy-only option emitting type metadata for `reflect-metadata`.

# Syntax and Options

| Target | Value argument | Context type |
| ------ | -------------- | ------------ |
| Class | the constructor | `ClassDecoratorContext` |
| Method | the function | `ClassMethodDecoratorContext` |
| Getter/Setter | the accessor fn | `ClassGetter/SetterDecoratorContext` |
| Field | `undefined` | `ClassFieldDecoratorContext` |
| Auto-accessor | `{ get, set }` | `ClassAccessorDecoratorContext` |

# Hands-On Walkthrough

Write a memoization decorator for a method:

```typescript
function memoized<This, Arg, Return>(
  target: (this: This, arg: Arg) => Return,
  _context: ClassMethodDecoratorContext,
) {
  const cache = new Map<Arg, Return>();
  return function (this: This, arg: Arg): Return {
    if (cache.has(arg)) return cache.get(arg)!;
    const result = target.call(this, arg);
    cache.set(arg, result);
    return result;
  };
}

class Fib {
  @memoized
  compute(n: number): number {
    return n < 2 ? n : this.compute(n - 1) + this.compute(n - 2);
  }
}

const f = new Fib();
console.log(f.compute(10)); // 55, with results cached
```

The decorator wraps the original method with a cache, all triggered by a single `@memoized`.

# Real World Analogy

A decorator is a **gift-wrapping station** for a function. You hand over the plain gift (the method), and the station wraps it — adding a bow (logging), a "fragile" sticker (validation), or a receipt (a cache) — then hands back the wrapped version everyone receives. The `@` is you dropping the gift at the station; the `context` is the label saying what kind of gift it is and where it belongs.

# Examples

## Example 1 — Basic: a class decorator that registers

```typescript
const registry: Function[] = [];

function register<T extends new (...args: any[]) => object>(
  value: T,
  _context: ClassDecoratorContext,
) {
  registry.push(value);
  return value;
}

@register
class PluginA {}

@register
class PluginB {}

// registry now holds both classes
```

**Why this works:** the class decorator runs when each class is defined, receiving the constructor. Pushing it into a shared `registry` collects the classes automatically — a common plugin/registration pattern.

## Example 2 — Real-world: bind a method with `addInitializer`

```typescript
function autobind(_value: unknown, context: ClassMethodDecoratorContext) {
  context.addInitializer(function (this: any) {
    this[context.name] = this[context.name].bind(this);
  });
}

class Button {
  label = 'Save';

  @autobind
  onClick() {
    return `Clicked ${this.label}`;
  }
}

const b = new Button();
const handler = b.onClick;
handler(); // "Clicked Save" — `this` stays bound
```

**Why this works:** `addInitializer` runs per instance during construction, rebinding the method to `this`. This solves the classic "lost `this` when passing a method as a callback" problem declaratively.

## Example 3 — Best practice / edge case: choosing standard vs legacy

```json
// Standard decorators (TypeScript 5.0+): nothing special needed.
{ "compilerOptions": { "target": "ES2022" } }

// Legacy decorators (frameworks that require them):
{ "compilerOptions": { "experimentalDecorators": true, "emitDecoratorMetadata": true } }
```

**Why this works:** the two decorator systems are enabled differently and have different signatures. New standalone code uses the standard form with no flag; framework code that depends on parameter decorators and metadata turns on `experimentalDecorators`. Don't mix expectations between the two.

# Common Mistakes

- **Using the old signature with standard decorators.** Standard decorators are `(value, context)`, not `(target, key, descriptor)` — that older shape is legacy-only.
- **Expecting parameter decorators to work by default.** They exist only in the legacy (`experimentalDecorators`) mode.
- **Forgetting to return the replacement.** A method/class decorator that transforms behavior must *return* the new function/class.
- **Assuming metadata is automatic.** `emitDecoratorMetadata` + `reflect-metadata` is a legacy-mode feature, not part of standard decorators.

# Best Practices

- Prefer **standard decorators** (TS 5.0+) for new, framework-agnostic code — no flag required.
- Use the typed **context** (`ClassMethodDecoratorContext`, etc.) and **`addInitializer`** for per-instance setup.
- Keep decorators **small and focused** (logging, binding, caching, registration).
- When a framework mandates **legacy decorators**, follow its configuration rather than mixing systems.

# Summary

- A **decorator** is a `@`-attached function that runs at definition time and can observe or replace its target.
- **Standard decorators** (TypeScript 5.0) use the `(value, context)` shape and decorate classes, methods, accessors, and fields — no flag needed.
- The **context** object exposes `kind`, `name`, and `addInitializer` for setup work.
- **Legacy decorators** require `experimentalDecorators`, use an older signature, and add parameter decorators and `emitDecoratorMetadata` — still used by some frameworks.

# Flash Cards

Q: What is the standard decorator function signature in TypeScript 5.0+?
A: `(value, context)` — the decorated value plus a context object describing it.

Q: Do standard decorators require a compiler flag?
A: No — standard ECMAScript decorators work out of the box in TypeScript 5.0+; the legacy ones require `experimentalDecorators`.

Q: What can standard decorators decorate?
A: Classes, methods, getters, setters, fields, and auto-accessors — but not parameters (those are legacy-only).

Q: What does `context.addInitializer` do?
A: Registers a function to run during instance (or class) initialization — useful for binding methods or registering instances.

Q: How do legacy decorators differ from standard ones?
A: They need `experimentalDecorators`, use the older `(target, key, descriptor)` shape, support parameter decorators, and can emit metadata with `emitDecoratorMetadata`.

Q: If a method decorator should change behavior, what must it do?
A: Return a replacement function; returning nothing leaves the original method unchanged.

# Exercises

### Easy
Write a standard method decorator `@timed` that logs how long the method took (`performance.now()` before/after) and returns the original result.

### Medium
Write a class decorator `@singleton` that ensures only one instance is created (cache it and return the cached one on subsequent `new` calls, by returning a replacement class).

### Challenging
Explain, with two small `tsconfig` snippets, when you'd enable `experimentalDecorators` and what changes about the decorator signature compared to the standard form. Give one framework that requires the legacy mode.

# Further Reading

- [Announcing TypeScript 5.0 — Decorators](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#decorators)
- [Handbook — Decorators (legacy) & `experimentalDecorators`](https://www.typescriptlang.org/docs/handbook/decorators.html)
- [tsconfig — `experimentalDecorators`](https://www.typescriptlang.org/tsconfig/#experimentalDecorators)
