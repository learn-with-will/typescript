---
id: lesson-07
slug: type-aliases-arrays-and-tuples
title: "Type Aliases, Arrays, and Tuples"
level: beginner
order: 7
duration: 24
tags:
  - type-alias
  - interface
  - arrays
  - tuples
  - readonly
---

# Learning Objectives

By the end of this lesson you will be able to:

- Name any type with a **type alias**.
- Choose between a `type` alias and an `interface`.
- Type arrays and read-only arrays.
- Use **tuples** for fixed-length, position-typed data.
- Add named members and `readonly` to tuples.

# Why It Matters

You've met interfaces for object shapes. But plenty of useful types aren't objects — a union, a tuple, a function type. **Type aliases** let you name *any* of those and reuse them. And tuples give you a precise type for small fixed-size groupings — coordinates, key/value pairs, a function returning "a value and a setter" — that a plain array can't express.

# Concept Explanation

### Type aliases

A **type alias** gives a name to any type with the `type` keyword:

```typescript
type ID = string | number;
type Point = { x: number; y: number };
type Transformer = (input: string) => string;
```

Now `ID`, `Point`, and `Transformer` can be used anywhere a type is expected, exactly like the thing they name. Aliases don't create new types — they're just names — so `ID` and `string | number` are interchangeable.

### `type` vs `interface`

Both can describe object shapes, and for that purpose they're mostly interchangeable. The differences that matter:

- **Type aliases can name *any* type** — unions, tuples, primitives, function types, and the advanced computed types later in the course. Interfaces only describe object-like shapes.
- **Interfaces support declaration merging** — declaring the same interface twice combines them. Type aliases do not merge; a duplicate name is an error. (Merging is covered in an advanced lesson.)
- **Extending**: interfaces use `extends`; type aliases compose with an **intersection** (`&`):

```typescript
interface Animal { name: string; }
interface Dog extends Animal { breed: string; }

type Animal2 = { name: string };
type Dog2 = Animal2 & { breed: string };
```

A practical rule: **use `interface` for object shapes you might extend or that model a public API; use `type` when you need a union, tuple, function type, or any non-object type.** Either is fine for simple objects — pick one and be consistent.

### Arrays

An array of one element type is `T[]` or `Array<T>`:

```typescript
const scores: number[] = [10, 20, 30];
const names: Array<string> = ['Ada', 'Alan'];
```

A **read-only array** cannot be mutated (no `push`, no index assignment). Write it as `readonly T[]` or `ReadonlyArray<T>`:

```typescript
const frozen: readonly number[] = [1, 2, 3];
frozen.push(4);
// Error: Property 'push' does not exist on type 'readonly number[]'.
```

### Tuples

A **tuple** is an array with a **fixed length** and a **known type at each position**:

```typescript
type Coordinate = [number, number];

const origin: Coordinate = [0, 0];
const x = origin[0]; // number
// const bad: Coordinate = [0]; // Error: needs exactly two numbers
```

Tuples are perfect for small ordered groupings. A famous example is the shape returned by React's `useState` — a value and its setter — typed as a tuple.

### Named tuple members

