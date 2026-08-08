---
id: lesson-17
slug: keyof-typeof-and-indexed-access-types
title: "keyof, typeof, and Indexed Access Types"
level: advanced
order: 17
duration: 28
tags:
  - keyof
  - typeof
  - indexed-access
  - lookup-types
  - type-queries
---

# Learning Objectives

By the end of this lesson you will be able to:

- Get the union of an object type's keys with `keyof`.
- Capture the type of a value with the `typeof` **type query**.
- Look up a property's type with an **indexed access type** `T[K]`.
- Combine them to derive types instead of writing them by hand.

# Why It Matters

The advanced type features — conditional types, mapped types, the utility types you just met — are all built from three small operators: `keyof`, `typeof`, and indexed access. They let you *query* existing types rather than restating them, which keeps everything in sync with a single source of truth. Master these three and the rest of the type-level toolkit falls into place.

# Concept Explanation

### `keyof` — the keys of a type

`keyof T` produces a **union of the property names** of `T`:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKey = keyof User; // 'id' | 'name' | 'email'
```

`keyof` is what makes generic property access safe:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

Here `K extends keyof T` guarantees `key` is a real key, and `T[K]` (next section) gives the exact value type.

### `typeof` — the type of a value (type query)

You've used `typeof` at runtime (`typeof x === 'string'`). In a **type position**, `typeof` means something different: it gives you the **static type of a value**:

```typescript
const config = {
  host: 'localhost',
  port: 8080,
  secure: false,
};

type Config = typeof config;
// { host: string; port: number; secure: boolean }
```

This is invaluable when a value is the source of truth and you want its type without writing it twice. Combine it with `keyof`:

```typescript
type ConfigKey = keyof typeof config; // 'host' | 'port' | 'secure'
```

Read that inside-out: `typeof config` is the type, and `keyof` takes its keys.

### Indexed access types — `T[K]`

An **indexed access type** looks up the type of a property by key, using the same bracket syntax you'd use on a value — but at the type level:

```typescript
type Name = User['name'];        // string
type IdOrEmail = User['id' | 'email']; // number | string
type AllValues = User[keyof User];     // number | string
```

`User['name']` is "the type of the `name` property." Pass a union of keys and you get a union of their value types. `User[keyof User]` gives every value type in the object.

Indexed access also works on arrays and tuples. `T[number]` is "the element type of the array":

```typescript
const roles = ['admin', 'editor', 'viewer'] as const;
type Role = (typeof roles)[number]; // 'admin' | 'editor' | 'viewer'
```

That last line is the idiomatic way to turn a `readonly` array of literals into a union — `typeof roles` gets the tuple type, and `[number]` reads out its element types.

### Putting them together

These three compose into powerful one-liners:

```typescript
const routes = {
  home: '/',
  about: '/about',
  contact: '/contact',
} as const;

type RouteName = keyof typeof routes;        // 'home' | 'about' | 'contact'
type RoutePath = (typeof routes)[RouteName]; // '/' | '/about' | '/contact'
```

Everything derives from the `routes` object. Add a route and both types update automatically.

# Key Terminology

- **`keyof T`** — the union of `T`'s property names.
- **`typeof value` (type query)** — the static type of a value, used in a type position.
- **Indexed access type (`T[K]`)** — the type of `T`'s property/properties at key(s) `K`.
- **`T[number]`** — the element type of an array/tuple `T`.
- **Type query** — reading a type from a value (`typeof`) rather than declaring it.

# Syntax and Options

| Operator | Example | Result |
| -------- | ------- | ------ |
| `keyof` | `keyof User` | `'id' \| 'name' \| 'email'` |
| `typeof` (type) | `typeof config` | the type of `config` |
| `keyof typeof` | `keyof typeof config` | keys of the value's type |
| Indexed access | `User['name']` | `string` |
| Union index | `User['id' \| 'name']` | `number \| string` |
| All values | `User[keyof User]` | union of all value types |
| Array element | `T[number]` | element type of `T` |

# Hands-On Walkthrough

Derive types from a single configuration object:

```typescript
const theme = {
  colors: { primary: '#3178C6', danger: '#D9534F' },
  spacing: [4, 8, 16, 32],
} as const;

type Theme = typeof theme;
type ColorName = keyof typeof theme.colors;      // 'primary' | 'danger'
type ColorValue = (typeof theme.colors)[ColorName]; // '#3178C6' | '#D9534F'
type Spacing = (typeof theme.spacing)[number];   // 4 | 8 | 16 | 32

function color(name: ColorName): ColorValue {
  return theme.colors[name];
}

