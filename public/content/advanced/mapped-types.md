---
id: lesson-19
slug: mapped-types
title: "Mapped Types"
level: advanced
order: 19
duration: 30
tags:
  - mapped-types
  - key-remapping
  - modifiers
  - keyof
  - utility-types
---

# Learning Objectives

By the end of this lesson you will be able to:

- Build a new object type by mapping over the keys of another.
- Add or remove the `readonly` and optional (`?`) modifiers.
- Remap keys with the `as` clause.
- Filter out keys by remapping them to `never`.
- Recognize how the built-in utility types are defined.

# Why It Matters

A **mapped type** transforms every property of an object type at once — "make all of these optional," "make all of these `readonly`," "rename each of these." This is exactly how `Partial`, `Readonly`, `Pick`, and `Record` are built. Once you can write mapped types, you can create your own reusable transformations tailored to your domain, instead of hand-copying shapes.

# Concept Explanation

### The basic shape

A mapped type iterates over a union of keys (usually `keyof T`) and produces a property for each:

```typescript
type Clone<T> = {
  [K in keyof T]: T[K];
};

interface User { id: number; name: string; }
type UserClone = Clone<User>; // { id: number; name: string }
```

`[K in keyof T]` means "for each key `K` in `T`," and `T[K]` (indexed access) is that key's value type. On its own `Clone` just copies — the power comes from changing the value type or the modifiers.

### Transforming the value type

You can map each value to something new:

```typescript
type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

type NullableUser = Nullable<User>;
// { id: number | null; name: string | null }

type Getters<T> = {
  [K in keyof T]: () => T[K];
};
// each property becomes a function returning its original type
```

### Modifiers: `readonly` and `?`

Add `readonly` or `?` in front of the mapped property to apply it to every key — this is literally how `Readonly` and `Partial` work:

```typescript
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
type MyPartial<T> = { [K in keyof T]?: T[K] };
```

You can also **remove** a modifier with the `-` prefix (and explicitly add with `+`, though `+` is the default):

```typescript
type Mutable<T> = { -readonly [K in keyof T]: T[K] }; // strip readonly
type Concrete<T> = { [K in keyof T]-?: T[K] };        // strip optional (like Required)
```

`-readonly` and `-?` are how `Required` and "mutable" helpers are built — they take modifiers *off*.

### Key remapping with `as`

The `as` clause lets you **rename** each key as you map. Combine it with template literal types (next lesson) to build, say, getter names:

```typescript
type Prefixed<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Point { x: number; y: number; }
type PointGetters = Prefixed<Point>;
// { getX: () => number; getY: () => number }
```

### Filtering keys by remapping to `never`

If the `as` clause produces `never` for a key, that key is **dropped**. This lets a mapped type filter properties:

```typescript
type RemoveByType<T, V> = {
  [K in keyof T as T[K] extends V ? never : K]: T[K];
};

interface Mixed { id: number; name: string; active: boolean; }
type NoBooleans = RemoveByType<Mixed, boolean>;
// { id: number; name: string }  — the boolean property is removed
```

The `active` key maps to `never` because its type is `boolean`, so it disappears from the result.

### How the utility types are built

With mapped types (plus indexed access and conditionals) you can recognize the standard library definitions:

```typescript
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type MyRecord<K extends PropertyKey, V> = { [P in K]: V };
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };
```

They're not magic — they're mapped types you could have written yourself.

# Key Terminology

- **Mapped type** — a type that builds a new object type by iterating over keys.
- **`[K in keyof T]`** — the mapping clause: "for each key `K` of `T`."
- **Modifier** — `readonly` or `?`, applied per property; `+`/`-` adds/removes it.
- **Key remapping (`as`)** — renaming or filtering keys during the map.
- **Filtering by `never`** — remapping a key to `never` removes it.

# Syntax and Options

| Pattern | Effect |
| ------- | ------ |
| `{ [K in keyof T]: T[K] }` | Copy each property |
| `{ [K in keyof T]: NewType }` | Transform each value type |
| `{ readonly [K in keyof T]: T[K] }` | Make all `readonly` |
| `{ [K in keyof T]?: T[K] }` | Make all optional |
| `{ -readonly [K in keyof T]: T[K] }` | Remove `readonly` |
| `{ [K in keyof T]-?: T[K] }` | Remove optional |
| `{ [K in keyof T as NewK]: T[K] }` | Remap/rename keys |
| `as … extends … ? never : K` | Filter keys out |

# Hands-On Walkthrough

Build a few practical mapped types:

```typescript
interface Form {
  name: string;
  age: number;
  subscribed: boolean;
}

// 1. Every field becomes optional and nullable (a draft):
type Draft<T> = { [K in keyof T]?: T[K] | null };
type FormDraft = Draft<Form>;
// { name?: string | null; age?: number | null; subscribed?: boolean | null }

// 2. Event handlers named onName, onAge, ...
type Handlers<T> = {
  [K in keyof T as `on${Capitalize<string & K>}`]: (value: T[K]) => void;
};
type FormHandlers = Handlers<Form>;
// { onName: (v: string) => void; onAge: (v: number) => void; onSubscribed: (v: boolean) => void }

// 3. Keep only string-valued fields:
type StringFields<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};
type FormStrings = StringFields<Form>; // { name: string }
```