You can label tuple positions for readability (the labels are documentation; they don't change the type):

```typescript
type Range = [start: number, end: number];

function contains(range: Range, value: number): boolean {
  return value >= range[0] && value <= range[1];
}
```

### readonly tuples

Prefix with `readonly` to forbid mutation:

```typescript
type RGB = readonly [number, number, number];
const red: RGB = [255, 0, 0];
// red[0] = 0; // Error: Cannot assign to '0' because it is read-only.
```

Tuples also support optional elements (`[number, number?]`) and a rest element (`[string, ...number[]]`), useful for typing argument lists — but the fixed-position form above covers most everyday needs.

# Key Terminology

- **Type alias** — a name for any type, declared with `type`.
- **Intersection (`&`)** — a type combining all members of several types.
- **Declaration merging** — combining multiple declarations of the same interface (aliases can't).
- **Read-only array** — `readonly T[]`, an array that can't be mutated.
- **Tuple** — an array with a fixed length and a type per position.
- **Named tuple member** — a labeled tuple position, e.g. `[start: number, end: number]`.

# Syntax and Options

| Feature | Syntax | Notes |
| ------- | ------ | ----- |
| Type alias | `type ID = string \| number` | Names any type |
| Object alias | `type P = { x: number }` | Like a simple interface |
| Intersection | `A & B` | Combine types |
| Array | `number[]` / `Array<number>` | Same meaning |
| Read-only array | `readonly number[]` | No mutation |
| Tuple | `[number, number]` | Fixed length + positions |
| Named tuple | `[x: number, y: number]` | Labels for readability |
| Read-only tuple | `readonly [number, number]` | No mutation |

# Hands-On Walkthrough

Combine aliases, an array, and a tuple:

```typescript
type Priority = 'low' | 'high';
type Task = { title: string; priority: Priority };
type Labeled = [id: number, task: Task];

const tasks: Labeled[] = [
  [1, { title: 'Write lesson', priority: 'high' }],
  [2, { title: 'Take a break', priority: 'low' }],
];

function titles(list: readonly Labeled[]): string[] {
  return list.map(([, task]) => task.title);
}

console.log(titles(tasks)); // ["Write lesson", "Take a break"]
```

Notice `readonly Labeled[]` documents that `titles` won't mutate the array, and the tuple destructuring `([, task]) => …` skips the id.

# Real World Analogy

A **type alias** is a nickname: "call `string | number` an `ID`." It doesn't create a new person, just an easier name. A **tuple** is an **egg carton with fixed slots** — position 0 is always the id, position 1 always the task, and the carton holds exactly that many. A plain array is a **loose bag** where anything can go anywhere; a tuple fixes what belongs in each slot.

# Examples

## Example 1 — Basic: alias a union

```typescript
type Id = string | number;

function key(id: Id): string {
  return `key:${id}`;
}
```

**Why this works:** `Id` names the union so you write it once and reuse it. The alias is interchangeable with `string | number`, so `key` accepts either.

## Example 2 — Real-world: a tuple return value

```typescript
function useCounter(initial: number): [number, () => number] {
  let count = initial;
  const increment = () => (count += 1);
  return [count, increment];
}

const [value, inc] = useCounter(0);
```

**Why this works:** the function returns a *pair* — a value and a function — with different types at each position, which is exactly a tuple `[number, () => number]`. Destructuring gives each element its correct type.

## Example 3 — Best practice / edge case: readonly to prevent accidental mutation

```typescript
type Matrix = readonly (readonly number[])[];

function firstRow(m: Matrix): readonly number[] {
  return m[0];
}
// firstRow(...)[0] = 9; // Error: index is read-only
```

**Why this works:** marking both the outer and inner arrays `readonly` communicates and enforces that the matrix is not modified. Callers get compile-time protection against accidental writes.

# Common Mistakes

- **Thinking a tuple is just an array.** A tuple fixes both length and per-position types; `number[]` fixes neither.
- **Expecting a type alias to merge like an interface.** Declaring the same alias twice is an error; only interfaces merge.
- **Assuming `readonly` deep-freezes.** `readonly number[]` protects the array itself, but `readonly` isn't automatically deep — nested arrays/objects need their own `readonly`.
- **Reaching for `interface` when you need a union.** Interfaces can't be unions; use a `type` alias.

# Best Practices

- Use **`interface`** for object shapes (especially extensible/public ones); use **`type`** for unions, tuples, function types, and computed types.
- Name reused unions and tuples with **aliases** for readability.
- Prefer **`readonly` arrays/tuples** for data you don't intend to mutate.
- Add **named tuple members** when position meaning isn't obvious.

# Summary

- A **type alias** names any type (`type`), including unions, tuples, and function types.
- **`type` vs `interface`**: interfaces are object-shaped and merge; aliases name anything and don't merge. Extend with `extends` (interface) or `&` (alias).
- Arrays are `T[]`/`Array<T>`; **read-only** arrays are `readonly T[]`.
- **Tuples** fix length and per-position types; support **named members** and **`readonly`**.

# Flash Cards

Q: What can a type alias name that an interface cannot?
A: Any non-object type — unions, tuples, primitives, and function types (plus advanced computed types).

Q: Which of `type` and `interface` supports declaration merging?
A: `interface` — declaring the same interface twice merges them; type aliases can't be declared twice.

Q: How do you compose types with a `type` alias, since it has no `extends`?
A: With an intersection: `type C = A & B`.

Q: How is a tuple different from an array like `number[]`?
A: A tuple has a fixed length and a specific type at each position; `number[]` has neither.

Q: How do you make an array that cannot be mutated?
A: Type it as `readonly T[]` (or `ReadonlyArray<T>`).

Q: What does a named tuple member like `[start: number, end: number]` change about the type?
A: Nothing about the type — the labels are documentation for readability only.

# Exercises

### Easy
Create a type alias `Pair = [string, number]` and a `const` of that type. Try assigning a one-element array and read the error.

### Medium
Write `type Result = { ok: true; value: number } | { ok: false; error: string }` and a function that returns one or the other. (You're combining aliases and unions — a preview of discriminated unions.)

### Challenging
Type a function `swap<...>` — for now, write `swap(pair: [string, number]): [number, string]` that returns the tuple reversed, and explain why the return type differs from the input type position-by-position.

# Further Reading

- [Handbook — Type Aliases](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)
- [Handbook — Tuple Types](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types)
- [Handbook — `readonly` Arrays and Tuples](https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type)
