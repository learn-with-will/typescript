---
id: lesson-10
slug: classes
title: "Classes"
level: intermediate
order: 10
duration: 30
tags:
  - classes
  - access-modifiers
  - abstract
  - implements
  - parameter-properties
---

# Learning Objectives

By the end of this lesson you will be able to:

- Declare typed class fields and methods.
- Use the `public`, `private`, and `protected` access modifiers.
- Shorten constructors with **parameter properties**.
- Distinguish TypeScript's `private` from JavaScript's `#private`.
- Write `abstract` classes and `implements` an interface.

# Why It Matters

Classes bundle data and behavior, and TypeScript adds a type layer that makes them safer: fields have types, access modifiers hide internals, and `implements` guarantees a class matches a contract. Unlike most of what you've learned, classes are one of the constructs that **emit real runtime code** — so understanding which parts are compile-time (like `private`) and which are runtime (like `#private`) matters.

# Concept Explanation

### Typed fields and methods

Declare fields with types; methods look like typed functions:

```typescript
class Counter {
  count: number = 0;

  increment(by: number = 1): void {
    this.count += by;
  }
}

const c = new Counter();
c.increment();
console.log(c.count); // 1
```

Under `strict`, **`strictPropertyInitialization`** requires that every field is either initialized where declared or assigned in the constructor — otherwise the compiler warns that it might be `undefined`.

### Access modifiers

TypeScript adds three visibility modifiers:

- **`public`** (default) — accessible everywhere.
- **`private`** — accessible only within the same class.
- **`protected`** — accessible within the class and its subclasses.

```typescript
class Account {
  public owner: string;
  protected balance: number;
  private pin: string;

  constructor(owner: string, balance: number, pin: string) {
    this.owner = owner;
    this.balance = balance;
    this.pin = pin;
  }
}
```

These modifiers are **compile-time only** — they're erased, so at runtime a `private` field is still a normal, accessible property. They prevent *your code* from touching internals, not a determined runtime hacker.

### Parameter properties

Assigning constructor arguments to fields is so common that TypeScript offers a shorthand: put a modifier on a constructor parameter and it becomes a field automatically:

```typescript
class Account {
  constructor(
    public owner: string,
    protected balance: number,
    private pin: string,
  ) {}
}
```

This is equivalent to the longer version above — the fields are declared and assigned for you.

### `readonly` fields

`readonly` allows assignment only in the declaration or constructor:

```typescript
class User {
  constructor(public readonly id: number, public name: string) {}
}

const u = new User(1, 'Ada');
u.name = 'Ada L.'; // OK
u.id = 2;          // Error: Cannot assign to 'id' — it is read-only.
```

### TypeScript `private` vs JavaScript `#private`

JavaScript has its *own* private fields, written with a `#` prefix. These are **truly private at runtime** — inaccessible outside the class even by other code at runtime:

```typescript
class Secret {
  #value: string;               // real runtime private
  constructor(value: string) { this.#value = value; }
  reveal(): string { return this.#value; }
}
```

Rule of thumb: TypeScript's `private` is a compile-time convenience that also reads cleanly; JavaScript's `#` gives real runtime privacy. Use `#` when runtime enforcement matters.

### `static` members

`static` members belong to the class itself, not to instances:

```typescript
class MathUtil {
  static readonly PI = 3.14159;
  static square(n: number): number { return n * n; }
}

MathUtil.square(4);  // 16
MathUtil.PI;         // 3.14159
```

### Getters and setters

Accessors let a property run code on read/write while still looking like a field:

```typescript
class Temperature {
  #celsius = 0;
  get celsius(): number { return this.#celsius; }
  set celsius(value: number) { this.#celsius = value; }
  get fahrenheit(): number { return this.#celsius * 1.8 + 32; }
}
```

### `abstract` classes

An **abstract** class can't be instantiated directly; it's a base that defines some behavior and leaves `abstract` members for subclasses to implement:

```typescript
abstract class Shape {
  abstract area(): number;         // subclasses must implement
  describe(): string {             // shared behavior
    return `Area is ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }
  area(): number { return Math.PI * this.radius ** 2; }
}

// new Shape(); // Error: Cannot create an instance of an abstract class.
```

### `implements` an interface

`implements` checks that a class provides everything an interface requires — a contract, verified by the compiler:

```typescript
interface Serializable {
  serialize(): string;
}

class Config implements Serializable {
  constructor(private data: Record<string, string>) {}
  serialize(): string { return JSON.stringify(this.data); }
}
```

`implements` only checks the shape; it doesn't inherit any code (that's `extends`).

# Key Terminology

- **Access modifier** — `public`/`private`/`protected`, controlling visibility (compile-time).
- **Parameter property** — a constructor parameter with a modifier, becoming a field.
- **`readonly` field** — assignable only in declaration/constructor.
- **`#private` field** — JavaScript's truly-runtime-private field.
- **`static` member** — belongs to the class, not instances.
- **`abstract` class** — a non-instantiable base with members subclasses must implement.
- **`implements`** — a compile-time check that a class satisfies an interface.

# Syntax and Options

| Feature | Syntax | Enforced at |
| ------- | ------ | ----------- |
| Field | `count: number = 0` | — |
| `private` | `private pin: string` | Compile time (erased) |
| `#private` | `#value: string` | Runtime |
| Parameter property | `constructor(public x: number)` | — |
| `readonly` | `readonly id: number` | Compile time |
| `static` | `static square(n)` | — |
| `abstract` | `abstract area(): number` | Compile time |
| `implements` | `class C implements I` | Compile time |

