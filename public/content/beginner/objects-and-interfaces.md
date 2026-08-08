---
id: lesson-05
slug: objects-and-interfaces
title: "Objects and Interfaces"
level: beginner
order: 5
duration: 26
tags:
  - objects
  - interface
  - readonly
  - optional
  - index-signatures
---

# Learning Objectives

By the end of this lesson you will be able to:

- Describe the shape of an object with an inline object type.
- Define and reuse a shape with an `interface`.
- Mark properties **optional** and **readonly**.
- Allow open-ended keys with an **index signature**.
- Explain **excess property checks** on object literals.
- Extend one interface from another.

# Why It Matters

Most real data is objects: a user, a request, a configuration. Describing those shapes precisely is where TypeScript pays off most — the compiler then guarantees you read properties that exist, of the type you expect. Interfaces are the everyday tool for naming and reusing those shapes across your codebase.

# Concept Explanation

### Object types

You can type an object inline by listing its properties and their types:

```typescript
function printUser(user: { name: string; age: number }): void {
  console.log(`${user.name}, ${user.age}`);
}
```

That works, but repeating the shape everywhere is tedious. Give it a name.

### Interfaces

An **interface** names an object shape so you can reuse it:

```typescript
interface User {
  name: string;
  age: number;
}

function printUser(user: User): void {
  console.log(`${user.name}, ${user.age}`);
}

const ada: User = { name: 'Ada', age: 36 };
```

Thanks to **structural typing**, any object with a `name: string` and an `age: number` is a `User` — it doesn't need to be declared as one.

### Optional properties

Mark a property with `?` when it may be absent. Its type then includes `undefined`:

```typescript
interface User {
  name: string;
  age: number;
  email?: string; // optional
}

const u: User = { name: 'Ada', age: 36 }; // OK — email omitted
```

Reading `u.email` gives `string | undefined`, so you must handle the missing case.

### readonly properties

`readonly` allows reading a property but forbids reassigning it after creation:

```typescript
interface Point {
  readonly x: number;
  readonly y: number;
}

const p: Point = { x: 1, y: 2 };
p.x = 5;
// Error: Cannot assign to 'x' because it is a read-only property.
```

`readonly` is a **compile-time** guard — like all types, it's erased at runtime and does not freeze the object.

### Index signatures

When you don't know the property names in advance but know their value type, use an **index signature**:

```typescript
interface ScoreBoard {
  [player: string]: number;
}

const scores: ScoreBoard = { ada: 10, alan: 8 };
scores.grace = 12; // OK — any string key, number value
```

### Excess property checks

When you assign an **object literal** directly, TypeScript does an extra check: it rejects properties the target type doesn't declare. This catches typos:

```typescript
interface Options {
  debug?: boolean;
}

const opts: Options = { debag: true };
// Error: Object literal may only specify known properties,
// and 'debag' does not exist in type 'Options'.
```

Note this stricter check applies to *fresh object literals*. If you assign through a variable first, only regular structural compatibility applies:

```typescript
const raw = { debag: true };
const opts2: Options = raw; // no excess-property error (raw is not a fresh literal)
```

### Extending interfaces

An interface can build on others with `extends`:

```typescript
interface Animal {
  name: string;
}

interface Dog extends Animal {
  breed: string;
}

const d: Dog = { name: 'Rex', breed: 'Corgi' };
```

# Key Terminology

- **Object type** — a type describing an object's properties, e.g. `{ x: number }`.
- **Interface** — a named, reusable object shape.
- **Optional property** — a property marked `?` that may be omitted.
- **`readonly` property** — a property that cannot be reassigned after creation.
- **Index signature** — `[key: string]: T`, allowing any key of that value type.
- **Excess property check** — the extra check that rejects unknown properties on a fresh object literal.
- **`extends`** — inherits properties from another interface.

# Syntax and Options

| Feature | Syntax | Meaning |
| ------- | ------ | ------- |
| Property | `name: string` | Required property |
| Optional | `email?: string` | May be omitted |
| Readonly | `readonly id: number` | Cannot be reassigned |
| Index signature | `[key: string]: number` | Any string key → number |
| Extend | `interface B extends A` | Inherit A's members |

# Hands-On Walkthrough

Model a small blog post and use it:

```typescript
interface Post {
  readonly id: number;
  title: string;
  tags: string[];
  summary?: string;
}

function preview(post: Post): string {
  const summary = post.summary ?? 'No summary';
  return `#${post.id} ${post.title} — ${summary} [${post.tags.join(', ')}]`;
}

const post: Post = {
  id: 1,
  title: 'Hello TypeScript',
  tags: ['intro', 'types'],
};