color('primary'); // '#3178C6'
// color('secondary'); // Error: not a color name
```

Every type here is derived from `theme`. Add a color and `ColorName`/`ColorValue` expand automatically — no type is written twice.

# Real World Analogy

These operators are a **table of contents generator**. `typeof` scans the book (the value) and produces its structure (the type). `keyof` lists the chapter titles (the keys). Indexed access is looking up "what's in the chapter called *Methods*?" (`T['methods']`). Instead of hand-writing an index that drifts out of date, you generate it from the book itself.

# Examples

## Example 1 — Basic: safe property access

```typescript
function prop<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: 'Ada' };
prop(user, 'name'); // string
prop(user, 'id');   // number
prop(user, 'x');    // Error: 'x' is not a key of user
```

**Why this works:** `K extends keyof T` limits `key` to real keys, and the return type `T[K]` is the exact type of that property — `string` for `name`, `number` for `id`.

## Example 2 — Real-world: a union from a `const` array

```typescript
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
type HttpMethod = (typeof HTTP_METHODS)[number];
// 'GET' | 'POST' | 'PUT' | 'DELETE'

function request(method: HttpMethod, url: string) { /* ... */ }
request('GET', '/api');   // OK
// request('PATCH', '/');  // Error
```

**Why this works:** `typeof HTTP_METHODS` is the `readonly` tuple of literals, and `[number]` reads out its element types as a union. You maintain the list in one place (the array) and the type follows.

## Example 3 — Best practice / edge case: values of an object as a type

```typescript
const StatusCode = {
  OK: 200,
  NotFound: 404,
  ServerError: 500,
} as const;

type Code = (typeof StatusCode)[keyof typeof StatusCode]; // 200 | 404 | 500
```

**Why this works:** `keyof typeof StatusCode` is the key union, and indexing the type by that union yields all the *value* types — the numeric codes. This is the standard way to get "the allowed values" of a constant object.

# Common Mistakes

- **Confusing runtime and type `typeof`.** In an expression, `typeof x` is a runtime string; in a type position, it's the static type of `x`. Context decides.
- **Using `keyof` on a value.** `keyof` takes a *type*; for a value, write `keyof typeof value`.
- **Forgetting `as const`.** Without it, `['a','b']` is `string[]` and `[number]` gives `string`, not the literal union.
- **Expecting `T[K]` to work with an invalid key.** `T['missing']` is an error; the key must exist in `T`.

# Best Practices

- Derive types from a **single source of truth** (a `const` object/array) with `typeof` + `keyof` + indexed access.
- Constrain generic keys with **`K extends keyof T`** and return **`T[K]`** for safe, precise property access.
- Use **`(typeof arr)[number]`** to turn a `const` array of literals into a union.
- Reach for these operators before hand-writing a type that mirrors an existing value.

# Summary

- **`keyof T`** is the union of `T`'s keys.
- **`typeof value`** (in a type position) is the static type of a value.
- **Indexed access `T[K]`** looks up property types; `T[keyof T]` gives all value types; `T[number]` gives an array's element type.
- Composed, they let you **derive** types from values instead of duplicating them.

# Flash Cards

Q: What does `keyof T` produce?
A: A union of `T`'s property names (keys).

Q: What does `typeof value` mean in a type position (versus an expression)?
A: In a type position it's the static type of the value; in an expression it's the runtime type string like `'string'`.

Q: How do you get the type of the `name` property of `User`?
A: An indexed access type: `User['name']`.

Q: How do you turn `const roles = ['a','b'] as const` into the union `'a' | 'b'`?
A: `(typeof roles)[number]` — take the value's type, then index by `number` for the element types.

Q: Why is it `keyof typeof config` rather than `keyof config` for a value `config`?
A: `keyof` needs a type; `typeof config` converts the value to its type first, then `keyof` takes its keys.

Q: What does `User[keyof User]` give you?
A: A union of all the value types in `User`.

# Exercises

### Easy
Given `interface Point { x: number; y: number }`, write the types `keyof Point` and `Point['x']` and state what each equals.

### Medium
Create a `const` object `icons = { home: '🏠', search: '🔎' } as const` and derive `IconName = keyof typeof icons` and `IconGlyph = (typeof icons)[IconName]`. Write a function `icon(name: IconName): IconGlyph`.

### Challenging
Given `const sizes = [8, 16, 24] as const`, derive a `Size` union with `(typeof sizes)[number]`. Then write `getProperty<T, K extends keyof T>(obj, key): T[K]` and explain how `keyof` and `T[K]` cooperate to keep it type-safe.

# Further Reading

- [Handbook — `keyof` Type Operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [Handbook — `typeof` Type Operator](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html)
- [Handbook — Indexed Access Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
