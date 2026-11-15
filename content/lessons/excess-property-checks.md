---
slug: excess-property-checks
title: "Excess Property Checks"
topic: objects-and-shapes
kind: pitfall
summary: "TypeScript performs excess property checks on fresh object literals to catch misspelled or unrecognized properties."
tags: [objects, excess-properties, structural-typing]
related: [object-type-annotations, interfaces-for-object-shapes, extending-interfaces]
---
> **In one line:** Direct object literals are checked strictly for unrecognized properties to catch typos.

## The idea

Because TypeScript uses structural typing, you might expect that passing an object with extra properties to a function is always permitted. After all, if the function requires properties `x` and `y`, an object containing `x`, `y`, and `z` has everything the function needs.

However, when you write an object literal directly in an assignment or function call, you are creating a "fresh" object. In this situation, specifying a property that the target type does not declare is almost certainly a bug, such as a misspelled property name (`colour` vs `color`).

To prevent these bugs, TypeScript applies excess property checks specifically to fresh object literals. If an object literal contains any property not listed in the target type, the compiler flags an error, preventing silent typos from passing through.

In production software engineering, understanding this mechanism provides crucial consistency across large teams and evolving software architectures. By establishing clear expectations at authoring time, TypeScript eliminates ambiguous assumptions between module authors and consumers. Rather than writing defensive runtime assertions throughout every function body, you rely on the compiler to verify contracts statically, reducing boilerplate while improving overall code maintainability and team velocity across distributed repositories.

## See it

```typescript
interface ButtonOptions {
  label: string;
  disabled?: boolean;
}

function createButton(opts: ButtonOptions): void {
  console.log(`Rendering button: ${opts.label}`);
}

// 1. Direct object literal triggers excess property check:
// createButton({ label: 'Save', disable: true }); // Error: 'disable' does not exist in type 'ButtonOptions'

// 2. Existing variable bypasses excess property check via structural typing:
const rawConfig = { label: 'Save', disable: true, theme: 'dark' };
createButton(rawConfig); // Compiles without error
```

> **Note:** Excess property checks only run on fresh object literals, not when assigning an already existing object variable.

## Go deeper

Demonstrating when excess property checks are applied:

| Expression Type | Example | Excess Property Check Applied? |
|---|---|---|
| Direct Object Literal | `fn({ label: 'Save', typo: 1 })` | Yes (compiler flags `typo`) |
| Existing Variable | `const x = { ... }; fn(x)` | No (standard structural compatibility) |
| Type Assertion | `fn({ ... } as ButtonOptions)` | No (assertion bypasses check) |

## Watch out

- Bypassing excess property checks using intermediate variables can mask genuine typos.
- Index signatures disable excess property checks because any property name is technically valid.

## Remember

- Fresh object literals undergo excess property checks to catch misspelled property names.
- Existing variables pass through standard structural typing rules where extra properties are allowed.
- Avoid casting with as Type to silence excess property errors; fix the property names instead.