console.log(preview(post));
// "#1 Hello TypeScript — No summary [intro, types]"
```

Try to change the id and read the error:

```typescript
post.id = 2;
// Error: Cannot assign to 'id' because it is a read-only property.
```

And try a typo in a fresh literal:

```typescript
const bad: Post = { id: 2, titel: 'Oops', tags: [] };
// Error: 'titel' does not exist in type 'Post'. Did you mean 'title'?
```

# Real World Analogy

An interface is a **form template**. It lists the fields (properties), which are required, which are optional, and which are pre-printed and can't be changed (readonly). Anyone who fills in a form matching the template is accepted — regardless of what they call the paper — which is exactly structural typing. Writing in a field that isn't on the form (a typo) gets the form rejected: the excess property check.

# Examples

## Example 1 — Basic: optional property handled safely

```typescript
interface Config {
  retries?: number;
}

function getRetries(config: Config): number {
  return config.retries ?? 3;
}

getRetries({});            // 3
getRetries({ retries: 5 }); // 5
```

**Why this works:** `retries?` makes the property `number | undefined`, so `getRetries` must supply a fallback. `??` provides the default when the value is missing.

## Example 2 — Real-world: an index signature for a lookup

```typescript
interface Headers {
  [name: string]: string;
}

function getContentType(headers: Headers): string | undefined {
  return headers['content-type'];
}

getContentType({ 'content-type': 'application/json', 'x-id': 'abc' });
```

**Why this works:** HTTP headers have arbitrary names but string values, which is exactly what an index signature describes. Note the lookup returns `string` per the signature — in stricter setups you'd model possibly-missing keys, but this shows the core idea.

## Example 3 — Best practice / edge case: extend rather than repeat

```typescript
interface Timestamped {
  readonly createdAt: string;
}

interface Comment extends Timestamped {
  author: string;
  body: string;
}

const c: Comment = {
  author: 'Ada',
  body: 'Nice post',
  createdAt: '2026-08-08',
};
```

**Why this works:** shared fields (`createdAt`) live in a base interface and are inherited via `extends`. This keeps related shapes consistent and avoids copy-pasting properties across many interfaces.

# Common Mistakes

- **Expecting `readonly` to freeze the object at runtime.** It's a compile-time rule only; the object is a normal mutable JavaScript object at runtime.
- **Being surprised by excess property checks.** They apply to fresh object literals. Assigning through a variable skips the check.
- **Forgetting an optional property can be `undefined`.** Always handle the missing case when you read a `?` property.
- **Overusing index signatures.** If you know the keys, list them — you get better checking than `[key: string]: T`.

# Best Practices

- Name shapes with **interfaces** and reuse them; don't repeat inline object types.
- Use **`readonly`** for identifiers and values that shouldn't change after creation.
- Prefer **explicit properties** over an index signature whenever you know the keys.
- Compose shapes with **`extends`** to keep related types consistent.

# Summary

- Object types describe an object's properties; **interfaces** name and reuse a shape.
- **`?`** marks optional properties (type includes `undefined`); **`readonly`** forbids reassignment.
- **Index signatures** (`[key: string]: T`) allow open-ended keys of a known value type.
- **Excess property checks** reject unknown properties on fresh object literals — catching typos.
- Interfaces compose with **`extends`**.

# Flash Cards

Q: What does structural typing mean for interfaces?
A: Any object with the required properties matches the interface — it doesn't need to be explicitly declared as that type.

Q: What is the type of an optional property `email?: string` when you read it?
A: `string | undefined` — you must handle the missing case.

Q: Does `readonly` freeze an object at runtime?
A: No — it's a compile-time check that forbids reassignment; the runtime object is a normal mutable object.

Q: When do excess property checks apply?
A: When you assign a fresh object literal directly to a typed target; assigning through a variable first skips the check.

Q: How do you allow arbitrary string keys with number values?
A: An index signature: `[key: string]: number`.

Q: How do you share properties between two interfaces?
A: Use `extends`, e.g. `interface Dog extends Animal { … }`.

# Exercises

### Easy
Define an interface `Book` with `title: string`, `author: string`, and an optional `year?: number`. Create one book with a year and one without.

### Medium
Add a `readonly isbn: string` to `Book`, create a book, and try to reassign `isbn`. Read the error, then explain why the runtime object is still mutable.

### Challenging
Create a base interface `Entity { readonly id: number }` and two interfaces `User` and `Product` that extend it. Write a function `describe(entity: Entity): string` that works for both and returns `#<id>`.

# Further Reading

- [Handbook — Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- [Handbook — Interfaces vs. Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces)
- [Handbook — Excess Property Checks](https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks)
