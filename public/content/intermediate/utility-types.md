---
id: lesson-16
slug: utility-types
title: "Utility Types"
level: intermediate
order: 16
duration: 28
tags:
  - utility-types
  - partial
  - pick-omit
  - record
  - returntype
---

# Learning Objectives

By the end of this lesson you will be able to:

- Transform object types with `Partial`, `Required`, and `Readonly`.
- Select or drop properties with `Pick` and `Omit`.
- Build lookup types with `Record`.
- Filter unions with `Exclude`, `Extract`, and `NonNullable`.
- Pull types out of functions and promises with `ReturnType`, `Parameters`, and `Awaited`.

# Why It Matters

You rarely need to write a type from scratch when a related one already exists. TypeScript ships **utility types** — built-in generics that transform types — so you can derive "the same shape but everything optional," "just these two fields," or "the type this function returns." Deriving types keeps them in sync automatically: change the source and every derived type updates. These utilities are among the most-used tools in real TypeScript code.

# Concept Explanation

All of these are built into TypeScript's standard library; you use them like any generic. We'll use one running type:

```typescript
interface User {
  id: number;
  name: string;
  email?: string;
}
```

### `Partial<T>` and `Required<T>`

`Partial<T>` makes every property optional; `Required<T>` makes every property required:

```typescript
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string }

type RequiredUser = Required<User>;
// { id: number; name: string; email: string }  (email no longer optional)
```

`Partial` is perfect for update functions where the caller supplies only the fields to change.

### `Readonly<T>`

Makes every property `readonly`:

```typescript
type FrozenUser = Readonly<User>;
const u: FrozenUser = { id: 1, name: 'Ada' };
// u.name = 'X'; // Error: read-only
```

### `Pick<T, Keys>` and `Omit<T, Keys>`

`Pick` keeps only the named properties; `Omit` removes them:

```typescript
type Credentials = Pick<User, 'id' | 'email'>;
// { id: number; email?: string }

type PublicUser = Omit<User, 'email'>;
// { id: number; name: string }
```

These keep derived shapes tied to the source — add a field to `User` and `Omit<User, 'email'>` includes it automatically.

### `Record<Keys, Value>`

Builds an object type with the given keys, each of the given value type:

```typescript
type Roles = 'admin' | 'editor' | 'viewer';
type Permissions = Record<Roles, boolean>;
// { admin: boolean; editor: boolean; viewer: boolean }

const perms: Permissions = { admin: true, editor: true, viewer: false };
```

Because the keys are a literal union, the compiler requires an entry for **every** key — miss one and it errors.

### `Exclude<Union, Removed>` and `Extract<Union, Kept>`

Filter a **union** of types. `Exclude` removes members assignable to the second type; `Extract` keeps only those:

```typescript
type Status = 'idle' | 'loading' | 'success' | 'error';

type Settled = Exclude<Status, 'idle' | 'loading'>; // 'success' | 'error'
type Busy = Extract<Status, 'loading'>;             // 'loading'
```

### `NonNullable<T>`

Removes `null` and `undefined` from a type:

```typescript
type MaybeName = string | null | undefined;
type Name = NonNullable<MaybeName>; // string
```

### `ReturnType<F>` and `Parameters<F>`

Extract a function's return type or its parameter types (as a tuple):

```typescript
function makeUser(id: number, name: string): User {
  return { id, name };
}

type MakeUserReturn = ReturnType<typeof makeUser>;   // User
type MakeUserArgs = Parameters<typeof makeUser>;     // [number, string]
```

Note the `typeof makeUser` — you pass the *type* of the function, which you get with the `typeof` type query (covered next lesson).

### `Awaited<T>`

Unwraps the value a promise resolves to (including nested promises):

```typescript
type A = Awaited<Promise<string>>;          // string
type B = Awaited<Promise<Promise<number>>>; // number

async function load(): Promise<User> { /* ... */ return { id: 1, name: 'Ada' }; }
type Loaded = Awaited<ReturnType<typeof load>>; // User
```

`Awaited` is what makes `await` and async return types compose cleanly.

There are more (`ConstructorParameters`, `InstanceType`, `Uppercase`, and others), but the ones above cover the vast majority of everyday needs.

# Key Terminology

- **Utility type** — a built-in generic that transforms another type.
- **`Partial`/`Required`** — make all properties optional / required.
- **`Readonly`** — make all properties read-only.
- **`Pick`/`Omit`** — keep / drop named properties.
- **`Record`** — build an object type from a key union and a value type.
- **`Exclude`/`Extract`** — remove from / keep in a union.
- **`NonNullable`** — strip `null`/`undefined`.
- **`ReturnType`/`Parameters`/`Awaited`** — extract types from functions and promises.

# Syntax and Options

| Utility | Result |
| ------- | ------ |
| `Partial<T>` | All properties optional |
| `Required<T>` | All properties required |
| `Readonly<T>` | All properties read-only |
| `Pick<T, K>` | Only properties `K` |
| `Omit<T, K>` | All properties except `K` |
| `Record<K, V>` | `{ [P in K]: V }` |
| `Exclude<U, E>` | `U` minus members of `E` |
| `Extract<U, E>` | `U` members assignable to `E` |
| `NonNullable<T>` | `T` minus `null`/`undefined` |
| `ReturnType<F>` | A function's return type |
| `Parameters<F>` | A function's params as a tuple |
| `Awaited<T>` | The resolved value of a promise |

# Hands-On Walkthrough

Model an update endpoint using derived types:

```typescript
interface Article {
  id: number;
  title: string;
  body: string;
  published: boolean;
}

// The caller supplies the id plus any fields to change.
type ArticleUpdate = { id: number } & Partial<Omit<Article, 'id'>>;

function updateArticle(update: ArticleUpdate): void {
  // update.id is required; every other field is optional
}

updateArticle({ id: 1, title: 'New title' });        // OK
updateArticle({ id: 2, published: true });           // OK
updateArticle({ title: 'Missing id' });              // Error: id required
```

Every derived type here tracks `Article`: add a field and `ArticleUpdate` automatically allows updating it.

# Real World Analogy

Utility types are **kitchen appliances for types**. You have raw ingredients (an interface); `Partial` is a blender that softens every field to optional; `Pick`/`Omit` are a knife that keeps or trims specific parts; `Record` is a mold that stamps out one shape per label; `ReturnType`/`Awaited` are a juicer that extracts what's inside a function or a promise. You rarely cook a type from scratch when an appliance does it — and the result updates when you change the recipe.

# Examples

## Example 1 — Basic: `Partial` for updates

```typescript
interface Settings { theme: string; fontSize: number; }

function update(current: Settings, changes: Partial<Settings>): Settings {
  return { ...current, ...changes };
}

update({ theme: 'light', fontSize: 14 }, { fontSize: 16 });
```

**Why this works:** `Partial<Settings>` lets the caller pass only the fields they want to change, while the function fills the rest from `current`. The derived type stays in sync with `Settings`.

## Example 2 — Real-world: `Record` for an exhaustive map

```typescript
type Level = 'info' | 'warn' | 'error';

const colors: Record<Level, string> = {
  info: '#3178C6',
  warn: '#E0A800',
  error: '#D9534F',
};
```

**Why this works:** `Record<Level, string>` requires exactly one color per level. If you add `'debug'` to `Level` and forget to add a color, the object literal fails to compile — the type keeps your map complete.

## Example 3 — Best practice / edge case: derive from a function instead of restating

```typescript
async function fetchUser(id: number): Promise<{ id: number; name: string }> {
  return { id, name: 'Ada' };
}

type User = Awaited<ReturnType<typeof fetchUser>>; // { id: number; name: string }

function cache(user: User): void { /* ... */ }
```

**Why this works:** instead of writing the user shape twice, `Awaited<ReturnType<typeof fetchUser>>` derives it from the source of truth. Change `fetchUser`'s return type and `User` follows automatically — no drift.

# Common Mistakes

- **Rewriting a type you could derive.** If it's "`User` but optional" or "`User` without email," use `Partial`/`Omit` so it stays in sync.
- **Forgetting `typeof` for functions/values.** `ReturnType<makeUser>` is wrong; it's `ReturnType<typeof makeUser>`.
- **Confusing `Exclude`/`Extract` (unions) with `Omit`/`Pick` (object keys).** The first pair filters union *members*; the second selects object *properties*.
- **Assuming `Readonly`/`Partial` are deep.** They apply one level; nested objects aren't affected.

# Best Practices

- **Derive** related types with utilities rather than duplicating shapes.
- Use **`Record<Union, T>`** to force complete maps over a fixed set of keys.
- Reach for **`ReturnType`/`Parameters`/`Awaited`** to keep types tied to functions and promises.
- Remember the object/union split: **`Pick`/`Omit`** for properties, **`Extract`/`Exclude`** for union members.

# Summary

- Utility types are built-in generics that **transform** other types and keep derived types in sync.
- `Partial`/`Required`/`Readonly` change property modifiers; `Pick`/`Omit` select/drop properties; `Record` builds key→value maps.
- `Exclude`/`Extract`/`NonNullable` filter **unions**.
- `ReturnType`/`Parameters`/`Awaited` extract types from functions and promises (use `typeof` for a function value).

# Flash Cards

Q: What does `Partial<T>` produce?
A: The same type with every property made optional.

Q: What's the difference between `Pick`/`Omit` and `Extract`/`Exclude`?
A: `Pick`/`Omit` select or drop object *properties*; `Extract`/`Exclude` keep or remove members of a *union*.

Q: How do you build an object type with one `boolean` per role in `'admin' | 'editor'`?
A: `Record<'admin' | 'editor', boolean>` — and the compiler requires an entry for each key.

Q: Why is it `ReturnType<typeof makeUser>` and not `ReturnType<makeUser>`?
A: `ReturnType` needs the function's *type*; `typeof makeUser` gives you that type from the function value.

Q: What does `Awaited<Promise<string>>` resolve to?
A: `string` — `Awaited` unwraps the value a promise resolves to (including nested promises).

Q: Are `Partial` and `Readonly` deep?
A: No — they apply to the top level only; nested objects are unaffected.

# Exercises

### Easy
Given `interface Product { id: number; name: string; price: number }`, create `type ProductPreview = Pick<Product, 'id' | 'name'>` and a value of that type.

### Medium
Write an `updateProduct(id: number, changes: Partial<Omit<Product, 'id'>>)` function signature and call it with a partial update. Explain why `id` can't be among the changeable fields.

### Challenging
Given `async function search(q: string): Promise<Product[]>`, derive `type SearchResult = Awaited<ReturnType<typeof search>>` and `type SearchArgs = Parameters<typeof search>`. Explain what each equals and why deriving beats restating.

# Further Reading

- [Handbook — Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Handbook — `Record`, `Pick`, `Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#picktype-keys)
- [Handbook — `ReturnType`, `Parameters`, `Awaited`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)