Each transformation is derived from `Form`; change `Form` and all three update.

# Real World Analogy

A mapped type is an **assembly line that reprocesses every item in a container**. It picks up each field (`[K in keyof T]`), and depending on the station either stamps it read-only, marks it optional, relabels it (`as`), or discards it (maps to `never`). You describe the transformation once, and it runs over every property automatically — no matter how many there are or how the source type changes.

# Examples

## Example 1 — Basic: make everything readonly

```typescript
type Freeze<T> = { readonly [K in keyof T]: T[K] };

interface Settings { theme: string; volume: number; }
type FrozenSettings = Freeze<Settings>;

const s: FrozenSettings = { theme: 'dark', volume: 5 };
// s.volume = 10; // Error: read-only
```

**Why this works:** the `readonly` modifier is applied to every mapped property, so the whole object type becomes read-only — exactly what the built-in `Readonly<T>` does.

## Example 2 — Real-world: rename keys into getters

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Account { balance: number; owner: string; }
type AccountApi = Getters<Account>;
// { getBalance: () => number; getOwner: () => string }
```

**Why this works:** the `as` clause remaps each key to a new name built with a template literal type and `Capitalize`, while the value type becomes a function returning the original type. One mapped type generates an entire accessor interface.

## Example 3 — Best practice / edge case: filter properties by value type

```typescript
type PickByType<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

interface Row { id: number; label: string; count: number; }
type Numbers = PickByType<Row, number>; // { id: number; count: number }
```

**Why this works:** each key is kept (`K`) only if its value type extends `V`; otherwise it's remapped to `never` and dropped. This produces a sub-shape containing just the number-valued fields — something `Pick` can't do by value.

# Common Mistakes

- **Forgetting `keyof`.** The mapping source is usually `keyof T` (or a key union `K`); mapping over the wrong thing produces an unexpected shape.
- **Misusing modifier signs.** `-readonly`/`-?` *remove* modifiers; a bare `readonly`/`?` *adds* them. Mixing them up flips the result.
- **Expecting `as` renames to work without a string key.** For template literal remaps you often need `string & K` to constrain the key to a string.
- **Rebuilding a utility that exists.** If `Partial`/`Readonly`/`Pick` already do it, use them.

# Best Practices

- Map over **`keyof T`** and transform the **value** (`T[K]`) or **modifiers** as needed.
- Use **`-readonly`/`-?`** to strip modifiers (the basis of `Required`/mutable helpers).
- Use the **`as` clause** to rename or **filter** keys (remap to `never` to drop).
- Prefer built-in utility types; write custom mapped types for domain-specific transforms.

# Summary

- A **mapped type** `{ [K in keyof T]: … }` builds a new object type from each key of `T`.
- Add or remove modifiers with `readonly`/`?` and the `+`/`-` prefixes.
- The **`as` clause** remaps keys — for renaming (with template literal types) or filtering (map to `never`).
- The standard utility types (`Partial`, `Readonly`, `Pick`, `Record`) are just mapped types.

# Flash Cards

Q: What does `{ [K in keyof T]: T[K] }` do?
A: It iterates over every key of `T` and copies each property — the basis of a mapped type.

Q: How do you make every property of `T` optional with a mapped type?
A: `{ [K in keyof T]?: T[K] }` — that's how `Partial<T>` is defined.

Q: What do the `-readonly` and `-?` modifiers do?
A: They *remove* the `readonly` and optional modifiers respectively (the basis of `Required` and mutable helpers).

Q: What does the `as` clause in a mapped type let you do?
A: Remap keys — rename them (often with template literal types) or filter them out by mapping to `never`.

Q: How does a mapped type drop a key?
A: By remapping it to `never` in the `as` clause, e.g. `as T[K] extends boolean ? never : K`.

Q: Are the built-in utility types like `Readonly` and `Pick` special compiler magic?
A: No — they're ordinary mapped types you could define yourself.

# Exercises

### Easy
Write `type Optional<T> = { [K in keyof T]?: T[K] }` and apply it to an interface. Confirm every property becomes optional.

### Medium
Write `type Mutable<T>` that removes `readonly` from every property, and test it on a `Readonly<...>` type.

### Challenging
Write `type Setters<T>` that maps each key `K` to a method named `set<Capitalized K>` taking `T[K]` and returning `void`, then apply it to `{ x: number; y: number }` and show the resulting type.

# Further Reading

- [Handbook — Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Handbook — Key Remapping via `as`](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as)
- [Handbook — Mapping Modifiers](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#mapping-modifiers)
