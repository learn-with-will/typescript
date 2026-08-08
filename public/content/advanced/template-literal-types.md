---
id: lesson-20
slug: template-literal-types
title: "Template Literal Types"
level: advanced
order: 20
duration: 26
tags:
  - template-literal-types
  - string-types
  - intrinsic-types
  - unions
  - key-remapping
---

# Learning Objectives

By the end of this lesson you will be able to:

- Build string literal types with template syntax.
- Combine unions inside a template to produce every combination.
- Use the intrinsic `Uppercase`, `Lowercase`, `Capitalize`, and `Uncapitalize` types.
- Apply template literal types to key remapping.
- Extract parts of a string type with `infer`.

# Why It Matters

Strings carry a lot of structure — event names like `onClick`, CSS values like `10px`, routes like `/users/:id`. **Template literal types** let the type system understand that structure, so you can require a string that *matches a pattern* rather than just any string. Combined with mapped types, they generate precise, self-updating string types for APIs, event handlers, and design tokens.

# Concept Explanation

### The basic form

A **template literal type** looks like a JavaScript template string, but in a type position, and its `${…}` slots hold *types*:

```typescript
type Greeting = `Hello, ${string}`;

const a: Greeting = 'Hello, Ada'; // OK
const b: Greeting = 'Hi there';   // Error: doesn't match the pattern
```

`` `Hello, ${string}` `` is the type of every string that starts with `"Hello, "` followed by any string.

You can interpolate literal unions and other literal types:

```typescript
type Axis = 'x' | 'y';
type Translate = `translate${Uppercase<Axis>}`; // 'translateX' | 'translateY'
```

### Combining unions — the cross product

When you put a **union** in a slot, the template expands to **every combination**:

```typescript
type Size = 'small' | 'large';
type Color = 'red' | 'blue';

type Variant = `${Size}-${Color}`;
// 'small-red' | 'small-blue' | 'large-red' | 'large-blue'
```

Two unions of two members produce four literal types. This is a compact way to describe every valid combination of a structured string.

### Intrinsic string manipulation types

TypeScript ships four built-in types that transform string *types* (not values):

```typescript
type A = Uppercase<'hello'>;    // 'HELLO'
type B = Lowercase<'HELLO'>;    // 'hello'
type C = Capitalize<'hello'>;   // 'Hello'
type D = Uncapitalize<'Hello'>; // 'hello'
```

These are compiler intrinsics — they only exist at the type level. They're most useful inside templates, especially for generating property names.

### Key remapping with templates

Template literal types shine in mapped-type key remapping (from the previous lesson). Here's the classic "event handlers" pattern:

```typescript
type Events = {
  click: MouseEvent;
  focus: FocusEvent;
};

type Handlers = {
  [K in keyof Events as `on${Capitalize<string & K>}`]: (e: Events[K]) => void;
};
// { onClick: (e: MouseEvent) => void; onFocus: (e: FocusEvent) => void }
```

Each key is transformed into `on` + its capitalized name, and the value into a handler function.

### Extracting parts with `infer`

Template literal types can also **match and extract** using `infer` inside a conditional type — useful for parsing structured strings at the type level:

```typescript
type PrefixOf<S> = S extends `${infer P}-${string}` ? P : never;

type A = PrefixOf<'small-red'>; // 'small'
type B = PrefixOf<'large-blue'>; // 'large'
```

`` `${infer P}-${string}` `` matches "some text, a dash, then the rest," capturing the part before the dash as `P`. This lets types understand formats like `"key-value"` or route patterns.

# Key Terminology

- **Template literal type** — a type built from a string template with type slots.
- **Cross product** — the set of all combinations produced by unions in a template.
- **Intrinsic string type** — the built-in `Uppercase`/`Lowercase`/`Capitalize`/`Uncapitalize`.
- **Key remapping with templates** — renaming mapped-type keys via a template.
- **Template `infer`** — extracting a substring type inside a conditional.

# Syntax and Options

| Pattern | Result |
| ------- | ------ |
| `` `Hello, ${string}` `` | Any string with that prefix |
| `` `${'a' \| 'b'}-${'x' \| 'y'}` `` | Cross product of the unions |
| `Uppercase<'a'>` | `'A'` |
| `Capitalize<'name'>` | `'Name'` |
| `` `on${Capitalize<string & K>}` `` | Event-handler key name |
| `` S extends `${infer P}-${string}` `` | Extract the prefix `P` |

# Hands-On Walkthrough

Model a small set of typed CSS-like values and derived keys:

```typescript
// A structured value type:
type Unit = 'px' | 'rem' | '%';
type Length = `${number}${Unit}`;

const w1: Length = '10px';  // OK
const w2: Length = '1.5rem'; // OK
// const w3: Length = '10';  // Error: missing unit

// Generated setter names via key remapping:
interface Box { width: number; height: number; }
type Setters = {
  [K in keyof Box as `set${Capitalize<string & K>}`]: (value: Box[K]) => void;
};
// { setWidth: (value: number) => void; setHeight: (value: number) => void }
```