# Hands-On Walkthrough

Model a bank account with encapsulated balance:

```typescript
class BankAccount {
  #balance: number;

  constructor(public readonly owner: string, opening: number) {
    this.#balance = opening;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.#balance += amount;
  }

  get balance(): number {
    return this.#balance;
  }
}

const acct = new BankAccount('Ada', 100);
acct.deposit(50);
console.log(acct.balance); // 150
// acct.#balance = 0;      // Error: private field, inaccessible
// acct.owner = 'Bob';     // Error: readonly
```

The balance is truly private (`#balance`), reads go through a getter, and the owner can't be reassigned.

# Real World Analogy

A class is a **blueprint for a machine**. Public members are the buttons and dials anyone can use; `private`/`#private` members are the sealed internal wiring. A parameter property is a factory that installs a part the moment the machine is built. An `abstract` class is a **partial blueprint** — "every vehicle must define how it accelerates" — that can't be built until a specific model fills in the blanks.

# Examples

## Example 1 — Basic: parameter properties

```typescript
class Point {
  constructor(public x: number, public y: number) {}
  distanceToOrigin(): number {
    return Math.hypot(this.x, this.y);
  }
}

new Point(3, 4).distanceToOrigin(); // 5
```

**Why this works:** the `public` modifiers on the constructor parameters declare and assign `x` and `y` in one step, so there's no separate field declaration or `this.x = x` boilerplate.

## Example 2 — Real-world: interface contract with `implements`

```typescript
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  constructor(private prefix: string) {}
  log(message: string): void {
    console.log(`[${this.prefix}] ${message}`);
  }
}
```

**Why this works:** `implements Logger` makes the compiler verify `ConsoleLogger` has a matching `log` method. If you renamed it to `write`, you'd get an error — the contract is enforced.

## Example 3 — Best practice / edge case: abstract base with shared behavior

```typescript
abstract class Repository<T> {
  protected items: T[] = [];
  abstract validate(item: T): boolean;

  add(item: T): void {
    if (this.validate(item)) this.items.push(item);
  }
}

class NumberRepo extends Repository<number> {
  validate(item: number): boolean {
    return item >= 0;
  }
}
```

**Why this works:** `Repository` provides shared `add` logic while delegating the rule that varies (`validate`) to subclasses via an `abstract` method. Combining abstract classes with generics is a common, powerful pattern.

# Common Mistakes

- **Expecting `private` to hide data at runtime.** It's compile-time only and is erased; use `#private` for real privacy.
- **Uninitialized fields under strict.** `strictPropertyInitialization` flags fields that aren't set in the declaration or constructor.
- **Confusing `implements` with `extends`.** `implements` checks a shape but inherits no code; `extends` inherits implementation.
- **Trying to instantiate an abstract class.** You must subclass it and implement its abstract members.

# Best Practices

- Use **parameter properties** to cut constructor boilerplate.
- Reach for **`#private`** when privacy must hold at runtime; `private` when a compile-time convention is enough.
- Mark identity fields **`readonly`**.
- Use **`implements`** to hold a class to an interface contract, and **`abstract`** classes to share behavior across a family of subclasses.

# Summary

- Class fields and methods are typed; under `strict`, fields must be initialized.
- **Access modifiers** (`public`/`private`/`protected`) are compile-time; **`#private`** is runtime-private.
- **Parameter properties** declare and assign fields from constructor arguments.
- **`static`** members belong to the class; **`abstract`** classes can't be instantiated.
- **`implements`** checks a class against an interface without inheriting code.

# Flash Cards

Q: What is the difference between TypeScript's `private` and JavaScript's `#private`?
A: `private` is a compile-time check that's erased at runtime; `#private` is truly private at runtime.

Q: What does a parameter property do?
A: A constructor parameter marked with `public`/`private`/`protected`/`readonly` becomes a class field, declared and assigned automatically.

Q: Why might a class field cause an error under `strict` even with a type?
A: `strictPropertyInitialization` requires the field be initialized in its declaration or the constructor; otherwise it could be `undefined`.

Q: How does `implements` differ from `extends`?
A: `implements` checks that a class satisfies an interface's shape but inherits no code; `extends` inherits implementation from a base class.

Q: Can you create an instance of an `abstract` class?
A: No — you must subclass it and implement its abstract members; the abstract class itself can't be instantiated.

Q: Where do `static` members live?
A: On the class itself, not on instances — e.g. `MathUtil.square(4)`.

# Exercises

### Easy
Write a `class Timer` with a `private #seconds = 0`, a `tick()` method that increments it, and a `get elapsed()` accessor. Try to read `#seconds` from outside and read the error.

### Medium
Rewrite a class that assigns three constructor arguments to fields using **parameter properties**, marking the id `readonly`.

### Challenging
Define `interface Shape { area(): number }` and an `abstract class BaseShape implements Shape` that provides a `describe()` using `area()` but leaves `area()` abstract. Implement `Rectangle` and `Circle` subclasses.

# Further Reading

- [Handbook — Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- [Handbook — Member Visibility](https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility)
- [Handbook — Parameter Properties](https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties)
- [MDN — Private class features (`#`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties)