`Length` accepts only number-plus-unit strings, and `Setters` generates method names from the `Box` keys automatically.

# Real World Analogy

Template literal types are a **mail-merge template for types**. You write a pattern with blanks — "Dear `${name}`, your `${item}` shipped" — and the type system fills the blanks from your unions, producing every valid letter. The intrinsic types are the **formatting rules** (capitalize the first name, uppercase the country code) applied automatically as the merge runs.

# Examples

## Example 1 — Basic: constrain a string's shape

```typescript
type HexColor = `#${string}`;

const ok: HexColor = '#3178C6'; // OK
// const bad: HexColor = '3178C6'; // Error: must start with '#'
```

**Why this works:** the template requires the string to begin with `#`, so any value missing it is rejected at compile time — a cheap way to encode a simple format rule in the type.

## Example 2 — Real-world: typed event names

```typescript
type Entity = 'user' | 'order';
type Action = 'created' | 'updated' | 'deleted';

type EventName = `${Entity}.${Action}`;
// 'user.created' | 'user.updated' | 'user.deleted' | 'order.created' | ...

function emit(event: EventName): void { /* ... */ }
emit('user.created');   // OK
// emit('user.archived'); // Error: not a valid event name
```

**Why this works:** the cross product of `Entity` and `Action` enumerates exactly the valid `"entity.action"` event names, so typos and unsupported combinations are compile errors.

## Example 3 — Best practice / edge case: parse a string type with `infer`

```typescript
type Split<S> = S extends `${infer Head}.${infer Tail}`
  ? [Head, Tail]
  : [S];

type A = Split<'user.created'>; // ['user', 'created']
type B = Split<'plain'>;        // ['plain']
```

**Why this works:** the template `` `${infer Head}.${infer Tail}` `` matches a string with a dot and captures the parts on either side. This lets types decompose structured strings — the foundation of typed routers and parsers.

# Common Mistakes

- **Expecting intrinsics to run at runtime.** `Uppercase<T>` transforms a *type*; to uppercase a value use `String.prototype.toUpperCase`.
- **Union explosion.** Combining several large unions in a template multiplies out — the result can become huge; keep the unions small.
- **Forgetting `string & K`.** In key remapping, keys can be `string | number | symbol`; intersect with `string` before using a string intrinsic.
- **Over-parsing.** Template `infer` parsing is powerful but can get unreadable; reach for it when the structure genuinely needs it.

# Best Practices

- Use template literal types to encode **string formats** (units, hex colors, event names) in the type.
- Combine small **unions** to enumerate valid combinations precisely.
- Pair templates with **key remapping** to generate handler/setter/getter names.
- Keep parsing with **`infer`** readable; prefer simple patterns.

# Summary

- **Template literal types** describe strings that match a pattern, with types in the `${…}` slots.
- Unions in a template produce the **cross product** of all combinations.
- The intrinsics **`Uppercase`/`Lowercase`/`Capitalize`/`Uncapitalize`** transform string types.
- Templates power **key remapping** in mapped types and can **extract** substrings with `infer`.

# Flash Cards

Q: What does the type `` `Hello, ${string}` `` describe?
A: Every string that begins with "Hello, " followed by any string.

Q: What does `` `${'a' | 'b'}-${'x' | 'y'}` `` evaluate to?
A: The cross product: `'a-x' | 'a-y' | 'b-x' | 'b-y'`.

Q: Name the four intrinsic string-manipulation types.
A: `Uppercase`, `Lowercase`, `Capitalize`, and `Uncapitalize`.

Q: How do template literal types help mapped types?
A: In key remapping (`as`), they generate new key names like `` `on${Capitalize<K>}` ``.

Q: How do you extract the part of a string type before a dot?
A: With template `infer` in a conditional: `` S extends `${infer P}.${string}` ? P : never ``.

Q: Do intrinsic string types work on runtime string values?
A: No — they operate on string *types* only; use `String.prototype` methods for runtime values.

# Exercises

### Easy
Write `type Route = `/${string}`` and test it with `'/home'` and `'home'`. Explain the error on the second.

### Medium
Given `type Size = 'sm' | 'md' | 'lg'` and `type Side = 'top' | 'bottom'`, produce `type Spacing = `${Side}-${Size}`` and list its members.

### Challenging
Write `type EventHandlers<T>` that maps each key `K` of `T` to `` `on${Capitalize<string & K>}` `` with value `(payload: T[K]) => void`, and apply it to `{ save: string; delete: number }`.

# Further Reading

- [Handbook — Template Literal Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
- [Handbook — Intrinsic String Manipulation Types](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#intrinsic-string-manipulation-types)
